"use client";

import {
  EditorContent,
  EditorProvider
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import MenuBar from "./tiptap-editor/TipTap";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const extensions = [
  StarterKit,
  Underline,
  TextStyle,
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
];

const content = `
  <p>Olá <strong>{pega nome do cliente automático}</strong> seja bem vindo. 
  Acompanhe sua posição pelo <strong>{gera o link automático}</strong></p>
`;

export default function RichEditor() {
  const [htmlPreview, setHtmlPreview] = useState(content);

  return (
    <div className="w-full flex flex-col lg:flex-row gap-90 mt-8">
      <div className="w-full max-w-[850px]">
        <div className="border min-h-[250px] p-3 border-purple-300 rounded-md bg-white shadow-sm">
          <EditorProvider
            extensions={extensions}
            content={content}
            onUpdate={({ editor }) => {
              setHtmlPreview(editor.getHTML());
            }}
            onCreate={({ editor }) => {
              setHtmlPreview(editor.getHTML());
            }}
            slotBefore={<MenuBar />}
          >
            <EditorContent editor={null} />
          </EditorProvider>
        </div>

        <div className="flex justify-start pt-6">
          <Button type="submit" className="max-w-[150px] bg-blue-400 text-white hover:bg-blue-700">
            Salvar
          </Button>
        </div>
      </div>

      {/* Smartphone Preview */}
      <div className="flex items-center justify-center mt-6 lg:mt-0">
        <div className="w-[300px] h-[600px] rounded-2xl border-4 border-black overflow-hidden shadow-xl bg-[#e5ddd5] flex flex-col">
          <div className="h-[50px] bg-[#075e54] text-white text-center flex items-center justify-center text-sm font-semibold">
            WhatsApp Preview
          </div>
          <div className="p-4 flex-1 bg-[#ece5dd] overflow-y-auto">
            <div className="bg-white rounded-lg px-3 py-2 shadow-md text-sm whitespace-pre-line leading-relaxed">
              <div dangerouslySetInnerHTML={{ __html: htmlPreview }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
