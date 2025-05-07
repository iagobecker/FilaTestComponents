// src/features/auth/components/form/inscrevase-form.tsx
"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import LogoCervantes from "@/assets/images/LogoCervantes.jpg";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils/cn";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/context/AuthContext";
import { Api } from "@/api/api";

// Função para limpar CPF/CNPJ (remove tudo que não for dígito)
const cleanCpfCnpj = (value: string) => {
  return value.replace(/[^\d]/g, "");
};

// Função para formatar CPF/CNPJ
const formatCpfCnpj = (value: string) => {
  const cleanValue = cleanCpfCnpj(value);
  if (cleanValue.length <= 11) {
    // Formato CPF: 999.999.999-99
    return cleanValue
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .substring(0, 14); // Limita a 14 caracteres (999.999.999-99)
  } else {
    // Formato CNPJ: 99.999.999/9999-99
    return cleanValue
      .replace(/(\d{2})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1/$2")
      .replace(/(\d{4})(\d{1,2})/, "$1-$2")
      .substring(0, 18); // Limita a 18 caracteres (99.999.999/9999-99)
  }
};

// Função para validar CPF ou CNPJ (apenas comprimento dos dígitos)
const validateCpfCnpj = (value: string) => {
  const cleanValue = cleanCpfCnpj(value);
  if (cleanValue.length === 11) {
    return /^\d{11}$/.test(cleanValue);
  } else if (cleanValue.length === 14) {
    return /^\d{14}$/.test(cleanValue);
  }
  return false;
};

// Schema para a primeira etapa (Nome, E-mail, CPF/CNPJ)
const companySchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
  cpfCnpj: z
    .string()
    .min(11, "CPF/CNPJ inválido")
    .refine(validateCpfCnpj, "CPF/CNPJ deve ter 11 (CPF) ou 14 (CNPJ) dígitos"),
});

// Schema para a segunda etapa (Código)
const codeSchema = z.object({
  code: z.string().min(6, "O código deve ter 6 dígitos").max(6, "O código deve ter 6 dígitos"),
});

type CompanyFormData = z.infer<typeof companySchema>;
type CodeFormData = z.infer<typeof codeSchema>;

