"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { FilaProvider } from "./context/FilaContext";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { FilaTable } from "@/components/fila/FilaTable";
import { ChamadasRecentes } from "@/components/fila/ChamadasRecentes";
import { filaData } from "@/data/mockData";

export default function Home() {
  const [data, setData] = useState(filaData);

  // Função para adicionar uma nova pessoa à fila
  const addPerson  = (nome: string, telefone: string, observacao: string) => {
    const newPerson = {
      id: (data.length + 1).toString(),
      nome,
      telefone,
      observacao,
      status: "Aguardando",
      tempo: "há 0 minutos",
    };

    setData((prevData) => [...prevData, newPerson]);
  };

  return (
    <FilaProvider>
      <Header />
      <PageContainer>
        <PageHeader addPerson={addPerson } />
        <FilaTable data={data} setData={setData} />
        <ChamadasRecentes />
      </PageContainer>
    </FilaProvider>
  );
}
