export type ConfiguracaoType = {
    empresaId: string;
    nomeDisplay: string;
    enderecoDisplay: string;
    whatsappAtivo?: boolean;
    mensagemEntrada?: string;
    mensagemChamada?: string;
    mensagemRemovido?: string;
    logoUrl?: string;
    corPrimaria: string;
    corSobreposicao: string;
    corTexto: string;
    id?: string;
    dataHoraCriado?: string;
    dataHoraAlterado?: string;
    dataHoraDeletado?: string;
};
