"use client";

import {
  EditorContent,
  useEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import MenuBar from "./tiptap-editor/TipTap";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Variable from "./variables/Variables";
import { FaCamera, FaLaugh, FaMicrophone, FaPaperclip } from "react-icons/fa";
import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { atualizarConfiguracao } from "@/features/configuracoes/services/configuracoes";
import { toast } from "sonner";
import { useConfigPreview } from "@/lib/hooks/useConfigPreview"

const extensions = [
  StarterKit,
  Underline,
  TextStyle,
  ListItem,
  Variable,
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
];

// Conteúdo inicial dos editores
const initialContents = [
  "<p>Olá {nome}, seja bem vindo!</p>",
  "<p>Aqui está o link para você acompanhar seu status na fila: {link}</p>",
  "<p>Obrigado por comprar com a gente. <strong>Volte sempre!</strong></p>",
];

{/* Vai converter as variables */ }
function convertVariablesToHtml(html: string) {
  if (typeof window === 'undefined') return html

  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')

  doc.body.innerHTML = doc.body.innerHTML.replace(
    /\{(\w+)\}/g,
    (_, variableName) => {
      return `<span data-variable="${variableName}" data-value="${variableName}"></span>`
    }
  )

  return doc.body.innerHTML
}

function convertHtmlToVariablesString(html: string) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  doc.querySelectorAll('[data-variable]').forEach((el) => {
    const variable = el.getAttribute("data-variable");
    const textNode = document.createTextNode(`{${variable}}`);
    el.replaceWith(textNode);
  });

  return doc.body.innerHTML;
}


const variables = [
  { label: "{nome}", value: "João Silva" },
  { label: "{link}", value: "https://example.com/rastreio" },
];

