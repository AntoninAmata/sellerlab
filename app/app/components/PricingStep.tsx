'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Loader2, RefreshCw, AlertCircle, AlertTriangle,
  Tag, TrendingUp, Euro, CheckCircle2, Info, X, ChevronDown,
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

/* ─── Bannière de confiance ──────────────────────────────────────────────── */

function ConfidenceBanner({ confidence }: { confidence: 'high' | 'medium' | 'low' }) {
  const map = {
    high:   { label: 'Données fiables — confiance élevée',   bg: 'bg-green-50',  border: 'border-green-200',  text: 'text-green-700',  Icon: CheckCircle2  },
    medium: { label: 'Données partielles — confiance moyenne', bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', Icon: AlertTriangle },
    low:    { label: 'Données insuffisantes — confiance faible', bg: 'bg-red-50',  border: 'border-red-200',    text: 'text-red-700',    Icon: AlertCircle   },
  }
  const { label, bg, border, text, Icon } = map[confidence]
  return (
    <div className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border ${bg} ${border}`}>
      <Icon className={`w-4 h-4 ${text} shrink-0`} />
      <span className={`text-sm font-semibold ${text}`}>{label}</span>
    </div>
  )
}

/* ─── Mini-métrique de marché (compact, grille 2x2) ─────────────────────── */

function MiniMetric({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="bg-gray-50 rounded-lg p-2.5">
      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-tight mb-0.5">{label}</p>
      {value !== null ? (
        <p className="text-sm font-display font-extrabold text-gray-900 leading-tight">{value}</p>
      ) : (
        <span className="text-[9px] font-semibold text-gray-300">—</span>
      )}
    </div>
  )
}

/* ─── Composant principal ────────────────────────────────────────────────── */

export default function PricingStep({ recognition, result, setResult }: Props) {
  const { loading, error, retry } = usePricing(recognition, result, setResult)

  /* ── État local du bloc interactif ── */
  const [prixAchat, setPrixAchat]       = useState('')
  const [plateforme, setPlateforme]     = useState('')
  const [rarete, setRarete]             = useState('')
  const [showMargin, setShowMargin]     = useState(false)
  const [showPrecisions, setShowPrecisions] = useState(false)
  const [sliderVal, setSliderVal]       = useState<number | null>(null)
  const [prixMini, setPrixMini]         = useState('')

  /* Initialise le slider sur le prixSuggere quand le résultat arrive */
  useEffect(() => {
    if (result && sliderVal === null) {
      setSliderVal(result.prixSuggere)
    }
  }, [result, sliderVal])

  /* ── Calcul délai estimé selon position slider ── */
  function getDelai(val: number, suggere: number): string {
    if (val < suggere * 0.85) return '~2-3 jours'
    if (val <= suggere * 1.05) return '~1-2 semaines'
    return '1+ mois'
  }

  /* ── Conseil contextuel ── */
  function getConseil(val: number, suggere: number): string {
    if (val < suggere * 0.85) return 'Vendu très rapidement — légèrement sous le marché'
    if (val <= suggere * 1.05) return 'Prix idéal selon les données du marché'
    return 'Au-dessus du marché — prévoir un délai plus long'
  }

  /* ── Recalcul avec précisions ── */
  function handleRecalculate() {
    retry({
      prixAchatNeuf: prixAchat ? parseFloat(prixAchat) : undefined,
      plateforme:    plateforme || undefined,
      rarete:        rarete || undefined,
    })
  }

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
            L&apos;IA analyse les prix du marché en temps réel.
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

  /* ── Pas de reconnaissance ── */
  if (!recognition) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center">
          <Info className="w-7 h-7 text-gray-400" />
        </div>
        <p className="text-gray-400 text-sm max-w-xs">
          Complétez d&apos;abord l&apos;étape 2 pour que l&apos;IA puisse calculer le prix.
        </p>
      </div>
    )
  }

  if (!result) return null

  const marche = result.marche
  /* Bornes du slider : min = 20% prix suggéré, max = 200% */
  const sliderMin = Math.max(1, Math.round(result.prixSuggere * 0.2))
  const sliderMax = Math.round(result.prixSuggere * 2)
  const currentVal = sliderVal ?? result.prixSuggere

  /* Calcul marge revendeur */
  const prixAchatNum = prixAchat ? parseFloat(prixAchat) : null
  const marge = prixAchatNum !== null ? currentVal - prixAchatNum : null

  /* Prix mini */
  const prixMiniNum = prixMini ? parseFloat(prixMini) : null
  const reductionMax = prixMiniNum !== null
    ? Math.round((1 - prixMiniNum / currentVal) * 100)
    : null

  const inputCls = 'w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-colors'

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
            Basé sur des recherches web en temps réel.
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

      <div className="space-y-5">

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* BLOC 1 — compact                                               */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <ConfidenceBanner confidence={result.confidence} />

          <div className="flex flex-col sm:flex-row items-start gap-5">
            {/* Gauche : prix + raisonnement */}
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Prix de vente suggéré</p>
              <div className="flex items-baseline gap-1.5 mb-3">
                <span className="font-display font-extrabold text-5xl text-gray-900 leading-none">{result.prixSuggere}</span>
                <span className="text-2xl font-bold text-gray-300">€</span>
              </div>
              <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-xl">
                <TrendingUp className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                <p className="text-xs text-gray-600 leading-relaxed">{result.raisonnement}</p>
              </div>
            </div>

            {/* Droite : métriques marché compactes */}
            <div className="w-full sm:w-52 shrink-0 space-y-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Analyse marché</p>
              <div className="grid grid-cols-2 gap-2">
                <MiniMetric label="Prix neuf" value={marche.prixNeufMarque !== null ? `${marche.prixNeufMarque}€` : null} />
                <MiniMetric label="Médiane Vinted" value={marche.prixMedianVinted !== null ? `${marche.prixMedianVinted}€` : null} />
                <MiniMetric label="Fourchette" value={marche.prixMinVinted !== null && marche.prixMaxVinted !== null ? `${marche.prixMinVinted}–${marche.prixMaxVinted}€` : null} />
                <MiniMetric label="Annonces" value={marche.nbAnnonces !== null ? String(marche.nbAnnonces) : null} />
              </div>
              {marche.delaiVente && (
                <div className="flex items-center gap-1.5 text-[10px] text-gray-500 mt-1">
                  <span>Délai estimé :</span>
                  <span className="font-bold text-indigo-600">{marche.delaiVente}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* BLOC 2 — interactif                                            */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-5">

          {/* ── Slider prix ── */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Ajuster le prix
            </p>

            {/* Valeur en temps réel */}
            <div className="text-center">
              <span className="font-display font-extrabold text-4xl text-gray-900">{currentVal}</span>
              <span className="text-xl font-bold text-gray-400 ml-1">€</span>
            </div>

            {/* Frise colorée + slider */}
            <div className="relative">
              <div
                className="absolute top-1/2 -translate-y-1/2 h-2 w-full rounded-full pointer-events-none"
                style={{ background: 'linear-gradient(to right, #22c55e, #f97316, #ef4444)' }}
              />
              <input
                type="range"
                min={sliderMin}
                max={sliderMax}
                step={1}
                value={currentVal}
                onChange={e => setSliderVal(parseInt(e.target.value))}
                className="relative w-full h-2 bg-transparent appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-indigo-600 [&::-webkit-slider-thumb]:shadow-md"
              />
            </div>

            {/* Légende min/suggéré/max */}
            <div className="flex justify-between text-[10px] text-gray-400 font-semibold">
              <span className="text-green-600">{sliderMin}€</span>
              <span className="text-orange-500">{result.prixSuggere}€ suggéré</span>
              <span className="text-red-500">{sliderMax}€</span>
            </div>

            {/* Délai + conseil dynamiques */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl text-xs">
              <span className="text-gray-500">{getConseil(currentVal, result.prixSuggere)}</span>
              <span className="font-bold text-indigo-600 ml-2 shrink-0">
                {getDelai(currentVal, result.prixSuggere)}
              </span>
            </div>
          </div>

          {/* ── Prix minimum à accepter ── */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Prix minimum à accepter
            </p>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="0.01"
                value={prixMini}
                onChange={e => setPrixMini(e.target.value)}
                placeholder="Ex: 18.00"
                className={`${inputCls} pr-8`}
              />
              <Euro className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-300" />
            </div>
            {prixMiniNum !== null && reductionMax !== null && (
              <div className="flex items-center gap-2 p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
                <Info className="w-4 h-4 text-indigo-500 shrink-0" />
                <p className="text-xs text-indigo-700 font-medium">
                  En dessous de <strong>{prixMiniNum}€</strong>, refusez l&apos;offre —{' '}
                  <strong>{reductionMax}%</strong> de réduction max
                </p>
              </div>
            )}
          </div>

          {/* ── Toggle accordion précisions ── */}
          <div className="border-t border-gray-50 pt-4">
            <button
              onClick={() => setShowPrecisions(!showPrecisions)}
              className="flex items-center justify-between w-full text-sm font-semibold text-gray-500 hover:text-gray-700"
            >
              <span>Préciser le prix d&apos;achat</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showPrecisions ? 'rotate-180' : ''}`} />
            </button>
            {showPrecisions && (
              <div className="mt-4 space-y-4">

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Prix d'achat neuf */}
                  <div>
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1.5">
                      Prix d&apos;achat neuf (€)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={prixAchat}
                        onChange={e => setPrixAchat(e.target.value)}
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
                  onClick={handleRecalculate}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white text-sm font-semibold py-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                  Recalculer avec ces informations
                </button>
              </div>
            )}
          </div>

          {/* ── Toggle revendeur ── */}
          <div className="border-t border-gray-50 pt-4">
            <button
              type="button"
              onClick={() => setShowMargin(!showMargin)}
              className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors"
            >
              <div className={`w-9 h-5 rounded-full transition-colors ${showMargin ? 'bg-indigo-600' : 'bg-gray-200'}`}>
                <div className={`w-4 h-4 bg-white rounded-full shadow m-0.5 transition-transform ${showMargin ? 'translate-x-4' : 'translate-x-0'}`} />
              </div>
              Je suis revendeur
            </button>

            {showMargin && (
              <div className="mt-4 space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1.5">
                    Mon prix d&apos;achat (€)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={prixAchat}
                      onChange={e => setPrixAchat(e.target.value)}
                      placeholder="Ex: 12.00"
                      className={`${inputCls} pr-8`}
                    />
                    <Euro className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-300" />
                  </div>
                </div>
                {marge !== null && (
                  <div className={`flex items-center justify-between px-4 py-3 rounded-xl border ${marge >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                    <span className="text-sm font-semibold text-gray-700">Marge nette estimée</span>
                    <div className="text-right">
                      <span className={`font-display font-extrabold text-xl ${marge >= 0 ? 'text-green-700' : 'text-red-600'}`}>
                        {marge >= 0 ? '+' : ''}{marge.toFixed(2)}€
                      </span>
                      {prixAchatNum && prixAchatNum > 0 && (
                        <p className="text-[10px] text-gray-400">
                          {Math.round((marge / prixAchatNum) * 100)}% de marge
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
