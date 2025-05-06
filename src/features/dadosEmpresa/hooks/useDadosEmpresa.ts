import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/context/AuthContext";
import { EmpresaService } from "@/features/auth/components/services/empresaService";
import { atualizarEmpresa } from "@/features/dadosEmpresa/services/dadosEmpresaApi";
import { FormData } from "@/features/dadosEmpresa/types/typesEmpresa";

export function useDadosEmpresa(empresaId: string) {
  const { user, loading: loadingAuth } = useAuth();
  const [isValidEmpresa, setIsValidEmpresa] = useState<boolean>(false);
  const [loadingEmpresa, setLoadingEmpresa] = useState(true);

  useEffect(() => {
    const validateEmpresa = async () => {
      try {
        setLoadingEmpresa(true);
        if (!user?.empresa) {
          throw new Error("Nenhuma empresa associada ao usuário.");
        }
        const empresa = await EmpresaService.fetchEmpresa();
        if (empresa.id === empresaId) {
          setIsValidEmpresa(true);
        } else {
          throw new Error("A empresa não corresponde ao ID especificado.");
        }
      } catch (error: any) {
        toast.error(error.message || "Erro ao validar a empresa.");
        setIsValidEmpresa(false);
      } finally {
        setLoadingEmpresa(false);
      }
    };

    if (empresaId && user) {
      validateEmpresa();
    }
  }, [empresaId, user]);

  const saveEmpresa = async (data: FormData) => {
    if (!isValidEmpresa) return;

    try {
      await atualizarEmpresa(empresaId, data);
      toast.success("Dados da empresa atualizados com sucesso!");
    } catch (err) {
      toast.error("Erro ao atualizar dados da empresa.");
      console.error(err);
    }
  };

  const loading = loadingAuth || loadingEmpresa;

  return {
    loading,
    isValidEmpresa,
    saveEmpresa,
  };
}