"use client";

import { Button } from "@/components/ui/button";
import { useFilaContext } from "@/features/fila/context/FilaProvider";
import { useState } from "react";
import { Modal } from "@/components/Modal";
import { DialogTitle } from "@/components/ui/dialog";
import { Trash } from "lucide-react";

interface FilaActionsProps {
  selectedCount: number;
  selectedIds: string[];
  onResetSelection: () => void;
}

export function FilaActions({
  selectedCount,
  selectedIds,
  onResetSelection
}: FilaActionsProps) {

  const [showModal, setShowModal] = useState(false);
  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const { removerSelecionados, chamarSelecionados, filaData, chamadasData } = useFilaContext();

  const handleConfirmRemove = async () => {
    const todosClientes = [...filaData, ...chamadasData];
    const idsValidos = selectedIds.filter(id => {
      const cliente = todosClientes.find(c => c.id === id);
      return cliente && (cliente.status === 1 || cliente.status === 2);
    });
  
    if (idsValidos.length === 0) {
      alert("Nenhum cliente com status válido para remover.");
      handleCloseModal();
      return;
    }
  
    await removerSelecionados(idsValidos);
    onResetSelection?.();
    handleCloseModal();
  };

  if (selectedCount === 0) return null;

  return (
    <>
      <div className="flex flex-col md:flex-row justify-end gap-2 py-2">
        <Button
          onClick={() => {
            chamarSelecionados(selectedIds);
            onResetSelection?.();
          }}
          className="bg-white hover:bg-green-100 text-green-600 px-3 py-1 rounded-md flex items-center gap-2 border border-green-400"
        >
          Chamar selecionados
          <span className="bg-white text-green-600 px-2 py-0.5 rounded-full text-sm font-semibold">
            {selectedCount}
          </span>
        </Button>

        <Button
          onClick={handleOpenModal}
          className="bg-white hover:bg-red-100 text-red-600 px-3 py-1 rounded-md flex items-center gap-2 border border-red-400"
        >
          Remover selecionados
          <span className="bg-white text-red-600 px-2 py-0.5 rounded-full text-sm font-semibold">
            {selectedCount}
          </span>
        </Button>
      </div>

      {/* Modal de confirmação para múltiplos itens */}
      {showModal && (
        <Modal open={showModal} onClose={handleCloseModal}>
          <div className="max-w-sm p-1 space-y-4 text-left">
            <div className="flex items-center gap-2">
              <div className="bg-red-100 text-red-600 p-2 rounded-full">
                <Trash className="w-5 h-5" />
              </div>
              <DialogTitle className="text-lg font-semibold text-gray-900">
                {selectedCount > 1 ? `Excluir ${selectedCount} clientes` : 'Excluir cliente'}
              </DialogTitle>
            </div>
            <p className="text-sm text-gray-600">
              {selectedCount > 1 ? (
                <>
                  Você tem certeza que deseja <span className="font-medium text-gray-800">excluir {selectedCount} clientes da fila</span>?<br />
                  Essa ação <span className="font-semibold text-red-600">não poderá ser desfeita</span>.
                </>
              ) : (
                <>
                  Você tem certeza que deseja <span className="font-medium text-gray-800">excluir este cliente da fila</span>?<br />
                  Essa ação <span className="font-semibold text-red-600">não poderá ser desfeita</span>.
                </>
              )}
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
    </>
  );
}