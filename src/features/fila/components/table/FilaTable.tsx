// "use client";

// import { useMemo, useState } from "react";
// import { ColumnDef, flexRender, getCoreRowModel, Row, useReactTable } from "@tanstack/react-table";
// import { Table, TableBody, TableCell } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Trash, PhoneCall, CircleArrowDown, CircleArrowUp, Clock, CheckCircle, PencilLine } from "lucide-react";
// import { Checkbox } from "@/components/ui/checkbox";
// import { FilaContainer } from "@/features/fila/components/table/FilaContainer";
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
// import { motion, AnimatePresence } from "framer-motion";
// import { Modal } from "@/components/Modal";
// import { useFilaContext } from "@/features/fila/context/FilaProvider";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription
// } from "@/components/ui/dialog";
// import { EditClientForm } from "../form/EditClientForm";
// import { useMediaQuery } from "@/lib/hooks/use-media-query";
// import { FilaItem, Status } from "@/features/fila/components/types/filaTypes"
// import { getStatusColor, getStatusText } from "../utils/statusUtils";
// import { chamarClientesSelecionados } from "../../services/FilaService";

// type FilaTableProps = {
//   data: FilaItem[];
//   setData: React.Dispatch<React.SetStateAction<FilaItem[]>>;
// };

// // Componente da Tabela
// export function FilaTable({ data, }: FilaTableProps) {
//   const isMobile = useMediaQuery("(max-width: 1060px)");
//   const [notification, setNotification] = useState<string | null>(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showModal, setShowModal] = useState(false);
//   const [selectedId, setSelectedId] = useState<string | null>(null);
//   const [rowSelection, setRowSelection] = useState({});
//   const [editingClient, setEditingClient] = useState<FilaItem | null>(null);
//   const { filaData, chamadasData, editPerson, atualizarStatusEReorganizar } = useFilaContext();

//   const allClientes = useMemo(() => [...filaData, ...chamadasData], [filaData, chamadasData]);

//   const openEditClient = (id: string) => {
//     // Busca o objeto completo
//     const clientFull = allClientes.find(c => c.id === id);
//     if (clientFull) {
//       setEditingClient(clientFull);
//     } else {
//       console.warn("Cliente não encontrado no contexto!", id);
//     }
//   };


//   // Filtrar os dados com base no termo de busca
//   const filteredData = useMemo(() => {
//     if (!searchTerm) return data;

//     const term = searchTerm.toLowerCase();
//     return data.filter(item =>
//       item.nome.toLowerCase().includes(term) ||
//       item.telefone.includes(searchTerm)
//     );
//   }, [searchTerm, data]);

//   const handleCloseModal = () => {
//     setSelectedId(null);
//     setShowModal(false);
//   };

//   const handleConfirmRemove = async () => {
//     if (!selectedId) return;

//     const cliente = data.find(c => c.id === selectedId);
//     if (!cliente || !(cliente.status === 1 || cliente.status === 2)) {
//       alert("Este cliente não está em um status válido para ser removido.");
//       handleCloseModal();
//       return;
//     }

//     await removerSelecionados([selectedId]);
//     handleCloseModal();
//   };


//   const {
//     removerSelecionados,
//     trocarPosicaoCliente,
//   } = useFilaContext();

//   const chamarItem = async (id: string) => {
//     const cliente = data.find(c => c.id === id);
//     if (!cliente || !(cliente.status === 1 || cliente.status === 2)) {
//       alert("Este cliente não está em um status válido para ser chamado.");
//       return;
//     }
//     await chamarClientesSelecionados([id]);
//     atualizarStatusEReorganizar(id, 2);
//     setNotification("Cliente chamado com sucesso!");
//     setTimeout(() => setNotification(null), 3000);
//   };

//   const MobileRow = ({ row }: { row: Row<FilaItem> }) => {

