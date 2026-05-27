import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import type { GenerateResult } from '@/app/app/types'

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
  prixSuggere?: number
  lang: string
}

/* ─── POST /api/generate ─────────────────────────────────────────────────── */
/* Génère titre + descriptions FR/EN + tags SEO au format structuré            */

export async function POST(req: NextRequest) {
  try {
    const body: GenerateRequest = await req.json()

    const {
      marque, genre, categorie, sousCategorie, taille, etat,
      couleurs, matieres, style, motif, defauts, prixSuggere, lang,
    } = body

    const prompt = `Tu es un expert en copywriting pour Vinted. Rédige une annonce optimisée pour vendre rapidement.

Article :
- Marque : ${marque || 'Inconnue'}
- Genre : ${genre}
- Catégorie : ${categorie} > ${sousCategorie}
- Taille : ${taille || 'Non précisée'}
- État : ${etat}
- Couleurs : ${couleurs.join(', ') || 'Non précisées'}
- Matières : ${matieres.join(', ') || 'Non précisées'}
- Style : ${style || 'Non précisé'}
- Motif : ${motif || 'Non précisé'}
${defauts ? `- Défauts : ${defauts}` : ''}
${prixSuggere ? `- Prix : ${prixSuggere}€` : ''}

FORMAT OBLIGATOIRE pour la description (emojis + bullet points aérés) :
✅ [État de l'article]
👕 [Description : type, coupe, couleur, style]
🧵 [Composition : matières principales]
📏 [Taille : avec équivalences si pertinent — ex: Taille 48 EU = M/L]
📦 Envoi rapide sous pli bulles protégé · Vinted Pro disponible

RÈGLES STRICTES :
- Titre : maximum 60 caractères, marque + type + taille/couleur principale
- JAMAIS d'information incertaine dans la description (si composition inconnue → ne pas mentionner, la mettre dans infosManquantes)
- 5 bullet points maximum, aérés, lisibles
- ${defauts ? 'Mentionner les défauts honnêtement mais succinctement dans le champ ✅ ou 👕' : 'Ne mentionner aucun défaut'}
- Pas de frais vendeur (à charge de l'acheteur sur Vinted)
- Pas de "N\'hésitez pas" ni de formules creuses
- tailleEquivalences : ex "M = 40 EU = 12 UK" si taille connue, sinon laisser vide ""
- seoTagsInDescription : 4-6 mots-clés DÉJÀ présents naturellement dans descriptionFR
- seoTagsExtra : 3-5 mots-clés supplémentaires utiles pour Vinted SEO, pas dans la description
- infosManquantes : liste des champs non disponibles qui seraient utiles (ex: ["composition", "taille"])
- descriptionEN : traduction anglaise du même format 5 bullet points
- Si lang='en' → les deux descriptions en anglais uniquement
- Toujours générer les deux langues (FR et EN)

Réponds UNIQUEMENT avec ce JSON (sans markdown, sans texte avant ou après) :
{
  "titre": "string — max 60 caractères",
  "descriptionFR": "string — 5 bullet points en français avec emojis",
  "descriptionEN": "string — 5 bullet points en anglais avec emojis",
  "seoTagsInDescription": ["tag1", "tag2"],
  "seoTagsExtra": ["tag1", "tag2"],
  "infosManquantes": ["champ1"],
  "tailleEquivalences": "string — équivalences tailles ou vide"
}`

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
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
