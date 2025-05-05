"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FilaItem } from "@/features/fila/components/types/types"
import { useState } from "react";

type EditClientFormProps = {
  client: FilaItem;
  onSave: (client: FilaItem) => void;
};

export function EditClientForm({ client, onSave }: EditClientFormProps) {
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    setValue,
    watch
  } = useForm<FilaItem>({
    defaultValues: client
  });

  const [error, setError] = useState("");

  // Função para formatar telefone enquanto o usuário digita
  const formatPhone = (value: string) => {
    let phoneNumber = value.replace(/\D/g, "");
    
    if (phoneNumber.length > 11) {
      phoneNumber = phoneNumber.slice(0, 11);
    }

    if (phoneNumber.length <= 10) {
      return phoneNumber.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
    } else {
      return phoneNumber.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
    }
  };

  const onSubmit = (data: FilaItem) => {
    const phoneDigits = data.telefone.replace(/\D/g, "");
    
    if (phoneDigits.length !== 11) {
      setError("Telefone inválido! Digite um número completo.");
      return;
    }

    setError("");
    onSave(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-0.5 p-0.5">
      <div className="p-1 rounded-md">
        <label className="block text-sm font-medium text-gray-700">Nome</label>
        <input
          type="text"
          {...register("nome", { required: "Nome é obrigatório" })}
          className="mt-1 block w-full h-8 rounded-sm border border-gray-200 focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-2"
        />
        {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome.message}</p>}
      </div>

      <div className="p-1 rounded-md">
        <label className="block text-sm font-medium text-gray-700">Telefone</label>
        <input
          type="tel"
          {...register("telefone", { 
            required: "Telefone é obrigatório",
            onChange: (e) => {
              setValue("telefone", formatPhone(e.target.value));
            }
          })}
          className="mt-1 block w-full h-9 rounded-sm border border-gray-200 focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-2"
        />
        {errors.telefone && <p className="text-red-500 text-xs mt-1">{errors.telefone.message}</p>}
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>

      <div className="p-1 rounded-md">
        <label className="block text-sm font-medium text-gray-700">Observação interna</label>
        <input
          {...register("observacao")}
          className="mt-1 block w-full h-8 rounded-sm border border-gray-200 focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-2"
        />
      </div>

      <div className="flex justify-end pt-6">
        <Button 
          type="submit" 
          className="max-w-[150px] bg-blue-400 text-white hover:bg-blue-700"
        >
          Salvar
        </Button>
      </div>
    </form>
  );
}