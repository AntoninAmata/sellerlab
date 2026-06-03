'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import {
  Camera, Tag, X, Lock, Upload, Sparkles,
  GripVertical, AlertTriangle, Check, Wand2,
} from 'lucide-react'
import type { PhotoSlot } from '../types'
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

/* ─── Traductions bannière — 7 langues ───────────────────────────────────── */

const BANNER_I18N: Record<Lang, { title: string; desc: string; btn: string }> = {
  fr: {
    title: "Vérifiez l'ordre de vos photos",
    desc:  'Réorganisez par glisser-déposer si besoin, puis choisissez votre fond et lancez le traitement.',
    btn:   'Traiter les photos — Supprimer le fond',
  },
  en: {
    title: 'Check your photo order',
    desc:  'Drag and drop to reorder if needed, then choose your background and start processing.',
    btn:   'Process photos — Remove background',
  },
  es: {
    title: 'Verifica el orden de tus fotos',
    desc:  'Reorganiza arrastrando si es necesario, elige tu fondo y lanza el procesamiento.',
    btn:   'Procesar fotos — Eliminar fondo',
  },
  de: {
    title: 'Überprüfe deine Fotoreihenfolge',
    desc:  'Bei Bedarf per Drag & Drop neu anordnen, Hintergrund wählen und Verarbeitung starten.',
    btn:   'Fotos verarbeiten — Hintergrund entfernen',
  },
  it: {
    title: "Verifica l'ordine delle foto",
    desc:  'Riorganizza con drag & drop se necessario, scegli lo sfondo e avvia l\'elaborazione.',
    btn:   'Elabora foto — Rimuovi sfondo',
  },
  nl: {
    title: "Controleer de volgorde van je foto's",
    desc:  'Herorden indien nodig via slepen, kies je achtergrond en start de verwerking.',
    btn:   "Foto's verwerken — Achtergrond verwijderen",
  },
  pl: {
    title: 'Sprawdź kolejność zdjęć',
    desc:  'Przeciągnij, aby zmienić kolejność, wybierz tło i uruchom przetwarzanie.',
    btn:   'Przetwórz zdjęcia — Usuń tło',
  },
}

/* ─── Traductions zone de dépôt / import — 7 langues ────────────────────── */

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
  bgPickerTitle: string
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
    bgPickerTitle:  'Fond de la photo principale',
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
    bgPickerTitle:  'Main photo background',
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
    bgPickerTitle:  'Fondo de la foto principal',
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
    bgPickerTitle:  'Hintergrund des Hauptfotos',
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
    bgPickerTitle:  'Sfondo della foto principale',
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
    bgPickerTitle:  'Achtergrond hoofdfoto',
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
    bgPickerTitle:  'Tło głównego zdjęcia',
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

/* ─── Traductions astuce — 7 langues ─────────────────────────────────────── */

