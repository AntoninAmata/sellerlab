'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Loader2, RefreshCw, AlertCircle, FileText,
  Copy, Check, Pencil, X, AlertTriangle, Plus,
} from 'lucide-react'
import type { RecognitionResult, GenerateResult } from '../types'
import { useLang } from '@/app/providers'
import type { Lang } from '@/lib/i18n'

/* ─── Traductions des labels UI (7 langues) ──────────────────────────────── */

const UI: Record<Lang, {
  missingInfo: string
  tabFr: string
  tabEn: string
  dimensions: string
  copyAll: string
  seoTitle: string
  seoInDesc: string
  seoToAdd: string
  seoPlaceholder: string
  dimTitle: string
  dimBtn: string
  generate: string
  regenerate: string
  title: string
  titleHint: string
  subtitle: string
}> = {
  fr: {
    missingInfo:  'Informations manquantes',
    tabFr:        'Français',
    tabEn:        'Anglais',
    dimensions:   'Ajouter les dimensions',
    copyAll:      'Tout copier (titre + description)',
    seoTitle:     'Mots-clés SEO',
    seoInDesc:    'Dans la description',
    seoToAdd:     'À ajouter',
    seoPlaceholder: 'Ajouter un mot-clé…',
    dimTitle:     'Dimensions (optionnel)',
    dimBtn:       'Masquer les dimensions',
    generate:     'Rédaction en cours…',
    regenerate:   'Régénérer',
    title:        'Annonce générée',
    titleHint:    'max 60 caractères',
    subtitle:     'Modifiez les champs si besoin, puis copiez vers Vinted.',
  },
  en: {
    missingInfo:  'Missing information',
    tabFr:        'French',
    tabEn:        'English',
    dimensions:   'Add dimensions',
    copyAll:      'Copy all (title + description)',
    seoTitle:     'SEO keywords',
    seoInDesc:    'In description',
    seoToAdd:     'Add to description',
    seoPlaceholder: 'Add a keyword…',
    dimTitle:     'Dimensions (optional)',
    dimBtn:       'Hide dimensions',
    generate:     'Generating…',
    regenerate:   'Regenerate',
    title:        'Generated listing',
    titleHint:    'max 60 characters',
    subtitle:     'Edit if needed, then copy to Vinted.',
  },
  es: {
    missingInfo:  'Información faltante',
    tabFr:        'Francés',
    tabEn:        'Inglés',
    dimensions:   'Añadir dimensiones',
    copyAll:      'Copiar todo (título + descripción)',
    seoTitle:     'Palabras clave SEO',
    seoInDesc:    'En la descripción',
    seoToAdd:     'Añadir',
    seoPlaceholder: 'Añadir palabra clave…',
    dimTitle:     'Dimensiones (opcional)',
    dimBtn:       'Ocultar dimensiones',
    generate:     'Redactando…',
    regenerate:   'Regenerar',
    title:        'Anuncio generado',
    titleHint:    'máx 60 caracteres',
    subtitle:     'Edita si es necesario, luego copia a Vinted.',
  },
  de: {
    missingInfo:  'Fehlende Informationen',
    tabFr:        'Französisch',
    tabEn:        'Englisch',
    dimensions:   'Maße hinzufügen',
    copyAll:      'Alles kopieren (Titel + Beschreibung)',
    seoTitle:     'SEO-Schlüsselwörter',
    seoInDesc:    'In der Beschreibung',
    seoToAdd:     'Hinzufügen',
    seoPlaceholder: 'Schlüsselwort hinzufügen…',
    dimTitle:     'Maße (optional)',
    dimBtn:       'Maße ausblenden',
    generate:     'Wird erstellt…',
    regenerate:   'Neu generieren',
    title:        'Generierte Anzeige',
    titleHint:    'max. 60 Zeichen',
    subtitle:     'Bei Bedarf bearbeiten, dann zu Vinted kopieren.',
  },
  it: {
    missingInfo:  'Informazioni mancanti',
    tabFr:        'Francese',
    tabEn:        'Inglese',
    dimensions:   'Aggiungi dimensioni',
    copyAll:      'Copia tutto (titolo + descrizione)',
    seoTitle:     'Parole chiave SEO',
    seoInDesc:    'Nella descrizione',
    seoToAdd:     'Da aggiungere',
    seoPlaceholder: 'Aggiungi parola chiave…',
    dimTitle:     'Dimensioni (opzionale)',
    dimBtn:       'Nascondi dimensioni',
    generate:     'Generazione in corso…',
    regenerate:   'Rigenera',
    title:        'Annuncio generato',
    titleHint:    'max 60 caratteri',
    subtitle:     'Modifica se necessario, poi copia su Vinted.',
  },
  nl: {
    missingInfo:  'Ontbrekende informatie',
    tabFr:        'Frans',
    tabEn:        'Engels',
    dimensions:   'Afmetingen toevoegen',
    copyAll:      "Alles kopiëren (titel + beschrijving)",
    seoTitle:     'SEO-trefwoorden',
    seoInDesc:    'In de beschrijving',
    seoToAdd:     'Toe te voegen',
    seoPlaceholder: 'Trefwoord toevoegen…',
    dimTitle:     'Afmetingen (optioneel)',
    dimBtn:       'Afmetingen verbergen',
    generate:     'Bezig met genereren…',
    regenerate:   'Opnieuw genereren',
    title:        'Gegenereerde advertentie',
    titleHint:    'max 60 tekens',
    subtitle:     'Bewerk indien nodig, kopieer daarna naar Vinted.',
  },
  pl: {
    missingInfo:  'Brakujące informacje',
    tabFr:        'Francuski',
    tabEn:        'Angielski',
    dimensions:   'Dodaj wymiary',
    copyAll:      'Kopiuj wszystko (tytuł + opis)',
    seoTitle:     'Słowa kluczowe SEO',
    seoInDesc:    'W opisie',
    seoToAdd:     'Do dodania',
    seoPlaceholder: 'Dodaj słowo kluczowe…',
    dimTitle:     'Wymiary (opcjonalne)',
    dimBtn:       'Ukryj wymiary',
    generate:     'Generowanie…',
    regenerate:   'Wygeneruj ponownie',
    title:        'Wygenerowane ogłoszenie',
    titleHint:    'maks. 60 znaków',
    subtitle:     'Edytuj w razie potrzeby, następnie skopiuj do Vinted.',
  },
}

