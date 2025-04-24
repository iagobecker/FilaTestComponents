export type FilaItem = {
    id: string;
    nome: string;
    telefone: string;
    observacao: string;
    status: StatusType;
    tempo: string;
    ticket: string | null;
    posicao?: number;
    dataHoraCriado?: string;
    dataHoraOrdenacao?: string;
    dataHoraChamada?: string | null;
    dataHoraDeletado?: string | null;
    dataHoraEntrada?: string | null;
  };

  export enum Status {
    Aguardando = 1,
    Chamado = 2,
    Atendido = 3,
    NaoCompareceu = 4,
    Removido = 5,
  }
  
  export type StatusType = Status;
  

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