"use client";

import { useDadosEmpresaForm } from "../hooks/useDadosEmpresaForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DadosEmpresaFormProps {
  empresaId: string;
}

export default function DadosEmpresaForm({ empresaId }: DadosEmpresaFormProps) {
  const { register, handleSubmit, errors, loading, onSubmit, isValidEmpresa } = useDadosEmpresaForm(empresaId);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Carregando...</div>;
  }

  if (!isValidEmpresa) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Empresa inválida ou não encontrada.
      </div>
    );
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
        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
      </div>

      <div className="space-y-1">
        <Label>CPF/CNPJ</Label>
        <Input placeholder="Digite o CPF ou CNPJ" {...register("cpfCnpj")} />
        {errors.cpfCnpj && <p className="text-sm text-red-500">{errors.cpfCnpj.message}</p>}
      </div>

      <div className="pt-4">
        <Button
          type="submit"
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white"
          disabled={loading}
        >
          {loading ? "Carregando..." : "Salvar"}
        </Button>
      </div>
    </form>
  );
}