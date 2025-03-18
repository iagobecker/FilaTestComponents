"use client";

import { useState } from "react";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { chamadasData } from "@/data/mockData";
import { ChamadasContainer } from "../layout/ChamadasContainer";

type ChamadaItem = {
  id: string;
  nome: string;
  telefone: string;
  tempo: string;
  status: string;
};

// Definição das colunas
const columns: ColumnDef<ChamadaItem>[] = [
  {
    accessorKey: "codigo",
    header: "",
    cell: () => (
      <div className="min-w-[80px] flex justify-start">
        <span className="px-6 text-center font-bold py-1 text-green-700 bg-green-300 rounded-md">
          B87
        </span>
      </div>
    ),
  },
  {
    accessorKey: "nome",
    header: "",
    cell: ({ row }) => (
      <div className="w-[500px]  min-w-[180px] flex flex-col">
        <span className="font-semibold">{row.getValue("nome")}</span>
        <span className="text-sm text-gray-500 underline">{row.original.telefone}</span>
      </div>
    ),
  },
  {
    accessorKey: "tempo",
    header: "",
    cell: ({ row }) => (
      <div className="flex min-w-[120px] items-center justify-end gap-1">
      <Clock className="w-4 h-4 text-gray-400" strokeWidth={1.5} />
      <span className="text-sm font-semibold text-gray-400">{row.original.tempo}</span>
    </div>
    ),
  },
  {
    accessorKey: "status",
    header: "",
    cell: () => (
      <div className="flex min-w-[80px] max-w-[100px] items-center gap-1">
      <span className="px-2 py-1 rounded-sm text-sm font-medium border bg-green-100 text-green-700 border-green-400">
        Chamado
      </span>
    </div>
    ),
  },
  {
    id: "acoes",
    header: "",
    cell: () => (
      <div className="w-[80px] flex justify-end items-center gap-1 ">
        <Button variant="ghost" size="icon">
          <CheckCircle className="!w-5.5 !h-5.5 text-green-500" />
        </Button>
        <Button variant="ghost" size="icon">
          <XCircle className="!w-5.5 !h-5.5 text-red-500" />
        </Button>
      </div>
    ),
  },
];

// Componente da tabela de chamadas recentes
export function ChamadasRecentes() {
  const [data] = useState<ChamadaItem[]>(chamadasData);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="border-none bg-white p-1 overflow-x-auto mt-4">
      <ChamadasContainer>
        <h2 className="text-lg font-semibold mb-3 px-4">Chamadas Recentemente</h2>
        <div className="overflow-x-auto">
          <Table>
            <TableBody>
              {table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  className={`bg-gray-50 hover:bg-gray-100 transition-colors ${index !== chamadasData.length - 1 ? "border-b border-gray-50" : ""
                    }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-2 py-2 whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </ChamadasContainer>
    </div>
  );
}