const LOADING_I18N: Record<Lang, { removingBg: string; applyingBg: string; loading: string }> = {
  fr: { removingBg: 'Suppression fond…', applyingBg: 'Application fond…', loading: 'Chargement…' },
  en: { removingBg: 'Removing background…', applyingBg: 'Applying background…', loading: 'Loading…' },
  es: { removingBg: 'Eliminando fondo…', applyingBg: 'Aplicando fondo…', loading: 'Cargando…' },
  de: { removingBg: 'Hintergrund entfernen…', applyingBg: 'Hintergrund anwenden…', loading: 'Laden…' },
  it: { removingBg: 'Rimozione sfondo…', applyingBg: 'Applicazione sfondo…', loading: 'Caricamento…' },
  nl: { removingBg: 'Achtergrond verwijderen…', applyingBg: 'Achtergrond toepassen…', loading: 'Laden…' },
  pl: { removingBg: 'Usuwanie tła…', applyingBg: 'Stosowanie tła…', loading: 'Ładowanie…' },
}

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
  { id: 0, label: 'Blanc pur', type: 'color', color: '#FFFFFF', preview: '#FFFFFF' },
  ..._IMAGE_BACKGROUNDS,
]

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
          /* Couvre le canvas (cover) */
          const s  = Math.max(canvas.width / bgImg.naturalWidth, canvas.height / bgImg.naturalHeight)
          const bw = bgImg.naturalWidth  * s
          const bh = bgImg.naturalHeight * s
          ctx.drawImage(bgImg, (canvas.width - bw) / 2, (canvas.height - bh) / 2, bw, bh)
          draw()
        }
        bgImg.onerror = () => {
          /* Fallback blanc si image non trouvée */
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
  /* Section 1 — Non portées (0-8) */
  { id: 0,  label: 'Photo recto — à plat ou sur cintre',        badge: 'required',    type: 'garment', bgRemoval: 'free' },
  { id: 1,  label: 'Photo verso',                                badge: 'recommended', type: 'garment', bgRemoval: 'pro'  },
  { id: 2,  label: 'Autre vue non portée',                       badge: 'recommended', type: 'garment', bgRemoval: 'pro'  },
  { id: 3,  label: 'Étiquette marque',                           badge: 'recommended', type: 'label',   bgRemoval: 'none' },
  { id: 4,  label: 'Étiquette taille',                           badge: 'recommended', type: 'label',   bgRemoval: 'none' },
  { id: 5,  label: 'Étiquette compo.',                           badge: 'recommended', type: 'label',   bgRemoval: 'none' },
  { id: 6,  label: 'Autre photo (détail, défaut, emballage...)', badge: 'optional',    type: 'detail',  bgRemoval: 'none' },
  { id: 7,  label: 'Autre photo (détail, défaut, emballage...)', badge: 'optional',    type: 'detail',  bgRemoval: 'none' },
  { id: 8,  label: 'Autre photo (détail, défaut, emballage...)', badge: 'optional',    type: 'detail',  bgRemoval: 'none' },
  /* Section 2 — Portées (9-14) */
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

/* Assigne les slots selon le type détecté (ordre de priorité strict) :
   - flat   → 0, 1, 2 dans l'ordre ; débordement → 6, 7, 8
   - worn   → 9-14 dans l'ordre    ; débordement → 6, 7, 8
   - detail → slot exact (3-8) si libre ; sinon → 6, 7, 8 */
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
}

/* ─── Composant principal ─────────────────────────────────────────────────── */

