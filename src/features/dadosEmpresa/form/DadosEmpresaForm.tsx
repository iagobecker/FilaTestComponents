"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Api } from "@/api/api"
import { useAuth } from "@/features/auth/context/AuthContext"

const formSchema = z.object({
  nomeEmpresa: z.string().min(1, "Nome da empresa é obrigatório"),
  email: z.string().email("E-mail inválido"),
  cpfCnpj: z.string().min(11, "CPF/CNPJ inválido"),
  redefinirEmail: z.string().email("E-mail inválido para redefinição"),
})

type FormData = z.infer<typeof formSchema>

export default function DadosEmpresaForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })


  useEffect(() => {
    async function fetchEmpresa() {
      try {
        const res = await Api.get('/empresas/pegar-dados-empresa');
        const empresa = res.data;

        reset({
          nomeEmpresa: empresa.nome,
          email: empresa.email,
          cpfCnpj: empresa.cpfCnpj,
          redefinirEmail: empresa.email,
        });
      } catch (err) {
        console.error("Erro ao buscar dados da empresa autenticada:", err);
      }
    }

    fetchEmpresa();
  }, [reset]);

  const onSubmit = (data: FormData) => {
    // TODO: atualizar via Api.put('/empresas/', data)
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-md space-y-4 p-4"
    >
      <div className="space-y-1">
        <Label>Nome da empresa</Label>
        <Input placeholder="Nome fantasia" {...register("nomeEmpresa")} />
        {errors.nomeEmpresa && (
          <p className="text-sm text-red-500">{errors.nomeEmpresa.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label>Email</Label>
        <Input type="email" placeholder="email@exemplo.com" {...register("email")} />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label>CPF/CNPJ</Label>
        <Input placeholder="Digite o CPF ou CNPJ" {...register("cpfCnpj")} />
        {errors.cpfCnpj && (
          <p className="text-sm text-red-500">{errors.cpfCnpj.message}</p>
        )}
      </div>    

      <div className="pt-4">
        <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white">
          Salvar
        </Button>
      </div>
    </form>
  )
}
