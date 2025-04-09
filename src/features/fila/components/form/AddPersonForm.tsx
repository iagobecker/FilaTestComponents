'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Api } from "@/api/api"
import { toast } from "sonner"
import { ClienteDTO } from "@/features/fila/types"

export function AddPersonForm({
  addPerson,
  onClose
}: {
  addPerson: (nome: string, telefone: string, observacao: string) => void
  onClose: () => void
}) {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [observation, setObservation] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const formatPhone = (value: string) => {
    let phoneNumber = value.replace(/\D/g, "")
    if (phoneNumber.length > 11) phoneNumber = phoneNumber.slice(0, 11)

    if (phoneNumber.length <= 10) {
      return phoneNumber.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3")
    } else {
      return phoneNumber.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const phoneDigits = phone.replace(/\D/g, "");
  
    if (!name || phoneDigits.length !== 11) {
      setError("Telefone inválido! Digite um número completo.");
      return;
    }
  
    setError("");
    setIsLoading(true);
  
    try {
      const now = new Date().toISOString();
  
      const response = await Api.post("/empresas/filas/adicionar-cliente", {
        id: crypto.randomUUID(),
        nome: name,
        telefone: phoneDigits,
        observacao: observation,
        status: 1,
        filaId: "b36f453e-a763-4ee1-ae2d-6660c2740de5",
        dataHoraCriado: now,
        dataHoraEntrada: now,
        dataHoraAlterado: now, 
        dataHoraOrdenacao: now 
      });
  
      if (response.status === 200 || response.status === 201) {
        addPerson(name, phoneDigits, observation);
        toast.success("Cliente adicionado com sucesso!");
        onClose();
      } else {
        throw new Error("Erro inesperado ao adicionar cliente.");
      }
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.message || "Erro ao adicionar cliente à fila."
      );
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <form onSubmit={handleSubmit} className="space-y-0.5 p-0.5">
      <div className="p-1 rounded-md">
        <label className="block text-sm font-medium text-gray-700">Nome</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome"
          required
          className="mt-1 block w-full h-8 rounded-sm border border-gray-200 focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-2"
        />
      </div>

      <div className="p-1 rounded-md">
        <label className="block text-sm font-medium text-gray-700">Telefone</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(formatPhone(e.target.value))}
          placeholder="(99) 99999-9999"
          className="mt-1 block w-full h-9 rounded-sm border border-gray-200 focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-2"
        />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>

      <div className="p-1 rounded-md">
        <label className="block text-sm font-medium text-gray-700">Observação interna</label>
        <input
          value={observation}
          onChange={(e) => setObservation(e.target.value)}
          placeholder="Observação"
          className="mt-1 block w-full h-8 rounded-sm border border-gray-200 focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-2"
        />
      </div>

      <div className="flex justify-end pt-6">
        <Button
          type="submit"
          className="max-w-[150px] bg-blue-400 text-white hover:bg-blue-700"
          disabled={isLoading}
        >
          {isLoading ? "Salvando..." : "Salvar"}
        </Button>
      </div>
    </form>
  )
}
