import { NextRequest, NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'
import { MANNEQUIN_DESCRIPTIONS } from '@/lib/mannequin-descriptions'

const FASHN_BASE = 'https://api.fashn.ai/v1'

async function runJob(
  apiKey: string,
  product_image: string,
  mannequinData: string,
  prompt: string,
  backgroundData: string | null,
): Promise<string[]> {
  console.log(`[mannequin] /run prompt="${prompt}"`)

  const body = {
    model_name: 'product-to-model',
    inputs: {
      product_image,
      image_prompt: mannequinData,
      num_images: 2,
      prompt,
      resolution: '1k',
      ...(backgroundData ? { background_reference: backgroundData } : {}),
    },
  }

  const runRes = await fetch(`${FASHN_BASE}/run`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const runText = await runRes.text()
  console.log('[mannequin] /run status:', runRes.status, runText)
  if (!runRes.ok) return []

  const { id } = JSON.parse(runText) as { id: string }

  for (let i = 0; i < 60; i++) {
    await new Promise(r => setTimeout(r, 2000))
    const statusRes = await fetch(`${FASHN_BASE}/status/${id}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    })
    if (!statusRes.ok) continue
    const data = await statusRes.json() as { status: string; output?: string[]; error?: string }
    console.log(`[mannequin] poll ${i + 1} — ${data.status}`)
    if (data.status === 'completed') return data.output ?? []
    if (data.status === 'failed') { console.error('[mannequin] failed:', data.error); return [] }
  }
  return []
}

export async function POST(request: NextRequest) {
  const FASHN_API_KEY = process.env.FASHN_API_KEY
  console.log('[mannequin] FASHN_API_KEY présente:', !!FASHN_API_KEY)
  if (!FASHN_API_KEY) return NextResponse.json({ error: 'FASHN_API_KEY non configurée' }, { status: 503 })

  try {
    const { product_image, mannequin_id, background_id, outfit_prompt } = await request.json() as {
      product_image: string
      mannequin_id: string
      background_id?: number
      outfit_prompt?: string
    }
    if (!product_image || !mannequin_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const description = MANNEQUIN_DESCRIPTIONS[mannequin_id] ?? mannequin_id
    const outfitPart  = (outfit_prompt ?? '').trim() || 'outfit adapted to the garment, contemporary 2026 casual style'
    const prompt = `Full body, ${description}, ${outfitPart}, one natural pose per image but different from each other, natural Vinted selling photo`

    console.log(`[mannequin] mannequin_id="${mannequin_id}" description="${description}"`)
    console.log(`[mannequin] prompt final="${prompt}"`)

    const mannequinPath = join(process.cwd(), 'public', 'mannequins', `${mannequin_id}.jpg`)
    const mannequinData = `data:image/jpeg;base64,${readFileSync(mannequinPath).toString('base64')}`
    console.log('[mannequin] mannequin chargé:', mannequinPath)

    let backgroundData: string | null = null
    if (background_id !== undefined && background_id !== null) {
      try {
        const bgFilename = background_id === 0
          ? 'bg-white.jpg'
          : `bg-${String(background_id).padStart(2, '0')}.jpg`
        const bgPath = join(process.cwd(), 'public', 'backgrounds', bgFilename)
        backgroundData = `data:image/jpeg;base64,${readFileSync(bgPath).toString('base64')}`
        console.log('[mannequin] fond chargé:', bgFilename)
      } catch {
        console.warn('[mannequin] fond non trouvé, ignoré:', background_id)
      }
    }

    const urls = await runJob(FASHN_API_KEY, product_image, mannequinData, prompt, backgroundData)
    console.log('[mannequin] URLs générées:', urls)
    return NextResponse.json({ urls })

  } catch (err) {
    console.error('[mannequin] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
