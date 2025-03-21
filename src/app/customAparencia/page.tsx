"use client";

import { Header } from "@/components/layout/Header";
import { PageContainer } from "@/components/layout/PageContainer";
import { HeaderCustomAparencia } from "@/features/customAparencia/components/HeaderCustomAparencia";
import { NomeLogoEmpresa } from "@/features/customAparencia/components/NomeLogoEmpresa";

export default function CustomAparenciaPage() {
    return (
        <>
            <Header />
            <PageContainer>
                <HeaderCustomAparencia />
                <NomeLogoEmpresa addEmpresa={function (nome: string): void {
                    throw new Error("Function not implemented.");
                } } />
            </PageContainer>
        </>
    )
}