import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/context/AuthContext";
import { criarVinculacao, fetchEmpresa } from "@/features/vinculacao-monitor/services/vinculacaoMonitorApi";
import { Empresa, VinculacaoData } from "@/features/vinculacao-monitor/types/typesVincular";

export function useVinculacaoMonitor(empresaId: string, filaId: string) {
  const router = useRouter();
  const { user } = useAuth();
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [digitado, setDigitado] = useState("");
  const [resposta, setResposta] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function buscarEmpresa() {
      try {
        setLoading(true);

        // Validar se o empresaId da URL corresponde ao do usuário autenticado
        if (!user?.empresaId || user.empresaId !== empresaId) {
          setResposta("ID da empresa na URL não corresponde ao usuário autenticado.");
          return;
        }

        const data = await fetchEmpresa();
        setEmpresa(data);

        const fila = data.filas?.find((f: { id: string }) => f.id === filaId);
        if (!fila) {
          setResposta("Fila não encontrada para esta empresa.");
          return;
        }

      } catch (err: any) {
        console.error("Erro ao buscar empresa:", err);
        setResposta(err.message || "Erro ao carregar empresa. Verifique sua autenticação.");
      } finally {
        setLoading(false);
      }
    }

    buscarEmpresa();
  }, [empresaId, filaId, user]);

  const handleVincular = async () => {
    if (!empresa) {
      setResposta("Empresa não carregada.");
      return;
    }

    if (!digitado) {
      setResposta("Por favor, insira o código de 4 dígitos.");
      return;
    }

    // Validação para garantir que o código seja alfanumérico e tenha 4 caracteres
    if (!/^[A-Z0-9]{4}$/.test(digitado)) {
      setResposta("O código deve conter exatamente 4 caracteres alfanuméricos (ex.: 6JV7).");
      return;
    }

    try {
      const vinculacaoData: VinculacaoData = {
        Codigo: digitado,
        filaId,
        observacao: "Vinculação do monitor",
      };

      console.log("Enviando payload para criar vinculação:", vinculacaoData);

      await criarVinculacao(vinculacaoData);

      setResposta("Vinculado!");
      console.log("Redirecionando para /customizar-aparencia/", empresaId);
      setTimeout(() => {
        router.push(`/customizar-aparencia/${empresaId}`);
      }, 2500);
    } catch (err: any) {
      console.error("Erro ao vincular:", err);
      setResposta(err.message || "Erro ao Vincular.");
    }
  };


  return {
    empresa,
    digitado,
    setDigitado,
    resposta,
    setResposta,
    handleVincular,
    loading,
  };
}