import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import type { GenerateResult } from '@/app/app/types'

const client = new Anthropic()

export interface GenerateRequest {
  marque: string
  genre: string
  vintedPath: string
  taille: string
  tailleSysteme?: string
  etat: string
  couleurs: string[]
  matieres: string[]
  style: string
  motif: string
  defauts: string
  extraInfo?: {
    prixAchatNeuf?: number
    missingInfos:   { label: string; value: string }[]
    dimensions:     { nom: string; nomEN: string; valeur: string }[]
  }
  lang: string
}

/* ─── Tables d'équivalences de taille ───────────────────────────────────── */

const SIZE_TABLE_EU = [
  { eu_h: '44', eu_f: '34', letters: 'XS',   it: '44', fr: '34', uk: '8',  us_h: '4',  us_f: '4'  },
  { eu_h: '46', eu_f: '36', letters: 'S',    it: '46', fr: '36', uk: '10', us_h: '6',  us_f: '6'  },
  { eu_h: '48', eu_f: '38', letters: 'M',    it: '48', fr: '38', uk: '12', us_h: '8',  us_f: '8'  },
  { eu_h: '50', eu_f: '40', letters: 'L',    it: '50', fr: '40', uk: '14', us_h: '10', us_f: '10' },
  { eu_h: '52', eu_f: '42', letters: 'XL',   it: '52', fr: '42', uk: '16', us_h: '12', us_f: '12' },
  { eu_h: '54', eu_f: '44', letters: 'XXL',  it: '54', fr: '44', uk: '18', us_h: '14', us_f: '14' },
  { eu_h: '56', eu_f: '46', letters: 'XXXL', it: '56', fr: '46', uk: '20', us_h: '16', us_f: '16' },
]

const SIZE_TABLE_JEANS = [
  { w: '28', cm: '71',  letters: 'XS'   },
  { w: '29', cm: '74',  letters: 'XS'   },
  { w: '30', cm: '76',  letters: 'S'    },
  { w: '31', cm: '79',  letters: 'S'    },
  { w: '32', cm: '81',  letters: 'M'    },
  { w: '33', cm: '84',  letters: 'M'    },
  { w: '34', cm: '86',  letters: 'L'    },
  { w: '36', cm: '91',  letters: 'L'    },
  { w: '38', cm: '97',  letters: 'XL'   },
  { w: '40', cm: '102', letters: 'XXL'  },
  { w: '42', cm: '107', letters: 'XXXL' },
]

const SIZE_TABLE_SHOES = [
  { eu: '35',   uk: '2.5', us_m: '4',    us_f: '5'    },
  { eu: '35.5', uk: '3',   us_m: '4.5',  us_f: '5.5'  },
  { eu: '36',   uk: '3.5', us_m: '5',    us_f: '6'    },
  { eu: '36.5', uk: '4',   us_m: '5.5',  us_f: '6.5'  },
  { eu: '37',   uk: '4.5', us_m: '6',    us_f: '7'    },
  { eu: '37.5', uk: '5',   us_m: '6.5',  us_f: '7.5'  },
  { eu: '38',   uk: '5.5', us_m: '6.5',  us_f: '8'    },
  { eu: '38.5', uk: '6',   us_m: '7',    us_f: '8.5'  },
  { eu: '39',   uk: '6.5', us_m: '7.5',  us_f: '9'    },
  { eu: '39.5', uk: '7',   us_m: '8',    us_f: '9.5'  },
  { eu: '40',   uk: '7',   us_m: '8.5',  us_f: '10'   },
  { eu: '40.5', uk: '7.5', us_m: '9',    us_f: '10.5' },
  { eu: '41',   uk: '7.5', us_m: '9.5',  us_f: '11'   },
  { eu: '41.5', uk: '8',   us_m: '10',   us_f: '11.5' },
  { eu: '42',   uk: '8.5', us_m: '10.5', us_f: '12'   },
  { eu: '42.5', uk: '9',   us_m: '11',   us_f: '12.5' },
  { eu: '43',   uk: '9.5', us_m: '11.5', us_f: '13'   },
  { eu: '43.5', uk: '10',  us_m: '12',   us_f: '13.5' },
  { eu: '44',   uk: '10',  us_m: '12.5', us_f: '14'   },
  { eu: '44.5', uk: '10.5',us_m: '13',   us_f: '14.5' },
  { eu: '45',   uk: '11',  us_m: '13.5', us_f: '15'   },
  { eu: '45.5', uk: '11.5',us_m: '14',   us_f: '15.5' },
  { eu: '46',   uk: '11.5',us_m: '14.5', us_f: '16'   },
]

