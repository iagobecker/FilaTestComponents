'use client';

import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/button';
import LogoCervantes from '@/assets/images/LogoCervantes.jpg';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/features/auth/context/AuthContext';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const emailSchema = z.object({
  email: z.string().email('Digite um e-mail válido'),
});

const codeSchema = z.object({
  code: z.string().min(6, 'O código deve ter 6 dígitos').max(6, 'O código deve ter 6 dígitos'),
});

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const { sendVerificationCode, verifyCode, loading, authStep, setAuthStep, email, setEmail } = useAuth();
  const [canResend, setCanResend] = useState(true);
  const [countdown, setCountdown] = useState(0);

  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: email || '' }, // Inicializa com o email do contexto
  });

  const codeForm = useForm<z.infer<typeof codeSchema>>({
    resolver: zodResolver(codeSchema),
    defaultValues: { code: '' },
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
      setCanResend(false);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  async function handleSendCode(values: z.infer<typeof emailSchema>) {
    try {
      console.log('Enviando e-mail para gerar código:', values.email);
      await sendVerificationCode(values.email);
      setCountdown(30);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao enviar o código';
      emailForm.setError('root', { message: errorMessage });
    }
  }

  async function handleVerifyCode(values: z.infer<typeof codeSchema>) {
    if (!email) {
      codeForm.setError('root', { message: 'Por favor, envie o código de acesso primeiro.' });
      return;
    }
    try {
      console.log('Verificando código com e-mail:', email, 'e código:', values.code);
      await verifyCode(email, values.code);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao verificar código';
      codeForm.setError('root', { message: errorMessage });
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value); // Atualiza o email no contexto
    emailForm.setValue('email', e.target.value);
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <div className="flex flex-col items-center gap-2">
        <div className="flex flex-col items-center gap-2 font-medium">
          <div className="items-center justify-center rounded-md">
            <Image src={LogoCervantes} alt="Logo" className="size-15 rounded-md" width={60} height={60} />
          </div>
          <span className="sr-only">Controle de fila</span>
        </div>
        <h1 className="text-xl font-bold">Bem vindo(a) ao Controla de Fila</h1>
      </div>

      {authStep === 'email' && (
        <Form {...emailForm}>
          <form onSubmit={emailForm.handleSubmit(handleSendCode)}>
            <div className="flex flex-col gap-6">
              <FormField
                control={emailForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <input
                        type="email"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="seu@email.com"
                        {...field}
                        onChange={(e) => handleEmailChange(e)}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                //disabled={loading || !emailForm.formState.isValid}
                aria-busy={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Enviar código
              </Button>
              {emailForm.formState.errors.root && (
                <div className="text-red-500 text-sm">
                  {emailForm.formState.errors.root.message}
                  {emailForm.formState.errors.root?.message?.includes('E-mail não registrado') && (
                    <span>
                      {' '}
                      <Link href="/inscrevase" className="underline">
                        Clique aqui para se registrar.
                      </Link>
                    </span>
                  )}
                </div>
              )}
            </div>
          </form>
        </Form>
      )}

      {authStep === 'senha' && (
        <Form {...codeForm}>
          <form onSubmit={codeForm.handleSubmit(handleVerifyCode)} className="space-y-6">
            <div className="text-center">
              <p className="font-semibold break-words">{email || 'E-mail não informado'}</p>
            </div>
            <FormField
              control={codeForm.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código de acesso</FormLabel>
                  <FormControl>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="123456"
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {!canResend && (
              <div className="text-center text-sm text-muted-foreground">
                Você pode solicitar um novo código em {countdown} segundos
              </div>
            )}
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setAuthStep('email')}
                disabled={loading}
              >
                Voltar
              </Button>
              <Button
                type="submit"
                className="w-full"
                disabled={loading || !email}
                aria-busy={loading}
              >
                {loading && <Loader2 className="md: col-auto mr-2 h-4 w-4 animate-spin" />}
                Verificar código
              </Button>
            </div>
            {canResend && (
              <Button
                type="button"
                variant="link"
                onClick={() => {
                  sendVerificationCode(email);
                  setCountdown(30);
                }}
                disabled={loading || !email}
                className="w-full"
              >
                Reenviar código
              </Button>
            )}
            {codeForm.formState.errors.root && (
              <div className="text-red-500 text-sm text-center">{codeForm.formState.errors.root.message}</div>
            )}
          </form>
        </Form>
      )}

      <div className="text-center text-sm">
        Não tem conta?{' '}
        <Link href="/inscrevase" className="underline underline-offset-4">
          Inscreva-se
        </Link>
      </div>
    </div>
  );
}