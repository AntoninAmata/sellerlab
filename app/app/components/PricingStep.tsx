'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Loader2, RefreshCw, AlertCircle, AlertTriangle,
  Tag, TrendingUp, Euro, CheckCircle2, Info, X, ChevronDown,
} from 'lucide-react'
import type { RecognitionResult, PriceResult, PricePrecisions } from '../types'
import { useLang } from '@/app/providers'
import type { Lang } from '@/lib/i18n'
import { DECOTE_TABLE, normalizeEtat, computePrice } from '@/lib/pricing'

/* ─── Traductions UI — 7 langues ─────────────────────────────────────────── */

const UI: Record<Lang, {
  loading: string; loadingSub: string
  failed: string; retry: string; noRecognition: string
  header: string; headerSub: string; recalculate: string
  highConf: string; medConf: string; lowConf: string
  suggestedPrice: string; marketAnalysis: string
  retailPrice: string; medianVinted: string; range: string
  listings: string
  adjustPrice: string; suggested: string
  fewDays: string; oneTwo: string; oneMonth: string
  tip: string; tipBold: string
  displayPrice: string; realPrice: string; minAccept: string; delay: string
  preciseTitle: string; buyPriceLabel: string; boughtAt: string
  shopOfficial: string; shopOther: string
  choose: string; rare: string
  rareOptions: string[]; recalcBtn: string
  reseller: string; myBuyPrice: string; netMargin: string; marginPct: string
  estimatedVal: (bought: number, val: number, pct: number, state: string) => string
  confidenceSource: (n: number) => string
  confidenceSourceNoListings: string
  synthBoth: string; synthDecoteOnly: string; synthMedianOnly: string; synthNoData: string
  showMore: string; showLess: string
}> = {
  fr: {
    loading: 'Calcul en cours…', loadingSub: "L'IA analyse les prix du marché en temps réel.",
    failed: 'Calcul impossible', retry: 'Réessayer', noRecognition: "Complétez d'abord l'étape 2 pour que l'IA puisse calculer le prix.",
    header: 'Prix recommandé', headerSub: 'Basé sur des recherches web en temps réel.', recalculate: 'Recalculer',
    highConf: 'Données fiables — confiance élevée', medConf: 'Données partielles — confiance moyenne', lowConf: 'Données insuffisantes — confiance faible',
    suggestedPrice: 'Prix de vente suggéré', marketAnalysis: 'Analyse marché',
    retailPrice: 'Prix neuf', medianVinted: 'Médiane Vinted', range: 'Fourchette', listings: 'Annonces',
    adjustPrice: 'Ajuster le prix', suggested: 'suggéré',
    fewDays: 'Quelques jours', oneTwo: '1–2 semaines', oneMonth: '1 mois+',
    tip: 'Astuce Vinted : affichez 15–20% au-dessus de votre prix plancher.', tipBold: '70% des acheteurs négocient.',
    displayPrice: "Prix d'affichage", realPrice: "Prix réel estimé après négociation avec l'acheteur",
    minAccept: "Nous vous recommandons de ne pas accepter d'offre en dessous de", delay: 'Délai estimé',
    preciseTitle: "Préciser le prix d'achat", buyPriceLabel: "Prix d'achat neuf (€)", boughtAt: 'Acheté chez',
    shopOfficial: 'Boutique officielle', shopOther: 'Autre',
    choose: '— Choisir —', rare: 'Article rare ou édition limitée ?',
    rareOptions: ['Non', 'Collaboration', 'Édition limitée', 'Vintage'], recalcBtn: 'Recalculer avec ces informations',
    reseller: 'Je suis revendeur', myBuyPrice: "Mon prix d'achat (€)", netMargin: 'Marge nette estimée', marginPct: '% de marge',
    estimatedVal: (b, v, p, s) => `Acheté ${b}€ → valeur marché ~${v}€ en ${s.toLowerCase()} (${p}%)`,
    confidenceSource: (n) => `${n} annonce${n > 1 ? 's' : ''} similaire${n > 1 ? 's' : ''} analysée${n > 1 ? 's' : ''}`,
    confidenceSourceNoListings: 'Aucune annonce similaire trouvée',
    synthBoth: "Estimé à partir du prix neuf et des ventes récentes d'articles similaires",
    synthDecoteOnly: "Estimé à partir du prix neuf (peu d'annonces trouvées)",
    synthMedianOnly: "Estimé à partir des ventes récentes d'articles similaires",
    synthNoData: 'Estimation approximative (données de marché insuffisantes)',
    showMore: 'Voir plus', showLess: 'Réduire',
  },
  en: {
    loading: 'Calculating…', loadingSub: 'AI is analyzing market prices in real time.',
    failed: 'Calculation failed', retry: 'Retry', noRecognition: 'Complete step 2 first so AI can calculate the price.',
    header: 'Recommended price', headerSub: 'Based on real-time web searches.', recalculate: 'Recalculate',
    highConf: 'Reliable data — high confidence', medConf: 'Partial data — medium confidence', lowConf: 'Insufficient data — low confidence',
    suggestedPrice: 'Suggested selling price', marketAnalysis: 'Market analysis',
    retailPrice: 'Retail price', medianVinted: 'Vinted median', range: 'Range', listings: 'Listings',
    adjustPrice: 'Adjust price', suggested: 'suggested',
    fewDays: 'A few days', oneTwo: '1–2 weeks', oneMonth: '1 month+',
    tip: 'Vinted tip: list 15–20% above your minimum price.', tipBold: '70% of buyers negotiate.',
    displayPrice: 'Listed price', realPrice: 'Estimated real price after buyer negotiation',
    minAccept: "We recommend not accepting offers below", delay: 'Estimated time',
    preciseTitle: 'Specify purchase price', buyPriceLabel: 'Original purchase price (€)', boughtAt: 'Bought from',
    shopOfficial: 'Official store', shopOther: 'Other',
    choose: '— Choose —', rare: 'Rare item or limited edition?',
    rareOptions: ['No', 'Collaboration', 'Limited edition', 'Vintage'], recalcBtn: 'Recalculate with this info',
    reseller: 'I am a reseller', myBuyPrice: 'My purchase price (€)', netMargin: 'Estimated net margin', marginPct: '% margin',
    estimatedVal: (b, v, p, s) => `Bought for ${b}€ → market value ~${v}€ in ${s.toLowerCase()} condition (${p}%)`,
    confidenceSource: (n) => `${n} similar listing${n > 1 ? 's' : ''} analysed`,
    confidenceSourceNoListings: 'No similar listings found',
    synthBoth: 'Estimated from the retail price and recent sales of similar items',
    synthDecoteOnly: 'Estimated from the retail price (few listings found)',
    synthMedianOnly: 'Estimated from recent sales of similar items',
    synthNoData: 'Approximate estimate (insufficient market data)',
    showMore: 'Show more', showLess: 'Show less',
  },
  es: {
    loading: 'Calculando…', loadingSub: 'La IA analiza los precios del mercado en tiempo real.',
    failed: 'Cálculo imposible', retry: 'Reintentar', noRecognition: 'Completa el paso 2 primero para que la IA pueda calcular el precio.',
    header: 'Precio recomendado', headerSub: 'Basado en búsquedas web en tiempo real.', recalculate: 'Recalcular',
    highConf: 'Datos fiables — confianza alta', medConf: 'Datos parciales — confianza media', lowConf: 'Datos insuficientes — confianza baja',
    suggestedPrice: 'Precio de venta sugerido', marketAnalysis: 'Análisis de mercado',
    retailPrice: 'Precio nuevo', medianVinted: 'Mediana Vinted', range: 'Horquilla', listings: 'Anuncios',
    adjustPrice: 'Ajustar precio', suggested: 'sugerido',
    fewDays: 'Unos días', oneTwo: '1–2 semanas', oneMonth: '1 mes+',
    tip: 'Consejo Vinted: publica 15–20% por encima de tu precio mínimo.', tipBold: 'El 70% de los compradores negocian.',
    displayPrice: 'Precio publicado', realPrice: 'Precio real estimado tras negociación con el comprador',
    minAccept: 'No recomendamos aceptar ofertas por debajo de', delay: 'Plazo estimado',
    preciseTitle: 'Precisar el precio de compra', buyPriceLabel: 'Precio de compra nuevo (€)', boughtAt: 'Comprado en',
    shopOfficial: 'Tienda oficial', shopOther: 'Otro',
    choose: '— Elegir —', rare: '¿Artículo raro o edición limitada?',
    rareOptions: ['No', 'Colaboración', 'Edición limitada', 'Vintage'], recalcBtn: 'Recalcular con esta información',
    reseller: 'Soy revendedor', myBuyPrice: 'Mi precio de compra (€)', netMargin: 'Margen neto estimado', marginPct: '% margen',
    estimatedVal: (b, v, p, s) => `Comprado a ${b}€ → valor de mercado ~${v}€ en ${s.toLowerCase()} (${p}%)`,
    confidenceSource: (n) => `${n} anuncio${n > 1 ? 's' : ''} similar${n > 1 ? 'es' : ''} analizado${n > 1 ? 's' : ''}`,
    confidenceSourceNoListings: 'No se encontraron anuncios similares',
    synthBoth: 'Estimado a partir del precio nuevo y ventas recientes de artículos similares',
    synthDecoteOnly: 'Estimado a partir del precio nuevo (pocos anuncios encontrados)',
    synthMedianOnly: 'Estimado a partir de ventas recientes de artículos similares',
    synthNoData: 'Estimación aproximada (datos de mercado insuficientes)',
    showMore: 'Ver más', showLess: 'Ver menos',
  },
  de: {
    loading: 'Berechnung läuft…', loadingSub: 'Die KI analysiert Marktpreise in Echtzeit.',
    failed: 'Berechnung fehlgeschlagen', retry: 'Erneut versuchen', noRecognition: 'Schritt 2 zuerst abschließen, damit die KI den Preis berechnen kann.',
    header: 'Empfohlener Preis', headerSub: 'Basiert auf Echtzeit-Websuchen.', recalculate: 'Neu berechnen',
    highConf: 'Zuverlässige Daten — hohe Konfidenz', medConf: 'Teilweise Daten — mittlere Konfidenz', lowConf: 'Unzureichende Daten — niedrige Konfidenz',
    suggestedPrice: 'Vorgeschlagener Verkaufspreis', marketAnalysis: 'Marktanalyse',
    retailPrice: 'Neupreis', medianVinted: 'Vinted-Median', range: 'Preisspanne', listings: 'Anzeigen',
    adjustPrice: 'Preis anpassen', suggested: 'vorgeschlagen',
    fewDays: 'Wenige Tage', oneTwo: '1–2 Wochen', oneMonth: '1 Monat+',
    tip: 'Vinted-Tipp: 15–20% über Ihrem Mindestpreis anbieten.', tipBold: '70% der Käufer verhandeln.',
    displayPrice: 'Angezeigter Preis', realPrice: 'Geschätzter tatsächlicher Preis nach Käuferverhandlung',
    minAccept: 'Wir empfehlen, kein Angebot unter diesem Preis anzunehmen:', delay: 'Geschätzte Dauer',
    preciseTitle: 'Kaufpreis angeben', buyPriceLabel: 'Originalkaufpreis (€)', boughtAt: 'Gekauft bei',
    shopOfficial: 'Offizieller Shop', shopOther: 'Andere',
    choose: '— Wählen —', rare: 'Seltener Artikel oder limitierte Edition?',
    rareOptions: ['Nein', 'Kollaboration', 'Limitierte Edition', 'Vintage'], recalcBtn: 'Mit diesen Infos neu berechnen',
    reseller: 'Ich bin Wiederverkäufer', myBuyPrice: 'Mein Kaufpreis (€)', netMargin: 'Geschätzter Nettogewinn', marginPct: '% Marge',
    estimatedVal: (b, v, p, s) => `Gekauft für ${b}€ → Marktwert ~${v}€ in ${s.toLowerCase()} (${p}%)`,
    confidenceSource: (n) => `${n} ähnliche Anzeige${n > 1 ? 'n' : ''} analysiert`,
    confidenceSourceNoListings: 'Keine ähnlichen Anzeigen gefunden',
    synthBoth: 'Basierend auf dem Neupreis und aktuellen Verkäufen ähnlicher Artikel',
    synthDecoteOnly: 'Basierend auf dem Neupreis (wenige Anzeigen gefunden)',
    synthMedianOnly: 'Basierend auf aktuellen Verkäufen ähnlicher Artikel',
    synthNoData: 'Ungefähre Schätzung (unzureichende Marktdaten)',
    showMore: 'Mehr anzeigen', showLess: 'Weniger anzeigen',
  },
  it: {
    loading: 'Calcolo in corso…', loadingSub: "L'IA analizza i prezzi di mercato in tempo reale.",
    failed: 'Calcolo impossibile', retry: 'Riprova', noRecognition: "Completa prima il passaggio 2 in modo che l'IA possa calcolare il prezzo.",
    header: 'Prezzo consigliato', headerSub: 'Basato su ricerche web in tempo reale.', recalculate: 'Ricalcola',
    highConf: 'Dati affidabili — fiducia alta', medConf: 'Dati parziali — fiducia media', lowConf: 'Dati insufficienti — fiducia bassa',
    suggestedPrice: 'Prezzo di vendita suggerito', marketAnalysis: 'Analisi di mercato',
    retailPrice: 'Prezzo nuovo', medianVinted: 'Mediana Vinted', range: 'Fascia', listings: 'Annunci',
    adjustPrice: 'Regola prezzo', suggested: 'suggerito',
    fewDays: 'Pochi giorni', oneTwo: '1–2 settimane', oneMonth: '1 mese+',
    tip: 'Consiglio Vinted: pubblica 15–20% sopra il tuo prezzo minimo.', tipBold: "Il 70% degli acquirenti negozia.",
    displayPrice: 'Prezzo pubblicato', realPrice: "Prezzo reale stimato dopo negoziazione con l'acquirente",
    minAccept: "Consigliamo di non accettare offerte inferiori a", delay: 'Tempo stimato',
    preciseTitle: "Specificare il prezzo d'acquisto", buyPriceLabel: "Prezzo d'acquisto originale (€)", boughtAt: 'Acquistato da',
    shopOfficial: 'Negozio ufficiale', shopOther: 'Altro',
    choose: '— Scegli —', rare: 'Articolo raro o edizione limitata?',
    rareOptions: ['No', 'Collaborazione', 'Edizione limitata', 'Vintage'], recalcBtn: 'Ricalcola con queste informazioni',
    reseller: 'Sono un rivenditore', myBuyPrice: "Il mio prezzo d'acquisto (€)", netMargin: 'Margine netto stimato', marginPct: '% margine',
    estimatedVal: (b, v, p, s) => `Acquistato a ${b}€ → valore di mercato ~${v}€ in ${s.toLowerCase()} (${p}%)`,
    confidenceSource: (n) => `${n} annuncio${n > 1 ? 'i' : ''} simil${n > 1 ? 'i' : 'e'} analizzat${n > 1 ? 'i' : 'o'}`,
    confidenceSourceNoListings: 'Nessun annuncio simile trovato',
    synthBoth: 'Stimato dal prezzo nuovo e dalle vendite recenti di articoli simili',
    synthDecoteOnly: 'Stimato dal prezzo nuovo (pochi annunci trovati)',
    synthMedianOnly: 'Stimato dalle vendite recenti di articoli simili',
    synthNoData: 'Stima approssimativa (dati di mercato insufficienti)',
    showMore: 'Mostra di più', showLess: 'Mostra meno',
  },
  nl: {
    loading: 'Berekening bezig…', loadingSub: 'AI analyseert marktprijzen in realtime.',
    failed: 'Berekening mislukt', retry: 'Opnieuw proberen', noRecognition: 'Voltooi eerst stap 2 zodat AI de prijs kan berekenen.',
    header: 'Aanbevolen prijs', headerSub: 'Gebaseerd op realtime webzoekopdrachten.', recalculate: 'Opnieuw berekenen',
    highConf: 'Betrouwbare data — hoge betrouwbaarheid', medConf: 'Gedeeltelijke data — gemiddelde betrouwbaarheid', lowConf: 'Onvoldoende data — lage betrouwbaarheid',
    suggestedPrice: 'Voorgestelde verkoopprijs', marketAnalysis: 'Marktanalyse',
    retailPrice: 'Nieuwprijs', medianVinted: 'Vinted mediaan', range: 'Prijsrange', listings: 'Advertenties',
    adjustPrice: 'Prijs aanpassen', suggested: 'voorgesteld',
    fewDays: 'Enkele dagen', oneTwo: '1–2 weken', oneMonth: '1 maand+',
    tip: 'Vinted tip: stel 15–20% boven je minimumprijs in.', tipBold: '70% van de kopers onderhandelt.',
    displayPrice: 'Vermelde prijs', realPrice: 'Geschatte werkelijke prijs na onderhandeling met koper',
    minAccept: 'We raden aan geen bod onder dit bedrag te accepteren:', delay: 'Geschatte tijd',
    preciseTitle: 'Aankoopprijs opgeven', buyPriceLabel: 'Originele aankoopprijs (€)', boughtAt: 'Gekocht bij',
    shopOfficial: 'Officiële winkel', shopOther: 'Andere',
    choose: '— Kies —', rare: 'Zeldzaam artikel of beperkte editie?',
    rareOptions: ['Nee', 'Samenwerking', 'Beperkte editie', 'Vintage'], recalcBtn: 'Opnieuw berekenen met deze info',
    reseller: 'Ik ben een doorverkoper', myBuyPrice: 'Mijn aankoopprijs (€)', netMargin: 'Geschatte nettomarge', marginPct: '% marge',
    estimatedVal: (b, v, p, s) => `Gekocht voor ${b}€ → marktwaarde ~${v}€ in ${s.toLowerCase()} staat (${p}%)`,
    confidenceSource: (n) => `${n} vergelijkbare advertentie${n > 1 ? 's' : ''} geanalyseerd`,
    confidenceSourceNoListings: 'Geen vergelijkbare advertenties gevonden',
    synthBoth: 'Geschat op basis van de nieuwprijs en recente verkopen van vergelijkbare artikelen',
    synthDecoteOnly: 'Geschat op basis van de nieuwprijs (weinig advertenties gevonden)',
    synthMedianOnly: 'Geschat op basis van recente verkopen van vergelijkbare artikelen',
    synthNoData: 'Globale schatting (onvoldoende marktgegevens)',
    showMore: 'Meer tonen', showLess: 'Minder tonen',
  },
  pl: {
    loading: 'Obliczanie…', loadingSub: 'AI analizuje ceny rynkowe w czasie rzeczywistym.',
    failed: 'Obliczenie nie powiodło się', retry: 'Spróbuj ponownie', noRecognition: 'Najpierw ukończ krok 2, aby AI mogło obliczyć cenę.',
    header: 'Zalecana cena', headerSub: 'Na podstawie wyszukiwań w sieci w czasie rzeczywistym.', recalculate: 'Przelicz',
    highConf: 'Wiarygodne dane — wysoka pewność', medConf: 'Częściowe dane — średnia pewność', lowConf: 'Niewystarczające dane — niska pewność',
    suggestedPrice: 'Sugerowana cena sprzedaży', marketAnalysis: 'Analiza rynku',
    retailPrice: 'Cena nowa', medianVinted: 'Mediana Vinted', range: 'Zakres', listings: 'Ogłoszenia',
    adjustPrice: 'Dostosuj cenę', suggested: 'sugerowana',
    fewDays: 'Kilka dni', oneTwo: '1–2 tygodnie', oneMonth: '1 miesiąc+',
    tip: 'Wskazówka Vinted: wystawiaj 15–20% powyżej ceny minimalnej.', tipBold: '70% kupujących negocjuje.',
    displayPrice: 'Wystawiona cena', realPrice: 'Szacowana rzeczywista cena po negocjacji z kupującym',
    minAccept: 'Zalecamy nie przyjmować ofert poniżej', delay: 'Szacowany czas',
    preciseTitle: 'Podaj cenę zakupu', buyPriceLabel: 'Oryginalna cena zakupu (€)', boughtAt: 'Kupione w',
    shopOfficial: 'Oficjalny sklep', shopOther: 'Inne',
    choose: '— Wybierz —', rare: 'Rzadki artykuł lub ograniczona edycja?',
    rareOptions: ['Nie', 'Współpraca', 'Limitowana edycja', 'Vintage'], recalcBtn: 'Przelicz z tymi informacjami',
    reseller: 'Jestem odsprzedawcą', myBuyPrice: 'Moja cena zakupu (€)', netMargin: 'Szacowana marża netto', marginPct: '% marży',
    estimatedVal: (b, v, p, s) => `Kupiono za ${b}€ → wartość rynkowa ~${v}€ w stanie ${s.toLowerCase()} (${p}%)`,
    confidenceSource: (n) => n === 1 ? '1 podobne ogłoszenie przeanalizowane' : `${n} podobnych ogłoszeń przeanalizowanych`,
    confidenceSourceNoListings: 'Nie znaleziono podobnych ogłoszeń',
    synthBoth: 'Oszacowano na podstawie ceny nowej i ostatnich sprzedaży podobnych artykułów',
    synthDecoteOnly: 'Oszacowano na podstawie ceny nowej (znaleziono mało ogłoszeń)',
    synthMedianOnly: 'Oszacowano na podstawie ostatnich sprzedaży podobnych artykułów',
    synthNoData: 'Przybliżone szacowanie (niewystarczające dane rynkowe)',
    showMore: 'Pokaż więcej', showLess: 'Pokaż mniej',
  },
}

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
  const { lang } = useLang()

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
          vintedPath:    recognition.vintedPath.value,
          taille:        recognition.taille.value,
          etat:          recognition.etat.value,
          couleurs:      recognition.couleurs.value,
          matieres:      recognition.matieres.value,
          style:         recognition.style.value,
          ...(recognition.brand_segment ? { brand_segment: recognition.brand_segment } : {}),
          locale: lang,
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
  }, [recognition, setResult, lang])

  useEffect(() => {
    if (!ranRef.current && !result && recognition) {
      ranRef.current = true
      run()
    }
  }, [run, result, recognition])

  return { loading, error, retry: run }
}

