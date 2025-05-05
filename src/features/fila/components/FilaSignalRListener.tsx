import { useFilaContext } from "@/features/fila/context/FilaProvider";
import { useFilaSignalR } from "@/features/fila/hooks/useFilaSignalR";
import { parseCookies } from "nookies";

interface FilaSignalRListenerProps {
  setIsSignalRConnected: (connected: boolean) => void;
}

export const FilaSignalRListener = ({ setIsSignalRConnected }: FilaSignalRListenerProps) => {
  const { setAllClients } = useFilaContext();
  const { "auth.token": token } = parseCookies();


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