// import { useEffect, useRef } from "react";
// import { useFilaContext } from "@/features/fila/context/FilaProvider";
// import { useFilaSignalR } from "@/features/fila/hooks/useFilaSignalR";
// import { parseCookies } from "nookies";

// interface FilaSignalRListenerProps {
//   setIsSignalRConnected: (connected: boolean) => void;
// }

// export const FilaSignalRListener = ({ setIsSignalRConnected }: FilaSignalRListenerProps) => {
//   const { setAllClients } = useFilaContext();
//   const { "auth.token": token } = parseCookies();
//   const isInitialized = useRef(false);

//   useEffect(() => {
//     if (!token) {
//       console.error("❌ Token ausente, não é possível iniciar o SignalR.");
//       setIsSignalRConnected(false);
//       return;
//     }

//     if (!isInitialized.current) {
//       console.log("🔧 Inicializando FilaSignalRListener com token:", token.slice(0, 10) + "...");
//       isInitialized.current = true;
//     }
//   }, [token, setIsSignalRConnected]);

//   // Chamar o hook no nível superior, sem try/catch ou condicional
//   useFilaSignalR(setAllClients, setIsSignalRConnected, token);

//   return null;
// };


import { useFilaContext } from "@/features/fila/context/FilaProvider";
import { useFilaSignalR } from "@/features/fila/hooks/useFilaSignalR";
import { parseCookies } from "nookies";

interface FilaSignalRListenerProps {
  setIsSignalRConnected: (connected: boolean) => void;
}

export const FilaSignalRListener = ({ setIsSignalRConnected }: FilaSignalRListenerProps) => {
  const { setAllClients } = useFilaContext();
  const { "auth.token": token } = parseCookies();

  console.log("Token sendo usado para SignalR:", token || "Nenhum token encontrado");

  try {
    // Usar o hook para escutar eventos do SignalR
    useFilaSignalR(setAllClients, setIsSignalRConnected, token || "");
  } catch (error) {
    console.error("Erro ao iniciar o SignalR no FilaSignalRListener:", error);
    setIsSignalRConnected(false);
  }

  // Este componente não renderiza nada, apenas escuta eventos
  return null;
};