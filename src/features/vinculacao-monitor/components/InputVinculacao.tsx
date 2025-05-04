import { Api } from "@/api/api"
import { Button } from "@/components/ui/button"
import { vincularAplicativo } from "@/lib/vincular"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { v4 as uuidv4 } from 'uuid'

interface Props {
    cpfCnpj?: string
    empresa?: any
}

export default function InputVinculacao({ empresa }: Props) {
    const router = useRouter()
    const [digitado, setDigitado] = useState('')
    const [resposta, setResposta] = useState<string | null>(null)


    const handleVincular = async () => {
        if (!empresa) {
            setResposta('Empresa não carregada ainda.')
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
                setResposta('Faltam dados para vincular o monitor.')
                return
            }

            const now = new Date().toISOString()

            await Api.post('/vinculacoes', {
                id: uuidv4(),
                dataHoraCriado: now,
                dataHoraAlterado: now,
                dataHoraDeletado: null,
                idVinculacao: idVinculacaoAplicativo,
                empresaId,
                filaId
            })

            setResposta('Vinculado com sucesso!!')
            setTimeout(() => {
                router.push('/customAparencia')
            }, 2500)

        } catch (err) {
            console.error(err)
            setResposta('Erro ao Vincular.')
        }
    }

    return (
        <div className="flex gap-2 p-2 items-center mt-2">
            <input
                type="text"
                value={digitado}
                onChange={(e) => setDigitado(e.target.value)}
                placeholder="Código de 4 dígitos"
                className="border border-gray-300 rounded-md p-1.5 w-50"
            />
            <Button onClick={handleVincular} className="bg-blue-400 hover:bg-blue-600 text-white">
                Vincular
            </Button>
            {resposta && <span className="text-sm text-blue-700 ml-2">{resposta}</span>}
        </div>
    )

}