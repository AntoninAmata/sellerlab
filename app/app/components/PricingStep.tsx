'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Loader2, RefreshCw, AlertCircle, AlertTriangle,
  Tag, TrendingUp, ChevronDown, ChevronUp, Euro,
  CheckCircle2, Info,
} from 'lucide-react'
import type { RecognitionResult, PriceResult, PricePrecisions } from '../types'

/* ─── Props ──────────────────────────────────────────────────────────────── */

interface Props {
  recognition: RecognitionResult | null
  result: PriceResult | null
  setResult: (r: PriceResult) => void
}

/* ─── Appel API prix ─────────────────────────────────────────────────────── */

function usePricing(
  recognition: RecognitionResult | null,
  result: PriceResult | null,
  setResult: (r: PriceResult) => void,
) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const ranRef = useRef(false)

  const run = useCallback(async (precisions?: PricePrecisions) => {
    if (!recognition) return
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/price', {
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
          ...precisions,
        }),
      })
      if (!res.ok) throw new Error()
      const data: PriceResult = await res.json()
      setResult(data)
    } catch {
      setError('Le calcul a échoué. Vérifiez votre connexion et réessayez.')
    } finally {
      setLoading(false)
    }
  }, [recognition, setResult])

  useEffect(() => {
    if (!ranRef.current && !result && recognition) {
      ranRef.current = true
      run()
    }
  }, [run, result, recognition])

  return { loading, error, retry: run }
}

/* ─── Barre de confiance ─────────────────────────────────────────────────── */

