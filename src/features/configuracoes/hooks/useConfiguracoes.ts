import { useState, useEffect } from "react";
import { useAuth } from "@/features/auth/context/AuthContext";
import { getConfiguracaoByEmpresaId } from "../services/ConfiguracoesService";
import { Configuracao, Fila } from "@/features/auth/components/services/empresaService";
import { fetchEmpresa } from "../services/configuracoesApi";

export function useConfiguracoes() {
  const { user, isAuthenticated, loading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState<Configuracao | null>(null);
  const [filas, setFilas] = useState<Fila[]>([]);

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

        const empresa = await fetchEmpresa();
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

  return { user, isAuthenticated, loading, config, filas, error };
}