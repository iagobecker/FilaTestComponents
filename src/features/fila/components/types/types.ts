export type FilaItem = {
    id: string;
    nome: string;
    telefone: string;
    observacao: string;
    hash: string;
    filaId: string;
    status: StatusType;
    tempo: string;
    ticket: string | null;
    posicao?: number;
    dataHoraCriado?: string;
    dataHoraOrdenacao?: string;
    dataHoraChamada?: string | null;
    dataHoraDeletado?: string | null;
    dataHoraEntrada?: string | null;
    dataHoraAlterado?: string;
  };

  export enum Status {
    Aguardando = 1,
    Chamado = 2,
    Atendido = 3,
    NaoCompareceu = 4,
    Removido = 5,
  }
  
  export type StatusType = Status;

  export type BaseClientItem = {
    id: string;
    ticket: string | null;
    nome: string;
    telefone: string;
    observacao: string;
    tempo: string;
    status: StatusType;
    hash: string;
    filaId: string;
    posicao?: number;
    dataHoraCriado?: string;
    dataHoraOrdenacao?: string;
    dataHoraChamada?: string | null;
    dataHoraDeletado?: string | null;
  };
  
  // Define o tipo de cliente atualizado, que pode incluir propriedades adicionais para editar
  export type ClienteAtualizado = {
    id: string;
    nome: string;
    telefone: string;
    status: StatusType;
    observacao?: string;
    ticket?: string | null;
    tempo?: string;
  };

  export type EditaCampos = {
    nome?: string;
    telefone?: string;
    observacao?: string;
  };
  
  export type FilaItemExt = BaseClientItem;
  export type ChamadaItem = BaseClientItem;

  export type ClienteDTO = {
    id: string;
    nome: string;
    telefone: string;
    observacao: string;
    status: number;
    filaId: string;
    tempo: string;
    posicao?: number;
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