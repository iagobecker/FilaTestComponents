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
import { ChamadaItem, EditaCampos, FilaItem, FilaItemExt, StatusType } from "@/features/fila//components/types/types";
import { addPerson, buscarClientesFila, chamarSelecionados, editPerson, marcarComoAtendido, marcarComoNaoCompareceu, removerChamada, removerSelecionados, retornarParaFila, trocarPosicaoCliente } from "@/features/fila/services/FilaService"; // Função para buscar a fila de clientes
import { setAuthorizationHeader } from "@/api/api";
import { parseCookies } from "nookies";// Utilitário para ler cookies
import { calcularTempo, editPayload, getStatusColor, getStatusText } from "../components/utils/filaUtils";
import { FilaSignalRListener } from "@/features/fila/components/FilaSignalRListener";

// interface descrevendo tudo que será compartilhado no contexto
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
  getStatusText: (status: StatusType) => string;
  getStatusColor: (status: StatusType) => string;
  calcularTempo: (dataHoraCriado?: string) => string;
  editPayload: (orig: FilaItem, edicao: EditaCampos) => FilaItem;
  isSignalRConnected: boolean;
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

export function FilaProvider({ children }: { children: ReactNode }) {
  const [contagemSelecionada, setContagemSelecionada] = useState(0);
  const [allClients, setAllClients] = useState<(FilaItemExt | ChamadaItem)[]>([]); 
  const [notification, setNotification] = useState<string | null>(null);
  const [isSignalRConnected, setIsSignalRConnected] = useState(false);

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
    const mapa = new Map();
    for (const client of allClients) {
      if (client.status > 1) {
        mapa.set(client.id, client);
      }
    }
    const filtered = Array.from(mapa.values()) as ChamadaItem[];
    return filtered;
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


  const handleMarcarComoAtendido = async (id: string) => {
    await marcarComoAtendido(id, setAllClients);
  };

  const handleMarcarComoNaoCompareceu = async (id: string) => {
    await marcarComoNaoCompareceu(id, setAllClients);
  };

  const handleRemoverChamada = async (id: string) => {
    await removerChamada(id, setAllClients, setChamadasData);
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
  };

  const handleTrocarPosicaoCliente = async (id: string, direction: "up" | "down") => {
    await trocarPosicaoCliente(id, direction, setAllClients);
  };

  const handleAddPerson = async (nome: string, telefone: string, observacao: string) => {
    await addPerson(nome, telefone, observacao, setAllClients);
  };

  const handleEditPerson = async (clienteCompleto: FilaItem, camposEditados: any) => {
    await editPerson(clienteCompleto, camposEditados, setAllClients);
  };


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

  // Obj do Contexto com todos os dados e funções que serão compartilhados
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
    getStatusText,
    getStatusColor,
    calcularTempo,
    editPayload,
    isSignalRConnected,
  };

  return (
    <FilaContext.Provider value={contextValue}>
      <FilaSignalRListener setIsSignalRConnected={setIsSignalRConnected} />
      {children}
    </FilaContext.Provider>
  );
}
