import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import type { PriceResult } from '@/app/app/types'
import { computePrice, getBrandSegment, type BrandSegment } from '@/lib/pricing'

const client = new Anthropic()

/* ─── Helpers — calcul déterministe de la médiane ───────────────────────── */

/** Filtre les valeurs aberrantes par méthode IQR (Tukey). Si < 4 prix : pas de filtrage. */
function filterIQR(prices: number[]): number[] {
  if (prices.length < 4) return prices
  const s = [...prices].sort((a, b) => a - b)
  const q1  = s[Math.floor(s.length * 0.25)]
  const q3  = s[Math.floor(s.length * 0.75)]
  const iqr = q3 - q1
  const lo  = q1 - 1.5 * iqr
  const hi  = q3 + 1.5 * iqr
  return s.filter(p => p >= lo && p <= hi)
}

/** Médiane déterministe sur une liste triée ou non. Retourne null si vide. */
function computeMedian(prices: number[]): number | null {
  if (prices.length === 0) return null
  const s   = [...prices].sort((a, b) => a - b)
  const mid = Math.floor(s.length / 2)
  return s.length % 2 === 1
    ? s[mid]
    : Math.round((s[mid - 1] + s[mid]) / 2)
}

const LANG_NAMES: Record<string, string> = {
  fr: 'français', en: 'anglais', es: 'espagnol',
  de: 'allemand', it: 'italien', nl: 'néerlandais', pl: 'polonais',
}

export interface PriceRequest {
  marque: string
  genre: string
  vintedPath: string
  taille: string
  etat: string
  couleurs: string[]
  matieres: string[]
  style: string
  prixAchatNeuf?: number
  rarete?: string
  brand_segment?: BrandSegment
  skipWebSearch?: boolean
  existingMarche?: PriceResult['marche']
  locale?: string
}

/* ─── Log détaillé du calcul ─────────────────────────────────────────────── */

function logPricing(
  body: PriceRequest,
  result: PriceResult,
  prixDecote: number | null,
  prixNeuf: number | null,
  mode: 'web_search' | 'recalcul_rapide',
) {
  const seg = result.brand_segment ?? 'standard'
  const fourchette = result.marche.prixMinVinted !== null && result.marche.prixMaxVinted !== null
    ? `${result.marche.prixMinVinted}–${result.marche.prixMaxVinted}€`
    : 'N/D'

  console.log(`
╔══════════════════════════════════════════════════════
║ [PRICING] mode: ${mode}
╠══════════════════════════════════════════════════════
║  Marque         : ${body.marque || 'Non précisée'}
║  Segment        : ${seg}
║  État           : ${body.etat}
╠──────────────────────────────────────────────────────
║  Prix neuf      : ${prixNeuf !== null ? `${prixNeuf}€` : 'N/D'}
║  Prix décote    : ${prixDecote !== null ? `${prixDecote}€` : 'N/D'}
╠──────────────────────────────────────────────────────
║  Médiane Vinted : ${result.marche.prixMedianVinted !== null ? `${result.marche.prixMedianVinted}€` : 'N/D'}
║  Fourchette     : ${fourchette}
║  Annonces       : ${result.marche.nbAnnonces !== null ? result.marche.nbAnnonces : 'N/D'}
╠──────────────────────────────────────────────────────
║  PRIX SUGGÉRÉ   : ${result.prixSuggere}€  (confiance: ${result.confidence})
╚══════════════════════════════════════════════════════`)
}

/* ─── Extraction des données marché via web search ───────────────────────── */

