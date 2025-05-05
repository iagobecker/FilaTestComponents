"use client";

import { Header } from "@/components/layout/Header";
import { PageContainer } from "@/components/layout/PageContainer";
import { FilaProvider } from "../../features/fila/context/FilaProvider";
import { FilaContent } from "@/features/fila/components/FilaContent";

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