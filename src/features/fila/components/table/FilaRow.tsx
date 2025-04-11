"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Phone, Trash, CircleArrowUp, CircleArrowDown } from "lucide-react";
import { FilaItem } from "@/features/fila/types"


type BadgeVariant = "success" | "warning" | "danger" | "default";


// Define a função que renderiza uma linha da tabela
export function FilaRow({
  data,
  onCall,
  onMoveUp,
  onMoveDown,
  onDelete,
}: {
  data: FilaItem;
  onCall: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
}) {

  const statusColors: Record<string, BadgeVariant> = {
    "Em Atendimento": "success",
    "Aguardando": "warning",
    "Cancelado": "danger",
  };

  return (
    <TableRow>
      {/* Nome */}
      <TableCell>{data.nome}</TableCell>

      {/* Status */}
      <TableCell>
        <Badge variant={statusColors[data.status] || "default"}>
          {data.status}
        </Badge>
      </TableCell>

      {/* Telefone */}
      <TableCell>{data.telefone}</TableCell>

      {/* Botões de Ação */}
      <TableCell className="flex gap-2 justify-end">
        <button
          onClick={onCall}
          className="text-green-600 hover:text-green-700 transition"
        >
          <Phone className="w-5 h-5" />
        </button>

        <button
          onClick={onMoveUp}
          className="text-blue-600 hover:text-blue-700 transition"
        >
          <CircleArrowUp className="w-5 h-5" />
        </button>

        <button
          onClick={onMoveDown}
          className="text-orange-600 hover:text-orange-700 transition"
        >
          <CircleArrowDown className="w-5 h-5" />
        </button>

        <button
          onClick={onDelete}
          className="text-red-600 hover:text-red-700 transition"
        >
          <Trash className="w-5 h-5" />
        </button>
      </TableCell>
    </TableRow>
  );
}
