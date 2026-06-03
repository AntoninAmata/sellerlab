'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Loader2, RefreshCw, AlertCircle, FileText,
  Copy, Check, X, Plus,
} from 'lucide-react'
import type { RecognitionResult, GenerateResult } from '../types'
import { useLang } from '@/app/providers'
import type { Lang } from '@/lib/i18n'

/* ─── Traductions UI (7 langues) ─────────────────────────────────────────── */

const UI: Record<Lang, {
  missingInfoTitle: string
  seoIntegrate:     string
  seoTitle:         string
  seoInDesc:        string
  seoToAdd:         string
  seoPlaceholder:   string
  addToDesc:        string
  integrateMissing: string
  addInfoToDesc:    string
  copyAll:          string
  dimensions:       string
  dimTitle:         string
  generate:         string
  regenerate:       string
  title:            string
  titleHint:        string
  subtitle:         string
  descLangNative:   string
  descLangEn:       string
  descLangBoth:     string
  prixNeuf:         string
  generateFailed:   string
  completeStep2:    string
  add:              string
  integrating:      string
  titleLabel:       string
  copy:             string
  copied:           string
  generateSubtitle: string
}> = {
  fr: {
    missingInfoTitle: 'Informations à compléter',
    seoIntegrate:     'Intégrer les mots-clés sélectionnés',
    seoTitle:         'Mots-clés SEO',
    seoInDesc:        'Dans la description',
    seoToAdd:         'À ajouter (cliquer pour sélectionner)',
    seoPlaceholder:   'Ajouter un mot-clé…',
    addToDesc:        'Ajouter à la description',
    integrateMissing: 'Intégrer dans l\'annonce',
    addInfoToDesc:    'Ajouter à la description',
    copyAll:          'Tout copier (titre + description)',
    dimensions:       'Ajouter les dimensions',
    dimTitle:         'Dimensions (optionnel)',
    generate:         'Rédaction en cours…',
    regenerate:       'Régénérer',
    title:            'Annonce générée',
    titleHint:        'max 60 caractères',
    subtitle:         'Modifiez les champs si besoin, puis copiez vers Vinted.',
    descLangNative:   'Français uniquement',
    descLangEn:       'Anglais uniquement',
    descLangBoth:     'Les deux',
    prixNeuf:         'Prix neuf (optionnel)',
    generateFailed:   'Génération impossible',
    completeStep2:    "Complétez l'étape 2 pour générer votre annonce.",
    add:              'Ajouter',
    integrating:      'Traduction en cours…',
    titleLabel:       'Titre',
    copy:             'Copier',
    copied:           'Copié !',
    generateSubtitle: "L'IA rédige votre annonce optimisée pour Vinted.",
  },
  en: {
    missingInfoTitle: 'Information to complete',
    seoIntegrate:     'Integrate selected keywords',
    seoTitle:         'SEO keywords',
    seoInDesc:        'In description',
    seoToAdd:         'Add (click to select)',
    seoPlaceholder:   'Add a keyword…',
    addToDesc:        'Add to description',
    integrateMissing: 'Add to listing',
    addInfoToDesc:    'Add to description',
    copyAll:          'Copy all (title + description)',
    dimensions:       'Add dimensions',
    dimTitle:         'Dimensions (optional)',
    generate:         'Generating…',
    regenerate:       'Regenerate',
    title:            'Generated listing',
    titleHint:        'max 60 characters',
    subtitle:         'Edit if needed, then copy to Vinted.',
    descLangNative:   'English only',
    descLangEn:       'English only',
    descLangBoth:     'Both',
    prixNeuf:         'Original price (optional)',
    generateFailed:   'Generation failed',
    completeStep2:    'Complete step 2 to generate your listing.',
    add:              'Add',
    integrating:      'Translating…',
    titleLabel:       'Title',
    copy:             'Copy',
    copied:           'Copied!',
    generateSubtitle: 'AI is writing your optimised Vinted listing.',
  },
  es: {
    missingInfoTitle: 'Información a completar',
    seoIntegrate:     'Integrar palabras clave seleccionadas',
    seoTitle:         'Palabras clave SEO',
    seoInDesc:        'En la descripción',
    seoToAdd:         'Añadir (clic para seleccionar)',
    seoPlaceholder:   'Añadir palabra clave…',
    addToDesc:        'Añadir a la descripción',
    integrateMissing: 'Integrar en el anuncio',
    addInfoToDesc:    'Añadir a la descripción',
    copyAll:          'Copiar todo (título + descripción)',
    dimensions:       'Añadir dimensiones',
    dimTitle:         'Dimensiones (opcional)',
    generate:         'Redactando…',
    regenerate:       'Regenerar',
    title:            'Anuncio generado',
    titleHint:        'máx 60 caracteres',
    subtitle:         'Edita si es necesario, luego copia a Vinted.',
    descLangNative:   'Solo español',
    descLangEn:       'Solo inglés',
    descLangBoth:     'Los dos',
    prixNeuf:         'Precio original (opcional)',
    generateFailed:   'Generación imposible',
    completeStep2:    'Completa el paso 2 para generar tu anuncio.',
    add:              'Añadir',
    integrating:      'Traduciendo…',
    titleLabel:       'Título',
    copy:             'Copiar',
    copied:           '¡Copiado!',
    generateSubtitle: 'La IA redacta tu anuncio optimizado para Vinted.',
  },
  de: {
    missingInfoTitle: 'Zu ergänzende Informationen',
    seoIntegrate:     'Ausgewählte Schlüsselwörter einfügen',
    seoTitle:         'SEO-Schlüsselwörter',
    seoInDesc:        'In der Beschreibung',
    seoToAdd:         'Hinzufügen (klicken zum Auswählen)',
    seoPlaceholder:   'Schlüsselwort hinzufügen…',
    addToDesc:        'Zur Beschreibung hinzufügen',
    integrateMissing: 'In die Anzeige einfügen',
    addInfoToDesc:    'Zur Beschreibung hinzufügen',
    copyAll:          'Alles kopieren (Titel + Beschreibung)',
    dimensions:       'Maße hinzufügen',
    dimTitle:         'Maße (optional)',
    generate:         'Wird erstellt…',
    regenerate:       'Neu generieren',
    title:            'Generierte Anzeige',
    titleHint:        'max. 60 Zeichen',
    subtitle:         'Bei Bedarf bearbeiten, dann zu Vinted kopieren.',
    descLangNative:   'Nur Deutsch',
    descLangEn:       'Nur Englisch',
    descLangBoth:     'Beide',
    prixNeuf:         'Neupreis (optional)',
    generateFailed:   'Generierung fehlgeschlagen',
    completeStep2:    'Schritt 2 abschließen, um die Anzeige zu erstellen.',
    add:              'Hinzufügen',
    integrating:      'Übersetzung läuft…',
    titleLabel:       'Titel',
    copy:             'Kopieren',
    copied:           'Kopiert!',
    generateSubtitle: 'KI erstellt deine optimierte Vinted-Anzeige.',
  },
  it: {
    missingInfoTitle: 'Informazioni da completare',
    seoIntegrate:     'Integra le parole chiave selezionate',
    seoTitle:         'Parole chiave SEO',
    seoInDesc:        'Nella descrizione',
    seoToAdd:         'Da aggiungere (clic per selezionare)',
    seoPlaceholder:   'Aggiungi parola chiave…',
    addToDesc:        'Aggiungi alla descrizione',
    integrateMissing: 'Aggiungi all\'annuncio',
    addInfoToDesc:    'Aggiungi alla descrizione',
    copyAll:          'Copia tutto (titolo + descrizione)',
    dimensions:       'Aggiungi dimensioni',
    dimTitle:         'Dimensioni (opzionale)',
    generate:         'Generazione in corso…',
    regenerate:       'Rigenera',
    title:            'Annuncio generato',
    titleHint:        'max 60 caratteri',
    subtitle:         'Modifica se necessario, poi copia su Vinted.',
    descLangNative:   'Solo italiano',
    descLangEn:       'Solo inglese',
    descLangBoth:     'Entrambe',
    prixNeuf:         'Prezzo originale (opzionale)',
    generateFailed:   'Generazione impossibile',
    completeStep2:    "Completa il passaggio 2 per generare il tuo annuncio.",
    add:              'Aggiungi',
    integrating:      'Traduzione in corso…',
    titleLabel:       'Titolo',
    copy:             'Copia',
    copied:           'Copiato!',
    generateSubtitle: "L'IA redige il tuo annuncio ottimizzato per Vinted.",
  },
  nl: {
    missingInfoTitle: 'Te completeren informatie',
    seoIntegrate:     'Geselecteerde trefwoorden invoegen',
    seoTitle:         'SEO-trefwoorden',
    seoInDesc:        'In de beschrijving',
    seoToAdd:         'Toe te voegen (klik om te selecteren)',
    seoPlaceholder:   'Trefwoord toevoegen…',
    addToDesc:        'Toevoegen aan beschrijving',
    integrateMissing: 'Toevoegen aan advertentie',
    addInfoToDesc:    'Toevoegen aan beschrijving',
    copyAll:          "Alles kopiëren (titel + beschrijving)",
    dimensions:       'Afmetingen toevoegen',
    dimTitle:         'Afmetingen (optioneel)',
    generate:         'Bezig met genereren…',
    regenerate:       'Opnieuw genereren',
    title:            'Gegenereerde advertentie',
    titleHint:        'max 60 tekens',
    subtitle:         'Bewerk indien nodig, kopieer daarna naar Vinted.',
    descLangNative:   'Alleen Nederlands',
    descLangEn:       'Alleen Engels',
    descLangBoth:     'Beide',
    prixNeuf:         'Originele prijs (optioneel)',
    generateFailed:   'Genereren mislukt',
    completeStep2:    'Voltooi stap 2 om je advertentie te genereren.',
    add:              'Toevoegen',
    integrating:      'Vertalen…',
    titleLabel:       'Titel',
    copy:             'Kopiëren',
    copied:           'Gekopieerd!',
    generateSubtitle: 'AI schrijft uw geoptimaliseerde Vinted-advertentie.',
  },
  pl: {
    missingInfoTitle: 'Informacje do uzupełnienia',
    seoIntegrate:     'Zintegruj wybrane słowa kluczowe',
    seoTitle:         'Słowa kluczowe SEO',
    seoInDesc:        'W opisie',
    seoToAdd:         'Do dodania (kliknij, aby wybrać)',
    seoPlaceholder:   'Dodaj słowo kluczowe…',
    addToDesc:        'Dodaj do opisu',
    integrateMissing: 'Dodaj do ogłoszenia',
    addInfoToDesc:    'Dodaj do opisu',
    copyAll:          'Kopiuj wszystko (tytuł + opis)',
    dimensions:       'Dodaj wymiary',
    dimTitle:         'Wymiary (opcjonalne)',
    generate:         'Generowanie…',
    regenerate:       'Wygeneruj ponownie',
    title:            'Wygenerowane ogłoszenie',
    titleHint:        'maks. 60 znaków',
    subtitle:         'Edytuj w razie potrzeby, następnie skopiuj do Vinted.',
    descLangNative:   'Tylko polski',
    descLangEn:       'Tylko angielski',
    descLangBoth:     'Oba',
    prixNeuf:         'Cena nowa (opcjonalnie)',
    generateFailed:   'Generowanie niemożliwe',
    completeStep2:    'Ukończ krok 2, aby wygenerować swoje ogłoszenie.',
    add:              'Dodaj',
    integrating:      'Tłumaczenie…',
    titleLabel:       'Tytuł',
    copy:             'Kopiuj',
    copied:           'Skopiowano!',
    generateSubtitle: 'AI pisze Twoje zoptymalizowane ogłoszenie na Vinted.',
  },
}

