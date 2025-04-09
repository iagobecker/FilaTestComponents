"use client";

import { Header } from "@/components/layout/Header";
import { HeaderFila } from "@/features/fila/components/table/HeaderFila";
import { PageContainer } from "@/components/layout/PageContainer";
import { FilaProvider, useFila } from "../../features/fila/provider/FilaProvider";
import { FilaTable } from "../../features/fila/components/table/FilaTable";
import { ChamadasRecentes } from "../../features/fila/components/table-chamados/ChamadasRecentes";
import { fetchFilaClientes } from "@/features/fila/services/FilaService";


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

  const addPerson = async (nome: string, telefone: string, observacao: string) => {
    try {
      // Após adicionar via API, buscamos novamente toda a fila
      const novaFila = await fetchFilaClientes();
      const formattedFila = novaFila.map(item => ({
        ...item,
        id: item.id || "", 
      }));
      setFilaData(formattedFila);
    } catch (error) {
      console.error("Erro ao adicionar pessoa na fila:", error);
    }
  };


  return (
    <>
      <HeaderFila addPerson={addPerson} />
      <FilaTable data={filaData} setData={setFilaData} />
      <ChamadasRecentes data={chamadasData} />
    </>
  );
}