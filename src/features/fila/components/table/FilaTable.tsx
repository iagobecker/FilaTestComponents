"use client";

import { useMemo, useState } from "react";
import { ColumnDef, flexRender, getCoreRowModel, Row, useReactTable } from "@tanstack/react-table";
import { Table, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash, PhoneCall, CircleArrowDown, CircleArrowUp, Clock, CheckCircle, Edit, Pencil, PencilLine } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { FilaContainer } from "@/features/fila/components/table/FilaContainer";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import { Modal } from "@/components/Modal";
import { Dispatch, SetStateAction } from 'react';
import { useFila } from "../../provider/FilaProvider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { EditClientForm } from "../form/EditClientForm";
import { useMediaQuery } from "@/lib/hooks/use-media-query";


export type FilaItem = {
  id: string;
  nome: string;
  telefone: string;
  observacao: string;
  status: string;
  tempo: string;
};

type FilaTableProps = {
  data: FilaItem[];
  setData: Dispatch<SetStateAction<FilaItem[]>>;
};

// Componente da Tabela
export function FilaTable({ data, setData }: FilaTableProps) {
  const isMobile = useMediaQuery("(max-width: 1060px)");
  const [notification, setNotification] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [rowSelection, setRowSelection] = useState({});
  const [editingClient, setEditingClient] = useState<FilaItem | null>(null);


  //Remover uma row
  const removeItem = (id: string) => {
    setSelectedId(id);
    setData((prevData) => {
      return prevData.filter((item) => item.id !== id);
    });
    setNotification("Item removido com sucesso!");
    setTimeout(() => setNotification(null), 3000);
  };

  // Filtrar os dados com base no termo de busca
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;

    const term = searchTerm.toLowerCase();
    return data.filter(item =>
      item.nome.toLowerCase().includes(term) ||
      item.telefone.includes(searchTerm)
    );
  }, [searchTerm, data]);

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

  const { chamarSelecionados } = useFila();

  const chamarItem = (id: string) => {
    chamarSelecionados([id]);
    table.resetRowSelection();
  };


  const moveItem = (id: string, direction: "up" | "down") => {
    setData((prevData) => {
      const index = prevData.findIndex((item) => item.id === id);
      if (index === -1) return prevData;
      let newIndex = direction === "up" ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= prevData.length) return prevData;
      const newData = [...prevData];
      [newData[index], newData[newIndex]] = [newData[newIndex], newData[index]];
      return newData;
    });
  };

  const MobileRow = ({ row }: { row: Row<FilaItem> }) => {
    const statusColors: Record<string, string> = {
      "Em Atendimento": "border-green-400",
      "Aguardando": "border-blue-400",
      "Cancelado": "border-red-400",
    }

    return (
      <div className="p-4 border-b border-gray-100">
        {/* Linha superior com nome completo */}
        <div className="flex items-center justify-between w-full mb-1">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={() => row.toggleSelected()}
              aria-label="Selecionar linha"
              className="flex-shrink-0"
            />
            <span className="px-2 text-center font-bold py-1 text-[16px] text-blue-800 rounded-md whitespace-nowrap flex-shrink-0">
              BS{row.original.id}
            </span>
            <span
              className="font-semibold text-[16px] cursor-pointer hover:text-blue-600 transition-colors whitespace-nowrap truncate flex-1"
              onClick={() => setEditingClient(row.original)}
            >
              {row.original.nome}
            </span>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="size-5 text-gray-500 hover:text-blue-600 cursor-pointer flex-shrink-0 ml-2"
            onClick={() => setEditingClient(row.original)}
          >
            <PencilLine className="size-4" />
          </Button>
        </div>
    
        <div className="flex justify-between gap-4 mt-1">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className={`px-2 py-1 rounded-sm text-xs font-medium border ${statusColors[row.original.status] || "border-gray-700"}`}>
                {row.original.status}
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
    
            <div className="mt-1">
              <span className="text-sm font-semibold text-gray-600 block">
                {row.original.observacao}
              </span>
              <div className="flex items-center gap-1 mt-1">
                <Clock className="size-4 text-gray-400" strokeWidth={1.5} />
                <span className="text-sm text-gray-500">{row.original.tempo}</span>
              </div>
            </div>
          </div>
    
          <div className="flex flex-col p-1 justify-end gap-2 flex-shrink-0">
            <div className="flex gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => moveItem(row.original.id, "up")}
                  >
                    <CircleArrowUp className="size-6 text-gray-600" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Mover para cima</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => moveItem(row.original.id, "down")}
                  >
                    <CircleArrowDown className="size-6 text-gray-600" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Mover para baixo</p>
                </TooltipContent>
              </Tooltip>
            </div>
    
            <div className="flex gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 cursor-pointer"
                    onClick={() => chamarItem(row.original.id)}
                  >
                    <PhoneCall className="size-6 text-green-500" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Chamar</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                      setSelectedId(row.original.id);
                      setShowModal(true);
                    }}
                  >
                    <Trash className="size-6 text-red-500" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Remover</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    );
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
      cell: ({ row }: { row: Row<FilaItem> }) => (
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
      cell: ({ row }: { row: Row<FilaItem> }) => (
        <div className="min-w-[50px] flex justify-start">
          <span className="px-2 text-center font-bold py-1 text-[16px] text-blue-800  rounded-md">
            BS{row.original.id}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "nome",
      header: "",
      cell: ({ row }: { row: Row<FilaItem> }) => (
        <div className=" min-w-[100px] flex flex-col">
          <div className="flex items-center gap-2">
            <span
              className="font-semibold text-[16px] cursor-pointer hover:text-blue-600 transition-colors"
              onClick={() => setEditingClient(row.original)}
            >
              {row.getValue("nome")}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 text-gray-500 hover:text-blue-600 cursor-pointer"
              onClick={() => setEditingClient(row.original)}
            >
              <PencilLine className="h-4 w-4 " />
            </Button>
          </div>
          <a
            href={`https://wa.me/${encodeURIComponent(row.original.telefone)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-500 underline cursor-pointer"
          >
            {row.original.telefone}
          </a>
        </div>
      ),
    },
    {
      accessorKey: "observacao",
      header: "",
      cell: ({ row }: { row: Row<FilaItem> }) => (
        <div className=" min-w-[80px] flex justify-start">
          <span className="text-sm font-semibold text-gray-400">{row.original.observacao}</span>
        </div>
      ),
    },
    {
      accessorKey: "tempo",
      header: "",
      cell: ({ row }: { row: Row<FilaItem> }) => (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center justify-center gap-1 cursor-pointer">
              <Clock className="size-4 text-gray-400" strokeWidth={1.5} />
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
      cell: ({ row }: { row: Row<FilaItem> }) => {
        const status = row.getValue("status") as string;
        const statusColors: Record<string, string> = {
          "Em Atendimento": " text-gray-500 border-green-400",
          "Aguardando": " text-gray-500 border-blue-400",
          "Cancelado": " text-gray-500 border-red-400",
        };
        return (
          <div className={`${isMobile ? 'mt-2' : ''} flex max-w-[60px] min-w-[120px] items-center gap-2`}>
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
      cell: ({ row }: { row: Row<FilaItem> }) => (
        <div className="w-[150px] flex justify-end gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="cursor-pointer"
                onClick={() => chamarItem(row.original.id)}
              >
                <PhoneCall className="!w-5.5 !h-5.5 text-green-500" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Chamar</p>
            </TooltipContent>
          </Tooltip>


          <>
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
          </>


          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="cursor-pointer"
                onClick={() => {
                  setSelectedId(row.original.id);
                  setShowModal(true);
                }}
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
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    autoResetPageIndex: false,
    state: {
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
    getRowId: (row) => row.id,

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

        <FilaContainer
          selectedCount={selectedCount}
          selectedIds={table.getFilteredSelectedRowModel().rows.map(row => row.original.id)}
          onSearch={setSearchTerm}
          totalItems={filteredData.length}
          onResetSelection={() => table.resetRowSelection()}
        >
          {isMobile ? (
            <div className="space-y-2">
              <AnimatePresence>
                {table.getRowModel().rows.map((row) => (
                  <motion.div
                    key={row.original.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 250, damping: 21 }}
                    layout
                  >
                    <MobileRow row={row} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
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
                        transition={{ type: "spring", stiffness: 250, damping: 21 }}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell
                            key={cell.id}
                            className={`px-4 py-2 ${isMobile ? 'block' : 'whitespace-nowrap'}`}
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
          )}
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

      {/* Dialog de Edição */}
      {editingClient && (
        <Dialog
          open={!!editingClient}
          onOpenChange={(open) => !open && setEditingClient(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Cliente</DialogTitle>
              <DialogDescription>Atualize as informações do cliente</DialogDescription>
            </DialogHeader>
            <EditClientForm
              client={editingClient}
              onSave={(updatedClient) => {
                setData(prev => prev.map(item =>
                  item.id === updatedClient.id ? updatedClient : item
                ));
                setEditingClient(null);
                setNotification("Cliente atualizado com sucesso!");
                setTimeout(() => setNotification(null), 3000);
              }}
            />
          </DialogContent>
        </Dialog>
      )}

    </TooltipProvider>
  );
}

