import { Api } from "@/api/api";
import { formatDistanceToNowStrict, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import {  FilaItem, FilaResponse, StatusType } from "@/features/fila/types";

export async function fetchFilaClientes(): Promise<FilaItem[]> {
  const response = await Api.get("/empresas/filas/b36f453e-a763-4ee1-ae2d-6660c2740de5/pegar-dados-fila");
  const filas: FilaResponse = response.data;

  const clientes: FilaItem[] = filas.clientes.map((cliente): FilaItem => ({
    id: cliente.id,
    nome: cliente.nome,
    telefone: cliente.telefone ?? "-",
    observacao: cliente.observacao ?? "-",
    status: cliente.status as StatusType,
    ticket: cliente.ticket,
    dataHoraCriado: cliente.dataHoraCriado,
    dataHoraOrdenacao: cliente.dataHoraOrdenacao,
    tempo: formatDistanceToNowStrict(parseISO(cliente.dataHoraCriado), {
      locale: ptBR,
      addSuffix: true,
    }),
  }));

  return clientes;
}
