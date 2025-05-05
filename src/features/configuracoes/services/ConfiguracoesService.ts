import { Api } from "@/api/api";
import { ConfiguracaoType } from "../types/configTypes";

export async function getConfiguracaoByEmpresaId(empresaId: string): Promise<ConfiguracaoType | null> {
  try {
    const res = await Api.get("/configuracoes");
    const config = res.data as ConfiguracaoType;

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

export async function criarConfiguracao(config: ConfiguracaoType) {
  return Api.post("/configuracoes", config);
}

export async function atualizarConfiguracao(config: ConfiguracaoType) {
  const response = await Api.put("/configuracoes", config);
  return response.data; 
}