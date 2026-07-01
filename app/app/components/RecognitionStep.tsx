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
import { readPrefs, savePrefs } from '@/lib/user-prefs'
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
  mannequinSubtitle: string
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
  photosGenerated: (n: number) => string
  posesLabel: string
  poseFace: string
  poseBack: string
  poseSelfieFace: string
  poseSelfie34: string
  poseSelfieProfile: string
  poseSeatedSelfie: string
  posesHint: string
  noVersoWarning: string
  proBadge: string
  proRequired: string
  proMessage: string
  modalConfirmBg: string
}> = {
  fr: {
    mannequinTitle: 'Studio photo IA',
    mannequinSubtitle: 'Génère des photos portées (face, profil, dos) et des photos produit (buste, cintre, à plat)',
    mannequinMen: 'Homme', mannequinWomen: 'Femme',
    mannequinGenerate: 'Générer les photos portées',
    mannequinGenerating: 'Génération en cours…',
    mannequinCustomPromptLabel: 'Personnaliser la tenue',
    wearingPromptLabel: 'Comment porter le vêtement',
    displayModeTitle: 'Présentation de l\'article',
    displayModeBust: 'Buste', displayModeHanger: 'Cintre', displayModeFlat: 'À plat',
    generateProductPhotos: 'Générer les photos produit',
    badgeAI: 'IA', noSlot0Msg: "Ajoutez d'abord la photo principale",
    noMannequinMsg: 'Sélectionnez un mannequin',
    rendTitle: '📸 RENDU — PHOTOS IA', modalConfirmMannequin: 'Choisir ce mannequin',
    photosGenerated: (n) => `· ${n} photo${n > 1 ? 's' : ''} générée${n > 1 ? 's' : ''}`,
    posesLabel: 'Poses à générer',
    poseFace: 'De face', poseBack: 'De dos', poseSelfieFace: 'Selfie de face', poseSelfie34: 'Selfie 3/4',
    poseSelfieProfile: 'Selfie de profil', poseSeatedSelfie: 'Selfie assis',
    posesHint: 'La photo de face est toujours générée. Cochez les poses supplémentaires.',
    noVersoWarning: 'Sans photo de dos de l\'article (étape Photos), les vues de dos ne seront pas générées.',
    proBadge: 'Pro',
    proRequired: 'Réservé au plan Pro',
    proMessage: 'Passez au plan Pro pour générer des photos portées avec mannequin IA',
    modalConfirmBg: 'Utiliser ce fond',
  },
  en: {
    mannequinTitle: 'AI Photo Studio',
    mannequinSubtitle: 'Generate worn photos (front, side, back) and product photos (bust, hanger, flat lay)',
    mannequinMen: 'Men', mannequinWomen: 'Women',
    mannequinGenerate: 'Generate worn photos',
    mannequinGenerating: 'Generating…',
    mannequinCustomPromptLabel: 'Customize the outfit',
    wearingPromptLabel: 'How to wear the garment',
    displayModeTitle: 'Item presentation',
    displayModeBust: 'Bust', displayModeHanger: 'Hanger', displayModeFlat: 'Flat lay',
    generateProductPhotos: 'Generate product photos',
    badgeAI: 'AI', noSlot0Msg: 'Add the main photo first',
    noMannequinMsg: 'Select a model',
    rendTitle: '📸 RENDER — AI PHOTOS', modalConfirmMannequin: 'Choose this model',
    photosGenerated: (n) => `· ${n} photo${n > 1 ? 's' : ''} generated`,
    posesLabel: 'Poses to generate',
    poseFace: 'Front view', poseBack: 'Back view', poseSelfieFace: 'Front selfie', poseSelfie34: '3/4 selfie',
    poseSelfieProfile: 'Profile selfie', poseSeatedSelfie: 'Seated selfie',
    posesHint: 'The front photo is always generated. Check additional poses.',
    noVersoWarning: 'Without a back photo of the item (Photos step), back views won\'t be generated.',
    proBadge: 'Pro',
    proRequired: 'Pro plan only',
    proMessage: 'Upgrade to Pro to generate worn photos with AI models',
    modalConfirmBg: 'Use this background',
  },
  es: {
    mannequinTitle: 'Estudio foto IA',
    mannequinSubtitle: 'Genera fotos vestidas (frente, perfil, espalda) y fotos de producto (busto, percha, plano)',
    mannequinMen: 'Hombre', mannequinWomen: 'Mujer',
    mannequinGenerate: 'Generar fotos vestidas',
    mannequinGenerating: 'Generando…',
    mannequinCustomPromptLabel: 'Personalizar el atuendo',
    wearingPromptLabel: 'Cómo llevar la prenda',
    displayModeTitle: 'Presentación del artículo',
    displayModeBust: 'Busto', displayModeHanger: 'Percha', displayModeFlat: 'Plano',
    generateProductPhotos: 'Generar fotos de producto',
    badgeAI: 'IA', noSlot0Msg: 'Añade primero la foto principal',
    noMannequinMsg: 'Selecciona un maniquí',
    rendTitle: '📸 RESULTADO — FOTOS IA', modalConfirmMannequin: 'Elegir este maniquí',
    photosGenerated: (n) => `· ${n} foto${n > 1 ? 's' : ''} generada${n > 1 ? 's' : ''}`,
    posesLabel: 'Poses a generar',
    poseFace: 'De frente', poseBack: 'De espaldas', poseSelfieFace: 'Selfie de frente', poseSelfie34: 'Selfie 3/4',
    poseSelfieProfile: 'Selfie de perfil', poseSeatedSelfie: 'Selfie sentado',
    posesHint: 'La foto de frente siempre se genera. Marca las poses adicionales.',
    noVersoWarning: 'Sin una foto trasera del artículo (paso Fotos), no se generarán las vistas de espalda.',
    proBadge: 'Pro',
    proRequired: 'Solo plan Pro',
    proMessage: 'Cambia al plan Pro para generar fotos vestidas con modelos IA',
    modalConfirmBg: 'Usar este fondo',
  },
  de: {
    mannequinTitle: 'KI-Fotostudio',
    mannequinSubtitle: 'Erstellt Anzieh-Fotos (vorne, seitlich, hinten) und Produktfotos (Büste, Bügel, flach)',
    mannequinMen: 'Männer', mannequinWomen: 'Frauen',
    mannequinGenerate: 'Anzieh-Fotos generieren',
    mannequinGenerating: 'Wird generiert…',
    mannequinCustomPromptLabel: 'Outfit anpassen',
    wearingPromptLabel: 'Wie das Kleidungsstück getragen wird',
    displayModeTitle: 'Artikeldarstellung',
    displayModeBust: 'Büste', displayModeHanger: 'Bügel', displayModeFlat: 'Flach',
    generateProductPhotos: 'Produktfotos generieren',
    badgeAI: 'KI', noSlot0Msg: 'Füge zuerst das Hauptfoto hinzu',
    noMannequinMsg: 'Wähle ein Modell',
    rendTitle: '📸 VORSCHAU — KI-FOTOS', modalConfirmMannequin: 'Dieses Modell wählen',
    photosGenerated: (n) => `· ${n} Foto${n > 1 ? 's' : ''} generiert`,
    posesLabel: 'Zu generierende Posen',
    poseFace: 'Vorderansicht', poseBack: 'Rückansicht', poseSelfieFace: 'Selfie von vorne', poseSelfie34: '3/4-Selfie',
    poseSelfieProfile: 'Profil-Selfie', poseSeatedSelfie: 'Sitzendes Selfie',
    posesHint: 'Das Frontfoto wird immer generiert. Wähle zusätzliche Posen.',
    noVersoWarning: 'Ohne Rückenfoto des Artikels (Schritt Fotos) werden keine Rückansichten generiert.',
    proBadge: 'Pro',
    proRequired: 'Nur im Pro-Tarif',
    proMessage: 'Wechsle zum Pro-Tarif, um getragene Fotos mit KI-Modellen zu erstellen',
    modalConfirmBg: 'Diesen Hintergrund verwenden',
  },
  it: {
    mannequinTitle: 'Studio foto IA',
    mannequinSubtitle: 'Genera foto indossate (fronte, profilo, retro) e foto prodotto (busto, gruccia, piano)',
    mannequinMen: 'Uomo', mannequinWomen: 'Donna',
    mannequinGenerate: 'Genera foto indossate',
    mannequinGenerating: 'Generazione in corso…',
    mannequinCustomPromptLabel: "Personalizza l'outfit",
    wearingPromptLabel: 'Come indossare il capo',
    displayModeTitle: "Presentazione dell'articolo",
    displayModeBust: 'Busto', displayModeHanger: 'Gruccia', displayModeFlat: 'Piano',
    generateProductPhotos: 'Genera foto prodotto',
    badgeAI: 'IA', noSlot0Msg: 'Aggiungi prima la foto principale',
    noMannequinMsg: 'Seleziona un manichino',
    rendTitle: '📸 RISULTATO — FOTO IA', modalConfirmMannequin: 'Scegli questo modello',
    photosGenerated: (n) => `· ${n} foto generat${n > 1 ? 'e' : 'a'}`,
    posesLabel: 'Pose da generare',
    poseFace: 'Di fronte', poseBack: 'Di spalle', poseSelfieFace: 'Selfie frontale', poseSelfie34: 'Selfie 3/4',
    poseSelfieProfile: 'Selfie di profilo', poseSeatedSelfie: 'Selfie seduto',
    posesHint: 'La foto frontale è sempre generata. Seleziona le pose aggiuntive.',
    noVersoWarning: 'Senza una foto del retro dell\'articolo (passo Foto), le viste posteriori non verranno generate.',
    proBadge: 'Pro',
    proRequired: 'Solo piano Pro',
    proMessage: 'Passa al piano Pro per generare foto indossate con modelli IA',
    modalConfirmBg: 'Usa questo sfondo',
  },
  nl: {
    mannequinTitle: 'AI-fotostudio',
    mannequinSubtitle: "Genereert gedragen foto's (voor, zijkant, achter) en productfoto's (buste, hanger, plat)",
    mannequinMen: 'Man', mannequinWomen: 'Vrouw',
    mannequinGenerate: "Gedragen foto's genereren",
    mannequinGenerating: 'Bezig met genereren…',
    mannequinCustomPromptLabel: 'Outfit aanpassen',
    wearingPromptLabel: 'Hoe het kledingstuk te dragen',
    displayModeTitle: 'Artikelpresentatie',
    displayModeBust: 'Buste', displayModeHanger: 'Hanger', displayModeFlat: 'Plat',
    generateProductPhotos: "Productfoto's genereren",
    badgeAI: 'AI', noSlot0Msg: 'Voeg eerst de hoofdfoto toe',
    noMannequinMsg: 'Selecteer een model',
    rendTitle: "📸 WEERGAVE — AI-FOTO'S", modalConfirmMannequin: 'Kies dit model',
    photosGenerated: (n) => `· ${n} foto${n > 1 ? "'s" : ''} gegenereerd`,
    posesLabel: 'Te genereren poses',
    poseFace: 'Vooraanzicht', poseBack: 'Achterkant', poseSelfieFace: 'Selfie vooraanzicht', poseSelfie34: '3/4 selfie',
    poseSelfieProfile: 'Profiel selfie', poseSeatedSelfie: 'Zittende selfie',
    posesHint: 'De voorfoto wordt altijd gegenereerd. Vink extra poses aan.',
    noVersoWarning: 'Zonder rugfoto van het artikel (stap Foto\'s) worden achteraanzichten niet gegenereerd.',
    proBadge: 'Pro',
    proRequired: 'Alleen Pro-abonnement',
    proMessage: 'Upgrade naar Pro om gedragen foto\'s met AI-modellen te genereren',
    modalConfirmBg: 'Deze achtergrond gebruiken',
  },
  pl: {
    mannequinTitle: 'Studio foto AI',
    mannequinSubtitle: 'Generuje zdjęcia noszone (przód, bok, tył) i zdjęcia produktu (biust, wieszak, na płasko)',
    mannequinMen: 'Mężczyzna', mannequinWomen: 'Kobieta',
    mannequinGenerate: 'Generuj zdjęcia noszone',
    mannequinGenerating: 'Generowanie…',
    mannequinCustomPromptLabel: 'Dostosuj strój',
    wearingPromptLabel: 'Jak nosić ubranie',
    displayModeTitle: 'Prezentacja artykułu',
    displayModeBust: 'Biust', displayModeHanger: 'Wieszak', displayModeFlat: 'Na płasko',
    generateProductPhotos: 'Generuj zdjęcia produktu',
    badgeAI: 'AI', noSlot0Msg: 'Najpierw dodaj główne zdjęcie',
    noMannequinMsg: 'Wybierz manekin',
    rendTitle: '📸 PODGLĄD — ZDJĘCIA AI', modalConfirmMannequin: 'Wybierz ten manekin',
    photosGenerated: (n) => `· ${n} zdjęci${n === 1 ? 'e' : 'a'} wygenerowane`,
    posesLabel: 'Pozy do wygenerowania',
    poseFace: 'Przód', poseBack: 'Tył', poseSelfieFace: 'Selfie z przodu', poseSelfie34: 'Selfie 3/4',
    poseSelfieProfile: 'Selfie z profilu', poseSeatedSelfie: 'Selfie na siedząco',
    posesHint: 'Zdjęcie z przodu jest zawsze generowane. Zaznacz dodatkowe pozy.',
    noVersoWarning: 'Bez zdjęcia tyłu przedmiotu (krok Zdjęcia) widoki z tyłu nie zostaną wygenerowane.',
    proBadge: 'Pro',
    proRequired: 'Tylko plan Pro',
    proMessage: 'Przejdź na plan Pro, aby generować zdjęcia noszone z modelami AI',
    modalConfirmBg: 'Użyj tego tła',
  },
}

