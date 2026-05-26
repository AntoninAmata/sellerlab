import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const SLOT_DESCRIPTIONS = [
  '0: face/avant du vêtement (sur cintre, à plat, ou posé — vue frontale)',
  '1: dos/verso du vêtement (vue de dos)',
  '2: porté de face (personne portant le vêtement, vue de face)',
  '3: porté 3/4 ou diagonal (personne portant le vêtement, angle diagonal)',
  '4: porté de profil (personne portant le vêtement, vue latérale)',
  '5: porté de dos (personne portant le vêtement, vue de dos)',
  '6: étiquette marque (logo ou label de marque en gros plan)',
  '7: étiquette taille (indication de taille en gros plan)',
  '8: étiquette composition matière (tissu/entretien en gros plan)',
  '9: défaut, usure ou détail particulier',
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
                text: `Quel type de vue de vêtement correspond à cette image ?\n${SLOT_DESCRIPTIONS.join('\n')}\n\nRéponds uniquement avec le chiffre (0 à 9).`,
              },
            ],
          },
        ],
      })

      const raw = msg.content[0].type === 'text' ? msg.content[0].text.trim() : '0'
      const parsed = parseInt(raw.match(/\d/)?.[0] ?? '0')
      results.push({ fileIndex: i, slotIndex: Math.min(9, Math.max(0, parsed)) })
    } catch (err) {
      console.error(`Classify error for file ${i}:`, err)
      results.push({ fileIndex: i, slotIndex: i % 10 })
    }
  }

  return NextResponse.json({ results })
}
