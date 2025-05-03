"use client";

import { createContext, useEffect, useState, useCallback } from "react";
import { setCookie, parseCookies, destroyCookie } from "nookies";
import { Api } from "@/api/api";
import { PublicApi, initializeToken } from "@/api/api";
import React from "react";
import axios from "axios";
import { useRouter, usePathname } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { fetchEmpresa } from "../components/services/empresaService";

type User = {
  id: string;
  name: string;
  email: string;
  empresaId: string;
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

  const checkTokenValidity = useCallback(async () => {
    const { "auth.token": token } = parseCookies();
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        const currentTime = Math.floor(Date.now() / 1000);
        if (decoded.exp && decoded.exp < currentTime) {
          console.log("Token expirado, tentando renovar...");
          await refreshToken();
        } else if (!user) {
          // Só define o usuário se ainda não estiver definido
          const id = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
          const decodedEmail = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"];
          const name = decoded["name"] || "Administrador";
          let empresaId = "";
          try {
            const empresa = await fetchEmpresa();
            empresaId = empresa.id;
          } catch (error) {
            console.error("Erro ao buscar empresa:", error);
          }
          if (id) {
            setUser({
              id,
              name,
              email: decodedEmail || "",
              empresaId,
              signOut,
            });
            setAuthStep("authenticated");
          }
        }
      } catch (error) {
        console.error("Erro ao decodificar token:", error);
        signOut();
      }
    } else if (pathname !== "/login" && pathname !== "/inscrevase" && !["/fila", "/configuracoes", "/customAparencia", "/ativaWhatsapp", "/customizarMensagem", "/vinculaMonitor"].includes(pathname)) {
      console.log(`Token ausente e pathname inválido, redirecionando para /login desde ${pathname}`);
      router.push("/login");
    }
  }, [pathname, router, user]);

  const refreshToken = async (): Promise<TokenResponse> => {
    const { "auth.refreshToken": refreshTokenValue } = parseCookies();
    if (!refreshTokenValue) {
      console.error("Refresh token ausente, redirecionando para login");
      signOut();
      throw new Error("Refresh token ausente");
    }

    try {
      setLoading(true);
      const response = await PublicApi.post("/api/autenticacao/refresh-token", {
        refreshToken: refreshTokenValue,
      });
      const { accessToken, refreshToken: newRefreshToken } = response.data;

      console.log("Token renovado com sucesso:", { accessToken, newRefreshToken });

      setCookie(undefined, "auth.token", accessToken, {
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
        domain: "localhost",
        secure: false,
        sameSite: "lax",
      });
      setCookie(undefined, "auth.refreshToken", newRefreshToken, {
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
        domain: "localhost",
        secure: false,
        sameSite: "lax",
      });

      Api.setAuthorizationHeader(accessToken);
      initializeToken(accessToken);

      const decoded = jwtDecode<DecodedToken>(accessToken);
      const id = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
      const decodedEmail = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"];
      const name = decoded["name"] || "Administrador";

      if (id) {
        let empresaId = "";
        try {
          const empresa = await fetchEmpresa();
          empresaId = empresa.id;
        } catch (error) {
          console.error("Erro ao buscar empresa após refresh:", error);
        }

        setUser({
          id,
          name,
          email: decodedEmail || "",
          empresaId,
          signOut,
        });
      }

      return { accessToken, refreshToken: newRefreshToken };
    } catch (error) {
      console.error("Erro ao renovar token:", error);
      signOut();
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function loadUserFromCookies() {
      if (typeof window === "undefined") return;

      await checkTokenValidity();
      setLoading(false);
    }

    loadUserFromCookies();
    const interval = setInterval(checkTokenValidity, 60000); // Verifica a cada 1 minuto
    return () => clearInterval(interval);
  }, [checkTokenValidity]);

  useEffect(() => {
    checkTokenValidity();
  }, [pathname, checkTokenValidity]);

  async function sendVerificationCode(email: string) {
    try {
      setLoading(true);
      const response = await PublicApi.post("/autenticacao/gerar-codigo-acesso", { email });
      console.log("Resposta de gerar-codigo-acesso:", response.data);

      if (response.status !== 200) {
        throw new Error("Falha ao enviar código");
      }

      setEmail(email);
      setAuthStep("senha");
    } catch (error) {
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
      console.log("Enviando requisição para /autenticacao/login com email:", email, "e código:", code);
      const response = await Api.post("/autenticacao/login", { email, codigo: code });
      console.log("Resposta da API /autenticacao/login:", response.data);

      const { accessToken, refreshToken } = response.data;

      console.log("Salvando cookies...");
      setCookie(undefined, "auth.token", accessToken, {
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
        domain: "localhost",
        secure: false,
        sameSite: "lax",
      });
      setCookie(undefined, "auth.refreshToken", refreshToken, {
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
        domain: "localhost",
        secure: false,
        sameSite: "lax",
      });

      Api.setAuthorizationHeader(accessToken);
      initializeToken(accessToken);

      const decoded = jwtDecode<DecodedToken>(accessToken);
      const id = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
      const decodedEmail = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"];
      const name = decoded["name"] || "Administrador";

      console.log("Token decodificado:", { id, decodedEmail, name });

      if (id) {
        try {
          console.log("Buscando empresa...");
          const empresa = await fetchEmpresa();
          console.log("Empresa retornada:", empresa);
          if (!empresa || !empresa.id) {
            throw new Error("Empresa não encontrada");
          }
          const empresaId = empresa.id;

          setUser({
            id,
            name,
            email: decodedEmail || email,
            empresaId,
            signOut,
          });
          setAuthStep("authenticated");
          console.log("Usuário definido e authStep atualizado para authenticated");
        } catch (error) {
          console.error("Erro ao buscar empresa:", error);
          setUser({
            id,
            name,
            email: decodedEmail || email,
            empresaId: "",
            signOut,
          });
          setAuthStep("authenticated");
        }
      } else {
        console.log("ID não encontrado no token decodificado");
        throw new Error("Token inválido: ID não encontrado");
      }

      const redirectTo = ["/login", "/inscrevase"].includes(pathname) ? "/fila?fromLogin=true" : pathname;
      console.log(`Redirecionando para: ${redirectTo}`);
      router.push(redirectTo);
    } catch (error: any) {
      console.error("Erro ao verificar código:", error);
      let message = "Erro ao verificar código";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || "Código inválido";
      }
      throw new Error(message);
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
    router.push("/login");
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