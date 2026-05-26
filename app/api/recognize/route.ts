import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { COLORS, MATERIALS, CONDITIONS, STYLES, PATTERNS } from '@/lib/vinted-taxonomy'
import type { RecognitionResult } from '@/app/app/types'

const client = new Anthropic()

/* ─── POST /api/recognize ────────────────────────────────────────────────── */
/* Reçoit un tableau de photos (base64) et retourne un RecognitionResult      */

export async function POST(req: NextRequest) {
  try {
    const { images } = await req.json() as { images: { base64: string; mediaType: string }[] }

    if (!images || images.length === 0) {
      return NextResponse.json({ error: 'Aucune image fournie' }, { status: 400 })
    }

    /* ── Construction du contenu multimodal ── */
    const imageContent = images.map((img) => ({
      type: 'image' as const,
      source: {
        type: 'base64' as const,
        media_type: img.mediaType as 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif',
        data: img.base64,
      },
    }))

    const prompt = `Tu es un expert en mode et vente sur Vinted. Analyse ces photos d'un vêtement/article et extrait les informations suivantes.

CONTRAINTES STRICTES :
- Couleurs autorisées : ${COLORS.join(', ')}
- Matières autorisées : ${MATERIALS.join(', ')}
- États autorisés : ${CONDITIONS.map(c => c.label).join(', ')}
- Styles autorisés : ${STYLES.join(', ')}
- Motifs autorisés : ${PATTERNS.join(', ')}
- Genres autorisés : Femme, Homme, Enfant, Mixte
- Maximum 2 couleurs
- Maximum 3 matières

NIVEAUX DE CONFIANCE :
- "high" : tu es sûr à 85%+
- "medium" : tu es sûr à 60-84%
- "low" : tu es sûr à moins de 60% ou l'info n'est pas visible

Réponds UNIQUEMENT avec ce JSON (sans markdown, sans texte avant ou après) :
{
  "marque": { "value": "string — marque lisible sur étiquette ou logo visible, sinon vide", "confidence": "high|medium|low" },
  "genre": { "value": "Femme|Homme|Enfant|Mixte", "confidence": "high|medium|low" },
  "categorie": { "value": "string — catégorie principale (ex: Robes, Pulls, Jeans...)", "confidence": "high|medium|low" },
  "sousCategorie": { "value": "string — sous-catégorie précise (ex: Robes longues, Jeans skinny...)", "confidence": "high|medium|low" },
  "taille": { "value": "string — taille lisible sur étiquette ou déduite, sinon vide", "confidence": "high|medium|low" },
  "etat": { "value": "string — parmi les 5 états Vinted exacts", "confidence": "high|medium|low" },
  "couleurs": { "value": ["couleur1"], "confidence": "high|medium|low" },
  "matieres": { "value": ["matière1"], "confidence": "high|medium|low" },
  "style": { "value": "string — parmi les styles autorisés", "confidence": "high|medium|low" },
  "motif": { "value": "string — parmi les motifs autorisés", "confidence": "high|medium|low" },
  "defauts": { "value": "string — défauts visibles décrits précisément, sinon vide", "confidence": "high|medium|low" }
}`

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            ...imageContent,
            { type: 'text', text: prompt },
          ],
        },
      ],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''

    /* ── Extraction du JSON depuis la réponse ── */
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Réponse IA invalide' }, { status: 500 })
    }

    const result: RecognitionResult = JSON.parse(jsonMatch[0])

    return NextResponse.json(result)
  } catch (err) {
    console.error('[recognize] Erreur:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
