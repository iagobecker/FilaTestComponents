import * as signalR from "@microsoft/signalr";

const HUB_URL = "http://localhost:5135/empresahub"; // URL do backend SignalR

let connection: signalR.HubConnection | null = null;

export const startConnection = async () => {
  if (connection && connection.state === signalR.HubConnectionState.Connected) {
    return;
  }

  connection = new signalR.HubConnectionBuilder()
    .withUrl(HUB_URL, {
      withCredentials: true, 
      transport: signalR.HttpTransportType.WebSockets,
    })
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .build();

  try {
    await connection.start();
    console.log("Conectado ao SignalR");
  } catch (err) {
    console.error("Erro ao conectar ao SignalR:", err);
  }
};

export const stopConnection = async () => {
  if (connection) {
    await connection.stop();
    console.log("Conexão SignalR encerrada");
  }
};

export const getConnection = () => connection;
 