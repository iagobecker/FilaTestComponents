"use client";

import { Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/images/logoTeste.webp";
import { UserMenu } from "./UserMenu";

export function Header() {
    return (
        <header className="bg-white border-b shadow-sm w-full sticky top-0 z-50">
            <div className="w-full max-w-[1600px] mx-auto flex justify-between items-center px-8 py-3">
                {/* Esquerda: Logo + Nome do Sistema + Botão Fila */}
                <div className="flex items-center gap-6">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500 rounded-md">
                            <Image src={logo} alt="Logo" width={30} height={30} />
                        </div>
                        <span className="text-lg font-semibold">Controle de Fila</span>
                    </Link>
               
                    <Link
                        href="/fila"
                        className="flex items-center gap-2 px-3 py-1.5 text-blue-600 bg-blue-100 rounded-md text-sm font-medium hover:bg-blue-200 transition-colors"
                    >
                        <Users className="w-4 h-4" />
                        Fila
                    </Link>
                </div>

                {/* Direita: Menu do Usuário */}
                <UserMenu />
            </div>
        </header>
    );
}
