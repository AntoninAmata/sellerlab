import { NextRequest, NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

const FASHN_BASE = 'https://api.fashn.ai/v1'

/* ── Charge le mannequin de face en base64 PNG (sert de face_reference) ───── */
function loadMannequinFace(mannequinId: string): string {
  const filePath = join(process.cwd(), 'public', 'mannequins', 'final', `${mannequinId}.png`)
  return `data:image/png;base64,${readFileSync(filePath).toString('base64')}`
}

/* ── Charge un fond en base64 JPEG (sert de background_reference) ─────────── */
function loadBackground(backgroundId: number): string | null {
  try {
    const filename =
      backgroundId === 0 ? 'bg-white.jpg' :
      `bg-${String(backgroundId).padStart(2, '0')}.jpg`
    const filePath = join(process.cwd(), 'public', 'backgrounds', filename)
    return `data:image/jpeg;base64,${readFileSync(filePath).toString('base64')}`
  } catch {
    console.warn('[mannequin] fond introuvable, ignoré:', backgroundId)
    return null
  }
}

/* ── Soumet un job FASHN et attend le résultat ───────────────────────────── */
async function runJob(
  apiKey: string,
  payload: Record<string, unknown>,
  label: string,
): Promise<string | null> {
  const runRes = await fetch(`${FASHN_BASE}/run`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const runText = await runRes.text()
  console.log(`[mannequin:${label}] /run status:`, runRes.status, runText)
  if (!runRes.ok) return null

  const { id } = JSON.parse(runText) as { id: string }

  for (let i = 0; i < 60; i++) {
    await new Promise(r => setTimeout(r, 2000))
    const statusRes = await fetch(`${FASHN_BASE}/status/${id}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    })
    if (!statusRes.ok) continue

    const data = await statusRes.json() as { status: string; output?: string[]; error?: string }
    console.log(`[mannequin:${label}] poll ${i + 1} — ${data.status}`)

    if (data.status === 'completed') return data.output?.[0] ?? null
    if (data.status === 'failed') {
      console.error(`[mannequin:${label}] job échoué:`, data.error)
      return null
    }
  }

  console.error(`[mannequin:${label}] timeout après 120s`)
  return null
}

/* ── Clause de fidélité du vêtement (par défaut, wearing_prompt vide) ──────── */
const FIDELITY_CLAUSE =
  'CRITICAL — match the garment EXACTLY as it appears in the product image: same opening/closure state, same collar, same zipper/buttons position. ' +
  'If the garment is closed in the product image, it MUST remain FULLY closed and fastened all the way — do NOT open it, do NOT show the inside lining, do NOT leave it hanging open. ' +
  'If it is open in the product image, keep it open the same way. Do not change the design, cut, length or proportions. ' +
  'The garment is well-pressed, smooth and well-presented, while keeping its real fabric texture, true color, natural drape and any genuine signs of wear — do not alter or hide real defects.'

/* ── Catalogue des poses dérivées (générées par edit depuis la photo de face) ─
   La face n'est pas ici : elle est toujours générée comme base.
   Chaque prompt reçoit la clause de port (fidélité ou "comment porter") en suffixe. */
type PoseId = 'back' | 'selfie_face' | 'selfie_34' | 'selfie_profile' | 'seated_selfie'

const POSE_PROMPTS: Record<PoseId, string> = {
  back:
    'Same person, same clothing, exact same background and room, keep the person centered — change only to a back view showing the back of the garment, natural standing posture, do not change the background.',
  selfie_face:
    'Same person, same clothing, exact same background and room, keep the person centered in the frame — change only the pose: person standing facing the camera, raising a smartphone with one hand directly in front of their face so the phone fully covers and hides their face, casual relaxed posture, no mirror, no mirror frame, do not change the background.',
  selfie_34:
    'Same person, same clothing, exact same background and room, keep the person centered in the frame — change only the pose: person turned slightly to a three-quarter angle, raising a smartphone with one hand directly in front of their face so the phone fully covers and hides their face, casual relaxed posture, no mirror, no mirror frame, do not change the background.',
  selfie_profile:
    'Same person, same clothing, exact same background and room, keep the person centered in the frame — change only the pose: person turned to a side profile view, raising a smartphone directly in front of their face so the phone fully covers and hides their face, casual relaxed posture, no mirror, no mirror frame, do not change the background.',
  seated_selfie:
    'Same person, same clothing, exact same background and room, keep the person centered in the frame — change only the pose: person seated casually, raising a smartphone with one hand directly in front of their face so the phone fully covers and hides their face, relaxed posture, no mirror, no mirror frame, do not change the background.',
}

/* ── Handler POST ─────────────────────────────────────────────────────────── */
export async function POST(request: NextRequest) {
  const FASHN_API_KEY = process.env.FASHN_API_KEY
  console.log('[mannequin] FASHN_API_KEY présente:', !!FASHN_API_KEY)
  if (!FASHN_API_KEY) {
    return NextResponse.json({ error: 'FASHN_API_KEY non configurée' }, { status: 503 })
  }

  try {
    const { product_image, mannequin_id, outfit_prompt, wearing_prompt, background_id, poses } = await request.json() as {
      product_image: string
      mannequin_id: string
      outfit_prompt?: string
      wearing_prompt?: string
      background_id?: number
      poses?: PoseId[]
    }

    if (!product_image || !mannequin_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Charger le fond choisi (si fourni) — passé en background_reference sur la photo de face
    const backgroundData = typeof background_id === 'number' ? loadBackground(background_id) : null

    // Charger le mannequin choisi (face_reference)
    let faceRef: string
    try {
      faceRef = loadMannequinFace(mannequin_id)
    } catch (err) {
      console.error('[mannequin] mannequin introuvable:', err)
      return NextResponse.json({ error: 'Mannequin introuvable' }, { status: 404 })
    }

    const outfitPart  = (outfit_prompt ?? '').trim() || 'outfit adapted to the garment, contemporary 2026 casual style'
    const wearingPart = (wearing_prompt ?? '').trim()
    // Si le user précise comment porter → on l'utilise ; sinon clause de fidélité (ne pas inventer)
    const wearingClause = wearingPart ? `Wear the garment ${wearingPart}.` : FIDELITY_CLAUSE

    // ── 1. PHOTO DE FACE (base) — product-to-model + face_reference ──────────
    const baseUrl = await runJob(FASHN_API_KEY, {
      model_name: 'product-to-model',
      inputs: {
        product_image,
        face_reference: faceRef,
        face_reference_mode: 'match_reference',
        prompt: `A person wearing the garment, ${outfitPart}. Casual natural relaxed standing pose facing the camera. Natural daylight. ${wearingClause}`,
        aspect_ratio: '3:4',
        output_format: 'png',
        generation_mode: 'fast',
        ...(backgroundData ? { background_reference: backgroundData } : {}),
      },
    }, 'face')

    if (!baseUrl) {
      return NextResponse.json({ error: 'Génération de la photo de base échouée' }, { status: 502 })
    }

    // ── 2. Poses dérivées via edit (selon les poses cochées) ─────────────────
    const requestedPoses: PoseId[] = (poses ?? []).filter(
      (p): p is PoseId => p in POSE_PROMPTS
    )

    const derivedUrls = await Promise.all(
      requestedPoses.map(poseId =>
        runJob(FASHN_API_KEY, {
          model_name: 'edit',
          inputs: {
            image: baseUrl,
            prompt: `${POSE_PROMPTS[poseId]} ${wearingClause}`,
            output_format: 'png',
            generation_mode: 'fast',
          },
        }, poseId)
      )
    )

    // Ordre de retour : face (base) d'abord, puis les poses cochées dans l'ordre
    const urls = [baseUrl, ...derivedUrls].filter(Boolean) as string[]
    console.log('[mannequin] URLs générées:', urls.length, `(face + ${requestedPoses.length} poses)`)

    return NextResponse.json({ urls })

  } catch (err) {
    console.error('[mannequin] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
