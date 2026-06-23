/* ─── lib/pricing.ts — calcul de prix déterministe ────────────────────────────
 * Partagé serveur (route API) + client (PricingStep)
 * ─────────────────────────────────────────────────────────────────────────── */

import REF from './referentiel_prix_final.json'

/* ─── Type segment ────────────────────────────────────────────────────────── */

export type BrandSegment =
  | 'fast_fashion'
  | 'standard'
  | 'premium_accessible'
  | 'premium_createur'
  | 'luxe_contemporain'
  | 'luxe_etabli'
  | 'luxe_iconique'
  | 'ultra_luxe'

export const ALL_SEGMENTS: BrandSegment[] = [
  'fast_fashion', 'standard', 'premium_accessible', 'premium_createur',
  'luxe_contemporain', 'luxe_etabli', 'luxe_iconique', 'ultra_luxe',
]

/* ─── Table de marques → segment ─────────────────────────────────────────── */

const BRAND_SEGMENTS_TABLE: Record<BrandSegment, string[]> = {
  ultra_luxe: [
    'Hermès', 'Hermes', 'Chanel',
    'Rolex', 'Patek Philippe', 'Audemars Piguet', 'A. Lange & Söhne',
    'Richard Mille', 'Breguet', 'Jaeger-LeCoultre',
    'Cartier', 'Van Cleef & Arpels', 'Bulgari', 'Bvlgari',
    'Graff', 'Harry Winston', 'Boucheron',
  ],
  /* Garde sa valeur à la revente — décote douce (sacs iconiques Hermès/Chanel) */
  luxe_iconique: [
    'Hermès', 'Hermes', 'Chanel',
  ],
  /* Prestige mondial mais décote forte à l'occasion — grandes maisons de mode */
  luxe_etabli: [
    'Gucci', 'Saint Laurent', 'Yves Saint Laurent', 'YSL',
    'Prada', 'Dior', 'Christian Dior', 'Givenchy', 'Balenciaga',
    'Bottega Veneta', 'Celine', 'Céline',
    'Louis Vuitton', 'Fendi', 'Valentino', 'Burberry', 'Moncler',
    'Versace', 'Loewe', 'Alexander McQueen', 'Balmain', 'Lanvin', 'Tom Ford',
    'Stella McCartney', 'Tiffany & Co', 'Tiffany',
    'Omega', 'Christian Louboutin', 'Jimmy Choo', 'Manolo Blahnik',
    'Chloé', 'Chloe', 'Giambattista Valli', 'Etro',
    'Dolce & Gabbana', 'Dolce&Gabbana',
    'Roberto Cavalli', 'Missoni', 'Moschino',
    'Vivienne Westwood', 'Marni', 'Jil Sander',
    'Issey Miyake', 'Yohji Yamamoto', 'Comme des Garçons',
    'Loro Piana', 'Brunello Cucinelli',
    'TAG Heuer', 'Longines', 'IWC', 'Hublot',
    'Swarovski',
  ],
  luxe_contemporain: [
    'Jacquemus', 'Off-White', 'Stone Island',
    'Ami', 'Ami Paris', 'Maison Kitsuné', 'Kitsuné',
    'Ganni', 'Nanushka', 'Toteme', 'Totême',
    'Officine Générale', 'Acne Studios',
    'Marine Serre', 'Y/Project', 'Coperni',
    'Rick Owens', 'Palm Angels', 'A-COLD-WALL*', 'Fear of God',
    'Casablanca', 'Rhude', 'Apc Studio',
  ],
  premium_createur: [
    'Isabel Marant', 'Sandro', 'Maje', 'The Kooples', 'Kenzo',
    'A.P.C.', 'APC', 'Ba&sh', 'Ba & sh',
    'Claudie Pierlot', 'Iro', 'IRO', 'Paul Smith',
    'Vanessa Bruno', 'Soeur', 'Sessùn',
    'Carven', 'Rouje',
  ],
  premium_accessible: [
    'Zadig & Voltaire', 'Zadig&Voltaire',
    'Hugo Boss', 'Boss',
    'Ted Baker', 'Reiss', 'AllSaints',
    'Ralph Lauren', 'Polo Ralph Lauren',
    'Lacoste', 'Tommy Hilfiger', 'Calvin Klein',
    'Michael Kors', 'Coach', 'Kate Spade',
    'Guess', 'Armani Exchange', 'Emporio Armani',
    'GANT', 'Fred Perry', 'Scotch & Soda',
    'Superdry', 'Sézane',
  ],
  standard: [
    'Zara', 'H&M', 'Mango', 'Uniqlo', 'COS',
    'Massimo Dutti', '& Other Stories', 'Arket',
    'ASOS', 'Gap', 'Esprit', 'Banana Republic',
    "Levi's", 'Lee', 'Wrangler', 'G-Star', 'G-Star Raw', 'Diesel', 'Pepe Jeans',
    'Nike', 'Adidas', 'Puma', 'Reebok', 'New Balance', 'Converse', 'Vans',
    'Under Armour', 'The North Face', 'Columbia', 'Patagonia',
    'Tom Tailor', 's.Oliver',
  ],
  fast_fashion: [
    'Shein', 'Temu', 'Romwe',
    'Primark', 'Bershka', 'Pull&Bear', 'Stradivarius',
    'New Look', 'Next', 'River Island',
    'Monki', 'Weekday',
    'Fila', 'Champion',
    'Vero Moda', 'Only', 'Jack & Jones', 'Selected',
    'Boohoo', 'PrettyLittleThing', 'Missguided',
  ],
}

export function getBrandSegment(marque: string): BrandSegment | null {
  if (!marque) return null
  const normalized = marque.toLowerCase().trim()
  for (const segment of ALL_SEGMENTS) {
    if (BRAND_SEGMENTS_TABLE[segment].some(b => b.toLowerCase() === normalized)) return segment
  }
  return null
}

/* ─── Mapping état Vinted → clé référentiel ──────────────────────────────── */

const ETAT_REF_MAP: Record<string, string> = {
  'neuf avec étiquette': 'Neuf avec étiquette',
  'neuf sans étiquette': 'Neuf sans étiquette',
  'très bon état':       'Très bon état',
  'bon état':            'Bon état',
  'satisfaisant':        'État correct',
}

export function mapVintedEtatToRef(etat: string): string {
  return ETAT_REF_MAP[etat.toLowerCase().trim()] ?? etat
}

/* Alias legacy utilisé dans les endroits qui appellent encore normalizeEtat */
export function normalizeEtat(etat: string): string {
  return mapVintedEtatToRef(etat)
}

/* ─── Arrondi par tranches ────────────────────────────────────────────────── */

export function roundToTier(amount: number): number {
  if (amount < 100) return Math.round(amount / 10) * 10
  if (amount <= 500) return Math.round(amount / 50) * 50
  return Math.round(amount / 100) * 100
}

/* ─── Catégories "sac/accessoire" — grille de décote douce pour luxe ────── */

const SAC_ACCESSOIRE_CATS = new Set([
  'Sacs à main, Tote bags, Sacs bandoulière',
  'Pochettes, Wristlets, Trousses à maquillage',
  'Bagages, Sacs de voyage, Mallettes, Cartables',
  'Porte-monnaie & Petite maroquinerie',
])

export function isAccessoireLuxeCategory(refCat: string): boolean {
  return SAC_ACCESSOIRE_CATS.has(refCat)
}

/* ─── CATEGORY_MAP — Vinted path → clé référentiel ─────────────────────── */

