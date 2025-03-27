"use client";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export function VoltarButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/configuracoes")}
      className="flex items-center gap-2 text-sm cursor-pointer text-black font-medium hover:underline mb-6"
    >
      <ChevronLeft className="w-5 h-5 " />
      Configurações
    </button>
  );
}
