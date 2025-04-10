'use client'

import { Header } from "@/components/layout/Header"
import { PageContainer } from "@/components/layout/PageContainer"
import { VoltarButton } from "@/components/VoltarButton"
import { HeaderVinculacao } from "@/features/vinculacao/components/HeaderVinculacao"
import Vinculacao from "@/features/vinculacao/components/Vinculacao"



export default function VinculacaoPage() {
    return (
        <>
            <Header />
            <PageContainer>
                <VoltarButton />
                <HeaderVinculacao />
                <Vinculacao />
            </PageContainer>
        </>
    )

}
