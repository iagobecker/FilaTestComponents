import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import CardMonitor from "./CardMonitor";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, Eye, Image, Upload } from "lucide-react";
import { useCustomAparencia } from "../hooks/useCustomAparencia";
import { SketchPicker } from "react-color"

export function AparenciaMonitor() {
  const {
    name,
    setName,
    endereco,
    setEndereco,
    logo,
    logoUrl,
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
    handleFileChange,
    resetColors,
    togglePreview,
    bind,
    saveConfig,
    config,
    loading,
  } = useCustomAparencia("2251881f-386b-402d-a1f2-e364706ef9c2");

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Carregando...</div>;
  }

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-4 p-2 md:p-4">
        <div className="flex-1 flex flex-col gap-4">
          <Card className="border-2 border-blue-200 pb-2 pt-2 max-w-full">
            <CardHeader className="border-b border-blue-200 font-bold text-xl pb-1">
              <div className="flex justify-between items-center">
                <CardTitle>Dados da empresa</CardTitle>
              </div>
            </CardHeader>
            <form className="space-y-4 p-2">
              <div className="flex flex-col md:flex-row gap-4 items-center">
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
                  <p className="text-sm text-gray-600 mt-1">Formatos aceitos: JPG, PNG. Tamanho máximo: 2MB</p>
                </div>
                <div className="w-full md:w-1/3 flex justify-center">
                  {logo ? (
                    <img
                      src={URL.createObjectURL(logo)}
                      alt="Preview da logo"
                      className="w-24 h-24 object-contain rounded-md border border-gray-300"
                    />
                  ) : logoUrl ? (
                    <img
                      src={logoUrl}
                      alt="Logo atual"
                      className="w-24 h-24 object-contain rounded-md border border-gray-300"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-md bg-gray-100 border border-gray-300 flex items-center justify-center">
                      <Image className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>
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
              <div>
                <label className="block text-sm font-medium mb-1">Endereço</label>
                <input
                  type="text"
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                  placeholder="Digite o endereço da empresa"
                  className="w-full h-10 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm px-3"
                />
              </div>
            </form>
          </Card>
          <Card className="border-2 border-blue-200 pb-1 pt-3 max-w-full">
            <CardHeader className="border-b border-blue-200 font-bold text-xl">
              <CardTitle>Personalizar cores</CardTitle>
              <CardDescription className="text-gray-400 font-normal w-[80%]">
                Personalize as cores da sua empresa. <br />
                Para as cores primária, secundária e da fonte, recomendamos que sejam utilizadas cores com tom
                escuro para melhor visualização do sistema.
              </CardDescription>
            </CardHeader>
            <div className="py-1 flex-1 flex-col gap-0" ref={pickerRef}>
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
                    <SketchPicker color={primaryColor} onChange={(color) => setPrimaryColor(color.hex)} />
                  </div>
                )}
                <div className="flex flex-col">
                  <CardTitle className="text-lg">Primária</CardTitle>
                  <CardDescription className="text-gray-400 font-normal w-full">
                    Cor principal do monitor.
                  </CardDescription>
                </div>
              </div>
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
                    <SketchPicker color={overlayColor} onChange={(color) => setOverlayColor(color.hex)} />
                  </div>
                )}
                <div className="flex flex-col">
                  <CardTitle className="text-lg">Sobreposição</CardTitle>
                  <CardDescription className="text-gray-400 font-normal w-full">
                    Cor que sobrepõe a cor primária.
                  </CardDescription>
                </div>
              </div>
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
                    <SketchPicker color={fontColor} onChange={(color) => setFontColor(color.hex)} />
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
            <CardFooter className="flex justify-between border-t m-3 border-blue-200 pt-0">
              <Button className="max-w-[150px] border bg-white cursor-pointer text-black hover:bg-gray-200" onClick={resetColors}>
                Redefinir cores
              </Button>
              {isSmallScreen && (
                <Dialog open={showPreviewModal} onOpenChange={setShowPreviewModal}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="max-w-[150px] bg-white text-black hover:bg-gray-200 cursor-pointer flex items-center gap-2">
                      <Eye className="size-5" />
                      Preview
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-[90vw] h-[90vh] flex flex-col p-0 overflow-hidden">
                    <DialogHeader className="border-b p-4">
                      <DialogTitle className="text-xl font-bold">
                        {currentPreview === "monitor" ? "Monitor PDV" : "App do Usuário"}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 overflow-auto flex items-center justify-center relative">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white"
                        onClick={() => togglePreview("prev")}
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </Button>
                      <div {...bind()} className="h-full w-full flex items-center justify-center p-4 touch-pan-x">
                        {currentPreview === "monitor" ? (
                          <div className="scale-[0.5] md:scale-[0.9]">
                            <CardMonitor
                              primaryColor={primaryColor}
                              overlayColor={overlayColor}
                              fontColor={fontColor}
                              companyName={name}
                              companyLogo={logo ? URL.createObjectURL(logo) : logoUrl}
                              companyAddress={endereco}
                              showOnly="monitor"
                            />
                          </div>
                        ) : (
                          <div className="scale-[1] md:scale-100">
                            <CardMonitor
                              primaryColor={primaryColor}
                              overlayColor={overlayColor}
                              fontColor={fontColor}
                              companyName={name}
                              companyLogo={logo ? URL.createObjectURL(logo) : logoUrl}
                              companyAddress={endereco}
                              showOnly="app"
                            />
                          </div>
                        )}
                      </div>
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
              )}
            </CardFooter>
          </Card>
          <div className="flex pt-4 justify-end items-center">
            <Button
              onClick={saveConfig}
              type="submit"
              className="max-w-[150px] bg-blue-400 text-white cursor-pointer hover:bg-blue-500"
            >
              Salvar
            </Button>
          </div>
        </div>
        {!isSmallScreen && (
          <div className="flex-1 lg:flex-none">
            <div className="sticky lg:ml-14 py-1 flex justify-center lg:block">
              <CardMonitor
                primaryColor={primaryColor}
                overlayColor={overlayColor}
                fontColor={fontColor}
                companyName={name}
                companyLogo={logo ? URL.createObjectURL(logo) : logoUrl}
                companyAddress={endereco}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}