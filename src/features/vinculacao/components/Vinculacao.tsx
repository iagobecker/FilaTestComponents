'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { criarWebSocketVinculacao } from '@/lib/wsClient'
import { vincularAplicativo } from '@/lib/vincular'
import { ScannerQRCode } from './QrScanner'
import { Api } from '@/api/api'
import { v4 as uuidv4 } from 'uuid' 

export default function Vinculacao() {
  const router = useRouter()
  const [codigo, setCodigo] = useState('')
  const [digitado, setDigitado] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [resposta, setResposta] = useState<string | null>(null)
  const [mostrarScanner, setMostrarScanner] = useState(false)
  const [empresa, setEmpresa] = useState<any>(null)

  // Abrir WebSocket e escutar eventos
  useEffect(() => {
    const socket = criarWebSocketVinculacao('08833101000155', 4, {
      onCodigo: (data) => {
        setCodigo(data.codigo)
        setMensagem('✅ Código recebido via WebSocket.')
      },
      onVinculacao: (data) => {
        setMensagem('✅ Vinculado com sucesso via WebSocket!')
        setTimeout(() => router.push('/customAparencia'), 2000)
      }
    })

    return () => socket.close()
  }, [router])

  // Buscar empresa logada
  useEffect(() => {
    async function fetchEmpresa() {
      try {
        const res = await Api.get('/empresas/pegar-dados-empresa')
        setEmpresa(res.data)
      } catch (err) {
        console.error('Erro ao buscar empresa:', err)
      }
    }

    fetchEmpresa()
  }, [])

  const handleVincular = async () => {
    if (!empresa) {
      setMensagem('⚠️ Empresa não carregada ainda.')
      return
    }

    try {
      const payload = {
        Aplicativo: 2,
        Codigo: digitado,
        CpfCnpj: empresa.cpfCnpj,
        NomeEmpresa: empresa.nome,
        AplicativoVinculado: 4,
        Host: null,
        Porta: null,
        IdCliente: 0,
        Detalhes: {}
      }

      const resultado = await vincularAplicativo(payload)
      const idVinculacaoAplicativo = resultado?.idVinculacaoAplicativo
      const empresaId = empresa.id
      const filaId = empresa.filas?.[0]?.id

      if (!idVinculacaoAplicativo || !empresaId || !filaId) {
        setResposta('❌ Faltam dados para vincular monitor.')
        return
      }

      const now = new Date().toISOString()

      await Api.post('http://10.0.0.191:5135/api/empresas/vincular-monitor', {
        id: uuidv4(),
        dataHoraCriado: now,
        dataHoraAlterado: now,
        dataHoraDeletado: null,
        idVinculacao: idVinculacaoAplicativo,
        empresaId,
        filaId
      })

      setResposta('✅ Vinculado e registrado no backend com sucesso!')

      setTimeout(() => {
        router.push('/customAparencia')
      }, 2000)
    } catch (err) {
      console.error('❌ Erro ao vincular:', err)
      setResposta('Erro ao vincular. Veja o console.')
    }
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
          onClick={handleVincular}
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

      {mostrarScanner && (
        <ScannerQRCode
          onResult={(codigo) => {
            setDigitado(codigo)
            setMensagem('✅ Código escaneado com sucesso!')
          }}
        />
      )}

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
