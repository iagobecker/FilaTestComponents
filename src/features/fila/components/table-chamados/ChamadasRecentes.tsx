"use client";

import { ColumnDef, flexRender, getCoreRowModel, useReactTable, Row } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Clock, RotateCcw, CircleArrowLeft } from "lucide-react";
import { useFila } from "@/features/fila/provider/FilaProvider";
import { ChamadasContainer } from "../../../../components/layout/ChamadasContainer";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useMediaQuery } from "@/lib/hooks/use-media-query";

type ChamadaItem = {
  id: string;
  nome: string;
  telefone: string;
  tempo: string;
  status: string;
  observacao: string;
};

const MobileRow = ({ row }: { row: Row<ChamadaItem> }) => {
  const { retornarParaFila, removerChamada } = useFila();

  return (
    <div className="p-4 border-b border-gray-100">
      <div className="flex justify-between items-start">
        {/* Cabeçalho com código e nome */}
        <div>
          <div className="flex items-center gap-2">

            <span className="px-2 text-center font-bold py-1 text-[16px] text-green-800 rounded-md">
              BS{row.original.id}
            </span>
            <span className="font-semibold  text-[16px]">
              {row.original.nome}
            </span>
          </div>

          <div className="flex items-center gap-1 mt-1">
            <span className="px-2 py-1 rounded-sm text-sm font-medium border  text-gray-500 border-green-400">
              Chamado
            </span>
          </div>

          <a
            href={`https://wa.me/${encodeURIComponent(row.original.telefone)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-500 block mt-1"
          >
            {row.original.telefone}
          </a>

          <div className="mt-2">
            <span className="text-sm font-semibold text-gray-600 block">
              {row.original.observacao}
            </span>
            <div className="flex items-center gap-1 mt-1">
              <Clock className="size-4 text-gray-400" strokeWidth={1.5} />
              <span className="text-sm text-gray-500">{row.original.tempo}</span>
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="flex flex-col p-2 pt-15 items-end gap-2">
          <div className="flex gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removerChamada(row.original.id)}
                    className="cursor-pointer"
                  >
                    <CheckCircle className="!w-5.5 !h-5.5 text-green-500" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-black text-white px-3 py-2 rounded-md text-sm">
                  <p>Compareceu</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removerChamada(row.original.id)}
                    className="cursor-pointer"
                  >
                    <XCircle className="!w-5.5 !h-5.5 text-red-500" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-black text-white px-3 py-2 rounded-md text-sm">
                  <p>Não Compareceu</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => retornarParaFila(row.original.id)}
                    className="cursor-pointer"
                  >
                    <CircleArrowLeft className="!w-5.5 !h-5.5 text-blue-500" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-black text-white px-3 py-2 rounded-md text-sm">
                  <p>Voltar para fila</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente da tabela de chamadas recentes
export function ChamadasRecentes({ data }: { data: ChamadaItem[] }) {
  const isMobile = useMediaQuery("(max-width: 1060px)");
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="border-none bg-white p-1 overflow-x-auto mt-4">
      <ChamadasContainer>
        <h2 className="text-lg font-semibold mb-3 px-4">Chamadas Recentemente</h2>
        {isMobile ? (
          <div className="space-y-2">
            {table.getRowModel().rows.map((row) => (
              <MobileRow key={row.id} row={row} />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableBody>
                {table.getRowModel().rows.map((row, index) => (
                  <TableRow
                    key={row.id}
                    className={`bg-gray-50 hover:bg-gray-100 transition-colors ${index !== data.length - 1 ? "border-b border-gray-50" : ""}`}
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
        )}
      </ChamadasContainer>
    </div>
  );
}

// Definição das colunas
const columns: ColumnDef<ChamadaItem>[] = [
  {
    accessorKey: "codigo",
    header: "",
    cell: ({ row }) => (
      <div className="min-w-[80px] flex justify-start">
        <span className="px-6 text-center font-bold py-1 text-green-700 text-[16px] rounded-md">
          BS{String(row.index + 1).padStart(2, '0')}
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
        accessorKey: "observacao",
        header: "",
        cell: ({ row }) => (
          <div className=" min-w-[80px] flex justify-start">
            <span className="text-sm font-semibold text-gray-400">{row.original.observacao}</span>
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
      <div className="flex min-w-[90px] max-w-[100px] items-center gap-1">
        <span className="px-2 py-1 rounded-sm text-sm font-medium border  text-gray-500 border-green-400">
          Chamado
        </span>
      </div>
    ),
  },
  {
    id: "acoes",
    header: "",
    cell: ({ row }) => {
      const { retornarParaFila, removerChamada } = useFila();


      return (
        <div className="w-[80px] flex justify-end items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removerChamada(row.original.id)}
                  className="cursor-pointer"
                >
                  <CheckCircle className="!w-5.5 !h-5.5 text-green-500" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-black text-white px-3 py-2 rounded-md text-sm">
                <p>Compareceu</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removerChamada(row.original.id)}
                  className="cursor-pointer"
                >
                  <XCircle className="!w-5.5 !h-5.5 text-red-500" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-black text-white px-3 py-2 rounded-md text-sm">
                <p>Não Compareceu</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => retornarParaFila(row.original.id)}
                  className="cursor-pointer"
                >
                  <CircleArrowLeft className="!w-5.5 !h-5.5 text-blue-500" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-black text-white px-3 py-2 rounded-md text-sm">
                <p>Voltar para fila</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
  },
];

