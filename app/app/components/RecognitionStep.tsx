'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import {
  Loader2, RefreshCw, CheckCircle2, AlertTriangle,
  XCircle, Pencil, AlertCircle, ScanLine, Check, Plus, X,
} from 'lucide-react'
import type { PhotoSlot, RecognitionResult, RecognitionField, Confidence, ExtraInfo } from '../types'
import {
  SIZES, COLORS, MATERIALS, CONDITIONS, STYLES, PATTERNS,
  tx, GENRE_LABELS, CONDITION_LABELS, COLOR_LABELS, MATERIAL_LABELS,
  STYLE_LABELS, PATTERN_LABELS,
} from '@/lib/vinted-taxonomy'
import type { SizeSystem } from '@/lib/vinted-taxonomy'
import { getN1List, getN2List, getN3List, getN4List, getN5List, parseVintedPath } from '@/lib/vinted-navigation-taxonomy'
import { useLang } from '@/app/providers'
import type { Lang } from '@/lib/i18n'

/* ─── Traductions UI — 7 langues ─────────────────────────────────────────── */

const UI_I18N: Record<Lang, {
  /* ConfidenceBadge */
  high: string; medium: string; low: string; manual: string
  /* Loading */
  analyzing: string; analyzingSub: string
  /* Error */
  analysisFailed: string; retry: string; analysisError: string
  /* Header */
  autoRecognition: string; autoRecognitionSub: string; rerun: string
  /* Legend */
  confidence: string
  /* Sections */
  sectionArticle: string; sectionChars: string; sectionFlaws: string; sectionExtra: string
  /* Field labels */
  brand: string; gender: string; category: string; subCategory: string
  size: string; condition: string; colors: string; materials: string
  style: string; pattern: string; flaws: string; retailPrice: string
  /* Defect */
  defectDetected: string
  /* Extra info sub-sections */
  generalInfo: string; dimensions: string
  /* Summary */
  summary: string
  /* Choose option */
  choose: string
  /* Subcategory hint (bookmarklet auto-select warning) */
  subcategoryHint: string
  /* Add to desc */
  addToDesc: string; addMeasure: string; other: string
  /* Placeholder */
  infoValue: string; measureName: string; measureValue: string
}> = {
  fr: {
    high: 'Élevée', medium: 'Moyenne', low: 'Incertaine', manual: 'Modifié',
    analyzing: 'Analyse en cours…',
    analyzingSub: "L'IA examine vos photos pour identifier la marque, la taille, les couleurs et plus encore.",
    analysisFailed: 'Analyse impossible', retry: 'Réessayer',
    analysisError: "L'analyse a échoué. Vérifiez votre connexion et réessayez.",
    autoRecognition: 'Reconnaissance automatique',
    autoRecognitionSub: "L'IA a pré-rempli les champs ci-dessous. Corrigez si nécessaire.",
    rerun: 'Relancer',
    confidence: 'Confiance :',
    sectionArticle: 'Article', sectionChars: 'Caractéristiques',
    sectionFlaws: 'Défauts visibles', sectionExtra: 'Informations complémentaires',
    brand: 'Marque', gender: 'Genre', category: 'Catégorie', subCategory: 'Sous-catégorie',
    size: 'Taille', condition: 'État', colors: 'Couleurs (max 2)', materials: 'Matières (max 3)',
    style: 'Style', pattern: 'Motif', flaws: 'Description des défauts', retailPrice: 'Prix neuf',
    defectDetected: 'Défaut détecté — confirmez',
    generalInfo: 'Infos générales', dimensions: 'Dimensions (optionnel)',
    summary: 'Récapitulatif',
    choose: '— Choisir —',
    subcategoryHint: 'Vérifiez la sous-catégorie précise sur Vinted après le remplissage automatique',
    addToDesc: 'Ajouter à la description', addMeasure: 'Ajouter une mesure personnalisée', other: 'Autre',
    infoValue: 'Valeur…', measureName: 'Nom de la mesure…', measureValue: 'cm',
  },
  en: {
    high: 'High', medium: 'Medium', low: 'Uncertain', manual: 'Edited',
    analyzing: 'Analyzing…',
    analyzingSub: 'AI is examining your photos to identify the brand, size, colors and more.',
    analysisFailed: 'Analysis failed', retry: 'Retry',
    analysisError: 'Analysis failed. Check your connection and try again.',
    autoRecognition: 'Automatic recognition',
    autoRecognitionSub: 'AI has pre-filled the fields below. Correct if needed.',
    rerun: 'Re-run',
    confidence: 'Confidence:',
    sectionArticle: 'Item', sectionChars: 'Characteristics',
    sectionFlaws: 'Visible flaws', sectionExtra: 'Additional information',
    brand: 'Brand', gender: 'Gender', category: 'Category', subCategory: 'Sub-category',
    size: 'Size', condition: 'Condition', colors: 'Colors (max 2)', materials: 'Materials (max 3)',
    style: 'Style', pattern: 'Pattern', flaws: 'Flaw description', retailPrice: 'Retail price',
    defectDetected: 'Flaw detected — please confirm',
    generalInfo: 'General info', dimensions: 'Dimensions (optional)',
    summary: 'Summary',
    choose: '— Choose —',
    subcategoryHint: 'Check the exact subcategory on Vinted after auto-fill',
    addToDesc: 'Add to description', addMeasure: 'Add custom measurement', other: 'Other',
    infoValue: 'Value…', measureName: 'Measurement name…', measureValue: 'cm',
  },
  es: {
    high: 'Alta', medium: 'Media', low: 'Incierta', manual: 'Editado',
    analyzing: 'Analizando…',
    analyzingSub: 'La IA examina tus fotos para identificar la marca, la talla, los colores y más.',
    analysisFailed: 'Análisis imposible', retry: 'Reintentar',
    analysisError: 'El análisis falló. Verifica tu conexión e inténtalo de nuevo.',
    autoRecognition: 'Reconocimiento automático',
    autoRecognitionSub: 'La IA ha rellenado los campos a continuación. Corrige si es necesario.',
    rerun: 'Relanzar',
    confidence: 'Confianza:',
    sectionArticle: 'Artículo', sectionChars: 'Características',
    sectionFlaws: 'Defectos visibles', sectionExtra: 'Información adicional',
    brand: 'Marca', gender: 'Género', category: 'Categoría', subCategory: 'Subcategoría',
    size: 'Talla', condition: 'Estado', colors: 'Colores (máx 2)', materials: 'Materiales (máx 3)',
    style: 'Estilo', pattern: 'Motivo', flaws: 'Descripción de defectos', retailPrice: 'Precio nuevo',
    defectDetected: 'Defecto detectado — confirma',
    generalInfo: 'Información general', dimensions: 'Dimensiones (opcional)',
    summary: 'Resumen',
    choose: '— Elegir —',
    subcategoryHint: 'Verifica la subcategoría exacta en Vinted tras el relleno automático',
    addToDesc: 'Añadir a la descripción', addMeasure: 'Añadir medida personalizada', other: 'Otro',
    infoValue: 'Valor…', measureName: 'Nombre de la medida…', measureValue: 'cm',
  },
  de: {
    high: 'Hoch', medium: 'Mittel', low: 'Unsicher', manual: 'Bearbeitet',
    analyzing: 'Analyse läuft…',
    analyzingSub: 'Die KI untersucht deine Fotos, um Marke, Größe, Farben und mehr zu erkennen.',
    analysisFailed: 'Analyse fehlgeschlagen', retry: 'Erneut versuchen',
    analysisError: 'Die Analyse ist fehlgeschlagen. Überprüfe deine Verbindung und versuche es erneut.',
    autoRecognition: 'Automatische Erkennung',
    autoRecognitionSub: 'Die KI hat die Felder unten vorausgefüllt. Korrigiere bei Bedarf.',
    rerun: 'Erneut starten',
    confidence: 'Konfidenz:',
    sectionArticle: 'Artikel', sectionChars: 'Eigenschaften',
    sectionFlaws: 'Sichtbare Mängel', sectionExtra: 'Zusätzliche Informationen',
    brand: 'Marke', gender: 'Geschlecht', category: 'Kategorie', subCategory: 'Unterkategorie',
    size: 'Größe', condition: 'Zustand', colors: 'Farben (max 2)', materials: 'Materialien (max 3)',
    style: 'Stil', pattern: 'Muster', flaws: 'Mängelbeschreibung', retailPrice: 'Neupreis',
    defectDetected: 'Mangel erkannt — bitte bestätigen',
    generalInfo: 'Allgemeine Infos', dimensions: 'Maße (optional)',
    summary: 'Zusammenfassung',
    choose: '— Wählen —',
    subcategoryHint: 'Überprüfe die genaue Unterkategorie auf Vinted nach dem automatischen Ausfüllen',
    addToDesc: 'Zur Beschreibung hinzufügen', addMeasure: 'Benutzerdefiniertes Maß hinzufügen', other: 'Sonstiges',
    infoValue: 'Wert…', measureName: 'Maßbezeichnung…', measureValue: 'cm',
  },
  it: {
    high: 'Alta', medium: 'Media', low: 'Incerta', manual: 'Modificato',
    analyzing: 'Analisi in corso…',
    analyzingSub: "L'IA esamina le tue foto per identificare marca, taglia, colori e altro.",
    analysisFailed: 'Analisi impossibile', retry: 'Riprova',
    analysisError: "L'analisi è fallita. Controlla la connessione e riprova.",
    autoRecognition: 'Riconoscimento automatico',
    autoRecognitionSub: "L'IA ha precompilato i campi qui sotto. Correggi se necessario.",
    rerun: 'Riavvia',
    confidence: 'Affidabilità:',
    sectionArticle: 'Articolo', sectionChars: 'Caratteristiche',
    sectionFlaws: 'Difetti visibili', sectionExtra: 'Informazioni aggiuntive',
    brand: 'Marca', gender: 'Genere', category: 'Categoria', subCategory: 'Sottocategoria',
    size: 'Taglia', condition: 'Stato', colors: 'Colori (max 2)', materials: 'Materiali (max 3)',
    style: 'Stile', pattern: 'Motivo', flaws: 'Descrizione difetti', retailPrice: 'Prezzo nuovo',
    defectDetected: 'Difetto rilevato — conferma',
    generalInfo: 'Info generali', dimensions: 'Dimensioni (opzionale)',
    summary: 'Riepilogo',
    choose: '— Scegli —',
    subcategoryHint: 'Verifica la sottocategoria esatta su Vinted dopo il riempimento automatico',
    addToDesc: 'Aggiungi alla descrizione', addMeasure: 'Aggiungi misura personalizzata', other: 'Altro',
    infoValue: 'Valore…', measureName: 'Nome della misura…', measureValue: 'cm',
  },
  nl: {
    high: 'Hoog', medium: 'Gemiddeld', low: 'Onzeker', manual: 'Bewerkt',
    analyzing: 'Analyse bezig…',
    analyzingSub: "AI onderzoekt je foto's om merk, maat, kleuren en meer te identificeren.",
    analysisFailed: 'Analyse mislukt', retry: 'Opnieuw proberen',
    analysisError: 'De analyse is mislukt. Controleer je verbinding en probeer opnieuw.',
    autoRecognition: 'Automatische herkenning',
    autoRecognitionSub: 'AI heeft de onderstaande velden ingevuld. Corrigeer indien nodig.',
    rerun: 'Opnieuw starten',
    confidence: 'Betrouwbaarheid:',
    sectionArticle: 'Artikel', sectionChars: 'Kenmerken',
    sectionFlaws: 'Zichtbare gebreken', sectionExtra: 'Aanvullende informatie',
    brand: 'Merk', gender: 'Geslacht', category: 'Categorie', subCategory: 'Subcategorie',
    size: 'Maat', condition: 'Staat', colors: "Kleuren (max 2)", materials: 'Materialen (max 3)',
    style: 'Stijl', pattern: 'Motief', flaws: 'Beschrijving gebreken', retailPrice: 'Nieuwprijs',
    defectDetected: 'Gebrek gedetecteerd — bevestig',
    generalInfo: 'Algemene info', dimensions: 'Afmetingen (optioneel)',
    summary: 'Samenvatting',
    choose: '— Kies —',
    subcategoryHint: 'Controleer de exacte subcategorie op Vinted na het automatisch invullen',
    addToDesc: 'Toevoegen aan beschrijving', addMeasure: 'Aangepaste meting toevoegen', other: 'Overig',
    infoValue: 'Waarde…', measureName: 'Naam meting…', measureValue: 'cm',
  },
  pl: {
    high: 'Wysoka', medium: 'Średnia', low: 'Niepewna', manual: 'Edytowano',
    analyzing: 'Analiza w toku…',
    analyzingSub: 'AI analizuje Twoje zdjęcia, aby zidentyfikować markę, rozmiar, kolory i więcej.',
    analysisFailed: 'Analiza niemożliwa', retry: 'Spróbuj ponownie',
    analysisError: 'Analiza nie powiodła się. Sprawdź połączenie i spróbuj ponownie.',
    autoRecognition: 'Automatyczne rozpoznawanie',
    autoRecognitionSub: 'AI wstępnie wypełniło pola poniżej. Popraw, jeśli to konieczne.',
    rerun: 'Uruchom ponownie',
    confidence: 'Pewność:',
    sectionArticle: 'Artykuł', sectionChars: 'Cechy',
    sectionFlaws: 'Widoczne wady', sectionExtra: 'Dodatkowe informacje',
    brand: 'Marka', gender: 'Płeć', category: 'Kategoria', subCategory: 'Podkategoria',
    size: 'Rozmiar', condition: 'Stan', colors: 'Kolory (maks 2)', materials: 'Materiały (maks 3)',
    style: 'Styl', pattern: 'Wzór', flaws: 'Opis wad', retailPrice: 'Cena nowa',
    defectDetected: 'Wykryto wadę — potwierdź',
    generalInfo: 'Informacje ogólne', dimensions: 'Wymiary (opcjonalnie)',
    summary: 'Podsumowanie',
    choose: '— Wybierz —',
    subcategoryHint: 'Sprawdź dokładną podkategorię na Vinted po automatycznym wypełnieniu',
    addToDesc: 'Dodaj do opisu', addMeasure: 'Dodaj niestandardowy pomiar', other: 'Inne',
    infoValue: 'Wartość…', measureName: 'Nazwa pomiaru…', measureValue: 'cm',
  },
}

