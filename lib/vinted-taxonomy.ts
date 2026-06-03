/* ─── Taxonomie Vinted — données exactes de l'interface ─────────────────── */

export type Genre = 'Femme' | 'Homme' | 'Enfant' | 'Mixte' | 'Maison' | 'Électronique' | 'Beauté' | 'Sport'

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

export const CATEGORIES: Record<Genre, Category[]> = {
  Femme: [
    {
      name: 'Hauts & T-shirts',
      subCategories: [
        { name: 'T-shirts', sizeSystem: 'letters' },
        { name: 'Tops & Débardeurs', sizeSystem: 'letters' },
        { name: 'Chemisiers & Blouses', sizeSystem: 'eu_femme' },
        { name: 'Pulls & Sweatshirts', sizeSystem: 'letters' },
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
        { name: 'Joggings', sizeSystem: 'letters' },
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
        { name: 'Bombers', sizeSystem: 'letters' },
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
        { name: 'Chaussures sport', sizeSystem: 'pointures' },
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
        { name: 'Sacs de voyage', sizeSystem: 'one_size' },
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
        { name: 'Lunettes de soleil', sizeSystem: 'one_size' },
        { name: 'Collants & Chaussettes', sizeSystem: 'one_size' },
        { name: 'Cravates & Nœuds papillon', sizeSystem: 'one_size' },
      ],
    },
    {
      name: 'Bijoux',
      subCategories: [
        { name: 'Colliers & Pendentifs', sizeSystem: 'one_size' },
        { name: 'Bagues', sizeSystem: 'one_size' },
        { name: 'Boucles d\'oreilles', sizeSystem: 'one_size' },
        { name: 'Bracelets', sizeSystem: 'one_size' },
        { name: 'Brooches & Épingles', sizeSystem: 'one_size' },
        { name: 'Parures', sizeSystem: 'one_size' },
      ],
    },
    {
      name: 'Montres',
      subCategories: [
        { name: 'Montres classiques', sizeSystem: 'one_size' },
        { name: 'Montres sport', sizeSystem: 'one_size' },
        { name: 'Montres connectées', sizeSystem: 'one_size' },
      ],
    },
    {
      name: 'Maillots de bain',
      subCategories: [
        { name: 'Bikinis', sizeSystem: 'eu_femme' },
        { name: 'Maillots 1 pièce', sizeSystem: 'eu_femme' },
        { name: 'Bas de maillot', sizeSystem: 'eu_femme' },
        { name: 'Hauts de maillot', sizeSystem: 'eu_femme' },
        { name: 'Pareos & Sarongs', sizeSystem: 'one_size' },
      ],
    },
    {
      name: 'Sport & Gym',
      subCategories: [
        { name: 'T-shirts sport', sizeSystem: 'letters' },
        { name: 'Leggings & Shorts sport', sizeSystem: 'letters' },
        { name: 'Vestes & Sweats sport', sizeSystem: 'letters' },
        { name: 'Chaussures sport', sizeSystem: 'pointures' },
        { name: 'Maillots de sport', sizeSystem: 'letters' },
        { name: 'Tenues yoga & pilates', sizeSystem: 'letters' },
      ],
    },
    {
      name: 'Lingerie & Pyjamas',
      subCategories: [
        { name: 'Soutiens-gorge', sizeSystem: 'none' },
        { name: 'Culottes & Strings', sizeSystem: 'letters' },
        { name: 'Body', sizeSystem: 'letters' },
        { name: 'Pyjamas & Nuisettes', sizeSystem: 'letters' },
        { name: 'Chaussettes & Collants', sizeSystem: 'one_size' },
      ],
    },
    {
      name: 'Maternité',
      subCategories: [
        { name: 'Hauts maternité', sizeSystem: 'letters' },
        { name: 'Pantalons maternité', sizeSystem: 'eu_femme' },
        { name: 'Robes maternité', sizeSystem: 'eu_femme' },
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
        { name: 'Pulls & Sweatshirts', sizeSystem: 'letters' },
        { name: 'Débardeurs', sizeSystem: 'letters' },
        { name: 'Costumes & Vestes de costume', sizeSystem: 'eu_homme' },
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
        { name: 'Chaussures sport', sizeSystem: 'pointures' },
        { name: 'Chaussures habillées', sizeSystem: 'pointures' },
      ],
    },
    {
      name: 'Accessoires',
      subCategories: [
        { name: 'Écharpes & Foulards', sizeSystem: 'one_size' },
        { name: 'Ceintures', sizeSystem: 'one_size' },
        { name: 'Chapeaux & Bonnets', sizeSystem: 'one_size' },
        { name: 'Cravates & Nœuds papillon', sizeSystem: 'one_size' },
        { name: 'Lunettes de soleil', sizeSystem: 'one_size' },
        { name: 'Gants', sizeSystem: 'one_size' },
      ],
    },
    {
      name: 'Bijoux & Montres',
      subCategories: [
        { name: 'Montres', sizeSystem: 'one_size' },
        { name: 'Bracelets', sizeSystem: 'one_size' },
        { name: 'Colliers', sizeSystem: 'one_size' },
        { name: 'Bagues', sizeSystem: 'one_size' },
        { name: 'Boucles d\'oreilles', sizeSystem: 'one_size' },
      ],
    },
    {
      name: 'Sacs',
      subCategories: [
        { name: 'Sacs à dos', sizeSystem: 'one_size' },
        { name: 'Sacs bandoulière', sizeSystem: 'one_size' },
        { name: 'Sacs de voyage', sizeSystem: 'one_size' },
        { name: 'Porte-monnaie & Portefeuilles', sizeSystem: 'one_size' },
      ],
    },
    {
      name: 'Sous-vêtements & Pyjamas',
      subCategories: [
        { name: 'Boxers & Slips', sizeSystem: 'letters' },
        { name: 'Pyjamas', sizeSystem: 'letters' },
        { name: 'Chaussettes', sizeSystem: 'one_size' },
      ],
    },
    {
      name: 'Maillots de bain',
      subCategories: [
        { name: 'Shorts de bain', sizeSystem: 'letters' },
        { name: 'Slips de bain', sizeSystem: 'letters' },
      ],
    },
    {
      name: 'Sport',
      subCategories: [
        { name: 'T-shirts sport', sizeSystem: 'letters' },
        { name: 'Shorts sport', sizeSystem: 'letters' },
        { name: 'Vestes sport', sizeSystem: 'letters' },
        { name: 'Joggings sport', sizeSystem: 'letters' },
        { name: 'Chaussures sport', sizeSystem: 'pointures' },
        { name: 'Maillots & Équipement', sizeSystem: 'letters' },
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
        { name: 'Pyjamas & Gigoteuses', sizeSystem: 'enfant_cm' },
        { name: 'Manteaux & Doudounes', sizeSystem: 'enfant_cm' },
        { name: 'Chaussures bébé', sizeSystem: 'pointures' },
        { name: 'Accessoires bébé', sizeSystem: 'one_size' },
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
        { name: 'Accessoires & Bijoux', sizeSystem: 'one_size' },
        { name: 'Sport', sizeSystem: 'enfant_age' },
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
        { name: 'Accessoires', sizeSystem: 'one_size' },
        { name: 'Sport', sizeSystem: 'enfant_age' },
      ],
    },
    {
      name: 'Enfant Mixte',
      subCategories: [
        { name: 'T-shirts unisexe', sizeSystem: 'enfant_age' },
        { name: 'Pyjamas', sizeSystem: 'enfant_age' },
        { name: 'Chaussures', sizeSystem: 'pointures' },
        { name: 'Accessoires', sizeSystem: 'one_size' },
      ],
    },
  ],

  Mixte: [
    {
      name: 'Streetwear & Unisexe',
      subCategories: [
        { name: 'T-shirts', sizeSystem: 'letters' },
        { name: 'Sweats & Hoodies', sizeSystem: 'letters' },
        { name: 'Vestes', sizeSystem: 'letters' },
        { name: 'Pantalons & Joggings', sizeSystem: 'letters' },
        { name: 'Baskets', sizeSystem: 'pointures' },
        { name: 'Accessoires', sizeSystem: 'one_size' },
      ],
    },
  ],

  Maison: [
    {
      name: 'Meubles',
      subCategories: [
        { name: 'Canapés & Fauteuils', sizeSystem: 'none' },
        { name: 'Tables & Bureaux', sizeSystem: 'none' },
        { name: 'Lits & Cadres de lit', sizeSystem: 'none' },
        { name: 'Rangements & Étagères', sizeSystem: 'none' },
        { name: 'Chaises', sizeSystem: 'none' },
      ],
    },
    {
      name: 'Déco & Objets',
      subCategories: [
        { name: 'Coussins & Plaids', sizeSystem: 'none' },
        { name: 'Bougies & Parfums d\'ambiance', sizeSystem: 'none' },
        { name: 'Cadres & Tableaux', sizeSystem: 'none' },
        { name: 'Vases & Céramiques', sizeSystem: 'none' },
        { name: 'Miroirs', sizeSystem: 'none' },
        { name: 'Horloges', sizeSystem: 'none' },
      ],
    },
    {
      name: 'Linge de maison',
      subCategories: [
        { name: 'Draps & Parures de lit', sizeSystem: 'none' },
        { name: 'Couvre-lits & Couettes', sizeSystem: 'none' },
        { name: 'Serviettes & Peignoirs', sizeSystem: 'none' },
        { name: 'Nappes & Torchons', sizeSystem: 'none' },
      ],
    },
    {
      name: 'Cuisine',
      subCategories: [
        { name: 'Vaisselle', sizeSystem: 'none' },
        { name: 'Ustensiles & Accessoires', sizeSystem: 'none' },
        { name: 'Cafetières & Appareils', sizeSystem: 'none' },
        { name: 'Verres & Tasses', sizeSystem: 'none' },
      ],
    },
    {
      name: 'Jardin & Extérieur',
      subCategories: [
        { name: 'Mobilier de jardin', sizeSystem: 'none' },
        { name: 'Plantes & Accessoires', sizeSystem: 'none' },
        { name: 'Déco extérieure', sizeSystem: 'none' },
      ],
    },
  ],

  Électronique: [
    {
      name: 'Téléphones & Tablettes',
      subCategories: [
        { name: 'Smartphones', sizeSystem: 'none' },
        { name: 'Tablettes', sizeSystem: 'none' },
        { name: 'Coques & Accessoires', sizeSystem: 'none' },
      ],
    },
    {
      name: 'Informatique',
      subCategories: [
        { name: 'Ordinateurs portables', sizeSystem: 'none' },
        { name: 'Ordinateurs de bureau', sizeSystem: 'none' },
        { name: 'Accessoires informatique', sizeSystem: 'none' },
      ],
    },
    {
      name: 'Jeux vidéo & Consoles',
      subCategories: [
        { name: 'Consoles', sizeSystem: 'none' },
        { name: 'Jeux vidéo', sizeSystem: 'none' },
        { name: 'Accessoires gaming', sizeSystem: 'none' },
      ],
    },
    {
      name: 'Audio & Musique',
      subCategories: [
        { name: 'Écouteurs & Casques', sizeSystem: 'none' },
        { name: 'Enceintes', sizeSystem: 'none' },
        { name: 'Instruments de musique', sizeSystem: 'none' },
      ],
    },
    {
      name: 'Photo & Vidéo',
      subCategories: [
        { name: 'Appareils photo', sizeSystem: 'none' },
        { name: 'Caméras', sizeSystem: 'none' },
        { name: 'Accessoires photo', sizeSystem: 'none' },
      ],
    },
  ],

  Beauté: [
    {
      name: 'Parfums',
      subCategories: [
        { name: 'Parfums femme', sizeSystem: 'none' },
        { name: 'Parfums homme', sizeSystem: 'none' },
        { name: 'Eaux de toilette', sizeSystem: 'none' },
      ],
    },
    {
      name: 'Soins & Skincare',
      subCategories: [
        { name: 'Soins visage', sizeSystem: 'none' },
        { name: 'Soins corps', sizeSystem: 'none' },
        { name: 'Soins cheveux', sizeSystem: 'none' },
      ],
    },
    {
      name: 'Maquillage',
      subCategories: [
        { name: 'Teint', sizeSystem: 'none' },
        { name: 'Yeux', sizeSystem: 'none' },
        { name: 'Lèvres', sizeSystem: 'none' },
        { name: 'Ongles', sizeSystem: 'none' },
      ],
    },
    {
      name: 'Coiffure & Accessoires',
      subCategories: [
        { name: 'Accessoires cheveux', sizeSystem: 'one_size' },
        { name: 'Outils coiffure', sizeSystem: 'none' },
      ],
    },
  ],

  Sport: [
    {
      name: 'Running & Athlétisme',
      subCategories: [
        { name: 'Chaussures running', sizeSystem: 'pointures' },
        { name: 'Tenues running', sizeSystem: 'letters' },
        { name: 'Accessoires running', sizeSystem: 'one_size' },
      ],
    },
    {
      name: 'Football & Sports collectifs',
      subCategories: [
        { name: 'Maillots', sizeSystem: 'letters' },
        { name: 'Shorts & Survêtements', sizeSystem: 'letters' },
        { name: 'Chaussures football', sizeSystem: 'pointures' },
        { name: 'Équipement & Accessoires', sizeSystem: 'one_size' },
      ],
    },
    {
      name: 'Tennis & Raquettes',
      subCategories: [
        { name: 'Raquettes', sizeSystem: 'none' },
        { name: 'Chaussures tennis', sizeSystem: 'pointures' },
        { name: 'Tenues tennis', sizeSystem: 'letters' },
      ],
    },
    {
      name: 'Ski & Sports d\'hiver',
      subCategories: [
        { name: 'Vestes de ski', sizeSystem: 'letters' },
        { name: 'Pantalons de ski', sizeSystem: 'letters' },
        { name: 'Accessoires ski', sizeSystem: 'one_size' },
      ],
    },
    {
      name: 'Fitness & Musculation',
      subCategories: [
        { name: 'Tenues fitness', sizeSystem: 'letters' },
        { name: 'Équipement musculation', sizeSystem: 'none' },
        { name: 'Chaussures fitness', sizeSystem: 'pointures' },
      ],
    },
    {
      name: 'Sports aquatiques',
      subCategories: [
        { name: 'Maillots de bain sport', sizeSystem: 'letters' },
        { name: 'Combinaisons', sizeSystem: 'letters' },
        { name: 'Accessoires natation', sizeSystem: 'one_size' },
      ],
    },
    {
      name: 'Vélo & Cyclisme',
      subCategories: [
        { name: 'Tenues vélo', sizeSystem: 'letters' },
        { name: 'Casques', sizeSystem: 'one_size' },
        { name: 'Accessoires vélo', sizeSystem: 'none' },
      ],
    },
  ],
}

