"use client";

import { createContext, useEffect, useState, useCallback } from "react";
import { setCookie, parseCookies, destroyCookie } from "nookies";
import { Api, PublicApi, initializeToken } from "@/api/api";
import React from "react";
import axios from "axios";
import { useRouter, usePathname } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { EmpresaService } from "@/features/auth/components/services/empresaService"; // Ajustado para usar EmpresaService

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
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    async function loadUserFromCookies() {
      if (typeof window === "undefined") return; // 👈 impede execução no SSR
  
      const { 'auth.token': token } = parseCookies();
  
      if (token) {
        initializeToken(token);
  
        try {
          Api.setAuthorizationHeader(token);
          const decoded = jwtDecode<DecodedToken>(token);
          const id = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
          const decodedEmail = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"];
          const name = decoded["name"] || "Administrador";
  
          if (!id || !decodedEmail) return;
  
          setUser({
            id,
            name,
            email: decodedEmail,
            signOut,
          });
  
          setAuthStep("authenticated");
        } catch (error: any) {
          if (axios.isAxiosError(error) && error.response?.status === 401) {
            signOut();
          }
        }
      }
  
      setLoading(false);
    }
    loadUserFromCookies();
    const interval = setInterval(checkTokenValidity, 300000);
    return () => clearInterval(interval);
  }, [checkTokenValidity]);

  async function sendVerificationCode(email: string) {
    try {
      setLoading(true);
      const response = await PublicApi.post("/autenticacao/gerar-codigo-acesso", { email });
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

      if (id) {
        let empresaId = "";
        try {
          const empresaData = await EmpresaService.fetchEmpresa(); // Ajustado para EmpresaService.fetchEmpresa
          empresaId = empresaData?.id || "";
        } catch (error) {
          console.error("Erro ao buscar empresa:", error);
        }

        setUser({
          id,
          name,
          email: decodedEmail || email,
          empresaId,
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