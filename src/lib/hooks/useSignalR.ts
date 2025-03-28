import { useEffect } from "react";
import { startConnection, stopConnection, getConnection } from "../utils/signalrService";

export const useSignalR = (onUpdate: (eventName: string, data: any) => void) => {
 
  const connection = getConnection();

  useEffect(() => {
    startConnection();

    if (connection) {
      // Escutando eventos genéricos de atualização de dados
      connection.on("DataUpdated", (data: any) => {
        console.log("Dados atualizados:", data);
        onUpdate("DataUpdated", data); // Callback para lidar com a atualização
      });
    }

    return () => {
      stopConnection();
    };
  }, [connection, onUpdate]);

    return connection;
};