export const SIZES: Record<SizeSystem, string[]> = {
  letters:    ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
  eu_femme:   ['32', '34', '36', '38', '40', '42', '44', '46', '48', '50'],
  eu_homme:   ['44', '46', '48', '50', '52', '54', '56'],
  jeans:      ['28', '30', '32', '34', '36', '38', '40', '42'],
  pointures:  ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48'],
  enfant_age: ['0-3 mois', '3-6 mois', '6-9 mois', '9-12 mois', '12-18 mois', '18-24 mois', '2 ans', '3 ans', '4 ans', '5 ans', '6 ans', '7 ans', '8 ans', '9 ans', '10 ans', '11 ans', '12 ans', '13 ans', '14 ans'],
  enfant_cm:  ['50', '56', '62', '68', '74', '80', '86', '92', '98', '104', '110', '116', '122', '128', '134', '140', '146', '152', '158', '164'],
  one_size:   ['Taille unique'],
  none:       [],
}

export const COLORS: string[] = [
  'Noir', 'Gris', 'Blanc', 'Crème', 'Beige', 'Abricot', 'Orange', 'Corail',
  'Rouge', 'Bordeaux', 'Fuchsia', 'Rose', 'Violet', 'Lila', 'Bleu clair',
  'Bleu', 'Marine', 'Turquoise', 'Menthe', 'Vert', 'Vert foncé', 'Kaki',
  'Marron', 'Moutarde', 'Jaune', 'Argenté', 'Doré', 'Multicolore', 'Transparence',
]

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

export const CONDITIONS = [
  { id: 'new_tags',    label: 'Neuf avec étiquette',   desc: 'Jamais porté/utilisé, étiquettes ou emballage d\'origine' },
  { id: 'new_no_tags', label: 'Neuf sans étiquette',   desc: 'Jamais porté/utilisé, sans étiquettes ni emballage' },
  { id: 'very_good',   label: 'Très bon état',          desc: 'Très peu porté/utilisé, légères imperfections possibles' },
  { id: 'good',        label: 'Bon état',               desc: 'Porté quelques fois, imperfections et signes d\'usure' },
  { id: 'fair',        label: 'Satisfaisant',           desc: 'Porté plusieurs fois, imperfections et signes d\'usure' },
] as const

export type ConditionId = typeof CONDITIONS[number]['id']

export const STYLES: string[] = [
  'Casual', 'Classique', 'Sportif', 'Chic & Élégant', 'Bohème', 'Streetwear',
  'Vintage', 'Romantique', 'Minimaliste', 'Rock', 'Preppy', 'Gothique',
]

export const PATTERNS: string[] = [
  'Uni', 'Rayures', 'Carreaux', 'Fleurs', 'Pois', 'Animal print',
  'Camouflage', 'Géométrique', 'Tie-dye', 'Broderie', 'Imprimé', 'Abstrait',
]

/* ─── Traductions taxonomie — 6 langues non-FR ───────────────────────────── */
/* Les valeurs internes restent en français. Ces maps servent à l'affichage UI */

import type { Lang } from './i18n'
type NonFrLang = Exclude<Lang, 'fr'>

export function tx(map: Partial<Record<NonFrLang, Record<string, string>>>, lang: Lang, frValue: string): string {
  if (lang === 'fr' || !frValue) return frValue
  return map[lang as NonFrLang]?.[frValue] ?? frValue
}

export const GENRE_LABELS: Record<NonFrLang, Record<string, string>> = {
  en: { 'Femme':'Women','Homme':'Men','Enfant':'Kids','Mixte':'Unisex','Maison':'Home','Électronique':'Electronics','Beauté':'Beauty','Sport':'Sport' },
  es: { 'Femme':'Mujer','Homme':'Hombre','Enfant':'Niños','Mixte':'Unisex','Maison':'Hogar','Électronique':'Electrónica','Beauté':'Belleza','Sport':'Deporte' },
  de: { 'Femme':'Damen','Homme':'Herren','Enfant':'Kinder','Mixte':'Unisex','Maison':'Zuhause','Électronique':'Elektronik','Beauté':'Beauty','Sport':'Sport' },
  it: { 'Femme':'Donna','Homme':'Uomo','Enfant':'Bambini','Mixte':'Unisex','Maison':'Casa','Électronique':'Elettronica','Beauté':'Bellezza','Sport':'Sport' },
  nl: { 'Femme':'Dames','Homme':'Heren','Enfant':'Kinderen','Mixte':'Unisex','Maison':'Thuis','Électronique':'Elektronica','Beauté':'Schoonheid','Sport':'Sport' },
  pl: { 'Femme':'Kobiety','Homme':'Mężczyźni','Enfant':'Dzieci','Mixte':'Unisex','Maison':'Dom','Électronique':'Elektronika','Beauté':'Uroda','Sport':'Sport' },
}

export const CONDITION_LABELS: Record<NonFrLang, Record<string, string>> = {
  en: { 'Neuf avec étiquette':'New with tags','Neuf sans étiquette':'New without tags','Très bon état':'Very good condition','Bon état':'Good condition','Satisfaisant':'Satisfactory' },
  es: { 'Neuf avec étiquette':'Nuevo con etiqueta','Neuf sans étiquette':'Nuevo sin etiqueta','Très bon état':'Muy buen estado','Bon état':'Buen estado','Satisfaisant':'Aceptable' },
  de: { 'Neuf avec étiquette':'Neu mit Etikett','Neuf sans étiquette':'Neu ohne Etikett','Très bon état':'Sehr guter Zustand','Bon état':'Guter Zustand','Satisfaisant':'Befriedigend' },
  it: { 'Neuf avec étiquette':'Nuovo con etichetta','Neuf sans étiquette':'Nuovo senza etichetta','Très bon état':'Ottime condizioni','Bon état':'Buone condizioni','Satisfaisant':'Accettabile' },
  nl: { 'Neuf avec étiquette':'Nieuw met label','Neuf sans étiquette':'Nieuw zonder label','Très bon état':'Zeer goede staat','Bon état':'Goede staat','Satisfaisant':'Voldoende' },
  pl: { 'Neuf avec étiquette':'Nowe z metką','Neuf sans étiquette':'Nowe bez metki','Très bon état':'Bardzo dobry stan','Bon état':'Dobry stan','Satisfaisant':'Zadowalający' },
}

export const COLOR_LABELS: Record<NonFrLang, Record<string, string>> = {
  en: { 'Noir':'Black','Gris':'Grey','Blanc':'White','Crème':'Cream','Beige':'Beige','Abricot':'Apricot','Orange':'Orange','Corail':'Coral','Rouge':'Red','Bordeaux':'Burgundy','Fuchsia':'Fuchsia','Rose':'Pink','Violet':'Purple','Lila':'Lilac','Bleu clair':'Light blue','Bleu':'Blue','Marine':'Navy blue','Turquoise':'Turquoise','Menthe':'Mint','Vert':'Green','Vert foncé':'Dark green','Kaki':'Khaki','Marron':'Brown','Moutarde':'Mustard','Jaune':'Yellow','Argenté':'Silver','Doré':'Gold','Multicolore':'Multicolour','Transparence':'Transparent' },
  es: { 'Noir':'Negro','Gris':'Gris','Blanc':'Blanco','Crème':'Crema','Beige':'Beige','Abricot':'Albaricoque','Orange':'Naranja','Corail':'Coral','Rouge':'Rojo','Bordeaux':'Burdeos','Fuchsia':'Fucsia','Rose':'Rosa','Violet':'Violeta','Lila':'Lila','Bleu clair':'Azul claro','Bleu':'Azul','Marine':'Azul marino','Turquoise':'Turquesa','Menthe':'Menta','Vert':'Verde','Vert foncé':'Verde oscuro','Kaki':'Caqui','Marron':'Marrón','Moutarde':'Mostaza','Jaune':'Amarillo','Argenté':'Plateado','Doré':'Dorado','Multicolore':'Multicolor','Transparence':'Transparente' },
  de: { 'Noir':'Schwarz','Gris':'Grau','Blanc':'Weiß','Crème':'Creme','Beige':'Beige','Abricot':'Aprikot','Orange':'Orange','Corail':'Koralle','Rouge':'Rot','Bordeaux':'Bordeaux','Fuchsia':'Fuchsia','Rose':'Rosa','Violet':'Lila','Lila':'Flieder','Bleu clair':'Hellblau','Bleu':'Blau','Marine':'Marineblau','Turquoise':'Türkis','Menthe':'Mint','Vert':'Grün','Vert foncé':'Dunkelgrün','Kaki':'Khaki','Marron':'Braun','Moutarde':'Senf','Jaune':'Gelb','Argenté':'Silber','Doré':'Gold','Multicolore':'Mehrfarbig','Transparence':'Transparent' },
  it: { 'Noir':'Nero','Gris':'Grigio','Blanc':'Bianco','Crème':'Crema','Beige':'Beige','Abricot':'Albicocca','Orange':'Arancione','Corail':'Corallo','Rouge':'Rosso','Bordeaux':'Bordeaux','Fuchsia':'Fucsia','Rose':'Rosa','Violet':'Viola','Lila':'Lilla','Bleu clair':'Azzurro','Bleu':'Blu','Marine':'Blu navy','Turquoise':'Turchese','Menthe':'Menta','Vert':'Verde','Vert foncé':'Verde scuro','Kaki':'Kaki','Marron':'Marrone','Moutarde':'Senape','Jaune':'Giallo','Argenté':'Argento','Doré':'Oro','Multicolore':'Multicolore','Transparence':'Trasparente' },
  nl: { 'Noir':'Zwart','Gris':'Grijs','Blanc':'Wit','Crème':'Crème','Beige':'Beige','Abricot':'Abrikoos','Orange':'Oranje','Corail':'Koraal','Rouge':'Rood','Bordeaux':'Bordeaux','Fuchsia':'Fuchsia','Rose':'Roze','Violet':'Paars','Lila':'Lila','Bleu clair':'Lichtblauw','Bleu':'Blauw','Marine':'Marine','Turquoise':'Turkoois','Menthe':'Mint','Vert':'Groen','Vert foncé':'Donkergroen','Kaki':'Khaki','Marron':'Bruin','Moutarde':'Mosterd','Jaune':'Geel','Argenté':'Zilver','Doré':'Goud','Multicolore':'Multicolor','Transparence':'Transparant' },
  pl: { 'Noir':'Czarny','Gris':'Szary','Blanc':'Biały','Crème':'Kremowy','Beige':'Beżowy','Abricot':'Morelowy','Orange':'Pomarańczowy','Corail':'Koralowy','Rouge':'Czerwony','Bordeaux':'Bordowy','Fuchsia':'Fuksjowy','Rose':'Różowy','Violet':'Fioletowy','Lila':'Lila','Bleu clair':'Jasnoniebieski','Bleu':'Niebieski','Marine':'Granatowy','Turquoise':'Turkusowy','Menthe':'Miętowy','Vert':'Zielony','Vert foncé':'Ciemnozielony','Kaki':'Khaki','Marron':'Brązowy','Moutarde':'Musztardowy','Jaune':'Żółty','Argenté':'Srebrny','Doré':'Złoty','Multicolore':'Wielokolorowy','Transparence':'Przezroczysty' },
}

