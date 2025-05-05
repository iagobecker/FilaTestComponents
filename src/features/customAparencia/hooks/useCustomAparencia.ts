import { useState, useEffect, useRef } from "react";
import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { useDrag } from "@use-gesture/react";
import { useConfigPreview } from "@/lib/hooks/useConfigPreview";
import { toast } from "sonner";
import { atualizarConfiguracao, criarConfiguracao } from "@/features/configuracoes/services/ConfiguracoesService";
import { ConfiguracaoType } from "@/features/configuracoes/types/configTypes";

const DEFAULT_PRIMARY = "#4A90E2";
const DEFAULT_OVERLAY = "#FFFFFF";
const DEFAULT_FONT = "#000000";

export function useCustomAparencia(empresaId: string) {
  const { config, loading, uploadLogo } = useConfigPreview(empresaId);
  const [name, setName] = useState("");
  const [endereco, setEndereco] = useState<string>("");
  const [logo, setLogo] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null); 
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);
  const isSmallScreen = useMediaQuery("(max-width: 1190px)");
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [currentPreview, setCurrentPreview] = useState<"monitor" | "app">("monitor");
  const [primaryColor, setPrimaryColor] = useState(DEFAULT_PRIMARY);
  const [overlayColor, setOverlayColor] = useState(DEFAULT_OVERLAY);
  const [fontColor, setFontColor] = useState(DEFAULT_FONT);
  const [pickerOpen, setPickerOpen] = useState<"primary" | "overlay" | "font" | null>(null);
  const [isPickingColor, setIsPickingColor] = useState(false);
  const firstLoad = useRef(true);

  useEffect(() => {
    if (config && firstLoad.current) {
      setName(config.nomeDisplay || "");
      setEndereco(config.enderecoDisplay || "");
      setPrimaryColor(config.corPrimaria || DEFAULT_PRIMARY);
      setOverlayColor(config.corSobreposicao || DEFAULT_OVERLAY);
      setFontColor(config.corTexto || DEFAULT_FONT);
      setLogoUrl(config.logoUrl ?? null); 
      setLogo(null);
      firstLoad.current = false;
    }
  }, [config]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (isPickingColor) return;
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setPickerOpen(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("mouseup", () => setTimeout(() => setIsPickingColor(false), 200));
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPickingColor]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png"];
    if (!validTypes.includes(file.type)) {
      alert("Formato inválido. Use apenas JPG ou PNG.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Arquivo muito grande. Tamanho máximo: 2MB.");
      return;
    }

    setLogo(file);
    try {
      const url = await uploadLogo(file);
      setLogoUrl(url);
      toast.success("Logo enviada com sucesso!");
    } catch (err) {
      setLogo(null);
      setLogoUrl(null);
      toast.error("Erro ao fazer upload da logo");
    }
  };

  const resetColors = async () => {
    setPrimaryColor(DEFAULT_PRIMARY);
    setOverlayColor(DEFAULT_OVERLAY);
    setFontColor(DEFAULT_FONT);

    await new Promise((resolve) => setTimeout(resolve, 0));

    if (!config) return;

    const payload: ConfiguracaoType = {
      ...config,
      nomeDisplay: name,
      corPrimaria: DEFAULT_PRIMARY,
      corSobreposicao: DEFAULT_OVERLAY,
      logoUrl: logoUrl ?? undefined, // Converter null para undefined se necessário
      corTexto: DEFAULT_FONT,
      empresaId: config.empresaId,
      id: config.id,
      dataHoraCriado: config.dataHoraCriado,
      dataHoraAlterado: new Date().toISOString(),
      // dataHoraDeletado não precisa ser definido como null, pois já é opcional
    };

    try {
      if (config?.id) {
        await atualizarConfiguracao(payload);
      } else {
        await criarConfiguracao(payload);
      }
      toast.success("Cores redefinidas com sucesso!");
    } catch (err) {
      toast.error("Erro ao redefinir cores.");
      console.error(err);
    }
  };

  const togglePreview = (direction: "prev" | "next") => {
    setCurrentPreview((prev) =>
      direction === "next" ? (prev === "monitor" ? "app" : "monitor") : prev === "monitor" ? "app" : "monitor"
    );
  };

  const bind = useDrag(({ swipe: [swipeX] }) => {
    if (swipeX === -1) setCurrentPreview("app");
    else if (swipeX === 1) setCurrentPreview("monitor");
  });

  const saveConfig = async () => {
    if (!config) return;

    const payload: ConfiguracaoType = {
      ...config,
      nomeDisplay: name,
      enderecoDisplay: endereco,
      corPrimaria: primaryColor,
      corSobreposicao: overlayColor,
      logoUrl: logoUrl ?? undefined, // Converter null para undefined se necessário
      corTexto: fontColor,
      empresaId: config.empresaId,
      id: config.id,
      dataHoraCriado: config.dataHoraCriado,
      dataHoraAlterado: new Date().toISOString(),
      // dataHoraDeletado não precisa ser definido como null, pois já é opcional
    };

    try {
      if (config?.id) {
        await atualizarConfiguracao(payload);
      } else {
        await criarConfiguracao(payload);
      }
      toast.success("Customizações salvas com sucesso!");
    } catch (err) {
      toast.error("Erro ao salvar customização.");
      console.error(err);
    }
  };

  return {
    name,
    setName,
    endereco,
    setEndereco,
    logo,
    setLogo,
    logoUrl,
    setLogoUrl,
    fileInputRef,
    pickerRef,
    isSmallScreen,
    showPreviewModal,
    setShowPreviewModal,
    currentPreview,
    setCurrentPreview,
    primaryColor,
    setPrimaryColor,
    overlayColor,
    setOverlayColor,
    fontColor,
    setFontColor,
    pickerOpen,
    setPickerOpen,
    isPickingColor,
    setIsPickingColor,
    handleFileChange,
    resetColors,
    togglePreview,
    bind,
    saveConfig,
    config,
    loading,
  };
}