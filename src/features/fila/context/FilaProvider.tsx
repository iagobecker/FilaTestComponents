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
import { ChamadaItem, EditaCampos, FilaItem, FilaItemExt, StatusType } from "@/features/fila/components/types/types";
import {
  addPerson,
  buscarClientesFila,
  chamarSelecionados,
  editPerson,
  getDefaultFilaId,
  marcarComoAtendido,
  marcarComoNaoCompareceu,
  removerChamada,
  removerSelecionados,
  retornarParaFila,
  trocarPosicaoCliente,
} from "@/features/fila/services/FilaService";
import { setAuthorizationHeader } from "@/api/api";
import { parseCookies } from "nookies";
import { calcularTempo, editPayload, getStatusColor, getStatusText } from "../components/utils/filaUtils";
import { FilaSignalRListener } from "@/features/fila/components/FilaSignalRListener";
import { useAuth } from "@/features/auth/context/AuthContext";
import { usePathname } from "next/navigation";

interface FilaContextType {
  contagemSelecionada: number;
  setContagemSelecionada: (count: number) => void;
  filaData: FilaItemExt[];
  setFilaData: Dispatch<SetStateAction<FilaItemExt[]>>;
  chamadasData: ChamadaItem[];
  setChamadasData: Dispatch<SetStateAction<ChamadaItem[]>>;
  setAllClients: Dispatch<SetStateAction<(FilaItemExt | ChamadaItem)[]>>;
  chamarSelecionados: (ids: string[]) => Promise<void>;
  removerSelecionados: (selectedIds: string[]) => Promise<void>;
  trocarPosicaoCliente: (id: string, direction: "up" | "down") => Promise<void>;
  addPerson: (nome: string, telefone: string, observacao: string) => void;
  editPerson: (clienteCompleto: FilaItem, camposEditados: EditaCampos) => void;
  retornarParaFila: (id: string) => void;
  removerChamada: (id: string) => void;
  marcarComoAtendido: (id: string) => void;
  marcarComoNaoCompareceu: (id: string) => void;
  marcarComoDesistente: (id: string) => Promise<void>; // Nova função para desistência
  getStatusText: (status: StatusType) => string;
  getStatusColor: (status: StatusType) => string;
  calcularTempo: (dataHoraCriado?: string) => string;
  editPayload: (orig: FilaItem, edicao: EditaCampos) => FilaItem;
  isSignalRConnected: boolean;
  refreshFila: () => Promise<void>; // Função para recarregar a fila
}

const FilaContext = createContext<FilaContextType | undefined>(undefined);

export const useFilaContext = () => {
  const context = useContext(FilaContext);
  if (!context) {
    throw new Error("useFilaContext deve ser usado dentro de um FilaProvider");
  }
  return context;
};

