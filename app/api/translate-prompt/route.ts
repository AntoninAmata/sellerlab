import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

export async function POST(request: NextRequest) {
  let text = ''
  try {
    const body = await request.json() as { text: string; source_lang: string }
    text = body.text ?? ''
    const source_lang = body.source_lang ?? ''

    if (!text) return NextResponse.json({ translated: '' })
    if (source_lang === 'en') return NextResponse.json({ translated: text })

    const message = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 256,
      messages: [{
        role: 'user',
        content: `Translate the following fashion/clothing styling description to English. Keep precise fashion and clothing vocabulary. Return ONLY the translation, no preamble or explanation.\n\n${text}`,
      }],
    })

    const translated = (message.content[0] as { type: string; text: string }).text.trim()
    return NextResponse.json({ translated })

  } catch (err) {
    console.error('[translate-prompt] error:', err)
    return NextResponse.json({ translated: text })
  }
}
