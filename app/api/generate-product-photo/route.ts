import { NextRequest, NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

const FASHN_BASE = 'https://api.fashn.ai/v1'

/* ── Prompts selon le mode d'affichage ───────────────────────────────────── */

const PROMPTS: Record<string, string> = {
  bust:   'garment on an off-white headless footless display bust, soft diffused studio lighting, matte neutral background, seamless edges, product photo',
  hanger: 'garment hanging on a slim wooden hanger, front view, clean professional product photo, neutral background',
  flat:   'garment laid flat neatly, top-down flat lay product photo, wrinkle-free, neutral background',
}

/* ── Charge un fond en base64 JPEG ───────────────────────────────────────── */

function loadBackground(backgroundId: number): string | null {
  try {
    const filename =
      backgroundId === 0 ? 'bg-white.jpg' :
      `bg-${String(backgroundId).padStart(2, '0')}.jpg`
    const filePath = join(process.cwd(), 'public', 'backgrounds', filename)
    return `data:image/jpeg;base64,${readFileSync(filePath).toString('base64')}`
  } catch {
    console.warn('[product-photo] fond introuvable, ignoré:', backgroundId)
    return null
  }
}

/* ── Lance un job product-to-model et attend le résultat ─────────────────── */

async function runProductJob(
  apiKey: string,
  product_image: string,
  prompt: string,
  numImages: number,
  backgroundData: string | null,
): Promise<string[]> {
  const runRes = await fetch(`${FASHN_BASE}/run`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model_name: 'product-to-model',
      inputs: {
        product_image,
        prompt,
        num_images: numImages,
        resolution: '1k',
        generation_mode: 'fast',
        output_format: 'png',
        seed: 77777,
        ...(backgroundData ? { background_reference: backgroundData } : {}),
      },
    }),
  })

  const runText = await runRes.text()
  console.log('[product-photo] /run status:', runRes.status, runText)
  if (!runRes.ok) return []

  const { id } = JSON.parse(runText) as { id: string }

  /* Polling — 60 tentatives toutes les 2 secondes (max ~2 min) */
  for (let i = 0; i < 60; i++) {
    await new Promise(r => setTimeout(r, 2000))
    const statusRes = await fetch(`${FASHN_BASE}/status/${id}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    })
    if (!statusRes.ok) continue

    const data = await statusRes.json() as { status: string; output?: string[]; error?: string }
    console.log(`[product-photo] poll ${i + 1} — ${data.status}`)

    if (data.status === 'completed') return data.output ?? []
    if (data.status === 'failed') {
      console.error('[product-photo] job échoué:', data.error)
      return []
    }
  }

  console.error('[product-photo] timeout après 120s')
  return []
}

/* ── Handler POST ─────────────────────────────────────────────────────────── */

export async function POST(request: NextRequest) {
  const FASHN_API_KEY = process.env.FASHN_API_KEY
  console.log('[product-photo] FASHN_API_KEY présente:', !!FASHN_API_KEY)
  if (!FASHN_API_KEY) {
    return NextResponse.json({ error: 'FASHN_API_KEY non configurée' }, { status: 503 })
  }

  try {
    const { product_image, verso_image, display_mode } = await request.json() as {
      product_image: string
      verso_image?: string
      display_mode: 'bust' | 'hanger' | 'flat'
    }

    if (!product_image || !display_mode) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const prompt = PROMPTS[display_mode]
    if (!prompt) {
      return NextResponse.json({ error: `display_mode invalide : "${display_mode}"` }, { status: 400 })
    }

    console.log(`[product-photo] display_mode="${display_mode}" verso=${!!verso_image}`)

    const jobs: Promise<string[]>[] = [
      runProductJob(FASHN_API_KEY, product_image, prompt, 1, null),
    ]
    if (verso_image) {
      jobs.push(runProductJob(FASHN_API_KEY, verso_image, prompt, 1, null))
    }

    const results = await Promise.all(jobs)
    const urls = results.flat()
    console.log('[product-photo] URLs générées:', urls.length)

    return NextResponse.json({ urls })

  } catch (err) {
    console.error('[product-photo] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
