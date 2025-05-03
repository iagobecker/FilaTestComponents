import axios, { AxiosInstance, AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";

// Extending InternalAxiosRequestConfig to include _retry
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}
import { parseCookies, setCookie } from "nookies";
import { useAuth } from "@/features/auth/context/AuthContext";

// Instância para requisições autenticadas
const axiosInstance = axios.create({
  baseURL: "http://localhost:5135/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Instância para requisições públicas (sem token)
const axiosPublicInstance = axios.create({
  baseURL: "http://localhost:5135/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Definindo o tipo personalizado para o objeto Api
interface CustomApi {
  get: (url: string, params?: any) => Promise<AxiosResponse>;
  post: (url: string, data?: any) => Promise<AxiosResponse>;
  put: (url: string, data?: any) => Promise<AxiosResponse>;
  patch: (url: string, data?: any) => Promise<AxiosResponse>;
  delete: (url: string) => Promise<AxiosResponse>;
  setAuthorizationHeader: (token: string) => void;
  removeAuthorizationHeader: () => void;
}

// Interceptor para lidar com erros 401 e tentar refresh token
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log("Resposta recebida:", {
      url: response.config.url,
      status: response.status,
    });
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig | undefined;
    if (error.response?.status === 401 && originalRequest && !(originalRequest as ExtendedAxiosRequestConfig)._retry) {
      (originalRequest as ExtendedAxiosRequestConfig)._retry = true;
      try {
        console.log("Erro 401 detectado, tentando refresh token...");
        const { accessToken } = await useAuth().refreshToken(); // Usa a função do AuthContext
        setAuthorizationHeader(accessToken);

        // Cria uma nova configuração de requisição com base no originalRequest
        const retryConfig: InternalAxiosRequestConfig = {
          ...originalRequest,
          headers: new axios.AxiosHeaders({
            ...originalRequest.headers?.toJSON(),
            Authorization: `Bearer ${accessToken}`,
          }),
        };

        return axiosInstance(retryConfig);
      } catch (refreshError) {
        console.error("Erro ao tentar refresh token:", refreshError);
        // Redireciona para o login se o refresh falhar
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    console.error("Erro na resposta:", {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);

// Interceptor para logar requisições autenticadas
axiosInstance.interceptors.request.use(
  (config) => {
    console.log("Requisição enviada:", {
      url: config.url,
      method: config.method,
      headers: config.headers,
    });
    return config;
  },
  (error) => {
    console.error("Erro no interceptor de requisição:", error);
    return Promise.reject(error);
  }
);

// Adiciona o token JWT às requisições autenticadas
export function setAuthorizationHeader(token: string) {
  console.log("Configurando cabeçalho de autorização com token:", token);
  axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// Remove o token JWT
export function removeAuthorizationHeader() {
  console.log("Removendo cabeçalho de autorização");
  delete axiosInstance.defaults.headers.common["Authorization"];
}

// Atualiza o token inicial se existir nos cookies
export function initializeToken(token?: string) {
  if (token) {
    setAuthorizationHeader(token);
  }
}

// Exporta o objeto Api com o tipo personalizado
export const Api: CustomApi = {
  get: (url: string, params?: any) => axiosInstance.get(url, { params }),
  post: (url: string, data?: any) => axiosInstance.post(url, data),
  put: (url: string, data?: any) => axiosInstance.put(url, data),
  patch: (url: string, data?: any) => axiosInstance.patch(url, data),
  delete: (url: string) => axiosInstance.delete(url),
  setAuthorizationHeader,
  removeAuthorizationHeader,
};

export const PublicApi = {
  get: (url: string, params?: any) => axiosPublicInstance.get(url, { params }),
  post: (url: string, data?: any) => axiosPublicInstance.post(url, data),
};