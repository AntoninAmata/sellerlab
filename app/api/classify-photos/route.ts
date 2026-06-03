import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

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
  const results: { fileIndex: number; type: 'flat' | 'worn' | 'detail'; detailSlot: number }[] = []

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const mediaType = VALID_MEDIA_TYPES.has(file.type) ? file.type : 'image/jpeg'

    try {
      const buffer = Buffer.from(await file.arrayBuffer())
      const base64 = buffer.toString('base64')

      const msg = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 40,
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
                text: `Analyse cette photo d'article vestimentaire. Réponds UNIQUEMENT avec du JSON valide, sans markdown ni texte supplémentaire.

ÉTAPE 1 — Détermine le type (ordre de priorité strict, applique la première règle qui correspond) :
1. Une personne porte l'article sur elle (vêtement sur le corps, chaussures aux pieds, sac tenu en main ou à l'épaule) ? → type "worn"
2. L'article entier est visible à plat ou sur cintre, sans aucune personne ? → type "flat"
3. Du texte lisible apparaît au premier plan sur une étiquette cousue, imprimée ou collée sur l'article ? → type "detail"
4. Sinon (gros plan, défaut visible, emballage, accessoire) ? → type "detail"

ÉTAPE 2 — Si et SEULEMENT SI type = "detail", détermine detailSlot :
3 = étiquette marque (nom ou logo : KENZO, Nike, Zara…)
4 = étiquette taille et/ou composition (M, 42, L/XL… avec ou sans matières)
5 = étiquette composition seule (matières ou instructions d'entretien, sans taille)
6 = gros plan sur l'article (zip, bouton, couture, texture, doublure…)
7 = défaut visible (décoloration, trou, fil tiré, usure, trace…)
8 = emballage ou accessoire séparé (boîte, sac de rangement, ceinture, lacets…)
Si type = "flat" ou type = "worn" → detailSlot = 6 (champ ignoré)

Réponds UNIQUEMENT avec ce JSON (sans texte avant ni après) :
{"type":"flat"|"worn"|"detail","detailSlot":3|4|5|6|7|8}`,
              },
            ],
          },
        ],
      })

      const raw = msg.content[0].type === 'text' ? msg.content[0].text.trim() : ''
      console.log(`[classify] file ${i} raw:`, JSON.stringify(raw))
      let type: 'flat' | 'worn' | 'detail' = 'flat'
      let detailSlot = 6

      try {
        const jsonMatch = raw.replace(/```(?:json)?/g, '').trim().match(/\{[^}]+\}/)
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0])
          if (['flat', 'worn', 'detail'].includes(parsed.type)) {
            type = parsed.type as 'flat' | 'worn' | 'detail'
          }
          const ds = parseInt(String(parsed.detailSlot))
          if ([3, 4, 5, 6, 7, 8].includes(ds)) detailSlot = ds
        }
      } catch {
        // keep defaults
      }

      results.push({ fileIndex: i, type, detailSlot })
    } catch (err) {
      console.error(`Classify error for file ${i}:`, err)
      results.push({ fileIndex: i, type: 'flat', detailSlot: 6 })
    }
  }

  return NextResponse.json({ results })
}
