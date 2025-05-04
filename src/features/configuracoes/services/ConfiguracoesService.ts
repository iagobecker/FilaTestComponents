import { Api } from "@/api/api";

// Definindo o tipo Configuracao para melhor tipagem
export interface Configuracao {
  id: string;
  empresaId: string;
  whatsappAtivo: boolean;
  nomeDisplay: string;
  enderecoDisplay: string;
  mensagemEntrada: string;
  mensagemChamada: string;
  mensagemRemovido: string;
  logoUrl: string;
  corPrimaria: string;
  corSobreposicao: string;
  corTexto: string;
  dataHoraCriado?: string;
  dataHoraAlterado?: string;
  dataHoraDeletado?: string;
}

export async function getConfiguracaoByEmpresaId(empresaId: string): Promise<Configuracao | null> {
  try {
    const res = await Api.get("/configuracoes");
    const config = res.data as Configuracao;

    // Verifica se o objeto retornado tem empresaId e se corresponde ao empresaId fornecido
    if (!config || !config.empresaId) {
      console.error("Configuração inválida ou sem empresaId:", config);
      return null;
    }

    if (config.empresaId !== empresaId) {
      console.error(`Configuração não corresponde à empresaId fornecida. Esperado: ${empresaId}, Recebido: ${config.empresaId}`);
      return null;
    }

    return config;
  } catch (error: any) {
    console.error("Erro ao buscar configuração:", error);
    throw new Error(error?.response?.data?.message || "Erro ao buscar configuração.");
  }
}

export async function criarConfiguracao(config: any) {
  return Api.post("/configuracoes", config);
}

export async function atualizarConfiguracao(config: any) {
  return Api.put("/configuracoes", config);
}