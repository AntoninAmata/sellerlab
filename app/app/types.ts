import type { BrandSegment } from '@/lib/pricing'

export type Plan = 'freemium' | 'premium' | 'pro'

export type SlotStatus = 'empty' | 'uploading' | 'processing-bg' | 'done' | 'error'

export type PhotoContentType = 'recto' | 'verso' | 'label' | 'detail' | 'worn'

export interface PhotoSlot {
  id: number
  file: File | null
  preview: string | null
  processedUrl: string | null
  compositedUrl?: string   // processedUrl composited with selected background (for export)
  status: SlotStatus
  error?: string
  isAiGenerated?: boolean
  contentType?: PhotoContentType
}

/* ─── Étape 2 — Reconnaissance automatique ─────────────────────────────── */

export interface ExtraInfo {
  prixAchatNeuf?: number
  missingInfos:   { label: string; labelEN?: string; value: string }[]
  dimensions:     { nom: string; nomEN: string; valeur: string }[]
}

export type Confidence = 'high' | 'medium' | 'low' | 'manual'

export interface RecognitionField<T> {
  value: T
  confidence: Confidence
}

export interface RecognitionResult {
  marque:        RecognitionField<string>
  genre:         RecognitionField<string>
  /* Chemin de navigation Vinted complet, ex: "Femmes > Vêtements > Jeans > Jeans skinny" */
  vintedPath:    RecognitionField<string>
  taille:        RecognitionField<string>
  etat:          RecognitionField<string>
  couleurs:      RecognitionField<string[]>
  matieres:      RecognitionField<string[]>
  style:         RecognitionField<string>
  motif:         RecognitionField<string>
  defauts:       RecognitionField<string>
  /* Systèmes de taille applicables — premier = taxonomie, suivants = étiquette visible */
  tailleSysteme: RecognitionField<string[]>
  extraInfo?:    ExtraInfo
  /* Champ interne — NE PAS afficher dans l'UI étape 2 */
  brand_segment?: BrandSegment
}

/* ─── Étape 3 — Génération de l'annonce ────────────────────────────────── */

export interface GenerateResult {
  titre:               string
  descriptionFR:       string
  descriptionEN:       string
  /* Description telle qu'affichée à l'étape 3 (langue + éventuels édits) — pour l'export */
  descriptionExport?:  string
  seoTagsInDescription: string[]  // tags déjà intégrés dans la description
  seoTagsExtra:        string[]   // tags supplémentaires à ajouter optionnellement
  infosManquantes:     string[]   // ex: ['composition', 'taille'] si l'IA a des doutes
  tailleEquivalences:  string     // ex: "48 EU = M/L" ou "" si non applicable
  hashtagsFR:          string     // hashtags en langue native, ex: "#BlazerKenzo #LinGris #Homme"
  hashtagsEN:          string     // hashtags en anglais,       ex: "#KenzoBlazer #LinenGrey #Men"
}

/* ─── Étape 4 — Calcul du prix ──────────────────────────────────────────── */

export interface PriceResult {
  /* BLOC 1 — prix recommandé */
  prixSuggere: number
  confidence:  'high' | 'medium' | 'low'
  raisonnement: string
  /* true = pas assez de données — afficher champ libre dans l'UI */
  noData?:      boolean
  /* Prix neuf de référence utilisé pour le calcul (référentiel ou prix saisi) */
  prixNeuf?:    number | null
  /* Champ interne — NE PAS afficher dans l'UI */
  brand_segment?: BrandSegment

  /* BLOC 2 — données marché (null si non trouvé) */
  marche: {
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
  skipWebSearch?: boolean
  existingMarche?: PriceResult['marche']
}
