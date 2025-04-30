import { formatDistanceToNowStrict, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FilaItem, StatusType, Status } from "@/features/fila/components/types/filaTypes";

export function padraoCliente(cliente: any): FilaItem {
    // Validação de campos obrigatórios
    if (!cliente.id) {
        throw new Error(`Cliente sem 'id' detectado. Payload recebido: ${JSON.stringify(cliente)}`);
    }
    if (!cliente.filaId) {
        throw new Error(`Cliente sem 'filaId' detectado. Payload recebido: ${JSON.stringify(cliente)}`);
    }
    if (!cliente.hash) {
        throw new Error(`Cliente sem 'hash' detectado. Payload recebido: ${JSON.stringify(cliente)}`);
    }

    const dataHoraCriado = cliente.dataHoraCriado ?? cliente.dataHoraOrdenacao;
    if (!dataHoraCriado) {
        throw new Error(`Cliente sem 'dataHoraCriado' ou 'dataHoraOrdenacao' detectado. Payload recebido: ${JSON.stringify(cliente)}`);
    }

    return {
        id: cliente.id,
        filaId: cliente.filaId,
        hash: cliente.hash,
        status: typeof cliente.status === "number" && Object.values(Status).includes(cliente.status)
            ? cliente.status as StatusType
            : Status.Aguardando,
        nome: cliente.nome || "-",
        telefone: cliente.telefone || "-",
        observacao: cliente.observacao || "-",
        ticket: cliente.ticket ?? null,
        posicao: cliente.posicao ?? undefined,
        dataHoraOrdenacao: cliente.dataHoraOrdenacao ?? undefined,
        dataHoraChamada: cliente.dataHoraChamada ?? null,
        dataHoraCriado: cliente.dataHoraCriado ?? undefined,
        dataHoraAlterado: cliente.dataHoraAlterado ?? undefined,
        dataHoraEntrada: cliente.dataHoraEntrada ?? null,
        dataHoraDeletado: cliente.dataHoraDeletado ?? null,
        tempo: formatDistanceToNowStrict(parseISO(dataHoraCriado), { locale: ptBR, addSuffix: true }),
        _forceRender: Date.now(),
    };
}