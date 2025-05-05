'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import LogoCervantes from '@/assets/images/LogoCervantes.jpg';
import { v4 as uuidv4 } from 'uuid';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils/cn';
import { useRouter } from 'next/navigation';
import { Api } from '@/api/api';

// Função para limpar CPF/CNPJ (remove tudo que não for dígito)
const cleanCpfCnpj = (value: string) => {
  return value.replace(/[^\d]/g, '');
};

// Função para formatar CPF/CNPJ
const formatCpfCnpj = (value: string) => {
  const cleanValue = cleanCpfCnpj(value);
  if (cleanValue.length <= 11) {
    // Formato CPF: 999.999.999-99
    return cleanValue
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .substring(0, 14); // Limita a 14 caracteres (999.999.999-99)
  } else {
    // Formato CNPJ: 99.999.999/9999-99
    return cleanValue
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d{1,2})/, '$1-$2')
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

const schema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('E-mail inválido'),
  cpfCnpj: z
    .string()
    .min(11, 'CPF/CNPJ inválido')
    .refine(validateCpfCnpj, 'CPF/CNPJ deve ter 11 (CPF) ou 14 (CNPJ) dígitos'),
});

type FormData = z.infer<typeof schema>;

export function InscrevaseForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: '',
      email: '',
      cpfCnpj: '',
    },
  });

  const [erro, setErro] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    setErro(null);
    const now = new Date().toISOString();
    const cleanedCpfCnpj = cleanCpfCnpj(data.cpfCnpj);
    const payload = {
      ...data,
      cpfCnpj: cleanedCpfCnpj,
      id: uuidv4(),
      dataHoraCriado: now,
      dataHoraAlterado: now,
      dataHoraDeletado: null,
    };

    try {
      const res = await Api.post('/empresas', payload);
      if (res.status === 201) {
        setSuccess(true);
        setTimeout(() => router.push('/login'), 2000);
      }
    } catch (err: any) {
      console.error('❌ Erro ao registrar:', err);
      setErro(
        err?.response?.data?.message || 'Falha ao registrar empresa. Verifique os dados e tente novamente.'
      );
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
    setValue('cpfCnpj', formattedValue, { shouldValidate: true });
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2">
          <a href="#" className="flex flex-col items-center gap-2 font-medium">
            <Image src={LogoCervantes} alt="Logo" className="w-20 h-20 rounded-md" />
            <span className="sr-only">Controle de fila</span>
          </a>
          <h1 className="text-xl font-bold">Bem vindo(a) ao Controle de Fila</h1>
          <div className="text-center text-sm">
            Já tem uma conta?{' '}
            <a href="/login" className="underline underline-offset-4">
              Entrar
            </a>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <label htmlFor="nome">Nome</label>
            <Input id="nome" placeholder="Nome da empresa" {...register('nome')} />
            {errors.nome && <p className="text-xs text-red-500">{errors.nome.message}</p>}
          </div>

          <div className="grid gap-2">
            <label htmlFor="email">Email</label>
            <Input id="email" type="email" placeholder="m@exemplo.com" {...register('email')} />
            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div className="grid gap-2">
            <label htmlFor="cpfCnpj">CPF/CNPJ</label>
            <Input
              id="cpfCnpj"
              placeholder="Digite seu CPF ou CNPJ"
              {...register('cpfCnpj', {
                onChange: handleCpfCnpjChange,
              })}
              disabled={isSubmitting}
            />
            {errors.cpfCnpj && <p className="text-xs text-red-500">{errors.cpfCnpj.message}</p>}
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Enviando...' : 'Continuar'}
          </Button>

          {erro && <p className="text-sm text-red-500">{erro}</p>}
          {success && <p className="text-sm text-green-600">Empresa registrada com sucesso!</p>}
        </div>
      </form>

      {/* <div className="text-center text-xs text-muted-foreground">
        Ao clicar em continuar, você concorda com nossos{' '}
        <a href="#" className="underline underline-offset-4">
          Termos de serviço
        </a>{' '}
        e{' '}
        <a href="#" className="underline underline-offset-4">
          Política de Privacidade
        </a>
        .
      </div> */}
    </div>
  );
}