"use client";

import { Editor } from "@tiptap/react";
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaUndo,
  FaRedo,
} from "react-icons/fa";

export default function MenuBar({ editor }: { editor: Editor }) {
  if (!editor) return null;

  return (
    <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
      <div className="flex gap-2">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 ${editor.isActive("bold") ? "bg-blue-400 rounded text-white" : "bg-white text-black"}`}
        >
          <FaBold />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 ${editor.isActive("italic") ? "bg-blue-400 rounded text-white" : "bg-white text-black"}`}
        >
          <FaItalic />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 ${editor.isActive("underline") ? "bg-blue-400 rounded text-white" : "bg-white text-black"}`}
        >
          <FaUnderline />
        </button>
      </div>

      <div className="flex gap-2 ml-auto">
        <button
          onClick={() => editor.chain().focus().undo().run()}
          className="p-2 bg-white text-black"
        >
          <FaUndo />
        </button>

        <button
          onClick={() => editor.chain().focus().redo().run()}
          className="p-2 bg-white text-black"
        >
          <FaRedo />
        </button>
      </div>
      <div className="border-t border-purple-300 w-full" />
    </div>
  );
}
























// "use client";

// import { Editor } from "@tinymce/tinymce-react";
// import { useRef } from "react";

// export default function TinyEditor({ onChange }: { onChange?: (val: string) => void }) {
//   const editorRef = useRef<any>(null);

//   return (
//     <Editor
//       apiKey="no-api-key"
//       onInit={(_, editor) => (editorRef.current = editor)}
//       initialValue="<p>Digite aqui sua mensagem...</p>"
//       onEditorChange={(newValue) => {
//         onChange?.(newValue);
//       }}
//       init={{
//         height: 500,
//         menubar: false,
//         plugins: [
//           "advlist", "autolink", "lists", "link", "charmap", "preview",
//           "anchor", "searchreplace", "visualblocks", "fullscreen",
//           "insertdatetime", "media", "table", "help", "wordcount"
//         ],
//         toolbar: "bold italic underline | undo redo",
//         placeholder: "Digite aqui sua mensagem...",
//         content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
//       }}
//     />
//   );
// }
