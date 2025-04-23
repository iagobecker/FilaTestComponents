"use client";

import { useEffect, useRef, useState } from "react";
import { getConfiguracaoByEmpresaId } from "@/features/configuracoes/services/configuracoes";
import { toast } from "sonner";

// Função para transformar {nome} → <span data-variable="nome" />
function convertVariablesToHtml(html: string): string {
  if (typeof window === 'undefined') return html;
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  doc.body.innerHTML = doc.body.innerHTML.replace(
    /\{(\w+)\}/g,
    (_, variableName) => `<span data-variable="${variableName}" data-value="${variableName}"></span>`
  );
  return doc.body.innerHTML;
}

// Função para transformar <span data-variable="nome" /> → {nome}
function convertHtmlToVariablesString(html: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  doc.querySelectorAll("[data-variable]").forEach((el) => {
    const variable = el.getAttribute("data-variable");
    el.replaceWith(document.createTextNode(`{${variable}}`));
  });
  return doc.body.innerHTML;
}

// Substitui as variáveis para preview
function renderWithVariables(html: string, map: Record<string, string>): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  doc.querySelectorAll("[data-variable]").forEach((el) => {
    const key = el.getAttribute("data-variable") || "";
    const replacement = map[key] ?? "";
    const span = document.createElement("span");
    span.innerHTML = replacement;
    el.replaceWith(...span.childNodes);
  });
  return doc.body.innerHTML;
}

export function useConfigPreview(empresaId: string) {
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState<any>(null);
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
            conf.mensagemEntrada || '',
            conf.mensagemChamada || '',
            conf.mensagemRemovido || ''
          ]);
          setInitialLoad(false);
        }       
      } catch (err) {
        toast.error("Erro ao carregar mensagens.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [empresaId, initialLoad]);
  
  return {
    config,
    previews,
    setPreviews,
    loading,
    convertVariablesToHtml,
    convertHtmlToVariablesString,
    renderWithVariables,
  };
}
