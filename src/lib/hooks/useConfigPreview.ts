"use client";

import { useEffect, useState } from "react";
import { getConfiguracaoByEmpresaId } from "@/features/configuracoes/services/ConfiguracoesService";
import { toast } from "sonner";
import { ConfiguracaoType } from "@/features/configuracoes/types/configTypes";
import { convertVariablesToHtml, convertHtmlToVariablesString, renderWithVariables } from "../utils/variableConverter";

export async function uploadLogo(file: File): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return `https://via.placeholder.com/150?text=${encodeURIComponent(file.name)}`;
}

export function useConfigPreview(empresaId: string) {
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState<ConfiguracaoType | null>(null);
  const [previews, setPreviews] = useState<string[]>(["", "", ""]);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const conf = await getConfiguracaoByEmpresaId(empresaId);
        if (!conf) {
          toast.error("Configuração não encontrada.");
          return;
        }
        setConfig(conf);
        if (initialLoad) {
          setPreviews([
            conf.mensagemEntrada ? convertVariablesToHtml(conf.mensagemEntrada) : "",
            conf.mensagemChamada ? convertVariablesToHtml(conf.mensagemChamada) : "",
            conf.mensagemRemovido ? convertVariablesToHtml(conf.mensagemRemovido) : "",
          ]);
          setInitialLoad(false);
        }
      } catch (err) {
        toast.error("Erro ao carregar configuração.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [empresaId, initialLoad]);

  const updatePreviewsAfterSave = (newConfig: ConfiguracaoType) => {
    setConfig(newConfig);
    setPreviews([
      newConfig.mensagemEntrada ? convertVariablesToHtml(newConfig.mensagemEntrada) : "",
      newConfig.mensagemChamada ? convertVariablesToHtml(newConfig.mensagemChamada) : "",
      newConfig.mensagemRemovido ? convertVariablesToHtml(newConfig.mensagemRemovido) : "",
    ]);
  };

  return {
    config,
    previews,
    setPreviews,
    loading,
    uploadLogo,
    convertVariablesToHtml,
    convertHtmlToVariablesString,
    renderWithVariables,
    updatePreviewsAfterSave,
  };
}