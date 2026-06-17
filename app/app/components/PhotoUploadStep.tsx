'use client'

import { useState, useRef, useCallback, useEffect, useMemo } from 'react'
import {
  Camera, Tag, X, Lock, Upload, Sparkles,
  GripVertical, AlertTriangle, Check, Link,
  Loader2, RefreshCw, CheckCircle2, XCircle, Pencil,
  AlertCircle, ScanLine, Plus,
} from 'lucide-react'
import type { PhotoSlot, RecognitionResult, RecognitionField, Confidence, ExtraInfo, Plan } from '../types'
import {
  SIZES, COLORS, MATERIALS, CONDITIONS, STYLES, PATTERNS,
  tx, GENRE_LABELS, CONDITION_LABELS, COLOR_LABELS, MATERIAL_LABELS,
  STYLE_LABELS, PATTERN_LABELS,
} from '@/lib/vinted-taxonomy'
import type { SizeSystem } from '@/lib/vinted-taxonomy'
import { getN1List, getN2List, getN3List, getN4List, getN5List, parseVintedPath } from '@/lib/vinted-navigation-taxonomy'
import type { Lang } from '@/lib/i18n'
import { useLang } from '@/app/providers'

/* ─── Titres des 2 sections — 7 langues ──────────────────────────────────── */

const SECTION_TITLES: Record<Lang, { s1: string; s2: string }> = {
  fr: {
    s1: 'PHOTOS NON PORTÉES (À PLAT, ÉTIQUETTES, DÉTAILS)',
    s2: 'PHOTOS PORTÉES (FACE, PROFIL, DOS)',
  },
  en: {
    s1: 'UNWORN PHOTOS (FLAT, LABELS, DETAILS)',
    s2: 'WORN PHOTOS (FRONT, SIDE, BACK)',
  },
  es: {
    s1: 'FOTOS SIN PORTAR (PLANO, ETIQUETAS, DETALLES)',
    s2: 'FOTOS VESTIDAS (FRENTE, PERFIL, ESPALDA)',
  },
  de: {
    s1: 'NICHT GETRAGENE FOTOS (FLACH, ETIKETTEN, DETAILS)',
    s2: 'GETRAGENE FOTOS (VORNE, SEITE, HINTEN)',
  },
  it: {
    s1: 'FOTO NON INDOSSATE (PIANO, ETICHETTE, DETTAGLI)',
    s2: 'FOTO INDOSSATE (FRONTE, PROFILO, RETRO)',
  },
  nl: {
    s1: "NIET-GEDRAGEN FOTO'S (PLAT, LABELS, DETAILS)",
    s2: "GEDRAGEN FOTO'S (VOOR, ZIJKANT, ACHTER)",
  },
  pl: {
    s1: 'ZDJĘCIA NIENOSZONE (PŁASKO, ETYKIETY, SZCZEGÓŁY)',
    s2: 'ZDJĘCIA NOSZONE (PRZÓD, BOK, TYŁ)',
  },
}

/* ─── Labels des 15 slots — 7 langues ────────────────────────────────────── */

const SLOT_LABELS: Record<Lang, string[]> = {
  fr: [
    'Photo recto (cintre / à plat)', 'Photo verso (cintre / à plat)', 'Autre vue non portée',
    'Étiquette marque', 'Étiquette taille', 'Étiquette compo.',
    'Autre photo (détail, défaut, emballage...)', 'Autre photo (détail, défaut, emballage...)', 'Autre photo (détail, défaut, emballage...)',
    'Vue portée 1', 'Vue portée 2', 'Vue portée 3', 'Vue portée 4', 'Vue portée 5', 'Vue portée 6',
  ],
  en: [
    'Front (flat/hanger)', 'Back (flat/hanger)', 'Other flat view',
    'Brand label', 'Size label', 'Care label',
    'Other photo (detail, flaw, packaging...)', 'Other photo (detail, flaw, packaging...)', 'Other photo (detail, flaw, packaging...)',
    'Worn view 1', 'Worn view 2', 'Worn view 3', 'Worn view 4', 'Worn view 5', 'Worn view 6',
  ],
  es: [
    'Foto frontal (plano/percha)', 'Foto trasera (plano/percha)', 'Otra vista sin portar',
    'Etiqueta marca', 'Etiqueta talla', 'Etiqueta compos.',
    'Otra foto (detalle, defecto, embalaje...)', 'Otra foto (detalle, defecto, embalaje...)', 'Otra foto (detalle, defecto, embalaje...)',
    'Vista vestida 1', 'Vista vestida 2', 'Vista vestida 3', 'Vista vestida 4', 'Vista vestida 5', 'Vista vestida 6',
  ],
  de: [
    'Vorderfoto (flach/Bügel)', 'Rückseite (flach/Bügel)', 'Andere Ansicht (nicht getragen)',
    'Markenetikett', 'Größenetikett', 'Pflegeetikett',
    'Anderes Foto (Detail, Mangel, Verpackung...)', 'Anderes Foto (Detail, Mangel, Verpackung...)', 'Anderes Foto (Detail, Mangel, Verpackung...)',
    'Getragen 1', 'Getragen 2', 'Getragen 3', 'Getragen 4', 'Getragen 5', 'Getragen 6',
  ],
  it: [
    'Foto fronte (piano/gruccia)', 'Foto retro (piano/gruccia)', 'Altra vista non indossata',
    'Etich. marca', 'Etich. taglia', 'Etich. composiz.',
    'Altra foto (dettaglio, difetto, imballaggio...)', 'Altra foto (dettaglio, difetto, imballaggio...)', 'Altra foto (dettaglio, difetto, imballaggio...)',
    'Indossato 1', 'Indossato 2', 'Indossato 3', 'Indossato 4', 'Indossato 5', 'Indossato 6',
  ],
  nl: [
    'Voorkant (plat/hanger)', 'Achterkant (plat/hanger)', 'Andere niet-gedragen weergave',
    'Merklabel', 'Maatlabel', 'Samenst. label',
    'Andere foto (detail, gebrek, verpakking...)', 'Andere foto (detail, gebrek, verpakking...)', 'Andere foto (detail, gebrek, verpakking...)',
    'Gedragen 1', 'Gedragen 2', 'Gedragen 3', 'Gedragen 4', 'Gedragen 5', 'Gedragen 6',
  ],
  pl: [
    'Przód (płasko/wieszak)', 'Tył (płasko/wieszak)', 'Inny widok (nienoszone)',
    'Etykieta marki', 'Etykieta rozm.', 'Etykieta skład',
    'Inne zdjęcie (detal, wada, opakowanie...)', 'Inne zdjęcie (detal, wada, opakowanie...)', 'Inne zdjęcie (detal, wada, opakowanie...)',
    'Noszone 1', 'Noszone 2', 'Noszone 3', 'Noszone 4', 'Noszone 5', 'Noszone 6',
  ],
}

/* ─── Traductions zone d'import — 7 langues ─────────────────────────────── */

const DROP_I18N: Record<Lang, {
  title: string
  subtitle: string
  classifying: string
  classifyingSub: string
  dropHere: string
  importBtn: string
  importHint: string
  classified: (n: number) => string
  overflow: (kept: number, ignored: number) => string
}> = {
  fr: {
    title:          "Photos de l'article",
    subtitle:       "Ajoutez jusqu'à 15 photos. La photo principale est obligatoire — l'IA supprime automatiquement son fond.",
    classifying:    'Classification IA en cours…',
    classifyingSub: "L'IA identifie chaque vue et place les photos dans les bons slots",
    dropHere:       'Déposez les photos ici',
    importBtn:      'Importer plusieurs photos',
    importHint:     "ou glissez-déposez · l'IA classe chaque vue automatiquement",
    classified:     (n) => `${n} photo${n > 1 ? 's' : ''} classée${n > 1 ? 's' : ''} par l'IA`,
    overflow:       (kept, ignored) =>
      `Seules les ${kept} premières photos ont été importées, ${ignored} photo${ignored > 1 ? 's ont' : ' a'} été ignorée${ignored > 1 ? 's' : ''}.`,
  },
  en: {
    title:          'Item photos',
    subtitle:       'Add up to 15 photos. The main photo is required — AI automatically removes its background.',
    classifying:    'AI classification in progress…',
    classifyingSub: 'AI identifies each view and places photos in the correct slots',
    dropHere:       'Drop photos here',
    importBtn:      'Import multiple photos',
    importHint:     'or drag & drop · AI classifies each view automatically',
    classified:     (n) => `${n} photo${n > 1 ? 's' : ''} classified by AI`,
    overflow:       (kept, ignored) =>
      `Only the first ${kept} photos were imported, ${ignored} photo${ignored > 1 ? 's were' : ' was'} skipped.`,
  },
  es: {
    title:          'Fotos del artículo',
    subtitle:       'Añade hasta 15 fotos. La foto principal es obligatoria — la IA elimina automáticamente el fondo.',
    classifying:    'Clasificación IA en curso…',
    classifyingSub: 'La IA identifica cada vista y coloca las fotos en los slots correctos',
    dropHere:       'Suelta las fotos aquí',
    importBtn:      'Importar varias fotos',
    importHint:     'o arrastra y suelta · la IA clasifica cada vista automáticamente',
    classified:     (n) => `${n} foto${n > 1 ? 's' : ''} clasificada${n > 1 ? 's' : ''} por la IA`,
    overflow:       (kept, ignored) =>
      `Solo se importaron las primeras ${kept} fotos, ${ignored} foto${ignored > 1 ? 's fueron' : ' fue'} ignorada${ignored > 1 ? 's' : ''}.`,
  },
  de: {
    title:          'Artikelfotos',
    subtitle:       'Füge bis zu 15 Fotos hinzu. Das Hauptfoto ist Pflicht — die KI entfernt automatisch den Hintergrund.',
    classifying:    'KI-Klassifizierung läuft…',
    classifyingSub: 'Die KI erkennt jede Ansicht und ordnet die Fotos den richtigen Slots zu',
    dropHere:       'Fotos hier ablegen',
    importBtn:      'Mehrere Fotos importieren',
    importHint:     'oder per Drag & Drop · die KI klassifiziert jede Ansicht automatisch',
    classified:     (n) => `${n} Foto${n > 1 ? 's' : ''} von der KI klassifiziert`,
    overflow:       (kept, ignored) =>
      `Nur die ersten ${kept} Fotos wurden importiert, ${ignored} Foto${ignored > 1 ? 's wurden' : ' wurde'} ignoriert.`,
  },
  it: {
    title:          "Foto dell'articolo",
    subtitle:       "Aggiungi fino a 15 foto. La foto principale è obbligatoria — l'IA rimuove automaticamente lo sfondo.",
    classifying:    'Classificazione IA in corso…',
    classifyingSub: "L'IA identifica ogni vista e posiziona le foto negli slot corretti",
    dropHere:       'Rilascia le foto qui',
    importBtn:      'Importa più foto',
    importHint:     "o trascina e rilascia · l'IA classifica ogni vista automaticamente",
    classified:     (n) => `${n} foto classificat${n > 1 ? 'e' : 'a'} dall'IA`,
    overflow:       (kept, ignored) =>
      `Solo le prime ${kept} foto sono state importate, ${ignored} foto sono state ignorate.`,
  },
  nl: {
    title:          "Foto's van het artikel",
    subtitle:       "Voeg maximaal 15 foto's toe. De hoofdfoto is verplicht — AI verwijdert automatisch de achtergrond.",
    classifying:    'AI-classificatie bezig…',
    classifyingSub: "AI identificeert elke weergave en plaatst foto's in de juiste slots",
    dropHere:       "Foto's hier neerzetten",
    importBtn:      "Meerdere foto's importeren",
    importHint:     "of slepen en neerzetten · AI classificeert elke weergave automatisch",
    classified:     (n) => `${n} foto${n > 1 ? "'s" : ''} geclassificeerd door AI`,
    overflow:       (kept, ignored) =>
      `Alleen de eerste ${kept} foto's zijn geïmporteerd, ${ignored} foto${ignored > 1 ? "'s zijn" : ' is'} overgeslagen.`,
  },
  pl: {
    title:          'Zdjęcia przedmiotu',
    subtitle:       'Dodaj do 15 zdjęć. Zdjęcie główne jest wymagane — AI automatycznie usuwa tło.',
    classifying:    'Klasyfikacja AI w toku…',
    classifyingSub: 'AI identyfikuje każdy widok i umieszcza zdjęcia w odpowiednich slotach',
    dropHere:       'Upuść zdjęcia tutaj',
    importBtn:      'Importuj kilka zdjęć',
    importHint:     'lub przeciągnij i upuść · AI klasyfikuje każdy widok automatycznie',
    classified:     (n) => `${n} zdjęci${n === 1 ? 'e' : n < 5 ? 'a' : 'e'} sklasyfikowane przez AI`,
    overflow:       (kept, ignored) =>
      `Zaimportowano tylko pierwsze ${kept} zdjęcia, ${ignored} zdjęci${ignored === 1 ? 'e' : 'a'} zostało pominiętych.`,
  },
}

