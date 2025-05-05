import { useState, useEffect } from "react";
import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { useConfigPreview } from "@/lib/hooks/useConfigPreview";
import { toast } from "sonner";
import {  getConfiguracaoByEmpresaId, atualizarConfiguracao, criarConfiguracao } from "@/features/configuracoes/services/ConfiguracoesService";
import { ConfiguracaoType } from "@/features/configuracoes/types/configTypes";

export function useCustomMensagem(empresaId: string) {
  const {
    config,
    previews,
    setPreviews,
    loading,
    convertHtmlToVariablesString,
    renderWithVariables,
    updatePreviewsAfterSave,
  } = useConfigPreview(empresaId);
  const isSmallScreen = useMediaQuery("(max-width: 1190px)");
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const variablesMap = {
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
    if (!config) return;

    const payload: ConfiguracaoType = {
      ...config,
      nomeDisplay: config.nomeDisplay ?? "",
      mensagemEntrada: previews[0] ?? "", // Usar valor bruto de previews
      mensagemChamada: previews[1] ?? "", // Usar valor bruto de previews
      mensagemRemovido: previews[2] ?? "", // Usar valor bruto de previews
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

      // Recarregar a configuração após salvar para garantir sincronia
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
    convertHtmlToVariablesString,
    renderWithVariables,
    saveMessages,
  };
}