/* ─── i18n panneau fond + bannière freemium — 7 langues ─────────────────── */

const BG_PANEL_I18N: Record<Lang, {
  bgPanelTitle: string
  freemiumLockMsg: string
  checkboxHint: string
  selectPhotoHint: string
  processBtn: (n: number) => string
  selectPhotosHint: string
  processing: string
  modelLoading: string
  rendTitle: string
  modalConfirmBg: string
  bannerTitle: string
  bannerDesc: string
  bannerBtn: string
  yourPhotosTitle: string
  rendFinalTitle: string
  rendStudioTitle: string
  bgCatInterieur: string
  bgCatStudio: string
}> = {
  fr: {
    bgPanelTitle:    'Fond',
    freemiumLockMsg: 'Passez au Premium pour tous les fonds',
    checkboxHint:    'Sélectionnez une photo, puis choisissez un fond ci-dessous',
    selectPhotoHint: 'Sélectionnez une photo, puis choisissez un fond ci-dessous',
    processBtn:      (n) => `Traiter ${n} photo${n > 1 ? 's' : ''} sélectionnée${n > 1 ? 's' : ''}`,
    selectPhotosHint: 'Sélectionnez des photos',
    processing:      'Traitement en cours…',
    modelLoading:    'Préparation du détourage, veuillez patienter…',
    rendTitle:       '📸 RENDU — PHOTOS TRAITÉES',
    modalConfirmBg:  'Utiliser ce fond',
    bannerTitle:     'Supprimez le fond de votre photo',
    bannerDesc:      'Pour une annonce pro, retirez le fond de votre photo principale en un clic.',
    bannerBtn:       'Supprimer le fond (photo principale)',
    yourPhotosTitle: 'Tes photos',
    rendFinalTitle:  'Rendu final',
    rendStudioTitle: 'Rendu Studio photo IA',
    bgCatInterieur:  '🏠 Intérieur',
    bgCatStudio:     '🎨 Studio',
  },
  en: {
    bgPanelTitle:    'Background',
    freemiumLockMsg: 'Upgrade to Premium for all backgrounds',
    checkboxHint:    'Select a photo, then choose a background below',
    selectPhotoHint: 'Select a photo, then choose a background below',
    processBtn:      (n) => `Process ${n} selected photo${n > 1 ? 's' : ''}`,
    selectPhotosHint: 'Select photos',
    processing:      'Processing…',
    modelLoading:    'Preparing background removal, please wait…',
    rendTitle:       '📸 RENDER — PROCESSED PHOTOS',
    modalConfirmBg:  'Use this background',
    bannerTitle:     'Remove your photo background',
    bannerDesc:      'For a professional listing, remove the background from your main photo in one click.',
    bannerBtn:       'Remove background (main photo)',
    yourPhotosTitle: 'Your photos',
    rendFinalTitle:  'Final render',
    rendStudioTitle: 'AI Photo Studio render',
    bgCatInterieur:  '🏠 Interior',
    bgCatStudio:     '🎨 Studio',
  },
  es: {
    bgPanelTitle:    'Fondo',
    freemiumLockMsg: 'Pasa al Premium para todos los fondos',
    checkboxHint:    'Selecciona una foto y elige un fondo a continuación',
    selectPhotoHint: 'Selecciona una foto y elige un fondo a continuación',
    processBtn:      (n) => `Procesar ${n} foto${n > 1 ? 's' : ''} seleccionada${n > 1 ? 's' : ''}`,
    selectPhotosHint: 'Selecciona fotos',
    processing:      'Procesando…',
    modelLoading:    'Preparando la eliminación de fondo, por favor espere…',
    rendTitle:       '📸 RESULTADO — FOTOS PROCESADAS',
    modalConfirmBg:  'Usar este fondo',
    bannerTitle:     'Elimina el fondo de tu foto',
    bannerDesc:      'Para un anuncio profesional, elimina el fondo de tu foto principal en un clic.',
    bannerBtn:       'Eliminar fondo (foto principal)',
    yourPhotosTitle: 'Tus fotos',
    rendFinalTitle:  'Resultado final',
    rendStudioTitle: 'Render Estudio foto IA',
    bgCatInterieur:  '🏠 Interior',
    bgCatStudio:     '🎨 Estudio',
  },
  de: {
    bgPanelTitle:    'Hintergrund',
    freemiumLockMsg: 'Upgrade auf Premium für alle Hintergründe',
    checkboxHint:    'Foto auswählen, dann Hintergrund wählen',
    selectPhotoHint: 'Foto auswählen, dann Hintergrund wählen',
    processBtn:      (n) => `${n} Foto${n > 1 ? 's' : ''} verarbeiten`,
    selectPhotosHint: 'Fotos auswählen',
    processing:      'Wird verarbeitet…',
    modelLoading:    'Hintergrundentfernung wird vorbereitet, bitte warten…',
    rendTitle:       '📸 VORSCHAU — BEARBEITETE FOTOS',
    modalConfirmBg:  'Hintergrund verwenden',
    bannerTitle:     'Hintergrund entfernen',
    bannerDesc:      'Für ein professionelles Inserat: Hintergrund des Hauptfotos mit einem Klick entfernen.',
    bannerBtn:       'Hintergrund entfernen (Hauptfoto)',
    yourPhotosTitle: 'Deine Fotos',
    rendFinalTitle:  'Endergebnis',
    rendStudioTitle: 'KI-Fotostudio-Ergebnis',
    bgCatInterieur:  '🏠 Innenraum',
    bgCatStudio:     '🎨 Studio',
  },
  it: {
    bgPanelTitle:    'Sfondo',
    freemiumLockMsg: 'Passa al Premium per tutti gli sfondi',
    checkboxHint:    'Seleziona una foto, poi scegli uno sfondo',
    selectPhotoHint: 'Seleziona una foto, poi scegli uno sfondo',
    processBtn:      (n) => `Elabora ${n} foto selezionat${n > 1 ? 'e' : 'a'}`,
    selectPhotosHint: 'Seleziona foto',
    processing:      'Elaborazione in corso…',
    modelLoading:    'Preparazione della rimozione dello sfondo, attendere…',
    rendTitle:       '📸 RISULTATO — FOTO ELABORATE',
    modalConfirmBg:  'Usa questo sfondo',
    bannerTitle:     'Rimuovi lo sfondo della tua foto',
    bannerDesc:      "Per un annuncio professionale, rimuovi lo sfondo della foto principale in un clic.",
    bannerBtn:       'Rimuovi sfondo (foto principale)',
    yourPhotosTitle: 'Le tue foto',
    rendFinalTitle:  'Risultato finale',
    rendStudioTitle: 'Render Studio foto IA',
    bgCatInterieur:  '🏠 Interno',
    bgCatStudio:     '🎨 Studio',
  },
  nl: {
    bgPanelTitle:    'Achtergrond',
    freemiumLockMsg: 'Upgrade naar Premium voor alle achtergronden',
    checkboxHint:    "Selecteer een foto en kies een achtergrond",
    selectPhotoHint: "Selecteer een foto en kies een achtergrond",
    processBtn:      (n) => `Verwerk ${n} geselecteerde foto${n > 1 ? "'s" : ''}`,
    selectPhotosHint: 'Selecteer foto\'s',
    processing:      'Bezig met verwerken…',
    modelLoading:    'Achtergrondverwijdering voorbereiden, even geduld…',
    rendTitle:       "📸 WEERGAVE — BEWERKTE FOTO'S",
    modalConfirmBg:  'Gebruik achtergrond',
    bannerTitle:     'Verwijder de achtergrond van je foto',
    bannerDesc:      'Voor een professionele advertentie: verwijder de achtergrond van je hoofdfoto met één klik.',
    bannerBtn:       'Achtergrond verwijderen (hoofdfoto)',
    yourPhotosTitle: "Jouw foto's",
    rendFinalTitle:  'Eindresultaat',
    rendStudioTitle: 'AI-fotostudio resultaat',
    bgCatInterieur:  '🏠 Interieur',
    bgCatStudio:     '🎨 Studio',
  },
  pl: {
    bgPanelTitle:    'Tło',
    freemiumLockMsg: 'Przejdź na Premium dla wszystkich teł',
    checkboxHint:    'Wybierz zdjęcie, a następnie wybierz tło poniżej',
    selectPhotoHint: 'Wybierz zdjęcie, a następnie wybierz tło poniżej',
    processBtn:      (n) => `Przetwórz ${n} wybrane zdjęci${n === 1 ? 'e' : 'a'}`,
    selectPhotosHint: 'Wybierz zdjęcia',
    processing:      'Przetwarzanie…',
    modelLoading:    'Przygotowywanie usuwania tła, proszę czekać…',
    rendTitle:       '📸 PODGLĄD — PRZETWORZONE ZDJĘCIA',
    modalConfirmBg:  'Użyj tego tła',
    bannerTitle:     'Usuń tło ze swojego zdjęcia',
    bannerDesc:      'Dla profesjonalnego ogłoszenia usuń tło ze swojego głównego zdjęcia jednym kliknięciem.',
    bannerBtn:       'Usuń tło (główne zdjęcie)',
    yourPhotosTitle: 'Twoje zdjęcia',
    rendFinalTitle:  'Wynik końcowy',
    rendStudioTitle: 'Render Studio zdjęć AI',
    bgCatInterieur:  '🏠 Wnętrze',
    bgCatStudio:     '🎨 Studio',
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

const BACKGROUNDS_INTERIEUR: BgDef[] = [
  ...Array.from({ length: 28 }, (_, i) => makeBg(1 + i)),  // bg-01 à bg-28 (intérieurs : ex 53-60 puis ex 01-20)
]
const BACKGROUNDS_STUDIO: BgDef[] = [
  ...Array.from({ length: 22 }, (_, i) => makeBg(29 + i)),  // bg-29 à bg-50 (studios : ex 31-52)
]
const BACKGROUNDS_ALL: BgDef[] = [makeBg(0), ...BACKGROUNDS_INTERIEUR, ...BACKGROUNDS_STUDIO]

/* ─── Mannequins ─────────────────────────────────────────────────────────── */

const MEN_MANNEQUINS: string[] = [
  'man-01', 'man-02', 'man-03', 'man-04', 'man-05',
  'man-06', 'man-07', 'man-08', 'man-09', 'man-10',
  'man-11', 'man-12', 'man-13', 'man-14', 'man-15',
  'man-16', 'man-17', 'man-18', 'man-19', 'man-20',
  'man-21', 'man-22', 'man-23', 'man-24', 'man-25',
  'man-26', 'man-27', 'man-28', 'man-29', 'man-30',
]
const WOMEN_MANNEQUINS: string[] = [
  'woman-01', 'woman-02', 'woman-03', 'woman-04', 'woman-05',
  'woman-06', 'woman-07', 'woman-08', 'woman-09', 'woman-10',
  'woman-11', 'woman-12', 'woman-13', 'woman-14', 'woman-15',
  'woman-16', 'woman-17', 'woman-18', 'woman-19', 'woman-20',
  'woman-21', 'woman-22', 'woman-23', 'woman-24', 'woman-25',
  'woman-26', 'woman-27', 'woman-28', 'woman-29', 'woman-30',
]

/* ─── Composition fond + cutout PNG transparent ───────────────────────────── */

/* Échantillonne la couleur moyenne d'un canvas (zone centrale 20%) */
function sampleAvgColor(ctx: CanvasRenderingContext2D, W: number, H: number): [number, number, number] {
  const sx = Math.round(W * 0.4), sy = Math.round(H * 0.4)
  const sw = Math.round(W * 0.2), sh = Math.round(H * 0.2)
  const data = ctx.getImageData(sx, sy, sw, sh).data
  let r = 0, g = 0, b = 0
  const n = data.length / 4
  for (let i = 0; i < data.length; i += 4) { r += data[i]; g += data[i + 1]; b += data[i + 2] }
  return [r / n, g / n, b / n]
}

function getContentBounds(img: HTMLImageElement): { top: number; bottom: number; left: number; right: number } | null {
  const tmp = document.createElement('canvas')
  tmp.width  = img.naturalWidth
  tmp.height = img.naturalHeight
  const tmpCtx = tmp.getContext('2d')
  if (!tmpCtx) return null
  tmpCtx.drawImage(img, 0, 0)
  const { width, height } = tmp
  const data = tmpCtx.getImageData(0, 0, width, height).data
  let top = height, bottom = 0, left = width, right = 0
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3] > 10) {
        if (y < top)    top    = y
        if (y > bottom) bottom = y
        if (x < left)   left   = x
        if (x > right)  right  = x
      }
    }
  }
  if (top >= bottom || left >= right) return null
  return { top, bottom, left, right }
}

