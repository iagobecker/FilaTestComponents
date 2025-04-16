import { Api } from "@/api/api";

export async function getConfiguracaoByEmpresaId(empresaId: string) {
  const res = await Api.get("/empresas/configuracoes");
  const lista = res.data as any[];

  return lista.find(cfg => cfg.empresaId === empresaId);
}

export async function atualizarConfiguracao(config: any) {
  return Api.put("/empresas/configuracoes", { model: config });
}
