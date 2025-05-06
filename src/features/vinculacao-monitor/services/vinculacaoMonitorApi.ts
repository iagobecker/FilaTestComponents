import { Api } from "@/api/api";
import { EmpresaService } from "@/features/auth/components/services/empresaService";
import { VinculacaoPayload, vincularAplicativo } from "@/lib/vincular";
import { VinculacaoData, VinculacaoResponse } from "../types/typesVincular";

export async function vincular(payload: VinculacaoPayload): Promise<VinculacaoResponse> {
    try {
      const resultado = await vincularAplicativo(payload);
      if (!resultado || !resultado.idVinculacaoAplicativo) {
        throw new Error("Resposta inválida da API /api/vincular: idVinculacaoAplicativo ausente.");
      }
      return resultado as VinculacaoResponse;
    } catch (err: any) {
      console.error("Erro ao vincular aplicativo:", {
        payload,
        error: err.message,
        status: err.response?.status,
        responseData: err.response?.data,
      });
      throw new Error(err.response?.data?.message || "Erro ao vincular aplicativo via API.");
    }
  }
  
  export async function criarVinculacao(data: VinculacaoData): Promise<void> {
    try {
      await Api.post("/vinculacoes", data);
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