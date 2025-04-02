"use client";

import { useMemo, useState } from "react";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
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

  const [notification, setNotification] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [rowSelection, setRowSelection] = useState({});
  const [editingClient, setEditingClient] = useState<FilaItem | null>(null);


  //Remover uma row
  const removeItem = (id: string) => {
    setData((prevData) => {
      const newData = prevData.filter((item) => item.id !== id);
      table.resetRowSelection();
      return newData;
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
          <span className="px-2 text-center font-bold py-1 text-[16px] text-blue-800  rounded-md">
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
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const statusColors: Record<string, string> = {
          "Em Atendimento": " text-gray-500 border-green-400",
          "Aguardando": " text-gray-500 border-blue-400",
          "Cancelado": " text-gray-500 border-red-400",
        }; 5
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