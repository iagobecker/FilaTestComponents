'use client';

import { createContext, useEffect, useState } from "react";
import { setCookie, parseCookies, destroyCookie } from 'nookies'
import Router from 'next/router'
import { Api } from '@/api/api'
import React from "react";
import axios from "axios";

type User = {
    id: string;
    name: string;
    email: string;
    signOut: () => void;
}

type SignInData = {
    email: string;
    password: string;
}

type AuthContextType = {
    isAuthenticated: boolean;
    user: User | null;
    signIn: (data: { email: string; code: string }) => Promise<void>;
    sendVerificationCode: (email: string) => Promise<void>;
    loading: boolean;
    authStep: 'email' | 'code' | 'authenticated';
    setAuthStep: (step: 'email' | 'code' | 'authenticated') => void;
    signOut: () => void;
}

export const AuthContext = createContext({} as AuthContextType)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [authStep, setAuthStep] = useState<'email' | 'code' | 'authenticated'>('email');

    const isAuthenticated = !!user;

    useEffect(() => {
        async function loadUserFromCookies() {
            const { 'auth.token': token } = parseCookies()

            if (token) {
                try {
                    Api.setAuthorizationHeader(token)
                    // Adapte esta chamada para API
                    const userInfo = await Api.get('/auth/me')
                    if (userInfo.data) {
                        setUser(userInfo.data)
                    }
                } catch (error) {
                    console.error('Failed to load user', error)
                    signOut()
                }
            }
            setLoading(false)
        }
        loadUserFromCookies()
    }, [])

   // AuthContext.tsx
async function sendVerificationCode(email: string) {
    try {
      setLoading(true);
      const response = await Api.post('/auth/send-code', { email });
      if (response.status !== 200) {
        throw new Error('Falha ao enviar código');
      }
      setAuthStep('code');
    } catch (error) {
      let errorMessage = 'Erro ao enviar código';
      
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || 
                      error.message || 
                      'Erro desconhecido na requisição';
      }
      
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

    async function signIn({ email, code }: { email: string; code: string }) {
        try {
            setLoading(true);
            const response = await Api.post('/auth/verify-code', { email, code });
            const { token, user } = response.data;

            setCookie(undefined, 'auth.token', token, {
                maxAge: 60 * 60 * 24 * 7, // 1 semana
                path: '/',
            });

            Api.setAuthorizationHeader(token);
            setUser(user);
            setAuthStep('authenticated');
            Router.push('/dashboard');
        } catch (error) {
            console.error('Login failed', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    function signOut() {
        destroyCookie(undefined, 'auth.token', { path: '/' })
        Api.removeAuthorizationHeader()
        setUser(null)
        Router.push('/login')
    }

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            signIn,
            sendVerificationCode,
            authStep,
            setAuthStep,
            signOut,

            loading
        }}>
            {children}
        </AuthContext.Provider>
    )
}

// Hook para usar o contexto
export const useAuth = () => {
    const context = React.useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}