function ConfidenceBar({ confidence }: { confidence: 'high' | 'medium' | 'low' }) {
  const map = {
    high:   { label: 'Confiance élevée',   color: 'bg-green-500',  text: 'text-green-700',  bg: 'bg-green-50',  border: 'border-green-200',  Icon: CheckCircle2   },
    medium: { label: 'Confiance moyenne',  color: 'bg-orange-400', text: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200', Icon: AlertTriangle  },
    low:    { label: 'Confiance faible',   color: 'bg-red-400',    text: 'text-red-700',    bg: 'bg-red-50',    border: 'border-red-200',    Icon: AlertCircle    },
  }
  const { label, color, text, bg, border, Icon } = map[confidence]
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${bg} ${border}`}>
      <Icon className={`w-4 h-4 ${text} shrink-0`} />
      <span className={`text-xs font-semibold ${text}`}>{label}</span>
      <div className="flex-1 h-1.5 bg-white/60 rounded-full overflow-hidden ml-1">
        <div className={`h-full ${color} rounded-full transition-all`}
          style={{ width: confidence === 'high' ? '90%' : confidence === 'medium' ? '55%' : '25%' }}
        />
      </div>
    </div>
  )
}

/* ─── Formulaire de précision ────────────────────────────────────────────── */

interface PrecisionFormProps {
  onSubmit: (p: PricePrecisions) => void
  loading: boolean
}

function PrecisionForm({ onSubmit, loading }: PrecisionFormProps) {
  const [prix, setPrix] = useState('')
  const [plateforme, setPlateforme] = useState('')
  const [rarete, setRarete] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit({
      prixAchatNeuf: prix ? parseFloat(prix) : undefined,
      plateforme:    plateforme || undefined,
      rarete:        rarete || undefined,
    })
  }

  const inputCls = 'w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-colors'

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Prix d'achat neuf */}
        <div>
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1.5">
            Prix d'achat neuf (€)
          </label>
          <div className="relative">
            <input
              type="number"
              min="0"
              step="0.01"
              value={prix}
              onChange={e => setPrix(e.target.value)}
              placeholder="Ex: 49.99"
              className={`${inputCls} pr-8`}
            />
            <Euro className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-300" />
          </div>
        </div>

        {/* Plateforme */}
        <div>
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1.5">
            Acheté chez
          </label>
          <select
            value={plateforme}
            onChange={e => setPlateforme(e.target.value)}
            className={inputCls}
          >
            <option value="">— Choisir —</option>
            <option value="Boutique officielle">Boutique officielle</option>
            <option value="Zalando">Zalando</option>
            <option value="ASOS">ASOS</option>
            <option value="Shein">Shein</option>
            <option value="Vinted">Vinted</option>
            <option value="Depop">Depop</option>
            <option value="Vestiaire Collective">Vestiaire Collective</option>
            <option value="Autre">Autre</option>
          </select>
        </div>
      </div>

      {/* Rareté */}
      <div>
        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1.5">
          Article rare ou édition limitée ?
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {['Non', 'Collaboration', 'Édition limitée', 'Vintage'].map(r => (
            <button
              key={r}
              type="button"
              onClick={() => setRarete(rarete === r ? '' : r)}
              className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                rarete === r
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white text-sm font-semibold py-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <TrendingUp className="w-4 h-4" />}
        Recalculer avec ces informations
      </button>
    </form>
  )
}

/* ─── Composant principal ────────────────────────────────────────────────── */

export default function PricingStep({ recognition, result, setResult }: Props) {
  const { loading, error, retry } = usePricing(recognition, result, setResult)
  const [showPrecision, setShowPrecision] = useState(false)
  const [showMargin, setShowMargin] = useState(false)
  const [prixAchat, setPrixAchat] = useState('')

  /* Auto-ouvrir le formulaire si confiance faible */
  useEffect(() => {
    if (result && result.confidence === 'low') setShowPrecision(true)
  }, [result?.confidence])

  /* ── Chargement ── */
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center">
          <Loader2 className="w-7 h-7 text-indigo-600 animate-spin" />
        </div>
        <div>
          <p className="font-display font-extrabold text-xl text-gray-900">Calcul en cours…</p>
          <p className="text-sm text-gray-400 mt-1 max-w-xs">
            L'IA analyse les prix du marché pour vous proposer le prix idéal.
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

  /* ── Erreur sans résultat ── */
  if (error && !result) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center">
          <AlertCircle className="w-7 h-7 text-red-500" />
        </div>
        <div>
          <p className="font-display font-extrabold text-xl text-gray-900">Calcul impossible</p>
          <p className="text-sm text-gray-400 mt-1 max-w-xs">{error}</p>
        </div>
        <button onClick={() => retry()}
          className="flex items-center gap-2 bg-indigo-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-indigo-700 transition-colors">
          <RefreshCw className="w-4 h-4" />
          Réessayer
        </button>
      </div>
    )
  }

  /* ── Pas de résultat et pas de reconnaissance ── */
  if (!recognition) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center">
          <Info className="w-7 h-7 text-gray-400" />
        </div>
        <p className="text-gray-400 text-sm max-w-xs">
          Complétez d'abord l'étape 2 pour que l'IA puisse calculer le prix.
        </p>
      </div>
    )
  }

  if (!result) return null

  const marge = prixAchat ? result.prixSuggere - parseFloat(prixAchat) : null

  /* ── Résultat ── */
  return (
    <div className="max-w-2xl mx-auto">

      {/* ── En-tête ── */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center">
              <Tag className="w-4 h-4 text-indigo-600" />
            </div>
            <h2 className="font-display font-extrabold text-2xl text-gray-900">
              Prix recommandé
            </h2>
          </div>
          <p className="text-sm text-gray-400 ml-10">
            Basé sur la marque, l'état et les prix du marché Vinted.
          </p>
        </div>
        <button
          onClick={() => retry()}
          className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-gray-600 transition-colors px-3 py-1.5 rounded-full hover:bg-gray-50 border border-gray-100 shrink-0"
        >
          <RefreshCw className="w-3 h-3" />
          Recalculer
        </button>
      </div>

      <div className="space-y-4">

        {/* ── Prix principal ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

            {/* Prix suggéré */}
            <div className="flex-1">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                Prix de vente suggéré
              </p>
              <div className="flex items-baseline gap-1">
                <span className="font-display font-extrabold text-5xl text-gray-900">
                  {result.prixSuggere}
                </span>
                <span className="text-2xl font-bold text-gray-400">€</span>
              </div>
              <p className="text-xs text-gray-400 mt-1.5">
                Fourchette : <span className="font-semibold text-gray-600">{result.prixMin}€ – {result.prixMax}€</span>
              </p>
            </div>

            {/* Marge de négo */}
            <div className="bg-indigo-50 rounded-xl px-5 py-4 text-center shrink-0 border border-indigo-100">
              <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">
                Marge de négo
              </p>
              <div className="flex items-baseline gap-0.5 justify-center">
                <span className="font-display font-extrabold text-2xl text-indigo-700">
                  {result.margeNeg}
                </span>
                <span className="text-sm font-bold text-indigo-400">€</span>
              </div>
              <p className="text-[10px] text-indigo-400 mt-0.5">
                Prix mini : <b>{result.prixSuggere - result.margeNeg}€</b>
              </p>
            </div>
          </div>

          {/* Fourchette visuelle */}
          <div className="mt-5 pt-5 border-t border-gray-50">
            <div className="relative h-2 bg-gray-100 rounded-full">
              <div
                className="absolute h-full bg-gradient-to-r from-indigo-200 to-indigo-500 rounded-full"
                style={{
                  left: `${Math.max(0, ((result.prixMin) / (result.prixMax * 1.1)) * 100)}%`,
                  right: `${Math.max(0, 100 - ((result.prixMax) / (result.prixMax * 1.1)) * 100)}%`,
                }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-indigo-600 border-2 border-white rounded-full shadow-md shadow-indigo-200"
                style={{ left: `${((result.prixSuggere) / (result.prixMax * 1.1)) * 100}%`, transform: 'translateX(-50%) translateY(-50%)' }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-gray-400 mt-1.5 font-semibold">
              <span>{result.prixMin}€</span>
              <span className="text-indigo-600">{result.prixSuggere}€</span>
              <span>{result.prixMax}€</span>
            </div>
          </div>
        </div>

        {/* ── Confiance ── */}
        <ConfidenceBar confidence={result.confidence} />

        {/* ── Raisonnement ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0 mt-0.5">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                Raisonnement
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">{result.raisonnement}</p>
              {result.prixNeufEstime && (
                <p className="text-xs text-gray-400 mt-2">
                  Prix neuf estimé : <span className="font-semibold text-gray-600">{result.prixNeufEstime}€</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ── Calcul de marge (revendeurs) ── */}
        <button
          type="button"
          onClick={() => setShowMargin(!showMargin)}
          className="w-full flex items-center justify-between px-5 py-3.5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-gray-200 transition-colors text-sm font-semibold text-gray-600"
        >
          <span className="flex items-center gap-2">
            <Euro className="w-4 h-4 text-gray-400" />
            Calculer ma marge (revendeurs)
          </span>
          {showMargin ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </button>

        {showMargin && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1.5">
                Mon prix d'achat (€)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={prixAchat}
                  onChange={e => setPrixAchat(e.target.value)}
                  placeholder="Ex: 12.00"
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-colors pr-8"
                />
                <Euro className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-300" />
              </div>
            </div>
            {marge !== null && (
              <div className={`flex items-center justify-between px-4 py-3 rounded-xl border ${marge >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <span className="text-sm font-semibold text-gray-700">Marge estimée</span>
                <span className={`font-display font-extrabold text-xl ${marge >= 0 ? 'text-green-700' : 'text-red-600'}`}>
                  {marge >= 0 ? '+' : ''}{marge.toFixed(2)}€
                </span>
              </div>
            )}
          </div>
        )}

        {/* ── Formulaire de précision ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <button
            type="button"
            onClick={() => setShowPrecision(!showPrecision)}
            className={`w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors ${
              result.confidence !== 'high' ? 'text-orange-700' : 'text-gray-600'
            }`}
          >
            <span className="flex items-center gap-2 text-sm font-semibold">
              {result.confidence !== 'high' && <AlertTriangle className="w-4 h-4 text-orange-500" />}
              {result.confidence === 'high' ? 'Préciser pour affiner le prix' : 'Précisez pour obtenir un prix plus fiable'}
            </span>
            {showPrecision
              ? <ChevronUp className="w-4 h-4 text-gray-400" />
              : <ChevronDown className="w-4 h-4 text-gray-400" />}
          </button>

          {showPrecision && (
            <div className="px-5 pb-5 border-t border-gray-50">
              <PrecisionForm
                onSubmit={(p) => { retry(p); setShowPrecision(false) }}
                loading={loading}
              />
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
