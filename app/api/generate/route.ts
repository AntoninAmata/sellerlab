import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const client = new Anthropic()

export interface GenerateRequest {
  marque: string
  genre: string
  categorie: string
  sousCategorie: string
  taille: string
  etat: string
  couleurs: string[]
  matieres: string[]
  style: string
  motif: string
  defauts: string
  prixSuggere: number
  lang: string
}

export interface GenerateResult {
  titre: string
  description: string
}

/* ─── POST /api/generate ─────────────────────────────────────────────────── */

export async function POST(req: NextRequest) {
  try {
    const body: GenerateRequest = await req.json()

    const {
      marque, genre, categorie, sousCategorie, taille, etat,
      couleurs, matieres, style, motif, defauts, prixSuggere, lang,
    } = body

    const langLabel: Record<string, string> = {
      fr: 'français', en: 'anglais', es: 'espagnol',
      de: 'allemand', it: 'italien', nl: 'néerlandais', pl: 'polonais',
    }

    const prompt = `Tu es un expert en copywriting pour Vinted. Rédige une annonce optimisée pour vendre rapidement.

Article :
- Marque : ${marque || 'Inconnue'}
- Genre : ${genre}
- Catégorie : ${categorie} > ${sousCategorie}
- Taille : ${taille}
- État : ${etat}
- Couleurs : ${couleurs.join(', ')}
- Matières : ${matieres.join(', ')}
- Style : ${style}
- Motif : ${motif}
${defauts ? `- Défauts : ${defauts}` : ''}
- Prix : ${prixSuggere}€

CONTRAINTES STRICTES :
- Langue : ${langLabel[lang] ?? 'français'}
- Titre : maximum 60 caractères, accrocheur, avec marque + type + taille ou couleur principale
- Description : 80 à 150 mots, ton humain et vendeur (pas robotique)
- Inclure : état, taille, matières principales, style
- ${defauts ? 'Mentionner les défauts honnêtement mais positivement (ex: "légère imperfection à noter")' : 'Ne mentionner aucun défaut'}
- Ne pas mentionner de frais vendeur (sur Vinted, les frais sont à charge de l'acheteur)
- Pas de "N'hésitez pas à me contacter" ni de formules creuses
- Inclure 2-3 mots-clés SEO Vinted naturellement intégrés
- Finir par une phrase d'urgence douce (ex: "Stock limité", "Envoi rapide dès réception")

Réponds UNIQUEMENT avec ce JSON (sans markdown) :
{
  "titre": "string — max 60 caractères",
  "description": "string — 80-150 mots"
}`

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 512,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return NextResponse.json({ error: 'Réponse IA invalide' }, { status: 500 })

    const result: GenerateResult = JSON.parse(jsonMatch[0])

    /* Tronquer le titre à 60 caractères si dépassement */
    if (result.titre.length > 60) result.titre = result.titre.slice(0, 60)

    return NextResponse.json(result)
  } catch (err) {
    console.error('[generate] Erreur:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
