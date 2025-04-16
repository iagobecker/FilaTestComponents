'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useVinculacaoStatus } from '@/lib/hooks/useVinculacao'

export function VincularButton() {
  const router = useRouter()
  const vinculado = useVinculacaoStatus()

  const handleVincular = () => {
    router.push('/vinculacao') 
  }

  return (
    <div className="pt-2">
      {vinculado ? (
        <span className="text-green-600 font-medium">✅ Vinculado com sucesso!</span>
      ) : (
        <Button
          type="button"
          onClick={handleVincular}
          className="max-w-[150px] border-1 cursor-pointer bg-white text-black hover:bg-gray-200"
        >
          Vincular
        </Button>
      )}
    </div>
  )
}
