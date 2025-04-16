'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CustomDialog } from "@/components/shared/CustomDialog";
import { AddHorarioForm } from "@/features/fila/components/form/AddHorarioForm";

export function AddHorarioButton({ filaId }: { filaId: string }) {
  const [open, setOpen] = useState(false);

  return (
    <CustomDialog
      title="Adicionar Horário"
      description="Informe os horários e o dia da semana"
      trigger={
        <Button
          onClick={() => setOpen(true)}
          className="bg-white border border-gray-400 text-black hover:bg-blue-400 hover:text-white shadow px-2 py-1 rounded-md"
        >
          + Adicionar Horário
        </Button>
      }
      open={open}
      onOpenChange={setOpen}
    >
      <AddHorarioForm filaId={filaId} onClose={() => setOpen(false)} />
    </CustomDialog>
  );
}