/* ─── Presets infos complémentaires + dimensions — 7 langues ─────────────── */

const EXTRA_INFO_PRESETS_I18N: Record<Lang, string[]> = {
  fr: ['Pays de fabrication', 'Doublure', 'Référence produit', 'Type de fermeture', 'Saison', 'Remarques'],
  en: ['Country of origin', 'Lining', 'Product reference', 'Closure type', 'Season', 'Notes'],
  es: ['País de fabricación', 'Forro', 'Referencia del producto', 'Tipo de cierre', 'Temporada', 'Observaciones'],
  de: ['Herstellungsland', 'Futter', 'Produktreferenz', 'Verschlusstyp', 'Saison', 'Bemerkungen'],
  it: ['Paese di fabbricazione', 'Fodera', 'Riferimento prodotto', 'Tipo di chiusura', 'Stagione', 'Note'],
  nl: ['Land van herkomst', 'Voering', 'Productreferentie', 'Type sluiting', 'Seizoen', 'Opmerkingen'],
  pl: ['Kraj produkcji', 'Podszewka', 'Numer referencyjny', 'Typ zamknięcia', 'Sezon', 'Uwagi'],
}

const DIM_PRESETS_I18N: Record<Lang, { fr: string; en: string }[]> = {
  fr: [
    { fr: 'Tour de poitrine', en: 'Chest' },
    { fr: 'Longueur', en: 'Length' },
    { fr: 'Épaules', en: 'Shoulders' },
    { fr: 'Tour de taille', en: 'Waist' },
    { fr: 'Tour de hanches', en: 'Hips' },
    { fr: 'Entrejambe', en: 'Inseam' },
    { fr: 'Pointure', en: 'Shoe size' },
    { fr: 'Largeur', en: 'Width' },
    { fr: 'Hauteur', en: 'Height' },
    { fr: 'Profondeur', en: 'Depth' },
  ],
  en: [
    { fr: 'Chest', en: 'Chest' },
    { fr: 'Length', en: 'Length' },
    { fr: 'Shoulders', en: 'Shoulders' },
    { fr: 'Waist', en: 'Waist' },
    { fr: 'Hips', en: 'Hips' },
    { fr: 'Inseam', en: 'Inseam' },
    { fr: 'Shoe size', en: 'Shoe size' },
    { fr: 'Width', en: 'Width' },
    { fr: 'Height', en: 'Height' },
    { fr: 'Depth', en: 'Depth' },
  ],
  es: [
    { fr: 'Pecho', en: 'Chest' },
    { fr: 'Longitud', en: 'Length' },
    { fr: 'Hombros', en: 'Shoulders' },
    { fr: 'Cintura', en: 'Waist' },
    { fr: 'Caderas', en: 'Hips' },
    { fr: 'Entrepierna', en: 'Inseam' },
    { fr: 'Número', en: 'Shoe size' },
    { fr: 'Anchura', en: 'Width' },
    { fr: 'Altura', en: 'Height' },
    { fr: 'Profundidad', en: 'Depth' },
  ],
  de: [
    { fr: 'Brustumfang', en: 'Chest' },
    { fr: 'Länge', en: 'Length' },
    { fr: 'Schultern', en: 'Shoulders' },
    { fr: 'Taillenumfang', en: 'Waist' },
    { fr: 'Hüftumfang', en: 'Hips' },
    { fr: 'Schrittlänge', en: 'Inseam' },
    { fr: 'Schuhgröße', en: 'Shoe size' },
    { fr: 'Breite', en: 'Width' },
    { fr: 'Höhe', en: 'Height' },
    { fr: 'Tiefe', en: 'Depth' },
  ],
  it: [
    { fr: 'Petto', en: 'Chest' },
    { fr: 'Lunghezza', en: 'Length' },
    { fr: 'Spalle', en: 'Shoulders' },
    { fr: 'Vita', en: 'Waist' },
    { fr: 'Fianchi', en: 'Hips' },
    { fr: 'Cavallo', en: 'Inseam' },
    { fr: 'Numero scarpa', en: 'Shoe size' },
    { fr: 'Larghezza', en: 'Width' },
    { fr: 'Altezza', en: 'Height' },
    { fr: 'Profondità', en: 'Depth' },
  ],
  nl: [
    { fr: 'Borstomtrek', en: 'Chest' },
    { fr: 'Lengte', en: 'Length' },
    { fr: 'Schouders', en: 'Shoulders' },
    { fr: 'Tailleomtrek', en: 'Waist' },
    { fr: 'Heupomtrek', en: 'Hips' },
    { fr: 'Beenlengte', en: 'Inseam' },
    { fr: 'Schoenmaat', en: 'Shoe size' },
    { fr: 'Breedte', en: 'Width' },
    { fr: 'Hoogte', en: 'Height' },
    { fr: 'Diepte', en: 'Depth' },
  ],
  pl: [
    { fr: 'Obwód klatki piersiowej', en: 'Chest' },
    { fr: 'Długość', en: 'Length' },
    { fr: 'Ramiona', en: 'Shoulders' },
    { fr: 'Obwód talii', en: 'Waist' },
    { fr: 'Obwód bioder', en: 'Hips' },
    { fr: 'Długość kroku', en: 'Inseam' },
    { fr: 'Rozmiar buta', en: 'Shoe size' },
    { fr: 'Szerokość', en: 'Width' },
    { fr: 'Wysokość', en: 'Height' },
    { fr: 'Głębokość', en: 'Depth' },
  ],
}

