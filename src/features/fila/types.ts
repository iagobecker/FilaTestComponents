export type FilaItem = {
    id: string;
    nome: string;
    telefone: string;
    observacao: string;
    status: string;
    tempo: string;
    ticket: string | null;
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
  };
  export type ClienteResponse = {
    id: string;
    nome: string;
    telefone: string | null;
    ticket: string | null;
    status: number;
    observacao: string | null;
    dataHoraOrdenacao: string;
  };