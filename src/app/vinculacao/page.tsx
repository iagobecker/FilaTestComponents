'use client'

import { useEffect, useState } from 'react'
import { criarWebSocketVinculacao } from '@/lib/wsClient'
import { vincularAplicativo } from '@/lib/vincular'

const cpfCnpj = '08833101000155'
const aplicativoId = 4

export default function VinculacaoPage() {
    const [codigo, setCodigo] = useState('')
    const [dadosVinculacao, setDadosVinculacao] = useState<any | null>(null)
    const [mensagem, setMensagem] = useState('')
    const [digitado, setDigitado] = useState('')
    const [resposta, setResposta] = useState<string | null>(null)
    const [payloadEnviado, setPayloadEnviado] = useState<any | null>(null)


    useEffect(() => {
        const socket = criarWebSocketVinculacao(cpfCnpj, aplicativoId, {
            onCodigo: (data) => {
                console.log('🔑 Código recebido via WebSocket:', data.codigo)
                setCodigo(data.codigo)
                setMensagem('Código recebido via WebSocket. Pronto para vincular.')
            },
            onVinculacao: (data) => {
                console.log('✅ Aplicativo vinculado via WS:', data)
                setDadosVinculacao(data)
                setMensagem('✅ Vinculado com sucesso via WebSocket!')
            },
        })

        return () => socket.close()
    }, [])


    const handleVincular = async () => {
        try {
            const payload = {
                Aplicativo: 2,
                Codigo: digitado,
                CpfCnpj: '08833101000155',
                NomeEmpresa: 'Empresa Teste',
                AplicativoVinculado: 4,
                Host: null,
                Porta: null,
                IdCliente: 0,
                
              }
              
              

            console.log('[DEBUG] Payload que será enviado:', payload)
            setPayloadEnviado(payload)

            const resultado = await vincularAplicativo(payload)
            setResposta(`✅ Aplicativo vinculado com sucesso: ${JSON.stringify(resultado)}`)
        } catch (err) {
            console.error('❌ Erro ao vincular:', err)
            setResposta('Erro ao vincular aplicativo')
        }
    }

    return (
        <div style={{ padding: 32 }}>
            <h1>Vincular Aplicativo</h1>

            <div style={{ marginTop: 20 }}>
                <label>
                    Código de Vinculação:
                    <input
                        type="text"
                        value={digitado}
                        onChange={(e) => setDigitado(e.target.value)}
                        placeholder="Digite o código aqui"
                        style={{ marginLeft: 12, padding: 8 }}
                    />
                </label>
                <button onClick={handleVincular} style={{ marginLeft: 12, padding: '8px 16px' }}>
                    Vincular
                </button>
            </div>

            {mensagem && (
                <div style={{ marginTop: 20, background: '#dff0d8', padding: 12, borderRadius: 6 }}>
                    {mensagem}
                </div>
            )}

            {dadosVinculacao && (
                <pre style={{ marginTop: 20, background: '#f8f9fa', padding: 16 }}>
                    {JSON.stringify(dadosVinculacao, null, 2)}
                </pre>
            )}

            {payloadEnviado && (
                <div style={{ marginTop: 20 }}>
                    <h3>📦 Payload Enviado</h3>
                    <pre style={{ background: '#f5f5f5', padding: 16, borderRadius: 8 }}>
                        {JSON.stringify(payloadEnviado, null, 2)}
                    </pre>
                </div>
            )}

            {resposta && (
                <div style={{ marginTop: 20, background: '#dff0d8', padding: 12, borderRadius: 6 }}>
                    {resposta}
                </div>
            )}

        </div>
    )
}
