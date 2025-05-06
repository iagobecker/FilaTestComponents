"use client";

import { Header } from "@/components/layout/Header";
import { PageContainer } from "@/components/layout/PageContainer";
import { VoltarButton } from "@/components/VoltarButton";
import { CustomizarMensagemFeature } from "@/features/customizarMensagem/components/CustomizarMensagemFeature";

export default function CustomizarMensagemPage() {
  return (
    <>
      <Header />
      <PageContainer>
        <VoltarButton />
        <CustomizarMensagemFeature />
      </PageContainer>
    </>
  );
}