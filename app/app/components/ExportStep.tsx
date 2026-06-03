'use client'

import { useState } from 'react'
import {
  Copy, Check, Send, Tag, FileText, Image,
  Package, ChevronRight, ExternalLink, Download, FolderOpen,
} from 'lucide-react'
import type { PhotoSlot, RecognitionResult, PriceResult, GenerateResult } from '../types'
import { useLang } from '@/app/providers'
import type { Lang } from '@/lib/i18n'
import {
  tx, CATEGORY_LABELS, SUBCATEGORY_LABELS, CONDITION_LABELS, COLOR_LABELS, MATERIAL_LABELS,
} from '@/lib/vinted-taxonomy'

/* ─── Traductions UI — 7 langues ─────────────────────────────────────────── */

const UI: Record<Lang, {
  header: string; headerSub: string; incomplete: string
  photos: (n: number) => string; downloadZip: string; preparing: string; noPhotos: string
  titleField: string; descField: string; detailsField: string
  categoryLabel: string; brandLabel: string; sizeLabel: string; condLabel: string; colorLabel: string; matLabel: string
  selectMenus: string; priceField: string
  packageLabel: string; openVinted: string; copy: string; copied: string
  pkgLarge: string; pkgLargeDesc: string
  pkgMedium: string; pkgMediumDesc: string
  pkgSmall: string; pkgSmallDesc: string; pkgSmallDescAcc: string
}> = {
  fr: {
    header: 'Prêt à publier', headerSub: 'Copiez chaque champ et collez-le sur Vinted.',
    incomplete: "Complétez les étapes précédentes pour accéder à l'export.",
    photos: n => `1. Photos (${n}/15)`, downloadZip: 'Télécharger en ZIP', preparing: 'Préparation…', noPhotos: 'Aucune photo uploadée.',
    titleField: '2. Titre', descField: '3. Description', detailsField: "4. Détails de l'article",
    categoryLabel: 'Catégorie', brandLabel: 'Marque', sizeLabel: 'Taille', condLabel: 'État', colorLabel: 'Couleur', matLabel: 'Matériau',
    selectMenus: 'À sélectionner dans les menus déroulants Vinted', priceField: '5. Prix de vente suggéré',
    packageLabel: 'Format colis recommandé', openVinted: 'Ouvrir Vinted pour publier', copy: 'Copier', copied: 'Copié !',
    pkgLarge: 'Grand colis', pkgLargeDesc: 'Pour les chaussures et accessoires volumineux',
    pkgMedium: 'Moyen colis', pkgMediumDesc: 'Pour les pièces épaisses ou volumineuses',
    pkgSmall: 'Petit colis', pkgSmallDesc: 'Pour les pièces légères', pkgSmallDescAcc: 'Pour les accessoires et petites pièces',
  },
  en: {
    header: 'Ready to publish', headerSub: 'Copy each field and paste it on Vinted.',
    incomplete: 'Complete the previous steps to access the export.',
    photos: n => `1. Photos (${n}/15)`, downloadZip: 'Download as ZIP', preparing: 'Preparing…', noPhotos: 'No photos uploaded.',
    titleField: '2. Title', descField: '3. Description', detailsField: '4. Item details',
    categoryLabel: 'Category', brandLabel: 'Brand', sizeLabel: 'Size', condLabel: 'Condition', colorLabel: 'Color', matLabel: 'Material',
    selectMenus: 'To be selected from Vinted dropdown menus', priceField: '5. Suggested selling price',
    packageLabel: 'Recommended parcel format', openVinted: 'Open Vinted to publish', copy: 'Copy', copied: 'Copied!',
    pkgLarge: 'Large parcel', pkgLargeDesc: 'For shoes and bulky accessories',
    pkgMedium: 'Medium parcel', pkgMediumDesc: 'For thick or bulky items',
    pkgSmall: 'Small parcel', pkgSmallDesc: 'For lightweight items', pkgSmallDescAcc: 'For accessories and small items',
  },
  es: {
    header: 'Listo para publicar', headerSub: 'Copia cada campo y pégalo en Vinted.',
    incomplete: 'Completa los pasos anteriores para acceder a la exportación.',
    photos: n => `1. Fotos (${n}/15)`, downloadZip: 'Descargar en ZIP', preparing: 'Preparando…', noPhotos: 'No hay fotos cargadas.',
    titleField: '2. Título', descField: '3. Descripción', detailsField: '4. Detalles del artículo',
    categoryLabel: 'Categoría', brandLabel: 'Marca', sizeLabel: 'Talla', condLabel: 'Estado', colorLabel: 'Color', matLabel: 'Material',
    selectMenus: 'A seleccionar en los menús desplegables de Vinted', priceField: '5. Precio de venta sugerido',
    packageLabel: 'Formato de paquete recomendado', openVinted: 'Abrir Vinted para publicar', copy: 'Copiar', copied: '¡Copiado!',
    pkgLarge: 'Paquete grande', pkgLargeDesc: 'Para zapatos y accesorios voluminosos',
    pkgMedium: 'Paquete mediano', pkgMediumDesc: 'Para prendas gruesas o voluminosas',
    pkgSmall: 'Paquete pequeño', pkgSmallDesc: 'Para prendas ligeras', pkgSmallDescAcc: 'Para accesorios y artículos pequeños',
  },
  de: {
    header: 'Bereit zur Veröffentlichung', headerSub: 'Kopiere jedes Feld und füge es auf Vinted ein.',
    incomplete: 'Vervollständige die vorherigen Schritte, um den Export zu öffnen.',
    photos: n => `1. Fotos (${n}/15)`, downloadZip: 'Als ZIP herunterladen', preparing: 'Vorbereitung…', noPhotos: 'Keine Fotos hochgeladen.',
    titleField: '2. Titel', descField: '3. Beschreibung', detailsField: '4. Artikeldetails',
    categoryLabel: 'Kategorie', brandLabel: 'Marke', sizeLabel: 'Größe', condLabel: 'Zustand', colorLabel: 'Farbe', matLabel: 'Material',
    selectMenus: 'In den Vinted-Dropdown-Menüs auswählen', priceField: '5. Vorgeschlagener Verkaufspreis',
    packageLabel: 'Empfohlenes Paketformat', openVinted: 'Vinted öffnen und veröffentlichen', copy: 'Kopieren', copied: 'Kopiert!',
    pkgLarge: 'Großes Paket', pkgLargeDesc: 'Für Schuhe und sperrige Accessoires',
    pkgMedium: 'Mittleres Paket', pkgMediumDesc: 'Für dicke oder sperrige Teile',
    pkgSmall: 'Kleines Paket', pkgSmallDesc: 'Für leichte Teile', pkgSmallDescAcc: 'Für Accessoires und kleine Teile',
  },
  it: {
    header: 'Pronto per pubblicare', headerSub: 'Copia ogni campo e incollalo su Vinted.',
    incomplete: 'Completa i passaggi precedenti per accedere all\'esportazione.',
    photos: n => `1. Foto (${n}/15)`, downloadZip: 'Scarica come ZIP', preparing: 'Preparazione…', noPhotos: 'Nessuna foto caricata.',
    titleField: '2. Titolo', descField: '3. Descrizione', detailsField: "4. Dettagli dell'articolo",
    categoryLabel: 'Categoria', brandLabel: 'Marca', sizeLabel: 'Taglia', condLabel: 'Stato', colorLabel: 'Colore', matLabel: 'Materiale',
    selectMenus: 'Da selezionare nei menu a tendina di Vinted', priceField: '5. Prezzo di vendita suggerito',
    packageLabel: 'Formato pacco consigliato', openVinted: 'Apri Vinted per pubblicare', copy: 'Copia', copied: 'Copiato!',
    pkgLarge: 'Pacco grande', pkgLargeDesc: 'Per scarpe e accessori voluminosi',
    pkgMedium: 'Pacco medio', pkgMediumDesc: 'Per capi spessi o voluminosi',
    pkgSmall: 'Pacco piccolo', pkgSmallDesc: 'Per capi leggeri', pkgSmallDescAcc: 'Per accessori e articoli piccoli',
  },
  nl: {
    header: 'Klaar om te publiceren', headerSub: 'Kopieer elk veld en plak het op Vinted.',
    incomplete: 'Voltooi de vorige stappen om toegang te krijgen tot de export.',
    photos: n => `1. Foto's (${n}/15)`, downloadZip: 'Downloaden als ZIP', preparing: 'Voorbereiden…', noPhotos: "Geen foto's geüpload.",
    titleField: '2. Titel', descField: '3. Beschrijving', detailsField: '4. Artikeldetails',
    categoryLabel: 'Categorie', brandLabel: 'Merk', sizeLabel: 'Maat', condLabel: 'Staat', colorLabel: 'Kleur', matLabel: 'Materiaal',
    selectMenus: 'Te selecteren in de Vinted-vervolgkeuzemenu\'s', priceField: '5. Voorgestelde verkoopprijs',
    packageLabel: 'Aanbevolen pakketformaat', openVinted: 'Vinted openen om te publiceren', copy: 'Kopiëren', copied: 'Gekopieerd!',
    pkgLarge: 'Groot pakket', pkgLargeDesc: 'Voor schoenen en omvangrijke accessoires',
    pkgMedium: 'Middelgroot pakket', pkgMediumDesc: 'Voor dikke of omvangrijke stukken',
    pkgSmall: 'Klein pakket', pkgSmallDesc: 'Voor lichte stukken', pkgSmallDescAcc: 'Voor accessoires en kleine stukken',
  },
  pl: {
    header: 'Gotowe do publikacji', headerSub: 'Skopiuj każde pole i wklej je na Vinted.',
    incomplete: 'Ukończ poprzednie kroki, aby uzyskać dostęp do eksportu.',
    photos: n => `1. Zdjęcia (${n}/15)`, downloadZip: 'Pobierz jako ZIP', preparing: 'Przygotowanie…', noPhotos: 'Brak przesłanych zdjęć.',
    titleField: '2. Tytuł', descField: '3. Opis', detailsField: '4. Szczegóły artykułu',
    categoryLabel: 'Kategoria', brandLabel: 'Marka', sizeLabel: 'Rozmiar', condLabel: 'Stan', colorLabel: 'Kolor', matLabel: 'Materiał',
    selectMenus: 'Do wybrania z menu rozwijanych Vinted', priceField: '5. Sugerowana cena sprzedaży',
    packageLabel: 'Zalecany format przesyłki', openVinted: 'Otwórz Vinted aby opublikować', copy: 'Kopiuj', copied: 'Skopiowano!',
    pkgLarge: 'Duża paczka', pkgLargeDesc: 'Do butów i objętościowych akcesoriów',
    pkgMedium: 'Średnia paczka', pkgMediumDesc: 'Do grubych lub objętościowych elementów',
    pkgSmall: 'Mała paczka', pkgSmallDesc: 'Do lekkich elementów', pkgSmallDescAcc: 'Do akcesoriów i małych przedmiotów',
  },
}

