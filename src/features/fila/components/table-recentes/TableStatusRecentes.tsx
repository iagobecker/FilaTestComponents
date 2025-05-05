"use client";

import { ColumnDef, flexRender, getCoreRowModel, useReactTable, Row } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Clock, RotateCcw, CircleArrowLeft } from "lucide-react";
import { useFilaContext } from "@/features/fila/context/FilaProvider";
import { ChamadasContainer } from "../../../../components/layout/ChamadasContainer";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useMediaQuery } from "@/lib/hooks/use-media-query";

type ChamadaItem = {
  id: string;
  nome: string;
  telefone: string;
  tempo: string;
  status: number;
  observacao: string;
  dataHoraCriado: string;
};

const MobileRow = ({ row }: { row: Row<ChamadaItem> }) => {
  const {
    retornarParaFila,
    removerChamada,
    marcarComoAtendido,
    marcarComoDesistente,
    getStatusText,
    getStatusColor,
    calcularTempo,
  } = useFilaContext();
  const status = Number(row.original.status);

  return (
    <div className="p-4 border-b border-gray-100">
      <div className="flex justify-between items-start">
        {/* Cabeçalho com código e nome */}
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 text-center font-bold text-[15px] py-1 text-gray-800 rounded-md">
              {String(row.index + 1).padStart(2, '0')}
            </span>
            <span className="font-semibold">
              {row.original.nome}
            </span>
          </div>

          <div className="flex items-center gap-1 mt-1">
            <span
              className={`px-2 py-1 rounded-sm text-sm font-medium text-gray-500 ${getStatusColor(status)}`}
            >
              {getStatusText(status)}
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
              <span className="text-sm text-gray-500">{calcularTempo(row.original.dataHoraCriado)}</span>
            </div>
          </div>
        </div>

        {/* Ações tela mobile */}
        <div className="flex flex-col p-2 pt-15 items-end gap-2">
          <div className="flex gap-1">
            {status === 2 ? (
              // Status Chamado: Mostra os 3 ícones
              <>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => marcarComoAtendido(row.original.id)}
                        className="cursor-pointer"
                      >
                        <CheckCircle className="!w-5.5 !h-5.5 text-green-500" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Atender</p>
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
                    <TooltipContent>
                      <p>Voltar para fila</p>
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
                    <TooltipContent>
                      <p>Remover</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </>
            ) : (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => marcarComoDesistente(row.original.id)} // Usa marcarComoDesistente para status != 2
                      className="cursor-pointer"
                    >
                      <XCircle className="!w-5.5 !h-5.5 text-red-500" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Desistiu</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente da tabela de chamadas recentes
export function TableStatusRecentes({ data }: { data: ChamadaItem[] }) {
  const isMobile = useMediaQuery("(max-width: 1060px)");
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  console.log("📋 Renderizando TableStatusRecentes com data:", data);
  return (
    <div className="border-none bg-white p-1 overflow-x-auto mt-4">
      <ChamadasContainer>
        <h2 className="text-lg font-semibold mb-3 px-4">Recentes</h2>
        {isMobile ? (
          <div className="space-y-2">
            {table.getRowModel().rows.map((row) => (
              <MobileRow key={row.id} row={row} />
            ))}
          </div>
        ) : (
          <div className={`overflow-x-auto ${data.length >= 4 ? "max-h-[360px] overflow-y-auto" : ""}`}>
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
        <span className="px-6 text-center font-bold py-1 text-[15px] text-gray-700 rounded-md">
          {String(row.index + 1).padStart(2, '0')}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "nome",
    header: "",
    cell: ({ row }) => (
      <div className="w-[500px] min-w-[180px] flex flex-col">
        <span className="font-semibold">{row.getValue("nome")}</span>
        <span className="text-sm text-gray-500 underline">{row.original.telefone}</span>
      </div>
    ),
  },
  {
    accessorKey: "observacao",
    header: "",
    cell: ({ row }) => (
      <div className="min-w-[80px] flex justify-start">
        <span className="text-sm font-semibold text-gray-400">{row.original.observacao}</span>
      </div>
    ),
  },
  {
    accessorKey: "tempo",
    header: "",
    cell: ({ row }) => {
      const { calcularTempo } = useFilaContext();
      return (
        <div className="flex min-w-[120px] items-center justify-end gap-1">
          <Clock className="w-4 h-4 text-gray-400" strokeWidth={1.5} />
          <span className="text-sm font-semibold text-gray-400">
            {calcularTempo(row.original.dataHoraCriado)}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "",
    cell: ({ row }) => {
      const { getStatusText, getStatusColor } = useFilaContext();
      const status = Number(row.original.status);

      return (
        <div className="flex min-w-[90px] max-w-[100px] items-center gap-1">
          <span
            className={`px-2 py-1 rounded-sm text-sm font-medium text-gray-500 ${getStatusColor(status)}`}
          >
            {getStatusText(status)}
          </span>
        </div>
      );
    },
  },
  {
    id: "acoes",
    header: "",
    cell: ({ row }) => {
      const { retornarParaFila, removerChamada, marcarComoAtendido, marcarComoDesistente } = useFilaContext();
      const status = Number(row.original.status);

      return (
        <div className="w-[80px] flex justify-end items-center gap-1">
          {status === 2 ? (
            // Status Chamado: mostra os 3 ícones
            <>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => marcarComoAtendido(row.original.id)}
                      className="cursor-pointer"
                    >
                      <CheckCircle className="!w-5.5 !h-5.5 text-green-500" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Atender</p>
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
                  <TooltipContent>
                    <p>Voltar para fila</p>
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
                  <TooltipContent>
                    <p>Remover</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => marcarComoDesistente(row.original.id)} // Usa marcarComoDesistente
                    className="cursor-pointer"
                  >
                    <XCircle className="!w-5.5 !h-5.5 text-red-500" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Desistiu</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      );
    },
  }
];