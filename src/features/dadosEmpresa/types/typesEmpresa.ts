import { z } from "zod";

export const formSchema = z.object({
  nomeEmpresa: z.string().min(1, "Nome da empresa é obrigatório"),
  email: z.string().email("E-mail inválido"),
  cpfCnpj: z.string().min(11, "CPF/CNPJ inválido"),
  redefinirEmail: z.string().email("E-mail inválido para redefinição"),
});

export type FormData = z.infer<typeof formSchema>;