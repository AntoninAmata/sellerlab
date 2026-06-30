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

/* Clause de base : qualité/fidélité du vêtement, SANS mention de l'ouverture
   (l'état d'ouverture est géré séparément par closureInstruction, de façon non ambiguë) */
const FIDELITY_CLAUSE =
  'Match the garment EXACTLY as it appears in the product image: same design, same collar, same cut, same proportions, same color. ' +
  'The garment is well-pressed, smooth and well-presented, while keeping its real fabric texture, true color, natural drape and any genuine signs of wear — do not alter or hide real defects, do not redesign it.'

/* Instruction d'ouverture NON AMBIGUË selon l'état détecté par Claude Vision.
   On ne mentionne jamais les deux états à la fois (sinon FASHN retombe sur son biais). */
function closureInstruction(ouverture?: string): string {
  if (ouverture === 'ferme') {
    return ' CRITICAL: the garment is worn FULLY CLOSED — zipped and/or buttoned all the way up to the top collar. The front is completely closed and covers the chest entirely. Do NOT open it, do NOT show the inside lining, do NOT leave any gap.'
  }
  if (ouverture === 'ouvert') {
    return ' The garment is worn OPEN at the front (unzipped / unbuttoned), exactly as in the product image, revealing the layer underneath.'
  }
  return '' // sans_objet ou non détecté : aucune instruction de fermeture
}

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
    const { product_image, mannequin_id, outfit_prompt, wearing_prompt, background_id, poses, ouverture, verso_image } = await request.json() as {
      product_image: string
      mannequin_id: string
      outfit_prompt?: string
      wearing_prompt?: string
      background_id?: number
      poses?: PoseId[]
      ouverture?: string
      verso_image?: string
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
    // L'ouverture détectée s'applique TOUJOURS (jamais perdue), même si le user a renseigné "comment porter".
    // Exception : si le user mentionne explicitement l'ouverture dans son texte, on le laisse décider.
    const userMentionsClosure = /\b(ouvert|ferm|open|clos|zip|button|bouton)/i.test(wearingPart)
    const closure = userMentionsClosure ? '' : closureInstruction(ouverture)
    // Port = clause de fidélité + ajouts du user (port neutre ou perso) + ouverture détectée
    const wearingClause = `${FIDELITY_CLAUSE}${wearingPart ? ` Wear the garment: ${wearingPart}.` : ''}${closure}`

    // ── 1. PHOTO DE FACE (base) — product-to-model + face_reference ──────────
    // Si un fond est fourni, on renforce le prompt pour que FASHN ancre la scène sur la référence
    const backgroundClause = backgroundData
      ? ' The background and environment MUST exactly match the provided background reference image — same indoor scene, same setting, same colors and lighting. Do NOT invent a different location, no street, no outdoor scene unless the reference is outdoor.'
      : ''

    const baseUrl = await runJob(FASHN_API_KEY, {
      model_name: 'product-to-model',
      inputs: {
        product_image,
        face_reference: faceRef,
        face_reference_mode: 'match_reference',
        prompt: `A person wearing the garment, ${outfitPart}. Casual natural relaxed standing pose facing the camera.${backgroundClause} ${wearingClause}`,
        aspect_ratio: '3:4',
        output_format: 'png',
        generation_mode: 'fast',
        ...(backgroundData ? { background_reference: backgroundData } : {}),
      },
    }, 'face')

    if (!baseUrl) {
      return NextResponse.json({ error: 'Génération de la photo de base échouée' }, { status: 502 })
    }

    // ── 2. Poses dérivées (selon les poses cochées) ──────────────────────────
    const requestedPoses: PoseId[] = (poses ?? []).filter(
      (p): p is PoseId => p in POSE_PROMPTS
    )

    const derivedUrls = await Promise.all(
      requestedPoses.map(poseId => {
        // Cas spécial : la pose "dos" + photo de dos uploadée → on génère un dos FIDÈLE
        // au vrai dos du vêtement (product-to-model depuis le verso), en gardant
        // l'apparence du mannequin via image_prompt (cohérence ethnicité/cheveux/carrure).
        // Le visage n'étant pas visible de dos, pas besoin de face_reference (coût: 1 crédit).
        if (poseId === 'back' && verso_image) {
          return runJob(FASHN_API_KEY, {
            model_name: 'product-to-model',
            inputs: {
              product_image: verso_image,
              image_prompt: faceRef, // le mannequin choisi, pour la cohérence d'apparence
              prompt: `Back view of a person seen from behind, wearing the garment shown. ${outfitPart}. Natural standing posture seen from the back, no face visible.${backgroundClause} ${wearingClause}`,
              aspect_ratio: '3:4',
              output_format: 'png',
              generation_mode: 'fast',
              ...(backgroundData ? { background_reference: backgroundData } : {}),
            },
          }, 'back(verso)')
        }
        // Sinon : pose dérivée par edit depuis la photo de face
        return runJob(FASHN_API_KEY, {
          model_name: 'edit',
          inputs: {
            image: baseUrl,
            prompt: `${POSE_PROMPTS[poseId]} ${wearingClause}`,
            output_format: 'png',
            generation_mode: 'fast',
          },
        }, poseId)
      })
    )

    // Ordre de retour : face (base) d'abord, puis les poses cochées dans l'ordre
    const urls = [baseUrl, ...derivedUrls].filter(Boolean) as string[]
    console.log('[mannequin] URLs générées:', urls.length, `(face + ${requestedPoses.length} poses, verso=${!!verso_image})`)

    return NextResponse.json({ urls })

  } catch (err) {
    console.error('[mannequin] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
