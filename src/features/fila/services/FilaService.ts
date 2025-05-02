'use client';

import { Api } from "@/api/api";
import { FilaItem, FilaResponse, StatusType, ClienteAtualizado, EditaCampos } from "@/features/fila/components/types/types";
import { padraoCliente } from "@/lib/utils/padraoCliente";
import { toast } from "sonner";
import { parseISO } from "date-fns/parseISO";
import { differenceInMinutes } from "date-fns/differenceInMinutes";
import React, { Dispatch, SetStateAction } from "react"; // Adicionada a importação de React com Dispatch e SetStateAction

export async function buscarClientesFila(): Promise<FilaItem[]> {
  const response = await Api.get("/empresas/filas/b36f453e-a763-4ee1-ae2d-6660c2740de5/pegar-dados-fila");
  const filas: FilaResponse = response.data;
  return filas.clientes.map(padraoCliente);
}

export const trocarPosicaoCliente = async (
  id: string,
  direction: "up" | "down",
  setAllClients: (updater: (prev: FilaItem[]) => FilaItem[]) => void
): Promise<void> => {
  const fila = await buscarClientesFila()
    .then(fila =>
      fila
        .filter(c => c.status === 1)
        .sort((a, b) => (a.posicao! - b.posicao!))
    );

  const index = fila.findIndex(c => c.id === id);
  if (index === -1) return;

  let novaPosicao = fila[index].posicao!;

  if (direction === "up" && index > 0) {
    novaPosicao = fila[index].posicao! - 1;
  } else if (direction === "down" && index < fila.length - 1) {
    novaPosicao = fila[index].posicao! + 1;
  } else {
    return;
  }

  try {
    const res = await Api.post("/empresas/filas/trocar-posicao-cliente", {
      id,
      novaPosicao,
    });

    const clientesAPI = res.data;

    setAllClients(prev => {
      const chamados = prev.filter(c => c.status !== 1);
      const aguardando = clientesAPI
        .filter((c: any) => c.status === 1)
        .map((item: any) => ({
          ...item,
          tempo: prev.find(c => c.id === item.id)?.tempo ?? "há 0 minutos",
        }));
      return [...aguardando, ...chamados];
    });

    toast.success("Posição alterada com sucesso!");
  } catch (err) {
    toast.error("Erro ao mover cliente");
  }
};

export const marcarComoAtendido = async (
  id: string,
  setAllClients: (updater: (prev: FilaItem[]) => FilaItem[]) => void
): Promise<void> => {
  try {
    await Api.post("/empresas/filas/clientes/atualizar-clientes", {
      ids: [id],
      acao: 3, // AtenderClientes
    });

    setAllClients(prev =>
      prev.map(client => client.id === id ? { ...client, status: 3 } : client)
    );

    toast.success("Cliente marcado como atendido!");
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Erro ao marcar como atendido");
  }
};

export const marcarComoNaoCompareceu = async (
  id: string,
  setAllClients: (updater: (prev: FilaItem[]) => FilaItem[]) => void
): Promise<void> => {
  try {
    await Api.post("/empresas/filas/clientes/atualizar-clientes", {
      ids: [id],
      acao: 5, // DesistirClientes
    });

    setAllClients(prev =>
      prev.map(client => client.id === id ? { ...client, status: 5 } : client)
    );

    toast.success("Cliente marcado como não compareceu!");
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Erro ao marcar como não compareceu");
  }
};

export const removerChamada = async (
  id: string,
  setAllClients: (updater: (prev: FilaItem[]) => FilaItem[]) => void,
  setChamadasData: Dispatch<SetStateAction<FilaItem[]>> // Corrigido o tipo com Dispatch de React
): Promise<void> => {
  try {
    await Api.post("/empresas/filas/clientes/atualizar-clientes", {
      ids: [id],
      acao: 4, // RemoverClientes (soft delete)
    });

    setChamadasData(prev => prev.filter(item => item.id !== id));
    setAllClients(prev => prev.filter(item => item.id !== id));

    toast.success("Cliente removido com sucesso!");
  } catch (error: any) {
    toast.error(
      error?.response?.data?.message ||
      "Não foi possível remover o cliente"
    );
  }
};

export const retornarParaFila = async (
  id: string,
  setAllClients: (updater: (prev: FilaItem[]) => FilaItem[]) => void
): Promise<void> => {
  try {
    await Api.post("/empresas/filas/clientes/atualizar-clientes", {
      ids: [id],
      acao: 6, // VoltarParaFilaClientes
    });

    setAllClients(prev =>
      prev.map(client => client.id === id ? { ...client, status: 1 } : client)
    );

    toast.success("Cliente retornou à fila!");
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Erro ao retornar cliente para a fila");
  }
};

