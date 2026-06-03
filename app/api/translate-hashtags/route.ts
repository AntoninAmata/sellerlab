import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const client = new Anthropic()

export async function POST(req: NextRequest) {
  try {
    const { tags, sourceLang } = await req.json() as { tags: string[]; sourceLang: string }

    /* Pas de traduction nécessaire si déjà en anglais ou liste vide */
    if (!tags?.length || sourceLang === 'en') {
      return NextResponse.json({})
    }

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 200,
      messages: [{
        role: 'user',
        content: `Translate these fashion keywords from ${sourceLang} to English. Return ONLY a JSON object. No explanations, no markdown.
Keywords: ${tags.join(', ')}
Format: {"original keyword": "english translation", ...}`,
      }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : '{}'
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return NextResponse.json({})

    return NextResponse.json(JSON.parse(jsonMatch[0]))
  } catch {
    return NextResponse.json({})
  }
}
