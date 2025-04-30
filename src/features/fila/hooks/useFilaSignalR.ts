// "use client";

// import { useEffect, useRef } from "react";
// import { HubConnectionBuilder, LogLevel, HubConnection, HttpTransportType } from "@microsoft/signalr";
// import { useFilaContext } from "@/features/fila/context/FilaProvider";
// import { padraoCliente } from "@/lib/utils/padraoCliente";
// import { FilaItem } from "../components/types/filaTypes";
// import { parseCookies } from "nookies";
// import { buscarClientesFila } from "../services/FilaService";

// const SIGNALR_URL = "http://10.0.0.191:5135/empresahub";
// const MAX_RECONNECT_ATTEMPTS = 5;
// const RECONNECT_INTERVAL = 5000; // 5 segundos

// export function useFilaSignalR() {
//   const { setAllClients, forceRender } = useFilaContext();
//   const connectionRef = useRef<HubConnection | null>(null);
//   const reconnectAttemptsRef = useRef(0);

//   const updateClients = (prev: FilaItem[], novosClientes: FilaItem[]) => {
//     const novosIds = new Set(novosClientes.map(c => c.id));
//     const clientesPreservados = prev.filter(c => !novosIds.has(c.id));
//     const clientesAtualizados = [...clientesPreservados, ...novosClientes];

//     // Remover duplicatas mantendo a última ocorrência
//     const uniqueClientsMap = new Map<string, FilaItem>();
//     clientesAtualizados.forEach(client => uniqueClientsMap.set(client.id, client));
//     const uniqueClients = Array.from(uniqueClientsMap.values());

//     console.log("Clientes após remover duplicatas:", uniqueClients);
//     return uniqueClients;
//   };

//   const startConnection = async () => {
//     if (connectionRef.current) {
//       console.log("Conexão SignalR já existe, ignorando nova inicialização.");
//       return;
//     }

//     const { "auth.token": token } = parseCookies();
//     if (!token) {
//       console.warn("⛔ Token não disponível para SignalR");
//       // Fallback: buscar dados via REST
//       const clientes = await buscarClientesFila();
//       setAllClients(clientes);
//       return;
//     }

//     const connection = new HubConnectionBuilder()
//       .withUrl(SIGNALR_URL, {
//         skipNegotiation: false,
//         transport: HttpTransportType.WebSockets, // Tenta WebSockets primeiro
//         accessTokenFactory: () => token,
//       })
//       .configureLogging(LogLevel.Debug) // Logs detalhados
//       .withAutomaticReconnect({
//         nextRetryDelayInMilliseconds: retryContext => {
//           const delay = Math.min(1000 * (retryContext.previousRetryCount + 1), 30000); // Máximo de 30 segundos
//           console.log(`Tentativa de reconexão ${retryContext.previousRetryCount + 1}, aguardando ${delay}ms`);
//           return delay;
//         },
//       })
//       .build();

//     connectionRef.current = connection;

//     connection.on("AtualizarFila", (payload: any) => {
//       console.log("✅ AtualizarFila payload recebido:", payload);

//       let parsedPayload: any;
//       if (typeof payload === "string") {
//         try {
//           parsedPayload = JSON.parse(payload);
//           console.log("✅ Payload parseado com sucesso:", parsedPayload);
//         } catch (error) {
//           console.error("❌ Falha ao parsear o payload JSON:", error, "Payload:", payload);
//           return;
//         }
//       } else {
//         parsedPayload = payload;
//       }

//       if (!parsedPayload || typeof parsedPayload !== "object") {
//         console.warn("Payload inválido: não é um objeto:", parsedPayload);
//         return;
//       }

//       const clientes = parsedPayload.clientes;

//       if (!Array.isArray(clientes)) {
//         console.warn("Payload inválido: clientes não é um array:", clientes);
//         return;
//       }

//       setAllClients((prev) => {
//         console.log("Estado anterior allClients (AtualizarFila):", prev);

//         const clientesMapeados = clientes.map((cliente: any) => {
//           const clientePadronizado = padraoCliente(cliente);
//           console.log("Cliente mapeado:", clientePadronizado);
//           return {
//             ...clientePadronizado,
//             _forceRender: Date.now(),
//           };
//         });