function computeEquivalences(taille: string, systeme: string): string {
  if (!taille || !systeme) return ''
  const t = taille.trim().toUpperCase()

  if (systeme === 'eu_homme') {
    const row = SIZE_TABLE_EU.find(r => r.eu_h === t || r.letters === t)
    if (row) return `EU ${row.eu_h} = ${row.letters} = IT ${row.it} = FR ${row.fr} = UK ${row.uk} = US ${row.us_h}`
  }
  if (systeme === 'eu_femme') {
    const row = SIZE_TABLE_EU.find(r => r.eu_f === t || r.letters === t)
    if (row) return `EU ${row.eu_f} = ${row.letters} = IT ${row.it} = FR ${row.fr} = UK ${row.uk} = US ${row.us_f}`
  }
  if (systeme === 'letters') {
    const row = SIZE_TABLE_EU.find(r => r.letters === t)
    if (row) return `${row.letters} = EU homme ${row.eu_h} / EU femme ${row.eu_f} = IT ${row.it} = UK ${row.uk}`
  }
  if (systeme === 'jeans') {
    const wMatch = t.replace(/^W/i, '')
    const row = SIZE_TABLE_JEANS.find(r => r.w === wMatch || r.w === t)
    if (row) return `W${row.w} ≈ ${row.letters} · Tour de taille ~${row.cm} cm`
  }
  if (systeme === 'pointures') {
    const row = SIZE_TABLE_SHOES.find(r => r.eu === t || r.eu === taille.trim())
    if (row) return `EU ${row.eu} = UK ${row.uk} = US homme ${row.us_m} = US femme ${row.us_f}`
  }
  return ''
}

/* ─── Noms de langues pour le prompt ────────────────────────────────────── */
const LANG_NAMES: Record<string, string> = {
  fr: 'français', en: 'anglais', es: 'espagnol',
  de: 'allemand', it: 'italien', nl: 'néerlandais', pl: 'polonais',
}

/* ─── POST /api/generate ─────────────────────────────────────────────────── */

export async function POST(req: NextRequest) {
  try {
    const body: GenerateRequest = await req.json()

    const {
      marque, genre, vintedPath, taille, tailleSysteme, etat,
      couleurs, matieres, style, motif, defauts, extraInfo, lang,
    } = body

    const tailleEquiv = computeEquivalences(taille, tailleSysteme ?? '')

    /* ── Lignes infos complémentaires ── */
    const generalInfoLines: string[] = []
    extraInfo?.missingInfos?.forEach(({ label, value }) => generalInfoLines.push(`- ${label} : ${value}`))

    const dimLines: string[] = []
    if (extraInfo?.dimensions?.length) {
      const dimFR = extraInfo.dimensions.map(d => `${d.nom} ${d.valeur} cm`).join(' · ')
      const dimEN = extraInfo.dimensions.map(d => `${d.nomEN} ${d.valeur} cm`).join(' · ')
      dimLines.push(`- Dimensions (FR) : ${dimFR}`)
      dimLines.push(`- Dimensions (EN) : ${dimEN}`)
    }

    const hasPrixNeuf     = !!(extraInfo?.prixAchatNeuf)
    const hasGeneralInfos = generalInfoLines.length > 0
    const hasDimensions   = dimLines.length > 0
    const hasExtraInfo    = hasPrixNeuf || hasGeneralInfos || hasDimensions

    const extraArticleBlock = [
      extraInfo?.prixAchatNeuf ? `- Prix neuf : ${extraInfo.prixAchatNeuf}€` : '',
      ...generalInfoLines,
      ...dimLines,
    ].filter(Boolean).join('\n')
    const tailleInfo = taille
      ? `${taille}${tailleEquiv ? ` (équivalences : ${tailleEquiv})` : ''}`
      : 'Non précisée'

    const nativeLang = LANG_NAMES[lang] ?? 'français'

    const prompt = `Tu es un expert en copywriting pour Vinted. Rédige une annonce optimisée, honnête et lisible.

DONNÉES ARTICLE (ne jamais recopier ces champs en brut dans la description — à intégrer naturellement) :
- Marque : ${marque || 'Inconnue'}
- Genre : ${genre}
- Catégorie : ${vintedPath}
- Taille : ${tailleInfo}
- État : ${etat}
- Couleurs : ${couleurs.join(', ') || 'Non précisées'}
- Matières : ${matieres.join(', ') || 'Non précisées'}
- Style : ${style || 'Non précisé'}
- Motif : ${motif || 'Non précisé'}
${defauts ? `- Défaut confirmé : ${defauts}\n` : ''}\
${hasExtraInfo ? `\nInfos complémentaires à reprendre telles quelles :\n${extraArticleBlock}\n` : ''}\

────────────────────────────────────────────
TITRE — obligations
• Format : Marque + Type + Couleur + Taille + État (ordre naturel en ${nativeLang})
• 50-60 caractères idéalement, maximum 60
• Marque OBLIGATOIRE si connue (sans elle l'annonce est invisible dans les recherches filtrées)
• INTERDITS : tout-en-majuscules, emojis, slogans ("MEGA PROMO", "VOIR PRIX"), ponctuation excessive
• Exemple (FR) : "Pull Arket Homme Marron Taille S Très bon état"

────────────────────────────────────────────
DESCRIPTION — format obligatoire dans cet ordre EXACT :

[Phrase d'accroche : une seule phrase naturelle, ton vendeur, intègre marque + type d'article + état + taille]
✅ [État de l'article${defauts ? ` — mentionner le défaut honnêtement et succinctement : "${defauts}"` : ' — aucun défaut à mentionner'}]
👕 [Description : type d'article, coupe/couleur${style && style !== 'Non précisé' ? ` — déduire 1-2 usages/occasions du style "${style}" combiné au type d'article (conseil vendeur, jamais un fait inventé) ; ajouter 1-2 synonymes du type pour le SEO naturel` : ' — si style non clairement identifié, ne pas forcer d\'usage'}]
🧵 [Composition : matières principales — OMETTRE ENTIÈREMENT cette ligne si les matières sont inconnues]
📏 [Taille avec équivalences${tailleEquiv ? ` : ${tailleEquiv}` : ' si disponibles'}]
${hasPrixNeuf ? `💰 Prix neuf : ${extraInfo?.prixAchatNeuf}€\n` : ''}\
${hasGeneralInfos ? `📋 Infos complémentaires : [reprendre EXACTEMENT chaque info — format "Label : Valeur" ; traduire les labels dans la langue de la description]\n` : ''}\
${hasDimensions ? `📐 Dimensions : [reprendre EXACTEMENT les mesures fournies en cm]\n` : ''}\
📦 [Envoi soigné et rapide]
[Phrase de clôture vendeuse — naturelle en ${nativeLang}, pas de traduction mot à mot, style : invitation chaleureuse à poser des questions]