export const CATEGORY_MAP: Record<string, string> = {

  /* ── Femmes > Vêtements > Manteaux et vestes ──────────────────────────── */
  'Femmes > Vêtements > Manteaux et vestes > Capes et ponchos':                                   'Capes et ponchos',
  'Femmes > Vêtements > Manteaux et vestes > Manteaux > Duffle-coats':                            'Manteaux (Trenchs, Parkas, Cabans, Imperméables)',
  'Femmes > Vêtements > Manteaux et vestes > Manteaux > Manteaux en fausse fourrure':             'Manteaux (Trenchs, Parkas, Cabans, Imperméables)',
  'Femmes > Vêtements > Manteaux et vestes > Manteaux > Pardessus et manteaux longs':             'Manteaux (Trenchs, Parkas, Cabans, Imperméables)',
  'Femmes > Vêtements > Manteaux et vestes > Manteaux > Parkas':                                  'Manteaux (Trenchs, Parkas, Cabans, Imperméables)',
  'Femmes > Vêtements > Manteaux et vestes > Manteaux > Cabans':                                  'Manteaux (Trenchs, Parkas, Cabans, Imperméables)',
  'Femmes > Vêtements > Manteaux et vestes > Manteaux > Imperméables':                            'Manteaux (Trenchs, Parkas, Cabans, Imperméables)',
  'Femmes > Vêtements > Manteaux et vestes > Manteaux > Trenchs':                                 'Manteaux (Trenchs, Parkas, Cabans, Imperméables)',
  'Femmes > Vêtements > Manteaux et vestes > Vestes sans manches':                                'Vestes sans manches',
  'Femmes > Vêtements > Manteaux et vestes > Vestes > Perfectos et blousons de moto':             'Vestes (Perfectos, Doudounes, Denim, Polaires, Ski)',
  'Femmes > Vêtements > Manteaux et vestes > Vestes > Blousons aviateur':                         'Vestes (Perfectos, Doudounes, Denim, Polaires, Ski)',
  'Femmes > Vêtements > Manteaux et vestes > Vestes > Vestes en jean':                            'Vestes (Perfectos, Doudounes, Denim, Polaires, Ski)',
  'Femmes > Vêtements > Manteaux et vestes > Vestes > Vestes militaires et utilitaires':          'Vestes (Perfectos, Doudounes, Denim, Polaires, Ski)',
  'Femmes > Vêtements > Manteaux et vestes > Vestes > Vestes polaires':                           'Vestes (Perfectos, Doudounes, Denim, Polaires, Ski)',
  'Femmes > Vêtements > Manteaux et vestes > Vestes > Doudounes':                                 'Vestes (Perfectos, Doudounes, Denim, Polaires, Ski)',
  'Femmes > Vêtements > Manteaux et vestes > Vestes > Vestes matelassées':                        'Vestes (Perfectos, Doudounes, Denim, Polaires, Ski)',
  'Femmes > Vêtements > Manteaux et vestes > Vestes > Vestes chemises':                           'Vestes (Perfectos, Doudounes, Denim, Polaires, Ski)',
  'Femmes > Vêtements > Manteaux et vestes > Vestes > Vestes de ski et snowboard':                'Vestes (Perfectos, Doudounes, Denim, Polaires, Ski)',
  'Femmes > Vêtements > Manteaux et vestes > Vestes > Blousons teddy':                            'Vestes (Perfectos, Doudounes, Denim, Polaires, Ski)',
  'Femmes > Vêtements > Manteaux et vestes > Vestes > Vestes coupe-vent':                         'Vestes (Perfectos, Doudounes, Denim, Polaires, Ski)',

  /* ── Femmes > Vêtements > Sweats et sweats à capuche ─────────────────── */
  'Femmes > Vêtements > Sweats et sweats à capuche > Sweats & sweats à capuche':                  'Sweats & sweats à capuche',
  'Femmes > Vêtements > Sweats et sweats à capuche > Sweats > Sweats longs':                      'Sweats & sweats à capuche',
  'Femmes > Vêtements > Sweats et sweats à capuche > Sweats > Sweats manche ¾':                   'Sweats & sweats à capuche',
  'Femmes > Vêtements > Sweats et sweats à capuche > Sweats > Autres sweats':                     'Sweats (Pulls col V, col roulé, d\'hiver, 3/4)',
  'Femmes > Vêtements > Sweats et sweats à capuche > Kimonos':                                    'Kimonos, Cardigans, Boléros, Pull-overs',
  'Femmes > Vêtements > Sweats et sweats à capuche > Cardigans':                                  'Kimonos, Cardigans, Boléros, Pull-overs',
  'Femmes > Vêtements > Sweats et sweats à capuche > Boléros':                                    'Kimonos, Cardigans, Boléros, Pull-overs',
  'Femmes > Vêtements > Sweats et sweats à capuche > Vestes':                                     'Kimonos, Cardigans, Boléros, Pull-overs',
  'Femmes > Vêtements > Sweats et sweats à capuche > Autres pull-overs & sweat-shirts':           'Sweats (Pulls col V, col roulé, d\'hiver, 3/4)',

  /* ── Femmes > Vêtements > Blazers et tailleurs ────────────────────────── */
  'Femmes > Vêtements > Blazers et tailleurs > Blazers':                                          'Blazers & Vestes habillées',
  'Femmes > Vêtements > Blazers et tailleurs > Ensembles tailleur/pantalon':                      'Ensembles tailleur (pantalon/jupe)',
  'Femmes > Vêtements > Blazers et tailleurs > Jupes et robes tailleurs':                         'Ensembles tailleur (pantalon/jupe)',
  'Femmes > Vêtements > Blazers et tailleurs > Tailleurs pièces séparées':                        'Ensembles tailleur (pantalon/jupe)',
  'Femmes > Vêtements > Blazers et tailleurs > Autres ensembles & tailleurs':                     'Ensembles tailleur (pantalon/jupe)',

  /* ── Femmes > Vêtements > Robes ───────────────────────────────────────── */
  'Femmes > Vêtements > Robes > Mini':                                                            'Robes (Mini, Midi, Longues, Casual, Été, Hiver)',
  'Femmes > Vêtements > Robes > Midi':                                                            'Robes (Mini, Midi, Longues, Casual, Été, Hiver)',
  'Femmes > Vêtements > Robes > Robes longues':                                                   'Robes (Mini, Midi, Longues, Casual, Été, Hiver)',
  'Femmes > Vêtements > Robes > Pour occasions':                                                  'Robes d\'occasion & Robes chics / Soirée',
  'Femmes > Vêtements > Robes > Robes chics':                                                     'Robes d\'occasion & Robes chics / Soirée',
  'Femmes > Vêtements > Robes > Robes casual':                                                    'Robes (Mini, Midi, Longues, Casual, Été, Hiver)',
  'Femmes > Vêtements > Robes > Robes sans bretelles':                                            'Robes (Mini, Midi, Longues, Casual, Été, Hiver)',
  'Femmes > Vêtements > Robes > Petites robes noires':                                            'Robes d\'occasion & Robes chics / Soirée',
  'Femmes > Vêtements > Robes > Robes en jean':                                                   'Robes (Mini, Midi, Longues, Casual, Été, Hiver)',
  'Femmes > Vêtements > Robes > Autres robes':                                                    'Robes (Mini, Midi, Longues, Casual, Été, Hiver)',

  /* ── Femmes > Vêtements > Jupes ───────────────────────────────────────── */
  'Femmes > Vêtements > Jupes > Minijupes':                                                       'Jupes (Mini, Midi, Longues, Asymétriques)',
  'Femmes > Vêtements > Jupes > Jupes longueur genou':                                            'Jupes (Mini, Midi, Longues, Asymétriques)',
  'Femmes > Vêtements > Jupes > Jupes midi':                                                      'Jupes (Mini, Midi, Longues, Asymétriques)',
  'Femmes > Vêtements > Jupes > Jupes longues':                                                   'Jupes (Mini, Midi, Longues, Asymétriques)',
  'Femmes > Vêtements > Jupes > Jupes asymétriques':                                              'Jupes (Mini, Midi, Longues, Asymétriques)',
  'Femmes > Vêtements > Jupes-shorts':                                                            'Jupes-shorts',

  /* ── Femmes > Vêtements > Hauts et t-shirts ───────────────────────────── */
  'Femmes > Vêtements > Hauts et t-shirts > Chemises':                                            'Chemises & Blouses',
  'Femmes > Vêtements > Hauts et t-shirts > Blouses':                                             'Chemises & Blouses',
  'Femmes > Vêtements > Hauts et t-shirts > Vestes':                                              'Kimonos, Cardigans, Boléros, Pull-overs',
  'Femmes > Vêtements > Hauts et t-shirts > T-shirts':                                            'T-shirts, Débardeurs, Tops courts',
  'Femmes > Vêtements > Hauts et t-shirts > Débardeurs':                                          'T-shirts, Débardeurs, Tops courts',
  'Femmes > Vêtements > Hauts et t-shirts > Tuniques':                                            'T-shirts, Débardeurs, Tops courts',
  'Femmes > Vêtements > Hauts et t-shirts > Tops courts':                                         'T-shirts, Débardeurs, Tops courts',
  'Femmes > Vêtements > Hauts et t-shirts > Blouses manches courtes':                             'Chemises & Blouses',
  'Femmes > Vêtements > Hauts et t-shirts > Blouses ¾':                                           'Chemises & Blouses',
  'Femmes > Vêtements > Hauts et t-shirts > Blouses manches longues':                             'Chemises & Blouses',
  'Femmes > Vêtements > Hauts et t-shirts > Bodies':                                              'Bodies, Cols roulés, Tops dos nu / Épaules dénudées',
  'Femmes > Vêtements > Hauts et t-shirts > Tops épaules dénudées':                               'Bodies, Cols roulés, Tops dos nu / Épaules dénudées',
  'Femmes > Vêtements > Hauts et t-shirts > Cols roulés':                                         'Bodies, Cols roulés, Tops dos nu / Épaules dénudées',
  'Femmes > Vêtements > Hauts et t-shirts > Tops peplum':                                         'Bodies, Cols roulés, Tops dos nu / Épaules dénudées',
  'Femmes > Vêtements > Hauts et t-shirts > Tops dos nu':                                         'Bodies, Cols roulés, Tops dos nu / Épaules dénudées',
  'Femmes > Vêtements > Hauts et t-shirts > Autres hauts':                                        'T-shirts, Débardeurs, Tops courts',

  /* ── Femmes > Vêtements > Jeans ───────────────────────────────────────── */
  'Femmes > Vêtements > Jeans > Jeans boyfriend':                                                 'Jeans (Boyfriend, Skinny, Taille haute, Droit)',
  'Femmes > Vêtements > Jeans > Jeans courts':                                                    'Jeans (Boyfriend, Skinny, Taille haute, Droit)',
  'Femmes > Vêtements > Jeans > Jeans évasés':                                                    'Jeans (Boyfriend, Skinny, Taille haute, Droit)',
  'Femmes > Vêtements > Jeans > Jeans taille haute':                                              'Jeans (Boyfriend, Skinny, Taille haute, Droit)',
  'Femmes > Vêtements > Jeans > Jeans troués':                                                    'Jeans (Boyfriend, Skinny, Taille haute, Droit)',
  'Femmes > Vêtements > Jeans > Jeans skinny':                                                    'Jeans (Boyfriend, Skinny, Taille haute, Droit)',
  'Femmes > Vêtements > Jeans > Jeans droits':                                                    'Jeans (Boyfriend, Skinny, Taille haute, Droit)',
  'Femmes > Vêtements > Jeans > Autre':                                                           'Jeans (Boyfriend, Skinny, Taille haute, Droit)',

  /* ── Femmes > Vêtements > Pantalons et leggings ───────────────────────── */
  'Femmes > Vêtements > Pantalons et leggings > Pantalons courts & chinos':                       'Pantalons (Chinos, Larges, Cuir, Leggings)',
  'Femmes > Vêtements > Pantalons et leggings > Pantalons à jambes larges':                       'Pantalons (Chinos, Larges, Cuir, Leggings)',
  'Femmes > Vêtements > Pantalons et leggings > Pantalons skinny':                                'Pantalons (Chinos, Larges, Cuir, Leggings)',
  'Femmes > Vêtements > Pantalons et leggings > Pantalons ajustés':                               'Pantalons (Chinos, Larges, Cuir, Leggings)',
  'Femmes > Vêtements > Pantalons et leggings > Pantalons droits':                                'Pantalons (Chinos, Larges, Cuir, Leggings)',
  'Femmes > Vêtements > Pantalons et leggings > Pantalons en cuir':                               'Pantalons (Chinos, Larges, Cuir, Leggings)',
  'Femmes > Vêtements > Pantalons et leggings > Leggings':                                        'Pantalons (Chinos, Larges, Cuir, Leggings)',
  'Femmes > Vêtements > Pantalons et leggings > Sarouels':                                        'Pantalons (Chinos, Larges, Cuir, Leggings)',
  'Femmes > Vêtements > Pantalons et leggings > Autres pantalons':                                'Pantalons (Chinos, Larges, Cuir, Leggings)',

  /* ── Femmes > Vêtements > Shorts ──────────────────────────────────────── */
  'Femmes > Vêtements > Shorts > Shorts taille basse':                                            'Shorts (Denim, Taille haute, Cuir, Cargo)',
  'Femmes > Vêtements > Shorts > Shorts taille haute':                                            'Shorts (Denim, Taille haute, Cuir, Cargo)',
  'Femmes > Vêtements > Shorts > Shorts longueur genou':                                          'Shorts (Denim, Taille haute, Cuir, Cargo)',
  'Femmes > Vêtements > Shorts > Short en jean':                                                  'Shorts (Denim, Taille haute, Cuir, Cargo)',
  'Femmes > Vêtements > Shorts > Shorts en dentelle':                                             'Shorts (Denim, Taille haute, Cuir, Cargo)',
  'Femmes > Vêtements > Shorts > Shorts en cuir':                                                 'Shorts (Denim, Taille haute, Cuir, Cargo)',
  'Femmes > Vêtements > Shorts > Shorts cargo':                                                   'Shorts (Denim, Taille haute, Cuir, Cargo)',
  'Femmes > Vêtements > Shorts > Pantacourts':                                                    'Shorts (Denim, Taille haute, Cuir, Cargo)',
  'Femmes > Vêtements > Shorts > Autres shorts':                                                  'Shorts (Denim, Taille haute, Cuir, Cargo)',

  /* ── Femmes > Vêtements > Combinaisons et combishorts ─────────────────── */
  'Femmes > Vêtements > Combinaisons et combishorts > Combinaisons':                              'Combinaisons & Combi Shorts',
  'Femmes > Vêtements > Combinaisons et combishorts > Combi Shorts':                              'Combinaisons & Combi Shorts',
  'Femmes > Vêtements > Combinaisons et combishorts > Autres combinaisons & combishorts':         'Combinaisons & Combi Shorts',

  /* ── Femmes > Vêtements > Maillots de bain ────────────────────────────── */
  'Femmes > Vêtements > Maillots de bain > Une pièce':                                           'Maillots de bain (1 pièce, 2 pièces, Paréos)',
  'Femmes > Vêtements > Maillots de bain > Deux pièces':                                         'Maillots de bain (1 pièce, 2 pièces, Paréos)',
  'Femmes > Vêtements > Maillots de bain > Paréos et sarongs':                                   'Maillots de bain (1 pièce, 2 pièces, Paréos)',
  'Femmes > Vêtements > Maillots de bain > Autres':                                              'Maillots de bain (1 pièce, 2 pièces, Paréos)',

  /* ── Femmes > Vêtements > Lingerie et pyjamas ─────────────────────────── */
  'Femmes > Vêtements > Lingerie et pyjamas > Soutiens-gorge':                                   'Lingerie (Soutiens-gorge, Culottes, Ensembles, Collants)',
  'Femmes > Vêtements > Lingerie et pyjamas > Culottes':                                         'Lingerie (Soutiens-gorge, Culottes, Ensembles, Collants)',
  'Femmes > Vêtements > Lingerie et pyjamas > Ensembles':                                        'Lingerie (Soutiens-gorge, Culottes, Ensembles, Collants)',
  'Femmes > Vêtements > Lingerie et pyjamas > Gaines':                                           'Lingerie (Soutiens-gorge, Culottes, Ensembles, Collants)',
  'Femmes > Vêtements > Lingerie et pyjamas > Pyjamas et tenues de nuit':                        'Pyjamas, tenues de nuit & Peignoirs',
  'Femmes > Vêtements > Lingerie et pyjamas > Peignoirs':                                        'Pyjamas, tenues de nuit & Peignoirs',
  'Femmes > Vêtements > Lingerie et pyjamas > Collants':                                         'Lingerie (Soutiens-gorge, Culottes, Ensembles, Collants)',
  'Femmes > Vêtements > Lingerie et pyjamas > Chaussettes':                                      'Lingerie (Soutiens-gorge, Culottes, Ensembles, Collants)',
  'Femmes > Vêtements > Lingerie et pyjamas > Accessoires de lingerie':                          'Lingerie (Soutiens-gorge, Culottes, Ensembles, Collants)',
  'Femmes > Vêtements > Lingerie et pyjamas > Autres':                                           'Lingerie (Soutiens-gorge, Culottes, Ensembles, Collants)',

  /* ── Femmes > Vêtements > Maternité ───────────────────────────────────── */
  'Femmes > Vêtements > Maternité > Tops maternité':                                             'Maternité (Tops, Robes, Pantalons, Sous-vêtements)',
  'Femmes > Vêtements > Maternité > Robes maternité':                                            'Maternité (Tops, Robes, Pantalons, Sous-vêtements)',
  'Femmes > Vêtements > Maternité > Jupes maternité':                                            'Maternité (Tops, Robes, Pantalons, Sous-vêtements)',
  'Femmes > Vêtements > Maternité > Pantalons maternité':                                        'Maternité (Tops, Robes, Pantalons, Sous-vêtements)',
  'Femmes > Vêtements > Maternité > Shorts maternité':                                           'Maternité (Tops, Robes, Pantalons, Sous-vêtements)',
  'Femmes > Vêtements > Maternité > Combinaisons & combi shorts maternité':                      'Maternité (Tops, Robes, Pantalons, Sous-vêtements)',
  'Femmes > Vêtements > Maternité > Pulls à capuche & pulls maternité':                          'Maternité (Tops, Robes, Pantalons, Sous-vêtements)',
  'Femmes > Vêtements > Maternité > Manteaux & vestes maternité':                                'Maternité (Tops, Robes, Pantalons, Sous-vêtements)',
  'Femmes > Vêtements > Maternité > Maillots & tenues de plage maternité':                       'Maternité (Tops, Robes, Pantalons, Sous-vêtements)',
  'Femmes > Vêtements > Maternité > Sous-vêtements maternité > Sous-vêtements maternité':        'Maternité (Tops, Robes, Pantalons, Sous-vêtements)',
  'Femmes > Vêtements > Maternité > Sous-vêtements maternité > Tenues de nuit maternité':        'Maternité (Tops, Robes, Pantalons, Sous-vêtements)',
  'Femmes > Vêtements > Maternité > Sous-vêtements maternité > Soutiens-gorge grossesse & allaitement': 'Maternité (Tops, Robes, Pantalons, Sous-vêtements)',
  'Femmes > Vêtements > Maternité > Vêtements de sport':                                         'Maternité (Tops, Robes, Pantalons, Sous-vêtements)',

  /* ── Femmes > Vêtements > Vêtements de sport ──────────────────────────── */
  'Femmes > Vêtements > Vêtements de sport > Survêtements':                                      'Sweats & sweats à capuche',
  'Femmes > Vêtements > Vêtements de sport > Pantalons & leggings':                              'Pantalons (Chinos, Larges, Cuir, Leggings)',
  'Femmes > Vêtements > Vêtements de sport > Shorts':                                            'Shorts (Denim, Taille haute, Cuir, Cargo)',
  'Femmes > Vêtements > Vêtements de sport > Robes':                                             'Robes (Mini, Midi, Longues, Casual, Été, Hiver)',
  'Femmes > Vêtements > Vêtements de sport > Jupes':                                             'Jupes (Mini, Midi, Longues, Asymétriques)',
  'Femmes > Vêtements > Vêtements de sport > Hauts & t-shirts':                                  'T-shirts, Débardeurs, Tops courts',
  'Femmes > Vêtements > Vêtements de sport > Maillots':                                          'T-shirts, Débardeurs, Tops courts',
  'Femmes > Vêtements > Vêtements de sport > Sweats et sweats à capuche':                        'Sweats & sweats à capuche',
  'Femmes > Vêtements > Vêtements de sport > Accessoires de sports > Lunettes':                  'Lunettes de soleil',
  'Femmes > Vêtements > Vêtements de sport > Accessoires de sports > Gants':                     'Ceintures, Gants, Écharpes, Mouchoirs, Bretelles',
  'Femmes > Vêtements > Vêtements de sport > Accessoires de sports > Chapeaux':                  'Chapeaux, Casquettes, Bonnets, Cagoules',
  'Femmes > Vêtements > Vêtements de sport > Accessoires de sports > Écharpes':                  'Ceintures, Gants, Écharpes, Mouchoirs, Bretelles',
  'Femmes > Vêtements > Vêtements de sport > Accessoires de sports > Bracelets':                 'Bijoux (Bracelets, Colliers, Bagues, Boucles d\'oreilles)',
  'Femmes > Vêtements > Vêtements de sport > Brassières':                                        'Lingerie (Soutiens-gorge, Culottes, Ensembles, Collants)',
  'Femmes > Vêtements > Vêtements de sport > Autres':                                            'Costumes, tenues particulières & Autres',

  /* ── Femmes > Vêtements > divers ──────────────────────────────────────── */
  'Femmes > Vêtements > Costumes et tenues particulières':                                        'Costumes, tenues particulières & Autres',
  'Femmes > Vêtements > Autres':                                                                  'Costumes, tenues particulières & Autres',

  /* ════════════════════════════════════════════════════════════════════════ */
  /* Section 2 — Femmes > Chaussures                                        */
  /* ════════════════════════════════════════════════════════════════════════ */

  'Femmes > Chaussures > Ballerines':                                                             'Mocassins, Chaussures bateau & Habillées',
  'Femmes > Chaussures > Mocassins et chaussures bateau':                                         'Mocassins, Chaussures bateau & Habillées',
  'Femmes > Chaussures > Bottes > Bottines':                                                      'Bottes, Bottines (Chelsea, Lacets, Cuissardes)',
  'Femmes > Chaussures > Bottes > Bottes mi-hautes':                                              'Bottes, Bottines (Chelsea, Lacets, Cuissardes)',
  'Femmes > Chaussures > Bottes > Bottes hautes':                                                 'Bottes, Bottines (Chelsea, Lacets, Cuissardes)',
  'Femmes > Chaussures > Bottes > Cuissardes':                                                    'Bottes, Bottines (Chelsea, Lacets, Cuissardes)',
  'Femmes > Chaussures > Bottes > Bottes de neige':                                              'Chaussures de sport spécialisées (Randonnée, Ski, Tennis)',
  'Femmes > Chaussures > Bottes > Bottes de pluie':                                              'Chaussons, pantoufles, claquettes & tongs',
  'Femmes > Chaussures > Bottes > Bottes de travail':                                             'Chaussures de sport spécialisées (Randonnée, Ski, Tennis)',
  'Femmes > Chaussures > Mules et sabots':                                                        'Sandales, Mules, Sabots, Escarpins, Talons',
  'Femmes > Chaussures > Espadrilles':                                                            'Sandales, Mules, Sabots, Escarpins, Talons',
  'Femmes > Chaussures > Claquettes et tongs':                                                    'Chaussons, pantoufles, claquettes & tongs',
  'Femmes > Chaussures > Chaussures à talons':                                                    'Sandales, Mules, Sabots, Escarpins, Talons',
  'Femmes > Chaussures > Chaussures à lacets':                                                    'Mocassins, Chaussures bateau & Habillées',
  'Femmes > Chaussures > Babies et Mary-Jane':                                                    'Mocassins, Chaussures bateau & Habillées',
  'Femmes > Chaussures > Sandales':                                                               'Sandales, Mules, Sabots, Escarpins, Talons',
  'Femmes > Chaussures > Chaussons et pantoufles':                                                'Chaussons, pantoufles, claquettes & tongs',
  'Femmes > Chaussures > Chaussures de sport > Chaussures de basket':                            'Baskets & Sneakers Mode',
  'Femmes > Chaussures > Chaussures de sport > Chaussures de cyclisme':                          'Chaussures de sport spécialisées (Randonnée, Ski, Tennis)',
  'Femmes > Chaussures > Chaussures de sport > Chaussures de danse':                             'Mocassins, Chaussures bateau & Habillées',
  'Femmes > Chaussures > Chaussures de sport > Chaussures de foot':                              'Chaussures de sport spécialisées (Randonnée, Ski, Tennis)',
  'Femmes > Chaussures > Chaussures de sport > Chaussures de golf':                              'Chaussures de sport spécialisées (Randonnée, Ski, Tennis)',
  'Femmes > Chaussures > Chaussures de sport > Chaussures et bottes de randonnée':               'Chaussures de sport spécialisées (Randonnée, Ski, Tennis)',
  'Femmes > Chaussures > Chaussures de sport > Patins à glace':                                  'Chaussures de sport spécialisées (Randonnée, Ski, Tennis)',
  'Femmes > Chaussures > Chaussures de sport > Chaussures de foot en salle':                     'Chaussures de sport spécialisées (Randonnée, Ski, Tennis)',
  'Femmes > Chaussures > Chaussures de sport > Chaussures de fitness':                           'Baskets & Sneakers Mode',
  'Femmes > Chaussures > Chaussures de sport > Bottes de moto':                                  'Chaussures de sport spécialisées (Randonnée, Ski, Tennis)',
  'Femmes > Chaussures > Chaussures de sport > Patins à roulettes et rollers':                   'Chaussures de sport spécialisées (Randonnée, Ski, Tennis)',
  'Femmes > Chaussures > Chaussures de sport > Chaussures de course':                            'Baskets & Sneakers Mode',
  'Femmes > Chaussures > Chaussures de sport > Chaussures de ski':                               'Chaussures de sport spécialisées (Randonnée, Ski, Tennis)',
  'Femmes > Chaussures > Chaussures de sport > Bottes de snowboard':                             'Chaussures de sport spécialisées (Randonnée, Ski, Tennis)',
  'Femmes > Chaussures > Chaussures de sport > Chaussures aquatiques':                           'Chaussons, pantoufles, claquettes & tongs',
  'Femmes > Chaussures > Chaussures de sport > Chaussures de tennis':                            'Chaussures de sport spécialisées (Randonnée, Ski, Tennis)',
  'Femmes > Chaussures > Baskets':                                                                'Baskets & Sneakers Mode',

  /* ════════════════════════════════════════════════════════════════════════ */
  /* Section 3 — Femmes > Sacs + Accessoires + Beauté                       */
  /* ════════════════════════════════════════════════════════════════════════ */

  /* Sacs — les catégories "sac à main" activent isAccessoireLuxe pour luxe_iconique/ultra_luxe */
  'Femmes > Sacs > Sacs à dos':                                                                  'Bagages, Sacs de voyage, Mallettes, Cartables',
  'Femmes > Sacs > Sacs de plage':                                                               'Bagages, Sacs de voyage, Mallettes, Cartables',
  'Femmes > Sacs > Mallettes':                                                                   'Bagages, Sacs de voyage, Mallettes, Cartables',
  'Femmes > Sacs > Sacs seau':                                                                   'Sacs à main, Tote bags, Sacs bandoulière',
  'Femmes > Sacs > Sacs banane':                                                                 'Pochettes, Wristlets, Trousses à maquillage',
  'Femmes > Sacs > Pochettes':                                                                   'Pochettes, Wristlets, Trousses à maquillage',
  'Femmes > Sacs > Housses pour vêtements':                                                      'Bagages, Sacs de voyage, Mallettes, Cartables',
  'Femmes > Sacs > Sacs de sport':                                                               'Bagages, Sacs de voyage, Mallettes, Cartables',
  'Femmes > Sacs > Sacs à main':                                                                 'Sacs à main, Tote bags, Sacs bandoulière',
  'Femmes > Sacs > Besaces':                                                                     'Sacs à main, Tote bags, Sacs bandoulière',
  'Femmes > Sacs > Fourre-tout et sacs marins':                                                  'Sacs à main, Tote bags, Sacs bandoulière',
  'Femmes > Sacs > Sacs de voyage':                                                              'Bagages, Sacs de voyage, Mallettes, Cartables',
  'Femmes > Sacs > Trousses à maquillage':                                                       'Pochettes, Wristlets, Trousses à maquillage',
  'Femmes > Sacs > Cartables et sacoches':                                                       'Bagages, Sacs de voyage, Mallettes, Cartables',
  'Femmes > Sacs > Sacs à bandoulière':                                                          'Sacs à main, Tote bags, Sacs bandoulière',
  'Femmes > Sacs > Sacs fourre-tout':                                                            'Sacs à main, Tote bags, Sacs bandoulière',
  'Femmes > Sacs > Porte-monnaie':                                                               'Porte-monnaie & Petite maroquinerie',
  'Femmes > Sacs > Wristlets':                                                                   'Pochettes, Wristlets, Trousses à maquillage',

  /* Accessoires */
  'Femmes > Accessoires > Bandanas et foulards pour cheveux':                                     'Ceintures, Gants, Écharpes, Mouchoirs, Bretelles',
  'Femmes > Accessoires > Ceintures':                                                             'Ceintures, Gants, Écharpes, Mouchoirs, Bretelles',
  'Femmes > Accessoires > Gants':                                                                 'Ceintures, Gants, Écharpes, Mouchoirs, Bretelles',
  'Femmes > Accessoires > Accessoires pour cheveux':                                              'Ceintures, Gants, Écharpes, Mouchoirs, Bretelles',
  'Femmes > Accessoires > Mouchoirs de poche':                                                   'Ceintures, Gants, Écharpes, Mouchoirs, Bretelles',
  'Femmes > Accessoires > Chapeaux & casquettes > Cagoules':                                     'Chapeaux, Casquettes, Bonnets, Cagoules',
  'Femmes > Accessoires > Chapeaux & casquettes > Bonnets':                                      'Chapeaux, Casquettes, Bonnets, Cagoules',
  'Femmes > Accessoires > Chapeaux & casquettes > Casquettes':                                   'Chapeaux, Casquettes, Bonnets, Cagoules',
  'Femmes > Accessoires > Chapeaux & casquettes > Cache-oreilles':                               'Chapeaux, Casquettes, Bonnets, Cagoules',
  'Femmes > Accessoires > Chapeaux & casquettes > Fascinators':                                  'Chapeaux, Casquettes, Bonnets, Cagoules',
  'Femmes > Accessoires > Chapeaux & casquettes > Chapeaux':                                     'Chapeaux, Casquettes, Bonnets, Cagoules',
  'Femmes > Accessoires > Chapeaux & casquettes > Bandeaux':                                     'Chapeaux, Casquettes, Bonnets, Cagoules',
  'Femmes > Accessoires > Bijoux > Bracelets de cheville':                                       'Bijoux (Bracelets, Colliers, Bagues, Boucles d\'oreilles)',
  'Femmes > Accessoires > Bijoux > Bijoux de corps':                                             'Bijoux (Bracelets, Colliers, Bagues, Boucles d\'oreilles)',
  'Femmes > Accessoires > Bijoux > Bracelets':                                                   'Bijoux (Bracelets, Colliers, Bagues, Boucles d\'oreilles)',
  'Femmes > Accessoires > Bijoux > Broches':                                                     'Bijoux (Bracelets, Colliers, Bagues, Boucles d\'oreilles)',
  'Femmes > Accessoires > Bijoux > Breloques et pendentifs':                                     'Bijoux (Bracelets, Colliers, Bagues, Boucles d\'oreilles)',
  'Femmes > Accessoires > Bijoux > Ensembles de bijoux':                                         'Bijoux (Bracelets, Colliers, Bagues, Boucles d\'oreilles)',
  'Femmes > Accessoires > Bijoux > Colliers':                                                    'Bijoux (Bracelets, Colliers, Bagues, Boucles d\'oreilles)',
  'Femmes > Accessoires > Bijoux > Bagues':                                                      'Bijoux (Bracelets, Colliers, Bagues, Boucles d\'oreilles)',
  'Femmes > Accessoires > Bijoux > Autres bijoux':                                               'Bijoux (Bracelets, Colliers, Bagues, Boucles d\'oreilles)',
  'Femmes > Accessoires > Porte-clés':                                                           'Ceintures, Gants, Écharpes, Mouchoirs, Bretelles',
  'Femmes > Accessoires > Écharpes et châles':                                                   'Ceintures, Gants, Écharpes, Mouchoirs, Bretelles',
  'Femmes > Accessoires > Lunettes de soleil':                                                   'Lunettes de soleil',
  'Femmes > Accessoires > Parapluies':                                                            'Ceintures, Gants, Écharpes, Mouchoirs, Bretelles',
  'Femmes > Accessoires > Montres':                                                               'Montres analogiques & prestige',
  'Femmes > Accessoires > Autres accessoires':                                                   'Ceintures, Gants, Écharpes, Mouchoirs, Bretelles',

  /* Beauté */
  'Femmes > Beauté > Maquillage':                                                                'Maquillage & Cosmétiques (Visage, Yeux, Lèvres)',
  'Femmes > Beauté > Parfums':                                                                   'Parfums & Eaux de toilette',
  'Femmes > Beauté > Soins du visage':                                                           'Soins du visage, du corps, des cheveux, mains & ongles',
  'Femmes > Beauté > Accessoires de beauté':                                                     'Soins du visage, du corps, des cheveux, mains & ongles',
  'Femmes > Beauté > Soin mains':                                                                'Soins du visage, du corps, des cheveux, mains & ongles',
  'Femmes > Beauté > Manucure':                                                                  'Soins du visage, du corps, des cheveux, mains & ongles',
  'Femmes > Beauté > Soins du corps':                                                            'Soins du visage, du corps, des cheveux, mains & ongles',
  'Femmes > Beauté > Soins cheveux':                                                             'Soins du visage, du corps, des cheveux, mains & ongles',
  'Femmes > Beauté > Autres cosmétiques et accessoires':                                         'Soins du visage, du corps, des cheveux, mains & ongles',

  /* ════════════════════════════════════════════════════════════════════════ */
  /* Section 4 — Hommes > Vêtements                                         */
  /* ════════════════════════════════════════════════════════════════════════ */

  /* Jeans */
  'Hommes > Vêtements > Jeans > Jeans troués':                                                   'Jeans (Skinny, Slim, Coupe droite, Troués)',
  'Hommes > Vêtements > Jeans > Jeans skinny':                                                   'Jeans (Skinny, Slim, Coupe droite, Troués)',
  'Hommes > Vêtements > Jeans > Jeans slim':                                                     'Jeans (Skinny, Slim, Coupe droite, Troués)',
  'Hommes > Vêtements > Jeans > Jeans coupe droite':                                             'Jeans (Skinny, Slim, Coupe droite, Troués)',

  /* Manteaux et vestes */
  'Hommes > Vêtements > Manteaux et vestes > Manteaux > Duffle-coats':                           'Manteaux (Duffle-coats, Pardessus, Parkas, Trenchs)',
  'Hommes > Vêtements > Manteaux et vestes > Manteaux > Pardessus et manteaux longs':            'Manteaux (Duffle-coats, Pardessus, Parkas, Trenchs)',
  'Hommes > Vêtements > Manteaux et vestes > Manteaux > Parkas':                                 'Manteaux (Duffle-coats, Pardessus, Parkas, Trenchs)',
  'Hommes > Vêtements > Manteaux et vestes > Manteaux > Cabans':                                 'Manteaux (Duffle-coats, Pardessus, Parkas, Trenchs)',
  'Hommes > Vêtements > Manteaux et vestes > Manteaux > Imperméables':                           'Manteaux (Duffle-coats, Pardessus, Parkas, Trenchs)',
  'Hommes > Vêtements > Manteaux et vestes > Manteaux > Trenchs':                                'Manteaux (Duffle-coats, Pardessus, Parkas, Trenchs)',
  'Hommes > Vêtements > Manteaux et vestes > Vestes sans manches':                               'Vestes sans manches & Ponchos',
  'Hommes > Vêtements > Manteaux et vestes > Vestes > Perfectos et blousons de moto':            'Vestes (Perfectos, Aviateur, Denim, Doudounes, Ski)',
  'Hommes > Vêtements > Manteaux et vestes > Vestes > Blousons aviateur':                        'Vestes (Perfectos, Aviateur, Denim, Doudounes, Ski)',
  'Hommes > Vêtements > Manteaux et vestes > Vestes > Vestes en jean':                           'Vestes (Perfectos, Aviateur, Denim, Doudounes, Ski)',
  'Hommes > Vêtements > Manteaux et vestes > Vestes > Vestes militaires et utilitaires':         'Vestes (Perfectos, Aviateur, Denim, Doudounes, Ski)',
  'Hommes > Vêtements > Manteaux et vestes > Vestes > Vestes polaires':                          'Vestes (Perfectos, Aviateur, Denim, Doudounes, Ski)',
  'Hommes > Vêtements > Manteaux et vestes > Vestes > Vestes Harrington':                        'Vestes (Perfectos, Aviateur, Denim, Doudounes, Ski)',
  'Hommes > Vêtements > Manteaux et vestes > Vestes > Doudounes':                                'Vestes (Perfectos, Aviateur, Denim, Doudounes, Ski)',
  'Hommes > Vêtements > Manteaux et vestes > Vestes > Vestes matelassées':                       'Vestes (Perfectos, Aviateur, Denim, Doudounes, Ski)',
  'Hommes > Vêtements > Manteaux et vestes > Vestes > Vestes chemises':                          'Vestes (Perfectos, Aviateur, Denim, Doudounes, Ski)',
  'Hommes > Vêtements > Manteaux et vestes > Vestes > Vestes de ski et snowboard':               'Vestes (Perfectos, Aviateur, Denim, Doudounes, Ski)',
  'Hommes > Vêtements > Manteaux et vestes > Vestes > Blousons teddy':                           'Vestes (Perfectos, Aviateur, Denim, Doudounes, Ski)',
  'Hommes > Vêtements > Manteaux et vestes > Vestes > Vestes coupe-vent':                        'Vestes (Perfectos, Aviateur, Denim, Doudounes, Ski)',
  'Hommes > Vêtements > Manteaux et vestes > Ponchos':                                           'Vestes sans manches & Ponchos',

  /* Hauts et t-shirts */
  'Hommes > Vêtements > Hauts et t-shirts > Chemises':                                           'Chemises (Habillées, Casual)',
  'Hommes > Vêtements > Hauts et t-shirts > T-shirts':                                           'T-shirts, Polos & Débardeurs',
  'Hommes > Vêtements > Hauts et t-shirts > Polos':                                              'T-shirts, Polos & Débardeurs',
  'Hommes > Vêtements > Hauts et t-shirts > T-shirts sans manches':                              'T-shirts, Polos & Débardeurs',

  /* Costumes et blazers */
  'Hommes > Vêtements > Costumes et blazers > Blazers':                                          'Blazers & Ensembles tailleurs',
  'Hommes > Vêtements > Costumes et blazers > Pantalons de costume':                             'Pantalons & Gilets de costume séparés',
  'Hommes > Vêtements > Costumes et blazers > Gilets de costume':                                'Pantalons & Gilets de costume séparés',
  'Hommes > Vêtements > Costumes et blazers > Ensembles costume':                                'Ensembles costume & Costumes de mariage',
  'Hommes > Vêtements > Costumes et blazers > Costumes de mariage':                              'Ensembles costume & Costumes de mariage',
  'Hommes > Vêtements > Costumes et blazers > Autres':                                           'Ensembles costume & Costumes de mariage',

  /* Sweats et pulls */
  'Hommes > Vêtements > Sweats et pulls > Sweats':                                               'Sweats, Pulls (Col roulé, Col V, Ras de cou, Capuche)',
  'Hommes > Vêtements > Sweats et pulls > Pulls et pulls à capuche':                             'Sweats, Pulls (Col roulé, Col V, Ras de cou, Capuche)',
  'Hommes > Vêtements > Sweats et pulls > Pulls à capuche avec zip':                             'Sweats, Pulls (Col roulé, Col V, Ras de cou, Capuche)',
  'Hommes > Vêtements > Sweats et pulls > Cardigans':                                            'Cardigans & Vestes en maille',
  'Hommes > Vêtements > Sweats et pulls > Pulls ras de cou':                                     'Sweats, Pulls (Col roulé, Col V, Ras de cou, Capuche)',
  'Hommes > Vêtements > Sweats et pulls > Sweats à col V':                                       'Sweats, Pulls (Col roulé, Col V, Ras de cou, Capuche)',
  'Hommes > Vêtements > Sweats et pulls > Pulls à col roulé':                                    'Sweats, Pulls (Col roulé, Col V, Ras de cou, Capuche)',
  'Hommes > Vêtements > Sweats et pulls > Sweats longs':                                         'Sweats, Pulls (Col roulé, Col V, Ras de cou, Capuche)',
  'Hommes > Vêtements > Sweats et pulls > Vestes':                                               'Cardigans & Vestes en maille',
  'Hommes > Vêtements > Sweats et pulls > Autres':                                               'Sweats, Pulls (Col roulé, Col V, Ras de cou, Capuche)',

  /* Pantalons */
  'Hommes > Vêtements > Pantalons > Chinos':                                                     'Pantalons (Chinos, Jogging, Cargo)',
  'Hommes > Vêtements > Pantalons > Jogging':                                                    'Pantalons (Chinos, Jogging, Cargo)',
  'Hommes > Vêtements > Pantalons > Pantalons skinny':                                           'Pantalons (Chinos, Jogging, Cargo)',
  'Hommes > Vêtements > Pantalons > Pantacourts':                                                'Shorts (Cargo, Chino, Denim)',
  'Hommes > Vêtements > Pantalons > Pantalons de costume':                                       'Pantalons & Gilets de costume séparés',
  'Hommes > Vêtements > Pantalons > Pantalons à jambes larges':                                  'Pantalons (Chinos, Jogging, Cargo)',
  'Hommes > Vêtements > Pantalons > Autres pantalons':                                           'Pantalons (Chinos, Jogging, Cargo)',

  /* Shorts */
  'Hommes > Vêtements > Shorts > Shorts cargo':                                                  'Shorts (Cargo, Chino, Denim)',
  'Hommes > Vêtements > Shorts > Shorts chino':                                                  'Shorts (Cargo, Chino, Denim)',
  'Hommes > Vêtements > Shorts > Shorts en jean':                                                'Shorts (Cargo, Chino, Denim)',
  'Hommes > Vêtements > Shorts > Autres shorts':                                                 'Shorts (Cargo, Chino, Denim)',

  /* Sous-vêtements, pyjamas, maillots */
  'Hommes > Vêtements > Sous-vêtements et chaussettes > Sous-vêtements':                         'Sous-vêtements & Chaussettes',
  'Hommes > Vêtements > Sous-vêtements et chaussettes > Chaussettes':                            'Sous-vêtements & Chaussettes',
  'Hommes > Vêtements > Sous-vêtements et chaussettes > Peignoirs':                              'Pyjamas & Peignoirs',
  'Hommes > Vêtements > Sous-vêtements et chaussettes > Autres':                                 'Sous-vêtements & Chaussettes',
  'Hommes > Vêtements > Pyjamas > Pyjamas une-pièce':                                            'Pyjamas & Peignoirs',
  'Hommes > Vêtements > Pyjamas > Bas de pyjama':                                                'Pyjamas & Peignoirs',
  'Hommes > Vêtements > Pyjamas > Ensembles de pyjamas':                                         'Pyjamas & Peignoirs',
  'Hommes > Vêtements > Pyjamas > Hauts de pyjama':                                              'Pyjamas & Peignoirs',
  'Hommes > Vêtements > Maillots de bain':                                                       'Maillots de bain',

  /* Vêtements de sport (logique sport : haut → T-shirts/Polos, bas → Pantalons) */
  'Hommes > Vêtements > Vêtements de sport et accessoires > Survêtements':                       'Sweats, Pulls (Col roulé, Col V, Ras de cou, Capuche)',
  'Hommes > Vêtements > Vêtements de sport et accessoires > Pantalons':                          'Pantalons (Chinos, Jogging, Cargo)',
  'Hommes > Vêtements > Vêtements de sport et accessoires > Shorts':                             'Shorts (Cargo, Chino, Denim)',
  'Hommes > Vêtements > Vêtements de sport et accessoires > Hauts et t-shirts':                  'T-shirts, Polos & Débardeurs',
  'Hommes > Vêtements > Vêtements de sport et accessoires > Maillots':                           'T-shirts, Polos & Débardeurs',
  'Hommes > Vêtements > Vêtements de sport et accessoires > Pulls & sweats':                     'Sweats, Pulls (Col roulé, Col V, Ras de cou, Capuche)',
  'Hommes > Vêtements > Vêtements de sport et accessoires > Accessoires de sports > Lunettes':   'Lunettes de soleil',
  'Hommes > Vêtements > Vêtements de sport et accessoires > Accessoires de sports > Gants':      'Ceintures, Gants, Écharpes, Mouchoirs, Bretelles',
  'Hommes > Vêtements > Vêtements de sport et accessoires > Accessoires de sports > Chapeaux et casquettes': 'Chapeaux, Casquettes, Bonnets, Cagoules',
  'Hommes > Vêtements > Vêtements de sport et accessoires > Accessoires de sports > Écharpes':   'Ceintures, Gants, Écharpes, Mouchoirs, Bretelles',
  'Hommes > Vêtements > Vêtements de sport et accessoires > Accessoires de sports > Bracelets':  'Bijoux (Bracelets, Colliers, Bagues, Boucles d\'oreilles)',
  'Hommes > Vêtements > Vêtements de sport et accessoires > Autres':                             'Costumes, tenues particulières & Autres',
  'Hommes > Vêtements > Vêtements spécialisés et costumes':                                      'Costumes, tenues particulières & Autres',
  'Hommes > Vêtements > Autres':                                                                  'Costumes, tenues particulières & Autres',

  /* ════════════════════════════════════════════════════════════════════════ */
  /* Section 5 — Hommes > Chaussures                                        */
  /* ════════════════════════════════════════════════════════════════════════ */

  'Hommes > Chaussures > Mocassins et chaussures bateau':                                         'Mocassins, Chaussures bateau & Habillées',
  'Hommes > Chaussures > Bottes > Bottines Chelsea et sans lacets':                               'Bottes, Bottines (Chelsea, Lacets, Cuissardes)',
  'Hommes > Chaussures > Bottes > Bottes de neige':                                              'Chaussures de sport spécialisées (Randonnée, Ski, Tennis)',
  'Hommes > Chaussures > Bottes > Bottes de pluie':                                              'Chaussons, pantoufles, claquettes & tongs',
  'Hommes > Chaussures > Bottes > Bottes de travail':                                             'Chaussures de sport spécialisées (Randonnée, Ski, Tennis)',
  'Hommes > Chaussures > Mules et sabots':                                                        'Sandales, Mules, Sabots, Escarpins, Talons',
  'Hommes > Chaussures > Espadrilles':                                                            'Sandales, Mules, Sabots, Escarpins, Talons',
  'Hommes > Chaussures > Claquettes et tongs':                                                    'Chaussons, pantoufles, claquettes & tongs',
  'Hommes > Chaussures > Chaussures habillées':                                                   'Mocassins, Chaussures bateau & Habillées',
  'Hommes > Chaussures > Sandales':                                                               'Sandales, Mules, Sabots, Escarpins, Talons',
  'Hommes > Chaussures > Chaussons et pantoufles':                                                'Chaussons, pantoufles, claquettes & tongs',
  'Hommes > Chaussures > Chaussures de sport > Chaussures de basket':                            'Baskets & Sneakers Mode',
  'Hommes > Chaussures > Chaussures de sport > Chaussures de cyclisme':                          'Chaussures de sport spécialisées (Randonnée, Ski, Tennis)',
  'Hommes > Chaussures > Chaussures de sport > Chaussures de danse':                             'Mocassins, Chaussures bateau & Habillées',
  'Hommes > Chaussures > Chaussures de sport > Chaussures de foot':                              'Chaussures de sport spécialisées (Randonnée, Ski, Tennis)',
  'Hommes > Chaussures > Chaussures de sport > Chaussures de golf':                              'Chaussures de sport spécialisées (Randonnée, Ski, Tennis)',
  'Hommes > Chaussures > Chaussures de sport > Chaussures et bottes de randonnée':               'Chaussures de sport spécialisées (Randonnée, Ski, Tennis)',
  'Hommes > Chaussures > Chaussures de sport > Patins à glace':                                  'Chaussures de sport spécialisées (Randonnée, Ski, Tennis)',
  'Hommes > Chaussures > Chaussures de sport > Chaussures de foot en salle':                     'Chaussures de sport spécialisées (Randonnée, Ski, Tennis)',
  'Hommes > Chaussures > Chaussures de sport > Chaussures de fitness':                           'Baskets & Sneakers Mode',
  'Hommes > Chaussures > Chaussures de sport > Bottes de moto':                                  'Chaussures de sport spécialisées (Randonnée, Ski, Tennis)',
  'Hommes > Chaussures > Chaussures de sport > Patins à roulettes et rollers':                   'Chaussures de sport spécialisées (Randonnée, Ski, Tennis)',
  'Hommes > Chaussures > Chaussures de sport > Chaussures de course':                            'Baskets & Sneakers Mode',
  'Hommes > Chaussures > Chaussures de sport > Bottes de ski':                                   'Chaussures de sport spécialisées (Randonnée, Ski, Tennis)',
  'Hommes > Chaussures > Chaussures de sport > Bottes de snowboard':                             'Chaussures de sport spécialisées (Randonnée, Ski, Tennis)',
  'Hommes > Chaussures > Chaussures de sport > Chaussures aquatiques':                           'Chaussons, pantoufles, claquettes & tongs',
  'Hommes > Chaussures > Chaussures de sport > Chaussures de tennis':                            'Chaussures de sport spécialisées (Randonnée, Ski, Tennis)',
  'Hommes > Chaussures > Baskets':                                                                'Baskets & Sneakers Mode',

  /* ════════════════════════════════════════════════════════════════════════ */
  /* Section 6 — Hommes > Accessoires & Sacs + Soins                        */
  /* ════════════════════════════════════════════════════════════════════════ */

  /* Sacs et sacoches */
  'Hommes > Accessoires > Sacs et sacoches > Sacs à dos':                                        'Bagages, Sacs de voyage, Mallettes, Cartables',
  'Hommes > Accessoires > Sacs et sacoches > Mallettes':                                         'Bagages, Sacs de voyage, Mallettes, Cartables',
  'Hommes > Accessoires > Sacs et sacoches > Sacs banane':                                       'Pochettes, Wristlets, Trousses à maquillage',
  'Hommes > Accessoires > Sacs et sacoches > Housses pour vêtements':                            'Bagages, Sacs de voyage, Mallettes, Cartables',
  'Hommes > Accessoires > Sacs et sacoches > Sacs de sport':                                     'Bagages, Sacs de voyage, Mallettes, Cartables',
  'Hommes > Accessoires > Sacs et sacoches > Fourre-tout et sacs marins':                        'Sacs à main, Tote bags, Sacs bandoulière',
  'Hommes > Accessoires > Sacs et sacoches > Bagages et valises':                                'Bagages, Sacs de voyage, Mallettes, Cartables',
  'Hommes > Accessoires > Sacs et sacoches > Cartables et sacoches':                             'Bagages, Sacs de voyage, Mallettes, Cartables',
  'Hommes > Accessoires > Sacs et sacoches > Sacs à bandoulière':                                'Sacs à main, Tote bags, Sacs bandoulière',
  'Hommes > Accessoires > Sacs et sacoches > Porte-monnaie':                                     'Porte-monnaie & Petite maroquinerie',

  /* Accessoires */
  'Hommes > Accessoires > Bandanas et foulards pour cheveux':                                     'Ceintures, Gants, Écharpes, Mouchoirs, Bretelles',
  'Hommes > Accessoires > Ceintures':                                                             'Ceintures, Gants, Écharpes, Mouchoirs, Bretelles',
  'Hommes > Accessoires > Bretelles':                                                             'Ceintures, Gants, Écharpes, Mouchoirs, Bretelles',
  'Hommes > Accessoires > Gants':                                                                 'Ceintures, Gants, Écharpes, Mouchoirs, Bretelles',
  'Hommes > Accessoires > Mouchoirs de poche':                                                   'Ceintures, Gants, Écharpes, Mouchoirs, Bretelles',
  'Hommes > Accessoires > Chapeaux et casquettes > Cagoules':                                    'Chapeaux, Casquettes, Bonnets, Cagoules',
  'Hommes > Accessoires > Chapeaux et casquettes > Bonnets':                                     'Chapeaux, Casquettes, Bonnets, Cagoules',
  'Hommes > Accessoires > Chapeaux et casquettes > Casquettes':                                  'Chapeaux, Casquettes, Bonnets, Cagoules',
  'Hommes > Accessoires > Chapeaux et casquettes > Chapeaux':                                    'Chapeaux, Casquettes, Bonnets, Cagoules',
  'Hommes > Accessoires > Bijoux > Bracelets':                                                   'Bijoux (Bracelets, Colliers, Bagues, Boucles d\'oreilles)',
  'Hommes > Accessoires > Bijoux > Breloques et pendentifs':                                     'Bijoux (Bracelets, Colliers, Bagues, Boucles d\'oreilles)',
  'Hommes > Accessoires > Bijoux > Boutons de manchette':                                        'Bijoux (Bracelets, Colliers, Bagues, Boucles d\'oreilles)',
  'Hommes > Accessoires > Bijoux > Colliers':                                                    'Bijoux (Bracelets, Colliers, Bagues, Boucles d\'oreilles)',
  'Hommes > Accessoires > Bijoux > Bagues':                                                      'Bijoux (Bracelets, Colliers, Bagues, Boucles d\'oreilles)',
  'Hommes > Accessoires > Bijoux > Autre':                                                       'Bijoux (Bracelets, Colliers, Bagues, Boucles d\'oreilles)',
  'Hommes > Accessoires > Pochettes de costume':                                                  'Ceintures, Gants, Écharpes, Mouchoirs, Bretelles',
  'Hommes > Accessoires > Écharpes et châles':                                                   'Ceintures, Gants, Écharpes, Mouchoirs, Bretelles',
  'Hommes > Accessoires > Lunettes de soleil':                                                   'Lunettes de soleil',
  'Hommes > Accessoires > Cravates et nœuds papillons':                                          'Ceintures, Gants, Écharpes, Mouchoirs, Bretelles',
  'Hommes > Accessoires > Montres':                                                               'Montres analogiques & prestige',
  'Hommes > Accessoires > Autres':                                                                'Ceintures, Gants, Écharpes, Mouchoirs, Bretelles',

  /* Soins */
  'Hommes > Soins > Soins visage':                                                               'Soins du visage, du corps, des cheveux, mains & ongles',
  'Hommes > Soins > Accessoires':                                                                'Soins du visage, du corps, des cheveux, mains & ongles',
  'Hommes > Soins > Soins cheveux':                                                              'Soins du visage, du corps, des cheveux, mains & ongles',
  'Hommes > Soins > Soins du corps':                                                             'Soins du visage, du corps, des cheveux, mains & ongles',
  'Hommes > Soins > Soins mains et ongles':                                                      'Soins du visage, du corps, des cheveux, mains & ongles',
  'Hommes > Soins > Parfums':                                                                    'Parfums & Eaux de toilette',
  'Hommes > Soins > Maquillage':                                                                 'Maquillage & Cosmétiques (Visage, Yeux, Lèvres)',
  'Hommes > Soins > Coffrets':                                                                   'Soins du visage, du corps, des cheveux, mains & ongles',
  'Hommes > Soins > Autres cosmétiques':                                                         'Soins du visage, du corps, des cheveux, mains & ongles',

  /* ════════════════════════════════════════════════════════════════════════ */
  /* Section 7a — Enfants                                                   */
  /* ════════════════════════════════════════════════════════════════════════ */

  /* Vêtements pour filles — mappés vers catégories équivalentes adultes */
  'Enfants > Vêtements pour filles > Bébé filles':                                               'Costumes, tenues particulières & Autres',
  'Enfants > Vêtements pour filles > Chaussures':                                                'Baskets & Sneakers Mode',
  'Enfants > Vêtements pour filles > Pulls & sweats':                                            'Sweats & sweats à capuche',
  'Enfants > Vêtements pour filles > Chemises et t-shirts':                                      'T-shirts, Débardeurs, Tops courts',
  'Enfants > Vêtements pour filles > Robes':                                                     'Robes (Mini, Midi, Longues, Casual, Été, Hiver)',
  'Enfants > Vêtements pour filles > Jupes':                                                     'Jupes (Mini, Midi, Longues, Asymétriques)',
  'Enfants > Vêtements pour filles > Pantalons et shorts':                                       'Pantalons (Chinos, Larges, Cuir, Leggings)',
  'Enfants > Vêtements pour filles > Sacs et sacs à dos':                                        'Bagages, Sacs de voyage, Mallettes, Cartables',
  'Enfants > Vêtements pour filles > Accessoires':                                               'Ceintures, Gants, Écharpes, Mouchoirs, Bretelles',
  'Enfants > Vêtements pour filles > Équipements de natation':                                   'Maillots de bain (1 pièce, 2 pièces, Paréos)',
  'Enfants > Vêtements pour filles > Sous-vêtements':                                            'Lingerie (Soutiens-gorge, Culottes, Ensembles, Collants)',
  'Enfants > Vêtements pour filles > Pyjamas et chemises de nuit':                               'Pyjamas, tenues de nuit & Peignoirs',
  'Enfants > Vêtements pour filles > Vêtements de sport':                                        'T-shirts, Débardeurs, Tops courts',
  'Enfants > Vêtements pour filles > Lots de vêtements':                                         'Costumes, tenues particulières & Autres',
  'Enfants > Vêtements pour filles > Jumeaux et plus':                                           'Costumes, tenues particulières & Autres',
  'Enfants > Vêtements pour filles > Déguisements':                                              'Costumes, tenues particulières & Autres',
  'Enfants > Vêtements pour filles > Tenues de soirée':                                          'Robes d\'occasion & Robes chics / Soirée',
  'Enfants > Vêtements pour filles > Autres':                                                    'Costumes, tenues particulières & Autres',

  /* Vêtements pour garçons */
  'Enfants > Vêtements pour garçons > Bébé garçons':                                             'Costumes, tenues particulières & Autres',
  'Enfants > Vêtements pour garçons > Chaussures':                                               'Baskets & Sneakers Mode',
  'Enfants > Vêtements pour garçons > Pulls & sweats':                                           'Sweats, Pulls (Col roulé, Col V, Ras de cou, Capuche)',
  'Enfants > Vêtements pour garçons > Chemises et t-shirts':                                     'T-shirts, Polos & Débardeurs',
  'Enfants > Vêtements pour garçons > Pantalons et shorts':                                      'Pantalons (Chinos, Jogging, Cargo)',
  'Enfants > Vêtements pour garçons > Sacs et sacs à dos':                                       'Bagages, Sacs de voyage, Mallettes, Cartables',
  'Enfants > Vêtements pour garçons > Accessoires':                                              'Ceintures, Gants, Écharpes, Mouchoirs, Bretelles',
  'Enfants > Vêtements pour garçons > Équipements de natation':                                  'Maillots de bain',
  'Enfants > Vêtements pour garçons > Sous-vêtements':                                           'Sous-vêtements & Chaussettes',
  'Enfants > Vêtements pour garçons > Pyjamas':                                                  'Pyjamas & Peignoirs',
  'Enfants > Vêtements pour garçons > Vêtements de sport':                                       'T-shirts, Polos & Débardeurs',
  'Enfants > Vêtements pour garçons > Lots de vêtements':                                        'Costumes, tenues particulières & Autres',
  'Enfants > Vêtements pour garçons > Jumeaux et plus':                                          'Costumes, tenues particulières & Autres',
  'Enfants > Vêtements pour garçons > Déguisements':                                             'Costumes, tenues particulières & Autres',
  'Enfants > Vêtements pour garçons > Tenues de soirée':                                         'Ensembles costume & Costumes de mariage',
  'Enfants > Vêtements pour garçons > Autres':                                                   'Costumes, tenues particulières & Autres',

  /* Jeux et jouets */
  'Enfants > Jeux et jouets > Figurines et accessoires':                                          'Jeux et jouets (Figurines, Poupées, Éducatifs, Peluches)',
  'Enfants > Jeux et jouets > Loisirs créatifs':                                                 'Jeux et jouets (Figurines, Poupées, Éducatifs, Peluches)',
  'Enfants > Jeux et jouets > Activités et jouets pour bébé':                                    'Jeux et jouets (Figurines, Poupées, Éducatifs, Peluches)',
  'Enfants > Jeux et jouets > Jeux de construction':                                             'Jeux et jouets (Figurines, Poupées, Éducatifs, Peluches)',
  'Enfants > Jeux et jouets > Poupées poupons et accessoires':                                   'Jeux et jouets (Figurines, Poupées, Éducatifs, Peluches)',
  'Enfants > Jeux et jouets > Déguisements et jeux de rôle':                                     'Jeux et jouets (Figurines, Poupées, Éducatifs, Peluches)',
  'Enfants > Jeux et jouets > Jeux éducatifs':                                                   'Jeux et jouets (Figurines, Poupées, Éducatifs, Peluches)',
  'Enfants > Jeux et jouets > Jeux et jouets électroniques':                                     'Jeux et jouets (Figurines, Poupées, Éducatifs, Peluches)',
  'Enfants > Jeux et jouets > Jeux/jouets musicaux et instruments':                              'Jeux et jouets (Figurines, Poupées, Éducatifs, Peluches)',
  'Enfants > Jeux et jouets > Jeux de cirque fidgets et gadgets':                                'Jeux et jouets (Figurines, Poupées, Éducatifs, Peluches)',
  'Enfants > Jeux et jouets > Jeux de sport et de plein air':                                    'Jeux et jouets (Figurines, Poupées, Éducatifs, Peluches)',
  'Enfants > Jeux et jouets > Peluches':                                                         'Jeux et jouets (Figurines, Poupées, Éducatifs, Peluches)',
  'Enfants > Jeux et jouets > Voitures trains et autres véhicules':                              'Jeux et jouets (Figurines, Poupées, Éducatifs, Peluches)',

  /* Poussettes */
  'Enfants > Poussettes porte-bébé et sièges auto > Porte-bébé et écharpes':                    'Poussettes, landaus, porte-bébé & sièges auto',
  'Enfants > Poussettes porte-bébé et sièges auto > Poussettes et landaus':                      'Poussettes, landaus, porte-bébé & sièges auto',
  'Enfants > Poussettes porte-bébé et sièges auto > Accessoires de poussette':                   'Poussettes, landaus, porte-bébé & sièges auto',
  'Enfants > Poussettes porte-bébé et sièges auto > Sièges auto':                                'Poussettes, landaus, porte-bébé & sièges auto',
  'Enfants > Poussettes porte-bébé et sièges auto > Rehausseurs':                                'Poussettes, landaus, porte-bébé & sièges auto',
  'Enfants > Poussettes porte-bébé et sièges auto > Accessoires pour siège auto':                'Poussettes, landaus, porte-bébé & sièges auto',

  /* ════════════════════════════════════════════════════════════════════════ */
  /* Section 7b — Maison                                                    */
  /* ════════════════════════════════════════════════════════════════════════ */

  'Maison > Petits appareils de cuisine > Bouilloires':                                           'Petits appareils de cuisine (Bouilloires, Blenders, Grils)',
  'Maison > Petits appareils de cuisine > Grille-pain':                                           'Petits appareils de cuisine (Bouilloires, Blenders, Grils)',
  'Maison > Petits appareils de cuisine > Blenders mixeurs et robots de cuisine':                 'Petits appareils de cuisine (Bouilloires, Blenders, Grils)',
  'Maison > Petits appareils de cuisine > Micro-ondes':                                           'Petits appareils de cuisine (Bouilloires, Blenders, Grils)',
  'Maison > Petits appareils de cuisine > Friteuses':                                             'Petits appareils de cuisine (Bouilloires, Blenders, Grils)',
  'Maison > Petits appareils de cuisine > Plaques de cuisson':                                    'Petits appareils de cuisine (Bouilloires, Blenders, Grils)',
  'Maison > Petits appareils de cuisine > Grils et planchas':                                     'Petits appareils de cuisine (Bouilloires, Blenders, Grils)',
  'Maison > Petits appareils de cuisine > Extracteurs de jus':                                    'Petits appareils de cuisine (Bouilloires, Blenders, Grils)',
  'Maison > Petits appareils de cuisine > Appareils spécialisés':                                 'Petits appareils de cuisine (Bouilloires, Blenders, Grils)',
  'Maison > Petits appareils de cuisine > Accessoires pour petits appareils de cuisine':          'Outils de cuisine (Planches, Ustensiles, Stockage)',
  'Maison > Petits appareils de cuisine > Pièces détachées pour petits appareils de cuisine':     'Outils de cuisine (Planches, Ustensiles, Stockage)',
  'Maison > Cuisson et pâtisserie > Casseroles':                                                  'Cuisson (Casseroles, Poêles, Plats four, Moules)',
  'Maison > Cuisson et pâtisserie > Poêles':                                                      'Cuisson (Casseroles, Poêles, Plats four, Moules)',
  'Maison > Cuisson et pâtisserie > Plaques pour la cuisson':                                     'Cuisson (Casseroles, Poêles, Plats four, Moules)',
  'Maison > Cuisson et pâtisserie > Plats pour le four':                                          'Cuisson (Casseroles, Poêles, Plats four, Moules)',
  'Maison > Cuisson et pâtisserie > Moules de cuisson':                                           'Cuisson (Casseroles, Poêles, Plats four, Moules)',
  'Maison > Cuisson et pâtisserie > Matériel de cuisson et de pâtisserie spécialisé':             'Cuisson (Casseroles, Poêles, Plats four, Moules)',
  'Maison > Cuisson et pâtisserie > Batteries de cuisine':                                        'Cuisson (Casseroles, Poêles, Plats four, Moules)',
  'Maison > Cuisson et pâtisserie > Accessoires pour la cuisine et la pâtisserie':                'Outils de cuisine (Planches, Ustensiles, Stockage)',
  'Maison > Outils de cuisine > Planches à découper':                                             'Outils de cuisine (Planches, Ustensiles, Stockage)',
  'Maison > Outils de cuisine > Ustensiles de cuisine':                                           'Outils de cuisine (Planches, Ustensiles, Stockage)',
  'Maison > Outils de cuisine > Balances de cuisine':                                             'Outils de cuisine (Planches, Ustensiles, Stockage)',
  'Maison > Outils de cuisine > Tasses et cuillères à mesurer':                                   'Outils de cuisine (Planches, Ustensiles, Stockage)',
  'Maison > Outils de cuisine > Thermomètres alimentaires':                                       'Outils de cuisine (Planches, Ustensiles, Stockage)',
  'Maison > Outils de cuisine > Bols à mélanger':                                                 'Outils de cuisine (Planches, Ustensiles, Stockage)',
  'Maison > Outils de cuisine > Passoires tamis et chinois':                                      'Outils de cuisine (Planches, Ustensiles, Stockage)',
  'Maison > Outils de cuisine > Stockage alimentaire':                                            'Outils de cuisine (Planches, Ustensiles, Stockage)',
  'Maison > Outils de cuisine > Accessoires de bar':                                              'Outils de cuisine (Planches, Ustensiles, Stockage)',
  'Maison > Outils de cuisine > Ustensiles de cuisine spécialisés':                               'Outils de cuisine (Planches, Ustensiles, Stockage)',
  'Maison > Arts de la table > Couverts':                                                         'Arts de la table (Couverts, Vaisselle, Verres)',
  'Maison > Arts de la table > Vaisselle':                                                        'Arts de la table (Couverts, Vaisselle, Verres)',
  'Maison > Arts de la table > Verres':                                                           'Arts de la table (Couverts, Vaisselle, Verres)',
  'Maison > Arts de la table > Vaisselle de service':                                             'Arts de la table (Couverts, Vaisselle, Verres)',
  'Maison > Entretien de la maison > Chauffage climatisation et ventilation':                     'Entretien de la maison (Aspirateurs, Fers, Chauffage élec)',
  'Maison > Entretien de la maison > Aspirateurs et nettoyage':                                   'Entretien de la maison (Aspirateurs, Fers, Chauffage élec)',
  'Maison > Textiles > Linge de lit':                                                             'Textiles Maison (Linge de lit, Couvertures, Rideaux, Tapis)',
  'Maison > Textiles > Couvertures':                                                              'Textiles Maison (Linge de lit, Couvertures, Rideaux, Tapis)',
  'Maison > Textiles > Rideaux et stores':                                                        'Textiles Maison (Linge de lit, Couvertures, Rideaux, Tapis)',
  'Maison > Textiles > Coussins décoratifs':                                                      'Textiles Maison (Linge de lit, Couvertures, Rideaux, Tapis)',
  'Maison > Textiles > Housses':                                                                  'Textiles Maison (Linge de lit, Couvertures, Rideaux, Tapis)',
  'Maison > Textiles > Tapis':                                                                    'Textiles Maison (Linge de lit, Couvertures, Rideaux, Tapis)',
  'Maison > Textiles > Linge de table':                                                           'Textiles Maison (Linge de lit, Couvertures, Rideaux, Tapis)',
  'Maison > Textiles > Tapisseries':                                                              'Textiles Maison (Linge de lit, Couvertures, Rideaux, Tapis)',
  'Maison > Textiles > Serviettes':                                                               'Textiles Maison (Linge de lit, Couvertures, Rideaux, Tapis)',
  'Maison > Décoration > Horloges':                                                               'Décoration (Bougies, Vases, Miroirs, Éclairage, Cadres)',
  'Maison > Décoration > Sculptures et figurines':                                                'Décoration (Bougies, Vases, Miroirs, Éclairage, Cadres)',
  'Maison > Décoration > Accessoires décoratifs':                                                 'Décoration (Bougies, Vases, Miroirs, Éclairage, Cadres)',
  'Maison > Décoration > Plantes et fleurs artificielles':                                        'Décoration (Bougies, Vases, Miroirs, Éclairage, Cadres)',
  'Maison > Décoration > Accessoires pour cheminées':                                             'Décoration (Bougies, Vases, Miroirs, Éclairage, Cadres)',
  'Maison > Décoration > Éclairage':                                                              'Décoration (Bougies, Vases, Miroirs, Éclairage, Cadres)',
  'Maison > Décoration > Étagères murales':                                                       'Décoration (Bougies, Vases, Miroirs, Éclairage, Cadres)',
  'Maison > Décoration > Encadrements':                                                           'Décoration (Bougies, Vases, Miroirs, Éclairage, Cadres)',
  'Maison > Décoration > Miroirs':                                                                'Décoration (Bougies, Vases, Miroirs, Éclairage, Cadres)',
  'Maison > Décoration > Vases':                                                                  'Décoration (Bougies, Vases, Miroirs, Éclairage, Cadres)',
  'Maison > Décoration > Décorations murales':                                                    'Décoration (Bougies, Vases, Miroirs, Éclairage, Cadres)',
  'Maison > Fournitures de bureau > Agendas et organiseurs':                                      'Fournitures de bureau & Éléments d\'organisation',
  'Maison > Fournitures de bureau > Carnets et blocs-notes':                                      'Fournitures de bureau & Éléments d\'organisation',
  'Maison > Fournitures de bureau > Trousses':                                                    'Fournitures de bureau & Éléments d\'organisation',
  'Maison > Fournitures de bureau > Marque-pages':                                                'Fournitures de bureau & Éléments d\'organisation',
  'Maison > Fournitures de bureau > Calculatrices':                                               'Fournitures de bureau & Éléments d\'organisation',
  'Maison > Fournitures de bureau > Accessoires de bureau':                                       'Fournitures de bureau & Éléments d\'organisation',
  'Maison > Fournitures de bureau > Organiseurs de documents':                                    'Fournitures de bureau & Éléments d\'organisation',
  'Maison > Fournitures de bureau > Outils de dessin technique':                                  'Fournitures de bureau & Éléments d\'organisation',
  'Maison > Fournitures de bureau > Rubans adhésifs pinces et attaches':                          'Fournitures de bureau & Éléments d\'organisation',
  'Maison > Fournitures de bureau > Agrafeuses et perforatrices':                                 'Fournitures de bureau & Éléments d\'organisation',
  'Maison > Fournitures de bureau > Matériel de présentation':                                    'Fournitures de bureau & Éléments d\'organisation',
  'Maison > Fournitures de bureau > Matériel électronique de bureau':                             'Fournitures de bureau & Éléments d\'organisation',
  'Maison > Fournitures de bureau > Coffres-forts':                                               'Fournitures de bureau & Éléments d\'organisation',
  'Maison > Célébrations et fêtes > Banderoles drapeaux et guirlandes':                           'Célébrations, fêtes, décorations de Noël/saisonnières',
  'Maison > Célébrations et fêtes > Cartes et enveloppes':                                        'Célébrations, fêtes, décorations de Noël/saisonnières',
  'Maison > Célébrations et fêtes > Papier cadeau et sacs':                                       'Célébrations, fêtes, décorations de Noël/saisonnières',
  'Maison > Célébrations et fêtes > Décorations saisonnières':                                    'Célébrations, fêtes, décorations de Noël/saisonnières',
  'Maison > Célébrations et fêtes > Accessoires de fête':                                         'Célébrations, fêtes, décorations de Noël/saisonnières',
  'Maison > Célébrations et fêtes > Décorations de table':                                        'Célébrations, fêtes, décorations de Noël/saisonnières',
  'Maison > Célébrations et fêtes > Décorations pour le sapin':                                   'Célébrations, fêtes, décorations de Noël/saisonnières',
  'Maison > Célébrations et fêtes > Couronnes':                                                   'Célébrations, fêtes, décorations de Noël/saisonnières',
  'Maison > Outils et bricolage > Outils électriques':                                            'Outils et bricolage (Outils à main, Électricité, Quincaillerie)',
  'Maison > Outils et bricolage > Outils à main':                                                 'Outils et bricolage (Outils à main, Électricité, Quincaillerie)',
  'Maison > Outils et bricolage > Outils de mesure':                                              'Outils et bricolage (Outils à main, Électricité, Quincaillerie)',
  'Maison > Outils et bricolage > Outils et accessoires de peinture':                             'Outils et bricolage (Outils à main, Électricité, Quincaillerie)',
  'Maison > Outils et bricolage > Outils de plomberie':                                           'Outils et bricolage (Outils à main, Électricité, Quincaillerie)',
  'Maison > Outils et bricolage > Outils de maçonnerie':                                          'Outils et bricolage (Outils à main, Électricité, Quincaillerie)',
  'Maison > Outils et bricolage > Accessoires pour outils':                                       'Outils et bricolage (Outils à main, Électricité, Quincaillerie)',
  'Maison > Outils et bricolage > Équipement de protection':                                      'Outils et bricolage (Outils à main, Électricité, Quincaillerie)',
  'Maison > Outils et bricolage > Transport et rangement des outils':                             'Outils et bricolage (Outils à main, Électricité, Quincaillerie)',
  'Maison > Outils et bricolage > Quincaillerie':                                                 'Outils et bricolage (Outils à main, Électricité, Quincaillerie)',
  'Maison > Outils et bricolage > Maisons connectées et sécurité':                                'Outils et bricolage (Outils à main, Électricité, Quincaillerie)',
  'Maison > Extérieur et jardin > Outils manuels de jardin':                                      'Extérieur et jardin (Outils, Pots, Cuisine extérieure, Arrosage)',
  'Maison > Extérieur et jardin > Pots jardinières et accessoires':                               'Extérieur et jardin (Outils, Pots, Cuisine extérieure, Arrosage)',
  'Maison > Extérieur et jardin > Cuisine et grillade d\'extérieur':                              'Extérieur et jardin (Outils, Pots, Cuisine extérieure, Arrosage)',
  'Maison > Extérieur et jardin > Spas piscines et équipements':                                  'Extérieur et jardin (Outils, Pots, Cuisine extérieure, Arrosage)',
  'Maison > Extérieur et jardin > Instruments météorologiques':                                   'Extérieur et jardin (Outils, Pots, Cuisine extérieure, Arrosage)',
  'Maison > Extérieur et jardin > Outils de déneigement':                                         'Extérieur et jardin (Outils, Pots, Cuisine extérieure, Arrosage)',
  'Maison > Animaux > Chiens':                                                                    'Articles pour animaux (Chiens, Chats, Oiseaux, Poissons)',
  'Maison > Animaux > Chats':                                                                     'Articles pour animaux (Chiens, Chats, Oiseaux, Poissons)',
  'Maison > Animaux > Rongeurs & co':                                                             'Articles pour animaux (Chiens, Chats, Oiseaux, Poissons)',
  'Maison > Animaux > Poissons':                                                                  'Articles pour animaux (Chiens, Chats, Oiseaux, Poissons)',
  'Maison > Animaux > Oiseaux':                                                                   'Articles pour animaux (Chiens, Chats, Oiseaux, Poissons)',
  'Maison > Animaux > Reptiles':                                                                  'Articles pour animaux (Chiens, Chats, Oiseaux, Poissons)',

  /* ════════════════════════════════════════════════════════════════════════ */
  /* Section 7c — Électronique                                              */
  /* ════════════════════════════════════════════════════════════════════════ */

  'Électronique > Jeux vidéo et consoles > Consoles':                                            'Jeux vidéo, Consoles, Manettes & Casques VR',
  'Électronique > Jeux vidéo et consoles > Jeux':                                                'Jeux vidéo, Consoles, Manettes & Casques VR',
  'Électronique > Jeux vidéo et consoles > Manettes':                                            'Jeux vidéo, Consoles, Manettes & Casques VR',
  'Électronique > Jeux vidéo et consoles > Casques gaming':                                      'Jeux vidéo, Consoles, Manettes & Casques VR',
  'Électronique > Jeux vidéo et consoles > Simulateurs':                                         'Jeux vidéo, Consoles, Manettes & Casques VR',
  'Électronique > Jeux vidéo et consoles > Réalité virtuelle':                                   'Jeux vidéo, Consoles, Manettes & Casques VR',
  'Électronique > Jeux vidéo et consoles > Accessoires':                                         'Jeux vidéo, Consoles, Manettes & Casques VR',
  'Électronique > Ordinateurs et accessoires > Ordinateurs portables':                            'Ordinateurs, Accessoires info, Moniteurs, Souris',
  'Électronique > Ordinateurs et accessoires > Ordinateurs de bureau':                            'Ordinateurs, Accessoires info, Moniteurs, Souris',
  'Électronique > Ordinateurs et accessoires > Pièces détachées et composants informatiques':     'Ordinateurs, Accessoires info, Moniteurs, Souris',
  'Électronique > Ordinateurs et accessoires > Supports vierges':                                 'Câbles, Connectique, Chargeurs, Batteries externes',
  'Électronique > Ordinateurs et accessoires > Accessoires informatiques':                        'Ordinateurs, Accessoires info, Moniteurs, Souris',
  'Électronique > Ordinateurs et accessoires > Accessoires pour ordinateurs portables':           'Ordinateurs, Accessoires info, Moniteurs, Souris',
  'Électronique > Ordinateurs et accessoires > Stations d\'accueil et concentrateurs USB':        'Câbles, Connectique, Chargeurs, Batteries externes',
  'Électronique > Ordinateurs et accessoires > Claviers et accessoires':                          'Ordinateurs, Accessoires info, Moniteurs, Souris',
  'Électronique > Ordinateurs et accessoires > Souris':                                           'Ordinateurs, Accessoires info, Moniteurs, Souris',
  'Électronique > Ordinateurs et accessoires > Tapis de souris':                                  'Ordinateurs, Accessoires info, Moniteurs, Souris',
  'Électronique > Ordinateurs et accessoires > Moniteurs et accessoires':                         'Ordinateurs, Accessoires info, Moniteurs, Souris',
  'Électronique > Ordinateurs et accessoires > Haut-parleurs pour ordinateurs':                   'Audio casques, Écouteurs, Enceintes connectées / Hi-Fi',
  'Électronique > Ordinateurs et accessoires > Webcams':                                          'Ordinateurs, Accessoires info, Moniteurs, Souris',
  'Électronique > Ordinateurs et accessoires > Équipements réseau':                               'Ordinateurs, Accessoires info, Moniteurs, Souris',
  'Électronique > Ordinateurs et accessoires > Imprimantes et accessoires':                       'Ordinateurs, Accessoires info, Moniteurs, Souris',
  'Électronique > Ordinateurs et accessoires > Scanners et accessoires':                          'Ordinateurs, Accessoires info, Moniteurs, Souris',
  'Électronique > Ordinateurs et accessoires > Tablettes tactiles et tablettes à stylets':        'Ordinateurs, Accessoires info, Moniteurs, Souris',
  'Électronique > Téléphones portables et équipements de communication > Téléphones portables':   'Téléphones portables, Équipement & Fixes',
  'Électronique > Téléphones portables et équipements de communication > Pièces de rechange et accessoires pour téléphones portables': 'Téléphones portables, Équipement & Fixes',
  'Électronique > Téléphones portables et équipements de communication > Téléphones fixes':       'Téléphones portables, Équipement & Fixes',
  'Électronique > Téléphones portables et équipements de communication > Fax':                    'Téléphones portables, Équipement & Fixes',
  'Électronique > Téléphones portables et équipements de communication > Communication radio':    'Téléphones portables, Équipement & Fixes',
  'Électronique > Téléphones portables et équipements de communication > Téléphones portables factices': 'Téléphones portables, Équipement & Fixes',
  'Électronique > Audio casques et hi-fi > Casques audio et écouteurs':                          'Audio casques, Écouteurs, Enceintes connectées / Hi-Fi',
  'Électronique > Audio casques et hi-fi > Lecteurs de musique portables':                        'Audio casques, Écouteurs, Enceintes connectées / Hi-Fi',
  'Électronique > Audio casques et hi-fi > Radios portables':                                    'Audio casques, Écouteurs, Enceintes connectées / Hi-Fi',
  'Électronique > Audio casques et hi-fi > Enceintes portables':                                 'Audio casques, Écouteurs, Enceintes connectées / Hi-Fi',
  'Électronique > Audio casques et hi-fi > Enceintes connectées':                                'Audio casques, Écouteurs, Enceintes connectées / Hi-Fi',
  'Électronique > Audio casques et hi-fi > Systèmes audio domestiques':                          'Audio casques, Écouteurs, Enceintes connectées / Hi-Fi',
  'Électronique > Audio casques et hi-fi > Accessoires pour appareils audio':                    'Audio casques, Écouteurs, Enceintes connectées / Hi-Fi',
  'Électronique > Audio casques et hi-fi > Pièces de rechange pour appareils hi-fi et audio domestiques': 'Audio casques, Écouteurs, Enceintes connectées / Hi-Fi',
  'Électronique > Appareils photo et accessoires > Appareils photo':                              'Appareils photo, Objectifs, Drones & Studio',
  'Électronique > Appareils photo et accessoires > Objectifs':                                   'Appareils photo, Objectifs, Drones & Studio',
  'Électronique > Appareils photo et accessoires > Flashs':                                      'Appareils photo, Objectifs, Drones & Studio',
  'Électronique > Appareils photo et accessoires > Cartes mémoire':                              'Câbles, Connectique, Chargeurs, Batteries externes',
  'Électronique > Appareils photo et accessoires > Trépieds et monopodes':                       'Appareils photo, Objectifs, Drones & Studio',
  'Électronique > Appareils photo et accessoires > Stabilisateurs et supports':                  'Appareils photo, Objectifs, Drones & Studio',
  'Électronique > Appareils photo et accessoires > Équipements pour chambres noires':            'Appareils photo, Objectifs, Drones & Studio',
  'Électronique > Appareils photo et accessoires > Équipement pour studio':                      'Appareils photo, Objectifs, Drones & Studio',
  'Électronique > Appareils photo et accessoires > Drones et accessoires':                       'Appareils photo, Objectifs, Drones & Studio',
  'Électronique > Appareils photo et accessoires > Accessoires':                                 'Appareils photo, Objectifs, Drones & Studio',
  'Électronique > Appareils photo et accessoires > Pièces de rechange pour appareils photo':     'Appareils photo, Objectifs, Drones & Studio',
  'Électronique > Appareils photo et accessoires > Autre matériel de photographie':              'Appareils photo, Objectifs, Drones & Studio',
  'Électronique > Tablettes liseuses et accessoires > Tablettes':                                'Ordinateurs, Accessoires info, Moniteurs, Souris',
  'Électronique > Tablettes liseuses et accessoires > Liseuses':                                 'Ordinateurs, Accessoires info, Moniteurs, Souris',
  'Électronique > Tablettes liseuses et accessoires > Blocs-notes numériques':                   'Ordinateurs, Accessoires info, Moniteurs, Souris',
  'Électronique > Tablettes liseuses et accessoires > Assistants personnels':                    'Ordinateurs, Accessoires info, Moniteurs, Souris',
  'Électronique > Tablettes liseuses et accessoires > Accessoires':                              'Câbles, Connectique, Chargeurs, Batteries externes',
  'Électronique > TV et home cinema > Téléviseurs':                                              'TV, Projecteurs & Home Cinéma',
  'Électronique > TV et home cinema > Projecteurs':                                              'TV, Projecteurs & Home Cinéma',
  'Électronique > TV et home cinema > Passerelles multimédias':                                  'TV, Projecteurs & Home Cinéma',
  'Électronique > TV et home cinema > Antennes de télévision':                                   'TV, Projecteurs & Home Cinéma',
  'Électronique > TV et home cinema > Antennes paraboliques':                                    'TV, Projecteurs & Home Cinéma',
  'Électronique > TV et home cinema > Décodeurs vidéo':                                          'TV, Projecteurs & Home Cinéma',
  'Électronique > TV et home cinema > Récepteurs de télévision':                                 'TV, Projecteurs & Home Cinéma',
  'Électronique > TV et home cinema > Systèmes de home cinema':                                  'TV, Projecteurs & Home Cinéma',
  'Électronique > TV et home cinema > Lecteurs Blu-ray':                                         'TV, Projecteurs & Home Cinéma',
  'Électronique > TV et home cinema > Lecteurs DVD':                                             'TV, Projecteurs & Home Cinéma',
  'Électronique > TV et home cinema > Magnétoscopes':                                            'TV, Projecteurs & Home Cinéma',
  'Électronique > TV et home cinema > Autres appareils de lecture vidéo':                        'TV, Projecteurs & Home Cinéma',
  'Électronique > TV et home cinema > Accessoires TV et home cinema':                            'TV, Projecteurs & Home Cinéma',
  'Électronique > Produits de beauté et de soins personnels > Appareils de coiffure':            'Appareils beauté / Soin électrique (Coiffure, Rasage)',
  'Électronique > Produits de beauté et de soins personnels > Appareils de beauté':              'Appareils beauté / Soin électrique (Coiffure, Rasage)',
  'Électronique > Produits de beauté et de soins personnels > Rasage et épilation':              'Appareils beauté / Soin électrique (Coiffure, Rasage)',
  'Électronique > Produits de beauté et de soins personnels > Appareils de massage':             'Appareils beauté / Soin électrique (Coiffure, Rasage)',
  'Électronique > Produits de beauté et de soins personnels > Appareils de soin des ongles':     'Appareils beauté / Soin électrique (Coiffure, Rasage)',
  'Électronique > Produits de beauté et de soins personnels > Pèse-personnes':                   'Appareils beauté / Soin électrique (Coiffure, Rasage)',
  'Électronique > Objets connectés > Montres connectées':                                        'Objets connectés (Montres connectées, Bracelets, Bagues)',
  'Électronique > Objets connectés > Bracelets connectés':                                       'Objets connectés (Montres connectées, Bracelets, Bagues)',
  'Électronique > Objets connectés > Lunettes connectées':                                       'Objets connectés (Montres connectées, Bracelets, Bagues)',
  'Électronique > Objets connectés > Bagues connectées':                                         'Objets connectés (Montres connectées, Bracelets, Bagues)',
  'Électronique > Objets connectés > Bracelets de remplacement':                                 'Objets connectés (Montres connectées, Bracelets, Bagues)',
  'Électronique > Objets connectés > Coques pour montres connectées':                            'Objets connectés (Montres connectées, Bracelets, Bagues)',
  'Électronique > Autres appareils et accessoires > Impression et numérisation 3D':              'Ordinateurs, Accessoires info, Moniteurs, Souris',
  'Électronique > Autres appareils et accessoires > GPS et appareils de navigation par satellite': 'Objets connectés (Montres connectées, Bracelets, Bagues)',
  'Électronique > Autres appareils et accessoires > Pèse-bagages':                               'Câbles, Connectique, Chargeurs, Batteries externes',
  'Électronique > Autres appareils et accessoires > Adaptateurs':                                'Câbles, Connectique, Chargeurs, Batteries externes',
  'Électronique > Autres appareils et accessoires > Câbles':                                     'Câbles, Connectique, Chargeurs, Batteries externes',
  'Électronique > Autres appareils et accessoires > Chargeurs':                                  'Câbles, Connectique, Chargeurs, Batteries externes',
  'Électronique > Autres appareils et accessoires > Batteries externes':                          'Câbles, Connectique, Chargeurs, Batteries externes',
  'Électronique > Autres appareils et accessoires > Multiprises parasurtenseurs':                'Câbles, Connectique, Chargeurs, Batteries externes',
  'Électronique > Autres appareils et accessoires > Piles et alimentations':                     'Câbles, Connectique, Chargeurs, Batteries externes',
  'Électronique > Autres appareils et accessoires > Autres accessoires':                         'Câbles, Connectique, Chargeurs, Batteries externes',

  /* ════════════════════════════════════════════════════════════════════════ */
  /* Section 7d — Divertissement                                            */
  /* ════════════════════════════════════════════════════════════════════════ */

  'Divertissement > Livres > Fiction':                                                            'Livres (Fiction, Beaux-livres, BD, Manuels)',
  'Divertissement > Livres > Non-fiction':                                                        'Livres (Fiction, Beaux-livres, BD, Manuels)',
  'Divertissement > Livres > Enfants et jeunes adultes':                                          'Livres (Fiction, Beaux-livres, BD, Manuels)',
  'Divertissement > Livres > Bandes dessinées mangas et romans graphiques':                       'Livres (Fiction, Beaux-livres, BD, Manuels)',
  'Divertissement > Livres > Manuels scolaires et ressources pédagogiques':                       'Livres (Fiction, Beaux-livres, BD, Manuels)',
  'Divertissement > Musique > Cassettes audio':                                                   'Musique & Vidéo (CD, Vinyles collector, DVD, Blu-ray)',
  'Divertissement > Musique > CD':                                                                'Musique & Vidéo (CD, Vinyles collector, DVD, Blu-ray)',
  'Divertissement > Musique > MiniDiscs':                                                         'Musique & Vidéo (CD, Vinyles collector, DVD, Blu-ray)',
  'Divertissement > Musique > Vinyles':                                                           'Musique & Vidéo (CD, Vinyles collector, DVD, Blu-ray)',
  'Divertissement > Vidéo > Blu-ray 4K':                                                         'Musique & Vidéo (CD, Vinyles collector, DVD, Blu-ray)',
  'Divertissement > Vidéo > Betamax':                                                             'Musique & Vidéo (CD, Vinyles collector, DVD, Blu-ray)',
  'Divertissement > Vidéo > Blu-ray':                                                             'Musique & Vidéo (CD, Vinyles collector, DVD, Blu-ray)',
  'Divertissement > Vidéo > DVD':                                                                 'Musique & Vidéo (CD, Vinyles collector, DVD, Blu-ray)',
  'Divertissement > Vidéo > HD DVD':                                                              'Musique & Vidéo (CD, Vinyles collector, DVD, Blu-ray)',
  'Divertissement > Vidéo > LaserDisc':                                                           'Musique & Vidéo (CD, Vinyles collector, DVD, Blu-ray)',
  'Divertissement > Vidéo > VHS':                                                                 'Musique & Vidéo (CD, Vinyles collector, DVD, Blu-ray)',

  /* ════════════════════════════════════════════════════════════════════════ */
  /* Section 7e — Loisirs et collections                                    */
  /* ════════════════════════════════════════════════════════════════════════ */

  'Loisirs et collections > Cartes à collectionner > Cartes à collectionner à l\'unité':          'Cartes à collectionner & Souvenirs de sport / cinéma',
  'Loisirs et collections > Cartes à collectionner > Boosters':                                   'Cartes à collectionner & Souvenirs de sport / cinéma',
  'Loisirs et collections > Cartes à collectionner > Coffrets de boosters':                       'Cartes à collectionner & Souvenirs de sport / cinéma',
  'Loisirs et collections > Cartes à collectionner > Jeux de cartes':                             'Cartes à collectionner & Souvenirs de sport / cinéma',
  'Loisirs et collections > Cartes à collectionner > Lots de cartes à collectionner':             'Cartes à collectionner & Souvenirs de sport / cinéma',
  'Loisirs et collections > Cartes à collectionner > Cartes non découpées':                       'Cartes à collectionner & Souvenirs de sport / cinéma',
  'Loisirs et collections > Souvenirs > Souvenirs de sport':                                      'Cartes à collectionner & Souvenirs de sport / cinéma',
  'Loisirs et collections > Souvenirs > Souvenirs de musique':                                    'Cartes à collectionner & Souvenirs de sport / cinéma',
  'Loisirs et collections > Souvenirs > Souvenirs TV et cinéma':                                  'Cartes à collectionner & Souvenirs de sport / cinéma',
  'Loisirs et collections > Souvenirs > Autres souvenirs':                                        'Cartes à collectionner & Souvenirs de sport / cinéma',
  'Loisirs et collections > Pièces de monnaie et billets > Billets':                              'Pièces, Billets, Timbres de collection',
  'Loisirs et collections > Pièces de monnaie et billets > Pièces de monnaie':                   'Pièces, Billets, Timbres de collection',
  'Loisirs et collections > Pièces de monnaie et billets > Lots':                                 'Pièces, Billets, Timbres de collection',
  'Loisirs et collections > Pièces de monnaie et billets > Médailles et jetons':                  'Pièces, Billets, Timbres de collection',
  'Loisirs et collections > Pièces de monnaie et billets > Titres et actions':                    'Pièces, Billets, Timbres de collection',
  'Loisirs et collections > Timbres > Timbres à l\'unité':                                        'Pièces, Billets, Timbres de collection',
  'Loisirs et collections > Timbres > Lots de timbres':                                           'Pièces, Billets, Timbres de collection',
  'Loisirs et collections > Timbres > Enveloppes premier jour':                                   'Pièces, Billets, Timbres de collection',
  'Loisirs et collections > Timbres > Catalogues et guides de timbres':                           'Livres (Fiction, Beaux-livres, BD, Manuels)',
  'Loisirs et collections > Timbres > Outils et matériel pour timbres':                           'Pièces, Billets, Timbres de collection',
  'Loisirs et collections > Instruments de musique et équipement > Guitares et basses':           'Instruments de musique & Équipement studio/DJ',
  'Loisirs et collections > Instruments de musique et équipement > Amplis et pédales':            'Instruments de musique & Équipement studio/DJ',
  'Loisirs et collections > Instruments de musique et équipement > Batterie et percussions':      'Instruments de musique & Équipement studio/DJ',
  'Loisirs et collections > Instruments de musique et équipement > Claviers et synthétiseurs':    'Instruments de musique & Équipement studio/DJ',
  'Loisirs et collections > Instruments de musique et équipement > Instruments à cordes':         'Instruments de musique & Équipement studio/DJ',
  'Loisirs et collections > Instruments de musique et équipement > Instruments à vent':           'Instruments de musique & Équipement studio/DJ',
  'Loisirs et collections > Instruments de musique et équipement > Matériel de studio et sonorisation live': 'Instruments de musique & Équipement studio/DJ',
  'Loisirs et collections > Instruments de musique et équipement > Équipement DJ':                'Instruments de musique & Équipement studio/DJ',
  'Loisirs et collections > Instruments de musique et équipement > Équipement de karaoké':        'Instruments de musique & Équipement studio/DJ',
  'Loisirs et collections > Instruments de musique et équipement > Accessoires pour la création musicale': 'Instruments de musique & Équipement studio/DJ',
  'Loisirs et collections > Loisirs créatifs > Couture tricot et travaux d\'aiguille':            'Loisirs créatifs, Couture, Peinture, Fabrication bijoux',
  'Loisirs et collections > Loisirs créatifs > Peinture':                                         'Loisirs créatifs, Couture, Peinture, Fabrication bijoux',
  'Loisirs et collections > Loisirs créatifs > Dessin et esquisse':                               'Loisirs créatifs, Couture, Peinture, Fabrication bijoux',
  'Loisirs et collections > Loisirs créatifs > Calligraphie':                                     'Loisirs créatifs, Couture, Peinture, Fabrication bijoux',
  'Loisirs et collections > Loisirs créatifs > Fabrication de bijoux':                            'Loisirs créatifs, Couture, Peinture, Fabrication bijoux',
  'Loisirs et collections > Loisirs créatifs > Papercraft':                                       'Loisirs créatifs, Couture, Peinture, Fabrication bijoux',
  'Loisirs et collections > Loisirs créatifs > Découpe':                                          'Loisirs créatifs, Couture, Peinture, Fabrication bijoux',
  'Loisirs et collections > Loisirs créatifs > Fabrication de bougies':                           'Loisirs créatifs, Couture, Peinture, Fabrication bijoux',
  'Loisirs et collections > Loisirs créatifs > Sculpture et poterie':                             'Loisirs créatifs, Couture, Peinture, Fabrication bijoux',
  'Loisirs et collections > Loisirs créatifs > Fournitures pour loisirs créatifs':                'Loisirs créatifs, Couture, Peinture, Fabrication bijoux',
  'Loisirs et collections > Loisirs créatifs > Outils pour loisirs créatifs':                     'Loisirs créatifs, Couture, Peinture, Fabrication bijoux',
  'Loisirs et collections > Accessoires de jeux > Dés':                                           'Cartes à collectionner & Souvenirs de sport / cinéma',
  'Loisirs et collections > Accessoires de jeux > Jetons et marqueurs de jeu':                    'Cartes à collectionner & Souvenirs de sport / cinéma',
  'Loisirs et collections > Accessoires de jeux > Tapis de jeux':                                 'Cartes à collectionner & Souvenirs de sport / cinéma',
  'Loisirs et collections > Accessoires de jeux > Autres accessoires de jeux':                    'Cartes à collectionner & Souvenirs de sport / cinéma',

  /* ════════════════════════════════════════════════════════════════════════ */
  /* Section 7f — Sport                                                     */
  /* ════════════════════════════════════════════════════════════════════════ */

  'Sport > Cyclisme > Vélos pour enfant':                                                         'Cyclisme (Vélos, Casques, Pièces détachées)',
  'Sport > Cyclisme > Casques de vélo':                                                           'Cyclisme (Vélos, Casques, Pièces détachées)',
  'Sport > Cyclisme > Accessoires et outils pour vélo':                                           'Cyclisme (Vélos, Casques, Pièces détachées)',
  'Sport > Cyclisme > Remorques pour vélo':                                                       'Cyclisme (Vélos, Casques, Pièces détachées)',
  'Sport > Cyclisme > Sièges enfants pour vélo':                                                  'Cyclisme (Vélos, Casques, Pièces détachées)',
  'Sport > Cyclisme > Pièces pour vélo':                                                          'Cyclisme (Vélos, Casques, Pièces détachées)',
  'Sport > Fitness course à pied et yoga > Musculation':                                          'Fitness, Course à pied & Yoga (Musculation, Tapis)',
  'Sport > Fitness course à pied et yoga > Course à pied':                                        'Fitness, Course à pied & Yoga (Musculation, Tapis)',
  'Sport > Fitness course à pied et yoga > Matériel de yoga et de pilates':                       'Fitness, Course à pied & Yoga (Musculation, Tapis)',
  'Sport > Fitness course à pied et yoga > Accessoires de fitness à domicile':                    'Fitness, Course à pied & Yoga (Musculation, Tapis)',
  'Sport > Fitness course à pied et yoga > Gourdes':                                              'Fitness, Course à pied & Yoga (Musculation, Tapis)',
  'Sport > Sports nautiques > Natation':                                                          'Maillots de bain',
  'Sport > Sports de raquette > Lunettes pour sports de raquette':                               'Lunettes de soleil',
  'Sport > Golf > Accessoires de golf':                                                           'Golf (Clubs, Sacs, Balles, Chariots)',
  'Sport > Golf > Sacs de golf':                                                                  'Golf (Clubs, Sacs, Balles, Chariots)',
  'Sport > Golf > Balles de golf':                                                                'Golf (Clubs, Sacs, Balles, Chariots)',
  'Sport > Golf > Clubs de golf':                                                                 'Golf (Clubs, Sacs, Balles, Chariots)',
  'Sport > Golf > Gants de golf':                                                                 'Golf (Clubs, Sacs, Balles, Chariots)',
  'Sport > Golf > Chariots de golf':                                                              'Golf (Clubs, Sacs, Balles, Chariots)',
  'Sport > Équitation > Selles et harnachement':                                                  'Équitation (Protections, Selles, Harnachement)',
  'Sport > Skateboards et trottinettes > Longboards':                                             'Skateboards, trottinettes & protections',
  'Sport > Skateboards et trottinettes > Skateboards':                                            'Skateboards, trottinettes & protections',
  'Sport > Skateboards et trottinettes > Trottinettes':                                           'Skateboards, trottinettes & protections',
  'Sport > Skateboards et trottinettes > Casques de skate':                                       'Skateboards, trottinettes & protections',
  'Sport > Skateboards et trottinettes > Protections de skate':                                   'Skateboards, trottinettes & protections',
  'Sport > Skateboards et trottinettes > Pièces et accessoires pour skating':                     'Skateboards, trottinettes & protections',
  'Sport > Skateboards et trottinettes > Pièces et accessoires pour skateboard':                  'Skateboards, trottinettes & protections',
  'Sport > Boxe et arts martiaux > Protections pour la tête':                                     'Boxe et arts martiaux (Gants, Sacs de frappe)',
  'Sport > Boxe et arts martiaux > Protections pour le corps':                                    'Boxe et arts martiaux (Gants, Sacs de frappe)',
  'Sport > Boxe et arts martiaux > Pattes d\'ours pao et boucliers':                              'Boxe et arts martiaux (Gants, Sacs de frappe)',
  'Sport > Boxe et arts martiaux > Gants de boxe et d\'arts martiaux':                            'Boxe et arts martiaux (Gants, Sacs de frappe)',
  'Sport > Boxe et arts martiaux > Bandes de boxe':                                               'Boxe et arts martiaux (Gants, Sacs de frappe)',
  'Sport > Boxe et arts martiaux > Sacs de frappe':                                               'Boxe et arts martiaux (Gants, Sacs de frappe)',
  'Sport > Boxe et arts martiaux > Poires de vitesse':                                            'Boxe et arts martiaux (Gants, Sacs de frappe)',

}

