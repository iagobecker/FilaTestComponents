"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { filaData as initialFilaData, chamadasData as initialChamadasData } from "@/data/mockData";
import { Dispatch, SetStateAction } from 'react';

type FilaItem = {
  id: string;
  nome: string;
  telefone: string;
  observacao: string;
  status: string;
  tempo: string;
};

type ChamadaItem = {
  id: string;
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

  const retornarParaFila = (id: string) => {
    // Encontrar o item nas chamadas recentes
    const item = chamadasData.find(c => c.id === id);
    if (!item) return;

    // Adicionar de volta à fila
    setFilaData(prev => [...prev, {
      id: item.id,
      nome: item.nome,
      telefone: item.telefone,
      observacao: "", // Valor padrão
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
    const selecionados = filaData.filter(item => selectedIds.includes(item.id));

    if (selecionados.length === 0) return;

    // Adicionar à lista de chamadas recentes
    const novasChamadas = selecionados.map(item => ({
      id: item.id,
      nome: item.nome,
      telefone: item.telefone,
      tempo: "Agora",
      status: "Chamado",
      observacao: "" 
    }));

    setChamadasData(prev => [...novasChamadas, ...prev]);

    // Remover da fila
    setFilaData(prev => prev.filter(item => !selectedIds.includes(item.id)));

    // Resetar a seleção
    setSelectedCount(0);
  };

  const removerSelecionados = (ids: string[]) => {
    setFilaData(prev => prev.filter(item => !ids.includes(item.id)));
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