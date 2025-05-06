import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useDadosEmpresa } from "./useDadosEmpresa";
import { FormData, formSchema } from "@/features/dadosEmpresa/types/typesEmpresa";

export function useDadosEmpresaForm(empresaId: string) {
  const { user, loading: loadingAuth } = useAuth();
  const { loading: loadingEmpresa, isValidEmpresa, saveEmpresa } = useDadosEmpresa(empresaId);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (!loadingAuth && user?.empresa) {
      reset({
        nomeEmpresa: user.empresa.nome || "",
        email: user.empresa.email || "",
        cpfCnpj: user.empresa.cpfCnpj || "",
        redefinirEmail: user.empresa.email || "",
      });
    } else if (!loadingAuth) {
      reset({
        nomeEmpresa: "",
        email: "",
        cpfCnpj: "",
        redefinirEmail: "",
      });
    }
  }, [user, loadingAuth, reset]);

  const onSubmit = async (data: FormData) => {
    await saveEmpresa(data);
  };

  const loading = loadingAuth || loadingEmpresa;

  return {
    register,
    handleSubmit,
    errors,
    loading,
    onSubmit,
    isValidEmpresa,
  };
}