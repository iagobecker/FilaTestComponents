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
    useFilaSignalR(setAllClients, setIsSignalRConnected, token || "");
  } catch (error) {
    console.error("Erro ao iniciar o SignalR no FilaSignalRListener:", error);
    setIsSignalRConnected(false);
  }

  return null;
};