"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SectionTitle } from "../../../../components/ui/section-title";
import { CustomDialog } from "@/components/shared/CustomDialog";
import { AddPersonForm } from "@/features/fila/components/form/AddPersonForm";

export function HeaderFila({ addPerson }: { addPerson: (nome: string, telefone: string, observacao: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="flex justify-start items-center md:flex-row mb-3">
        <SectionTitle title="Fila de Atendimento" />

      </div>

      <div className="p-3 justify-end flex items-center gap-2">
        <CustomDialog
          title="Adicionar pessoa na fila"
          description="Coloque as informações do cliente para adicioná-lo à fila"
          trigger={
            <Button
              className="bg-white border-1 border-gray-400 text-black shadow hover:bg-blue-400 cursor-pointer px-2 py-2 rounded-md "
              onClick={() => setIsOpen(true)}
            >
              + Adicionar à fila
            </Button>
          }
          open={isOpen}
          onOpenChange={setIsOpen}
        >
          <AddPersonForm addPerson={addPerson} onClose={() => setIsOpen(false)} />
        </CustomDialog>
      </div>
    </>
  );
}
