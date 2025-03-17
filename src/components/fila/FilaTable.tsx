"use client";

import { useEffect, useState } from "react";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { filaData } from "@/data/mockData";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash, PhoneCall, CircleArrowDown, CircleArrowUp, Clock } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { FilaContainer } from "@/components/layout/FilaContainer";

type FilaItem = {
  id: string;
  nome: string;
  telefone: string;
  prioridade: string;
  status: string;
  tempo: string;
};

// Definição das colunas da tabela
const columns: ColumnDef<FilaItem>[] = [
  {
    id: "select",
    // header: ({ table }) => (
    //   <Checkbox
    //     checked={table.getIsAllPageRowsSelected()}
    //     onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    //     aria-label="Selecionar todos"
    //   />
    // ),
    cell: ({ row }) => (
      <div className="w-1 max-w-22 flex flex-col m-4 ">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={() => row.toggleSelected()}
          aria-label="Selecionar linha"
        />
      </div>
    ),
  },
  {
    accessorKey: "senha",
    header: "",
    cell: ({ row }) => (
      <div className="min-w-[80px] flex justify-start">
        <span className="px-6 text-center font-bold py-1 text-0.5 text-blue-700 bg-blue-300 rounded-md">
          BS{row.original.id}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "nome",
    header: "",
    cell: ({ row }) => (
      <div className="w-[300px] min-w-[180px] flex flex-col">
        <span className="font-semibold">{row.getValue("nome")}</span>
        <span className="text-sm text-gray-500">{row.original.telefone}</span>
      </div>
    ),
  },
  {
    accessorKey: "prioridade",
    header: "",
    cell: ({ row }) => (
      <div className="w-[30px] min-w-[120px] flex justify-start">
        <span className="text-sm font-semibold text-gray-400">{row.original.prioridade}</span>
      </div>
    ),
  },
  {
    accessorKey: "tempo",
    header: "",
    cell: ({ row }) => (
      <div className="flex w-[30px] min-w-[120px] items-center justify-end gap-1">

        <span className="text-sm font-semibold text-gray-400"> <Clock className="w-4 h-4 inline-block mr-1 text-gray-400" strokeWidth={1.5} />{row.original.tempo}</span>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const statusColors: Record<string, string> = {
        "Em Atendimento": "bg-green-100 text-green-700 border-green-400",
        "Aguardando": "bg-blue-200 text-blue-700 border-blue-400",
        "Cancelado": "bg-red-100 text-red-700 border-red-400",
      };

      return (
        <div className="flex max-w-[60px] min-w-[100px] items-center gap-2">
          <span
            className={`px-3 py-1 rounded-sm text-sm font-medium border ${statusColors[status] || "bg-gray-100 text-gray-700 border-gray-700"}`}
          >
            {status}
          </span>
        </div>
      );
    },
  },
  {
    id: "acoes",
    header: "",
    cell: () => (
      <div className="w-[150px] min-w-[120px] flex justify-end gap-1">
        <Button variant="ghost" size="icon">
          <PhoneCall className="!w-5.5 !h-5.5 text-green-500" />
        </Button>
        <Button variant="ghost" size="icon">
          <CircleArrowUp className="!w-5.5 !h-5.5 text-blue-500" />
        </Button>
        <Button variant="ghost" size="icon">
          <CircleArrowDown className="!w-5.5 !h-5.5 text-orange-500" />
        </Button>
        <Button variant="ghost" size="icon">
          <Trash className="!w-5.5 !h-5.5 text-red-500" />
        </Button>
      </div>

    ),
  }

];

// Componente da Tabela
export function FilaTable() {
  const [data] = useState<FilaItem[]>(filaData);
  const [selectedCount, setSelectedCount] = useState(0);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    setSelectedCount(table.getFilteredSelectedRowModel().rows.length);
  }, [table.getFilteredSelectedRowModel().rows.length]);

  return (
    <div className="border-none bg-white p-1 overflow-x-auto">
      <FilaContainer selectedCount={selectedCount}>
        <div className="overflow-x-auto">
          <Table>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : undefined}
                  className="hover:bg-blue-50 data-[state=selected]:bg-blue-100 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-4 py-2 whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>

        </div>
      </FilaContainer>

    </div>
  );
}