/* ─── Badges de statut des slots — 7 langues ─────────────────────────────── */

const BADGE_I18N: Record<Lang, { required: string; recommended: string; optional: string }> = {
  fr: { required: 'Obligatoire', recommended: 'Recommandé', optional: 'Optionnel' },
  en: { required: 'Required',    recommended: 'Recommended', optional: 'Optional' },
  es: { required: 'Obligatorio', recommended: 'Recomendado', optional: 'Opcional' },
  de: { required: 'Pflicht',     recommended: 'Empfohlen',   optional: 'Optional' },
  it: { required: 'Obbligatorio',recommended: 'Consigliato', optional: 'Facoltativo' },
  nl: { required: 'Verplicht',   recommended: 'Aanbevolen',  optional: 'Optioneel' },
  pl: { required: 'Wymagane',    recommended: 'Zalecane',    optional: 'Opcjonalne' },
}

const BADGE_CLS = {
  required:    'bg-indigo-100 text-indigo-700',
  recommended: 'bg-gray-100 text-gray-500',
  optional:    'bg-gray-50 text-gray-400',
} as const

/* ─── Traductions chargement + statut fond — 7 langues ───────────────────── */

const LOADING_I18N: Record<Lang, {
  removingBg: string
  applyingBg: string
  loading: string
  bgRemoved: string
  bgFailed: string
  bgPro: string
}> = {
  fr: { removingBg: 'Suppression fond…', applyingBg: 'Application fond…', loading: 'Chargement…', bgRemoved: 'Fond supprimé', bgFailed: 'Fond indisponible', bgPro: 'Fond Pro' },
  en: { removingBg: 'Removing background…', applyingBg: 'Applying background…', loading: 'Loading…', bgRemoved: 'Background removed', bgFailed: 'Background unavailable', bgPro: 'Pro background' },
  es: { removingBg: 'Eliminando fondo…', applyingBg: 'Aplicando fondo…', loading: 'Cargando…', bgRemoved: 'Fondo eliminado', bgFailed: 'Fondo no disponible', bgPro: 'Fondo Pro' },
  de: { removingBg: 'Hintergrund entfernen…', applyingBg: 'Hintergrund anwenden…', loading: 'Laden…', bgRemoved: 'Hintergrund entfernt', bgFailed: 'Hintergrund nicht verfügbar', bgPro: 'Pro-Hintergrund' },
  it: { removingBg: 'Rimozione sfondo…', applyingBg: 'Applicazione sfondo…', loading: 'Caricamento…', bgRemoved: 'Sfondo rimosso', bgFailed: 'Sfondo non disponibile', bgPro: 'Sfondo Pro' },
  nl: { removingBg: 'Achtergrond verwijderen…', applyingBg: 'Achtergrond toepassen…', loading: 'Laden…', bgRemoved: 'Achtergrond verwijderd', bgFailed: 'Achtergrond niet beschikbaar', bgPro: 'Pro-achtergrond' },
  pl: { removingBg: 'Usuwanie tła…', applyingBg: 'Stosowanie tła…', loading: 'Ładowanie…', bgRemoved: 'Tło usunięte', bgFailed: 'Tło niedostępne', bgPro: 'Tło Pro' },
}

/* ─── Traductions interface plans — 7 langues ────────────────────────────── */

