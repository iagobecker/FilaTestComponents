"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Phone, Trash, ArrowUpDown } from "lucide-react";

export function FilaRow({ data }: { data: any }) {
  return (
    <TableRow>
      <TableCell>{data.name}</TableCell>
      <TableCell>
        <Badge variant={data.status === "Em Atendimento" ? "success" : "default"}>
          {data.status}
        </Badge>
      </TableCell>
      <TableCell>{data.phone}</TableCell>
      <TableCell className="flex gap-2">
        <button className="text-green-600 hover:text-green-700">
          <Phone className="w-5 h-5" />
        </button>
        <button className="text-blue-600 hover:text-blue-700">
          <ArrowUpDown className="w-5 h-5" />
        </button>
        <button className="text-red-600 hover:text-red-700">
          <Trash className="w-5 h-5" />
        </button>
      </TableCell>
    </TableRow>
  );
}
