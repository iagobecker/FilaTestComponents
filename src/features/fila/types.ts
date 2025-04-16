import { StatusType } from "./provider/FilaProvider";

export type FilaItem = {
    id: string;
    nome: string;
    telefone: string;
    observacao: string;
    status: StatusType;
    tempo: string;
    ticket: string | null;
    dataHoraCriado?: string;
  };

  export type ClienteDTO = {
    id: string;
    nome: string;
    telefone: string;
    observacao: string;
    status: number;
    filaId: string;
    dataHoraCriado: string;
    dataHoraEntrada: string;
    dataHoraAlterado: string;
    dataHoraOrdenacao: string;
    ticket: string | null;
    hash: string;
    dataHoraChamada: string | null;
    dataHoraDeletado: string | null;
  };
  
  export type HorarioResponse = {
    id: string;
    diaSemana: number;
    horaInicio: string;
    horaFinal: string;
  }
  
  export type FilaResponse = {
    id: string;
    setor: string | null;
    tempoMedioEspera: number;
    empresaId: string;
    dataHoraCriado: string;
    clientes: ClienteResponse[];
    horarios: HorarioResponse[];
  };

  export type ClienteResponse = {
    id: string;
    nome: string;
    telefone: string | null;
    ticket: string | null;
    status: number;
    observacao: string | null;
    dataHoraOrdenacao: string;
    dataHoraCriado: string;
  };