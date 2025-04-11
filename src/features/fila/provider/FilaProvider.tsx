"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { filaData as initialFilaData, chamadasData as initialChamadasData } from "@/data/mockData";
import { Dispatch, SetStateAction } from 'react';
import { fetchFilaClientes } from "../services/FilaService";
import { Api, setAuthorizationHeader } from "@/api/api";
import { parseCookies } from "nookies";
import { FilaItem } from "@/features/fila/types"





type ChamadaItem = {
  id: string;
  ticket: string | null;
  nome: string;
  telefone: string;
  tempo: string;
  status: string;
  observacao: string;
};

interface FilaContextType {
  selectedCount: number;
  setSelectedCount: (count: number) => void;
  filaData: FilaItem[];
  setFilaData: Dispatch<SetStateAction<FilaItem[]>>;
  chamadasData: ChamadaItem[];
  setChamadasData: (data: ChamadaItem[]) => void;
  chamarSelecionados: (ids: string[]) => void;
  removerSelecionados: (selectedIds: string[]) => void;
  addPerson: (nome: string, telefone: string, observacao: string) => void;
  retornarParaFila: (id: string) => void;
  removerChamada: (id: string) => void;
}

const FilaContext = createContext<FilaContextType | undefined>(undefined);

export function useFila() {
  const context = useContext(FilaContext);
  if (!context) {
    throw new Error("useFila deve ser usado dentro de um FilaProvider");
  }
  return context;
}

export function FilaProvider({ children }: { children: ReactNode }) {
  const [selectedCount, setSelectedCount] = useState(0);
  const [notification, setNotification] = useState<string | null>(null);
  const [filaData, setFilaData] = useState<FilaItem[]>(initialFilaData);
  const [chamadasData, setChamadasData] = useState<ChamadaItem[]>(initialChamadasData);

  useEffect(() => {
    async function loadFila() {
      try {
        const { 'auth.token': token } = parseCookies();

        if (token) {
          setAuthorizationHeader(token);
        }

        const fila = await fetchFilaClientes();
        const renderizaFila = fila.map(item => ({
          ...item,
          id: item.nome || "", 
        }));
        setFilaData(renderizaFila);
      } catch (error) {
        console.error("Erro ao carregar fila:", error);
      }
    }

    loadFila();
  }, []);

  const retornarParaFila = (id: string) => {
    // Encontrar o item nas chamadas recentes
    const item = chamadasData.find(c => c.id === id);
    if (!item) return;

    // Adicionar de volta à fila
    setFilaData(prev => [...prev, {
      id: item.id,
      ticket: item.ticket,
      nome: item.nome,
      telefone: item.telefone,
      observacao: "", 
      status: "Aguardando",
      tempo: "há 0 minutos"
    }]);

    // Remover das chamadas recentes
    setChamadasData(prev => prev.filter(c => c.id !== id));

    // Mostrar notificação
    setNotification("Cliente retornou para a fila com sucesso!");
    setTimeout(() => setNotification(null), 3000);
  };

  const removerChamada = (id: string) => {
    setChamadasData(prev => prev.filter(c => c.id !== id));
    setNotification("Chamada removida com sucesso!");
    setTimeout(() => setNotification(null), 3000);
  };

  const chamarSelecionados = (selectedIds: string[]) => {
    // Filtrar os itens selecionados
    const selecionados = filaData.filter(item => item.id && selectedIds.includes(item.id));

    if (selecionados.length === 0) return;

    // Adicionar à lista de chamadas recentes
    const novasChamadas = selecionados.map(item => ({
      id: (item.id ?? crypto.randomUUID()) as string,
      ticket: item.ticket ?? null,
      nome: item.nome,
      telefone: item.telefone,
      tempo: "Agora",
      status: "Chamado",
      observacao: ""
    }));
    

    setChamadasData(prev => [...novasChamadas, ...prev]);

    // Remover da fila
    setFilaData(prev => prev.filter(item => item.id && !selectedIds.includes(item.id)));

    // Resetar a seleção
    setSelectedCount(0);
  };

  const removerSelecionados = (ids: string[]) => {
    setFilaData(prev => prev.filter(item => item.id && !ids.includes(item.id)));
    setSelectedCount(0);
    // Mostrar notificação
    setNotification(ids.length > 1 
      ? `${ids.length} itens removidos com sucesso!` 
      : "Item removido com sucesso!");
    
    setTimeout(() => setNotification(null), 3000);
  };

  const addPerson = (nome: string, telefone: string, observacao: string) => {
    const newPerson = {
      id: (filaData.length + 1).toString(),
      ticket: null,
      nome,
      telefone,
      observacao,
      status: "Aguardando",
      tempo: "há 0 minutos",
    };
    setFilaData(prevData => [...prevData, newPerson]);
  };

  return (
    <FilaContext.Provider value={{
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
    }}>
      {children}
    </FilaContext.Provider>
  );
}