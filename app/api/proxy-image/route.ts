import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url')
  if (!url) return NextResponse.json({ error: 'Missing url param' }, { status: 400 })

  try {
    const res  = await fetch(url)
    const blob = await res.blob()
    return new NextResponse(blob, {
      headers: {
        'Content-Type': blob.type || 'image/jpeg',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (err) {
    console.error('[proxy-image] fetch error:', err)
    return NextResponse.json({ error: 'Failed to fetch image' }, { status: 500 })
  }
}