/* ─── Boutons de dimensions prédéfinis ───────────────────────────────────── */

const DIM_PRESETS: Record<Lang, string[]> = {
  fr: ['Tour de poitrine', 'Longueur', 'Épaules', 'Tour de taille', 'Tour de hanches', 'Entrejambe', 'Pointure', 'Largeur', 'Hauteur', 'Profondeur'],
  en: ['Chest', 'Length', 'Shoulders', 'Waist', 'Hips', 'Inseam', 'Shoe size', 'Width', 'Height', 'Depth'],
  es: ['Pecho', 'Largo', 'Hombros', 'Cintura', 'Cadera', 'Entrepierna', 'Talla pie', 'Ancho', 'Altura', 'Profundidad'],
  de: ['Brust', 'Länge', 'Schultern', 'Taille', 'Hüfte', 'Schrittlänge', 'Schuhgröße', 'Breite', 'Höhe', 'Tiefe'],
  it: ['Petto', 'Lunghezza', 'Spalle', 'Vita', 'Fianchi', 'Cavallo', 'Numero scarpa', 'Larghezza', 'Altezza', 'Profondità'],
  nl: ['Borst', 'Lengte', 'Schouders', 'Taille', 'Heupen', 'Binnenbeenlengte', 'Schoenmaat', 'Breedte', 'Hoogte', 'Diepte'],
  pl: ['Klatka', 'Długość', 'Ramiona', 'Talia', 'Biodra', 'Krok', 'Rozmiar buta', 'Szerokość', 'Wysokość', 'Głębokość'],
}

/* ─── Props ──────────────────────────────────────────────────────────────── */

interface Props {
  recognition: RecognitionResult | null
  result: GenerateResult | null
  setResult: (r: GenerateResult) => void
}

/* ─── Hook génération ────────────────────────────────────────────────────── */