/* ─── Labels et drapeaux langue native ───────────────────────────────────── */

const LANG_NATIVE_LABELS: Record<Lang, string> = {
  fr: 'Français', en: 'English', es: 'Español',
  de: 'Deutsch', it: 'Italiano', nl: 'Nederlands', pl: 'Polski',
}

const LANG_FLAGS: Record<Lang, string> = {
  fr: '🇫🇷', en: '🇬🇧', es: '🇪🇸', de: '🇩🇪', it: '🇮🇹', nl: '🇳🇱', pl: '🇵🇱',
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
          tailleSysteme: recognition.tailleSysteme.value[0] ?? '',
          etat:          recognition.etat.value,
          couleurs:      recognition.couleurs.value,
          matieres:      recognition.matieres.value,
          style:         recognition.style.value,
          motif:         recognition.motif.value,
          defauts:       recognition.defauts.value,
          extraInfo:     recognition.extraInfo,
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

function CopyButton({ text, label, copiedLabel }: { text: string; label?: string; copiedLabel?: string }) {
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
      {copied ? (copiedLabel ?? '✓') : (label ?? 'Copier')}
    </button>
  )
}

/* ─── Textarea auto-hauteur ──────────────────────────────────────────────── */

function AutoTextarea({
  value,
  onChange,
  className,
}: {
  value: string
  onChange: (v: string) => void
  className?: string
}) {
  const ref = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (!ref.current) return
    ref.current.style.height = 'auto'
    ref.current.style.height = ref.current.scrollHeight + 'px'
  }, [value])

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{ resize: 'none', overflow: 'hidden' }}
      className={className}
    />
  )
}