export const MATERIAL_LABELS: Record<NonFrLang, Record<string, string>> = {
  en: { 'Acier':'Steel','Acrylique':'Acrylic','Alpaga':'Alpaca','Argent':'Silver','Bambou':'Bamboo','Bois':'Wood','Cachemire':'Cashmere','Caoutchouc':'Rubber','Carton':'Cardboard','Coton':'Cotton','Cuir':'Leather','Cuir synthétique':'Faux leather','Cuir verni':'Patent leather','Céramique':'Ceramic','Daim':'Suede','Denim':'Denim','Dentelle':'Lace','Duvet':'Down','Fausse fourrure':'Faux fur','Feutre':'Felt','Flanelle':'Flannel','Jute':'Jute','Laine':'Wool','Latex':'Latex','Lin':'Linen','Maille':'Knit','Mohair':'Mohair','Mousse':'Foam','Mousseline':'Muslin','Mérinos':'Merino','Métal':'Metal','Nylon':'Nylon','Néoprène':'Neoprene','Or':'Gold','Paille':'Straw','Papier':'Paper','Peluche':'Plush','Pierre':'Stone','Plastique':'Plastic','Polaire':'Fleece','Polyester':'Polyester','Porcelaine':'Porcelain','Rotin':'Rattan','Satin':'Satin','Sequin':'Sequin','Silicone':'Silicone','Soie':'Silk','Toile':'Canvas','Tulle':'Tulle','Tweed':'Tweed','Velours':'Velvet','Velours côtelé':'Corduroy','Verre':'Glass','Viscose':'Viscose','Élasthanne':'Elastane' },
  es: { 'Acier':'Acero','Acrylique':'Acrílico','Alpaga':'Alpaca','Argent':'Plata','Bambou':'Bambú','Bois':'Madera','Cachemire':'Cachemira','Caoutchouc':'Caucho','Carton':'Cartón','Coton':'Algodón','Cuir':'Cuero','Cuir synthétique':'Cuero sintético','Cuir verni':'Cuero barnizado','Céramique':'Cerámica','Daim':'Ante','Denim':'Denim','Dentelle':'Encaje','Duvet':'Plumón','Fausse fourrure':'Piel sintética','Feutre':'Fieltro','Flanelle':'Franela','Jute':'Yute','Laine':'Lana','Latex':'Látex','Lin':'Lino','Maille':'Punto','Mohair':'Mohair','Mousse':'Espuma','Mousseline':'Muselina','Mérinos':'Merino','Métal':'Metal','Nylon':'Nailon','Néoprène':'Neopreno','Or':'Oro','Paille':'Paja','Papier':'Papel','Peluche':'Peluche','Pierre':'Piedra','Plastique':'Plástico','Polaire':'Polar','Polyester':'Poliéster','Porcelaine':'Porcelana','Rotin':'Ratán','Satin':'Satén','Sequin':'Lentejuela','Silicone':'Silicona','Soie':'Seda','Toile':'Tela','Tulle':'Tul','Tweed':'Tweed','Velours':'Terciopelo','Velours côtelé':'Pana','Verre':'Vidrio','Viscose':'Viscosa','Élasthanne':'Elastano' },
  de: { 'Acier':'Stahl','Acrylique':'Acryl','Alpaga':'Alpaka','Argent':'Silber','Bambou':'Bambus','Bois':'Holz','Cachemire':'Kaschmir','Caoutchouc':'Gummi','Carton':'Karton','Coton':'Baumwolle','Cuir':'Leder','Cuir synthétique':'Kunstleder','Cuir verni':'Lackleder','Céramique':'Keramik','Daim':'Wildleder','Denim':'Denim','Dentelle':'Spitze','Duvet':'Daunen','Fausse fourrure':'Kunstpelz','Feutre':'Filz','Flanelle':'Flanell','Jute':'Jute','Laine':'Wolle','Latex':'Latex','Lin':'Leinen','Maille':'Strick','Mohair':'Mohair','Mousse':'Schaum','Mousseline':'Musselin','Mérinos':'Merino','Métal':'Metall','Nylon':'Nylon','Néoprène':'Neopren','Or':'Gold','Paille':'Stroh','Papier':'Papier','Peluche':'Plüsch','Pierre':'Stein','Plastique':'Plastik','Polaire':'Fleece','Polyester':'Polyester','Porcelaine':'Porzellan','Rotin':'Rattan','Satin':'Satin','Sequin':'Paillette','Silicone':'Silikon','Soie':'Seide','Toile':'Leinwand','Tulle':'Tüll','Tweed':'Tweed','Velours':'Samt','Velours côtelé':'Cord','Verre':'Glas','Viscose':'Viskose','Élasthanne':'Elasthan' },
  it: { 'Acier':'Acciaio','Acrylique':'Acrilico','Alpaga':'Alpaca','Argent':'Argento','Bambou':'Bambù','Bois':'Legno','Cachemire':'Cashmere','Caoutchouc':'Gomma','Carton':'Cartone','Coton':'Cotone','Cuir':'Pelle','Cuir synthétique':'Pelle sintetica','Cuir verni':'Pelle verniciata','Céramique':'Ceramica','Daim':'Scamosciato','Denim':'Denim','Dentelle':'Pizzo','Duvet':'Piumino','Fausse fourrure':'Pelliccia sintetica','Feutre':'Feltro','Flanelle':'Flanella','Jute':'Juta','Laine':'Lana','Latex':'Lattice','Lin':'Lino','Maille':'Maglia','Mohair':'Mohair','Mousse':'Schiuma','Mousseline':'Mussola','Mérinos':'Merino','Métal':'Metallo','Nylon':'Nylon','Néoprène':'Neoprene','Or':'Oro','Paille':'Paglia','Papier':'Carta','Peluche':'Peluche','Pierre':'Pietra','Plastique':'Plastica','Polaire':'Pile','Polyester':'Poliestere','Porcelaine':'Porcellana','Rotin':'Rattan','Satin':'Raso','Sequin':'Paillette','Silicone':'Silicone','Soie':'Seta','Toile':'Tela','Tulle':'Tulle','Tweed':'Tweed','Velours':'Velluto','Velours côtelé':'Velluto a coste','Verre':'Vetro','Viscose':'Viscosa','Élasthanne':'Elastan' },
  nl: { 'Acier':'Staal','Acrylique':'Acryl','Alpaga':'Alpaca','Argent':'Zilver','Bambou':'Bamboe','Bois':'Hout','Cachemire':'Kasjmier','Caoutchouc':'Rubber','Carton':'Karton','Coton':'Katoen','Cuir':'Leer','Cuir synthétique':'Nepleer','Cuir verni':'Lakleer','Céramique':'Keramiek','Daim':'Suède','Denim':'Denim','Dentelle':'Kant','Duvet':'Dons','Fausse fourrure':'Imitatiebont','Feutre':'Vilt','Flanelle':'Flanel','Jute':'Jute','Laine':'Wol','Latex':'Latex','Lin':'Linnen','Maille':'Gebreid','Mohair':'Mohair','Mousse':'Schuim','Mousseline':'Mousseline','Mérinos':'Merino','Métal':'Metaal','Nylon':'Nylon','Néoprène':'Neopreen','Or':'Goud','Paille':'Stro','Papier':'Papier','Peluche':'Pluche','Pierre':'Steen','Plastique':'Plastic','Polaire':'Fleece','Polyester':'Polyester','Porcelaine':'Porselein','Rotin':'Rotan','Satin':'Satijn','Sequin':'Paillette','Silicone':'Siliconen','Soie':'Zijde','Toile':'Canvas','Tulle':'Tule','Tweed':'Tweed','Velours':'Fluweel','Velours côtelé':'Ribfluweel','Verre':'Glas','Viscose':'Viscose','Élasthanne':'Elastaan' },
  pl: { 'Acier':'Stal','Acrylique':'Akryl','Alpaga':'Alpaka','Argent':'Srebro','Bambou':'Bambus','Bois':'Drewno','Cachemire':'Kaszmir','Caoutchouc':'Guma','Carton':'Karton','Coton':'Bawełna','Cuir':'Skóra','Cuir synthétique':'Skóra ekologiczna','Cuir verni':'Lakierowana skóra','Céramique':'Ceramika','Daim':'Zamsz','Denim':'Denim','Dentelle':'Koronka','Duvet':'Puch','Fausse fourrure':'Sztuczne futro','Feutre':'Filc','Flanelle':'Flanela','Jute':'Juta','Laine':'Wełna','Latex':'Lateks','Lin':'Len','Maille':'Dzianina','Mohair':'Mohair','Mousse':'Pianka','Mousseline':'Muślin','Mérinos':'Merino','Métal':'Metal','Nylon':'Nylon','Néoprène':'Neopren','Or':'Złoto','Paille':'Słoma','Papier':'Papier','Peluche':'Plusz','Pierre':'Kamień','Plastique':'Plastik','Polaire':'Polar','Polyester':'Poliester','Porcelaine':'Porcelana','Rotin':'Rattan','Satin':'Satyna','Sequin':'Cekin','Silicone':'Silikon','Soie':'Jedwab','Toile':'Płótno','Tulle':'Tiul','Tweed':'Tweed','Velours':'Aksamit','Velours côtelé':'Sztruks','Verre':'Szkło','Viscose':'Wiskoza','Élasthanne':'Elastan' },
}

export const STYLE_LABELS: Record<NonFrLang, Record<string, string>> = {
  en: { 'Casual':'Casual','Classique':'Classic','Sportif':'Sporty','Chic & Élégant':'Chic & Elegant','Bohème':'Bohemian','Streetwear':'Streetwear','Vintage':'Vintage','Romantique':'Romantic','Minimaliste':'Minimalist','Rock':'Rock','Preppy':'Preppy','Gothique':'Gothic' },
  es: { 'Casual':'Casual','Classique':'Clásico','Sportif':'Deportivo','Chic & Élégant':'Chic y elegante','Bohème':'Bohemio','Streetwear':'Streetwear','Vintage':'Vintage','Romantique':'Romántico','Minimaliste':'Minimalista','Rock':'Rock','Preppy':'Preppy','Gothique':'Gótico' },
  de: { 'Casual':'Casual','Classique':'Klassisch','Sportif':'Sportlich','Chic & Élégant':'Schick & Elegant','Bohème':'Böhmisch','Streetwear':'Streetwear','Vintage':'Vintage','Romantique':'Romantisch','Minimaliste':'Minimalistisch','Rock':'Rock','Preppy':'Preppy','Gothique':'Gotisch' },
  it: { 'Casual':'Casual','Classique':'Classico','Sportif':'Sportivo','Chic & Élégant':'Chic & Elegante','Bohème':'Bohémien','Streetwear':'Streetwear','Vintage':'Vintage','Romantique':'Romantico','Minimaliste':'Minimalista','Rock':'Rock','Preppy':'Preppy','Gothique':'Gotico' },
  nl: { 'Casual':'Casual','Classique':'Klassiek','Sportif':'Sportief','Chic & Élégant':'Chic & Elegant','Bohème':'Boheems','Streetwear':'Streetwear','Vintage':'Vintage','Romantique':'Romantisch','Minimaliste':'Minimalistisch','Rock':'Rock','Preppy':'Preppy','Gothique':'Gothic' },
  pl: { 'Casual':'Casual','Classique':'Klasyczny','Sportif':'Sportowy','Chic & Élégant':'Szykowny i elegancki','Bohème':'Bohema','Streetwear':'Streetwear','Vintage':'Vintage','Romantique':'Romantyczny','Minimaliste':'Minimalistyczny','Rock':'Rock','Preppy':'Preppy','Gothique':'Gotycki' },
}

