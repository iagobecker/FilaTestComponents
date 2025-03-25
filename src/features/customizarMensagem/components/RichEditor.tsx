"use client";

import {
  EditorProvider,
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
import { useState } from "react";
import Variable from "./variables/Variables";

const extensions = [
  StarterKit,
  Underline,
  TextStyle,
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  ListItem,
  Variable,
];

const initialContents = [
  "<p>Olá {nome}, sua entrega está a caminho!</p>",
  "<p>Rastreamento: {link}</p>",
  "<p>Obrigado por comprar com a gente :)</p>",
];

const variables = [
  { label: "{nome}", value: "João Silva" },
  { label: "{link}", value: "https://example.com/rastreio" },
];

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
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const insertVariable = (value: string) => {
    editor?.chain().focus().insertContent(value).run();
  };

  return (
    <div className="border p-3 border-purple-300 rounded-md bg-white shadow-sm mb-6">
      {editor && (
        <>
          <MenuBar editor={editor} />
          <EditorContent
            editor={editor}
            className="w-full min-h-[100px] bg-white px-4 py-3 rounded-md [&_.ProseMirror]:outline-none [&_.ProseMirror]:border-none [&_.ProseMirror]:shadow-none"
          />
          {/* Footer de variáveis */}
          <div className="flex flex-wrap gap-2 mt-2 justify-end">
            {variables.map((v) => (
              <button
              onClick={() => editor?.commands.insertVariable("nome")}
              className="px-3 py-1 text-sm border cursor-pointer text-purple-800 border-purple-300 bg-purple-200 hover:bg-purple-100 rounded"
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
  const [previews, setPreviews] = useState(initialContents);

  const updatePreview = (index: number, newHtml: string) => {
    setPreviews((prev) => {
      const updated = [...prev];
      updated[index] = newHtml;
      return updated;
    });
  };

  const insertVariable = (index: number, value: string) => {
    alert(`Insira ${value} no editor ${index + 1}`);
  };

  return (
    <div className="w-full flex flex-col lg:flex-row gap-90 mt-10">
      {/* Left side - Editors */}
      <div className="w-full max-w-[850px]">
      {previews.map((html, idx) => (
        <RichTextBlock
          key={idx}
          value={html}
          onChange={(html) => updatePreview(idx, html)}
          variables={variables} 
        />
        ))}


        <div className="flex justify-between pt-2">
          <Button className="max-w-[150px] bg-blue-400 text-white hover:bg-blue-700">
            Salvar
          </Button>          
        </div>
      </div>

      <div className="flex items-center justify-center mt-6 lg:mt-0">
        <div className="w-[300px] h-[600px] rounded-2xl border-4 border-black overflow-hidden shadow-xl bg-[#e5ddd5] flex flex-col">
          <div className="h-[50px] bg-[#075e54] text-white text-center flex items-center justify-center text-sm font-semibold">
            WhatsApp Preview
          </div>
          <div className="p-4 flex-1 bg-[#ece5dd] overflow-y-auto space-y-3">
            {previews.map((html, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg px-3 py-2 shadow-md text-sm whitespace-pre-line leading-relaxed"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}



















// "use client";

// import { useRef } from "react";
// import { Editor } from "@tinymce/tinymce-react";

// export default function RichEditor() {
//   const editorRef = useRef<any>(null);

//   const logContent = () => {
//     if (editorRef.current) {
//       const content = editorRef.current.getContent();
//       alert(content);
//     }
//   };

//   return (
//     <div className="flex flex-col lg:flex-row gap-10 mt-10">
//       <div className="w-full max-w-[800px]">
//         <Editor
         
//           onInit={(_, editor) => (editorRef.current = editor)}
//           initialValue="<p>Digite aqui sua mensagem...</p>"
//           init={{
//             height: 500,
//             menubar: false,
//             plugins: [
//               "advlist",
//               "autolink",
//               "lists",
//               "link",
//               "charmap",
//               "preview",
//               "anchor",
//               "searchreplace",
//               "visualblocks",
//               "fullscreen",
//               "insertdatetime",
//               "media",
//               "table",
//               "help",
//               "wordcount",
//             ],
//             toolbar: "bold italic underline | undo redo",
//             placeholder: "Digite aqui sua mensagem...",
//             content_style:
//               "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
//           }}
//         />

//         <button
//           className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//           onClick={logContent}
//         >
//           Ver conteúdo em texto
//         </button>
//       </div>

//       {/* Preview (em branco por enquanto) */}
//       <div className="flex items-center justify-center mt-6 lg:mt-0">
//         <div className="w-[300px] h-[600px] rounded-2xl border-4 border-black overflow-hidden shadow-xl bg-[#e5ddd5] flex flex-col">
//           <div className="h-[50px] bg-[#075e54] text-white text-center flex items-center justify-center text-sm font-semibold">
//             WhatsApp Preview
//           </div>
//           <div className="p-4 flex-1 bg-[#ece5dd] overflow-y-auto">
//             <div className="bg-white rounded-lg px-3 py-2 shadow-md text-sm whitespace-pre-line leading-relaxed">
//               {/* você pode usar dangerouslySetInnerHTML aqui se quiser renderizar */}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




