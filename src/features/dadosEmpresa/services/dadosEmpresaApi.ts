import { FormData } from "@/features/dadosEmpresa/types/typesEmpresa";

// Simulação de uma chamada à API (substitua pelo seu cliente HTTP real, como axios)
export async function atualizarEmpresa(empresaId: string, data: FormData) {
  try {
    // Exemplo: await api.put(`/empresas/${empresaId}`, data);
    console.log(`Atualizando empresa ${empresaId} com dados:`, data);
    return { success: true };
  } catch (error) {
    throw new Error("Erro ao atualizar empresa");
  }
}