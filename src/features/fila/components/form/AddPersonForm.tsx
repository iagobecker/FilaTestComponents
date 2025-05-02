'use client';

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const schema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  telefone: z.string().min(1, "Telefone é obrigatório"),
  observacao: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function AddPersonForm({
  addPerson,
  onClose,
}: {
  addPerson: (nome: string, telefone: string, observacao: string, filaId: string) => void;
  onClose: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    // Obtém o filaId do contexto ou prop (já é passado via addPerson)
    addPerson(data.nome, data.telefone, data.observacao || "", ""); // filaId será preenchido pelo pai
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="nome">Nome</label>
        <Input id="nome" {...register("nome")} />
        {errors.nome && <p className="text-red-500 text-sm">{errors.nome.message}</p>}
      </div>
      <div>
        <label htmlFor="telefone">Telefone</label>
        <Input id="telefone" {...register("telefone")} />
        {errors.telefone && <p className="text-red-500 text-sm">{errors.telefone.message}</p>}
      </div>
      <div>
        <label htmlFor="observacao">Observação</label>
        <Input id="observacao" {...register("observacao")} />
      </div>
      <Button type="submit">Adicionar</Button>
    </form>
  );
}