"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function AddPersonForm({ addPerson, onClose }: { 
  addPerson: (nome: string, telefone: string, observacao: string) => void; 
  onClose: () => void; 
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [observation, setObservation] = useState("");
  const [error, setError] = useState("");

  // Função para formatar telefone enquanto o usuário digita
  const formatPhone = (value: string) => {
    // Remove tudo que não for número
    let phoneNumber = value.replace(/\D/g, "");

    // Limita para 11 caracteres 
    if (phoneNumber.length > 11) {
      phoneNumber = phoneNumber.slice(0, 11);
    }

    // Aplica a máscara (99) 99999-9999
    if (phoneNumber.length <= 10) {
      return phoneNumber.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
    } else {
      return phoneNumber.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
    }
  };

  // Validação e envio do formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const phoneDigits = phone.replace(/\D/g, ""); 

    if (!name || phoneDigits.length !== 11) {
      setError("Telefone inválido! Digite um número completo.");
      return;
    }

    setError("");
    addPerson(name, phone, observation);
    onClose();
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
        <Button type="submit" className="max-w-[150px] bg-blue-400 text-white hover:bg-blue-700">
          Salvar
        </Button>
      </div>
    </form>
  );
}
