"use client";

import { Button } from "@/components/ui/button";

export function FilaActions({ selectedCount }: { selectedCount: number }) {
  if (selectedCount === 0) return null; 

  return (
    <div className="flex justify-end gap-2 py-2">
      <Button className="bg-white hover:bg-green-100 text-green-600 px-3 py-1 rounded-md flex items-center gap-2 border border-green-400">
        Chamar selecionados
        <span className="bg-white text-green-600 px-2 py-0.5 rounded-full text-sm font-semibold">
          {selectedCount}
        </span>
      </Button>

      <Button className="bg-white hover:bg-red-100 text-red-600 px-3 py-1 rounded-md flex items-center gap-2 border border-red-400">
        Remover selecionados
        <span className="bg-white text-red-600 px-2 py-0.5 rounded-full text-sm font-semibold">
          {selectedCount}
        </span>
      </Button>
    </div>
  );
}
