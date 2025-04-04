import { z } from "zod"

export const loginFormSchema = z.object({
    usuario: z.string().min(3, "Usuário deve ter pelo menos 3 caracteres"),
    senha: z.string().min(6, "Senha deve ter pelo menos 6 caracteres")
})