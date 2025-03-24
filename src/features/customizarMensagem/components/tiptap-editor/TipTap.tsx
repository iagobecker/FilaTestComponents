"use client";

import { useCurrentEditor } from "@tiptap/react";
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaUndo,
  FaRedo,
} from "react-icons/fa";

export default function MenuBar() {
  const { editor } = useCurrentEditor();

  if (!editor) return null;

  return (
    <div className="flex items-center justify-between flex-wrap gap-2 mb-2 w-full">
      {/* Botões principais à esquerda */}
      <div className="flex flex-wrap gap-2">
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

      {/* Botões de undo/redo à direita */}
      <div className="flex gap-2 ml-auto">
        <button
          onClick={() => editor.chain().focus().undo().run()}
          className="p-2  bg-white text-black"
        >
          <FaUndo />
        </button>

        <button
          onClick={() => editor.chain().focus().redo().run()}
          className="p-2  bg-white text-black"
        >
          <FaRedo />
        </button>
      </div>

      <div className="border-t border-gray-300 w-full mt-1" />
    </div>
  );
}
