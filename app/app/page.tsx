'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Camera, ScanLine, Tag, FileText, Send, ArrowLeft, ChevronRight } from 'lucide-react'
import PhotoUploadStep from './components/PhotoUploadStep'
import RecognitionStep from './components/RecognitionStep'
import PricingStep from './components/PricingStep'
import AnnonceStep from './components/AnnonceStep'
import ExportStep from './components/ExportStep'
import type { PhotoSlot, RecognitionResult, PriceResult, GenerateResult, Plan } from './types'
import { useLang } from '@/app/providers'
import type { Lang } from '@/lib/i18n'

/* ─── Icônes des étapes (statiques) ──────────────────────────────────────── */

const STEP_ICONS = [
  { num: 1 as const, Icon: Camera   },
  { num: 2 as const, Icon: ScanLine },
  { num: 3 as const, Icon: FileText },
  { num: 4 as const, Icon: Tag      },
  { num: 5 as const, Icon: Send     },
]

/* ─── Traductions de la page — 7 langues ─────────────────────────────────── */

const PAGE_I18N: Record<Lang, {
  steps: { label: string; shortLabel: string }[]
  newListing: string
  stepOf: (s: number, t: number) => string
  prev: string
  next: string
  finish: string
  addMainPhoto: string
}> = {
  fr: {
    steps: [
      { label: 'Article',          shortLabel: 'Article' },
      { label: 'Visuels',         shortLabel: 'Visuels' },
      { label: 'Annonce',         shortLabel: 'Annonce' },
      { label: 'Prix',            shortLabel: 'Prix'    },
      { label: 'Publication',      shortLabel: 'Publi.'  },
    ],
    newListing:   'Nouvelle annonce',
    stepOf:       (s, t) => `Étape ${s} / ${t}`,
    prev:         'Précédent',
    next:         'Continuer',
    finish:       'Terminer',
    addMainPhoto: 'Ajoutez au moins la photo principale pour continuer',
  },
  en: {
    steps: [
      { label: 'Article',     shortLabel: 'Article' },
      { label: 'Visuals',     shortLabel: 'Visuals' },
      { label: 'Listing',     shortLabel: 'Listing' },
      { label: 'Price',       shortLabel: 'Price'   },
      { label: 'Publishing',  shortLabel: 'Publish.'},
    ],
    newListing:   'New listing',
    stepOf:       (s, t) => `Step ${s} / ${t}`,
    prev:         'Previous',
    next:         'Continue',
    finish:       'Finish',
    addMainPhoto: 'Add at least the main photo to continue',
  },
  es: {
    steps: [
      { label: 'Artículo',       shortLabel: 'Artíc.'  },
      { label: 'Visuales',       shortLabel: 'Visual.' },
      { label: 'Anuncio',       shortLabel: 'Anuncio' },
      { label: 'Precio',        shortLabel: 'Precio'  },
      { label: 'Publicación',    shortLabel: 'Public.' },
    ],
    newListing:   'Nuevo anuncio',
    stepOf:       (s, t) => `Paso ${s} / ${t}`,
    prev:         'Anterior',
    next:         'Continuar',
    finish:       'Finalizar',
    addMainPhoto: 'Añade al menos la foto principal para continuar',
  },
  de: {
    steps: [
      { label: 'Artikel',      shortLabel: 'Artikel' },
      { label: 'Visuals',      shortLabel: 'Visuals' },
      { label: 'Anzeige',     shortLabel: 'Anzeige' },
      { label: 'Preis',       shortLabel: 'Preis'   },
      { label: 'Veröffentlichen', shortLabel: 'Veröff.' },
    ],
    newListing:   'Neue Anzeige',
    stepOf:       (s, t) => `Schritt ${s} / ${t}`,
    prev:         'Zurück',
    next:         'Weiter',
    finish:       'Fertig',
    addMainPhoto: 'Füge mindestens das Hauptfoto hinzu, um fortzufahren',
  },
  it: {
    steps: [
      { label: 'Articolo',       shortLabel: 'Artic.'  },
      { label: 'Immagini',        shortLabel: 'Immagin.'},
      { label: 'Annuncio',      shortLabel: 'Annuncio'},
      { label: 'Prezzo',        shortLabel: 'Prezzo'  },
      { label: 'Pubblicazione',  shortLabel: 'Pubbl.'  },
    ],
    newListing:   'Nuovo annuncio',
    stepOf:       (s, t) => `Passo ${s} / ${t}`,
    prev:         'Precedente',
    next:         'Continua',
    finish:       'Fine',
    addMainPhoto: 'Aggiungi almeno la foto principale per continuare',
  },
  nl: {
    steps: [
      { label: 'Artikel',    shortLabel: 'Artikel' },
      { label: 'Visuals',    shortLabel: 'Visuals' },
      { label: 'Advertentie',shortLabel: 'Advert.' },
      { label: 'Prijs',     shortLabel: 'Prijs'   },
      { label: 'Publiceren', shortLabel: 'Public.' },
    ],
    newListing:   'Nieuwe advertentie',
    stepOf:       (s, t) => `Stap ${s} / ${t}`,
    prev:         'Vorige',
    next:         'Volgende',
    finish:       'Afronden',
    addMainPhoto: "Voeg minimaal de hoofdfoto toe om door te gaan",
  },
  pl: {
    steps: [
      { label: 'Artykuł',     shortLabel: 'Artykuł' },
      { label: 'Zdjęcia',     shortLabel: 'Zdjęcia' },
      { label: 'Ogłoszenie', shortLabel: 'Ogłosz.' },
      { label: 'Cena',       shortLabel: 'Cena'    },
      { label: 'Publikacja',  shortLabel: 'Publik.' },
    ],
    newListing:   'Nowe ogłoszenie',
    stepOf:       (s, t) => `Krok ${s} / ${t}`,
    prev:         'Wstecz',
    next:         'Dalej',
    finish:       'Zakończ',
    addMainPhoto: 'Dodaj co najmniej główne zdjęcie, aby kontynuować',
  },
}

