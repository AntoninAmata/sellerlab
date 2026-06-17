'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import {
  Loader2, RefreshCw, CheckCircle2, AlertTriangle,
  XCircle, Pencil, AlertCircle, ScanLine, Check, Plus, X,
  Sparkles, User, Wand2, Lock,
} from 'lucide-react'
import type { PhotoSlot, RecognitionResult, RecognitionField, Confidence, ExtraInfo, Plan } from '../types'
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

/* ─── Traductions Mannequin IA — 7 langues ───────────────────────────────── */

const MANNEQUIN_I18N: Record<Lang, {
  mannequinTitle: string
  mannequinMen: string
  mannequinWomen: string
  mannequinGenerate: string
  mannequinGenerating: string
  mannequinCustomPromptLabel: string
  wearingPromptLabel: string
  displayModeTitle: string
  displayModeBust: string
  displayModeHanger: string
  displayModeFlat: string
  generateProductPhotos: string
  badgeAI: string
  noSlot0Msg: string
  noMannequinMsg: string
  rendTitle: string
  modalConfirmMannequin: string
}> = {
  fr: {
    mannequinTitle: 'Mannequin IA · 3 photos générées',
    mannequinMen: 'Homme', mannequinWomen: 'Femme',
    mannequinGenerate: 'Générer les photos portées',
    mannequinGenerating: 'Génération en cours…',
    mannequinCustomPromptLabel: 'Personnaliser la tenue',
    wearingPromptLabel: 'Comment porter le vêtement',
    displayModeTitle: 'Type de photo produit',
    displayModeBust: 'Buste', displayModeHanger: 'Cintre', displayModeFlat: 'À plat',
    generateProductPhotos: 'Générer les photos produit',
    badgeAI: 'IA', noSlot0Msg: "Ajoutez d'abord la photo principale",
    noMannequinMsg: 'Sélectionnez un mannequin',
    rendTitle: '📸 RENDU — PHOTOS IA', modalConfirmMannequin: 'Choisir ce mannequin',
  },
  en: {
    mannequinTitle: 'AI Model · 3 photos generated',
    mannequinMen: 'Men', mannequinWomen: 'Women',
    mannequinGenerate: 'Generate worn photos',
    mannequinGenerating: 'Generating…',
    mannequinCustomPromptLabel: 'Customize the outfit',
    wearingPromptLabel: 'How to wear the garment',
    displayModeTitle: 'Product photo type',
    displayModeBust: 'Bust', displayModeHanger: 'Hanger', displayModeFlat: 'Flat lay',
    generateProductPhotos: 'Generate product photos',
    badgeAI: 'AI', noSlot0Msg: 'Add the main photo first',
    noMannequinMsg: 'Select a model',
    rendTitle: '📸 RENDER — AI PHOTOS', modalConfirmMannequin: 'Choose this model',
  },
  es: {
    mannequinTitle: 'Maniquí IA · 3 fotos generadas',
    mannequinMen: 'Hombre', mannequinWomen: 'Mujer',
    mannequinGenerate: 'Generar fotos vestidas',
    mannequinGenerating: 'Generando…',
    mannequinCustomPromptLabel: 'Personalizar el atuendo',
    wearingPromptLabel: 'Cómo llevar la prenda',
    displayModeTitle: 'Tipo de foto de producto',
    displayModeBust: 'Busto', displayModeHanger: 'Percha', displayModeFlat: 'Plano',
    generateProductPhotos: 'Generar fotos de producto',
    badgeAI: 'IA', noSlot0Msg: 'Añade primero la foto principal',
    noMannequinMsg: 'Selecciona un maniquí',
    rendTitle: '📸 RESULTADO — FOTOS IA', modalConfirmMannequin: 'Elegir este maniquí',
  },
  de: {
    mannequinTitle: 'KI-Modell · 3 generierte Fotos',
    mannequinMen: 'Männer', mannequinWomen: 'Frauen',
    mannequinGenerate: 'Anzieh-Fotos generieren',
    mannequinGenerating: 'Wird generiert…',
    mannequinCustomPromptLabel: 'Outfit anpassen',
    wearingPromptLabel: 'Wie das Kleidungsstück getragen wird',
    displayModeTitle: 'Produktfoto-Typ',
    displayModeBust: 'Büste', displayModeHanger: 'Bügel', displayModeFlat: 'Flach',
    generateProductPhotos: 'Produktfotos generieren',
    badgeAI: 'KI', noSlot0Msg: 'Füge zuerst das Hauptfoto hinzu',
    noMannequinMsg: 'Wähle ein Modell',
    rendTitle: '📸 VORSCHAU — KI-FOTOS', modalConfirmMannequin: 'Dieses Modell wählen',
  },
  it: {
    mannequinTitle: 'Manichino IA · 3 foto generate',
    mannequinMen: 'Uomo', mannequinWomen: 'Donna',
    mannequinGenerate: 'Genera foto indossate',
    mannequinGenerating: 'Generazione in corso…',
    mannequinCustomPromptLabel: "Personalizza l'outfit",
    wearingPromptLabel: 'Come indossare il capo',
    displayModeTitle: 'Tipo di foto prodotto',
    displayModeBust: 'Busto', displayModeHanger: 'Gruccia', displayModeFlat: 'Piano',
    generateProductPhotos: 'Genera foto prodotto',
    badgeAI: 'IA', noSlot0Msg: 'Aggiungi prima la foto principale',
    noMannequinMsg: 'Seleziona un manichino',
    rendTitle: '📸 RISULTATO — FOTO IA', modalConfirmMannequin: 'Scegli questo modello',
  },
  nl: {
    mannequinTitle: "AI-model · 3 gegenereerde foto's",
    mannequinMen: 'Man', mannequinWomen: 'Vrouw',
    mannequinGenerate: "Gedragen foto's genereren",
    mannequinGenerating: 'Bezig met genereren…',
    mannequinCustomPromptLabel: 'Outfit aanpassen',
    wearingPromptLabel: 'Hoe het kledingstuk te dragen',
    displayModeTitle: 'Type productfoto',
    displayModeBust: 'Buste', displayModeHanger: 'Hanger', displayModeFlat: 'Plat',
    generateProductPhotos: "Productfoto's genereren",
    badgeAI: 'AI', noSlot0Msg: 'Voeg eerst de hoofdfoto toe',
    noMannequinMsg: 'Selecteer een model',
    rendTitle: "📸 WEERGAVE — AI-FOTO'S", modalConfirmMannequin: 'Kies dit model',
  },
  pl: {
    mannequinTitle: 'Manekin IA · 3 wygenerowane zdjęcia',
    mannequinMen: 'Mężczyzna', mannequinWomen: 'Kobieta',
    mannequinGenerate: 'Generuj zdjęcia noszone',
    mannequinGenerating: 'Generowanie…',
    mannequinCustomPromptLabel: 'Dostosuj strój',
    wearingPromptLabel: 'Jak nosić ubranie',
    displayModeTitle: 'Typ zdjęcia produktu',
    displayModeBust: 'Biust', displayModeHanger: 'Wieszak', displayModeFlat: 'Na płasko',
    generateProductPhotos: 'Generuj zdjęcia produktu',
    badgeAI: 'AI', noSlot0Msg: 'Najpierw dodaj główne zdjęcie',
    noMannequinMsg: 'Wybierz manekin',
    rendTitle: '📸 PODGLĄD — ZDJĘCIA AI', modalConfirmMannequin: 'Wybierz ten manekin',
  },
}

/* ─── i18n panneau fond + bannière freemium — 7 langues ─────────────────── */

const BG_PANEL_I18N: Record<Lang, {
  bgPanelTitle: string
  freemiumLockMsg: string
  checkboxHint: string
  processBtn: (n: number) => string
  processing: string
  rendTitle: string
  modalConfirmBg: string
  bannerTitle: string
  bannerDesc: string
  bannerBtn: string
}> = {
  fr: {
    bgPanelTitle:    'Fond des photos',
    freemiumLockMsg: 'Passez au Premium pour tous les fonds',
    checkboxHint:    'Cliquez sur une photo pour la sélectionner · puis traitez',
    processBtn:      (n) => `Traiter ${n} photo${n > 1 ? 's' : ''} sélectionnée${n > 1 ? 's' : ''}`,
    processing:      'Traitement en cours…',
    rendTitle:       '📸 RENDU — PHOTOS TRAITÉES',
    modalConfirmBg:  'Utiliser ce fond',
    bannerTitle:     'Supprimez le fond de votre photo',
    bannerDesc:      'Pour une annonce pro, retirez le fond de votre photo principale en un clic.',
    bannerBtn:       'Supprimer le fond (photo principale)',
  },
  en: {
    bgPanelTitle:    'Photo background',
    freemiumLockMsg: 'Upgrade to Premium for all backgrounds',
    checkboxHint:    'Click a photo to select it · then process',
    processBtn:      (n) => `Process ${n} selected photo${n > 1 ? 's' : ''}`,
    processing:      'Processing…',
    rendTitle:       '📸 RENDER — PROCESSED PHOTOS',
    modalConfirmBg:  'Use this background',
    bannerTitle:     'Remove your photo background',
    bannerDesc:      'For a professional listing, remove the background from your main photo in one click.',
    bannerBtn:       'Remove background (main photo)',
  },
  es: {
    bgPanelTitle:    'Fondo de las fotos',
    freemiumLockMsg: 'Pasa al Premium para todos los fondos',
    checkboxHint:    'Haz clic en una foto para seleccionarla · luego procesa',
    processBtn:      (n) => `Procesar ${n} foto${n > 1 ? 's' : ''} seleccionada${n > 1 ? 's' : ''}`,
    processing:      'Procesando…',
    rendTitle:       '📸 RESULTADO — FOTOS PROCESADAS',
    modalConfirmBg:  'Usar este fondo',
    bannerTitle:     'Elimina el fondo de tu foto',
    bannerDesc:      'Para un anuncio profesional, elimina el fondo de tu foto principal en un clic.',
    bannerBtn:       'Eliminar fondo (foto principal)',
  },
  de: {
    bgPanelTitle:    'Foto-Hintergrund',
    freemiumLockMsg: 'Upgrade auf Premium für alle Hintergründe',
    checkboxHint:    'Klicke ein Foto an · dann verarbeiten',
    processBtn:      (n) => `${n} Foto${n > 1 ? 's' : ''} verarbeiten`,
    processing:      'Wird verarbeitet…',
    rendTitle:       '📸 VORSCHAU — BEARBEITETE FOTOS',
    modalConfirmBg:  'Hintergrund verwenden',
    bannerTitle:     'Hintergrund entfernen',
    bannerDesc:      'Für ein professionelles Inserat: Hintergrund des Hauptfotos mit einem Klick entfernen.',
    bannerBtn:       'Hintergrund entfernen (Hauptfoto)',
  },
  it: {
    bgPanelTitle:    'Sfondo delle foto',
    freemiumLockMsg: 'Passa al Premium per tutti gli sfondi',
    checkboxHint:    'Clicca una foto per selezionarla · poi elabora',
    processBtn:      (n) => `Elabora ${n} foto selezionat${n > 1 ? 'e' : 'a'}`,
    processing:      'Elaborazione in corso…',
    rendTitle:       '📸 RISULTATO — FOTO ELABORATE',
    modalConfirmBg:  'Usa questo sfondo',
    bannerTitle:     'Rimuovi lo sfondo della tua foto',
    bannerDesc:      "Per un annuncio professionale, rimuovi lo sfondo della foto principale in un clic.",
    bannerBtn:       'Rimuovi sfondo (foto principale)',
  },
  nl: {
    bgPanelTitle:    "Achtergrond foto's",
    freemiumLockMsg: 'Upgrade naar Premium voor alle achtergronden',
    checkboxHint:    "Klik op een foto om te selecteren · dan verwerken",
    processBtn:      (n) => `Verwerk ${n} geselecteerde foto${n > 1 ? "'s" : ''}`,
    processing:      'Bezig met verwerken…',
    rendTitle:       "📸 WEERGAVE — BEWERKTE FOTO'S",
    modalConfirmBg:  'Gebruik achtergrond',
    bannerTitle:     'Verwijder de achtergrond van je foto',
    bannerDesc:      'Voor een professionele advertentie: verwijder de achtergrond van je hoofdfoto met één klik.',
    bannerBtn:       'Achtergrond verwijderen (hoofdfoto)',
  },
  pl: {
    bgPanelTitle:    'Tło zdjęć',
    freemiumLockMsg: 'Przejdź na Premium dla wszystkich teł',
    checkboxHint:    'Kliknij zdjęcie aby wybrać · następnie przetwórz',
    processBtn:      (n) => `Przetwórz ${n} wybrane zdjęci${n === 1 ? 'e' : 'a'}`,
    processing:      'Przetwarzanie…',
    rendTitle:       '📸 PODGLĄD — PRZETWORZONE ZDJĘCIA',
    modalConfirmBg:  'Użyj tego tła',
    bannerTitle:     'Usuń tło ze swojego zdjęcia',
    bannerDesc:      'Dla profesjonalnego ogłoszenia usuń tło ze swojego głównego zdjęcia jednym kliknięciem.',
    bannerBtn:       'Usuń tło (główne zdjęcie)',
  },
}

