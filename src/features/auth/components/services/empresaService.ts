import { Api } from "@/api/api";
import { toast } from "sonner";

export interface Empresa {
  id: string;
  nome: string;
  cpfCnpj: string;
  email: string;
  filas: Fila[];
  vinculacoes: Vinculacao[];
  configuracao: Configuracao;
  dataHoraCriado?: string;
  dataHoraAlterado?: string;
  dataHoraDeletado?: string;
}

export interface Fila {
  id: string;
  setor: string;
  tempoMedioEspera: number;
  empresaId: string;
  clientes: Cliente[];
  empresa: string;
  dataHoraCriado?: string;
  dataHoraAlterado?: string;
  dataHoraDeletado?: string;
}

export interface Cliente {
  id: string;
  status: number;
  nome: string;
  ticket: string | null;
  telefone: string;
  posicao: number;
  observacao: string;
  filaId: string;
  hash: string;
  dataHoraOrdenacao: string;
  dataHoraChamada: string | null;
  dataHoraCriado?: string;
  dataHoraAlterado?: string;
  dataHoraDeletado?: string;
}

export interface Vinculacao {
  id: string;
  idVinculacao: string;
  empresaId: string;
  filaId: string;
  observacao: string;
  dataHoraCriado?: string;
  dataHoraAlterado?: string;
  dataHoraDeletado?: string;
}

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

export async function fetchEmpresa(): Promise<Empresa> {
  try {
    const response = await Api.get("/empresas");
    return response.data as Empresa;
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Erro ao buscar dados da empresa.");
    throw error;
  }
}

export async function fetchFilaById(filaId: string): Promise<Fila> {
  try {
    const response = await Api.get(`/filas/${filaId}`);
    return response.data as Fila;
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Erro ao buscar dados da fila.");
    throw error;
  }
}