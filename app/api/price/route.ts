import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import type { PriceResult } from '@/app/app/types'

const client = new Anthropic()

const LANG_NAMES: Record<string, string> = {
  fr: 'français', en: 'anglais', es: 'espagnol',
  de: 'allemand', it: 'italien', nl: 'néerlandais', pl: 'polonais',
}

export interface PriceRequest {
  marque: string
  genre: string
  categorie: string
  sousCategorie: string
  taille: string
  etat: string
  couleurs: string[]
  matieres: string[]
  style: string
  prixAchatNeuf?: number
  plateforme?: string
  rarete?: string
  brand_segment?: 'standard' | 'luxe_accessible' | 'luxe_premium'
  skipWebSearch?: boolean
  existingMarche?: PriceResult['marche']
  locale?: string
}

/* ─── Décotes par segment × état ─────────────────────────────────────────── */

const DECOTE_TABLE: Record<string, Record<string, number>> = {
  'Neuf avec étiquette': { standard: 0.55, luxe_accessible: 0.65, luxe_premium: 0.75 },
  'Neuf sans étiquette': { standard: 0.45, luxe_accessible: 0.55, luxe_premium: 0.65 },
  'Très bon état':       { standard: 0.35, luxe_accessible: 0.45, luxe_premium: 0.55 },
  'Bon état':            { standard: 0.25, luxe_accessible: 0.35, luxe_premium: 0.45 },
  'Satisfaisant':        { standard: 0.15, luxe_accessible: 0.20, luxe_premium: 0.30 },
}

/* ─── Log détaillé du calcul de prix ─────────────────────────────────────── */

