//import { loginAction } from "@/features/auth/actions/login-action"
import { logoutAction } from "../actions/logout-action"
import { Usuario } from "../types/usuario"
//import { RedefinicaoSenhaUsuario } from ""

export const AuthService = {
    login,
    logout,
    //redefinirSenha
}

async function login(credenciais: { usuario: string, senha: string }) {
    //const response = await loginAction(credenciais)
    
    // if (!response.success) {
    //     throw new Error(response.error)
    // }
    
    // if (!response.data) {
    //     throw new Error('Usuário não encontrado')
    // }
    
    // return response.data
}

async function logout(): Promise<void> {
    await logoutAction()
}

// async function redefinirSenha(dados: RedefinicaoSenhaUsuario): Promise<void> {
//     // Implementação da redefinição de senha
// }