export default function PhotoUploadStep({ slots, setSlots }: Props) {
  const { lang } = useLang()
  const [dragOverId, setDragOverId]           = useState<number | null>(null)
  const [isClassifying, setIsClassifying]     = useState(false)
  const [classifiedCount, setClassifiedCount] = useState<number | null>(null)
  const [overflowCount, setOverflowCount]     = useState(0)
  const [globalDragOver, setGlobalDragOver]   = useState(false)
  const [selectedBg, setSelectedBg]           = useState(0)
  const [showValidationBanner, setShowValidationBanner] = useState(false)

  /* URL du composite fond + cutout PNG pour le slot 0 */
  const [compositedUrl, setCompositedUrl]     = useState<string | null>(null)
  const [isCompositing, setIsCompositing]     = useState(false)

  const dragSourceId = useRef<number | null>(null)
  const slotsRef     = useRef<PhotoSlot[]>(slots)
  useEffect(() => { slotsRef.current = slots }, [slots])

  /* Charge la préférence fond depuis localStorage */
  useEffect(() => {
    const saved = localStorage.getItem('sellerlab_bg_choice')
    if (saved !== null) setSelectedBg(parseInt(saved) || 0)
  }, [])

  const handleBgSelect = (id: number) => {
    setSelectedBg(id)
    localStorage.setItem('sellerlab_bg_choice', String(id))
  }

  /* ── Compositing : se relance quand processedUrl ou fond change ── */
  const slot0ProcessedUrl = slots[0]?.processedUrl ?? null

  useEffect(() => {
    if (!slot0ProcessedUrl) { setCompositedUrl(null); return }

    let cancelled = false
    setIsCompositing(true)

    compositeWithBackground(slot0ProcessedUrl, BACKGROUNDS[selectedBg]).then((url) => {
      if (cancelled) { URL.revokeObjectURL(url); return }
      setCompositedUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev)
        return url
      })
    }).catch(() => {
      /* Fallback : affiche le PNG transparent */
    }).finally(() => {
      if (!cancelled) setIsCompositing(false)
    })

    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slot0ProcessedUrl, selectedBg])

  const mainPhotoHasBg  = slot0ProcessedUrl !== null
  const bannerI18n      = BANNER_I18N[lang] ?? BANNER_I18N.fr
  const tipI18n         = TIP_I18N[lang]    ?? TIP_I18N.fr
  const sectionTitles   = SECTION_TITLES[lang] ?? SECTION_TITLES.fr
  const dropI18n        = DROP_I18N[lang]    ?? DROP_I18N.fr
  const badgeI18n       = BADGE_I18N[lang]   ?? BADGE_I18N.fr
  const loadingI18n     = LOADING_I18N[lang] ?? LOADING_I18N.fr
  const filledCount     = slots.filter((s) => s.file !== null).length

  /* ── Met à jour un seul slot ── */
  const updateSlot = useCallback(
    (id: number, patch: Partial<PhotoSlot>) =>
      setSlots((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s))),
    [setSlots],
  )

  /* ── Charge un fichier dans un slot ── */
  const loadFileInSlot = useCallback(
    async (file: File, slotId: number, skipBgRemoval = false) => {
      const preview = URL.createObjectURL(file)
      updateSlot(slotId, { file, preview, status: 'uploading', processedUrl: null, error: undefined })
      await new Promise((r) => setTimeout(r, 200))

      const def = SLOT_DEFS[slotId as keyof typeof SLOT_DEFS] ?? SLOT_DEFS[0]

      if ((def as typeof SLOT_DEFS[0]).bgRemoval === 'free' && !skipBgRemoval) {
        updateSlot(slotId, { status: 'processing-bg' })
        try {
          const { removeBackground } = await import('@imgly/background-removal')
          const resultBlob = await removeBackground(file)
          updateSlot(slotId, { status: 'done', processedUrl: URL.createObjectURL(resultBlob) })
        } catch (err) {
          console.error('Background removal failed:', err)
          updateSlot(slotId, { status: 'done', processedUrl: null, error: 'bg_failed' })
        }
      } else {
        updateSlot(slotId, { status: 'done' })
      }
    },
    [updateSlot],
  )

  /* ── Validation : déclenche le remove-bg sur slot 0 ── */
  const handleValidateAndProcess = useCallback(async () => {
    const slot0 = slotsRef.current[0]
    if (slot0.file) {
      updateSlot(0, { status: 'processing-bg' })
      try {
        const { removeBackground } = await import('@imgly/background-removal')
        const resultBlob = await removeBackground(slot0.file)
        updateSlot(0, { status: 'done', processedUrl: URL.createObjectURL(resultBlob) })
      } catch (err) {
        console.error('Background removal failed:', err)
        updateSlot(0, { status: 'done', processedUrl: null, error: 'bg_failed' })
      }
    }
    setShowValidationBanner(false)
  }, [updateSlot])

  /* ── Upload multiple → classify → slots ── */
  const handleMultipleFiles = useCallback(
    async (files: File[]) => {
      if (!files.length) return
      setClassifiedCount(null)
      setOverflowCount(0)

      if (files.length === 1) {
        const firstEmpty = SLOT_DEFS.find((d) => !slotsRef.current[d.id]?.file)
        if (firstEmpty) loadFileInSlot(files[0], firstEmpty.id)
        return
      }

      setIsClassifying(true)
      try {
        const fd = new FormData()
        files.forEach((f) => fd.append('files', f))
        const res = await fetch('/api/classify-photos', { method: 'POST', body: fd })

        const rawResults: ClassifyResult[] = res.ok
          ? ((await res.json()) as { results: ClassifyResult[] }).results
          : files.map((_, i) => ({ fileIndex: i, type: 'flat' as const, detailSlot: 6 }))

        const taken = new Set<number>(
          slotsRef.current.map((s, i) => (s.file ? i : -1)).filter((i) => i >= 0),
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
      } catch {
        const empty = SLOT_DEFS.filter((d) => !slotsRef.current[d.id]?.file).map((d) => d.id)
        const batch = files.slice(0, empty.length)
        batch.forEach((f, i) => loadFileInSlot(f, empty[i], true))
        setClassifiedCount(batch.length)
        if (files.length > empty.length) setOverflowCount(files.length - empty.length)
      }

      setShowValidationBanner(true)
      setIsClassifying(false)
    },
    [loadFileInSlot],  // eslint-disable-line react-hooks/exhaustive-deps
  )

  /* ── Swap — désactivé après remove-bg ── */
  const swapSlots = useCallback(
    (sourceId: number, targetId: number) => {
      if (mainPhotoHasBg || sourceId === targetId) return
      setSlots((prev) => {
        const next = [...prev]
        next[sourceId] = { ...prev[targetId], id: sourceId }
        next[targetId] = { ...prev[sourceId], id: targetId }
        return next
      })
    },
    [setSlots, mainPhotoHasBg],
  )

  const clearSlot = useCallback(
    (slotId: number) =>
      setSlots((prev) =>
        prev.map((s) =>
          s.id === slotId
            ? { ...s, file: null, preview: null, processedUrl: null, status: 'empty', error: undefined }
            : s,
        ),
      ),
    [setSlots],
  )

  const handleGlobalDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setGlobalDragOver(false)
      if (e.dataTransfer.getData('slotId')) return
      const images = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/'))
      if (images.length) handleMultipleFiles(images)
    },
    [handleMultipleFiles],
  )

  /* ── Style CSS du fond pour la bannière preview ── */
  const bannerBgStyle: React.CSSProperties =
    BACKGROUNDS[selectedBg].type === 'color'
      ? { backgroundColor: (BACKGROUNDS[selectedBg] as { color: string }).color }
      : { backgroundImage: `url(${(BACKGROUNDS[selectedBg] as { src: string }).src})`, backgroundSize: 'cover', backgroundPosition: 'center' }

  return (
    <div className="space-y-3">

      {/* ── En-tête ── */}
      <div>
        <h2 className="font-display font-extrabold text-2xl text-gray-900 mb-1">
          {dropI18n.title}
        </h2>
        <p className="text-sm text-gray-500">
          {dropI18n.subtitle}
        </p>
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
                  e.target.files && handleMultipleFiles(Array.from(e.target.files).filter((f) => f.type.startsWith('image/')))
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
          <button onClick={() => setClassifiedCount(null)} className="ml-1 text-green-500 hover:text-green-700"><X className="w-3 h-3" /></button>
        </div>
      )}

      {/* Badge overflow */}
      {overflowCount > 0 && !isClassifying && (
        <div className="flex items-center gap-2 text-xs text-orange-700 bg-orange-50 border border-orange-200 rounded-xl px-4 py-2.5">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span className="font-semibold">
            {dropI18n.overflow(classifiedCount ?? 15, overflowCount)}
          </span>
          <button onClick={() => setOverflowCount(0)} className="ml-1 text-orange-400 hover:text-orange-700"><X className="w-3 h-3" /></button>
        </div>
      )}

      {/* ── Bannière de validation ── */}
      {showValidationBanner && !isClassifying && (
        <div className="rounded-2xl border-2 border-indigo-200 bg-indigo-50 p-5 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
              <Wand2 className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-base text-indigo-900 mb-0.5">{bannerI18n.title}</h3>
              <p className="text-sm text-indigo-700">{bannerI18n.desc}</p>
            </div>
            <button onClick={() => setShowValidationBanner(false)} className="ml-auto text-indigo-400 hover:text-indigo-600 transition-colors shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Fond + preview */}
          <div>
            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-2">
              {dropI18n.bgPickerTitle}
            </p>

            <div className="w-full h-16 rounded-xl overflow-hidden mb-3" style={bannerBgStyle} />

            <BgPickerGrid selectedBg={selectedBg} onSelect={handleBgSelect} />
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
            {SLOT_DEFS.slice(0, 3).map((def) => (
              <SlotCard
                key={def.id}
                def={def}
                slot={slots[def.id]}
                isDragOver={dragOverId === def.id}
                dragSourceId={dragSourceId}
                locked={mainPhotoHasBg}
                displayLabel={SLOT_LABELS[lang]?.[def.id] ?? def.label}
                badgeLabels={badgeI18n}
                loadingLabels={loadingI18n}
                overrideDisplayUrl={def.id === 0 ? (compositedUrl ?? undefined) : undefined}
                isCompositedDisplay={def.id === 0 && compositedUrl !== null}
                isCompositing={def.id === 0 && isCompositing}
                onFileSelected={(file) => loadFileInSlot(file, def.id)}
                onSwap={swapSlots}
                onClear={() => clearSlot(def.id)}
                onDragOverChange={(over) => setDragOverId(over ? def.id : null)}
              />
            ))}
          </div>
          <div className="grid grid-cols-6 gap-2">
            {SLOT_DEFS.slice(3, 9).map((def) => (
              <SlotCard
                key={def.id}
                def={def}
                slot={slots[def.id]}
                isDragOver={dragOverId === def.id}
                dragSourceId={dragSourceId}
                locked={mainPhotoHasBg}
                displayLabel={SLOT_LABELS[lang]?.[def.id] ?? def.label}
                badgeLabels={badgeI18n}
                loadingLabels={loadingI18n}
                onFileSelected={(file) => loadFileInSlot(file, def.id)}
                onSwap={swapSlots}
                onClear={() => clearSlot(def.id)}
                onDragOverChange={(over) => setDragOverId(over ? def.id : null)}
              />
            ))}
          </div>
        </div>

        {/* Sélecteur de fond (après remove-bg) */}
        {mainPhotoHasBg && !showValidationBanner && (
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Fond de la photo principale</p>
            <BgPickerGrid selectedBg={selectedBg} onSelect={handleBgSelect} />
          </div>
        )}

        {/* SECTION 2 — Photos portées (slots 9–14) */}
        <div>
          <p className="text-[10px] font-bold text-gray-400 tracking-widest mb-1.5">{sectionTitles.s2}</p>
          <div className="grid grid-cols-6 gap-2">
            {SLOT_DEFS.slice(9).map((def) => (
              <SlotCard
                key={def.id}
                def={def}
                slot={slots[def.id]}
                isDragOver={dragOverId === def.id}
                dragSourceId={dragSourceId}
                locked={mainPhotoHasBg}
                displayLabel={SLOT_LABELS[lang]?.[def.id] ?? def.label}
                badgeLabels={badgeI18n}
                loadingLabels={loadingI18n}
                onFileSelected={(file) => loadFileInSlot(file, def.id)}
                onSwap={swapSlots}
                onClear={() => clearSlot(def.id)}
                onDragOverChange={(over) => setDragOverId(over ? def.id : null)}
              />
            ))}
          </div>
        </div>

        {/* ── Astuce ── */}
        <p className="text-xs text-gray-400 text-center pb-2">
          {mainPhotoHasBg ? tipI18n.lock : tipI18n.unlock}
        </p>

      </div>{/* /max-w-[500px] */}
    </div>
  )
}