const PLAN_I18N: Record<Lang, {
  bgPanelTitle: string
  freemiumLockMsg: string
  checkboxHint: string
  processBtn: (n: number) => string
  processing: string
  mannequinTitle: string
  mannequinMen: string
  mannequinWomen: string
  mannequinGenerate: string
  mannequinGenerating: string
  mannequinLockedMsg: string
  mannequinCustomPromptLabel: string
  wearingPromptLabel: string
  displayModeTitle: string
  displayModeBust: string
  displayModeHanger: string
  displayModeFlat: string
  generateProductPhotos: string
  teaserTitle: string
  teaserDesc: string
  badgeAI: string
  noSlot0Msg: string
  noMannequinMsg: string
  rendTitle: string
  modalClose: string
  modalConfirmBg: string
  modalConfirmMannequin: string
  importVintedTitle: string
  importVintedPlaceholder: string
  importVintedBtn: string
  importVintedLoading: string
  importVintedLocked: string
  importVintedSuccess: (n: number) => string
  importVintedErrInvalid: string
  importVintedErrFetch: string
  importVintedErrNoPhotos: string
}> = {
  fr: {
    bgPanelTitle:          'Fond des photos',
    freemiumLockMsg:       'Passez au Premium pour tous les fonds',
    checkboxHint:          'Cliquez sur une photo pour la sélectionner · puis traitez',
    processBtn:            (n) => `Traiter ${n} photo${n > 1 ? 's' : ''} sélectionnée${n > 1 ? 's' : ''}`,
    processing:            'Traitement en cours…',
    mannequinTitle:        'Mannequin IA · 2 photos générées',
    mannequinMen:          'Homme',
    mannequinWomen:        'Femme',
    mannequinGenerate:     'Générer 2 photos portées',
    mannequinGenerating:   'Génération en cours…',
    mannequinLockedMsg:    'Disponible avec le plan Pro',
    mannequinCustomPromptLabel: 'Personnaliser la tenue',
    wearingPromptLabel:         'Comment porter le vêtement',
    displayModeTitle:           'Type de photo produit',
    displayModeBust:            'Buste',
    displayModeHanger:          'Cintre',
    displayModeFlat:            'À plat',
    generateProductPhotos:      'Générer les photos produit',
    teaserTitle:           'Mannequin IA',
    teaserDesc:            "Générez automatiquement des photos portées avec l'IA",
    badgeAI:               'IA',
    noSlot0Msg:            "Ajoutez d'abord la photo principale",
    noMannequinMsg:        'Sélectionnez un mannequin',
    rendTitle:             '📸 RENDU — PHOTOS TRAITÉES',
    modalClose:            'Fermer',
    modalConfirmBg:        'Utiliser ce fond',
    modalConfirmMannequin: 'Choisir ce style',
    importVintedTitle:     'Importer depuis Vinted',
    importVintedPlaceholder: 'Colle le lien de ton article Vinted…',
    importVintedBtn:       'Importer',
    importVintedLoading:   'Importation en cours…',
    importVintedLocked:    'Disponible avec le plan Pro',
    importVintedSuccess:   (n) => `${n} photo${n > 1 ? 's' : ''} importée${n > 1 ? 's' : ''} depuis Vinted`,
    importVintedErrInvalid: 'Lien Vinted invalide',
    importVintedErrFetch:  "Impossible de récupérer l'article",
    importVintedErrNoPhotos: 'Aucune photo trouvée',
  },
  en: {
    bgPanelTitle:          'Photo background',
    freemiumLockMsg:       'Upgrade to Premium for all backgrounds',
    checkboxHint:          'Click a photo to select it · then process',
    processBtn:            (n) => `Process ${n} selected photo${n > 1 ? 's' : ''}`,
    processing:            'Processing…',
    mannequinTitle:        'AI Model · 2 photos generated',
    mannequinMen:          'Men',
    mannequinWomen:        'Women',
    mannequinGenerate:     'Generate 2 worn photos',
    mannequinGenerating:   'Generating…',
    mannequinLockedMsg:    'Available with Pro plan',
    mannequinCustomPromptLabel: 'Customize the outfit',
    wearingPromptLabel:         'How to wear the garment',
    displayModeTitle:           'Product photo type',
    displayModeBust:            'Bust',
    displayModeHanger:          'Hanger',
    displayModeFlat:            'Flat lay',
    generateProductPhotos:      'Generate product photos',
    teaserTitle:           'AI Model',
    teaserDesc:            'Automatically generate worn photos with AI',
    badgeAI:               'AI',
    noSlot0Msg:            'Add the main photo first',
    noMannequinMsg:        'Select a model',
    rendTitle:             '📸 RENDER — PROCESSED PHOTOS',
    modalClose:            'Close',
    modalConfirmBg:        'Use this background',
    modalConfirmMannequin: 'Choose this style',
    importVintedTitle:     'Import from Vinted',
    importVintedPlaceholder: 'Paste your Vinted listing link…',
    importVintedBtn:       'Import',
    importVintedLoading:   'Importing…',
    importVintedLocked:    'Available with Pro plan',
    importVintedSuccess:   (n) => `${n} photo${n > 1 ? 's' : ''} imported from Vinted`,
    importVintedErrInvalid: 'Invalid Vinted link',
    importVintedErrFetch:  'Unable to fetch the listing',
    importVintedErrNoPhotos: 'No photos found',
  },
  es: {
    bgPanelTitle:          'Fondo de las fotos',
    freemiumLockMsg:       'Pasa al Premium para todos los fondos',
    checkboxHint:          'Haz clic en una foto para seleccionarla · luego procesa',
    processBtn:            (n) => `Procesar ${n} foto${n > 1 ? 's' : ''} seleccionada${n > 1 ? 's' : ''}`,
    processing:            'Procesando…',
    mannequinTitle:        'Maniquí IA · 2 fotos generadas',
    mannequinMen:          'Hombre',
    mannequinWomen:        'Mujer',
    mannequinGenerate:     'Generar 2 fotos vestidas',
    mannequinGenerating:   'Generando…',
    mannequinLockedMsg:    'Disponible con el plan Pro',
    mannequinCustomPromptLabel: 'Personalizar el atuendo',
    wearingPromptLabel:         'Cómo llevar la prenda',
    displayModeTitle:           'Tipo de foto de producto',
    displayModeBust:            'Busto',
    displayModeHanger:          'Percha',
    displayModeFlat:            'Plano',
    generateProductPhotos:      'Generar fotos de producto',
    teaserTitle:           'Maniquí IA',
    teaserDesc:            'Genera automáticamente fotos vestidas con IA',
    badgeAI:               'IA',
    noSlot0Msg:            'Añade primero la foto principal',
    noMannequinMsg:        'Selecciona un maniquí',
    rendTitle:             '📸 RESULTADO — FOTOS PROCESADAS',
    modalClose:            'Cerrar',
    modalConfirmBg:        'Usar este fondo',
    modalConfirmMannequin: 'Elegir este estilo',
    importVintedTitle:     'Importar desde Vinted',
    importVintedPlaceholder: 'Pega el enlace de tu artículo de Vinted…',
    importVintedBtn:       'Importar',
    importVintedLoading:   'Importando…',
    importVintedLocked:    'Disponible con el plan Pro',
    importVintedSuccess:   (n) => `${n} foto${n > 1 ? 's' : ''} importada${n > 1 ? 's' : ''} desde Vinted`,
    importVintedErrInvalid: 'Enlace de Vinted inválido',
    importVintedErrFetch:  'No se puede obtener el artículo',
    importVintedErrNoPhotos: 'No se encontraron fotos',
  },
  de: {
    bgPanelTitle:          'Foto-Hintergrund',
    freemiumLockMsg:       'Upgrade auf Premium für alle Hintergründe',
    checkboxHint:          'Klicke ein Foto an · dann verarbeiten',
    processBtn:            (n) => `${n} Foto${n > 1 ? 's' : ''} verarbeiten`,
    processing:            'Wird verarbeitet…',
    mannequinTitle:        'KI-Modell · 2 generierte Fotos',
    mannequinMen:          'Männer',
    mannequinWomen:        'Frauen',
    mannequinGenerate:     '2 Anzieh-Fotos generieren',
    mannequinGenerating:   'Wird generiert…',
    mannequinLockedMsg:    'Verfügbar mit dem Pro-Plan',
    mannequinCustomPromptLabel: 'Outfit anpassen',
    wearingPromptLabel:         'Wie das Kleidungsstück getragen wird',
    displayModeTitle:           'Produktfoto-Typ',
    displayModeBust:            'Büste',
    displayModeHanger:          'Bügel',
    displayModeFlat:            'Flach',
    generateProductPhotos:      'Produktfotos generieren',
    teaserTitle:           'KI-Modell',
    teaserDesc:            'Erstelle automatisch Anzieh-Fotos mit KI',
    badgeAI:               'KI',
    noSlot0Msg:            'Füge zuerst das Hauptfoto hinzu',
    noMannequinMsg:        'Wähle ein Modell',
    rendTitle:             '📸 VORSCHAU — BEARBEITETE FOTOS',
    modalClose:            'Schließen',
    modalConfirmBg:        'Hintergrund verwenden',
    modalConfirmMannequin: 'Diesen Stil wählen',
    importVintedTitle:     'Von Vinted importieren',
    importVintedPlaceholder: 'Füge den Link deines Vinted-Artikels ein…',
    importVintedBtn:       'Importieren',
    importVintedLoading:   'Wird importiert…',
    importVintedLocked:    'Verfügbar mit dem Pro-Plan',
    importVintedSuccess:   (n) => `${n} Foto${n > 1 ? 's' : ''} von Vinted importiert`,
    importVintedErrInvalid: 'Ungültiger Vinted-Link',
    importVintedErrFetch:  'Artikel konnte nicht abgerufen werden',
    importVintedErrNoPhotos: 'Keine Fotos gefunden',
  },
  it: {
    bgPanelTitle:          'Sfondo delle foto',
    freemiumLockMsg:       'Passa al Premium per tutti gli sfondi',
    checkboxHint:          'Clicca una foto per selezionarla · poi elabora',
    processBtn:            (n) => `Elabora ${n} foto selezionat${n > 1 ? 'e' : 'a'}`,
    processing:            'Elaborazione in corso…',
    mannequinTitle:        'Manichino IA · 2 foto generate',
    mannequinMen:          'Uomo',
    mannequinWomen:        'Donna',
    mannequinGenerate:     'Genera 2 foto indossate',
    mannequinGenerating:   'Generazione in corso…',
    mannequinLockedMsg:    'Disponibile con il piano Pro',
    mannequinCustomPromptLabel: "Personalizza l'outfit",
    wearingPromptLabel:         'Come indossare il capo',
    displayModeTitle:           'Tipo di foto prodotto',
    displayModeBust:            'Busto',
    displayModeHanger:          'Gruccia',
    displayModeFlat:            'Piano',
    generateProductPhotos:      'Genera foto prodotto',
    teaserTitle:           'Manichino IA',
    teaserDesc:            "Genera automaticamente foto indossate con l'IA",
    badgeAI:               'IA',
    noSlot0Msg:            'Aggiungi prima la foto principale',
    noMannequinMsg:        'Seleziona un manichino',
    rendTitle:             '📸 RISULTATO — FOTO ELABORATE',
    modalClose:            'Chiudi',
    modalConfirmBg:        'Usa questo sfondo',
    modalConfirmMannequin: 'Scegli questo stile',
    importVintedTitle:     'Importa da Vinted',
    importVintedPlaceholder: "Incolla il link del tuo articolo Vinted…",
    importVintedBtn:       'Importa',
    importVintedLoading:   'Importazione in corso…',
    importVintedLocked:    'Disponibile con il piano Pro',
    importVintedSuccess:   (n) => `${n} foto importat${n > 1 ? 'e' : 'a'} da Vinted`,
    importVintedErrInvalid: 'Link Vinted non valido',
    importVintedErrFetch:  "Impossibile recuperare l'articolo",
    importVintedErrNoPhotos: 'Nessuna foto trovata',
  },
  nl: {
    bgPanelTitle:          "Achtergrond foto's",
    freemiumLockMsg:       'Upgrade naar Premium voor alle achtergronden',
    checkboxHint:          "Klik op een foto om te selecteren · dan verwerken",
    processBtn:            (n) => `Verwerk ${n} geselecteerde foto${n > 1 ? "'s" : ''}`,
    processing:            'Bezig met verwerken…',
    mannequinTitle:        "AI-model · 2 gegenereerde foto's",
    mannequinMen:          'Man',
    mannequinWomen:        'Vrouw',
    mannequinGenerate:     "2 gedragen foto's genereren",
    mannequinGenerating:   'Bezig met genereren…',
    mannequinLockedMsg:    'Beschikbaar met het Pro-plan',
    mannequinCustomPromptLabel: 'Outfit aanpassen',
    wearingPromptLabel:         'Hoe het kledingstuk te dragen',
    displayModeTitle:           'Type productfoto',
    displayModeBust:            'Buste',
    displayModeHanger:          'Hanger',
    displayModeFlat:            'Plat',
    generateProductPhotos:      "Productfoto's genereren",
    teaserTitle:           'AI-model',
    teaserDesc:            "Genereer automatisch gedragen foto's met AI",
    badgeAI:               'AI',
    noSlot0Msg:            'Voeg eerst de hoofdfoto toe',
    noMannequinMsg:        'Selecteer een model',
    rendTitle:             "📸 WEERGAVE — BEWERKTE FOTO'S",
    modalClose:            'Sluiten',
    modalConfirmBg:        'Gebruik achtergrond',
    modalConfirmMannequin: 'Kies deze stijl',
    importVintedTitle:     'Importeren van Vinted',
    importVintedPlaceholder: 'Plak de link van je Vinted-artikel…',
    importVintedBtn:       'Importeren',
    importVintedLoading:   'Bezig met importeren…',
    importVintedLocked:    'Beschikbaar met het Pro-plan',
    importVintedSuccess:   (n) => `${n} foto${n > 1 ? "'s" : ''} geïmporteerd van Vinted`,
    importVintedErrInvalid: 'Ongeldige Vinted-link',
    importVintedErrFetch:  'Artikel kan niet worden opgehaald',
    importVintedErrNoPhotos: "Geen foto's gevonden",
  },
  pl: {
    bgPanelTitle:          'Tło zdjęć',
    freemiumLockMsg:       'Przejdź na Premium dla wszystkich teł',
    checkboxHint:          'Kliknij zdjęcie aby wybrać · następnie przetwórz',
    processBtn:            (n) => `Przetwórz ${n} wybrane zdjęci${n === 1 ? 'e' : 'a'}`,
    processing:            'Przetwarzanie…',
    mannequinTitle:        'Manekin IA · 2 wygenerowane zdjęcia',
    mannequinMen:          'Mężczyzna',
    mannequinWomen:        'Kobieta',
    mannequinGenerate:     'Generuj 2 zdjęcia noszone',
    mannequinGenerating:   'Generowanie…',
    mannequinLockedMsg:    'Dostępne w planie Pro',
    mannequinCustomPromptLabel: 'Dostosuj strój',
    wearingPromptLabel:         'Jak nosić ubranie',
    displayModeTitle:           'Typ zdjęcia produktu',
    displayModeBust:            'Biust',
    displayModeHanger:          'Wieszak',
    displayModeFlat:            'Na płasko',
    generateProductPhotos:      'Generuj zdjęcia produktu',
    teaserTitle:           'Manekin IA',
    teaserDesc:            'Automatycznie generuj zdjęcia noszone z AI',
    badgeAI:               'AI',
    noSlot0Msg:            'Najpierw dodaj główne zdjęcie',
    noMannequinMsg:        'Wybierz manekin',
    rendTitle:             '📸 PODGLĄD — PRZETWORZONE ZDJĘCIA',
    modalClose:            'Zamknij',
    modalConfirmBg:        'Użyj tego tła',
    modalConfirmMannequin: 'Wybierz ten styl',
    importVintedTitle:     'Importuj z Vinted',
    importVintedPlaceholder: 'Wklej link do swojego ogłoszenia na Vinted…',
    importVintedBtn:       'Importuj',
    importVintedLoading:   'Importowanie…',
    importVintedLocked:    'Dostępne w planie Pro',
    importVintedSuccess:   (n) => `${n} zdjęci${n === 1 ? 'e' : 'a'} zaimportowane z Vinted`,
    importVintedErrInvalid: 'Nieprawidłowy link Vinted',
    importVintedErrFetch:  'Nie można pobrać ogłoszenia',
    importVintedErrNoPhotos: 'Nie znaleziono zdjęć',
  },
}

