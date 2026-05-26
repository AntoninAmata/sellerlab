import { NextRequest, NextResponse } from 'next/server'

// Nouveau endpoint HF (l'ancien api-inference.huggingface.co est déprécié)
const HF_ENDPOINT = 'https://router.huggingface.co/hf-inference/models/briaai/RMBG-1.4'

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const file = formData.get('file') as File | null

  if (!file) {
    return NextResponse.json({ error: 'Fichier manquant' }, { status: 400 })
  }

  const hfKey = process.env.HUGGINGFACE_API_KEY?.trim()
  if (!hfKey) {
    console.error('[remove-bg] HUGGINGFACE_API_KEY absente du .env.local')
    return NextResponse.json({ error: 'HUGGINGFACE_API_KEY non configurée' }, { status: 503 })
  }

  console.log(`[remove-bg] Fichier reçu : ${file.name ?? 'sans nom'} ${file.type} ${file.size}B`)

  try {
    const buffer = Buffer.from(await file.arrayBuffer())
    const contentType = file.type.startsWith('image/') ? file.type : 'image/jpeg'

    console.log(`[remove-bg] Appel HF → ${HF_ENDPOINT}`)

    const hfRes = await fetch(HF_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${hfKey}`,
        'Content-Type': contentType,
      },
      body: buffer,
    })

    if (!hfRes.ok) {
      const errorBody = await hfRes.text()
      console.error(`[remove-bg] HF HTTP ${hfRes.status} :`, errorBody)
      return NextResponse.json(
        { error: `HF API ${hfRes.status}`, detail: errorBody },
        { status: 502 }
      )
    }

    // La réponse est un PNG binaire — lire en arrayBuffer pour ne pas corrompre les bytes
    const resultBuffer = Buffer.from(await hfRes.arrayBuffer())
    const base64 = resultBuffer.toString('base64')
    console.log(`[remove-bg] Succès — PNG ${resultBuffer.length}B`)

    return NextResponse.json({ url: `data:image/png;base64,${base64}` })
  } catch (err) {
    const msg = err instanceof Error ? `${err.message} | cause: ${String(err.cause)}` : String(err)
    console.error('[remove-bg] Erreur réseau :', msg)
    return NextResponse.json({ error: 'Erreur réseau', detail: msg }, { status: 500 })
  }
}
