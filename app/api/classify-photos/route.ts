import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

/* ─── Descriptions des 14 slots ─────────────────────────────────────────── */
/* Conçu pour tout type d'article : vêtements ET accessoires (sacs, lunettes, bijoux...) */

const SLOT_DESCRIPTIONS = [
  '0: vue principale recto — article à plat, posé sur surface ou suspendu, aucune personne visible. Pour vêtements : sur cintre ou à plat. Pour accessoires/sacs/bijoux/lunettes : première vue de face ou dessus, posé à plat sur surface.',
  '1: vue verso ou deuxième angle — article à plat/sur surface, aucune personne. Pour vêtements : dos sur cintre. Pour accessoires : vue de dos, dessous ou angle différent.',
  '2: vue portée de face OU troisième angle — pour vêtements : personne portant l\'article de face. Pour accessoires : troisième vue sous un angle différent.',
  '3: vue portée 3/4 ou diagonal OU quatrième angle — pour vêtements : personne portant l\'article en diagonal. Pour accessoires : quatrième vue.',
  '4: vue portée de profil OU cinquième angle — pour vêtements : vue latérale portée. Pour accessoires : cinquième vue.',
  '5: vue portée de dos OU sixième angle — pour vêtements : vue de dos portée. Pour accessoires : sixième vue.',
  '6: septième vue — vue supplémentaire portée ou angle additionnel.',
  '7: huitième vue — vue supplémentaire portée ou angle additionnel.',
  '8: étiquette marque — logo ou label de marque en gros plan.',
  '9: étiquette taille — indication de taille en gros plan.',
  '10: étiquette composition matière — tissu/entretien en gros plan.',
  '11: autre détail — détail de texture, fermeture, couture ou finition.',
  '12: défaut ou signe d\'usure — tache, accroc, usure visible.',
  '13: emballage — boîte, sac, housse ou emballage d\'origine.',
]

const VALID_MEDIA_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])

export async function POST(request: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY non configurée' }, { status: 503 })
  }

  const formData = await request.formData()
  const files = formData.getAll('files') as File[]

  if (!files.length) {
    return NextResponse.json({ error: 'Aucun fichier' }, { status: 400 })
  }

  const client = new Anthropic({ apiKey })
  const results: { fileIndex: number; slotIndex: number }[] = []

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const mediaType = VALID_MEDIA_TYPES.has(file.type) ? file.type : 'image/jpeg'

    try {
      const buffer = Buffer.from(await file.arrayBuffer())
      const base64 = buffer.toString('base64')

      const msg = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 5,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: mediaType as 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif',
                  data: base64,
                },
              },
              {
                type: 'text',
                text: `Quel slot correspond le mieux à cette image parmi les 14 slots ci-dessous ?

${SLOT_DESCRIPTIONS.join('\n')}

RÈGLES IMPORTANTES :
- SLOT 0 : première vue principale à plat/sur surface, aucune personne. Valable pour TOUS les types d'articles (vêtement sur cintre, sac posé à plat, lunettes sur table, bijou sur surface). Si l'objet est posé/suspendu et qu'aucune personne n'est visible → slot 0.
- SLOT 1 : deuxième vue à plat/sur surface, aucune personne (dos du vêtement, ou deuxième angle de l'accessoire).
- SLOTS 2-7 : vues portées (personne visible) OU angles supplémentaires d'un accessoire (intérieur sac, vue de côté, détail fermeture...).
- SLOTS 8-10 : uniquement des étiquettes en gros plan (marque, taille, composition).
- SLOT 11 : détail de texture/finition sans défaut visible.
- SLOT 12 : défaut, tache, usure clairement visible.
- SLOT 13 : emballage, boîte ou housse.

Réponds uniquement avec le chiffre (0 à 13).`,
              },
            ],
          },
        ],
      })

      const raw = msg.content[0].type === 'text' ? msg.content[0].text.trim() : '0'
      /* Extrait le premier ou deuxième chiffre (ex: "10", "13") */
      const numMatch = raw.match(/\d+/)
      const parsed = numMatch ? parseInt(numMatch[0]) : 0
      results.push({ fileIndex: i, slotIndex: Math.min(13, Math.max(0, parsed)) })
    } catch (err) {
      console.error(`Classify error for file ${i}:`, err)
      results.push({ fileIndex: i, slotIndex: i % 14 })
    }
  }

  return NextResponse.json({ results })
}