//     return (
//       <div className="p-4 border-b border-gray-100">
//         {/* Linha superior com nome completo */}
//         <div className="flex items-center justify-between w-full mb-1">
//           <div className="flex items-center gap-2 flex-1 min-w-0">
//             <Checkbox
//               checked={row.getIsSelected()}
//               onCheckedChange={() => row.toggleSelected()}
//               aria-label="Selecionar linha"
//               className="flex-shrink-0"
//             />
//             <span className="px-2 text-center font-bold py-1 text-[16px] text-blue-800 rounded-md whitespace-nowrap flex-shrink-0">
//               {String(row.index + 1).padStart(2, '0')}
//             </span>
//             <span
//               className="font-semibold text-[16px] cursor-pointer hover:text-blue-600 transition-colors whitespace-nowrap truncate flex-1"
//               onClick={() => openEditClient(row.original.id)}
//             >
//               {row.original.nome}
//             </span>
//           </div>

//           <Button
//             variant="ghost"
//             size="icon"
//             className="size-5 text-gray-500 hover:text-blue-600 cursor-pointer flex-shrink-0 ml-2"
//             onClick={() => openEditClient(row.original.id)}
//           >
//             <PencilLine className="size-4" />
//           </Button>
//         </div>

//         <div className="flex justify-between gap-4 mt-1">
//           <div className="flex-1 min-w-0">
//             <div className="flex items-center gap-1">
//               <span
//                 className={`px-2 py-1 rounded-sm text-xs font-medium ${getStatusColor(Number(row.original.status))}`}
//               >
//                 {getStatusText(Number(row.original.status))}
//               </span>
//             </div>


//             <a
//               href={`https://wa.me/${encodeURIComponent(row.original.telefone)}`}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-sm text-gray-500 block mt-1"
//             >
//               {row.original.telefone}
//             </a>

//             <div className="mt-1">
//               <span className="text-sm font-semibold text-gray-600 block">
//                 {row.original.observacao}
//               </span>
//               <div className="flex items-center gap-1 mt-1">
//                 <Clock className="size-4 text-gray-400" strokeWidth={1.5} />
//                 <span className="text-sm text-gray-500">{row.original.tempo}</span>
//               </div>
//             </div>
//           </div>

//           <div className="flex flex-col p-1 justify-end gap-2 flex-shrink-0">
//             <div className="flex gap-1">
//               <Tooltip>
//                 <TooltipTrigger asChild>
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="h-8 w-8"
//                     onClick={() => row.original.id && trocarPosicaoCliente(row.original.id, "up")}
//                   >
//                     <CircleArrowUp className="size-6 text-gray-600" />
//                   </Button>
//                 </TooltipTrigger>
//                 <TooltipContent>
//                   <p>Mover para cima</p>
//                 </TooltipContent>
//               </Tooltip>
//               <Tooltip>
//                 <TooltipTrigger asChild>
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="h-8 w-8"
//                     onClick={() => row.original.id && trocarPosicaoCliente(row.original.id, "down")}
//                   >
//                     <CircleArrowDown className="size-6 text-gray-600" />
//                   </Button>
//                 </TooltipTrigger>
//                 <TooltipContent>
//                   <p>Mover para baixo</p>
//                 </TooltipContent>
//               </Tooltip>
//             </div>

//             <div className="flex gap-1">
//               <Tooltip>
//                 <TooltipTrigger asChild>
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="h-8 w-8 cursor-pointer"
//                     onClick={() => row.original.id && chamarItem(row.original.id)}
//                   >
//                     <PhoneCall className="size-6 text-green-500" />
//                   </Button>
//                 </TooltipTrigger>
//                 <TooltipContent>
//                   <p>Chamar</p>
//                 </TooltipContent>
//               </Tooltip>
//               <Tooltip>
//                 <TooltipTrigger asChild>
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="h-8 w-8"
//                     onClick={() => {
//                       setSelectedId(row.original.id ?? null);
//                       setShowModal(true);
//                     }}
//                   >
//                     <Trash className="size-6 text-red-500" />
//                   </Button>
//                 </TooltipTrigger>
//                 <TooltipContent>
//                   <p>Remover</p>
//                 </TooltipContent>
//               </Tooltip>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };


