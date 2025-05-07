"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/features/auth/context/AuthContext";
import { ConfigCard } from "@/features/configuracoes/components/ConfigCard";
import { HeaderConfiguracoes } from "@/features/configuracoes/components/HeaderConfiguracoes";
import { Palette, MessageCircle, Clock, MessageSquare, Monitor } from "lucide-react";
import { getConfiguracaoByEmpresaId } from "@/features/configuracoes/services/ConfiguracoesService";
import { Header } from "@/components/layout/Header";
import { PageContainer } from "@/components/layout/PageContainer";
import { DialogTempoMaximo } from "@/features/configuracoes/components/DialogTempoMaximo";
import { Configuracao, EmpresaService, Fila } from "@/features/auth/components/services/empresaService";

export default function ConfiguracoesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState<Configuracao | null>(null);
  const [filas, setFilas] = useState<Fila[]>([]);
  const { user, isAuthenticated, loading } = useAuth();

  useEffect(() => {
    async function loadConfigAndFilas() {
      if (!isAuthenticated || loading || !user?.empresaId) {
        console.log("Usuário não autenticado ou empresaId não encontrado");
        setError("Usuário não autenticado ou empresaId não encontrado.");
        return;
      }

      try {
        console.log("Carregando configurações...");
        const fetchedConfig = await getConfiguracaoByEmpresaId(user.empresaId);
        if (!fetchedConfig) {
          setError("Nenhuma configuração encontrada para esta empresa.");
          return;
        }
        if (fetchedConfig.id) {
          setConfig(fetchedConfig as Configuracao);
        } else {
          setError("Configuração inválida: ID ausente.");
        }
        console.log("Configurações carregadas:", fetchedConfig);

        const empresa = await EmpresaService.fetchEmpresa();
        if (empresa.filas && empresa.filas.length > 0) {
          setFilas(empresa.filas);
          console.log("Filas carregadas:", empresa.filas);
        } else {
          setError("Nenhuma fila encontrada para esta empresa.");
          console.log("Nenhuma fila encontrada.");
        }
      } catch (error: any) {
        console.error("Erro ao carregar configurações ou filas:", error);
        setError(error.message || "Falha ao carregar dados. Tente novamente.");
      }
    }

    loadConfigAndFilas();
  }, [isAuthenticated, loading, user?.empresaId]);

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (!isAuthenticated) {
    return <p>Por favor, faça login.</p>;
  }

  if (error) {
    return (
      <div>
        <Header />
        <PageContainer>
          <HeaderConfiguracoes />
          <p className="text-red-600">{error}</p>
        </PageContainer>
      </div>
    );
  }

  const filaId = filas.length > 0 ? filas[0].id : null;

  return (
    <>
      <Header />
      <PageContainer>
        <HeaderConfiguracoes />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <ConfigCard
            title="Customizar aparência"
            description="Personalize as cores do monitor de exibição para melhorar a experiência visual dos seus clientes."
            icon={<Palette className="size-6 text-blue-600" />}
            bgColor="bg-blue-100"
            borderColor="border-blue-200"
            href={user?.empresaId ? `/customizar-aparencia/${user.empresaId}` : "#"}
          />

          <ConfigCard
            title="Customizar mensagem"
            description="Crie mensagens personalizadas no WhatsApp para diferentes situações e melhore a comunicação com seus clientes."
            icon={<MessageSquare className="size-6 text-purple-600" />}
            bgColor="bg-purple-100"
            borderColor="border-purple-200"
            href={
              user?.empresaId && filaId
                ? `/customizar-mensagem/${user.empresaId}/${filaId}`
                : "#"
            }
            disabled={!filaId}
          />

          <ConfigCard
            title="Ativar WhatsApp"
            description="Vincule seu número para enviar notificações e atualizações da fila diretamente para os clientes."
            icon={<MessageCircle className="size-6 text-green-600" />}
            bgColor="bg-green-100"
            borderColor="border-green-200"
            href="/ativaWhatsapp"
          />

          <ConfigCard
            title="Ativar Monitor"
            description="Crie mensagens personalizadas no WhatsApp para diferentes situações e melhore a comunicação com seus clientes."
            icon={<Monitor className="size-6 text-cyan-600" />}
            bgColor="bg-cyan-100"
            borderColor="border-cyan-500"
            href={user?.empresaId ? `/vinculaMonitor/${user.empresaId}/${filaId}` : "#"}
          />

          <ConfigCard
            title="Tempo máximo"
            description="Configure o tempo máximo de tolerância após chamar seus clientes e otimize o fluxo de atendimento."
            icon={<Clock className="size-6 text-yellow-700" />}
            bgColor="bg-orange-100"
            borderColor="border-orange-200"
            onClick={() => setIsDialogOpen(true)}
          />
        </div>
      </PageContainer>

      <DialogTempoMaximo isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
    </>
  );
}