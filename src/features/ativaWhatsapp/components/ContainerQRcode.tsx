"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Api } from "@/api/api"; // supondo que é onde está o seu Axios customizado
import { Loader2 } from "lucide-react"; // só para loading girando bonito

export default function ContainerWPQRcode() {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(false);

  async function buscarQRCode() {
    setLoading(true);
    setErro(false);
    try {
      const response = await Api.get("/empresas/configuracoes/pegar-qrcode-whatsapp");
      setQrCode(response.data?.data?.QRCode || null);
    } catch (error) {
      console.error("Erro ao buscar QRCode:", error);
      setErro(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    buscarQRCode();
  }, []);

  return (
    <Card className="w-full max-w-none border border-green-300 bg-muted/20 shadow-sm rounded-lg p-10 md:p-16">
      <CardHeader>
        <CardTitle className="text-4xl font-bold">Escanear QR code</CardTitle>
        <CardDescription className="text-xl text-gray-400">
          Escaneie o QR code para vincular seu WhatsApp
        </CardDescription>
        <div className="border-b max-w-[700px] border-gray-300 mt-2"></div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Texto de instrução */}
          <div className="max-w-[700px]">
            <ul className="mt-2 space-y-3 text-xl text-gray-700 leading-relaxed">
              <li>1. Abra o WhatsApp no seu celular</li>
              <li>2. Toque em <strong>Mais opções</strong> ( ⋮ ) no Android ou em <strong>Configurações</strong> (⚙️) no iPhone</li>
              <li>3. Toque em <strong>Dispositivos conectados</strong> e, em seguida, em <strong>Conectar dispositivo</strong>.</li>
              <li>4. Aponte seu celular para esta tela para escanear o QR code.</li>
            </ul>
          </div>

          {/* QR Code */}
          <div className="flex justify-end items-center min-h-[300px]">
            {loading ? (
              <Loader2 className="animate-spin w-12 h-12 text-green-600" />
            ) : erro ? (
              <p className="text-red-500 text-center">Erro ao carregar o QR Code. Tente novamente.</p>
            ) : qrCode ? (
              <img
                src={qrCode}
                alt="QR Code do WhatsApp"
                className="rounded-lg shadow-lg w-[300px] md:w-[300px]"
              />
            ) : (
              <p className="text-gray-500 text-center">QR Code indisponível.</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
