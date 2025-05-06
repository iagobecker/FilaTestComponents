import { useState, useEffect } from "react";

import { toast } from "sonner";
import { getConfiguracaoByEmpresaId, atualizarConfiguracao, criarConfiguracao } from "@/features/configuracoes/services/ConfiguracoesService";
import { ConfiguracaoType } from "@/features/configuracoes/types/configTypes";
import { EmpresaService } from "@/features/auth/components/services/empresaService";
import { useConfigPreview } from "@/lib/hooks/useConfigPreview";
import { useMediaQuery } from "@/lib/hooks/use-media-query";

export function useCustomMensagem(empresaId: string, filaId: string) {
  const [isValidFila, setIsValidFila] = useState<boolean>(false);
  const [loadingFila, setLoadingFila] = useState(true);
  const {
    config,
    previews,
    setPreviews,
    loading: loadingConfig,
    updatePreviewsAfterSave,
  } = useConfigPreview(empresaId);
  const isSmallScreen = useMediaQuery("(max-width: 1190px)");
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  useEffect(() => {
    const validateFila = async () => {
      try {
        setLoadingFila(true);
        const fila = await EmpresaService.fetchFilaById(filaId);
        if (fila.empresaId === empresaId) {
          setIsValidFila(true);
        } else {
          throw new Error("A fila não pertence à empresa especificada.");
        }
      } catch (error: any) {
        toast.error(error.message || "Erro ao validar a fila.");
        setIsValidFila(false);
      } finally {
        setLoadingFila(false);
      }
    };

    if (empresaId && filaId) {
      validateFila();
    }
  }, [empresaId, filaId]);

  const variablesMap: Record<string, string> = {
    nome: "João Silva",
    link: `<a href='https://example.com/cliente-fila' class='font-bold underline text-blue-600' target='_blank'>https://example.com/cliente-fila</a>`,
  };

  const sectionTitles = ["Entrada", "Chamada", "Removido"];

  const updatePreview = (index: number, newHtml: string) => {
    setPreviews((prev) => {
      const updated = [...prev];
      updated[index] = newHtml;
      return updated;
    });
  };

  const saveMessages = async () => {
    if (!config || !isValidFila) return;

    const payload: ConfiguracaoType = {
      ...config,
      nomeDisplay: config.nomeDisplay ?? "",
      mensagemEntrada: previews[0] ?? "",
      mensagemChamada: previews[1] ?? "",
      mensagemRemovido: previews[2] ?? "",
      corPrimaria: config.corPrimaria ?? "#000000",
      corSobreposicao: config.corSobreposicao ?? "#FFFFFF",
      whatsappAtivo: config.whatsappAtivo ?? false,
      logoUrl: config.logoUrl ?? null,
      corTexto: config.corTexto ?? null,
      empresaId: config.empresaId,
      id: config.id,
      dataHoraCriado: config.dataHoraCriado,
      dataHoraAlterado: new Date().toISOString(),
    };

    try {
      let response;
      if (config?.id) {
        response = await atualizarConfiguracao(payload);
      } else {
        response = await criarConfiguracao(payload);
      }

      const updatedConfig = await getConfiguracaoByEmpresaId(empresaId);
      if (updatedConfig) {
        updatePreviewsAfterSave(updatedConfig);
        toast.success("Mensagens salvas com sucesso!");
      } else {
        throw new Error("Falha ao recarregar configuração.");
      }
    } catch (err) {
      toast.error("Erro ao salvar mensagens.");
      console.error(err);
    }
  };

  const loading = loadingConfig || loadingFila;

  return {
    isSmallScreen,
    showPreviewModal,
    setShowPreviewModal,
    loading,
    config,
    previews,
    setPreviews,
    updatePreview,
    variablesMap,
    sectionTitles,
    saveMessages,
    filaId,
    isValidFila,
  };
}