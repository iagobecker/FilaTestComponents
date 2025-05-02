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
      console.log("Evento 'connected' recebido:", message || "Conexão confirmada pelo servidor");
    });

    // Listener para evento de atualização de cliente
    connection.on("ClienteAtualizado", (updatedClient: FilaItem) => {
      console.log("Cliente atualizado via SignalR:", updatedClient);
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
      console.log("Cliente removido via SignalR:", clientId);
      setAllClients(prev => prev.filter(c => c.id !== clientId));
    });

    // Listener para evento de cliente adicionado
    connection.on("ClienteAdicionado", (newClient: FilaItem) => {
      console.log("Cliente adicionado via SignalR:", newClient);
      setAllClients(prev => {
        const normalizedClient = padraoCliente(newClient);
        return [...prev, normalizedClient];
      });
    });

    // Monitorar reconexão e desconexão
    connection.onreconnecting(() => {
      console.log("SignalR Reconnecting...");
      setIsSignalRConnected(false);
    });

    connection.onreconnected(() => {
      console.log("SignalR Reconnected!");
      setIsSignalRConnected(true);
    });

    connection.onclose(() => {
      console.log("SignalR Disconnected!");
      setIsSignalRConnected(false);
    });

    // Limpar a conexão ao desmontar o componente
    return () => {
      connection.off("connected"); // Remove o listener
      connection.off("ClienteAtualizado");
      connection.off("ClienteRemovido");
      connection.off("ClienteAdicionado");
      connection.off("onreconnecting");
      connection.off("onreconnected");
      connection.off("onclose");
      signalRConnection.disconnect();
      setIsSignalRConnected(false);
    };
  }, [setAllClients, setIsSignalRConnected, token]);
};