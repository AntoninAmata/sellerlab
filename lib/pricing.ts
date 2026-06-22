/* ─── lib/pricing.ts — calcul de prix déterministe ────────────────────────────
 * Partagé serveur (route API) + client (PricingStep)
 * Module pur TypeScript, zéro import externe
 * ─────────────────────────────────────────────────────────────────────────── */

/* ─── Table de décote par segment × état ─────────────────────────────────── */

export const DECOTE_TABLE: Record<string, Record<string, number>> = {
  'Neuf avec étiquette': { standard: 0.55, luxe_accessible: 0.65, luxe_premium: 0.75 },
  'Neuf sans étiquette': { standard: 0.45, luxe_accessible: 0.55, luxe_premium: 0.65 },
  'Très bon état':       { standard: 0.35, luxe_accessible: 0.45, luxe_premium: 0.55 },
  'Bon état':            { standard: 0.25, luxe_accessible: 0.35, luxe_premium: 0.45 },
  'Satisfaisant':        { standard: 0.15, luxe_accessible: 0.20, luxe_premium: 0.30 },
}

/* Lookup case-insensitive pour résister aux variations de casse/accent */
const ETAT_ALIASES: Record<string, string> = {
  'neuf avec étiquette': 'Neuf avec étiquette',
  'neuf sans étiquette': 'Neuf sans étiquette',
  'très bon état':       'Très bon état',
  'bon état':            'Bon état',
  'satisfaisant':        'Satisfaisant',
}

export function normalizeEtat(etat: string): string {
  return ETAT_ALIASES[etat.toLowerCase().trim()] ?? etat
}

/* Arrondi par tranches — lisse les petits écarts entre deux extractions proches */
export function roundToTier(amount: number): number {
  if (amount < 100) return Math.round(amount / 10) * 10
  if (amount <= 500) return Math.round(amount / 50) * 50
  return Math.round(amount / 100) * 100
}

/* ─── Table de référence des segments de marque ──────────────────────────── */

const BRAND_SEGMENTS_TABLE: Record<'luxe_premium' | 'luxe_accessible' | 'standard', string[]> = {
  luxe_premium: [
    'Gucci', 'Saint Laurent', 'Yves Saint Laurent', 'YSL',
    'Prada', 'Dior', 'Christian Dior', 'Givenchy', 'Balenciaga',
    'Bottega Veneta', 'Celine', 'Céline', 'Hermès', 'Hermes',
    'Louis Vuitton', 'Fendi', 'Valentino', 'Burberry', 'Moncler',
    'Versace', 'Loewe', 'Loro Piana', 'Brunello Cucinelli',
    'Alexander McQueen', 'Stella McCartney', 'Balmain', 'Lanvin',
    'Chanel', 'Tom Ford', 'Jacquemus', 'Off-White', 'Stone Island',
  ],
  luxe_accessible: [
    'Sandro', 'Maje', 'The Kooples', 'Kenzo',
    'A.P.C.', 'APC', 'Isabel Marant', 'Acne Studios',
    'Zadig & Voltaire', 'Zadig&Voltaire', 'Ba&sh', 'Ba & sh',
    'Claudie Pierlot', 'Iro', 'IRO', 'Paul Smith',
    'Ami', 'Ami Paris', 'Maison Kitsuné', 'Kitsuné',
    'Ganni', 'Nanushka', 'Toteme', 'Totême', 'Officine Générale',
    'Hugo Boss', 'Boss', 'Ted Baker', 'Reiss', 'AllSaints',
    'Ralph Lauren', 'Polo Ralph Lauren', 'Lacoste',
    'Tommy Hilfiger', 'Calvin Klein',
  ],
  standard: [
    'Zara', 'H&M', 'Mango', 'Uniqlo', 'COS',
    'Bershka', 'Pull&Bear', 'Massimo Dutti', 'Stradivarius',
    'Monki', 'Weekday', 'Arket', '& Other Stories',
    'Primark', 'New Look', 'Next', 'River Island',
    'ASOS', 'Shein', 'Levi\'s', 'Gap', 'Esprit',
    'Nike', 'Adidas', 'Puma', 'Reebok', 'New Balance',
    'Converse', 'Vans', 'Fila', 'Champion',
    'Vero Moda', 'Only', 'Jack & Jones', 'Selected',
  ],
}