/* ─── Mannequins — 20 hommes + 20 femmes ─────────────────────────────────── */

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

/* ─── Resize image to max dimension (storage + classification) ───────────── */

async function resizeImage(file: File | Blob, maxPx = 1024): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      const scale = Math.min(1, maxPx / Math.max(img.naturalWidth, img.naturalHeight))
      const w     = Math.round(img.naturalWidth  * scale)
      const h     = Math.round(img.naturalHeight * scale)
      const canvas = document.createElement('canvas')
      canvas.width  = w
      canvas.height = h
      canvas.getContext('2d')!.drawImage(img, 0, 0, w, h)
      canvas.toBlob(
        blob => blob ? resolve(blob) : reject(new Error('toBlob failed')),
        'image/jpeg', 0.85,
      )
    }
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('img load failed')) }
    img.src = url
  })
}

/* ─── Définition des 15 slots ─────────────────────────────────────────────── */

const SLOT_DEFS = [
  { id: 0,  label: 'Photo recto — à plat ou sur cintre',        badge: 'required',    type: 'garment', bgRemoval: 'free' },
  { id: 1,  label: 'Photo verso',                                badge: 'recommended', type: 'garment', bgRemoval: 'pro'  },
  { id: 2,  label: 'Autre vue non portée',                       badge: 'recommended', type: 'garment', bgRemoval: 'pro'  },
  { id: 3,  label: 'Étiquette marque',                           badge: 'recommended', type: 'label',   bgRemoval: 'none' },
  { id: 4,  label: 'Étiquette taille',                           badge: 'recommended', type: 'label',   bgRemoval: 'none' },
  { id: 5,  label: 'Étiquette compo.',                           badge: 'recommended', type: 'label',   bgRemoval: 'none' },
  { id: 6,  label: 'Autre photo (détail, défaut, emballage...)', badge: 'optional',    type: 'detail',  bgRemoval: 'none' },
  { id: 7,  label: 'Autre photo (détail, défaut, emballage...)', badge: 'optional',    type: 'detail',  bgRemoval: 'none' },
  { id: 8,  label: 'Autre photo (détail, défaut, emballage...)', badge: 'optional',    type: 'detail',  bgRemoval: 'none' },
  { id: 9,  label: 'Vue portée 1',                               badge: 'recommended', type: 'garment', bgRemoval: 'pro'  },
  { id: 10, label: 'Vue portée 2',                               badge: 'recommended', type: 'garment', bgRemoval: 'pro'  },
  { id: 11, label: 'Vue portée 3',                               badge: 'recommended', type: 'garment', bgRemoval: 'pro'  },
  { id: 12, label: 'Vue portée 4',                               badge: 'optional',    type: 'garment', bgRemoval: 'pro'  },
  { id: 13, label: 'Vue portée 5',                               badge: 'optional',    type: 'garment', bgRemoval: 'pro'  },
  { id: 14, label: 'Vue portée 6',                               badge: 'optional',    type: 'garment', bgRemoval: 'pro'  },
] as const

type SlotDef = (typeof SLOT_DEFS)[number]

/* ─── Classification résultat API ────────────────────────────────────────── */

interface ClassifyResult {
  fileIndex: number
  type: 'flat' | 'worn' | 'detail'
  detailSlot: number
}

function assignSlots(
  classifications: ClassifyResult[],
  taken: Set<number>,
): Array<{ fileIndex: number; slot: number | null }> {
  const local = new Set(taken)

  const tryPool = (pool: number[]): number | null => {
    const s = pool.find(s => !local.has(s))
    if (s !== undefined) { local.add(s); return s }
    return null
  }

  return classifications.map(({ fileIndex, type, detailSlot }) => {
    let slot: number | null = null

    if (type === 'flat') {
      slot = tryPool([0, 1, 2]) ?? tryPool([6, 7, 8])
    } else if (type === 'worn') {
      slot = tryPool([9, 10, 11, 12, 13, 14]) ?? tryPool([6, 7, 8])
    } else {
      if (detailSlot >= 3 && detailSlot <= 8 && !local.has(detailSlot)) {
        local.add(detailSlot)
        slot = detailSlot
      } else {
        slot = tryPool([6, 7, 8])
      }
    }

    return { fileIndex, slot }
  })
}

/* ─── Traductions UI reconnaissance — 7 langues ──────────────────────────── */

const UI_I18N: Record<Lang, {
  high: string; medium: string; low: string; manual: string
  analyzing: string; analyzingSub: string
  analysisFailed: string; retry: string; analysisError: string
  autoRecognition: string; autoRecognitionSub: string; rerun: string
  confidence: string; confidenceLegend: string
  sectionArticle: string; sectionChars: string; sectionFlaws: string; sectionExtra: string
  brand: string; gender: string; category: string; subCategory: string
  size: string; condition: string; colors: string; materials: string
  style: string; pattern: string; flaws: string; retailPrice: string
  defectDetected: string
  generalInfo: string; dimensions: string
  summary: string
  choose: string
  subcategoryHint: string
  addToDesc: string; addMeasure: string; other: string
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
    confidence: 'Confiance :', confidenceLegend: 'Élevée = reconnu avec certitude · Moyenne = à vérifier · Incertaine = à corriger manuellement',
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
    confidence: 'Confidence:', confidenceLegend: 'High = detected with certainty · Medium = check it · Uncertain = correct manually',
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
    confidence: 'Confianza:', confidenceLegend: 'Alta = detectado con certeza · Media = verificar · Incierta = corregir manualmente',
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
    confidence: 'Konfidenz:', confidenceLegend: 'Hoch = sicher erkannt · Mittel = prüfen · Unsicher = manuell korrigieren',
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
    confidence: 'Affidabilità:', confidenceLegend: 'Alta = rilevato con certezza · Media = da verificare · Incerta = correggere manualmente',
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
    confidence: 'Betrouwbaarheid:', confidenceLegend: 'Hoog = zeker herkend · Gemiddeld = controleren · Onzeker = handmatig corrigeren',
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
    confidence: 'Pewność:', confidenceLegend: 'Wysoka = wykryte z pewnością · Średnia = sprawdź · Niepewna = popraw ręcznie',
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
    { fr: 'Tour de poitrine', en: 'Chest' }, { fr: 'Longueur', en: 'Length' },
    { fr: 'Épaules', en: 'Shoulders' }, { fr: 'Tour de taille', en: 'Waist' },
    { fr: 'Tour de hanches', en: 'Hips' }, { fr: 'Entrejambe', en: 'Inseam' },
    { fr: 'Pointure', en: 'Shoe size' }, { fr: 'Largeur', en: 'Width' },
    { fr: 'Hauteur', en: 'Height' }, { fr: 'Profondeur', en: 'Depth' },
  ],
  en: [
    { fr: 'Chest', en: 'Chest' }, { fr: 'Length', en: 'Length' },
    { fr: 'Shoulders', en: 'Shoulders' }, { fr: 'Waist', en: 'Waist' },
    { fr: 'Hips', en: 'Hips' }, { fr: 'Inseam', en: 'Inseam' },
    { fr: 'Shoe size', en: 'Shoe size' }, { fr: 'Width', en: 'Width' },
    { fr: 'Height', en: 'Height' }, { fr: 'Depth', en: 'Depth' },
  ],
  es: [
    { fr: 'Pecho', en: 'Chest' }, { fr: 'Longitud', en: 'Length' },
    { fr: 'Hombros', en: 'Shoulders' }, { fr: 'Cintura', en: 'Waist' },
    { fr: 'Caderas', en: 'Hips' }, { fr: 'Entrepierna', en: 'Inseam' },
    { fr: 'Número', en: 'Shoe size' }, { fr: 'Anchura', en: 'Width' },
    { fr: 'Altura', en: 'Height' }, { fr: 'Profundidad', en: 'Depth' },
  ],
  de: [
    { fr: 'Brustumfang', en: 'Chest' }, { fr: 'Länge', en: 'Length' },
    { fr: 'Schultern', en: 'Shoulders' }, { fr: 'Taillenumfang', en: 'Waist' },
    { fr: 'Hüftumfang', en: 'Hips' }, { fr: 'Schrittlänge', en: 'Inseam' },
    { fr: 'Schuhgröße', en: 'Shoe size' }, { fr: 'Breite', en: 'Width' },
    { fr: 'Höhe', en: 'Height' }, { fr: 'Tiefe', en: 'Depth' },
  ],
  it: [
    { fr: 'Petto', en: 'Chest' }, { fr: 'Lunghezza', en: 'Length' },
    { fr: 'Spalle', en: 'Shoulders' }, { fr: 'Vita', en: 'Waist' },
    { fr: 'Fianchi', en: 'Hips' }, { fr: 'Cavallo', en: 'Inseam' },
    { fr: 'Numero scarpa', en: 'Shoe size' }, { fr: 'Larghezza', en: 'Width' },
    { fr: 'Altezza', en: 'Height' }, { fr: 'Profondità', en: 'Depth' },
  ],
  nl: [
    { fr: 'Borstomtrek', en: 'Chest' }, { fr: 'Lengte', en: 'Length' },
    { fr: 'Schouders', en: 'Shoulders' }, { fr: 'Tailleomtrek', en: 'Waist' },
    { fr: 'Heupomtrek', en: 'Hips' }, { fr: 'Beenlengte', en: 'Inseam' },
    { fr: 'Schoenmaat', en: 'Shoe size' }, { fr: 'Breedte', en: 'Width' },
    { fr: 'Hoogte', en: 'Height' }, { fr: 'Diepte', en: 'Depth' },
  ],
  pl: [
    { fr: 'Obwód klatki piersiowej', en: 'Chest' }, { fr: 'Długość', en: 'Length' },
    { fr: 'Ramiona', en: 'Shoulders' }, { fr: 'Obwód talii', en: 'Waist' },
    { fr: 'Obwód bioder', en: 'Hips' }, { fr: 'Długość kroku', en: 'Inseam' },
    { fr: 'Rozmiar buta', en: 'Shoe size' }, { fr: 'Szerokość', en: 'Width' },
    { fr: 'Wysokość', en: 'Height' }, { fr: 'Głębokość', en: 'Depth' },
  ],
}

