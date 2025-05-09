"use client";

import { useParams } from "next/navigation";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { WhatsAppPreview } from "./WhatsAppPreview";
import { MenuBar } from "./tiptap-editor/TipTap";
import { useCustomMensagem } from "../hooks/useCustomMensagem";
import { convertHtmlToVariablesString, renderWithVariables, convertVariablesToHtml } from "@/lib/utils/variableConverter";
import { Variable } from "./variables/Variables";

const extensions = [
  StarterKit,
  Underline,
  TextStyle,
  ListItem,
  Variable.configure({
    variableValues: {
      nome: "João Silva",
      link: "https://example.com/monitorFila",
    },
  }),
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
];

const variables = [
  { label: "Nome", value: "nome" },
  { label: "Link", value: "link" },
];

function RichTextBlock({
  value,
  onChange,
  variables,
  editorIndex,
}: {
  value: string;
  onChange: (value: string) => void;
  variables: { label: string; value: string }[];
  editorIndex: number;
}) {
  const editor = useEditor({
    extensions,
    content: convertVariablesToHtml(value),
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const converted = convertHtmlToVariablesString(html);
      onChange(converted);
    },
  });

  useEffect(() => {
    if (editor && value !== convertHtmlToVariablesString(editor.getHTML())) {
      editor.commands.setContent(convertVariablesToHtml(value));
    }
  }, [value, editor]);

  const filteredVariables = editorIndex === 0
    ? variables
    : variables.filter((v) => v.value !== "link");

  return (
    <div className="border p-1 border-purple-300 rounded-md bg-white shadow-sm mb-6">
      {editor && (
        <>
          <MenuBar editor={editor} />
          <EditorContent
            editor={editor}
            className="w-full min-h-[80px] bg-white px-4 py-3 rounded-md [&_.ProseMirror]:outline-none [&_.ProseMirror]:border-none [&_.ProseMirror]:shadow-none"
          />
          <div className="flex flex-wrap pt-3 gap-2 mt-2 justify-start p-1">
            {filteredVariables.map((v) => (
              <button
                key={v.label}
                onClick={() => editor?.commands.insertVariable(v.value)}
                className="px-3 py-1 text-sm border cursor-pointer text-purple-800 border-gray-500 bg-white hover:bg-purple-100 rounded"
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

export function RichEditor() {
  const params = useParams();
  const empresaId = params.empresaId as string;
  const filaId = params.filaId as string;

  const {
    isSmallScreen,
    showPreviewModal,
    setShowPreviewModal,
    loading,
    previews,
    setPreviews,
    updatePreview,
    variablesMap,
    sectionTitles,
    saveMessages,
    isValidFila,
  } = useCustomMensagem(empresaId, filaId);

  if (!empresaId || !filaId) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Parâmetros inválidos na URL.
      </div>
    );
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Carregando...</div>;
  }

  if (!isValidFila) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Fila inválida ou não encontrada.
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col lg:flex-row gap-90 mt-10">
      <div className="w-full max-w-[850px] space-y-6">
        {previews.map((text: string, idx: number) => (
          <div key={idx}>
            <h2 className="font-bold text-black text-lg mb-1">{sectionTitles[idx]}</h2>
            <RichTextBlock
              value={text}
              onChange={(converted) => {
                const updated = [...previews];
                updated[idx] = converted;
                setPreviews(updated);
                updatePreview(idx, converted);
              }}
              variables={variables}
              editorIndex={idx}
            />
          </div>
        ))}
        <div className="flex justify-between pt-2">
          <Button
            onClick={saveMessages}
            className="max-w-[150px] bg-blue-400 text-white hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Carregando..." : "Salvar"}
          </Button>
        </div>
        {isSmallScreen && (
          <div className="flex justify-center">
            <Dialog open={showPreviewModal} onOpenChange={setShowPreviewModal}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="max-w-[200px] bg-white text-black hover:bg-gray-200"
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
                    <VisuallyHidden>Fechar modal</VisuallyHidden>
                  </Button>
                </DialogHeader>
                <div className="flex-1 overflow-auto flex items-center justify-center p-4">
                  <WhatsAppPreview
                    previews={previews}
                    renderWithVariables={renderWithVariables}
                    variablesMap={variablesMap}
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>

      {!isSmallScreen && (
        <div className="flex items-start justify-center mt-6 lg:mt-0">
          <WhatsAppPreview
            previews={previews}
            renderWithVariables={renderWithVariables}
            variablesMap={variablesMap}
          />
        </div>
      )}
    </div>
  );
}