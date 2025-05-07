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
        console.error("❌ Token ausente, não é possível conectar ao SignalR.");
        if (isMounted) setIsSignalRConnected(false);
        return;
      }

      console.log("🔌 Inicializando SignalR com token:", token.slice(0, 10) + "...");

      try {
        await signalRConnection.connect(token);
        if (isMounted) {
          setIsSignalRConnected(true);
          console.log("✅ SignalR conectado com sucesso! Registrando listeners...");
        }

        const connection = signalRConnection.connectionInstance;
        if (!connection) {
          if (isMounted) setIsSignalRConnected(false);
          console.error("❌ Conexão SignalR não foi estabelecida.");
          return;
        }

        // Função para lidar com o evento atualizarFila
        const handleAtualizarFila = (payload: any) => {
          if (!isMounted) return;

          console.log("📩 Evento 'atualizarFila' recebido:", JSON.stringify(payload, null, 2));

          let parsedPayload: any;
          if (typeof payload === "string") {
            try {
              parsedPayload = JSON.parse(payload);
              console.log("✅ Payload parseado com sucesso:", parsedPayload);
            } catch (error) {
              console.error("❌ Falha ao parsear payload JSON (atualizarFila):", error, payload);
              return;
            }
          } else {
            parsedPayload = payload;
          }

          const fila = parsedPayload.fila;
          if (!fila || typeof fila !== "object" || !Array.isArray(fila.clientes)) {
            console.warn("⚠️ Payload inválido: propriedade 'fila.clientes' ausente ou inválida:", parsedPayload);
            return;
          }

          const clientesMapeados = fila.clientes.map(padraoCliente);
          setAllClients(() => {
            const map = new Map<string, FilaItem>();
            clientesMapeados.forEach((c: FilaItem) => c.id && map.set(c.id, c));
            return Array.from(map.values());
          });
        };

        // Função para lidar com o evento clienteDesistir
        const handleClienteDesistir = (payload: any) => {
          if (!isMounted) return;

          console.log("📩 Evento 'clienteDesistir' recebido:", JSON.stringify(payload, null, 2));

          let parsedPayload: any;
          if (typeof payload === "string") {
            try {
              parsedPayload = JSON.parse(payload);
              console.log("✅ Payload parseado com sucesso (clienteDesistir):", parsedPayload);
            } catch (err) {
              console.error("❌ Erro ao parsear 'clienteDesistir':", err);
              return;
            }
          } else {
            parsedPayload = payload;
          }

          const clientes = parsedPayload.clientes;
          if (!Array.isArray(clientes)) {
            console.warn("⚠️ Payload inválido em 'clienteDesistir':", parsedPayload);
            return;
          }

          const clientesMapeados = clientes.map(padraoCliente);
          setAllClients((prevClients) => {
            const map = new Map<string, FilaItemExt | ChamadaItem>(prevClients.map(c => [c.id, c]));
            clientesMapeados.forEach((c: FilaItem) => {
              if (c.id) {
                map.set(c.id, { ...c, status: 4 }); // Força o status como 4 (Desistente)
              }
            });
            const updatedClients = Array.from(map.values());
            console.log("📋 Clientes atualizados após 'clienteDesistir':", updatedClients);
            return updatedClients;
          });
        };

        const registerListeners = () => {
          console.log("📌 Registrando listener para 'atualizarFila'...");
          connection.on("atualizarFila", handleAtualizarFila);

          console.log("📌 Registrando listener para 'atualizarfila' (fallback)...");
          connection.on("atualizarfila", (payload: any) => {
            if (!isMounted) return;
            console.log("📩 Evento 'atualizarfila' (fallback) recebido:", JSON.stringify(payload, null, 2));
            handleAtualizarFila(payload); // Chama a função diretamente, sem invoke
          });

          console.log("📌 Registrando listener para 'clienteDesistir'...");
          connection.on("clienteDesistir", handleClienteDesistir);

          console.log("📌 Registrando listener para 'clientedesistir' (fallback)...");
          connection.on("clientedesistir", (payload: any) => {
            if (!isMounted) return;
            console.log("📩 Evento 'clientedesistir' (fallback) recebido:", JSON.stringify(payload, null, 2));
            handleClienteDesistir(payload); // Chama a função diretamente, sem invoke
          });
        };

        registerListeners();

        connection.onreconnecting(() => {
          if (isMounted) {
            setIsSignalRConnected(false);
            console.log("🔄 SignalR reconectando...");
          }
        });

        connection.onreconnected(() => {
          if (isMounted) {
            setIsSignalRConnected(true);
            console.log("🔄 SignalR reconectado com sucesso!");
            console.log("📌 Reaplicando listeners após reconexão...");
            connection.off("atualizarFila");
            connection.off("atualizarfila");
            connection.off("clienteDesistir");
            connection.off("clientedesistir");
            registerListeners();
          }
        });

        connection.onclose(() => {
          if (isMounted) {
            setIsSignalRConnected(false);
            console.log("❌ SignalR desconectado.");
          }
        });

      } catch (error) {
        console.error("❌ Erro ao inicializar SignalR:", error);
        if (isMounted) setIsSignalRConnected(false);
      }
    };

    initializeSignalR();

    return () => {
      isMounted = false;
      const connection = signalRConnection.connectionInstance;
      if (connection) {
        connection.off("atualizarFila");
        connection.off("atualizarfila");
        connection.off("clienteDesistir");
        connection.off("clientedesistir");
        connection.off("connected");
        connection.off("onreconnecting");
        connection.off("onreconnected");
        connection.off("onclose");
      }
      signalRConnection.disconnect().catch(err => {
        console.error("❌ Erro ao desconectar no cleanup:", err);
      });
      setIsSignalRConnected(false);
    };
  }, [setAllClients, setIsSignalRConnected, token]);
};