"use client";

import { useState } from "react";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Table, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash, PhoneCall, CircleArrowDown, CircleArrowUp, Clock, CheckCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { FilaContainer } from "@/features/fila/components/table/FilaContainer";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import { Modal } from "@/components/Modal";
import { DialogTitle } from "@/components/ui/dialog";

type FilaItem = {
  id: string;
  nome: string;
  telefone: string;
  observacao: string;
  status: string;
  tempo: string;
};

type FilaTableProps = {
  data: FilaItem[];
  setData: React.Dispatch<React.SetStateAction<FilaItem[]>>;
};

// Componente da Tabela
export function FilaTable({ data, setData }: FilaTableProps) {

  const [notification, setNotification] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);


  //Remover uma row
  const removeItem = (id: string) => {
    setData((prevData) => prevData.filter((item) => item.id !== id));

    setNotification("Item removido com sucesso!");

    // Remove a notificação após 3 segundos
    setTimeout(() => setNotification(null), 3000);
  };

  const handleOpenModal = (id: string) => {
    setSelectedId(id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedId(null);
    setShowModal(false);
  };

  const handleConfirmRemove = () => {
    if (selectedId) {
      removeItem(selectedId);
      handleCloseModal();
    }
  };



  const moveItem = (id: string, direction: "up" | "down") => {
    setData((prevData) => {
      const index = prevData.findIndex((item) => item.id === id);
      if (index === -1) return prevData;

      let newIndex = direction === "up" ? index - 1 : index + 1;

      // Impedir que mova para fora dos limites da lista
      if (newIndex < 0 || newIndex >= prevData.length) return prevData;

      // Criar nova cópia do array com os itens trocados
      const newData = [...prevData];
      [newData[index], newData[newIndex]] = [newData[newIndex], newData[index]];

      return newData;
    });
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
          <span className="px-2 text-center font-bold py-1 text-[16px] text-blue-700  rounded-md">
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
          <span className="font-semibold text-[16px] cursor-pointer">{row.getValue("nome")}</span>
          <span className="text-sm text-gray-500 underline cursor-pointer">{row.original.telefone}</span>
        </div>
      ),
    },
    {
      accessorKey: "observacao",
      header: "",
      cell: ({ row }) => (
        <div className="w-[30px] min-w-[120px] flex justify-start">
          <span className="text-sm font-semibold text-gray-400">{row.original.observacao}</span>
        </div>
      ),
    },
    {
      accessorKey: "tempo",
      header: "",
      cell: ({ row }) => (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center justify-end gap-1 cursor-pointer">
              <Clock className="w-4 h-4 text-gray-400" strokeWidth={1.5} />
              <span className="text-sm font-semibold text-gray-400">{row.original.tempo}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Seg 10 Março, 15:27</p>
          </TooltipContent>
        </Tooltip>
      ),
    },
    {
      accessorKey: "status",
      header: "",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const statusColors: Record<string, string> = {
          "Em Atendimento": " text-green-600 border-green-400",
          "Aguardando": " text-blue-600 border-blue-400",
          "Cancelado": " text-red-600 border-red-400",
        };

        return (
          <div className="flex max-w-[60px] min-w-[120px] items-center gap-2">
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
      cell: ({ row }) => (
        <div className="w-[150px] flex justify-end gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="cursor-pointer">
                <PhoneCall className="!w-5.5 !h-5.5 text-green-500" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Chamar</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="cursor-pointer" onClick={() => moveItem(row.original.id, "up")}>
                <CircleArrowUp className="!w-5.5 !h-5.5 text-gray-600" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Mover para cima</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="cursor-pointer" onClick={() => moveItem(row.original.id, "down")}>
                <CircleArrowDown className="!w-5.5 !h-5.5 text-gray-600" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Mover para baixo</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="cursor-pointer"
                onClick={() => handleOpenModal(row.original.id)}
              >
                <Trash className="!w-5.5 !h-5.5 text-red-500" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Remover</p>
            </TooltipContent>
          </Tooltip>

        </div>
      ),
    }

  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const selectedCount = table.getFilteredSelectedRowModel().rows.length;


  return (
    <TooltipProvider delayDuration={2000} skipDelayDuration={500}>

      {notification && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-400 text-white px-4 py-2 rounded-md shadow-lg flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          {notification}
        </div>
      )}

      <div className="border-none bg-white p-1 overflow-x-auto">

        <FilaContainer selectedCount={selectedCount}>
          <div className="overflow-x-auto">
            <Table>
              <TableBody>
                <AnimatePresence>
                  {table.getRowModel().rows.map((row) => (
                    <motion.tr
                      className={`border-b border-gray-50 transition-colors ${row.getIsSelected() ? "bg-blue-100" : "hover:bg-blue-50"
                        }`}
                      key={row.original.id}
                      layout="position"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: [10, 0], scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 250, damping: 20 }}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="px-4 py-2 whitespace-nowrap">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
        </FilaContainer>
      </div>
      {showModal && (
        <Modal open={showModal} onClose={handleCloseModal}>
          <div className="max-w-sm p-1 space-y-4 text-left">
            <div className="flex items-center gap-2">
              <div className="bg-red-100 text-red-600 p-2 rounded-full">
                <Trash className="w-5 h-5" />
              </div>
              <DialogTitle className="text-lg font-semibold text-gray-900">Excluir cliente</DialogTitle>
            </div>
            <p className="text-sm text-gray-600">
              Você tem certeza que deseja <span className="font-medium text-gray-800">excluir este cliente da fila</span>?<br />
              Essa ação <span className="font-semibold text-red-600">não poderá ser desfeita</span>.
            </p>

          </div>
          <div className="flex justify-end cursor-pointer gap-2 pt-2">
            <Button variant="outline" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleConfirmRemove}>
              Excluir
            </Button>
          </div>
        </Modal>
      )}

    </TooltipProvider>
  );
}