export function FilaProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading: authLoading, user, onTokenUpdated } = useAuth();
  const pathname = usePathname();
  const [contagemSelecionada, setContagemSelecionada] = useState(0);
  const [allClients, setAllClients] = useState<(FilaItemExt | ChamadaItem)[]>([]);
  const [notification, setNotification] = useState<string | null>(null);
  const [isSignalRConnected, setIsSignalRConnected] = useState(false);

  const filaData = useMemo(() => {
    const filtered = allClients
      .filter(client => client.status === 1)
      .sort((a, b) => {
        const aData = new Date(a.dataHoraOrdenacao ?? a.dataHoraCriado ?? 0).getTime();
        const bData = new Date(b.dataHoraOrdenacao ?? b.dataHoraCriado ?? 0).getTime();
        return aData - bData;
      });
    console.log("📊 filaData atualizado:", filtered);
    return filtered;
  }, [allClients]);

  const chamadasData = useMemo(() => {
    const mapa = new Map();
    for (const client of allClients) {
      if (client.status > 1 && client.status <= 5) {
        mapa.set(client.id, client);
      }
    }
    const updatedChamadas = Array.from(mapa.values()) as ChamadaItem[];
    console.log("📊 chamadasData atualizado:", updatedChamadas);
    return updatedChamadas;
  }, [allClients]);

  const loadFila = async () => {
    if (pathname !== "/fila" || !isAuthenticated || authLoading || !user?.empresaId) return;

    const { "auth.token": token } = parseCookies();
    if (!token) {
      console.error("❌ Token não encontrado nos cookies");
      return;
    }

    setAuthorizationHeader(token);

    const filaId = await getDefaultFilaId(user.empresaId);
    if (!filaId) {
      console.error("❌ Nenhum filaId encontrado");
      return;
    }

    const fila = await buscarClientesFila(filaId);
    const formattedClients = fila.map(item => ({
      ...item,
      id: item.id || crypto.randomUUID(),
      filaId: item.filaId ?? "",
      hash: item.hash ?? "",
      status: (typeof item.status === "string" ? parseInt(item.status) : item.status) as StatusType || 1,
      tempo: item.tempo || calcularTempo(item.dataHoraCriado),
      ticket: item.ticket || null,
      observacao: item.observacao || "",
      dataHoraCriado: item.dataHoraCriado || new Date().toISOString(),
    }));

    setAllClients(formattedClients);
  };

  useEffect(() => {
    loadFila();
  }, [pathname, isAuthenticated, authLoading, user?.empresaId]);

  useEffect(() => {
    const handleTokenUpdate = (event: Event) => {
      const newToken = (event as CustomEvent).detail;
      if (newToken) {
        console.log("🔄 Atualizando SignalR com novo token:", newToken.slice(0, 10) + "...");
        setIsSignalRConnected(false);
        setTimeout(() => {
          const { "auth.token": token } = parseCookies();
          if (token) {
            setAuthorizationHeader(token);
          }
        }, 100);
      }
    };

    window.addEventListener("tokenUpdated", handleTokenUpdate);
    return () => window.removeEventListener("tokenUpdated", handleTokenUpdate);
  }, []);

  const handleMarcarComoAtendido = async (id: string) => {
    await marcarComoAtendido(id, setAllClients);
  };

  const handleMarcarComoNaoCompareceu = async (id: string) => {
    await marcarComoNaoCompareceu(id, setAllClients);
    await loadFila();
  };

  const handleRemoverChamada = async (id: string) => {
    await removerChamada(id, setAllClients, setChamadasData);
    await loadFila();
  };

  const handleRetornarParaFila = async (id: string) => {
    await retornarParaFila(id, setAllClients);
    setNotification("Cliente retornou à fila");
    setTimeout(() => setNotification(null), 3000);
  };

  const handleChamarSelecionados = async (ids: string[]) => {
    await chamarSelecionados(ids, setAllClients, setContagemSelecionada);
  };

  const handleRemoverSelecionados = async (ids: string[]) => {
    await removerSelecionados(ids, allClients, setAllClients, setContagemSelecionada);
    setNotification(`${ids.length} cliente(s) removido(s)`);
    setTimeout(() => setNotification(null), 3000);
    await loadFila();
  };

  const handleTrocarPosicaoCliente = async (id: string, direction: "up" | "down") => {
    const filaId = allClients.length > 0 ? allClients[0].filaId : await getDefaultFilaId(user?.empresaId || "");
    await trocarPosicaoCliente(id, direction, setAllClients, filaId);
  };

  const handleAddPerson = async (nome: string, telefone: string, observacao: string) => {
    const filaId = allClients.length > 0 ? allClients[0].filaId : await getDefaultFilaId(user?.empresaId || "");
    await addPerson(nome, telefone, observacao, setAllClients, filaId);
  };

  const handleEditPerson = async (clienteCompleto: FilaItem, camposEditados: EditaCampos) => {
    const filaId = allClients.length > 0 ? allClients[0].filaId : await getDefaultFilaId(user?.empresaId || "");
    await editPerson(clienteCompleto, camposEditados, setAllClients, filaId);
  };

  const handleMarcarComoDesistente = async (id: string) => {
    // Simula a lógica de marcar como desistente (pode ser ajustada para chamar uma API no backend)
    setAllClients(prevClients => {
      const updatedClients = prevClients.map(client =>
        client.id === id ? { ...client, status: 4 } : client
      );
      console.log("📋 Clientes atualizados após marcar como desistente:", updatedClients);
      return updatedClients;
    });
    await loadFila(); // Força a atualização da UI
  };

  const setFilaData: Dispatch<SetStateAction<FilaItemExt[]>> = (updater) => {
    setAllClients((prev) => {
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

  const setChamadasData: Dispatch<SetStateAction<ChamadaItem[]>> = (updater) => {
    setAllClients((prev) => {
      const fila = prev.filter(c => c.status === 1);
      const chamadas = prev.filter(c => c.status !== 1);
      const updated = typeof updater === "function" ? updater(chamadas as ChamadaItem[]) : updater;
      return [...fila, ...updated];
    });
  };

  const contextValue: FilaContextType = {
    contagemSelecionada,
    setContagemSelecionada,
    filaData,
    setFilaData,
    chamadasData,
    setAllClients,
    setChamadasData,
    chamarSelecionados: handleChamarSelecionados,
    removerSelecionados: handleRemoverSelecionados,
    trocarPosicaoCliente: handleTrocarPosicaoCliente,
    addPerson: handleAddPerson,
    editPerson: handleEditPerson,
    retornarParaFila: handleRetornarParaFila,
    removerChamada: handleRemoverChamada,
    marcarComoAtendido: handleMarcarComoAtendido,
    marcarComoNaoCompareceu: handleMarcarComoNaoCompareceu,
    marcarComoDesistente: handleMarcarComoDesistente, // Adiciona a nova função
    getStatusText,
    getStatusColor,
    calcularTempo,
    editPayload,
    isSignalRConnected,
    refreshFila: loadFila,
  };

  return (
    <FilaContext.Provider value={contextValue}>
      <FilaSignalRListener setIsSignalRConnected={setIsSignalRConnected} />
      {children}
    </FilaContext.Provider>
  );
}