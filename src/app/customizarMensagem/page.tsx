"use client";

import { Header } from "@/components/layout/Header";
import { PageContainer } from "@/components/layout/PageContainer";
import { HeaderCustomMesage } from "@/features/customizarMensagem/components/HeaderCustomMesage";
import RichEditor from "@/features/customizarMensagem/components/RichEditor";

export default function CustomizarMensagem() {
    return(
        <>
            <Header/>
            <PageContainer>
                <HeaderCustomMesage/>
                <RichEditor/>
            </PageContainer>
        </>
    )
}