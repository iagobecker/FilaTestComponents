import { Api } from "@/api/api";
import { formatDistanceToNowStrict, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ClienteResponse, FilaItem } from "@/features/fila/types";

export async function fetchFilaClientes(): Promise<FilaItem[]> {
  const response = await Api.get("/empresas/filas/pegar-dados-filas");

  const clientes: FilaItem[] = response.data.flatMap((fila: { clientes: ClienteResponse[] }) =>
    fila.clientes.map((cliente): FilaItem => ({
      id: cliente.id,
      nome: cliente.nome,
      telefone: cliente.telefone ?? "-",
      observacao: cliente.observacao ?? "-",
      status: cliente.status === 1 ? "Aguardando" : "Desconhecido",
      tempo: formatDistanceToNowStrict(parseISO(cliente.dataHoraOrdenacao), {
        locale: ptBR,
        addSuffix: true,
      }),
      ticket: cliente.ticket,
    }))
  );

  return clientes;
}
