"use client";

import { Header } from "@/components/layout/Header";
import { HeaderFila } from "@/features/fila/components/table/HeaderFila";
import { PageContainer } from "@/components/layout/PageContainer";
import { FilaProvider, useFila } from "../../features/fila/provider/FilaProvider";
import { FilaTable } from "../../features/fila/components/table/FilaTable";
import { ChamadasRecentes } from "../../features/fila/components/table-chamados/ChamadasRecentes";

export default function FilaPage() {
  return (
    <FilaProvider>
      <Header />
      <PageContainer>
        <FilaContent />
      </PageContainer>
    </FilaProvider>
  );
}

function FilaContent() {
  const { filaData, setFilaData, chamadasData } = useFila();

  const addPerson = (nome: string, telefone: string, observacao: string) => {
    const newPerson: { id: string; nome: string; telefone: string; observacao: string; status: string; tempo: string } = {
      id: (filaData.length + 1).toString(),
      nome,
      telefone,
      observacao,
      status: "Aguardando",
      tempo: "há 0 minutos",
    };

    setFilaData(prev => [...prev, newPerson]);
  };

  return (
    <>
      <HeaderFila addPerson={addPerson} />
      <FilaTable data={filaData} setData={setFilaData} />
      <ChamadasRecentes data={chamadasData} />
    </>
  );
}