const SYSTEM_LABELS_I18N: Record<Lang, Record<string, string>> = {
  fr: { letters: 'Lettres', eu_femme: 'EU femme', eu_homme: 'EU homme', jeans: 'Jeans', pointures: 'Pointures', enfant_age: 'Âge', enfant_cm: 'cm', one_size: 'Taille unique', none: 'Sans taille' },
  en: { letters: 'Letters', eu_femme: 'EU women', eu_homme: 'EU men',   jeans: 'Jeans', pointures: 'Shoe sizes', enfant_age: 'Age', enfant_cm: 'cm', one_size: 'One size',     none: 'No size'    },
  es: { letters: 'Letras',  eu_femme: 'EU mujer', eu_homme: 'EU hombre',jeans: 'Jeans', pointures: 'Tallas zapato', enfant_age: 'Edad', enfant_cm: 'cm', one_size: 'Talla única', none: 'Sin talla' },
  de: { letters: 'Buchstaben', eu_femme: 'EU Damen', eu_homme: 'EU Herren', jeans: 'Jeans', pointures: 'Schuhgrößen', enfant_age: 'Alter', enfant_cm: 'cm', one_size: 'Einheitsgröße', none: 'Ohne Größe' },
  it: { letters: 'Lettere', eu_femme: 'EU donna', eu_homme: 'EU uomo',  jeans: 'Jeans', pointures: 'Taglie scarpe', enfant_age: 'Età', enfant_cm: 'cm', one_size: 'Taglia unica', none: 'Senza taglia' },
  nl: { letters: 'Letters', eu_femme: 'EU dames',  eu_homme: 'EU heren', jeans: 'Jeans', pointures: 'Schoenmaten', enfant_age: 'Leeftijd', enfant_cm: 'cm', one_size: 'One size', none: 'Geen maat' },
  pl: { letters: 'Litery',  eu_femme: 'EU damskie',eu_homme: 'EU męskie',jeans: 'Jeans', pointures: 'Rozmiary butów', enfant_age: 'Wiek', enfant_cm: 'cm', one_size: 'Jeden rozmiar', none: 'Bez rozmiaru' },
}

const DIM_PRESETS_FR = [
  'Tour de poitrine', 'Longueur', 'Épaules', 'Tour de taille',
  'Tour de hanches', 'Entrejambe', 'Pointure', 'Largeur', 'Hauteur', 'Profondeur',
]

const DIM_PRESETS_EN = [
  'Chest', 'Length', 'Shoulders', 'Waist',
  'Hips', 'Inseam', 'Shoe size', 'Width', 'Height', 'Depth',
]

const EXTRA_INFO_PRESETS = EXTRA_INFO_PRESETS_I18N.fr

const SYSTEM_LABELS: Record<string, string> = {
  letters: 'Lettres', eu_femme: 'EU femme', eu_homme: 'EU homme', jeans: 'Jeans',
  pointures: 'Pointures', enfant_age: 'Âge', enfant_cm: 'cm', one_size: 'Taille unique', none: 'Sans taille',
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
    ...(result.brand_segment ? { brand_segment: result.brand_segment } : {}),
  }
}

/* ─── Hook appel API reconnaissance ─────────────────────────────────────── */