export function getRefCat(vintedPath: string): string | null {
  return CATEGORY_MAP[vintedPath] ?? null
}

/* ─── Types computePrice ─────────────────────────────────────────────────── */

export interface ComputePriceInput {
  marche: {
    prixMedianVinted: number | null
    nbAnnonces:       number | null
  }
  etat:              string
  segment:           BrandSegment
  refCat:            string   /* chemin Vinted complet — mappé en interne via CATEGORY_MAP */
  matieres?:         string[]
  prixAchatNeuf?:    number
  /* true = marque inconnue (ni table ni Claude fiable) → pas de prix neuf de référence fabriqué */
  brandIsUnknown?:   boolean
}

export interface ComputePriceOutput {
  prixSuggere: number
  confidence:  'high' | 'medium' | 'low'
  prixDecote:  number | null
  prixNeuf:    number | null
  /* true = aucune donnée suffisante — afficher champ libre au user */
  noData?:     boolean
}

/* ─── Données référentiel typées ─────────────────────────────────────────── */

type DecoteGrid = Record<string, Record<string, number>>
type PrixRefMap = Record<string, Partial<Record<BrandSegment, number | null>>>
type MatMulMap  = Record<string, number>

const PRIX_REF = REF.prix_reference   as unknown as PrixRefMap
const DEC_VET  = REF.decote_etat_vetement   as unknown as DecoteGrid
const DEC_ACC  = REF.decote_etat_accessoire as unknown as DecoteGrid
const MAT_MUL  = REF.multiplicateur_matiere as unknown as MatMulMap

