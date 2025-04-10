'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { obterCodigoLocal, removerCodigoLocal } from '@/lib/localStorage'

export function VincularButton() {
    const router = useRouter()
  const [vinculado, setVinculado] = useState(false)

  useEffect(() => {
    const codigo = obterCodigoLocal()
    if (codigo) {
      setVinculado(true)
      removerCodigoLocal()

      setTimeout(() => {
        setVinculado(false)
      }, 4000)
    }
  }, [])

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