/* ─── Backgrounds (copie de l'étape 1) ───────────────────────────────────── */

type BgDef =
  | { id: number; label: string; type: 'color'; color: string; preview: string }
  | { id: number; label: string; type: 'image'; src: string; preview: string }

function makeBg(id: number): BgDef {
  const filename = id === 0 ? 'bg-white.jpg' : `bg-${String(id).padStart(2, '0')}.jpg`
  const label    = id === 0 ? 'Blanc pur' : `Fond ${String(id).padStart(2, '0')}`
  return { id, label, type: 'image' as const, src: `/backgrounds/${filename}`, preview: `/backgrounds/${filename}` }
}

const BACKGROUNDS: BgDef[] = [
  makeBg(0), makeBg(1),
  ...Array.from({ length: 8 },  (_, i) => makeBg(23 + i)),
  ...Array.from({ length: 21 }, (_, i) => makeBg(2  + i)),
]

/* ─── Mannequins ─────────────────────────────────────────────────────────── */

const MEN_MANNEQUINS: string[] = [
  'man-01', 'man-02', 'man-03', 'man-04', 'man-05',
  'man-06', 'man-07', 'man-08', 'man-09', 'man-10',
  'man-11', 'man-12', 'man-13', 'man-14', 'man-15',
]
const WOMEN_MANNEQUINS: string[] = [
  'woman-01', 'woman-02', 'woman-03', 'woman-04', 'woman-05',
  'woman-06', 'woman-07', 'woman-08', 'woman-09', 'woman-10',
  'woman-11', 'woman-12', 'woman-13', 'woman-14', 'woman-15',
]

/* ─── Composition fond + cutout PNG transparent ───────────────────────────── */

async function compositeWithBackground(cutoutUrl: string, bg: BgDef): Promise<string> {
  return new Promise((resolve, reject) => {
    const cutout = new Image()
    cutout.onload = () => {
      const W = 1080, H = 1440            // canvas fixe 3:4 portrait
      const canvas = document.createElement('canvas')
      canvas.width  = W
      canvas.height = H
      const ctx = canvas.getContext('2d')!

      const draw = () => {
        // cutout : contain centré à 85% du cadre (jamais coupé ni déformé)
        const scale = Math.min((W * 0.85) / cutout.naturalWidth, (H * 0.85) / cutout.naturalHeight)
        const cw = cutout.naturalWidth  * scale
        const ch = cutout.naturalHeight * scale
        ctx.drawImage(cutout, (W - cw) / 2, (H - ch) / 2, cw, ch)
        canvas.toBlob(
          (blob) => blob ? resolve(URL.createObjectURL(blob)) : reject(new Error('toBlob failed')),
          'image/jpeg', 0.92,
        )
      }

      if (bg.type === 'color') {
        ctx.fillStyle = bg.color
        ctx.fillRect(0, 0, W, H)
        draw()
      } else {
        const bgImg = new Image()
        bgImg.onload = () => {
          // fond : cover (remplit tout le canvas, jamais de bande blanche)
          const s  = Math.max(W / bgImg.naturalWidth, H / bgImg.naturalHeight)
          const bw = bgImg.naturalWidth  * s
          const bh = bgImg.naturalHeight * s
          ctx.drawImage(bgImg, (W - bw) / 2, (H - bh) / 2, bw, bh)
          draw()
        }
        bgImg.onerror = () => {
          ctx.fillStyle = '#FFFFFF'
          ctx.fillRect(0, 0, W, H)
          draw()
        }
        bgImg.src = bg.src
      }
    }
    cutout.onerror = reject
    cutout.src = cutoutUrl
  })
}

/* ─── Type cutout IA ──────────────────────────────────────────────────────── */

interface AiCutoutEntry {
  cutout: string | null
  original: string
}

/* ─── Props ──────────────────────────────────────────────────────────────── */

