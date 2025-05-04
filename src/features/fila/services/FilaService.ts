import { Api } from "@/api/api";
import { FilaItem, FilaResponse, ClienteAtualizado, EditaCampos } from "@/features/fila/components/types/types";
import { padraoCliente } from "@/lib/utils/padraoCliente";
import { toast } from "sonner";
import { parseISO } from "date-fns/parseISO";
import { differenceInMinutes } from "date-fns/differenceInMinutes";
import { useAuth } from "@/features/auth/context/AuthContext";
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
    throw err;
  }
};

export const marcarComoAtendido = async (
  id: string,
  setAllClients: (updater: (prev: FilaItem[]) => FilaItem[]) => void
): Promise<void> => {
  try {
    await Api.post("/clientes/atualizar-status", {
      ids: [id],
      acao: 3, // AtenderClientes
    });

    setAllClients(prev =>
      prev.map(client => client.id === id ? { ...client, status: 3 } : client)
    );

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
    await Api.post("/clientes/atualizar-status", {
      ids: [id],
      acao: 5, // DesistirClientes
    });

    setAllClients(prev =>
      prev.map(client => client.id === id ? { ...client, status: 5 } : client)
    );

    toast.success("Cliente marcado como não compareceu!");
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Erro ao marcar como não compareceu");
    throw error;
  }
};

export const removerChamada = async (
  id: string,
  setAllClients: (updater: (prev: FilaItem[]) => FilaItem[]) => void,
  setChamadasData: React.Dispatch<React.SetStateAction<FilaItem[]>>
): Promise<void> => {
  try {
    await Api.post("/clientes/atualizar-status", {
      ids: [id],
      acao: 4, // RemoverClientes (soft delete)
    });

    setChamadasData(prev => prev.filter(item => item.id !== id));
    setAllClients(prev => prev.filter(item => item.id !== id));

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
    await Api.post("/clientes/atualizar-status", {
      ids: [id],
      acao: 6, // VoltarParaFilaClientes
    });

    setAllClients(prev =>
      prev.map(client => client.id === id ? { ...client, status: 1 } : client)
    );

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
    await Api.post("/clientes/atualizar-status", {
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
   
    await Api.post("/clientes", payload);

    const filaAtualizada = await buscarClientesFila(filaId);
    setAllClients(prev => [
      ...filaAtualizada.map(c => padraoCliente(c)),
      ...prev.filter(c => c.status !== 1)
    ]);

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
    dataHoraCriado: clienteCompleto.dataHoraCriado ?? new Date().toISOString(),
    dataHoraOrdenacao: clienteCompleto.dataHoraOrdenacao ?? clienteCompleto.dataHoraCriado ?? new Date().toISOString(),
    dataHoraChamada: clienteCompleto.dataHoraChamada ?? null,
    dataHoraDeletado: clienteCompleto.dataHoraDeletado ?? null,
    dataHoraEntrada: clienteCompleto.dataHoraEntrada ?? null,
  };

  if (!payload.filaId || !payload.hash) {
    console.error("Payload inválido: filaId e hash são obrigatórios.", payload);
    throw new Error("Payload inválido: filaId e hash são obrigatórios.");
  }

  try {
    await Api.put("/clientes", payload);

    const filaAtualizada = await buscarClientesFila(payload.filaId);
    setAllClients(prev => [
      ...filaAtualizada.map(c => padraoCliente(c)),
      ...prev.filter(c => c.status !== 1)
    ]);

    toast.success("Cliente editado com sucesso!");
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Erro ao editar cliente");
    throw error;
  }
};