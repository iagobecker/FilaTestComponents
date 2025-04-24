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
import { FilaItem, StatusType } from "@/features/fila/types";
import { fetchFilaClientes } from "../services/FilaService";
import { Api, setAuthorizationHeader } from "@/api/api";
import { parseCookies } from "nookies";
import { parseISO } from "date-fns/parseISO";
import { differenceInMinutes } from "date-fns/differenceInMinutes";
import { toast } from "sonner";
import { padraoCliente } from "@/lib/utils/padraoCliente";



export type BaseClientItem = {
  id: string;
  ticket: string | null;
  nome: string;
  telefone: string;
  observacao: string;
  tempo: string;
  status: StatusType;
  posicao?: number;
  dataHoraCriado?: string;
  dataHoraOrdenacao?: string;
  dataHoraChamada?: string | null;
  dataHoraDeletado?: string | null;
};

type ClienteAtualizado = {
  id: string;
  nome: string;
  telefone: string;
  status: StatusType;
  observacao?: string;
  ticket?: string | null;
  tempo?: string;
};

type FilaItemExt = BaseClientItem;
type ChamadaItem = BaseClientItem;

interface FilaContextType {
  selectedCount: number;
  setSelectedCount: (count: number) => void;
  filaData: FilaItemExt[];
  setFilaData: Dispatch<SetStateAction<FilaItemExt[]>>;
  chamadasData: ChamadaItem[];
  setChamadasData: Dispatch<SetStateAction<ChamadaItem[]>>;
  chamarSelecionados: (ids: string[]) => Promise<void>;
  removerSelecionados: (selectedIds: string[]) => Promise<void>;
  trocarPosicaoCliente: (id: string, direction: "up" | "down") => Promise<void>;
  addPerson: (nome: string, telefone: string, observacao: string) => void;
  retornarParaFila: (id: string) => void;
  removerChamada: (id: string) => void;
  marcarComoAtendido: (id: string) => void;
  marcarComoNaoCompareceu: (id: string) => void;
  getStatusText: (status: StatusType) => string;
  getStatusColor: (status: StatusType) => string;
}

const FilaContext = createContext<FilaContextType | undefined>(undefined);

export const useFila = () => {
  const context = useContext(FilaContext);
  if (!context) {
    throw new Error("useFila deve ser usado dentro de um FilaProvider");
  }
  return context;
};

const getStatusText = (status: StatusType): string => {
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
    case 1: return "border-blue-400";
    case 2: return "border-green-400";
    case 3: return "border-blue-600";
    case 4: return "border-red-400";
    case 5: return "border-red-400";
    default: return "border-gray-700";
  }
};