export const chamarSelecionados = async (
  ids: string[],
  setAllClients: (updater: (prev: FilaItem[]) => FilaItem[]) => void,
  setContagemSelecionada: (count: number) => void
): Promise<void> => {
  try {
    const response = await Api.post(
      "/empresas/filas/clientes/atualizar-clientes",
      { ids, acao: 2 }
    );
    const clientesAtualizados = response.data?.clientesAtualizados ?? [];

    setAllClients(prev => prev.map(client => {
      if (ids.includes(client.id)) {
        const atualizado = clientesAtualizados.find((c: ClienteAtualizado) => c.id === client.id);
        const criado = atualizado?.dataHoraCriado
          ? parseISO(atualizado.dataHoraCriado)
          : new Date();

        const minutos = differenceInMinutes(new Date(), criado);
        return {
          ...client,
          status: 2,
          tempo: minutos < 1 ? "Agora" : `há ${minutos} min`,
          ...(atualizado ? atualizado : {}),
        };
      }
      return client;
    }));

    setContagemSelecionada(0);
    toast.success("Clientes chamados com sucesso!");
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Erro ao chamar clientes");
  }
};

export const removerSelecionados = async (
  ids: string[],
  allClients: FilaItem[],
  setAllClients: (updater: (prev: FilaItem[]) => FilaItem[]) => void,
  setContagemSelecionada: (count: number) => void
): Promise<void> => {
  const clientesValidos = allClients.filter(
    (c) => ids.includes(c.id) && (c.status === 1 || c.status === 2)
  );

  if (clientesValidos.length === 0) {
    console.warn("Nenhum cliente com status válido para remoção.");
    return;
  }

  try {
    await Api.post("/empresas/filas/clientes/atualizar-clientes", {
      ids: clientesValidos.map((c) => c.id),
      acao: 4, // RemoverClientes
    });

    setAllClients((prev) =>
      prev.map((client) =>
        clientesValidos.some((c) => c.id === client.id)
          ? { ...client, status: 5 }
          : client
      )
    );

    setContagemSelecionada(0);
    toast.success(`${clientesValidos.length} cliente(s) removido(s)`);
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Erro ao remover clientes");
  }
};

export const addPerson = async (
  nome: string,
  telefone: string,
  observacao: string,
  setAllClients: (updater: (prev: FilaItem[]) => FilaItem[]) => void
): Promise<void> => {
  try {
    const payload = {
      nome,
      telefone,
      observacao,
      filaId: "b36f453e-a763-4ee1-ae2d-6660c2740de5",
    };

    await Api.post("/empresas/filas/clientes/adicionar-cliente", payload);

    const filaAtualizada = await buscarClientesFila();
    setAllClients(prev => [
      ...filaAtualizada.map(c => padraoCliente(c)),
      ...prev.filter(c => c.status !== 1)
    ]);

    toast.success("Cliente adicionado com sucesso!");
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Erro ao adicionar cliente");
  }
};

export const editPerson = async (
  clienteCompleto: FilaItem,
  camposEditados: EditaCampos,
  setAllClients: (updater: (prev: FilaItem[]) => FilaItem[]) => void
): Promise<void> => {
  const payload = {
    ...clienteCompleto,
    ...camposEditados,
    dataHoraAlterado: new Date().toISOString(),
    filaId: clienteCompleto.filaId ?? "",
    hash: clienteCompleto.hash ?? "",
    ticket: clienteCompleto.ticket ?? null,
    posicao: clienteCompleto.posicao !== undefined ? clienteCompleto.posicao : 0,
    dataHoraCriado: clienteCompleto.dataHoraCriado ?? new Date().toISOString(),
    dataHoraOrdenacao: clienteCompleto.dataHoraOrdenacao ?? clienteCompleto.dataHoraCriado ?? new Date().toISOString(),
    dataHoraChamada: clienteCompleto.dataHoraChamada ?? null,
    dataHoraDeletado: clienteCompleto.dataHoraDeletado ?? null,
    dataHoraEntrada: clienteCompleto.dataHoraEntrada ?? null,
  };

  if (!payload.filaId || !payload.hash) {
    console.error("Payload inválido: filaId e hash são obrigatórios.", payload);
    return;
  }

  try {
    await Api.put("/empresas/filas/clientes", payload);

    const filaAtualizada = await buscarClientesFila();
    setAllClients(prev => [
      ...filaAtualizada.map(c => padraoCliente(c)),
      ...prev.filter(c => c.status !== 1)
    ]);

    toast.success("Cliente editado com sucesso!");
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Erro ao editar cliente");
  }
};