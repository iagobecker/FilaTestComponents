import { formatDistanceToNowStrict, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FilaItem, StatusType } from "@/features/fila/types";

export function padraoCliente(cliente: any): FilaItem {
    const dataHoraCriado = cliente.dataHoraCriado ?? cliente.dataHoraOrdenacao ?? new Date().toISOString();

    return {
        id: cliente.id,
        nome: cliente.nome ?? "-",
        telefone: cliente.telefone ?? "-",
        observacao: cliente.observacao ?? "-",
        status: cliente.status as StatusType,
        ticket: cliente.ticket ?? null,
        posicao: cliente.posicao,
        dataHoraCriado: cliente.dataHoraCriado,
        dataHoraOrdenacao: cliente.dataHoraOrdenacao,
        tempo: formatDistanceToNowStrict(parseISO(dataHoraCriado), {
            locale: ptBR,
            addSuffix: true,
        }),
        dataHoraChamada: cliente.dataHoraChamada ?? null,
        dataHoraDeletado: cliente.dataHoraDeletado ?? null,
        dataHoraEntrada: cliente.dataHoraEntrada ?? null,
    };
}
