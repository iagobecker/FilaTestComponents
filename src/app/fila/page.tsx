"use client";

import { Header } from "@/components/layout/Header";
import { PageContainer } from "@/components/layout/PageContainer";
import { FilaProvider, useFilaContext } from "../../features/fila/provider/FilaProvider";
import { FilaTable } from "../../features/fila/components/table/FilaTable";
import { TableStatusRecentes } from "../../features/fila/components/table-recentes/TableStatusRecentes";

export default function FilaPage() {
  return (
    <FilaProvider>
      <FilaSignalRListener />

      <Header />
      <PageContainer>
        <FilaConteudo />
      </PageContainer>
    </FilaProvider>
  );
}