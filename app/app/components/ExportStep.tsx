'use client'

import { useState } from 'react'
import {
  Copy, Check, Send, Tag, FileText, Image,
  Package, ChevronRight, ExternalLink,
} from 'lucide-react'
import type { PhotoSlot, RecognitionResult, PriceResult, GenerateResult } from '../types'

/* ─── Props ──────────────────────────────────────────────────────────────── */

interface Props {
  slots: PhotoSlot[]
  recognition: RecognitionResult | null
  pricing: PriceResult | null
  annonce: GenerateResult | null
}

/* ─── Format colis suggéré ────────────────────────────────────────────────── */

function suggestPackage(categorie: string): { label: string; size: string; desc: string } {
  const cat = categorie.toLowerCase()
  if (cat.includes('chaussure') || cat.includes('botte') || cat.includes('basket')) {
    return { label: 'Grand colis', size: 'L', desc: 'Pour les chaussures et accessoires volumineux' }
  }
  if (cat.includes('manteau') || cat.includes('veste') || cat.includes('sac') || cat.includes('combinaison')) {
    return { label: 'Moyen colis', size: 'M', desc: 'Pour les pièces épaisses ou volumineuses' }
  }
  if (cat.includes('robe') || cat.includes('pantalon') || cat.includes('jean') || cat.includes('pull')) {
    return { label: 'Petit colis', size: 'S', desc: 'Pour les pièces légères' }
  }
  return { label: 'Petit colis', size: 'S', desc: 'Pour les accessoires et petites pièces' }
}

/* ─── Bouton copier ──────────────────────────────────────────────────────── */

function CopyBtn({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }
  return (
    <button
      onClick={copy}
      className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-full border transition-all ${
        copied
          ? 'bg-green-50 text-green-700 border-green-200'
          : 'bg-white text-gray-500 border-gray-200 hover:border-indigo-300 hover:text-indigo-600'
      }`}
    >
      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
      {copied ? 'Copié !' : label}
    </button>
  )
}

/* ─── Composant principal ────────────────────────────────────────────────── */

export default function ExportStep({ slots, recognition, pricing, annonce }: Props) {
  const [allCopied, setAllCopied] = useState(false)
  const filledSlots = slots.filter(s => s.file !== null)

  /* Colis suggéré selon catégorie */
  const pkg = suggestPackage(recognition?.categorie.value ?? '')

  function copyAll() {
    if (!annonce || !pricing) return
    /* Utilise la description FR par défaut pour l'export */
    const desc = annonce.descriptionFR || ''
    const text = [
      `TITRE : ${annonce.titre}`,
      '',
      `DESCRIPTION :`,
      desc,
      '',
      `PRIX : ${pricing.prixSuggere}€`,
      `ÉTAT : ${recognition?.etat.value ?? ''}`,
      `TAILLE : ${recognition?.taille.value ?? ''}`,
      recognition?.marque.value ? `MARQUE : ${recognition.marque.value}` : '',
    ].filter(Boolean).join('\n')
    navigator.clipboard.writeText(text)
    setAllCopied(true)
    setTimeout(() => setAllCopied(false), 2000)
  }

  const isReady = !!annonce && !!pricing && !!recognition

  return (
    <div className="max-w-2xl mx-auto">

      {/* ── En-tête ── */}
      <div className="flex items-center gap-2 mb-7">
        <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center">
          <Send className="w-4 h-4 text-indigo-600" />
        </div>
        <div>
          <h2 className="font-display font-extrabold text-2xl text-gray-900">
            Prêt à publier
          </h2>
          <p className="text-sm text-gray-400">Copiez chaque champ et collez-le sur Vinted.</p>
        </div>
      </div>

      {!isReady ? (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 text-center">
          <p className="text-sm font-semibold text-orange-700">
            Complétez les étapes précédentes pour accéder à l'export.
          </p>
        </div>
      ) : (
        <div className="space-y-4">

          {/* ── Aperçu carte style Vinted ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-br from-indigo-50 to-white p-5 border-b border-gray-50">
              <div className="flex items-start gap-4">
                {/* Miniature photo principale */}
                {(slots[0].processedUrl ?? slots[0].preview) ? (
                  <img
                    src={slots[0].processedUrl ?? slots[0].preview ?? ''}
                    alt="Photo principale"
                    className="w-20 h-20 object-cover rounded-xl border border-gray-100 shrink-0"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                    <Image className="w-6 h-6 text-gray-300" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-display font-extrabold text-base text-gray-900 leading-tight mb-1.5">
                    {annonce!.titre}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      recognition!.marque.value,
                      recognition!.taille.value,
                      recognition!.etat.value,
                      ...(recognition!.couleurs.value.slice(0, 2)),
                    ].filter(Boolean).map((tag, i) => (
                      <span key={i} className="text-[10px] font-semibold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-display font-extrabold text-2xl text-gray-900">
                    {pricing!.prixSuggere}€
                  </span>
                </div>
              </div>
            </div>
            <div className="px-5 py-4">
              <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                {annonce!.descriptionFR}
              </p>
            </div>
          </div>

          {/* ── Champs à copier ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">

            {/* Titre */}
            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3 min-w-0">
                <FileText className="w-4 h-4 text-indigo-500 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Titre</p>
                  <p className="text-sm font-semibold text-gray-800 truncate">{annonce!.titre}</p>
                </div>
              </div>
              <CopyBtn text={annonce!.titre} label="Copier" />
            </div>

            {/* Prix */}
            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <Tag className="w-4 h-4 text-indigo-500 shrink-0" />
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Prix</p>
                  <p className="text-sm font-semibold text-gray-800">{pricing!.prixSuggere}€</p>
                </div>
              </div>
              <CopyBtn text={String(pricing!.prixSuggere)} label="Copier" />
            </div>

            {/* Description */}
            <div className="flex items-start justify-between px-5 py-4">
              <div className="flex items-start gap-3 min-w-0 flex-1 mr-4">
                <FileText className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Description</p>
                  <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{annonce!.descriptionFR}</p>
                </div>
              </div>
              <CopyBtn text={annonce!.descriptionFR} label="Copier" />
            </div>
          </div>

          {/* ── Format colis suggéré ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center">
                  <Package className="w-4 h-4 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-0.5">
                    Format colis recommandé
                  </p>
                  <p className="text-sm font-semibold text-gray-800">
                    {pkg.label}
                    <span className="ml-2 text-[10px] font-bold bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-md">{pkg.size}</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{pkg.desc}</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Photos uploadées ── */}
          {filledSlots.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <Image className="w-4 h-4 text-indigo-500" />
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Photos ({filledSlots.length}/14)
                </p>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {filledSlots.map(slot => (
                  <img
                    key={slot.id}
                    src={slot.id === 0 ? (slot.processedUrl ?? slot.preview ?? '') : (slot.preview ?? '')}
                    alt={`Slot ${slot.id}`}
                    className="w-14 h-14 object-cover rounded-lg border border-gray-100 shrink-0"
                  />
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Ajoutez ces photos manuellement sur Vinted lors de la publication.
              </p>
            </div>
          )}

          {/* ── CTA final ── */}
          <div className="space-y-3">
            <button
              onClick={copyAll}
              className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold text-sm transition-all active:scale-[0.98] ${
                allCopied
                  ? 'bg-green-500 text-white'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {allCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {allCopied ? 'Tout copié !' : 'Tout copier (titre + description + prix)'}
            </button>

            <a
              href="https://www.vinted.fr/sell"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Ouvrir Vinted pour publier
              <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>
      )}
    </div>
  )
}
