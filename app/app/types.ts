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

export interface ExtraInfo {
  prixAchatNeuf?: number
  missingInfos:   { label: string; value: string }[]
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
  categorie:     RecognitionField<string>
  sousCategorie: RecognitionField<string>
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
  brand_segment?: 'standard' | 'luxe_accessible' | 'luxe_premium'
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
  /* Champ interne — NE PAS afficher dans l'UI */
  brand_segment?: 'standard' | 'luxe_accessible' | 'luxe_premium'

  /* BLOC 2 — données marché (null si non trouvé) */
  marche: {
    prixNeufMarque:    string | null   // chiffres seuls, ex: "300" ou "250-350"
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
  skipWebSearch?: boolean
  existingMarche?: PriceResult['marche']
}
