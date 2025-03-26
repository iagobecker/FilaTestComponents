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
  // .chain() → inicia uma cadeia de comandos / .focus() → foca o editor / .toggleBold() → ativa ou desativa o negrito / .run() → executa a cadeia de comandos
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