async function extractMarketData(body: PriceRequest): Promise<PriceResult['marche']> {
  const {
    marque, genre, vintedPath, taille, etat,
    couleurs, matieres, style,
    prixAchatNeuf, rarete,
  } = body

  const rareteActive = rarete && rarete !== 'Non'

  const prompt = `Tu es un expert en pricing sur le marché de la mode de seconde main. Pour l'article décrit, collecte les annonces comparables et renvoie les prix retenus.

Article :
- Marque : ${marque || 'Non précisée'}
- Genre : ${genre}
- Catégorie : ${vintedPath}
- Taille : ${taille || 'Non précisée'}
- État : ${etat}
- Couleurs : ${couleurs.join(', ') || 'Non précisées'}
- Matières : ${matieres.join(', ') || 'Non précisées'}
- Style : ${style || 'Non précisé'}
${prixAchatNeuf ? `- Prix d'achat neuf déclaré : ${prixAchatNeuf}€` : ''}
${rareteActive ? `- Particularité : ${rarete}` : ''}

━━━ COLLECTE DES ANNONCES ━━━
Cherche des annonces d'articles comparables sur Vinted, Vestiaire Collective et Leboncoin.
${rareteActive ? `Cet article est de type « ${rarete} » — oriente ta recherche vers des annonces de même nature (ex: « ${marque} ${rarete!.toLowerCase()} »), pas des articles standards.` : ''}

CRITÈRES DE COMPARABILITÉ (toutes ces conditions) :
✓ Même marque exacte
✓ Même type d'article (même catégorie)
✓ État identique OU à ±1 cran (ex: pour "Bon état", accepter aussi "Très bon état" et "Satisfaisant")
✓ Taille identique OU ±1 taille
${rareteActive ? `✓ Même particularité (${rarete})` : ''}

ANNONCES À EXCLURE IMPÉRATIVEMENT :
✗ Lots ou packs multi-articles
✗ Prix dérisoire suggérant une contrefaçon (< 20% du prix attendu pour cette marque)
✗ Prix hors-marché (> 3× le prix le plus fréquent observé)
✗ Annonces avec défauts non comparables à l'article décrit

Ne liste dans prixAnnonces QUE les prix que tu as retenus après ce filtrage (masse centrale des prix observés).
nbAnnonces = nombre EXACT de prix dans ta liste prixAnnonces.
delaiVente = estimation du délai de vente en langage naturel selon le marché observé (ex: "1 à 2 semaines", "quelques jours", "1 mois ou plus"), ou null si impossible à estimer.

⚠️ FORMAT DE RÉPONSE — IMPÉRATIF :
- Utilise les outils web_search pour tes recherches.
- Ta réponse finale doit être UNIQUEMENT l'objet JSON ci-dessous : aucun texte avant, aucun texte après, aucune balise Markdown, pas de \`\`\`json, aucune explication.
- Le premier caractère de ta réponse doit être { et le dernier doit être }.

{
  "prixAnnonces": number[],
  "nbAnnonces": number,
  "delaiVente": string | null
}`

  const initialMessages: Anthropic.MessageParam[] = [{ role: 'user', content: prompt }]

  let lastResponse = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    temperature: 0,
    tools: [{ type: 'web_search_20250305' as 'web_search_20250305', name: 'web_search' }],
    messages: initialMessages,
  })

  const messages: Anthropic.MessageParam[] = [...initialMessages]
  let iterations = 0

  while (lastResponse.stop_reason === 'tool_use' && iterations < 4) {
    iterations++
    messages.push({ role: 'assistant', content: lastResponse.content })

    const toolResults: Anthropic.ToolResultBlockParam[] = lastResponse.content
      .filter((b): b is Anthropic.ToolUseBlock => b.type === 'tool_use')
      .map((b) => ({
        type: 'tool_result' as const,
        tool_use_id: b.id,
        content: '',
      }))

    if (toolResults.length === 0) break

    messages.push({ role: 'user', content: toolResults })

    lastResponse = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      temperature: 0,
      tools: [{ type: 'web_search_20250305' as 'web_search_20250305', name: 'web_search' }],
      messages,
    })
  }

  const text = lastResponse.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('')

  const start = text.indexOf('{')
  const end   = text.lastIndexOf('}')
  if (start === -1 || end === -1 || end <= start) {
    console.error('[price] Réponse brute Claude (pas de JSON):', JSON.stringify(text))
    throw new Error('Réponse IA invalide (extraction marché)')
  }

  let raw: { prixAnnonces: number[]; nbAnnonces: number; delaiVente: string | null }
  try {
    raw = JSON.parse(text.slice(start, end + 1))
  } catch (parseErr) {
    console.error('[price] Réponse brute Claude (JSON invalide):', JSON.stringify(text))
    throw new Error('Réponse IA invalide (extraction marché)')
  }

  const rawPrices = Array.isArray(raw.prixAnnonces) ? raw.prixAnnonces.filter(p => typeof p === 'number' && p > 0) : []
  const filtered  = filterIQR(rawPrices)
  const median    = computeMedian(filtered)

  return {
    prixMedianVinted: median,
    prixMinVinted:    filtered.length > 0 ? Math.min(...filtered) : null,
    prixMaxVinted:    filtered.length > 0 ? Math.max(...filtered) : null,
    nbAnnonces:       filtered.length > 0 ? filtered.length : null,
    delaiVente:       raw.delaiVente ?? null,
  }
}

/* ─── Génération du raisonnement — Claude Haiku, temperature 0 ───────────── */

async function generateRaisonnement(params: {
  body:         PriceRequest
  marche:       PriceResult['marche']
  segment:      BrandSegment
  prixSuggere:  number
  confidence:   'high' | 'medium' | 'low'
  prixNeuf:     number | null   /* null si aucune référence neuve disponible */
  locale?:      string
}): Promise<string> {
  const { body, marche, segment, prixSuggere, prixNeuf, locale } = params
  const nativeLang = LANG_NAMES[locale ?? 'fr'] ?? 'français'

  /* Libellé segment lisible — en langue native */
  const SEG_LABELS: Record<BrandSegment, Record<string, string>> = {
    ultra_luxe:          { fr: 'une maison de haute joaillerie ou de grand luxe absolu', en: 'an ultra-luxury house', es: 'una maison de lujo absoluto', de: 'ein Ultra-Luxushaus', it: 'una maison di altissimo lusso', nl: 'een ultra-luxemerk', pl: 'dom ultraluksusowy' },
    luxe_iconique:       { fr: 'une grande maison de luxe', en: 'a luxury fashion house', es: 'una gran firma de lujo', de: 'ein Luxushaus', it: 'una grande maison di lusso', nl: 'een iconisch luxemerk', pl: 'dom mody luksusowej' },
    luxe_etabli:         { fr: 'une marque de luxe établie', en: 'an established luxury brand', es: 'una marca de lujo consolidada', de: 'eine etablierte Luxusmarke', it: 'un marchio di lusso affermato', nl: 'een gevestigd luxemerk', pl: 'uznana marka luksusowa' },
    luxe_contemporain:   { fr: 'une marque de luxe contemporain', en: 'a contemporary luxury brand', es: 'una marca de lujo contemporáneo', de: 'eine zeitgenössische Luxusmarke', it: 'un marchio di lusso contemporaneo', nl: 'een eigentijds luxemerk', pl: 'współczesna marka luksusowa' },
    premium_createur:    { fr: 'une marque créateur premium', en: 'a premium designer brand', es: 'una marca de diseñador premium', de: 'eine Premium-Designermarke', it: 'un marchio designer premium', nl: 'een premium designermerk', pl: 'marka premium od projektanta' },
    premium_accessible:  { fr: 'une marque premium accessible', en: 'an accessible premium brand', es: 'una marca premium accesible', de: 'eine zugängliche Premiummarke', it: 'un marchio premium accessibile', nl: 'een toegankelijk premiummerk', pl: 'dostępna marka premium' },
    standard:            { fr: 'une marque grand public', en: 'a mainstream brand', es: 'una marca accesible', de: 'eine zugängliche Marke', it: 'un marchio accessibile', nl: 'een toegankelijk merk', pl: 'marka masowa' },
    fast_fashion:        { fr: 'une marque fast fashion', en: 'a fast fashion brand', es: 'una marca de fast fashion', de: 'eine Fast-Fashion-Marke', it: 'un marchio fast fashion', nl: 'een fast fashionmerk', pl: 'marka fast fashion' },
  }
  const segLabel = SEG_LABELS[segment]?.[locale ?? 'fr'] ?? SEG_LABELS.standard.fr

  /* ── Source du prix neuf ── */
  const hasUserPrice  = !!body.prixAchatNeuf
  const hasRefPrice   = prixNeuf !== null && !hasUserPrice
  const nbAnnonces    = marche.nbAnnonces ?? 0
  const hasListings   = nbAnnonces > 0

  /* Description de la source "neuf" — doit transparaître dans la rédaction */
  let sourceNeuf: string
  if (hasUserPrice) {
    sourceNeuf = `votre prix d'achat : ${body.prixAchatNeuf}€ (fourni par le vendeur)`
  } else if (hasRefPrice) {
    sourceNeuf = `valeur estimée à neuf : ~${prixNeuf}€ (estimation de référence pour cette marque et catégorie)`
  } else {
    sourceNeuf = 'non disponible'
  }

  /* Description des données Vinted */
  const sourceVinted = hasListings
    ? `${nbAnnonces} annonce${nbAnnonces > 1 ? 's' : ''} Vinted comparable${nbAnnonces > 1 ? 's' : ''}, médiane à ${marche.prixMedianVinted}€ (fourchette ${marche.prixMinVinted ?? '?'}–${marche.prixMaxVinted ?? '?'}€)`
    : 'aucune annonce comparable trouvée sur Vinted'

  const prompt = `Tu rédiges le commentaire prix d'une application de revente. Deux à trois phrases simples et rassurantes pour le vendeur, qui expliquent naturellement comment ce prix a été calculé.

Article :
- Marque : ${body.marque || 'Non précisée'} (${segLabel})
- État : ${body.etat}
- Prix recommandé : ${prixSuggere}€
${body.rarete && body.rarete !== 'Non' ? `- Particularité : ${body.rarete}` : ''}

Sources utilisées pour ce prix :
- Valeur à neuf : ${sourceNeuf}
- Marché Vinted : ${sourceVinted}
${marche.delaiVente ? `- Délai de vente estimé : ${marche.delaiVente}` : ''}

Consignes de rédaction :
- Mentionne naturellement les sources réellement disponibles (annonces Vinted et/ou valeur à neuf)
- Si la valeur à neuf vient d'une estimation de référence → utilise "valeur estimée à neuf" (jamais "décote", "pondération", "coefficient")
- Si le prix neuf vient du vendeur → dis "votre prix d'achat" (pas "estimation")
- Si aucune annonce n'a été trouvée → dis-le honnêtement, ex: "aucune annonce comparable n'a pu être trouvée, ce prix est basé sur la valeur à neuf"
- Si un délai de vente est disponible, intègre-le naturellement en dernière phrase
- Ton simple, chaleureux, rassurant — jamais condescendant
INTERDIT absolument : formules, pourcentages, décote, pondération, coefficients, noms techniques de segment, le mot "algorithme"
LANGUE : ${nativeLang}

Réponds avec UNIQUEMENT le texte (2–3 phrases, sans guillemets englobants, sans markdown).`

  try {
    const resp = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 300,
      temperature: 0,
      messages: [{ role: 'user', content: prompt }],
    })
    const text = resp.content[0].type === 'text' ? resp.content[0].text.trim() : ''
    return text || `Prix estimé à ${prixSuggere}€.`
  } catch {
    return `Prix estimé à ${prixSuggere}€.`
  }
}