//   // Definição das colunas da tabela
//   const columns: ColumnDef<FilaItem>[] = [
//     {
//       id: "select",
//       // header: ({ table }) => (
//       //   <Checkbox
//       //     checked={table.getIsAllPageRowsSelected()}
//       //     onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
//       //     aria-label="Selecionar todos"
//       //   />
//       // ),
//       cell: ({ row }: { row: Row<FilaItem> }) => (
//         <div className="w-1 max-w-22 flex flex-col m-4 ">
//           <Checkbox
//             checked={row.getIsSelected()}
//             onCheckedChange={() => row.toggleSelected()}
//             aria-label="Selecionar linha"
//           />
//         </div>
//       ),
//     },
//     {
//       accessorKey: "senha",
//       header: "",
//       cell: ({ row }: { row: Row<FilaItem> }) => (
//         <div className="min-w-[50px] flex justify-start">
//           <span className="px-2 text-center font-bold py-1 text-[15px] text-blue-800  rounded-md">
//             {String(row.original.posicao ?? row.index + 1).padStart(2, '0')}
//           </span>
//         </div>
//       ),
//     },
//     {
//       accessorKey: "nome",
//       header: "",
//       cell: ({ row }: { row: Row<FilaItem> }) => (
//         <div className=" min-w-[100px] flex flex-col">
//           <div className="flex items-center gap-2">
//             <span
//               className="font-semibold text-[16px] cursor-pointer hover:text-blue-600 transition-colors whitespace-nowrap truncate flex-1"
//               onClick={() => openEditClient(row.original.id)}
//             >
//               {row.original.nome}
//             </span>
//             <Button
//               variant="ghost"
//               size="icon"
//               className="size-5 text-gray-500 hover:text-blue-600 cursor-pointer flex-shrink-0 ml-2"
//               onClick={() => openEditClient(row.original.id)}
//             >
//               <PencilLine className="size-4" />
//             </Button>
//           </div>
//           <a
//             href={`https://wa.me/${encodeURIComponent(row.original.telefone)}`}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="text-sm text-gray-500 underline cursor-pointer"
//           >
//             {row.original.telefone}
//           </a>
//         </div>
//       ),
//     },
//     {
//       accessorKey: "observacao",
//       header: "",
//       cell: ({ row }: { row: Row<FilaItem> }) => (
//         <div className=" min-w-[80px] flex justify-start">
//           <span className="text-sm font-semibold text-gray-400">{row.original.observacao}</span>
//         </div>
//       ),
//     },
//     {
//       accessorKey: "tempo",
//       header: "",
//       cell: ({ row }: { row: Row<FilaItem> }) => (
//         <Tooltip>
//           <TooltipTrigger asChild>
//             <div className="flex items-center justify-center gap-1 cursor-pointer">
//               <Clock className="size-4 text-gray-400" strokeWidth={1.5} />
//               <span className="text-sm font-semibold text-gray-400">{row.original.tempo}</span>
//             </div>
//           </TooltipTrigger>
//           <TooltipContent>
//             <p>
//               {(() => {
//                 const date = new Date(row.original.dataHoraCriado ?? Date.now());
//                 const options: Intl.DateTimeFormatOptions = {
//                   weekday: 'long',
//                   month: 'long',
//                   hour: '2-digit',
//                   minute: '2-digit',
//                 };
//                 return date.toLocaleDateString('pt-BR', options);
//               })()}
//             </p>
//           </TooltipContent>
//         </Tooltip>
//       ),
//     },
//     {
//       accessorKey: "status",
//       header: "",
//       cell: ({ row }: { row: Row<FilaItem> }) => {
//         const status = Number(row.getValue("status")) as Status;

