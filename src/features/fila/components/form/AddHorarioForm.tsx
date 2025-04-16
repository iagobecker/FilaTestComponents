'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Api } from "@/api/api";
import { toast } from "sonner";

type AddHorarioFormProps = {
  filaId: string;
  onClose: () => void;
  onSuccess?: () => void;
};

export function AddHorarioForm({ filaId, onClose, onSuccess }: AddHorarioFormProps) {
  const [diaSemana, setDiaSemana] = useState<number>(1);
  const [horaInicio, setHoraInicio] = useState("08:00");
  const [horaFinal, setHoraFinal] = useState("18:00");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = [
      {
        id: crypto.randomUUID(),
        dataHoraCriado: new Date().toISOString(),
        dataHoraAlterado: new Date().toISOString(),
        dataHoraDeletado: null,
        diaSemana,
        horaInicio: `${horaInicio}:00`,
        horaFinal: `${horaFinal}:00`,
        filaId,
      },
    ];

    setLoading(true);

    try {
      await Api.post("/empresas/filas/horarios/adicionar-horarios", payload);
      toast.success("Horário adicionado com sucesso!");
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao adicionar horário.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="text-sm font-medium block mb-1">Dia da semana</label>
        <select
          value={diaSemana}
          onChange={(e) => setDiaSemana(Number(e.target.value))}
          className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm"
        >
          <option value={1}>Segunda-feira</option>
          <option value={2}>Terça-feira</option>
          <option value={3}>Quarta-feira</option>
          <option value={4}>Quinta-feira</option>
          <option value={5}>Sexta-feira</option>
          <option value={6}>Sábado</option>
          <option value={0}>Domingo</option>
        </select>
      </div>

      <div>
        <label className="text-sm font-medium block mb-1">Hora de Início</label>
        <input
          type="time"
          value={horaInicio}
          onChange={(e) => setHoraInicio(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm"
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium block mb-1">Hora Final</label>
        <input
          type="time"
          value={horaFinal}
          onChange={(e) => setHoraFinal(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm"
          required
        />
      </div>

      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          className="bg-blue-500 text-white hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Salvando..." : "Salvar Horário"}
        </Button>
      </div>
    </form>
  );
}
