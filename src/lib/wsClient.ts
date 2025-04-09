// src/lib/criarWebSocketVinculacao.ts
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
    // const socket = new WebSocket(
    //   `wss://vinculacaoaplicativosapi.cervantes.dev.br/api/v1/gerar-codigo/${cpfCnpj}?aplicativo=${aplicativoId}`
    // )
  
    const socket = new WebSocket(
        'ws://localhost:4000/api/v1/gerar-codigo/08833101000155?aplicativo=4'
      );
      
      

      socket.onmessage = async (event) => {
        try {
          const raw = event.data;
      
          const text = typeof raw === 'string'
            ? raw
            : await raw.text(); 
      
          const data = JSON.parse(text);
      
          console.log('Mensagem recebida:', data);
      
        } catch (err) {
          console.error('❌ Erro ao processar WS:', err);
        }
      };
  
    socket.onerror = (err) => {
      callbacks.onErro?.(err)
    }
  
    return socket
  }
  