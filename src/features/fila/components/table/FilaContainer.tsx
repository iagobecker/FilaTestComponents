"use client";

import { Users, Search } from "lucide-react";
import { FilaActions } from "../../services/FilaActions";
import { useEffect, useState } from "react";
import { useDebounce } from "@/lib/hooks/useDebounce";

export function FilaContainer({
  children,
  selectedCount,
  selectedIds,
  onSearch,
  totalItems,
  onResetSelection
}: {
  children: React.ReactNode;
  selectedCount: number;
  selectedIds: string[];
  onSearch: (term: string) => void;
  totalItems: number;
  onResetSelection: () => void;
}) {
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const debouncedSearch = useDebounce(localSearchTerm, 300);

  useEffect(() => {
    onSearch(debouncedSearch);
  }, [debouncedSearch, onSearch]);

  return (
    <div className="border border-blue-300 rounded-lg shadow-sm">
      <div className="bg-blue-50 px-2 py-2 rounded-t-lg">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 whitespace-nowrap">
              <Users className="size-4 shrink-0  text-blue-600" />
              <span className="text-sm font-semibold text-blue-600">Na Fila: {totalItems}</span>
            </div>

            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Digite para buscar"
                className="border rounded-md pl-10 pr-3 py-1 w-full h-8 text-sm bg-white focus:outline-none focus-visible:ring-0"
                value={localSearchTerm}
                onChange={(e) => setLocalSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Botões select vários */}
          <FilaActions
            selectedCount={selectedCount}
            selectedIds={selectedIds}
            onResetSelection={onResetSelection}
          />
        </div>
      </div>

      <div className="bg-white rounded-b-lg">{children}</div>
    </div>
  );
}