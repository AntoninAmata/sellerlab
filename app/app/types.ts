export type SlotStatus = 'empty' | 'uploading' | 'processing-bg' | 'done' | 'error'

export interface PhotoSlot {
  id: number
  file: File | null
  preview: string | null
  processedUrl: string | null
  status: SlotStatus
  error?: string
}

/* ─── Étape 2 — Reconnaissance automatique ─────────────────────────────── */

export type Confidence = 'high' | 'medium' | 'low' | 'manual'

export interface RecognitionField<T> {
  value: T
  confidence: Confidence
}

export interface RecognitionResult {
  marque:       RecognitionField<string>
  genre:        RecognitionField<string>
  categorie:    RecognitionField<string>
  sousCategorie:RecognitionField<string>
  taille:       RecognitionField<string>
  etat:         RecognitionField<string>
  couleurs:     RecognitionField<string[]>
  matieres:     RecognitionField<string[]>
  style:        RecognitionField<string>
  motif:        RecognitionField<string>
  defauts:      RecognitionField<string>
}

/* ─── Étape 3 — Calcul du prix ──────────────────────────────────────────── */

export interface PriceResult {
  prixSuggere: number
  prixMin: number
  prixMax: number
  prixNeufEstime?: number | null
  raisonnement: string
  margeNeg: number
  confidence: 'high' | 'medium' | 'low'
}

export interface PricePrecisions {
  prixAchatNeuf?: number
  plateforme?: string
  rarete?: string
}
