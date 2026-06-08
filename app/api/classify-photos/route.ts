import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const VALID_MEDIA_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
type MediaType = 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif'

type ImageItem = { b64: string; mediaType: MediaType }

const toBase64 = async (url: string): Promise<ImageItem> => {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'Referer': 'https://www.vinted.fr/',
    },
  })
  const buffer = await res.arrayBuffer()
  const ct = res.headers.get('content-type')?.split(';')[0] ?? 'image/webp'
  const mediaType: MediaType = VALID_MEDIA_TYPES.has(ct) ? (ct as MediaType) : 'image/webp'
  return { b64: Buffer.from(buffer).toString('base64'), mediaType }
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY non configurée' }, { status: 503 })
  }

  const contentType = request.headers.get('content-type') ?? ''
  let count = 0
  let imageItems: ImageItem[] = []

  if (contentType.includes('application/json')) {
    /* ── Mode URL : le serveur télécharge les images (Vinted import) ── */
    const { urls } = await request.json() as { urls: string[] }
    if (!urls?.length) return NextResponse.json({ error: 'No URLs' }, { status: 400 })
    count = urls.length
    imageItems = await Promise.all(
      urls.map(url => toBase64(url).catch(() => ({ b64: '', mediaType: 'image/jpeg' as const }))),
    )
  } else {
    /* ── Mode FormData : fichiers uploadés par le client (flux classique) ── */
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    if (!files.length) return NextResponse.json({ error: 'Aucun fichier' }, { status: 400 })
    count = files.length
    imageItems = await Promise.all(
      files.map(async (file) => {
        const mediaType = (VALID_MEDIA_TYPES.has(file.type) ? file.type : 'image/jpeg') as MediaType
        const b64 = Buffer.from(await file.arrayBuffer()).toString('base64')
        return { b64, mediaType }
      }),
    )
  }

  const client = new Anthropic({ apiKey })

  try {
    type Block = Anthropic.TextBlockParam | Anthropic.ImageBlockParam
    const content: Block[] = [
      {
        type: 'text',
        text: `Ci-dessous ${count} photo${count > 1 ? 's' : ''} d'articles vestimentaires, numérotées de 0 à ${count - 1}.`,
      },
    ]

    for (let i = 0; i < imageItems.length; i++) {
      const { b64, mediaType } = imageItems[i]
      if (!b64) continue
      content.push({ type: 'text',  text: `[Photo ${i}]` })
      content.push({ type: 'image', source: { type: 'base64', media_type: mediaType, data: b64 } })
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
      max_tokens: 60 + count * 40,
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
          if (typeof item.index === 'number' && item.index >= 0 && item.index < count) {
            const t: 'flat' | 'worn' | 'detail' = ['flat', 'worn', 'detail'].includes(item.type)
              ? (item.type as 'flat' | 'worn' | 'detail')
              : 'flat'
            const ds = parseInt(String(item.detailSlot))
            results.push({ fileIndex: item.index, type: t, detailSlot: [3, 4, 5, 6, 7, 8].includes(ds) ? ds : 6 })
          }
        }
      }
    } catch { /* fallback below */ }

    /* Ensure every index has an entry */
    const covered = new Set(results.map(r => r.fileIndex))
    for (let i = 0; i < count; i++) {
      if (!covered.has(i)) results.push({ fileIndex: i, type: 'flat', detailSlot: 6 })
    }

    return NextResponse.json({ results })
  } catch (err) {
    console.error('[classify] batch error:', err)
    return NextResponse.json({
      results: Array.from({ length: count }, (_, i) => ({ fileIndex: i, type: 'flat', detailSlot: 6 })),
    })
  }
}
