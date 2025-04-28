import { formatDistanceToNowStrict, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FilaItem, StatusType } from "@/features/fila/types";

export function padraoCliente(cliente: any): FilaItem {
    const dataHoraCriado = cliente.dataHoraCriado ?? cliente.dataHoraOrdenacao ?? new Date().toISOString();

    return {
        status: cliente.status as StatusType,
        nome: cliente.nome ?? "-",
        ticket: cliente.ticket ?? null,
        telefone: cliente.telefone ?? "-",
        posicao: cliente.posicao,
        observacao: cliente.observacao ?? "-",
        filaId: cliente.filaId,
        hash: cliente.hash,
        dataHoraOrdenacao: cliente.dataHoraOrdenacao,
        tempo: formatDistanceToNowStrict(parseISO(dataHoraCriado), {
            locale: ptBR,
            addSuffix: true,
        }),
        dataHoraChamada: cliente.dataHoraChamada ?? null,
        id: cliente.id,
        dataHoraCriado: cliente.dataHoraCriado,
        dataHoraEntrada: cliente.dataHoraEntrada ?? null,
        dataHoraDeletado: cliente.dataHoraDeletado ?? null,
    };
}
