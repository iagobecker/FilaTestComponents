"use client";

import { Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/images/logoTeste.webp";
import { UserMenu } from "./UserMenu";
import { usePathname } from "next/navigation";

export function Header() {
    const pathname = usePathname();

    return (
        <header className="bg-white border-b shadow-sm w-full sticky top-0 z-50">
            <div className="w-full max-w-[1600px] mx-auto flex flex-wrap justify-between items-center px-4 sm:px-8 py-3">
                {/* Esquerda: Logo + Nome do Sistema + Botão Fila */}
                <div className="flex items-center gap-4 sm:gap-6">
                    <Link href="/" className="flex items-center gap-2 sm:gap-3">
                        <div className="p-2 bg-white border-1 border-gray-400 rounded-md size-9">
                            <Image src={logo} alt="Logo"  />
                        </div>
                        <span className="text-base sm:text-lg font-semibold">Controle de Fila</span>
                    </Link>

                    <Link
                        href="/fila"
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors 
                            ${pathname === "/fila"
                                ? "bg-blue-500 text-white"
                                : "text-blue-600 bg-transparent hover:bg-blue-200"
                            }
                            `}
                    >
                        <Users className="w-4 h-4" />
                        <span className="none ">Fila</span>
                    </Link>
                </div>

                {/* Direita: Menu do Usuário */}
                <div className="mt-3 sm:mt-0">
                    <UserMenu />
                </div>
            </div>
        </header>
    );
}