export const PATTERN_LABELS: Record<NonFrLang, Record<string, string>> = {
  en: { 'Uni':'Plain','Rayures':'Stripes','Carreaux':'Check','Fleurs':'Floral','Pois':'Polka dots','Animal print':'Animal print','Camouflage':'Camouflage','Géométrique':'Geometric','Tie-dye':'Tie-dye','Broderie':'Embroidery','Imprimé':'Print','Abstrait':'Abstract' },
  es: { 'Uni':'Liso','Rayures':'Rayas','Carreaux':'Cuadros','Fleurs':'Flores','Pois':'Lunares','Animal print':'Animal print','Camouflage':'Camuflaje','Géométrique':'Geométrico','Tie-dye':'Tie-dye','Broderie':'Bordado','Imprimé':'Estampado','Abstrait':'Abstracto' },
  de: { 'Uni':'Uni','Rayures':'Streifen','Carreaux':'Kariert','Fleurs':'Blumen','Pois':'Punkte','Animal print':'Animal-Print','Camouflage':'Camouflage','Géométrique':'Geometrisch','Tie-dye':'Tie-Dye','Broderie':'Stickerei','Imprimé':'Bedruckt','Abstrait':'Abstrakt' },
  it: { 'Uni':'Tinta unita','Rayures':'Righe','Carreaux':'Scacchi','Fleurs':'Fiori','Pois':'Pois','Animal print':'Animal print','Camouflage':'Camouflage','Géométrique':'Geometrico','Tie-dye':'Tie-dye','Broderie':'Ricamo','Imprimé':'Stampato','Abstrait':'Astratto' },
  nl: { 'Uni':'Effen','Rayures':'Gestreept','Carreaux':'Geblokt','Fleurs':'Bloemen','Pois':'Stippen','Animal print':'Animal print','Camouflage':'Camouflage','Géométrique':'Geometrisch','Tie-dye':'Tie-dye','Broderie':'Borduurwerk','Imprimé':'Print','Abstrait':'Abstract' },
  pl: { 'Uni':'Jednolity','Rayures':'Paski','Carreaux':'Kratka','Fleurs':'Kwiaty','Pois':'Groszki','Animal print':'Animal print','Camouflage':'Moro','Géométrique':'Geometryczny','Tie-dye':'Tie-dye','Broderie':'Haft','Imprimé':'Nadruk','Abstrait':'Abstrakcyjny' },
}

export const CATEGORY_LABELS: Record<NonFrLang, Record<string, string>> = {
  en: { 'Hauts & T-shirts':'Tops & T-shirts','Robes':'Dresses','Jupes':'Skirts','Pantalons & Jeans':'Trousers & Jeans','Vestes & Manteaux':'Jackets & Coats','Chaussures':'Shoes','Sacs':'Bags','Accessoires':'Accessories','Bijoux':'Jewellery','Montres':'Watches','Maillots de bain':'Swimwear','Sport & Gym':'Sport & Gym','Lingerie & Pyjamas':'Lingerie & Pyjamas','Maternité':'Maternity','Bijoux & Montres':'Jewellery & Watches','Sous-vêtements & Pyjamas':'Underwear & Pyjamas','Sport':'Sport','Bébé (0-24 mois)':'Baby (0-24 months)','Fille (2-14 ans)':'Girl (2-14 years)','Garçon (2-14 ans)':'Boy (2-14 years)','Enfant Mixte':'Unisex Kids','Streetwear & Unisexe':'Streetwear & Unisex','Meubles':'Furniture','Déco & Objets':'Decor & Objects','Linge de maison':'Home textiles','Cuisine':'Kitchen','Jardin & Extérieur':'Garden & Outdoor','Téléphones & Tablettes':'Phones & Tablets','Informatique':'Computers','Jeux vidéo & Consoles':'Video games & Consoles','Audio & Musique':'Audio & Music','Photo & Vidéo':'Photo & Video','Parfums':'Perfumes','Soins & Skincare':'Skincare','Maquillage':'Make-up','Coiffure & Accessoires':'Hair & Accessories','Running & Athlétisme':'Running & Athletics','Football & Sports collectifs':'Football & Team sports',"Tennis & Raquettes":"Tennis & Racket sports","Ski & Sports d'hiver":"Ski & Winter sports",'Fitness & Musculation':'Fitness & Gym','Sports aquatiques':'Water sports','Vélo & Cyclisme':'Cycling' },
  es: { 'Hauts & T-shirts':'Tops y camisetas','Robes':'Vestidos','Jupes':'Faldas','Pantalons & Jeans':'Pantalones y vaqueros','Vestes & Manteaux':'Chaquetas y abrigos','Chaussures':'Zapatos','Sacs':'Bolsos','Accessoires':'Accesorios','Bijoux':'Joyería','Montres':'Relojes','Maillots de bain':'Trajes de baño','Sport & Gym':'Deporte y gimnasio','Lingerie & Pyjamas':'Lencería y pijamas','Maternité':'Premamá','Bijoux & Montres':'Joyería y relojes','Sous-vêtements & Pyjamas':'Ropa interior y pijamas','Sport':'Deporte','Bébé (0-24 mois)':'Bebé (0-24 meses)','Fille (2-14 ans)':'Niña (2-14 años)','Garçon (2-14 ans)':'Niño (2-14 años)','Enfant Mixte':'Niño unisex','Streetwear & Unisexe':'Streetwear y unisex','Meubles':'Muebles','Déco & Objets':'Decoración','Linge de maison':'Ropa de cama','Cuisine':'Cocina','Jardin & Extérieur':'Jardín','Téléphones & Tablettes':'Teléfonos y tablets','Informatique':'Informática','Jeux vidéo & Consoles':'Videojuegos y consolas','Audio & Musique':'Audio y música','Photo & Vidéo':'Foto y vídeo','Parfums':'Perfumes','Soins & Skincare':'Cuidado de la piel','Maquillage':'Maquillaje','Coiffure & Accessoires':'Cabello y accesorios','Running & Athlétisme':'Running y atletismo','Football & Sports collectifs':'Fútbol y deportes colectivos',"Tennis & Raquettes":"Tenis y raqueta","Ski & Sports d'hiver":"Esquí y deportes de invierno",'Fitness & Musculation':'Fitness y musculación','Sports aquatiques':'Deportes acuáticos','Vélo & Cyclisme':'Ciclismo' },
  de: { 'Hauts & T-shirts':'Tops & T-Shirts','Robes':'Kleider','Jupes':'Röcke','Pantalons & Jeans':'Hosen & Jeans','Vestes & Manteaux':'Jacken & Mäntel','Chaussures':'Schuhe','Sacs':'Taschen','Accessoires':'Accessoires','Bijoux':'Schmuck','Montres':'Uhren','Maillots de bain':'Bademode','Sport & Gym':'Sport & Fitness','Lingerie & Pyjamas':'Dessous & Schlafanzüge','Maternité':'Umstandsmode','Bijoux & Montres':'Schmuck & Uhren','Sous-vêtements & Pyjamas':'Unterwäsche & Schlafanzüge','Sport':'Sport','Bébé (0-24 mois)':'Baby (0-24 Monate)','Fille (2-14 ans)':'Mädchen (2-14 Jahre)','Garçon (2-14 ans)':'Jungen (2-14 Jahre)','Enfant Mixte':'Unisex-Kinder','Streetwear & Unisexe':'Streetwear & Unisex','Meubles':'Möbel','Déco & Objets':'Deko & Objekte','Linge de maison':'Heimtextilien','Cuisine':'Küche','Jardin & Extérieur':'Garten & Outdoor','Téléphones & Tablettes':'Handys & Tablets','Informatique':'Computer','Jeux vidéo & Consoles':'Videospiele & Konsolen','Audio & Musique':'Audio & Musik','Photo & Vidéo':'Foto & Video','Parfums':'Parfums','Soins & Skincare':'Hautpflege','Maquillage':'Make-up','Coiffure & Accessoires':'Haare & Accessoires','Running & Athlétisme':'Laufen & Leichtathletik','Football & Sports collectifs':'Fußball & Mannschaftssport',"Tennis & Raquettes":"Tennis & Schlägersport","Ski & Sports d'hiver":"Ski & Wintersport",'Fitness & Musculation':'Fitness & Bodybuilding','Sports aquatiques':'Wassersport','Vélo & Cyclisme':'Radfahren' },
  it: { 'Hauts & T-shirts':'Top e T-shirt','Robes':'Abiti','Jupes':'Gonne','Pantalons & Jeans':'Pantaloni e jeans','Vestes & Manteaux':'Giacche e cappotti','Chaussures':'Scarpe','Sacs':'Borse','Accessoires':'Accessori','Bijoux':'Gioielli','Montres':'Orologi','Maillots de bain':'Costumi da bagno','Sport & Gym':'Sport e palestra','Lingerie & Pyjamas':'Lingerie e pigiami','Maternité':'Premaman','Bijoux & Montres':'Gioielli e orologi','Sous-vêtements & Pyjamas':'Intimo e pigiami','Sport':'Sport','Bébé (0-24 mois)':'Neonato (0-24 mesi)','Fille (2-14 ans)':'Bambina (2-14 anni)','Garçon (2-14 ans)':'Bambino (2-14 anni)','Enfant Mixte':'Bambini unisex','Streetwear & Unisexe':'Streetwear e unisex','Meubles':'Mobili','Déco & Objets':'Decorazione','Linge de maison':'Biancheria per la casa','Cuisine':'Cucina','Jardin & Extérieur':'Giardino','Téléphones & Tablettes':'Telefoni e tablet','Informatique':'Informatica','Jeux vidéo & Consoles':'Videogiochi e console','Audio & Musique':'Audio e musica','Photo & Vidéo':'Foto e video','Parfums':'Profumi','Soins & Skincare':'Cura della pelle','Maquillage':'Make-up','Coiffure & Accessoires':'Capelli e accessori','Running & Athlétisme':'Running e atletismo','Football & Sports collectifs':'Calcio e sport di squadra',"Tennis & Raquettes":"Tennis e racchette","Ski & Sports d'hiver":"Sci e sport invernali",'Fitness & Musculation':'Fitness e palestra','Sports aquatiques':'Sport acquatici','Vélo & Cyclisme':'Ciclismo' },
  nl: { 'Hauts & T-shirts':"Tops & T-shirts",'Robes':'Jurken','Jupes':'Rokken','Pantalons & Jeans':'Broeken & Jeans','Vestes & Manteaux':'Jassen & Mantels','Chaussures':'Schoenen','Sacs':'Tassen','Accessoires':'Accessoires','Bijoux':'Sieraden','Montres':'Horloges','Maillots de bain':'Zwemkleding','Sport & Gym':'Sport & Gym','Lingerie & Pyjamas':"Lingerie & pyjama's",'Maternité':'Zwangerschapskleding','Bijoux & Montres':'Sieraden & horloges','Sous-vêtements & Pyjamas':"Ondergoed & pyjama's",'Sport':'Sport','Bébé (0-24 mois)':"Baby (0-24 maanden)",'Fille (2-14 ans)':'Meisje (2-14 jaar)','Garçon (2-14 ans)':'Jongen (2-14 jaar)','Enfant Mixte':'Unisex kinderen','Streetwear & Unisexe':'Streetwear & Unisex','Meubles':'Meubels','Déco & Objets':'Decoratie','Linge de maison':'Huishoudtextiel','Cuisine':'Keuken','Jardin & Extérieur':'Tuin & buiten','Téléphones & Tablettes':'Telefoons & tablets','Informatique':'Computers','Jeux vidéo & Consoles':'Videogames & consoles','Audio & Musique':'Audio & muziek','Photo & Vidéo':'Foto & video','Parfums':'Parfums','Soins & Skincare':'Huidverzorging','Maquillage':'Make-up','Coiffure & Accessoires':'Haar & accessoires','Running & Athlétisme':'Hardlopen & atletiek','Football & Sports collectifs':'Voetbal & teamsport',"Tennis & Raquettes":"Tennis & racketsporten","Ski & Sports d'hiver":"Ski & wintersport",'Fitness & Musculation':'Fitness & krachttraining','Sports aquatiques':'Watersporten','Vélo & Cyclisme':'Fietsen' },
  pl: { 'Hauts & T-shirts':'Topy i koszulki','Robes':'Sukienki','Jupes':'Spódnice','Pantalons & Jeans':'Spodnie i dżinsy','Vestes & Manteaux':'Kurtki i płaszcze','Chaussures':'Buty','Sacs':'Torebki','Accessoires':'Akcesoria','Bijoux':'Biżuteria','Montres':'Zegarki','Maillots de bain':'Stroje kąpielowe','Sport & Gym':'Sport i siłownia','Lingerie & Pyjamas':'Bielizna i piżamy','Maternité':'Odzież ciążowa','Bijoux & Montres':'Biżuteria i zegarki','Sous-vêtements & Pyjamas':'Bielizna i piżamy','Sport':'Sport','Bébé (0-24 mois)':'Niemowlęta (0-24 m-ce)','Fille (2-14 ans)':'Dziewczynka (2-14 lat)','Garçon (2-14 ans)':'Chłopiec (2-14 lat)','Enfant Mixte':'Unisex dzieci','Streetwear & Unisexe':'Streetwear i unisex','Meubles':'Meble','Déco & Objets':'Dekoracje','Linge de maison':'Tekstylia domowe','Cuisine':'Kuchnia','Jardin & Extérieur':'Ogród','Téléphones & Tablettes':'Telefony i tablety','Informatique':'Komputery','Jeux vidéo & Consoles':'Gry i konsole','Audio & Musique':'Audio i muzyka','Photo & Vidéo':'Foto i wideo','Parfums':'Perfumy','Soins & Skincare':'Pielęgnacja skóry','Maquillage':'Make-up','Coiffure & Accessoires':'Fryzury i akcesoria','Running & Athlétisme':'Bieganie i lekkoatletyka','Football & Sports collectifs':'Piłka nożna i sporty drużynowe',"Tennis & Raquettes":"Tenis i rakiety","Ski & Sports d'hiver":"Narciarstwo i sporty zimowe",'Fitness & Musculation':'Fitness i siłownia','Sports aquatiques':'Sporty wodne','Vélo & Cyclisme':'Kolarstwo' },
}

