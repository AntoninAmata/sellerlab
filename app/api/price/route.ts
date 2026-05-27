import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import type { PriceResult } from '@/app/app/types'

const client = new Anthropic()

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
}

/* ─── POST /api/price ────────────────────────────────────────────────────── */
/* Calcule un prix suggéré en utilisant Claude avec web search                 */

export async function POST(req: NextRequest) {
  try {
    const body: PriceRequest = await req.json()

    const {
      marque, genre, categorie, sousCategorie, taille, etat,
      couleurs, matieres, style,
      prixAchatNeuf, plateforme, rarete,
    } = body

    const prompt = `Tu es un expert en pricing sur Vinted. Pour l'article décrit ci-dessous, tu dois :
1. Rechercher le prix neuf actuel sur le site officiel de la marque
2. Rechercher les prix actuels sur Vinted pour cet article

Article :
- Marque : ${marque || 'Non précisée'}
- Genre : ${genre}
- Catégorie : ${categorie} > ${sousCategorie}
- Taille : ${taille || 'Non précisée'}
- État : ${etat}
- Couleurs : ${couleurs.join(', ') || 'Non précisées'}
- Matières : ${matieres.join(', ') || 'Non précisées'}
- Style : ${style || 'Non précisé'}
${prixAchatNeuf ? `- Prix d'achat neuf déclaré par l'utilisateur : ${prixAchatNeuf}€` : ''}
${plateforme ? `- Acheté chez : ${plateforme}` : ''}
${rarete ? `- Rareté : ${rarete}` : ''}

LOGIQUE DE CALCUL du prix suggéré :
${prixAchatNeuf ? `Prix d'achat neuf fourni = ${prixAchatNeuf}€ → applique le ratio selon l'état :` : 'Estime le prix neuf via web search → applique le ratio selon l\'état :'}
- Neuf avec étiquette : 65% du prix neuf
- Neuf sans étiquette : 55% du prix neuf
- Très bon état : 40% du prix neuf
- Bon état : 30% du prix neuf
- Satisfaisant : 20% du prix neuf
→ Ajuste ensuite par les prix médians Vinted si disponibles

RÈGLES STRICTES pour les données marché :
- Si tu ne trouves pas le prix neuf officiel → prixNeufMarque = null, sourcePrixNeuf = null
- Si tu ne trouves pas de données Vinted → null pour tous les champs Vinted
- JAMAIS inventer des données : si inconnu → null
- delaiVente : estimé selon le niveau de prix (ex: "2-5 jours", "1-2 semaines", "1+ mois")

CONFIANCE :
- "high" : marque très connue (Zara, H&M, Nike, Adidas, Levi's, etc.) ET données de marché trouvées
- "medium" : marque semi-connue ou données partielles
- "low" : marque inconnue ou données insuffisantes

Réponds UNIQUEMENT avec ce JSON (sans markdown, sans texte avant ou après) :
{
  "prixSuggere": number,
  "confidence": "high|medium|low",
  "raisonnement": "string — 1-2 phrases max, simple et humain",
  "marche": {
    "prixNeufMarque": number or null,
    "sourcePrixNeuf": "string or null",
    "prixMedianVinted": number or null,
    "prixMinVinted": number or null,
    "prixMaxVinted": number or null,
    "nbAnnonces": number or null,
    "delaiVente": "string or null"
  }
}`

    /* ── Appel Claude avec web search ── */
    const initialMessages: Anthropic.MessageParam[] = [{ role: 'user', content: prompt }]

    let lastResponse = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      tools: [{ type: 'web_search_20250305' as 'web_search_20250305', name: 'web_search' }],
      messages: initialMessages,
    })

    /* Boucle d'exécution des tool_use (max 4 itérations) */
    const messages: Anthropic.MessageParam[] = [...initialMessages]
    let iterations = 0

    while (lastResponse.stop_reason === 'tool_use' && iterations < 4) {
      iterations++
      messages.push({ role: 'assistant', content: lastResponse.content })

      /* Collecte les résultats des outils appelés */
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

    /* ── Extraction du texte final ── */
    const text = lastResponse.content
      .filter((b): b is Anthropic.TextBlock => b.type === 'text')
      .map((b) => b.text)
      .join('')

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return NextResponse.json({ error: 'Réponse IA invalide' }, { status: 500 })

    const result: PriceResult = JSON.parse(jsonMatch[0])

    /* Validation basique du prix suggéré */
    if (!result.prixSuggere || result.prixSuggere <= 0) {
      result.prixSuggere = 1
    }

    return NextResponse.json(result)
  } catch (err) {
    console.error('[price] Erreur:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
