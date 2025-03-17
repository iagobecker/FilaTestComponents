"use client";

import { Button } from "@/components/ui/button";
import { SectionTitle } from "../ui/section-title";
import { CustomDialog } from "@/components/shared/CustomDialog";
import { AddPersonForm } from "@/components/fila/AddPersonForm";

export function PageHeader() {
  return (
    <div className="flex justify-between items-center mb-6">
      <SectionTitle title="Fila de Atendimento" />
      
      <CustomDialog
        title="Adicionar pessoa na fila"
        description="Coloque as informações do cliente para adicioná-lo à fila"
        trigger={
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
            + Adicionar à fila
          </Button>
        }
      >
        <AddPersonForm />
      </CustomDialog>
    </div>
  );
}
