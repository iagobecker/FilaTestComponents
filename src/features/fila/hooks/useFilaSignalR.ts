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
    let isMounted = true;

    const initializeSignalR = async () => {
      if (!token) {
        console.error("Token ausente, não é possível conectar ao SignalR.");
        if (isMounted) setIsSignalRConnected(false);
        return;
      }

      try {
        await signalRConnection.connect(token);
        if (isMounted) setIsSignalRConnected(true);

        const connection = signalRConnection.connectionInstance;
        if (!connection) {
          if (isMounted) setIsSignalRConnected(false);
          return;
        }

        // Listener para o evento 'connected'
        connection.on("connected", (message: string) => {
          if (isMounted) console.log("SignalR Connected:", message);
        });

        // Listener para evento de atualização de cliente
        connection.on("ClienteAtualizado", (updatedClient: FilaItem) => {
          if (!isMounted) return;
          setAllClients(prev => {
            const clientIndex = prev.findIndex(c => c.id === updatedClient.id);
            const normalizedClient = padraoCliente(updatedClient);
            if (clientIndex !== -1) {
              const updatedClients = [...prev];
              updatedClients[clientIndex] = { ...updatedClients[clientIndex], ...normalizedClient };
              return updatedClients;
            } else {
              return [...prev, normalizedClient];
            }
          });
        });

        // Listener para evento de cliente removido
        connection.on("ClienteRemovido", (clientId: string) => {
          if (!isMounted) return;
          setAllClients(prev => prev.filter(c => c.id !== clientId));
        });

        // Listener para evento de cliente adicionado
        connection.on("ClienteAdicionado", (newClient: FilaItem) => {
          if (!isMounted) return;
          setAllClients(prev => {
            const normalizedClient = padraoCliente(newClient);
            return [...prev, normalizedClient];
          });
        });

        // Listener para evento de desistência de clientes
        connection.on("DesistirClientes", (payload: any) => {
          if (!isMounted) return;

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

          const clienteAtualizado = parsedPayload?.clientesAtualizados;
          if (clienteAtualizado && typeof clienteAtualizado === "object") {
            const clienteAtualizadoPadronizado = padraoCliente(clienteAtualizado);
            clientesMapeados.push(clienteAtualizadoPadronizado);
          }

          setAllClients(prev => {
            const novosIds = new Set(clientesMapeados.map((c: FilaItem) => c.id));
            const clientesPreservados = prev.filter(c => !novosIds.has(c.id));
            const updatedClients = [...clientesPreservados, ...clientesMapeados];

            const uniqueClientsMap = new Map<string, FilaItem>();
            updatedClients.forEach(client => uniqueClientsMap.set(client.id, client));
            const uniqueClients = Array.from(uniqueClientsMap.values());

            uniqueClients.forEach(client => {
              if (client.status === 4) {
                // Log ou ação adicional para status 4, se necessário
              }
            });

            return uniqueClients;
          });
        });

        // Monitorar reconexão e desconexão
        connection.onreconnecting(() => {
          if (isMounted) setIsSignalRConnected(false);
        });

        connection.onreconnected(() => {
          if (isMounted) setIsSignalRConnected(true);
        });

        connection.onclose(() => {
          if (isMounted) setIsSignalRConnected(false);
        });
      } catch (error) {
        console.error("Erro ao inicializar SignalR:", error);
        if (isMounted) setIsSignalRConnected(false);
      }
    };

    initializeSignalR();

    return () => {
      isMounted = false;
      const connection = signalRConnection.connectionInstance;
      if (connection) {
        connection.off("connected");
        connection.off("ClienteAtualizado");
        connection.off("ClienteRemovido");
        connection.off("ClienteAdicionado");
        connection.off("DesistirClientes");
        connection.off("onreconnecting");
        connection.off("onreconnected");
        connection.off("onclose");
      }
      signalRConnection.disconnect().catch(err => {
        console.error("Erro ao desconectar no cleanup:", err);
      });
      setIsSignalRConnected(false);
    };
  }, [setAllClients, setIsSignalRConnected, token]);
};