import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const file = formData.get('file') as File | null

  if (!file) {
    return NextResponse.json({ error: 'Fichier manquant' }, { status: 400 })
  }

  const hfKey = process.env.HUGGINGFACE_API_KEY
  if (!hfKey) {
    return NextResponse.json({ error: 'HUGGINGFACE_API_KEY non configurée' }, { status: 503 })
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer())

    const hfRes = await fetch(
      'https://api-inference.huggingface.co/models/briaai/RMBG-1.4',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${hfKey}`,
          'Content-Type': file.type || 'image/jpeg',
        },
        body: buffer,
      }
    )

    if (!hfRes.ok) {
      const errText = await hfRes.text()
      console.error('HF API error:', errText)
      return NextResponse.json({ error: 'Erreur API suppression fond' }, { status: 502 })
    }

    const resultBuffer = Buffer.from(await hfRes.arrayBuffer())
    const base64 = resultBuffer.toString('base64')

    return NextResponse.json({ url: `data:image/png;base64,${base64}` })
  } catch (err) {
    console.error('remove-bg error:', err)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