async function cleanCutout(blob: Blob): Promise<Blob> {
  const img = await createImageBitmap(blob)
  const canvas = document.createElement('canvas')
  canvas.width  = img.width
  canvas.height = img.height
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(img, 0, 0)
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const data = imageData.data
  const W = canvas.width, H = canvas.height

  // Seuillage alpha — supprimer les pixels quasi-transparents
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] < 40) data[i] = 0
  }

  // BFS — trouver la plus grande zone connexe d'opaques
  const visited = new Uint8Array(W * H)
  const isOpaque = (idx: number) => data[idx * 4 + 3] > 40
  let bestRegion: number[] = []

  for (let start = 0; start < W * H; start++) {
    if (visited[start] || !isOpaque(start)) continue
    const stack = [start]
    const region: number[] = []
    visited[start] = 1
    while (stack.length) {
      const p = stack.pop()!
      region.push(p)
      const x = p % W, y = Math.floor(p / W)
      const neighbors = [
        x > 0     ? p - 1 : -1,
        x < W - 1 ? p + 1 : -1,
        y > 0     ? p - W : -1,
        y < H - 1 ? p + W : -1,
      ]
      for (const n of neighbors) {
        if (n >= 0 && !visited[n] && isOpaque(n)) { visited[n] = 1; stack.push(n) }
      }
    }
    if (region.length > bestRegion.length) bestRegion = region
  }

  // Effacer tout sauf la plus grande zone
  const keep = new Uint8Array(W * H)
  for (const p of bestRegion) keep[p] = 1
  for (let p = 0; p < W * H; p++) { if (!keep[p]) data[p * 4 + 3] = 0 }

  // Érodage — rogner 2px sur le contour pour supprimer le liseré de l'ancien fond
  const erodePixels = 1
  const alphaCopy = new Uint8ClampedArray(W * H)
  for (let p = 0; p < W * H; p++) alphaCopy[p] = data[p * 4 + 3]
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const p = y * W + x
      if (alphaCopy[p] === 0) continue
      let nearEdge = false
      for (let dy = -erodePixels; dy <= erodePixels && !nearEdge; dy++) {
        for (let dx = -erodePixels; dx <= erodePixels && !nearEdge; dx++) {
          const nx = x + dx, ny = y + dy
          if (nx < 0 || nx >= W || ny < 0 || ny >= H) { nearEdge = true; break }
          if (alphaCopy[ny * W + nx] === 0) nearEdge = true
        }
      }
      if (nearEdge) data[p * 4 + 3] = 0
    }
  }

  // Lissage du canal alpha — adoucir les bords en escalier (anti-aliasing)
  const alphaSrc = new Uint8ClampedArray(W * H)
  for (let p = 0; p < W * H; p++) alphaSrc[p] = data[p * 4 + 3]

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      let sum = 0, count = 0
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx, ny = y + dy
          if (nx < 0 || nx >= W || ny < 0 || ny >= H) continue
          sum += alphaSrc[ny * W + nx]
          count++
        }
      }
      data[(y * W + x) * 4 + 3] = Math.round(sum / count)
    }
  }

  ctx.putImageData(imageData, 0, 0)
  return new Promise((resolve) => canvas.toBlob((b) => resolve(b!), 'image/png'))
}

