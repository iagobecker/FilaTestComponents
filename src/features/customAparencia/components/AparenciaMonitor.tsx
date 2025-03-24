import { useRef, useState, useEffect } from "react";
import { SketchPicker } from "react-color";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import CardMonitor from "./CardMonitor"

export function AparenciaMonitor({ addEmpresa }: { addEmpresa: (nome: string) => void }) {
    const [name, setName] = useState("");
    const [logo, setLogo] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const pickerRef = useRef<HTMLDivElement>(null);

    // Estados para armazenar as cores escolhidas
    const [primaryColor, setPrimaryColor] = useState("#4A90E2"); // Azul padrão
    const [overlayColor, setOverlayColor] = useState("#FFFFFF"); // Branco padrão
    const [fontColor, setFontColor] = useState("#000000"); // Preto padrão

    
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
        if (e.target.files && e.target.files.length > 0) {
            setLogo(e.target.files[0]);
        }
    };

    return (
        <>
            {/* Card - Dados da Empresa */}
            <Card className="border-2 border-blue-200 pb-4 pt-3 max-w-full sm:max-w-[75%] md:max-w-[45%]">
                <CardHeader className="border-b border-blue-200 font-bold text-xl pb-1">
                    <CardTitle>Dados da empresa</CardTitle>
                </CardHeader>

                <form className="space-y-0.5 p-0.5">
                    <CardContent className="font-semibold pl-3 text-md">
                        <p>Nome fantasia</p>
                    </CardContent>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nome da empresa"
                        required
                        className="m-3 block w-[96%] h-10 rounded-sm border border-gray-200 focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-2"
                    />

                    {/* Logo */}
                    <CardContent className="font-semibold pl-3 text-md">
                        <p>Logo</p>
                    </CardContent>

                    <div className="relative m-3 w-[96%] h-10 rounded-md border border-gray-300 bg-white flex items-center px-3 cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}>
                        <span className="text-gray-400 text-sm flex-1">
                            {logo ? logo.name : "Escolher arquivo no seu computador"}
                        </span>
                        <Download className="w-5 h-5 text-gray-400" />
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </div>
                </form>
            </Card>

            <br />
            <div className="fixed bottom-60 w-[620px] right-0 m-4">
                <CardMonitor primaryColor={primaryColor} overlayColor={overlayColor} fontColor={fontColor} />
            </div>

            {/* Card - Personalizar Cores */}
            <Card className="border-2 border-blue-200 pb-3 pt-3 max-w-full sm:max-w-[75%] md:max-w-[45%]">
                <CardHeader className="border-b border-blue-200 font-bold text-xl">
                    <CardTitle>Personalizar cores</CardTitle>
                    <CardDescription className="text-gray-400 font-normal w-[80%]">
                        Personalize as cores da sua empresa. <br />
                        Para as cores primária, secundária e da fonte, recomendamos que sejam utilizadas
                        cores com tom escuro para melhor visualização do sistema.
                    </CardDescription>
                </CardHeader>

                {/* Cores */}
                <div className="py-4 flex flex-col gap-0" ref={pickerRef}>
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
                <CardFooter className="flex justify-end border-t border-blue-200 pt-0">
                    <Button className="max-w-[150px] border bg-white text-black hover:bg-gray-200">
                        Redefinir cores
                    </Button>
                </CardFooter>
            </Card>

            <div className="flex pt-6">
                <Button type="submit" className="max-w-[150px] bg-blue-400 text-white hover:bg-blue-700">
                    Salvar
                </Button>
            </div>
        </>

    );
}
