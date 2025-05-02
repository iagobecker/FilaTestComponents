'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/context/AuthContext';
import { LoginForm } from '@/features/auth/components/form/login-form';

export default function LoginPage() {
  const { authStep, loading, isAuthenticated } = useAuth();
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Redireciona para /fila se o usuário já estiver autenticado
  useEffect(() => {
    if (isClient && isAuthenticated && !loading) {
      router.push('/fila?fromLogin=true');
    }
  }, [isClient, isAuthenticated, loading, router]);

  if (!isClient || loading) {
    return null; // Evita renderização até que o cliente esteja pronto
  }

  if (isAuthenticated) {
    return null; // Evita renderizar o formulário se o usuário já estiver autenticado
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-8">
        {authStep !== 'authenticated' && <LoginForm />}
      </div>
    </div>
  );
}