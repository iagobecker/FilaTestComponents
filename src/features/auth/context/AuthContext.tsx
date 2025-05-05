"use client";

import { createContext, useEffect, useState, useCallback } from "react";
import { setCookie, parseCookies, destroyCookie } from "nookies";
import { Api, PublicApi, initializeToken } from "@/api/api";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { EmpresaService } from "@/features/auth/components/services/empresaService";
import axios from "axios";

type Empresa = {
  nome: string;
  email: string;
  cpfCnpj: string;
};

type User = {
  id: string;
  name: string;
  email: string;
  empresaId: string;
  empresa: Empresa;
  signOut: () => void;
};

type DecodedToken = {
  sub?: string;
  name?: string;
  email?: string;
  exp?: number;
  [key: string]: any;
};

type TokenResponse = {
  accessToken: string;
  refreshToken: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  email: string;
  setEmail: (email: string) => void;
  sendVerificationCode: (email: string) => Promise<void>;
  verifyCode: (email: string, code: string) => Promise<void>;
  loading: boolean;
  authStep: "email" | "senha" | "authenticated";
  setAuthStep: (step: "email" | "senha" | "authenticated") => void;
  signOut: () => void;
  refreshToken: () => Promise<TokenResponse>;
  onTokenUpdated: (newToken: string) => void;
};

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [authStep, setAuthStep] = useState<"email" | "senha" | "authenticated">("email");
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = !!user;
  const [isRefreshing, setIsRefreshing] = useState(false);

  const checkTokenValidity = useCallback(async () => {
    if (isRefreshing) return;
    const { "auth.token": token } = parseCookies();
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        const currentTime = Math.floor(Date.now() / 1000);
        if (decoded.exp && decoded.exp < currentTime) {
          console.log("Token expirado, tentando renovar...");
          await refreshToken();
        } else if (!user) {
          let empresaId = "";
          let empresaData = null;
          try {
            empresaData = await EmpresaService.fetchEmpresa();
            empresaId = empresaData?.id || "";
          } catch (error: any) {
            if (error.response?.status === 401) {
              console.error("❌ Token inválido ou expirado ao buscar empresa, redirecionando para login...");
              signOut();
              return;
            }
            console.error("Erro ao buscar empresa (não crítico):", error);
            return;
          }
          const id = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
          const decodedEmail = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"];
          const name = decoded["name"] || "Administrador";
          if (id) {
            setUser({
              id,
              name,
              email: decodedEmail || "",
              empresaId,
              empresa: {
                nome: empresaData.nome,
                email: empresaData.email,
                cpfCnpj: empresaData.cpfCnpj,
              },
              signOut,
            });
            setAuthStep("authenticated");
          }
        }
      } catch (error) {
        console.error("Erro ao decodificar token:", error);
        signOut();
      }
    } else if (
      pathname &&
      pathname !== "/login" &&
      pathname !== "/inscrevase" &&
      ![
        "/fila",
        "/configuracoes",
        "/customAparencia",
        "/ativaWhatsapp",
        "/customizarMensagem",
        "/vinculaMonitor",
      ].includes(pathname)
    ) {
      console.log(`Token ausente, redirecionando para /login desde ${pathname}`);
      if (!loading) {
        router.push("/login");
      }
    }
  }, [pathname, router, user, isRefreshing, loading]);

  const refreshToken = async (): Promise<TokenResponse> => {
    if (isRefreshing) {
      throw new Error("Já existe uma tentativa de refresh em andamento");
    }
    setIsRefreshing(true);
    try {
      const { "auth.refreshToken": refreshTokenValue } = parseCookies();
      if (!refreshTokenValue) {
        console.error("❌ Refresh token ausente, redirecionando para login");
        signOut();
        throw new Error("Refresh token ausente");
      }

      setLoading(true);
      const response = await PublicApi.post("/autenticacao/refresh-token", {
        refreshToken: refreshTokenValue,
      });
      const { accessToken, refreshToken: newRefreshToken } = response.data;

      console.log("✅ Token renovado com sucesso:", { accessToken: accessToken.slice(0, 10) + "...", newRefreshToken: newRefreshToken.slice(0, 10) + "..." });

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

      Api.setAuthorizationHeader(accessToken);
      initializeToken(accessToken);

      const decoded = jwtDecode<DecodedToken>(accessToken);
      const id = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
      const decodedEmail = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"];
      const name = decoded["name"] || "Administrador";
      let empresaId = "";
      let empresaData = null;
      try {
        empresaData = await EmpresaService.fetchEmpresa();
        empresaId = empresaData?.id || "";
      } catch (error) {
        console.error("Erro ao buscar empresa após refresh:", error);
        signOut();
        throw error;
      }

      if (id) {
        setUser({
          id,
          name,
          email: decodedEmail || "",
          empresaId,
          empresa: {
            nome: empresaData.nome,
            email: empresaData.email,
            cpfCnpj: empresaData.cpfCnpj,
          },
          signOut,
        });
      }

      onTokenUpdated(accessToken);

      return { accessToken, refreshToken: newRefreshToken };
    } catch (error) {
      console.error("❌ Erro ao renovar token:", error);
      signOut();
      throw error;
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const onTokenUpdated = (newToken: string) => {
    console.log("🔑 Token atualizado:", newToken.slice(0, 10) + "...");
    // Notificação para outros componentes (ex.: FilaProvider) para reiniciar SignalR
    const event = new CustomEvent("tokenUpdated", { detail: newToken });
    window.dispatchEvent(event);
  };

  useEffect(() => {
    async function loadUserFromCookies() {
      if (typeof window === "undefined") return;
      await checkTokenValidity();
      setLoading(false);
    }
    loadUserFromCookies();
    const interval = setInterval(async () => {
      const { "auth.token": token } = parseCookies();
      if (token) {
        const decoded = jwtDecode<DecodedToken>(token);
        const currentTime = Math.floor(Date.now() / 1000);
        if (decoded.exp && decoded.exp < currentTime + 300) {
          console.log("Token perto de expirar, renovando...");
          await refreshToken();
        }
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [checkTokenValidity]);

  async function sendVerificationCode(email: string) {
    try {
      setLoading(true);
      const response = await PublicApi.post("/autenticacao/codigo-acesso", { email });
      if (response.status !== 200) {
        throw new Error("Falha ao enviar código");
      }
      setEmail(email);
      setAuthStep("senha");
    } catch (error: any) {
      let errorMessage = "Erro ao enviar código";
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.message || "Erro desconhecido na requisição";
        if (error.response?.status === 404 && errorMessage.includes("E-mail não registrado")) {
          router.push("/inscrevase");
          return;
        }
      }
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  async function verifyCode(email: string, code: string) {
    try {
      setLoading(true);
      const response = await Api.post("/autenticacao/login", { email, codigo: code });
      const { accessToken, refreshToken } = response.data;

      setCookie(undefined, "auth.token", accessToken, {
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
        secure: false,
        sameSite: "lax",
      });
      setCookie(undefined, "auth.refreshToken", refreshToken, {
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
        secure: false,
        sameSite: "lax",
      });

      Api.setAuthorizationHeader(accessToken);
      initializeToken(accessToken);

      const decoded = jwtDecode<DecodedToken>(accessToken);
      const id = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
      const decodedEmail = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"];
      const name = decoded["name"] || "Administrador";
      let empresaId = "";
      let empresaData = null;
      try {
        empresaData = await EmpresaService.fetchEmpresa();
        empresaId = empresaData?.id || "";
      } catch (error) {
        console.error("Erro ao buscar empresa:", error);
        signOut();
        throw error;
      }

      if (id) {
        setUser({
          id,
          name,
          email: decodedEmail || email,
          empresaId,
          empresa: {
            nome: empresaData.nome,
            email: empresaData.email,
            cpfCnpj: empresaData.cpfCnpj,
          },
          signOut,
        });
        setAuthStep("authenticated");
      } else {
        throw new Error("Token inválido: ID não encontrado");
      }

      const redirectTo = ["/login", "/inscrevase"].includes(pathname) ? "/fila?fromLogin=true" : pathname;
      if (router) {
        router.push(redirectTo);
      }

      onTokenUpdated(accessToken);
    } catch (error: any) {
      console.error("Erro ao verificar código:", error);
      throw new Error(axios.isAxiosError(error) ? error.response?.data?.message || "Código inválido" : "Erro ao verificar código");
    } finally {
      setLoading(false);
    }
  }

  function signOut() {
    destroyCookie(undefined, "auth.token", { path: "/" });
    destroyCookie(undefined, "auth.refreshToken", { path: "/" });
    Api.removeAuthorizationHeader();
    setUser(null);
    setEmail("");
    setAuthStep("email");
    if (pathname !== "/login") {
      router.push("/login");
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        email,
        setEmail,
        sendVerificationCode,
        verifyCode,
        authStep,
        setAuthStep,
        signOut,
        loading,
        refreshToken,
        onTokenUpdated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};