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

const emailSchema = z.object({
    email: z.string().email("Digite um e-mail válido")
});

const codeSchema = z.object({
    code: z.string().min(6, "O código deve ter 6 dígitos").max(6, "O código deve ter 6 dígitos")
});

export function LoginForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {
    const { signIn, sendVerificationCode, loading, authStep, setAuthStep } = useAuth();
    const [email, setEmail] = useState('');
    const [canResend, setCanResend] = useState(true);
    const [countdown, setCountdown] = useState(0);

    const emailForm = useForm<z.infer<typeof emailSchema>>({
        resolver: zodResolver(emailSchema),
        defaultValues: { email: "" }
    });

    const codeForm = useForm<z.infer<typeof codeSchema>>({
        resolver: zodResolver(codeSchema),
        defaultValues: { code: "" }
    });

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [countdown]);


    async function handleSendCode(values: z.infer<typeof emailSchema>) {
        try {
            await sendVerificationCode(values.email);
            setEmail(values.email);
        } catch (error) {
            const errorMessage = error instanceof Error
                ? error.message
                : 'Ocorreu um erro inesperado';

            emailForm.setError("root", {
                message: errorMessage.includes('Network Error')
                    ? 'Não foi possível conectar ao servidor. Verifique sua conexão.'
                    : errorMessage
            });
        }
    }

    async function handleVerifyCode(values: z.infer<typeof codeSchema>) {
        try {
            await signIn({ email, code: values.code });
        } catch (error) {
            if (error instanceof Error) {
                codeForm.setError("root", { message: error.message });
            }
        }
    }

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
                                disabled={loading}
                                aria-busy={loading}
                            >
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Enviar código
                            </Button>
                        </div>
                    </form>
                </Form>
            )}

            {authStep === 'code' && (
                <>
                    <div className="text-center" aria-live="polite">
                        <p>Enviamos um código de 6 dígitos para</p>
                        <p className="font-semibold">{email}</p>
                    </div>

                    <Form {...codeForm}>
                        <form onSubmit={codeForm.handleSubmit(handleVerifyCode)}>
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
                <Link href="/ajuda" className="underline underline-offset-4">
                    Clique aqui
                </Link>
            </div>
        </div>
    )
}