"use client";

import { useEffect, useState } from "react";
import { getConfiguracaoByEmpresaId } from "@/features/configuracoes/services/ConfiguracoesService";
import { toast } from "sonner";
import { ConfiguracaoType } from "@/features/configuracoes/types/configTypes";

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

// Substitui as variáveis para preview (exemplo: {nome} => "João")
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

export async function uploadLogo(file: File): Promise<string> {
//   const formData = new FormData();
//   formData.append("file", file);

//   // Altere "/api/upload" pelo seu endpoint real de upload!
//   const res = await fetch("/api/upload", { method: "POST", body: formData });
//   if (!res.ok) throw new Error("Erro no upload");
//   const data = await res.json();
//   return data.url; // backend deve retornar: { url: "https://..." }
// }

return "https://img.freepik.com/vetores-premium/luxury-lcn-logo-design-elegante-letra-lcn-monograma-logo-minimalista-poligono-lcn-modelo-de-design-de-logotipo_1101554-79886.jpg?semt=ais_hybrid&w=740"

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
    uploadLogo
  };
}
