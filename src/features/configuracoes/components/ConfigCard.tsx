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
  disabled?: boolean; // Adicionando a prop disabled
}

export function ConfigCard({
  title,
  description,
  icon,
  bgColor,
  borderColor,
  href,
  onClick,
  disabled = false, // Valor padrão para disabled
}: ConfigCardProps) {
  const isLink = !!href;

  const Wrapper = isLink && !disabled ? Link : "button"; // Desabilitar navegação se disabled for true
  const wrapperProps = isLink && !disabled
    ? { href }
    : { onClick: disabled ? undefined : onClick, type: "button" };

  const handleClick = () => {
    if (disabled) return; // Não faz nada se estiver desabilitado
    if (isLink) {
      console.log(`Navegando para: ${href}`);
    } else if (onClick) {
      console.log(`Executando onClick para: ${title}`);
      onClick();
    }
  };

  return (
    <Wrapper
      {...(wrapperProps as any)}
      onClick={handleClick}
      className={`block w-full ${disabled ? "pointer-events-none" : ""}`}
    >
      <div
        className={`border-2 ${borderColor} pt-5 pb-10 pl-3 pr-2 rounded-lg shadow-sm transition bg-white flex flex-col gap-3 group cursor-pointer ${disabled ? "opacity-50" : "hover:shadow-xl"}`}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3 pb-8">
            <div
              className={`p-3 rounded-lg ${bgColor} flex items-center justify-center transition-transform ${disabled ? "" : "group-hover:scale-110"}`}
            >
              {icon}
            </div>
            <h3
              className={`font-semibold text-[26px] transition-colors ${disabled ? "text-gray-500" : "group-hover:text-blue-800"}`}
            >
              {title}
            </h3>
          </div>
          <ChevronRight
            className={`w-5 h-5 transition-colors ${disabled ? "text-gray-400" : "text-gray-400 group-hover:text-blue-800"}`}
          />
        </div>
        <p className="text-gray-500 text-[18px]">{description}</p>
      </div>
    </Wrapper>
  );
}