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
  const { filaData, setFilaData, chamadasData, addPerson } = useFila();
  return (
    <>
      <HeaderFila addPerson={addPerson} />
      <FilaTable data={filaData} setData={setFilaData} />
      <ChamadasRecentes data={chamadasData.map((item) => ({
        ...item,
        status: Number(item.status),
      }))} />
    </>
  );
}
