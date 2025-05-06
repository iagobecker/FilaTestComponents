"use client";

import { useParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { PageContainer } from "@/components/layout/PageContainer";
import { VoltarButton } from "@/components/VoltarButton";
import { HeaderConfiguracoesFilas } from "@/features/vinculacao-monitor/components/HeaderAtiveMonitor";
import VinculacaoMonitorForm from "@/features/vinculacao-monitor/components/VinculacaoMonitorForm";


export default function AtivarMonitor() {
  const params = useParams();
  const empresaId = params.empresaId as string;

  if (!empresaId) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Parâmetro empresaId inválido na URL.
      </div>
    );
  }

  return (
    <>
      <Header />
      <PageContainer>
        <VoltarButton />
        <HeaderConfiguracoesFilas />
        <VinculacaoMonitorForm empresaId={empresaId} />
      </PageContainer>
    </>
  );
}