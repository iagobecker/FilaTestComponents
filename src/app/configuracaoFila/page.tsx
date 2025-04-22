import { Header } from "@/components/layout/Header";
import { PageContainer } from "@/components/layout/PageContainer";
import { VoltarButton } from "@/components/VoltarButton";
import VinculacaoMonitorForm from "@/features/configuracoes-filas/components/VinculacaoMonitorForm";
import { HeaderConfiguracoesFilas } from "@/features/configuracoes-filas/components/HeaderAtiveMonitor";

export default function AtivarMonitor() {
    return(
        <>
        <Header/>
        <PageContainer>
            <VoltarButton />
            <HeaderConfiguracoesFilas/>
            <VinculacaoMonitorForm/>
        </PageContainer>
        </>
    )
}