interface Props {
  slots: PhotoSlot[]
  setSlots: React.Dispatch<React.SetStateAction<PhotoSlot[]>>
  result: RecognitionResult | null
  aiPhotos: string[]
  setAiPhotos: (urls: string[]) => void
  plan: Plan
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

/* ─── Génération automatique du prompt de tenue ─────────────────────────── */

type GarmentType = 'HAUT' | 'BAS' | 'PIECE_ENTIERE' | 'VESTE' | 'CHAUSSURE' | 'ACCESSOIRE'
type StyleKey = 'casual' | 'chic' | 'sportif' | 'vintage' | 'streetwear' | 'rock' | 'business' | 'boheme' | 'minimaliste' | 'default'

function classifyGarment(vintedPath: string): GarmentType {
  const parts = vintedPath.split('>').map(s => s.trim())
  const n2 = parts[1] ?? ''
  const n3 = parts[2] ?? ''
  if (/chaussures?/i.test(n2)) return 'CHAUSSURE'
  if (/accessoires?|bijoux|sacs?/i.test(n2)) return 'ACCESSOIRE'
  if (/tops?|t-shirts?|pulls?|sweats?|chemises?|débardeurs?|bodys?|chemisiers?/i.test(n3)) return 'HAUT'
  if (/jeans?|pantalons?|shorts?|bermudas?|jupes?|leggings?/i.test(n3)) return 'BAS'
  if (/robes?|combinaisons?|ensembles?|tenues?|maillots?|costumes?/i.test(n3)) return 'PIECE_ENTIERE'
  if (/manteaux?|vestes?|blazers?|tailleurs?|parkas?|doudounes?/i.test(n3)) return 'VESTE'
  return 'HAUT'
}

function normalizeStyle(style: string): StyleKey {
  const s = style.toLowerCase()
  if (s.includes('casual')) return 'casual'
  if (s.includes('chic') || s.includes('élégant') || s.includes('elegant')) return 'chic'
  if (s.includes('sport') || s.includes('outdoor')) return 'sportif'
  if (s.includes('vintage')) return 'vintage'
  if (s.includes('street')) return 'streetwear'
  if (s.includes('rock')) return 'rock'
  if (s.includes('business') || s.includes('classique') || s.includes('preppy')) return 'business'
  if (s.includes('bohème') || s.includes('boheme') || s.includes('fantaisie')) return 'boheme'
  if (s.includes('minimaliste') || s.includes('minimalist')) return 'minimaliste'
  return 'default'
}

const OUTFIT_PROMPTS: Record<Lang, Partial<Record<GarmentType, Partial<Record<StyleKey, string>>>>> = {
  fr: {
    HAUT: {
      casual:      'porter ce haut avec un jean straight-leg et des sneakers blanches, style casual 2026',
      chic:        'porter ce haut avec un pantalon tailleur et des escarpins, style chic élégant',
      sportif:     'porter ce haut avec un legging de sport et des baskets running, style sportswear',
      vintage:     'porter ce haut avec un jean taille haute et des bottines, look vintage rétro',
      streetwear:  'porter ce haut avec un cargo baggy et des sneakers chunky, style streetwear urbain',
      rock:        'porter ce haut avec un jean noir straight et des boots, style rock',
      business:    'porter ce haut avec un pantalon de costume et des derbies, style business',
      boheme:      'porter ce haut avec une jupe longue fleurie et des sandales, style bohème',
      minimaliste: 'porter ce haut avec un pantalon épuré et des loafers, style minimaliste',
      default:     'porter ce haut avec un jean et des sneakers, style contemporain 2026',
    },
    BAS: {
      casual:      'porter ce bas avec un t-shirt blanc et des sneakers, style casual 2026',
      chic:        'porter ce bas avec un chemisier en soie et des escarpins, style chic élégant',
      sportif:     'porter ce bas avec un top de sport et des baskets, style sportswear',
      vintage:     'porter ce bas avec un crop-top et des mules, look vintage rétro',
      streetwear:  'porter ce bas avec un hoodie oversize et des sneakers chunky, style streetwear',
      rock:        'porter ce bas avec un t-shirt band et des boots, style rock',
      business:    'porter ce bas avec une chemise structurée et des derbies, style business',
      boheme:      'porter ce bas avec un top en lin et des sandales, style bohème',
      minimaliste: 'porter ce bas avec un t-shirt neutre et des sneakers épurées, style minimaliste',
      default:     'porter ce bas avec un t-shirt simple et des sneakers, style contemporain 2026',
    },
    PIECE_ENTIERE: {
      casual:      'porter cette pièce avec des sneakers blanches, style casual décontracté 2026',
      chic:        'porter cette pièce avec des talons et un sac pochette, style chic élégant',
      sportif:     'porter cette pièce avec des baskets running, style sportswear',
      vintage:     'porter cette pièce avec des bottines plates, look vintage rétro',
      streetwear:  'porter cette pièce avec des sneakers chunky, style streetwear urbain',
      rock:        'porter cette pièce avec des boots et une ceinture cloutée, style rock',
      business:    'porter cette pièce avec des escarpins, style business classique',
      boheme:      'porter cette pièce avec des sandales tressées, style bohème naturel',
      minimaliste: 'porter cette pièce avec des chaussures épurées, style minimaliste',
      default:     'porter cette pièce avec des chaussures adaptées, style contemporain 2026',
    },
    VESTE: {
      casual:      'porter cette veste sur un t-shirt blanc, jean straight-leg et sneakers, style casual 2026',
      chic:        'porter cette veste sur un chemisier, pantalon tailleur et escarpins, style chic',
      sportif:     'porter cette veste avec un jogging et des baskets, style sportswear',
      vintage:     'porter cette veste sur un t-shirt graphique, jean vintage et bottines, look rétro',
      streetwear:  'porter cette veste avec un hoodie, cargo et sneakers chunky, style streetwear',
      rock:        'porter cette veste sur un t-shirt noir, jean straight et boots, style rock',
      business:    'porter cette veste sur une chemise, pantalon de costume et derbies, style business',
      boheme:      'porter cette veste sur une robe florale et des sandales, style bohème',
      minimaliste: 'porter cette veste sur un t-shirt neutre, pantalon épuré et loafers, style minimaliste',
      default:     'porter cette veste avec jean et sneakers, style contemporain 2026',
    },
    CHAUSSURE: {
      casual:      'chaussures portées avec un jean straight-leg et un t-shirt blanc, style casual 2026',
      chic:        'chaussures portées avec un pantalon tailleur et un chemisier, style chic élégant',
      sportif:     'chaussures portées avec un legging et un top de sport, style sportswear',
      vintage:     'chaussures portées avec un jean taille haute et un crop-top, look vintage rétro',
      streetwear:  'chaussures portées avec un cargo et un hoodie oversize, style streetwear',
      rock:        'chaussures portées avec un jean noir et un t-shirt band, style rock',
      business:    'chaussures portées avec un costume et une chemise, style business',
      boheme:      'chaussures portées avec une robe longue fleurie, style bohème',
      minimaliste: 'chaussures portées avec un pantalon épuré et un t-shirt neutre, style minimaliste',
      default:     'chaussures portées avec une tenue casual contemporaine 2026',
    },
    ACCESSOIRE: {
      casual:      'accessoire porté avec un jean et un t-shirt blanc, style casual décontracté 2026',
      chic:        'accessoire porté avec un ensemble chic, robe ou tailleur élégant',
      sportif:     'accessoire porté avec une tenue sportswear, legging et top',
      vintage:     'accessoire porté avec un jean vintage et un crop-top, look rétro',
      streetwear:  'accessoire porté avec un cargo et un hoodie oversize, style streetwear',
      rock:        'accessoire porté avec un jean noir et un t-shirt band, style rock',
      business:    'accessoire porté avec un costume ou tailleur, style business',
      boheme:      'accessoire porté avec une robe longue et des sandales, style bohème',
      minimaliste: 'accessoire porté avec des pièces épurées neutres, style minimaliste',
      default:     'accessoire porté avec une tenue casual contemporaine 2026',
    },
  },
  en: {
    HAUT: {
      casual:      'wearing this top with straight-leg jeans and white sneakers, casual 2026 style',
      chic:        'wearing this top with tailored trousers and heels, chic elegant style',
      sportif:     'wearing this top with sports leggings and running shoes, sportswear style',
      vintage:     'wearing this top with high-waist jeans and ankle boots, vintage retro look',
      streetwear:  'wearing this top with baggy cargo pants and chunky sneakers, streetwear style',
      rock:        'wearing this top with black straight jeans and boots, rock style',
      business:    'wearing this top with dress trousers and oxford shoes, business style',
      boheme:      'wearing this top with a floral maxi skirt and sandals, boho style',
      minimaliste: 'wearing this top with clean-cut trousers and loafers, minimalist style',
      default:     'wearing this top with jeans and sneakers, contemporary 2026 style',
    },
    BAS: {
      casual:      'wearing these bottoms with a white t-shirt and sneakers, casual 2026 style',
      chic:        'wearing these bottoms with a silk blouse and heels, chic elegant style',
      sportif:     'wearing these bottoms with a sports top and trainers, sportswear style',
      vintage:     'wearing these bottoms with a crop top and mules, vintage retro look',
      streetwear:  'wearing these bottoms with an oversized hoodie and chunky sneakers, streetwear',
      rock:        'wearing these bottoms with a band tee and boots, rock style',
      business:    'wearing these bottoms with a structured shirt and oxford shoes, business style',
      boheme:      'wearing these bottoms with a linen top and flat sandals, boho style',
      minimaliste: 'wearing these bottoms with a neutral t-shirt and clean sneakers, minimalist style',
      default:     'wearing these bottoms with a simple top and sneakers, contemporary 2026 style',
    },
    PIECE_ENTIERE: {
      casual:      'wearing this piece with white sneakers, casual relaxed 2026 style',
      chic:        'wearing this piece with heels and a clutch bag, chic elegant style',
      sportif:     'wearing this piece with running shoes, sportswear style',
      vintage:     'wearing this piece with flat ankle boots, vintage retro look',
      streetwear:  'wearing this piece with chunky sneakers, urban streetwear style',
      rock:        'wearing this piece with boots and a studded belt, rock style',
      business:    'wearing this piece with heels, classic business style',
      boheme:      'wearing this piece with woven sandals, natural boho style',
      minimaliste: 'wearing this piece with clean-cut shoes, minimalist style',
      default:     'wearing this piece with appropriate footwear, contemporary 2026 style',
    },
    VESTE: {
      casual:      'wearing this jacket over a white t-shirt, straight-leg jeans and sneakers, casual 2026',
      chic:        'wearing this jacket over a blouse, tailored trousers and heels, chic style',
      sportif:     'wearing this jacket with joggers and trainers, sportswear style',
      vintage:     'wearing this jacket over a graphic tee, vintage jeans and ankle boots, retro look',
      streetwear:  'wearing this jacket with a hoodie, cargo pants and chunky sneakers, streetwear',
      rock:        'wearing this jacket over a black tee, straight jeans and boots, rock style',
      business:    'wearing this jacket over a shirt, dress trousers and oxfords, business style',
      boheme:      'wearing this jacket over a floral dress and sandals, boho style',
      minimaliste: 'wearing this jacket over a neutral tee, clean trousers and loafers, minimalist',
      default:     'wearing this jacket with jeans and sneakers, contemporary 2026 style',
    },
    CHAUSSURE: {
      casual:      'shoes worn with straight-leg jeans and a white t-shirt, casual 2026 style',
      chic:        'shoes worn with tailored trousers and a blouse, chic elegant style',
      sportif:     'shoes worn with sports leggings and a top, sportswear style',
      vintage:     'shoes worn with high-waist jeans and a crop top, vintage retro look',
      streetwear:  'shoes worn with cargo pants and an oversized hoodie, streetwear style',
      rock:        'shoes worn with black jeans and a band tee, rock style',
      business:    'shoes worn with a suit and dress shirt, business style',
      boheme:      'shoes worn with a long floral dress, boho style',
      minimaliste: 'shoes worn with clean trousers and a neutral t-shirt, minimalist style',
      default:     'shoes worn with a contemporary casual outfit 2026',
    },
    ACCESSOIRE: {
      casual:      'accessory worn with jeans and a white t-shirt, casual relaxed 2026 style',
      chic:        'accessory worn with an elegant outfit, dress or suit',
      sportif:     'accessory worn with sportswear, leggings and a top',
      vintage:     'accessory worn with vintage jeans and a crop top, retro look',
      streetwear:  'accessory worn with cargo pants and an oversized hoodie, streetwear',
      rock:        'accessory worn with black jeans and a band tee, rock style',
      business:    'accessory worn with a suit or blazer, business style',
      boheme:      'accessory worn with a long dress and sandals, boho style',
      minimaliste: 'accessory worn with clean neutral pieces, minimalist style',
      default:     'accessory worn with a casual contemporary outfit 2026',
    },
  },
  es: {
    HAUT: {
      casual:      'llevar este top con vaqueros straight y zapatillas blancas, estilo casual 2026',
      chic:        'llevar este top con pantalón de vestir y tacones, estilo chic elegante',
      sportif:     'llevar este top con mallas deportivas y zapatillas running, estilo sportswear',
      vintage:     'llevar este top con vaqueros de talle alto y botines, look vintage retro',
      streetwear:  'llevar este top con cargo baggy y zapatillas chunky, estilo streetwear urbano',
      rock:        'llevar este top con vaqueros negros y botas, estilo rock',
      business:    'llevar este top con pantalón de traje y zapatos de vestir, estilo business',
      boheme:      'llevar este top con falda larga floral y sandalias, estilo boho',
      minimaliste: 'llevar este top con pantalón limpio y mocasines, estilo minimalista',
      default:     'llevar este top con vaqueros y zapatillas, estilo contemporáneo 2026',
    },
    BAS: {
      casual:      'llevar estas prendas con camiseta blanca y zapatillas, estilo casual 2026',
      chic:        'llevar estas prendas con blusa de seda y tacones, estilo chic elegante',
      sportif:     'llevar estas prendas con top deportivo y zapatillas running, estilo sportswear',
      vintage:     'llevar estas prendas con crop-top y mules, look vintage retro',
      streetwear:  'llevar estas prendas con sudadera oversize y zapatillas chunky, streetwear',
      rock:        'llevar estas prendas con camiseta de banda y botas, estilo rock',
      business:    'llevar estas prendas con camisa estructurada y zapatos de vestir, business',
      boheme:      'llevar estas prendas con top de lino y sandalias planas, estilo boho',
      minimaliste: 'llevar estas prendas con camiseta neutral y zapatillas limpias, minimalista',
      default:     'llevar estas prendas con camiseta simple y zapatillas, estilo contemporáneo 2026',
    },
    PIECE_ENTIERE: {
      casual:      'llevar esta prenda con zapatillas blancas, estilo casual relajado 2026',
      chic:        'llevar esta prenda con tacones y bolso clutch, estilo chic elegante',
      sportif:     'llevar esta prenda con zapatillas running, estilo sportswear',
      vintage:     'llevar esta prenda con botines planos, look vintage retro',
      streetwear:  'llevar esta prenda con zapatillas chunky, estilo streetwear urbano',
      rock:        'llevar esta prenda con botas y cinturón con tachuelas, estilo rock',
      business:    'llevar esta prenda con zapatos de tacón, estilo business clásico',
      boheme:      'llevar esta prenda con sandalias trenzadas, estilo boho natural',
      minimaliste: 'llevar esta prenda con zapatos limpios, estilo minimalista',
      default:     'llevar esta prenda con calzado adecuado, estilo contemporáneo 2026',
    },
    VESTE: {
      casual:      'llevar esta chaqueta sobre camiseta blanca, vaqueros straight y zapatillas, casual 2026',
      chic:        'llevar esta chaqueta sobre blusa, pantalón de traje y tacones, estilo chic',
      sportif:     'llevar esta chaqueta con pantalón deportivo y zapatillas, sportswear',
      vintage:     'llevar esta chaqueta sobre camiseta gráfica, vaqueros vintage y botines, retro',
      streetwear:  'llevar esta chaqueta con hoodie, cargo y zapatillas chunky, streetwear',
      rock:        'llevar esta chaqueta sobre camiseta negra, vaqueros straight y botas, rock',
      business:    'llevar esta chaqueta sobre camisa, pantalón de traje y zapatos, business',
      boheme:      'llevar esta chaqueta sobre vestido floral y sandalias, estilo boho',
      minimaliste: 'llevar esta chaqueta sobre camiseta neutral, pantalón limpio y mocasines',
      default:     'llevar esta chaqueta con vaqueros y zapatillas, estilo contemporáneo 2026',
    },
    CHAUSSURE: {
      casual:      'zapatos con vaqueros straight y camiseta blanca, estilo casual 2026',
      chic:        'zapatos con pantalón de vestir y blusa, estilo chic elegante',
      sportif:     'zapatillas con mallas deportivas y top, estilo sportswear',
      vintage:     'zapatos con vaqueros de talle alto y crop-top, look vintage retro',
      streetwear:  'zapatillas con cargo y sudadera oversize, estilo streetwear',
      rock:        'botas con vaqueros negros y camiseta de banda, estilo rock',
      business:    'zapatos con traje y camisa, estilo business',
      boheme:      'sandalias con vestido largo floral, estilo boho',
      minimaliste: 'zapatos con pantalón limpio y camiseta neutral, estilo minimalista',
      default:     'calzado con outfit casual contemporáneo 2026',
    },
    ACCESSOIRE: {
      casual:      'accesorio con vaqueros y camiseta blanca, estilo casual relajado 2026',
      chic:        'accesorio con outfit elegante, vestido o conjunto chic',
      sportif:     'accesorio con outfit deportivo, mallas y top',
      vintage:     'accesorio con vaqueros vintage y crop-top, look retro',
      streetwear:  'accesorio con cargo y sudadera oversize, streetwear',
      rock:        'accesorio con vaqueros negros y camiseta de banda, rock',
      business:    'accesorio con traje o blazer, estilo business',
      boheme:      'accesorio con vestido largo y sandalias, estilo boho',
      minimaliste: 'accesorio con prendas neutras limpias, estilo minimalista',
      default:     'accesorio con outfit casual contemporáneo 2026',
    },
  },
  de: {
    HAUT: {
      casual:      'dieses Oberteil mit Straight-Jeans und weißen Sneakern, lässiger Casual-Stil 2026',
      chic:        'dieses Oberteil mit Anzughose und Absatzschuhen, schicker eleganter Stil',
      sportif:     'dieses Oberteil mit Sportleggings und Laufschuhen, Sportswear-Stil',
      vintage:     'dieses Oberteil mit Highwaist-Jeans und Ankle Boots, Vintage-Retro-Look',
      streetwear:  'dieses Oberteil mit Cargo-Baggy und Chunky-Sneakern, urbaner Streetwear-Stil',
      rock:        'dieses Oberteil mit schwarzen Straight-Jeans und Boots, Rock-Stil',
      business:    'dieses Oberteil mit Anzughose und Derby-Schuhen, Business-Stil',
      boheme:      'dieses Oberteil mit langem Blumenrock und Sandalen, Boho-Stil',
      minimaliste: 'dieses Oberteil mit cleaner Hose und Loafern, minimalistischer Stil',
      default:     'dieses Oberteil mit Jeans und Sneakern, zeitgenössischer Stil 2026',
    },
    BAS: {
      casual:      'diese Hose mit weißem T-Shirt und Sneakern, lässiger Casual-Stil 2026',
      chic:        'diese Hose mit Seidenbluse und Absatzschuhen, schick-eleganter Stil',
      sportif:     'diese Hose mit Sport-Top und Laufschuhen, Sportswear-Stil',
      vintage:     'diese Hose mit Crop-Top und Mules, Vintage-Retro-Look',
      streetwear:  'diese Hose mit Oversized-Hoodie und Chunky-Sneakern, Streetwear-Stil',
      rock:        'diese Hose mit Band-T-Shirt und Boots, Rock-Stil',
      business:    'diese Hose mit strukturiertem Hemd und Halbschuhen, Business-Stil',
      boheme:      'diese Hose mit Leinenoberteil und flachen Sandalen, Boho-Stil',
      minimaliste: 'diese Hose mit neutralem T-Shirt und cleanen Sneakern, minimalistischer Stil',
      default:     'diese Hose mit einfachem Oberteil und Sneakern, zeitgenössischer Stil 2026',
    },
    PIECE_ENTIERE: {
      casual:      'dieses Teil mit weißen Sneakern, lässiger Casual-Stil 2026',
      chic:        'dieses Teil mit Absatzschuhen und Clutch, schick-eleganter Stil',
      sportif:     'dieses Teil mit Laufschuhen, Sportswear-Stil',
      vintage:     'dieses Teil mit flachen Ankle Boots, Vintage-Retro-Look',
      streetwear:  'dieses Teil mit Chunky-Sneakern, urbaner Streetwear-Stil',
      rock:        'dieses Teil mit Boots und Nieten-Gürtel, Rock-Stil',
      business:    'dieses Teil mit Absatzschuhen, klassischer Business-Stil',
      boheme:      'dieses Teil mit geflochtenen Sandalen, natürlicher Boho-Stil',
      minimaliste: 'dieses Teil mit cleanen Schuhen, minimalistischer Stil',
      default:     'dieses Teil mit passenden Schuhen, zeitgenössischer Stil 2026',
    },
    VESTE: {
      casual:      'diese Jacke über weißem T-Shirt, Straight-Jeans und Sneakern, Casual-Stil 2026',
      chic:        'diese Jacke über Bluse, Anzughose und Absatzschuhen, schicker Stil',
      sportif:     'diese Jacke mit Jogginghose und Sneakern, Sportswear-Stil',
      vintage:     'diese Jacke über Grafik-T-Shirt, Vintage-Jeans und Ankle Boots, Retro-Look',
      streetwear:  'diese Jacke mit Hoodie, Cargo und Chunky-Sneakern, Streetwear-Stil',
      rock:        'diese Jacke über schwarzem T-Shirt, Straight-Jeans und Boots, Rock-Stil',
      business:    'diese Jacke über Hemd, Anzughose und Halbschuhen, Business-Stil',
      boheme:      'diese Jacke über Blumenkleid und Sandalen, Boho-Stil',
      minimaliste: 'diese Jacke über neutralem T-Shirt, cleaner Hose und Loafern, minimalistisch',
      default:     'diese Jacke mit Jeans und Sneakern, zeitgenössischer Stil 2026',
    },
    CHAUSSURE: {
      casual:      'Schuhe mit Straight-Jeans und weißem T-Shirt, lässiger Casual-Stil 2026',
      chic:        'Schuhe mit Anzughose und Bluse, schick-eleganter Stil',
      sportif:     'Schuhe mit Sportleggings und Top, Sportswear-Stil',
      vintage:     'Schuhe mit Highwaist-Jeans und Crop-Top, Vintage-Retro-Look',
      streetwear:  'Schuhe mit Cargo und Oversized-Hoodie, Streetwear-Stil',
      rock:        'Schuhe mit schwarzen Jeans und Band-T-Shirt, Rock-Stil',
      business:    'Schuhe mit Anzug und Hemd, Business-Stil',
      boheme:      'Schuhe mit langem Blumenkleid, Boho-Stil',
      minimaliste: 'Schuhe mit cleaner Hose und neutralem T-Shirt, minimalistischer Stil',
      default:     'Schuhe mit zeitgenössischem Casual-Outfit 2026',
    },
    ACCESSOIRE: {
      casual:      'Accessoire mit Jeans und weißem T-Shirt, lässiger Casual-Stil 2026',
      chic:        'Accessoire mit elegantem Outfit, Kleid oder Anzug',
      sportif:     'Accessoire mit Sportswear, Leggings und Top',
      vintage:     'Accessoire mit Vintage-Jeans und Crop-Top, Retro-Look',
      streetwear:  'Accessoire mit Cargo und Oversized-Hoodie, Streetwear-Stil',
      rock:        'Accessoire mit schwarzen Jeans und Band-T-Shirt, Rock-Stil',
      business:    'Accessoire mit Anzug oder Blazer, Business-Stil',
      boheme:      'Accessoire mit langem Kleid und Sandalen, Boho-Stil',
      minimaliste: 'Accessoire mit cleanen neutralen Teilen, minimalistischer Stil',
      default:     'Accessoire mit zeitgenössischem Casual-Outfit 2026',
    },
  },
  it: {
    HAUT: {
      casual:      'indossare questo top con jeans straight-leg e sneakers bianche, stile casual 2026',
      chic:        'indossare questo top con pantaloni sartoriali e décolleté, stile chic elegante',
      sportif:     'indossare questo top con leggings sportivi e scarpe da running, stile sportswear',
      vintage:     'indossare questo top con jeans a vita alta e stivaletti, look vintage retrò',
      streetwear:  'indossare questo top con cargo baggy e sneakers chunky, stile streetwear urbano',
      rock:        'indossare questo top con jeans neri straight e stivali, stile rock',
      business:    'indossare questo top con pantaloni da ufficio e scarpe stringate, stile business',
      boheme:      'indossare questo top con gonna lunga fiorata e sandali, stile boho',
      minimaliste: 'indossare questo top con pantaloni puliti e mocassini, stile minimalista',
      default:     'indossare questo top con jeans e sneakers, stile contemporaneo 2026',
    },
    BAS: {
      casual:      'indossare questo capo con t-shirt bianca e sneakers, stile casual 2026',
      chic:        'indossare questo capo con blusa in seta e décolleté, stile chic elegante',
      sportif:     'indossare questo capo con top sportivo e scarpe da running, stile sportswear',
      vintage:     'indossare questo capo con crop-top e mules, look vintage retrò',
      streetwear:  'indossare questo capo con hoodie oversize e sneakers chunky, streetwear',
      rock:        'indossare questo capo con t-shirt da band e stivali, stile rock',
      business:    'indossare questo capo con camicia strutturata e scarpe stringate, business',
      boheme:      'indossare questo capo con top in lino e sandali piatti, stile boho',
      minimaliste: 'indossare questo capo con t-shirt neutra e sneakers pulite, minimalista',
      default:     'indossare questo capo con semplice maglietta e sneakers, stile contemporaneo 2026',
    },
    PIECE_ENTIERE: {
      casual:      'indossare questo capo con sneakers bianche, stile casual rilassato 2026',
      chic:        'indossare questo capo con tacchi e clutch, stile chic elegante',
      sportif:     'indossare questo capo con scarpe da running, stile sportswear',
      vintage:     'indossare questo capo con stivaletti piatti, look vintage retrò',
      streetwear:  'indossare questo capo con sneakers chunky, stile streetwear urbano',
      rock:        'indossare questo capo con stivali e cintura borchiata, stile rock',
      business:    'indossare questo capo con décolleté, stile business classico',
      boheme:      'indossare questo capo con sandali intrecciati, stile boho naturale',
      minimaliste: 'indossare questo capo con scarpe pulite, stile minimalista',
      default:     'indossare questo capo con calzature adeguate, stile contemporaneo 2026',
    },
    VESTE: {
      casual:      'indossare questa giacca su t-shirt bianca, jeans straight-leg e sneakers, casual 2026',
      chic:        'indossare questa giacca su blusa, pantaloni sartoriali e décolleté, stile chic',
      sportif:     'indossare questa giacca con tuta e scarpe da ginnastica, sportswear',
      vintage:     'indossare questa giacca su t-shirt grafica, jeans vintage e stivaletti, retrò',
      streetwear:  'indossare questa giacca con hoodie, cargo e sneakers chunky, streetwear',
      rock:        'indossare questa giacca su t-shirt nera, jeans straight e stivali, rock',
      business:    'indossare questa giacca su camicia, pantaloni da ufficio e stringate, business',
      boheme:      'indossare questa giacca su vestito fiorato e sandali, stile boho',
      minimaliste: 'indossare questa giacca su t-shirt neutra, pantaloni puliti e mocassini',
      default:     'indossare questa giacca con jeans e sneakers, stile contemporaneo 2026',
    },
    CHAUSSURE: {
      casual:      'scarpe con jeans straight-leg e t-shirt bianca, stile casual 2026',
      chic:        'scarpe con pantaloni sartoriali e blusa, stile chic elegante',
      sportif:     'scarpe con leggings sportivi e top, stile sportswear',
      vintage:     'scarpe con jeans a vita alta e crop-top, look vintage retrò',
      streetwear:  'scarpe con cargo e hoodie oversize, stile streetwear',
      rock:        'scarpe con jeans neri e t-shirt da band, stile rock',
      business:    'scarpe con abito o completo, stile business',
      boheme:      'scarpe con vestito lungo fiorato, stile boho',
      minimaliste: 'scarpe con pantaloni puliti e t-shirt neutra, stile minimalista',
      default:     'scarpe con outfit casual contemporaneo 2026',
    },
    ACCESSOIRE: {
      casual:      'accessorio con jeans e t-shirt bianca, stile casual rilassato 2026',
      chic:        'accessorio con outfit elegante, abito o completo chic',
      sportif:     'accessorio con abbigliamento sportivo, leggings e top',
      vintage:     'accessorio con jeans vintage e crop-top, look retrò',
      streetwear:  'accessorio con cargo e hoodie oversize, streetwear',
      rock:        'accessorio con jeans neri e t-shirt da band, stile rock',
      business:    'accessorio con abito o blazer, stile business',
      boheme:      'accessorio con vestito lungo e sandali, stile boho',
      minimaliste: 'accessorio con capi neutri puliti, stile minimalista',
      default:     'accessorio con outfit casual contemporaneo 2026',
    },
  },
  nl: {
    HAUT: {
      casual:      'dit bovenstuk met straight-leg jeans en witte sneakers, casual stijl 2026',
      chic:        'dit bovenstuk met pantalon en hakken, chic elegante stijl',
      sportif:     'dit bovenstuk met sportlegging en hardloopschoenen, sportswear stijl',
      vintage:     'dit bovenstuk met hoge taille jeans en enkellaarzen, vintage retro look',
      streetwear:  'dit bovenstuk met baggy cargo en chunky sneakers, streetwear stijl',
      rock:        'dit bovenstuk met zwarte straight jeans en boots, rock stijl',
      business:    'dit bovenstuk met pantalon en nette schoenen, zakelijke stijl',
      boheme:      'dit bovenstuk met lange bloemenrok en sandalen, boho stijl',
      minimaliste: 'dit bovenstuk met strakke broek en loafers, minimalistische stijl',
      default:     'dit bovenstuk met jeans en sneakers, hedendaagse stijl 2026',
    },
    BAS: {
      casual:      'dit kledingstuk met wit t-shirt en sneakers, casual stijl 2026',
      chic:        'dit kledingstuk met zijden blouse en hakken, chic elegante stijl',
      sportif:     'dit kledingstuk met sporttop en hardloopschoenen, sportswear stijl',
      vintage:     'dit kledingstuk met crop-top en mules, vintage retro look',
      streetwear:  'dit kledingstuk met oversized hoodie en chunky sneakers, streetwear',
      rock:        'dit kledingstuk met band t-shirt en boots, rock stijl',
      business:    'dit kledingstuk met gestructureerd overhemd en nette schoenen, zakelijk',
      boheme:      'dit kledingstuk met linnen top en platte sandalen, boho stijl',
      minimaliste: 'dit kledingstuk met neutraal t-shirt en strakke sneakers, minimalistisch',
      default:     'dit kledingstuk met eenvoudige top en sneakers, hedendaagse stijl 2026',
    },
    PIECE_ENTIERE: {
      casual:      'dit kledingstuk met witte sneakers, casual ontspannen stijl 2026',
      chic:        'dit kledingstuk met hakken en clutch, chic elegante stijl',
      sportif:     'dit kledingstuk met hardloopschoenen, sportswear stijl',
      vintage:     'dit kledingstuk met platte enkellaarzen, vintage retro look',
      streetwear:  'dit kledingstuk met chunky sneakers, urban streetwear stijl',
      rock:        'dit kledingstuk met boots en nieten riem, rock stijl',
      business:    'dit kledingstuk met hakken, klassieke zakelijke stijl',
      boheme:      'dit kledingstuk met gevlochten sandalen, natuurlijke boho stijl',
      minimaliste: 'dit kledingstuk met strakke schoenen, minimalistische stijl',
      default:     'dit kledingstuk met passend schoeisel, hedendaagse stijl 2026',
    },
    VESTE: {
      casual:      'dit jasje over wit t-shirt, straight-leg jeans en sneakers, casual stijl 2026',
      chic:        'dit jasje over blouse, pantalon en hakken, chic stijl',
      sportif:     'dit jasje met joggingbroek en sneakers, sportswear stijl',
      vintage:     'dit jasje over grafisch t-shirt, vintage jeans en enkellaarzen, retro look',
      streetwear:  'dit jasje met hoodie, cargo en chunky sneakers, streetwear stijl',
      rock:        'dit jasje over zwart t-shirt, straight jeans en boots, rock stijl',
      business:    'dit jasje over overhemd, pantalon en nette schoenen, zakelijke stijl',
      boheme:      'dit jasje over bloemenjurk en sandalen, boho stijl',
      minimaliste: 'dit jasje over neutraal t-shirt, strakke broek en loafers, minimalistisch',
      default:     'dit jasje met jeans en sneakers, hedendaagse stijl 2026',
    },
    CHAUSSURE: {
      casual:      'schoenen met straight-leg jeans en wit t-shirt, casual stijl 2026',
      chic:        'schoenen met pantalon en blouse, chic elegante stijl',
      sportif:     'schoenen met sportlegging en top, sportswear stijl',
      vintage:     'schoenen met hoge taille jeans en crop-top, vintage retro look',
      streetwear:  'schoenen met cargo en oversized hoodie, streetwear stijl',
      rock:        'schoenen met zwarte jeans en band t-shirt, rock stijl',
      business:    'schoenen met pak en overhemd, zakelijke stijl',
      boheme:      'schoenen met lange bloemenjurk, boho stijl',
      minimaliste: 'schoenen met strakke broek en neutraal t-shirt, minimalistische stijl',
      default:     'schoenen met hedendaagse casual outfit 2026',
    },
    ACCESSOIRE: {
      casual:      'accessoire met jeans en wit t-shirt, casual ontspannen stijl 2026',
      chic:        'accessoire met elegante outfit, jurk of chic ensemble',
      sportif:     'accessoire met sportswear, legging en top',
      vintage:     'accessoire met vintage jeans en crop-top, retro look',
      streetwear:  'accessoire met cargo en oversized hoodie, streetwear',
      rock:        'accessoire met zwarte jeans en band t-shirt, rock stijl',
      business:    'accessoire met pak of blazer, zakelijke stijl',
      boheme:      'accessoire met lange jurk en sandalen, boho stijl',
      minimaliste: 'accessoire met neutrale strakke stukken, minimalistische stijl',
      default:     'accessoire met hedendaagse casual outfit 2026',
    },
  },
  pl: {
    HAUT: {
      casual:      'ten top z dopasowanymi jeansami i białymi sneakersami, styl casual 2026',
      chic:        'ten top z elegancką spódnicą i szpilkami, styl szykowny i elegancki',
      sportif:     'ten top z legginsami sportowymi i butami do biegania, styl sportswear',
      vintage:     'ten top z jeansami wysokim stanem i botkami, look vintage retro',
      streetwear:  'ten top z cargo baggy i chunky sneakersami, styl streetwear',
      rock:        'ten top z czarnymi straight jeansami i botkami, styl rock',
      business:    'ten top ze spodniami do garnituru i oksoforkami, styl biznesowy',
      boheme:      'ten top z długą kwiecistą spódnicą i sandałami, styl boho',
      minimaliste: 'ten top z prostymi spodniami i loaferami, styl minimalistyczny',
      default:     'ten top z jeansami i sneakersami, styl współczesny 2026',
    },
    BAS: {
      casual:      'ta część garderoby z białą koszulką i sneakersami, styl casual 2026',
      chic:        'ta część garderoby z jedwabną bluzką i szpilkami, styl szykowny',
      sportif:     'ta część garderoby z topem sportowym i butami do biegania, styl sportswear',
      vintage:     'ta część garderoby z crop-topem i mules, look vintage retro',
      streetwear:  'ta część garderoby z oversized hoodie i chunky sneakersami, streetwear',
      rock:        'ta część garderoby z koszulką kapeli i botkami, styl rock',
      business:    'ta część garderoby z dopasowaną koszulą i oksoforkami, styl biznesowy',
      boheme:      'ta część garderoby z lnianym topem i płaskimi sandałami, styl boho',
      minimaliste: 'ta część garderoby z neutralną koszulką i czystymi sneakersami, minimalistyczny',
      default:     'ta część garderoby z prostą koszulką i sneakersami, styl współczesny 2026',
    },
    PIECE_ENTIERE: {
      casual:      'ta część garderoby z białymi sneakersami, styl casual zrelaksowany 2026',
      chic:        'ta część garderoby z obcasami i torebką kopertową, styl szykowny i elegancki',
      sportif:     'ta część garderoby z butami do biegania, styl sportswear',
      vintage:     'ta część garderoby z płaskimi botkami, look vintage retro',
      streetwear:  'ta część garderoby z chunky sneakersami, styl streetwear',
      rock:        'ta część garderoby z botkami i ćwiekowanym paskiem, styl rock',
      business:    'ta część garderoby ze szpilkami, klasyczny styl biznesowy',
      boheme:      'ta część garderoby z plecionymi sandałami, naturalny styl boho',
      minimaliste: 'ta część garderoby z prostymi butami, styl minimalistyczny',
      default:     'ta część garderoby z odpowiednim obuwiem, styl współczesny 2026',
    },
    VESTE: {
      casual:      'ta kurtka na białą koszulkę, dopasowane jeansy i sneakersy, casual 2026',
      chic:        'ta kurtka na bluzkę, eleganckie spodnie i obcasy, styl szykowny',
      sportif:     'ta kurtka z dresem i sneakersami, styl sportswear',
      vintage:     'ta kurtka na koszulkę z nadrukiem, vintage jeansy i botki, retro look',
      streetwear:  'ta kurtka z hoodie, cargo i chunky sneakersami, styl streetwear',
      rock:        'ta kurtka na czarną koszulkę, straight jeansy i botki, styl rock',
      business:    'ta kurtka na koszulę, spodnie do garnituru i oksoforki, styl biznesowy',
      boheme:      'ta kurtka na kwiecistą sukienkę i sandały, styl boho',
      minimaliste: 'ta kurtka na neutralną koszulkę, proste spodnie i loafery, minimalistyczny',
      default:     'ta kurtka z jeansami i sneakersami, styl współczesny 2026',
    },
    CHAUSSURE: {
      casual:      'buty z dopasowanymi jeansami i białą koszulką, styl casual 2026',
      chic:        'buty z eleganckim spodniami i bluzką, styl szykowny i elegancki',
      sportif:     'buty z legginsami sportowymi i topem, styl sportswear',
      vintage:     'buty z jeansami wysokim stanem i crop-topem, look vintage retro',
      streetwear:  'buty z cargo i oversized hoodie, styl streetwear',
      rock:        'buty z czarnymi jeansami i koszulką kapeli, styl rock',
      business:    'buty z garniturem i koszulą, styl biznesowy',
      boheme:      'buty z długą kwiecistą sukienką, styl boho',
      minimaliste: 'buty z prostymi spodniami i neutralną koszulką, styl minimalistyczny',
      default:     'buty ze współczesnym casualowym outfitem 2026',
    },
    ACCESSOIRE: {
      casual:      'akcesorium z jeansami i białą koszulką, styl casual zrelaksowany 2026',
      chic:        'akcesorium z elegancką stylizacją, sukienka lub garnitur',
      sportif:     'akcesorium ze strojem sportowym, legginsy i top',
      vintage:     'akcesorium z vintage jeansami i crop-topem, look retro',
      streetwear:  'akcesorium z cargo i oversized hoodie, streetwear',
      rock:        'akcesorium z czarnymi jeansami i koszulką kapeli, styl rock',
      business:    'akcesorium z garniturem lub marynarką, styl biznesowy',
      boheme:      'akcesorium z długą sukienką i sandałami, styl boho',
      minimaliste: 'akcesorium z neutralnymi prostymi ubraniami, styl minimalistyczny',
      default:     'akcesorium ze współczesnym casualowym outfitem 2026',
    },
  },
}

function generateOutfitPrompt(result: RecognitionResult, lang: Lang): string {
  const type = classifyGarment(result.vintedPath?.value ?? '')
  const style = normalizeStyle(result.style?.value ?? '')
  const prompts = OUTFIT_PROMPTS[lang] ?? OUTFIT_PROMPTS.en
  return (
    prompts[type]?.[style]
    ?? prompts[type]?.['default']
    ?? OUTFIT_PROMPTS.en[type]?.['default']
    ?? 'outfit adapted to the garment, contemporary 2026 casual style'
  )
}

/* ─── Composant principal ────────────────────────────────────────────────── */

export default function RecognitionStep({ slots, setSlots, result, aiPhotos: _aiPhotos, setAiPhotos, plan }: Props) {
  const { lang } = useLang()
  const ui = UI_I18N[lang] ?? UI_I18N.fr
  const dimPresets = DIM_PRESETS_I18N[lang] ?? DIM_PRESETS_I18N.fr
  const extraPresets = EXTRA_INFO_PRESETS_I18N[lang] ?? EXTRA_INFO_PRESETS_I18N.fr
  const mannI18n  = MANNEQUIN_I18N[lang]  ?? MANNEQUIN_I18N.fr
  const bgI18n    = BG_PANEL_I18N[lang]   ?? BG_PANEL_I18N.fr
  /* selectedBg — fond choisi, persisté en localStorage */
  const [selectedBg, setSelectedBg] = useState(() => {
    if (typeof window === 'undefined') return 0
    return parseInt(localStorage.getItem('sellerlab_bg_choice') ?? '0') || 0
  })

  /* Mannequin IA */
  const [selectedMannequin, setSelectedMannequin] = useState<string | null>(null)
  const [isGeneratingMannequin, setIsGeneratingMannequin] = useState(false)
  const [mannequinCustomPrompt, setMannequinCustomPrompt] = useState('outfit adapted to the garment, contemporary 2026 casual style')
  const promptIsAutoRef = useRef(true)
  const handleCustomPromptChange = (v: string) => {
    promptIsAutoRef.current = false
    setMannequinCustomPrompt(v)
  }
  const [mannequinWearingPrompt, setMannequinWearingPrompt] = useState('')

  /* Photos produit non portées */
  const [productDisplayMode, setProductDisplayMode] = useState<'bust' | 'hanger' | 'flat'>('bust')
  const [isGeneratingProductPhoto, setIsGeneratingProductPhoto] = useState(false)
  const [productPhotos, setProductPhotos] = useState<string[]>([])

  /* Fond — slots réels */
  const slotsRef = useRef<PhotoSlot[]>(slots)
  useEffect(() => { slotsRef.current = slots }, [slots])
  const [bgCheckedSlots,  setBgCheckedSlots]  = useState<Set<number>>(new Set())
  const [isProcessingBg,  setIsProcessingBg]  = useState(false)
  const [compositedUrls,  setCompositedUrls]  = useState<Record<number, string>>({})
  const [isCompositing,   setIsCompositing]   = useState(false)

  /* Détourage + composition photos portées */
  const [aiCutoutEntries, setAiCutoutEntries] = useState<AiCutoutEntry[]>([])
  const [aiCompositedPhotos, setAiCompositedPhotos] = useState<string[]>([])

  /* Détourage + composition photos produit non portées */
  const [productCutoutEntries, setProductCutoutEntries] = useState<AiCutoutEntry[]>([])

  const handleBgSelect = (id: number) => {
    setSelectedBg(id)
    localStorage.setItem('sellerlab_bg_choice', String(id))
  }

  /* Régénère le prompt de tenue quand result change, sauf si l'utilisateur l'a modifié */
  useEffect(() => {
    if (!result || !promptIsAutoRef.current) return
    setMannequinCustomPrompt(generateOutfitPrompt(result, lang))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result])

  /* Compositing slots réels (processedUrl) → compositedUrls */
  const processedSlotKey = slots
    .filter(s => s.processedUrl)
    .map(s => `${s.id}:${s.processedUrl}`)
    .join('|')

  useEffect(() => {
    const processedSlots = slots.filter(s => s.processedUrl !== null)
    if (processedSlots.length === 0) {
      setCompositedUrls(prev => {
        Object.values(prev).forEach(u => u && URL.revokeObjectURL(u))
        return {}
      })
      setIsCompositing(false)
      return
    }
    let cancelled = false
    setIsCompositing(true)
    Promise.all(
      processedSlots.map(slot =>
        compositeWithBackground(slot.processedUrl!, BACKGROUNDS.find(b => b.id === selectedBg) ?? BACKGROUNDS[0])
          .then(url => ({ id: slot.id, url }))
          .catch(() => ({ id: slot.id, url: '' }))
      )
    ).then(results => {
      if (cancelled) return
      const next: Record<number, string> = {}
      results.forEach(({ id, url }) => { if (url) next[id] = url })
      setCompositedUrls(prev => {
        Object.values(prev).forEach(u => u && URL.revokeObjectURL(u))
        return next
      })
      setSlots(prev => prev.map(s => ({ ...s, compositedUrl: next[s.id] ?? undefined })))
      setIsCompositing(false)
    }).catch(() => { if (!cancelled) setIsCompositing(false) })
    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [processedSlotKey, selectedBg])

  /* Recomposite photos portées sur le fond choisi */
  useEffect(() => {
    if (aiCutoutEntries.length === 0) { setAiCompositedPhotos([]); return }
    const bg = BACKGROUNDS.find(b => b.id === selectedBg) ?? BACKGROUNDS[0]
    let cancelled = false
    Promise.all(
      aiCutoutEntries.map(({ cutout, original }) =>
        compositeWithBackground(cutout ?? original, bg).catch(() => original)
      )
    ).then(results => { if (!cancelled) setAiCompositedPhotos(results) })
    return () => { cancelled = true }
  }, [aiCutoutEntries, selectedBg])

  /* Recomposite photos produit non portées sur le fond choisi */
  useEffect(() => {
    if (productCutoutEntries.length === 0) { setProductPhotos([]); return }
    const bg = BACKGROUNDS.find(b => b.id === selectedBg) ?? BACKGROUNDS[0]
    let cancelled = false
    Promise.all(
      productCutoutEntries.map(({ cutout, original }) =>
        compositeWithBackground(cutout ?? original, bg).catch(() => original)
      )
    ).then(results => { if (!cancelled) setProductPhotos(results) })
    return () => { cancelled = true }
  }, [productCutoutEntries, selectedBg])

  const handleGenerateMannequin = useCallback(async () => {
    if (!selectedMannequin || isGeneratingMannequin) return
    const slot0 = slots[0]
    if (!slot0?.file) return
    setIsGeneratingMannequin(true)
    try {
      const reader = new FileReader()
      const base64 = await new Promise<string>((resolve, reject) => {
        reader.onload  = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(slot0.file!)
      })
      const rawPrompt = mannequinCustomPrompt.trim()
      let outfitPromptEn = rawPrompt || undefined
      if (rawPrompt) {
        try {
          const trRes = await fetch('/api/translate-prompt', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ text: rawPrompt, source_lang: lang }),
          })
          if (trRes.ok) {
            const { translated } = await trRes.json() as { translated: string }
            if (translated) outfitPromptEn = translated
          }
        } catch {
          /* fallback: send original prompt */
        }
      }
      const res = await fetch('/api/generate-mannequin', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          product_image:  base64,
          mannequin_id:   selectedMannequin,
          outfit_prompt:  outfitPromptEn,
          wearing_prompt: mannequinWearingPrompt.trim() || undefined,
        }),
      })
      if (!res.ok) throw new Error('Generation failed')
      const { urls } = await res.json() as { urls: string[] }
      setAiPhotos(urls)
      const { removeBackground } = await import('@imgly/background-removal')
      const entries: AiCutoutEntry[] = await Promise.all(
        urls.map(async (original): Promise<AiCutoutEntry> => {
          try {
            const fetchRes = await fetch(original)
            if (!fetchRes.ok) return { cutout: null, original }
            const blob       = await fetchRes.blob()
            const resultBlob = await removeBackground(blob)
            return { cutout: URL.createObjectURL(resultBlob), original }
          } catch {
            return { cutout: null, original }
          }
        })
      )
      setAiCutoutEntries(entries)
    } catch (err) {
      console.error('Mannequin generation failed:', err)
    } finally {
      setIsGeneratingMannequin(false)
    }
  }, [selectedMannequin, isGeneratingMannequin, mannequinCustomPrompt, mannequinWearingPrompt, slots, setAiPhotos])

  const handleGenerateProductPhoto = useCallback(async () => {
    if (isGeneratingProductPhoto) return
    const slot0 = slots[0]
    if (!slot0?.file) return
    setIsGeneratingProductPhoto(true)
    try {
      const reader = new FileReader()
      const base64 = await new Promise<string>((resolve, reject) => {
        reader.onload  = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(slot0.file!)
      })
      const res = await fetch('/api/generate-product-photo', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          product_image: base64,
          display_mode:  productDisplayMode,
          num_images:    2,
        }),
      })
      if (!res.ok) throw new Error('Generation failed')
      const { urls } = await res.json() as { urls: string[] }
      const { removeBackground } = await import('@imgly/background-removal')
      const entries: AiCutoutEntry[] = await Promise.all(
        urls.map(async (original): Promise<AiCutoutEntry> => {
          try {
            const fetchRes = await fetch(original)
            if (!fetchRes.ok) return { cutout: null, original }
            const blob       = await fetchRes.blob()
            const resultBlob = await removeBackground(blob)
            return { cutout: URL.createObjectURL(resultBlob), original }
          } catch {
            return { cutout: null, original }
          }
        })
      )
      setProductCutoutEntries(entries)
    } catch (err) {
      console.error('Product photo generation failed:', err)
    } finally {
      setIsGeneratingProductPhoto(false)
    }
  }, [isGeneratingProductPhoto, productDisplayMode, slots])

  /* ── Bg removal — slots réels ── */
  const updateSlot = useCallback(
    (id: number, patch: Partial<PhotoSlot>) =>
      setSlots(prev => prev.map(s => s.id === id ? { ...s, ...patch } : s)),
    [setSlots],
  )

  const processCheckedSlots = useCallback(async () => {
    if (isProcessingBg || bgCheckedSlots.size === 0) return
    setIsProcessingBg(true)
    const toProcess = Array.from(bgCheckedSlots)
    setSlots(prev => prev.map(s =>
      toProcess.includes(s.id) && s.file ? { ...s, status: 'processing-bg' as const } : s
    ))
    for (const slotId of toProcess) {
      const slot = slotsRef.current[slotId]
      if (!slot?.file) continue
      try {
        const { removeBackground } = await import('@imgly/background-removal')
        const blob = new Blob([await slot.file.arrayBuffer()], { type: slot.file.type || 'image/jpeg' })
        const resultBlob = await removeBackground(blob)
        updateSlot(slotId, { status: 'done', processedUrl: URL.createObjectURL(resultBlob) })
      } catch (err) {
        console.error(`Background removal failed (slot ${slotId}):`, err)
        updateSlot(slotId, { status: 'done', processedUrl: null, error: 'bg_failed' })
      }
    }
    setBgCheckedSlots(new Set())
    setIsProcessingBg(false)
  }, [isProcessingBg, bgCheckedSlots, updateSlot, setSlots])

  const handleValidateAndProcess = useCallback(async () => {
    const slot0 = slotsRef.current[0]
    if (slot0?.file) {
      updateSlot(0, { status: 'processing-bg' })
      try {
        const { removeBackground } = await import('@imgly/background-removal')
        const blob = new Blob([await slot0.file.arrayBuffer()], { type: slot0.file.type || 'image/jpeg' })
        const resultBlob = await removeBackground(blob)
        updateSlot(0, { status: 'done', processedUrl: URL.createObjectURL(resultBlob) })
      } catch {
        updateSlot(0, { status: 'done', processedUrl: null, error: 'bg_failed' })
      }
    }
  }, [updateSlot])

  const toggleBgCheck = (slotId: number) => {
    setBgCheckedSlots(prev => {
      const next = new Set(prev)
      if (next.has(slotId)) next.delete(slotId)
      else next.add(slotId)
      return next
    })
  }

  if (!result) return null

  /* ── Rendu visuel ── */
  return (
    <div className="space-y-6">

        {/* ── Panneau fond + suppression arrière-plan ── */}
        <BgPanel
          plan={plan}
          slots={slots}
          selectedBg={selectedBg}
          onBgSelect={handleBgSelect}
          bgCheckedSlots={bgCheckedSlots}
          onCheckToggle={toggleBgCheck}
          isProcessing={isProcessingBg}
          onProcess={processCheckedSlots}
          onValidateFreemium={handleValidateAndProcess}
          bgI18n={bgI18n}
        />

        {/* ── RENDU — photos avec fond traité ── */}
        {Object.keys(compositedUrls).length > 0 && (
          <div>
            <p className="text-[10px] font-bold text-gray-400 tracking-widest mb-1.5">{bgI18n.rendTitle}</p>
            <div className="grid grid-cols-4 gap-2 items-start">
              {Object.entries(compositedUrls).map(([id, url]) => (
                <div key={id} className="relative aspect-[3/4] rounded-xl overflow-hidden border border-green-200 shadow-sm">
                  <img src={url} alt={`Rendu ${id}`} className="w-full h-full object-cover" draggable={false} />
                  <div className="absolute top-1 left-1">
                    <span className="bg-green-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow">✓</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Génération photos IA (mannequin + produit) ── */}
        <MannequinPanel
          selectedMannequin={selectedMannequin}
          onSelect={setSelectedMannequin}
          onGenerate={handleGenerateMannequin}
          isGenerating={isGeneratingMannequin}
          hasSlot0Photo={!!slots[0]?.file}
          mannI18n={mannI18n}
          customPrompt={mannequinCustomPrompt}
          onCustomPromptChange={handleCustomPromptChange}
          wearingPrompt={mannequinWearingPrompt}
          onWearingPromptChange={setMannequinWearingPrompt}
          productDisplayMode={productDisplayMode}
          onProductDisplayModeChange={setProductDisplayMode}
          onGenerateProductPhoto={handleGenerateProductPhoto}
          isGeneratingProductPhoto={isGeneratingProductPhoto}
          initialGender={result.genre.value === 'homme' ? 'men' : result.genre.value === 'femme' ? 'women' : 'men'}
        />

        {/* ── RENDU — photos IA ── */}
        {(aiCompositedPhotos.length > 0 || productPhotos.length > 0) && (
          <div>
            <p className="text-[10px] font-bold text-gray-400 tracking-widest mb-1.5">{mannI18n.rendTitle}</p>
            <div className="grid grid-cols-4 gap-2 items-start">
              {aiCompositedPhotos.map((url, i) => (
                <div key={`ai-${i}`} className="relative aspect-[3/4] rounded-xl overflow-hidden border border-purple-200 shadow-sm">
                  <img src={url} alt={`IA ${i + 1}`} className="w-full h-full object-cover" draggable={false} />
                  <div className="absolute top-1 left-1">
                    <span className="bg-purple-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow">{mannI18n.badgeAI}</span>
                  </div>
                </div>
              ))}
              {productPhotos.map((url, i) => (
                <div key={`prod-${i}`} className="relative aspect-[3/4] rounded-xl overflow-hidden border border-blue-200 shadow-sm">
                  <img src={url} alt={`Produit ${i + 1}`} className="w-full h-full object-cover" draggable={false} />
                  <div className="absolute top-1 left-1">
                    <span className="bg-blue-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow">📦</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

    </div>
  )
}

/* ─── MannequinPanel ─────────────────────────────────────────────────────── */

interface MannequinPanelProps {
  selectedMannequin: string | null
  onSelect: (id: string) => void
  onGenerate: () => void
  isGenerating: boolean
  hasSlot0Photo: boolean
  mannI18n: typeof MANNEQUIN_I18N.fr
  customPrompt: string
  onCustomPromptChange: (v: string) => void
  wearingPrompt: string
  onWearingPromptChange: (v: string) => void
  productDisplayMode: 'bust' | 'hanger' | 'flat'
  onProductDisplayModeChange: (v: 'bust' | 'hanger' | 'flat') => void
  onGenerateProductPhoto: () => void
  isGeneratingProductPhoto: boolean
  initialGender?: 'men' | 'women'
}

function MannequinPanel({
  selectedMannequin, onSelect, onGenerate, isGenerating, hasSlot0Photo,
  mannI18n, customPrompt, onCustomPromptChange,
  wearingPrompt, onWearingPromptChange,
  productDisplayMode, onProductDisplayModeChange,
  onGenerateProductPhoto, isGeneratingProductPhoto,
  initialGender = 'men',
}: MannequinPanelProps) {
  const [gender, setGender]                   = useState<'men' | 'women'>(initialGender)
  const [previewId, setPreviewId]             = useState<string | null>(null)
  const [showCustomPrompt, setShowCustomPrompt]   = useState(false)
  const [showWearingPrompt, setShowWearingPrompt] = useState(false)
  const canGenerate        = !!selectedMannequin && hasSlot0Photo
  const canGenerateProduct = hasSlot0Photo
  const mannequins         = gender === 'men' ? MEN_MANNEQUINS : WOMEN_MANNEQUINS

  return (
    <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4 space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
          <User className="w-4 h-4 text-purple-600" />
        </div>
        <h3 className="font-display font-extrabold text-base text-purple-900">{mannI18n.mannequinTitle}</h3>
      </div>

      {/* Gender pills */}
      <div className="flex gap-2">
        {(['men', 'women'] as const).map(g => (
          <button
            key={g}
            onClick={() => setGender(g)}
            className={`flex-1 text-xs font-semibold py-2 rounded-xl transition-all ${
              gender === g
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-white text-purple-500 border border-purple-200 hover:border-purple-400'
            }`}
          >
            {g === 'men' ? mannI18n.mannequinMen : mannI18n.mannequinWomen}
          </button>
        ))}
      </div>

      {/* Mannequin grid — thumbnails cropped to head */}
      <div className="flex gap-2 overflow-x-auto pb-1 snap-x">
        {mannequins.map(id => (
          <button
            key={id}
            onClick={() => { onSelect(id); setPreviewId(id) }}
            className={`relative snap-start shrink-0 w-20 h-20 rounded-xl overflow-hidden transition-all ${
              selectedMannequin === id
                ? 'ring-2 ring-purple-500 ring-offset-1 scale-[1.06]'
                : 'ring-1 ring-purple-200 hover:ring-purple-400'
            }`}
          >
            <img
              src={`/mannequins/final/${id}.png`} alt={id}
              className="w-full h-full object-cover"
              style={{ objectPosition: '50% 0%' }}
              draggable={false}
            />
            {selectedMannequin === id && (
              <div className="absolute inset-0 flex items-center justify-center bg-purple-600/20">
                <Check className="w-4 h-4 text-white drop-shadow" />
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Full-body preview */}
      {previewId && (
        <div className="rounded-xl overflow-hidden border border-purple-200 bg-white shadow-sm">
          <div className="relative">
            <img
              src={`/mannequins/final/${previewId}.png`}
              alt={previewId}
              className="w-full object-contain"
              style={{ maxHeight: '380px' }}
              draggable={false}
            />
            <button
              onClick={() => setPreviewId(null)}
              className="absolute top-2 right-2 bg-white/90 text-gray-500 text-[10px] font-bold w-6 h-6 rounded-full shadow hover:bg-white transition-colors flex items-center justify-center"
            >
              ×
            </button>
          </div>
          <div className="p-2 border-t border-purple-100">
            <button
              onClick={() => setPreviewId(null)}
              className="w-full flex items-center justify-center gap-2 font-semibold text-sm py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white active:scale-[0.98] transition-all"
            >
              <Check className="w-4 h-4" />
              {mannI18n.modalConfirmMannequin}
            </button>
          </div>
        </div>
      )}

      {/* Champs optionnels tenue + port — repliés par défaut */}
      <div className="space-y-1.5">
        <div>
          <button
            type="button"
            onClick={() => setShowCustomPrompt(v => !v)}
            className="w-full flex items-center justify-between gap-2 text-sm font-semibold text-purple-600 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl px-3 py-2.5 transition-colors"
          >
            <span>{mannI18n.mannequinCustomPromptLabel}</span>
            <span className="text-purple-400 text-base leading-none">{showCustomPrompt ? '▾' : '▸'}</span>
          </button>
          {showCustomPrompt && (
            <textarea
              value={customPrompt}
              onChange={e => onCustomPromptChange(e.target.value)}
              rows={2}
              placeholder="outfit adapted to the garment, contemporary 2026 casual style"
              className="mt-1.5 w-full text-xs rounded-xl border border-purple-200 bg-white px-3 py-2 text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-300 resize-none"
            />
          )}
        </div>
        <div>
          <button
            type="button"
            onClick={() => setShowWearingPrompt(v => !v)}
            className="w-full flex items-center justify-between gap-2 text-sm font-semibold text-purple-600 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl px-3 py-2.5 transition-colors"
          >
            <span>{mannI18n.wearingPromptLabel}</span>
            <span className="text-purple-400 text-base leading-none">{showWearingPrompt ? '▾' : '▸'}</span>
          </button>
          {showWearingPrompt && (
            <textarea
              value={wearingPrompt}
              onChange={e => onWearingPromptChange(e.target.value)}
              rows={2}
              placeholder="veste ouverte, manches retroussées"
              className="mt-1.5 w-full text-xs rounded-xl border border-purple-200 bg-white px-3 py-2 text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-300 resize-none"
            />
          )}
        </div>
      </div>

      {/* Bouton générer photos portées */}
      <button
        onClick={onGenerate}
        disabled={!canGenerate || isGenerating}
        className={`w-full flex items-center justify-center gap-2 font-semibold text-sm py-3 rounded-xl transition-all ${
          canGenerate && !isGenerating
            ? 'bg-purple-600 hover:bg-purple-700 text-white active:scale-[0.98]'
            : 'bg-purple-100 text-purple-400 cursor-not-allowed'
        }`}
      >
        {isGenerating ? (
          <>
            <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
            {mannI18n.mannequinGenerating}
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            {mannI18n.mannequinGenerate}
          </>
        )}
      </button>

      <div className="border-t border-purple-100" />

      {/* Sélecteur type photo produit */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-purple-700">{mannI18n.displayModeTitle}</p>
        <div className="flex gap-2">
          {(['bust', 'hanger', 'flat'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => onProductDisplayModeChange(mode)}
              className={`flex-1 text-xs font-semibold py-2 rounded-xl transition-all ${
                productDisplayMode === mode
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-white text-purple-500 border border-purple-200 hover:border-purple-400'
              }`}
            >
              {mode === 'bust' ? mannI18n.displayModeBust
                : mode === 'hanger' ? mannI18n.displayModeHanger
                : mannI18n.displayModeFlat}
            </button>
          ))}
        </div>
        <button
          onClick={onGenerateProductPhoto}
          disabled={!canGenerateProduct || isGeneratingProductPhoto}
          className={`w-full flex items-center justify-center gap-2 font-semibold text-sm py-3 rounded-xl transition-all ${
            canGenerateProduct && !isGeneratingProductPhoto
              ? 'bg-blue-600 hover:bg-blue-700 text-white active:scale-[0.98]'
              : 'bg-blue-100 text-blue-400 cursor-not-allowed'
          }`}
        >
          {isGeneratingProductPhoto ? (
            <>
              <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
              {mannI18n.mannequinGenerating}
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              {mannI18n.generateProductPhotos}
            </>
          )}
        </button>
      </div>

      {!hasSlot0Photo && (
        <p className="text-xs text-purple-400 text-center">{mannI18n.noSlot0Msg}</p>
      )}
      {hasSlot0Photo && !selectedMannequin && (
        <p className="text-xs text-purple-400 text-center">{mannI18n.noMannequinMsg}</p>
      )}
    </div>
  )
}

/* ─── BgPanel — sélection fond + suppression arrière-plan ────────────────── */

interface BgPanelProps {
  plan: Plan
  slots: PhotoSlot[]
  selectedBg: number
  onBgSelect: (id: number) => void
  bgCheckedSlots: Set<number>
  onCheckToggle: (id: number) => void
  isProcessing: boolean
  onProcess: () => void
  onValidateFreemium: () => void
  bgI18n: typeof BG_PANEL_I18N.fr
}

function BgPanel({
  plan, slots, selectedBg, onBgSelect,
  bgCheckedSlots, onCheckToggle, isProcessing, onProcess,
  onValidateFreemium, bgI18n,
}: BgPanelProps) {
  const [showPreview, setShowPreview] = useState(false)
  const currentBg = BACKGROUNDS[selectedBg] ?? BACKGROUNDS[0]
  const filledSlots = slots.filter(s => s.file !== null)

  return (
    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 space-y-3">
      <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">{bgI18n.bgPanelTitle}</p>

      {/* Carrousel snap-x horizontal */}
      <div className="flex gap-2 overflow-x-auto pb-1 snap-x snap-mandatory">
        {BACKGROUNDS.map(bg => {
          const isLocked = plan === 'freemium' && bg.id !== 0
          return (
            <button
              key={bg.id}
              onClick={() => { if (!isLocked) { onBgSelect(bg.id); setShowPreview(true) } }}
              disabled={isLocked}
              className={`relative snap-start shrink-0 w-16 h-16 rounded-xl overflow-hidden transition-all
                ${isLocked ? 'cursor-not-allowed' : 'cursor-pointer'}
                ${selectedBg === bg.id && !isLocked
                  ? 'ring-2 ring-indigo-500 ring-offset-2 scale-[1.06] shadow-md shadow-indigo-200'
                  : isLocked ? 'ring-1 ring-gray-200 opacity-60'
                  : 'ring-1 ring-gray-200 hover:ring-indigo-300'}`}
            >
              {bg.type === 'color'
                ? <div className="w-full h-full" style={{ backgroundColor: bg.color }} />
                : <img src={bg.src} alt={bg.label} className="w-full h-full object-cover" draggable={false} />}
              {selectedBg === bg.id && !isLocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-indigo-600/20">
                  <Check className="w-4 h-4 text-white drop-shadow-md" />
                </div>
              )}
              {isLocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                  <Lock className="w-3 h-3 text-white/90" />
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Preview inline du fond sélectionné */}
      {showPreview && plan !== 'freemium' && (
        <div className="rounded-xl overflow-hidden border border-blue-200 shadow-sm">
          <div className="w-full" style={{ maxHeight: '380px', minHeight: '120px' }}>
            {currentBg.type === 'color'
              ? <div className="w-full h-full" style={{ backgroundColor: currentBg.color, minHeight: '120px' }} />
              : <img src={currentBg.src} alt={currentBg.label} className="w-full object-contain" style={{ maxHeight: '380px' }} draggable={false} />}
          </div>
          <div className="p-2 border-t border-blue-100">
            <button
              onClick={() => setShowPreview(false)}
              className="w-full flex items-center justify-center gap-2 font-semibold text-sm py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white active:scale-[0.98] transition-all"
            >
              <Check className="w-4 h-4" />
              {bgI18n.modalConfirmBg}
            </button>
          </div>
        </div>
      )}

      {/* Freemium : msg verrou + bannière photo principale */}
      {plan === 'freemium' ? (
        <>
          <p className="text-xs text-blue-500 flex items-center gap-1.5">
            <Lock className="w-3 h-3 shrink-0" />
            {bgI18n.freemiumLockMsg}
          </p>
          {filledSlots.length > 0 && slots[0]?.processedUrl === null && (
            <div className="rounded-xl border border-blue-200 bg-white p-3 space-y-3">
              <div className="flex items-start gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
                  <Wand2 className="w-3.5 h-3.5 text-indigo-600" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-indigo-900 leading-snug">{bgI18n.bannerTitle}</p>
                  <p className="text-xs text-indigo-700 mt-0.5">{bgI18n.bannerDesc}</p>
                </div>
              </div>
              <button
                onClick={onValidateFreemium}
                disabled={slots[0]?.status === 'processing-bg'}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm py-2.5 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {slots[0]?.status === 'processing-bg' ? (
                  <><div className="w-4 h-4 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />{bgI18n.processing}</>
                ) : (
                  <><Wand2 className="w-4 h-4" />{bgI18n.bannerBtn}</>
                )}
              </button>
            </div>
          )}
        </>
      ) : (
        /* Premium / Pro : hint + sélection multi-photos + bouton */
        <>
          <p className="text-xs text-blue-600">{bgI18n.checkboxHint}</p>
          {filledSlots.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {filledSlots.map(slot => (
                <button
                  key={slot.id}
                  onClick={() => onCheckToggle(slot.id)}
                  className={`relative w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                    bgCheckedSlots.has(slot.id) ? 'border-indigo-500 shadow-md' : 'border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  {slot.preview && (
                    <img src={slot.preview} alt={`slot ${slot.id}`} className="w-full h-full object-cover" />
                  )}
                  {bgCheckedSlots.has(slot.id) && (
                    <div className="absolute inset-0 bg-indigo-600/30 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                  {slot.processedUrl && (
                    <div className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-green-500" />
                  )}
                </button>
              ))}
            </div>
          )}
          {bgCheckedSlots.size > 0 && (
            <button
              onClick={onProcess}
              disabled={isProcessing}
              className={`w-full flex items-center justify-center gap-2 font-semibold text-sm py-3 rounded-xl transition-all ${
                !isProcessing ? 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-[0.98]'
                : 'bg-indigo-100 text-indigo-400 cursor-wait'}`}
            >
              {isProcessing
                ? <><div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />{bgI18n.processing}</>
                : <><Wand2 className="w-4 h-4" />{bgI18n.processBtn(bgCheckedSlots.size)}</>}
            </button>
          )}
        </>
      )}
    </div>
  )
}