//         return (
//           <div className={`${isMobile ? 'mt-2' : ''} flex max-w-[60px] min-w-[120px] items-center gap-2`}>
//             <span
//               className={`px-3 py-1 rounded-sm text-sm font-medium ${getStatusColor(status)}`}
//             >
//               {getStatusText(status)}
//             </span>
//           </div>
//         );
//       },
//     },
//     {
//       id: "acoes",
//       header: "",
//       cell: ({ row }: { row: Row<FilaItem> }) => (
//         <div className="w-[150px] flex justify-end gap-2">
//           <Tooltip>
//             <TooltipTrigger asChild>
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className="cursor-pointer"
//                 onClick={() => chamarItem(row.original.id ?? '')}
//               >
//                 <PhoneCall className="!w-5.5 !h-5.5 text-green-500" />
//               </Button>
//             </TooltipTrigger>
//             <TooltipContent>
//               <p>Chamar</p>
//             </TooltipContent>
//           </Tooltip>


//           <>
//             <Tooltip>
//               <TooltipTrigger asChild>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   className="cursor-pointer"
//                   onClick={() => row.original.id && trocarPosicaoCliente(row.original.id, "up")}
//                 >
//                   <CircleArrowUp className="!w-5.5 !h-5.5 text-gray-600" />
//                 </Button>
//               </TooltipTrigger>
//               <TooltipContent>
//                 <p>Mover para cima</p>
//               </TooltipContent>
//             </Tooltip>

//             <Tooltip>
//               <TooltipTrigger asChild>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   className="cursor-pointer"
//                   onClick={() => row.original.id && trocarPosicaoCliente(row.original.id, "down")}
//                 >
//                   <CircleArrowDown className="!w-5.5 !h-5.5 text-gray-600" />
//                 </Button>
//               </TooltipTrigger>
//               <TooltipContent>
//                 <p>Mover para baixo</p>
//               </TooltipContent>
//             </Tooltip>
//           </>


//           <Tooltip>
//             <TooltipTrigger asChild>
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className="cursor-pointer"
//                 onClick={() => {
//                   setSelectedId(row.original.id ?? null);
//                   setShowModal(true);
//                 }}
//               >
//                 <Trash className="!w-5.5 !h-5.5 text-red-500" />
//               </Button>
//             </TooltipTrigger>
//             <TooltipContent>
//               <p>Remover</p>
//             </TooltipContent>
//           </Tooltip>
//         </div>
//       ),
//     }
//   ];

//   const table = useReactTable({
//     data: filteredData,
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//     autoResetPageIndex: false,
//     state: {
//       rowSelection,
//     },
//     onRowSelectionChange: setRowSelection,
//     getRowId: (row) => row.id || '',

//   });

//   const selectedCount = table.getFilteredSelectedRowModel().rows.length;


//   return (
//     <TooltipProvider delayDuration={2000} skipDelayDuration={500}>

//       {notification && (
//         <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-400 text-white px-4 py-2 rounded-md shadow-lg flex items-center gap-2">
//           <CheckCircle className="w-5 h-5" />
//           {notification}
//         </div>
//       )}

//       <div className="border-none bg-white p-1 overflow-x-auto">

//         <FilaContainer
//           selectedCount={selectedCount}
//           selectedIds={table.getFilteredSelectedRowModel().rows.map(row => row.original.id).filter((id): id is string => id !== undefined)}
//           onSearch={setSearchTerm}
//           totalItems={filteredData.length}
//           onResetSelection={() => table.resetRowSelection()}
//         >
//           {isMobile ? (
//             <div className="space-y-2">
//               <AnimatePresence>
//                 {table.getRowModel().rows.map((row) => (
//                   <motion.div
//                     key={row.original.id}
//                     initial={{ opacity: 0, y: -10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, scale: 0.95 }}
//                     transition={{ type: "spring", stiffness: 250, damping: 21 }}
//                     layout
//                   >
//                     <MobileRow row={row} />
//                   </motion.div>
//                 ))}
//               </AnimatePresence>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <div className="max-h-[420px] overflow-y-auto rounded-md border">
//                 <Table className="min-w-full">
//                   <TableBody>
//                     <AnimatePresence>

