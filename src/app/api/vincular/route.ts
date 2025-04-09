// src/app/api/vincular/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log('[API] Payload recebido:', body)

    const response = await fetch('https://vinculacaoaplicativosapi.cervantes.dev.br/api/v1/vinculacao-aplicativo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Chave': 'Z3VpbGhlcm1lbWVwZXJkaWRvbm9nbw==',
      },
      body: JSON.stringify(body),
    })

    const responseBody = await response.json()
    console.log('[API] Resposta da API externa:', responseBody)

    return NextResponse.json(responseBody, { status: response.status })
  } catch (err: any) {
    console.error('[API] Erro ao fazer request para API externa:', err)
    return NextResponse.json({ error: 'Erro ao processar vinculação' }, { status: 500 })
  }
}
