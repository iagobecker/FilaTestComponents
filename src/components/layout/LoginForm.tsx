'use client';

import { cn } from "../../lib/utils/cn"
import { Button } from "@/components/ui/button"
import LogoCervantes from "@/assets/images/LogoCervantes.jpg"
import Image from "next/image"


export function LoginForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {
    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <form>
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col items-center gap-2">
                        <a
                            href="#"
                            className="flex flex-col items-center gap-2 font-medium"
                        >
                            <div className=" items-center justify-center rounded-md">
                                <Image
                                    src={LogoCervantes}
                                    alt="Logo"
                                    className="size-15 rounded-md"
                                />

                            </div>
                            <span className="sr-only">Controle de fila</span>
                        </a>
                        <h1 className="text-xl font-bold">Bem vindo(a) ao Controla de Fila</h1>
                        <div className="text-center text-sm">
                            Não tem uma conta?{" "}
                            <a href="/inscrevase" className="underline underline-offset-4">
                                Inscreva-se
                            </a>
                        </div>
                    </div>
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-2">
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="email"
                                placeholder="m@exemplo.com"
                                required
                            />
                        </div>

                    </div>
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-2">
                            <label htmlFor="password">Senha</label>
                            <input
                                id="password"
                                type="password"
                                placeholder="********"
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full">
                            Login
                        </Button>
                    </div>
                </div>
            </form>
            <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary  ">
                Ao clicar em continuar, você concorda com nossos <a href="#">Termos de serviço</a>{" "}
                e <a href="#">Política de Privacidade</a>.
            </div>
        </div>
    )
}
