import * as signalR from "@microsoft/signalr";

class SignalRConnection {
  private connection: signalR.HubConnection;
  private baseUrl = "http://localhost:5135";
  private isConnecting: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 10;
  private currentToken: string = "";

  constructor() {
    this.connection = this.connectionBuilder("");
  }

  async connect(token: string): Promise<void> {
    this.currentToken = token; // Armazena o token para reconexões

    if (this.connection.state === signalR.HubConnectionState.Connected) {
      console.log("✅ Conexão SignalR já está conectada.");
      return;
    }

    if (this.isConnecting || this.connection.state === signalR.HubConnectionState.Connecting) {
      console.log("🔄 Conexão SignalR já está em progresso, aguardando...");
      return;
    }

    this.isConnecting = true;

    // Atualiza a conexão com o novo token
    this.connection = this.connectionBuilder(token);

    try {
      await this.connection.start();
      console.log("✅ Conexão SignalR estabelecida com sucesso!");
      this.reconnectAttempts = 0;
      this.isConnecting = false;

      // Configura o onclose
      this.connection.onclose(async (error) => {
        if (this.isConnecting) return;
        console.log("❌ SignalR desconectado. Tentando reconectar...", error);
        await this.reconnect();
      });
    } catch (error) {
      console.error("❌ Erro ao conectar ao SignalR:", error);
      this.isConnecting = false;
      await this.reconnect();
    }
  }

  private connectionBuilder(token: string): signalR.HubConnection {
    return new signalR.HubConnectionBuilder()
      .withUrl(`${this.baseUrl}/controledefilahub`, {
        accessTokenFactory: () => token,
        withCredentials: true,
        transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling,
      })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (retryContext) => {
          if (retryContext.previousRetryCount < 5) {
            return 1000 + retryContext.previousRetryCount * 2000;
          }
          return null;
        },
      })
      .configureLogging(signalR.LogLevel.Information)
      .build();
  }

  private async reconnect(): Promise<void> {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("❌ Máximo de tentativas de reconexão atingido.");
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000); // Exponencial até 30s
    console.log(`🔄 Tentativa de reconexão #${this.reconnectAttempts}. Aguardando ${delay}ms...`);
    await new Promise((resolve) => setTimeout(resolve, delay));

    try {
      // Usa o token atual para reconectar
      this.connection = this.connectionBuilder(this.currentToken);
      await this.connection.start();
      console.log("✅ Reconexão SignalR bem-sucedida!");
      this.reconnectAttempts = 0;
      this.isConnecting = false;

      // Reaplica o onclose
      this.connection.onclose(async (error) => {
        if (this.isConnecting) return;
        console.log("❌ SignalR desconectado. Tentando reconectar...", error);
        await this.reconnect();
      });
    } catch (error) {
      console.error("❌ Falha na reconexão. Tentando novamente...", error);
      await this.reconnect();
    }
  }

  async disconnect(): Promise<void> {
    const state = this.connection.state;
    if (state === signalR.HubConnectionState.Disconnected) {
      console.log("ℹ️ Conexão SignalR já está desconectada.");
      return;
    }

    if (state === signalR.HubConnectionState.Connecting) {
      console.log("⏳ Aguardando handshake completar antes de desconectar...");
      await new Promise<void>((resolve) => {
        const checkState = setInterval(() => {
          if (this.connection.state !== signalR.HubConnectionState.Connecting) {
            clearInterval(checkState);
            resolve();
          }
        }, 500);
      });
    }

    if (this.connection.state === signalR.HubConnectionState.Connected || this.connection.state === signalR.HubConnectionState.Reconnecting) {
      try {
        await this.connection.stop();
        console.log("✅ Conexão SignalR desconectada com sucesso!");
      } catch (error) {
        console.error("❌ Erro ao desconectar SignalR:", error);
      }
    } else {
      console.log("⚠️ Conexão não está em estado válido para desconexão, estado atual:", state);
    }
    this.isConnecting = false;
    this.reconnectAttempts = 0;
  }

  get connectionInstance(): signalR.HubConnection {
    return this.connection;
  }
}

const signalRConnection = new SignalRConnection();
export default signalRConnection;