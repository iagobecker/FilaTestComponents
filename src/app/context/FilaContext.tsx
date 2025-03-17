"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// Tipo do contexto
interface FilaContextType {
  selectedCount: number;
  setSelectedCount: (count: number) => void;
}

// Criando o contexto
const FilaContext = createContext<FilaContextType | undefined>(undefined);

// Hook para o uso do contexto
export function useFila() {
  const context = useContext(FilaContext);
  if (!context) {
    throw new Error("useFila deve ser usado dentro de um FilaProvider");
  }
  return context;
}

// Provider para encapsular a fila
export function FilaProvider({ children }: { children: ReactNode }) {
  const [selectedCount, setSelectedCount] = useState(0);

  return (
    <FilaContext.Provider value={{ selectedCount, setSelectedCount }}>
      {children}
    </FilaContext.Provider>
  );
}
