"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import QRCode from 'react-qr-code'; // Importar o componente
import { useWhatsAppVinculation } from "../hooks/useWhatsAppVinculation";

interface ContainerWPQRcodeProps {
  empresaId: string;
}

export default function ContainerWPQRcode() {
  const {
    numero,
    qrCode,
    isConnected,
    loading,
    error,
    cadastrarNumero,
    recarregarQRCode,
  } = useWhatsAppVinculation();
  const [numeroInput, setNumeroInput] = useState("");
  const [notification, setNotification] = useState<string | null>(null);

  const handleCadastrarNumero = async () => {
    if (!numeroInput) return;
    await cadastrarNumero(numeroInput);
  };

  // Tratar erro 500 específico, se necessário
  useEffect(() => {
    if (error && error.includes("500")) {
      setNotification("Erro interno no servidor. Tente novamente mais tarde.");
      setTimeout(() => setNotification(null), 3000);
    }
  }, [error]);

  return (
    <Card className="w-full max-w-none border border-green-300 bg-muted/20 shadow-sm rounded-lg p-10 md:p-16">
      <CardHeader>
        <CardTitle className="text-4xl font-bold">
          {isConnected ? "WhatsApp Vinculado" : "Vincular WhatsApp"}
        </CardTitle>
        <CardDescription className="text-xl text-gray-400">
          {isConnected
            ? "Seu WhatsApp foi vinculado com sucesso!"
            : "Escaneie o QR code para vincular seu WhatsApp"}
        </CardDescription>
        <div className="border-b max-w-[700px] border-gray-300 mt-2"></div>
      </CardHeader>

      <CardContent>
        {isConnected ? (
          <div className="text-center">
            <p className="text-xl text-green-600">Vinculação concluída!</p>
            <p className="text-gray-500 mt-2">Número: {numero}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="max-w-[700px]">
              {!numero ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="numero" className="text-xl text-gray-700">
                      Número do WhatsApp
                    </Label>
                    <Input
                      id="numero"
                      type="tel"
                      placeholder="(DDD) 9xxxx-xxxx"
                      value={numeroInput}
                      onChange={(e) => setNumeroInput(e.target.value)}
                      className="mt-2 text-xl"
                    />
                  </div>
                  <Button
                    onClick={handleCadastrarNumero}
                    disabled={loading || !numeroInput}
                    className="bg-green-600 text-white hover:bg-green-700"
                  >
                    {loading ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : null}
                    Cadastrar Número
                  </Button>
                </div>
              ) : (
                <ul className="mt-2 space-y-3 text-xl text-gray-700 leading-relaxed">
                  <li>1. Abra o WhatsApp no seu celular</li>
                  <li>2. Toque em <strong>Mais opções</strong> ( ⋮ ) no Android ou em <strong>Configurações</strong> (⚙️) no iPhone</li>
                  <li>3. Toque em <strong>Dispositivos conectados</strong> e, em seguida, em <strong>Conectar dispositivo</strong>.</li>
                  <li>4. Aponte seu celular para esta tela para escanear o QR code.</li>
                </ul>
              )}
            </div>
            {numero && (
              <div className="flex justify-end items-center min-h-[300px]">
                {loading ? (
                  <Loader2 className="animate-spin w-12 h-12 text-green-600" />
                ) : error ? (
                  <div className="text-center">
                    <p className="text-red-500">{error}</p>
                    <Button
                      onClick={recarregarQRCode}
                      className="mt-4 bg-green-600 text-white hover:bg-green-700"
                    >
                      Tentar Novamente
                    </Button>
                  </div>
                ) : qrCode ? (
                  <QRCode value={qrCode} size={256} style={{ height: "auto", maxWidth: "100%", width: "100%" }} />
                ) : (
                  <p className="text-gray-500 text-center">QR Code indisponível.</p>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}