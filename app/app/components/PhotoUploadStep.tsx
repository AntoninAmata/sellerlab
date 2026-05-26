'use client'

import { useState, useRef, useCallback } from 'react'
import { Camera, Tag, X, Lock, Upload, Sparkles, GripVertical } from 'lucide-react'
import type { PhotoSlot } from '../types'

/* ─── Définition des 10 slots ─────────────────────────────────────────────── */

const SLOT_DEFS = [
  { id: 0, label: 'Photo principale', badge: 'required',    type: 'garment', bgRemoval: 'free' },
  { id: 1, label: 'Photo verso',       badge: 'recommended', type: 'garment', bgRemoval: 'pro'  },
  { id: 2, label: 'Photo portée 1',   badge: 'recommended', type: 'garment', bgRemoval: 'pro'  },
  { id: 3, label: 'Photo portée 2',   badge: 'recommended', type: 'garment', bgRemoval: 'pro'  },
  { id: 4, label: 'Photo portée 3',   badge: 'recommended', type: 'garment', bgRemoval: 'pro'  },
  { id: 5, label: 'Photo portée 4',   badge: 'recommended', type: 'garment', bgRemoval: 'pro'  },
  { id: 6, label: 'Étiquette marque', badge: 'recommended', type: 'label',   bgRemoval: 'none' },
  { id: 7, label: 'Étiquette taille', badge: 'recommended', type: 'label',   bgRemoval: 'none' },
  { id: 8, label: 'Étiquette compo.', badge: 'recommended', type: 'label',   bgRemoval: 'none' },
  { id: 9, label: 'Défaut / détail',  badge: 'optional',    type: 'detail',  bgRemoval: 'none' },
] as const

type SlotDef = (typeof SLOT_DEFS)[number]

/* ─── Props ───────────────────────────────────────────────────────────────── */

interface Props {
  slots: PhotoSlot[]
  setSlots: React.Dispatch<React.SetStateAction<PhotoSlot[]>>
}

/* ─── Composant principal ─────────────────────────────────────────────────── */

