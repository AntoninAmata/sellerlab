'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Loader2, RefreshCw, AlertCircle, FileText,
  Copy, Check, X, Plus, ChevronDown, ChevronUp,
} from 'lucide-react'
import type { RecognitionResult, GenerateResult, ExtraInfo } from '../types'
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
  sectionExtra:     string
  generalInfo:      string
  dimTitle:         string
  addMeasure:       string
  other:            string
  infoValue:        string
  measureName:      string
  measureValue:     string
  addInfo:          string
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
    sectionExtra: 'Informations complémentaires', generalInfo: 'Infos générales',
    dimTitle: 'Dimensions (optionnel)', addMeasure: 'Ajouter une mesure', other: 'Autre',
    infoValue: 'Valeur…', measureName: 'Nom…', measureValue: 'cm', addInfo: 'Ajouter',
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
    sectionExtra: 'Additional information', generalInfo: 'General info',
    dimTitle: 'Dimensions (optional)', addMeasure: 'Add measurement', other: 'Other',
    infoValue: 'Value…', measureName: 'Name…', measureValue: 'cm', addInfo: 'Add',
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
    sectionExtra: 'Información adicional', generalInfo: 'Información general',
    dimTitle: 'Dimensiones (opcional)', addMeasure: 'Añadir medida', other: 'Otro',
    infoValue: 'Valor…', measureName: 'Nombre…', measureValue: 'cm', addInfo: 'Añadir',
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
    sectionExtra: 'Zusätzliche Informationen', generalInfo: 'Allgemeine Infos',
    dimTitle: 'Maße (optional)', addMeasure: 'Maß hinzufügen', other: 'Sonstiges',
    infoValue: 'Wert…', measureName: 'Name…', measureValue: 'cm', addInfo: 'Hinzufügen',
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
    sectionExtra: 'Informazioni aggiuntive', generalInfo: 'Info generali',
    dimTitle: 'Dimensioni (opzionale)', addMeasure: 'Aggiungi misura', other: 'Altro',
    infoValue: 'Valore…', measureName: 'Nome…', measureValue: 'cm', addInfo: 'Aggiungi',
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
    sectionExtra: 'Aanvullende informatie', generalInfo: 'Algemene info',
    dimTitle: 'Afmetingen (optioneel)', addMeasure: 'Meting toevoegen', other: 'Overig',
    infoValue: 'Waarde…', measureName: 'Naam…', measureValue: 'cm', addInfo: 'Toevoegen',
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
    sectionExtra: 'Dodatkowe informacje', generalInfo: 'Informacje ogólne',
    dimTitle: 'Wymiary (opcjonalnie)', addMeasure: 'Dodaj pomiar', other: 'Inne',
    infoValue: 'Wartość…', measureName: 'Nazwa…', measureValue: 'cm', addInfo: 'Dodaj',
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

/* ─── Presets statiques (module-level pour stabilité des callbacks) ─────── */

