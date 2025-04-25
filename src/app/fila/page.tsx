"use client";

import { Header } from "@/components/layout/Header";
import { HeaderFila } from "@/features/fila/components/table/HeaderFila";
import { PageContainer } from "@/components/layout/PageContainer";
import { FilaProvider, useFilaContext } from "../../features/fila/provider/FilaProvider";
import { FilaTable } from "../../features/fila/components/table/FilaTable";
import { TableStatusRecentes } from "../../features/fila/components/table-recentes/TableStatusRecentes";

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
  const { filaData, setFilaData, chamadasData, addPerson } = useFilaContext();
  return (
    <>
      <HeaderFila addPerson={addPerson} />
      <FilaTable data={filaData} setData={setFilaData} />
      <TableStatusRecentes data={chamadasData.map((item) => ({
        ...item,
        status: Number(item.status),
      }))} />
    </>
  );
}
