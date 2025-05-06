"use client";

import { Button } from "@/components/ui/button";
import { useVinculacaoMonitor } from "@/features/vinculacao-monitor/hooks/useVinculacaoMonitor";

interface InputVinculacaoProps {
    empresaId: string;
  }
  
  export default function InputVinculacao({ empresaId }: InputVinculacaoProps) {
    const { digitado, setDigitado, resposta, handleVincular } = useVinculacaoMonitor(empresaId);
  
    return (
      <div className="flex gap-2 p-2 items-center mt-2">
        <input
          type="text"
          value={digitado}
          onChange={(e) => setDigitado(e.target.value)}
          placeholder="Código de 4 dígitos"
          className="border border-gray-300 rounded-md p-1.5 w-50"
        />
        <Button onClick={handleVincular} className="bg-blue-400 hover:bg-blue-600 text-white">
          Vincular
        </Button>
        {resposta && <span className="text-sm text-blue-700 ml-2">{resposta}</span>}
      </div>
    );
  }