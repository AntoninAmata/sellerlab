'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import {
  Camera, Tag, X, Lock, Upload, Sparkles,
  GripVertical, AlertTriangle, Check, Wand2, User, Link,
} from 'lucide-react'
import type { PhotoSlot } from '../types'
import type { Lang } from '@/lib/i18n'
import { useLang } from '@/app/providers'

/* ─── Plan tarifaire ─────────────────────────────────────────────────────── */

type Plan = 'freemium' | 'premium' | 'pro'

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

/* ─── Traductions bannière validation (freemium) — 7 langues ─────────────── */

const BANNER_I18N: Record<Lang, { title: string; desc: string; btn: string }> = {
  fr: {
    title: "Vérifiez l'ordre de vos photos",
    desc:  'Réorganisez par glisser-déposer si besoin, puis lancez le traitement.',
    btn:   'Traiter les photos — Supprimer le fond',
  },
  en: {
    title: 'Check your photo order',
    desc:  'Drag and drop to reorder if needed, then start processing.',
    btn:   'Process photos — Remove background',
  },
  es: {
    title: 'Verifica el orden de tus fotos',
    desc:  'Reorganiza arrastrando si es necesario, luego lanza el procesamiento.',
    btn:   'Procesar fotos — Eliminar fondo',
  },
  de: {
    title: 'Überprüfe deine Fotoreihenfolge',
    desc:  'Bei Bedarf per Drag & Drop neu anordnen, dann Verarbeitung starten.',
    btn:   'Fotos verarbeiten — Hintergrund entfernen',
  },
  it: {
    title: "Verifica l'ordine delle foto",
    desc:  "Riorganizza con drag & drop se necessario, poi avvia l'elaborazione.",
    btn:   'Elabora foto — Rimuovi sfondo',
  },
  nl: {
    title: "Controleer de volgorde van je foto's",
    desc:  'Herorden indien nodig via slepen, start dan de verwerking.',
    btn:   "Foto's verwerken — Achtergrond verwijderen",
  },
  pl: {
    title: 'Sprawdź kolejność zdjęć',
    desc:  'Przeciągnij, aby zmienić kolejność, następnie uruchom przetwarzanie.',
    btn:   'Przetwórz zdjęcia — Usuń tło',
  },
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

/* ─── Traductions astuce ──────────────────────────────────────────────────── */

const TIP_I18N: Record<Lang, { unlock: string; lock: string }> = {
  fr: {
    unlock: 'Glissez-déposez entre les slots pour réorganiser · Cliquez pour uploader',
    lock:   'Photos figées (fond supprimé) · Cliquez sur un slot pour remplacer',
  },
  en: {
    unlock: 'Drag and drop between slots to reorder · Click to upload',
    lock:   'Photos locked (background removed) · Click a slot to replace',
  },
  es: {
    unlock: 'Arrastra entre slots para reorganizar · Haz clic para subir',
    lock:   'Fotos bloqueadas (fondo eliminado) · Haz clic para reemplazar',
  },
  de: {
    unlock: 'Zwischen Slots ziehen zum Umordnen · Klicken zum Hochladen',
    lock:   'Fotos gesperrt (Hintergrund entfernt) · Klicken zum Ersetzen',
  },
  it: {
    unlock: 'Trascina tra i slot per riordinare · Clicca per caricare',
    lock:   'Foto bloccate (sfondo rimosso) · Clicca per sostituire',
  },
  nl: {
    unlock: 'Sleep tussen slots om te herordenen · Klik om te uploaden',
    lock:   "Foto's vergrendeld (achtergrond verwijderd) · Klik om te vervangen",
  },
  pl: {
    unlock: 'Przeciągnij między slotami · Kliknij slot aby przesłać',
    lock:   'Zdjęcia zablokowane (tło usunięte) · Kliknij aby zastąpić',
  },
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

/* ─── Backgrounds — 23 choix (blanc CSS + 22 images IA bg-01…bg-22) ─────── */

type BgDef =
  | { id: number; label: string; type: 'color'; color: string; preview: string }
  | { id: number; label: string; type: 'image'; src: string; preview: string }

const _IMAGE_BACKGROUNDS: BgDef[] = Array.from({ length: 22 }, (_, i) => ({
  id: i + 1,
  label: `Fond ${String(i + 1).padStart(2, '0')}`,
  type: 'image' as const,
  src: `/backgrounds/bg-${String(i + 1).padStart(2, '0')}.jpg`,
  preview: `/backgrounds/bg-${String(i + 1).padStart(2, '0')}.jpg`,
}))

const BACKGROUNDS: BgDef[] = [
  { id: 0, label: 'Blanc pur', type: 'image', src: '/backgrounds/bg-white.jpg', preview: '/backgrounds/bg-white.jpg' },
  ..._IMAGE_BACKGROUNDS,
]

/* ─── Mannequins — 20 hommes + 20 femmes ─────────────────────────────────── */

const MEN_MANNEQUINS: string[] = [
  'man-01', 'man-02', 'man-05', 'man-06', 'man-07',
  'man-09', 'man-13', 'man-16', 'man-18', 'man-20',
]
const WOMEN_MANNEQUINS: string[] = [
  'woman-01', 'woman-02', 'woman-04', 'woman-06', 'woman-07',
  'woman-10', 'woman-13', 'woman-16', 'woman-18', 'woman-20',
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

/* ─── Compositing canvas : cutout PNG + fond ──────────────────────────────── */

async function compositeWithBackground(cutoutUrl: string, bg: BgDef): Promise<string> {
  return new Promise((resolve, reject) => {
    const cutout = new Image()
    cutout.onload = () => {
      const canvas  = document.createElement('canvas')
      canvas.width  = cutout.naturalWidth
      canvas.height = cutout.naturalHeight
      const ctx     = canvas.getContext('2d')!

      const draw = () => {
        ctx.drawImage(cutout, 0, 0)
        canvas.toBlob(
          (blob) => blob ? resolve(URL.createObjectURL(blob)) : reject(new Error('toBlob failed')),
          'image/jpeg', 0.92,
        )
      }

      if (bg.type === 'color') {
        ctx.fillStyle = bg.color
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        draw()
      } else {
        const bgImg = new Image()
        bgImg.onload = () => {
          const s  = Math.max(canvas.width / bgImg.naturalWidth, canvas.height / bgImg.naturalHeight)
          const bw = bgImg.naturalWidth  * s
          const bh = bgImg.naturalHeight * s
          ctx.drawImage(bgImg, (canvas.width - bw) / 2, (canvas.height - bh) / 2, bw, bh)
          draw()
        }
        bgImg.onerror = () => {
          ctx.fillStyle = '#FFFFFF'
          ctx.fillRect(0, 0, canvas.width, canvas.height)
          draw()
        }
        bgImg.src = bg.src
      }
    }
    cutout.onerror = reject
    cutout.src = cutoutUrl
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

/* ─── Props ───────────────────────────────────────────────────────────────── */

interface Props {
  slots: PhotoSlot[]
  setSlots: React.Dispatch<React.SetStateAction<PhotoSlot[]>>
  aiPhotos: string[]
  setAiPhotos: (urls: string[]) => void
}

/* ─── Composant principal ─────────────────────────────────────────────────── */

export default function PhotoUploadStep({ slots, setSlots, aiPhotos, setAiPhotos }: Props) {
  const { lang } = useLang()

  /* Plan tarifaire (simulé — sera branché Stripe plus tard) */
  const [plan, setPlan]                           = useState<Plan>('freemium')

  const [dragOverId, setDragOverId]               = useState<number | null>(null)
  const [isClassifying, setIsClassifying]         = useState(false)
  const [classifiedCount, setClassifiedCount]     = useState<number | null>(null)
  const [overflowCount, setOverflowCount]         = useState(0)
  const [globalDragOver, setGlobalDragOver]       = useState(false)
  const [selectedBg, setSelectedBg]               = useState(0)
  const [showValidationBanner, setShowValidationBanner] = useState(false)

  /* Premium / Pro — checkboxes suppression fond */
  const [bgCheckedSlots, setBgCheckedSlots]       = useState<Set<number>>(new Set())
  const [isProcessingBg, setIsProcessingBg]       = useState(false)

  /* Pro — mannequin IA */
  const [selectedMannequin, setSelectedMannequin] = useState<string | null>(null)
  const [isGeneratingMannequin, setIsGeneratingMannequin] = useState(false)
  const [mannequinCustomPrompt, setMannequinCustomPrompt] = useState('outfit adapted to the garment, contemporary 2026 casual style')

  /* Pro — import URL Vinted */
  const [vintedUrl, setVintedUrl]         = useState('')
  const [isImporting, setIsImporting]     = useState(false)
  const [importError, setImportError]     = useState<string | null>(null)
  const [importSuccess, setImportSuccess] = useState<string | null>(null)

  /* Compositing fond sur tous les slots traités */
  const [compositedUrls, setCompositedUrls]       = useState<Record<number, string>>({})
  const [isCompositing, setIsCompositing]         = useState(false)

  const dragSourceId = useRef<number | null>(null)
  const slotsRef     = useRef<PhotoSlot[]>(slots)
  useEffect(() => { slotsRef.current = slots }, [slots])

  /* Charge la préférence fond */
  useEffect(() => {
    const saved = localStorage.getItem('sellerlab_bg_choice')
    if (saved !== null) setSelectedBg(parseInt(saved) || 0)
  }, [])

  const handleBgSelect = (id: number) => {
    setSelectedBg(id)
    localStorage.setItem('sellerlab_bg_choice', String(id))
  }

  /* ── Compositing : recomposite tous les slots avec processedUrl ── */
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
        compositeWithBackground(slot.processedUrl!, BACKGROUNDS[selectedBg])
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
      /* Sync compositedUrl into slot state so ExportStep can use it */
      setSlots(prev => prev.map(s => ({ ...s, compositedUrl: next[s.id] ?? undefined })))
      setIsCompositing(false)
    }).catch(() => {
      if (!cancelled) setIsCompositing(false)
    })

    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [processedSlotKey, selectedBg])

  /* ── Helpers i18n ── */
  const planI18n      = PLAN_I18N[lang]      ?? PLAN_I18N.fr
  const bannerI18n    = BANNER_I18N[lang]    ?? BANNER_I18N.fr
  const tipI18n       = TIP_I18N[lang]       ?? TIP_I18N.fr
  const sectionTitles = SECTION_TITLES[lang] ?? SECTION_TITLES.fr
  const dropI18n      = DROP_I18N[lang]      ?? DROP_I18N.fr
  const badgeI18n     = BADGE_I18N[lang]     ?? BADGE_I18N.fr
  const loadingI18n   = LOADING_I18N[lang]   ?? LOADING_I18N.fr

  const anySlotHasBg  = slots.some(s => s.processedUrl !== null)
  const filledCount   = slots.filter(s => s.file !== null || (s.preview !== null && s.status !== 'empty')).length

  /* Slots pouvant être sélectionnés pour le changement de fond */
  const checkableSlotIds: number[] = (plan === 'premium' || plan === 'pro')
    ? SLOT_DEFS.filter(d => d.type === 'garment').map(d => d.id)
    : []

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

  /* ── Traiter les slots sélectionnés (premium / pro) ── */
  const processCheckedSlots = useCallback(async () => {
    if (isProcessingBg || bgCheckedSlots.size === 0) return
    setIsProcessingBg(true)

    const toProcess = Array.from(bgCheckedSlots)

    /* Show loader on ALL selected photos at once */
    setSlots(prev => prev.map(s =>
      toProcess.includes(s.id) && s.file ? { ...s, status: 'processing-bg' as const } : s
    ))

    /* Process sequentially — WASM worker not designed for parallel calls */
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

  /* ── Validation freemium : traite uniquement slot 0 ── */
  const handleValidateAndProcess = useCallback(async () => {
    const slot0 = slotsRef.current[0]
    if (slot0.file) {
      updateSlot(0, { status: 'processing-bg' })
      try {
        const { removeBackground } = await import('@imgly/background-removal')
        const blob = new Blob([await slot0.file.arrayBuffer()], { type: slot0.file.type || 'image/jpeg' })
        const resultBlob = await removeBackground(blob)
        updateSlot(0, { status: 'done', processedUrl: URL.createObjectURL(resultBlob) })
      } catch (err) {
        console.error('Background removal failed (validate):', err)
        updateSlot(0, { status: 'done', processedUrl: null, error: 'bg_failed' })
      }
    }
    setShowValidationBanner(false)
  }, [updateSlot])

  /* ── Génération mannequin IA (Pro) ── */
  const handleGenerateMannequin = useCallback(async () => {
    if (!selectedMannequin || isGeneratingMannequin) return
    const slot0 = slotsRef.current[0]
    if (!slot0.file) return

    setIsGeneratingMannequin(true)
    try {
      const reader = new FileReader()
      const base64 = await new Promise<string>((resolve, reject) => {
        reader.onload  = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(slot0.file!)
      })

      const res = await fetch('/api/generate-mannequin', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          product_image: base64,
          mannequin_id: selectedMannequin,
          background_id: selectedBg,
          outfit_prompt: mannequinCustomPrompt.trim() || undefined,
        }),
      })

      if (!res.ok) throw new Error('Generation failed')
      const { urls } = await res.json() as { urls: string[] }

      setAiPhotos(urls.slice(0, 2))
    } catch (err) {
      console.error('Mannequin generation failed:', err)
    } finally {
      setIsGeneratingMannequin(false)
    }
  }, [selectedMannequin, isGeneratingMannequin, updateSlot, selectedBg, mannequinCustomPrompt])

  /* ── Upload multiple → classify → slots ── */
  const handleMultipleFiles = useCallback(
    async (files: File[]) => {
      if (!files.length) return
      setClassifiedCount(null)
      setOverflowCount(0)
      setShowValidationBanner(false)

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

      /* Bannière validation uniquement en freemium */
      if (plan === 'freemium') setShowValidationBanner(true)
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

  /* ── Swap — désactivé après remove-bg ── */
  const swapSlots = useCallback(
    (sourceId: number, targetId: number) => {
      if (anySlotHasBg || sourceId === targetId) return
      setSlots(prev => {
        const next = [...prev]
        next[sourceId] = { ...prev[targetId], id: sourceId }
        next[targetId] = { ...prev[sourceId], id: targetId }
        return next
      })
    },
    [setSlots, anySlotHasBg],
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
      setBgCheckedSlots(prev => {
        const next = new Set(prev)
        next.delete(slotId)
        return next
      })
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

  const toggleBgCheck = (slotId: number) => {
    setBgCheckedSlots(prev => {
      const next = new Set(prev)
      if (next.has(slotId)) next.delete(slotId)
      else next.add(slotId)
      return next
    })
  }

  return (
    <div className="space-y-3">

      {/* ── Switcher plan (DEV uniquement — à retirer avant mise en prod) ── */}
      <PlanSwitcher plan={plan} onChange={setPlan} />

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
      {classifiedCount !== null && !isClassifying && !showValidationBanner && (
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

      {/* ── Panneau fond — toujours visible ── */}
      <BgPanel
        plan={plan}
        selectedBg={selectedBg}
        onBgSelect={handleBgSelect}
        checkedCount={bgCheckedSlots.size}
        isProcessing={isProcessingBg}
        onProcess={processCheckedSlots}
        planI18n={planI18n}
      />

      {/* ── Panneau mannequin IA — actif en Pro, verrouillé en Freemium/Premium ── */}
      <MannequinPanel
        selectedMannequin={selectedMannequin}
        onSelect={setSelectedMannequin}
        onGenerate={handleGenerateMannequin}
        isGenerating={isGeneratingMannequin}
        hasSlot0Photo={!!slots[0]?.file}
        isLocked={plan !== 'pro'}
        planI18n={planI18n}
        customPrompt={mannequinCustomPrompt}
        onCustomPromptChange={setMannequinCustomPrompt}
      />

      {/* ── Bannière validation (freemium uniquement, après classification multiple) ── */}
      {plan === 'freemium' && showValidationBanner && !isClassifying && (
        <div className="rounded-2xl border-2 border-indigo-200 bg-indigo-50 p-5 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
              <Wand2 className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-base text-indigo-900 mb-0.5">{bannerI18n.title}</h3>
              <p className="text-sm text-indigo-700">{bannerI18n.desc}</p>
            </div>
            <button
              onClick={() => setShowValidationBanner(false)}
              className="ml-auto text-indigo-400 hover:text-indigo-600 transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={handleValidateAndProcess}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm py-3.5 rounded-xl transition-all active:scale-[0.98]"
          >
            <Wand2 className="w-4 h-4" />
            {bannerI18n.btn}
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
                locked={anySlotHasBg}
                displayLabel={SLOT_LABELS[lang]?.[def.id] ?? def.label}
                badgeLabels={badgeI18n}
                loadingLabels={loadingI18n}
                showCheckbox={checkableSlotIds.includes(def.id) && !!slots[def.id]?.file && slots[def.id]?.status !== 'processing-bg'}
                isChecked={bgCheckedSlots.has(def.id)}
                onCheckToggle={() => toggleBgCheck(def.id)}
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
                locked={anySlotHasBg}
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
                locked={anySlotHasBg}
                displayLabel={SLOT_LABELS[lang]?.[def.id] ?? def.label}
                badgeLabels={badgeI18n}
                loadingLabels={loadingI18n}
                showCheckbox={checkableSlotIds.includes(def.id) && !!slots[def.id]?.file && slots[def.id]?.status !== 'processing-bg'}
                isChecked={bgCheckedSlots.has(def.id)}
                onCheckToggle={() => toggleBgCheck(def.id)}
                onFileSelected={file => loadFileInSlot(file, def.id)}
                onSwap={swapSlots}
                onClear={() => clearSlot(def.id)}
                onDragOverChange={over => setDragOverId(over ? def.id : null)}
              />
            ))}
          </div>

        </div>

        {/* ── SECTION 3 — RENDU (photos traitées + mannequin IA) ── */}
        {(Object.keys(compositedUrls).length > 0 || aiPhotos.length > 0) && (
          <div>
            <p className="text-[10px] font-bold text-gray-400 tracking-widest mb-1.5">{planI18n.rendTitle}</p>
            <div className="grid grid-cols-4 gap-2">
              {Object.entries(compositedUrls).map(([id, url]) => (
                <div key={id} className="relative aspect-square rounded-xl overflow-hidden border border-green-200 shadow-sm bg-gray-50">
                  <img src={url} alt={`Rendu ${id}`} className="w-full h-full object-contain" draggable={false} />
                  <div className="absolute top-1 left-1">
                    <span className="bg-green-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow">✓</span>
                  </div>
                </div>
              ))}
              {aiPhotos.map((url, i) => (
                <div key={`ai-${i}`} className="relative aspect-square rounded-xl overflow-hidden border border-purple-200 shadow-sm bg-gray-50">
                  <img src={url} alt={`IA ${i + 1}`} className="w-full h-full object-contain" draggable={false} />
                  <div className="absolute top-1 left-1">
                    <span className="bg-purple-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow">{planI18n.badgeAI}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Astuce ── */}
        <p className="text-xs text-gray-400 text-center pb-2">
          {anySlotHasBg ? tipI18n.lock : tipI18n.unlock}
        </p>

      </div>
    </div>
  )
}

/* ─── PlanSwitcher (dev uniquement) ──────────────────────────────────────── */

function PlanSwitcher({ plan, onChange }: { plan: Plan; onChange: (p: Plan) => void }) {
  return (
    <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
      <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider shrink-0">DEV</span>
      <div className="flex gap-1">
        {(['freemium', 'premium', 'pro'] as Plan[]).map(p => (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`text-xs font-semibold px-3 py-1 rounded-lg transition-all ${
              plan === p
                ? 'bg-amber-400 text-white shadow-sm'
                : 'text-amber-600 hover:bg-amber-100'
            }`}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>
    </div>
  )
}

/* ─── BgPanel ─────────────────────────────────────────────────────────────── */

interface BgPanelProps {
  plan: Plan
  selectedBg: number
  onBgSelect: (id: number) => void
  checkedCount: number
  isProcessing: boolean
  onProcess: () => void
  planI18n: typeof PLAN_I18N.fr
}

function BgPanel({ plan, selectedBg, onBgSelect, checkedCount, isProcessing, onProcess, planI18n }: BgPanelProps) {
  const [showPreview, setShowPreview] = useState(false)
  const currentBg = BACKGROUNDS[selectedBg] ?? BACKGROUNDS[0]

  return (
    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 space-y-3">
      <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">{planI18n.bgPanelTitle}</p>

      <div className="flex gap-2 overflow-x-auto pb-1 snap-x snap-mandatory">
        {BACKGROUNDS.map(bg => {
          const isLocked = plan === 'freemium' && bg.id !== 0
          return (
            <button
              key={bg.id}
              onClick={() => { if (!isLocked) { onBgSelect(bg.id); setShowPreview(true) } }}
              title={bg.label}
              disabled={isLocked}
              className={`relative snap-start shrink-0 w-16 h-16 rounded-xl overflow-hidden transition-all ${
                isLocked ? 'cursor-not-allowed' : 'cursor-pointer'
              } ${
                selectedBg === bg.id && !isLocked
                  ? 'ring-2 ring-indigo-500 ring-offset-2 scale-[1.06] shadow-md shadow-indigo-200'
                  : isLocked
                  ? 'ring-1 ring-gray-200 opacity-60'
                  : 'ring-1 ring-gray-200 hover:ring-indigo-300'
              }`}
            >
              {bg.type === 'color' ? (
                <div className="w-full h-full" style={{ backgroundColor: bg.color }} />
              ) : (
                <img src={bg.src} alt={bg.label} className="w-full h-full object-cover" draggable={false} />
              )}
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

      {/* Inline preview — s'affiche au clic sur une vignette, se ferme sur CTA */}
      {showPreview && plan !== 'freemium' && (
        <div className="rounded-xl overflow-hidden border border-blue-200 shadow-sm">
          <div className="w-full h-28">
            {currentBg.type === 'color' ? (
              <div className="w-full h-full" style={{ backgroundColor: currentBg.color }} />
            ) : (
              <img src={currentBg.src} alt={currentBg.label} className="w-full h-full object-contain" draggable={false} />
            )}
          </div>
          <div className="p-2 border-t border-blue-100">
            <button
              onClick={() => setShowPreview(false)}
              className="w-full flex items-center justify-center gap-2 font-semibold text-sm py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white active:scale-[0.98] transition-all"
            >
              <Check className="w-4 h-4" />
              {planI18n.modalConfirmBg}
            </button>
          </div>
        </div>
      )}

      {plan === 'freemium' ? (
        <p className="text-xs text-blue-500 flex items-center gap-1.5">
          <Lock className="w-3 h-3 shrink-0" />
          {planI18n.freemiumLockMsg}
        </p>
      ) : (
        <>
          <p className="text-xs text-blue-600">{planI18n.checkboxHint}</p>
          {checkedCount > 0 && (
            <button
              onClick={onProcess}
              disabled={isProcessing}
              className={`w-full flex items-center justify-center gap-2 font-semibold text-sm py-3 rounded-xl transition-all ${
                !isProcessing
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-[0.98]'
                  : 'bg-indigo-100 text-indigo-400 cursor-wait'
              }`}
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                  {planI18n.processing}
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  {planI18n.processBtn(checkedCount)}
                </>
              )}
            </button>
          )}
        </>
      )}
    </div>
  )
}

/* ─── MannequinPanel (Pro + teaser verrouillé Freemium/Premium) ────────────── */

interface MannequinPanelProps {
  selectedMannequin: string | null
  onSelect: (id: string) => void
  onGenerate: () => void
  isGenerating: boolean
  hasSlot0Photo: boolean
  isLocked?: boolean
  planI18n: typeof PLAN_I18N.fr
  customPrompt: string
  onCustomPromptChange: (v: string) => void
}

function MannequinPanel({ selectedMannequin, onSelect, onGenerate, isGenerating, hasSlot0Photo, isLocked = false, planI18n, customPrompt, onCustomPromptChange }: MannequinPanelProps) {
  const [gender, setGender]             = useState<'men' | 'women'>('men')
  const [previewId, setPreviewId]       = useState<string | null>(null)
  const [showCustomPrompt, setShowCustomPrompt] = useState(false)
  const canGenerate = !!selectedMannequin && hasSlot0Photo && !isLocked
  const mannequins  = gender === 'men' ? MEN_MANNEQUINS : WOMEN_MANNEQUINS

  return (
    <div className={`bg-purple-50 border border-purple-100 rounded-2xl p-4 space-y-3 ${isLocked ? 'opacity-70' : ''}`}>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
          <User className="w-4 h-4 text-purple-600" />
        </div>
        <h3 className="font-display font-extrabold text-base text-purple-900">{planI18n.mannequinTitle}</h3>
        {isLocked && (
          <span className="text-[9px] font-bold bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-full uppercase tracking-wide ml-1">Pro</span>
        )}
      </div>

      {/* Gender pills — navigation autorisée sur tous les plans */}
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
            {g === 'men' ? planI18n.mannequinMen : planI18n.mannequinWomen}
          </button>
        ))}
      </div>

      {/* Mannequin grid — thumbnails cropped to head */}
      <div className="flex gap-2 overflow-x-auto pb-1 snap-x">
        {mannequins.map(id => (
          <button
            key={id}
            onClick={() => { if (!isLocked) { onSelect(id); setPreviewId(id) } }}
            className={`relative snap-start shrink-0 w-16 h-16 rounded-xl overflow-hidden transition-all ${
              selectedMannequin === id
                ? 'ring-2 ring-purple-500 ring-offset-1 scale-[1.06]'
                : 'ring-1 ring-purple-200 hover:ring-purple-400'
            }`}
          >
            <img
              src={`/mannequins/${id}.jpg`} alt={id}
              className="w-full h-full object-cover"
              style={{ objectPosition: '50% 0%' }}
              draggable={false}
            />
            {isLocked && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <Lock className="w-3 h-3 text-white drop-shadow" />
              </div>
            )}
            {!isLocked && selectedMannequin === id && (
              <div className="absolute inset-0 flex items-center justify-center bg-purple-600/20">
                <Check className="w-4 h-4 text-white drop-shadow" />
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Inline full-body preview — shown below grid on click (Pro only) */}
      {!isLocked && previewId && (
        <div className="rounded-xl overflow-hidden border border-purple-200 bg-white shadow-sm">
          <div className="relative">
            <img
              src={`/mannequins/${previewId}.jpg`}
              alt={previewId}
              className="w-full object-contain"
              style={{ maxHeight: '220px' }}
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
              {planI18n.modalConfirmMannequin}
            </button>
          </div>
        </div>
      )}

      {/* Champ prompt personnalisé — Pro uniquement, replié par défaut */}
      {!isLocked && (
        <div>
          <button
            type="button"
            onClick={() => setShowCustomPrompt(v => !v)}
            className="w-full flex items-center justify-between gap-2 text-sm font-semibold text-purple-600 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl px-3 py-2.5 transition-colors"
          >
            <span>{planI18n.mannequinCustomPromptLabel}</span>
            <span className="text-purple-400 text-base leading-none">{showCustomPrompt ? '▾' : '▸'}</span>
          </button>
          {showCustomPrompt && (
            <textarea
              value={customPrompt}
              onChange={e => onCustomPromptChange(e.target.value)}
              rows={2}
              className="mt-1.5 w-full text-xs rounded-xl border border-purple-200 bg-white px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300 resize-none"
            />
          )}
        </div>
      )}

      {/* Bouton générer */}
      <button
        onClick={!isLocked ? onGenerate : undefined}
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
            {planI18n.mannequinGenerating}
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            {planI18n.mannequinGenerate}
          </>
        )}
      </button>

      {isLocked ? (
        <p className="text-xs text-purple-500 flex items-center justify-center gap-1.5">
          <Lock className="w-3 h-3 shrink-0" />
          {planI18n.mannequinLockedMsg}
        </p>
      ) : (
        <>
          {!hasSlot0Photo && (
            <p className="text-xs text-purple-400 text-center">{planI18n.noSlot0Msg}</p>
          )}
          {hasSlot0Photo && !selectedMannequin && (
            <p className="text-xs text-purple-400 text-center">{planI18n.noMannequinMsg}</p>
          )}
        </>
      )}
    </div>
  )
}

/* ─── MannequinTeaser (kept for reference) ─────────────────────────────────── */

function MannequinTeaser({ planI18n }: { planI18n: typeof PLAN_I18N.fr }) {
  return (
    <div className="mt-3 flex items-center gap-3 bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-4">
      <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
        <Lock className="w-4 h-4 text-gray-400" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-display font-extrabold text-sm text-gray-500">{planI18n.teaserTitle}</span>
          <span className="text-[9px] font-bold bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-full uppercase tracking-wide">Pro</span>
        </div>
        <p className="text-xs text-gray-400 leading-tight">{planI18n.teaserDesc}</p>
      </div>
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
