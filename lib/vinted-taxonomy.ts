/* ─── Taxonomie Vinted — données exactes de l'interface ─────────────────── */

export type Genre = 'Femme' | 'Homme' | 'Enfant' | 'Mixte'

export interface SubCategory {
  name: string
  sizeSystem: SizeSystem
}

export interface Category {
  name: string
  subCategories: SubCategory[]
}

export type SizeSystem =
  | 'letters'    // XS, S, M, L, XL, XXL, XXXL
  | 'eu_femme'   // 34–48
  | 'eu_homme'   // 44–56
  | 'jeans'      // 28–42
  | 'pointures'  // 35–48
  | 'enfant_age' // 0-3 mois → 14 ans
  | 'enfant_cm'  // 56–164 cm
  | 'one_size'
  | 'none'

/* ─── Catégories par genre ───────────────────────────────────────────────── */

export const CATEGORIES: Record<Genre, Category[]> = {
  Femme: [
    {
      name: 'Hauts & T-shirts',
      subCategories: [
        { name: 'T-shirts', sizeSystem: 'letters' },
        { name: 'Tops & Débardeurs', sizeSystem: 'letters' },
        { name: 'Chemisiers', sizeSystem: 'eu_femme' },
        { name: 'Pulls', sizeSystem: 'letters' },
        { name: 'Sweats & Hoodies', sizeSystem: 'letters' },
        { name: 'Cardigans', sizeSystem: 'letters' },
      ],
    },
    {
      name: 'Robes',
      subCategories: [
        { name: 'Robes courtes', sizeSystem: 'eu_femme' },
        { name: 'Robes longues', sizeSystem: 'eu_femme' },
        { name: 'Robes de soirée', sizeSystem: 'eu_femme' },
        { name: 'Robes de mariée', sizeSystem: 'eu_femme' },
      ],
    },
    {
      name: 'Jupes',
      subCategories: [
        { name: 'Jupes courtes', sizeSystem: 'eu_femme' },
        { name: 'Jupes longues', sizeSystem: 'eu_femme' },
        { name: 'Jupes mi-longues', sizeSystem: 'eu_femme' },
      ],
    },
    {
      name: 'Pantalons & Jeans',
      subCategories: [
        { name: 'Jeans', sizeSystem: 'jeans' },
        { name: 'Pantalons', sizeSystem: 'eu_femme' },
        { name: 'Leggings', sizeSystem: 'letters' },
        { name: 'Shorts & Bermudas', sizeSystem: 'eu_femme' },
        { name: 'Combinaisons', sizeSystem: 'eu_femme' },
      ],
    },
    {
      name: 'Vestes & Manteaux',
      subCategories: [
        { name: 'Blazers & Vestes', sizeSystem: 'eu_femme' },
        { name: 'Manteaux', sizeSystem: 'eu_femme' },
        { name: 'Imperméables & Trenchs', sizeSystem: 'eu_femme' },
        { name: 'Doudounes', sizeSystem: 'letters' },
        { name: 'Parkas', sizeSystem: 'letters' },
        { name: 'Vestes en cuir', sizeSystem: 'eu_femme' },
      ],
    },
    {
      name: 'Chaussures',
      subCategories: [
        { name: 'Baskets & Tennis', sizeSystem: 'pointures' },
        { name: 'Bottes & Bottines', sizeSystem: 'pointures' },
        { name: 'Sandales & Mules', sizeSystem: 'pointures' },
        { name: 'Escarpins & Talons', sizeSystem: 'pointures' },
        { name: 'Ballerines & Mocassins', sizeSystem: 'pointures' },
        { name: 'Chaussures plates', sizeSystem: 'pointures' },
      ],
    },
    {
      name: 'Sacs',
      subCategories: [
        { name: 'Sacs à main', sizeSystem: 'one_size' },
        { name: 'Sacs à dos', sizeSystem: 'one_size' },
        { name: 'Sacs bandoulière', sizeSystem: 'one_size' },
        { name: 'Pochettes & Clutches', sizeSystem: 'one_size' },
        { name: 'Tote bags', sizeSystem: 'one_size' },
        { name: 'Valises & Bagages', sizeSystem: 'one_size' },
      ],
    },
    {
      name: 'Accessoires',
      subCategories: [
        { name: 'Écharpes & Foulards', sizeSystem: 'one_size' },
        { name: 'Ceintures', sizeSystem: 'one_size' },
        { name: 'Chapeaux & Bonnets', sizeSystem: 'one_size' },
        { name: 'Gants & Mitaines', sizeSystem: 'one_size' },
        { name: 'Bijoux', sizeSystem: 'one_size' },
        { name: 'Montres', sizeSystem: 'one_size' },
        { name: 'Lunettes', sizeSystem: 'one_size' },
      ],
    },
    {
      name: 'Maillots de bain',
      subCategories: [
        { name: 'Bikinis', sizeSystem: 'eu_femme' },
        { name: 'Maillots 1 pièce', sizeSystem: 'eu_femme' },
        { name: 'Bas de maillot', sizeSystem: 'eu_femme' },
        { name: 'Hauts de maillot', sizeSystem: 'eu_femme' },
      ],
    },
    {
      name: 'Sport & Gym',
      subCategories: [
        { name: 'T-shirts sport', sizeSystem: 'letters' },
        { name: 'Leggings & Shorts sport', sizeSystem: 'letters' },
        { name: 'Vestes & Sweats sport', sizeSystem: 'letters' },
        { name: 'Chaussures sport', sizeSystem: 'pointures' },
      ],
    },
    {
      name: 'Lingerie & Pyjamas',
      subCategories: [
        { name: 'Soutiens-gorge', sizeSystem: 'none' },
        { name: 'Culottes & Strings', sizeSystem: 'letters' },
        { name: 'Pyjamas & Nuisettes', sizeSystem: 'letters' },
      ],
    },
  ],

  Homme: [
    {
      name: 'Hauts & T-shirts',
      subCategories: [
        { name: 'T-shirts', sizeSystem: 'letters' },
        { name: 'Polos', sizeSystem: 'letters' },
        { name: 'Chemises', sizeSystem: 'eu_homme' },
        { name: 'Pulls', sizeSystem: 'letters' },
        { name: 'Sweats & Hoodies', sizeSystem: 'letters' },
        { name: 'Débardeurs', sizeSystem: 'letters' },
      ],
    },
    {
      name: 'Pantalons & Jeans',
      subCategories: [
        { name: 'Jeans', sizeSystem: 'jeans' },
        { name: 'Pantalons', sizeSystem: 'eu_homme' },
        { name: 'Shorts & Bermudas', sizeSystem: 'eu_homme' },
        { name: 'Joggings', sizeSystem: 'letters' },
        { name: 'Combinaisons', sizeSystem: 'eu_homme' },
      ],
    },
    {
      name: 'Vestes & Manteaux',
      subCategories: [
        { name: 'Blazers & Vestes', sizeSystem: 'eu_homme' },
        { name: 'Manteaux', sizeSystem: 'eu_homme' },
        { name: 'Imperméables & Trenchs', sizeSystem: 'eu_homme' },
        { name: 'Doudounes', sizeSystem: 'letters' },
        { name: 'Parkas', sizeSystem: 'letters' },
        { name: 'Vestes en cuir & Bombers', sizeSystem: 'eu_homme' },
      ],
    },
    {
      name: 'Chaussures',
      subCategories: [
        { name: 'Baskets & Tennis', sizeSystem: 'pointures' },
        { name: 'Bottes & Bottines', sizeSystem: 'pointures' },
        { name: 'Mocassins & Derbies', sizeSystem: 'pointures' },
        { name: 'Sandales', sizeSystem: 'pointures' },
        { name: 'Chaussures de sport', sizeSystem: 'pointures' },
      ],
    },
    {
      name: 'Accessoires',
      subCategories: [
        { name: 'Écharpes & Foulards', sizeSystem: 'one_size' },
        { name: 'Ceintures', sizeSystem: 'one_size' },
        { name: 'Chapeaux & Bonnets', sizeSystem: 'one_size' },
        { name: 'Bijoux & Montres', sizeSystem: 'one_size' },
        { name: 'Lunettes', sizeSystem: 'one_size' },
      ],
    },
    {
      name: 'Sacs',
      subCategories: [
        { name: 'Sacs à dos', sizeSystem: 'one_size' },
        { name: 'Sacs bandoulière', sizeSystem: 'one_size' },
        { name: 'Sacs de voyage', sizeSystem: 'one_size' },
      ],
    },
    {
      name: 'Sport',
      subCategories: [
        { name: 'T-shirts sport', sizeSystem: 'letters' },
        { name: 'Shorts sport', sizeSystem: 'letters' },
        { name: 'Vestes sport', sizeSystem: 'letters' },
        { name: 'Chaussures sport', sizeSystem: 'pointures' },
      ],
    },
  ],

  Enfant: [
    {
      name: 'Bébé (0-24 mois)',
      subCategories: [
        { name: 'Bodys & Combinaisons', sizeSystem: 'enfant_cm' },
        { name: 'Hauts & T-shirts', sizeSystem: 'enfant_cm' },
        { name: 'Pantalons & Leggings', sizeSystem: 'enfant_cm' },
        { name: 'Robes & Jupes', sizeSystem: 'enfant_cm' },
        { name: 'Manteaux & Doudounes', sizeSystem: 'enfant_cm' },
        { name: 'Chaussures', sizeSystem: 'pointures' },
      ],
    },
    {
      name: 'Fille (2-14 ans)',
      subCategories: [
        { name: 'T-shirts & Tops', sizeSystem: 'enfant_age' },
        { name: 'Robes & Jupes', sizeSystem: 'enfant_age' },
        { name: 'Pantalons & Jeans', sizeSystem: 'enfant_age' },
        { name: 'Pulls & Sweats', sizeSystem: 'enfant_age' },
        { name: 'Vestes & Manteaux', sizeSystem: 'enfant_age' },
        { name: 'Chaussures', sizeSystem: 'pointures' },
      ],
    },
    {
      name: 'Garçon (2-14 ans)',
      subCategories: [
        { name: 'T-shirts & Polos', sizeSystem: 'enfant_age' },
        { name: 'Pantalons & Jeans', sizeSystem: 'enfant_age' },
        { name: 'Pulls & Sweats', sizeSystem: 'enfant_age' },
        { name: 'Shorts', sizeSystem: 'enfant_age' },
        { name: 'Vestes & Manteaux', sizeSystem: 'enfant_age' },
        { name: 'Chaussures', sizeSystem: 'pointures' },
      ],
    },
  ],

  Mixte: [
    {
      name: 'Streetwear & Unisexe',
      subCategories: [
        { name: 'T-shirts', sizeSystem: 'letters' },
        { name: 'Sweats & Hoodies', sizeSystem: 'letters' },
        { name: 'Baskets', sizeSystem: 'pointures' },
      ],
    },
  ],
}

