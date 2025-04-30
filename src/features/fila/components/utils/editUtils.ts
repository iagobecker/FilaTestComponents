import { EditaCampos, FilaItem } from "@/features/fila/components/types/filaTypes";

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
  };
};
