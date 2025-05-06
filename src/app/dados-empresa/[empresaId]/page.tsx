"use client";

import { useParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { PageContainer } from "@/components/layout/PageContainer";
import { VoltarButton } from "@/components/VoltarButton";
import { HeaderDadosEmpresa } from "@/features/dadosEmpresa/components/HeaderDadosEmpresa";
import DadosEmpresaForm from "@/features/dadosEmpresa/form/DadosEmpresaForm";

interface DadosEmpresaPageProps {
  empresaId: string;
}

export default function DadosEmpresaPage({ empresaId }: DadosEmpresaPageProps) {
  const params = useParams();
  const dynamicEmpresaId = params.empresaId as string;

  if (!dynamicEmpresaId) {
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
        <HeaderDadosEmpresa />
        <div className="flex items-center justify-center min-h-[calc(80vh-120px)]">
          <DadosEmpresaForm empresaId={dynamicEmpresaId} />
        </div>
      </PageContainer>
    </>
  );
}