//         // Atualizar allClients sem duplicatas
//         const updatedClients = updateClients(prev, clientesMapeados);
//         console.log("Novo estado allClients (AtualizarFila):", updatedClients);
//         return updatedClients;
//       });

//       forceRender();
//       console.log("✅ Estado atualizado e re-render forçado (AtualizarFila)");
//     });

//     connection.on("DesistirClientes", (payload: any) => {
//       console.log("✅ DesistirClientes payload recebido:", payload);

//       let parsedPayload: any;
//       if (typeof payload === "string") {
//         try {
//           parsedPayload = JSON.parse(payload);
//           console.log("✅ Payload parseado com sucesso:", parsedPayload);
//         } catch (error) {
//           console.error("❌ Falha ao parsear o payload JSON:", error, "Payload:", payload);
//           return;
//         }
//       } else {
//         parsedPayload = payload;
//       }

//       if (!parsedPayload || typeof parsedPayload !== "object") {
//         console.warn("Payload inválido: não é um objeto:", parsedPayload);
//         return;
//       }

//       const clientes = parsedPayload.clientes;
//       const clienteAtualizado = parsedPayload.clientesAtualizados;

//       if (!Array.isArray(clientes)) {
//         console.warn("Payload inválido: clientes não é um array:", clientes);
//         return;
//       }

//       setAllClients((prev) => {
//         console.log("Estado anterior allClients (DesistirClientes):", prev);

//         const clientesMapeados = clientes.map((cliente: any) => ({
//           ...padraoCliente(cliente),
//           _forceRender: Date.now(),
//         }));

//         if (clienteAtualizado && typeof clienteAtualizado === "object") {
//           const clienteAtualizadoPadronizado = {
//             ...padraoCliente(clienteAtualizado),
//             _forceRender: Date.now(),
//           };
//           clientesMapeados.push(clienteAtualizadoPadronizado);
//           console.log("Cliente atualizado incluído:", clienteAtualizadoPadronizado);
//         }

//         const updatedClients = updateClients(prev, clientesMapeados);
//         console.log("Novo estado allClients (DesistirClientes):", updatedClients);
//         return updatedClients;
//       });

//       forceRender();
//       console.log("✅ Estado atualizado e re-render forçado (DesistirClientes)");
//     });

//     connection.onclose(error => {
//       console.error("Conexão SignalR fechada:", error);
//       reconnectAttemptsRef.current = 0;
//       attemptReconnect();
//     });

//     connection.onreconnecting(error => {
//       console.log("Reconectando ao SignalR:", error);
//     });

//     connection.onreconnected(connectionId => {
//       console.log("Reconectado ao SignalR com connectionId:", connectionId);
//       reconnectAttemptsRef.current = 0;
//     });

//     const attemptReconnect = async () => {
//       if (reconnectAttemptsRef.current >= MAX_RECONNECT_ATTEMPTS) {
//         console.error("Número máximo de tentativas de reconexão atingido.");
//         // Fallback: buscar dados via REST
//         const clientes = await buscarClientesFila();
//         setAllClients(clientes);
//         return;
//       }

//       reconnectAttemptsRef.current += 1;
//       console.log(`Tentativa de reconexão ${reconnectAttemptsRef.current}/${MAX_RECONNECT_ATTEMPTS}`);

//       try {
//         await connection.start();
//         console.log("✅ Conexão SignalR iniciada com sucesso!");
//       } catch (error) {
//         console.error("❌ Falha ao iniciar a conexão SignalR:", error);
//         setTimeout(attemptReconnect, RECONNECT_INTERVAL);
//       }
//     };

//     try {
//       console.log("Iniciando conexão SignalR...");
//       await connection.start();
//       console.log("✅ Conexão SignalR iniciada com sucesso!");
//     } catch (error) {
//       console.error("❌ Falha ao iniciar a conexão SignalR:", error);
//       setTimeout(attemptReconnect, RECONNECT_INTERVAL);
//     }
//   };

//   useEffect(() => {
//     startConnection();

//     return () => {
//       if (connectionRef.current) {
//         console.log("Encerrando conexão SignalR...");
//         connectionRef.current.stop();
//         connectionRef.current = null;
//       }
//     };
//   }, [setAllClients, forceRender]);