Longueur description : 80-150 mots STRICTEMENT (compter les mots, viser 100-120)

────────────────────────────────────────────
RÈGLES ABSOLUES :
- titre → en ${nativeLang} (${lang.toUpperCase()}) — PAS en français si lang≠fr
- descriptionFR → en ${nativeLang} (${lang.toUpperCase()}) — JAMAIS en français si lang≠fr
- descriptionEN → en anglais (English) — TOUJOURS sans exception
- JAMAIS de liste brute des champs (marque, genre, catégorie, état, couleur, matière)
- JAMAIS d'info incertaine, inventée ou non fournie (matière, mesure, provenance)
- JAMAIS "voir photos" ni copier-coller générique
- ${defauts ? 'Défaut UNIQUEMENT dans le bloc ✅ — pas dans 👕 ni ailleurs' : 'Aucun défaut mentionné nulle part'}
- seoTagsInDescription : 4-6 mots-clés déjà présents naturellement dans la description native
- seoTagsExtra : 3-5 mots-clés précis utiles pour Vinted SEO (pas #mode, pas #fashion génériques)
- infosManquantes : liste des champs non fournis qui seraient utiles (ex: ["composition", "longueur"])
- hashtagsFR : 6-8 hashtags en ${nativeLang} CamelCase sur une seule ligne (synonymes natifs + termes universels)
- hashtagsEN : 6-8 hashtags en anglais CamelCase sur une seule ligne (synonymes anglais + termes universels)

Réponds UNIQUEMENT avec ce JSON (sans markdown, sans texte avant ni après) :
{
  "titre": "string — max 60 car, ${nativeLang}, Marque + Type + Couleur + Taille + État",
  "descriptionFR": "string — en ${nativeLang}, hook + emojis + clôture, 80-150 mots",
  "descriptionEN": "string — en anglais, même structure, 80-150 mots",
  "seoTagsInDescription": ["tag1", "tag2"],
  "seoTagsExtra": ["tag1", "tag2"],
  "infosManquantes": ["champ1"],
  "tailleEquivalences": "",
  "hashtagsFR": "string — hashtags ${nativeLang} CamelCase sur une ligne",
  "hashtagsEN": "string — hashtags anglais CamelCase sur une ligne"
}`

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return NextResponse.json({ error: 'Réponse IA invalide' }, { status: 500 })

    const result: GenerateResult = JSON.parse(jsonMatch[0])

    if (result.titre.length > 60) result.titre = result.titre.slice(0, 60)
    /* Les équivalences sont calculées côté serveur, pas par l'IA */
    result.tailleEquivalences = tailleEquiv
    /* Normaliser les hashtags : tout sur une ligne, sans espaces multiples */
    const normalizeHashtags = (s: string) => (s ?? '').replace(/\n+/g, ' ').replace(/\s{2,}/g, ' ').trim()
    result.hashtagsFR = normalizeHashtags(result.hashtagsFR)
    result.hashtagsEN = normalizeHashtags(result.hashtagsEN)

    return NextResponse.json(result)
  } catch (err) {
    console.error('[generate] Erreur:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
