"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { ChevronRight } from "lucide-react";

interface ConfigCardProps {
    title: string;
    description: string;
    icon: ReactNode;
    bgColor: string;
    borderColor: string;
    href?: string;
    onClick?: () => void;
}

export function ConfigCard({ title, description, icon, bgColor, borderColor, href, onClick }: ConfigCardProps) {
    const isLink = !!href;
    
    const Wrapper = isLink ? Link : "button";
    const wrapperProps = isLink ? { href } : { onClick, type: "button" };

    return (
        <Wrapper {...(wrapperProps as any)} className="block w-full">
            <div className={`border-2 ${borderColor} pt-5 pb-10 pl-3 pr-2 rounded-lg shadow-sm hover:shadow-xl transition bg-white flex flex-col gap-3 group cursor-pointer`}>
                
                {/* Linha superior: Ícone, Título e Seta */}
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3 pb-8">
                        {/* Ícone com animação de hover */}
                        <div className={`p-3 rounded-lg ${bgColor} flex items-center justify-center transition-transform group-hover:scale-110`}>
                            {icon}
                        </div>

                        {/* Título que muda de cor ao passar o mouse */}
                        <h3 className="font-semibold text-[26px] transition-colors group-hover:text-blue-800">
                            {title}
                        </h3>
                    </div>

                    {/* Seta que muda de cor ao passar o mouse */}
                    <ChevronRight className="w-5 h-5 text-gray-400 transition-colors group-hover:text-blue-800" />
                </div>

                {/* Descrição abaixo */}
                <p className="text-gray-500 text-[18px]">{description}</p>
            </div>
        </Wrapper>
    );
}