/* ─── POST /api/price ─────────────────────────────────────────────────────── */

export async function POST(req: NextRequest) {
  try {
    const body: PriceRequest = await req.json()

    const {
      skipWebSearch,
      existingMarche,
      brand_segment: inputBrandSegment,
      locale,
    } = body

    const segmentFromTable = getBrandSegment(body.marque)
    const segment = segmentFromTable ?? inputBrandSegment ?? 'standard'
    /* Vrai si ni la table ni Claude n'ont classé fiablement la marque */
    const brandIsUnknown = !segmentFromTable && (!inputBrandSegment || inputBrandSegment === 'standard')

    /* 1. Données marché — web search ou existantes */
    let marche: PriceResult['marche']
    if (skipWebSearch && existingMarche) {
      marche = existingMarche
    } else {
      marche = await extractMarketData(body)
    }

    /* 2. Calcul déterministe du prix */
    const computed = computePrice({
      marche,
      etat:           body.etat,
      segment,
      refCat:         body.vintedPath,
      matieres:       body.matieres,
      prixAchatNeuf:  body.prixAchatNeuf,
      brandIsUnknown,
    })

    /* noData = 0 — ne pas forcer à 1 */
    let prixSuggere = computed.prixSuggere
    if (prixSuggere <= 0 && !computed.noData) prixSuggere = 1

    /* 3. Raisonnement textuel (Haiku, temperature=0) — ignoré si noData */
    const raisonnement = computed.noData
      ? ''
      : await generateRaisonnement({
          body, marche, segment, prixSuggere,
          confidence: computed.confidence,
          prixNeuf: computed.prixNeuf,
          locale,
        })

    const result: PriceResult = {
      prixSuggere,
      confidence:    computed.confidence,
      raisonnement,
      prixNeuf:      computed.prixNeuf ?? null,
      brand_segment: segment,
      marche,
      ...(computed.noData ? { noData: true } : {}),
    }

    logPricing(body, result, computed.prixDecote, computed.prixNeuf, skipWebSearch ? 'recalcul_rapide' : 'web_search')
    return NextResponse.json(result)

  } catch (err) {
    console.error('[price] Erreur:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
