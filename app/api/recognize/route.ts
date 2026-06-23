import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { COLORS, MATERIALS, CONDITIONS, STYLES, PATTERNS } from '@/lib/vinted-taxonomy'
import { getNavRef } from '@/lib/vinted-navigation-taxonomy'
import { getBrandSegment, ALL_SEGMENTS } from '@/lib/pricing'
import type { BrandSegment } from '@/lib/pricing'
import type { RecognitionResult } from '@/app/app/types'

const client = new Anthropic()

const LANG_NAMES: Record<string, string> = {
  fr: 'français', en: 'anglais', es: 'espagnol',
  de: 'allemand', it: 'italien', nl: 'néerlandais', pl: 'polonais',
}

/* ─── Taxonomie de navigation Vinted (calculée une fois) ────────────────── */
const TAXONOMY_REF = getNavRef()

/* ─── POST /api/recognize ────────────────────────────────────────────────── */
/* Reçoit un tableau de photos (base64) et retourne un RecognitionResult      */

export async function POST(req: NextRequest) {
  try {
    const { images, locale } = await req.json() as { images: { base64: string; mediaType: string; slotId?: number }[]; locale?: string }

    if (!images || images.length === 0) {
      return NextResponse.json({ error: 'Aucune image fournie' }, { status: 400 })
    }

    /* ── Construit les hints pour tous les slots non portés (0-8) ── */
    const labelHints: string[] = []
    for (let idx = 0; idx < images.length; idx++) {
      const slotId = images[idx].slotId
      if (slotId === undefined || slotId > 8) continue
      const n = idx + 1
      if (slotId === 3) {
        labelHints.push(`Image ${n} = slot 3 — ÉTIQUETTE MARQUE (priorité max) : lis le nom ou logo de marque écrit sur cette étiquette`)
      } else if (slotId === 4) {
        labelHints.push(`Image ${n} = slot 4 — ÉTIQUETTE TAILLE/COMPO (priorité max) : lis la taille et/ou la composition/instructions de lavage`)
      } else if (slotId === 5) {
        labelHints.push(`Image ${n} = slot 5 — ÉTIQUETTE COMPOSITION (priorité max) : lis la composition matière et les instructions d'entretien`)
      } else {
        labelHints.push(`Image ${n} = slot ${slotId} — photo non portée : si une étiquette avec du texte lisible est visible, extraire marque, taille ou composition`)
      }
    }

    /* ── Construction du contenu multimodal ── */
    const imageContent = images.map((img) => ({
      type: 'image' as const,
      source: {
        type: 'base64' as const,
        media_type: img.mediaType as 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif',
        data: img.base64,
      },
    }))

    const labelSection = labelHints.length > 0
      ? `\nPHOTOS NON PORTÉES — scanne toutes ces images pour trouver marque, taille et composition :\n${labelHints.join('\n')}\nRÈGLE : dès qu'une étiquette avec du texte lisible (marque, taille, composition) est visible dans n'importe laquelle de ces images → confiance "high" OBLIGATOIRE pour le champ correspondant.\n`
      : ''

    const prompt = `Tu es un expert en mode et vente sur Vinted. Analyse ces ${images.length} photo${images.length > 1 ? 's' : ''} d'un vêtement/article et extrait les informations suivantes.
${labelSection}
CONTRAINTES STRICTES :
- Couleurs autorisées : ${COLORS.join(', ')}
- Matières autorisées : ${MATERIALS.join(', ')}
- États autorisés : ${CONDITIONS.map(c => c.label).join(', ')}
- Styles autorisés : ${STYLES.join(', ')}
- Motifs autorisés : ${PATTERNS.join(', ')}
- Genres autorisés : Femme, Homme, Enfant, Mixte, Maison, Électronique, Beauté, Sport
- Maximum 2 couleurs
- Maximum 3 matières

NIVEAUX DE CONFIANCE :
- "high" : tu es sûr à 85%+
- "medium" : tu es sûr à 60-84%
- "low" : tu es sûr à moins de 60% ou l'info n'est pas visible
- IMPORTANT : si la valeur est vide ou non détectée, la confiance DOIT être "low"

CHEMINS DE NAVIGATION VINTED EXACTS — liste complète des chemins valides :
${TAXONOMY_REF}

RÈGLES CATÉGORIE :
- "vintedPath" = chemin de navigation EXACT copié depuis la liste ci-dessus, sans modification
- Format : "N1 > N2 > N3" ou "N1 > N2 > N3 > N4" selon la profondeur du chemin dans la liste
- Choisis le chemin le plus précis (préfère N4 si disponible, sinon N3)
- Exemples : "Femmes > Vêtements > Manteaux et vestes > Manteaux", "Hommes > Vêtements > Jeans > Jeans slim", "Électronique > Ordinateurs et accessoires > Claviers et accessoires"

SYSTÈMES DE TAILLE :
1. Repère la sous-catégorie dans la taxonomie et note son [sizeSystem] (valeur entre crochets)
2. RÈGLE PRINCIPALE — vêtements standards (hors chaussures/enfants/taille unique) : TOUJOURS inclure "letters" en premier + le système taxonomie (ex: homme → ["letters","eu_homme"], femme → ["letters","eu_femme"])
3. Regarde si l'étiquette montre un système supplémentaire (ex: "M / 42" → letters ET eu_femme)
4. Cas particuliers :
   - Chaussures → ["pointures"] uniquement ; taille = numéro EU (ex: "42"), jamais une lettre
   - Enfants → ["enfant_age"] ou ["enfant_cm"] selon la sous-catégorie
   - Taille unique → ["one_size"]
5. Taille exacte : retourne la valeur lue sur l'étiquette telle quelle (ex: "42", "M", "38/40")

RÈGLE DE CONFIANCE POUR LA TAILLE :
- Taille lisible sur une étiquette dans les photos → confidence "high" OBLIGATOIRE, peu importe le système (numérique 48/46/42, lettres S/M/L, jeans 28/30/32, pointures EU/US/UK, tailles italiennes/françaises/etc.)
- Ne jamais mettre "medium" ou "low" si une valeur de taille est clairement visible sur une étiquette
- "medium" ou "low" uniquement si aucune étiquette n'est visible et que la taille doit être estimée à l'œil depuis la silhouette

SEGMENT DE MARQUE :
Classe la marque identifiée dans exactement UN des 8 segments ci-dessous. Retourne la CLÉ TECHNIQUE exacte (jamais un libellé traduit) :
- "ultra_luxe"        : horlogerie/joaillerie de prestige absolu ou haute couture inaccessible, prix €3 000–100 000+ (ex : Hermès, Chanel, Cartier, Rolex)
- "luxe_iconique"     : luxe qui conserve exceptionnellement sa valeur à la revente — quasi uniquement Hermès et Chanel, prix très élevé et stable (ex : Hermès, Chanel)
- "luxe_etabli"       : grande maison de luxe mondiale et prestigieuse, mais qui se déprécie fortement à l'occasion, prix neuf €800–5 000 (ex : Gucci, Prada, Dior, Givenchy, Saint Laurent, Louis Vuitton)
- "luxe_contemporain" : luxe émergent, streetwear haut de gamme ou nouvelle garde, prix €300–1 500 (ex : Jacquemus, Ami, Acne Studios, Off-White)
- "premium_createur"  : créateur parisien ou designer reconnu à prix accessible, prix €150–800 (ex : Sandro, Maje, A.P.C., Isabel Marant, Kenzo)
- "premium_accessible": marque lifestyle/sport premium sans signature créateur, prix €60–300 (ex : Hugo Boss, Ralph Lauren, Lacoste, Tommy Hilfiger)
- "standard"          : marque grand public bien connue, prix €15–150 (ex : Zara, H&M, Nike, Adidas, Levi's)
- "fast_fashion"      : ultra-accessible ou production de masse bas de gamme, prix < €30 (ex : Shein, Primark, Bershka, Boohoo)
Si la marque est inconnue, locale, absente ou générique → retourne "standard".

Réponds UNIQUEMENT avec ce JSON (sans markdown, sans texte avant ou après) :
{
  "marque": { "value": "string — marque lisible sur étiquette ou logo visible, sinon vide", "confidence": "high|medium|low" },
  "genre": { "value": "Femme|Homme|Enfant|Mixte|Maison|Électronique|Beauté|Sport", "confidence": "high|medium|low" },
  "vintedPath": { "value": "string — chemin exact depuis la liste ci-dessus (ex: \"Femmes > Vêtements > Jeans > Jeans skinny\")", "confidence": "high|medium|low" },
  "taille": { "value": "string — taille lue sur étiquette ou déduite, sinon vide", "confidence": "high|medium|low" },
  "tailleSysteme": { "value": ["système_taxonomie"] ou ["système_taxonomie", "système_étiquette"] — tableau de systèmes applicables parmi : eu_femme|eu_homme|letters|jeans|pointures|enfant_age|enfant_cm|one_size|none, "confidence": "high|medium|low" },
  "etat": { "value": "string — parmi les 5 états Vinted exacts", "confidence": "high|medium|low" },
  "couleurs": { "value": ["couleur1"], "confidence": "high|medium|low" },
  "matieres": { "value": ["matière1"], "confidence": "high|medium|low" },
  "style": { "value": "string — parmi les styles autorisés", "confidence": "high|medium|low" },
  "motif": { "value": "string — parmi les motifs autorisés", "confidence": "high|medium|low" },
  "defauts": { "value": "string — défauts visibles décrits précisément, sinon vide", "confidence": "high|medium|low" },
  "brand_segment": "fast_fashion|standard|premium_accessible|premium_createur|luxe_contemporain|luxe_etabli|luxe_iconique|ultra_luxe"
}

LANGUE POUR LES DÉFAUTS : La valeur du champ "defauts" doit être rédigée en ${LANG_NAMES[locale ?? 'fr'] ?? 'français'}. Les champs etat, couleurs, matieres, style, motif doivent utiliser les valeurs françaises exactes de la liste ci-dessus. Le champ "vintedPath" doit utiliser un chemin français exact de la liste de chemins de navigation fournie.`

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            ...imageContent,
            { type: 'text', text: prompt },
          ],
        },
      ],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''

    /* ── Extraction du JSON depuis la réponse ── */
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Réponse IA invalide' }, { status: 500 })
    }

    const result: RecognitionResult = JSON.parse(jsonMatch[0])

    /* ── Résolution brand_segment : table déterministe > Claude > fallback ── */
    {
      const fromTable = getBrandSegment(result.marque?.value ?? '')
      const fromClaude = ALL_SEGMENTS.includes(result.brand_segment as BrandSegment)
        ? (result.brand_segment as BrandSegment)
        : null
      result.brand_segment = fromTable ?? fromClaude ?? 'standard'
    }

    /* ── Normalise vintedPath : renomme categorie → vintedPath si l'IA renvoie l'ancien nom ── */
    if (!result.vintedPath && (result as unknown as Record<string, unknown>).categorie) {
      const old = result as unknown as Record<string, unknown>
      result.vintedPath = old.categorie as RecognitionResult['vintedPath']
      delete old.categorie
      delete old.sousCategorie
    }
    if (!result.vintedPath) {
      result.vintedPath = { value: '', confidence: 'low' }
    }

    /* ── Normalise tailleSysteme : toujours un tableau ── */
    if (!result.tailleSysteme) {
      result.tailleSysteme = { value: ['letters'], confidence: 'low' }
    } else if (!Array.isArray(result.tailleSysteme.value)) {
      result.tailleSysteme = { value: [result.tailleSysteme.value as unknown as string], confidence: result.tailleSysteme.confidence }
    } else if (result.tailleSysteme.value.length === 0) {
      result.tailleSysteme = { value: ['letters'], confidence: 'low' }
    }

    /* ── Enrichit les systèmes : letters + one_size partout sauf chaussures/enfants ── */
    {
      const systems = result.tailleSysteme.value
      const isShoes    = systems.includes('pointures')
      const isKids     = systems.includes('enfant_age') || systems.includes('enfant_cm')
      const isNone     = systems.includes('none')
      const isOneOnly  = systems.length === 1 && systems[0] === 'one_size'
      if (!isShoes && !isKids && !isNone && !isOneOnly) {
        const enriched = [...systems]
        if (!enriched.includes('letters'))  enriched.unshift('letters')
        if (!enriched.includes('one_size')) enriched.push('one_size')
        result.tailleSysteme = { value: enriched, confidence: result.tailleSysteme.confidence }
      }
    }

    return NextResponse.json(result)
  } catch (err) {
    console.error('[recognize] Erreur:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
