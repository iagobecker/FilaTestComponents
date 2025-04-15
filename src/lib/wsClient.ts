type Callbacks = {
  onCodigo: (data: any) => void
  onVinculacao: (data: any) => void
  onErro?: (err: any) => void
}

export function criarWebSocketVinculacao(
  cpfCnpj: string,
  aplicativoId: number,
  callbacks: Callbacks
) {
  const socket = new WebSocket(
    `wss://vinculacaoaplicativosapi.cervantes.dev.br/api/v1/gerar-codigo/${cpfCnpj}?aplicativo=${aplicativoId}`
  )

  socket.onmessage = async (event) => {
    try {
      const raw = event.data

      const text = typeof raw === 'string' ? raw : await raw.text()
      const data = JSON.parse(text)

      console.log('📨 Mensagem recebida do WebSocket:', data)

      if (data.evento === 'codigo') {
        callbacks.onCodigo?.(data.data)
      }

      if (data.evento === 'vinculado') {
        callbacks.onVinculacao?.(data.data)
      }
    } catch (err) {
      console.error('❌ Erro ao processar WS:', err)
    }
  }

  socket.onerror = (err) => {
    callbacks.onErro?.(err)
  }

  return socket
}
