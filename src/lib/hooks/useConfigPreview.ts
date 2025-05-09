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
  const [previews, setPreviews] = useState<string[]>([
    "{nome}, seja bem-vindo a fila do Restaurante Beira Rio!, {link}", // Valor padrão como string simples
    "{nome}, você foi chamado!!", // Valor padrão como string simples
    "{nome}, você foi removido da fila do Restaurante Beira Rio.", // Valor padrão como string simples
  ]);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const conf = await getConfiguracaoByEmpresaId(empresaId);
        if (!conf) {
          toast.error("Configuração não encontrada. Usando valores padrão.");
          console.log("Configuração não encontrada. Previews padrão:", previews);
          return;
        }
        setConfig(conf);
        if (initialLoad) {
          const newPreviews = [
            conf.mensagemEntrada ?? previews[0],
            conf.mensagemChamada ?? previews[1],
            conf.mensagemRemovido ?? previews[2],
          ];
          setPreviews(newPreviews);
          console.log("Configuração carregada:", conf);
          console.log("Previews inicializados:", newPreviews);
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
    const updatedPreviews = [
      newConfig.mensagemEntrada ?? previews[0],
      newConfig.mensagemChamada ?? previews[1],
      newConfig.mensagemRemovido ?? previews[2],
    ];
    setPreviews(updatedPreviews);
    console.log("Previews atualizados após salvamento:", updatedPreviews);
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