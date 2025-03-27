"use client";

import { Header } from "@/components/layout/Header";
import { PageContainer } from "@/components/layout/PageContainer";
import { VoltarButton } from "@/components/VoltarButton";
import { HeaderCustomMesage } from "@/features/customizarMensagem/components/HeaderCustomMesage";
import RichEditor from "@/features/customizarMensagem/components/RichEditor";

export default function CustomizarMensagem() {
    return (
        <>
            <Header />
            <PageContainer>
                <VoltarButton />
                <HeaderCustomMesage />
                <RichEditor />
            </PageContainer>
        </>
    )
}