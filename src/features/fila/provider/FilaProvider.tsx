"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useMemo,
  Dispatch,
  SetStateAction,
} from "react";
import { ChamadaItem, ClienteAtualizado, ClienteDTO, EditaCampos, FilaItem, FilaItemExt, StatusType } from "@/features/fila/types";
import { buscarClientesFila } from "../services/FilaService";
import { Api, setAuthorizationHeader } from "@/api/api";
import { parseCookies } from "nookies";// Utilitário para ler cookies
import { parseISO } from "date-fns/parseISO";
import { differenceInMinutes } from "date-fns/differenceInMinutes";
import { toast } from "sonner";
import { padraoCliente } from "@/lib/utils/padraoCliente"; // Função para padronizar o cliente

// interface descrevendo tudo que será compartilhado no contexto
interface FilaContextType {
  contagemSelecionada: number;
  setContagemSelecionada: (count: number) => void;
  filaData: FilaItemExt[];
  setFilaData: Dispatch<SetStateAction<FilaItemExt[]>>;
  chamadasData: ChamadaItem[];
  setChamadasData: Dispatch<SetStateAction<ChamadaItem[]>>;
  chamarSelecionados: (ids: string[]) => Promise<void>;
  removerSelecionados: (selectedIds: string[]) => Promise<void>;
  trocarPosicaoCliente: (id: string, direction: "up" | "down") => Promise<void>;
  addPerson: (nome: string, telefone: string, observacao: string) => void;
  editPerson: (clienteCompleto: FilaItem, camposEditados: EditaCampos) => void;
  retornarParaFila: (id: string) => void;
  removerChamada: (id: string) => void;
  marcarComoAtendido: (id: string) => void;
  marcarComoNaoCompareceu: (id: string) => void;
  getStatusText: (status: StatusType) => string;
  getStatusColor: (status: StatusType) => string;
  calcularTempo: (dataHoraCriado?: string) => string;
  editPayload: (orig: FilaItem, edicao: EditaCampos) => FilaItem;
}

// Cria o contexto com um valor padrão indefinido
const FilaContext = createContext<FilaContextType | undefined>(undefined);

// Hook para acessar o contexto de forma mais fácil
export const useFilaContext = () => {
  const context = useContext(FilaContext); // acessa o contexto atual
  if (!context) {
    throw new Error("useFilaContext deve ser usado dentro de um FilaProvider");
  }
  return context;
};

const getStatusText = (status: StatusType): string => { // Função para retornar o texto do status
  switch (status) {
    case 1: return "Aguardando";
    case 2: return "Chamado";
    case 3: return "Atendido";
    case 4: return "Desistente";
    case 5: return "Removido";
    default: return "Desconhecido";
  }
};

const getStatusColor = (status: StatusType): string => {
  switch (status) {
    case 1: return "text-blue-500";
    case 2: return "text-green-500";
    case 3: return "text-green-700";
    case 4: return "text-yellow-500";
    case 5: return "text-red-400";
    default: return "text-gray-700";
  }
};

