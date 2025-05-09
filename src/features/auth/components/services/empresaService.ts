import { Api } from "@/api/api";
import { toast } from "sonner";
import { Status } from "@/features/fila/components/types/types";
export interface Empresa {
  filaId: any;
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
    nome: string;
    telefone: string | null;
    observacao: string | null;
    hash: string;
    filaId: string;
    status: Status;
    tempo?: string; // Calculado no frontend
    ticket: string | null;
    posicao?: number;
    dataHoraCriado: string; // Sempre retornado pelo backend
    dataHoraOrdenacao: string; // Sempre retornado pelo backend
    dataHoraChamada: string | null;
    dataHoraDeletado: string | null;
    dataHoraEntrada?: string | null; // Opcional, não retornado pelo backend
    dataHoraAlterado: string; // Sempre retornado pelo backend
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

export const EmpresaService = {
  async fetchEmpresa(): Promise<Empresa> {
    try {
      const response = await Api.get("/empresas");
      const empresa = response.data as Empresa;
      if (!empresa || !empresa.id) {
        throw new Error("Dados da empresa inválidos");
      }
      return empresa;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Erro ao buscar dados da empresa.";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  async fetchFilaById(filaId: string): Promise<Fila> {
    try {
      const response = await Api.get(`/filas/${filaId}`);
      const fila = response.data as Fila;
      if (!fila || !fila.id) {
        throw new Error("Dados da fila inválidos");
      }
      return fila;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Erro ao buscar dados da fila.";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },
};