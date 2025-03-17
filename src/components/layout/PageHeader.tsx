"use client";

import { Button } from "@/components/ui/button";
import { SectionTitle } from "../ui/section-title";

export function PageHeader() {
  return (
    <div className="flex justify-between items-center mb-6">
      <SectionTitle title="Fila de Atendimento" />
      <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
        + Adicionar à fila
      </Button>
    </div>
  );
}