/* ─── Props ──────────────────────────────────────────────────────────────── */

interface Props {
  slots: PhotoSlot[]
  recognition: RecognitionResult | null
  pricing: PriceResult | null
  annonce: GenerateResult | null
}

/* ─── Format colis suggéré ────────────────────────────────────────────────── */

type PkgTrans = Pick<typeof UI['fr'], 'pkgLarge'|'pkgLargeDesc'|'pkgMedium'|'pkgMediumDesc'|'pkgSmall'|'pkgSmallDesc'|'pkgSmallDescAcc'>

function suggestPackage(categorie: string, t: PkgTrans): { label: string; size: string; desc: string } {
  const cat = categorie.toLowerCase()
  if (cat.includes('chaussure') || cat.includes('botte') || cat.includes('basket')) {
    return { label: t.pkgLarge, size: 'L', desc: t.pkgLargeDesc }
  }
  if (cat.includes('manteau') || cat.includes('veste') || cat.includes('sac') || cat.includes('combinaison')) {
    return { label: t.pkgMedium, size: 'M', desc: t.pkgMediumDesc }
  }
  if (cat.includes('robe') || cat.includes('pantalon') || cat.includes('jean') || cat.includes('pull')) {
    return { label: t.pkgSmall, size: 'S', desc: t.pkgSmallDesc }
  }
  return { label: t.pkgSmall, size: 'S', desc: t.pkgSmallDescAcc }
}

