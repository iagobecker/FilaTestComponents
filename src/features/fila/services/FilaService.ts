import { Api } from "@/api/api";
import { FilaItem, FilaResponse, EditaCampos } from "@/features/fila/components/types/types";
import { padraoCliente } from "@/lib/utils/padraoCliente";
import { toast } from "sonner";
import { EmpresaService, Fila } from "@/features/auth/components/services/empresaService";

export interface Empresa {
  id: string;
  filas: Fila[];
}

export async function getDefaultFilaId(empresaId: string): Promise<string> {
  if (!empresaId) {
    throw new Error("Nenhum empresaId encontrado.");
  }
  const empresa = await EmpresaService.fetchEmpresa();
  if (!empresa.filas || empresa.filas.length === 0) {
    throw new Error("Nenhuma fila associada à empresa.");
  }
  return empresa.filas[0].id;
}

export async function buscarClientesFila(filaId: string): Promise<FilaItem[]> {
  try {
    const response = await Api.get(`/filas/${filaId}`);
    const filas: FilaResponse = response.data;
    return filas.clientes.map(padraoCliente);
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Erro ao buscar clientes da fila.");
    throw error;
  }
}

export const trocarPosicaoCliente = async (
  id: string,
  direction: "up" | "down",
  setAllClients: (updater: (prev: FilaItem[]) => FilaItem[]) => void,
  filaId: string
): Promise<void> => {
  const fila = await buscarClientesFila(filaId)
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
    const res = await Api.post("/clientes/trocar-posicao", {
      id,
      novaPosicao,
    });
    const clientesAtualizados = res.data.clientes.map(padraoCliente);

    setAllClients(() => [...clientesAtualizados]);

    toast.success("Posição alterada com sucesso!");
  } catch (err) {
    toast.error("Erro ao mover cliente");
    throw err;
  }
};

export const marcarComoAtendido = async (
  id: string,
  setAllClients: (updater: (prev: FilaItem[]) => FilaItem[]) => void
): Promise<void> => {
  try {
    const response = await Api.post("/clientes/atualizar-status", {
      ids: [id],
      acao: 3, // AtenderClientes
    });
    const clientesAtualizados = response.data.clientes.map(padraoCliente);

    setAllClients(() => [...clientesAtualizados]);

    toast.success("Cliente marcado como atendido!");
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Erro ao marcar como atendido");
    throw error;
  }
};

export const marcarComoNaoCompareceu = async (
  id: string,
  setAllClients: (updater: (prev: FilaItem[]) => FilaItem[]) => void
): Promise<void> => {
  try {
    const response = await Api.post("/clientes/atualizar-status", {
      ids: [id],
      acao: 5, // AusentarClientes 
    });
    const clientesAtualizados = response.data.clientes.map(padraoCliente);

    setAllClients(() => [...clientesAtualizados]);

    toast.success("Cliente marcado como não compareceu!");
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Erro ao marcar como não compareceu");
    throw error;
  }
};

export const removerChamada = async (
  id: string,
  setAllClients: (updater: (prev: FilaItem[]) => FilaItem[]) => void,
  setclientesRecentes: React.Dispatch<React.SetStateAction<FilaItem[]>>
): Promise<void> => {
  try {
    const response = await Api.post("/clientes/atualizar-status", {
      ids: [id],
      acao: 4, // RemoverClientes
    });
    const clientesAtualizados = response.data.clientes.map(padraoCliente);

    setAllClients(() => [...clientesAtualizados]);
    setclientesRecentes(prev => prev.filter(item => item.id !== id));

    toast.success("Cliente removido com sucesso!");
  } catch (error: any) {
    toast.error(
      error?.response?.data?.message || "Não foi possível remover o cliente"
    );
    throw error;
  }
};

export const retornarParaFila = async (
  id: string,
  setAllClients: (updater: (prev: FilaItem[]) => FilaItem[]) => void
): Promise<void> => {
  try {
    const response = await Api.post("/clientes/atualizar-status", {
      ids: [id],
      acao: 6, // VoltarParaFilaClientes
    });
    const clientesAtualizados = response.data.clientes.map(padraoCliente);

    setAllClients(() => [...clientesAtualizados]);

    toast.success("Cliente retornou à fila!");
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Erro ao retornar cliente para a fila");
    throw error;
  }
};

export const chamarSelecionados = async (
  ids: string[],
  setAllClients: (updater: (prev: FilaItem[]) => FilaItem[]) => void,
  setContagemSelecionada: (count: number) => void
): Promise<void> => {
  try {
    const response = await Api.post(
      "/clientes/atualizar-status",
      { ids, acao: 2 }
    );
    const clientesAtualizados = response.data.clientes.map(padraoCliente);

    setAllClients(() => [...clientesAtualizados]);

    setContagemSelecionada(0);
    toast.success("Clientes chamados com sucesso!");
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Erro ao chamar clientes");
    throw error;
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
    const response = await Api.post("/clientes/atualizar-status", {
      ids: clientesValidos.map((c) => c.id),
      acao: 4, // RemoverClientes
    });
    const clientesAtualizados = response.data.clientes.map(padraoCliente);

    setAllClients(() => [...clientesAtualizados]);

    setContagemSelecionada(0);
    toast.success(`${clientesValidos.length} cliente(s) removido(s)`);
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Erro ao remover clientes");
    throw error;
  }
};

export const addPerson = async (
  nome: string,
  telefone: string,
  observacao: string,
  setAllClients: (updater: (prev: FilaItem[]) => FilaItem[]) => void,
  filaId: string
): Promise<void> => {
  try {
    const payload = {
      nome,
      telefone,
      observacao,
      filaId,
    };

    const response = await Api.post("/clientes", payload);
    const clientesAtualizados = response.data.clientes.map(padraoCliente);

    setAllClients(() => [...clientesAtualizados]);

    toast.success("Cliente adicionado com sucesso!");
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Erro ao adicionar cliente");
    throw error;
  }
};

export const editPerson = async (
  clienteCompleto: FilaItem,
  camposEditados: EditaCampos,
  setAllClients: (updater: (prev: FilaItem[]) => FilaItem[]) => void,
  filaId: string
): Promise<void> => {
  const payload = {
    ...clienteCompleto,
    ...camposEditados,
    dataHoraAlterado: new Date().toISOString(),
    filaId: clienteCompleto.filaId ?? filaId,
    hash: clienteCompleto.hash ?? "",
    ticket: clienteCompleto.ticket ?? null,
    posicao: clienteCompleto.posicao !== undefined ? clienteCompleto.posicao : 0,
    dataHoraCriado: clienteCompleto.dataHoraCriado,
    dataHoraOrdenacao: clienteCompleto.dataHoraOrdenacao ?? clienteCompleto.dataHoraCriado,
    dataHoraChamada: clienteCompleto.dataHoraChamada ?? null,
    dataHoraDeletado: clienteCompleto.dataHoraDeletado ?? null,
    dataHoraEntrada: clienteCompleto.dataHoraEntrada ?? null,
  };

  if (!payload.filaId || !payload.hash) {
    console.error("Payload inválido: filaId e hash são obrigatórios.", payload);
    throw new Error("Payload inválido: filaId e hash são obrigatórios.");
  }

  try {
    const response = await Api.put("/clientes", payload);
    const clientesAtualizados = response.data.clientes.map(padraoCliente);
    setAllClients(() => [...clientesAtualizados]);
    toast.success("Cliente editado com sucesso!");
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Erro ao editar cliente");
    throw error;
  }
};