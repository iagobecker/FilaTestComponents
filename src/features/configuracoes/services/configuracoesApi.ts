import { Configuracao, EmpresaService } from "@/features/auth/components/services/empresaService";
import { getConfiguracaoByEmpresaId as fetchConfiguracao } from "@/features/configuracoes/services/ConfiguracoesService";

export async function getConfiguracaoByEmpresaId(empresaId: string): Promise<Configuracao | null> {
  const configuracao = await fetchConfiguracao(empresaId);
  if (configuracao && configuracao.id === undefined) {
    configuracao.id = ""; 
  }
  return configuracao as Configuracao | null;
}

export async function fetchEmpresa(): Promise<any> {
  return EmpresaService.fetchEmpresa();
}