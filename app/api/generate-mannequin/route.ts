import { NextRequest, NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

const FASHN_BASE = 'https://api.fashn.ai/v1'

/* ── Charge une pose en base64 PNG ───────────────────────────────────────── */

function loadPose(mannequinId: string, suffix: string): string {
  const filename = suffix ? `${mannequinId}-${suffix}.png` : `${mannequinId}.png`
  const filePath = join(process.cwd(), 'public', 'mannequins', 'final', filename)
  return `data:image/png;base64,${readFileSync(filePath).toString('base64')}`
}

/* ── Lance un job tryon-max et attend le résultat ────────────────────────── */

async function runTryonJob(
  apiKey: string,
  product_image: string,
  model_image: string,
  prompt: string,
): Promise<string | null> {
  const runRes = await fetch(`${FASHN_BASE}/run`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model_name: 'tryon-max',
      inputs: {
        product_image,
        model_image,
        prompt,
        resolution: '1k',
        output_format: 'png',
        seed: 42,
      },
    }),
  })

  const runText = await runRes.text()
  console.log('[mannequin] /run status:', runRes.status, runText)
  if (!runRes.ok) return null

  const { id } = JSON.parse(runText) as { id: string }

  /* Polling — 60 tentatives toutes les 2 secondes (max ~2 min) */
  for (let i = 0; i < 60; i++) {
    await new Promise(r => setTimeout(r, 2000))
    const statusRes = await fetch(`${FASHN_BASE}/status/${id}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    })
    if (!statusRes.ok) continue

    const data = await statusRes.json() as { status: string; output?: string[]; error?: string }
    console.log(`[mannequin] poll ${i + 1} — ${data.status}`)

    if (data.status === 'completed') return data.output?.[0] ?? null
    if (data.status === 'failed') {
      console.error('[mannequin] job échoué:', data.error)
      return null
    }
  }

  console.error('[mannequin] timeout après 120s')
  return null
}

/* ── Handler POST ─────────────────────────────────────────────────────────── */

export async function POST(request: NextRequest) {
  const FASHN_API_KEY = process.env.FASHN_API_KEY
  console.log('[mannequin] FASHN_API_KEY présente:', !!FASHN_API_KEY)
  if (!FASHN_API_KEY) {
    return NextResponse.json({ error: 'FASHN_API_KEY non configurée' }, { status: 503 })
  }

  try {
    const { product_image, mannequin_id, outfit_prompt, wearing_prompt } = await request.json() as {
      product_image: string
      mannequin_id: string
      outfit_prompt?: string
      wearing_prompt?: string
    }

    if (!product_image || !mannequin_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    /* Construction du prompt commun aux 3 poses */
    const outfitPart  = (outfit_prompt ?? '').trim() || 'outfit adapted to the garment, contemporary 2026 casual style'
    const wearingPart = (wearing_prompt ?? '').trim()
    const prompt      = `${outfitPart}${wearingPart ? ', ' + wearingPart : ''}`

    console.log(`[mannequin] mannequin_id="${mannequin_id}" prompt="${prompt}"`)

    /* Chargement des 3 poses (face, 3/4, dos) */
    let poseFace: string, poseSide: string, poseBack: string
    try {
      poseFace = loadPose(mannequin_id, '')
      poseSide = loadPose(mannequin_id, 'side')
      poseBack = loadPose(mannequin_id, 'back')
    } catch (err) {
      console.error('[mannequin] pose introuvable:', err)
      return NextResponse.json({ error: 'Mannequin introuvable' }, { status: 404 })
    }

    /* 3 appels tryon-max en parallèle (face / 3/4 / dos) */
    const [urlFace, urlSide, urlBack] = await Promise.all([
      runTryonJob(FASHN_API_KEY, product_image, poseFace, prompt),
      runTryonJob(FASHN_API_KEY, product_image, poseSide, prompt),
      runTryonJob(FASHN_API_KEY, product_image, poseBack, prompt),
    ])

    const urls = [urlFace, urlSide, urlBack].filter(Boolean) as string[]
    console.log('[mannequin] URLs générées:', urls.length, '/ 3')

    return NextResponse.json({ urls })

  } catch (err) {
    console.error('[mannequin] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
