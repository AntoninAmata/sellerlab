import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

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

export interface PriceResult {
  prixSuggere: number
  prixMin: number
  prixMax: number
  prixNeufEstime?: number
  raisonnement: string
  margeNeg: number
  confidence: 'high' | 'medium' | 'low'
}

/* ─── POST /api/price ────────────────────────────────────────────────────── */

export async function POST(req: NextRequest) {
  try {
    const body: PriceRequest = await req.json()

    const {
      marque, genre, categorie, sousCategorie, taille, etat,
      couleurs, matieres, style,
      prixAchatNeuf, plateforme, rarete,
    } = body

    const ratios: Record<string, { min: number; max: number }> = {
      'Neuf avec étiquette':  { min: 0.60, max: 0.70 },
      'Neuf sans étiquette':  { min: 0.50, max: 0.60 },
      'Très bon état':         { min: 0.35, max: 0.45 },
      'Bon état':              { min: 0.25, max: 0.35 },
      'Satisfaisant':          { min: 0.15, max: 0.25 },
    }

    const prompt = `Tu es un expert en pricing sur Vinted avec une connaissance approfondie des prix du marché de la mode.

Article à estimer :
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

${prixAchatNeuf ? `Logique de calcul basée sur l'état (si prix neuf fourni) :
- Neuf avec étiquette : 60-70% du prix neuf
- Neuf sans étiquette : 50-60% du prix neuf
- Très bon état : 35-45% du prix neuf
- Bon état : 25-35% du prix neuf
- Satisfaisant : 15-25% du prix neuf` : ''}

IMPORTANT pour la confiance :
- "high" : marque très connue (Zara, H&M, Nike, Adidas, Levi's, Mango, Pull&Bear, Bershka, Stradivarius, Massimo Dutti, The North Face, Ralph Lauren, Tommy Hilfiger, Calvin Klein, Lacoste, etc.) ET catégorie commune → tu as des données de marché fiables
- "medium" : marque semi-connue ou catégorie moins courante → estimation approximative
- "low" : marque inconnue/vide ou article atypique → grande incertitude

Réponds UNIQUEMENT avec ce JSON (sans markdown) :
{
  "prixSuggere": number,
  "prixMin": number,
  "prixMax": number,
  "prixNeufEstime": number or null,
  "raisonnement": "string — 2-3 phrases max expliquant le raisonnement de façon simple et humaine",
  "margeNeg": number,
  "confidence": "high|medium|low"
}`

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 512,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return NextResponse.json({ error: 'Réponse IA invalide' }, { status: 500 })

    const result: PriceResult = JSON.parse(jsonMatch[0])

    /* Correction : prixMin doit être < prixSuggere < prixMax */
    result.prixMin  = Math.max(1, Math.min(result.prixMin, result.prixSuggere - 1))
    result.prixMax  = Math.max(result.prixSuggere + 1, result.prixMax)
    result.margeNeg = Math.max(0, Math.min(result.margeNeg, result.prixSuggere - result.prixMin))

    return NextResponse.json(result)
  } catch (err) {
    console.error('[price] Erreur:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