const EXTRA_PRESETS_FR = ['Pays de fabrication', 'Doublure', 'Référence produit', 'Type de fermeture', 'Saison', 'Remarques']
const EXTRA_PRESETS_I18N: Record<string, string[]> = {
  fr: EXTRA_PRESETS_FR,
  en: ['Country of origin', 'Lining', 'Product reference', 'Closure type', 'Season', 'Notes'],
  es: ['País de fabricación', 'Forro', 'Referencia del producto', 'Tipo de cierre', 'Temporada', 'Observaciones'],
  de: ['Herstellungsland', 'Futter', 'Produktreferenz', 'Verschlusstyp', 'Saison', 'Bemerkungen'],
  it: ['Paese di fabbricazione', 'Fodera', 'Riferimento prodotto', 'Tipo di chiusura', 'Stagione', 'Note'],
  nl: ['Land van herkomst', 'Voering', 'Productreferentie', 'Type sluiting', 'Seizoen', 'Opmerkingen'],
  pl: ['Kraj produkcji', 'Podszewka', 'Numer referencyjny', 'Typ zamknięcia', 'Sezon', 'Uwagi'],
}
const DIM_PRESETS_FR = ['Tour de poitrine', 'Longueur', 'Épaules', 'Tour de taille', 'Tour de hanches', 'Entrejambe', 'Pointure', 'Largeur', 'Hauteur', 'Profondeur']
const DIM_PRESETS_EN = ['Chest', 'Length', 'Shoulders', 'Waist', 'Hips', 'Inseam', 'Shoe size', 'Width', 'Height', 'Depth']
const DIM_PRESETS_DISPLAY: Record<string, string[]> = {
  fr: DIM_PRESETS_FR, en: DIM_PRESETS_EN,
  es: ['Pecho','Longitud','Hombros','Cintura','Caderas','Entrepierna','Número','Anchura','Altura','Profundidad'],
  de: ['Brustumfang','Länge','Schultern','Taillenumfang','Hüftumfang','Schrittlänge','Schuhgröße','Breite','Höhe','Tiefe'],
  it: ['Petto','Lunghezza','Spalle','Vita','Fianchi','Cavallo','Numero scarpa','Larghezza','Altezza','Profondità'],
  nl: ['Borstomtrek','Lengte','Schouders','Tailleomtrek','Heupomtrek','Beenlengte','Schoenmaat','Breedte','Hoogte','Diepte'],
  pl: ['Obwód klatki','Długość','Ramiona','Obwód talii','Obwód bioder','Długość kroku','Rozmiar buta','Szerokość','Wysokość','Głębokość'],
}

/* ─── Libellés de section emoji par langue (injection locale) ────────────── */

const BLOCK_HEADERS: Record<string, { infos: string; dims: string; prix: string }> = {
  fr: { infos: '📋 Infos complémentaires', dims: '📐 Dimensions', prix: '💰 Prix neuf' },
  en: { infos: '📋 Additional info',       dims: '📐 Dimensions', prix: '💰 Original price' },
  es: { infos: '📋 Información adicional', dims: '📐 Dimensiones', prix: '💰 Precio original' },
  de: { infos: '📋 Weitere Infos',         dims: '📐 Maße',        prix: '💰 Neupreis' },
  it: { infos: '📋 Info aggiuntive',       dims: '📐 Dimensioni',  prix: '💰 Prezzo originale' },
  nl: { infos: '📋 Extra info',            dims: '📐 Afmetingen',  prix: '💰 Originele prijs' },
  pl: { infos: '📋 Dodatkowe info',        dims: '📐 Wymiary',     prix: '💰 Cena nowa' },
}

/* ─── Injection locale dans les descriptions (sans appel API) ────────────── */

type MissingInfo = { label: string; labelEN?: string; value: string }
type Dimension   = { nom: string; nomEN: string; valeur: string }

function upsertEmojiLine(desc: string, emoji: string, newLine: string | null): string {
  const lines = desc.split('\n')
  const idx = lines.findIndex(l => l.trimStart().startsWith(emoji))
  if (!newLine) {
    if (idx >= 0) lines.splice(idx, 1)
    return lines.join('\n').replace(/\n{3,}/g, '\n\n')
  }
  if (idx >= 0) { lines[idx] = newLine; return lines.join('\n') }
  const pkgIdx = lines.findIndex(l => l.trimStart().startsWith('📦'))
  const pos = pkgIdx >= 0 ? pkgIdx : (() => {
    let i = lines.length - 1
    while (i > 0 && !lines[i].trim()) i--
    return i
  })()
  lines.splice(pos, 0, newLine)
  return lines.join('\n')
}

function injectInfos(desc: string, infos: MissingInfo[], lang: string, asEn: boolean): string {
  if (!infos.length) return upsertEmojiLine(desc, '📋', null)
  const h = (BLOCK_HEADERS[asEn ? 'en' : lang] ?? BLOCK_HEADERS.fr).infos
  const parts = infos.map(i => `${asEn ? (i.labelEN ?? i.label) : i.label} : ${i.value}`).join(' · ')
  return upsertEmojiLine(desc, '📋', `${h} : ${parts}`)
}