function logPricing(
  body: PriceRequest,
  result: PriceResult,
  mode: 'web_search' | 'recalcul_rapide',
) {
  const seg = result.brand_segment ?? body.brand_segment ?? 'standard'
  const decoteRatio = DECOTE_TABLE[body.etat]?.[seg] ?? null

  let prixNeuf: number | null = null
  const sourceNeuf = body.prixAchatNeuf ? 'déclaré' : result.marche.prixNeufMarque ? 'web' : null
  if (body.prixAchatNeuf) {
    prixNeuf = body.prixAchatNeuf
  } else if (result.marche.prixNeufMarque) {
    const raw = result.marche.prixNeufMarque
    if (raw.includes('-')) {
      const [lo, hi] = raw.split('-').map(Number)
      prixNeuf = Math.round((lo + hi) / 2)
    } else {
      prixNeuf = parseFloat(raw)
    }
  }

  const prixDecote = (prixNeuf !== null && decoteRatio !== null)
    ? Math.round(prixNeuf * decoteRatio)
    : null

  const median = result.marche.prixMedianVinted
  let ponderation: string
  if (prixDecote !== null && median !== null) {
    const m = Math.abs(result.prixSuggere - median)
    const span = Math.abs(prixDecote - median)
    if (span < 2) {
      ponderation = 'décote ≈ médiane'
    } else {
      const t = 1 - m / span  // 0 = colle décote, 1 = colle médiane
      if (t < 0.15)      ponderation = 'décote seule (~100%)'
      else if (t < 0.4)  ponderation = '~30% médiane / 70% décote'
      else if (t < 0.6)  ponderation = '~50% médiane / 50% décote'
      else if (t < 0.85) ponderation = '~70% médiane / 30% décote'
      else               ponderation = 'médiane seule (~100%)'
    }
  } else if (prixDecote !== null) {
    ponderation = 'décote seule (pas de médiane)'
  } else if (median !== null) {
    ponderation = 'médiane seule (pas de prix neuf)'
  } else {
    ponderation = 'heuristique IA (aucune donnée chiffrée)'
  }

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
║  Prix neuf      : ${prixNeuf !== null ? `${prixNeuf}€` : 'N/D'}${sourceNeuf ? ` (${sourceNeuf})` : ''}
║  Décote (seg.)  : ${decoteRatio !== null ? `${Math.round(decoteRatio * 100)}%` : 'N/A'}
║  Prix décote    : ${prixDecote !== null ? `${prixDecote}€` : 'N/D'}
╠──────────────────────────────────────────────────────
║  Médiane Vinted : ${median !== null ? `${median}€` : 'N/D'}
║  Fourchette     : ${fourchette}
║  Annonces       : ${result.marche.nbAnnonces !== null ? result.marche.nbAnnonces : 'N/D'}
╠──────────────────────────────────────────────────────
║  Pondération    : ${ponderation}
║  PRIX SUGGÉRÉ   : ${result.prixSuggere}€  (confiance: ${result.confidence})
╚══════════════════════════════════════════════════════`)
}

/* ─── POST /api/price ────────────────────────────────────────────────────── */

export async function POST(req: NextRequest) {
  try {
    const body: PriceRequest = await req.json()

    const {
      marque, genre, categorie, sousCategorie, taille, etat,
      couleurs, matieres, style,
      prixAchatNeuf, plateforme, rarete,
      brand_segment: inputBrandSegment,
      skipWebSearch, existingMarche,
      locale,
    } = body

    const nativeLang = LANG_NAMES[locale ?? 'fr'] ?? 'français'

    const brandLabel = (seg?: string) => {
      if (seg === 'luxe_premium')    return 'marque haut de gamme'
      if (seg === 'luxe_accessible') return 'marque premium accessible'
      return null
    }

    /* ── Recalcul rapide sans web search ── */
    if (skipWebSearch && existingMarche) {
      const seg = inputBrandSegment ?? 'standard'

      const recalcPrompt = `Tu es un expert en pricing sur Vinted. Recalcule uniquement le prix suggéré selon les nouvelles précisions fournies. Pas de recherche web.

Article :
- Marque : ${marque || 'Non précisée'}
- Catégorie : ${categorie} > ${sousCategorie}
- État : ${etat}
- Segment marque : ${seg}
${prixAchatNeuf ? `- Prix d'achat neuf déclaré : ${prixAchatNeuf}€` : ''}
${plateforme ? `- Acheté chez : ${plateforme}` : ''}
${rarete ? `- Rareté : ${rarete}` : ''}

Données marché déjà récupérées :
- Prix neuf marque : ${existingMarche.prixNeufMarque !== null ? `${existingMarche.prixNeufMarque}€` : 'N/D'}
- Médiane Vinted : ${existingMarche.prixMedianVinted !== null ? `${existingMarche.prixMedianVinted}€` : 'N/D'}
- Fourchette Vinted : ${existingMarche.prixMinVinted !== null ? `${existingMarche.prixMinVinted}–${existingMarche.prixMaxVinted}€` : 'N/D'}
- Nombre d'annonces : ${existingMarche.nbAnnonces !== null ? existingMarche.nbAnnonces : 'N/D'}

LOGIQUE DE CALCUL :
ÉTAPE 1 — Prix de référence par décote :
${prixAchatNeuf
  ? `Prix d'achat déclaré = ${prixAchatNeuf}€`
  : existingMarche.prixNeufMarque
  ? `Prix neuf = ${existingMarche.prixNeufMarque}€`
  : 'Prix neuf non disponible'}
Applique le ratio selon l'état ET le segment "${seg}" :

| État                  | standard | luxe_accessible | luxe_premium |
|-----------------------|----------|-----------------|--------------|
| Neuf avec étiquette   | 55%      | 65%             | 75%          |
| Neuf sans étiquette   | 45%      | 55%             | 65%          |
| Très bon état         | 35%      | 45%             | 55%          |
| Bon état              | 25%      | 35%             | 45%          |
| Satisfaisant          | 15%      | 20%             | 30%          |

ÉTAPE 2 — Pondération avec les données marché :
${existingMarche.prixMedianVinted !== null
  ? `Médiane = ${existingMarche.prixMedianVinted}€, annonces = ${existingMarche.nbAnnonces ?? 'N/D'}
${(prixAchatNeuf || existingMarche.prixNeufMarque)
    ? (existingMarche.nbAnnonces ?? 0) >= 5
      ? `→ Prix neuf disponible + ≥5 annonces : prixSuggere = round(0.60 × ${existingMarche.prixMedianVinted} + 0.40 × prix_décote)`
      : (existingMarche.nbAnnonces ?? 0) >= 1
      ? `→ Prix neuf disponible + 1-4 annonces : prixSuggere = round(0.40 × ${existingMarche.prixMedianVinted} + 0.60 × prix_décote)`
      : `→ Prix neuf disponible + 0 annonces : prixSuggere = prix_décote`
    : `→ Prix neuf non disponible, médiane disponible : prixSuggere = round(0.90 × ${existingMarche.prixMedianVinted})`}`
  : (prixAchatNeuf || existingMarche.prixNeufMarque)
    ? '→ Pas de médiane : prixSuggere = prix_décote'
    : '→ Aucune donnée disponible : estimation IA basée sur catégorie + marque + état, confidence = "low"'}

${plateforme ? `AJUSTEMENT PLATEFORME (${plateforme}) :
- Boutique officielle, Zalando, ASOS → qualité souvent supérieure, +5–10% possible
- Outlet, soldes, Shein → décote supplémentaire −10–15%
- Vinted, Depop, Vestiaire Collective → déjà d'occasion → décote −10–15%` : ''}

${rarete && rarete !== 'Non' ? `ARTICLE RARE (${rarete}) :
- Collaboration / Édition limitée → ratios de décote inapplicables, peut dépasser le prix neuf si forte demande
- Vintage → peut s'apprécier, utiliser la valeur actuelle de marché` : ''}

RAISONNEMENT :
Rédige 2-3 phrases simples et rassurantes. Mentionne :
- Le positionnement de la marque en termes humains${inputBrandSegment ? ` (positionnement connu : "${brandLabel(inputBrandSegment) ?? inputBrandSegment}")` : ' (ex: "marque premium", "marque accessible", "marque haut de gamme")'}
- La fourchette du marché secondaire si disponible
- L'état de l'article comme facteur
INTERDIT : formules mathématiques, pourcentages, codes internes (standard/luxe_accessible/luxe_premium)

LANGUE : Rédige le champ "raisonnement" en ${nativeLang}.

Réponds UNIQUEMENT avec ce JSON (sans markdown) :
{
  "prixSuggere": number,
  "confidence": "high|medium|low",
  "raisonnement": "string — 2-3 phrases, ton simple et rassurant"
}`

      const fastResp = await client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 512,
        messages: [{ role: 'user', content: recalcPrompt }],
      })

      const fastText = fastResp.content[0].type === 'text' ? fastResp.content[0].text : ''
      const fastMatch = fastText.match(/\{[\s\S]*\}/)
      if (!fastMatch) return NextResponse.json({ error: 'Réponse IA invalide' }, { status: 500 })

      const partial = JSON.parse(fastMatch[0])
      const result: PriceResult = {
        prixSuggere: partial.prixSuggere > 0 ? partial.prixSuggere : 1,
        confidence: partial.confidence,
        raisonnement: partial.raisonnement,
        brand_segment: inputBrandSegment,
        marche: existingMarche,
      }

      /* Bornes de sécurité : ±20%/+30% autour de la décote */
      {
        const decoteRatio = DECOTE_TABLE[body.etat]?.[seg] ?? null
        let prixNeuf: number | null = prixAchatNeuf ?? null
        if (!prixNeuf && existingMarche.prixNeufMarque) {
          const raw = existingMarche.prixNeufMarque
          if (raw.includes('-')) {
            const [lo, hi] = raw.split('-').map(Number)
            prixNeuf = Math.round((lo + hi) / 2)
          } else {
            prixNeuf = parseFloat(raw)
          }
        }
        if (prixNeuf && decoteRatio) {
          const prixDecote = Math.round(prixNeuf * decoteRatio)
          result.prixSuggere = Math.max(
            Math.round(prixDecote * 0.80),
            Math.min(Math.round(prixDecote * 1.30), result.prixSuggere),
          )
        }
      }

      logPricing(body, result, 'recalcul_rapide')
      return NextResponse.json(result)
    }

    /* ── Appel complet avec web search ── */
    const prompt = `Tu es un expert en pricing sur Vinted. Pour l'article décrit ci-dessous, tu dois :
1. Rechercher le prix neuf actuel sur le site officiel de la marque (et sur des sites revendeurs si la marque n'a pas de boutique en ligne)
2. Rechercher les prix actuels sur Vinted, Vestiaire Collective et Leboncoin pour cet article

Article :
- Marque : ${marque || 'Non précisée'}
- Genre : ${genre}
- Catégorie : ${categorie} > ${sousCategorie}
- Taille : ${taille || 'Non précisée'}
- État : ${etat}
- Couleurs : ${couleurs.join(', ') || 'Non précisées'}
- Matières : ${matieres.join(', ') || 'Non précisées'}
- Style : ${style || 'Non précisé'}
${prixAchatNeuf ? `- Prix d'achat neuf déclaré : ${prixAchatNeuf}€` : ''}
${plateforme ? `- Acheté chez : ${plateforme}` : ''}
${rarete ? `- Rareté : ${rarete}` : ''}

SEGMENT DE MARQUE (champ interne, ne pas mentionner dans le raisonnement) :
Utilise ta connaissance du positionnement de la marque pour déterminer le segment. En cas de doute, choisir "standard".
Marque inconnue ou non identifiable → "standard" par défaut, sans exception.
- "standard" : marques grand public et fast fashion. Exemples : Zara, H&M, Mango, Uniqlo, Primark, C&A, Kiabi, Pull&Bear, Bershka, Stradivarius, New Look, Next, Camaïeu, Jules…
- "luxe_accessible" : marques premium et luxe accessible. Exemples : Kenzo, Sandro, Maje, The Kooples, A.P.C., Isabel Marant, Ralph Lauren, Tommy Hilfiger, Hugo Boss, Claudie Pierlot, Ba&sh, Zadig & Voltaire, Diesel, Calvin Klein, Lacoste, Fred Perry, Carhartt, Stone Island, Acne Studios…
- "luxe_premium" : grandes maisons de luxe. Exemples : Gucci, Saint Laurent, Balenciaga, Prada, Dior, Hermès, Chanel, Louis Vuitton, Valentino, Givenchy, Bottega Veneta, Celine, Fendi, Burberry, Versace, Dolce & Gabbana, Moncler, Off-White…
Ces listes sont des exemples, pas exhaustives. Utilise ta connaissance du positionnement de la marque pour déterminer le segment.

LOGIQUE DE CALCUL du prix suggéré :
ÉTAPE 1 — Calcule le prix de référence par décote :
${prixAchatNeuf
  ? `Prix d'achat fourni = ${prixAchatNeuf}€`
  : 'Estime le prix neuf via web search'}
Applique le ratio selon l'état ET le segment de la marque classifiée :

| État                  | standard | luxe_accessible | luxe_premium |
|-----------------------|----------|-----------------|--------------|
| Neuf avec étiquette   | 55%      | 65%             | 75%          |
| Neuf sans étiquette   | 45%      | 55%             | 65%          |
| Très bon état         | 35%      | 45%             | 55%          |
| Bon état              | 25%      | 35%             | 45%          |
| Satisfaisant          | 15%      | 20%             | 30%          |

ÉTAPE 2 — Recherche les prix du marché secondaire (Vinted, Vestiaire Collective, Leboncoin) :
- Collecte au moins 5 annonces pour calculer une médiane fiable
- Exclure les prix extrêmes (outliers isolés très au-dessus ou en dessous des autres)
- La médiane est calculée sur les prix réellement vendus, pas les prix affichés
- Si seulement 1 ou 2 annonces trouvées → confidence "medium" obligatoire

ÉTAPE 3 — Pondération finale :
Si prix neuf disponible (déclaré ou trouvé) ET médiane Vinted disponible ET ≥5 annonces :
  prixSuggere = round(0.60 × médiane + 0.40 × prix_décote)
Si prix neuf disponible ET médiane Vinted disponible ET 1-4 annonces :
  prixSuggere = round(0.40 × médiane + 0.60 × prix_décote)
Si prix neuf disponible ET aucune annonce trouvée :
  prixSuggere = prix_décote
Si prix neuf non disponible ET médiane Vinted disponible (quelle que soit la quantité d'annonces) :
  prixSuggere = round(0.90 × médiane)
Si aucune donnée disponible (ni prix neuf, ni médiane Vinted) :
  prixSuggere = estimation IA basée sur catégorie + marque + état, confidence = "low"

${plateforme ? `AJUSTEMENT PLATEFORME (${plateforme}) :
- Boutique officielle, Zalando, ASOS → qualité souvent supérieure, +5–10% possible
- Outlet, soldes, Shein → décote supplémentaire −10–15% sur le calcul
- Vinted, Depop, Vestiaire Collective → déjà d'occasion → décote supplémentaire −10–15%
` : ''}
${rarete && rarete !== 'Non' ? `ARTICLE RARE / ÉDITION LIMITÉE (${rarete}) :
- Collaboration / Édition limitée → ratios de décote inapplicables, peut dépasser le prix neuf si forte demande
- Vintage → peut s'apprécier avec le temps, utiliser la valeur actuelle de marché
` : ''}
EXTRACTION DES DONNÉES — RÈGLE CRITIQUE :
Chaque chiffre trouvé dans ta recherche web DOIT être mis dans les champs JSON structurés.
Ne stocke PAS les données seulement dans le raisonnement — le raisonnement est une synthèse, pas le conteneur des données.
- Tu trouves "prix neuf entre 250€ et 350€" → prixNeufMarque = "250-350" (jamais null)
- Tu trouves "articles similaires vendus entre 80€ et 120€" → prixMinVinted=80, prixMaxVinted=120, prixMedianVinted=100
- Tu trouves "environ 40 annonces" → nbAnnonces=40
- null UNIQUEMENT si la donnée est introuvable même approximativement

RÈGLES STRICTES :
- prixNeufMarque : string — chiffres seuls sans "€", ex: "300" (prix unique) ou "250-350" (fourchette)
- Ne jamais inventer : si vraiment introuvable → null
- delaiVente : estimé selon le niveau de prix (ex: "quelques jours", "1–2 semaines", "1 mois+")

CONFIANCE :
- "high" : marque connue ET données de marché trouvées avec ≥3 annonces
- "medium" : marque semi-connue, ou données partielles (1-2 annonces), ou prix neuf non trouvé
- "low" : marque inconnue ou aucune annonce trouvée

RAISONNEMENT :
Rédige 2-3 phrases simples et rassurantes. Mentionne :
- Le positionnement de la marque en termes humains (ex: "marque premium", "marque accessible", "marque haut de gamme") — JAMAIS les codes internes (standard/luxe_accessible/luxe_premium)
- La fourchette du marché secondaire si trouvée
- L'état de l'article comme facteur explicatif
INTERDIT : formules mathématiques, pourcentages, références techniques

LANGUE : Rédige le champ "raisonnement" en ${nativeLang}.

Réponds UNIQUEMENT avec ce JSON (sans markdown, sans texte avant ou après) :
{
  "prixSuggere": number,
  "confidence": "high|medium|low",
  "brand_segment": "standard|luxe_accessible|luxe_premium",
  "raisonnement": "string — 2-3 phrases, ton simple et rassurant",
  "marche": {
    "prixNeufMarque": "string or null — chiffres seuls, ex: '300' ou '250-350'",
    "sourcePrixNeuf": "string or null",
    "prixMedianVinted": number or null,
    "prixMinVinted": number or null,
    "prixMaxVinted": number or null,
    "nbAnnonces": number or null,
    "delaiVente": "string or null"
  }
}`

    const initialMessages: Anthropic.MessageParam[] = [{ role: 'user', content: prompt }]

    let lastResponse = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
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
        max_tokens: 2048,
        tools: [{ type: 'web_search_20250305' as 'web_search_20250305', name: 'web_search' }],
        messages,
      })
    }

    const text = lastResponse.content
      .filter((b): b is Anthropic.TextBlock => b.type === 'text')
      .map((b) => b.text)
      .join('')

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return NextResponse.json({ error: 'Réponse IA invalide' }, { status: 500 })

    const result: PriceResult = JSON.parse(jsonMatch[0])

    if (!result.prixSuggere || result.prixSuggere <= 0) {
      result.prixSuggere = 1
    }

    /* Bornes de sécurité : ±20%/+30% autour de la décote */
    {
      const seg = result.brand_segment ?? body.brand_segment ?? 'standard'
      const decoteRatio = DECOTE_TABLE[body.etat]?.[seg] ?? null
      let prixNeuf: number | null = body.prixAchatNeuf ?? null
      if (!prixNeuf && result.marche?.prixNeufMarque) {
        const raw = result.marche.prixNeufMarque
        if (raw.includes('-')) {
          const [lo, hi] = raw.split('-').map(Number)
          prixNeuf = Math.round((lo + hi) / 2)
        } else {
          prixNeuf = parseFloat(raw)
        }
      }
      if (prixNeuf && decoteRatio) {
        const prixDecote = Math.round(prixNeuf * decoteRatio)
        result.prixSuggere = Math.max(
          Math.round(prixDecote * 0.80),
          Math.min(Math.round(prixDecote * 1.30), result.prixSuggere),
        )
      }
    }

    logPricing(body, result, 'web_search')
    return NextResponse.json(result)
  } catch (err) {
    console.error('[price] Erreur:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
