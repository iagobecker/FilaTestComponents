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



export type BaseClientItem = {
  id: string;
  ticket: string | null;
  nome: string;
  telefone: string;
  observacao: string;
  tempo: string;
  status: StatusType;
  dataHoraCriado?: string;
};

enum AcoesAdminClientesEnum {
  AdicionarCliente = 1,
  ChamarClientes = 2,
  AtenderClientes = 3,
  RemoverClientes = 4,
  DesistirClientes = 5,
  VoltarParaFilaClientes = 6,
  TrocarPosicaoCliente = 7,
}

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

  const filaData = useMemo(() => {
    const mapa = new Map();
    for (const client of allClients) {
      if (client.status === 1) {
        mapa.set(client.id, client);
      }
    }
    return Array.from(mapa.values()) as FilaItemExt[];
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
        const render = fila.map(item => ({
          ...item,
          id: item.id || crypto.randomUUID(),
          status: (typeof item.status === "string" ? parseInt(item.status) : item.status) as StatusType || 1,
          tempo: item.tempo || "há 0 minutos",
          ticket: item.ticket || null,
          observacao: item.observacao || "",
          dataHoraCriado: item.dataHoraCriado || new Date().toISOString(),
        }));
        setAllClients(render);
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
    await Api.post("/empresas/filas/clientes/atualizar-clientes", {
      ids: [id],
      acao: 4, // RemoverClientes
    });
    updateClientStatus(id, 5);
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
  


  const addPerson = async (nome: string, telefone: string, observacao: string) => {
    const now = new Date().toISOString();

    const payload = {
      nome,
      telefone,
      observacao,
      filaId: "b36f453e-a763-4ee1-ae2d-6660c2740de5", // usar variável dinâmica depois dos testes
      dataHoraCriado: now,
      dataHoraAlterado: now,
      dataHoraOrdenacao: now,
      dataHoraDeletado: null,
      dataHoraChamada: null,
      ticket: null,
      hash: Math.random().toString(36).substring(2),
    };

    try {
      const response = await Api.post("/empresas/filas/clientes/adicionar-cliente", payload);
      const clienteCriado = response.data;

      setAllClients(prev => [
        ...prev,
        {
          ...clienteCriado,
          tempo: "há 0 minutos",
          status: 1,
        },
      ]);
    } catch (error) {
      console.error("Erro ao adicionar cliente:", error);
    }
  };


  const setFilaData: Dispatch<SetStateAction<FilaItemExt[]>> = updater => {
    setAllClients(prev => {
      const fila = prev.filter(c => c.status === 1);
      const chamadas = prev.filter(c => c.status !== 1);
      const updated = typeof updater === "function" ? updater(fila as FilaItemExt[]) : updater;
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
  };

  return (
    <FilaContext.Provider value={contextValue}>
      {children}
    </FilaContext.Provider>
  );
}
