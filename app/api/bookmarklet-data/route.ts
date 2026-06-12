import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'

export interface BookmarkletPayload {
  titre: string
  description: string
  prix: number
  categorie: string
  marque: string
  taille: string
  etat: string
  couleurs: string[]
  matieres: string[]
  materiau?: string | null
}

interface StoreEntry {
  data: BookmarkletPayload
  expires: number
}

const store = new Map<string, StoreEntry>()
const TTL_MS = 15 * 60 * 1000

function cleanup() {
  const now = Date.now()
  for (const [key, entry] of store) {
    if (entry.expires < now) store.delete(key)
  }
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS })
}

export async function POST(request: NextRequest) {
  cleanup()
  try {
    const data = await request.json() as BookmarkletPayload
    const token = randomUUID()
    store.set(token, { data, expires: Date.now() + TTL_MS })
    console.log(`[bookmarklet-data] stored token ${token.slice(0, 8)}… (store size: ${store.size})`)
    return NextResponse.json({ token })
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 })
  }
}

export async function GET(request: NextRequest) {
  cleanup()
  const token = request.nextUrl.searchParams.get('token')
  if (!token) return NextResponse.json({ error: 'missing_token' }, { status: 400 }, )

  const entry = store.get(token)
  if (!entry) return NextResponse.json({ error: 'not_found' }, { status: 404, headers: CORS_HEADERS })
  if (entry.expires < Date.now()) {
    store.delete(token)
    return NextResponse.json({ error: 'expired' }, { status: 410, headers: CORS_HEADERS })
  }

  return NextResponse.json(entry.data, { headers: CORS_HEADERS })
}
