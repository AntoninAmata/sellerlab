import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import type { PriceResult } from '@/app/app/types'
import { computePrice } from '@/lib/pricing'

const client = new Anthropic()

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
  plateforme?: string
  rarete?: string
  brand_segment?: 'standard' | 'luxe_accessible' | 'luxe_premium'
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
    prixAchatNeuf,
  } = body

  const prompt = `Tu es un expert en pricing sur Vinted. Pour l'article décrit, suis exactement ces 3 étapes dans l'ordre.

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

━━━ ÉTAPE 1 — PRIX NEUF ━━━
${prixAchatNeuf
  ? `→ PASSER : prix neuf déjà fourni par l'utilisateur (${prixAchatNeuf}€). Retourne prixNeufMarque: null.`
  : `Cherche le prix neuf plein tarif EN EUROS (€) de la marque ${marque || 'indiquée'} pour le type d'article "${vintedPath}".

MÉTHODE DE RECHERCHE :
→ Effectue une recherche de type : site:[domaine officiel de la marque] [type d'article]
  (ex : site:givenchy.com blouson, site:sandro-paris.com veste, site:zara.com pantalon)
→ Utilise le domaine officiel français ou européen (.com/fr, .fr, ou équivalent EUR de la marque).
→ Récupère les prix directement depuis les extraits de résultats (snippets) et métadonnées — le prix y figure souvent même si la page le charge dynamiquement.

FILTRE : même type d'article précis que "${vintedPath}" (blouson ≠ veste ≠ manteau ≠ chemise — respecter la catégorie).

PRIX À RETENIR :
✓ Prix en euros (€) uniquement — plein tarif, sans réduction
✗ Exclure : soldes, promotions, prix barrés, codes promo, prix outlet
✗ Prix USD : NE PAS convertir. Si seuls des prix USD sont trouvés, chercher davantage le prix EUR ; si introuvable → null

MÉTHODE DE CALCUL :
1. LISTE les prix EUR plein tarif trouvés dans l'ordre croissant, ex: [890, 950, 1050, 1150, 1300]
2. Si 4 articles ou plus : retirer le moins cher ET le plus cher, puis calculer la médiane du reste
   Si 1 à 3 articles : garder tous les prix et calculer la médiane directement
3. Retourner la médiane calculée comme chiffre entier (pas une fourchette)
4. Indiquer l'URL de la source dans sourcePrixNeuf
→ null si aucun prix EUR fiable trouvé (le calcul utilisera la médiane Vinted seule)`}

━━━ ÉTAPE 2 — COLLECTE DES ANNONCES VINTED ━━━
Cherche des annonces d'articles comparables sur Vinted.

CRITÈRES DE COMPARABILITÉ (toutes ces conditions) :
✓ Même marque exacte
✓ Même type d'article (même catégorie)
✓ État identique OU à ±1 cran (ex: pour "Bon état", accepter aussi "Très bon état" et "Satisfaisant")
✓ Taille identique OU ±1 taille

ANNONCES À EXCLURE IMPÉRATIVEMENT :
✗ Lots ou packs multi-articles
✗ Prix dérisoire suggérant une contrefaçon (< 20% du prix attendu pour cette marque)
✗ Prix hors-marché (> 3× le prix le plus fréquent observé)
✗ Annonces avec défauts non comparables à l'article décrit

━━━ ÉTAPE 3 — CALCUL DE LA MÉDIANE ━━━
Après avoir collecté les annonces comparables :

1. LISTE les prix retenus dans l'ordre croissant, ex: [28, 32, 38, 45, 52]
2. CALCULE la médiane :
   - 0 prix → prixMedianVinted: null
   - 1 prix → prixMedianVinted = ce prix
   - Nombre impair → valeur centrale
   - Nombre pair → moyenne des 2 valeurs centrales, arrondi à l'entier
3. prixMinVinted = plus petit prix de la liste finale
4. prixMaxVinted = plus grand prix de la liste finale
5. nbAnnonces = nombre EXACT de prix dans la liste (pas une estimation)
6. delaiVente = estimation du délai de vente en langage naturel selon le marché observé (ex: "1 à 2 semaines", "quelques jours", "1 mois ou plus")

⚠️ FORMAT DE RÉPONSE — IMPÉRATIF :
- Utilise les outils web_search pour tes recherches. Ne rédige PAS ton raisonnement ni tes analyses dans ta réponse — ils restent internes.
- Ta réponse finale doit être UNIQUEMENT l'objet JSON ci-dessous : aucun texte avant, aucun texte après, aucune balise Markdown, pas de \`\`\`json, aucune explication.
- Le premier caractère de ta réponse doit être { et le dernier doit être }.