export function getBrandSegment(
  marque: string,
): 'standard' | 'luxe_accessible' | 'luxe_premium' | null {
  if (!marque) return null
  const normalized = marque.toLowerCase().trim()
  for (const segment of ['luxe_premium', 'luxe_accessible', 'standard'] as const) {
    if (BRAND_SEGMENTS_TABLE[segment].some(b => b.toLowerCase() === normalized)) return segment
  }
  return null
}

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface ComputePriceInput {
  marche: {
    prixNeufMarque:   string | null
    prixMedianVinted: number | null
    nbAnnonces:       number | null
  }
  etat:           string
  segment:        'standard' | 'luxe_accessible' | 'luxe_premium'
  prixAchatNeuf?: number
}

export interface ComputePriceOutput {
  prixSuggere: number   /* 0 = aucune donnée (utiliser fallback = 1) */
  confidence:  'high' | 'medium' | 'low'
  prixDecote:  number | null
  prixNeuf:    number | null
}

/* ─── Calcul déterministe ───────────────────────────────────────────────── */

export function computePrice(input: ComputePriceInput): ComputePriceOutput {
  const { marche, etat, segment, prixAchatNeuf } = input

  /* A. Prix neuf — déclaré en priorité, sinon extrait par web search */
  let prixNeuf: number | null = (prixAchatNeuf && prixAchatNeuf > 0) ? prixAchatNeuf : null
  if (!prixNeuf && marche.prixNeufMarque) {
    const raw = marche.prixNeufMarque.trim()
    if (raw.includes('-')) {
      const parts = raw.split('-').map(s => parseFloat(s.trim()))
      if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        prixNeuf = Math.round((parts[0] + parts[1]) / 2)
      }
    } else {
      const parsed = parseFloat(raw)
      if (!isNaN(parsed) && parsed > 0) prixNeuf = parsed
    }
  }
  if (prixNeuf !== null) prixNeuf = roundToTier(prixNeuf)

  /* B. Prix de référence par décote */
  const normEtat    = normalizeEtat(etat)
  const decoteRatio = DECOTE_TABLE[normEtat]?.[segment] ?? null
  const prixDecote  = (prixNeuf !== null && decoteRatio !== null)
    ? Math.round(prixNeuf * decoteRatio)
    : null

  /* C. Pondération progressive
   *    n = 0          → 100 % décote
   *    n ∈ [1 ; 10[   → weightMarket = 0,30 + (n − 1) / 15  (30 % → 90 %)
   *    n ≥ 10         → 90 % marché / 10 % décote
   */
  const median = marche.prixMedianVinted !== null ? roundToTier(marche.prixMedianVinted) : null
  const n      = marche.nbAnnonces ?? 0

  let prixSuggere: number
  let weightMarket: number

  if (prixDecote !== null && median !== null && n >= 1) {
    weightMarket = Math.min(0.90, 0.30 + (n - 1) / 15)
    prixSuggere  = Math.round(weightMarket * median + (1 - weightMarket) * prixDecote)
  } else if (prixDecote !== null) {
    /* Pas de médiane → 100 % décote */
    weightMarket = 0
    prixSuggere  = prixDecote
  } else if (median !== null) {
    /* Pas de prix neuf → 90 % médiane */
    weightMarket = 0.90
    prixSuggere  = Math.round(0.90 * median)
  } else {
    /* Aucune donnée */
    weightMarket = 0
    prixSuggere  = 0
  }

  /* D. Bornes de sécurité [prixDecote × 0,80 ; prixDecote × 1,30] */
  if (prixDecote !== null && prixSuggere > 0) {
    prixSuggere = Math.max(
      Math.round(prixDecote * 0.80),
      Math.min(Math.round(prixDecote * 1.30), prixSuggere),
    )
  }

  /* E. Confidence */
  let confidence: 'high' | 'medium' | 'low'
  if (prixDecote !== null && median !== null && n >= 5) {
    confidence = 'high'
  } else if (prixDecote !== null || (median !== null && n >= 1)) {
    confidence = 'medium'
  } else {
    confidence = 'low'
  }

  return { prixSuggere, confidence, prixDecote, prixNeuf }
}
