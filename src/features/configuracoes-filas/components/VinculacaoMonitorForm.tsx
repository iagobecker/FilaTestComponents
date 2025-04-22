'use client';

import { Api } from "@/api/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import InputVinculacao from "@/features/configuracoes-filas/components/InputVinculacao"
import { useEffect, useState } from "react";

export default function VinculacaoMonitorForm() {

    const [empresa, setEmpresa] = useState<any>(null)

    useEffect(() => {
        async function buscarEmpresa() {
            try {
                const res = await Api.get('/empresas/pegar-dados-empresa')
                setEmpresa(res.data)
            } catch (err) {
                console.error('Erro ao buscar empresa:', err)
            }
        }

        buscarEmpresa()
    }, [])

    return (
        <>
            <div className="flex flex-col lg:flex-row gap-4 p-2 md:p-4">
                <div className="flex-1 flex flex-col gap-4">
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
                            <div className="border-b max-w-[800px] border-gray-300 mt-2"></div>
                        </CardHeader>

                        <CardContent>
                            <div className="grid  gap-2 p-2 items-center">

                                <div className="flex flex-row">
                                    <ul className="mt-2 space-y-5 text-xl text-gray-700 leading-relaxed">
                                        <li><strong>1.</strong> Acesse o link do monitor: <a href="https://example.com/rastreio" className="text-blue-600">https://example.com/monitor-fila</a> </li>
                                        <li><strong>2.</strong> Insira seu CPF ou CNPJ no campo de texto do <strong>monitor</strong>.  </li>
                                        <li className="flex items-center justify-between">
                                            <span className="w-full"><strong>3.</strong> Insira o código de 4 dígitos gerado pelo monitor:</span>
                                            {empresa && <InputVinculacao empresa={empresa} />}
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