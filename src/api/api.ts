import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig, AxiosHeaders } from "axios";
import { parseCookies, setCookie, destroyCookie } from "nookies";

interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const axiosInstance = axios.create({
  baseURL: "http://localhost:5135/api",
  headers: {
    "Content-Type": "application/json",
  },
});

const axiosPublicInstance = axios.create({
  baseURL: "http://localhost:5135/api",
  headers: {
    "Content-Type": "application/json",
  },
});

const refreshToken = async (): Promise<{ accessToken: string; refreshToken: string }> => {
  const { "auth.refreshToken": refreshTokenValue } = parseCookies();
  if (!refreshTokenValue) {
    console.error("❌ Refresh token ausente nos cookies.");
    throw new Error("Refresh token ausente");
  }

  console.log("🔄 Tentando renovar token com refresh token:", refreshTokenValue.slice(0, 10) + "...");
  const response = await axiosPublicInstance.post("/autenticacao/refresh-token", {
    refreshToken: refreshTokenValue,
  });
  const { accessToken, refreshToken: newRefreshToken } = response.data as { accessToken: string; refreshToken: string };
  console.log("✅ Token renovado com sucesso:", { accessToken: accessToken.slice(0, 10) + "...", newRefreshToken: newRefreshToken.slice(0, 10) + "..." });
  return { accessToken, refreshToken: newRefreshToken };
};

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log("✅ Resposta recebida:", {
      url: response.config.url,
      status: response.status,
    });
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as ExtendedAxiosRequestConfig;
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log("❌ Erro 401 detectado em:", error.config?.url ?? "URL desconhecida", "Tentando renovar token...");
      try {
        const { accessToken, refreshToken: newRefreshToken } = await refreshToken();
        setAuthorizationHeader(accessToken);

        setCookie(undefined, "auth.token", accessToken, {
          maxAge: 60 * 60 * 24 * 7,
          path: "/",
          secure: false,
          sameSite: "lax",
        });
        setCookie(undefined, "auth.refreshToken", newRefreshToken, {
          maxAge: 60 * 60 * 24 * 30,
          path: "/",
          secure: false,
          sameSite: "lax",
        });

        const headers = new AxiosHeaders(originalRequest.headers);
        headers.set("Authorization", `Bearer ${accessToken}`);

        const retryConfig: InternalAxiosRequestConfig = {
          ...originalRequest,
          headers,
        };

        console.log("🔄 Reenviando requisição com novo token:", retryConfig.url);
        return axiosInstance(retryConfig);
      } catch (refreshError: any) {
        console.error("❌ Erro ao tentar renovar token:", refreshError);
        if (refreshError.response?.data?.message === "Refresh token revogado") {
          console.log("🔒 Refresh token revogado, redirecionando para login...");
          destroyCookie(undefined, "auth.token", { path: "/" });
          destroyCookie(undefined, "auth.refreshToken", { path: "/" });
          removeAuthorizationHeader();
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }
    console.error("❌ Erro na resposta:", {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.request.use(
  (config) => {
    console.log("📤 Requisição enviada:", {
      url: config.url,
      method: config.method,
      headers: config.headers,
    });
    return config;
  },
  (error) => {
    console.error("❌ Erro no interceptor de requisição:", error);
    return Promise.reject(error);
  }
);

export function setAuthorizationHeader(token: string) {
  console.log("🔑 Configurando cabeçalho de autorização com token:", token.slice(0, 10) + "...");
  axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export function removeAuthorizationHeader() {
  console.log("🔑 Removendo cabeçalho de autorização");
  delete axiosInstance.defaults.headers.common["Authorization"];
}

export function initializeToken(token?: string) {
  if (token) {
    setAuthorizationHeader(token);
  }
}

export const Api = {
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