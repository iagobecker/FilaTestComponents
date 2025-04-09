import axios from 'axios'

export interface VinculacaoPayload {
  Codigo: string
  Aplicativo: number
  CpfCnpj: string
  NomeEmpresa: string
  AplicativoVinculado: number
  
}

export async function vincularAplicativo(payload: VinculacaoPayload) {
  const response = await axios.post('/api/vincular', payload)
  return response.data
}
