import { NextRequest, NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

const FASHN_BASE = 'https://api.fashn.ai/v1'

/* ── Clause de fidélité + amélioration (commune aux 3 présentations) ──────── */
const FIDELITY_CLAUSE =
  'Show the garment exactly as in the product image (same color, same design, same closure state — if closed keep it closed). ' +
  'The garment is well-pressed, smooth and well-presented, while keeping its real fabric texture, true color and any genuine signs of wear — do not alter or hide real defects, do not redesign it.'

/* ── Prompts selon le mode d'affichage ───────────────────────────────────── */
const PROMPTS: Record<string, string> = {
  bust:   `the garment displayed on a visible tailor's dress form mannequin bust (fabric-covered mannequin torso on a stand, clearly visible as a display mannequin), no head, no person, the full mannequin bust is visible inside the frame and nothing is cropped out, garment fully visible and centered, product photography. ${FIDELITY_CLAUSE}`,
  hanger: `the garment on a wooden hanger hung on a visible clothing rack / garment rail, the rack and hook clearly visible so the garment is not floating, no person, garment fully visible and centered, product photography. ${FIDELITY_CLAUSE}`,
  flat:   `the garment laid completely flat and lying down on the floor surface of the scene, photographed directly from above in a top-down overhead flat lay view, no person, no mannequin, no hanger, the garment rests on the ground fully visible and centered. ${FIDELITY_CLAUSE}`,
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
        aspect_ratio: '3:4',
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
    const { product_image, verso_image, display_mode, background_id } = await request.json() as {
      product_image: string
      verso_image?: string
      display_mode: 'bust' | 'hanger' | 'flat'
      background_id?: number
    }

    if (!product_image || !display_mode) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const prompt = PROMPTS[display_mode]
    if (!prompt) {
      return NextResponse.json({ error: `display_mode invalide : "${display_mode}"` }, { status: 400 })
    }

    // Charger le fond choisi (si fourni) — passé en background_reference à FASHN
    const backgroundData = typeof background_id === 'number' ? loadBackground(background_id) : null

    console.log(`[product-photo] display_mode="${display_mode}" verso=${!!verso_image} bg=${background_id ?? 'none'}`)

    const jobs: Promise<string[]>[] = [
      runProductJob(FASHN_API_KEY, product_image, prompt, 1, backgroundData),
    ]
    if (verso_image) {
      jobs.push(runProductJob(FASHN_API_KEY, verso_image, prompt, 1, backgroundData))
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
