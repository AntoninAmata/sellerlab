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
  marque:        RecognitionField<string>
  genre:         RecognitionField<string>
  categorie:     RecognitionField<string>
  sousCategorie: RecognitionField<string>
  taille:        RecognitionField<string>
  etat:          RecognitionField<string>
  couleurs:      RecognitionField<string[]>
  matieres:      RecognitionField<string[]>
  style:         RecognitionField<string>
  motif:         RecognitionField<string>
  defauts:       RecognitionField<string>
  /* Système de taille détecté automatiquement selon la sous-catégorie */
  tailleSysteme: RecognitionField<string>
}

/* ─── Étape 3 — Génération de l'annonce ────────────────────────────────── */

export interface GenerateResult {
  titre:               string
  descriptionFR:       string
  descriptionEN:       string
  seoTagsInDescription: string[]  // tags déjà intégrés dans la description
  seoTagsExtra:        string[]   // tags supplémentaires à ajouter optionnellement
  infosManquantes:     string[]   // ex: ['composition', 'taille'] si l'IA a des doutes
  tailleEquivalences:  string     // ex: "48 EU = M/L" ou "" si non applicable
}

/* ─── Étape 4 — Calcul du prix ──────────────────────────────────────────── */

export interface PriceResult {
  /* BLOC 1 — prix recommandé */
  prixSuggere: number
  confidence:  'high' | 'medium' | 'low'
  raisonnement: string

  /* BLOC 2 — données marché (null si non trouvé) */
  marche: {
    prixNeufMarque:    number | null
    sourcePrixNeuf:    string | null
    prixMedianVinted:  number | null
    prixMinVinted:     number | null
    prixMaxVinted:     number | null
    nbAnnonces:        number | null
    delaiVente:        string | null
  }
}

export interface PricePrecisions {
  prixAchatNeuf?: number
  plateforme?: string
  rarete?: string
}
