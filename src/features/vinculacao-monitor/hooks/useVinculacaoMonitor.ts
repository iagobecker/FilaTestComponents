import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "@/features/auth/context/AuthContext";
import { criarVinculacao, fetchEmpresa, vincular } from "@/features/vinculacao-monitor/services/vinculacaoMonitorApi";
import { Empresa, VinculacaoData, VinculacaoPayload } from "@/features/vinculacao-monitor/types/typesVincular";
import { criarWebSocketVinculacao } from "@/lib/wsClient";

export function useVinculacaoMonitor(empresaId: string) {
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
        } catch (err: any) {
          console.error("Erro ao buscar empresa:", err);
          setResposta(err.message || "Erro ao carregar empresa. Verifique sua autenticação.");
        } finally {
          setLoading(false);
        }
      }
  
      buscarEmpresa();
    }, [empresaId, user]);
  
    const handleVincular = async () => {
      if (!empresa) {
        setResposta("Empresa não carregada.");
        return;
      }
  
      if (!digitado) {
        setResposta("Por favor, insira o código de 4 dígitos.");
        return;
      }
  
      try {
        const payload: VinculacaoPayload = {
          Aplicativo: 2,
          Codigo: digitado,
          CpfCnpj: empresa.cpfCnpj,
          NomeEmpresa: empresa.nome,
          AplicativoVinculado: 4,
          Host: null,
          Porta: null,
          IdCliente: 0,
          Detalhes: {},
        };
  
        console.log("Enviando payload para vinculação:", payload);
  
        const resultado = await vincular(payload);
        const idVinculacaoAplicativo = resultado?.idVinculacaoAplicativo;
        const filaId = empresa.filas?.[0]?.id;
  
        if (!idVinculacaoAplicativo || !empresaId || !filaId) {
          setResposta("Faltam dados para vincular o monitor.");
          return;
        }
  
        const now = new Date().toISOString();
  
        const vinculacaoData: VinculacaoData = {
          id: uuidv4(),
          dataHoraCriado: now,
          dataHoraAlterado: now,
          dataHoraDeletado: null,
          idVinculacao: idVinculacaoAplicativo,
          empresaId,
          filaId,
        };
  
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