/* ─── Tailles par système ────────────────────────────────────────────────── */

export const SIZES: Record<SizeSystem, string[]> = {
  letters:    ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
  eu_femme:   ['34', '36', '38', '40', '42', '44', '46', '48'],
  eu_homme:   ['44', '46', '48', '50', '52', '54', '56'],
  jeans:      ['28', '30', '32', '34', '36', '38', '40', '42'],
  pointures:  ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48'],
  enfant_age: ['0-3 mois', '3-6 mois', '6-9 mois', '9-12 mois', '12-18 mois', '18-24 mois', '2 ans', '3 ans', '4 ans', '5 ans', '6 ans', '7 ans', '8 ans', '9 ans', '10 ans', '11 ans', '12 ans', '13 ans', '14 ans'],
  enfant_cm:  ['56', '62', '68', '74', '80', '86', '92', '98', '104', '110', '116', '122', '128', '134', '140', '146', '152', '158', '164'],
  one_size:   ['Taille unique'],
  none:       [],
}

/* ─── Couleurs exactes Vinted (ordre interface) ─────────────────────────── */

export const COLORS: string[] = [
  'Noir', 'Gris', 'Blanc', 'Crème', 'Beige', 'Abricot', 'Orange', 'Corail',
  'Rouge', 'Bordeaux', 'Fuchsia', 'Rose', 'Violet', 'Lila', 'Bleu clair',
  'Bleu', 'Marine', 'Turquoise', 'Menthe', 'Vert', 'Vert foncé', 'Kaki',
  'Marron', 'Moutarde', 'Jaune', 'Argenté', 'Doré', 'Multicolore', 'Transparence',
]

