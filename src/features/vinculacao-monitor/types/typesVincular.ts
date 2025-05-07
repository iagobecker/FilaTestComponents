export interface Empresa {
    id: string;
    nome: string;
    cpfCnpj: string;
    filas?: { id: string }[];
  }
  
  export interface VinculacaoPayload {
    Aplicativo: number;
    Codigo: string;
    CpfCnpj: string;
    NomeEmpresa: string;
    AplicativoVinculado: number;
    Host: null | string;
    Porta: null | number;
    IdCliente: number;
    Detalhes: Record<string, any>;
  }
  
  export interface VinculacaoResponse {
    idVinculacaoAplicativo: string;
  }
  
  export interface VinculacaoData {
    Codigo: string;
    filaId: string;
    observacao: string | null;
  }