import { Api } from "@/api/api";
import { EmpresaService } from "@/features/auth/components/services/empresaService";
import { VinculacaoData } from "../types/typesVincular";

export async function criarVinculacao(data: VinculacaoData): Promise<void> {
  try {
    console.log("Enviando requisição para criar vinculação:", JSON.stringify(data, null, 2));
    await Api.post("/vinculacoes", data);
    console.log("Vinculação criada com sucesso");
  } catch (err: any) {
    console.error("Erro ao criar vinculação:", {
      data,
      error: err.message,
      status: err.response?.status,
      responseData: err.response?.data,
    });
    throw new Error(err.response?.data?.message || "Erro ao criar vinculação.");
  }
}

export async function fetchEmpresa(): Promise<any> {
  try {
    const empresa = await EmpresaService.fetchEmpresa();
    if (!empresa || !empresa.id) {
      throw new Error("Empresa não encontrada para o usuário autenticado.");
    }
    return empresa;
  } catch (err) {
    console.error("Erro ao buscar empresa via EmpresaService:", err);
    throw err;
  }
}