/* ─── Matières exactes Vinted (ordre alphabétique interface) ────────────── */

export const MATERIALS: string[] = [
  'Acier', 'Acrylique', 'Alpaga', 'Argent', 'Bambou', 'Bois', 'Cachemire',
  'Caoutchouc', 'Carton', 'Coton', 'Cuir', 'Cuir synthétique', 'Cuir verni',
  'Céramique', 'Daim', 'Denim', 'Dentelle', 'Duvet', 'Fausse fourrure', 'Feutre',
  'Flanelle', 'Jute', 'Laine', 'Latex', 'Lin', 'Maille', 'Mohair', 'Mousse',
  'Mousseline', 'Mérinos', 'Métal', 'Nylon', 'Néoprène', 'Or', 'Paille', 'Papier',
  'Peluche', 'Pierre', 'Plastique', 'Polaire', 'Polyester', 'Porcelaine', 'Rotin',
  'Satin', 'Sequin', 'Silicone', 'Soie', 'Toile', 'Tulle', 'Tweed', 'Velours',
  'Velours côtelé', 'Verre', 'Viscose', 'Élasthanne',
]

/* ─── États officiels Vinted ─────────────────────────────────────────────── */

export const CONDITIONS = [
  { id: 'new_tags',    label: 'Neuf avec étiquette',   desc: 'Jamais porté/utilisé, étiquettes ou emballage d\'origine' },
  { id: 'new_no_tags', label: 'Neuf sans étiquette',   desc: 'Jamais porté/utilisé, sans étiquettes ni emballage' },
  { id: 'very_good',   label: 'Très bon état',          desc: 'Très peu porté/utilisé, légères imperfections possibles' },
  { id: 'good',        label: 'Bon état',               desc: 'Porté quelques fois, imperfections et signes d\'usure' },
  { id: 'fair',        label: 'Satisfaisant',           desc: 'Porté plusieurs fois, imperfections et signes d\'usure' },
] as const

export type ConditionId = typeof CONDITIONS[number]['id']

/* ─── Styles ─────────────────────────────────────────────────────────────── */

export const STYLES: string[] = [
  'Casual', 'Classique', 'Sportif', 'Chic & Élégant', 'Bohème', 'Streetwear',
  'Vintage', 'Romantique', 'Minimaliste', 'Rock', 'Preppy', 'Gothique',
]

/* ─── Motifs ─────────────────────────────────────────────────────────────── */

export const PATTERNS: string[] = [
  'Uni', 'Rayures', 'Carreaux', 'Fleurs', 'Pois', 'Animal print',
  'Camouflage', 'Géométrique', 'Tie-dye', 'Broderie', 'Imprimé', 'Abstrait',
]
