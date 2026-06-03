'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Camera, ScanLine, Tag, FileText, Send, ArrowLeft, ChevronRight } from 'lucide-react'
import PhotoUploadStep from './components/PhotoUploadStep'
import RecognitionStep from './components/RecognitionStep'
import PricingStep from './components/PricingStep'
import AnnonceStep from './components/AnnonceStep'
import ExportStep from './components/ExportStep'
import type { PhotoSlot, RecognitionResult, PriceResult, GenerateResult } from './types'
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
      { label: 'Photos',          shortLabel: 'Photos'  },
      { label: 'Reconnaissance',  shortLabel: 'Reconn.' },
      { label: 'Annonce',         shortLabel: 'Annonce' },
      { label: 'Prix',            shortLabel: 'Prix'    },
      { label: 'Export',          shortLabel: 'Export'  },
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
      { label: 'Photos',      shortLabel: 'Photos'  },
      { label: 'Recognition', shortLabel: 'Recogn.' },
      { label: 'Listing',     shortLabel: 'Listing' },
      { label: 'Price',       shortLabel: 'Price'   },
      { label: 'Export',      shortLabel: 'Export'  },
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
      { label: 'Fotos',         shortLabel: 'Fotos'   },
      { label: 'Identificación',shortLabel: 'Ident.'  },
      { label: 'Anuncio',       shortLabel: 'Anuncio' },
      { label: 'Precio',        shortLabel: 'Precio'  },
      { label: 'Exportar',      shortLabel: 'Export'  },
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
      { label: 'Fotos',       shortLabel: 'Fotos'   },
      { label: 'Erkennung',   shortLabel: 'Erkenn.' },
      { label: 'Anzeige',     shortLabel: 'Anzeige' },
      { label: 'Preis',       shortLabel: 'Preis'   },
      { label: 'Export',      shortLabel: 'Export'  },
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
      { label: 'Foto',          shortLabel: 'Foto'    },
      { label: 'Riconoscimento',shortLabel: 'Riconosc.'},
      { label: 'Annuncio',      shortLabel: 'Annuncio'},
      { label: 'Prezzo',        shortLabel: 'Prezzo'  },
      { label: 'Esporta',       shortLabel: 'Esporta' },
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
      { label: "Foto's",    shortLabel: "Foto's"  },
      { label: 'Herkenning',shortLabel: 'Herkenn.'},
      { label: 'Advertentie',shortLabel: 'Advert.' },
      { label: 'Prijs',     shortLabel: 'Prijs'   },
      { label: 'Export',    shortLabel: 'Export'  },
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
      { label: 'Zdjęcia',    shortLabel: 'Zdjęcia' },
      { label: 'Rozpoznanie',shortLabel: 'Rozp.'   },
      { label: 'Ogłoszenie', shortLabel: 'Ogłosz.' },
      { label: 'Cena',       shortLabel: 'Cena'    },
      { label: 'Eksport',    shortLabel: 'Eksport' },
    ],
    newListing:   'Nowe ogłoszenie',
    stepOf:       (s, t) => `Krok ${s} / ${t}`,
    prev:         'Wstecz',
    next:         'Dalej',
    finish:       'Zakończ',
    addMainPhoto: 'Dodaj co najmniej główne zdjęcie, aby kontynuować',
  },
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

  const [step, setStep] = useState(1)
  const [slots, setSlots] = useState<PhotoSlot[]>(makeSlots)
  const [recognitionResult, setRecognitionResult] = useState<RecognitionResult | null>(null)
  const [pricingResult, setPricingResult] = useState<PriceResult | null>(null)
  const [annonceResult, setAnnonceResult] = useState<GenerateResult | null>(null)

  const mainPhotoReady = slots[0].file !== null
    && slots[0].status !== 'uploading'
    && slots[0].status !== 'processing-bg'

  /* ── Condition pour avancer selon l'étape active ── */
  function canContinue(): boolean {
    if (step === 1) return mainPhotoReady
    if (step === 2) return recognitionResult !== null
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
        {step === 1 && (
          <PhotoUploadStep slots={slots} setSlots={setSlots} />
        )}

        {step === 2 && (
          <RecognitionStep
            slots={slots}
            result={recognitionResult}
            setResult={setRecognitionResult}
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