/* ─── BgPickerGrid ────────────────────────────────────────────────────────── */

function BgPickerGrid({ selectedBg, onSelect }: { selectedBg: number; onSelect: (id: number) => void }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 snap-x snap-mandatory">
      {BACKGROUNDS.map((bg) => (
        <button
          key={bg.id}
          onClick={() => onSelect(bg.id)}
          title={bg.label}
          className={`snap-start shrink-0 relative w-16 h-16 rounded-xl overflow-hidden transition-all ${
            selectedBg === bg.id
              ? 'ring-2 ring-indigo-500 ring-offset-2 scale-[1.06] shadow-md shadow-indigo-200'
              : 'ring-1 ring-gray-200 hover:ring-indigo-300'
          }`}
        >
          {bg.type === 'color' ? (
            <div className="w-full h-full" style={{ backgroundColor: bg.color }} />
          ) : (
            <img src={bg.src} alt={bg.label} className="w-full h-full object-cover" draggable={false} />
          )}
          {selectedBg === bg.id && (
            <div className="absolute inset-0 flex items-center justify-center bg-indigo-600/20">
              <Check className="w-4 h-4 text-white drop-shadow-md" />
            </div>
          )}
        </button>
      ))}
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
  loadingLabels: { removingBg: string; applyingBg: string; loading: string }
  overrideDisplayUrl?: string
  isCompositedDisplay?: boolean
  isCompositing?: boolean
  onFileSelected: (file: File) => void
  onSwap: (sourceId: number, targetId: number) => void
  onClear: () => void
  onDragOverChange: (over: boolean) => void
}

