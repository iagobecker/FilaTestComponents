// Converte uma string com variáveis (ex.: "{nome}") para HTML que o TipTap entende
export function convertVariablesToHtml(text: string): string {
  if (typeof window === "undefined") return text;
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, "text/html");
  doc.body.innerHTML = doc.body.innerHTML.replace(
    /\{(\w+)\}/g,
    (_, variableName) => `<span data-variable="${variableName.toLowerCase()}" data-value="${variableName.toLowerCase()}">{${variableName.toLowerCase()}}</span>`
  );
  return doc.body.innerHTML;
}

// Converte o HTML do TipTap de volta para uma string com variáveis (ex.: "{nome}")
export function convertHtmlToVariablesString(html: string): string {
  if (typeof window === "undefined") return html;

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  // Substituir spans de variáveis por {nome}, {link}, etc., em letras minúsculas
  doc.querySelectorAll("[data-variable]").forEach((el) => {
    const variable = el.getAttribute("data-variable");
    if (variable) {
      const normalizedVariable = variable.toLowerCase();
      el.replaceWith(document.createTextNode(`{${normalizedVariable}}`));
    }
  });

  // Remover todas as tags HTML e extrair apenas o texto
  const textContent = doc.body.textContent || "";
  
  // Remover espaços extras e normalizar
  return textContent.trim();
}

// Substitui variáveis diretamente na string
export function renderWithVariables(text: string, map: Record<string, string>): string {
  let result = text;
  Object.entries(map).forEach(([key, value]) => {
    const regex = new RegExp(`{${key}}`, "g");
    result = result.replace(regex, value);
  });
  return result;
}