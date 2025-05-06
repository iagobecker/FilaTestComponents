"use client";

import { useParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { PageContainer } from "@/components/layout/PageContainer";
import { HeaderCustomAparencia } from "@/features/customAparencia/components/HeaderCustomAparencia";
import { AparenciaMonitor } from "@/features/customAparencia/components/AparenciaMonitor";
import { VoltarButton } from "@/components/VoltarButton";

export default function CustomAparenciaPage() {
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
        <HeaderCustomAparencia />
        <AparenciaMonitor empresaId={empresaId} />
      </PageContainer>
    </>
  );
}