export function InscrevaseForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const { sendRegistrationCode, setAuthStep, loading } = useAuth();
  const [step, setStep] = useState<"company" | "code">("company"); // Controla a etapa do formulário
  const [companyData, setCompanyData] = useState<CompanyFormData | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  // Formulário para Nome, E-mail e CPF/CNPJ
  const companyForm = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      nome: "",
      email: "",
      cpfCnpj: "",
    },
  });

  // Formulário para o Código
  const codeForm = useForm<CodeFormData>({
    resolver: zodResolver(codeSchema),
    defaultValues: {
      code: "",
    },
  });

  // Função para enviar o código de cadastro
  const handleSendCode = async (data: CompanyFormData) => {
    setErro(null);
    try {
      setCompanyData(data);
      await sendRegistrationCode(data.email);
      setStep("code");
    } catch (err: any) {
      console.error("❌ Erro ao enviar código:", err);
      setErro(err.message || "Falha ao enviar código. Tente novamente.");
    }
  };

  // Função para cadastrar a empresa
  const handleVerifyCode = async (data: CodeFormData) => {
    if (!companyData) {
      setErro("Dados da empresa não encontrados. Volte e preencha novamente.");
      return;
    }

    setErro(null);
    try {
      // Cadastra a empresa com o código
      const now = new Date().toISOString();
      const cleanedCpfCnpj = cleanCpfCnpj(companyData.cpfCnpj);
      const empresaPayload = {
        nome: companyData.nome,
        email: companyData.email,
        cpfCnpj: cleanedCpfCnpj,
        dataHourCreated: now,
        dataHourUpdated: now,
        dataHourDeleted: null,
      };

      const payload = {
        Empresa: empresaPayload,
        codigo: data.code, // Coloca o código no nível raiz do payload
      };

      console.log("Enviando payload para /api/empresas:", payload);
      const res = await Api.post("/empresas", payload);
      console.log("Resposta de /api/empresas:", res);

      if (res.status === 201) {
        setSuccess(true);
        // Reseta o authStep para 'email' antes de redirecionar para /login
        setAuthStep("email");
        setTimeout(() => router.push("/login"), 2000);
      } else {
        throw new Error("Falha ao cadastrar empresa");
      }
    } catch (err: any) {
      console.error("❌ Erro ao cadastrar empresa:", err);
      setErro(err.message || "Falha ao cadastrar empresa. Verifique o código e tente novamente.");
    }
  };

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Função para formatar o CPF/CNPJ ao digitar
  const handleCpfCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCpfCnpj(e.target.value);
    companyForm.setValue("cpfCnpj", formattedValue, { shouldValidate: true });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {step === "company" && (
        <form onSubmit={companyForm.handleSubmit(handleSendCode)} className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <a href="#" className="flex flex-col items-center gap-2 font-medium">
              <Image src={LogoCervantes} alt="Logo" className="w-20 h-20 rounded-md" />
              <span className="sr-only">Controle de fila</span>
            </a>
            <h1 className="text-xl font-bold">Bem vindo(a) ao Controle de Fila</h1>
            <div className="text-center text-sm">
              Já tem uma conta?{" "}
              <a href="/login" className="underline underline-offset-4">
                Entrar
              </a>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <label htmlFor="nome">Nome</label>
              <Input id="nome" placeholder="Nome da empresa" {...companyForm.register("nome")} />
              {companyForm.formState.errors.nome && (
                <p className="text-xs text-red-500">{companyForm.formState.errors.nome.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <label htmlFor="email">Email</label>
              <Input id="email" type="email" placeholder="m@exemplo.com" {...companyForm.register("email")} />
              {companyForm.formState.errors.email && (
                <p className="text-xs text-red-500">{companyForm.formState.errors.email.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <label htmlFor="cpfCnpj">CPF/CNPJ</label>
              <Input
                id="cpfCnpj"
                placeholder="Digite seu CPF ou CNPJ"
                {...companyForm.register("cpfCnpj", {
                  onChange: handleCpfCnpjChange,
                })}
                disabled={loading}
              />
              {companyForm.formState.errors.cpfCnpj && (
                <p className="text-xs text-red-500">{companyForm.formState.errors.cpfCnpj.message}</p>
              )}
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? "Enviando..." : "Continuar"}
            </Button>

            {erro && <p className="text-sm text-red-500">{erro}</p>}
          </div>
        </form>
      )}

      {step === "code" && (
        <form onSubmit={codeForm.handleSubmit(handleVerifyCode)} className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <a href="#" className="flex flex-col items-center gap-2 font-medium">
              <Image src={LogoCervantes} alt="Logo" className="w-20 h-20 rounded-md" />
              <span className="sr-only">Controle de fila</span>
            </a>
            <h1 className="text-xl font-bold">Verifique seu E-mail</h1>
            <p className="text-center text-sm">
              Insira o código de 6 dígitos enviado para <strong>{companyData?.email}</strong>.
            </p>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <label htmlFor="code">Código</label>
              <Input
                id="code"
                type="text"
                inputMode="numeric"
                placeholder="123456"
                {...codeForm.register("code")}
                disabled={loading}
              />
              {codeForm.formState.errors.code && (
                <p className="text-xs text-red-500">{codeForm.formState.errors.code.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => setStep("company")}
                disabled={loading}
              >
                Voltar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Verificando..." : "Confirmar"}
              </Button>
            </div>

            {erro && <p className="text-sm text-red-500">{erro}</p>}
            {success && (
              <p className="text-sm text-green-600">
                Empresa registrada com sucesso! Você será redirecionado para fazer login.
              </p>
            )}
          </div>
        </form>
      )}
    </div>
  );
}