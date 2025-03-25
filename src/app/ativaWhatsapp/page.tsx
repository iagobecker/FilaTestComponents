import { Header } from "@/components/layout/Header";
import { PageContainer } from "@/components/layout/PageContainer";
import ContainerWPQRcode from "@/features/ativaWhatsapp/components/ContainerQRcode";
import { HeaderAtivaWhats } from "@/features/ativaWhatsapp/components/HeaderAtivaWhats";

export default function AtivaWhatsapp() {
    return (
        <>
            <Header />
            <PageContainer >
                <HeaderAtivaWhats />
                <ContainerWPQRcode />
            </PageContainer>

        </>
    )
}