/* ─── Labels affichés pour chaque système de taille — 7 langues ─────────── */

const SYSTEM_LABELS_I18N: Record<Lang, Record<string, string>> = {
  fr: { letters: 'Lettres', eu_femme: 'EU femme', eu_homme: 'EU homme', jeans: 'Jeans', pointures: 'Pointures', enfant_age: 'Âge', enfant_cm: 'cm', one_size: 'Taille unique', none: 'Sans taille' },
  en: { letters: 'Letters', eu_femme: 'EU women', eu_homme: 'EU men',   jeans: 'Jeans', pointures: 'Shoe sizes', enfant_age: 'Age', enfant_cm: 'cm', one_size: 'One size',     none: 'No size'    },
  es: { letters: 'Letras',  eu_femme: 'EU mujer', eu_homme: 'EU hombre',jeans: 'Jeans', pointures: 'Tallas zapato', enfant_age: 'Edad', enfant_cm: 'cm', one_size: 'Talla única', none: 'Sin talla' },
  de: { letters: 'Buchstaben', eu_femme: 'EU Damen', eu_homme: 'EU Herren', jeans: 'Jeans', pointures: 'Schuhgrößen', enfant_age: 'Alter', enfant_cm: 'cm', one_size: 'Einheitsgröße', none: 'Ohne Größe' },
  it: { letters: 'Lettere', eu_femme: 'EU donna', eu_homme: 'EU uomo',  jeans: 'Jeans', pointures: 'Taglie scarpe', enfant_age: 'Età', enfant_cm: 'cm', one_size: 'Taglia unica', none: 'Senza taglia' },
  nl: { letters: 'Letters', eu_femme: 'EU dames',  eu_homme: 'EU heren', jeans: 'Jeans', pointures: 'Schoenmaten', enfant_age: 'Leeftijd', enfant_cm: 'cm', one_size: 'One size', none: 'Geen maat' },
  pl: { letters: 'Litery',  eu_femme: 'EU damskie',eu_homme: 'EU męskie',jeans: 'Jeans', pointures: 'Rozmiary butów', enfant_age: 'Wiek', enfant_cm: 'cm', one_size: 'Jeden rozmiar', none: 'Bez rozmiaru' },
}

