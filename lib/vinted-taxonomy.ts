/* ─── Taxonomie Vinted — données exactes de l'interface ─────────────────── */

export type Genre = 'Femme' | 'Homme' | 'Enfant' | 'Mixte' | 'Maison' | 'Électronique' | 'Beauté' | 'Sport'

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