export const SUBCATEGORY_LABELS: Record<NonFrLang, Record<string, string>> = {
  en: { 'T-shirts':'T-shirts','Tops & Débardeurs':'Tops & Tanks','Chemisiers & Blouses':'Blouses','Pulls & Sweatshirts':'Jumpers & Sweatshirts','Cardigans':'Cardigans','Robes courtes':'Short dresses','Robes longues':'Maxi dresses','Robes de soirée':'Evening dresses','Robes de mariée':'Wedding dresses','Jupes courtes':'Mini skirts','Jupes longues':'Maxi skirts','Jupes mi-longues':'Midi skirts','Jeans':'Jeans','Pantalons':'Trousers','Leggings':'Leggings','Shorts & Bermudas':'Shorts & Bermudas','Combinaisons':'Jumpsuits','Joggings':'Joggers','Blazers & Vestes':'Blazers & Jackets','Manteaux':'Coats','Imperméables & Trenchs':'Raincoats & Trenches','Doudounes':'Puffer jackets','Parkas':'Parkas','Vestes en cuir':'Leather jackets','Bombers':'Bomber jackets','Baskets & Tennis':'Trainers','Bottes & Bottines':'Boots & Ankle boots','Sandales & Mules':'Sandals & Mules','Escarpins & Talons':'Heels','Ballerines & Mocassins':'Ballet flats & Loafers','Chaussures plates':'Flat shoes','Chaussures sport':'Sport shoes',"Sacs à main":'Handbags',"Sacs à dos":'Backpacks','Sacs bandoulière':'Shoulder bags','Pochettes & Clutches':'Clutches','Tote bags':'Tote bags','Sacs de voyage':'Travel bags','Valises & Bagages':'Suitcases & Luggage',"Écharpes & Foulards":'Scarves','Ceintures':'Belts','Chapeaux & Bonnets':'Hats & Beanies','Gants & Mitaines':'Gloves & Mittens','Lunettes de soleil':'Sunglasses','Collants & Chaussettes':'Tights & Socks','Cravates & Nœuds papillon':'Ties & Bow ties','Colliers & Pendentifs':'Necklaces','Bagues':'Rings',"Boucles d'oreilles":'Earrings','Bracelets':'Bracelets','Brooches & Épingles':'Brooches','Parures':'Jewellery sets','Montres classiques':'Classic watches','Montres sport':'Sport watches','Montres connectées':'Smartwatches','Bikinis':'Bikinis','Maillots 1 pièce':'One-piece swimsuits','Bas de maillot':'Bikini bottoms','Hauts de maillot':'Bikini tops','Pareos & Sarongs':'Pareos & Sarongs','T-shirts sport':'Sport T-shirts','Leggings & Shorts sport':'Sports leggings & shorts','Vestes & Sweats sport':'Sports jackets & sweatshirts','Maillots de sport':'Sports tops','Tenues yoga & pilates':'Yoga & pilates wear','Soutiens-gorge':'Bras','Culottes & Strings':'Knickers & thongs','Body':'Bodysuits','Pyjamas & Nuisettes':'Pyjamas & Nightgowns','Chaussettes & Collants':'Socks & Tights','Hauts maternité':'Maternity tops','Pantalons maternité':'Maternity trousers','Robes maternité':'Maternity dresses','Polos':'Polo shirts','Chemises':'Shirts','Débardeurs':'Tank tops','Costumes & Vestes de costume':'Suits & Blazers','Vestes en cuir & Bombers':'Leather jackets & Bombers','Mocassins & Derbies':'Loafers & Oxfords','Sandales':'Sandals','Chaussures habillées':'Formal shoes','Gants':'Gloves','Montres':'Watches','Colliers':'Necklaces','Porte-monnaie & Portefeuilles':'Wallets','Boxers & Slips':'Boxers & Briefs','Pyjamas':'Pyjamas','Chaussettes':'Socks','Shorts de bain':'Swim shorts','Slips de bain':'Swim briefs','Shorts sport':'Sport shorts','Vestes sport':'Sport jackets','Joggings sport':'Tracksuit bottoms','Maillots & Équipement':'Jerseys & Equipment','Bodys & Combinaisons':'Bodysuits & Onesies','Hauts & T-shirts':'Tops & T-shirts','Pantalons & Leggings':'Trousers & Leggings','Robes & Jupes':'Dresses & Skirts','Pyjamas & Gigoteuses':'Pyjamas & Sleep sacks','Manteaux & Doudounes':'Coats & Puffer jackets','Chaussures bébé':'Baby shoes','Accessoires bébé':'Baby accessories','T-shirts & Tops':'T-shirts & Tops','Pantalons & Jeans':'Trousers & Jeans','Pulls & Sweats':'Jumpers & Sweatshirts','Vestes & Manteaux':'Jackets & Coats','Accessoires & Bijoux':'Accessories & Jewellery','Sport':'Sport','T-shirts & Polos':'T-shirts & Polo shirts','Shorts':'Shorts','Accessoires':'Accessories','T-shirts unisexe':'Unisex T-shirts','Sweats & Hoodies':'Sweatshirts & Hoodies','Vestes':'Jackets','Pantalons & Joggings':'Trousers & Joggers','Baskets':'Trainers','Canapés & Fauteuils':'Sofas & Armchairs','Tables & Bureaux':'Tables & Desks','Lits & Cadres de lit':'Beds & Frames','Rangements & Étagères':'Storage & Shelving','Chaises':'Chairs','Coussins & Plaids':'Cushions & Blankets',"Bougies & Parfums d'ambiance":'Candles & Home fragrance','Cadres & Tableaux':'Frames & Pictures','Vases & Céramiques':'Vases & Ceramics','Miroirs':'Mirrors','Horloges':'Clocks','Draps & Parures de lit':'Bed linen','Couvre-lits & Couettes':'Bedspreads & Duvets','Serviettes & Peignoirs':'Towels & Robes','Nappes & Torchons':'Tablecloths & Kitchen towels','Vaisselle':'Crockery','Ustensiles & Accessoires':'Utensils & Accessories','Cafetières & Appareils':'Appliances','Verres & Tasses':'Glasses & Mugs','Mobilier de jardin':'Garden furniture','Plantes & Accessoires':'Plants & Accessories','Déco extérieure':'Outdoor decor','Smartphones':'Smartphones','Tablettes':'Tablets','Coques & Accessoires':'Cases & Accessories','Ordinateurs portables':'Laptops','Ordinateurs de bureau':'Desktop computers','Accessoires informatique':'Computer accessories','Consoles':'Consoles','Jeux vidéo':'Video games','Accessoires gaming':'Gaming accessories','Écouteurs & Casques':'Earphones & Headphones','Enceintes':'Speakers','Instruments de musique':'Musical instruments','Appareils photo':'Cameras','Caméras':'Camcorders','Accessoires photo':'Photo accessories','Parfums femme':"Women's perfumes",'Parfums homme':"Men's perfumes",'Eaux de toilette':'Eau de toilette','Soins visage':'Face care','Soins corps':'Body care','Soins cheveux':'Hair care','Teint':'Foundation','Yeux':'Eyes','Lèvres':'Lips','Ongles':'Nails','Accessoires cheveux':'Hair accessories','Outils coiffure':'Styling tools','Chaussures running':'Running shoes','Tenues running':'Running wear','Accessoires running':'Running accessories','Maillots':'Jerseys','Shorts & Survêtements':'Shorts & Tracksuits','Chaussures football':'Football boots','Équipement & Accessoires':'Equipment & Accessories','Raquettes':'Rackets','Chaussures tennis':'Tennis shoes','Tenues tennis':'Tennis wear','Vestes de ski':'Ski jackets','Pantalons de ski':'Ski trousers','Accessoires ski':'Ski accessories','Tenues fitness':'Fitness wear','Équipement musculation':'Gym equipment','Chaussures fitness':'Fitness shoes','Maillots de bain sport':'Sports swimwear','Accessoires natation':'Swimming accessories','Tenues vélo':'Cycling wear','Casques':'Helmets','Accessoires vélo':'Cycling accessories' },
  es: { 'T-shirts':'Camisetas','Tops & Débardeurs':'Tops y tirantes','Chemisiers & Blouses':'Blusas','Pulls & Sweatshirts':'Jerseys y sudaderas','Cardigans':'Cárdigans','Robes courtes':'Vestidos cortos','Robes longues':'Vestidos largos','Robes de soirée':'Vestidos de noche','Robes de mariée':'Vestidos de novia','Jupes courtes':'Faldas cortas','Jupes longues':'Faldas largas','Jupes mi-longues':'Faldas midi','Jeans':'Vaqueros','Pantalons':'Pantalones','Leggings':'Leggins','Shorts & Bermudas':'Shorts y bermudas','Combinaisons':'Monos','Joggings':'Joggings','Blazers & Vestes':'Blazers y chaquetas','Manteaux':'Abrigos','Imperméables & Trenchs':'Impermeables y trenchs','Doudounes':'Plumas','Parkas':'Parkas','Vestes en cuir':'Cazadoras de cuero','Bombers':'Bombers','Baskets & Tennis':'Zapatillas','Bottes & Bottines':'Botas y botines','Sandales & Mules':'Sandalias y zuecos','Escarpins & Talons':'Tacones',"Ballerines & Mocassins":'Bailarinas y mocasines','Chaussures plates':'Zapatos planos','Chaussures sport':'Zapatillas deportivas',"Sacs à main":'Bolsos',"Sacs à dos":'Mochilas','Sacs bandoulière':'Bolsos bandolera','Pochettes & Clutches':'Clutches','Tote bags':'Tote bags','Sacs de voyage':'Bolsas de viaje','Valises & Bagages':'Maletas',"Écharpes & Foulards":'Bufandas','Ceintures':'Cinturones','Chapeaux & Bonnets':'Sombreros y gorros','Gants & Mitaines':'Guantes','Lunettes de soleil':'Gafas de sol','Collants & Chaussettes':'Medias y calcetines','Cravates & Nœuds papillon':'Corbatas y pajaritas','Colliers & Pendentifs':'Collares','Bagues':'Anillos',"Boucles d'oreilles":'Pendientes','Bracelets':'Pulseras','Brooches & Épingles':'Broches','Parures':'Conjuntos de joyería','Montres classiques':'Relojes clásicos','Montres sport':'Relojes deportivos','Montres connectées':'Relojes inteligentes','Bikinis':'Bikinis','Maillots 1 pièce':'Bañadores enteros','Bas de maillot':'Braguitas de bikini','Hauts de maillot':'Tops de bikini','Pareos & Sarongs':'Pareos','T-shirts sport':'Camisetas deportivas','Leggings & Shorts sport':'Mallas y shorts deportivos','Vestes & Sweats sport':'Chaquetas y sudaderas deportivas','Maillots de sport':'Camisetas de deporte','Tenues yoga & pilates':'Ropa de yoga y pilates','Soutiens-gorge':'Sujetadores','Culottes & Strings':'Braguitas y tangas','Body':'Bodies','Pyjamas & Nuisettes':'Pijamas y camisones','Chaussettes & Collants':'Calcetines y medias','Hauts maternité':'Tops premamá','Pantalons maternité':'Pantalones premamá','Robes maternité':'Vestidos premamá','Polos':'Polos','Chemises':'Camisas','Débardeurs':'Camisetas de tirantes','Costumes & Vestes de costume':'Trajes y americanas','Vestes en cuir & Bombers':'Cazadoras y bombers','Mocassins & Derbies':'Mocasines y derbi','Sandales':'Sandalias','Chaussures habillées':'Zapatos de vestir','Gants':'Guantes','Montres':'Relojes','Colliers':'Collares','Porte-monnaie & Portefeuilles':'Carteras','Boxers & Slips':'Bóxers y slips','Pyjamas':'Pijamas','Chaussettes':'Calcetines','Shorts de bain':'Bañadores','Slips de bain':'Slips de baño','Shorts sport':'Pantalones cortos','Vestes sport':'Chaquetas deportivas','Joggings sport':'Pantalones de chándal','Maillots & Équipement':'Camisetas y equipamiento','Bodys & Combinaisons':'Bodies y peleles','Hauts & T-shirts':'Tops y camisetas','Pantalons & Leggings':'Pantalones y leggins','Robes & Jupes':'Vestidos y faldas','Pyjamas & Gigoteuses':'Pijamas y sacos de dormir','Manteaux & Doudounes':'Abrigos y plumas','Chaussures bébé':'Zapatos de bebé','Accessoires bébé':'Accesorios de bebé','T-shirts & Tops':'Camisetas y tops','Pantalons & Jeans':'Pantalones y vaqueros','Pulls & Sweats':'Jerseys y sudaderas','Vestes & Manteaux':'Chaquetas y abrigos','Accessoires & Bijoux':'Accesorios y bisutería','Sport':'Deporte','T-shirts & Polos':'Camisetas y polos','Shorts':'Shorts','Accessoires':'Accesorios','T-shirts unisexe':'Camisetas unisex','Sweats & Hoodies':'Sudaderas y hoodies','Vestes':'Chaquetas','Pantalons & Joggings':'Pantalones y joggings','Baskets':'Zapatillas','Canapés & Fauteuils':'Sofás y sillones','Tables & Bureaux':'Mesas y escritorios','Lits & Cadres de lit':'Camas','Rangements & Étagères':'Almacenamiento','Chaises':'Sillas','Coussins & Plaids':'Cojines y mantas',"Bougies & Parfums d'ambiance":'Velas y aromas','Cadres & Tableaux':'Marcos y cuadros','Vases & Céramiques':'Jarrones y cerámica','Miroirs':'Espejos','Horloges':'Relojes de pared','Draps & Parures de lit':'Ropa de cama','Couvre-lits & Couettes':'Colchas y edredones','Serviettes & Peignoirs':'Toallas y albornoces','Nappes & Torchons':'Manteles y paños','Vaisselle':'Vajilla','Ustensiles & Accessoires':'Utensilios','Cafetières & Appareils':'Electrodomésticos','Verres & Tasses':'Vasos y tazas','Mobilier de jardin':'Muebles de jardín','Plantes & Accessoires':'Plantas y accesorios','Déco extérieure':'Decoración exterior','Smartphones':'Smartphones','Tablettes':'Tablets','Coques & Accessoires':'Fundas y accesorios','Ordinateurs portables':'Portátiles','Ordinateurs de bureau':'Ordenadores de sobremesa','Accessoires informatique':'Accesorios de ordenador','Consoles':'Consolas','Jeux vidéo':'Videojuegos','Accessoires gaming':'Accesorios gaming','Écouteurs & Casques':'Auriculares','Enceintes':'Altavoces','Instruments de musique':'Instrumentos musicales','Appareils photo':'Cámaras','Caméras':'Videocámaras','Accessoires photo':'Accesorios foto','Parfums femme':'Perfumes de mujer','Parfums homme':'Perfumes de hombre','Eaux de toilette':'Agua de tocador','Soins visage':'Cuidado facial','Soins corps':'Cuidado corporal','Soins cheveux':'Cuidado del cabello','Teint':'Base','Yeux':'Ojos','Lèvres':'Labios','Ongles':'Uñas','Accessoires cheveux':'Accesorios para el pelo','Outils coiffure':'Herramientas de peluquería','Chaussures running':'Zapatillas de running','Tenues running':'Ropa de running','Accessoires running':'Accesorios de running','Maillots':'Camisetas','Shorts & Survêtements':'Pantalones cortos y chándales','Chaussures football':'Botas de fútbol','Équipement & Accessoires':'Equipamiento y accesorios','Raquettes':'Raquetas','Chaussures tennis':'Zapatillas de tenis','Tenues tennis':'Ropa de tenis','Vestes de ski':'Chaquetas de esquí','Pantalons de ski':'Pantalones de esquí','Accessoires ski':'Accesorios de esquí','Tenues fitness':'Ropa de fitness','Équipement musculation':'Equipamiento de musculación','Chaussures fitness':'Zapatillas de fitness','Maillots de bain sport':'Bañadores deportivos','Accessoires natation':'Accesorios de natación','Tenues vélo':'Ropa de ciclismo','Casques':'Cascos','Accessoires vélo':'Accesorios de ciclismo' },
  de: { 'T-shirts':'T-Shirts','Tops & Débardeurs':'Tops & Trägertops','Chemisiers & Blouses':'Blusen','Pulls & Sweatshirts':'Pullover & Sweatshirts','Cardigans':'Strickjacken','Robes courtes':'Kurze Kleider','Robes longues':'Lange Kleider','Robes de soirée':'Abendkleider','Robes de mariée':'Brautkleider','Jupes courtes':'Miniröcke','Jupes longues':'Maxiröcke','Jupes mi-longues':'Midikleider','Jeans':'Jeans','Pantalons':'Hosen','Leggings':'Leggings','Shorts & Bermudas':'Shorts & Bermudas','Combinaisons':'Overalls','Joggings':'Jogginghosen','Blazers & Vestes':'Blazer & Jacken','Manteaux':'Mäntel','Imperméables & Trenchs':'Regenmäntel & Trenchcoats','Doudounes':'Steppjacken','Parkas':'Parkas','Vestes en cuir':'Lederjacken','Bombers':'Bomberjacken','Baskets & Tennis':'Sneakers','Bottes & Bottines':'Stiefel & Stiefeletten','Sandales & Mules':'Sandalen & Mules','Escarpins & Talons':'Absatzschuhe','Ballerines & Mocassins':'Ballerinas & Loafer','Chaussures plates':'Flache Schuhe','Chaussures sport':'Sportschuhe',"Sacs à main":'Handtaschen',"Sacs à dos":'Rucksäcke','Sacs bandoulière':'Schultertaschen','Pochettes & Clutches':'Clutches','Tote bags':'Tote bags','Sacs de voyage':'Reisetaschen','Valises & Bagages':'Koffer',"Écharpes & Foulards":'Schals','Ceintures':'Gürtel','Chapeaux & Bonnets':'Hüte & Mützen','Gants & Mitaines':'Handschuhe','Lunettes de soleil':'Sonnenbrillen','Collants & Chaussettes':'Strumpfhosen & Socken','Cravates & Nœuds papillon':'Krawatten & Fliegen','Colliers & Pendentifs':'Ketten','Bagues':'Ringe',"Boucles d'oreilles":'Ohrringe','Bracelets':'Armbänder','Brooches & Épingles':'Broschen','Parures':'Schmucksets','Montres classiques':'Klassische Uhren','Montres sport':'Sportuhren','Montres connectées':'Smartwatches','Bikinis':'Bikinis','Maillots 1 pièce':'Badeanzüge','Bas de maillot':'Bikinihosen','Hauts de maillot':'Bikinitops','Pareos & Sarongs':'Pareos','T-shirts sport':'Sport-T-Shirts','Leggings & Shorts sport':'Sport-Leggings & -Shorts','Vestes & Sweats sport':'Sportjacken & -sweatshirts','Maillots de sport':'Sport-Trikots','Tenues yoga & pilates':'Yoga- & Pilates-Kleidung','Soutiens-gorge':'BHs','Culottes & Strings':'Unterwäsche & Strings','Body':'Bodies','Pyjamas & Nuisettes':'Schlafanzüge & Nachthemden','Chaussettes & Collants':'Socken & Strumpfhosen','Hauts maternité':'Umstandsoberteile','Pantalons maternité':'Umstandshosen','Robes maternité':'Umstandskleider','Polos':'Poloshirts','Chemises':'Hemden','Débardeurs':'Tanktops','Costumes & Vestes de costume':'Anzüge & Sakkos','Vestes en cuir & Bombers':'Lederjacken & Bomberjacken','Mocassins & Derbies':'Loafer & Schnürschuhe','Sandales':'Sandalen','Chaussures habillées':'Elegante Schuhe','Gants':'Handschuhe','Montres':'Uhren','Colliers':'Halsketten','Porte-monnaie & Portefeuilles':'Geldbörsen','Boxers & Slips':'Boxershorts & Slips','Pyjamas':'Schlafanzüge','Chaussettes':'Socken','Shorts de bain':'Badeshorts','Slips de bain':'Badeslips','Shorts sport':'Sportshorts','Vestes sport':'Sportjacken','Joggings sport':'Jogginganzug-Hosen','Maillots & Équipement':'Trikots & Ausrüstung','Bodys & Combinaisons':'Bodies & Strampler','Hauts & T-shirts':'Tops & T-Shirts','Pantalons & Leggings':'Hosen & Leggings','Robes & Jupes':'Kleider & Röcke','Pyjamas & Gigoteuses':'Schlafanzüge & Schlafsäcke','Manteaux & Doudounes':'Mäntel & Steppjacken','Chaussures bébé':'Babyschuhe','Accessoires bébé':'Baby-Accessoires','T-shirts & Tops':'T-Shirts & Tops','Pantalons & Jeans':'Hosen & Jeans','Pulls & Sweats':'Pullover & Sweatshirts','Vestes & Manteaux':'Jacken & Mäntel','Accessoires & Bijoux':'Accessoires & Schmuck','Sport':'Sport','T-shirts & Polos':'T-Shirts & Poloshirts','Shorts':'Shorts','Accessoires':'Accessoires','T-shirts unisexe':'Unisex-T-Shirts','Sweats & Hoodies':'Sweatshirts & Hoodies','Vestes':'Jacken','Pantalons & Joggings':'Hosen & Jogginghosen','Baskets':'Sneakers','Canapés & Fauteuils':'Sofas & Sessel','Tables & Bureaux':'Tische & Schreibtische','Lits & Cadres de lit':'Betten','Rangements & Étagères':'Aufbewahrung','Chaises':'Stühle','Coussins & Plaids':'Kissen & Decken',"Bougies & Parfums d'ambiance":'Kerzen & Raumdüfte','Cadres & Tableaux':'Rahmen & Bilder','Vases & Céramiques':'Vasen & Keramik','Miroirs':'Spiegel','Horloges':'Uhren','Draps & Parures de lit':'Bettwäsche','Couvre-lits & Couettes':'Tagesdecken & Duvets','Serviettes & Peignoirs':'Handtücher & Bademäntel','Nappes & Torchons':'Tischdecken & Geschirrtücher','Vaisselle':'Geschirr','Ustensiles & Accessoires':'Küchenutensilien','Cafetières & Appareils':'Kaffeemaschinen & Geräte','Verres & Tasses':'Gläser & Tassen','Mobilier de jardin':'Gartenmöbel','Plantes & Accessoires':'Pflanzen & Accessoires','Déco extérieure':'Außendeko','Smartphones':'Smartphones','Tablettes':'Tablets','Coques & Accessoires':'Hüllen & Zubehör','Ordinateurs portables':'Laptops','Ordinateurs de bureau':'Desktop-PCs','Accessoires informatique':'Computer-Zubehör','Consoles':'Konsolen','Jeux vidéo':'Videospiele','Accessoires gaming':'Gaming-Zubehör','Écouteurs & Casques':'Kopfhörer','Enceintes':'Lautsprecher','Instruments de musique':'Musikinstrumente','Appareils photo':'Kameras','Caméras':'Camcorder','Accessoires photo':'Foto-Zubehör','Parfums femme':'Damenparfums','Parfums homme':'Herrenparfums','Eaux de toilette':'Eau de Toilette','Soins visage':'Gesichtspflege','Soins corps':'Körperpflege','Soins cheveux':'Haarpflege','Teint':'Teint','Yeux':'Augen','Lèvres':'Lippen','Ongles':'Nägel','Accessoires cheveux':'Haarzubehör','Outils coiffure':'Friseurwerkzeuge','Chaussures running':'Laufschuhe','Tenues running':'Laufbekleidung','Accessoires running':'Laufzubehör','Maillots':'Trikots','Shorts & Survêtements':'Shorts & Trainingsanzüge','Chaussures football':'Fußballschuhe','Équipement & Accessoires':'Ausrüstung & Zubehör','Raquettes':'Schläger','Chaussures tennis':'Tennisschuhe','Tenues tennis':'Tennisbekleidung','Vestes de ski':'Skijacken','Pantalons de ski':'Skihosen','Accessoires ski':'Ski-Zubehör','Tenues fitness':'Fitnessbekleidung','Équipement musculation':'Bodybuilding-Ausrüstung','Chaussures fitness':'Fitnessschuhe','Maillots de bain sport':'Schwimmbekleidung','Accessoires natation':'Schwimmzubehör','Tenues vélo':'Radbekleidung','Casques':'Helme','Accessoires vélo':'Fahrradzubehör' },
  it: { 'T-shirts':'T-shirt','Tops & Débardeurs':'Top e canotte','Chemisiers & Blouses':'Camicette','Pulls & Sweatshirts':'Maglioni e felpe','Cardigans':'Cardigan','Robes courtes':'Vestiti corti','Robes longues':'Vestiti lunghi','Robes de soirée':'Abiti da sera','Robes de mariée':'Abiti da sposa','Jupes courtes':'Minigonne','Jupes longues':'Gonne lunghe','Jupes mi-longues':'Gonne midi','Jeans':'Jeans','Pantalons':'Pantaloni','Leggings':'Leggings','Shorts & Bermudas':'Shorts e bermuda','Combinaisons':'Tute','Joggings':'Jogger','Blazers & Vestes':'Blazer e giacche','Manteaux':'Cappotti','Imperméables & Trenchs':'Impermeabili e trench','Doudounes':'Piumini','Parkas':'Parka','Vestes en cuir':'Giacche in pelle','Bombers':'Bomber','Baskets & Tennis':'Sneakers','Bottes & Bottines':'Stivali e stivaletti','Sandales & Mules':'Sandali e mules','Escarpins & Talons':'Décolleté e tacchi','Ballerines & Mocassins':'Ballerine e mocassini','Chaussures plates':'Scarpe basse','Chaussures sport':'Scarpe sportive',"Sacs à main":'Borse a mano',"Sacs à dos":'Zaini','Sacs bandoulière':'Borse a spalla','Pochettes & Clutches':'Pochette','Tote bags':'Tote bag','Sacs de voyage':'Borse da viaggio','Valises & Bagages':'Valigie',"Écharpes & Foulards":'Sciarpe','Ceintures':'Cinture','Chapeaux & Bonnets':'Cappelli e berretti','Gants & Mitaines':'Guanti','Lunettes de soleil':'Occhiali da sole','Collants & Chaussettes':'Collant e calze','Cravates & Nœuds papillon':'Cravatte e papillon','Colliers & Pendentifs':'Collane','Bagues':'Anelli',"Boucles d'oreilles":'Orecchini','Bracelets':'Bracciali','Brooches & Épingles':'Spille','Parures':'Set di gioielli','Montres classiques':'Orologi classici','Montres sport':'Orologi sportivi','Montres connectées':'Smartwatch','Bikinis':'Bikini','Maillots 1 pièce':'Costumi interi','Bas de maillot':'Slip bikini','Hauts de maillot':'Top bikini','Pareos & Sarongs':'Pareo','T-shirts sport':'T-shirt sportive','Leggings & Shorts sport':'Leggings e shorts sportivi','Vestes & Sweats sport':'Giacche e felpe sportive','Maillots de sport':'Maglie sportive','Tenues yoga & pilates':'Abbigliamento yoga e pilates','Soutiens-gorge':'Reggiseni','Culottes & Strings':'Mutandine e tanga','Body':'Body','Pyjamas & Nuisettes':'Pigiami e chemise','Chaussettes & Collants':'Calze e collant','Hauts maternité':'Top premaman','Pantalons maternité':'Pantaloni premaman','Robes maternité':'Abiti premaman','Polos':'Polo','Chemises':'Camicie','Débardeurs':'Canottiere','Costumes & Vestes de costume':'Completi e giacche','Vestes en cuir & Bombers':'Giacche in pelle e bomber','Mocassins & Derbies':'Mocassini e stringate','Sandales':'Sandali','Chaussures habillées':'Scarpe eleganti','Gants':'Guanti','Montres':'Orologi','Colliers':'Collane','Porte-monnaie & Portefeuilles':'Portafogli','Boxers & Slips':'Boxer e slip','Pyjamas':'Pigiami','Chaussettes':'Calze','Shorts de bain':'Pantaloncini da bagno','Slips de bain':'Slip da bagno','Shorts sport':'Pantaloncini sportivi','Vestes sport':'Giacche sportive','Joggings sport':'Pantaloni tuta','Maillots & Équipement':'Maglie e attrezzatura','Bodys & Combinaisons':'Body e tutine','Hauts & T-shirts':'Top e T-shirt','Pantalons & Leggings':'Pantaloni e leggings','Robes & Jupes':'Abiti e gonne','Pyjamas & Gigoteuses':'Pigiami e sacchi nanna','Manteaux & Doudounes':'Cappotti e piumini','Chaussures bébé':'Scarpine neonato','Accessoires bébé':'Accessori neonato','T-shirts & Tops':'T-shirt e top','Pantalons & Jeans':'Pantaloni e jeans','Pulls & Sweats':'Maglioni e felpe','Vestes & Manteaux':'Giacche e cappotti','Accessoires & Bijoux':'Accessori e gioielli','Sport':'Sport','T-shirts & Polos':'T-shirt e polo','Shorts':'Shorts','Accessoires':'Accessori','T-shirts unisexe':'T-shirt unisex','Sweats & Hoodies':'Felpe e hoodie','Vestes':'Giacche','Pantalons & Joggings':'Pantaloni e jogger','Baskets':'Sneakers','Canapés & Fauteuils':'Divani e poltrone','Tables & Bureaux':'Tavoli e scrivanie','Lits & Cadres de lit':'Letti','Rangements & Étagères':'Contenitori e scaffali','Chaises':'Sedie','Coussins & Plaids':'Cuscini e plaid',"Bougies & Parfums d'ambiance":'Candele e profumi','Cadres & Tableaux':'Cornici e quadri','Vases & Céramiques':'Vasi e ceramiche','Miroirs':'Specchi','Horloges':'Orologi da parete','Draps & Parures de lit':'Biancheria da letto','Couvre-lits & Couettes':'Copriletti e piumini','Serviettes & Peignoirs':'Asciugamani e accappatoi','Nappes & Torchons':'Tovaglie e strofinacci','Vaisselle':'Stoviglie','Ustensiles & Accessoires':'Utensili','Cafetières & Appareils':'Caffettiere e apparecchi','Verres & Tasses':'Bicchieri e tazze','Mobilier de jardin':'Mobili da giardino','Plantes & Accessoires':'Piante e accessori','Déco extérieure':'Decorazione esterna','Smartphones':'Smartphone','Tablettes':'Tablet','Coques & Accessoires':'Cover e accessori','Ordinateurs portables':'Laptop','Ordinateurs de bureau':'PC desktop','Accessoires informatique':'Accessori informatici','Consoles':'Console','Jeux vidéo':'Videogiochi','Accessoires gaming':'Accessori gaming','Écouteurs & Casques':'Cuffie e auricolari','Enceintes':'Casse','Instruments de musique':'Strumenti musicali','Appareils photo':'Fotocamere','Caméras':'Videocamere','Accessoires photo':'Accessori foto','Parfums femme':'Profumi donna','Parfums homme':'Profumi uomo','Eaux de toilette':'Eau de toilette','Soins visage':'Cura del viso','Soins corps':'Cura del corpo','Soins cheveux':'Cura dei capelli','Teint':'Fondotinta','Yeux':'Occhi','Lèvres':'Labbra','Ongles':'Unghie','Accessoires cheveux':'Accessori per capelli','Outils coiffure':'Strumenti per capelli','Chaussures running':'Scarpe running','Tenues running':'Abbigliamento running','Accessoires running':'Accessori running','Maillots':'Maglie','Shorts & Survêtements':'Pantaloncini e tute','Chaussures football':'Scarpe da calcio','Équipement & Accessoires':'Attrezzatura e accessori','Raquettes':'Racchette','Chaussures tennis':'Scarpe da tennis','Tenues tennis':'Abbigliamento tennis','Vestes de ski':'Giacche da sci','Pantalons de ski':'Pantaloni da sci','Accessoires ski':'Accessori sci','Tenues fitness':'Abbigliamento fitness','Équipement musculation':'Attrezzatura palestra','Chaussures fitness':'Scarpe fitness','Maillots de bain sport':'Costumi sportivi','Accessoires natation':'Accessori nuoto','Tenues vélo':'Abbigliamento ciclismo','Casques':'Caschi','Accessoires vélo':'Accessori ciclismo' },
  nl: { 'T-shirts':'T-shirts','Tops & Débardeurs':'Tops & singlets','Chemisiers & Blouses':'Blouses','Pulls & Sweatshirts':'Truien & sweatshirts','Cardigans':'Vesten','Robes courtes':'Korte jurken','Robes longues':'Lange jurken','Robes de soirée':'Avondjurken','Robes de mariée':'Trouwjurken','Jupes courtes':'Minirokken','Jupes longues':'Maxi rokken','Jupes mi-longues':'Midirokken','Jeans':'Jeans','Pantalons':'Broeken','Leggings':'Leggings','Shorts & Bermudas':'Shorts & bermudas','Combinaisons':'Jumpsuits','Joggings':'Joggingbroeken','Blazers & Vestes':'Blazers & jasjes','Manteaux':'Mantels','Imperméables & Trenchs':'Regenjassen & trenchcoats','Doudounes':'Gewatteerde jassen','Parkas':'Parkas','Vestes en cuir':'Leren jassen','Bombers':'Bomberjacks','Baskets & Tennis':'Sneakers','Bottes & Bottines':'Laarzen & enkellaarzen','Sandales & Mules':'Sandalen & mules','Escarpins & Talons':'Hakken',"Ballerines & Mocassins":"Ballerina's & loafers",'Chaussures plates':'Platte schoenen','Chaussures sport':'Sportschoenen',"Sacs à main":'Handtassen',"Sacs à dos":'Rugzakken','Sacs bandoulière':'Schoudertassen','Pochettes & Clutches':'Clutches','Tote bags':'Tote bags','Sacs de voyage':'Reistassen','Valises & Bagages':'Koffers',"Écharpes & Foulards":'Sjaals','Ceintures':'Riemen','Chapeaux & Bonnets':'Hoeden & mutsen','Gants & Mitaines':'Handschoenen','Lunettes de soleil':'Zonnebrillen','Collants & Chaussettes':'Kousen & sokken','Cravates & Nœuds papillon':'Stropdassen & vlinderdassen','Colliers & Pendentifs':'Halskettingen','Bagues':'Ringen',"Boucles d'oreilles":'Oorbellen','Bracelets':'Armbanden','Brooches & Épingles':'Broches','Parures':'Sieradensets','Montres classiques':'Klassieke horloges','Montres sport':'Sporthorloges','Montres connectées':'Smartwatches','Bikinis':'Bikinis','Maillots 1 pièce':'Badpakken','Bas de maillot':'Bikinibroekjes','Hauts de maillot':'Bikinitops','Pareos & Sarongs':'Pareos','T-shirts sport':'Sport T-shirts','Leggings & Shorts sport':'Sportleggings & -shorts','Vestes & Sweats sport':'Sportjassen & sweats','Maillots de sport':'Sport tops','Tenues yoga & pilates':'Yoga- & pilateskleding',"Soutiens-gorge":"BH's",'Culottes & Strings':'Slipjes & strings','Body':'Bodies','Pyjamas & Nuisettes':"Pyjama's & nachthemden",'Chaussettes & Collants':'Sokken & kousen','Hauts maternité':'Zwangerschapstops','Pantalons maternité':'Zwangerschapsbroeken','Robes maternité':'Zwangerschapsjurken','Polos':'Poloshirts','Chemises':'Overhemden','Débardeurs':'Tanktops','Costumes & Vestes de costume':'Pakken & blazers','Vestes en cuir & Bombers':'Leren jassen & bomberjacks','Mocassins & Derbies':'Loafers & derbies','Sandales':'Sandalen','Chaussures habillées':'Nette schoenen','Gants':'Handschoenen','Montres':'Horloges','Colliers':'Halskettingen','Porte-monnaie & Portefeuilles':'Portemonnees','Boxers & Slips':'Boxers & slips','Pyjamas':"Pyjama's",'Chaussettes':'Sokken','Shorts de bain':'Zwemshorts','Slips de bain':'Zwembroekjes','Shorts sport':'Sportshorts','Vestes sport':'Sportjassen','Joggings sport':'Joggingbroeken','Maillots & Équipement':'Shirts & uitrusting','Bodys & Combinaisons':'Rompertjes','Hauts & T-shirts':'Tops & T-shirts','Pantalons & Leggings':'Broeken & leggings','Robes & Jupes':'Jurken & rokken','Pyjamas & Gigoteuses':"Pyjama's & slaapzakken",'Manteaux & Doudounes':'Mantels & gewatteerde jassen','Chaussures bébé':'Babyschoenjes','Accessoires bébé':'Baby-accessoires','T-shirts & Tops':'T-shirts & tops','Pantalons & Jeans':'Broeken & jeans','Pulls & Sweats':'Truien & sweatshirts','Vestes & Manteaux':'Jassen & mantels','Accessoires & Bijoux':'Accessoires & sieraden','Sport':'Sport','T-shirts & Polos':'T-shirts & poloshirts','Shorts':'Shorts','Accessoires':'Accessoires','T-shirts unisexe':'Unisex T-shirts','Sweats & Hoodies':'Sweatshirts & hoodies','Vestes':'Jassen','Pantalons & Joggings':'Broeken & joggingbroeken','Baskets':'Sneakers','Canapés & Fauteuils':'Banken & fauteuils','Tables & Bureaux':'Tafels & bureaus','Lits & Cadres de lit':'Bedden','Rangements & Étagères':'Opbergruimte','Chaises':'Stoelen','Coussins & Plaids':'Kussens & dekens',"Bougies & Parfums d'ambiance":'Kaarsen & geurstokjes','Cadres & Tableaux':'Lijsten & schilderijen','Vases & Céramiques':'Vazen & keramiek','Miroirs':'Spiegels','Horloges':'Wandklokken','Draps & Parures de lit':'Beddengoed','Couvre-lits & Couettes':'Bedspreien & dekbedden','Serviettes & Peignoirs':'Handdoeken & badjassen','Nappes & Torchons':'Tafelkleden & theedoeken','Vaisselle':'Serviesgoed','Ustensiles & Accessoires':'Keukengerei','Cafetières & Appareils':'Apparaten','Verres & Tasses':'Glazen & mokken','Mobilier de jardin':'Tuinmeubels','Plantes & Accessoires':'Planten & accessoires','Déco extérieure':'Buitendeco','Smartphones':'Smartphones','Tablettes':'Tablets','Coques & Accessoires':'Hoesjes & accessoires','Ordinateurs portables':'Laptops','Ordinateurs de bureau':'Desktops','Accessoires informatique':'Computerapparatuur','Consoles':'Consoles','Jeux vidéo':'Videogames','Accessoires gaming':'Gaming-accessoires','Écouteurs & Casques':'Oordopjes & koptelefoons','Enceintes':'Luidsprekers','Instruments de musique':'Muziekinstrumenten','Appareils photo':"Camera's",'Caméras':"Videocamera's",'Accessoires photo':'Foto-accessoires','Parfums femme':'Damesparfums','Parfums homme':'Herenparfums','Eaux de toilette':'Eau de toilette','Soins visage':'Gezichtsverzorging','Soins corps':'Lichaamsverzorging','Soins cheveux':'Haarverzorging','Teint':'Foundation','Yeux':'Ogen','Lèvres':'Lippen','Ongles':'Nagels','Accessoires cheveux':'Haaraccessoires','Outils coiffure':'Kappersgerei','Chaussures running':'Hardloopschoenen','Tenues running':'Hardloopkleding','Accessoires running':'Hardloopaccessoires','Maillots':'Shirts','Shorts & Survêtements':'Shorts & trainingspakken','Chaussures football':'Voetbalschoenen','Équipement & Accessoires':'Uitrusting & accessoires','Raquettes':'Rackets','Chaussures tennis':'Tennisschoenen','Tenues tennis':'Tenniskleding','Vestes de ski':'Skijassen','Pantalons de ski':'Skibroeken','Accessoires ski':'Skiaccessoires','Tenues fitness':'Fitnesskleding','Équipement musculation':'Fitnessapparatuur','Chaussures fitness':'Fitnessschoenen','Maillots de bain sport':'Sportbadenmode','Accessoires natation':'Zwemaccessoires','Tenues vélo':'Fietskleding','Casques':'Helmen','Accessoires vélo':'Fietsaccessoires' },
  pl: { 'T-shirts':'Koszulki','Tops & Débardeurs':'Topy i podkoszulki','Chemisiers & Blouses':'Bluzki','Pulls & Sweatshirts':'Swetry i bluzy','Cardigans':'Kardigany','Robes courtes':'Krótkie sukienki','Robes longues':'Długie sukienki','Robes de soirée':'Sukienki wieczorowe','Robes de mariée':'Suknie ślubne','Jupes courtes':'Minispódnice','Jupes longues':'Długie spódnice','Jupes mi-longues':'Spódnice midi','Jeans':'Dżinsy','Pantalons':'Spodnie','Leggings':'Legginsy','Shorts & Bermudas':'Szorty i bermudy','Combinaisons':'Kombinezony','Joggings':'Dresy','Blazers & Vestes':'Żakiety i kurtki','Manteaux':'Płaszcze','Imperméables & Trenchs':'Płaszcze przeciwdeszczowe','Doudounes':'Kurtki pikowane','Parkas':'Parki','Vestes en cuir':'Kurtki skórzane','Bombers':'Bomberki','Baskets & Tennis':'Adidasy','Bottes & Bottines':'Buty i botki','Sandales & Mules':'Sandały i klapki','Escarpins & Talons':'Buty na obcasie','Ballerines & Mocassins':'Baleriny i mokasyny','Chaussures plates':'Płaskie buty','Chaussures sport':'Buty sportowe',"Sacs à main":'Torebki',"Sacs à dos":'Plecaki','Sacs bandoulière':'Torebki na ramię','Pochettes & Clutches':'Koperty','Tote bags':'Torby shopper','Sacs de voyage':'Torby podróżne','Valises & Bagages':'Walizki',"Écharpes & Foulards":'Szaliki','Ceintures':'Paski','Chapeaux & Bonnets':'Kapelusze i czapki','Gants & Mitaines':'Rękawiczki','Lunettes de soleil':'Okulary przeciwsłoneczne','Collants & Chaussettes':'Rajstopy i skarpetki','Cravates & Nœuds papillon':'Krawaty i muszki','Colliers & Pendentifs':'Naszyjniki','Bagues':'Pierścionki',"Boucles d'oreilles":'Kolczyki','Bracelets':'Bransoletki','Brooches & Épingles':'Broszki','Parures':'Komplety biżuterii','Montres classiques':'Zegarki klasyczne','Montres sport':'Zegarki sportowe','Montres connectées':'Smartwatche','Bikinis':'Bikini','Maillots 1 pièce':'Jednoczęściowe kostiumy','Bas de maillot':'Dół bikini','Hauts de maillot':'Góra bikini','Pareos & Sarongs':'Pareo','T-shirts sport':'Koszulki sportowe','Leggings & Shorts sport':'Leginsy i szorty sportowe','Vestes & Sweats sport':'Kurtki i bluzy sportowe','Maillots de sport':'Koszulki sportowe','Tenues yoga & pilates':'Odzież do jogi i pilatesu','Soutiens-gorge':'Biustonosze','Culottes & Strings':'Majtki i stringi','Body':'Body','Pyjamas & Nuisettes':'Piżamy i koszule nocne','Chaussettes & Collants':'Skarpetki i rajstopy','Hauts maternité':'Topy ciążowe','Pantalons maternité':'Spodnie ciążowe','Robes maternité':'Sukienki ciążowe','Polos':'Koszulki polo','Chemises':'Koszule','Débardeurs':'Koszulki bez rękawów','Costumes & Vestes de costume':'Garnitury i marynarki','Vestes en cuir & Bombers':'Kurtki skórzane i bomberki','Mocassins & Derbies':'Mokasyny i półbuty','Sandales':'Sandały','Chaussures habillées':'Buty eleganckie','Gants':'Rękawiczki','Montres':'Zegarki','Colliers':'Naszyjniki','Porte-monnaie & Portefeuilles':'Portfele','Boxers & Slips':'Bokserki i slipy','Pyjamas':'Piżamy','Chaussettes':'Skarpetki','Shorts de bain':'Spodenki kąpielowe','Slips de bain':'Kąpielówki','Shorts sport':'Szorty sportowe','Vestes sport':'Kurtki sportowe','Joggings sport':'Spodnie dresowe','Maillots & Équipement':'Koszulki i sprzęt','Bodys & Combinaisons':'Body i pajacyki','Hauts & T-shirts':'Topy i koszulki','Pantalons & Leggings':'Spodnie i legginsy','Robes & Jupes':'Sukienki i spódnice','Pyjamas & Gigoteuses':'Piżamy i śpiworki','Manteaux & Doudounes':'Płaszcze i kurtki pikowane','Chaussures bébé':'Buciki niemowlęce','Accessoires bébé':'Akcesoria dla niemowląt','T-shirts & Tops':'Koszulki i topy','Pantalons & Jeans':'Spodnie i dżinsy','Pulls & Sweats':'Swetry i bluzy','Vestes & Manteaux':'Kurtki i płaszcze','Accessoires & Bijoux':'Akcesoria i biżuteria','Sport':'Sport','T-shirts & Polos':'Koszulki i polo','Shorts':'Szorty','Accessoires':'Akcesoria','T-shirts unisexe':'Unisex koszulki','Sweats & Hoodies':'Bluzy z kapturem','Vestes':'Kurtki','Pantalons & Joggings':'Spodnie i dresy','Baskets':'Adidasy','Canapés & Fauteuils':'Kanapy i fotele','Tables & Bureaux':'Stoły i biurka','Lits & Cadres de lit':'Łóżka','Rangements & Étagères':'Przechowywanie','Chaises':'Krzesła','Coussins & Plaids':'Poduszki i koce',"Bougies & Parfums d'ambiance":'Świece i zapachy','Cadres & Tableaux':'Ramki i obrazy','Vases & Céramiques':'Wazony i ceramika','Miroirs':'Lustra','Horloges':'Zegary','Draps & Parures de lit':'Pościel','Couvre-lits & Couettes':'Narzuty i kołdry','Serviettes & Peignoirs':'Ręczniki i szlafroki','Nappes & Torchons':'Obrusy i ściereczki','Vaisselle':'Naczynia','Ustensiles & Accessoires':'Przybory kuchenne','Cafetières & Appareils':'Ekspresy i sprzęt','Verres & Tasses':'Szklanki i kubki','Mobilier de jardin':'Meble ogrodowe','Plantes & Accessoires':'Rośliny i akcesoria','Déco extérieure':'Dekoracje zewnętrzne','Smartphones':'Smartfony','Tablettes':'Tablety','Coques & Accessoires':'Etui i akcesoria','Ordinateurs portables':'Laptopy','Ordinateurs de bureau':'Komputery stacjonarne','Accessoires informatique':'Akcesoria komputerowe','Consoles':'Konsole','Jeux vidéo':'Gry','Accessoires gaming':'Akcesoria gamingowe','Écouteurs & Casques':'Słuchawki','Enceintes':'Głośniki','Instruments de musique':'Instrumenty muzyczne','Appareils photo':'Aparaty','Caméras':'Kamery','Accessoires photo':'Akcesoria fotograficzne','Parfums femme':'Perfumy damskie','Parfums homme':'Perfumy męskie','Eaux de toilette':'Woda toaletowa','Soins visage':'Pielęgnacja twarzy','Soins corps':'Pielęgnacja ciała','Soins cheveux':'Pielęgnacja włosów','Teint':'Podkład','Yeux':'Oczy','Lèvres':'Usta','Ongles':'Paznokcie','Accessoires cheveux':'Akcesoria do włosów','Outils coiffure':'Narzędzia do stylizacji','Chaussures running':'Buty do biegania','Tenues running':'Odzież do biegania','Accessoires running':'Akcesoria do biegania','Maillots':'Koszulki','Shorts & Survêtements':'Szorty i dresy','Chaussures football':'Korki','Équipement & Accessoires':'Sprzęt i akcesoria','Raquettes':'Rakiety','Chaussures tennis':'Buty tenisowe','Tenues tennis':'Odzież tenisowa','Vestes de ski':'Kurtki narciarskie','Pantalons de ski':'Spodnie narciarskie','Accessoires ski':'Akcesoria narciarskie','Tenues fitness':'Odzież fitness','Équipement musculation':'Sprzęt do siłowni','Chaussures fitness':'Buty fitness','Maillots de bain sport':'Sportowe stroje kąpielowe','Accessoires natation':'Akcesoria do pływania','Tenues vélo':'Odzież rowerowa','Casques':'Kaski','Accessoires vélo':'Akcesoria rowerowe' },
}
