// Enum para status
export enum Status {
  Aguardando = 1,
  Chamado = 2,
  Atendido = 3,
  Desistente = 4,
  Removido = 5,
}

export type StatusType = Status;

// Tipo para clientes retornados pela API e usados no frontend
export type FilaItem = {
  id: string; 
  filaId: string; 
  hash: string; 
  status: StatusType;
  nome: string;
  telefone: string;
  observacao: string;
  ticket: string | null;
  posicao?: number;
  dataHoraCriado: string; 
  dataHoraOrdenacao?: string;
  dataHoraChamada: string | null;
  dataHoraAlterado?: string;
  dataHoraEntrada: string | null;
  dataHoraDeletado: string | null;
  tempo: string; // Calculado no frontend
  _forceRender?: number; // Usado no frontend para forçar re-render
};

// Tipo para horários da fila
export type HorarioResponse = {
  id: string;
  diaSemana: number;
  horaInicio: string;
  horaFinal: string;
  filaId: string;
  dataHoraCriado: string;
  dataHoraAlterado: string;
  dataHoraDeletado: string | null;
};

// Tipo para a resposta da API
export type FilaResponse = {
  id: string;
  setor: string | null;
  tempoMedioEspera: number;
  empresaId: string;
  dataHoraCriado: string;
  dataHoraAlterado: string;
  dataHoraDeletado: string | null;
  clientes: FilaItem[];
  horarios: HorarioResponse[];
  vinculacoes: any[];
  empresa: any;
};

// Tipo para payloads de atualização de clientes
export type ClienteAtualizado = {
  id: string;
  nome: string;
  telefone: string;
  status: StatusType;
  observacao?: string;
  ticket?: string | null;
};

// Tipo para edição de campos
export type EditaCampos = {
  nome?: string;
  telefone?: string;
  observacao?: string;
};