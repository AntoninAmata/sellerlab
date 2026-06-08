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

  try {
    type Block = Anthropic.TextBlockParam | Anthropic.ImageBlockParam
    const content: Block[] = [
      {
        type: 'text',
        text: `Ci-dessous ${files.length} photo${files.length > 1 ? 's' : ''} d'articles vestimentaires, numérotées de 0 à ${files.length - 1}.`,
      },
    ]

    for (let i = 0; i < files.length; i++) {
      const file  = files[i]
      const media = (VALID_MEDIA_TYPES.has(file.type) ? file.type : 'image/jpeg') as
        'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif'
      const b64   = Buffer.from(await file.arrayBuffer()).toString('base64')
      content.push({ type: 'text',  text: `[Photo ${i}]` })
      content.push({ type: 'image', source: { type: 'base64', media_type: media, data: b64 } })
    }

    content.push({
      type: 'text',
      text: `Classifie chaque photo d'article vestimentaire. Réponds UNIQUEMENT avec du JSON valide, sans markdown ni texte supplémentaire.

RÈGLES (applique la première qui correspond) :
1. Une personne porte l'article sur elle → type "worn"
2. L'article entier est visible à plat ou sur cintre, sans personne → type "flat"
3. Du texte lisible apparaît sur une étiquette cousue/imprimée → type "detail"
4. Sinon (gros plan, défaut, emballage, accessoire) → type "detail"

Si type = "detail", détermine detailSlot :
3 = étiquette marque  |  4 = étiquette taille/compo  |  5 = compo seule
6 = gros plan  |  7 = défaut visible  |  8 = emballage/accessoire
Si type = "flat" ou "worn" → detailSlot = 6 (champ ignoré)

Réponds UNIQUEMENT avec ce JSON array (sans texte avant ni après) :
[{"index":0,"type":"flat"|"worn"|"detail","detailSlot":3|4|5|6|7|8},{"index":1,...},...]`,
    })

    const msg = await client.messages.create({
      model:      'claude-haiku-4-5-20251001',
      max_tokens: 60 + files.length * 40,
      messages:   [{ role: 'user', content }],
    })

    const raw = msg.content[0].type === 'text' ? msg.content[0].text.trim() : '[]'
    console.log('[classify] batch raw:', JSON.stringify(raw))

    const results: { fileIndex: number; type: 'flat' | 'worn' | 'detail'; detailSlot: number }[] = []

    try {
      const match = raw.replace(/```(?:json)?/g, '').trim().match(/\[[\s\S]*\]/)
      if (match) {
        const parsed = JSON.parse(match[0]) as Array<{ index: number; type: string; detailSlot: number }>
        for (const item of parsed) {
          if (typeof item.index === 'number' && item.index >= 0 && item.index < files.length) {
            const t: 'flat' | 'worn' | 'detail' = ['flat', 'worn', 'detail'].includes(item.type)
              ? (item.type as 'flat' | 'worn' | 'detail')
              : 'flat'
            const ds = parseInt(String(item.detailSlot))
            results.push({ fileIndex: item.index, type: t, detailSlot: [3, 4, 5, 6, 7, 8].includes(ds) ? ds : 6 })
          }
        }
      }
    } catch { /* fallback below */ }

    /* Ensure every file index has an entry */
    const covered = new Set(results.map(r => r.fileIndex))
    for (let i = 0; i < files.length; i++) {
      if (!covered.has(i)) results.push({ fileIndex: i, type: 'flat', detailSlot: 6 })
    }

    return NextResponse.json({ results })
  } catch (err) {
    console.error('[classify] batch error:', err)
    return NextResponse.json({
      results: files.map((_, i) => ({ fileIndex: i, type: 'flat', detailSlot: 6 })),
    })
  }
}