/* ─── URL Vinted selon langue navigateur ─────────────────────────────────── */

function getVintedUrl(): string {
  const lang = typeof navigator !== 'undefined'
    ? navigator.language.slice(0, 2).toLowerCase()
    : 'fr'
  const domains: Record<string, string> = {
    fr: 'https://www.vinted.fr/items/new',
    es: 'https://www.vinted.es/items/new',
    de: 'https://www.vinted.de/items/new',
    it: 'https://www.vinted.it/items/new',
    nl: 'https://www.vinted.nl/items/new',
    pl: 'https://www.vinted.pl/items/new',
    en: 'https://www.vinted.co.uk/items/new',
  }
  return domains[lang] ?? domains['fr']
}

/* ─── Bouton copier ──────────────────────────────────────────────────────── */

function CopyBtn({ text, label, copiedLabel }: { text: string; label: string; copiedLabel?: string }) {
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
      {copied ? (copiedLabel ?? 'Copié !') : label}
    </button>
  )
}

/* ─── Composant principal ────────────────────────────────────────────────── */

export default function ExportStep({ slots, recognition, pricing, annonce }: Props) {
  const { lang } = useLang()
  const t = UI[lang] ?? UI.fr
  const [downloading, setDownloading] = useState(false)
  const filledSlots = slots.filter(s => s.file !== null)
  const pkg = suggestPackage(recognition?.categorie.value ?? '', t)

  /* ── Téléchargement ZIP des photos ── */
  async function downloadZip() {
    if (filledSlots.length === 0) return
    setDownloading(true)
    try {
      const JSZip = (await import('jszip')).default
      const zip = new JSZip()
      const folder = zip.folder('photos-vinted')!

      for (const slot of filledSlots) {
        /* Slot 0 : préférer l'URL traitée (fond supprimé) si disponible */
        const url = slot.id === 0
          ? (slot.processedUrl ?? slot.preview)
          : slot.preview
        if (!url) continue
        const blob = await fetch(url).then(r => r.blob())
        const ext = blob.type === 'image/png' ? 'png' : 'jpg'
        folder.file(`photo-${String(slot.id + 1).padStart(2, '0')}.${ext}`, blob)
      }

      const content = await zip.generateAsync({ type: 'blob' })
      const a = document.createElement('a')
      a.href = URL.createObjectURL(content)
      a.download = 'photos-vinted.zip'
      a.click()
      URL.revokeObjectURL(a.href)
    } catch (err) {
      console.error('[zip] Erreur:', err)
    } finally {
      setDownloading(false)
    }
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
            {t.header}
          </h2>
          <p className="text-sm text-gray-400">{t.headerSub}</p>
        </div>
      </div>

      {!isReady ? (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 text-center">
          <p className="text-sm font-semibold text-orange-700">
            {t.incomplete}
          </p>
        </div>
      ) : (
        <div className="space-y-4">

          {/* ── 1. PHOTOS ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Image className="w-4 h-4 text-indigo-500" />
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  {t.photos(filledSlots.length)}
                </p>
              </div>
              {filledSlots.length > 0 && (
                <button
                  onClick={downloadZip}
                  disabled={downloading}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-full border border-gray-200 bg-white text-gray-500 hover:border-indigo-300 hover:text-indigo-600 transition-all disabled:opacity-50"
                >
                  <Download className="w-3 h-3" />
                  {downloading ? t.preparing : t.downloadZip}
                </button>
              )}
            </div>
            {filledSlots.length > 0 ? (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {filledSlots.map(slot => (
                  <img
                    key={slot.id}
                    src={slot.id === 0 ? (slot.processedUrl ?? slot.preview ?? '') : (slot.preview ?? '')}
                    alt={`Photo ${slot.id + 1}`}
                    className="w-14 h-14 object-cover rounded-lg border border-gray-100 shrink-0"
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">{t.noPhotos}</p>
            )}
          </div>

          {/* ── Champs à copier (ordre formulaire Vinted) ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">

            {/* 2. TITRE */}
            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3 min-w-0">
                <FileText className="w-4 h-4 text-indigo-500 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t.titleField}</p>
                  <p className="text-sm font-semibold text-gray-800 truncate">{annonce!.titre}</p>
                </div>
              </div>
              <CopyBtn text={annonce!.titre} label={t.copy} copiedLabel={t.copied} />
            </div>

            {/* 3. DESCRIPTION */}
            <div className="flex items-start justify-between px-5 py-4">
              <div className="flex items-start gap-3 min-w-0 flex-1 mr-4">
                <FileText className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">{t.descField}</p>
                  <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                    {annonce!.descriptionExport ?? annonce!.descriptionFR}
                  </p>
                </div>
              </div>
              <CopyBtn text={annonce!.descriptionExport ?? annonce!.descriptionFR} label={t.copy} copiedLabel={t.copied} />
            </div>

            {/* 4. DÉTAILS DE L'ARTICLE — informatif uniquement */}
            <div className="px-5 py-4">
              <div className="flex items-center gap-2 mb-3">
                <FolderOpen className="w-4 h-4 text-indigo-500 shrink-0" />
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t.detailsField}</p>
              </div>

              {/* Catégorie — pleine largeur car peut être long */}
              <div className="mb-3">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">{t.categoryLabel}</p>
                <p className="text-sm font-medium text-gray-800 flex items-center gap-1 flex-wrap">
                  {tx(CATEGORY_LABELS, lang, recognition!.categorie.value)}
                  {recognition!.sousCategorie.value && (
                    <>
                      <ChevronRight className="w-3 h-3 text-gray-400 shrink-0" />
                      {tx(SUBCATEGORY_LABELS, lang, recognition!.sousCategorie.value)}
                    </>
                  )}
                </p>
              </div>

              {/* Autres champs — grille 2 colonnes */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">{t.brandLabel}</p>
                  <p className="text-sm font-medium text-gray-800">{recognition!.marque.value || '—'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">{t.sizeLabel}</p>
                  <p className="text-sm font-medium text-gray-800">{recognition!.taille.value || '—'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">{t.condLabel}</p>
                  <p className="text-sm font-medium text-gray-800">{recognition!.etat.value ? tx(CONDITION_LABELS, lang, recognition!.etat.value) : '—'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">{t.colorLabel}</p>
                  <p className="text-sm font-medium text-gray-800">{recognition!.couleurs.value.map(c => tx(COLOR_LABELS, lang, c)).join(', ') || '—'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">{t.matLabel}</p>
                  <p className="text-sm font-medium text-gray-800">{recognition!.matieres.value.map(m => tx(MATERIAL_LABELS, lang, m)).join(', ') || '—'}</p>
                </div>
              </div>

              <p className="text-xs text-gray-400 mt-3">{t.selectMenus}</p>
            </div>

            {/* 5. PRIX */}
            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <Tag className="w-4 h-4 text-indigo-500 shrink-0" />
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t.priceField}</p>
                  <p className="text-sm font-semibold text-gray-800">{pricing!.prixSuggere}€</p>
                </div>
              </div>
              <CopyBtn text={String(pricing!.prixSuggere)} label={t.copy} copiedLabel={t.copied} />
            </div>

          </div>

          {/* ── Format colis suggéré ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center">
                <Package className="w-4 h-4 text-gray-500" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-0.5">
                  {t.packageLabel}
                </p>
                <p className="text-sm font-semibold text-gray-800">
                  {pkg.label}
                  <span className="ml-2 text-[10px] font-bold bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-md">{pkg.size}</span>
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{pkg.desc}</p>
              </div>
            </div>
          </div>

          {/* ── CTA Vinted ── */}
          <a
            href={getVintedUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors active:scale-[0.98]"
          >
            <ExternalLink className="w-4 h-4" />
            {t.openVinted}
            <ChevronRight className="w-3.5 h-3.5" />
          </a>

        </div>
      )}
    </div>
  )
}