//                       {table.getRowModel().rows.map((row) => (
//                         <motion.tr
//                           className={`border-b border-gray-50 transition-colors ${row.getIsSelected() ? "bg-blue-100" : "hover:bg-blue-50"
//                             }`}
//                           key={row.original.id}
//                           layout="position"
//                           initial={{ opacity: 0, y: -10 }}
//                           animate={{ opacity: 1, y: [10, 0], scale: 1 }}
//                           exit={{ opacity: 0, scale: 0.95 }}
//                           transition={{ type: "spring", stiffness: 250, damping: 21 }}
//                         >
//                           {row.getVisibleCells().map((cell) => (
//                             <TableCell
//                               key={cell.id}
//                               className={`px-4 py-2 ${isMobile ? 'block' : 'whitespace-nowrap'}`}
//                             >
//                               {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                             </TableCell>
//                           ))}
//                         </motion.tr>
//                       ))}
//                     </AnimatePresence>
//                   </TableBody>
//                 </Table>
//               </div>
//             </div>
//           )}
//         </FilaContainer>
//       </div>
//       {showModal && (
//         <Modal open={showModal} onClose={handleCloseModal}>
//           <div className="max-w-sm p-1 space-y-4 text-left">
//             <div className="flex items-center gap-2">
//               <div className="bg-red-100 text-red-600 p-2 rounded-full">
//                 <Trash className="w-5 h-5" />
//               </div>
//               <DialogTitle className="text-lg font-semibold text-gray-900">Excluir cliente</DialogTitle>
//             </div>
//             <p className="text-sm text-gray-600">
//               Você tem certeza que deseja <span className="font-medium text-gray-800"><span className="font-semibold text-red-600">excluir</span> este cliente da fila</span>?<br />

//             </p>

//           </div>
//           <div className="flex justify-end cursor-pointer gap-2 pt-2">
//             <Button variant="outline" onClick={handleCloseModal}>
//               Cancelar
//             </Button>
//             <Button variant="destructive" onClick={handleConfirmRemove}>
//               Excluir
//             </Button>
//           </div>
//         </Modal>
//       )}

//       {/* Dialog de Edição */}
//       {editingClient && editingClient.filaId && editingClient.hash && (
//         <Dialog
//           open={!!editingClient}
//           onOpenChange={(open) => !open && setEditingClient(null)}
//         >
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>Editar Cliente</DialogTitle>
//               <DialogDescription>Atualize as informações do cliente</DialogDescription>
//             </DialogHeader>
//             <EditClientForm
//               client={editingClient}
//               onSave={async (updatedFields) => {
//                 const payload = {
//                   ...editingClient,     // todos os campos antigos
//                   ...updatedFields,      // sobrescreve só os campos editados
//                   dataHoraAleterado: new Date().toISOString(),
//                 };



//                 await editPerson(editingClient, updatedFields);
//                 setEditingClient(null);
//                 setNotification("Cliente atualizado com sucesso!");
//                 setTimeout(() => setNotification(null), 3000);
//               }}
//             />

//           </DialogContent>
//         </Dialog>
//       )}

//     </TooltipProvider>
//   );
// }



"use client";

import { useMemo, useState } from "react";
import { ColumnDef, flexRender, getCoreRowModel, Row, useReactTable } from "@tanstack/react-table";
import { Table, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash, PhoneCall, CircleArrowDown, CircleArrowUp, Clock, CheckCircle, PencilLine } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { FilaContainer } from "@/features/fila/components/table/FilaContainer";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import { Modal } from "@/components/Modal";
import { useFilaContext } from "@/features/fila/context/FilaProvider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { EditClientForm } from "../form/EditClientForm";
import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { FilaItem, Status } from "@/features/fila/components/types/types"

type FilaTableProps = {
  data: FilaItem[];
  setData: React.Dispatch<React.SetStateAction<FilaItem[]>>;
};

