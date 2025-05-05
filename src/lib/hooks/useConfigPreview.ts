"use client";

import { useEffect, useState } from "react";
import { getConfiguracaoByEmpresaId } from "@/features/configuracoes/services/ConfiguracoesService";
import { toast } from "sonner";
import { ConfiguracaoType } from "@/features/configuracoes/types/configTypes";
import { convertVariablesToHtml, convertHtmlToVariablesString, renderWithVariables } from "../utils/variableConverter";

// Mock para upload de logo (substitua pelo endpoint real)
export async function uploadLogo(file: File): Promise<string> {
  // Simulação de upload com delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return `https://via.placeholder.com/150?text=${encodeURIComponent(file.name)}`;
}

export function useConfigPreview(empresaId: string) {
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState<ConfiguracaoType | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const conf = await getConfiguracaoByEmpresaId(empresaId);
        if (!conf) {
          toast.error("Configuração não encontrada.");
          return;
        }
        setConfig(conf);
      } catch (err) {
        toast.error("Erro ao carregar configuração.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [empresaId]);

  return {
    config,
    loading,
    uploadLogo,
    convertVariablesToHtml,
    convertHtmlToVariablesString,
    renderWithVariables,
  };
}