//   return null;
// }



"use client";

import { useEffect, useRef } from "react";
import { HubConnectionBuilder, LogLevel, HubConnection, HttpTransportType } from "@microsoft/signalr";
import { useFilaContext } from "@/features/fila/context/FilaProvider";
import { padraoCliente } from "@/lib/utils/padraoCliente";
import { FilaItem } from "../components/types/filaTypes";
import { parseCookies } from "nookies";
import { buscarClientesFila } from "../services/FilaService";
import { toast } from "sonner";

const SIGNALR_URL = "http://10.0.0.191:5135/empresahub";
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_INTERVAL = 5000;
const CONNECTION_TIMEOUT = 10000; // 10 segundos

const withTimeout = async <T>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
  const timeoutPromise = new Promise<T>((_, reject) => {
    setTimeout(() => reject(new Error("Tempo limite excedido ao iniciar a conexão SignalR")), timeoutMs);
  });
  return Promise.race([promise, timeoutPromise]);
};

export function useFilaSignalR() {
  const { setAllClients, forceRender, isLoading } = useFilaContext();
  const connectionRef = useRef<HubConnection | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const isUpdatingRef = useRef(false);

  const updateClients = (prev: FilaItem[], novosClientes: FilaItem[]) => {
    const novosIds = new Set(novosClientes.map(c => c.id));
    const clientesPreservados = prev.filter(c => !novosIds.has(c.id));
    const clientesAtualizados = [...clientesPreservados, ...novosClientes];

    const uniqueClientsMap = new Map<string, FilaItem>();
    clientesAtualizados.forEach(client => uniqueClientsMap.set(client.id, client));
    const uniqueClients = Array.from(uniqueClientsMap.values());

    console.log("Clientes após remover duplicatas:", uniqueClients);
    return uniqueClients;
  };

  const processPayload = (payload: any, handlerName: string): FilaItem[] | null => {
    let parsedPayload: any;
    if (typeof payload === "string") {
      try {
        parsedPayload = JSON.parse(payload);
        console.log(`✅ Payload parseado com sucesso (${handlerName}):`, parsedPayload);
      } catch (error) {
        console.error(`❌ Falha ao parsear o payload JSON (${handlerName}):`, error, "Payload:", payload);
        toast.error("Erro ao processar atualização da fila.");
        return null;
      }
    } else {
      parsedPayload = payload;
    }

    if (!parsedPayload || typeof parsedPayload !== "object") {
      console.warn(`Payload inválido: não é um objeto (${handlerName}):`, parsedPayload);
      toast.error("Dados inválidos recebidos do servidor.");
      return null;
    }

    const clientes = parsedPayload.clientes;
    if (!Array.isArray(clientes)) {
      console.warn(`Payload inválido: clientes não é um array (${handlerName}):`, clientes);
      toast.error("Dados inválidos recebidos do servidor.");
      return null;
    }

    const clientesMapeados = clientes.map((cliente: any) => ({
      ...padraoCliente(cliente),
      _forceRender: Date.now(),
    }));

    return clientesMapeados;
  };

  const startConnection = async () => {
    if (connectionRef.current) {
      console.log("Conexão SignalR já existe, ignorando nova inicialização.");
      return;
    }

    const { "auth.token": token } = parseCookies();
    if (!token) {
      console.warn("⛔ Token não disponível para SignalR");
      const clientes = await buscarClientesFila();
      setAllClients(clientes);
      return;
    }

    const connection = new HubConnectionBuilder()
      .withUrl(SIGNALR_URL, {
        skipNegotiation: false,
        transport: HttpTransportType.WebSockets,
        accessTokenFactory: () => token,
      })
      .configureLogging(LogLevel.Debug)
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: retryContext => {
          const delay = Math.min(1000 * (retryContext.previousRetryCount + 1), 30000);
          console.log(`Tentativa de reconexão ${retryContext.previousRetryCount + 1}, aguardando ${delay}ms`);
          return delay;
        },
      })
      .build();

    connectionRef.current = connection;

    connection.on("AtualizarFila", (payload: any) => {
      if (isLoading || isUpdatingRef.current) {
        console.log("ℹ️ Atualização do SignalR ignorada: outra ação em andamento.");
        return;
      }

      isUpdatingRef.current = true;
      console.log("✅ AtualizarFila payload recebido:", payload);

      const clientesMapeados = processPayload(payload, "AtualizarFila");
      if (!clientesMapeados) {
        isUpdatingRef.current = false;
        return;
      }

      setAllClients((prev) => {
        console.log("Estado anterior allClients (AtualizarFila):", prev);
        const updatedClients = updateClients(prev, clientesMapeados);
        console.log("Novo estado allClients (AtualizarFila):", updatedClients);
        return updatedClients;
      });

      forceRender();
      console.log("✅ Estado atualizado e re-render forçado (AtualizarFila)");
      isUpdatingRef.current = false;
    });

    connection.on("DesistirClientes", (payload: any) => {
      if (isLoading || isUpdatingRef.current) {
        console.log("ℹ️ Atualização do SignalR ignorada: outra ação em andamento.");
        return;
      }

      isUpdatingRef.current = true;
      console.log("✅ DesistirClientes payload recebido:", payload);

      const clientesMapeados = processPayload(payload, "DesistirClientes");
      if (!clientesMapeados) {
        isUpdatingRef.current = false;
        return;
      }

      const parsedPayload = typeof payload === "string" ? JSON.parse(payload) : payload;
      const clienteAtualizado = parsedPayload?.clientesAtualizados;

      if (clienteAtualizado && typeof clienteAtualizado === "object") {
        const clienteAtualizadoPadronizado = {
          ...padraoCliente(clienteAtualizado),
          _forceRender: Date.now(),
        };
        clientesMapeados.push(clienteAtualizadoPadronizado);
        console.log("Cliente atualizado incluído:", clienteAtualizadoPadronizado);
      }

      setAllClients((prev) => {
        console.log("Estado anterior allClients (DesistirClientes):", prev);
        const updatedClients = updateClients(prev, clientesMapeados);
        console.log("Novo estado allClients (DesistirClientes):", updatedClients);
        return updatedClients;
      });

      forceRender();
      console.log("✅ Estado atualizado e re-render forçado (DesistirClientes)");
      isUpdatingRef.current = false;
    });

    connection.onclose(error => {
      console.error("Conexão SignalR fechada:", error);
      reconnectAttemptsRef.current = 0;
      attemptReconnect();
    });

    connection.onreconnecting(error => {
      console.log("Reconectando ao SignalR:", error);
    });

    connection.onreconnected(connectionId => {
      console.log("Reconectado ao SignalR com connectionId:", connectionId);
      reconnectAttemptsRef.current = 0;
    });

    const attemptReconnect = async () => {
      if (reconnectAttemptsRef.current >= MAX_RECONNECT_ATTEMPTS) {
        console.error("Número máximo de tentativas de reconexão atingido.");
        const clientes = await buscarClientesFila();
        setAllClients(clientes);
        return;
      }

      reconnectAttemptsRef.current += 1;
      console.log(`Tentativa de reconexão ${reconnectAttemptsRef.current}/${MAX_RECONNECT_ATTEMPTS}`);

      try {
        await withTimeout(connection.start(), CONNECTION_TIMEOUT);
        console.log("✅ Conexão SignalR iniciada com sucesso!");
      } catch (error) {
        console.error("❌ Falha ao iniciar a conexão SignalR:", error);
        toast.error("Não foi possível reconectar ao servidor de atualizações.");
        setTimeout(attemptReconnect, RECONNECT_INTERVAL);
      }
    };

    try {
      console.log("Iniciando conexão SignalR...");
      await withTimeout(connection.start(), CONNECTION_TIMEOUT);
      console.log("✅ Conexão SignalR iniciada com sucesso!");
    } catch (error) {
      console.error("❌ Falha ao iniciar a conexão SignalR:", error);
      toast.error("Não foi possível conectar ao servidor de atualizações.");
      setTimeout(attemptReconnect, RECONNECT_INTERVAL);
    }
  };

  useEffect(() => {
    startConnection();

    return () => {
      if (connectionRef.current) {
        console.log("Desmontando componente, fechando conexão SignalR...");
        connectionRef.current.stop();
        connectionRef.current = null;
      }
    };
  }, []);
}