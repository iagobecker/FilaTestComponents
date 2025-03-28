"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { HeaderFila } from "@/features/fila/components/table/HeaderFila";
import { PageContainer } from "@/components/layout/PageContainer";
import { filaData } from "@/data/mockData";
import { FilaProvider } from "../../features/fila/provider/FilaProvider";
import { FilaTable } from "../../features/fila/components/table/FilaTable";
import { ChamadasRecentes } from "../../features/fila/components/table-chamados/ChamadasRecentes";

export default function FilaPage() {
  const [data, setData] = useState(filaData);

  const addPerson = (nome: string, telefone: string, observacao: string) => {
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
        <HeaderFila addPerson={addPerson} />
        <FilaTable data={data} setData={setData} />
        <ChamadasRecentes />
      </PageContainer>
    </FilaProvider>
  );
}