/* ─── Switcher plan DEV ───────────────────────────────────────────────────── */

function PlanSwitcher({ plan, onChange }: { plan: Plan; onChange: (p: Plan) => void }) {
  return (
    <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 mb-6">
      <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider shrink-0">DEV</span>
      <div className="flex gap-1">
        {(['freemium', 'premium', 'pro'] as Plan[]).map(p => (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`text-xs font-semibold px-3 py-1 rounded-lg transition-all ${
              plan === p ? 'bg-amber-400 text-white shadow-sm' : 'text-amber-600 hover:bg-amber-100'
            }`}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>
    </div>
  )
}

/* ─── État initial des 15 slots ───────────────────────────────────────────── */

function makeSlots(): PhotoSlot[] {
  return Array.from({ length: 15 }, (_, i) => ({
    id: i,
    file: null,
    preview: null,
    processedUrl: null,
    status: 'empty' as const,
  }))
}

/* ─── Page /app ───────────────────────────────────────────────────────────── */

export default function AppPage() {
  const { lang } = useLang()
  const t = PAGE_I18N[lang] ?? PAGE_I18N.fr
  const STEPS = STEP_ICONS.map((s, i) => ({ ...s, ...t.steps[i] }))

  const [plan, setPlan] = useState<Plan>('freemium')
  const [step, setStep] = useState(1)
  const [slots, setSlots] = useState<PhotoSlot[]>(makeSlots)
  const [aiPhotos, setAiPhotos] = useState<string[]>([])
  const [recognitionResult, setRecognitionResult] = useState<RecognitionResult | null>(null)
  const [pricingResult, setPricingResult] = useState<PriceResult | null>(null)
  const [annonceResult, setAnnonceResult] = useState<GenerateResult | null>(null)

  /* Reset de la génération quand l'utilisateur ajoute des infos complémentaires à l'étape 2 */
  const prevMissingCountRef = useRef(0)
  useEffect(() => {
    const newCount = recognitionResult?.extraInfo?.missingInfos?.length ?? 0
    if (newCount > prevMissingCountRef.current && annonceResult) {
      setAnnonceResult(null)
    }
    prevMissingCountRef.current = newCount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recognitionResult?.extraInfo?.missingInfos?.length])

  const mainPhotoReady = slots[0].file !== null
    && slots[0].status !== 'uploading'
    && slots[0].status !== 'processing-bg'

  /* ── Condition pour avancer selon l'étape active ── */
  function canContinue(): boolean {
    if (step === 1) return mainPhotoReady && recognitionResult !== null
    if (step === 2) return true
    if (step === 3) return annonceResult !== null
    if (step === 4) return pricingResult !== null
    return true
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* ── Header minimal ── */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="font-display font-extrabold text-base tracking-tight text-gray-900">
              SellerLab
            </span>
            <span className="text-[10px] font-bold bg-indigo-600 text-white px-1.5 py-0.5 rounded-md tracking-widest uppercase">
              AI
            </span>
          </Link>

          <span className="hidden sm:block text-sm font-semibold text-gray-500">
            {t.newListing}
          </span>

          <span className="text-xs font-medium text-gray-400 shrink-0">
            {t.stepOf(step, STEPS.length)}
          </span>
        </div>
      </header>

      {/* ── Stepper ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3">
          <ol className="flex items-center gap-1 sm:gap-2">
            {STEPS.map((s, i) => {
              const isActive = s.num === step
              const isDone   = s.num < step
              const isLocked = s.num > step

              return (
                <li key={s.num} className="flex items-center gap-1 sm:gap-2 flex-1 min-w-0">
                  <div className={`flex items-center gap-1.5 min-w-0 ${isLocked ? 'opacity-35' : ''}`}>
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-extrabold transition-all ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200/60'
                          : isDone
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {isDone ? '✓' : s.num}
                    </div>
                    <span className={`text-xs font-semibold hidden sm:block truncate transition-colors ${
                      isActive ? 'text-indigo-600' : 'text-gray-400'
                    }`}>
                      {s.label}
                    </span>
                    <span className={`text-[10px] font-semibold sm:hidden truncate transition-colors ${
                      isActive ? 'text-indigo-600' : 'text-gray-400'
                    }`}>
                      {s.shortLabel}
                    </span>
                  </div>

                  {i < STEPS.length - 1 && (
                    <div className={`flex-1 h-px transition-colors ${
                      s.num < step ? 'bg-green-300' : 'bg-gray-100'
                    }`} />
                  )}
                </li>
              )
            })}
          </ol>
        </div>
      </div>

      {/* ── Contenu de l'étape ── */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8">
        <PlanSwitcher plan={plan} onChange={setPlan} />
        {step === 1 && (
          <PhotoUploadStep
            slots={slots}
            setSlots={setSlots}
            result={recognitionResult}
            setResult={setRecognitionResult}
            plan={plan}
          />
        )}

        {step === 2 && (
          <RecognitionStep
            slots={slots}
            setSlots={setSlots}
            result={recognitionResult}
            aiPhotos={aiPhotos}
            setAiPhotos={setAiPhotos}
            plan={plan}
          />
        )}

        {step === 3 && (
          <AnnonceStep
            recognition={recognitionResult}
            result={annonceResult}
            setResult={setAnnonceResult}
          />
        )}

        {step === 4 && (
          <PricingStep
            recognition={recognitionResult}
            result={pricingResult}
            setResult={setPricingResult}
          />
        )}

        {step === 5 && (
          <ExportStep
            slots={slots}
            aiPhotos={aiPhotos}
            recognition={recognitionResult}
            pricing={pricingResult}
            annonce={annonceResult}
          />
        )}
      </main>

      {/* ── Barre de navigation sticky en bas ── */}
      <div className="sticky bottom-0 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">

          <button
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
            className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-900 disabled:opacity-30 disabled:pointer-events-none transition-colors px-4 py-2 rounded-full hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4" />
            {t.prev}
          </button>

          {step === 1 && !mainPhotoReady && (
            <p className="text-xs text-gray-400 hidden sm:block">
              {t.addMainPhoto}
            </p>
          )}

          {step < STEPS.length && (
            <button
              onClick={() => setStep((s) => Math.min(STEPS.length, s + 1))}
              disabled={!canContinue()}
              className="btn-shimmer flex items-center gap-2 bg-indigo-600 text-white font-semibold px-6 py-2.5 rounded-full hover:bg-indigo-700 disabled:opacity-40 disabled:pointer-events-none active:scale-95 transition-all text-sm shadow-md shadow-indigo-200/60"
            >
              {t.next}
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          {step === STEPS.length && (
            <Link
              href="/"
              className="btn-shimmer flex items-center gap-2 bg-green-600 text-white font-semibold px-6 py-2.5 rounded-full hover:bg-green-700 active:scale-95 transition-all text-sm shadow-md shadow-green-200/60"
            >
              {t.finish}
              <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
