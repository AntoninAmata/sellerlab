// Wrapper background removal — isnet-general-use via @bunnio/rembg-web (Apache 2.0)
//
// Charge les bundles UMD depuis /public/ via <script> tags injectés au runtime.
// Aucun import() de @bunnio/rembg-web → Turbopack ne le voit jamais, pas de hang.
// Bundles requis dans /public/ : ort.all.min.js, rembg-web.umd.min.js, ort-wasm-simd-threaded.wasm

/* ── Types minimaux pour le module UMD ─────────────────────────────────── */

type BaseSession = object

interface RembgWebGlobal {
  newSession(
    modelName: string,
    config?: object,
    options?: object,
  ): Promise<BaseSession>
  remove(
    data: Blob,
    options?: { session?: BaseSession },
  ): Promise<Blob>
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ort?: { env: { wasm: Record<string, unknown> } }
    RembgWeb?: RembgWebGlobal
  }
}

/* ── Chargeur de scripts ────────────────────────────────────────────────── */

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return }
    const s = document.createElement('script')
    s.src = src
    s.onload  = () => resolve()
    s.onerror = () => reject(new Error(`Failed to load ${src}`))
    document.head.appendChild(s)
  })
}

let _rembgLoading: Promise<RembgWebGlobal> | null = null

async function loadRembgWeb(): Promise<RembgWebGlobal> {
  if (window.RembgWeb) return window.RembgWeb
  if (_rembgLoading)   return _rembgLoading

  _rembgLoading = (async () => {
    // 1. ORT runtime (expose window.ort)
    await loadScript('/ort.all.min.js')
    // 2. Pointer les WASM vers /public/ (servis à la racine)
    if (window.ort) window.ort.env.wasm.wasmPaths = '/'
    // 3. rembg-web UMD (lit window.ort, expose window.RembgWeb)
    await loadScript('/rembg-web.umd.min.js')
    if (!window.RembgWeb) throw new Error('RembgWeb UMD non chargé')
    return window.RembgWeb
  })()

  return _rembgLoading
}

/* ── Singleton session ──────────────────────────────────────────────────── */

let _session: BaseSession | null = null
let _sessionLoading: Promise<BaseSession> | null = null

async function ensureSession(): Promise<BaseSession> {
  if (_session)        return _session
  if (_sessionLoading) return _sessionLoading

  _sessionLoading = (async () => {
    const rembg = await loadRembgWeb()
    // baseUrl par défaut = '/models' → cherche /models/isnet-general-use.onnx ✓
    const s = await rembg.newSession('isnet-general-use')
    _session = s
    return s
  })()

  return _sessionLoading
}

/* ── API publique ───────────────────────────────────────────────────────── */

/** Vrai dès que la session est prête — permet l'indicateur first-load */
export function isModelReady(): boolean {
  return _session !== null
}

/** Supprime le fond d'un Blob image. Même signature que @imgly/background-removal. */
export async function removeBackground(input: Blob): Promise<Blob> {
  const [rembg, session] = await Promise.all([loadRembgWeb(), ensureSession()])
  return rembg.remove(input, { session })
}
