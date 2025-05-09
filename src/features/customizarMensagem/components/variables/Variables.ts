import { Node, mergeAttributes } from "@tiptap/core";

export interface VariableOptions {
  HTMLAttributes: Record<string, any>;
  allowedVariables?: string[];
  variableValues?: Record<string, string>; 
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    variable: {
      insertVariable: (value: string) => ReturnType;
    };
  }
}

export const Variable = Node.create<VariableOptions>({
  name: "variable",
  group: "inline",
  inline: true,
  atom: true,

  addOptions() {
    return {
      HTMLAttributes: {},
      allowedVariables: ["nome", "link"],
      variableValues: {
        nome: "João Silva", // Valor exibido no editor
        link: "https://example.com/monitorFila", // Valor exibido no editor
      },
    };
  },

  addAttributes() {
    return {
      value: {
        default: "",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "span[data-variable]",
        getAttrs: (el) => {
          const dom = el as HTMLElement;
          return {
            value: dom.getAttribute("data-value"),
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const variableName = HTMLAttributes.value?.toLowerCase();
    const displayValue = this.options.variableValues?.[variableName] || `{${variableName}}`;
    return [
      "span",
      mergeAttributes(HTMLAttributes, {
        "data-variable": variableName,
        "data-value": variableName,
        class:
          "inline-block px-2 py-0.5 text-xs font-semibold rounded bg-black-200 text-purple-800 border border-purple-300",
      }),
      displayValue, // Exibir "João Silva" ou "https://example.com/monitorFila" no editor
    ];
  },

  addCommands() {
    return {
      insertVariable:
        (value: string) =>
        ({ chain }) => {
          const normalizedValue = value.toLowerCase();
          if (!this.options.allowedVariables?.includes(normalizedValue)) {
            console.warn(`Variável "${value}" não é permitida. Variáveis permitidas: ${this.options.allowedVariables}`);
            return false;
          }
          return chain()
            .insertContent({
              type: this.name,
              attrs: { value: normalizedValue },
            })
            .run();
        },
    };
  },
});