{
  "prixNeufMarque": string | null,
  "sourcePrixNeuf": string | null,
  "prixMedianVinted": number | null,
  "prixMinVinted": number | null,
  "prixMaxVinted": number | null,
  "nbAnnonces": number | null,
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

  console.log('[PRIX NEUF DEBUG]', text)

  const start = text.indexOf('{')
  const end   = text.lastIndexOf('}')
  if (start === -1 || end === -1 || end <= start) {
    console.error('[price] Réponse brute Claude (pas de JSON):', JSON.stringify(text))
    throw new Error('Réponse IA invalide (extraction marché)')
  }
  try {
    return JSON.parse(text.slice(start, end + 1)) as PriceResult['marche']
  } catch (parseErr) {
    console.error('[price] Réponse brute Claude (JSON invalide):', JSON.stringify(text))
    throw new Error('Réponse IA invalide (extraction marché)')
  }
}

/* ─── Génération du raisonnement — Claude Haiku, temperature 0 ───────────── */

async function generateRaisonnement(params: {
  body:         PriceRequest
  marche:       PriceResult['marche']
  segment:      'standard' | 'luxe_accessible' | 'luxe_premium'
  prixSuggere:  number
  confidence:   'high' | 'medium' | 'low'
  locale?:      string
}): Promise<string> {
  const { body, marche, segment, prixSuggere, locale } = params
  const nativeLang = LANG_NAMES[locale ?? 'fr'] ?? 'français'

  /* Libellé segment lisible — en langue native */
  const SEG_LABELS: Record<string, Record<string, string>> = {
    luxe_premium:    { fr: 'une grande maison de luxe', en: 'a luxury fashion house', es: 'una gran firma de lujo', de: 'ein Luxushaus', it: 'una grande maison di lusso', nl: 'een luxemerk', pl: 'dom mody luksusowej' },
    luxe_accessible: { fr: 'une marque premium', en: 'a premium brand', es: 'una marca premium', de: 'eine Premiummarke', it: 'un marchio premium', nl: 'een premiummerk', pl: 'marka premium' },
    standard:        { fr: 'une marque grand public', en: 'a mainstream brand', es: 'una marca accesible', de: 'eine zugängliche Marke', it: 'un marchio accessibile', nl: 'een toegankelijk merk', pl: 'marka masowa' },
  }
  const segLabel = SEG_LABELS[segment]?.[locale ?? 'fr'] ?? SEG_LABELS.standard.fr

  /* Description des données marché disponibles */
  let marcheDesc: string
  if (marche.prixMedianVinted !== null && (marche.nbAnnonces ?? 0) > 0) {
    marcheDesc = `médiane ${marche.prixMedianVinted}€ sur ${marche.nbAnnonces} annonce(s) (fourchette ${marche.prixMinVinted ?? '?'}–${marche.prixMaxVinted ?? '?'}€)`
  } else if (marche.prixNeufMarque !== null) {
    marcheDesc = `prix neuf ${marche.prixNeufMarque}€, aucune annonce de seconde main trouvée`
  } else {
    marcheDesc = 'aucune donnée de marché disponible'
  }

  const prompt = `Tu rédiges le commentaire prix d'une application de revente (Vinted). Deux à trois phrases simples et rassurantes pour le vendeur.

Article :
- Marque : ${body.marque || 'Non précisée'} (${segLabel})
- État : ${body.etat}
- Prix recommandé : ${prixSuggere}€
- Données marché : ${marcheDesc}
${marche.delaiVente ? `- Délai de vente estimé : ${marche.delaiVente}` : ''}
${body.plateforme ? `- Acheté chez : ${body.plateforme}` : ''}
${body.rarete && body.rarete !== 'Non' ? `- Particularité : ${body.rarete}` : ''}

Consignes :
- Mentionne le positionnement de la marque en langage naturel
- Si des données de vente sont disponibles, évoque la fourchette de prix observée
- L'état de l'article comme facteur explicatif
- Si un délai de vente est disponible, intègre-le naturellement dans une phrase (ex: "à ce prix, comptez environ X semaines")
- Ton simple, chaleureux et rassurant
INTERDIT : formules, pourcentages, coefficients, termes techniques (standard/luxe_accessible/luxe_premium), les mots "pondération" ou "décote"
LANGUE : ${nativeLang}

Réponds avec UNIQUEMENT le texte (2–3 phrases, sans guillemets englobants, sans markdown).`

  try {
    const resp = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 256,
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

    const segment = inputBrandSegment ?? 'standard'

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
      etat:          body.etat,
      segment,
      prixAchatNeuf: body.prixAchatNeuf,
    })

    let prixSuggere = computed.prixSuggere
    if (prixSuggere <= 0) prixSuggere = 1

    /* 3. Raisonnement textuel (Haiku, temperature=0) */
    const raisonnement = await generateRaisonnement({
      body, marche, segment, prixSuggere,
      confidence: computed.confidence,
      locale,
    })

    const result: PriceResult = {
      prixSuggere,
      confidence:    computed.confidence,
      raisonnement,
      brand_segment: segment,
      marche,
    }

    logPricing(body, result, computed.prixDecote, computed.prixNeuf, skipWebSearch ? 'recalcul_rapide' : 'web_search')
    return NextResponse.json(result)

  } catch (err) {
    console.error('[price] Erreur:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