function useGenerate(
  recognition: RecognitionResult | null,
  result: GenerateResult | null,
  setResult: (r: GenerateResult) => void,
  lang: string,
  prixAchatNeuf?: number,
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
          prixAchatNeuf: prixAchatNeuf !== undefined ? prixAchatNeuf : undefined,
          lang,
        }),
      })
      if (!res.ok) throw new Error()
      const data: GenerateResult = await res.json()
      setResult(data)
    } catch {
      setError('La génération a échoué. Réessayez.')
    } finally {
      setLoading(false)
    }
  }, [recognition, setResult, lang, prixAchatNeuf])

  useEffect(() => {
    if (!ranRef.current && !result && recognition) {
      ranRef.current = true
      run()
    }
  }, [run, result, recognition])

  return { loading, error, retry: run }
}

/* ─── Bouton copier ──────────────────────────────────────────────────────── */

function CopyButton({ text, label }: { text: string; label?: string }) {
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
      {copied ? 'Copié !' : (label ?? 'Copier')}
    </button>
  )
}

/* ─── Composant principal ────────────────────────────────────────────────── */

export default function AnnonceStep({ recognition, result, setResult }: Props) {
  const { lang } = useLang()
  const t = UI[lang] ?? UI.fr

  /* Prix d'achat neuf optionnel */
  const [prixAchatNeuf, setPrixAchatNeuf] = useState('')

  const { loading, error, retry } = useGenerate(
    recognition,
    result,
    setResult,
    lang,
    prixAchatNeuf ? parseFloat(prixAchatNeuf) : undefined,
  )

  /* Onglet actif : 'fr' ou 'en' — si langue utilisateur = 'en', forcer 'en' */
  const [activeTab, setActiveTab] = useState<'fr' | 'en'>(lang === 'en' ? 'en' : 'fr')

  /* Tags SEO supplémentaires saisis manuellement par l'utilisateur */
  const [seoExtra, setSeoExtra] = useState<string[]>([])
  const [seoInput, setSeoInput] = useState('')

  /* Toggle bloc dimensions */
  const [showDimensions, setShowDimensions] = useState(false)
  /* Dimensions saisies : tableau de { nom: string, valeur: string } */
  const [dimensions, setDimensions] = useState<{ nom: string; valeur: string }[]>([])

  /* Mise à jour locale du titre */
  function updateTitre(v: string) {
    if (!result) return
    setResult({ ...result, titre: v })
  }

  /* Mise à jour locale de la description active */
  function updateDesc(v: string) {
    if (!result) return
    if (activeTab === 'fr') setResult({ ...result, descriptionFR: v })
    else setResult({ ...result, descriptionEN: v })
  }

  /* Ajouter un tag SEO libre */
  function addSeoTag() {
    const tag = seoInput.trim()
    if (!tag || seoExtra.includes(tag)) return
    setSeoExtra(prev => [...prev, tag])
    setSeoInput('')
  }

  /* Ajouter un preset de dimension */
  function addDimPreset(nom: string) {
    if (dimensions.find(d => d.nom === nom)) return
    setDimensions(prev => [...prev, { nom, valeur: '' }])
  }

  /* Mettre à jour la valeur d'une dimension */
  function updateDimValeur(nom: string, valeur: string) {
    setDimensions(prev => prev.map(d => d.nom === nom ? { ...d, valeur } : d))
  }

  /* Supprimer une dimension */
  function removeDim(nom: string) {
    setDimensions(prev => prev.filter(d => d.nom !== nom))
  }

  /* Construire le texte "tout copier" */
  function buildCopyText(): string {
    if (!result) return ''
    const desc = activeTab === 'fr' ? result.descriptionFR : result.descriptionEN
    const tags = [
      ...(result.seoTagsInDescription ?? []),
      ...(result.seoTagsExtra ?? []),
      ...seoExtra,
    ].filter(Boolean).join(' · ')
    const dimBlock = dimensions.filter(d => d.valeur).map(d => `${d.nom} : ${d.valeur} cm`).join('\n')
    const parts = [result.titre, '', desc]
    if (tags) parts.push('', tags)
    if (dimBlock) parts.push('', dimBlock)
    return parts.join('\n')
  }

  /* ── Chargement ── */
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center">
          <Loader2 className="w-7 h-7 text-indigo-600 animate-spin" />
        </div>
        <div>
          <p className="font-display font-extrabold text-xl text-gray-900">{t.generate}</p>
          <p className="text-sm text-gray-400 mt-1 max-w-xs">
            L&apos;IA rédige votre annonce optimisée pour Vinted.
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
          <RefreshCw className="w-4 h-4" />{t.regenerate}
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
          Complétez l&apos;étape 2 pour générer votre annonce.
        </p>
      </div>
    )
  }

  if (!result) return null

  /* Description courante selon onglet actif */
  const descActive = activeTab === 'fr' ? result.descriptionFR : result.descriptionEN
  const infosManquantes = result.infosManquantes ?? []
  const seoInDesc = result.seoTagsInDescription ?? []
  const seoToAdd = result.seoTagsExtra ?? []
  const presets = DIM_PRESETS[lang] ?? DIM_PRESETS.fr

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
              {t.title}
            </h2>
          </div>
          <p className="text-sm text-gray-400 ml-10">{t.subtitle}</p>
        </div>
        <button
          onClick={retry}
          className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-gray-600 transition-colors px-3 py-1.5 rounded-full hover:bg-gray-50 border border-gray-100 shrink-0"
        >
          <RefreshCw className="w-3 h-3" />
          {t.regenerate}
        </button>
      </div>

      <div className="space-y-4">

        {/* ── Tags SEO ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
            {t.seoTitle}
          </p>

          {/* Tags verts = dans la description */}
          {seoInDesc.length > 0 && (
            <div className="mb-3">
              <p className="text-[10px] font-semibold text-green-600 uppercase tracking-wide mb-1.5">
                {t.seoInDesc}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {seoInDesc.map(tag => (
                  <span key={tag} className="text-xs font-semibold bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tags bleus = à ajouter optionnellement */}
          {seoToAdd.length > 0 && (
            <div className="mb-3">
              <p className="text-[10px] font-semibold text-blue-600 uppercase tracking-wide mb-1.5">
                {t.seoToAdd}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {seoToAdd.map(tag => (
                  <span key={tag} className="text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full cursor-default">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tags libres ajoutés par l'utilisateur */}
          {seoExtra.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-1.5">
              {seoExtra.map(tag => (
                <span key={tag} className="inline-flex items-center gap-1 text-xs font-semibold bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">
                  {tag}
                  <button onClick={() => setSeoExtra(prev => prev.filter(t => t !== tag))} className="ml-0.5 text-gray-400 hover:text-red-500">
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Champ libre ajout tag */}
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              value={seoInput}
              onChange={e => setSeoInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addSeoTag()}
              placeholder={t.seoPlaceholder}
              className="flex-1 text-sm rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-colors"
            />
            <button
              onClick={addSeoTag}
              className="flex items-center gap-1.5 bg-gray-100 hover:bg-indigo-600 hover:text-white text-gray-600 text-xs font-semibold px-3 py-2 rounded-xl transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              Ajouter
            </button>
          </div>
        </div>

        {/* ── Bandeau informations manquantes ── */}
        {infosManquantes.length > 0 && (
          <div className="flex items-start gap-3 p-4 bg-orange-50 border border-orange-200 rounded-2xl">
            <AlertTriangle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-orange-700 mb-1">{t.missingInfo}</p>
              <div className="flex flex-wrap gap-1.5">
                {infosManquantes.map(info => (
                  <span key={info} className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">
                    {info}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Titre éditable ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Titre</span>
              <span className="text-[10px] text-gray-300">{t.titleHint}</span>
              <span className={`text-[10px] font-semibold ${result.titre.length > 60 ? 'text-red-500' : 'text-gray-300'}`}>
                {result.titre.length}/60
              </span>
            </div>
            <CopyButton text={result.titre} />
          </div>
          <div className="px-5 py-4">
            <input
              type="text"
              value={result.titre}
              onChange={e => updateTitre(e.target.value)}
              maxLength={70}
              className="w-full text-sm font-semibold text-gray-900 bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-colors"
            />
          </div>
        </div>

        {/* ── Champ prix d'achat neuf optionnel ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-3.5 flex items-center gap-3">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest shrink-0">
              Prix neuf (optionnel)
            </span>
            <div className="flex-1 flex items-center gap-2">
              <input
                type="number"
                min="0"
                step="0.01"
                value={prixAchatNeuf}
                onChange={e => setPrixAchatNeuf(e.target.value)}
                placeholder="Ex: 49.90"
                className="flex-1 text-sm rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-colors"
              />
              <span className="text-xs text-gray-400 shrink-0">€</span>
            </div>
            {prixAchatNeuf && (
              <span className="text-[10px] text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full shrink-0">
                Sera inclus
              </span>
            )}
          </div>
        </div>

        {/* ── Onglets FR / EN + description ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* En-tête avec onglets */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-50">
            <div className="flex gap-1">
              {/* Onglet FR : masqué si utilisateur anglophone */}
              {lang !== 'en' && (
                <button
                  onClick={() => setActiveTab('fr')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'fr'
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {t.tabFr}
                </button>
              )}
              <button
                onClick={() => setActiveTab('en')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'en'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                }`}
              >
                {t.tabEn}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <CopyButton text={descActive} />
              <button
                onClick={() => {/* toggle edit inline — géré via textarea */}}
                className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-full border border-gray-200 text-gray-400 hover:border-indigo-300 hover:text-indigo-600 transition-all"
              >
                <Pencil className="w-3 h-3" />
                Modifier
              </button>
            </div>
          </div>
          {/* Corps — textarea éditable */}
          <div className="px-5 py-4">
            <textarea
              value={descActive}
              onChange={e => updateDesc(e.target.value)}
              rows={8}
              className="w-full text-sm text-gray-800 leading-relaxed bg-gray-50 rounded-xl p-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 resize-none transition-colors"
            />
          </div>
          {/* Équivalences de tailles si disponibles */}
          {result.tailleEquivalences && (
            <div className="px-5 pb-4">
              <span className="text-[11px] text-indigo-600 font-semibold bg-indigo-50 px-2.5 py-1 rounded-full">
                📏 {result.tailleEquivalences}
              </span>
            </div>
          )}
        </div>

        {/* ── Bloc dimensions (toggle) ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <button
            onClick={() => setShowDimensions(!showDimensions)}
            className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors text-sm font-semibold text-gray-600"
          >
            <span className="flex items-center gap-2">
              📐 {showDimensions ? t.dimBtn : t.dimensions}
            </span>
            {showDimensions
              ? <X className="w-4 h-4 text-gray-400" />
              : <Plus className="w-4 h-4 text-gray-400" />
            }
          </button>

          {showDimensions && (
            <div className="px-5 pb-5 border-t border-gray-50 pt-4 space-y-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                {t.dimTitle}
              </p>

              {/* Boutons presets */}
              <div className="flex flex-wrap gap-2">
                {presets.map(nom => (
                  <button
                    key={nom}
                    onClick={() => addDimPreset(nom)}
                    disabled={!!dimensions.find(d => d.nom === nom)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                      dimensions.find(d => d.nom === nom)
                        ? 'bg-indigo-50 text-indigo-600 border-indigo-200 cursor-default'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600'
                    }`}
                  >
                    {nom}
                  </button>
                ))}
              </div>

              {/* Champs valeurs */}
              {dimensions.length > 0 && (
                <div className="space-y-2">
                  {dimensions.map(dim => (
                    <div key={dim.nom} className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-gray-600 w-36 shrink-0">{dim.nom}</span>
                      <div className="flex-1 flex items-center gap-1.5">
                        <input
                          type="number"
                          min="0"
                          step="0.1"
                          value={dim.valeur}
                          onChange={e => updateDimValeur(dim.nom, e.target.value)}
                          placeholder="cm"
                          className="flex-1 text-sm rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-colors"
                        />
                        <span className="text-xs text-gray-400 shrink-0">cm</span>
                      </div>
                      <button onClick={() => removeDim(dim.nom)} className="text-gray-300 hover:text-red-500 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Bouton tout copier ── */}
        <button
          onClick={() => navigator.clipboard.writeText(buildCopyText())}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white text-sm font-semibold py-3.5 rounded-2xl hover:bg-indigo-700 active:scale-[0.98] transition-all"
        >
          <Copy className="w-4 h-4" />
          {t.copyAll}
        </button>

      </div>
    </div>
  )
}
