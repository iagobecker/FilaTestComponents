type Callbacks = {
  onCodigo: (data: any) => void;
  onVinculacao: (data: any) => void;
  onErro?: (err: any) => void;
  onClose?: (event: CloseEvent) => void;
}

export function criarWebSocketVinculacao(
  cpfCnpj: string,
  aplicativoId: number,
  callbacks: Callbacks
) {
  const wsUrl = `wss://vinculacaoaplicativosapi.cervantes.dev.br/api/v1/gerar-codigo/${cpfCnpj}?aplicativo=${aplicativoId}`;
  console.log("Tentando conectar ao WebSocket:", {
    url: wsUrl,
    cpfCnpj,
    aplicativoId,
  });

  const socket = new WebSocket(wsUrl);

  socket.onopen = () => {
    console.log("Conexão WebSocket estabelecida com sucesso.");
  };

  socket.onmessage = async (event) => {
    try {
      const raw = event.data;
      const text = typeof raw === 'string' ? raw : await raw.text();
      const data = JSON.parse(text);

      console.log("Mensagem recebida do WebSocket:", data);

      if (data.evento === 'codigo') {
        callbacks.onCodigo?.(data.data);
      }

      if (data.evento === 'vinculado') {
        callbacks.onVinculacao?.(data.data);
      }
    } catch (err) {
      console.error('❌ Erro ao processar mensagem do WebSocket:', err);
    }
  };

  socket.onerror = (err) => {
    console.error("Erro detectado no WebSocket:", err);
    callbacks.onErro?.(err);
  };

  socket.onclose = (event) => {
    console.log("Conexão WebSocket fechada:", {
      code: event.code,
      reason: event.reason,
      wasClean: event.wasClean,
    });
    callbacks.onClose?.(event);
  };

  return socket;
}