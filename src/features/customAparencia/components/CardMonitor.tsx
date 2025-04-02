import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { darkenColor, lightenColor } from "@/lib/utils/colors";
import { CircleCheck, Clock, Image, MapPin, MoveRight, Ticket, Timer, Upload, Users } from "lucide-react";

interface CardMonitorProps {
  primaryColor: string;
  overlayColor: string;
  fontColor: string;
  companyName?: string;
  companyLogo?: string | null;
}

export default function CardMonitor({
  primaryColor,
  overlayColor,
  fontColor,
  companyName = "Nome da Empresa",
  companyLogo
}: CardMonitorProps) {

  const screenStyle = {
    width: '680px',
    height: '340px',
  };


  return (
    <div className="flex flex-col gap-4 w-full max-w-[680px] mx-auto p-1 ">
      {/* Monitor PDV */}
      <div>
        <CardHeader className="p-1 pb-0 text-start">
          <h1 className="text-xl font-bold text-black">Monitor</h1>
        </CardHeader>
        <Card
          className="border-4 py-0 border-black shadow-xl rounded-lg relative"
          style={{
            ...screenStyle,
            background: `linear-gradient(to bottom, 
              ${darkenColor(primaryColor, 0.3)} 0%, 
              ${primaryColor} 50%, 
              ${primaryColor} 100%)`
          }}
        >
          {/* Header com gradiente escuro no topo */}
          <div
            className="flex justify-between items-center px-4 py-2"
            style={{
              background: `linear-gradient(to bottom, 
          ${darkenColor(primaryColor, 0.4)} 0%, 
          ${darkenColor(primaryColor, 0.2)} 100%)`,
            }}
          >
            <div className="flex items-center">
              {companyLogo ? (
                <img
                  src={companyLogo}
                  alt="Logo"
                  className="size-8 rounded-full object-cover mr-2"
                />
              ) : (
                <div className="w-8 h-8 rounded-sm bg-gray-200 flex items-center justify-center mr-2">
                  <span className="text-gray-500 text-xs"> <Image className="size-7" /></span>
                </div>
              )}
              <h2 className="text-lg font-bold text-white" style={{ color: overlayColor }}>{companyName}</h2>
            </div>
            <div className="flex items-center text-white" style={{ color: overlayColor }}>
              <Clock className="w-4 h-4 mr-1" />
              <span className="text-sm">
                {new Date().toLocaleString('pt-BR', {
                  weekday: 'short',
                  day: '2-digit',
                  month: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit'
                }).replace(',', '')}
              </span>
            </div>
          </div>

          <div className="h-[70%] p-2 pt-0 flex">
            {/* Seção de Senha Atual - Lado esquerdo */}
            <div className="basis-2/3 mr-2">
              <div className="flex items-center justify-center gap-1">
                <Ticket className="w-4 h-4 mb-2" style={{ color: overlayColor }} />
                <h2 className="text-[12px] font-semibold text-white mb-2 text-center" style={{ color: overlayColor }}>SENHA ATUAL</h2>
              </div>
              <CardContent className="p-1 rounded-lg shadow-md h-full flex flex-col justify-center bg-white">
                <p className="text-7xl font-bold text-center pb-12">B88</p>
                <p className="text-xl text-gray-800 font-bold text-center p-2 border-t-2" style={{ color: primaryColor }}>PEDRO HENRIQUE SILVA</p>
              </CardContent>
            </div>

            {/* Seção de Últimos Chamados - Lado direito */}
            <div className="w-2/3">
              <div className="flex items-center justify-center gap-1">
                <CircleCheck className="w-4 h-4 mb-2" style={{ color: overlayColor }} />
                <h2 className="text-[12px] font-semibold text-white mb-2 text-center" style={{ color: overlayColor }}>ÚLTIMOS CHAMADOS</h2>
              </div>
              <div className="space-y-2 rounded-lg h-full" style={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}>
                <CardContent className="pb-3 pt-3 flex items-center">
                  <p className="text-2xl font-bold w-16 text-left" style={{ color: overlayColor }}>B88</p>
                  <MoveRight className="w-3 h-3 mx-2" style={{ color: overlayColor }} />
                  <p className="text-sm font-medium text-white flex-1  pl-3" style={{ color: overlayColor }}>PEDRO HENRIQUE SILVA</p>
                </CardContent>
                <CardContent className="pb-3 flex items-center">
                  <p className="text-2xl font-bold w-16 text-left" style={{ color: overlayColor }}>B87</p>
                  <MoveRight className="w-3 h-3 mx-2" style={{ color: overlayColor }} />
                  <p className="text-sm font-medium text-white flex-1 pl-3" style={{ color: overlayColor }}>JESSICA MELO</p>
                </CardContent>
                <CardContent className="pb-3 flex items-center">
                  <p className="text-2xl font-bold w-16 text-left" style={{ color: overlayColor }}>B86</p>
                  <MoveRight className="w-3 h-3 mx-2" style={{ color: overlayColor }} />
                  <p className="text-sm font-medium text-white flex-1 pl-3" style={{ color: overlayColor }}>JOÃO FRANCISCO</p>
                </CardContent>
                <CardContent className="flex items-center">
                  <p className="text-2xl font-bold w-16 text-left" style={{ color: overlayColor }}>B85</p>
                  <MoveRight className="w-3 h-3 mx-2" style={{ color: overlayColor }} />
                  <p className="text-sm font-medium text-white flex-1 pl-3" style={{ color: overlayColor }}>ANA MARIA LOPES</p>
                </CardContent>
              </div>
            </div>
          </div>
        </Card>
      </div>



      {/* App do Usuário com Gradiente Dinâmico */}
      <div>
        <CardHeader className="p-2 pb-0 text-start">
          <h2 className="text-xl font-bold text-black">App do usuário</h2>
        </CardHeader>
        <Card
          className="border-4 py-2 border-black !h-[390px] shadow-xl rounded-lg relative"
          style={{
            ...screenStyle,
            background: `linear-gradient(to bottom, 
              ${primaryColor} 0%, 
              ${lightenColor(primaryColor, 0.3)} 1%, 
              rgba(255, 255, 255, 0.9) 40%, 
              rgba(255, 255, 255, 0.95) 100%)`
          }}
        >
          <div className="p-0 h-full pl-50 pr-50 flex flex-col">
            {/* Cabeçalho com logo e nome */}
            <div className="flex flex-col items-center mb-2">
              {companyLogo ? (

                <img
                  src={companyLogo}

                  className="size-10 rounded-full object-contain mb-1"
                />


              ) : (
                <div className="size-10 rounded-sm bg-gray-200 flex items-center justify-center mb-1">
                  <span className="text-gray-500 text-xs"> <Image className="size-9" /></span>
                </div>
              )}
              <h1 className="text-lg font-bold text-black">{companyName}</h1>
              <div className="flex items-center">
                <MapPin className="w-3 h-3 text-black opacity-80 mr-1" />
                <p className="text-xs text-black opacity-80">Av. Gastronômica, 123 - Centro</p>
              </div>
            </div>

            {/* Card principal */}
            <div className="bg-white rounded-lg p-2 border-1  shadow-md flex flex-col justify-between">
              {/* Posição na fila */}
              <div className="flex justify-between items-start mb-0 h-[70%] p-2 pt-0 ">
                <div>
                  <h2 className="text-sm font-semibold flex items-center gap-1 text-gray-800" >
                    <Users className="w-3 h-3" style={{ color: primaryColor }} />
                    Sua posição na fila
                  </h2>
                  <p className="text-[10px] text-gray-500">Atualizado em tempo real</p>
                </div>
                <div className="flex flex-col items-end">
                  <h1 className="text-2xl font-bold" style={{ color: primaryColor }}>8</h1>
                  <p className="text-[8px] text-gray-500">de 24</p>
                </div>
              </div>

              <div className="border-t border-gray-200 my-0"></div>

              {/* Tempo estimado */}
              <div className="flex justify-between items-center mb-1 p-1 bg-gray-50 rounded">
                <div className="flex items-center gap-1">
                  <Timer className="w-3 h-3" style={{ color: primaryColor }} />
                  <div>
                    <h3 className="text-xs font-semibold text-gray-800" >Tempo médio de espera</h3>
                    <p className="text-[8px] text-gray-500">Baseado no fluxo da fila</p>
                  </div>
                </div>
                <p className="text-sm font-bold" >18:45</p>
              </div>



              {/* Tempo aguardado */}
              <div className="flex justify-between items-center p-1 bg-gray-50 rounded">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" style={{ color: primaryColor }} />
                  <div>
                    <h3 className="text-xs font-semibold text-gray-800" >Tempo já aguardado</h3>
                    <p className="text-[10px] text-gray-500">Desde sua entrada</p>
                  </div>
                </div>
                <p className="text-sm font-bold" >05:12</p>
              </div>
            </div>
            <div className="m-0.5"></div>

            {/* Card Info */}
            <div className="bg-white rounded-lg p-2 border-1  shadow-md flex flex-col justify-between">
              <div className="mt-0">
                <h4 className="text-xs font-semibold text-gray-800 mb-0" >Enquanto você espera</h4>
                <ul className="text-[10px] text-gray-600 space-y-1">
                  <li className="flex items-start">
                    <span className="text-primary mr-1" style={{ color: primaryColor }}>•</span>
                    <span>Você receberá uma notificação quando faltar 1 pessoa</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-1" style={{ color: primaryColor }}>•</span>
                    <span>Conheça nosso cardápio enquanto aguarda</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-1" style={{ color: primaryColor }}>•</span>
                    <span>Você pode cancelar sua reserva a qualquer momento</span>
                  </li>
                </ul>
              </div>

            </div>
            <div className="flex justify-center mt-1">
              <button className="flex items-center text-xs text-gray-600 opacity-90 hover:opacity-100">
                <Upload className="w-3 h-3 rotate-90 mr-1" />
                Desistir da fila
              </button>
            </div>

          </div>
        </Card>
      </div>
    </div>
  );
}
