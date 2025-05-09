// import { formatDistanceToNowStrict, parseISO } from "date-fns";
// import { ptBR } from "date-fns/locale";
// import { FilaItem, StatusType } from "@/features/fila/components/types/types";
// import { normalizeKeys } from "@/lib/utils/normalizeKeys";

// export function padraoCliente(cliente: any): FilaItem {
//   // Normalizar as chaves do objeto cliente
//   const normalizedCliente = normalizeKeys(cliente);

//   const dataHoraCriado = normalizedCliente.dataHoraCriado ?? normalizedCliente.dataHoraOrdenacao ?? new Date().toISOString();

//   return {
//     status: normalizedCliente.status as StatusType,
//     nome: normalizedCliente.nome ?? "-",
//     ticket: normalizedCliente.ticket ?? null,
//     telefone: normalizedCliente.telefone ?? "-",
//     posicao: normalizedCliente.posicao,
//     observacao: normalizedCliente.observacao ?? "-",
//     filaId: normalizedCliente.filaId,
//     hash: normalizedCliente.hash,
//     dataHoraOrdenacao: normalizedCliente.dataHoraOrdenacao,
//     tempo: formatDistanceToNowStrict(parseISO(dataHoraCriado), {
//       locale: ptBR,
//       addSuffix: true,
//     }),
//     dataHoraChamada: normalizedCliente.dataHoraChamada ?? null,
//     id: normalizedCliente.id,
//     dataHoraCriado: normalizedCliente.dataHoraCriado,
//     dataHoraEntrada: normalizedCliente.dataHoraEntrada ?? null,
//     dataHoraDeletado: normalizedCliente.dataHoraDeletado ?? null,
//   };
// }


import { formatDistanceToNowStrict, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FilaItem, Status } from "@/features/fila/components/types/types";

export function padraoCliente(cliente: any): FilaItem {
  const dataHoraCriado = cliente.dataHoraCriado;

  return {
    ...cliente,
    status: cliente.status as Status,
    tempo: formatDistanceToNowStrict(parseISO(dataHoraCriado), {
      locale: ptBR,
      addSuffix: true,
    }),
  };
}