export function FilaTable({ data }: FilaTableProps) {
  const isMobile = useMediaQuery("(max-width: 1060px)");
  const [notification, setNotification] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [rowSelection, setRowSelection] = useState({});
  const [editingClient, setEditingClient] = useState<FilaItem | null>(null);
  const { filaData, chamadasData, editPerson, atualizarStatusEReorganizar, isLoading } = useFilaContext();

  const allClientes = useMemo(() => [...filaData, ...chamadasData], [filaData, chamadasData]);

  const openEditClient = (id: string) => {
    const clientFull = allClientes.find(c => c.id === id);
    if (clientFull) {
      setEditingClient(clientFull);
    } else {
      console.warn("Cliente não encontrado no contexto!", id);
    }
  };

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

  const handleConfirmRemove = async () => {
    if (!selectedId) return;

    const cliente = data.find(c => c.id === selectedId);
    if (!cliente || !(cliente.status === Status.Aguardando || cliente.status === Status.Chamado)) {
      alert("Este cliente não está em um status válido para ser removido.");
      handleCloseModal();
      return;
    }

    await removerSelecionados([selectedId]);
    handleCloseModal();
  };

  const { removerSelecionados, trocarPosicaoCliente } = useFilaContext();

  const chamarItem = async (id: string) => {
    const cliente = data.find(c => c.id === id);
    if (!cliente || !(cliente.status === Status.Aguardando || cliente.status === Status.Chamado)) {
      alert("Este cliente não está em um status válido para ser chamado.");
      return;
    }
    await chamarClientesSelecionados([id]);
    atualizarStatusEReorganizar(id, Status.Chamado);
    setNotification("Cliente chamado com sucesso!");
    setTimeout(() => setNotification(null), 3000);
  };

  const MobileRow = ({ row }: { row: Row<FilaItem> }) => {
    return (
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between w-full mb-1">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={() => row.toggleSelected()}
              aria-label="Selecionar linha"
              className="flex-shrink-0"
            />
            <span className="px-2 text-center font-bold py-1 text-[16px] text-blue-800 rounded-md whitespace-nowrap flex-shrink-0">
              {String(row.index + 1).padStart(2, "0")}
            </span>
            <span
              className="font-semibold text-[16px] cursor-pointer hover:text-blue-600 transition-colors whitespace-nowrap truncate flex-1"
              onClick={() => openEditClient(row.original.id)}
            >
              {row.original.nome}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="size-5 text-gray-500 hover:text-blue-600 cursor-pointer flex-shrink-0 ml-2"
            onClick={() => openEditClient(row.original.id)}
            disabled={isLoading}
          >
            <PencilLine className="size-4" />
          </Button>
        </div>

        <div className="flex justify-between gap-4 mt-1">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span
                className={`px-2 py-1 rounded-sm text-xs font-medium ${getStatusColor(Number(row.original.status))}`}
              >
                {getStatusText(Number(row.original.status))}
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
                    onClick={() => row.original.id && trocarPosicaoCliente(row.original.id, "up")}
                    disabled={isLoading}
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
                    onClick={() => row.original.id && trocarPosicaoCliente(row.original.id, "down")}
                    disabled={isLoading}
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
                    onClick={() => row.original.id && chamarItem(row.original.id)}
                    disabled={isLoading}
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
                      setSelectedId(row.original.id ?? null);
                      setShowModal(true);
                    }}
                    disabled={isLoading}
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

  const columns: ColumnDef<FilaItem>[] = [
    {
      id: "select",
      cell: ({ row }: { row: Row<FilaItem> }) => (
        <div className="w-1 max-w-22 flex flex-col m-4">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={() => row.toggleSelected()}
            aria-label="Selecionar linha"
            disabled={isLoading}
          />
        </div>
      ),
    },
    {
      accessorKey: "senha",
      header: "",
      cell: ({ row }: { row: Row<FilaItem> }) => (
        <div className="min-w-[50px] flex justify-start">
          <span className="px-2 text-center font-bold py-1 text-[15px] text-blue-800 rounded-md">
            {String(row.original.posicao ?? row.index + 1).padStart(2, "0")}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "nome",
      header: "",
      cell: ({ row }: { row: Row<FilaItem> }) => (
        <div className="min-w-[100px] flex flex-col">
          <div className="flex items-center gap-2">
            <span
              className="font-semibold text-[16px] cursor-pointer hover:text-blue-600 transition-colors whitespace-nowrap truncate flex-1"
              onClick={() => openEditClient(row.original.id)}
            >
              {row.original.nome}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="size-5 text-gray-500 hover:text-blue-600 cursor-pointer flex-shrink-0 ml-2"
              onClick={() => openEditClient(row.original.id)}
              disabled={isLoading}
            >
              <PencilLine className="size-4" />
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
        <div className="min-w-[80px] flex justify-start">
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
            <p>
              {(() => {
                const date = new Date(row.original.dataHoraCriado ?? Date.now());
                const options: Intl.DateTimeFormatOptions = {
                  weekday: "long",
                  month: "long",
                  hour: "2-digit",
                  minute: "2-digit",
                };
                return date.toLocaleDateString("pt-BR", options);
              })()}
            </p>
          </TooltipContent>
        </Tooltip>
      ),
    },
    {
      accessorKey: "status",
      header: "",
      cell: ({ row }: { row: Row<FilaItem> }) => {
        const status = Number(row.getValue("status")) as Status;
        return (
          <div className={`${isMobile ? "mt-2" : ""} flex max-w-[60px] min-w-[120px] items-center gap-2`}>
            <span
              className={`px-3 py-1 rounded-sm text-sm font-medium ${getStatusColor(status)}`}
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
      cell: ({ row }: { row: Row<FilaItem> }) => (
        <div className="w-[150px] flex justify-end gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="cursor-pointer"
                onClick={() => chamarItem(row.original.id ?? "")}
                disabled={isLoading}
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
                <Button
                  variant="ghost"
                  size="icon"
                  className="cursor-pointer"
                  onClick={() => row.original.id && trocarPosicaoCliente(row.original.id, "up")}
                  disabled={isLoading}
                >
                  <CircleArrowUp className="!w-5.5 !h-5.5 text-gray-600" />
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
                  className="cursor-pointer"
                  onClick={() => row.original.id && trocarPosicaoCliente(row.original.id, "down")}
                  disabled={isLoading}
                >
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
                  setSelectedId(row.original.id ?? null);
                  setShowModal(true);
                }}
                disabled={isLoading}
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
    },
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
    getRowId: (row) => row.id || "",
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
          selectedIds={table.getFilteredSelectedRowModel().rows.map(row => row.original.id).filter((id): id is string => id !== undefined)}
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
              <div className="max-h-[420px] overflow-y-auto rounded-md border">
                <Table className="min-w-full">
                  <TableBody>
                    <AnimatePresence>
                      {table.getRowModel().rows.map((row) => (
                        <motion.tr
                          className={`border-b border-gray-50 transition-colors ${row.getIsSelected() ? "bg-blue-100" : "hover:bg-blue-50"}`}
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
                              className={`px-4 py-2 ${isMobile ? "block" : "whitespace-nowrap"}`}
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
              Você tem certeza que deseja <span className="font-medium text-gray-800"><span className="font-semibold text-red-600">excluir</span> este cliente da fila</span>?<br />
            </p>
          </div>
          <div className="flex justify-end cursor-pointer gap-2 pt-2">
            <Button variant="outline" onClick={handleCloseModal} disabled={isLoading}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleConfirmRemove} disabled={isLoading}>
              Excluir
            </Button>
          </div>
        </Modal>
      )}

      {editingClient && editingClient.filaId && editingClient.hash && (
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
              onSave={async (updatedFields) => {
                const payload = {
                  ...editingClient,
                  ...updatedFields,
                  dataHoraAleterado: new Date().toISOString(),
                };
                await editPerson(editingClient, updatedFields);
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