//  passa editor como prop para o MenuBar
function RichTextBlock({
  value,
  onChange,
  variables,
}: {
  value: string;
  onChange: (html: string) => void;
  variables: { label: string; value: string }[];
}) {
  const editor = useEditor({
    extensions,
    content: convertVariablesToHtml(value),
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });


  return (
    <div className="border p-1 border-purple-300 rounded-md bg-white shadow-sm mb-6">
      {editor && (
        <>
          <MenuBar editor={editor} />
          <EditorContent
            editor={editor}
            className="w-full min-h-[80px] bg-white px-4 py-3 rounded-md [&_.ProseMirror]:outline-none [&_.ProseMirror]:border-none [&_.ProseMirror]:shadow-none"
          />
          {/* Footer de variáveis */}
          <div className="flex flex-wrap  pt-3 gap-2 mt-2 justify-start p-1 ">
            {variables.map((v) => (
              <button
                key={v.label}
                onClick={() => editor?.commands.insertVariable(v.label.replace(/[{}]/g, ''))}
                className="px-3 py-1 text-sm border cursor-pointer text-purple-800 border-purple-300 bg-white hover:bg-purple-100 rounded"
              >
                {v.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}



export default function RichEditor() {

  const isSmallScreen = useMediaQuery("(max-width: 1190px)");
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  // Atualiza o preview com o novo HTML do editor 
  const updatePreview = (index: number, newHtml: string) => {
    setPreviews((prev) => {
      const updated = [...prev];
      updated[index] = newHtml;
      return updated;
    });
  };

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Mapeia as variáveis para substituição
  const variablesMap = {
    nome: "João Silva",
    link: `<a href='https://example.com/cliente-fila' class='font-bold underline text-blue-600' target='_blank'>https://example.com/cliente-fila</a>`,
  };


  const empresaId = "2251881f-386b-402d-a1f2-e364706ef9c2";
  const {
    config,
    previews,
    setPreviews,
    loading,
    convertVariablesToHtml,
    convertHtmlToVariablesString,
    renderWithVariables,
  } = useConfigPreview(empresaId);
  

  const sectionTitles = ["Entrada", "Chamada", "Removido"];

  return (
    <div className="w-full flex flex-col lg:flex-row gap-90 mt-10">
      {/* Editors (lado esquerdo) */}
      <div className="w-full max-w-[850px] space-y-6">
        {/* Renderiza os 3 blocos de editor */}
        {!loading && previews.map((html, idx) => (
  <div key={idx}>
    <h2 className="font-bold text-black text-lg mb-1">{sectionTitles[idx]}</h2>
    <RichTextBlock
      value={html}
      onChange={(html) => {
        const updated = [...previews];
        updated[idx] = convertHtmlToVariablesString(html);
        setPreviews(updated);
      }}
      variables={variables}
    />
  </div>
))}
        <div className="flex justify-between pt-2">
          <Button
            onClick={async () => {
              if (!config) return;

              try {
                await atualizarConfiguracao({
                  ...config,
                  mensagemEntrada: convertHtmlToVariablesString(previews[0]),
                  mensagemChamada: convertHtmlToVariablesString(previews[1]),
                  mensagemRemovido: convertHtmlToVariablesString(previews[2]),
                  whatsappAtivo: config.whatsappAtivo ?? true,
                });
                toast.success("Mensagens salvas com sucesso!");
              } catch (err) {
                toast.error("Erro ao salvar mensagens.");
                console.error(err);
              }
            }}
            className="max-w-[150px] bg-blue-400 text-white hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Carregando..." : "Salvar"}
          </Button>

        </div>
        {/* Botão para visualizar preview em telas pequenas */}
        {isSmallScreen && (
          <div className="flex justify-center">
            <Dialog open={showPreviewModal} onOpenChange={setShowPreviewModal}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="max-w-[200px] bg-blue-400 text-white hover:bg-blue-600"
                >
                  Visualizar Preview
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[95vw] h-[95vh] p-0 overflow-hidden">
                <DialogHeader className="border-b p-4">
                  <DialogTitle className="text-xl font-bold">Preview do WhatsApp</DialogTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-4"
                    onClick={() => setShowPreviewModal(false)}
                  >
                    {/* <X className="h-5 w-5" /> */}
                    <VisuallyHidden>Fechar modal</VisuallyHidden>
                  </Button>
                </DialogHeader>
                {/* Conteúdo do modal - Mockup do WhatsApp */}
                <div className="flex-1 overflow-auto flex items-center justify-center p-4">
                  <div className="w-full max-w-[300px] h-[600px] rounded-[30px] overflow-hidden shadow-xl bg-[#ece5dd] flex flex-col border-[6px] border-black relative">
                    {/* Top bar */}
                    <div className="h-[50px] bg-[#075e54] text-white flex items-center px-3">
                      <div className="size-6 bg-gray-300 rounded-full mr-2"></div>
                      <div className="flex flex-col text-sm">
                        <span className="font-semibold">João Silva</span>
                      </div>
                      <div className="ml-auto flex space-x-2 text-white text-lg">
                        <span>⋮</span>
                      </div>
                    </div>

                    {/* Mensagens */}
                    <div className="p-3 flex-1 overflow-y-auto space-y-4 text-sm">
                      {/* Entrada */}
                      <div>
  <div className="relative max-w-[250px]">
    <div
      className="relative bg-[#dcf8c6] px-4 py-3 shadow text-sm leading-snug chat-bubble-right rounded-lg"
      dangerouslySetInnerHTML={{ __html: renderWithVariables(previews[0], variablesMap) }}
    />
  </div>
</div>

                      {/* Chamada */}
                      <div>
                        <div className="relative max-w-[250px]">
                          <div
                            className="relative bg-[#dcf8c6] px-4 py-3 shadow text-sm leading-snug chat-bubble-right rounded-lg"
                            dangerouslySetInnerHTML={{ __html: renderWithVariables(previews[1],variablesMap) }}
                          />
                        </div>
                      </div>

                      {/* Removido */}
                      <div>
                        <div className="relative max-w-[250px]">
                          <div
                            className="relative bg-[#dcf8c6] px-4 py-3 shadow text-sm leading-snug chat-bubble-right rounded-lg"
                            dangerouslySetInnerHTML={{ __html: renderWithVariables(previews[2],variablesMap) }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Campo de digitação */}
                    <div className="bg-[#e5ddd5] px-3 py-2">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center px-3 py-2 bg-white rounded-full shadow w-[210px]">
                          <FaLaugh className="text-gray-500 text-lg mr-3 flex-shrink-0" />
                          <input
                            placeholder="Mensagem"
                            className="flex-1 text-sm outline-none placeholder-gray-500 bg-transparent min-w-0"
                            disabled
                          />
                          <FaPaperclip className="text-gray-500 text-lg mx-2 flex-shrink-0" />
                          <FaCamera className="text-gray-500 text-lg flex-shrink-0" />
                        </div>
                        <button className="w-10 h-10 bg-[#075e54] rounded-full flex items-center justify-center text-white text-base shadow">
                          <FaMicrophone className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>


      {!isSmallScreen && (
        <div className="flex items-start justify-center mt-6 lg:mt-0">
          <div className="w-[300px] h-[600px] rounded-[30px] overflow-hidden shadow-xl bg-[#ece5dd] flex flex-col border-[6px] border-black relative">
            {/* Mockup do WhatsApp */}
            {/* Top bar */}
            <div className="h-[50px] bg-[#075e54] text-white flex items-center px-3">
              <div className="size-6 bg-gray-300 rounded-full mr-2" ></div>
              <div className="flex flex-col text-sm">
                <span className="font-semibold">João Silva</span>
              </div>
              <div className="ml-auto flex space-x-2 text-white text-lg">

                <span>⋮</span>
              </div>
            </div>

            {/* Mensagens */}
            <div className="p-3 flex-1 overflow-y-auto space-y-4 text-sm">
              {previews.map((html, idx) => (
                <div key={idx}>
                  <div className="relative max-w-[250px]">
                    <div
                      className="relative bg-[#dcf8c6] px-4 py-3 shadow text-sm leading-snug chat-bubble-right rounded-lg"
                      dangerouslySetInnerHTML={{
                        __html: hasMounted
                          ? renderWithVariables(convertVariablesToHtml(previews[idx]), variablesMap)
                          : "",
                      }}                    
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Campo de digitação */}
            <div className="bg-[#e5ddd5] px-3 py-2">
              <div className="flex items-center gap-2">

                {/* Campo de mensagem */}
                <div className="flex items-center px-3 py-2 bg-white rounded-full shadow w-[210px]">
                  <FaLaugh className="text-gray-500 text-lg mr-3 flex-shrink-0" />
                  <input
                    placeholder="Mensagem"
                    className="flex-1 text-sm outline-none placeholder-gray-500 bg-transparent min-w-0"
                    disabled
                  />
                  <FaPaperclip className="text-gray-500 text-lg mx-2 flex-shrink-0" />
                  <FaCamera className="text-gray-500 text-lg flex-shrink-0" />
                </div>

                <button className="w-10 h-10 bg-[#075e54] rounded-full flex items-center justify-center text-white text-base shadow">
                  <FaMicrophone className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ div>

  );
}