export function FilaProvider({ children }: { children: ReactNode }) {
  const [selectedCount, setSelectedCount] = useState(0);
  const [allClients, setAllClients] = useState<(FilaItemExt | ChamadaItem)[]>([]);
  const [notification, setNotification] = useState<string | null>(null);
  const [movingId, setMovingId] = useState<string | null>(null);

  const filaData = useMemo(() => {
    return allClients
      .filter(client => client.status === 1)
      .sort((a, b) => {
        const aData = new Date(a.dataHoraOrdenacao ?? a.dataHoraCriado ?? 0).getTime();
        const bData = new Date(b.dataHoraOrdenacao ?? b.dataHoraCriado ?? 0).getTime();
        return aData - bData;
      });
  }, [allClients]);


  const chamadasData = useMemo(() => {
    const mapa = new Map();
    for (const client of allClients) {
      if (client.status > 1) {
        mapa.set(client.id, client);
      }
    }
    return Array.from(mapa.values()) as ChamadaItem[];
  }, [allClients]);


  useEffect(() => {
    async function loadFila() {
      try {
        const { "auth.token": token } = parseCookies();
        if (token) setAuthorizationHeader(token);

        const fila = await fetchFilaClientes();

        // ORDENA pela propriedade posicao
        const ordenados = [...fila]
          .filter(item => item.status === 1)
          .sort((a, b) => {
            // Parseia datas ISO, garante que sempre tem valor
            const aData = new Date(a.dataHoraOrdenacao ?? a.dataHoraCriado ?? 0).getTime();
            const bData = new Date(b.dataHoraOrdenacao ?? b.dataHoraCriado ?? 0).getTime();
            return aData - bData; // ordem crescente
          });


        const chamados = fila.filter(item => item.status !== 1);

        //Mostra os clientes aguardando na ordem
        const renderAguardando = ordenados.map(item => ({
          ...item,
          id: item.id || crypto.randomUUID(),
          status: (typeof item.status === "string" ? parseInt(item.status) : item.status) as StatusType || 1,
          tempo: item.tempo || "há 0 minutos",
          ticket: item.ticket || null,
          observacao: item.observacao || "",
          dataHoraCriado: item.dataHoraCriado || new Date().toISOString(),
        }));

        const renderChamados = chamados.map(item => ({
          ...item,
          id: item.id || crypto.randomUUID(),
          status: (typeof item.status === "string" ? parseInt(item.status) : item.status) as StatusType || 1,
          tempo: item.tempo || "há 0 minutos",
          ticket: item.ticket || null,
          observacao: item.observacao || "",
          dataHoraCriado: item.dataHoraCriado || new Date().toISOString(),
        }));

        setAllClients([...renderAguardando, ...renderChamados]);
      } catch (error) {
        console.error("Erro ao carregar fila:", error);
      }
    }

    loadFila();
  }, []);

  const updateClientStatus = (id: string, status: StatusType) => {
    setAllClients(prev =>
      prev.map(client => client.id === id ? { ...client, status } : client)
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
      setChamadasData(prev => prev.filter(item => item.id !== id));
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
    const clientesAtualizados = response.data?.clientesAtualizados ?? [];

    setAllClients(prev => prev.map(client => {
      if (ids.includes(client.id)) {
        // Busca pelo cliente atualizado para pegar dataHoraCriado
        const atualizado = clientesAtualizados.find((c: ClienteAtualizado) => c.id === client.id);
        const criado = atualizado?.dataHoraCriado
          ? parseISO(atualizado.dataHoraCriado)
          : new Date();

        // Tempo relativo
        const minutos = differenceInMinutes(new Date(), criado);
        return {
          ...client, //novo objeto com spread
          status: 2, // Garante atualização
          tempo: minutos < 1 ? "Agora" : `há ${minutos} min`,
          ...(atualizado ? atualizado : {}),
        };
      }
      return client;
    }));

    setSelectedCount(0);
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
          clientesValidos.some((c) => c.id === client.id)
            ? { ...client, status: 5 }
            : client
        )
      );

      setSelectedCount(0);
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
      const filaAtualizada = await fetchFilaClientes();
      setAllClients(prev => [
        ...filaAtualizada.map(c => padraoCliente(c)),
        ...prev.filter(c => c.status !== 1)
      ]);
    } catch (error) {
      console.error("Erro ao adicionar cliente:", error);
    }
  };



  const setFilaData: Dispatch<SetStateAction<FilaItemExt[]>> = updater => {
    setAllClients(prev => {
      const fila = prev.filter(c => c.status === 1);
      const chamadas = prev.filter(c => c.status !== 1);
      let updated = typeof updater === "function" ? updater(fila as FilaItemExt[]) : updater;
      updated = [...updated].sort((a, b) => {
        const aData = new Date(a.dataHoraOrdenacao ?? a.dataHoraCriado ?? 0).getTime();
        const bData = new Date(b.dataHoraOrdenacao ?? b.dataHoraCriado ?? 0).getTime();
        return aData - bData;
      });
      return [...updated, ...chamadas];
    });
  };


  const setChamadasData: Dispatch<SetStateAction<ChamadaItem[]>> = updater => {
    setAllClients(prev => {
      const fila = prev.filter(c => c.status === 1);
      const chamadas = prev.filter(c => c.status !== 1);
      const updated = typeof updater === "function" ? updater(chamadas as ChamadaItem[]) : updater;
      return [...fila, ...updated];
    });
  };

  const contextValue: FilaContextType = {
    selectedCount,
    setSelectedCount,
    filaData,
    setFilaData,
    chamadasData,
    setChamadasData,
    chamarSelecionados,
    removerSelecionados,
    addPerson,
    retornarParaFila,
    removerChamada,
    marcarComoAtendido,
    marcarComoNaoCompareceu,
    getStatusText,
    getStatusColor,
    trocarPosicaoCliente,
  };

  return (
    <FilaContext.Provider value={contextValue}>
      {children}
    </FilaContext.Provider>
  );
}
