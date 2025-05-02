"use client";

import { createContext, useEffect, useState } from "react";
import { setCookie, parseCookies, destroyCookie } from "nookies";
import { Api, PublicApi, initializeToken } from "@/api/api";
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
  [key: string]: any;
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

  useEffect(() => {
    async function loadUserFromCookies() {
      if (typeof window === "undefined") return;

      const { "auth.token": token } = parseCookies();

      if (token) {
        console.log("Token encontrado nos cookies:", token);
        initializeToken(token);
        try {
          Api.setAuthorizationHeader(token);
          const decoded = jwtDecode<DecodedToken>(token);
          const id = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
          const decodedEmail = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"];
          const name = decoded["name"] || "Administrador";

          if (!id) return;

          const empresa = await fetchEmpresa();
          const empresaId = empresa.id;

          setUser({
            id,
            name,
            email: decodedEmail || "",
            empresaId,
            signOut,
          });
          setAuthStep("authenticated");

          // Redireciona para /fila apenas se estiver na página de login
          if (pathname === "/login") {
            console.log("Redirecionando para /fila após login");
            router.push("/fila?fromLogin=true");
          }
        } catch (error) {
          console.error("Erro ao carregar usuário dos cookies:", error);
          signOut();
        }
      }
      setLoading(false);
    }

    loadUserFromCookies();
  }, [pathname]);

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
      });

      setCookie(undefined, "auth.refreshToken", refreshToken, {
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      });

      Api.setAuthorizationHeader(accessToken);

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

      console.log("Redirecionando para /fila...");
      router.push("/fila?fromLogin=true");
      console.log("Redirecionamento chamado");
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