/* ─── Keep DIM_PRESETS_FR / DIM_PRESETS_EN for the validateDimension helper ─ */

const DIM_PRESETS_FR = [
  'Tour de poitrine', 'Longueur', 'Épaules', 'Tour de taille',
  'Tour de hanches', 'Entrejambe', 'Pointure', 'Largeur', 'Hauteur', 'Profondeur',
]

const DIM_PRESETS_EN = [
  'Chest', 'Length', 'Shoulders', 'Waist',
  'Hips', 'Inseam', 'Shoe size', 'Width', 'Height', 'Depth',
]

/* ─── Presets infos complémentaires — clés françaises internes ───────────── */
const EXTRA_INFO_PRESETS = EXTRA_INFO_PRESETS_I18N.fr

/* ─── SYSTEM_LABELS conservé pour compat ─────────────────────────────────── */
const SYSTEM_LABELS: Record<string, string> = {
  letters: 'Lettres', eu_femme: 'EU femme', eu_homme: 'EU homme', jeans: 'Jeans',
  pointures: 'Pointures', enfant_age: 'Âge', enfant_cm: 'cm', one_size: 'Taille unique', none: 'Sans taille',
}

/* ─── Props ──────────────────────────────────────────────────────────────── */

interface Props {
  slots: PhotoSlot[]
  result: RecognitionResult | null
  setResult: (r: RecognitionResult) => void
}

/* ─── Badge confiance ────────────────────────────────────────────────────── */

interface ConfidenceBadgeProps {
  confidence: Confidence
  labels?: { high: string; medium: string; low: string; manual: string }
}