export default function PhotoUploadStep({ slots, setSlots }: Props) {
  const [dragOverId, setDragOverId] = useState<number | null>(null)
  const [isClassifying, setIsClassifying] = useState(false)
  const [globalDragOver, setGlobalDragOver] = useState(false)
  const dragSourceId = useRef<number | null>(null)

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
          const fd = new FormData()
          fd.append('file', file)
          const res = await fetch('/api/remove-bg', { method: 'POST', body: fd })
          if (res.ok) {
            const { url } = await res.json()
            updateSlot(slotId, { status: 'done', processedUrl: url })
          } else {
            updateSlot(slotId, { status: 'done', processedUrl: null })
          }
        } catch {
          updateSlot(slotId, { status: 'done', processedUrl: null })
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

      if (files.length === 1) {
        const firstEmpty = SLOT_DEFS.find((d) => !slots[d.id].file)
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

          const taken = new Set<number>(
            slots.map((s, i) => (s.file ? i : -1)).filter((i) => i >= 0)
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

          for (const { file, slotId } of assignments) {
            loadFileInSlot(file, slotId)
          }
        } else {
          // Fallback séquentiel
          const empty = SLOT_DEFS.filter((d) => !slots[d.id].file).map((d) => d.id)
          files.slice(0, empty.length).forEach((f, i) => loadFileInSlot(f, empty[i]))
        }
      } catch {
        const empty = SLOT_DEFS.filter((d) => !slots[d.id].file).map((d) => d.id)
        files.slice(0, empty.length).forEach((f, i) => loadFileInSlot(f, empty[i]))
      }

      setIsClassifying(false)
    },
    [slots, loadFileInSlot]
  )

  /* ── Permute deux slots ── */
  const swapSlots = useCallback(
    (sourceId: number, targetId: number) => {
      if (sourceId === targetId) return
      setSlots((prev) => {
        const next = [...prev]
        const a = { ...next[sourceId], id: targetId }
        const b = { ...next[targetId], id: sourceId }
        next[sourceId] = b
        next[targetId] = a
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

  /* ── Zone d'upload globale (drop) ── */
  const handleGlobalDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setGlobalDragOver(false)
    if (e.dataTransfer.getData('slotId')) return // ignore les drags internes
    const images = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/'))
    if (images.length) handleMultipleFiles(images)
  }

  const filledCount = slots.filter((s) => s.file !== null).length

  return (
    <div className="space-y-6">

      {/* ── En-tête ── */}
      <div>
        <h2 className="font-display font-extrabold text-2xl text-gray-900 mb-1">
          Photos de l&apos;article
        </h2>
        <p className="text-sm text-gray-500">
          Ajoutez jusqu&apos;à 10 photos.{' '}
          <span className="font-semibold text-gray-700">La photo principale est obligatoire</span>{' '}
          — l&apos;IA supprime automatiquement son fond.
        </p>
      </div>

      {/* ── Zone d'import multiple ── */}
      <div
        onDragOver={(e) => {
          e.preventDefault()
          if (!dragSourceId.current) setGlobalDragOver(true)
        }}
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

      {/* ── Grille Vêtement (slots 0–5) ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Vêtement · 6 photos
          </p>
          {filledCount > 0 && (
            <p className="text-xs text-gray-400 font-medium">
              {filledCount}/10 remplis
            </p>
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
              onFileSelected={(file) => loadFileInSlot(file, def.id)}
              onSwap={swapSlots}
              onClear={() => clearSlot(def.id)}
              onDragOverChange={(over) => setDragOverId(over ? def.id : null)}
            />
          ))}
        </div>
      </div>

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
  onFileSelected: (file: File) => void
  onSwap: (sourceId: number, targetId: number) => void
  onClear: () => void
  onDragOverChange: (over: boolean) => void
}

function SlotCard({
  def,
  slot,
  isDragOver,
  dragSourceId,
  onFileSelected,
  onSwap,
  onClear,
  onDragOverChange,
}: SlotCardProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const isEmpty = slot.status === 'empty'
  const isLoading = slot.status === 'uploading' || slot.status === 'processing-bg'
  const displayUrl = slot.processedUrl ?? slot.preview

  const BADGE = {
    required:    { label: 'Obligatoire', cls: 'bg-indigo-100 text-indigo-700' },
    recommended: { label: 'Recommandé',  cls: 'bg-gray-100 text-gray-500'    },
    optional:    { label: 'Optionnel',   cls: 'bg-gray-50 text-gray-400'     },
  } as const

  /* Gestion drop sur ce slot */
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (dragSourceId.current !== null && dragSourceId.current !== def.id) {
      onDragOverChange(true)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onDragOverChange(false)

    const sourceId = e.dataTransfer.getData('slotId')
    if (sourceId !== '') {
      onSwap(parseInt(sourceId), def.id)
      return
    }

    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/'))
    if (files[0]) onFileSelected(files[0])
  }

  const hasBg = slot.processedUrl !== null
  const checkeredBg = hasBg
    ? 'repeating-conic-gradient(#e5e7eb 0% 25%, #f9fafb 0% 50%) 0 0 / 14px 14px'
    : undefined

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
          : 'border border-gray-200 shadow-sm bg-white'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) onFileSelected(f)
          e.target.value = ''
        }}
      />

      {/* ── État vide ── */}
      {isEmpty && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 p-2 select-none">
          {def.type === 'label' || def.type === 'detail' ? (
            <Tag className="w-5 h-5 text-gray-300 group-hover:text-indigo-300 transition-colors" />
          ) : (
            <Camera className="w-5 h-5 text-gray-300 group-hover:text-indigo-300 transition-colors" />
          )}
          <span className="text-[10px] font-semibold text-gray-400 text-center leading-tight px-1">
            {def.label}
          </span>
          <span
            className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${BADGE[def.badge].cls}`}
          >
            {BADGE[def.badge].label}
          </span>
        </div>
      )}

      {/* ── Chargement / traitement fond ── */}
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
          onDragEnd={() => {
            dragSourceId.current = null
          }}
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
          style={{ background: checkeredBg }}
        >
          <img
            src={displayUrl}
            alt={def.label}
            className="w-full h-full object-cover"
            draggable={false}
          />

          {/* Overlay au survol : label + bouton supprimer */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          <div className="absolute top-1.5 inset-x-1.5 flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="bg-black/60 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded backdrop-blur-sm leading-tight">
              {def.label}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onClear()
              }}
              className="w-5 h-5 bg-black/60 hover:bg-red-500 text-white rounded-full flex items-center justify-center transition-colors shrink-0"
              title="Supprimer"
            >
              <X className="w-2.5 h-2.5" />
            </button>
          </div>

          {/* Chip bas de slot */}
          <div className="absolute bottom-1.5 inset-x-1.5 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            {hasBg ? (
              <span className="bg-green-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow">
                ✓ Fond supprimé
              </span>
            ) : def.bgRemoval === 'pro' ? (
              <span className="bg-indigo-600/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-sm shadow">
                <Lock className="w-2 h-2" /> Fond Pro
              </span>
            ) : null}
          </div>

          {/* Icône de déplacement (visible en survol sur mobile aussi) */}
          <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-60 transition-opacity pointer-events-none">
            <GripVertical className="w-3.5 h-3.5 text-white drop-shadow" />
          </div>
        </div>
      )}

      {/* ── Badge étoile slot 0 (vide) ── */}
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
