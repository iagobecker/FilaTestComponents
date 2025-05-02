// lib/signalRConnection.ts
import * as signalR from "@microsoft/signalr";

class SignalRConnection {
  private connection: signalR.HubConnection | null = null;
  private baseUrl = "http://10.0.0.191:5135";

  async connect(token: string) {
    if (this.connection && this.connection.state === signalR.HubConnectionState.Connected) {
      return;
    }

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${this.baseUrl}/empresahub`, {
        accessTokenFactory: () => token,
      })
      .configureLogging(signalR.LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    try {
      await this.connection.start();
    } catch (error) {
      console.error(" Erro ao conectar ao SignalR:", error);
    }
  }

  async disconnect() {
    if (this.connection && (this.connection.state === signalR.HubConnectionState.Connected || this.connection.state === signalR.HubConnectionState.Connecting)) {
      try {
        await this.connection.stop();
      } catch (error) {
        console.error(" Erro ao desconectar SignalR:", error);
      }
    }
    this.connection = null;
  }

  get connectionInstance() {
    return this.connection;
  }
}

const signalRConnection = new SignalRConnection();
export default signalRConnection;