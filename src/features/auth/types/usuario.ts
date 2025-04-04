export type Usuario = {
    id: number
    nome: string
    email: string
    tipoAcesso: TipoAcesso
    primeiroAcesso: boolean
}

export enum TipoAcesso {
    ADMIN = 1,
    USUARIO = 2
}