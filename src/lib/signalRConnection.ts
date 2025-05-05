import * as signalR from "@microsoft/signalr";

class SignalRConnection {
  private connection: signalR.HubConnection | null = null;
  private baseUrl = "http://10.0.0.191:5135";
  private isConnecting: boolean = false;

  async connect(token: string): Promise<void> {
    if (this.connection && this.connection.state === signalR.HubConnectionState.Connected) {
      console.log("Conexão SignalR já está conectada.");
      return;
    }

    if (this.isConnecting || (this.connection && this.connection.state === signalR.HubConnectionState.Connecting)) {
      console.log("Conexão SignalR já está em progresso, aguardando...");
      return;
    }

    this.isConnecting = true;

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${this.baseUrl}/empresahub`, {
        accessTokenFactory: () => token,
        withCredentials: true,
        transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling, // Fallback para LongPolling
      })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (retryContext) => {
          if (retryContext.previousRetryCount < 5) {
            return 1000 + retryContext.previousRetryCount * 2000; // Aumenta o atraso progressivamente
          }
          return null; // Para após 5 tentativas
        },
      })
      .configureLogging(signalR.LogLevel.Information)
      .build();

    try {
      await this.connection.start();
      console.log("Conexão SignalR estabelecida com sucesso!");
      this.isConnecting = false;
    } catch (error) {
      console.error("Erro ao conectar ao SignalR:", error);
      this.isConnecting = false;
      this.connection = null;
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (!this.connection) {
      console.log("Nenhuma conexão SignalR para desconectar.");
      return;
    }

    const state = this.connection.state;
    if (state === signalR.HubConnectionState.Disconnected) {
      console.log("Conexão SignalR já está desconectada.");
      this.connection = null;
      return;
    }

    if (state === signalR.HubConnectionState.Connecting) {
      console.log("Aguardando handshake completar antes de desconectar...");
      await new Promise<void>((resolve) => {
        const checkState = setInterval(() => {
          if (this.connection && this.connection.state !== signalR.HubConnectionState.Connecting) {
            clearInterval(checkState);
            resolve();
          }
        }, 500);
      });
    }

    if (this.connection && (this.connection.state === signalR.HubConnectionState.Connected || this.connection.state === signalR.HubConnectionState.Reconnecting)) {
      try {
        await this.connection.stop();
        console.log("Conexão SignalR desconectada com sucesso!");
      } catch (error) {
        console.error("Erro ao desconectar SignalR:", error);
      }
    } else {
      console.log("Conexão não está em estado válido para desconexão, estado atual:", state);
    }
    this.connection = null;
    this.isConnecting = false;
  }

  get connectionInstance(): signalR.HubConnection | null {
    return this.connection;
  }
}

const signalRConnection = new SignalRConnection();
export default signalRConnection;

