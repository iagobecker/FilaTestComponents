// Utilitário para conversão de variáveis
export function convertVariablesToHtml(html: string): string {
    if (typeof window === "undefined") return html;
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    doc.body.innerHTML = doc.body.innerHTML.replace(
      /\{(\w+)\}/g,
      (_, variableName) => `<span data-variable="${variableName}" data-value="${variableName}"></span>`
    );
    return doc.body.innerHTML;
  }
  
  export function convertHtmlToVariablesString(html: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    doc.querySelectorAll("[data-variable]").forEach((el) => {
      const variable = el.getAttribute("data-variable");
      el.replaceWith(document.createTextNode(`{${variable}}`));
    });
    return doc.body.innerHTML;
  }
  
  export function renderWithVariables(html: string, map: Record<string, string>): string {
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