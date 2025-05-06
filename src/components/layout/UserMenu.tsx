"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown, LogOut, Settings, User } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/features/auth/context/AuthContext";

export function UserMenu() {
  const { signOut, user } = useAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-2 rounded-md p-2 transition 
                     focus:outline-none focus-visible:ring-0 hover:bg-blue-50 
                     sm:gap-3 sm:p-3"
        >
          <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
            <AvatarImage alt="User Avatar" />
            <AvatarFallback>AP</AvatarFallback>
          </Avatar>
          <div className="text-left hidden sm:block">
            <p className="text-sm font-medium text-gray-900">Administrativo</p>
            <p className="text-xs text-gray-500">Administrador</p>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-48 sm:w-56 shadow-md rounded-md"
      >
        <Link href={`/dados-empresa/${user?.empresaId}`} passHref>
          <DropdownMenuItem
            className="cursor-pointer flex items-center gap-2 px-3 py-2 
                       data-[highlighted]:bg-blue-100 data-[highlighted]:text-blue-600 transition"
          >
            <User className="w-4 h-4 text-blue-600" />
            <span>Dados da empresa</span>
          </DropdownMenuItem>
        </Link>

        <Link href="/configuracoes" passHref>
          <DropdownMenuItem
            className="cursor-pointer flex items-center gap-2 px-3 py-2 
                       data-[highlighted]:bg-blue-100 data-[highlighted]:text-blue-600 transition"
          >
            <Settings className="w-4 h-4 text-blue-600" />
            <span>Configurações</span>
          </DropdownMenuItem>
        </Link>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={signOut}
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