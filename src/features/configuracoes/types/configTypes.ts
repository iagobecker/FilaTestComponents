export type ConfiguracaoType = {
    empresaId: string;
    nomeDisplay: string;
    enderecoDisplay: string;
    whatsappAtivo?: boolean;
    mensagemEntrada?: string;
    mensagemChamada?: string;
    mensagemRemovido?: string;
    logoUrl?: string | null;
    corPrimaria: string;
    corSobreposicao: string;
    corTexto: string;
    id?: string;
    dataHoraCriado?: string;
    dataHoraAlterado?: string | null;
    dataHoraDeletado?: string | null;
};
export interface Configuracao {
    id: string;
    [key: string]: any;
  }
  
  export interface Fila {
    id: string;
    [key: string]: any;
  }