function useRecognition(
  slots: PhotoSlot[],
  result: RecognitionResult | null,
  setResult: (r: RecognitionResult) => void,
  canAutoRun: boolean,
) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const ranRef = useRef(false)
  const { lang } = useLang()

  const run = useCallback(async () => {
    const targets = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const filled = targets.map(i => slots[i]).filter(s => s.file !== null)

    if (filled.length === 0) {
      setError("Aucune photo disponible pour l'analyse.")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const images = await Promise.all(
        filled.map(async (slot) => {
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
      setResult(normalizeConfidence(data))
    } catch {
      setError("L'analyse a échoué. Vérifiez votre connexion et réessayez.")
    } finally {
      setLoading(false)
    }
  }, [slots, setResult, lang])

  useEffect(() => {
    if (canAutoRun && !ranRef.current && !result) {
      ranRef.current = true
      run()
    }
  }, [canAutoRun, run, result])

  return { loading, error, retry: run }
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
    high:   { label: l.high,   className: 'bg-green-50 text-green-700 border-green-200',    Icon: CheckCircle2  },
    medium: { label: l.medium, className: 'bg-orange-50 text-orange-700 border-orange-200', Icon: AlertCircle   },
    low:    { label: l.low,    className: 'bg-red-50 text-red-700 border-red-200',           Icon: XCircle       },
    manual: { label: l.manual, className: 'bg-gray-50 text-gray-500 border-gray-200',        Icon: Pencil        },
  }
  const { label, className, Icon } = map[confidence]
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-md border ${className}`}>
      <Icon className="w-2.5 h-2.5" />
      {label}
    </span>
  )
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

/* ─── Props ───────────────────────────────────────────────────────────────── */

interface Props {
  slots: PhotoSlot[]
  setSlots: React.Dispatch<React.SetStateAction<PhotoSlot[]>>
  result: RecognitionResult | null
  setResult: (r: RecognitionResult | null) => void
  plan: Plan
}

/* ─── Composant principal ─────────────────────────────────────────────────── */

export default function PhotoUploadStep({ slots, setSlots, result, setResult, plan }: Props) {
  const { lang } = useLang()

  const [dragOverId, setDragOverId]               = useState<number | null>(null)
  const [isClassifying, setIsClassifying]         = useState(false)
  const [classifiedCount, setClassifiedCount]     = useState<number | null>(null)
  const [overflowCount, setOverflowCount]         = useState(0)
  const [globalDragOver, setGlobalDragOver]       = useState(false)
  /* Pro — import URL Vinted */
  const [vintedUrl, setVintedUrl]         = useState('')
  const [isImporting, setIsImporting]     = useState(false)
  const [importError, setImportError]     = useState<string | null>(null)
  const [importSuccess, setImportSuccess] = useState<string | null>(null)

  const dragSourceId = useRef<number | null>(null)
  const slotsRef     = useRef<PhotoSlot[]>(slots)
  useEffect(() => { slotsRef.current = slots }, [slots])

  /* ── Helpers i18n ── */
  const planI18n      = PLAN_I18N[lang]      ?? PLAN_I18N.fr
  const sectionTitles = SECTION_TITLES[lang] ?? SECTION_TITLES.fr
  const dropI18n      = DROP_I18N[lang]      ?? DROP_I18N.fr
  const badgeI18n     = BADGE_I18N[lang]     ?? BADGE_I18N.fr
  const loadingI18n   = LOADING_I18N[lang]   ?? LOADING_I18N.fr
  const ui            = UI_I18N[lang]        ?? UI_I18N.fr
  const dimPresets    = DIM_PRESETS_I18N[lang] ?? DIM_PRESETS_I18N.fr
  const extraPresets  = EXTRA_INFO_PRESETS_I18N[lang] ?? EXTRA_INFO_PRESETS_I18N.fr

  /* ── Reconnaissance automatique ── */
  const mainPhotoReady = (slots[0]?.file !== null)
    && slots[0]?.status !== 'uploading'
    && slots[0]?.status !== 'processing-bg'
  const { loading: recogLoading, error: recogError, retry: recogRetry } = useRecognition(
    slots, result, r => setResult(r), mainPhotoReady,
  )

  /* ── Taxonomy: parse du chemin Vinted ── */
  const parsed    = result ? parseVintedPath(result.vintedPath.value) : null
  const n1        = parsed?.n1 ?? ''
  const n2        = parsed?.n2 ?? ''
  const n3        = parsed?.n3 ?? ''
  const n4        = parsed?.n4 ?? ''
  const n5        = parsed?.n5 ?? ''
  const n2Options = n1 ? getN2List(n1) : []
  const n3Options = n2 ? getN3List(n1, n2) : []
  const n4Options = n3 ? getN4List(n1, n2, n3) : []
  const n5Options = n4 ? getN5List(n1, n2, n3, n4) : []
  const tailleSizes: string[] = useMemo(() => {
    if (!result) return []
    const sys = result.tailleSysteme.value[0] as SizeSystem | undefined
    if (!sys) return []
    return SIZES[sys] ?? []
  }, [result])

  /* ── États formulaire infos complémentaires + dimensions ── */
  const [openExtraFields,  setOpenExtraFields]  = useState<string[]>([])
  const [extraFieldInputs, setExtraFieldInputs] = useState<Record<string, string>>({})
  const [customExtraRows,  setCustomExtraRows]  = useState<{ id: number; nom: string; value: string }[]>([])
  const [prixNeuf,         setPrixNeuf]         = useState('')
  const [openDimFields,    setOpenDimFields]    = useState<string[]>([])
  const [dimInputs,        setDimInputs]        = useState<Record<string, string>>({})
  const [customDimRows,    setCustomDimRows]    = useState<{ id: number; nom: string; valeur: string }[]>([])

  /* ── update : modifie un champ RecognitionResult (confidence → 'manual') ── */
  const update = useCallback((field: keyof RecognitionResult, value: string | string[]) => {
    if (!result) return
    setResult({ ...result, [field]: { value, confidence: 'manual' as const } })
  }, [result, setResult])

  /* ── Infos complémentaires — présets ── */
  const validateMissingInfo = useCallback((label: string) => {
    const value = (extraFieldInputs[label] ?? '').trim()
    if (!value || !result) return
    const existing = result.extraInfo?.missingInfos ?? []
    setResult({
      ...result,
      extraInfo: {
        ...(result.extraInfo ?? { missingInfos: [], dimensions: [] }),
        missingInfos: [...existing.filter(i => i.label !== label), { label, value }],
      },
    })
    setExtraFieldInputs(prev => { const n = { ...prev }; delete n[label]; return n })
    setOpenExtraFields(prev => prev.filter(f => f !== label))
  }, [extraFieldInputs, result, setResult])

  const removeValidatedInfo = useCallback((label: string) => {
    if (!result) return
    setResult({
      ...result,
      extraInfo: {
        ...(result.extraInfo ?? { missingInfos: [], dimensions: [] }),
        missingInfos: (result.extraInfo?.missingInfos ?? []).filter(i => i.label !== label),
      },
    })
  }, [result, setResult])

  const addCustomExtraRow = useCallback(() => {
    setCustomExtraRows(prev => [...prev, { id: Date.now(), nom: '', value: '' }])
  }, [])

  const validateCustomExtraRow = useCallback((id: number) => {
    const row = customExtraRows.find(r => r.id === id)
    if (!row || !row.nom.trim() || !row.value.trim() || !result) return
    const existing = result.extraInfo?.missingInfos ?? []
    setResult({
      ...result,
      extraInfo: {
        ...(result.extraInfo ?? { missingInfos: [], dimensions: [] }),
        missingInfos: [...existing.filter(i => i.label !== row.nom), { label: row.nom, value: row.value }],
      },
    })
    setCustomExtraRows(prev => prev.filter(r => r.id !== id))
  }, [customExtraRows, result, setResult])

  const removeCustomExtraRow = useCallback((id: number) => {
    setCustomExtraRows(prev => prev.filter(r => r.id !== id))
  }, [])

  /* ── Dimensions ── */
  const validateDimension = useCallback((nom: string, nomEN: string) => {
    const valeur = (dimInputs[nom] ?? '').trim()
    if (!valeur || !result) return
    const existing = result.extraInfo?.dimensions ?? []
    setResult({
      ...result,
      extraInfo: {
        ...(result.extraInfo ?? { missingInfos: [], dimensions: [] }),
        dimensions: [...existing.filter(d => d.nom !== nom), { nom, nomEN, valeur }],
      },
    })
    setDimInputs(prev => { const n = { ...prev }; delete n[nom]; return n })
    setOpenDimFields(prev => prev.filter(f => f !== nom))
  }, [dimInputs, result, setResult])

  const removeValidatedDim = useCallback((nom: string) => {
    if (!result) return
    setResult({
      ...result,
      extraInfo: {
        ...(result.extraInfo ?? { missingInfos: [], dimensions: [] }),
        dimensions: (result.extraInfo?.dimensions ?? []).filter(d => d.nom !== nom),
      },
    })
  }, [result, setResult])

  const addCustomDimRow = useCallback(() => {
    setCustomDimRows(prev => [...prev, { id: Date.now(), nom: '', valeur: '' }])
  }, [])

  const validateCustomDimRow = useCallback((id: number) => {
    const row = customDimRows.find(r => r.id === id)
    if (!row || !row.nom.trim() || !row.valeur.trim() || !result) return
    const existing = result.extraInfo?.dimensions ?? []
    setResult({
      ...result,
      extraInfo: {
        ...(result.extraInfo ?? { missingInfos: [], dimensions: [] }),
        dimensions: [...existing.filter(d => d.nom !== row.nom), { nom: row.nom, nomEN: row.nom, valeur: row.valeur }],
      },
    })
    setCustomDimRows(prev => prev.filter(r => r.id !== id))
  }, [customDimRows, result, setResult])

  const removeCustomDimRow = useCallback((id: number) => {
    setCustomDimRows(prev => prev.filter(r => r.id !== id))
  }, [])

  const validatePrixNeuf = useCallback(() => {
    const v = parseFloat(prixNeuf)
    if (!v || !result) return
    setResult({
      ...result,
      extraInfo: {
        ...(result.extraInfo ?? { missingInfos: [], dimensions: [] }),
        prixAchatNeuf: v,
      },
    })
  }, [prixNeuf, result, setResult])

  const filledCount   = slots.filter(s => s.file !== null || (s.preview !== null && s.status !== 'empty')).length

  /* ── Met à jour un seul slot ── */
  const updateSlot = useCallback(
    (id: number, patch: Partial<PhotoSlot>) =>
      setSlots(prev => prev.map(s => s.id === id ? { ...s, ...patch } : s)),
    [setSlots],
  )

  /* ── Charge un fichier dans un slot (plan-aware) ── */
  const loadFileInSlot = useCallback(
    async (originalFile: File, slotId: number, skipBgRemoval = false) => {
      /* Resize to max 1024 px before storing — prevents heavy files from breaking bg removal */
      let file: File = originalFile
      try {
        const resized = await resizeImage(originalFile, 1024)
        file = new File([resized], originalFile.name, { type: 'image/jpeg' })
      } catch { /* keep original if canvas unavailable */ }

      const preview = URL.createObjectURL(file)
      updateSlot(slotId, { file, preview, status: 'uploading', processedUrl: null, compositedUrl: undefined, error: undefined, isAiGenerated: undefined })
      await new Promise(r => setTimeout(r, 200))

      const def = SLOT_DEFS[slotId as keyof typeof SLOT_DEFS] ?? SLOT_DEFS[0]
      /* Auto-suppression fond uniquement pour freemium + slot 0 + upload individuel */
      const shouldAutoRemove = plan === 'freemium' && (def as typeof SLOT_DEFS[0]).bgRemoval === 'free' && !skipBgRemoval

      if (shouldAutoRemove) {
        updateSlot(slotId, { status: 'processing-bg' })
        try {
          const { removeBackground } = await import('@imgly/background-removal')
          const blob = new Blob([await file.arrayBuffer()], { type: file.type || 'image/jpeg' })
          const resultBlob = await removeBackground(blob)
          updateSlot(slotId, { status: 'done', processedUrl: URL.createObjectURL(resultBlob) })
        } catch (err) {
          console.error('Background removal failed:', err)
          updateSlot(slotId, { status: 'done', processedUrl: null, error: 'bg_failed' })
        }
      } else {
        updateSlot(slotId, { status: 'done' })
      }
    },
    [updateSlot, plan],
  )

  /* ── Upload multiple → classify → slots ── */
  const handleMultipleFiles = useCallback(
    async (files: File[]) => {
      if (!files.length) return
      setClassifiedCount(null)
      setOverflowCount(0)

      if (files.length === 1) {
        const firstEmpty = SLOT_DEFS.find(d => !slotsRef.current[d.id]?.file)
        if (firstEmpty) loadFileInSlot(files[0], firstEmpty.id)
        return
      }

      setIsClassifying(true)
      try {
        /* Resize all to 800 px then send in one batch (server now uses a single Claude call) */
        const resizedBlobs = await Promise.all(
          files.map(async (f, i) => {
            try {
              const b = await resizeImage(f, 800)
              console.log(`[classify] file ${i}: ${f.name} → ${(b.size / 1024).toFixed(0)} KB`)
              return b
            } catch { return f }
          })
        )
        const fd = new FormData()
        resizedBlobs.forEach((blob, i) => fd.append('files', blob, `photo_${i}.jpg`))

        const res = await fetch('/api/classify-photos', { method: 'POST', body: fd })
        const rawResults: ClassifyResult[] = res.ok
          ? ((await res.json()) as { results: ClassifyResult[] }).results
          : files.map((_, i) => ({ fileIndex: i, type: 'flat' as const, detailSlot: 6 }))

        const taken = new Set<number>(
          slotsRef.current.map((s, i) => (s.file ? i : -1)).filter(i => i >= 0),
        )
        const assignments = assignSlots(rawResults, taken)
        let ignored = 0

        for (const { fileIndex, slot } of assignments) {
          if (fileIndex >= files.length) continue
          if (slot === null) { ignored++; continue }
          loadFileInSlot(files[fileIndex], slot, true)
        }

        setClassifiedCount(assignments.filter(a => a.slot !== null).length)
        if (ignored > 0) setOverflowCount(ignored)
      } catch (err) {
        console.error('[classify] handleMultipleFiles error:', err)
        const empty = SLOT_DEFS.filter(d => !slotsRef.current[d.id]?.file).map(d => d.id)
        const batch = files.slice(0, empty.length)
        batch.forEach((f, i) => loadFileInSlot(f, empty[i], true))
        setClassifiedCount(batch.length)
        if (files.length > empty.length) setOverflowCount(files.length - empty.length)
      }

      setIsClassifying(false)
    },
    [loadFileInSlot, plan],
  )

  /* ── Import depuis URL Vinted (Pro) ── */
  const handleImportFromVinted = useCallback(async () => {
    if (!vintedUrl.trim() || isImporting) return
    setIsImporting(true)
    setImportError(null)
    setImportSuccess(null)

    try {
      /* 1 — Fetch listing + téléchargement images côté serveur → base64 */
      const importRes = await fetch('/api/import-vinted', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ url: vintedUrl.trim() }),
      })
      const importData = await importRes.json() as { photos?: string[]; error?: string }

      if (!importRes.ok || !importData.photos?.length) {
        const err = importData.error ?? 'no_photos'
        const t = PLAN_I18N[lang] ?? PLAN_I18N.fr
        setImportError(
          err === 'invalid_url' ? t.importVintedErrInvalid :
          err === 'no_photos'   ? t.importVintedErrNoPhotos :
          t.importVintedErrFetch,
        )
        return
      }

      /* 2 — Convertit chaque data URL base64 en File (pas de fetch externe côté navigateur) */
      const files: File[] = []
      for (let i = 0; i < importData.photos.length; i++) {
        try {
          const res  = await fetch(importData.photos[i])
          const blob = await res.blob()
          files.push(new File([blob], `vinted-${i + 1}.jpg`, { type: blob.type || 'image/webp' }))
        } catch { /* skip */ }
      }

      if (files.length === 0) {
        setImportError((PLAN_I18N[lang] ?? PLAN_I18N.fr).importVintedErrNoPhotos)
        return
      }

      setImportSuccess((PLAN_I18N[lang] ?? PLAN_I18N.fr).importVintedSuccess(files.length))
      setVintedUrl('')
      handleMultipleFiles(files)
    } catch (err) {
      console.error('[import-vinted] error:', err)
      setImportError((PLAN_I18N[lang] ?? PLAN_I18N.fr).importVintedErrFetch)
    } finally {
      setIsImporting(false)
    }
  }, [vintedUrl, isImporting, lang, handleMultipleFiles])

  /* ── Swap ── */
  const swapSlots = useCallback(
    (sourceId: number, targetId: number) => {
      if (sourceId === targetId) return
      setSlots(prev => {
        const next = [...prev]
        next[sourceId] = { ...prev[targetId], id: sourceId }
        next[targetId] = { ...prev[sourceId], id: targetId }
        return next
      })
    },
    [setSlots],
  )

  const clearSlot = useCallback(
    (slotId: number) => {
      setSlots(prev =>
        prev.map(s =>
          s.id === slotId
            ? { ...s, file: null, preview: null, processedUrl: null, status: 'empty', error: undefined, isAiGenerated: undefined }
            : s,
        ),
      )
    },
    [setSlots],
  )

  const handleGlobalDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setGlobalDragOver(false)
      if (e.dataTransfer.getData('slotId')) return
      const images = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'))
      if (images.length) handleMultipleFiles(images)
    },
    [handleMultipleFiles],
  )

  return (
    <div className="space-y-3">

      {/* ── En-tête ── */}
      <div>
        <h2 className="font-display font-extrabold text-2xl text-gray-900 mb-1">
          {dropI18n.title}
        </h2>
        <p className="text-sm text-gray-500">{dropI18n.subtitle}</p>
      </div>

      {/* ── Import URL Vinted ── */}
      <div className={`rounded-2xl border p-4 space-y-3 ${plan === 'pro' ? 'bg-emerald-50 border-emerald-100' : 'bg-gray-50 border-gray-100 opacity-70'}`}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
            <Link className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <p className="font-display font-extrabold text-sm text-emerald-900">{planI18n.importVintedTitle}</p>
          {plan !== 'pro' && (
            <span className="text-[9px] font-bold bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-full uppercase tracking-wide ml-1">Pro</span>
          )}
        </div>

        {plan !== 'pro' ? (
          <p className="text-xs text-gray-400 flex items-center gap-1.5">
            <Lock className="w-3 h-3 shrink-0" />
            {planI18n.importVintedLocked}
          </p>
        ) : (
          <>
            <div className="flex gap-2">
              <input
                type="url"
                value={vintedUrl}
                onChange={e => { setVintedUrl(e.target.value); setImportError(null); setImportSuccess(null) }}
                onKeyDown={e => e.key === 'Enter' && handleImportFromVinted()}
                placeholder={planI18n.importVintedPlaceholder}
                disabled={isImporting}
                className="flex-1 text-sm rounded-xl border border-emerald-200 bg-white px-3 py-2.5 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 disabled:opacity-50"
              />
              <button
                onClick={handleImportFromVinted}
                disabled={isImporting || !vintedUrl.trim()}
                className={`shrink-0 flex items-center gap-1.5 font-semibold text-sm px-4 py-2.5 rounded-xl transition-all ${
                  isImporting || !vintedUrl.trim()
                    ? 'bg-emerald-100 text-emerald-400 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-[0.98]'
                }`}
              >
                {isImporting ? (
                  <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                {isImporting ? planI18n.importVintedLoading : planI18n.importVintedBtn}
              </button>
            </div>

            {importError && (
              <div className="flex items-center gap-2 text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span className="font-semibold">{importError}</span>
                <button onClick={() => setImportError(null)} className="ml-auto text-red-400 hover:text-red-600">
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            {importSuccess && (
              <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span className="font-semibold">{importSuccess}</span>
                <button onClick={() => setImportSuccess(null)} className="ml-auto text-emerald-400 hover:text-emerald-600">
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Zone d'import multiple ── */}
      <div
        onDragOver={(e) => { e.preventDefault(); if (!dragSourceId.current) setGlobalDragOver(true) }}
        onDragLeave={() => setGlobalDragOver(false)}
        onDrop={handleGlobalDrop}
        className={`relative rounded-2xl border-2 border-dashed transition-all p-5 text-center ${
          globalDragOver || isClassifying
            ? 'border-indigo-400 bg-indigo-50'
            : 'border-gray-200 bg-gray-50 hover:border-gray-300'
        }`}
      >
        {isClassifying ? (
          <div className="flex flex-col items-center gap-2.5 py-1">
            <div className="w-7 h-7 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-semibold text-indigo-600">{dropI18n.classifying}</p>
            <p className="text-xs text-gray-400">{dropI18n.classifyingSub}</p>
          </div>
        ) : globalDragOver ? (
          <div className="flex flex-col items-center gap-2 py-1">
            <Sparkles className="w-7 h-7 text-indigo-500" />
            <p className="text-sm font-semibold text-indigo-600">{dropI18n.dropHere}</p>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <label className="cursor-pointer">
              <input
                type="file" accept="image/*" multiple className="hidden"
                onChange={(e) =>
                  e.target.files && handleMultipleFiles(Array.from(e.target.files).filter(f => f.type.startsWith('image/')))
                }
              />
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-5 py-2.5 hover:border-indigo-300 hover:shadow-sm transition-all text-sm font-semibold text-gray-700 select-none">
                <Upload className="w-4 h-4" />
                {dropI18n.importBtn}
              </div>
            </label>
            <p className="text-xs text-gray-400">{dropI18n.importHint}</p>
          </div>
        )}
      </div>

      {/* Badge classification */}
      {classifiedCount !== null && !isClassifying && (
        <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5 w-fit">
          <Check className="w-3.5 h-3.5 shrink-0" />
          <span className="font-semibold">{dropI18n.classified(classifiedCount)}</span>
          <button onClick={() => setClassifiedCount(null)} className="ml-1 text-green-500 hover:text-green-700">
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Badge overflow */}
      {overflowCount > 0 && !isClassifying && (
        <div className="flex items-center gap-2 text-xs text-orange-700 bg-orange-50 border border-orange-200 rounded-xl px-4 py-2.5">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span className="font-semibold">
            {dropI18n.overflow(classifiedCount ?? 15, overflowCount)}
          </span>
          <button onClick={() => setOverflowCount(0)} className="ml-1 text-orange-400 hover:text-orange-700">
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* ══ Zones photos ════════════════════════════════════════════════════ */}
      <div className="space-y-3">

        {/* SECTION 1 — Photos non portées (slots 0–8) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-[10px] font-bold text-gray-400 tracking-widest">{sectionTitles.s1}</p>
            {filledCount > 0 && <p className="text-xs text-gray-400 font-medium">{filledCount}/15</p>}
          </div>
          <div className="grid grid-cols-3 gap-2 mb-2">
            {SLOT_DEFS.slice(0, 3).map(def => (
              <SlotCard
                key={def.id}
                def={def}
                slot={slots[def.id]}
                isDragOver={dragOverId === def.id}
                dragSourceId={dragSourceId}
                displayLabel={SLOT_LABELS[lang]?.[def.id] ?? def.label}
                badgeLabels={badgeI18n}
                loadingLabels={loadingI18n}
                onFileSelected={file => loadFileInSlot(file, def.id)}
                onSwap={swapSlots}
                onClear={() => clearSlot(def.id)}
                onDragOverChange={over => setDragOverId(over ? def.id : null)}
              />
            ))}
          </div>
          <div className="grid grid-cols-6 gap-2">
            {SLOT_DEFS.slice(3, 9).map(def => (
              <SlotCard
                key={def.id}
                def={def}
                slot={slots[def.id]}
                isDragOver={dragOverId === def.id}
                dragSourceId={dragSourceId}
                displayLabel={SLOT_LABELS[lang]?.[def.id] ?? def.label}
                badgeLabels={badgeI18n}
                loadingLabels={loadingI18n}
                onFileSelected={file => loadFileInSlot(file, def.id)}
                onSwap={swapSlots}
                onClear={() => clearSlot(def.id)}
                onDragOverChange={over => setDragOverId(over ? def.id : null)}
              />
            ))}
          </div>
        </div>

        {/* SECTION 2 — Photos portées (slots 9–14) */}
        <div>
          <p className="text-[10px] font-bold text-gray-400 tracking-widest mb-1.5">{sectionTitles.s2}</p>
          <div className="grid grid-cols-6 gap-2">
            {SLOT_DEFS.slice(9).map(def => (
              <SlotCard
                key={def.id}
                def={def}
                slot={slots[def.id]}
                isDragOver={dragOverId === def.id}
                dragSourceId={dragSourceId}
                displayLabel={SLOT_LABELS[lang]?.[def.id] ?? def.label}
                badgeLabels={badgeI18n}
                loadingLabels={loadingI18n}
                onFileSelected={file => loadFileInSlot(file, def.id)}
                onSwap={swapSlots}
                onClear={() => clearSlot(def.id)}
                onDragOverChange={over => setDragOverId(over ? def.id : null)}
              />
            ))}
          </div>

        </div>

      </div>

      {/* ── Reconnaissance : chargement ── */}
      {recogLoading && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex flex-col items-center gap-4 text-center">
          <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">{ui.analyzing}</p>
            <p className="text-sm text-gray-500 mt-1">{ui.analyzingSub}</p>
          </div>
        </div>
      )}

      {/* ── Reconnaissance : erreur ── */}
      {recogError && !recogLoading && (
        <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-6 flex flex-col items-center gap-3 text-center">
          <XCircle className="w-8 h-8 text-red-400" />
          <div>
            <p className="font-semibold text-gray-900">{ui.analysisFailed}</p>
            <p className="text-sm text-gray-500 mt-1">{ui.analysisError}</p>
          </div>
          <button
            onClick={recogRetry}
            className="flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            {ui.retry}
          </button>
        </div>
      )}

      {/* ── Reconnaissance : formulaire ── */}
      {result && !recogLoading && (
        <>
          {/* En-tête résultat */}
          <div className="flex items-center justify-between gap-3 px-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                <ScanLine className="w-3.5 h-3.5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{ui.autoRecognition}</p>
                <p className="text-xs text-gray-500">{ui.autoRecognitionSub}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{ui.confidenceLegend}</p>
              </div>
            </div>
            <button
              onClick={recogRetry}
              className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-indigo-600 transition-colors shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              {ui.rerun}
            </button>
          </div>

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

            {/* N3 + N4 + N5 */}
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

            {/* Avertissement N3 terminal */}
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
                    {tailleSizes.map(s => <option key={s} value={s}>{s}</option>)}
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

            {/* Couleurs — max 2 */}
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

            {/* Matières — max 3 */}
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
                    <button
                      onClick={() => setOpenExtraFields(prev => prev.filter(f => f !== label))}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
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
                  <button
                    onClick={() => removeCustomExtraRow(row.id)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
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
                  const validated    = result.extraInfo?.dimensions?.find(d => d.nom === nom)
                  const isOpen       = openDimFields.includes(nom)
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
                const idx          = DIM_PRESETS_FR.indexOf(nom)
                const displayLabel = idx >= 0 ? (dimPresets[idx]?.fr ?? nom) : nom
                const nomEN        = DIM_PRESETS_EN[idx] ?? nom
                return (
                  <div key={nom} className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-600 shrink-0 w-32 truncate">{displayLabel}</span>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={dimInputs[nom] ?? ''}
                      onChange={e => setDimInputs(prev => ({ ...prev, [nom]: e.target.value }))}
                      onKeyDown={e => { if (e.key === 'Enter') validateDimension(nom, nomEN) }}
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
                    <button
                      onClick={() => setOpenDimFields(prev => prev.filter(f => f !== nom))}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
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
                  <button
                    onClick={() => removeCustomDimRow(row.id)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
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

        </>
      )}

    </div>
  )
}

/* ─── Slot Card ───────────────────────────────────────────────────────────── */

interface SlotCardProps {
  def: SlotDef
  slot: PhotoSlot
  isDragOver: boolean
  dragSourceId: React.MutableRefObject<number | null>
  locked?: boolean
  displayLabel: string
  badgeLabels: { required: string; recommended: string; optional: string }
  loadingLabels: { removingBg: string; applyingBg: string; loading: string; bgRemoved: string; bgFailed: string; bgPro: string }
  overrideDisplayUrl?: string
  isCompositedDisplay?: boolean
  isCompositing?: boolean
  showCheckbox?: boolean
  isChecked?: boolean
  onCheckToggle?: () => void
  isAiGenerated?: boolean
  aiBadgeLabel?: string
  onFileSelected: (file: File) => void
  onSwap: (sourceId: number, targetId: number) => void
  onClear: () => void
  onDragOverChange: (over: boolean) => void
}

function SlotCard({
  def, slot, isDragOver, dragSourceId, locked = false, displayLabel, badgeLabels, loadingLabels,
  overrideDisplayUrl, isCompositedDisplay = false, isCompositing = false,
  showCheckbox = false, isChecked = false, onCheckToggle,
  isAiGenerated = false, aiBadgeLabel = 'IA',
  onFileSelected, onSwap, onClear, onDragOverChange,
}: SlotCardProps) {
  const inputRef  = useRef<HTMLInputElement>(null)
  const isLoading = slot.status === 'uploading' || slot.status === 'processing-bg'
  const hasBg     = slot.processedUrl !== null

  /* Les slots IA sans override s'affichent vides en sections 1/2 (photo réelle → RENDU) */
  const displayUrl = overrideDisplayUrl ?? (isAiGenerated ? null : slot.preview)
  const isEmpty    = slot.status === 'empty' || (isAiGenerated && !overrideDisplayUrl)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!locked && dragSourceId.current !== null && dragSourceId.current !== def.id) onDragOverChange(true)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onDragOverChange(false)
    const sourceId = e.dataTransfer.getData('slotId')
    if (sourceId !== '') {
      if (!locked) onSwap(parseInt(sourceId), def.id)
      return
    }
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'))
    if (files[0]) onFileSelected(files[0])
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={() => onDragOverChange(false)}
      onDrop={handleDrop}
      onClick={() => {
        if (!isEmpty && showCheckbox) { onCheckToggle?.(); return }
        if (isEmpty) inputRef.current?.click()
      }}
      className={`relative w-full aspect-square rounded-xl overflow-hidden transition-all duration-150 group ${
        isDragOver && !locked
          ? 'ring-2 ring-indigo-500 ring-offset-2 scale-[1.04]'
          : isEmpty
          ? 'border-2 border-dashed border-gray-200 hover:border-indigo-300 bg-gray-50 hover:bg-indigo-50/30 cursor-pointer'
          : 'border border-gray-200 shadow-sm'
      }`}
    >
      <input
        ref={inputRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) onFileSelected(f); e.target.value = '' }}
      />

      {/* ── Vide ── */}
      {isEmpty && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 p-2 select-none">
          {def.type === 'label' || def.type === 'detail'
            ? <Tag    className="w-5 h-5 text-gray-300 group-hover:text-indigo-300 transition-colors" />
            : <Camera className="w-5 h-5 text-gray-300 group-hover:text-indigo-300 transition-colors" />
          }
          <span className="text-[10px] font-semibold text-gray-400 text-center leading-tight px-1">{displayLabel}</span>
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${BADGE_CLS[def.badge]}`}>
            {badgeLabels[def.badge]}
          </span>
        </div>
      )}

      {/* ── Chargement / compositing ── */}
      {(isLoading || isCompositing) && (
        <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center gap-2 select-none z-10">
          <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-[10px] text-gray-400 font-medium text-center px-2">
            {slot.status === 'processing-bg' ? loadingLabels.removingBg : isCompositing ? loadingLabels.applyingBg : loadingLabels.loading}
          </span>
        </div>
      )}

      {/* ── Photo chargée ── */}
      {displayUrl && !isLoading && (
        <div
          draggable={!locked}
          onDragStart={locked ? undefined : (e) => {
            e.stopPropagation()
            e.dataTransfer.setData('slotId', String(def.id))
            e.dataTransfer.effectAllowed = 'move'
            dragSourceId.current = def.id
          }}
          onDragEnd={locked ? undefined : () => { dragSourceId.current = null }}
          className={`absolute inset-0 bg-gray-50 ${locked ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'}`}
        >
          <img src={displayUrl} alt={displayLabel} className="w-full h-full object-contain" draggable={false} />

          {/* Overlay survol */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          <div className="absolute top-1.5 inset-x-1.5 flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="bg-black/60 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded backdrop-blur-sm leading-tight">
              {displayLabel}
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); onClear() }}
              className="w-5 h-5 bg-black/60 hover:bg-red-500 text-white rounded-full flex items-center justify-center transition-colors shrink-0"
            >
              <X className="w-2.5 h-2.5" />
            </button>
          </div>

          {/* Chip statut fond */}
          <div className="absolute bottom-1.5 inset-x-1.5 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            {hasBg ? (
              <span className="bg-green-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow">
                ✓ {loadingLabels.bgRemoved}
              </span>
            ) : slot.error === 'bg_failed' ? (
              <span className="bg-orange-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
                <AlertTriangle className="w-2 h-2" /> {loadingLabels.bgFailed}
              </span>
            ) : (def as { bgRemoval: string }).bgRemoval === 'pro' ? (
              <span className="bg-indigo-600/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-sm shadow">
                <Lock className="w-2 h-2" /> {loadingLabels.bgPro}
              </span>
            ) : null}
          </div>

          {/* Icône déplacement */}
          {!locked && (
            <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-60 transition-opacity pointer-events-none">
              <GripVertical className="w-3.5 h-3.5 text-white drop-shadow" />
            </div>
          )}
        </div>
      )}

      {/* ── Badge ✦ slot 0 vide ── */}
      {def.id === 0 && isEmpty && (
        <div className="absolute top-1.5 left-1.5">
          <div className="w-4 h-4 rounded-full bg-indigo-600 flex items-center justify-center">
            <span className="text-white text-[8px] font-extrabold leading-none">✦</span>
          </div>
        </div>
      )}

      {/* ── Badge IA (slots générés par FASHN) ── */}
      {isAiGenerated && !isEmpty && (
        <div className="absolute top-1 left-1 z-10 pointer-events-none">
          <span className="bg-purple-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow">
            {aiBadgeLabel}
          </span>
        </div>
      )}

      {/* ── Checkbox suppression fond (Premium / Pro) ── */}
      {showCheckbox && !isLoading && (
        <button
          onClick={(e) => { e.stopPropagation(); onCheckToggle?.() }}
          className={`absolute top-1 left-1 z-20 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all shadow-sm ${
            isChecked
              ? 'bg-indigo-600 border-indigo-600'
              : 'bg-white/90 border-gray-300 hover:border-indigo-400'
          }`}
        >
          {isChecked && <Check className="w-2.5 h-2.5 text-white" />}
        </button>
      )}
    </div>
  )
}
