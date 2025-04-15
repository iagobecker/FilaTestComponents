'use client';

import { createContext, useEffect, useState } from 'react';
import { setCookie, parseCookies, destroyCookie } from 'nookies';
import { Api, initializeToken } from '@/api/api';
import React from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';



type User = {
  id: string;
  name: string;
  email: string;
  signOut: () => void;
};

type DecodedToken = {
  sub?: string;
  name?: string;
  email?: string;
  [key: string]: any;
}


type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  signIn: (data: { email: string; senha: string }) => Promise<void>;
  sendVerificationCode: (email: string) => Promise<void>;
  loading: boolean;
  authStep: 'email' | 'senha' | 'authenticated';
  setAuthStep: (step: 'email' | 'senha' | 'authenticated') => void;
  signOut: () => void;
};

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [authStep, setAuthStep] = useState<'email' | 'senha' | 'authenticated'>('email');
  const router = useRouter();
  const isAuthenticated = !!user;


  useEffect(() => {
    async function loadUserFromCookies() {
      const { 'auth.token': token } = parseCookies();

      if (token) {
        initializeToken(token);

        try {
          Api.setAuthorizationHeader(token);
          const decoded = jwtDecode<DecodedToken>(token);
          const id = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
          const decodedEmail = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"];
          const name = decoded["name"] || "Administrador";

          if (!id || !decodedEmail) {
            return;
          }

          setUser({
            id,
            name,
            email: decodedEmail,
            signOut,
          });

          setAuthStep('authenticated');
        } catch (error: any) {
          if (axios.isAxiosError(error) && error.response?.status === 401) {
            signOut();
          }
        }
      }

      setLoading(false);
    }

    loadUserFromCookies();
  }, []);



  async function sendVerificationCode(email: string) {
    try {
      setLoading(true);
      const response = await axios.post('http://10.0.0.128:5135/api/empresas/login', {
        email,
      });

      if (response.status !== 200) {
        throw new Error('Falha ao enviar código');
      }

      setAuthStep('senha');
    } catch (error) {
      let errorMessage = 'Erro ao enviar código';

      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.message || 'Erro desconhecido na requisição';
      }

      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  async function signIn({ email, senha }: { email: string; senha: string }) {
    try {
      setLoading(true);

      const response = await Api.post('/empresas/login', { email, senha });
      const { token } = response.data;

      setCookie(undefined, 'auth.token', token, {
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      });

      Api.setAuthorizationHeader(token);

      const decoded = jwtDecode<DecodedToken>(token);
      const id = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
      const decodedEmail = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"];

      const name = decoded["name"] || "Administrador";

      if (id && decodedEmail) {
        setUser({
          id,
          name,
          email: decodedEmail,
          signOut,
        });
        setAuthStep('authenticated');
      } else {
        console.warn("Token válido, mas não contém id ou email.");
      }
      router.push('/fila');
    } catch (error: any) {
      let message = 'Erro ao fazer login';

      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || 'Credenciais inválidas';
      }

      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }

  function signOut() {
    destroyCookie(undefined, 'auth.token', { path: '/' });
    Api.removeAuthorizationHeader();
    setUser(null);
    setAuthStep('email');
    router.push('/login');
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        signIn,
        sendVerificationCode,
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
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
