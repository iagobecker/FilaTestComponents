import { Header } from "@/components/layout/Header";
import { PageContainer } from "@/components/layout/PageContainer";
import { VoltarButton } from "@/components/VoltarButton";
import { HeaderDadosEmpresa } from "@/features/dadosEmpresa/components/HeaderDadosEmpresa";
import DadosEmpresaForm from "@/features/dadosEmpresa/form/DadosEmpresaForm";

export default function DadosEmpresa() {
    return (
        <>
            <Header />
            <PageContainer>
                <VoltarButton />
                <HeaderDadosEmpresa />
                <div className="flex items-center justify-center min-h-[calc(80vh-120px)]">
                    <DadosEmpresaForm />
                </div>
            </PageContainer>

        </>
    )
}
