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
