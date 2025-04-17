import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ConfiguracaoMonitorForm() {
    return (
        <>
            <div className="flex flex-col lg:flex-row gap-4 p-2 md:p-4">
                <div className="flex-1 flex flex-col gap-4">
                    {/* Card - Dados da Empresa */}
                    <Card className="border-2 border-cyan-500 pb-2 pt-2 max-w-full">
                        <CardHeader className="border-b border-cyan-500 font-bold text-xl pb-1">
                            <div className="flex justify-between items-center">
                                <CardTitle>Passos para ativar</CardTitle>
                            </div>
                        </CardHeader>

                       
                            <CardHeader>
                                <CardTitle className="text-4xl font-bold">Vincular Monitor</CardTitle>
                                <CardDescription className="text-xl text-gray-400">
                                    Passos para vincular sua fila ao monitor.
                                </CardDescription>
                                <div className="border-b max-w-[700px] border-gray-300 mt-2"></div>
                            </CardHeader>

                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                                    
                                    <div className="max-w-[700px]">
                                        <ul className="mt-2 space-y-3 text-xl text-gray-700 leading-relaxed">
                                            <li>1. Acesse o link do monitor: <a href="https://example.com/rastreio" className="text-blue-600">https://example.com/monitor-fila</a> </li>
                                            <li>2. Insira seu CPF ou CNPJ no campo de texto do <strong>monitor</strong>  </li>
                                            <li className="jus">3. Insira o código de 4 digitos gerado pelo monitor: <input type="text" /></li>
                                            <li>4. Aperte no botão de Vincular:</li>
                                        </ul>
                                    </div>



                                </div>
                            </CardContent>
                       

                       
                    </Card>

                </div>
            </div>

        </>
    )
}