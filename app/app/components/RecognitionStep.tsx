'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import {
  Loader2, RefreshCw, CheckCircle2, AlertTriangle,
  XCircle, Pencil, AlertCircle, ScanLine,
} from 'lucide-react'
import type { PhotoSlot, RecognitionResult, Confidence } from '../types'
import {
  CATEGORIES, SIZES, COLORS, MATERIALS, CONDITIONS, STYLES, PATTERNS,
} from '@/lib/vinted-taxonomy'
import type { Genre } from '@/lib/vinted-taxonomy'

/* ─── Props ──────────────────────────────────────────────────────────────── */

interface Props {
  slots: PhotoSlot[]
  result: RecognitionResult | null
  setResult: (r: RecognitionResult) => void
}

/* ─── Badge confiance ────────────────────────────────────────────────────── */

function ConfidenceBadge({ confidence }: { confidence: Confidence }) {
  const map: Record<Confidence, { label: string; className: string; Icon: React.ElementType }> = {
    high:   { label: 'Élevée',   className: 'bg-green-50 text-green-700 border-green-200',   Icon: CheckCircle2    },
    medium: { label: 'Moyenne',  className: 'bg-orange-50 text-orange-700 border-orange-200', Icon: AlertTriangle   },
    low:    { label: 'Incertaine',className: 'bg-red-50 text-red-700 border-red-200',         Icon: XCircle         },
    manual: { label: 'Modifié',  className: 'bg-gray-50 text-gray-500 border-gray-200',       Icon: Pencil          },
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

/* ─── Hook appel API reconnaissance ─────────────────────────────────────── */

function useRecognition(slots: PhotoSlot[], result: RecognitionResult | null, setResult: (r: RecognitionResult) => void) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const ranRef = useRef(false)

  const run = useCallback(async () => {
    /* Collecte les photos disponibles (slots 0, 1, 6, 7, 8) */
    const targets = [0, 1, 6, 7, 8]
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
            return resizeAndEncode(f)
          }
          return resizeAndEncode(slot.file!)
        })
      )

      const res = await fetch('/api/recognize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images }),
      })

      if (!res.ok) throw new Error('Erreur serveur')
      const data: RecognitionResult = await res.json()
      setResult(data)
    } catch {
      setError('L\'analyse a échoué. Vérifiez votre connexion et réessayez.')
    } finally {
      setLoading(false)
    }
  }, [slots, setResult])

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
  const { loading, error, retry } = useRecognition(slots, result, setResult)

  /* ── Mise à jour d'un champ avec passage en 'manual' ── */
  function update<K extends keyof RecognitionResult>(
    key: K,
    value: RecognitionResult[K]['value'],
  ) {
    if (!result) return
    setResult({
      ...result,
      [key]: { value, confidence: 'manual' as Confidence },
    })
  }

  /* ── Liste sous-catégories selon genre + catégorie ── */
  function getSubCats(genre: string, categorieName: string): string[] {
    const genreKey = genre as Genre
    const cats = CATEGORIES[genreKey] ?? []
    const cat = cats.find(c => c.name === categorieName)
    return cat?.subCategories.map(s => s.name) ?? []
  }

  /* ── Tailles selon sous-catégorie ── */
  function getSizes(genre: string, catName: string, subCatName: string): string[] {
    const genreKey = genre as Genre
    const cats = CATEGORIES[genreKey] ?? []
    const cat = cats.find(c => c.name === catName)
    const sub = cat?.subCategories.find(s => s.name === subCatName)
    const sys = sub?.sizeSystem ?? 'letters'
    return SIZES[sys]
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
          <p className="font-display font-extrabold text-xl text-gray-900">Analyse en cours…</p>
          <p className="text-sm text-gray-400 mt-1 max-w-xs">
            L'IA examine vos photos pour identifier la marque, la taille, les couleurs et plus encore.
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
          <p className="font-display font-extrabold text-xl text-gray-900">Analyse impossible</p>
          <p className="text-sm text-gray-400 mt-1 max-w-xs">{error}</p>
        </div>
        <button
          onClick={retry}
          className="flex items-center gap-2 bg-indigo-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-indigo-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Réessayer
        </button>
      </div>
    )
  }

  if (!result) return null

  const subCats = getSubCats(result.genre.value, result.categorie.value)
  const sizes = getSizes(result.genre.value, result.categorie.value, result.sousCategorie.value)

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
              Reconnaissance automatique
            </h2>
          </div>
          <p className="text-sm text-gray-400 ml-10">
            L'IA a pré-rempli les champs ci-dessous. Corrigez si nécessaire.
          </p>
        </div>
        <button
          onClick={retry}
          className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-gray-600 transition-colors px-3 py-1.5 rounded-full hover:bg-gray-50 border border-gray-100 shrink-0"
        >
          <RefreshCw className="w-3 h-3" />
          Relancer
        </button>
      </div>

      {/* ── Légende confiance ── */}
      <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-gray-50 rounded-xl border border-gray-100">
        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mr-1">Confiance :</span>
        {(['high', 'medium', 'low', 'manual'] as Confidence[]).map(c => (
          <ConfidenceBadge key={c} confidence={c} />
        ))}
      </div>

      <div className="space-y-6">

        {/* ── Section Article ── */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-5">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Article</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Marque */}
            <Field label="Marque" confidence={result.marque.confidence}>
              <input
                type="text"
                value={result.marque.value}
                onChange={e => update('marque', e.target.value)}
                placeholder="Ex: Zara, H&M, Nike…"
                className={inputCls(result.marque.confidence)}
              />
            </Field>

            {/* Genre */}
            <Field label="Genre" confidence={result.genre.confidence} required>
              <select
                value={result.genre.value}
                onChange={e => update('genre', e.target.value)}
                className={inputCls(result.genre.confidence)}
              >
                <option value="">— Choisir —</option>
                {(['Femme', 'Homme', 'Enfant', 'Mixte'] as const).map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Catégorie */}
            <Field label="Catégorie" confidence={result.categorie.confidence} required>
              <select
                value={result.categorie.value}
                onChange={e => {
                  update('categorie', e.target.value)
                  update('sousCategorie', '')
                }}
                className={inputCls(result.categorie.confidence)}
              >
                <option value="">— Choisir —</option>
                {(CATEGORIES[result.genre.value as Genre] ?? []).map(cat => (
                  <option key={cat.name} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </Field>

            {/* Sous-catégorie */}
            <Field label="Sous-catégorie" confidence={result.sousCategorie.confidence}>
              <select
                value={result.sousCategorie.value}
                onChange={e => update('sousCategorie', e.target.value)}
                disabled={subCats.length === 0}
                className={inputCls(result.sousCategorie.confidence)}
              >
                <option value="">— Choisir —</option>
                {subCats.map(sc => (
                  <option key={sc} value={sc}>{sc}</option>
                ))}
              </select>
            </Field>
          </div>
        </section>

        {/* ── Section Caractéristiques ── */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-5">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Caractéristiques</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Taille */}
            <Field label="Taille" confidence={result.taille.confidence}>
              {sizes.length > 0 ? (
                <select
                  value={result.taille.value}
                  onChange={e => update('taille', e.target.value)}
                  className={inputCls(result.taille.confidence)}
                >
                  <option value="">— Choisir —</option>
                  {sizes.map(s => (
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
            <Field label="État" confidence={result.etat.confidence} required>
              <select
                value={result.etat.value}
                onChange={e => update('etat', e.target.value)}
                className={inputCls(result.etat.confidence)}
              >
                <option value="">— Choisir —</option>
                {CONDITIONS.map(c => (
                  <option key={c.id} value={c.label}>{c.label}</option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Style */}
            <Field label="Style" confidence={result.style.confidence}>
              <select
                value={result.style.value}
                onChange={e => update('style', e.target.value)}
                className={inputCls(result.style.confidence)}
              >
                <option value="">— Choisir —</option>
                {STYLES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </Field>

            {/* Motif */}
            <Field label="Motif" confidence={result.motif.confidence}>
              <select
                value={result.motif.value}
                onChange={e => update('motif', e.target.value)}
                className={inputCls(result.motif.confidence)}
              >
                <option value="">— Choisir —</option>
                {PATTERNS.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </Field>
          </div>

          {/* Couleurs — max 2, chips sélectionnables */}
          <Field label="Couleurs (max 2)" confidence={result.couleurs.confidence} required>
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
                    {color}
                  </button>
                )
              })}
            </div>
          </Field>

          {/* Matières — max 3, chips sélectionnables */}
          <Field label="Matières (max 3)" confidence={result.matieres.confidence}>
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
                    {mat}
                  </button>
                )
              })}
            </div>
          </Field>
        </section>

        {/* ── Section Défauts ── */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Défauts visibles</h3>

          {result.defauts.value ? (
            <div className="flex items-start gap-3 p-3.5 bg-orange-50 border border-orange-200 rounded-xl">
              <AlertTriangle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-orange-700 mb-1">Défaut détecté — confirmez</p>
                <p className="text-sm text-orange-800">{result.defauts.value}</p>
              </div>
            </div>
          ) : null}

          <Field label="Description des défauts" confidence={result.defauts.confidence}>
            <textarea
              value={result.defauts.value}
              onChange={e => update('defauts', e.target.value)}
              rows={3}
              placeholder="Ex: Légère décoloration sur l'épaule gauche, fil tiré sur la manche… (laisser vide si aucun défaut)"
              className={`${inputCls(result.defauts.confidence)} resize-none`}
            />
          </Field>
        </section>

        {/* ── Résumé de la sélection ── */}
        <div className="bg-indigo-50 rounded-2xl border border-indigo-100 p-5">
          <p className="text-xs font-semibold text-indigo-700 mb-2">Récapitulatif</p>
          <div className="flex flex-wrap gap-2">
            {[
              result.genre.value,
              result.categorie.value,
              result.sousCategorie.value,
              result.marque.value,
              result.taille.value,
              result.etat.value,
              ...result.couleurs.value,
              ...result.matieres.value,
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
