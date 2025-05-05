// import { useEffect } from "react";
// import { FilaItem, FilaItemExt, ChamadaItem } from "@/features/fila/components/types/types";
// import signalRConnection from "@/lib/signalRConnection";
// import { padraoCliente } from "@/lib/utils/padraoCliente";

// export const useFilaSignalR = (
//   setAllClients: (updater: (prev: (FilaItemExt | ChamadaItem)[]) => (FilaItemExt | ChamadaItem)[]) => void,
//   setIsSignalRConnected: (connected: boolean) => void,
//   token: string
// ) => {
//   useEffect(() => {
//     let isMounted = true;

//     const initializeSignalR = async () => {
//       if (!token) {
//         console.error("Token ausente, não é possível conectar ao SignalR.");
//         if (isMounted) setIsSignalRConnected(false);
//         return;
//       }

//       try {
//         await signalRConnection.connect(token);
//         if (isMounted) setIsSignalRConnected(true);

//         const connection = signalRConnection.connectionInstance;
//         if (!connection) {
//           if (isMounted) setIsSignalRConnected(false);
//           return;
//         }

//         // Listener para o evento 'connected'
//         connection.on("connected", (message: string) => {
//           if (isMounted) console.log("SignalR Connected:", message);
//         });

//         // Listener para evento de atualização de cliente
//         // connection.on("ClienteAtualizado", (updatedClient: FilaItem) => {
//         //   if (!isMounted) return;
//         //   setAllClients(prev => {
//         //     const clientIndex = prev.findIndex(c => c.id === updatedClient.id);
//         //     const normalizedClient = padraoCliente(updatedClient);
//         //     if (clientIndex !== -1) {
//         //       const updatedClients = [...prev];
//         //       updatedClients[clientIndex] = { ...updatedClients[clientIndex], ...normalizedClient };
//         //       return updatedClients;
//         //     } else {
//         //       return [...prev, normalizedClient];
//         //     }
//         //   });
//         // });

//         // Listener para evento de cliente removido
//         // connection.on("ClienteRemovido", (clientId: string) => {
//         //   if (!isMounted) return;
//         //   setAllClients(prev => prev.filter(c => c.id !== clientId));
//         // });

//         // Listener para evento de cliente adicionado
//         // connection.on("ClienteAdicionado", (newClient: FilaItem) => {
//         //   if (!isMounted) return;
//         //   setAllClients(prev => {
//         //     const normalizedClient = padraoCliente(newClient);
//         //     return [...prev, normalizedClient];
//         //   });
//         // });

//         // Listener para evento de desistência de clientes
//         connection.on("AtualizarFila", (payload: any) => {
//           if (!isMounted) return;

//           let parsedPayload: any;
//           if (typeof payload === "string") {
//             try {
//               parsedPayload = JSON.parse(payload);
//             } catch (error) {
//               console.error("❌ Falha ao parsear o payload JSON (AtualizarFila):", error, "Payload:", payload);
//               return;
//             }
//           } else {
//             parsedPayload = payload;
//           }

//           if (!parsedPayload || typeof parsedPayload !== "object") {
//             console.warn("Payload inválido: não é um objeto (AtualizarFila):", parsedPayload);
//             return;
//           }

//           const clientes = parsedPayload.clientes;
//           if (!Array.isArray(clientes)) {
//             console.warn("Payload inválido: clientes não é um array (AtualizarFila):", clientes);
//             return;
//           }

//           const clientesMapeados = clientes.map((cliente: any) => {
//             const normalizedClient = padraoCliente(cliente);
//             return normalizedClient;
//           });

//           const clienteAtualizado = parsedPayload?.clientesAtualizados;
//           if (clienteAtualizado && typeof clienteAtualizado === "object") {
//             const clienteAtualizadoPadronizado = padraoCliente(clienteAtualizado);
//             clientesMapeados.push(clienteAtualizadoPadronizado);
//           }

//           setAllClients(prev => {
//             const novosIds = new Set(clientesMapeados.map((c: FilaItem) => c.id));
//             const clientesPreservados = prev.filter(c => !novosIds.has(c.id));
//             const updatedClients = [...clientesPreservados, ...clientesMapeados];

//             const uniqueClientsMap = new Map<string, FilaItem>();
//             updatedClients.forEach(client => uniqueClientsMap.set(client.id, client));
//             const uniqueClients = Array.from(uniqueClientsMap.values());

//             uniqueClients.forEach(client => {
//               if (client.status === 4) {
//                 // Log ou ação adicional para status 4, se necessário
//               }
//             });

//             return uniqueClients;
//           });
//         });

//         // Monitorar reconexão e desconexão
//         connection.onreconnecting(() => {
//           if (isMounted) setIsSignalRConnected(false);
//         });

//         connection.onreconnected(() => {
//           if (isMounted) setIsSignalRConnected(true);
//         });

//         connection.onclose(() => {
//           if (isMounted) setIsSignalRConnected(false);
//         });
//       } catch (error) {
//         console.error("Erro ao inicializar SignalR:", error);
//         if (isMounted) setIsSignalRConnected(false);
//       }
//     };

//     initializeSignalR();

//     return () => {
//       isMounted = false;
//       const connection = signalRConnection.connectionInstance;
//       if (connection) {
//         connection.off("connected");
//         connection.off("ClienteAtualizado");
//         connection.off("ClienteRemovido");
//         connection.off("ClienteAdicionado");
//         connection.off("AtualizarFila");
//         connection.off("onreconnecting");
//         connection.off("onreconnected");
//         connection.off("onclose");
//       }
//       signalRConnection.disconnect().catch(err => {
//         console.error("Erro ao desconectar no cleanup:", err);
//       });
//       setIsSignalRConnected(false);
//     };
//   }, [setAllClients, setIsSignalRConnected, token]);
// };




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

        const registerListeners = () => {
          console.log("📌 Registrando listener para 'atualizarFila'...");
          connection.on("atualizarFila", (payload: any) => {
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
          });

          console.log("📌 Registrando listener para 'atualizarfila' (fallback)...");
          connection.on("atualizarfila", (payload: any) => {
            if (!isMounted) return;
            console.log("📩 Evento 'atualizarfila' (fallback) recebido:", JSON.stringify(payload, null, 2));
            connection.invoke("atualizarFila", payload); // Redireciona para o listener principal
          });

          console.log("📌 Registrando listener para 'clienteDesistir'...");
          connection.on("clienteDesistir", (payload: any) => {
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
          });

          console.log("📌 Registrando listener para 'clientedesistir' (fallback)...");
          connection.on("clientedesistir", (payload: any) => {
            if (!isMounted) return;
            console.log("📩 Evento 'clientedesistir' (fallback) recebido:", JSON.stringify(payload, null, 2));
            connection.invoke("clienteDesistir", payload); // Redireciona para o listener principal
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
            // Remove listeners antigos para evitar duplicatas
            connection.off("atualizarFila");
            connection.off("atualizarfila");
            connection.off("clienteDesistir");
            connection.off("clientedesistir");
            registerListeners(); // Reaplica os listeners
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