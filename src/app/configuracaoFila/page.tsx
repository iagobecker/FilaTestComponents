import { Header } from "@/components/layout/Header";
import { PageContainer } from "@/components/layout/PageContainer";
import { VoltarButton } from "@/components/VoltarButton";
import ConfiguracaoMonitorForm from "@/features/configuracoes-filas/components/ConfiguracaoMonitorForm";
import { HeaderConfiguracoesFilas } from "@/features/configuracoes-filas/components/HeaderConfiguracoesFilas";

export default function AtivarMonitor() {
    return(
        <>
        <Header/>
        <PageContainer>
            <VoltarButton />
            <HeaderConfiguracoesFilas/>
            <ConfiguracaoMonitorForm/>
        </PageContainer>
        </>
    )
}