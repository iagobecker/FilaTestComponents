"use client";

import { Header } from "@/components/layout/Header";
import { PageContainer } from "@/components/layout/PageContainer";
import { HeaderCustomAparencia } from "@/features/customAparencia/components/HeaderCustomAparencia";
import { AparenciaMonitor } from "@/features/customAparencia/components/AparenciaMonitor";

export default function CustomAparenciaPage() {
    return (
        <>
            <Header />
            <PageContainer>
                <HeaderCustomAparencia />
                <AparenciaMonitor addEmpresa={function (nome: string): void {
                    throw new Error("Function not implemented.");
                } } />
            </PageContainer>
        </>
    )
}