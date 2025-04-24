import { Api } from "@/api/api";
import {  FilaItem, FilaResponse, StatusType } from "@/features/fila/types";
import { padraoCliente } from "@/lib/utils/padraoCliente";

export async function fetchFilaClientes(): Promise<FilaItem[]> {
  const response = await Api.get("/empresas/filas/b36f453e-a763-4ee1-ae2d-6660c2740de5/pegar-dados-fila");
  const filas: FilaResponse = response.data;
  return filas.clientes.map(padraoCliente);
}
