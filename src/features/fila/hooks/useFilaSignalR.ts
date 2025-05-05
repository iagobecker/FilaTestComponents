import { useEffect } from "react";
import { FilaItem, FilaItemExt, ChamadaItem } from "@/features/fila/components/types/types";
import signalRConnection from "@/lib/signalRConnection";
import { padraoCliente } from "@/lib/utils/padraoCliente";

export const useFilaSignalR = (
  setAllClients: (updater: (prev: (FilaItemExt | ChamadaItem)[]) => (FilaItemExt | ChamadaItem)[]) => void,
  setIsSignalRConnected: (connected: boolean) => void,
  token: string
) => {
  useEffect(() => {
    // Iniciar a conexão com o SignalR
    signalRConnection.connect(token).then(() => {
      setIsSignalRConnected(true);
    }).catch(() => {
      setIsSignalRConnected(false);
    });

    const connection = signalRConnection.connectionInstance;
    if (!connection) {
      setIsSignalRConnected(false);
      return;
    }

    // Listener para o evento 'connected' (enviado pelo backend)
    connection.on("connected", (message: string) => {
    });

    // Listener para evento de atualização de cliente
    connection.on("ClienteAtualizado", (updatedClient: FilaItem) => {
      setAllClients(prev => {
        const clientIndex = prev.findIndex(c => c.id === updatedClient.id);
        const normalizedClient = padraoCliente(updatedClient);
        if (clientIndex !== -1) {
          // Atualiza o cliente existente
          const updatedClients = [...prev];
          updatedClients[clientIndex] = { ...updatedClients[clientIndex], ...normalizedClient };
          return updatedClients;
        } else {
          // Adiciona o novo cliente
          return [...prev, normalizedClient];
        }
      });
    });

    // Listener para evento de cliente removido
    connection.on("ClienteRemovido", (clientId: string) => {
      setAllClients(prev => prev.filter(c => c.id !== clientId));
    });

    // Listener para evento de cliente adicionado
    connection.on("ClienteAdicionado", (newClient: FilaItem) => {
      setAllClients(prev => {
        const normalizedClient = padraoCliente(newClient);
        return [...prev, normalizedClient];
      });
    });

    // Listener para evento de desistência de clientes
    connection.on("DesistirClientes", (payload: any) => {

      // Processar o payload
      let parsedPayload: any;
      if (typeof payload === "string") {
        try {
          parsedPayload = JSON.parse(payload);
        } catch (error) {
          console.error("❌ Falha ao parsear o payload JSON (DesistirClientes):", error, "Payload:", payload);
          return;
        }
      } else {
        parsedPayload = payload;
      }

      if (!parsedPayload || typeof parsedPayload !== "object") {
        console.warn("Payload inválido: não é um objeto (DesistirClientes):", parsedPayload);
        return;
      }

      const clientes = parsedPayload.clientes;
      if (!Array.isArray(clientes)) {
        console.warn("Payload inválido: clientes não é um array (DesistirClientes):", clientes);
        return;
      }

      const clientesMapeados = clientes.map((cliente: any) => {
        const normalizedClient = padraoCliente(cliente);
        return normalizedClient;
      });

      // Verificar se há um cliente atualizado específico no payload
      const clienteAtualizado = parsedPayload?.clientesAtualizados;
      if (clienteAtualizado && typeof clienteAtualizado === "object") {
        const clienteAtualizadoPadronizado = padraoCliente(clienteAtualizado);
        clientesMapeados.push(clienteAtualizadoPadronizado);
      }

      // Atualizar o estado allClients
      setAllClients(prev => {
        // Remover duplicatas e atualizar clientes
        const novosIds = new Set(clientesMapeados.map((c: FilaItem) => c.id));
        const clientesPreservados = prev.filter(c => !novosIds.has(c.id));
        const updatedClients = [...clientesPreservados, ...clientesMapeados];

        // Remover duplicatas finais
        const uniqueClientsMap = new Map<string, FilaItem>();
        updatedClients.forEach(client => uniqueClientsMap.set(client.id, client));
        const uniqueClients = Array.from(uniqueClientsMap.values());

        // Verificar e logar o status dos clientes atualizados
        uniqueClients.forEach(client => {
          if (client.status === 4) {
          }
        });

        return uniqueClients;
      });
    });

    // Monitorar reconexão e desconexão
    connection.onreconnecting(() => {
      setIsSignalRConnected(false);
    });

    connection.onreconnected(() => {
      setIsSignalRConnected(true);
    });

    connection.onclose(() => {
      setIsSignalRConnected(false);
    });

    // Limpar a conexão ao desmontar o componente
    return () => {
      connection.off("connected");
      connection.off("ClienteAtualizado");
      connection.off("ClienteRemovido");
      connection.off("ClienteAdicionado");
      connection.off("DesistirClientes");
      connection.off("onreconnecting");
      connection.off("onreconnected");
      connection.off("onclose");
      signalRConnection.disconnect();
      setIsSignalRConnected(false);
    };
  }, [setAllClients, setIsSignalRConnected, token]);
};