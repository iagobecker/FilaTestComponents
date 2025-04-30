import { StatusType } from "@/features/fila/components/types/filaTypes";

export const getStatusText = (status: StatusType): string => {
  switch (status) {
    case 1: return "Aguardando";
    case 2: return "Chamado";
    case 3: return "Atendido";
    case 4: return "Desistente";
    case 5: return "Removido";
    default: return "Desconhecido";
  }
};

export const getStatusColor = (status: StatusType): string => {
  switch (status) {
    case 1: return "text-blue-500";
    case 2: return "text-green-500";
    case 3: return "text-green-700";
    case 4: return "text-yellow-500";
    case 5: return "text-red-400";
    default: return "text-gray-700";
  }
};
