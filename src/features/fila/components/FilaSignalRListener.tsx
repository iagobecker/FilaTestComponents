import { useFilaContext } from "@/features/fila/context/FilaProvider";
import { useFilaSignalR } from "@/features/fila/hooks/useFilaSignalR";
import { parseCookies } from "nookies";

interface FilaSignalRListenerProps {
  setIsSignalRConnected: (connected: boolean) => void;
}

export const FilaSignalRListener = ({ setIsSignalRConnected }: FilaSignalRListenerProps) => {
  const { setAllClients } = useFilaContext();
  const { "auth.token": token } = parseCookies();

  if (!token) {
    console.error("Token ausente, não é possível iniciar o SignalR.");
    setIsSignalRConnected(false);
    return null;
  }

  try {
    useFilaSignalR(setAllClients, setIsSignalRConnected, token);
  } catch (error) {
    console.error("Erro ao iniciar o SignalR no FilaSignalRListener:", error);
    setIsSignalRConnected(false);
  }

  return null;
};