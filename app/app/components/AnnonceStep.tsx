'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Loader2, RefreshCw, AlertCircle, FileText,
  Copy, Check, Pencil, X,
} from 'lucide-react'
import type { RecognitionResult } from '../types'
import { useLang } from '@/app/providers'

/* ─── Props ──────────────────────────────────────────────────────────────── */

interface AnnonceResult {
  titre: string
  description: string
}

interface Props {
  recognition: RecognitionResult | null
  result: AnnonceResult | null
  setResult: (r: AnnonceResult) => void
}

/* ─── Hook génération ────────────────────────────────────────────────────── */

function useGenerate(
  recognition: RecognitionResult | null,
  result: AnnonceResult | null,
  setResult: (r: AnnonceResult) => void,
  lang: string,
) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const ranRef = useRef(false)

  const run = useCallback(async () => {
    if (!recognition) return
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          marque:        recognition.marque.value,
          genre:         recognition.genre.value,
          categorie:     recognition.categorie.value,
          sousCategorie: recognition.sousCategorie.value,
          taille:        recognition.taille.value,
          etat:          recognition.etat.value,
          couleurs:      recognition.couleurs.value,
          matieres:      recognition.matieres.value,
          style:         recognition.style.value,
          motif:         recognition.motif.value,
          defauts:       recognition.defauts.value,
          lang,
        }),
      })
      if (!res.ok) throw new Error()
      const data: AnnonceResult = await res.json()
      setResult(data)
    } catch {
      setError('La génération a échoué. Réessayez.')
    } finally {
      setLoading(false)
    }
  }, [recognition, setResult, lang])

  useEffect(() => {
    if (!ranRef.current && !result && recognition) {
      ranRef.current = true
      run()
    }
  }, [run, result, recognition])

  return { loading, error, retry: run }
}

/* ─── Bouton copier ──────────────────────────────────────────────────────── */

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }
  return (
    <button
      onClick={copy}
      className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
        copied
          ? 'bg-green-50 text-green-700 border-green-200'
          : 'bg-white text-gray-500 border-gray-200 hover:border-indigo-300 hover:text-indigo-600'
      }`}
    >
      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
      {copied ? 'Copié !' : 'Copier'}
    </button>
  )
}

/* ─── Champ éditable ─────────────────────────────────────────────────────── */

interface EditableFieldProps {
  label: string
  value: string
  onChange: (v: string) => void
  multiline?: boolean
  maxLength?: number
  hint?: string
}

function EditableField({ label, value, onChange, multiline, maxLength, hint }: EditableFieldProps) {
  const [editing, setEditing] = useState(false)

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-50">
        <div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</span>
          {hint && <span className="text-[10px] text-gray-300 ml-2">{hint}</span>}
        </div>
        <div className="flex items-center gap-2">
          {maxLength && (
            <span className={`text-[10px] font-semibold ${value.length > maxLength ? 'text-red-500' : 'text-gray-300'}`}>
              {value.length}/{maxLength}
            </span>
          )}
          <CopyButton text={value} />
          <button
            onClick={() => setEditing(!editing)}
            className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-full border transition-all ${
              editing
                ? 'bg-gray-100 text-gray-600 border-gray-200'
                : 'bg-white text-gray-400 border-gray-200 hover:border-indigo-300 hover:text-indigo-600'
            }`}
          >
            {editing ? <X className="w-3 h-3" /> : <Pencil className="w-3 h-3" />}
            {editing ? 'Fermer' : 'Modifier'}
          </button>
        </div>
      </div>

      <div className="px-5 py-4">
        {editing ? (
          multiline ? (
            <textarea
              value={value}
              onChange={e => onChange(e.target.value)}
              rows={6}
              autoFocus
              className="w-full text-sm text-gray-800 leading-relaxed bg-gray-50 rounded-xl p-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 resize-none transition-colors"
            />
          ) : (
            <input
              type="text"
              value={value}
              onChange={e => onChange(e.target.value)}
              autoFocus
              maxLength={maxLength ? maxLength + 10 : undefined}
              className="w-full text-sm text-gray-800 bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-colors"
            />
          )
        ) : (
          <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{value}</p>
        )}
      </div>
    </div>
  )
}

/* ─── Composant principal ────────────────────────────────────────────────── */

export default function AnnonceStep({ recognition, result, setResult }: Props) {
  const { lang } = useLang()
  const { loading, error, retry } = useGenerate(recognition, result, setResult, lang)

  function updateTitre(v: string) {
    if (!result) return
    setResult({ ...result, titre: v })
  }

  function updateDescription(v: string) {
    if (!result) return
    setResult({ ...result, description: v })
  }

  /* ── Chargement ── */
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center">
          <Loader2 className="w-7 h-7 text-indigo-600 animate-spin" />
        </div>
        <div>
          <p className="font-display font-extrabold text-xl text-gray-900">Rédaction en cours…</p>
          <p className="text-sm text-gray-400 mt-1 max-w-xs">
            L'IA rédige votre annonce optimisée pour Vinted.
          </p>
        </div>
        <div className="flex gap-1.5 mt-2">
          {[0, 1, 2].map(i => (
            <span key={i} className="w-2 h-2 rounded-full bg-indigo-300 animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }} />
          ))}
        </div>
      </div>
    )
  }

  /* ── Erreur ── */
  if (error && !result) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center">
          <AlertCircle className="w-7 h-7 text-red-500" />
        </div>
        <p className="font-display font-extrabold text-xl text-gray-900">Génération impossible</p>
        <p className="text-sm text-gray-400 max-w-xs">{error}</p>
        <button onClick={retry}
          className="flex items-center gap-2 bg-indigo-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-indigo-700 transition-colors">
          <RefreshCw className="w-4 h-4" />Réessayer
        </button>
      </div>
    )
  }

  /* ── Prérequis manquants ── */
  if (!recognition) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center">
          <FileText className="w-7 h-7 text-gray-400" />
        </div>
        <p className="text-gray-400 text-sm max-w-xs">
          Complétez l'étape 2 pour générer votre annonce.
        </p>
      </div>
    )
  }

  if (!result) return null

  return (
    <div className="max-w-2xl mx-auto">

      {/* ── En-tête ── */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center">
              <FileText className="w-4 h-4 text-indigo-600" />
            </div>
            <h2 className="font-display font-extrabold text-2xl text-gray-900">
              Annonce générée
            </h2>
          </div>
          <p className="text-sm text-gray-400 ml-10">
            Modifiez les champs si besoin, puis copiez vers Vinted.
          </p>
        </div>
        <button
          onClick={retry}
          className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-gray-600 transition-colors px-3 py-1.5 rounded-full hover:bg-gray-50 border border-gray-100 shrink-0"
        >
          <RefreshCw className="w-3 h-3" />
          Régénérer
        </button>
      </div>

      <div className="space-y-4">
        <EditableField
          label="Titre"
          value={result.titre}
          onChange={updateTitre}
          maxLength={60}
          hint="max 60 caractères"
        />
        <EditableField
          label="Description"
          value={result.description}
          onChange={updateDescription}
          multiline
        />

        {/* ── Bouton tout copier ── */}
        <button
          onClick={() => {
            const full = `${result.titre}\n\n${result.description}`
            navigator.clipboard.writeText(full)
          }}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white text-sm font-semibold py-3.5 rounded-2xl hover:bg-indigo-700 active:scale-[0.98] transition-all"
        >
          <Copy className="w-4 h-4" />
          Tout copier (titre + description)
        </button>
      </div>
    </div>
  )
}
