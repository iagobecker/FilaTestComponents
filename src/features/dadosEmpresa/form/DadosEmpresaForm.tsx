"use client"

import { useEffect, useContext } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { AuthContext } from "@/features/auth/context/AuthContext"

const formSchema = z.object({
  nomeEmpresa: z.string().min(1, "Nome da empresa é obrigatório"),
  email: z.string().email("E-mail inválido"),
  cpfCnpj: z.string().min(11, "CPF/CNPJ inválido"),
  redefinirEmail: z.string().email("E-mail inválido para redefinição"),
})

type FormData = z.infer<typeof formSchema>

export default function DadosEmpresaForm() {
  const { user, loading } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  useEffect(() => {
    if (!loading && user?.empresa) {
      reset({
        nomeEmpresa: user.empresa.nome || "",
        email: user.empresa.email || "",
        cpfCnpj: user.empresa.cpfCnpj || "",
        redefinirEmail: user.empresa.email || "",
      });
    } else if (!loading) {
      reset({
        nomeEmpresa: "",
        email: "",
        cpfCnpj: "",
        redefinirEmail: "",
      });
    }
  }, [user, loading, reset]);

  const onSubmit = (data: FormData) => {
    // TODO: atualizar via Api.put('/empresas/', data)
  }

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-md space-y-4 p-4 bg-white rounded-lg shadow-md"
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
        <Button type="submit" className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white">
          Salvar
        </Button>
      </div>
    </form>
  )
}