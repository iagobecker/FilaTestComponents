"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Users, ArrowUpDown, Trash } from "lucide-react";

export default function ThreeDotsMenu({
  onCall,
  onChangePosition,
  onDelete,
}: {
  onCall: () => void;
  onChangePosition: () => void;
  onDelete: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <MoreHorizontal className="w-5 h-5 text-gray-600 hover:text-gray-900" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onClick={onCall} className="cursor-pointer flex items-center gap-2">
          <Users className="w-4 h-4" />
          Chamar
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onChangePosition} className="cursor-pointer flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4" />
          Mudar posição
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onDelete} className="cursor-pointer flex items-center gap-2 text-red-600 hover:bg-red-100">
          <Trash className="w-4 h-4" />
          Remover
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
