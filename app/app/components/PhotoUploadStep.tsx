'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import {
  Camera, Tag, X, Lock, Upload, Sparkles,
  GripVertical, AlertTriangle, Check, Wand2,
} from 'lucide-react'
import type { PhotoSlot } from '../types'
import type { Lang } from '@/lib/i18n'
import { useLang } from '@/app/providers'

/* ─── Labels des 14 slots — 7 langues ────────────────────────────────────── */

const SLOT_LABELS: Record<Lang, string[]> = {
  fr: [
    'Photo recto (cintre/à plat)', 'Photo verso (cintre/à plat)',
    'Vue 1', 'Vue 2', 'Vue 3', 'Vue 4', 'Vue 5', 'Vue 6',
    'Étiquette marque', 'Étiquette taille', 'Étiquette compo.',
    'Autre détail', 'Défaut', 'Emballage',
  ],
  en: [
    'Front (flat/hanger)', 'Back (flat/hanger)',
    'View 1', 'View 2', 'View 3', 'View 4', 'View 5', 'View 6',
    'Brand label', 'Size label', 'Care label',
    'Other detail', 'Flaw', 'Packaging',
  ],
  es: [
    'Foto frontal (plano/percha)', 'Foto trasera (plano/percha)',
    'Vista 1', 'Vista 2', 'Vista 3', 'Vista 4', 'Vista 5', 'Vista 6',
    'Etiqueta marca', 'Etiqueta talla', 'Etiqueta compos.',
    'Otro detalle', 'Defecto', 'Embalaje',
  ],
  de: [
    'Vorderfoto (flach/Bügel)', 'Rückseite (flach/Bügel)',
    'Ansicht 1', 'Ansicht 2', 'Ansicht 3', 'Ansicht 4', 'Ansicht 5', 'Ansicht 6',
    'Markenetikett', 'Größenetikett', 'Pflegeetikett',
    'Anderes Detail', 'Mangel', 'Verpackung',
  ],
  it: [
    'Foto fronte (piano/gruccia)', 'Foto retro (piano/gruccia)',
    'Vista 1', 'Vista 2', 'Vista 3', 'Vista 4', 'Vista 5', 'Vista 6',
    'Etich. marca', 'Etich. taglia', 'Etich. composiz.',
    'Altro dettaglio', 'Difetto', 'Imballaggio',
  ],
  nl: [
    'Voorkant (plat/hanger)', 'Achterkant (plat/hanger)',
    'Aanzicht 1', 'Aanzicht 2', 'Aanzicht 3', 'Aanzicht 4', 'Aanzicht 5', 'Aanzicht 6',
    'Merklabel', 'Maatlabel', 'Samenst. label',
    'Ander detail', 'Gebrek', 'Verpakking',
  ],
  pl: [
    'Przód (płasko/wieszak)', 'Tył (płasko/wieszak)',
    'Widok 1', 'Widok 2', 'Widok 3', 'Widok 4', 'Widok 5', 'Widok 6',
    'Etykieta marki', 'Etykieta rozm.', 'Etykieta skład',
    'Inny detal', 'Wada', 'Opakowanie',
  ],
}

/* ─── Traductions bannière de validation — 7 langues ─────────────────────── */

const BANNER_I18N: Record<Lang, { title: string; desc: string; btn: string }> = {
  fr: {
    title: 'Vérifiez l\'ordre de vos photos',
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
    title: 'Verifica l\'ordine delle foto',
    desc:  'Riorganizza con drag & drop se necessario, scegli lo sfondo e avvia l\'elaborazione.',
    btn:   'Elabora foto — Rimuovi sfondo',
  },
  nl: {
    title: 'Controleer de volgorde van je foto\'s',
    desc:  'Herorden indien nodig via slepen, kies je achtergrond en start de verwerking.',
    btn:   'Foto\'s verwerken — Achtergrond verwijderen',
  },
  pl: {
    title: 'Sprawdź kolejność zdjęć',
    desc:  'Przeciągnij, aby zmienić kolejność, wybierz tło i uruchom przetwarzanie.',
    btn:   'Przetwórz zdjęcia — Usuń tło',
  },
}

