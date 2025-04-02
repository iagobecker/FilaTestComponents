"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown, LogOut, Settings, User } from "lucide-react";
import Link from "next/link";

export function UserMenu() {
  return (
    <DropdownMenu>
      {/* Avatar + Nome + Ícone de Dropdown */}
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-2 rounded-md p-2 transition 
                     focus:outline-none focus-visible:ring-0 hover:bg-blue-50"
        >
          <Avatar className="w-10 h-10 ">
            <AvatarImage alt="User Avatar" />
            <AvatarFallback>AP</AvatarFallback>
          </Avatar>
          <div className="text-left">
            <p className="text-sm font-medium text-gray-900">Administrativo</p>
            <p className="text-xs text-gray-500">Administrador</p>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </button>
      </DropdownMenuTrigger>

      {/* Conteúdo do Dropdown */}
      <DropdownMenuContent align="end" className="w-56 shadow-md rounded-md">

        <DropdownMenuItem
          className="cursor-pointer flex items-center gap-2 px-3 py-2 
                     data-[highlighted]:bg-blue-100 data-[highlighted]:text-blue-600 transition"
        >
          <User className="w-4 h-4 text-blue-600" />
          <span>Meu Perfil</span>
        </DropdownMenuItem>

        <Link href="/configuracoes" passHref>
          <DropdownMenuItem className="cursor-pointer flex items-center gap-2 px-3 py-2 
                     data-[highlighted]:bg-blue-100 data-[highlighted]:text-blue-600 transition">
            <Settings className="w-4 h-4 text-blue-600" />
            <span>Configurações</span>
          </DropdownMenuItem>
        </Link>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="cursor-pointer flex items-center gap-2 px-3 py-2 text-red-600 
                     data-[highlighted]:bg-red-100 transition"
        >
          <LogOut className="w-4 h-4 text-red-600" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