export function FilaProvider({ children }: { children: ReactNode }) {
  const [contagemSelecionada, setContagemSelecionada] = useState(0);
  const [allClients, setAllClients] = useState<(FilaItemExt | ChamadaItem)[]>([]); // podem ser do tipo FilaItemExt ou ChamadaItem
  const [notification, setNotification] = useState<string | null>(null);

  const filaData = useMemo(() => {
    return allClients
      .filter(client => client.status === 1)
      .sort((a, b) => { // Ordena pela data de criação ou ordenação
        const aData = new Date(a.dataHoraOrdenacao ?? a.dataHoraCriado ?? 0).getTime();
        const bData = new Date(b.dataHoraOrdenacao ?? b.dataHoraCriado ?? 0).getTime();
        return aData - bData; // ordem crescente mais antigo para o mais novo
      });
  }, [allClients]); // só recalcula quando allClients muda


  const chamadasData = useMemo(() => {
    const mapa = new Map(); // estrutura de dados que armazena pares chave-valor únicos
    for (const client of allClients) {
      if (client.status > 1) {
        mapa.set(client.id, client);
      }
    } // percorre todos os clientes e adiciona ao mapa se o status for maior que 1
    return Array.from(mapa.values()) as ChamadaItem[];
  }, [allClients]);


  useEffect(() => {
    async function loadFila() {
      try {
        const { "auth.token": token } = parseCookies(); // lê o cookie de autenticação
        if (token) setAuthorizationHeader(token); // define o cabeçalho de autorização na API

        const fila = await buscarClientesFila();

        // ORDENA pela propriedade posicao
        const ordenados = [...fila]
          .filter(item => item.status === 1)
          .sort((a, b) => {
            const aData = new Date(a.dataHoraOrdenacao ?? a.dataHoraCriado ?? 0).getTime();
            const bData = new Date(b.dataHoraOrdenacao ?? b.dataHoraCriado ?? 0).getTime();
            return aData - bData; // ordem crescente
          });


        const chamados = fila.filter(item => item.status !== 1);

        //Mostra os clientes aguardando na ordem
        const renderAguardando = ordenados.map(item => ({
          ...item,
          id: item.id || crypto.randomUUID(), // Gera um ID único se não houver
          filaId: item.filaId ?? "",
          hash: item.hash ?? "",
          status: (typeof item.status === "string" ? parseInt(item.status) : item.status) as StatusType || 1,
          tempo: item.tempo || "há 0 minutos",
          ticket: item.ticket || null,
          observacao: item.observacao || "",
          dataHoraCriado: item.dataHoraCriado || new Date().toISOString(),
        }));

        const renderChamados = chamados.map(item => ({
          ...item,
          id: item.id || crypto.randomUUID(),
          filaId: item.filaId ?? "",
          hash: item.hash ?? "",
          status: (typeof item.status === "string" ? parseInt(item.status) : item.status) as StatusType || 1,
          tempo: item.tempo || "há 0 minutos",
          ticket: item.ticket || null,
          observacao: item.observacao || "",
          dataHoraCriado: item.dataHoraCriado || new Date().toISOString(),
        }));

        setAllClients([...renderAguardando, ...renderChamados]); // Atualiza o estado com os clientes aguardando e chamados
      } catch (error) {
        console.error("Erro ao carregar fila:", error);
      }
    }

    loadFila();
  }, []);

  const updateClientStatus = (id: string, status: StatusType) => {
    setAllClients(prev =>
      prev.map(client => client.id === id ? { ...client, status } : client)  // usa o spread operator para copiar todos os dados do cliente e substitui apenas o campo status pelo novo status informado
    );
  };

  const marcarComoAtendido = async (id: string) => {
    await Api.post("/empresas/filas/clientes/atualizar-clientes", {
      ids: [id],
      acao: 3, // AtenderClientes
    });
    updateClientStatus(id, 3);
  };

  const marcarComoNaoCompareceu = async (id: string) => {
    await Api.post("/empresas/filas/clientes/atualizar-clientes", {
      ids: [id],
      acao: 5, // DesistirClientes
    });
    updateClientStatus(id, 5);
  };

  const removerChamada = async (id: string) => {
    try {
      await Api.post("/empresas/filas/clientes/atualizar-clientes", {
        ids: [id],
        acao: 4, // RemoverClientes (soft delete)
      });

      // Remove do estado local para sumir da tabela imediatamente
      setChamadasData(prev => prev.filter(item => item.id !== id)); // Mantém só os itens cujo id é diferente do cliente removido.
      // se está em allClients:
      setAllClients(prev => prev.filter(item => item.id !== id));

      toast.success("Cliente removido com sucesso!");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
        "Não foi possível remover o cliente"
      );
    }
  };



  const retornarParaFila = async (id: string) => {
    await Api.post("/empresas/filas/clientes/atualizar-clientes", {
      ids: [id],
      acao: 6, // VoltarParaFilaClientes
    });
    updateClientStatus(id, 1);
    setNotification("Cliente retornou à fila");
    setTimeout(() => setNotification(null), 3000);
  };


  const chamarSelecionados = async (ids: string[]) => {
    const response = await Api.post(
      "/empresas/filas/clientes/atualizar-clientes",
      { ids, acao: 2 }
    );
    const clientesAtualizados = response.data?.clientesAtualizados ?? []; // Resposta da API com os clientes atualizados

    setAllClients(prev => prev.map(client => {
      if (ids.includes(client.id)) { // Verifica se o cliente está na lista de IDs selecionados
        // Busca pelo cliente atualizado para pegar dataHoraCriado
        const atualizado = clientesAtualizados.find((c: ClienteAtualizado) => c.id === client.id); // busca o cliente atualizado pelo id | compara os ids
        const criado = atualizado?.dataHoraCriado
          ? parseISO(atualizado.dataHoraCriado)
          : new Date(); // Se não houver dataHoraCriado, usa a data atual

        // Tempo relativo
        const minutos = differenceInMinutes(new Date(), criado); // Calcula a diferença em minutos entre a data atual e a data de criação
        return {
          ...client, //novo objeto com spread
          status: 2, // Garante atualização
          tempo: minutos < 1 ? "Agora" : `há ${minutos} min`,
          ...(atualizado ? atualizado : {}),
        };
      }
      return client;
    }));

    setContagemSelecionada(0);
  };


  const removerSelecionados = async (ids: string[]) => {
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
          clientesValidos.some((c) => c.id === client.id) // retorna true se algum cliente em clientesValidos tem o mesmo id
            ? { ...client, status: 5 }
            : client
        )
      );

      setContagemSelecionada(0);
      setNotification(`${clientesValidos.length} cliente(s) removido(s)`);
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error("Erro ao remover clientes:", error);
    }
  };

  const trocarPosicaoCliente = async (id: string, direction: "up" | "down") => { // id e direction como parametro
    const fila = allClients // lista todos os clientes do context
      .filter(c => c.status === 1) // filtra os clientes com status 1 (aguardando)
      .sort((a, b) => (a.posicao! - b.posicao!)); // Ordena pelo campo posicao, o ! é para garantir que não seja undefined

    const index = fila.findIndex(c => c.id === id); // Encontra o índice do cliente na fila
    if (index === -1) return; // Se não encontrar, não faz nada

    let novaPosicao = fila[index].posicao!; // inicializa a nova posição com a posição atual do cliente

    if (direction === "up" && index > 0) { // Se a direção for "up" e não estiver no topo
      novaPosicao = fila[index].posicao! - 1; // Decrementa a posição (subindo na fila)
    } else if (direction === "down" && index < fila.length - 1) { // Se a direção for "down" e não estiver no final
      novaPosicao = fila[index].posicao! + 1; // Incrementa a posição (descendo na fila)
    } else {
      // Está no topo ou base, não faz nada
      return;
    }

    try {
      const res = await Api.post("/empresas/filas/trocar-posicao-cliente", { // Chama a API para trocar a posição
        id,
        novaPosicao,
      }); // Envia o id e a nova posição para a API

      // Atualize seu estado local com o retorno da API
      const clientesAPI = res.data; // Resposta da API com os clientes atualizados
      setAllClients(prev => { // Atualiza o estado local
        const chamados = prev.filter(c => c.status !== 1); // Filtra os chamados (status diferente de 1)
        const aguardando = clientesAPI // Filtra os clientes aguardando (status 1)
          .filter((c: any) => c.status === 1) // Filtra os clientes aguardando (status 1)
          .map((item: any) => ({ // Mapeia os clientes aguardando para o formato correto
            ...item, // Espalha as propriedades do cliente
            tempo: prev.find(c => c.id === item.id)?.tempo ?? "há 0 minutos" // Mantém o tempo do cliente original ou define como "há 0 minutos"
          }));
        return [...aguardando, ...chamados]; // Retorna a nova lista de clientes, com os aguardando atualizados e os chamados inalterados
      });

      toast.success("Posição alterada com sucesso!");
    } catch (err) {
      toast.error("Erro ao mover cliente");
    }
  };


  const addPerson = async (nome: string, telefone: string, observacao: string) => {
    try {
      const payload = {
        nome,
        telefone,
        observacao,
        filaId: "b36f453e-a763-4ee1-ae2d-6660c2740de5",
      };

      await Api.post("/empresas/filas/clientes/adicionar-cliente", payload);

      // Sempre buscar a fila completa do backend
      const filaAtualizada = await buscarClientesFila();
      setAllClients(prev => [ // Atualiza o estado com os clientes da fila
        ...filaAtualizada.map(c => padraoCliente(c)), // Padroniza os clientes
        ...prev.filter(c => c.status !== 1) // Mantém os clientes que não estão aguardando
      ]);
    } catch (error) {
      console.error("Erro ao adicionar cliente:", error);
    }
  };

  const editPerson = async (clienteCompleto: FilaItem, camposEditados: EditaCampos) => {
    const payload = editPayload(clienteCompleto, camposEditados);

    // Valide ANTES de enviar!
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
    } catch (error) {
      console.error("Erro ao editar cliente:", error);
    }
  };

  const editPayload = (orig: FilaItem, edicao: EditaCampos): FilaItem => {
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
    }
  }

  const setFilaData: Dispatch<SetStateAction<FilaItemExt[]>> = updater => { // Atualiza a fila de clientes
    setAllClients(prev => { // Atualiza o estado com os clientes da fila
      const fila = prev.filter(c => c.status === 1); // Filtra os clientes com status 1 (aguardando)
      const chamadas = prev.filter(c => c.status !== 1); // Filtra os clientes com status diferente de 1 (chamados)
      let updated = typeof updater === "function" ? updater(fila as FilaItemExt[]) : updater; // Atualiza a fila com os novos dados
      updated = [...updated].sort((a, b) => {
        const aData = new Date(a.dataHoraOrdenacao ?? a.dataHoraCriado ?? 0).getTime();
        const bData = new Date(b.dataHoraOrdenacao ?? b.dataHoraCriado ?? 0).getTime();
        return aData - bData;
      }); // Ordena a fila pela data de criação ou ordenação
      return [...updated, ...chamadas]; // Retorna a nova lista de clientes, com os aguardando atualizados e os chamados inalterados
    });
  };


  const setChamadasData: Dispatch<SetStateAction<ChamadaItem[]>> = updater => { // Atualiza a lista de chamados
    setAllClients(prev => {
      const fila = prev.filter(c => c.status === 1);
      const chamadas = prev.filter(c => c.status !== 1); // todos os clientes que não estão aguardando
      const updated = typeof updater === "function" ? updater(chamadas as ChamadaItem[]) : updater;
      return [...fila, ...updated];
    });
  };

  const calcularTempo = (dataHoraCriado?: string): string => {
    if (!dataHoraCriado) return "";
    const criado = typeof dataHoraCriado === "string" ? parseISO(dataHoraCriado) : dataHoraCriado;
    const minutos = differenceInMinutes(new Date(), criado);
    if (minutos < 1) return "Agora";
    if (minutos < 60) return `há ${minutos} minutos`;
    const horas = Math.floor(minutos / 60);
    return `há ${horas}h${(minutos % 60).toString().padStart(2, "0")}`;
  }

  // Obj do Contexto com todos os dados e funções que serão compartilhados
  const contextValue: FilaContextType = {
    contagemSelecionada,
    setContagemSelecionada,
    filaData,
    setFilaData,
    chamadasData,
    setChamadasData,
    chamarSelecionados,
    removerSelecionados,
    addPerson,
    editPerson,
    retornarParaFila,
    removerChamada,
    marcarComoAtendido,
    marcarComoNaoCompareceu,
    getStatusText,
    getStatusColor,
    trocarPosicaoCliente,
    calcularTempo,
    editPayload,
  };

  return (
    <FilaContext.Provider value={contextValue}>
      {children}
    </FilaContext.Provider>
  );
}
