'use client';

import { Api } from "@/api/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import InputVinculacao from "@/features/vinculacao-monitor/components/InputVinculacao"
import { useEffect, useState } from "react";

export default function VinculacaoMonitorForm() {

    const [empresa, setEmpresa] = useState<any>(null)

    useEffect(() => {
        async function buscarEmpresa() {
            try {
                const res = await Api.get('/empresas')
                setEmpresa(res.data)
            } catch (err) {
                console.error('Erro ao buscar empresa:', err)
            }
        }

        buscarEmpresa()
    }, [])

    return (
        <>
            <div className="flex flex-col lg:flex-row gap-4 p-2 sm:p-4 md:p-6 lg:p-8">
                <div className="flex-1 flex flex-col gap-4 w-full">
                    <Card className="border-2 border-cyan-500 pb-2 pt-2 w-full max-w-full sm:max-w-3xl mx-auto">
                        <CardHeader className="border-b border-cyan-500 font-bold text-xl sm:text-xl pb-1">
                            <div className="flex justify-between items-center">
                                <CardTitle>Passos para ativar</CardTitle>
                            </div>
                        </CardHeader>

                        <CardHeader>
                            <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-bold">Vincular Monitor</CardTitle>
                            <CardDescription className="text-base sm:text-lg md:text-xl text-gray-400">
                                Passos para vincular sua fila ao monitor.
                            </CardDescription>
                            <div className="border-b w-full sm:max-w-[800px] border-gray-300 mt-2"></div>
                        </CardHeader>

                        <CardContent>
                            <div className="grid  gap-2 p-2 sm:p-4 items-center">
                                <div className="flex flex-col sm:flex-row">
                                    <ul className="mt-2 space-y-4 sm:space-y-5 text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed w-full">
                                        <li><strong>1.</strong> Acesse o link do monitor: <a href="https://example.com/rastreio" className="text-blue-600 hover:underline break-all sm:break-words">https://example.com/monitor-fila</a> </li>
                                        <li><strong>2.</strong> Insira seu CPF ou CNPJ no campo de texto do <strong>monitor</strong>.  </li>
                                        <li className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                            <span className="w-full sm:w-auto"><strong>3.</strong> Insira o código de 4 dígitos gerado pelo monitor:</span>
                                            {empresa && (
                                                <div className="w-full sm:w-auto">
                                                    <InputVinculacao empresa={empresa} />
                                                </div>
                                            )}
                                        </li>
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