/* ─── Bannière de confiance ──────────────────────────────────────────────── */

function ConfidenceBanner({ confidence, labels }: { confidence: 'high' | 'medium' | 'low'; labels: { highConf: string; medConf: string; lowConf: string } }) {
  const map = {
    high:   { label: labels.highConf, bg: 'bg-green-50',  border: 'border-green-200',  text: 'text-green-700',  Icon: CheckCircle2  },
    medium: { label: labels.medConf,  bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', Icon: AlertTriangle },
    low:    { label: labels.lowConf,  bg: 'bg-red-50',    border: 'border-red-200',    text: 'text-red-700',    Icon: AlertCircle   },
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
        <span className="text-xs font-semibold text-gray-400">N/D</span>
      )}
    </div>
  )
}

/* ─── Composant principal ────────────────────────────────────────────────── */

export default function PricingStep({ recognition, result, setResult }: Props) {
  const { lang } = useLang()
  const t = UI[lang] ?? UI.fr
  const { loading, error, retry } = usePricing(recognition, result, setResult)

  /* ── État local du bloc interactif ── */
  const [prixAchat, setPrixAchat]       = useState('')
  const [plateforme, setPlateforme]     = useState('')
  const [rareteIdx, setRareteIdx]       = useState<number | null>(null)
  const [showMargin, setShowMargin]     = useState(false)
  const [showPrecisions, setShowPrecisions] = useState(false)
  const [sliderVal, setSliderVal]           = useState<number | null>(null)
  const [showFullRaisonnement, setShowFullRaisonnement] = useState(false)

  /* Initialise le slider sur le prixSuggere quand le résultat arrive */
  useEffect(() => {
    if (result && sliderVal === null) {
      setSliderVal(result.prixSuggere)
    }
  }, [result, sliderVal])

  /* ── Calcul délai estimé selon position slider ── */
  function getDelai(val: number, suggere: number): string {
    if (val < suggere * 0.85) return t.fewDays
    if (val <= suggere * 1.05) return t.oneTwo
    return t.oneMonth
  }

  /* ── Recalcul avec précisions ── */
  function handleRecalculate() {
    retry({
      prixAchatNeuf:  prixAchat ? parseFloat(prixAchat) : undefined,
      plateforme:     plateforme || undefined,
      rarete:         rareteIdx !== null ? UI.fr.rareOptions[rareteIdx] : undefined,
      skipWebSearch:  true,
      existingMarche: result?.marche,
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
          <p className="font-display font-extrabold text-xl text-gray-900">{t.loading}</p>
          <p className="text-sm text-gray-400 mt-1 max-w-xs">
            {t.loadingSub}
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
          <p className="font-display font-extrabold text-xl text-gray-900">{t.failed}</p>
          <p className="text-sm text-gray-400 mt-1 max-w-xs">{error}</p>
        </div>
        <button onClick={() => retry()}
          className="flex items-center gap-2 bg-indigo-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-indigo-700 transition-colors">
          <RefreshCw className="w-4 h-4" />
          {t.retry}
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
          {t.noRecognition}
        </p>
      </div>
    )
  }

  if (!result) return null

  const marche    = result.marche
  const etatLabel = recognition.etat.value
  const segment   = recognition.brand_segment ?? 'standard'
  const decoteRatio = DECOTE_TABLE[normalizeEtat(etatLabel)]?.[segment] ?? null

  const prixAchatNum = prixAchat ? parseFloat(prixAchat) : null

  /* Recalcul local immédiat quand l'utilisateur saisit son prix d'achat neuf — sans web search */
  const localComputed = (prixAchatNum !== null && prixAchatNum > 0)
    ? computePrice({ marche, etat: etatLabel, segment, prixAchatNeuf: prixAchatNum })
    : null
  const displayedPrixSuggere = (localComputed && localComputed.prixSuggere > 0)
    ? localComputed.prixSuggere
    : result.prixSuggere

  /* Bornes du slider : min = 20% prix suggéré, max = 200% */
  const sliderMin = Math.max(1, Math.round(displayedPrixSuggere * 0.2))
  const sliderMax = Math.round(displayedPrixSuggere * 2)
  const currentVal = sliderVal ?? displayedPrixSuggere

  /* Prix plancher recommandé : moyenne entre bas de fourchette marché et -25% du suggéré */
  const prixPlancher = marche.prixMinVinted !== null
    ? Math.round((marche.prixMinVinted + Math.round(displayedPrixSuggere * 0.75)) / 2)
    : Math.round(displayedPrixSuggere * 0.75)

  /* Ligne de synthèse — décrit les données utilisées pour le calcul */
  function getSynthLine(): string {
    const hasRetailPrice = marche.prixNeufMarque !== null || prixAchat !== ''
    const hasListings    = (marche.nbAnnonces ?? 0) > 0
    const hasMedian      = marche.prixMedianVinted !== null
    if (hasRetailPrice && hasMedian && hasListings) return t.synthBoth
    if (hasRetailPrice) return t.synthDecoteOnly
    if (hasMedian) return t.synthMedianOnly
    return t.synthNoData
  }

  /* Calcul marge revendeur */
  const marge = prixAchatNum !== null ? currentVal - prixAchatNum : null

  const valeurEstimee = prixAchatNum !== null && decoteRatio !== null
    ? Math.round(prixAchatNum * decoteRatio)
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
              {t.header}
            </h2>
          </div>
          <p className="text-sm text-gray-400 ml-10">
            {t.headerSub}
          </p>
        </div>
        <button
          onClick={() => retry()}
          className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-gray-600 transition-colors px-3 py-1.5 rounded-full hover:bg-gray-50 border border-gray-100 shrink-0"
        >
          <RefreshCw className="w-3 h-3" />
          {t.recalculate}
        </button>
      </div>

      <div className="space-y-5">

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* BLOC 1 — compact                                               */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <ConfidenceBanner confidence={result.confidence} labels={t} />

          {/* Source · synthèse — transparence en langage naturel */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2 text-[11px] text-gray-400">
            <span>{(marche.nbAnnonces ?? 0) > 0 ? t.confidenceSource(marche.nbAnnonces!) : t.confidenceSourceNoListings}</span>
            <span className="hidden sm:block text-gray-200" aria-hidden>·</span>
            <span>{getSynthLine()}</span>
          </div>

          <div className="flex flex-col sm:flex-row items-start gap-5">
            {/* Gauche : prix + raisonnement */}
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{t.suggestedPrice}</p>
              <div className="flex items-baseline gap-1.5 mb-3">
                <span className="font-display font-extrabold text-5xl text-gray-900 leading-none">{displayedPrixSuggere}</span>
                <span className="text-2xl font-bold text-gray-300">€</span>
              </div>
              <div className="flex items-start gap-2 p-3.5 bg-gray-50 rounded-xl">
                <TrendingUp className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className={`text-sm text-gray-600 leading-relaxed ${!showFullRaisonnement ? 'line-clamp-2' : ''}`}>
                    {result.raisonnement}
                  </p>
                  {result.raisonnement.length > 120 && (
                    <button
                      onClick={() => setShowFullRaisonnement(v => !v)}
                      className="text-[11px] font-semibold text-indigo-500 hover:text-indigo-700 mt-1 transition-colors"
                    >
                      {showFullRaisonnement ? t.showLess : t.showMore}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Droite : métriques marché compactes */}
            <div className="w-full sm:w-52 shrink-0 space-y-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t.marketAnalysis}</p>
              <div className="grid grid-cols-2 gap-2">
                <MiniMetric label={t.retailPrice} value={marche.prixNeufMarque !== null ? `${marche.prixNeufMarque}€` : null} />
                <MiniMetric label={t.medianVinted} value={marche.prixMedianVinted !== null ? `${marche.prixMedianVinted}€` : null} />
                <MiniMetric label={t.range} value={marche.prixMinVinted !== null && marche.prixMaxVinted !== null ? `${marche.prixMinVinted}–${marche.prixMaxVinted}€` : null} />
                <MiniMetric label={t.listings} value={marche.nbAnnonces !== null ? String(marche.nbAnnonces) : null} />
              </div>
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
              {t.adjustPrice}
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
              <span className="text-orange-500">{displayedPrixSuggere}€ {t.suggested}</span>
              <span className="text-red-500">{sliderMax}€</span>
            </div>

            {/* Zones de délai */}
            <div className="flex justify-between text-[9px] font-semibold -mt-0.5">
              <span className="text-green-500">{t.fewDays}</span>
              <span className="text-orange-400">{t.oneTwo}</span>
              <span className="text-red-400">{t.oneMonth}</span>
            </div>

            {/* Conseil statique */}
            <p className="text-xs text-gray-500 flex items-start gap-1.5 px-0.5">
              <span className="shrink-0">💡</span>
              <span>{t.tip} <strong className="text-gray-700">{t.tipBold}</strong></span>
            </p>

            {/* Résumé dynamique */}
            <div className="rounded-xl border border-gray-100 overflow-hidden text-xs">
              <div className="flex items-center justify-between px-3 py-2.5 bg-white">
                <span className="text-gray-500 font-medium">{t.displayPrice}</span>
                <span className="font-display font-extrabold text-gray-900">{currentVal}€</span>
              </div>
              <div className="flex items-center justify-between px-3 py-2.5 bg-gray-50 border-t border-gray-100">
                <span className="text-gray-500 font-medium">{t.realPrice}</span>
                <span className="font-semibold text-gray-600">~{Math.round(currentVal * 0.85)}€</span>
              </div>
              <div className="flex items-center justify-between px-3 py-2.5 bg-white border-t border-gray-100">
                <span className="text-gray-500 font-medium">{t.minAccept}</span>
                <span className="font-semibold text-orange-500 shrink-0 ml-2">~{prixPlancher}€</span>
              </div>
              <div className="flex items-center justify-between px-3 py-2.5 bg-gray-50 border-t border-gray-100">
                <span className="text-gray-500 font-medium">{t.delay}</span>
                <span className="font-bold text-indigo-600">{getDelai(currentVal, displayedPrixSuggere)}</span>
              </div>
            </div>
          </div>

          {/* ── Toggle accordion précisions ── */}
          <div className="border-t border-gray-50 pt-4">
            <button
              onClick={() => setShowPrecisions(!showPrecisions)}
              className="flex items-center justify-between w-full text-sm font-semibold text-gray-500 hover:text-gray-700"
            >
              <span>{t.preciseTitle}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showPrecisions ? 'rotate-180' : ''}`} />
            </button>
            {showPrecisions && (
              <div className="mt-4 space-y-4">

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Prix d'achat neuf */}
                  <div>
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1.5">
                      {t.buyPriceLabel}
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
                    {valeurEstimee !== null && prixAchatNum !== null && decoteRatio !== null && (
                      <div className="flex items-start gap-2 p-2.5 bg-amber-50 border border-amber-100 rounded-xl mt-2">
                        <Info className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <p className="text-[11px] text-amber-700 font-medium">
                          {t.estimatedVal(prixAchatNum!, valeurEstimee!, Math.round(decoteRatio! * 100), etatLabel)}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Plateforme */}
                  <div>
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1.5">
                      {t.boughtAt}
                    </label>
                    <select
                      value={plateforme}
                      onChange={e => setPlateforme(e.target.value)}
                      className={inputCls}
                    >
                      <option value="">{t.choose}</option>
                      <option value="Boutique officielle">{t.shopOfficial}</option>
                      <option value="Zalando">Zalando</option>
                      <option value="ASOS">ASOS</option>
                      <option value="Shein">Shein</option>
                      <option value="Vinted">Vinted</option>
                      <option value="Depop">Depop</option>
                      <option value="Vestiaire Collective">Vestiaire Collective</option>
                      <option value="Autre">{t.shopOther}</option>
                    </select>
                  </div>
                </div>

                {/* Rareté */}
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1.5">
                    {t.rare}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {t.rareOptions.map((r, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setRareteIdx(rareteIdx === idx ? null : idx)}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                          rareteIdx === idx
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
                  {t.recalcBtn}
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
              {t.reseller}
            </button>

            {showMargin && (
              <div className="mt-4 space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1.5">
                    {t.myBuyPrice}
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
                    <span className="text-sm font-semibold text-gray-700">{t.netMargin}</span>
                    <div className="text-right">
                      <span className={`font-display font-extrabold text-xl ${marge >= 0 ? 'text-green-700' : 'text-red-600'}`}>
                        {marge >= 0 ? '+' : ''}{marge.toFixed(2)}€
                      </span>
                      {prixAchatNum && prixAchatNum > 0 && (
                        <p className="text-[10px] text-gray-400">
                          {Math.round((marge / prixAchatNum) * 100)}{t.marginPct}
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
