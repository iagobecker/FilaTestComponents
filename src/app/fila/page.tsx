"use client";

import { Header } from "@/components/layout/Header";
import { PageContainer } from "@/components/layout/PageContainer";
import { FilaProvider } from "@/features/fila/context/FilaProvider";
import { FilaConteudo } from "@/features/fila/components/FilaContent";
import { FilaSignalRListener } from "@/features/fila/hooks/FilaSignalRListener";

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
