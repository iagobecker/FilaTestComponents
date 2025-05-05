import { parseISO } from "date-fns/parseISO";
import { differenceInMinutes } from "date-fns/differenceInMinutes";
import { EditaCampos, FilaItem, StatusType } from "@/features/fila/components/types/types";

export const calcularTempo = (dataHoraCriado?: string): string => {
  if (!dataHoraCriado) return "";
  const criado = typeof dataHoraCriado === "string" ? parseISO(dataHoraCriado) : dataHoraCriado;
  const minutos = differenceInMinutes(new Date(), criado);
  if (minutos < 1) return criado.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  if (minutos < 60) return `há ${minutos} minutos`;
  const horas = Math.floor(minutos / 60);
  return ` ${horas}h${(minutos % 60).toString().padStart(2, "0")}`;
};

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

export const editPayload = (orig: FilaItem, edicao: EditaCampos): FilaItem => {
    return {
      ...orig,
      ...edicao,
      dataHoraAlterado: new Date().toISOString(),
      filaId: orig.filaId ?? "",
      hash: orig.hash ?? "",
      ticket: orig.ticket ?? null,
      posicao: orig.posicao !== undefined ? orig.posicao : 0,
      dataHoraCriado: orig.dataHoraCriado ?? new Date().toISOString(),
      dataHoraOrdenacao: orig.dataHoraOrdenacao ?? orig.dataHoraCriado ?? new Date().toISOString(),
      dataHoraChamada: orig.dataHoraChamada ?? null,
      dataHoraDeletado: orig.dataHoraDeletado ?? null,
      dataHoraEntrada: orig.dataHoraEntrada ?? null,
    }
  }
