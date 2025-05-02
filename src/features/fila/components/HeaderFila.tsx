'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SectionTitle } from "../../../components/ui/section-title";
import { CustomDialog } from "@/components/shared/CustomDialog";
import { AddPersonForm } from "@/features/fila/components/form/AddPersonForm";

export function HeaderFila({
  addPerson,
}: {
  addPerson: (nome: string, telefone: string, observacao: string) => void;
}) {
  const [isOpenAddPessoa, setIsOpenAddPessoa] = useState(false);

  const filaId = "b36f453e-a763-4ee1-ae2d-6660c2740de5";

  return (
    <>
      <div className="flex justify-start items-center md:flex-row mb-3">
        <SectionTitle title="Fila de Atendimento" />
      </div>

      <div className="p-3 flex flex-col sm:flex-row sm:justify-end items-stretch sm:items-center gap-3 sm:gap-8 w-full">
       
        {/* Botão Adicionar Pessoa */}
        <CustomDialog
          title="Adicionar pessoa na fila"
          description="Coloque as informações do cliente para adicioná-lo à fila"
          trigger={
            <Button
              className="bg-white border border-gray-400 text-black shadow hover:bg-blue-400 cursor-pointer px-2 py-2 rounded-md"
              onClick={() => setIsOpenAddPessoa(true)}
            >
              + Adicionar à fila
            </Button>
          }
          open={isOpenAddPessoa}
          onOpenChange={setIsOpenAddPessoa}
        >
          <AddPersonForm addPerson={addPerson} onClose={() => setIsOpenAddPessoa(false)} />
        </CustomDialog>

        
      </div>
    </>
  );
}