/* ─── computePrice — calcul déterministe complet ────────────────────────── */

export function computePrice(input: ComputePriceInput): ComputePriceOutput {
  const { marche, etat, segment, refCat, matieres, prixAchatNeuf, brandIsUnknown } = input
  const median   = marche.prixMedianVinted
  const n        = marche.nbAnnonces ?? 0
  const etatNorm = mapVintedEtatToRef(etat)

  /* 1 — Résolution catégorie */
  const mappedKey: string | null = CATEGORY_MAP[refCat] ?? null

  /* Fallback ultra_luxe → luxe_iconique pour les vêtements (non-accessoire) */
  const isAccessoire = mappedKey ? isAccessoireLuxeCategory(mappedKey) : false
  const effectiveSeg: BrandSegment =
    segment === 'ultra_luxe' && !isAccessoire ? 'luxe_iconique' : segment

  /* 2 — Prix de référence depuis le JSON */
  const prixRef: number | null = mappedKey
    ? ((PRIX_REF[mappedKey]?.[effectiveSeg] ?? null) as number | null)
    : null

  /* 3 — Prix neuf effectif : user > référentiel ; ignoré si marque inconnue sans prix user */
  const prixNeuf: number | null = prixAchatNeuf ?? (brandIsUnknown ? null : prixRef)

  /* 4 — Neuf-décoté */
  let prixDecote: number | null = null

  if (prixNeuf !== null) {
    /* Grille de décote : accessoire luxe iconique/ultra → grille douce */
    const useAccGrid =
      isAccessoire &&
      (effectiveSeg === 'luxe_iconique' || segment === 'ultra_luxe')
    const grid      = useAccGrid ? DEC_ACC : DEC_VET
    const decoteRatio =
      grid[effectiveSeg]?.[etatNorm] ??
      grid['standard']?.[etatNorm] ??
      0.3

    /* Multiplicateur matière — MAX parmi les matières, ignoré si prix user */
    let mulMatiere = 1
    if (!prixAchatNeuf && matieres && matieres.length > 0) {
      mulMatiere = Math.max(1, ...matieres.map(m => MAT_MUL[m] ?? 1))
    }

    prixDecote = prixNeuf * decoteRatio * mulMatiere
  }

  /* 5 — Cas sans prix de référence ET sans prix user */
  if (prixNeuf === null) {
    if (median !== null && n > 0) {
      /* 100% médiane Vinted, confiance basse */
      return {
        prixSuggere: roundToTier(median),
        confidence:  'low',
        prixDecote:  null,
        prixNeuf:    null,
      }
    }
    /* Aucune donnée — champ libre */
    return {
      prixSuggere: 0,
      confidence:  'low',
      prixDecote:  null,
      prixNeuf:    null,
      noData:      true,
    }
  }

  /* 6 — Pondération neuf-décoté / médiane */
  let prixSuggere: number

  if (median !== null && n > 0) {
    const poidsMarch = Math.min(0.97, 0.75 + (n - 1) * 0.04)
    prixSuggere = poidsMarch * median + (1 - poidsMarch) * prixDecote!
  } else {
    /* Zéro annonce → 100% neuf-décoté */
    prixSuggere = prixDecote!
  }

  /* 7 — Bornes de sécurité */
  if (prixDecote !== null) {
    prixSuggere = Math.min(prixSuggere, prixDecote)   /* jamais au-dessus du neuf-décoté */
  }
  if (median !== null && n > 0) {
    prixSuggere = Math.max(prixSuggere, 0.40 * median) /* plancher 40% de la médiane */
  }

  prixSuggere = roundToTier(prixSuggere)
  prixDecote  = prixDecote !== null ? roundToTier(prixDecote) : null

  /* 8 — Niveau de confiance */
  let confidence: 'high' | 'medium' | 'low'
  if (prixNeuf !== null && n >= 10) {
    confidence = 'high'
  } else if (prixNeuf !== null || n >= 3) {
    confidence = 'medium'
  } else {
    confidence = 'low'
  }

  return { prixSuggere, confidence, prixDecote, prixNeuf }
}