/* ─── Traductions astuce bas de page — 7 langues ─────────────────────────── */

const TIP_I18N: Record<Lang, { unlock: string; lock: string }> = {
  fr: {
    unlock: 'Glissez-déposez entre les slots pour réorganiser · Cliquez sur un slot pour uploader',
    lock:   'Photos figées (fond supprimé) · Cliquez sur un slot pour remplacer une photo',
  },
  en: {
    unlock: 'Drag and drop between slots to reorder · Click a slot to upload',
    lock:   'Photos locked (background removed) · Click a slot to replace a photo',
  },
  es: {
    unlock: 'Arrastra entre slots para reorganizar · Haz clic en un slot para subir',
    lock:   'Fotos bloqueadas (fondo eliminado) · Haz clic en un slot para reemplazar',
  },
  de: {
    unlock: 'Zwischen Slots ziehen zum Umordnen · Slot klicken zum Hochladen',
    lock:   'Fotos gesperrt (Hintergrund entfernt) · Slot klicken zum Ersetzen',
  },
  it: {
    unlock: 'Trascina tra i slot per riordinare · Clicca uno slot per caricare',
    lock:   'Foto bloccate (sfondo rimosso) · Clicca uno slot per sostituire',
  },
  nl: {
    unlock: 'Sleep tussen slots om te herordenen · Klik op een slot om te uploaden',
    lock:   'Foto\'s vergrendeld (achtergrond verwijderd) · Klik om te vervangen',
  },
  pl: {
    unlock: 'Przeciągnij między slotami aby zmienić kolejność · Kliknij slot aby przesłać',
    lock:   'Zdjęcia zablokowane (tło usunięte) · Kliknij slot aby zastąpić zdjęcie',
  },
}

/* ─── 5 fonds disponibles ─────────────────────────────────────────────────── */

const BACKGROUNDS = [
  {
    id:      0,
    label:   'Blanc pur',
    preview: '#ffffff',
    style:   { background: '#ffffff' } as React.CSSProperties,
  },
  {
    id:      1,
    label:   'Studio gris',
    preview: '#c8c8c8',
    style:   { background: 'linear-gradient(165deg, #e8e8e8 0%, #a0a0a0 100%)' } as React.CSSProperties,
  },
  {
    id:      2,
    label:   'Scandinave',
    preview: '#ede8df',
    style:   { backgroundImage: 'url(https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=80)', backgroundSize: 'cover', backgroundPosition: 'center' } as React.CSSProperties,
  },
  {
    id:      3,
    label:   'Showroom',
    preview: '#e6d0b8',
    style:   { backgroundImage: 'url(https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80)', backgroundSize: 'cover', backgroundPosition: 'center' } as React.CSSProperties,
  },
  {
    id:      4,
    label:   'Nature',
    preview: '#8ec98e',
    style:   { backgroundImage: 'url(https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&auto=format&fit=crop&q=80)', backgroundSize: 'cover', backgroundPosition: 'center' } as React.CSSProperties,
  },
] as const

/* ─── Définition des 14 slots ─────────────────────────────────────────────── */

const SLOT_DEFS = [
  /* Section Cintre / À plat */
  { id: 0,  label: 'Photo recto — à plat ou sur cintre', badge: 'required',    type: 'garment', bgRemoval: 'free' },
  { id: 1,  label: 'Photo verso',                         badge: 'recommended', type: 'garment', bgRemoval: 'pro'  },
  /* Section Photos portées & supplémentaires */
  { id: 2,  label: 'Vue portée 1',                        badge: 'recommended', type: 'garment', bgRemoval: 'pro'  },
  { id: 3,  label: 'Vue portée 2',                        badge: 'recommended', type: 'garment', bgRemoval: 'pro'  },
  { id: 4,  label: 'Vue portée 3',                        badge: 'recommended', type: 'garment', bgRemoval: 'pro'  },
  { id: 5,  label: 'Vue portée 4',                        badge: 'recommended', type: 'garment', bgRemoval: 'pro'  },
  { id: 6,  label: 'Vue portée 5',                        badge: 'optional',    type: 'garment', bgRemoval: 'pro'  },
  { id: 7,  label: 'Vue portée 6',                        badge: 'optional',    type: 'garment', bgRemoval: 'pro'  },
  /* Section Étiquettes & Détails */
  { id: 8,  label: 'Étiquette marque',                    badge: 'recommended', type: 'label',   bgRemoval: 'none' },
  { id: 9,  label: 'Étiquette taille',                    badge: 'recommended', type: 'label',   bgRemoval: 'none' },
  { id: 10, label: 'Étiquette compo.',                    badge: 'recommended', type: 'label',   bgRemoval: 'none' },
  { id: 11, label: 'Autre détail',                        badge: 'optional',    type: 'detail',  bgRemoval: 'none' },
  { id: 12, label: 'Défaut',                              badge: 'optional',    type: 'detail',  bgRemoval: 'none' },
  { id: 13, label: 'Emballage',                           badge: 'optional',    type: 'detail',  bgRemoval: 'none' },
] as const

