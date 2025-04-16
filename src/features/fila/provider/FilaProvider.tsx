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
import { FilaItem } from "@/features/fila/types";
import { fetchFilaClientes } from "../services/FilaService";
import { Api, setAuthorizationHeader } from "@/api/api";
import { parseCookies } from "nookies";

export type StatusType = 1 | 2 | 3 | 4 | 5;

type BaseClientItem = {
  id: string;
  ticket: string | null;
  nome: string;
  telefone: string;
  observacao: string;
  tempo: string;
  status: StatusType;
  dataHoraCriado?: string;
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
    case 4: return "Não Compareceu";
    case 5: return "Removido";
    default: return "Desconhecido";
  }
};

const getStatusColor = (status: StatusType): string => {
  switch (status) {
    case 1: return "border-blue-400";
    case 2: return "border-yellow-400";
    case 3: return "border-green-400";
    case 4: return "border-red-400";
    case 5: return "border-gray-400";
    default: return "border-gray-700";
  }
};

export function FilaProvider({ children }: { children: ReactNode }) {
  const [selectedCount, setSelectedCount] = useState(0);
  const [allClients, setAllClients] = useState<(FilaItemExt | ChamadaItem)[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  const filaData = useMemo(() => {
    return allClients.filter(client => client.status === 1) as FilaItemExt[];
  }, [allClients]);

  const chamadasData = useMemo(() => {
    return allClients.filter(client => client.status > 1) as ChamadaItem[];
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

  const retornarParaFila = (id: string) => {
    updateClientStatus(id, 1);
    setNotification("Cliente retornou à fila");
    setTimeout(() => setNotification(null), 3000);
  };

  const marcarComoAtendido = (id: string) => {
    Api.post("/api/empresas/filas/atender-clientes", { clienteIds: [id] });
    updateClientStatus(id, 3);
  };

  const marcarComoNaoCompareceu = (id: string) => {
    Api.post("/api/empresas/filas/desistir-clientes", { clienteIds: [id] });
    updateClientStatus(id, 4);
  };

  const removerChamada = (id: string) => {
    Api.post("/api/empresas/filas/remover-clientes", { clienteIds: [id] });
    updateClientStatus(id, 5);
  };

  const chamarSelecionados = async (ids: string[]) => {
    await Api.post("/api/empresas/filas/chamar-clientes", { clienteIds: ids });
    setAllClients(prev =>
      prev.map(client =>
        ids.includes(client.id)
          ? { ...client, status: 2, tempo: "Agora" }
          : client
      )
    );
    setSelectedCount(0);
  };

  const removerSelecionados = async (ids: string[]) => {
    await Api.post("/api/empresas/filas/remover-clientes", { clienteIds: ids });
    setAllClients(prev =>
      prev.map(client =>
        ids.includes(client.id) ? { ...client, status: 5 } : client
      )
    );
    setSelectedCount(0);
    setNotification(`${ids.length} cliente(s) removido(s)`);
    setTimeout(() => setNotification(null), 3000);
  };

  const addPerson = (nome: string, telefone: string, observacao: string) => {
    const novaPessoa: FilaItemExt = {
      id: crypto.randomUUID(),
      nome,
      telefone,
      observacao,
      ticket: null,
      status: 1,
      tempo: "há 0 minutos",
      dataHoraCriado: new Date().toISOString(),
    };
    setAllClients(prev => [...prev, novaPessoa]);
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
