import { Api } from "@/api/api";
import { FilaItem, ClienteAtualizado, FilaResponse } from "@/features/fila/components/types/filaTypes";
import { padraoCliente } from "@/lib/utils/padraoCliente";

interface DadosIniciaisResponse {
  clientes: FilaItem[];
  // Adicione outros campos que a API retorna
}

export const atualizarEndpoint = "/empresas/filas/clientes/atualizar-clientes";

export async function buscarClientesFila(): Promise<FilaItem[]> {
  const response = await Api.get("/empresas/filas/b36f453e-a763-4ee1-ae2d-6660c2740de5/pegar-dados-fila");
  const filas: FilaResponse = response.data;
  return filas.clientes.map(padraoCliente);
}

export async function chamarClientesSelecionados(ids: string[]): Promise<ClienteAtualizado[]> {
  const response = await Api.post(atualizarEndpoint, {
    ids,
    acao: 2,
  });
  if (!response.data?.clientesAtualizados || !Array.isArray(response.data.clientesAtualizados)) {
    throw new Error("Resposta inválida ao chamar clientes.");
  }
  return response.data.clientesAtualizados;
}

export async function removerClientes(ids: string[]): Promise<void> {
  await Api.post(atualizarEndpoint, {
    ids,
    acao: 4, // Remover clientes
  });
}

export async function marcarComoAtendido(id: string): Promise<void> {
  await Api.post(atualizarEndpoint, {
    ids: [id],
    acao: 3, // Marcar como atendido
  });
}

export async function marcarComoNaoCompareceu(id: string): Promise<void> {
  await Api.post(atualizarEndpoint, {
    ids: [id],
    acao: 5, // Marcar como desistente
  });
}

export async function retornarClienteParaFila(id: string): Promise<void> {
  await Api.post(atualizarEndpoint, {
    ids: [id],
    acao: 6, // Retornar para fila
  });
}

export async function trocarPosicaoCliente(id: string, novaPosicao: number): Promise<FilaItem[]> {
  const response = await Api.post("/empresas/filas/trocar-posicao-cliente", {
    id,
    novaPosicao,
  });
  return response.data; // Retorna a fila atualizada
}

interface NovoClientePayload {
  nome: string;
  telefone: string;
  observacao: string;
  filaId: string;
}

// Adicione esta função no seu service
export async function carregarDadosIniciais(): Promise<{
  filaData: FilaItem[];
  chamadasData: FilaItem[];
  }> {
  const response = await Api.get("/empresas/filas/b36f453e-a763-4ee1-ae2d-6660c2740de5/pegar-dados-fila");
  const filas: FilaResponse = response.data;
  
  const todosClientes = filas.clientes.map(padraoCliente);
  
  return {
    filaData: todosClientes.filter(c => c.status === 1),
    chamadasData: todosClientes.filter(c => c.status !== 1)
  };
}

export async function adicionarCliente(payload: NovoClientePayload): Promise<void> {
  await Api.post("/empresas/filas/clientes/adicionar-cliente", payload);
}

export async function editarCliente(payload: FilaItem): Promise<void> {
  await Api.put("/empresas/filas/clientes", payload);
}
