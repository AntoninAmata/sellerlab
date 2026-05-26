'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import {
  Camera, Tag, X, Lock, Upload, Sparkles,
  GripVertical, AlertTriangle, Check,
} from 'lucide-react'
import type { PhotoSlot } from '../types'
import type { Lang } from '@/lib/i18n'
import { useLang } from '@/app/providers'

/* ─── Labels des slots — 7 langues ───────────────────────────────────────── */

const SLOT_LABELS: Record<Lang, string[]> = {
  fr: ['Photo recto (cintre/à plat)', 'Photo verso (cintre/à plat)', 'Photo portée 1',     'Photo portée 2',     'Photo portée 3',   'Photo portée 4',   'Étiquette marque', 'Étiquette taille', 'Étiquette compo.', 'Défaut / détail'   ],
  en: ['Front photo (flat/hanger)',   'Back photo (flat/hanger)', 'Worn — front 1',     'Worn — front 2',     'Worn — side',      'Worn — back',      'Brand label',      'Size label',       'Care label',       'Flaw / detail'     ],
  es: ['Foto frontal (plano/percha)', 'Foto trasera (plano/percha)', 'Puesto frente 1',    'Puesto frente 2',    'Puesto lateral',   'Puesto espalda',   'Etiqueta marca',   'Etiqueta talla',   'Etiqueta compos.', 'Defecto / detalle' ],
  de: ['Vorderfoto (flach/Bügel)',    'Rückseite (flach/Bügel)',   'Getragen vorne 1',   'Getragen vorne 2',   'Getragen seitl.',  'Getragen hinten',  'Markenetikett',    'Größenetikett',    'Pflegeetikett',    'Mangel / Detail'   ],
  it: ['Foto fronte (piano/gruccia)', 'Foto retro (piano/gruccia)', 'Indossato fronte 1', 'Indossato fronte 2', 'Indossato lat.',   'Indossato retro',  'Etich. marca',     'Etich. taglia',    'Etich. composiz.', 'Difetto / dett.'   ],
  nl: ['Voorkant (plat/hanger)',      'Achterkant (plat/hanger)',  'Gedragen voor 1',    'Gedragen voor 2',    'Gedragen zijkant', 'Gedragen rug',     'Merklabel',        'Maatlabel',        'Samenst. label',   'Gebrek / detail'   ],
  pl: ['Przód (płasko/wieszak)',      'Tył (płasko/wieszak)',      'Ubrane przód 1',     'Ubrane przód 2',     'Ubrane bok',       'Ubrane tył',       'Etykieta marki',   'Etykieta rozm.',   'Etykieta skład',   'Wada / detal'      ],
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

/* ─── Définition des 10 slots ─────────────────────────────────────────────── */

const SLOT_DEFS = [
  { id: 0, label: 'Photo recto — à plat ou sur cintre', badge: 'required',    type: 'garment', bgRemoval: 'free' },
  { id: 1, label: 'Photo verso',      badge: 'recommended', type: 'garment', bgRemoval: 'pro'  },
  { id: 2, label: 'Photo portée 1',  badge: 'recommended', type: 'garment', bgRemoval: 'pro'  },
  { id: 3, label: 'Photo portée 2',  badge: 'recommended', type: 'garment', bgRemoval: 'pro'  },
  { id: 4, label: 'Photo portée 3',  badge: 'recommended', type: 'garment', bgRemoval: 'pro'  },
  { id: 5, label: 'Photo portée 4',  badge: 'recommended', type: 'garment', bgRemoval: 'pro'  },
  { id: 6, label: 'Étiquette marque',badge: 'recommended', type: 'label',   bgRemoval: 'none' },
  { id: 7, label: 'Étiquette taille',badge: 'recommended', type: 'label',   bgRemoval: 'none' },
  { id: 8, label: 'Étiquette compo.',badge: 'recommended', type: 'label',   bgRemoval: 'none' },
  { id: 9, label: 'Défaut / détail', badge: 'optional',    type: 'detail',  bgRemoval: 'none' },
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

  const dragSourceId = useRef<number | null>(null)
  // Référence toujours à jour des slots pour éviter les stale closures dans les callbacks async
  const slotsRef = useRef<PhotoSlot[]>(slots)
  useEffect(() => { slotsRef.current = slots }, [slots])

  // Charge la préférence fond depuis localStorage (côté client uniquement)
  useEffect(() => {
    const saved = localStorage.getItem('sl-bg-preference')
    if (saved !== null) setSelectedBg(parseInt(saved) || 0)
  }, [])

  const handleBgSelect = (id: number) => {
    setSelectedBg(id)
    localStorage.setItem('sl-bg-preference', String(id))
  }

  /* ── Met à jour un seul slot ── */
  const updateSlot = useCallback(
    (id: number, patch: Partial<PhotoSlot>) =>
      setSlots((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s))),
    [setSlots]
  )

  /* ── Charge un fichier dans un slot + déclenche la suppression de fond si slot 0 ── */
  const loadFileInSlot = useCallback(
    async (file: File, slotId: number) => {
      const preview = URL.createObjectURL(file)
      updateSlot(slotId, { file, preview, status: 'uploading', processedUrl: null, error: undefined })

      await new Promise((r) => setTimeout(r, 200))

      const def = SLOT_DEFS[slotId]

      if (def.bgRemoval === 'free') {
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

  /* ── Upload multiple → classify → distribue dans les slots ── */
  const handleMultipleFiles = useCallback(
    async (files: File[]) => {
      if (!files.length) return
      setClassifiedCount(null)

      // Un seul fichier → premier slot vide sans classification
      if (files.length === 1) {
        const firstEmpty = SLOT_DEFS.find((d) => !slotsRef.current[d.id].file)
        if (firstEmpty) loadFileInSlot(files[0], firstEmpty.id)
        return
      }

      setIsClassifying(true)
      console.group('[PhotoUpload] Classification IA')
      console.log(`${files.length} fichiers à classifier`)

      try {
        const fd = new FormData()
        files.forEach((f) => fd.append('files', f))

        const res = await fetch('/api/classify-photos', { method: 'POST', body: fd })

        if (res.ok) {
          const { results } = (await res.json()) as {
            results: { fileIndex: number; slotIndex: number }[]
          }
          console.log('Résultats API :', results)

          // Fallback slot 0 : si aucune photo non portée n'a été classée en 0,
          // promeut la meilleure vue frontale disponible (slot 2 en priorité, sinon 3)
          const hasSlot0 = results.some((r) => r.slotIndex === 0)
          if (!hasSlot0) {
            const candidate =
              results.find((r) => r.slotIndex === 2) ??
              results.find((r) => r.slotIndex === 3)
            if (candidate) {
              console.log(`[PhotoUpload] Fallback slot 0 : fichier[${candidate.fileIndex}] promu de slot ${candidate.slotIndex} → 0`)
              candidate.slotIndex = 0
            }
          }

          // Utilise slotsRef.current pour éviter la stale closure
          const taken = new Set<number>(
            slotsRef.current
              .map((s, i) => (s.file ? i : -1))
              .filter((i) => i >= 0)
          )

          const assignments: { file: File; slotId: number }[] = []

          for (const { fileIndex, slotIndex } of results) {
            if (fileIndex >= files.length) continue
            let target = slotIndex

            // Si le slot cible est déjà pris, trouve le premier slot vide
            if (taken.has(target)) {
              const next = SLOT_DEFS.find((d) => !taken.has(d.id))
              if (!next) { console.warn(`Pas de slot libre pour le fichier ${fileIndex}`); continue }
              target = next.id
            }
            taken.add(target)
            assignments.push({ file: files[fileIndex], slotId: target })
            console.log(`  fichier[${fileIndex}] → slot ${target} (${SLOT_DEFS[target].label})`)
          }

          assignments.forEach(({ file, slotId }) => loadFileInSlot(file, slotId))
          setClassifiedCount(assignments.length)
        } else {
          const err = await res.text()
          console.warn('[PhotoUpload] Classify API erreur :', res.status, err)
          // Fallback séquentiel
          const empty = SLOT_DEFS.filter((d) => !slotsRef.current[d.id].file).map((d) => d.id)
          files.slice(0, empty.length).forEach((f, i) => loadFileInSlot(f, empty[i]))
          setClassifiedCount(Math.min(files.length, empty.length))
        }
      } catch (err) {
        console.error('[PhotoUpload] Classify erreur réseau :', err)
        const empty = SLOT_DEFS.filter((d) => !slotsRef.current[d.id].file).map((d) => d.id)
        files.slice(0, empty.length).forEach((f, i) => loadFileInSlot(f, empty[i]))
        setClassifiedCount(Math.min(files.length, empty.length))
      }

      console.groupEnd()
      setIsClassifying(false)
    },
    [loadFileInSlot]           // plus de dépendance sur `slots` — on utilise slotsRef
  )

  /* ── Permute deux slots ── */
  const swapSlots = useCallback(
    (sourceId: number, targetId: number) => {
      if (sourceId === targetId) return
      setSlots((prev) => {
        const next = [...prev]
        next[sourceId] = { ...prev[targetId], id: sourceId }
        next[targetId] = { ...prev[sourceId], id: targetId }
        return next
      })
    },
    [setSlots]
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

  const filledCount      = slots.filter((s) => s.file !== null).length
  const mainPhotoHasBg   = slots[0].processedUrl !== null
  const selectedBgStyle  = BACKGROUNDS[selectedBg].style

  return (
    <div className="space-y-5">

      {/* ── En-tête ── */}
      <div>
        <h2 className="font-display font-extrabold text-2xl text-gray-900 mb-1">
          Photos de l&apos;article
        </h2>
        <p className="text-sm text-gray-500">
          Ajoutez jusqu&apos;à 10 photos.{' '}
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
      {classifiedCount !== null && !isClassifying && (
        <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5 w-fit">
          <Check className="w-3.5 h-3.5 shrink-0" />
          <span className="font-semibold">{classifiedCount} photo{classifiedCount > 1 ? 's' : ''} classée{classifiedCount > 1 ? 's' : ''} par l&apos;IA</span>
          <button onClick={() => setClassifiedCount(null)} className="ml-1 text-green-500 hover:text-green-700">
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* ── Grille Vêtement (slots 0–5) ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Vêtement · 6 photos
          </p>
          {filledCount > 0 && (
            <p className="text-xs text-gray-400 font-medium">{filledCount}/10 remplis</p>
          )}
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
          {SLOT_DEFS.slice(0, 6).map((def) => (
            <SlotCard
              key={def.id}
              def={def}
              slot={slots[def.id]}
              isDragOver={dragOverId === def.id}
              dragSourceId={dragSourceId}
              bgStyle={selectedBgStyle}
              displayLabel={SLOT_LABELS[lang]?.[def.id] ?? def.label}
              onFileSelected={(file) => loadFileInSlot(file, def.id)}
              onSwap={swapSlots}
              onClear={() => clearSlot(def.id)}
              onDragOverChange={(over) => setDragOverId(over ? def.id : null)}
            />
          ))}
        </div>
      </div>

      {/* ── Sélecteur de fond (visible dès que slot 0 a un fond supprimé) ── */}
      {mainPhotoHasBg && (
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

      {/* ── Grille Étiquettes & détails (slots 6–9) ── */}
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
          Étiquettes & détails · 4 photos
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {SLOT_DEFS.slice(6).map((def) => (
            <SlotCard
              key={def.id}
              def={def}
              slot={slots[def.id]}
              isDragOver={dragOverId === def.id}
              dragSourceId={dragSourceId}
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
        Glissez-déposez entre les slots pour réorganiser · Cliquez sur un slot pour uploader
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
  displayLabel: string
  onFileSelected: (file: File) => void
  onSwap: (sourceId: number, targetId: number) => void
  onClear: () => void
  onDragOverChange: (over: boolean) => void
}

function SlotCard({
  def, slot, isDragOver, dragSourceId, bgStyle, displayLabel,
  onFileSelected, onSwap, onClear, onDragOverChange,
}: SlotCardProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const isEmpty  = slot.status === 'empty'
  const isLoading = slot.status === 'uploading' || slot.status === 'processing-bg'
  const hasBg    = slot.processedUrl !== null
  const displayUrl = slot.processedUrl ?? slot.preview

  const BADGE = {
    required:    { label: 'Obligatoire', cls: 'bg-indigo-100 text-indigo-700' },
    recommended: { label: 'Recommandé',  cls: 'bg-gray-100 text-gray-500'    },
    optional:    { label: 'Optionnel',   cls: 'bg-gray-50 text-gray-400'     },
  } as const

  // Fond du container : fond choisi si transparence disponible, damier sinon
  const containerStyle: React.CSSProperties = hasBg && bgStyle
    ? bgStyle
    : hasBg
    ? { background: '#ffffff' }
    : { background: 'repeating-conic-gradient(#e5e7eb 0% 25%, #f9fafb 0% 50%) 0 0 / 14px 14px' }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (dragSourceId.current !== null && dragSourceId.current !== def.id) onDragOverChange(true)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onDragOverChange(false)
    const sourceId = e.dataTransfer.getData('slotId')
    if (sourceId !== '') { onSwap(parseInt(sourceId), def.id); return }
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
        isDragOver
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
          draggable
          onDragStart={(e) => {
            e.stopPropagation()
            e.dataTransfer.setData('slotId', String(def.id))
            e.dataTransfer.effectAllowed = 'move'
            dragSourceId.current = def.id
          }}
          onDragEnd={() => { dragSourceId.current = null }}
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
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
            ) : def.bgRemoval === 'pro' ? (
              <span className="bg-indigo-600/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-sm shadow">
                <Lock className="w-2 h-2" /> Fond Pro
              </span>
            ) : null}
          </div>

          {/* Icône déplacement */}
          <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-60 transition-opacity pointer-events-none">
            <GripVertical className="w-3.5 h-3.5 text-white drop-shadow" />
          </div>
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