function SlotCard({
  def, slot, isDragOver, dragSourceId, locked = false, displayLabel, badgeLabels, loadingLabels,
  overrideDisplayUrl, isCompositedDisplay = false, isCompositing = false,
  onFileSelected, onSwap, onClear, onDragOverChange,
}: SlotCardProps) {
  const inputRef   = useRef<HTMLInputElement>(null)
  const isEmpty    = slot.status === 'empty'
  const isLoading  = slot.status === 'uploading' || slot.status === 'processing-bg'
  const hasBg      = slot.processedUrl !== null

  /* URL effective à afficher */
  const displayUrl = overrideDisplayUrl ?? (slot.processedUrl ?? slot.preview)

  /* Fond du container : damier pour PNG transparent */
  const containerStyle: React.CSSProperties =
    isCompositedDisplay || !hasBg
      ? {}
      : { background: 'repeating-conic-gradient(#e5e7eb 0% 25%, #f9fafb 0% 50%) 0 0 / 14px 14px' }

  /* Toujours object-cover avec hauteur fixe */
  const imgClass = 'object-cover'

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
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/'))
    if (files[0]) onFileSelected(files[0])
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={() => onDragOverChange(false)}
      onDrop={handleDrop}
      onClick={() => isEmpty && inputRef.current?.click()}
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
          className={`absolute inset-0 ${locked ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'}`}
          style={!isCompositedDisplay && displayUrl === slot.processedUrl ? containerStyle : undefined}
        >
          <img src={displayUrl} alt={displayLabel} className={`w-full h-full ${imgClass}`} draggable={false} />

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
                ✓ Fond supprimé
              </span>
            ) : slot.error === 'bg_failed' ? (
              <span className="bg-orange-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
                <AlertTriangle className="w-2 h-2" /> Fond indisponible
              </span>
            ) : (def as { bgRemoval: string }).bgRemoval === 'pro' ? (
              <span className="bg-indigo-600/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-sm shadow">
                <Lock className="w-2 h-2" /> Fond Pro
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

      {/* Badge ✦ slot 0 vide */}
      {def.id === 0 && isEmpty && (
        <div className="absolute top-1.5 left-1.5">
          <div className="w-4 h-4 rounded-full bg-indigo-600 flex items-center justify-center">
            <span className="text-white text-[8px] font-extrabold leading-none">✦</span>
          </div>
        </div>
      )}
    </div>
  )
}
