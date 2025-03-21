"use client";

import { Users, Search } from "lucide-react";
import { FilaActions } from "../../services/FilaActions";

export function FilaContainer({
  children,
  selectedCount,
}: {
  children: React.ReactNode;
  selectedCount: number;
}) {
  return (
    <div className="border border-blue-300 rounded-lg shadow-sm">
      {/* Cabeçalho fixo azul */}
      <div className="bg-blue-50 px-4 py-3 rounded-t-lg">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 whitespace-nowrap">
              <Users className="w-5 h-5 shrink-0 text-blue-600" />
              <span className="text-xl font-semibold text-blue-600">Pessoas na Fila: 6</span>
            </div>

            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Digite para buscar"
                className="border rounded-md pl-10 pr-3 py-1 w-full h-8 text-sm bg-white focus:outline-none focus-visible:ring-0"
              />
            </div>
          </div>

          {/* Botões select vários */}
          <FilaActions selectedCount={selectedCount} />
        </div>
      </div>

      <div className="bg-white rounded-b-lg">{children}</div>
    </div>
  );
}