function injectDims(desc: string, dims: Dimension[], lang: string, asEn: boolean): string {
  if (!dims.length) return upsertEmojiLine(desc, '📐', null)
  const h = (BLOCK_HEADERS[asEn ? 'en' : lang] ?? BLOCK_HEADERS.fr).dims
  /* d.nom est toujours la clé FR (DIM_PRESETS_FR est utilisé comme clé canonique) ;
     pour la description native non-anglaise, on traduit via DIM_PRESETS_DISPLAY[lang] */
  const displayPresets = DIM_PRESETS_DISPLAY[lang] ?? DIM_PRESETS_FR
  const parts = dims.map(d => {
    if (asEn) return `${d.nomEN} ${d.valeur} cm`
    const idx = DIM_PRESETS_FR.indexOf(d.nom)
    const lbl = idx >= 0 ? (displayPresets[idx] ?? d.nom) : d.nom
    return `${lbl} ${d.valeur} cm`
  }).join(' · ')
  return upsertEmojiLine(desc, '📐', `${h} : ${parts}`)
}

function injectPrix(desc: string, prix: number | null, lang: string, asEn: boolean): string {
  if (!prix) return upsertEmojiLine(desc, '💰', null)
  const h = (BLOCK_HEADERS[asEn ? 'en' : lang] ?? BLOCK_HEADERS.fr).prix
  return upsertEmojiLine(desc, '💰', `${h} : ${prix}€`)
}

/* ─── Props ──────────────────────────────────────────────────────────────── */

