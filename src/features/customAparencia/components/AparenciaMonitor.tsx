import { useRef, useState, useEffect } from "react";
import { SketchPicker } from "react-color";
import { ChevronLeft, ChevronRight, Download, Eye, Image, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import CardMonitor from "./CardMonitor"
import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function AparenciaMonitor({ addEmpresa }: { addEmpresa: (nome: string) => void }) {
    const [name, setName] = useState("");
    const [logo, setLogo] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const pickerRef = useRef<HTMLDivElement>(null);
    const isSmallScreen = useMediaQuery("(max-width: 1190px)");
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [currentPreview, setCurrentPreview] = useState<"monitor" | "app">("monitor");

    // Valores padrão das cores
    const DEFAULT_PRIMARY = "#4A90E2";
    const DEFAULT_OVERLAY = "#FFFFFF";
    const DEFAULT_FONT = "#000000";

    // Estados para armazenar as cores escolhidas
    const [primaryColor, setPrimaryColor] = useState(DEFAULT_PRIMARY);
    const [overlayColor, setOverlayColor] = useState(DEFAULT_OVERLAY);
    const [fontColor, setFontColor] = useState(DEFAULT_FONT);

    // Função para redefinir cores
    const resetColors = () => {
        setPrimaryColor(DEFAULT_PRIMARY);
        setOverlayColor(DEFAULT_OVERLAY);
        setFontColor(DEFAULT_FONT);
    };


    // Controle dos seletores de cores
    const [pickerOpen, setPickerOpen] = useState<"primary" | "overlay" | "font" | null>(null);
    const [isPickingColor, setIsPickingColor] = useState(false);


    // Reseta `isPickingColor` quando o usuário solta o clique
    const handleMouseUp = () => {
        setTimeout(() => setIsPickingColor(false), 200);
    };

    // Fecha apenas quando o usuário clicar fora e não estiver escolhendo cor
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (isPickingColor) return;
            if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
                setPickerOpen(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("mouseup", handleMouseUp);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isPickingColor]);


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Verificar formato
        const validTypes = ['image/jpeg', 'image/png'];
        if (!validTypes.includes(file.type)) {
            alert('Formato inválido. Use apenas JPG ou PNG.');
            return;
        }

        // Verificar tamanho (2MB em bytes)
        if (file.size > 2 * 1024 * 1024) {
            alert('Arquivo muito grande. Tamanho máximo: 2MB.');
            return;
        }

        setLogo(file);
    };

    // Função para alternar entre os mockups
    const togglePreview = (direction: "prev" | "next") => {
        setCurrentPreview(prev => {
            if (direction === "next") return prev === "monitor" ? "app" : "monitor";
            return prev === "monitor" ? "app" : "monitor";
        });
    };

    return (
        <>
            <div className="flex flex-col lg:flex-row gap-4 p-2 md:p-4">
                <div className="flex-1 flex flex-col gap-4">
                    {/* Card - Dados da Empresa */}
                    <Card className="border-2 border-blue-200 pb-2 pt-2 max-w-full">
                        <CardHeader className="border-b border-blue-200 font-bold text-xl pb-1">
                            <div className="flex justify-between items-center">
                                <CardTitle>Dados da empresa</CardTitle>
                            </div>
                        </CardHeader>

                        <form className="space-y-4 p-2">
                            {/* Seção Logo com Preview ao lado */}
                            <div className="flex flex-col md:flex-row gap-4 items-center">
                                {/* Input para selecionar logo */}
                                <div className="w-full md:w-2/3">
                                    <label className="block text-sm font-medium mb-1">Logo</label>
                                    <div
                                        className="relative w-full h-10 rounded-md border border-gray-300 bg-white flex items-center justify-center px-3 cursor-pointer hover:bg-gray-50"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <div className="flex items-center gap-2">
                                            <Upload className="size-5 text-gray-700" />
                                            <span className="text-gray-700 text-sm md:text-md font-bold text-center">
                                                {logo ? "Logo selecionada" : "Escolher arquivo no seu computador"}
                                            </span>
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/jpeg, image/png"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Formatos aceitos: JPG, PNG. Tamanho máximo: 2MB
                                    </p>
                                </div>

                                {/* Preview da Logo */}
                                <div className="w-full md:w-1/3 flex justify-center">
                                    {logo ? (
                                        <img
                                            src={URL.createObjectURL(logo)}
                                            alt="Preview da logo"
                                            className="w-24 h-24 object-contain rounded-md border border-gray-300"
                                        />
                                    ) : (
                                        <div className="w-24 h-24 rounded-md bg-gray-100 border border-gray-300 flex items-center justify-center">
                                            <Image className="w-12 h-12 text-gray-400" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Campo Nome Fantasia */}
                            <div>
                                <label className="block text-sm font-medium mb-1">Nome fantasia</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Nome da empresa"
                                    required
                                    className="w-full h-10 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm px-3"
                                />
                            </div>
                        </form>
                    </Card>
                    {/* Card - Personalizar Cores */}
                    <Card className="border-2 border-blue-200 pb-1 pt-3 max-w-full ">
                        <CardHeader className="border-b border-blue-200 font-bold text-xl">
                            <CardTitle>Personalizar cores</CardTitle>
                            <CardDescription className="text-gray-400 font-normal w-[80%]">
                                Personalize as cores da sua empresa. <br />
                                Para as cores primária, secundária e da fonte, recomendamos que sejam utilizadas
                                cores com tom escuro para melhor visualização do sistema.
                            </CardDescription>
                        </CardHeader>

                        {/* Cores */}
                        <div className="py-1 flex-1 flex-col gap-0" ref={pickerRef}>
                            {/* Cor Primária */}
                            <div className="flex items-start pl-4 gap-4 relative w-full border-b border-blue-200 pb-4">
                                <Button
                                    type="button"
                                    className="w-12 h-12 border border-gray-300"
                                    style={{ backgroundColor: primaryColor }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setPickerOpen(pickerOpen === "primary" ? null : "primary");
                                    }}
                                />
                                {pickerOpen === "primary" && (
                                    <div className="absolute z-50 mt-2 bg-white shadow-lg p-2 rounded-md">
                                        <SketchPicker
                                            color={primaryColor}
                                            onChange={(color) => setPrimaryColor(color.hex)}
                                        />
                                    </div>
                                )}
                                <div className="flex flex-col">
                                    <CardTitle className="text-lg">Primária</CardTitle>
                                    <CardDescription className="text-gray-400 font-normal w-full">
                                        Cor principal do monitor.
                                    </CardDescription>
                                </div>
                            </div>

                            {/* Cor Sobreposição */}
                            <div className="flex items-start p-4 gap-4 relative border-b border-blue-200 pb-4">
                                <Button
                                    type="button"
                                    className="w-12 h-12 border border-gray-300"
                                    style={{ backgroundColor: overlayColor }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setPickerOpen(pickerOpen === "overlay" ? null : "overlay");
                                    }}
                                />
                                {pickerOpen === "overlay" && (
                                    <div className="absolute z-50 mt-2 bg-white shadow-lg p-2 rounded-md">
                                        <SketchPicker
                                            color={overlayColor}
                                            onChange={(color) => setOverlayColor(color.hex)}
                                        />
                                    </div>
                                )}
                                <div className="flex flex-col">
                                    <CardTitle className="text-lg">Sobreposição</CardTitle>
                                    <CardDescription className="text-gray-400 font-normal w-full">
                                        Cor que sobrepõe a cor primária.
                                    </CardDescription>
                                </div>
                            </div>

                            {/* Cor Fonte */}
                            <div className="flex items-start p-4 pb-0 gap-4 relative">
                                <Button
                                    type="button"
                                    className="w-12 h-12 border border-gray-300"
                                    style={{ backgroundColor: fontColor }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setPickerOpen(pickerOpen === "font" ? null : "font");
                                    }}
                                />
                                {pickerOpen === "font" && (
                                    <div className="absolute z-50 mt-2 bg-white shadow-lg p-2 rounded-md">
                                        <SketchPicker
                                            color={fontColor}
                                            onChange={(color) => setFontColor(color.hex)}
                                        />
                                    </div>
                                )}
                                <div className="flex flex-col">
                                    <CardTitle className="text-lg">Fonte</CardTitle>
                                    <CardDescription className="text-gray-400 font-normal w-full">
                                        Cor da fonte do sistema, não afeta as cores de sobreposição.
                                    </CardDescription>
                                </div>
                            </div>
                        </div>

                        {/* Botão de redefinir cores */}
                        <CardFooter className="flex justify-end border-t m-3 border-blue-200 pt-0">
                            <Button
                                className="max-w-[150px] border bg-white cursor-pointer text-black hover:bg-gray-200"
                                onClick={resetColors}
                            >
                                Redefinir cores
                            </Button>
                        </CardFooter>
                    </Card>

                    <div className="flex pt-2">
                        <Button type="submit" className="max-w-[150px] bg-blue-400 text-white hover:bg-blue-700">
                            Salvar
                        </Button>
                    </div>
                </div>

                {isSmallScreen ? (
                    <div className="flex justify-center">
                        <Dialog open={showPreviewModal} onOpenChange={setShowPreviewModal}>
                            <DialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-full max-w-[100px] bg-white text-black hover:bg-blue-600 flex items-center gap-2"
                                >
                                    <Eye className="size-5" /> Preview
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-[90vw] h-[90vh] flex flex-col p-0 overflow-hidden">
                                <DialogHeader className="border-b p-4">
                                    <DialogTitle className="text-xl font-bold">
                                        {currentPreview === "monitor" ? "Monitor PDV" : "App do Usuário"}
                                    </DialogTitle>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setShowPreviewModal(false)}
                                    >

                                    </Button>
                                </DialogHeader>

                                <div className="flex-1 overflow-auto flex items-center justify-center relative">
                                    {/* Botão de navegação esquerdo */}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white"
                                        onClick={() => togglePreview("prev")}
                                    >
                                        <ChevronLeft className="h-6 w-6" />
                                    </Button>

                                    {/* Conteúdo do mockup atual */}
                                    <div className="h-full w-full flex items-center justify-center p-4">
                                        {currentPreview === "monitor" ? (
                                            <div className="scale-[0.5] md:scale-[0.9]">
                                                <CardMonitor
                                                    primaryColor={primaryColor}
                                                    overlayColor={overlayColor}
                                                    fontColor={fontColor}
                                                    companyName={name || "Nome da empresa"}
                                                    companyLogo={logo ? URL.createObjectURL(logo) : null}
                                                    showOnly="monitor"
                                                />
                                            </div>
                                        ) : (
                                            <div className="scale-[1] md:scale-100">
                                                <CardMonitor
                                                    primaryColor={primaryColor}
                                                    overlayColor={overlayColor}
                                                    fontColor={fontColor}
                                                    companyName={name || "Nome da empresa"}
                                                    companyLogo={logo ? URL.createObjectURL(logo) : null}
                                                    showOnly="app"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Botão de navegação direito */}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white"
                                        onClick={() => togglePreview("next")}
                                    >
                                        <ChevronRight className="h-6 w-6" />
                                    </Button>
                                </div>

                                <div className="flex justify-center gap-2 p-4 border-t">
                                    <Button
                                        variant={currentPreview === "monitor" ? "default" : "outline"}
                                        onClick={() => setCurrentPreview("monitor")}
                                    >
                                        Monitor
                                    </Button>
                                    <Button
                                        variant={currentPreview === "app" ? "default" : "outline"}
                                        onClick={() => setCurrentPreview("app")}
                                    >
                                        App
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                ) : (
                    <div className="flex-1 lg:flex-none">
                        <div className="sticky lg:ml-14 py-1 flex justify-center lg:block">
                            <CardMonitor
                                primaryColor={primaryColor}
                                overlayColor={overlayColor}
                                fontColor={fontColor}
                                companyName={name || "Nome da empresa"}
                                companyLogo={logo ? URL.createObjectURL(logo) : null}
                            />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}