'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { criarWebSocketVinculacao } from '@/lib/wsClient'
import { vincularAplicativo } from '@/lib/vincular'
import {  ScannerQRCode } from './QrScanner'

export default function Vinculacao() {
  const router = useRouter()
  const [codigo, setCodigo] = useState('')
  const [digitado, setDigitado] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [resposta, setResposta] = useState<string | null>(null)
  const [mostrarScanner, setMostrarScanner] = useState(false)

  useEffect(() => {
    const socket = criarWebSocketVinculacao('08833101000155', 4, {
      onCodigo: (data) => {
        setCodigo(data.codigo)
        setMensagem('Código recebido via WebSocket. Pronto para vincular.')
      },
      onVinculacao: (data) => {
        setMensagem('✅ Vinculado com sucesso via WebSocket!')
        setTimeout(() => {
          router.push('/customAparencia')
        }, 2000)
      }
    })

    return () => socket.close()
  }, [router])

  const handleVincular = async (codigo: string) => {
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
        Detalhes: {

        }
      }

      const resultado = await vincularAplicativo(payload)
      setResposta(`✅ Aplicativo vinculado com sucesso: ${JSON.stringify(resultado)}`)

        setTimeout(() => {
            router.push('/customAparencia')
        }, 2000)

    } catch (err) {
      console.error('❌ Erro ao vincular:', err)
      setResposta('Erro ao vincular aplicativo')
    }
  }

    function handleQrScan(result: string): void {
        throw new Error('Function not implemented.')
    }

  return (
    <div className="p-8 space-y-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold">Vincular Aplicativo</h1>

      <div className="flex gap-2 items-center">
        <label className="font-medium">Código de Vinculação</label>
        <input
          type="text"
          value={digitado}
          onChange={(e) => setDigitado(e.target.value)}
          placeholder="Digite ou escaneie o código"
          className="border border-gray-300 rounded-md p-2 w-full max-w-xs"
        />

        <Button
          onClick={() => handleVincular(digitado)}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          Vincular
        </Button>

        <Button
          variant="outline"
          className="text-sm"
          onClick={() => setMostrarScanner((prev) => !prev)}
        >
          {mostrarScanner ? 'Fechar Scanner' : 'Escanear QR'}
        </Button>
      </div>

      {/* <QrScanner
  onResult={(codigo) => {
    setDigitado(codigo) 
    setMensagem('Código lido com sucesso!')
  }}
/> */}

<ScannerQRCode
  onResult={(codigo) => {
    setDigitado(codigo)
    setMensagem('✅ Código escaneado com sucesso!')
  }}
/>




      {mensagem && (
        <div className="mt-2 p-2 rounded border border-green-400 text-green-700 bg-green-100">
          {mensagem}
        </div>
      )}

      {resposta && (
        <div className="mt-2 p-2 rounded border border-blue-400 text-blue-700 bg-blue-100">
          {resposta}
        </div>
      )}
    </div>
  )
}
