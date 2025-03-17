import { Header } from "@/components/layout/Header";
import { FilaProvider } from "./context/FilaContext";
import { FilaTable } from "@/components/fila/FilaTable";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
export default function Home() {
  return (
    <FilaProvider>
      <Header />
      <PageContainer>
        <PageHeader />
        <FilaTable />
      </PageContainer>
    </FilaProvider>
  );
}
