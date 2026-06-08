import { NextRequest, NextResponse } from 'next/server'

const VINTED_DOMAIN_RE = /^https?:\/\/(?:www\.)?vinted\.(fr|es|de|it|nl|pl|co\.uk|be|pt|at|lu|se|dk|fi|no|cz|sk|hu|ro|gr|bg|lt|lv|ee|hr|si)\/(?:items|vetements|catalog)\/\d/i

const BROWSER_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
  'Accept-Encoding': 'gzip, deflate, br',
  'Cache-Control': 'no-cache',
  'Pragma': 'no-cache',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'none',
  'Upgrade-Insecure-Requests': '1',
}

export async function POST(request: NextRequest) {
  let url: string
  try {
    ({ url } = await request.json() as { url: string })
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }

  if (!url || typeof url !== 'string' || !VINTED_DOMAIN_RE.test(url.trim())) {
    return NextResponse.json({ error: 'invalid_url' }, { status: 400 })
  }

  /* ── 1. Fetch the Vinted listing page ── */
  let html: string
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10_000)
    const res = await fetch(url.trim(), { signal: controller.signal, headers: BROWSER_HEADERS })
    clearTimeout(timeout)
    if (!res.ok) return NextResponse.json({ error: 'fetch_failed' }, { status: 502 })
    html = await res.text()
  } catch (err: any) {
    console.error('[import-vinted] fetch error:', err?.message)
    if (err?.name === 'AbortError') return NextResponse.json({ error: 'fetch_timeout' }, { status: 504 })
    return NextResponse.json({ error: 'fetch_failed' }, { status: 502 })
  }

  /* ── 2. Extract photo URLs from HTML ── */
  const allUrls = [...html.matchAll(/https:\/\/images\d*\.vinted\.net\/[^"'\s]+\.webp(?:\?s=[a-f0-9]+)?/g)]
    .map(m => m[0])
    .filter(u => u.includes('/f800/') || u.includes('/f1600/'))
    .filter((u, i, arr) => arr.indexOf(u) === i)

  // Garder uniquement les photos partageant le timestamp le plus fréquent (= photos de l'annonce)
  const timestamps = allUrls.map(u => u.match(/(?:f800|f1600)\/(\d+)\.webp/)?.[1])
  const freq: Record<string, number> = {}
  timestamps.forEach(t => { if (t) freq[t] = (freq[t] || 0) + 1 })
  const dominantTimestamp = Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0]

  const photoUrls = (dominantTimestamp
    ? allUrls.filter(u => u.includes(dominantTimestamp))
    : allUrls
  ).slice(0, 15)

  console.log(`[import-vinted] URLs trouvées: ${allUrls.length}, après filtre timestamp: ${photoUrls.length}`)

  if (photoUrls.length === 0) {
    return NextResponse.json({ error: 'no_photos' }, { status: 422 })
  }

  /* ── 3. Download each image server-side → base64 ── */
  const photos: string[] = []
  for (const imgUrl of photoUrls) {
    try {
      const imgRes = await fetch(imgUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Referer': 'https://www.vinted.fr/',
        },
      })
      console.log(`[import-vinted] fetch ${imgUrl} → status ${imgRes.status}`)
      if (!imgRes.ok) continue
      const buffer = await imgRes.arrayBuffer()
      console.log(`[import-vinted] buffer size: ${buffer.byteLength}`)
      const ct = imgRes.headers.get('content-type')?.split(';')[0] ?? 'image/webp'
      photos.push(`data:${ct};base64,${Buffer.from(buffer).toString('base64')}`)
    } catch (err: any) {
      console.log(`[import-vinted] erreur fetch image: ${err?.message ?? err}`)
    }
  }

  console.log(`[import-vinted] photos téléchargées: ${photos.length}`)

  if (photos.length === 0) {
    return NextResponse.json({ error: 'no_photos' }, { status: 422 })
  }

  return NextResponse.json({ photos })
}
