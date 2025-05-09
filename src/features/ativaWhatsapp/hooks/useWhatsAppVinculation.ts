import { useState, useEffect } from "react";
import { Api } from "@/api/api";

interface WhatsAppStatusResponse {
  isConnected: boolean;
  status: string;
}

interface WhatsAppQRCodeResponse {
  qrcode: string;
}

interface WhatsAppVinculationState {
  numero: string;
  qrCode: string | null;
  isConnected: boolean;
  loading: boolean;
  error: string | null;
}

export function useWhatsAppVinculation() {
  const [state, setState] = useState<WhatsAppVinculationState>({
    numero: "",
    qrCode: null,
    isConnected: false,
    loading: false,
    error: null,
  });

  const cadastrarNumero = async (numero: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      await Api.post("/whatsapp", {  numero });
      setState((prev) => ({ ...prev, numero, loading: false }));
      await iniciarSessao();
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error.message || "Erro ao cadastrar número do WhatsApp",
      }));
    }
  };

  const iniciarSessao = async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      await Api.post("/whatsapp/connect", {  });
      await buscarQRCode();
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error.message || "Erro ao iniciar sessão do WhatsApp",
      }));
    }
  };

  const buscarQRCode = async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await Api.get("/whatsapp/qrcode");
      const data = response.data as WhatsAppQRCodeResponse;
      setState((prev) => ({
        ...prev,
        qrCode: data.qrcode,
        loading: false,
      }));
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error.message || "Erro ao buscar QR Code",
      }));
    }
  };

  const verificarStatusSessao = async () => {
    try {
      const response = await Api.get("/whatsapp/session/status");
      const data = response.data as WhatsAppStatusResponse;
      setState((prev) => ({
        ...prev,
        isConnected: data.isConnected,
      }));
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        error: error.message || "Erro ao verificar status da sessão",
      }));
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (state.qrCode && !state.isConnected) {
      interval = setInterval(verificarStatusSessao, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state.qrCode, state.isConnected]);

  const recarregarQRCode = async () => {
    setState((prev) => ({ ...prev, qrCode: null }));
    await iniciarSessao();
  };

  return {
    ...state,
    cadastrarNumero,
    iniciarSessao,
    buscarQRCode,
    verificarStatusSessao,
    recarregarQRCode,
  };
}