interface Props {
  recognition: RecognitionResult | null
  result: GenerateResult | null
  setResult: (r: GenerateResult) => void
  setExtraInfo: (patch: Partial<ExtraInfo>) => void
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
          vintedPath:    recognition.vintedPath.value,
          taille:        recognition.taille.value,
          tailleSysteme: recognition.tailleSysteme.value[0] ?? '',
          etat:          recognition.etat.value,
          couleurs:      recognition.couleurs.value,
          matieres:      recognition.matieres.value,
          style:         recognition.style.value,
          motif:         recognition.motif.value,
          defauts:       recognition.defauts.confidence === 'manual' ? recognition.defauts.value : '',
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

export default function AnnonceStep({ recognition, result, setResult, setExtraInfo }: Props) {
  const { lang } = useLang()
  const t = UI[lang] ?? UI.fr

  const { loading, error, retry } = useGenerate(recognition, result, setResult, lang)

  /* ── ref stable pour accéder à result dans les callbacks sans le mettre en dep ── */
  const resultRef = useRef(result)
  useEffect(() => { resultRef.current = result }, [result])

  /* ── Infos complémentaires state ── */
  const [openExtraFields,  setOpenExtraFields]  = useState<string[]>([])
  const [extraFieldInputs, setExtraFieldInputs] = useState<Record<string, string>>({})
  const [customExtraRows,  setCustomExtraRows]  = useState<{ id: number; nom: string; value: string }[]>([])
  const [prixNeuf,         setPrixNeuf]         = useState(
    recognition?.extraInfo?.prixAchatNeuf ? String(recognition.extraInfo.prixAchatNeuf) : ''
  )
  const [openDimFields,    setOpenDimFields]    = useState<string[]>([])
  const [dimInputs,        setDimInputs]        = useState<Record<string, string>>({})
  const [customDimRows,    setCustomDimRows]    = useState<{ id: number; nom: string; valeur: string }[]>([])

  const extraPresets    = EXTRA_PRESETS_I18N[lang] ?? EXTRA_PRESETS_FR
  const dimDisplayLabels = DIM_PRESETS_DISPLAY[lang] ?? DIM_PRESETS_FR

  /* ── Helpers injection ── */
  const applyInfos = useCallback((infos: MissingInfo[]) => {
    const cur = resultRef.current
    if (!cur) return
    setResult({
      ...cur,
      descriptionFR: injectInfos(cur.descriptionFR, infos, lang, lang === 'en'),
      descriptionEN: injectInfos(cur.descriptionEN, infos, lang, true),
    })
  }, [setResult, lang])

  const applyDims = useCallback((dims: Dimension[]) => {
    const cur = resultRef.current
    if (!cur) return
    setResult({
      ...cur,
      descriptionFR: injectDims(cur.descriptionFR, dims, lang, lang === 'en'),
      descriptionEN: injectDims(cur.descriptionEN, dims, lang, true),
    })
  }, [setResult, lang])

  const applyPrix = useCallback((prix: number | null) => {
    const cur = resultRef.current
    if (!cur) return
    setResult({
      ...cur,
      descriptionFR: injectPrix(cur.descriptionFR, prix, lang, lang === 'en'),
      descriptionEN: injectPrix(cur.descriptionEN, prix, lang, true),
    })
  }, [setResult, lang])

  const validateMissingInfo = useCallback((label: string) => {
    const value = (extraFieldInputs[label] ?? '').trim()
    if (!value) return
    const langPresets = EXTRA_PRESETS_I18N[lang] ?? EXTRA_PRESETS_FR
    const idx = langPresets.indexOf(label)
    const labelEN = idx >= 0 ? (EXTRA_PRESETS_I18N.en?.[idx] ?? label) : label
    const existing = recognition?.extraInfo?.missingInfos ?? []
    const newInfos = [...existing.filter(i => i.label !== label), { label, labelEN, value }]
    setExtraInfo({ missingInfos: newInfos })
    applyInfos(newInfos)
    setExtraFieldInputs(prev => { const n = { ...prev }; delete n[label]; return n })
    setOpenExtraFields(prev => prev.filter(f => f !== label))
  }, [extraFieldInputs, recognition, setExtraInfo, applyInfos, lang])

  const removeValidatedInfo = useCallback((label: string) => {
    const existing = recognition?.extraInfo?.missingInfos ?? []
    const newInfos = existing.filter(i => i.label !== label)
    setExtraInfo({ missingInfos: newInfos })
    applyInfos(newInfos)
  }, [recognition, setExtraInfo, applyInfos])

  const validateCustomExtraRow = useCallback((id: number) => {
    const row = customExtraRows.find(r => r.id === id)
    if (!row || !row.nom.trim() || !row.value.trim()) return
    const existing = recognition?.extraInfo?.missingInfos ?? []
    const newInfos = [...existing.filter(i => i.label !== row.nom), { label: row.nom, value: row.value }]
    setExtraInfo({ missingInfos: newInfos })
    applyInfos(newInfos)
    setCustomExtraRows(prev => prev.filter(r => r.id !== id))
  }, [customExtraRows, recognition, setExtraInfo, applyInfos])

  const validateDimension = useCallback((nom: string, nomEN: string) => {
    const valeur = (dimInputs[nom] ?? '').trim()
    if (!valeur) return
    const existing = recognition?.extraInfo?.dimensions ?? []
    const newDims = [...existing.filter(d => d.nom !== nom), { nom, nomEN, valeur }]
    setExtraInfo({ dimensions: newDims })
    applyDims(newDims)
    setDimInputs(prev => { const n = { ...prev }; delete n[nom]; return n })
    setOpenDimFields(prev => prev.filter(f => f !== nom))
  }, [dimInputs, recognition, setExtraInfo, applyDims])

  const removeValidatedDim = useCallback((nom: string) => {
    const existing = recognition?.extraInfo?.dimensions ?? []
    const newDims = existing.filter(d => d.nom !== nom)
    setExtraInfo({ dimensions: newDims })
    applyDims(newDims)
  }, [recognition, setExtraInfo, applyDims])

  const validateCustomDimRow = useCallback((id: number) => {
    const row = customDimRows.find(r => r.id === id)
    if (!row || !row.nom.trim() || !row.valeur.trim()) return
    const existing = recognition?.extraInfo?.dimensions ?? []
    const newDims = [...existing.filter(d => d.nom !== row.nom), { nom: row.nom, nomEN: row.nom, valeur: row.valeur }]
    setExtraInfo({ dimensions: newDims })
    applyDims(newDims)
    setCustomDimRows(prev => prev.filter(r => r.id !== id))
  }, [customDimRows, recognition, setExtraInfo, applyDims])

  const validatePrixNeuf = useCallback(() => {
    const v = parseFloat(prixNeuf)
    if (!v) return
    setExtraInfo({ prixAchatNeuf: v })
    applyPrix(v)
  }, [prixNeuf, setExtraInfo, applyPrix])

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

        {/* ════ INFORMATIONS COMPLÉMENTAIRES ════ */}
        <ExtraInfoSection
          recognition={recognition}
          t={t}
          extraPresets={extraPresets}
          EXTRA_PRESETS_FR={EXTRA_PRESETS_FR}
          dimDisplayLabels={dimDisplayLabels}
          DIM_PRESETS_FR={DIM_PRESETS_FR}
          DIM_PRESETS_EN={DIM_PRESETS_EN}
          openExtraFields={openExtraFields} setOpenExtraFields={setOpenExtraFields}
          extraFieldInputs={extraFieldInputs} setExtraFieldInputs={setExtraFieldInputs}
          customExtraRows={customExtraRows} setCustomExtraRows={setCustomExtraRows}
          prixNeuf={prixNeuf} setPrixNeuf={setPrixNeuf}
          openDimFields={openDimFields} setOpenDimFields={setOpenDimFields}
          dimInputs={dimInputs} setDimInputs={setDimInputs}
          customDimRows={customDimRows} setCustomDimRows={setCustomDimRows}
          validateMissingInfo={validateMissingInfo}
          removeValidatedInfo={removeValidatedInfo}
          validateCustomExtraRow={validateCustomExtraRow}
          validateDimension={validateDimension}
          removeValidatedDim={removeValidatedDim}
          validateCustomDimRow={validateCustomDimRow}
          validatePrixNeuf={validatePrixNeuf}
        />

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

        {/* ════ TITRE + DESCRIPTION ════ */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

          {/* Titre */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t.titleLabel}</span>
              <span className="text-[10px] text-gray-300">{t.titleHint}</span>
              <span className={`text-[10px] font-semibold ${result.titre.length > 60 ? 'text-red-500' : result.titre.length >= 50 ? 'text-green-600' : 'text-gray-300'}`}>
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

          {/* Séparateur titre / description */}
          <div className="border-t border-gray-100" />

          {/* Pills choix de langue */}
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
                  {option === 'native' ? t.descLangNative : option === 'en' ? t.descLangEn : t.descLangBoth}
                </button>
              ))}
            </div>
          )}

          {/* Description native */}
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

          {/* Description anglaise */}
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

          {/* Mode "Les deux" */}
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
            </>
          )}

        </div>

      </div>
    </div>
  )
}