function ConfidenceBadge({ confidence, labels }: ConfidenceBadgeProps) {
  const { lang } = useLang()
  const l = labels ?? (UI_I18N[lang] ?? UI_I18N.fr)
  const map: Record<Confidence, { label: string; className: string; Icon: React.ElementType }> = {
    high:   { label: l.high,   className: 'bg-green-50 text-green-700 border-green-200',   Icon: CheckCircle2    },
    medium: { label: l.medium, className: 'bg-orange-50 text-orange-700 border-orange-200', Icon: AlertTriangle   },
    low:    { label: l.low,    className: 'bg-red-50 text-red-700 border-red-200',          Icon: XCircle         },
    manual: { label: l.manual, className: 'bg-gray-50 text-gray-500 border-gray-200',       Icon: Pencil          },
  }
  const { label, className, Icon } = map[confidence]
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-md border ${className}`}>
      <Icon className="w-2.5 h-2.5" />
      {label}
    </span>
  )
}

/* ─── Redimensionnement + conversion base64 (max 1024px, <3 Mo) ─────────── */

async function resizeAndEncode(file: File, maxPx = 1024): Promise<{ base64: string; mediaType: string }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const objectUrl = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(objectUrl)
      const scale = Math.min(1, maxPx / Math.max(img.width, img.height))
      const w = Math.round(img.width * scale)
      const h = Math.round(img.height * scale)

      const canvas = document.createElement('canvas')
      canvas.width  = w
      canvas.height = h
      canvas.getContext('2d')!.drawImage(img, 0, 0, w, h)

      canvas.toBlob(blob => {
        if (!blob) { reject(new Error('canvas toBlob failed')); return }
        const reader = new FileReader()
        reader.onload = () => {
          const dataUrl = reader.result as string
          const [header, b64] = dataUrl.split(',')
          const mediaType = header.match(/:(.*?);/)?.[1] ?? 'image/jpeg'
          resolve({ base64: b64, mediaType })
        }
        reader.onerror = reject
        reader.readAsDataURL(blob)
      }, 'image/jpeg', 0.85)
    }

    img.onerror = reject
    img.src = objectUrl
  })
}

/* ─── Normalisation des niveaux de confiance ─────────────────────────────── */
/* Garantit qu'un champ vide ne peut jamais avoir confidence "high" ou "medium" */

function normalizeConfidence(result: RecognitionResult): RecognitionResult {
  function fix<T>(field: RecognitionField<T>): RecognitionField<T> {
    const empty = Array.isArray(field.value)
      ? (field.value as unknown[]).length === 0
      : !field.value
    if (empty && field.confidence !== 'manual') return { value: field.value, confidence: 'low' }
    return field
  }
  return {
    marque:        fix(result.marque),
    genre:         fix(result.genre),
    vintedPath:    fix(result.vintedPath),
    taille:        fix(result.taille),
    tailleSysteme: fix(result.tailleSysteme),
    etat:          fix(result.etat),
    couleurs:      fix(result.couleurs),
    matieres:      fix(result.matieres),
    style:         fix(result.style),
    motif:         fix(result.motif),
    defauts:       fix(result.defauts),
    /* brand_segment : champ interne transmis au pricing, jamais affiché ici */
    ...(result.brand_segment ? { brand_segment: result.brand_segment } : {}),
  }
}

/* ─── Hook appel API reconnaissance ─────────────────────────────────────── */

function useRecognition(slots: PhotoSlot[], result: RecognitionResult | null, setResult: (r: RecognitionResult) => void) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const ranRef = useRef(false)
  const { lang } = useLang()

  const run = useCallback(async () => {
    /* Collecte les photos : vues principales + étiquettes (slots 9, 10, 11) */
    const targets = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const filled = targets.map(i => slots[i]).filter(s => s.file !== null)

    if (filled.length === 0) {
      setError('Aucune photo disponible pour l\'analyse.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      /* Utilise la photo retouchée (fond supprimé) pour slot 0 si dispo */
      const images = await Promise.all(
        filled.map(async (slot) => {
          if (slot.id === 0 && slot.processedUrl) {
            const res = await fetch(slot.processedUrl)
            const blob = await res.blob()
            const f = new File([blob], 'slot0.png', { type: blob.type })
            const encoded = await resizeAndEncode(f)
            return { ...encoded, slotId: slot.id }
          }
          const encoded = await resizeAndEncode(slot.file!)
          return { ...encoded, slotId: slot.id }
        })
      )

      const res = await fetch('/api/recognize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images, locale: lang }),
      })

      if (!res.ok) throw new Error('Erreur serveur')
      const data: RecognitionResult = await res.json()
      /* Normalise les niveaux de confiance avant de stocker le résultat */
      setResult(normalizeConfidence(data))
    } catch {
      setError('L\'analyse a échoué. Vérifiez votre connexion et réessayez.')
    } finally {
      setLoading(false)
    }
  }, [slots, setResult, lang])

  /* Auto-déclenchement au premier rendu si pas encore de résultat */
  useEffect(() => {
    if (!ranRef.current && !result) {
      ranRef.current = true
      run()
    }
  }, [run, result])

  return { loading, error, retry: run }
}

/* ─── Composant champ éditable ───────────────────────────────────────────── */

interface FieldProps {
  label: string
  confidence: Confidence
  children: React.ReactNode
  required?: boolean
}

function Field({ label, confidence, children, required }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
          {label}
          {required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
        <ConfidenceBadge confidence={confidence} />
      </div>
      {children}
    </div>
  )
}

/* ─── Classes input partagées ────────────────────────────────────────────── */

const inputCls = (conf: Confidence) => {
  const border = conf === 'low' ? 'border-red-200 focus:border-red-400 focus:ring-red-100'
    : conf === 'medium' ? 'border-orange-200 focus:border-orange-400 focus:ring-orange-100'
    : conf === 'manual' ? 'border-gray-200 focus:border-gray-400 focus:ring-gray-100'
    : 'border-green-200 focus:border-green-400 focus:ring-green-100'
  return `w-full rounded-xl border px-3 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 transition-colors ${border}`
}

/* ─── Composant principal ────────────────────────────────────────────────── */

export default function RecognitionStep({ slots, result, setResult }: Props) {
  const { lang } = useLang()
  const ui = UI_I18N[lang] ?? UI_I18N.fr
  const dimPresets = DIM_PRESETS_I18N[lang] ?? DIM_PRESETS_I18N.fr
  const extraPresets = EXTRA_INFO_PRESETS_I18N[lang] ?? EXTRA_INFO_PRESETS_I18N.fr
  const { loading, error, retry } = useRecognition(slots, result, setResult)

  /* ── State infos complémentaires ── */
  const [openExtraFields, setOpenExtraFields]   = useState<string[]>([])
  const [extraFieldInputs, setExtraFieldInputs] = useState<Record<string, string>>({})
  const [customExtraRows, setCustomExtraRows]   = useState<{ id: number; nom: string; value: string }[]>([])
  const [prixNeuf, setPrixNeuf]                 = useState('')
  const [openDimFields, setOpenDimFields]       = useState<string[]>([])
  const [dimInputs, setDimInputs]               = useState<Record<string, string>>({})
  const [customDimRows, setCustomDimRows]       = useState<{ id: number; nom: string; valeur: string }[]>([])

  /* ── Sauvegarde dans result.extraInfo ── */
  function saveExtraInfo(patch: Partial<ExtraInfo>) {
    if (!result) return
    const cur = result.extraInfo ?? { missingInfos: [], dimensions: [] }
    setResult({ ...result, extraInfo: { ...cur, ...patch } })
  }

  function validateMissingInfo(label: string) {
    const value = (extraFieldInputs[label] ?? '').trim()
    if (!value) return
    const cur = result?.extraInfo?.missingInfos ?? []
    saveExtraInfo({ missingInfos: [...cur.filter(i => i.label !== label), { label, value }] })
    setOpenExtraFields(prev => prev.filter(f => f !== label))
  }

  function removeValidatedInfo(label: string) {
    saveExtraInfo({ missingInfos: (result?.extraInfo?.missingInfos ?? []).filter(i => i.label !== label) })
  }

  function validateDimension(nom: string, nomEN: string) {
    const value = (dimInputs[nom] ?? '').trim()
    if (!value) return
    const cur = result?.extraInfo?.dimensions ?? []
    saveExtraInfo({ dimensions: [...cur.filter(d => d.nom !== nom), { nom, nomEN, valeur: value }] })
    setOpenDimFields(prev => prev.filter(f => f !== nom))
  }

  function removeValidatedDim(nom: string) {
    saveExtraInfo({ dimensions: (result?.extraInfo?.dimensions ?? []).filter(d => d.nom !== nom) })
  }

  function addCustomExtraRow() {
    setCustomExtraRows(prev => [...prev, { id: Date.now(), nom: '', value: '' }])
  }

  function validateCustomExtraRow(id: number) {
    const row = customExtraRows.find(r => r.id === id)
    if (!row || !row.nom.trim() || !row.value.trim()) return
    const cur = result?.extraInfo?.missingInfos ?? []
    saveExtraInfo({ missingInfos: [...cur.filter(i => i.label !== row.nom.trim()), { label: row.nom.trim(), value: row.value.trim() }] })
    setCustomExtraRows(prev => prev.filter(r => r.id !== id))
  }

  function removeCustomExtraRow(id: number) {
    setCustomExtraRows(prev => prev.filter(r => r.id !== id))
  }

  function addCustomDimRow() {
    setCustomDimRows(prev => [...prev, { id: Date.now(), nom: '', valeur: '' }])
  }

  function validateCustomDimRow(id: number) {
    const row = customDimRows.find(r => r.id === id)
    if (!row || !row.nom.trim() || !row.valeur.trim()) return
    const cur = result?.extraInfo?.dimensions ?? []
    saveExtraInfo({ dimensions: [...cur.filter(d => d.nom !== row.nom.trim()), { nom: row.nom.trim(), nomEN: row.nom.trim(), valeur: row.valeur.trim() }] })
    setCustomDimRows(prev => prev.filter(r => r.id !== id))
  }

  function removeCustomDimRow(id: number) {
    setCustomDimRows(prev => prev.filter(r => r.id !== id))
  }

  function validatePrixNeuf() {
    const val = parseFloat(prixNeuf)
    if (!val || val <= 0) return
    saveExtraInfo({ prixAchatNeuf: val })
  }

  /* ── Mise à jour d'un champ avec passage en 'manual' ── */
  function update<K extends Exclude<keyof RecognitionResult, 'extraInfo' | 'brand_segment'>>(
    key: K,
    value: RecognitionResult[K]['value'],
  ) {
    if (!result) return
    setResult({
      ...result,
      [key]: { value, confidence: 'manual' as Confidence },
    })
  }

  /* ─────────────────────────────────────────────────────────────────────── */
  /* ── État chargement ── */
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center">
          <Loader2 className="w-7 h-7 text-indigo-600 animate-spin" />
        </div>
        <div>
          <p className="font-display font-extrabold text-xl text-gray-900">{ui.analyzing}</p>
          <p className="text-sm text-gray-400 mt-1 max-w-xs">
            {ui.analyzingSub}
          </p>
        </div>
        <div className="flex gap-1.5 mt-2">
          {[0, 1, 2].map(i => (
            <span
              key={i}
              className="w-2 h-2 rounded-full bg-indigo-300 animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    )
  }

  /* ── État erreur ── */
  if (error && !result) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center">
          <AlertCircle className="w-7 h-7 text-red-500" />
        </div>
        <div>
          <p className="font-display font-extrabold text-xl text-gray-900">{ui.analysisFailed}</p>
          <p className="text-sm text-gray-400 mt-1 max-w-xs">{ui.analysisError}</p>
        </div>
        <button
          onClick={retry}
          className="flex items-center gap-2 bg-indigo-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-indigo-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          {ui.retry}
        </button>
      </div>
    )
  }

  if (!result) return null

  /* ── Parsing du chemin Vinted en niveaux N1-N5 ── */
  const { n1, n2, n3, n4, n5 } = parseVintedPath(result.vintedPath.value)
  const n2Options = n1 ? getN2List(n1) : []
  const n3Options = n1 && n2 ? getN3List(n1, n2) : []
  const n4Options = n1 && n2 && n3 ? getN4List(n1, n2, n3) : []
  const n5Options = n1 && n2 && n3 && n4 ? getN5List(n1, n2, n3, n4) : []

  /* Sizes for the dropdown: prefer the system that contains the recognized value
     so it is pre-selected; fall back to the first available system. */
  const tailleSizes = (() => {
    const systems = result.tailleSysteme.value.filter(s => s !== 'none' && s !== 'one_size') as SizeSystem[]
    for (const sys of systems) {
      const sizes = SIZES[sys] ?? []
      if (result.taille.value && sizes.includes(result.taille.value)) return sizes
    }
    return systems.length > 0 ? (SIZES[systems[0]] ?? []) : []
  })()

  /* ── Formulaire ── */
  return (
    <div className="max-w-2xl mx-auto">

      {/* ── En-tête ── */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center">
              <ScanLine className="w-4 h-4 text-indigo-600" />
            </div>
            <h2 className="font-display font-extrabold text-2xl text-gray-900">
              {ui.autoRecognition}
            </h2>
          </div>
          <p className="text-sm text-gray-400 ml-10">
            {ui.autoRecognitionSub}
          </p>
        </div>
        <button
          onClick={retry}
          className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-gray-600 transition-colors px-3 py-1.5 rounded-full hover:bg-gray-50 border border-gray-100 shrink-0"
        >
          <RefreshCw className="w-3 h-3" />
          {ui.rerun}
        </button>
      </div>

      {/* ── Légende confiance ── */}
      <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-gray-50 rounded-xl border border-gray-100">
        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mr-1">{ui.confidence}</span>
        {(['high', 'medium', 'low', 'manual'] as Confidence[]).map(c => (
          <ConfidenceBadge key={c} confidence={c} labels={ui} />
        ))}
      </div>

      <div className="space-y-6">

        {/* ── Section Article ── */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-5">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">{ui.sectionArticle}</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Marque */}
            <Field label={ui.brand} confidence={result.marque.confidence}>
              <input
                type="text"
                value={result.marque.value}
                onChange={e => update('marque', e.target.value)}
                placeholder="Ex: Zara, H&M, Nike…"
                className={inputCls(result.marque.confidence)}
              />
            </Field>

            {/* Genre */}
            <Field label={ui.gender} confidence={result.genre.confidence} required>
              <select
                value={result.genre.value}
                onChange={e => {
                  if (!result) return
                  setResult({
                    ...result,
                    genre: { value: e.target.value, confidence: 'manual' },
                    vintedPath: { value: '', confidence: 'manual' },
                    taille: { value: '', confidence: 'manual' },
                  })
                }}
                className={inputCls(result.genre.confidence)}
              >
                <option value="">{ui.choose}</option>
                {(['Femme', 'Homme', 'Enfant', 'Mixte', 'Maison', 'Électronique', 'Beauté', 'Sport'] as const).map(g => (
                  <option key={g} value={g}>{tx(GENRE_LABELS, lang, g)}</option>
                ))}
              </select>
            </Field>
          </div>

          {/* Catégorie — sélecteur en cascade N1 > N2 > N3 > N4 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* N1 */}
            <Field label={ui.category} confidence={result.vintedPath.confidence} required>
              <select
                value={n1}
                onChange={e => {
                  setResult({ ...result, vintedPath: { value: e.target.value, confidence: 'manual' }, taille: { value: '', confidence: 'manual' } })
                }}
                className={inputCls(result.vintedPath.confidence)}
              >
                <option value="">{ui.choose}</option>
                {getN1List().map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </Field>

            {/* N2 */}
            <Field label={ui.subCategory} confidence={result.vintedPath.confidence}>
              <select
                value={n2}
                disabled={n2Options.length === 0}
                onChange={e => {
                  setResult({ ...result, vintedPath: { value: n1 + ' > ' + e.target.value, confidence: 'manual' }, taille: { value: '', confidence: 'manual' } })
                }}
                className={inputCls(result.vintedPath.confidence)}
              >
                <option value="">{ui.choose}</option>
                {n2Options.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </Field>
          </div>

          {/* N3 + N4 */}
          {n2 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label={ui.subCategory} confidence={result.vintedPath.confidence}>
                <select
                  value={n3}
                  disabled={n3Options.length === 0}
                  onChange={e => {
                    setResult({ ...result, vintedPath: { value: n1 + ' > ' + n2 + ' > ' + e.target.value, confidence: 'manual' }, taille: { value: '', confidence: 'manual' } })
                  }}
                  className={inputCls(result.vintedPath.confidence)}
                >
                  <option value="">{ui.choose}</option>
                  {n3Options.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </Field>

              {n3 && n4Options.length > 0 && (
                <Field label={ui.subCategory} confidence={result.vintedPath.confidence}>
                  <select
                    value={n4}
                    onChange={e => {
                      setResult({ ...result, vintedPath: { value: n1 + ' > ' + n2 + ' > ' + n3 + ' > ' + e.target.value, confidence: 'manual' }, taille: { value: '', confidence: 'manual' } })
                    }}
                    className={inputCls(result.vintedPath.confidence)}
                  >
                    <option value="">{ui.choose}</option>
                    {n4Options.map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </Field>
              )}

              {n4 && n5Options.length > 0 && (
                <Field label={ui.subCategory} confidence={result.vintedPath.confidence}>
                  <select
                    value={n5}
                    onChange={e => {
                      setResult({ ...result, vintedPath: { value: n1 + ' > ' + n2 + ' > ' + n3 + ' > ' + n4 + ' > ' + e.target.value, confidence: 'manual' }, taille: { value: '', confidence: 'manual' } })
                    }}
                    className={inputCls(result.vintedPath.confidence)}
                  >
                    <option value="">{ui.choose}</option>
                    {n5Options.map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </Field>
              )}
            </div>
          )}

          {/* Avertissement : N3 terminal dans la taxonomie — le bookmarklet auto-sélectionnera le N4 si Vinted en affiche un */}
          {n3 && !n4 && n4Options.length === 0 && n5Options.length === 0 && (
            <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">{ui.subcategoryHint}</p>
            </div>
          )}
        </section>

        {/* ── Section Caractéristiques ── */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-5">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">{ui.sectionChars}</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Taille */}
            <Field label={ui.size} confidence={result.taille.confidence}>
              {tailleSizes.length > 0 ? (
                <select
                  value={result.taille.value}
                  onChange={e => update('taille', e.target.value)}
                  className={inputCls(result.taille.confidence)}
                >
                  <option value="">{ui.choose}</option>
                  {tailleSizes.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={result.taille.value}
                  onChange={e => update('taille', e.target.value)}
                  placeholder="Ex: M, 38, 40…"
                  className={inputCls(result.taille.confidence)}
                />
              )}
            </Field>

            {/* État */}
            <Field label={ui.condition} confidence={result.etat.confidence} required>
              <select
                value={result.etat.value}
                onChange={e => update('etat', e.target.value)}
                className={inputCls(result.etat.confidence)}
              >
                <option value="">{ui.choose}</option>
                {CONDITIONS.map(c => (
                  <option key={c.id} value={c.label}>{tx(CONDITION_LABELS, lang, c.label)}</option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Style */}
            <Field label={ui.style} confidence={result.style.confidence}>
              <select
                value={result.style.value}
                onChange={e => update('style', e.target.value)}
                className={inputCls(result.style.confidence)}
              >
                <option value="">{ui.choose}</option>
                {STYLES.map(s => (
                  <option key={s} value={s}>{tx(STYLE_LABELS, lang, s)}</option>
                ))}
              </select>
            </Field>

            {/* Motif */}
            <Field label={ui.pattern} confidence={result.motif.confidence}>
              <select
                value={result.motif.value}
                onChange={e => update('motif', e.target.value)}
                className={inputCls(result.motif.confidence)}
              >
                <option value="">{ui.choose}</option>
                {PATTERNS.map(p => (
                  <option key={p} value={p}>{tx(PATTERN_LABELS, lang, p)}</option>
                ))}
              </select>
            </Field>
          </div>

          {/* Couleurs — max 2, chips sélectionnables */}
          <Field label={ui.colors} confidence={result.couleurs.confidence} required>
            <div className="flex flex-wrap gap-1.5 p-3 bg-gray-50 rounded-xl border border-gray-100 min-h-[44px]">
              {COLORS.map(color => {
                const selected = result.couleurs.value.includes(color)
                const disabled = !selected && result.couleurs.value.length >= 2
                return (
                  <button
                    key={color}
                    type="button"
                    disabled={disabled}
                    onClick={() => {
                      const next = selected
                        ? result.couleurs.value.filter(c => c !== color)
                        : [...result.couleurs.value, color]
                      update('couleurs', next)
                    }}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full border transition-all ${
                      selected
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : disabled
                        ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600'
                    }`}
                  >
                    {tx(COLOR_LABELS, lang, color)}
                  </button>
                )
              })}
            </div>
          </Field>

          {/* Matières — max 3, chips sélectionnables */}
          <Field label={ui.materials} confidence={result.matieres.confidence}>
            <div className="flex flex-wrap gap-1.5 p-3 bg-gray-50 rounded-xl border border-gray-100 min-h-[44px]">
              {MATERIALS.map(mat => {
                const selected = result.matieres.value.includes(mat)
                const disabled = !selected && result.matieres.value.length >= 3
                return (
                  <button
                    key={mat}
                    type="button"
                    disabled={disabled}
                    onClick={() => {
                      const next = selected
                        ? result.matieres.value.filter(m => m !== mat)
                        : [...result.matieres.value, mat]
                      update('matieres', next)
                    }}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full border transition-all ${
                      selected
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : disabled
                        ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600'
                    }`}
                  >
                    {tx(MATERIAL_LABELS, lang, mat)}
                  </button>
                )
              })}
            </div>
          </Field>
        </section>

        {/* ── Section Défauts ── */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">{ui.sectionFlaws}</h3>

          {result.defauts.value ? (
            <div className="flex items-start gap-3 p-3.5 bg-orange-50 border border-orange-200 rounded-xl">
              <AlertTriangle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-orange-700 mb-1">{ui.defectDetected}</p>
                <p className="text-sm text-orange-800">{result.defauts.value}</p>
              </div>
            </div>
          ) : null}

          <Field label={ui.flaws} confidence={result.defauts.confidence}>
            <textarea
              value={result.defauts.value}
              onChange={e => update('defauts', e.target.value)}
              rows={3}
              placeholder="Ex: Légère décoloration sur l'épaule gauche, fil tiré sur la manche… (laisser vide si aucun défaut)"
              className={`${inputCls(result.defauts.confidence)} resize-none`}
            />
          </Field>
        </section>

        {/* ── Section Informations complémentaires ── */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-5">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">{ui.sectionExtra}</h3>

          {/* Bloc 1 — Infos générales */}
          <div className="space-y-3">
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">{ui.generalInfo}</p>

            <div className="flex flex-wrap gap-1.5">
              {EXTRA_INFO_PRESETS.map((label, idx) => {
                const validated    = result.extraInfo?.missingInfos?.find(i => i.label === label)
                const isOpen       = openExtraFields.includes(label)
                const displayLabel = extraPresets[idx] ?? label
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => {
                      if (validated) { removeValidatedInfo(label) }
                      else if (!isOpen) { setOpenExtraFields(prev => [...prev, label]) }
                    }}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full border transition-all ${
                      validated
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : isOpen
                        ? 'bg-orange-50 text-orange-600 border-orange-300'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'
                    }`}
                  >
                    {validated ? `✓ ${displayLabel} : ${validated.value}` : `+ ${displayLabel}`}
                  </button>
                )
              })}
              {(result.extraInfo?.missingInfos ?? [])
                .filter(i => !EXTRA_INFO_PRESETS.includes(i.label))
                .map(i => (
                  <button
                    key={i.label}
                    type="button"
                    onClick={() => removeValidatedInfo(i.label)}
                    className="text-xs font-semibold px-2.5 py-1 rounded-full border transition-all bg-green-50 text-green-700 border-green-200"
                  >
                    ✓ {i.label} : {i.value}
                  </button>
                ))
              }
              <button
                type="button"
                onClick={addCustomExtraRow}
                className="text-xs font-semibold px-2.5 py-1 rounded-full border bg-white text-gray-600 border-gray-200 hover:border-indigo-300 transition-all flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                {ui.other}
              </button>
            </div>

            {openExtraFields.map(label => {
              const idxFr = EXTRA_INFO_PRESETS.indexOf(label)
              const displayLabel = idxFr >= 0 ? (extraPresets[idxFr] ?? label) : label
              return (
              <div key={label} className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-600 shrink-0 w-32 truncate">{displayLabel}</span>
                <input
                  type="text"
                  value={extraFieldInputs[label] ?? ''}
                  onChange={e => setExtraFieldInputs(prev => ({ ...prev, [label]: e.target.value }))}
                  onKeyDown={e => e.key === 'Enter' && validateMissingInfo(label)}
                  placeholder={ui.infoValue}
                  className="flex-1 text-sm rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-colors"
                />
                <button
                  onClick={() => validateMissingInfo(label)}
                  disabled={!(extraFieldInputs[label] ?? '').trim()}
                  className="shrink-0 text-xs font-semibold px-3 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-200 disabled:cursor-not-allowed text-white rounded-xl transition-colors whitespace-nowrap"
                >
                  {ui.addToDesc}
                </button>
                <button onClick={() => setOpenExtraFields(prev => prev.filter(f => f !== label))} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              )
            })}

            {customExtraRows.map(row => (
              <div key={row.id} className="flex items-center gap-2">
                <input
                  type="text"
                  value={row.nom}
                  onChange={e => setCustomExtraRows(prev => prev.map(r => r.id === row.id ? { ...r, nom: e.target.value } : r))}
                  placeholder={ui.measureName}
                  className="w-32 text-sm rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-colors"
                />
                <input
                  type="text"
                  value={row.value}
                  onChange={e => setCustomExtraRows(prev => prev.map(r => r.id === row.id ? { ...r, value: e.target.value } : r))}
                  onKeyDown={e => e.key === 'Enter' && validateCustomExtraRow(row.id)}
                  placeholder={ui.infoValue}
                  className="flex-1 text-sm rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-colors"
                />
                <button
                  onClick={() => validateCustomExtraRow(row.id)}
                  disabled={!row.nom.trim() || !row.value.trim()}
                  className="shrink-0 text-xs font-semibold px-3 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-200 disabled:cursor-not-allowed text-white rounded-xl transition-colors whitespace-nowrap"
                >
                  {ui.addToDesc}
                </button>
                <button onClick={() => removeCustomExtraRow(row.id)} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}

            {/* Prix neuf */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-600 shrink-0 w-32">{ui.retailPrice}</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={prixNeuf}
                onChange={e => setPrixNeuf(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && validatePrixNeuf()}
                placeholder="Ex: 49.90"
                className={`flex-1 text-sm rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 transition-colors ${
                  result.extraInfo?.prixAchatNeuf
                    ? 'border-green-300 bg-green-50 focus:ring-green-100'
                    : 'border-gray-200 bg-white focus:ring-indigo-100 focus:border-indigo-400'
                }`}
              />
              <span className="text-xs text-gray-400 shrink-0">€</span>
              <button
                onClick={validatePrixNeuf}
                disabled={!parseFloat(prixNeuf)}
                className="shrink-0 w-8 h-8 flex items-center justify-center bg-green-500 hover:bg-green-600 disabled:bg-gray-200 disabled:cursor-not-allowed text-white rounded-xl transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Bloc 2 — Dimensions */}
          <div className="space-y-3 pt-4 border-t border-gray-100">
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">{ui.dimensions}</p>

            <div className="flex flex-wrap gap-1.5">
              {DIM_PRESETS_FR.map((nom, idx) => {
                const validated = result.extraInfo?.dimensions?.find(d => d.nom === nom)
                const isOpen    = openDimFields.includes(nom)
                const displayLabel = dimPresets[idx]?.fr ?? nom
                return (
                  <button
                    key={nom}
                    type="button"
                    onClick={() => {
                      if (validated) { removeValidatedDim(nom) }
                      else if (!isOpen) { setOpenDimFields(prev => [...prev, nom]) }
                    }}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full border transition-all ${
                      validated
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : isOpen
                        ? 'bg-orange-50 text-orange-600 border-orange-300'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'
                    }`}
                  >
                    {validated ? `✓ ${displayLabel} : ${validated.valeur} cm` : `+ ${displayLabel}`}
                  </button>
                )
              })}
              {(result.extraInfo?.dimensions ?? [])
                .filter(d => !DIM_PRESETS_FR.includes(d.nom))
                .map(d => (
                  <button
                    key={d.nom}
                    type="button"
                    onClick={() => removeValidatedDim(d.nom)}
                    className="text-xs font-semibold px-2.5 py-1 rounded-full border transition-all bg-green-50 text-green-700 border-green-200"
                  >
                    ✓ {d.nom} : {d.valeur} cm
                  </button>
                ))
              }
            </div>

            {openDimFields.map(nom => {
              const idx = DIM_PRESETS_FR.indexOf(nom)
              const displayLabel = idx >= 0 ? (dimPresets[idx]?.fr ?? nom) : nom
              const nomEN = DIM_PRESETS_EN[idx] ?? nom
              return (
              <div key={nom} className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-600 shrink-0 w-32 truncate">{displayLabel}</span>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={dimInputs[nom] ?? ''}
                  onChange={e => setDimInputs(prev => ({ ...prev, [nom]: e.target.value }))}
                  onKeyDown={e => {
                    if (e.key === 'Enter') validateDimension(nom, nomEN)
                  }}
                  placeholder={ui.measureValue}
                  className="flex-1 text-sm rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-colors"
                />
                <span className="text-xs text-gray-400 shrink-0">cm</span>
                <button
                  onClick={() => validateDimension(nom, nomEN)}
                  disabled={!(dimInputs[nom] ?? '').trim()}
                  className="shrink-0 text-xs font-semibold px-3 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-200 disabled:cursor-not-allowed text-white rounded-xl transition-colors whitespace-nowrap"
                >
                  {ui.addToDesc}
                </button>
                <button onClick={() => setOpenDimFields(prev => prev.filter(f => f !== nom))} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )
          })}

            {customDimRows.map(row => (
              <div key={row.id} className="flex items-center gap-2">
                <input
                  type="text"
                  value={row.nom}
                  onChange={e => setCustomDimRows(prev => prev.map(r => r.id === row.id ? { ...r, nom: e.target.value } : r))}
                  placeholder={ui.measureName}
                  className="w-32 text-sm rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-colors"
                />
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={row.valeur}
                  onChange={e => setCustomDimRows(prev => prev.map(r => r.id === row.id ? { ...r, valeur: e.target.value } : r))}
                  onKeyDown={e => e.key === 'Enter' && validateCustomDimRow(row.id)}
                  placeholder={ui.measureValue}
                  className="w-20 text-sm rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-colors"
                />
                <span className="text-xs text-gray-400 shrink-0">cm</span>
                <button
                  onClick={() => validateCustomDimRow(row.id)}
                  disabled={!row.nom.trim() || !row.valeur.trim()}
                  className="shrink-0 text-xs font-semibold px-3 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-200 disabled:cursor-not-allowed text-white rounded-xl transition-colors whitespace-nowrap"
                >
                  {ui.addToDesc}
                </button>
                <button onClick={() => removeCustomDimRow(row.id)} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addCustomDimRow}
              className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              {ui.addMeasure}
            </button>
          </div>
        </section>

        {/* ── Résumé de la sélection ── */}
        <div className="bg-indigo-50 rounded-2xl border border-indigo-100 p-5">
          <p className="text-xs font-semibold text-indigo-700 mb-2">{ui.summary}</p>
          <div className="flex flex-wrap gap-2">
            {[
              result.genre.value ? tx(GENRE_LABELS, lang, result.genre.value) : '',
              result.vintedPath.value ? result.vintedPath.value.split(' > ').pop() : '',
              result.marque.value,
              result.taille.value,
              result.etat.value ? tx(CONDITION_LABELS, lang, result.etat.value) : '',
              ...result.couleurs.value.map(c => tx(COLOR_LABELS, lang, c)),
              ...result.matieres.value.map(m => tx(MATERIAL_LABELS, lang, m)),
            ].filter(Boolean).map((v, i) => (
              <span key={i} className="text-xs font-semibold bg-white text-indigo-700 px-2.5 py-1 rounded-full border border-indigo-200">
                {v}
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