type SlotDef = (typeof SLOT_DEFS)[number]

/* ─── Props ───────────────────────────────────────────────────────────────── */

interface Props {
  slots: PhotoSlot[]
  setSlots: React.Dispatch<React.SetStateAction<PhotoSlot[]>>
}

/* ─── Composant principal ─────────────────────────────────────────────────── */

export default function PhotoUploadStep({ slots, setSlots }: Props) {
  const { lang } = useLang()
  const [dragOverId, setDragOverId]       = useState<number | null>(null)
  const [isClassifying, setIsClassifying] = useState(false)
  const [classifiedCount, setClassifiedCount] = useState<number | null>(null)
  const [globalDragOver, setGlobalDragOver]   = useState(false)
  const [selectedBg, setSelectedBg]       = useState(0)

  /* Bannière de validation avant traitement (remove-bg) */
  const [showValidationBanner, setShowValidationBanner] = useState(false)

  const dragSourceId = useRef<number | null>(null)
  const slotsRef = useRef<PhotoSlot[]>(slots)
  useEffect(() => { slotsRef.current = slots }, [slots])

  useEffect(() => {
    const saved = localStorage.getItem('sl-bg-preference')
    if (saved !== null) setSelectedBg(parseInt(saved) || 0)
  }, [])

  const handleBgSelect = (id: number) => {
    setSelectedBg(id)
    localStorage.setItem('sl-bg-preference', String(id))
  }

  /* Quand slot 0 a son fond supprimé, toutes les photos sont figées */
  const mainPhotoHasBg  = slots[0]?.processedUrl !== null
  const selectedBgStyle = BACKGROUNDS[selectedBg].style
  const bannerI18n      = BANNER_I18N[lang] ?? BANNER_I18N.fr
  const tipI18n         = TIP_I18N[lang]    ?? TIP_I18N.fr
  const filledCount     = slots.filter((s) => s.file !== null).length

  /* ── Met à jour un seul slot ── */
  const updateSlot = useCallback(
    (id: number, patch: Partial<PhotoSlot>) =>
      setSlots((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s))),
    [setSlots]
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
          const processedUrl = URL.createObjectURL(resultBlob)
          updateSlot(slotId, { status: 'done', processedUrl })
        } catch (err) {
          console.warn('[PhotoUpload] Suppression fond échouée :', err)
          updateSlot(slotId, { status: 'done', processedUrl: null, error: 'bg_failed' })
        }
      } else {
        updateSlot(slotId, { status: 'done' })
      }
    },
    [updateSlot]
  )

  /* ── Validation et lancement du remove-bg sur slot 0 ── */
  const handleValidateAndProcess = useCallback(async () => {
    const slot0 = slotsRef.current[0]

    if (slot0.file) {
      updateSlot(0, { status: 'processing-bg' })
      try {
        const { removeBackground } = await import('@imgly/background-removal')
        const resultBlob = await removeBackground(slot0.file)
        const processedUrl = URL.createObjectURL(resultBlob)
        updateSlot(0, { status: 'done', processedUrl })
      } catch (err) {
        console.warn('[PhotoUpload] Suppression fond échouée :', err)
        updateSlot(0, { status: 'done', processedUrl: null, error: 'bg_failed' })
      }
    }

    setShowValidationBanner(false)
  }, [updateSlot])

  /* ── Upload multiple → classify → distribue dans les slots ── */
  const handleMultipleFiles = useCallback(
    async (files: File[]) => {
      if (!files.length) return
      setClassifiedCount(null)

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

        if (res.ok) {
          const { results } = (await res.json()) as {
            results: { fileIndex: number; slotIndex: number }[]
          }

          const hasSlot0 = results.some((r) => r.slotIndex === 0)
          if (!hasSlot0) {
            const candidate =
              results.find((r) => r.slotIndex === 2) ??
              results.find((r) => r.slotIndex === 3)
            if (candidate) candidate.slotIndex = 0
          }

          const taken = new Set<number>(
            slotsRef.current
              .map((s, i) => (s.file ? i : -1))
              .filter((i) => i >= 0)
          )

          const assignments: { file: File; slotId: number }[] = []

          for (const { fileIndex, slotIndex } of results) {
            if (fileIndex >= files.length) continue
            let target = slotIndex

            if (taken.has(target)) {
              const next = SLOT_DEFS.find((d) => !taken.has(d.id))
              if (!next) continue
              target = next.id
            }
            taken.add(target)
            assignments.push({ file: files[fileIndex], slotId: target })
          }

          assignments.forEach(({ file, slotId }) => loadFileInSlot(file, slotId, true))
          setClassifiedCount(assignments.length)
          setShowValidationBanner(true)
        } else {
          const empty = SLOT_DEFS.filter((d) => !slotsRef.current[d.id]?.file).map((d) => d.id)
          files.slice(0, empty.length).forEach((f, i) => loadFileInSlot(f, empty[i], true))
          setClassifiedCount(Math.min(files.length, empty.length))
          setShowValidationBanner(true)
        }
      } catch {
        const empty = SLOT_DEFS.filter((d) => !slotsRef.current[d.id]?.file).map((d) => d.id)
        files.slice(0, empty.length).forEach((f, i) => loadFileInSlot(f, empty[i], true))
        setClassifiedCount(Math.min(files.length, empty.length))
        setShowValidationBanner(true)
      }

      setIsClassifying(false)
    },
    [loadFileInSlot]
  )

  /* ── Permute deux slots (désactivé si photos figées) ── */
  const swapSlots = useCallback(
    (sourceId: number, targetId: number) => {
      if (mainPhotoHasBg) return
      if (sourceId === targetId) return
      setSlots((prev) => {
        const next = [...prev]
        next[sourceId] = { ...prev[targetId], id: sourceId }
        next[targetId] = { ...prev[sourceId], id: targetId }
        return next
      })
    },
    [setSlots, mainPhotoHasBg]
  )

  /* ── Vide un slot ── */
  const clearSlot = useCallback(
    (slotId: number) =>
      setSlots((prev) =>
        prev.map((s) =>
          s.id === slotId
            ? { ...s, file: null, preview: null, processedUrl: null, status: 'empty', error: undefined }
            : s
        )
      ),
    [setSlots]
  )

  /* ── Drop sur la zone globale ── */
  const handleGlobalDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setGlobalDragOver(false)
    if (e.dataTransfer.getData('slotId')) return
    const images = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/'))
    if (images.length) handleMultipleFiles(images)
  }, [handleMultipleFiles])

  return (
    <div className="space-y-5">

      {/* ── En-tête ── */}
      <div>
        <h2 className="font-display font-extrabold text-2xl text-gray-900 mb-1">
          Photos de l&apos;article
        </h2>
        <p className="text-sm text-gray-500">
          Ajoutez jusqu&apos;à 14 photos.{' '}
          <span className="font-semibold text-gray-700">La photo principale est obligatoire</span>
          {' '}— l&apos;IA supprime automatiquement son fond.
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
            <p className="text-sm font-semibold text-indigo-600">Classification IA en cours…</p>
            <p className="text-xs text-gray-400">
              L&apos;IA identifie chaque vue et place les photos dans les bons slots
            </p>
          </div>
        ) : globalDragOver ? (
          <div className="flex flex-col items-center gap-2 py-1">
            <Sparkles className="w-7 h-7 text-indigo-500" />
            <p className="text-sm font-semibold text-indigo-600">Déposez les photos ici</p>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) =>
                  e.target.files &&
                  handleMultipleFiles(
                    Array.from(e.target.files).filter((f) => f.type.startsWith('image/'))
                  )
                }
              />
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-5 py-2.5 hover:border-indigo-300 hover:shadow-sm transition-all text-sm font-semibold text-gray-700 select-none">
                <Upload className="w-4 h-4" />
                Importer plusieurs photos
              </div>
            </label>
            <p className="text-xs text-gray-400">
              ou glissez-déposez · l&apos;IA classe chaque vue automatiquement
            </p>
          </div>
        )}
      </div>

      {/* Badge confirmation classification */}
      {classifiedCount !== null && !isClassifying && !showValidationBanner && (
        <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5 w-fit">
          <Check className="w-3.5 h-3.5 shrink-0" />
          <span className="font-semibold">{classifiedCount} photo{classifiedCount > 1 ? 's' : ''} classée{classifiedCount > 1 ? 's' : ''} par l&apos;IA</span>
          <button onClick={() => setClassifiedCount(null)} className="ml-1 text-green-500 hover:text-green-700">
            <X className="w-3 h-3" />
          </button>
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
              <h3 className="font-display font-extrabold text-base text-indigo-900 mb-0.5">
                {bannerI18n.title}
              </h3>
              <p className="text-sm text-indigo-700">{bannerI18n.desc}</p>
            </div>
            <button
              onClick={() => setShowValidationBanner(false)}
              className="ml-auto text-indigo-400 hover:text-indigo-600 transition-colors shrink-0"
              title="Ignorer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div>
            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-2">
              Fond de la photo principale
            </p>

            {/* Prévisualisation fond en temps réel */}
            {slots[0]?.preview && (
              <div
                className="w-full h-28 rounded-xl overflow-hidden mb-3"
                style={BACKGROUNDS[selectedBg].style}
              >
                <img
                  src={slots[0].processedUrl ?? slots[0].preview}
                  alt="Prévisualisation"
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            <div className="flex gap-3 flex-wrap">
              {BACKGROUNDS.map((bg) => (
                <button
                  key={bg.id}
                  onClick={() => handleBgSelect(bg.id)}
                  className="flex flex-col items-center gap-1.5 group"
                  title={bg.label}
                >
                  <div
                    className={`w-10 h-10 rounded-full border-2 transition-all relative ${
                      selectedBg === bg.id
                        ? 'border-indigo-500 scale-110 shadow-md shadow-indigo-200'
                        : 'border-white/60 group-hover:border-indigo-300'
                    }`}
                    style={bg.id <= 1 ? bg.style : { background: bg.preview }}
                  >
                    {selectedBg === bg.id && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Check
                          className="w-4 h-4 drop-shadow"
                          style={{ color: bg.id >= 2 ? '#5a3e28' : '#374151' }}
                        />
                      </div>
                    )}
                  </div>
                  <span className={`text-[10px] font-semibold leading-tight text-center max-w-[52px] ${
                    selectedBg === bg.id ? 'text-indigo-700' : 'text-indigo-400'
                  }`}>
                    {bg.label}
                  </span>
                </button>
              ))}
            </div>
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

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* SECTION 1 — Cintre / À plat (slots 0–1) — taille réduite         */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Cintre / À plat · 2 photos
          </p>
          {filledCount > 0 && (
            <p className="text-xs text-gray-400 font-medium">{filledCount}/14 remplis</p>
          )}
        </div>
        {/* Largeur limitée : cartes ~130px au lieu de demi-écran */}
        <div className="grid grid-cols-2 gap-2.5 max-w-[280px]">
          {SLOT_DEFS.slice(0, 2).map((def) => (
            <SlotCard
              key={def.id}
              def={def}
              slot={slots[def.id]}
              isDragOver={dragOverId === def.id}
              dragSourceId={dragSourceId}
              bgStyle={selectedBgStyle}
              locked={mainPhotoHasBg}
              displayLabel={SLOT_LABELS[lang]?.[def.id] ?? def.label}
              onFileSelected={(file) => loadFileInSlot(file, def.id)}
              onSwap={swapSlots}
              onClear={() => clearSlot(def.id)}
              onDragOverChange={(over) => setDragOverId(over ? def.id : null)}
            />
          ))}
        </div>
      </div>

      {/* Sélecteur de fond (visible après remove-bg, bannière fermée) */}
      {mainPhotoHasBg && !showValidationBanner && (
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
            Fond de la photo principale
          </p>
          <div className="flex gap-3 flex-wrap">
            {BACKGROUNDS.map((bg) => (
              <button
                key={bg.id}
                onClick={() => handleBgSelect(bg.id)}
                className="flex flex-col items-center gap-1.5 group"
                title={bg.label}
              >
                <div
                  className={`w-10 h-10 rounded-full border-2 transition-all relative ${
                    selectedBg === bg.id
                      ? 'border-indigo-500 scale-110 shadow-md shadow-indigo-200'
                      : 'border-gray-200 group-hover:border-gray-400'
                  }`}
                  style={bg.id <= 1 ? bg.style : { background: bg.preview }}
                >
                  {selectedBg === bg.id && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Check
                        className="w-4 h-4 drop-shadow"
                        style={{ color: bg.id >= 2 ? '#5a3e28' : '#374151' }}
                      />
                    </div>
                  )}
                </div>
                <span className={`text-[10px] font-semibold leading-tight text-center max-w-[52px] ${
                  selectedBg === bg.id ? 'text-indigo-600' : 'text-gray-400'
                }`}>
                  {bg.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* SECTION 2 — Photos portées & supplémentaires (slots 2–7) — 3+3   */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
          Photos portées &amp; supplémentaires · 6 photos
        </p>
        <div className="grid grid-cols-3 gap-2.5">
          {SLOT_DEFS.slice(2, 8).map((def) => (
            <SlotCard
              key={def.id}
              def={def}
              slot={slots[def.id]}
              isDragOver={dragOverId === def.id}
              dragSourceId={dragSourceId}
              locked={mainPhotoHasBg}
              displayLabel={SLOT_LABELS[lang]?.[def.id] ?? def.label}
              onFileSelected={(file) => loadFileInSlot(file, def.id)}
              onSwap={swapSlots}
              onClear={() => clearSlot(def.id)}
              onDragOverChange={(over) => setDragOverId(over ? def.id : null)}
            />
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* SECTION 3 — Étiquettes & Détails (slots 8–13) — 3+3              */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
          Étiquettes &amp; Détails · 6 photos
        </p>
        <div className="grid grid-cols-3 gap-2.5">
          {SLOT_DEFS.slice(8).map((def) => (
            <SlotCard
              key={def.id}
              def={def}
              slot={slots[def.id]}
              isDragOver={dragOverId === def.id}
              dragSourceId={dragSourceId}
              locked={mainPhotoHasBg}
              displayLabel={SLOT_LABELS[lang]?.[def.id] ?? def.label}
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
    </div>
  )
}

/* ─── Slot Card ───────────────────────────────────────────────────────────── */

interface SlotCardProps {
  def: SlotDef
  slot: PhotoSlot
  isDragOver: boolean
  dragSourceId: React.MutableRefObject<number | null>
  bgStyle?: React.CSSProperties
  locked?: boolean
  displayLabel: string
  onFileSelected: (file: File) => void
  onSwap: (sourceId: number, targetId: number) => void
  onClear: () => void
  onDragOverChange: (over: boolean) => void
}

function SlotCard({
  def, slot, isDragOver, dragSourceId, bgStyle, locked = false, displayLabel,
  onFileSelected, onSwap, onClear, onDragOverChange,
}: SlotCardProps) {
  const inputRef  = useRef<HTMLInputElement>(null)
  const isEmpty   = slot.status === 'empty'
  const isLoading = slot.status === 'uploading' || slot.status === 'processing-bg'
  const hasBg     = slot.processedUrl !== null
  const displayUrl = slot.processedUrl ?? slot.preview

  const BADGE = {
    required:    { label: 'Obligatoire', cls: 'bg-indigo-100 text-indigo-700' },
    recommended: { label: 'Recommandé',  cls: 'bg-gray-100 text-gray-500'    },
    optional:    { label: 'Optionnel',   cls: 'bg-gray-50 text-gray-400'     },
  } as const

  const containerStyle: React.CSSProperties = hasBg && bgStyle
    ? bgStyle
    : hasBg
    ? { background: '#ffffff' }
    : { background: 'repeating-conic-gradient(#e5e7eb 0% 25%, #f9fafb 0% 50%) 0 0 / 14px 14px' }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    /* N'accepte le highlight de drop que pour les swaps entre slots si non figé */
    if (!locked && dragSourceId.current !== null && dragSourceId.current !== def.id) {
      onDragOverChange(true)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onDragOverChange(false)
    const sourceId = e.dataTransfer.getData('slotId')
    /* Swap inter-slots : uniquement si photos non figées */
    if (sourceId !== '') {
      if (!locked) onSwap(parseInt(sourceId), def.id)
      return
    }
    /* Drop fichier depuis l'OS : toujours autorisé */
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/'))
    if (files[0]) onFileSelected(files[0])
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={() => onDragOverChange(false)}
      onDrop={handleDrop}
      onClick={() => isEmpty && inputRef.current?.click()}
      className={`relative aspect-square rounded-xl overflow-hidden transition-all duration-150 group ${
        isDragOver && !locked
          ? 'ring-2 ring-indigo-500 ring-offset-2 scale-[1.04]'
          : isEmpty
          ? 'border-2 border-dashed border-gray-200 hover:border-indigo-300 bg-gray-50 hover:bg-indigo-50/30 cursor-pointer'
          : 'border border-gray-200 shadow-sm'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) onFileSelected(f); e.target.value = '' }}
      />

      {/* ── Vide ── */}
      {isEmpty && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 p-2 select-none">
          {def.type === 'label' || def.type === 'detail'
            ? <Tag    className="w-5 h-5 text-gray-300 group-hover:text-indigo-300 transition-colors" />
            : <Camera className="w-5 h-5 text-gray-300 group-hover:text-indigo-300 transition-colors" />
          }
          <span className="text-[10px] font-semibold text-gray-400 text-center leading-tight px-1">
            {displayLabel}
          </span>
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${BADGE[def.badge].cls}`}>
            {BADGE[def.badge].label}
          </span>
        </div>
      )}

      {/* ── Chargement ── */}
      {isLoading && (
        <div className="absolute inset-0 bg-white flex flex-col items-center justify-center gap-2 select-none">
          <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-[10px] text-gray-400 font-medium text-center px-2">
            {slot.status === 'processing-bg' ? 'Suppression fond…' : 'Chargement…'}
          </span>
        </div>
      )}

      {/* ── Photo chargée ── */}
      {displayUrl && !isLoading && (
        <div
          /* Drag désactivé quand photos figées */
          draggable={!locked}
          onDragStart={locked ? undefined : (e) => {
            e.stopPropagation()
            e.dataTransfer.setData('slotId', String(def.id))
            e.dataTransfer.effectAllowed = 'move'
            dragSourceId.current = def.id
          }}
          onDragEnd={locked ? undefined : () => { dragSourceId.current = null }}
          className={`absolute inset-0 ${locked ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'}`}
          style={displayUrl === slot.processedUrl ? containerStyle : undefined}
        >
          <img
            src={displayUrl}
            alt={displayLabel}
            className={`w-full h-full ${hasBg ? 'object-contain p-1' : 'object-cover'}`}
            draggable={false}
          />

          {/* Overlay survol */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          <div className="absolute top-1.5 inset-x-1.5 flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="bg-black/60 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded backdrop-blur-sm leading-tight">
              {displayLabel}
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); onClear() }}
              className="w-5 h-5 bg-black/60 hover:bg-red-500 text-white rounded-full flex items-center justify-center transition-colors shrink-0"
              title="Supprimer"
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

          {/* Icône déplacement — masquée quand figé */}
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
