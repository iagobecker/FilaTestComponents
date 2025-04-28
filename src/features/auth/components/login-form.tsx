'use client'

import { cn } from "@/lib/utils/cn"
import { Button } from "@/components/ui/button"
import LogoCervantes from "@/assets/images/LogoCervantes.jpg"
import Image from "next/image"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useAuth } from "@/features/auth/context/AuthContext"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode"

interface DecodedToken {
    // Define the expected properties of the decoded token
    exp?: number;
    iat?: number;
    [key: string]: any;
}

const emailSchema = z.object({
    email: z.string().email("Digite um e-mail válido"),
    senha: z.string().min(4, "A senha deve ter pelo menos 4 caracteres")
});


const codeSchema = z.object({
    code: z.string().min(6, "O código deve ter 6 dígitos").max(6, "O código deve ter 6 dígitos")
});

export function LoginForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {

    // setAuthStep = definir etapa de autenticação
    const { signIn, sendVerificationCode, loading, authStep, setAuthStep } = useAuth();

    const [email, setEmail] = useState('');

    // controller para o botão de reenviar código
    const [canResend, setCanResend] = useState(true);
    const [countdown, setCountdown] = useState(0);

    // cria o formulário de email e senha com validacao zod e react-hook-form
    const emailForm = useForm<z.infer<typeof emailSchema>>({
        resolver: zodResolver(emailSchema),
        defaultValues: { email: "", senha: "" }
    });

    // formulário para o código de verificação
    const codeForm = useForm<z.infer<typeof codeSchema>>({
        resolver: zodResolver(codeSchema),
        defaultValues: { code: "" }
    });

    // decrementa o contador a cada segundo - habilita o botão de reenviar código
    useEffect(() => {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('token');
          if (token) {
            const decoded = jwtDecode<DecodedToken>(token);
          } else {
            console.error("Token not found");
          }
        }
      }, []);
      
    

    // chamado quando o usuário envia o formulário de email e senha
    async function handleLogin(values: z.infer<typeof emailSchema>) {
        try {
            // chama o sigin do AuthContext/ responsavel por salvar o token, redirecionar etc...
            await signIn({
                email: values.email,
                senha: values.senha,
            });
        } catch (error) {
            const errorMessage = error instanceof Error
                ? error.message
                : 'Erro inesperado ao tentar fazer login';

            emailForm.setError("root", {
                message: errorMessage,
            });
        }
    }



    // async function handleVerifyCode(values: z.infer<typeof codeSchema>) {
    //     try {
    //         await signIn({ email, senha: values.code });
    //     } catch (error) {
    //         if (error instanceof Error) {
    //             codeForm.setError("root", { message: error.message });
    //         }
    //     }
    // }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <div className="flex flex-col items-center gap-2">
                <div className="flex flex-col items-center gap-2 font-medium">
                    <div className="items-center justify-center rounded-md">
                        <Image
                            src={LogoCervantes}
                            alt="Logo"
                            className="size-15 rounded-md"
                            width={60}
                            height={60}
                        />
                    </div>
                    <span className="sr-only">Controle de fila</span>
                </div>
                <h1 className="text-xl font-bold">Bem vindo(a) ao Controla de Fila</h1>
            </div>

            {/* Renderiza o formlário de email/senha apenas se authStep for "email" */}
            {authStep === 'email' && (
                <Form {...emailForm}>
                    <form onSubmit={emailForm.handleSubmit(handleLogin)}>
                        <div className="flex flex-col gap-6">
                            {/* Campos do formulário conectados ao useForm */}
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
                                                disabled={loading || false}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={emailForm.control}
                                name="senha"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Senha</FormLabel>
                                        <FormControl>
                                            <input
                                                type="password"
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                placeholder="Digite sua senha"
                                                {...field}
                                                disabled={loading}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                        {/* Ao clicar, chama "lidando com Envio" (handleLogin) */}
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={loading}
                                aria-busy={loading}
                            >
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Entrar
                            </Button>

                            {emailForm.formState.errors.root && (
                                <div className="text-red-500 text-sm">
                                    {emailForm.formState.errors.root.message}
                                </div>
                            )}

                        </div>
                    </form>
                </Form>
            )}

            {authStep === 'senha' && (
                <>
                    <div className="text-center">                       
                        <p className="font-semibold">{email}</p>
                    </div>

                    <Form {...codeForm}>
                        <form onSubmit={emailForm.handleSubmit(handleLogin)}>
                            <div className="flex flex-col gap-6">
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

                                <div className="flex gap-2">
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
                                        disabled={loading}
                                        aria-busy={loading}
                                    >
                                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Verificar código
                                    </Button>
                                </div>

                                {canResend && (
                                    <Button
                                        type="button"
                                        variant="link"
                                        onClick={() => sendVerificationCode(email)}
                                        disabled={loading}
                                        className="w-full"
                                    >
                                        Reenviar código
                                    </Button>
                                )}
                            </div>
                        </form>
                    </Form>
                </>
            )}

            <div className="text-center text-sm">
                Problemas com o acesso?{" "}
                <Link href="/login" className="underline underline-offset-4">
                    Clique aqui
                </Link>
            </div>
        </div>
    )
}