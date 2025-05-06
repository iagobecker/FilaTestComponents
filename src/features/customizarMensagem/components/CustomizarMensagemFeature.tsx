"use client";

import { HeaderCustomMessage } from "./HeaderCustomMesage";
import { RichEditor } from "./RichEditor";


export function CustomizarMensagemFeature() {
  return (
    <div className="space-y-6">
      <HeaderCustomMessage />
      <RichEditor />
    </div>
  );
}