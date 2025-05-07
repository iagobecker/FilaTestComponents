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
  const filaId = params.filaId as string

  if (!empresaId || !filaId) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Empresa ou fila não encontrada.
      </div>
    );
  }

  return (
    <>
      <Header />
      <PageContainer>
        <VoltarButton />
        <HeaderConfiguracoesFilas />
        <VinculacaoMonitorForm empresaId={empresaId} filaId={filaId} />
      </PageContainer>
    </>
  );
}