async function compositeWithBackground(cutoutUrl: string, bg: BgDef, isWorn = false): Promise<string> {
  return new Promise((resolve, reject) => {
    const cutout = new Image()
    cutout.onload = () => {
      const W = 1080, H = 1440
      const canvas = document.createElement('canvas')
      canvas.width  = W
      canvas.height = H
      const ctx = canvas.getContext('2d')!

      const draw = () => {
        /* ── Dimensions cutout : recadrage intelligent selon type ── */
        let cx: number, cy: number, cw: number, ch: number
        const bounds = isWorn ? getContentBounds(cutout) : null
        if (isWorn && bounds) {
          const subjectH = bounds.bottom - bounds.top
          const subjectW = bounds.right  - bounds.left
          const scale    = Math.min((H * 0.98) / subjectH, (W * 0.95) / subjectW)
          cw = subjectW * scale
          ch = subjectH * scale
          cx = (W - cw) / 2
          cy = H * 0.01
        } else {
          const scale = Math.min((W * 0.85) / cutout.naturalWidth, (H * 0.85) / cutout.naturalHeight)
          cw = cutout.naturalWidth  * scale
          ch = cutout.naturalHeight * scale
          cx = (W - cw) / 2
          cy = (H - ch) / 2
        }

        /* ── 1. Color matching : adapter la luminosité du cutout au fond ── */
        const [bgR, bgG, bgB] = sampleAvgColor(ctx, W, H)
        const warmth = (bgR - bgB) / 255
        const brightnessVal = 1 + (-warmth * 0.08)

        /* ── 1b. Balance des blancs douce sur le sujet (neutralise dominante d'éclairage) ── */
        const wbCanvas = document.createElement('canvas')
        wbCanvas.width  = W
        wbCanvas.height = H
        const wbCtx = wbCanvas.getContext('2d')!
        if (isWorn && bounds) {
          wbCtx.drawImage(cutout,
            bounds.left, bounds.top, bounds.right - bounds.left, bounds.bottom - bounds.top,
            cx, cy, cw, ch)
        } else {
          wbCtx.drawImage(cutout, cx, cy, cw, ch)
        }

        const wbData = wbCtx.getImageData(0, 0, W, H)
        const wd = wbData.data
        let sR = 0, sG = 0, sB = 0, sCount = 0
        for (let i = 0; i < wd.length; i += 4) {
          if (wd[i + 3] > 200) {
            sR += wd[i]; sG += wd[i + 1]; sB += wd[i + 2]; sCount++
          }
        }

        if (sCount > 0) {
          const avgR = sR / sCount, avgG = sG / sCount, avgB = sB / sCount
          const avgGray = (avgR + avgG + avgB) / 3
          const strength = 0.6
          const fR = 1 + ((avgGray / avgR) - 1) * strength
          const fG = 1 + ((avgGray / avgG) - 1) * strength
          const fB = 1 + ((avgGray / avgB) - 1) * strength
          for (let i = 0; i < wd.length; i += 4) {
            if (wd[i + 3] > 0) {
              wd[i]     = Math.max(0, Math.min(255, wd[i]     * fR))
              wd[i + 1] = Math.max(0, Math.min(255, wd[i + 1] * fG))
              wd[i + 2] = Math.max(0, Math.min(255, wd[i + 2] * fB))
            }
          }
          wbCtx.putImageData(wbData, 0, 0)
        }

        /* ── 1c. Sharpening subtil du sujet (convolution 3x3, préserve l'alpha) ── */
        const sharpSrc = wbCtx.getImageData(0, 0, W, H)
        const sp = sharpSrc.data
        const sharpOut = wbCtx.createImageData(W, H)
        const op = sharpOut.data
        const amount = 0.35
        const center = 1 + 4 * amount
        const side = -amount
        for (let y = 0; y < H; y++) {
          for (let x = 0; x < W; x++) {
            const idx = (y * W + x) * 4
            const alpha = sp[idx + 3]
            if (alpha < 250) {
              op[idx] = sp[idx]; op[idx + 1] = sp[idx + 1]; op[idx + 2] = sp[idx + 2]; op[idx + 3] = alpha
              continue
            }
            for (let c = 0; c < 3; c++) {
              const cur   = sp[idx + c]
              const up    = y > 0     ? sp[idx - W * 4 + c] : cur
              const down  = y < H - 1 ? sp[idx + W * 4 + c] : cur
              const left  = x > 0     ? sp[idx - 4 + c]     : cur
              const right = x < W - 1 ? sp[idx + 4 + c]     : cur
              const val = center * cur + side * (up + down + left + right)
              op[idx + c] = Math.max(0, Math.min(255, val))
            }
            op[idx + 3] = alpha
          }
        }
        wbCtx.putImageData(sharpOut, 0, 0)

        /* ── 2. Ombre portée via canvas temporaire (suit la forme réelle du sujet) ── */
        const shadowCanvas = document.createElement('canvas')
        shadowCanvas.width  = W
        shadowCanvas.height = H
        const shadowCtx = shadowCanvas.getContext('2d')!

        // a. Dessiner le cutout dans le canvas d'ombre (à la bonne position/taille)
        if (isWorn && bounds) {
          shadowCtx.drawImage(cutout,
            bounds.left, bounds.top, bounds.right - bounds.left, bounds.bottom - bounds.top,
            cx, cy, cw, ch)
        } else {
          shadowCtx.drawImage(cutout, cx, cy, cw, ch)
        }

        // b. Repeindre en noir en préservant l'alpha (source-in garde la forme exacte)
        shadowCtx.globalCompositeOperation = 'source-in'
        shadowCtx.fillStyle = 'rgba(10, 10, 20, 1)'
        shadowCtx.fillRect(0, 0, W, H)

        // c. Composer l'ombre sur le canvas principal : décalée, floutée, semi-transparente
        ctx.save()
        ctx.globalAlpha = 0.38
        ctx.filter = 'blur(14px)'
        ctx.drawImage(shadowCanvas, 12, 22)
        ctx.restore()

        /* ── 3. Sujet net par-dessus (balance des blancs appliquée, filter brightness) ── */
        ctx.save()
        ctx.filter = `blur(0.5px) brightness(${brightnessVal.toFixed(3)}) contrast(1.06)`
        ctx.drawImage(wbCanvas, 0, 0)
        ctx.restore()

        /* ── 4. Color bleed — déposer la teinte du fond sur la zone du sujet ── */
        const bleedCanvas = document.createElement('canvas')
        bleedCanvas.width  = W
        bleedCanvas.height = H
        const bleedCtx = bleedCanvas.getContext('2d')!

        bleedCtx.drawImage(shadowCanvas, 0, 0)

        bleedCtx.globalCompositeOperation = 'source-in'
        bleedCtx.fillStyle = `rgb(${Math.round(bgR)}, ${Math.round(bgG)}, ${Math.round(bgB)})`
        bleedCtx.fillRect(0, 0, W, H)

        ctx.save()
        ctx.globalAlpha = 0.20
        ctx.globalCompositeOperation = 'soft-light'
        ctx.filter = 'blur(2px)'
        ctx.drawImage(bleedCanvas, 0, 0)
        ctx.restore()

        /* ── 6. Grain uniforme — harmonise le sujet net avec le bruit du fond ── */
        const grainData = ctx.getImageData(0, 0, W, H)
        const gd = grainData.data
        const grainStrength = 5
        for (let i = 0; i < gd.length; i += 4) {
          const noise = (Math.random() - 0.5) * 2 * grainStrength
          gd[i]     = Math.max(0, Math.min(255, gd[i]     + noise))
          gd[i + 1] = Math.max(0, Math.min(255, gd[i + 1] + noise))
          gd[i + 2] = Math.max(0, Math.min(255, gd[i + 2] + noise))
        }
        ctx.putImageData(grainData, 0, 0)

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
    ouverture:     fix(result.ouverture),
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
type StyleKey = 'casual' | 'classique' | 'sportif' | 'chic' | 'boheme' | 'streetwear' | 'vintage' | 'romantique' | 'minimaliste' | 'rock' | 'preppy' | 'gothique' | 'default'

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
  if (s.includes('casual'))                                                    return 'casual'
  if (s.includes('classique') || s.includes('classic'))                        return 'classique'
  if (s.includes('sport') || s.includes('outdoor'))                            return 'sportif'
  if (s.includes('chic') || s.includes('élégant') || s.includes('elegant'))   return 'chic'
  if (s.includes('bohème') || s.includes('boheme') || s.includes('fantaisie')) return 'boheme'
  if (s.includes('street'))                                                     return 'streetwear'
  if (s.includes('vintage') || s.includes('rétro') || s.includes('retro'))    return 'vintage'
  if (s.includes('romantique') || s.includes('romantic'))                      return 'romantique'
  if (s.includes('minimaliste') || s.includes('minimalist'))                   return 'minimaliste'
  if (s.includes('rock'))                                                       return 'rock'
  if (s.includes('preppy'))                                                     return 'preppy'
  if (s.includes('gothique') || s.includes('gothic') || s.includes('goth'))   return 'gothique'
  if (s.includes('business'))                                                   return 'classique'
  return 'default'
}

const OUTFIT_PROMPTS: Record<Lang, Record<StyleKey, string>> = {
  fr: {
    casual:     'tenue casual contemporaine, pièces de complément en denim brut ou tons neutres, coupes droites ou légèrement amples (jamais slim moulant), sneakers en cuir minimalistes, allure épurée européenne',
    classique:  'tenue classique intemporelle, pièces de complément bien coupées en tons neutres, coupes droites structurées (jamais slim), matières de qualité, élégance discrète',
    sportif:    'tenue sportswear premium, pièces de complément techniques en tons sobres, coupes modernes confortables (jamais slim moulant), allure athleisure léchée',
    chic:       'tenue chic et élégante, pièces de complément fluides et structurées en tons raffinés, coupes nettes (jamais slim), matières nobles, allure sophistiquée',
    boheme:     'tenue bohème raffinée, pièces de complément en matières naturelles fluides, coupes amples maîtrisées, palette terreuse douce, élégance décontractée',
    streetwear: 'tenue streetwear premium, pièces de complément en coupes oversize ou droites structurées (jamais slim), tons neutres, allure urbaine léchée',
    vintage:    'tenue vintage réinterprétée, pièces de complément rétro modernisées en coupes droites ou amples, palette chaude maîtrisée, allure curée',
    romantique: 'tenue romantique délicate, pièces de complément fluides et légères, coupes souples, palette douce et poudrée, allure féminine soignée',
    minimaliste:'tenue minimaliste épurée, pièces de complément en coupes nettes et droites (jamais slim), palette monochrome neutre, sans fioriture',
    rock:       'tenue rock épurée, pièces de complément à dominante noire en coupes droites structurées, matières mates, allure sombre contemporaine',
    preppy:     'tenue preppy européenne, pièces de complément structurées en tons classiques sobres, coupes droites nettes, allure chic décontractée',
    gothique:   'tenue gothique chic, pièces de complément total look noir en coupes droites structurées, matières mates profondes, allure sombre élégante',
    default:    'tenue neutre et contemporaine, pièces de complément bien coupées en tons sobres, coupes droites ou légèrement amples (jamais slim moulant), allure épurée européenne',
  },
  en: {
    casual:     'contemporary casual outfit, complementary pieces in raw denim or neutral tones, straight or slightly relaxed cuts (never slim-fitting), minimalist leather sneakers, clean European allure',
    classique:  'timeless classic outfit, well-cut complementary pieces in neutral tones, structured straight cuts (never slim), quality fabrics, quiet elegance',
    sportif:    'premium sportswear outfit, technical complementary pieces in understated tones, modern comfortable cuts (never slim-fitting), polished athleisure allure',
    chic:       'chic and elegant outfit, fluid and structured complementary pieces in refined tones, clean cuts (never slim), noble fabrics, sophisticated allure',
    boheme:     'refined bohemian outfit, complementary pieces in fluid natural fabrics, mastered loose cuts, soft earthy palette, laid-back elegance',
    streetwear: 'premium streetwear outfit, complementary pieces in oversized or structured straight cuts (never slim), neutral tones, polished urban allure',
    vintage:    'reinterpreted vintage outfit, retro modernized complementary pieces in straight or relaxed cuts, mastered warm palette, curated allure',
    romantique: 'delicate romantic outfit, fluid and light complementary pieces, supple cuts, soft powdery palette, polished feminine allure',
    minimaliste:'clean minimalist outfit, complementary pieces in sharp straight cuts (never slim), neutral monochrome palette, no frills',
    rock:       'clean rock outfit, black-dominant complementary pieces in structured straight cuts, matte fabrics, dark contemporary allure',
    preppy:     'European preppy outfit, structured complementary pieces in sober classic tones, clean straight cuts, chic casual allure',
    gothique:   'chic gothic outfit, total black complementary pieces in structured straight cuts, deep matte fabrics, dark elegant allure',
    default:    'neutral and contemporary outfit, well-cut complementary pieces in understated tones, straight or slightly relaxed cuts (never slim-fitting), clean European allure',
  },
  es: {
    casual:     'conjunto casual contemporáneo, prendas de complemento en denim crudo o tonos neutros, cortes rectos o ligeramente amplios (nunca slim ceñido), zapatillas de cuero minimalistas, aire europeo depurado',
    classique:  'conjunto clásico atemporal, prendas de complemento bien cortadas en tonos neutros, cortes rectos estructurados (nunca slim), tejidos de calidad, elegancia discreta',
    sportif:    'conjunto deportivo premium, prendas de complemento técnicas en tonos sobrios, cortes modernos y cómodos (nunca slim ceñido), aspecto athleisure cuidado',
    chic:       'conjunto chic y elegante, prendas de complemento fluidas y estructuradas en tonos refinados, cortes limpios (nunca slim), tejidos nobles, aspecto sofisticado',
    boheme:     'conjunto bohemio refinado, prendas de complemento en tejidos naturales fluidos, cortes amplios controlados, paleta terrosa suave, elegancia desenfadada',
    streetwear: 'conjunto streetwear premium, prendas de complemento en cortes oversize o rectos estructurados (nunca slim), tonos neutros, aspecto urbano cuidado',
    vintage:    'conjunto vintage reinterpretado, prendas de complemento retro modernizadas en cortes rectos o amplios, paleta cálida controlada, aspecto cuidado',
    romantique: 'conjunto romántico delicado, prendas de complemento fluidas y ligeras, cortes suaves, paleta suave y empolvada, aspecto femenino cuidado',
    minimaliste:'conjunto minimalista depurado, prendas de complemento en cortes limpios y rectos (nunca slim), paleta monocroma neutra, sin florituras',
    rock:       'conjunto rock depurado, prendas de complemento de dominante negra en cortes rectos estructurados, tejidos mates, aspecto oscuro contemporáneo',
    preppy:     'conjunto preppy europeo, prendas de complemento estructuradas en tonos clásicos sobrios, cortes rectos limpios, aspecto chic desenfadado',
    gothique:   'conjunto gótico chic, prendas de complemento total negro en cortes rectos estructurados, tejidos mates profundos, aspecto oscuro y elegante',
    default:    'conjunto neutro y contemporáneo, prendas de complemento bien cortadas en tonos sobrios, cortes rectos o ligeramente amplios (nunca slim ceñido), aire europeo depurado',
  },
  de: {
    casual:     'zeitgenössisches Casual-Outfit, Ergänzungsstücke in rohem Denim oder Neutratönen, gerade oder leicht weite Schnitte (nie slim-tailliert), minimalistische Ledersneaker, klares europäisches Flair',
    classique:  'zeitloses klassisches Outfit, gut geschnittene Ergänzungsstücke in Neutratönen, strukturierte gerade Schnitte (nie slim), hochwertige Materialien, stille Eleganz',
    sportif:    'hochwertiges Sportswear-Outfit, technische Ergänzungsstücke in dezenten Tönen, moderne komfortable Schnitte (nie slim-tailliert), gepflegter Athleisure-Look',
    chic:       'schickes und elegantes Outfit, fließende und strukturierte Ergänzungsstücke in raffinierten Tönen, saubere Schnitte (nie slim), edle Materialien, sophistizierter Look',
    boheme:     'raffiniertes Boho-Outfit, Ergänzungsstücke in fließenden Naturmaterialien, kontrollierte weite Schnitte, sanfte Erdtöne, lässige Eleganz',
    streetwear: 'hochwertiges Streetwear-Outfit, Ergänzungsstücke in Oversized- oder strukturierten geraden Schnitten (nie slim), neutrale Töne, gepflegter urbaner Look',
    vintage:    'reinterpretiertes Vintage-Outfit, retro-modernisierte Ergänzungsstücke in geraden oder weiten Schnitten, kontrollierte warme Palette, kuratierter Look',
    romantique: 'zart romantisches Outfit, fließende und leichte Ergänzungsstücke, weiche Schnitte, sanfte pudrige Palette, gepflegter femininer Look',
    minimaliste:'klares minimalistisches Outfit, Ergänzungsstücke in scharfen geraden Schnitten (nie slim), neutrale monochromatische Palette, kein Schnickschnack',
    rock:       'klares Rock-Outfit, schwarzdominante Ergänzungsstücke in strukturierten geraden Schnitten, matte Materialien, dunkler zeitgenössischer Look',
    preppy:     'europäisches Preppy-Outfit, strukturierte Ergänzungsstücke in nüchternen klassischen Tönen, saubere gerade Schnitte, lässig-schicker Look',
    gothique:   'schickes Gothic-Outfit, Total-Black-Ergänzungsstücke in strukturierten geraden Schnitten, tiefe matte Materialien, dunkel-eleganter Look',
    default:    'neutrales zeitgenössisches Outfit, gut geschnittene Ergänzungsstücke in dezenten Tönen, gerade oder leicht weite Schnitte (nie slim-tailliert), klares europäisches Flair',
  },
  it: {
    casual:     'outfit casual contemporaneo, capi di complemento in denim grezzo o toni neutri, tagli dritti o leggermente ampi (mai slim aderente), sneakers in pelle minimaliste, allure europea pulita',
    classique:  'outfit classico senza tempo, capi di complemento ben tagliati in toni neutri, tagli dritti strutturati (mai slim), tessuti di qualità, eleganza discreta',
    sportif:    'outfit sportswear premium, capi di complemento tecnici in toni sobri, tagli moderni e comodi (mai slim aderente), allure athleisure curata',
    chic:       'outfit chic ed elegante, capi di complemento fluidi e strutturati in toni raffinati, tagli netti (mai slim), tessuti nobili, allure sofisticata',
    boheme:     'outfit bohémien raffinato, capi di complemento in tessuti naturali fluidi, tagli ampi controllati, palette terrosa morbida, eleganza disinvolta',
    streetwear: 'outfit streetwear premium, capi di complemento in tagli oversize o dritti strutturati (mai slim), toni neutri, allure urbana curata',
    vintage:    'outfit vintage reinterpretato, capi di complemento retrò modernizzati in tagli dritti o ampi, palette calda controllata, allure curata',
    romantique: 'outfit romantico delicato, capi di complemento fluidi e leggeri, tagli morbidi, palette dolce e cipriata, allure femminile curata',
    minimaliste:'outfit minimalista pulito, capi di complemento in tagli netti e dritti (mai slim), palette monocromatica neutra, senza fronzoli',
    rock:       'outfit rock pulito, capi di complemento a dominante nera in tagli dritti strutturati, tessuti opachi, allure scura contemporanea',
    preppy:     'outfit preppy europeo, capi di complemento strutturati in toni classici sobri, tagli dritti netti, allure chic disinvolta',
    gothique:   'outfit gothic chic, capi di complemento total black in tagli dritti strutturati, tessuti opachi profondi, allure scura ed elegante',
    default:    'outfit neutro e contemporaneo, capi di complemento ben tagliati in toni sobri, tagli dritti o leggermente ampi (mai slim aderente), allure europea pulita',
  },
  nl: {
    casual:     'eigentijds casual outfit, aanvullende stukken in ruw denim of neutrale tinten, rechte of licht wijde sneden (nooit slim-passend), minimalistische leren sneakers, strak Europees allure',
    classique:  'tijdloos klassiek outfit, goed gesneden aanvullende stukken in neutrale tinten, gestructureerde rechte sneden (nooit slim), kwalitatieve stoffen, stille elegantie',
    sportif:    'premium sportswear outfit, technische aanvullende stukken in ingetogen tinten, moderne comfortabele sneden (nooit slim-passend), verzorgde athleisure allure',
    chic:       'chic en elegant outfit, vloeiende en gestructureerde aanvullende stukken in verfijnde tinten, strakke sneden (nooit slim), edele stoffen, sophisticeerde allure',
    boheme:     'verfijnd boho outfit, aanvullende stukken in vloeiende natuurlijke stoffen, beheerste wijde sneden, zachte aardse kleuren, ontspannen elegantie',
    streetwear: 'premium streetwear outfit, aanvullende stukken in oversized of gestructureerde rechte sneden (nooit slim), neutrale tinten, verzorgde urbane allure',
    vintage:    'herinterpreteerd vintage outfit, retro gemoderniseerde aanvullende stukken in rechte of wijde sneden, beheerst warm palet, gecureerd allure',
    romantique: 'delicaat romantisch outfit, vloeiende en lichte aanvullende stukken, soepele sneden, zacht poederig palet, verzorgde vrouwelijke allure',
    minimaliste:'strak minimalistisch outfit, aanvullende stukken in scherpe rechte sneden (nooit slim), neutraal monochromatisch palet, geen opsmuk',
    rock:       'strak rock outfit, zwart-dominante aanvullende stukken in gestructureerde rechte sneden, matte stoffen, donker eigentijds allure',
    preppy:     'Europees preppy outfit, gestructureerde aanvullende stukken in sobere klassieke tinten, strakke rechte sneden, chic casual allure',
    gothique:   'chic gothic outfit, total black aanvullende stukken in gestructureerde rechte sneden, diepe matte stoffen, donker elegant allure',
    default:    'neutraal en eigentijds outfit, goed gesneden aanvullende stukken in ingetogen tinten, rechte of licht wijde sneden (nooit slim-passend), strak Europees allure',
  },
  pl: {
    casual:     'współczesny strój casual, uzupełniające elementy w surowym denimie lub neutralnych tonach, proste lub lekko luźne kroje (nigdy slim przylegający), minimalistyczne skórzane sneakersy, czysty europejski styl',
    classique:  'ponadczasowy klasyczny strój, dobrze skrojone uzupełniające elementy w neutralnych tonach, strukturowane proste kroje (nigdy slim), wysokiej jakości tkaniny, dyskretna elegancja',
    sportif:    'premium strój sportswear, techniczne uzupełniające elementy w stonowanych tonach, nowoczesne wygodne kroje (nigdy slim przylegający), dopracowany wygląd athleisure',
    chic:       'elegancki i szykowny strój, płynne i strukturalne uzupełniające elementy w wyrafinowanych tonach, czyste kroje (nigdy slim), szlachetne tkaniny, wyrafinowany styl',
    boheme:     'wyrafinowany strój boho, uzupełniające elementy w płynnych naturalnych tkaninach, opanowane luźne kroje, miękka ziemista paleta, swobodna elegancja',
    streetwear: 'premium strój streetwear, uzupełniające elementy w oversizowych lub strukturowanych prostych krojach (nigdy slim), neutralne tony, dopracowany miejski styl',
    vintage:    'reinterpretowany strój vintage, retro unowocześnione uzupełniające elementy w prostych lub luźnych krojach, opanowana ciepła paleta, kuratowany styl',
    romantique: 'delikatny romantyczny strój, płynne i lekkie uzupełniające elementy, miękkie kroje, miękka pudrowa paleta, dopracowany kobiecy styl',
    minimaliste:'czysty minimalistyczny strój, uzupełniające elementy w ostrych prostych krojach (nigdy slim), neutralna monochromatyczna paleta, bez ozdóbek',
    rock:       'czysty rockowy strój, uzupełniające elementy z dominantą czerni w strukturowanych prostych krojach, matowe tkaniny, ciemny współczesny styl',
    preppy:     'europejski strój preppy, strukturowane uzupełniające elementy w stonowanych klasycznych tonach, czyste proste kroje, swobodny szykowny styl',
    gothique:   'szykowny gotycki strój, total black uzupełniające elementy w strukturowanych prostych krojach, głębokie matowe tkaniny, ciemny i elegancki styl',
    default:    'neutralny i współczesny strój, dobrze skrojone uzupełniające elementy w stonowanych tonach, proste lub lekko luźne kroje (nigdy slim przylegający), czysty europejski styl',
  },
}

function generateOutfitPrompt(result: RecognitionResult, lang: Lang): string {
  const style = normalizeStyle(result.style?.value ?? '')
  const prompts = OUTFIT_PROMPTS[lang] ?? OUTFIT_PROMPTS.en
  return prompts[style] ?? prompts['default'] ?? OUTFIT_PROMPTS.en['default']
}

const WEARING_PROMPTS: Record<Lang, Record<GarmentType, string>> = {
  fr: {
    HAUT:         'manches à leur longueur naturelle, non retroussées, vêtement tombant naturellement, porté non rentré, col à plat',
    BAS:          'porté à la taille naturelle, à sa longueur réelle, sans revers ni ourlet ajouté',
    PIECE_ENTIERE:'porté à sa longueur et sa coupe naturelles, tombant normalement',
    VESTE:        'manches déployées à leur longueur naturelle, portée naturellement, col à plat',
    CHAUSSURE:    'portées normalement aux pieds',
    ACCESSOIRE:   'porté ou présenté normalement',
  },
  en: {
    HAUT:         'sleeves at their natural length, not rolled up, garment hanging naturally, untucked, collar flat',
    BAS:          'worn at the natural waist, at its actual length, no cuffs or added hem',
    PIECE_ENTIERE:'worn at its natural length and cut, hanging normally',
    VESTE:        'sleeves extended to their natural length, worn naturally, collar flat',
    CHAUSSURE:    'worn normally on the feet',
    ACCESSOIRE:   'worn or presented normally',
  },
  es: {
    HAUT:         'mangas a su longitud natural, sin remangar, prenda cayendo naturalmente, sin meter, cuello plano',
    BAS:          'llevado a la cintura natural, a su longitud real, sin vueltas ni dobladillo añadido',
    PIECE_ENTIERE:'llevado a su longitud y corte naturales, cayendo normalmente',
    VESTE:        'mangas desplegadas a su longitud natural, llevada naturalmente, cuello plano',
    CHAUSSURE:    'llevados normalmente en los pies',
    ACCESSOIRE:   'llevado o presentado normalmente',
  },
  de: {
    HAUT:         'Ärmel in natürlicher Länge, nicht aufgerollt, Kleidungsstück fällt natürlich, nicht eingesteckt, Kragen flach',
    BAS:          'in natürlicher Taillenhöhe getragen, in echter Länge, ohne Aufschlag oder zusätzlichen Saum',
    PIECE_ENTIERE:'in natürlicher Länge und Schnitt getragen, fällt normal',
    VESTE:        'Ärmel in natürlicher Länge ausgestreckt, natürlich getragen, Kragen flach',
    CHAUSSURE:    'normal an den Füßen getragen',
    ACCESSOIRE:   'normal getragen oder präsentiert',
  },
  it: {
    HAUT:         'maniche alla loro lunghezza naturale, non arrotolate, capo che cade naturalmente, non infilato, collo piatto',
    BAS:          'indossato alla vita naturale, alla sua lunghezza reale, senza risvolti né orlo aggiunto',
    PIECE_ENTIERE:'indossato alla sua lunghezza e vestibilità naturali, caduta normale',
    VESTE:        'maniche distese alla loro lunghezza naturale, indossata naturalmente, collo piatto',
    CHAUSSURE:    'indossate normalmente ai piedi',
    ACCESSOIRE:   'indossato o presentato normalmente',
  },
  nl: {
    HAUT:         'mouwen op hun natuurlijke lengte, niet opgerold, kledingstuk valt natuurlijk, niet ingestopt, kraag plat',
    BAS:          'gedragen op de natuurlijke taille, op zijn werkelijke lengte, geen omgeslagen zoom of toegevoegde zoom',
    PIECE_ENTIERE:'gedragen op zijn natuurlijke lengte en snit, valt normaal',
    VESTE:        'mouwen uitgestrekt tot hun natuurlijke lengte, natuurlijk gedragen, kraag plat',
    CHAUSSURE:    'normaal aan de voeten gedragen',
    ACCESSOIRE:   'normaal gedragen of gepresenteerd',
  },
  pl: {
    HAUT:         'rękawy w naturalnej długości, niepodsunięte, ubranie układające się naturalnie, niezatuczone, kołnierz płaski',
    BAS:          'noszone w naturalnej talii, w rzeczywistej długości, bez mankietów ani dodatkowych podwinięć',
    PIECE_ENTIERE:'noszone w naturalnej długości i kroju, układające się normalnie',
    VESTE:        'rękawy rozciągnięte do naturalnej długości, noszone naturalnie, kołnierz płaski',
    CHAUSSURE:    'noszone normalnie na stopach',
    ACCESSOIRE:   'noszone lub prezentowane normalnie',
  },
}

function generateWearingPrompt(result: RecognitionResult, lang: Lang): string {
  const type = classifyGarment(result.vintedPath?.value ?? '')
  const prompts = WEARING_PROMPTS[lang] ?? WEARING_PROMPTS.en
  return prompts[type] ?? WEARING_PROMPTS.en[type] ?? ''
}

/* ─── Composant principal ────────────────────────────────────────────────── */

export default function RecognitionStep({ slots, setSlots, result, aiPhotos: _aiPhotos, setAiPhotos, plan }: Props) {
  const { lang } = useLang()
  const ui = UI_I18N[lang] ?? UI_I18N.fr
  const dimPresets = DIM_PRESETS_I18N[lang] ?? DIM_PRESETS_I18N.fr
  const extraPresets = EXTRA_INFO_PRESETS_I18N[lang] ?? EXTRA_INFO_PRESETS_I18N.fr
  const mannI18n  = MANNEQUIN_I18N[lang]  ?? MANNEQUIN_I18N.fr
  const bgI18n    = BG_PANEL_I18N[lang]   ?? BG_PANEL_I18N.fr
  /* Fonds séparés — user photos / AI photos */
  const [selectedBgUser, setSelectedBgUser] = useState(() => {
    if (plan === 'freemium') return 0
    const p = readPrefs()
    return p.bgUser ?? 0
  })
  const [selectedBgAi, setSelectedBgAi] = useState(() => {
    const p = readPrefs()
    return p.bgAi ?? p.bgUser ?? 0
  })
  const [aiHasCustomBg, setAiHasCustomBg] = useState(() => {
    const p = readPrefs()
    return p.bgAi !== undefined
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
  const wearingIsAutoRef = useRef(true)
  const handleWearingPromptChange = (v: string) => {
    wearingIsAutoRef.current = false
    setMannequinWearingPrompt(v)
  }
  // Poses portées cochées par l'utilisateur (la face est toujours générée en base, hors de cette liste)
  const [mannequinPoses, setMannequinPoses] = useState<string[]>(['back', 'selfie_34'])

  /* Photos produit non portées */
  const [productDisplayMode, setProductDisplayMode] = useState<'bust' | 'hanger' | 'flat'>('bust')
  const [isGeneratingProductPhoto, setIsGeneratingProductPhoto] = useState(false)
  const [productPhotos, setProductPhotos] = useState<string[]>([])

  /* Fond — modèle first-load */
  const [isModelLoading, setIsModelLoading] = useState(false)

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

  const handleBgUserSelect = (id: number) => {
    setSelectedBgUser(id)
    if (!aiHasCustomBg) setSelectedBgAi(id)
    savePrefs({ bgUser: id })
  }
  const handleBgAiSelect = (id: number) => {
    setSelectedBgAi(id)
    setAiHasCustomBg(true)
    savePrefs({ bgAi: id })
  }

  /* Régénère le prompt de tenue quand result change, sauf si l'utilisateur l'a modifié */
  useEffect(() => {
    if (!result) return
    if (promptIsAutoRef.current) setMannequinCustomPrompt(generateOutfitPrompt(result, lang))
    if (wearingIsAutoRef.current) setMannequinWearingPrompt(generateWearingPrompt(result, lang))
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
        compositeWithBackground(slot.processedUrl!, plan === 'freemium' ? BACKGROUNDS_ALL[0] : (BACKGROUNDS_ALL.find(b => b.id === selectedBgUser) ?? BACKGROUNDS_ALL[0]), slot.id >= 9)
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
  }, [processedSlotKey, selectedBgUser])

  /* Photos FASHN : fond déjà généré par l'IA → affichage direct, sans canvas */
  useEffect(() => {
    if (aiCutoutEntries.length === 0) { setAiCompositedPhotos([]); return }
    // Les photos FASHN ont déjà leur fond (background_reference) : on n'applique
    // aucun traitement canvas (pas de compositeWithBackground). On affiche l'URL telle quelle.
    setAiCompositedPhotos(aiCutoutEntries.map(({ cutout, original }) => cutout ?? original))
  }, [aiCutoutEntries])

  /* Recomposite photos produit non portées sur le fond IA choisi */
  useEffect(() => {
    if (productCutoutEntries.length === 0) { setProductPhotos([]); return }
    // Photos non portées FASHN : fond déjà intégré → affichage direct sans canvas.
    setProductPhotos(productCutoutEntries.map(({ cutout, original }) => cutout ?? original))
  }, [productCutoutEntries])

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

      // Photo de dos de l'article (verso) — slot 1, ou slot 2 pour les chaussures.
      // Sert à générer une pose "dos" fidèle au vrai dos du vêtement (si fournie).
      const isShoe = classifyGarment(result?.vintedPath?.value ?? '') === 'CHAUSSURE'
      const versoSlot = isShoe ? slots[2] : slots[1]
      let base64Verso: string | undefined
      if (versoSlot?.file) {
        base64Verso = await new Promise<string>((resolve, reject) => {
          const r = new FileReader()
          r.onload  = () => resolve(r.result as string)
          r.onerror = reject
          r.readAsDataURL(versoSlot.file!)
        })
      }

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
          background_id:  selectedBgAi,
          poses:          base64Verso ? mannequinPoses : mannequinPoses.filter(p => p !== 'back'),
          ouverture:      result?.ouverture?.value || undefined,
          verso_image:    base64Verso,
        }),
      })
      if (!res.ok) throw new Error('Generation failed')
      const { urls } = await res.json() as { urls: string[] }
      setAiPhotos(urls)
      // Les photos FASHN sont déjà naturelles (mannequin + fond générés) :
      // pas de détourage/composition canvas. On les affiche telles quelles.
      const entries: AiCutoutEntry[] = urls.map((original) => ({ cutout: null, original }))
      setAiCutoutEntries(entries)
    } catch (err) {
      console.error('Mannequin generation failed:', err)
    } finally {
      setIsGeneratingMannequin(false)
    }
  }, [selectedMannequin, isGeneratingMannequin, mannequinCustomPrompt, mannequinWearingPrompt, mannequinPoses, selectedBgAi, slots, result, setAiPhotos])

  const handleGenerateProductPhoto = useCallback(async () => {
    if (isGeneratingProductPhoto) return
    const slot0 = slots[0]
    if (!slot0?.file) return
    setIsGeneratingProductPhoto(true)
    try {
      const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
        const r = new FileReader()
        r.onload = () => resolve(r.result as string)
        r.onerror = reject
        r.readAsDataURL(file)
      })

      const base64Recto = await toBase64(slot0.file!)

      /* verso = slot 1 (recto dos), ou slot 2 (profil) pour les chaussures */
      const isShoe = classifyGarment(result?.vintedPath?.value ?? '') === 'CHAUSSURE'
      const versoSlot = isShoe ? slots[2] : slots[1]
      const base64Verso = versoSlot?.file ? await toBase64(versoSlot.file) : undefined

      const res = await fetch('/api/generate-product-photo', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          product_image: base64Recto,
          verso_image:   base64Verso,
          display_mode:  productDisplayMode,
          background_id: selectedBgAi,
          ouverture:     result?.ouverture?.value || undefined,
        }),
      })
      if (!res.ok) throw new Error('Generation failed')
      const { urls } = await res.json() as { urls: string[] }
      // Photos non portées FASHN : fond déjà généré (background_reference) →
      // affichage direct, aucun traitement canvas.
      const entries: AiCutoutEntry[] = urls.map((original) => ({ cutout: null, original }))
      setProductCutoutEntries(entries)
    } catch (err) {
      console.error('Product photo generation failed:', err)
    } finally {
      setIsGeneratingProductPhoto(false)
    }
  }, [isGeneratingProductPhoto, productDisplayMode, slots, result])

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
    const { removeBackground, isModelReady } = await import('@/lib/background-removal')
    if (!isModelReady()) setIsModelLoading(true)
    for (const slotId of toProcess) {
      const slot = slotsRef.current[slotId]
      if (!slot?.file) continue
      try {
        const blob        = new Blob([await slot.file.arrayBuffer()], { type: slot.file.type || 'image/jpeg' })
        const resultBlob  = await removeBackground(blob)
        const cleanedBlob = await cleanCutout(resultBlob)
        setIsModelLoading(false)
        updateSlot(slotId, { status: 'done', processedUrl: URL.createObjectURL(cleanedBlob) })
      } catch (err) {
        console.error(`Background removal failed (slot ${slotId}):`, err)
        setIsModelLoading(false)
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
        const { removeBackground, isModelReady } = await import('@/lib/background-removal')
        if (!isModelReady()) setIsModelLoading(true)
        const blob        = new Blob([await slot0.file.arrayBuffer()], { type: slot0.file.type || 'image/jpeg' })
        const resultBlob  = await removeBackground(blob)
        const cleanedBlob = await cleanCutout(resultBlob)
        setIsModelLoading(false)
        updateSlot(0, { status: 'done', processedUrl: URL.createObjectURL(cleanedBlob) })
      } catch {
        setIsModelLoading(false)
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

  const totalAiPhotos = aiCompositedPhotos.length + productPhotos.length

  /* ── Rendu visuel — 4 blocs ── */
  return (
    <div className="space-y-6">

      {/* ── Bloc 1 — Tes photos + Fond ── */}
      <BgPanel
        plan={plan}
        slots={slots}
        selectedBg={selectedBgUser}
        onBgSelect={handleBgUserSelect}
        bgCheckedSlots={bgCheckedSlots}
        onCheckToggle={toggleBgCheck}
        isProcessing={isProcessingBg}
        isModelLoading={isModelLoading}
        onProcess={processCheckedSlots}
        onValidateFreemium={handleValidateAndProcess}
        bgI18n={bgI18n}
      />

      {/* ── Bloc 4 — Rendu final (background remover des photos uploadées) ── */}
      {Object.keys(compositedUrls).length > 0 && (
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{bgI18n.rendFinalTitle}</p>
          <div className="grid grid-cols-4 gap-2 items-start">
            {Object.entries(compositedUrls).map(([id, url]) => (
              <div key={`bg-${id}`} className="relative aspect-[3/4] rounded-xl overflow-hidden border border-green-200 shadow-sm">
                <img src={url} alt={`Rendu ${id}`} className="w-full h-full object-cover" draggable={false} />
                <div className="absolute top-1 left-1">
                  <span className="bg-green-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow">✓</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Bloc 2 — Mannequin IA (Pro) ── */}
      <MannequinPanel
        selectedMannequin={selectedMannequin}
        onSelect={setSelectedMannequin}
        onGenerate={handleGenerateMannequin}
        isGenerating={isGeneratingMannequin}
        hasSlot0Photo={!!slots[0]?.file}
        hasVersoPhoto={!!(classifyGarment(result?.vintedPath?.value ?? '') === 'CHAUSSURE' ? slots[2]?.file : slots[1]?.file)}
        mannI18n={mannI18n}
        customPrompt={mannequinCustomPrompt}
        onCustomPromptChange={handleCustomPromptChange}
        wearingPrompt={mannequinWearingPrompt}
        onWearingPromptChange={handleWearingPromptChange}
        poses={mannequinPoses}
        onPosesChange={setMannequinPoses}
        productDisplayMode={productDisplayMode}
        onProductDisplayModeChange={setProductDisplayMode}
        onGenerateProductPhoto={handleGenerateProductPhoto}
        isGeneratingProductPhoto={isGeneratingProductPhoto}
        initialGender={result.genre.value === 'homme' ? 'men' : result.genre.value === 'femme' ? 'women' : 'men'}
        totalGeneratedPhotos={totalAiPhotos}
        selectedBgAi={selectedBgAi}
        onBgAiSelect={handleBgAiSelect}
        plan={plan}
        bgI18n={bgI18n}
      />
      {/* ── Rendu Studio photo IA (portées + produit), sous le panneau ── */}
      {(aiCompositedPhotos.length > 0 || productPhotos.length > 0) && (
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{bgI18n.rendStudioTitle}</p>
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
  hasVersoPhoto: boolean
  mannI18n: typeof MANNEQUIN_I18N.fr
  customPrompt: string
  onCustomPromptChange: (v: string) => void
  wearingPrompt: string
  onWearingPromptChange: (v: string) => void
  poses: string[]
  onPosesChange: (v: string[]) => void
  productDisplayMode: 'bust' | 'hanger' | 'flat'
  onProductDisplayModeChange: (v: 'bust' | 'hanger' | 'flat') => void
  onGenerateProductPhoto: () => void
  isGeneratingProductPhoto: boolean
  initialGender?: 'men' | 'women'
  totalGeneratedPhotos?: number
  selectedBgAi: number
  onBgAiSelect: (id: number) => void
  plan: Plan
  bgI18n: typeof BG_PANEL_I18N.fr
}

function MannequinPanel({
  selectedMannequin, onSelect, onGenerate, isGenerating, hasSlot0Photo, hasVersoPhoto,
  mannI18n, customPrompt, onCustomPromptChange,
  wearingPrompt, onWearingPromptChange,
  poses, onPosesChange,
  productDisplayMode, onProductDisplayModeChange,
  onGenerateProductPhoto, isGeneratingProductPhoto,
  initialGender = 'men',
  totalGeneratedPhotos = 0,
  selectedBgAi, onBgAiSelect, plan, bgI18n,
}: MannequinPanelProps) {
  const [gender, setGender]                   = useState<'men' | 'women'>(initialGender)
  const [previewId, setPreviewId]             = useState<string | null>(null)
  const [showCustomPrompt, setShowCustomPrompt]   = useState(false)
  const [showWearingPrompt, setShowWearingPrompt] = useState(false)
  const [showPreviewAi, setShowPreviewAi] = useState(false)
  const currentBgAi = BACKGROUNDS_ALL.find(b => b.id === selectedBgAi) ?? BACKGROUNDS_ALL[0]
  const isPro              = plan === 'pro'
  const canGenerate        = isPro && !!selectedMannequin && hasSlot0Photo
  const canGenerateProduct = isPro && hasSlot0Photo
  const mannequins         = gender === 'men' ? MEN_MANNEQUINS : WOMEN_MANNEQUINS

  return (
    <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4 space-y-3">
      {!hasVersoPhoto && (
        <div className="flex items-start gap-3 rounded-xl bg-amber-100 border-2 border-amber-300 px-4 py-3.5">
          <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm font-semibold text-amber-800 leading-snug">{mannI18n.noVersoWarning}</p>
        </div>
      )}
      {/* En-tête */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
          <User className="w-4 h-4 text-purple-600" />
        </div>
        <div>
          <h3 className="font-display font-extrabold text-base text-purple-900">
            {mannI18n.mannequinTitle}
            {!isPro && (
              <span className="ml-2 inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-600 text-white align-middle">
                <Lock className="w-2.5 h-2.5" /> {mannI18n.proBadge}
              </span>
            )}
            {totalGeneratedPhotos > 0 && (
              <span className="font-semibold text-purple-500 ml-1">{mannI18n.photosGenerated(totalGeneratedPhotos)}</span>
            )}
          </h3>
          <p className="text-[11px] text-purple-600 mt-0.5">{mannI18n.mannequinSubtitle}</p>
        </div>
      </div>

      {/* 1 — Sélecteur de fond */}
      <div className="space-y-1.5">
        <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">{bgI18n.bgPanelTitle}</p>
        <BgSelector plan={plan} selectedBg={selectedBgAi} onSelect={id => { onBgAiSelect(id); setShowPreviewAi(true) }} bgI18n={bgI18n} proOnly={true} />
        {showPreviewAi && isPro && (
          <div className="rounded-xl overflow-hidden border border-purple-200 shadow-sm">
            <div className="w-full" style={{ maxHeight: '380px', minHeight: '120px' }}>
              {currentBgAi.type === 'color'
                ? <div className="w-full h-full" style={{ backgroundColor: currentBgAi.color, minHeight: '120px' }} />
                : <img src={currentBgAi.src} alt={currentBgAi.label} className="w-full object-contain" style={{ maxHeight: '380px' }} draggable={false} />}
            </div>
            <div className="p-2 border-t border-purple-100">
              <button
                onClick={() => setShowPreviewAi(false)}
                className="w-full flex items-center justify-center gap-2 font-semibold text-sm py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white active:scale-[0.98] transition-all"
              >
                <Check className="w-4 h-4" />
                {mannI18n.modalConfirmBg}
              </button>
            </div>
          </div>
        )}
        {plan === 'freemium' && (
          <p className="text-xs text-purple-400 flex items-center gap-1.5">
            <Lock className="w-3 h-3 shrink-0" />
            {bgI18n.freemiumLockMsg}
          </p>
        )}
      </div>

      <div className="border-t border-purple-100" />

      {/* 2 — Présentation de l'article */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-purple-700">{mannI18n.displayModeTitle}</p>
        <div className="flex gap-2">
          {(['flat', 'hanger', 'bust'] as const).map(mode => (
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
              ? 'bg-purple-600 hover:bg-purple-700 text-white active:scale-[0.98]'
              : 'bg-purple-100 text-purple-400 cursor-not-allowed'
          }`}
        >
          {isGeneratingProductPhoto ? (
            <>
              <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
              {mannI18n.mannequinGenerating}
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              {mannI18n.generateProductPhotos}
            </>
          )}
        </button>
        {!isPro && (
          <p className="text-[11px] text-purple-500 text-center mt-2">{mannI18n.proMessage}</p>
        )}
      </div>

      <div className="border-t border-purple-100" />

      {/* 3 — Sélection mannequin */}
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
            onClick={() => { if (!isPro) return; onSelect(id); setPreviewId(id) }}
            disabled={!isPro}
            className={`relative snap-start shrink-0 w-20 h-20 rounded-xl overflow-hidden transition-all ${
              !isPro
                ? 'ring-1 ring-purple-100 opacity-60 cursor-not-allowed'
                : selectedMannequin === id
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
            {isPro && selectedMannequin === id && (
              <div className="absolute inset-0 flex items-center justify-center bg-purple-600/20">
                <Check className="w-4 h-4 text-white drop-shadow" />
              </div>
            )}
            {!isPro && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-[inherit]">
                <Lock className="w-4 h-4 text-white drop-shadow" />
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

      {/* 3bis — Choix des poses portées (la face est toujours générée) */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-purple-700">{mannI18n.posesLabel}</p>
        <div className="grid grid-cols-2 gap-1.5">
          {/* Face — toujours générée (base), non décochable */}
          <div className="flex items-center gap-2 text-left text-xs px-2.5 py-2 rounded-lg border bg-purple-100 border-purple-300 text-purple-800 font-semibold cursor-not-allowed">
            <span className="w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 bg-purple-600 border-purple-600">
              <Check className="w-2.5 h-2.5 text-white" />
            </span>
            {mannI18n.poseFace}
          </div>
          {([
            { id: 'back',           label: mannI18n.poseBack },
            { id: 'selfie_face',    label: mannI18n.poseSelfieFace },
            { id: 'selfie_34',      label: mannI18n.poseSelfie34 },
            { id: 'selfie_profile', label: mannI18n.poseSelfieProfile },
            { id: 'seated_selfie',  label: mannI18n.poseSeatedSelfie },
          ] as const).map(pose => {
            const checked = poses.includes(pose.id)
            return (
              <button
                key={pose.id}
                type="button"
                onClick={() =>
                  onPosesChange(
                    checked ? poses.filter(p => p !== pose.id) : [...poses, pose.id]
                  )
                }
                className={`flex items-center gap-2 text-left text-xs px-2.5 py-2 rounded-lg border transition-all ${
                  checked
                    ? 'bg-purple-100 border-purple-300 text-purple-800 font-semibold'
                    : 'bg-white border-purple-100 text-purple-500 hover:border-purple-200'
                }`}
              >
                <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${
                  checked ? 'bg-purple-600 border-purple-600' : 'border-purple-300'
                }`}>
                  {checked && <Check className="w-2.5 h-2.5 text-white" />}
                </span>
                {pose.label}
              </button>
            )
          })}
        </div>
        <p className="text-[11px] text-purple-400">{mannI18n.posesHint}</p>
      </div>

      {/* 4 — Bouton générer photos portées */}
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
        ) : isPro ? (
          <>
            <Sparkles className="w-4 h-4" />
            {mannI18n.mannequinGenerate}
          </>
        ) : (
          <>
            <Lock className="w-4 h-4" />
            {mannI18n.proRequired}
          </>
        )}
      </button>
      {!isPro && (
        <p className="text-[11px] text-purple-500 text-center mt-2">{mannI18n.proMessage}</p>
      )}

      {isGenerating && (
        <div className="w-full rounded-lg bg-indigo-50 border border-indigo-200 p-3 my-2">
          <div className="flex items-center gap-2 mb-2 text-sm text-indigo-700 font-medium">
            <svg className="animate-spin h-4 w-4 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            <span>{mannI18n.mannequinGenerating}</span>
          </div>
          <div className="w-full bg-indigo-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-indigo-500 h-1.5 rounded-full animate-pulse w-full" />
          </div>
        </div>
      )}

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

/* ─── BgSelector — carrousel de swatches réutilisable ───────────────────── */

function BgSelector({ plan, selectedBg, onSelect, bgI18n, proOnly }: {
  plan: Plan
  selectedBg: number
  onSelect: (id: number) => void
  bgI18n: typeof BG_PANEL_I18N.fr
  proOnly?: boolean
}) {
  const [bgCategory, setBgCategory] = useState<'interieur' | 'studio'>('interieur')
  const bgList = bgCategory === 'interieur' ? BACKGROUNDS_INTERIEUR : BACKGROUNDS_STUDIO
  const WHITE   = makeBg(0)

  return (
    <div className="space-y-2">
      {/* Category toggle */}
      <div className="flex gap-2">
        {(['interieur', 'studio'] as const).map(cat => (
          <button
            key={cat}
            onClick={() => setBgCategory(cat)}
            className={`flex-1 text-xs font-semibold py-1.5 rounded-xl transition-all ${
              bgCategory === cat
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-indigo-500 border border-indigo-200 hover:border-indigo-400'
            }`}
          >
            {cat === 'interieur' ? bgI18n.bgCatInterieur : bgI18n.bgCatStudio}
          </button>
        ))}
      </div>
      {/* Carousel */}
      <div className="flex gap-2 overflow-x-auto snap-x snap-mandatory py-1 -mx-0.5 px-0.5">
        {[WHITE, ...bgList].map(bg => {
          const isLocked = bg.id !== 0 && (proOnly ? plan !== 'pro' : plan === 'freemium')
          return (
            <button
              key={bg.id}
              onClick={() => { if (!isLocked) onSelect(bg.id) }}
              disabled={isLocked}
              className={`relative snap-start shrink-0 w-20 h-20 rounded-xl overflow-hidden transition-all ${
                isLocked ? 'cursor-not-allowed' : 'cursor-pointer'
              } ${
                selectedBg === bg.id && !isLocked
                  ? 'ring-2 ring-indigo-500 ring-offset-2 scale-[1.06] shadow-md shadow-indigo-200'
                  : isLocked ? 'ring-1 ring-gray-200 opacity-60'
                  : 'ring-1 ring-gray-200 hover:ring-indigo-300'
              }`}
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
    </div>
  )
}

interface BgPanelProps {
  plan: Plan
  slots: PhotoSlot[]
  selectedBg: number
  onBgSelect: (id: number) => void
  bgCheckedSlots: Set<number>
  onCheckToggle: (id: number) => void
  isProcessing: boolean
  isModelLoading: boolean
  onProcess: () => void
  onValidateFreemium: () => void
  bgI18n: typeof BG_PANEL_I18N.fr
}

function BgPanel({
  plan, slots, selectedBg, onBgSelect,
  bgCheckedSlots, onCheckToggle, isProcessing, isModelLoading, onProcess,
  onValidateFreemium, bgI18n,
}: BgPanelProps) {
  const [showPreview, setShowPreview] = useState(false)
  const currentBg = BACKGROUNDS_ALL.find(b => b.id === selectedBg) ?? BACKGROUNDS_ALL[0]
  const filledSlots = slots.filter(s => s.file !== null)

  return (
    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 space-y-3">
      <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">{bgI18n.yourPhotosTitle}</p>

      {/* Photos du user avec cases à cocher */}
      {filledSlots.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {filledSlots.map(slot => (
            <button
              key={slot.id}
              onClick={() => onCheckToggle(slot.id)}
              className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                bgCheckedSlots.has(slot.id) ? 'border-indigo-500 shadow-md' : 'border-gray-200 hover:border-indigo-300'
              }`}
            >
              {slot.preview && (
                <img src={slot.preview} alt={`slot ${slot.id}`} className="w-full h-full object-contain bg-gray-50" draggable={false} />
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

      <div className="h-px bg-blue-100" />
      <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">{bgI18n.bgPanelTitle}</p>

      {/* Carrousel snap-x horizontal */}
      <BgSelector
        plan={plan}
        selectedBg={selectedBg}
        onSelect={(id) => { onBgSelect(id); setShowPreview(true) }}
        bgI18n={bgI18n}
      />

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
                  <><div className="w-4 h-4 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />{isModelLoading ? bgI18n.modelLoading : bgI18n.processing}</>
                ) : (
                  <><Wand2 className="w-4 h-4" />{bgI18n.bannerBtn}</>
                )}
              </button>
            </div>
          )}
        </>
      ) : (
        /* Premium / Pro : bouton traitement */
        <>
          <button
            onClick={onProcess}
            disabled={bgCheckedSlots.size === 0 || isProcessing}
            className={`w-full flex items-center justify-center gap-2 font-semibold text-sm py-3 rounded-xl transition-all ${
              isProcessing ? 'bg-indigo-100 text-indigo-400 cursor-wait'
              : bgCheckedSlots.size === 0 ? 'bg-indigo-100 text-indigo-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-[0.98]'
            }`}
          >
            {isProcessing
              ? <><div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />{isModelLoading ? bgI18n.modelLoading : bgI18n.processing}</>
              : <><Wand2 className="w-4 h-4" />{bgCheckedSlots.size === 0 ? bgI18n.selectPhotosHint : bgI18n.processBtn(bgCheckedSlots.size)}</>}
          </button>
        </>
      )}
    </div>
  )
}
