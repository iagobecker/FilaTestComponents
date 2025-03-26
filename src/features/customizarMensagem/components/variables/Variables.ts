import { Node, mergeAttributes } from '@tiptap/core'

export interface VariableOptions {
  HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    variable: {
      insertVariable: (value: string) => ReturnType
    }
  }
}

const Variable = Node.create<VariableOptions>({
  name: 'variable',
  group: 'inline',
  inline: true,
  atom: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  // define value como atributo
  addAttributes() {
    return {
      value: {
        default: '',
      },
    }
  },

  // extrai atributos do elemento span
  parseHTML() {
    return [
      {
        tag: 'span[data-variable]',
        getAttrs: el => {
          const dom = el as HTMLElement;
          return {
            value: dom.getAttribute('data-value'),
          };
        },
      },
    ];
  },

  // renderiza o elemento span com o nome da variável
  renderHTML({ HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(HTMLAttributes, {
        'data-variable': HTMLAttributes.value,
        class:
          'inline-block px-2 py-0.5 text-xs font-semibold rounded bg-purple-200 text-purple-800 border border-purple-300',
      }),
      `{${HTMLAttributes.value}}`,
    ];
  },

  // define comandos para inserir variaveis no editor 
  addCommands() {
    return {
      insertVariable:
        (value: string) =>
          ({ chain }) => {
            return chain()
              .insertContent({
                type: this.name,
                attrs: { value },
              })
              .run()
          },
    }
  },
})

export default Variable