/* ─── Section Informations complémentaires ────────────────────────────────── */

function ExtraInfoSection({
  recognition, t, extraPresets, EXTRA_PRESETS_FR, dimDisplayLabels, DIM_PRESETS_FR, DIM_PRESETS_EN,
  openExtraFields, setOpenExtraFields, extraFieldInputs, setExtraFieldInputs,
  customExtraRows, setCustomExtraRows, prixNeuf, setPrixNeuf,
  openDimFields, setOpenDimFields, dimInputs, setDimInputs, customDimRows, setCustomDimRows,
  validateMissingInfo, removeValidatedInfo, validateCustomExtraRow,
  validateDimension, removeValidatedDim, validateCustomDimRow, validatePrixNeuf,
}: {
  recognition: RecognitionResult | null
  t: typeof UI['fr']
  extraPresets: string[]
  EXTRA_PRESETS_FR: string[]
  dimDisplayLabels: string[]
  DIM_PRESETS_FR: string[]
  DIM_PRESETS_EN: string[]
  openExtraFields: string[]; setOpenExtraFields: React.Dispatch<React.SetStateAction<string[]>>
  extraFieldInputs: Record<string, string>; setExtraFieldInputs: React.Dispatch<React.SetStateAction<Record<string, string>>>
  customExtraRows: { id: number; nom: string; value: string }[]
  setCustomExtraRows: React.Dispatch<React.SetStateAction<{ id: number; nom: string; value: string }[]>>
  prixNeuf: string; setPrixNeuf: React.Dispatch<React.SetStateAction<string>>
  openDimFields: string[]; setOpenDimFields: React.Dispatch<React.SetStateAction<string[]>>
  dimInputs: Record<string, string>; setDimInputs: React.Dispatch<React.SetStateAction<Record<string, string>>>
  customDimRows: { id: number; nom: string; valeur: string }[]
  setCustomDimRows: React.Dispatch<React.SetStateAction<{ id: number; nom: string; valeur: string }[]>>
  validateMissingInfo: (label: string) => void
  removeValidatedInfo: (label: string) => void
  validateCustomExtraRow: (id: number) => void
  validateDimension: (nom: string, nomEN: string) => void
  removeValidatedDim: (nom: string) => void
  validateCustomDimRow: (id: number) => void
  validatePrixNeuf: () => void
}) {
  const [open, setOpen] = useState(true)
  const extraInfo = recognition?.extraInfo

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t.sectionExtra}</p>
          {((extraInfo?.missingInfos?.length ?? 0) + (extraInfo?.dimensions?.length ?? 0) + (extraInfo?.prixAchatNeuf ? 1 : 0)) > 0 && (
            <span className="text-[10px] font-bold bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">
              {(extraInfo?.missingInfos?.length ?? 0) + (extraInfo?.dimensions?.length ?? 0) + (extraInfo?.prixAchatNeuf ? 1 : 0)}
            </span>
          )}
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>

      {open && (
        <div className="px-5 pb-5 space-y-5 border-t border-gray-50">

          {/* Bloc 1 — Infos générales + prix neuf */}
          <div className="space-y-3 pt-4">
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">{t.generalInfo}</p>

            <div className="flex flex-wrap gap-1.5">
              {EXTRA_PRESETS_FR.map((label, idx) => {
                const validated    = extraInfo?.missingInfos?.find(i => i.label === label)
                const isOpen       = openExtraFields.includes(label)
                const displayLabel = extraPresets[idx] ?? label
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => {
                      if (validated) { removeValidatedInfo(label) }
                      else if (!isOpen) { setOpenExtraFields(prev => [...prev, label]) }
                    }}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full border transition-all ${
                      validated ? 'bg-green-50 text-green-700 border-green-200'
                      : isOpen ? 'bg-orange-50 text-orange-600 border-orange-300'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'
                    }`}
                  >
                    {validated ? `✓ ${displayLabel} : ${validated.value}` : `+ ${displayLabel}`}
                  </button>
                )
              })}
              {(extraInfo?.missingInfos ?? [])
                .filter(i => !EXTRA_PRESETS_FR.includes(i.label))
                .map(i => (
                  <button key={i.label} type="button" onClick={() => removeValidatedInfo(i.label)}
                    className="text-xs font-semibold px-2.5 py-1 rounded-full border bg-green-50 text-green-700 border-green-200">
                    ✓ {i.label} : {i.value}
                  </button>
                ))
              }
              <button type="button" onClick={() => setCustomExtraRows(prev => [...prev, { id: Date.now(), nom: '', value: '' }])}
                className="text-xs font-semibold px-2.5 py-1 rounded-full border bg-white text-gray-600 border-gray-200 hover:border-indigo-300 transition-all flex items-center gap-1">
                <Plus className="w-3 h-3" />
                {t.other}
              </button>
            </div>

            {openExtraFields.map(label => {
              const idxFr = EXTRA_PRESETS_FR.indexOf(label)
              const displayLabel = idxFr >= 0 ? (extraPresets[idxFr] ?? label) : label
              return (
                <div key={label} className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-600 shrink-0 w-28 truncate">{displayLabel}</span>
                  <input type="text" value={extraFieldInputs[label] ?? ''}
                    onChange={e => setExtraFieldInputs(prev => ({ ...prev, [label]: e.target.value }))}
                    onKeyDown={e => e.key === 'Enter' && validateMissingInfo(label)}
                    placeholder={t.infoValue}
                    className="flex-1 text-sm rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-colors" />
                  <button onClick={() => validateMissingInfo(label)} disabled={!(extraFieldInputs[label] ?? '').trim()}
                    className="shrink-0 text-xs font-semibold px-3 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-200 disabled:cursor-not-allowed text-white rounded-xl transition-colors">
                    {t.addInfo}
                  </button>
                  <button onClick={() => setOpenExtraFields(prev => prev.filter(f => f !== label))} className="text-gray-400 hover:text-gray-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )
            })}

            {customExtraRows.map(row => (
              <div key={row.id} className="flex items-center gap-2">
                <input type="text" value={row.nom}
                  onChange={e => setCustomExtraRows(prev => prev.map(r => r.id === row.id ? { ...r, nom: e.target.value } : r))}
                  placeholder={t.measureName}
                  className="w-28 text-sm rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-colors" />
                <input type="text" value={row.value}
                  onChange={e => setCustomExtraRows(prev => prev.map(r => r.id === row.id ? { ...r, value: e.target.value } : r))}
                  onKeyDown={e => e.key === 'Enter' && validateCustomExtraRow(row.id)}
                  placeholder={t.infoValue}
                  className="flex-1 text-sm rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-colors" />
                <button onClick={() => validateCustomExtraRow(row.id)} disabled={!row.nom.trim() || !row.value.trim()}
                  className="shrink-0 text-xs font-semibold px-3 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-200 disabled:cursor-not-allowed text-white rounded-xl transition-colors">
                  {t.addInfo}
                </button>
                <button onClick={() => setCustomExtraRows(prev => prev.filter(r => r.id !== row.id))} className="text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}

            {/* Prix neuf */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-600 shrink-0 w-28">{t.prixNeuf}</span>
              <input type="number" min="0" step="0.01" value={prixNeuf}
                onChange={e => setPrixNeuf(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && validatePrixNeuf()}
                placeholder="Ex: 49.90"
                className={`flex-1 text-sm rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 transition-colors ${
                  extraInfo?.prixAchatNeuf ? 'border-green-300 bg-green-50 focus:ring-green-100' : 'border-gray-200 bg-white focus:ring-indigo-100 focus:border-indigo-400'
                }`} />
              <span className="text-xs text-gray-400 shrink-0">€</span>
              <button onClick={validatePrixNeuf} disabled={!parseFloat(prixNeuf)}
                className="shrink-0 w-8 h-8 flex items-center justify-center bg-green-500 hover:bg-green-600 disabled:bg-gray-200 disabled:cursor-not-allowed text-white rounded-xl transition-colors">
                <Check className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Bloc 2 — Dimensions */}
          <div className="space-y-3 pt-4 border-t border-gray-100">
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">{t.dimTitle}</p>

            <div className="flex flex-wrap gap-1.5">
              {DIM_PRESETS_FR.map((nom, idx) => {
                const validated    = extraInfo?.dimensions?.find(d => d.nom === nom)
                const isOpen       = openDimFields.includes(nom)
                const displayLabel = dimDisplayLabels[idx] ?? nom
                return (
                  <button key={nom} type="button"
                    onClick={() => { if (validated) { removeValidatedDim(nom) } else if (!isOpen) { setOpenDimFields(prev => [...prev, nom]) } }}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full border transition-all ${
                      validated ? 'bg-green-50 text-green-700 border-green-200'
                      : isOpen ? 'bg-orange-50 text-orange-600 border-orange-300'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'
                    }`}>
                    {validated ? `✓ ${displayLabel} : ${validated.valeur} cm` : `+ ${displayLabel}`}
                  </button>
                )
              })}
              {(extraInfo?.dimensions ?? [])
                .filter(d => !DIM_PRESETS_FR.includes(d.nom))
                .map(d => (
                  <button key={d.nom} type="button" onClick={() => removeValidatedDim(d.nom)}
                    className="text-xs font-semibold px-2.5 py-1 rounded-full border bg-green-50 text-green-700 border-green-200">
                    ✓ {d.nom} : {d.valeur} cm
                  </button>
                ))
              }
            </div>

            {openDimFields.map(nom => {
              const idx          = DIM_PRESETS_FR.indexOf(nom)
              const displayLabel = idx >= 0 ? (dimDisplayLabels[idx] ?? nom) : nom
              const nomEN        = DIM_PRESETS_EN[idx] ?? nom
              return (
                <div key={nom} className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-600 shrink-0 w-28 truncate">{displayLabel}</span>
                  <input type="number" min="0" step="0.1" value={dimInputs[nom] ?? ''}
                    onChange={e => setDimInputs(prev => ({ ...prev, [nom]: e.target.value }))}
                    onKeyDown={e => { if (e.key === 'Enter') validateDimension(nom, nomEN) }}
                    placeholder={t.measureValue}
                    className="flex-1 text-sm rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-colors" />
                  <span className="text-xs text-gray-400 shrink-0">cm</span>
                  <button onClick={() => validateDimension(nom, nomEN)} disabled={!(dimInputs[nom] ?? '').trim()}
                    className="shrink-0 text-xs font-semibold px-3 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-200 disabled:cursor-not-allowed text-white rounded-xl transition-colors">
                    {t.addInfo}
                  </button>
                  <button onClick={() => setOpenDimFields(prev => prev.filter(f => f !== nom))} className="text-gray-400 hover:text-gray-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )
            })}

            {customDimRows.map(row => (
              <div key={row.id} className="flex items-center gap-2">
                <input type="text" value={row.nom}
                  onChange={e => setCustomDimRows(prev => prev.map(r => r.id === row.id ? { ...r, nom: e.target.value } : r))}
                  placeholder={t.measureName}
                  className="w-28 text-sm rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-colors" />
                <input type="number" min="0" step="0.1" value={row.valeur}
                  onChange={e => setCustomDimRows(prev => prev.map(r => r.id === row.id ? { ...r, valeur: e.target.value } : r))}
                  onKeyDown={e => e.key === 'Enter' && validateCustomDimRow(row.id)}
                  placeholder={t.measureValue}
                  className="w-20 text-sm rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-colors" />
                <span className="text-xs text-gray-400 shrink-0">cm</span>
                <button onClick={() => validateCustomDimRow(row.id)} disabled={!row.nom.trim() || !row.valeur.trim()}
                  className="shrink-0 text-xs font-semibold px-3 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-200 disabled:cursor-not-allowed text-white rounded-xl transition-colors">
                  {t.addInfo}
                </button>
                <button onClick={() => setCustomDimRows(prev => prev.filter(r => r.id !== row.id))} className="text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}

            <button type="button"
              onClick={() => setCustomDimRows(prev => [...prev, { id: Date.now(), nom: '', valeur: '' }])}
              className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
              <Plus className="w-3.5 h-3.5" />
              {t.addMeasure}
            </button>
          </div>

        </div>
      )}
    </div>
  )
}
