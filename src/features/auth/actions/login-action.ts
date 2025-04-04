'use server'

import { cookies } from "next/headers"
//import { api } from "@/api/api"
import { Usuario } from "../types/usuario"
//import { serverAction } from "@/lib/server-action"

async function login({ usuario, senha }: { usuario: string, senha: string }) {
    // const response = await api.post<{ accessToken: string, usuario: Usuario }>(
    //     'auth/login', 
    //     { usuario, senha }
    // )

    // ;(await cookies()).set('access-token', response.accessToken, {
    //     httpOnly: true,
    //     secure: process.env.NODE_ENV === 'production',
    //     maxAge: 60 * 60 * 24 * 7 // 7 dias
    // })

    //return response.usuario
}

//export const loginAction = serverAction(login)