/* ─── Composant principal ────────────────────────────────────────────────── */

export default function AnnonceStep({ recognition, result, setResult }: Props) {
  const { lang } = useLang()
  const t = UI[lang] ?? UI.fr

  const { loading, error, retry } = useGenerate(recognition, result, setResult, lang)

  /* Tags SEO — suggestions IA (bleu → vert au clic) */
  const [selectedSeoTags, setSelectedSeoTags] = useState<string[]>([])
  /* Tags SEO — personnalisés (verts dès l'ajout) */
  const [customTags, setCustomTags] = useState<string[]>([])
  const [customTagInput, setCustomTagInput] = useState('')
  /* En cours d'intégration (appel traduction) */
  const [integrating, setIntegrating] = useState(false)

  /* Langue de la description affichée */
  const [descLang, setDescLang] = useState<'native' | 'en' | 'both'>('both')

  /* Texte combiné éditable pour le mode "Les deux" */
  const [bothDesc, setBothDesc] = useState('')

  /* Reset lors d'une régénération */
  useEffect(() => {
    setSelectedSeoTags([])
    setCustomTags([])
  }, [result])

  /* Synchronise bothDesc depuis les descriptions FR+EN (collapse des doubles sauts de ligne) */
  useEffect(() => {
    if (!result) return
    const flag  = LANG_FLAGS[lang] ?? '🇫🇷'
    const label = LANG_NATIVE_LABELS[lang] ?? 'Français'
    const cleanFR = result.descriptionFR.replace(/\n\n+/g, '\n').trimEnd()
    const cleanEN = result.descriptionEN.replace(/\n\n+/g, '\n').trimEnd()
    setBothDesc(`${flag} ${label}\n${cleanFR}\n\n🇬🇧 English\n${cleanEN}`)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result?.descriptionFR, result?.descriptionEN, lang])

  /* Synchronise descriptionExport → parent (ExportStep lit ce champ) */
  useEffect(() => {
    if (!result) return
    const exportDesc = (lang === 'en' || descLang === 'native')
      ? result.descriptionFR
      : descLang === 'en'
      ? result.descriptionEN
      : bothDesc
    if (result.descriptionExport === exportDesc) return
    setResult({ ...result, descriptionExport: exportDesc })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [descLang, result?.descriptionFR, result?.descriptionEN, bothDesc, lang])

  /* ── Visibilité des blocs description ── */
  /* Quand lang=en, descriptionFR est aussi en anglais → une seule description, pas de pills */
  const isEnUI      = lang === 'en'
  const showNativeDesc = isEnUI || descLang === 'native'
  const showEnDesc  = !isEnUI && descLang === 'en'
  const showBothDesc = !isEnUI && descLang === 'both'

  /* ── Mise à jour locale ── */
  function updateTitre(v: string) {
    if (!result) return
    setResult({ ...result, titre: v })
  }
  function updateDescFR(v: string) {
    if (!result) return
    setResult({ ...result, descriptionFR: v })
  }
  function updateDescEN(v: string) {
    if (!result) return
    setResult({ ...result, descriptionEN: v })
  }

  /* ── Toggle tag IA ── */
  function toggleSeoTag(tag: string) {
    setSelectedSeoTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  /* ── Ajouter tag personnalisé (vert = pré-sélectionné) ── */
  function addCustomTag() {
    const tag = customTagInput.trim()
    if (!tag || customTags.includes(tag) || selectedSeoTags.includes(tag)) return
    setCustomTags(prev => [...prev, tag])
    setCustomTagInput('')
  }

  /* ── Appende un bloc de hashtags à une description (fusionne si bloc existant) ── */
  function appendToHashtags(desc: string, newHashtags: string): string {
    if (!newHashtags) return desc
    const trimmed = desc.trimEnd()
    const lastLine = trimmed.split('\n').pop()?.trim() ?? ''
    if (lastLine.startsWith('#')) return trimmed + ' ' + newHashtags
    return trimmed + '\n\n' + newHashtags
  }

  /* ── Intégrer tous les tags verts en hashtags, séparés par langue ── */
  async function integrateSeoTags() {
    if (!result) return
    const allTags = [...selectedSeoTags, ...customTags]
    const aiFR = (result.hashtagsFR ?? '').replace(/\n+/g, ' ').trim()
    const aiEN = (result.hashtagsEN ?? '').replace(/\n+/g, ' ').trim()
    if (!allTags.length && !aiFR && !aiEN) return

    setIntegrating(true)

    /* Traduire les tags personnalisés en anglais via Claude Haiku */
    let translations: Record<string, string> = {}
    if (customTags.length > 0 && !isEnUI) {
      try {
        const res = await fetch('/api/translate-hashtags', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tags: customTags, sourceLang: lang }),
        })
        if (res.ok) translations = await res.json()
      } catch { /* fallback sans traduction */ }
    }

    const toCamel = (s: string) =>
      '#' + s.replace(/^#/, '').trim().split(/[\s_-]+/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')

    /* Tags utilisateur : version native pour la description native */
    const userNative = allTags.map(t => toCamel(t)).join(' ')

    /* Tags utilisateur : version EN — traduction pour les custom, natif pour les autres */
    const userEN = allTags.map(t => {
      if (customTags.includes(t) && !isEnUI && translations[t]) {
        return toCamel(translations[t])
      }
      return toCamel(t)
    }).join(' ')

    const normalize = (a: string, b: string) =>
      [a, b].filter(Boolean).join(' ').replace(/\s{2,}/g, ' ').trim()

    /* Pour l'UI anglais, descriptionFR = description EN → utiliser les hashtags EN */
    const hashtagsForFR = isEnUI ? normalize(userEN, aiEN) : normalize(userNative, aiFR)
    const hashtagsForEN = normalize(userEN, aiEN)

    const newFR = appendToHashtags(result.descriptionFR, hashtagsForFR)
    const newEN = appendToHashtags(result.descriptionEN, hashtagsForEN)

    setResult({
      ...result,
      descriptionFR: newFR,
      descriptionEN: newEN,
      seoTagsInDescription: [...(result.seoTagsInDescription ?? []), ...allTags],
      seoTagsExtra: (result.seoTagsExtra ?? []).filter(t => !selectedSeoTags.includes(t)),
      hashtagsFR: '',
      hashtagsEN: '',
    })
    setIntegrating(false)
    setSelectedSeoTags([])
    setCustomTags([])
  }

  /* ── Texte tout copier ── */
  function buildCopyText(): string {
    if (!result) return ''
    if (isEnUI || descLang === 'native') {
      return [result.titre, '', result.descriptionFR].join('\n')
    }
    if (descLang === 'en') {
      return [result.titre, '', result.descriptionEN].join('\n')
    }
    /* Mode "Les deux" — utilise bothDesc (inclut les éventuels édits utilisateur) */
    return result.titre + '\n\n' + bothDesc
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
            {t.generateSubtitle}
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
        <p className="font-display font-extrabold text-xl text-gray-900">{t.generateFailed}</p>
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
          {t.completeStep2}
        </p>
      </div>
    )
  }

  if (!result) return null

  const seoInDesc      = result.seoTagsInDescription ?? []
  const seoToAdd       = result.seoTagsExtra ?? []
  const allPendingTags = [...selectedSeoTags, ...customTags]
  const nativeLabel    = LANG_NATIVE_LABELS[lang] ?? 'Français'

  return (
    <div className="max-w-2xl mx-auto">

      {/* ── En-tête ── */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center">
              <FileText className="w-4 h-4 text-indigo-600" />
            </div>
            <h2 className="font-display font-extrabold text-2xl text-gray-900">{t.title}</h2>
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

        {/* ════ MOTS-CLÉS SEO ════ */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
            {t.seoTitle}
          </p>

          {/* Tags verts — déjà intégrés dans la description */}
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

          {/* Tags bleus (IA, non sélectionnés) + tags verts (IA sélectionnés + personnalisés) */}
          {(seoToAdd.length > 0 || customTags.length > 0) && (
            <div className="mb-3">
              <p className="text-[10px] font-semibold text-blue-600 uppercase tracking-wide mb-1.5">
                {t.seoToAdd}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {/* Tags IA — bleu non sélectionné, vert sélectionné */}
                {seoToAdd.map(tag => {
                  const selected = selectedSeoTags.includes(tag)
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleSeoTag(tag)}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full border transition-all ${
                        selected
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-green-50 hover:text-green-700 hover:border-green-200'
                      }`}
                    >
                      {tag}
                    </button>
                  )
                })}
                {/* Tags personnalisés — toujours verts, avec X pour supprimer */}
                {customTags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 text-xs font-semibold bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-full"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => setCustomTags(prev => prev.filter(t => t !== tag))}
                      className="ml-0.5 text-green-500 hover:text-red-500 transition-colors"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Champ ajout tag personnalisé */}
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              value={customTagInput}
              onChange={e => setCustomTagInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addCustomTag()}
              placeholder={t.seoPlaceholder}
              className="flex-1 text-sm rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-colors"
            />
            <button
              onClick={addCustomTag}
              className="flex items-center gap-1.5 bg-gray-100 hover:bg-indigo-600 hover:text-white text-gray-600 text-xs font-semibold px-3 py-2 rounded-xl transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              {t.add}
            </button>
          </div>

          {/* CTA intégration — visible quand des tags verts sont en attente ou que hashtagLine existe */}
          {(allPendingTags.length > 0 || !!(result.hashtagsFR) || !!(result.hashtagsEN)) && (
            <button
              onClick={integrateSeoTags}
              disabled={integrating}
              className="mt-3 w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white text-xs font-semibold py-2.5 rounded-xl transition-all active:scale-[0.98]"
            >
              {integrating
                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                : <Check className="w-3.5 h-3.5" />}
              {integrating ? t.integrating : `${t.seoIntegrate}${allPendingTags.length > 0 ? ` (${allPendingTags.length})` : ''}`}
            </button>
          )}
        </div>

        {/* ════ TITRE ════ */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t.titleLabel}</span>
              <span className="text-[10px] text-gray-300">{t.titleHint}</span>
              <span className={`text-[10px] font-semibold ${result.titre.length > 60 ? 'text-red-500' : 'text-gray-300'}`}>
                {result.titre.length}/60
              </span>
            </div>
            <CopyButton text={result.titre} label={t.copy} copiedLabel={t.copied} />
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

        {/* ════ DESCRIPTION ════ */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

          {/* Pills choix de langue — masquées si interface en anglais */}
          {!isEnUI && (
            <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-50">
              {(['native', 'en', 'both'] as const).map(option => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setDescLang(option)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                    descLang === option
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-gray-500 border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  {option === 'native' ? t.descLangNative
                    : option === 'en' ? t.descLangEn
                    : t.descLangBoth}
                </button>
              ))}
            </div>
          )}

          {/* Description native uniquement */}
          {showNativeDesc && (
            <>
              <div className="flex items-center justify-between px-5 py-3 border-b border-gray-50">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Description — {nativeLabel}
                </span>
                <CopyButton text={result.descriptionFR} label={t.copy} copiedLabel={t.copied} />
              </div>
              <div className="px-5 py-4">
                <AutoTextarea
                  value={result.descriptionFR}
                  onChange={updateDescFR}
                  className="w-full text-sm text-gray-800 leading-relaxed bg-gray-50 rounded-xl p-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-colors min-h-[160px]"
                />
              </div>
            </>
          )}

          {/* Équivalences tailles — affichées après la description native */}
          {result.tailleEquivalences && showNativeDesc && (
            <div className="px-5 pb-3">
              <span className="text-[11px] text-indigo-600 font-semibold bg-indigo-50 px-2.5 py-1 rounded-full">
                📏 {result.tailleEquivalences}
              </span>
            </div>
          )}

          {/* Description anglaise uniquement */}
          {showEnDesc && (
            <>
              <div className="flex items-center justify-between px-5 py-3 border-b border-gray-50">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Description — English
                </span>
                <CopyButton text={result.descriptionEN} label={t.copy} copiedLabel={t.copied} />
              </div>
              <div className="px-5 py-4">
                <AutoTextarea
                  value={result.descriptionEN}
                  onChange={updateDescEN}
                  className="w-full text-sm text-gray-800 leading-relaxed bg-gray-50 rounded-xl p-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-colors min-h-[160px]"
                />
              </div>
            </>
          )}

          {/* Mode "Les deux" — un seul bloc continu éditable avec drapeaux */}
          {showBothDesc && (
            <>
              <div className="flex items-center justify-between px-5 py-3 border-b border-gray-50">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  {LANG_FLAGS[lang]} {nativeLabel} + 🇬🇧 English
                </span>
                <CopyButton text={bothDesc} label={t.copyAll} copiedLabel={t.copied} />
              </div>
              <div className="px-5 py-4">
                <AutoTextarea
                  value={bothDesc}
                  onChange={setBothDesc}
                  className="w-full text-sm text-gray-800 leading-relaxed bg-gray-50 rounded-xl p-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-colors min-h-[160px]"
                />
              </div>
              {result.tailleEquivalences && (
                <div className="px-5 pb-3">
                  <span className="text-[11px] text-indigo-600 font-semibold bg-indigo-50 px-2.5 py-1 rounded-full">
                    📏 {result.tailleEquivalences}
                  </span>
                </div>
              )}
            </>
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
