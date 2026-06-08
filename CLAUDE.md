# SellerLab AI — Instructions permanentes équipe IA

## Contexte du projet
SaaS pour vendeurs Vinted (et autres plateformes à terme).
- Fondateur : Antonin Amata, basé en Espagne. Non-technique — toujours expliquer en français simple.
- Objectif : aider les vendeurs à optimiser photos, prix et annonces grâce à l'IA
- Modèle : Freemium + abonnement mensuel
- Repo GitHub : github.com/AntoninAmata/sellerlab
- Hébergement : Vercel (mise en ligne après Phase 1)
- Concurrent principal : Clemz (clemz.app) — extension Chrome, 9 000+ utilisateurs, Montpellier
- Différenciation : IA photo (on les devance) + génération annonce + site web multilingue + pas de risque blocage Vinted

---

## Ce qui est déjà construit
- Landing page complète redesignée : hero, fonctionnalités, tarifs, FAQ, CTA
- Blog avec 3 articles SEO
- Pages : CGU, Confidentialité, Contact, À propos
- Bannière cookies RGPD (carte flottante coin bas-droite)
- Multilingue FR / ES / EN / DE / IT / NL / PL — 7 langues complètes ✅
- Sitemap XML + navigation complète
- Header scroll-aware + hamburger mobile
- Footer multi-colonnes avec badge "Phase bêta"
- Flux /app — 5 étapes complètes ✅
- Build propre — 0 erreur TypeScript ✅
- Taxonomie Vinted traduite dans les 7 langues ✅
- i18n complet sur tout le flux /app ✅
- Mannequin IA FASHN intégré (plan Pro) ✅
- Bookmarklet Vinted (en cours) 🔄
- Import URL Vinted (en cours) 🔄

---

## Design

### Polices — SPÉCIFICATIONS EXACTES ✅
- Une seule famille : Plus Jakarta Sans (Google Fonts)
- Weights : 400 (corps), 600 (semi-bold), 800 (extrabold)
- layout.tsx racine : const plusJakarta = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['400','600','800'], variable: '--font-display' })
- Sur html : className={plusJakarta.variable}
- tailwind.config : fontFamily: { display: ['var(--font-display)'] }
- globals.css : body { font-family: var(--font-display) }
- Logo et h1/h2/h3 : className="font-display font-extrabold"
- Sous-titres : className="font-display font-semibold"
- S'applique à TOUTES les pages via layout racine — landing ET /app

### Autres specs design
- Couleur principale : indigo #6366F1
- Alternance blanc / noir profond #080810 (sections Problème + CTA)
- Typographie massive hero : clamp(2.8rem, 5vw, 5.5rem)
- Fond Hero : grille de points .dot-grid
- Mesh de profondeur .mesh-dark sur sections sombres
- Numéros décoratifs 01/02/03 sur les cards fonctionnalités
- Animations : fade-up séquentiel Hero, hover -translate-y-1 cards, shimmer boutons, accordéon FAQ
- Header landing : transparent au sommet, blanc/blur au scroll
- Menu hamburger mobile avec sélecteur langue en pills
- Icônes Lucide React
- Social proof 4.8/5
- Textes en noir foncé #111827
- Bouton CTA : fond indigo #6366F1 + texte blanc
- Sections 'Comment ça marche' et CTA email : fond gris clair #F9FAFB

---

## Stack technique
- Frontend : Next.js 16, TypeScript, Tailwind CSS
- UI : shadcn/ui, lucide-react, motion/react
- Backend : Supabase (DB + Auth + Storage pour photos utilisateurs)
- Paiements : Stripe
- Emails : Resend + react-email
- IA : Claude API — claude-sonnet-4-6 pour vision et génération, claude-haiku-4-5 pour classification photos
- Suppression fond : @imgly/background-removal (WebAssembly côté client, gratuit, privé)
- Mannequin IA : FASHN.ai (Product to Model endpoint)
- Analytics : Umami (RGPD, gratuit)
- Hébergement : Vercel

## Variables d'environnement (.env.local)
- ANTHROPIC_API_KEY ✅ configurée
- FASHN_API_KEY ✅ configurée

## RÈGLE CRITIQUE — next.config.ts
- NE JAMAIS ajouter `asyncWebAssembly: true` dans next.config.ts — casse Safari
- Le fichier next.config.ts doit rester avec une config minimale

---

## Langues et i18n — 7 langues ✅
- FR, EN, ES, DE, IT, NL, PL — toutes en place
- Fichiers i18n créés pour toutes les langues ✅
- Taxonomie Vinted traduite dans les 7 langues ✅
- Fallback : anglais si langue non disponible
- RÈGLE ABSOLUE : tout développement doit être appliqué dans les 7 langues
- RÈGLE ABSOLUE : aucun texte en dur en français dans les composants — tout passe par i18n
- Tous les appels API vers Claude incluent le paramètre `locale` pour répondre dans la bonne langue
- Badges de confiance (Élevée/Moyenne/Incertaine/Modifié) traduits dans les 7 langues

---

## 3 Formules tarifaires
- Freemium 0€ : 1 annonce/mois, background removal blanc uniquement sur slot 0, pas de mannequin IA
- Premium X€ : annonces limitées/mois, background removal 22 fonds sur photos choisies, pas de mannequin IA
- Pro XX€ : annonces limitées/mois, background removal complet, mannequin IA (2 photos), bookmarklet Vinted

---

## Page /app — Flux en 5 étapes

### Étape 0 — Import URL Vinted (optionnel, avant étape 1)
- Champ optionnel : "Vous avez déjà une annonce Vinted ? Importez-la directement"
- Input URL + bouton "Importer"
- API `app/api/import-vinted/route.ts` : fetch côté serveur → parse HTML/JSON Vinted → extrait photos, titre, description, prix, marque, taille, état, catégorie
- Les photos importées passent par la classification IA normale (comme un upload manuel)
- Les données pré-remplissent l'étape 2 (Reconnaissance)
- Fichier : `app/api/import-vinted/route.ts`

### Étape 1 — Photos ✅ Construite

#### Slots (15 au total) — Structure définitive

**Section 1 — PHOTOS NON PORTÉES** — 9 slots
- Slot 0 : Photo recto (cintre / à plat) — OBLIGATOIRE — suppression fond gratuite
- Slot 1 : Photo verso (cintre / à plat) — Recommandé
- Slot 2 : Autre vue non portée — Recommandé
- Slot 3 : Étiquette marque — Recommandé
- Slot 4 : Étiquette taille — Recommandé
- Slot 5 : Étiquette composition — Recommandé
- Slot 6 : Autre détail — Optionnel
- Slot 7 : Défaut — Optionnel
- Slot 8 : Emballage — Optionnel

**Section 2 — PHOTOS PORTÉES (FACE, PROFIL, DOS)** — 6 slots
- Slots 9-14 : Vue portée 1 à 6 — Recommandé (1-4) / Optionnel (5-6)

**Section 3 — 📸 RENDU — PHOTOS TRAITÉES** (en dessous des photos portées)
- Affiche les photos traitées (background removal + mannequin IA)
- Les photos traitées ne vont JAMAIS dans les slots originaux
- State séparé `aiPhotos` pour les photos IA

#### 3 plans tarifaires — comportement photos

**Freemium (0€) :**
- Panneau fond : fond blanc uniquement, autres fonds verrouillés avec cadenas
- Message : "Passez au Premium pour tous les fonds"
- Background removal : slot 0 uniquement, fond blanc
- Panneau mannequin IA : visible mais entièrement verrouillé, scrollable pour teaser

**Premium :**
- Panneau fond : 22 fonds disponibles
- Message : "Cochez les photos dont vous souhaitez supprimer le fond"
- Checkbox sur chaque slot pour choisir quelles photos traiter
- Panneau mannequin IA : visible, scrollable (Homme/Femme), mais génération verrouillée — badge "Pro"

**Pro :**
- Panneau fond : 22 fonds disponibles + checkboxes
- Panneau mannequin IA : entièrement fonctionnel
- Bouton : "Générer 2 photos portées"
- 2 appels FASHN séparés en parallèle avec seeds différents

#### Fonds disponibles — 23 au total
1. Blanc pur — `/public/backgrounds/bg-white.jpg`
2-23. bg-01.jpg à bg-22.jpg dans `/public/backgrounds/`

#### Mannequin IA — FASHN.ai Product to Model
- API : `app/api/generate-mannequin/route.ts`
- Clé : `FASHN_API_KEY` dans `.env.local`
- 10 hommes + 10 femmes dans `/public/mannequins/`
- Retenus : man-01, 02, 05, 06, 07, 09, 13, 16, 18, 20 / woman-01, 02, 04, 06, 07, 10, 13, 16, 18, 20
- Descriptions détaillées : `lib/mannequin-descriptions.ts`
- Bouton sélection : "Choisir ce style" (pas "Utiliser ce mannequin")
- 2 appels séparés avec seeds différents pour des poses différentes
- Paramètres : `image_prompt` (mannequin base64), `background_reference` (fond choisi), `num_images: 1`, `resolution: "1k"`, NO face_reference
- Prompt : "Full body, [DESCRIPTION MANNEQUIN], [PARTIE TENUE], natural Vinted selling photo"
- Tenue par défaut (modifiable par le user) : "outfit adapted to the garment, contemporary 2026 casual style"
- Champ "Personnaliser la tenue" replié par défaut

#### Disposition visuelle
- Slots 0-2 : grille `grid-cols-3`, grandes cases, `object-contain`
- Slots 3-8 : grille `grid-cols-6`, petites cases
- Slots 9-14 : grille `grid-cols-6`, petites cases
- Toutes les photos en `object-contain` sur fond gris clair

#### Classification IA
- UN SEUL appel Claude Haiku pour toutes les photos simultanément
- Redimensionnement automatique à 1024px avant envoi
- Ordre priorité : worn → flat → detail → autre

#### Suppression de fond
- @imgly/background-removal (WebAssembly côté client) — GRATUIT
- Safari : message orange d'avertissement — NE PAS bloquer le flux

---

### Étape 2 — Reconnaissance automatique ✅ Construite

Claude Vision (claude-sonnet-4-6) analyse les photos et pré-remplit le formulaire.
Le prompt reçoit `locale` pour répondre dans la langue de l'interface.

Champs détectés automatiquement :
- Marque, Segment de marque (interne), Genre, Catégorie + sous-catégorie, Taille, État, Couleur (max 2), Matière, Style, Motif, Défauts visibles

#### Informations complémentaires

**Bloc 1 — Informations générales** (PAS de dimensions ici)
- Tags : pays de fabrication, doublure, numéro de référence, type de cuir, instructions d'entretien, Autre
- Prix neuf (optionnel)
- Tag passe vert après validation uniquement

**Bloc 2 — Dimensions**
- Tags : tour de poitrine, longueur, épaules, tour de taille, tour de hanches, entrejambe, pointure, largeur, hauteur, profondeur
- Mesure personnalisée possible

---

### Étape 3 — Génération de l'annonce ✅ Construite

RÈGLE ABSOLUE : jamais d'information inventée. NE JAMAIS mentionner "Vinted Pro".

Structure (ordre exact) :
1. Mots-clés SEO — hashtags CamelCase bilingues
2. Titre (max 60 caractères) — dans la langue de l'interface
3. Choix de langue : Langue native / Anglais / Les deux (défaut)
4. Description éditable avec 2 blocs d'infos additionnelles :
   - 📋 Informations complémentaires (pays, doublure, etc.)
   - 📐 Dimensions
   - NE PAS inclure marque/genre/catégorie/état/couleur/matière en liste brute

---

### Étape 4 — Calcul du prix ✅ Construite

#### Segment de marque (déterminé par l'IA, exemples non exhaustifs)
- `standard` : Zara, H&M, Mango...
- `luxe_accessible` : Kenzo, Sandro, Maje, The Kooples...
- `luxe_premium` : Gucci, Saint Laurent, Prada, Dior, Hermès...
- Fallback → standard

#### Décote par état et segment
| État | Standard | Luxe accessible | Luxe premium |
|------|----------|----------------|-------------|
| Neuf avec étiquette | 55% | 65% | 75% |
| Neuf sans étiquette | 45% | 55% | 65% |
| Très bon état | 35% | 45% | 55% |
| Bon état | 25% | 35% | 45% |
| Satisfaisant | 15% | 20% | 30% |

#### Pondération marché/décote
| Situation | Pondération |
|-----------|------------|
| Prix neuf + ≥5 annonces | 60% marché / 40% décote |
| Prix neuf + 1-4 annonces | 40% marché / 60% décote |
| Prix neuf + 0 annonces | 100% décote |
| Pas de prix neuf + annonces | 90% marché / 10% décote |
| Rien trouvé | Demander au user |

#### Bornes de sécurité
- Prix final entre décote -20% et décote +30%

#### Interface prix
- Prix suggéré = vraie valeur marché (SANS marge négociation)
- Slider avec conseil : "💡 Astuce Vinted : affichez 15-20% au-dessus de votre prix plancher. 70% des acheteurs négocient."
- Prix réel estimé après négociation avec l'acheteur = prix affiché - 15%
- "Nous vous recommandons de ne pas accepter d'offre en dessous de XX€" = moyenne (bas fourchette + prix suggéré -25%)
- "Acheté chez" et "Article rare / édition limitée" impactent le calcul

---

### Étape 5 — Export vers Vinted ✅ Construite

Structure suivant l'ordre EXACT du formulaire Vinted :
1. PHOTOS — miniatures + bouton "Télécharger toutes les photos (ZIP)"
   - ZIP contient : photos traitées (fond modifié) + photos originales non traitées + photos IA
2. TITRE — affichage + bouton Copier
3. DESCRIPTION — affichage + bouton Copier
4. DÉTAILS DE L'ARTICLE (informatif) : Catégorie, Marque, Taille, État, Couleur, Matériau — traduits
5. PRIX DE VENTE SUGGÉRÉ — affichage + bouton Copier
6. Bouton "Remplir Vinted automatiquement" (plan Pro) → Bookmarklet
7. Bouton "Ouvrir Vinted pour publier" → URL adaptée par langue

PAS de bouton "Tout copier"

#### URLs Vinted par langue
- FR → https://www.vinted.fr/items/new
- ES → https://www.vinted.es/items/new
- DE → https://www.vinted.de/items/new
- IT → https://www.vinted.it/items/new
- NL → https://www.vinted.nl/items/new
- PL → https://www.vinted.pl/items/new
- EN → https://www.vinted.co.uk/items/new

#### Bookmarklet Vinted (plan Pro uniquement) — En cours 🔄
- Bouton "Remplir Vinted automatiquement" génère un token UUID
- Stocke les données dans une Map en mémoire serveur Next.js (15 min)
- Ouvre vinted.fr/items/new?sltoken=abc123
- Le bookmarklet récupère les données via `GET /api/bookmarklet-data?token=abc123`
- Remplit automatiquement : titre, description, prix + dropdowns catégorie/marque/taille/état/couleur/matière
- Page d'installation : `/bookmarklet`
- Fichiers : `app/api/bookmarklet-data/route.ts`, `app/bookmarklet/page.tsx`

---

## Mannequin IA — Descriptions complètes

Fichier : `lib/mannequin-descriptions.ts`

Mannequins retenus (10H + 10F) :
- Hommes : man-01, man-02, man-05, man-06, man-07, man-09, man-13, man-16, man-18, man-20
- Femmes : woman-01, woman-02, woman-04, woman-06, woman-07, woman-10, woman-13, woman-16, woman-18, woman-20

Note : 40 nouvelles photos à régénérer (face + 3/4) avec pantalon ample + imperfections. En attente.

---

## Équivalences de tailles — Référence officielle

### Vêtements homme/femme
| EU Homme | EU Femme | Lettres | IT | FR | UK | US |
|----------|----------|---------|----|----|-----|-----|
| 44 | 34 | XS | 44 | 34 | 8 | 4 |
| 46 | 36 | S | 46 | 36 | 10 | 6 |
| 48 | 38 | M | 48 | 38 | 12 | 8 |
| 50 | 40 | L | 50 | 40 | 14 | 10 |
| 52 | 42 | XL | 52 | 42 | 16 | 12 |
| 54 | 44 | XXL | 54 | 44 | 18 | 14 |
| 56 | 46 | XXXL | 56 | 46 | 20 | 16 |

### Jeans (W)
| Tour de taille (cm) | W | Lettres |
|---------------------|---|---------|
| 71 | 28 | XS |
| 76 | 30 | S |
| 81 | 32 | M |
| 86 | 34 | L |
| 97 | 38 | XL |
| 102 | 40 | XXL |

### Pointures (EU avec demi-pointures)
Tableau complet de EU 35 à EU 46 avec correspondances UK/US Homme/US Femme.

---

## Taxonomie Vinted — 7 langues ✅

Fichier : `lib/vinted-taxonomy.ts` — traduit dans FR, EN, ES, DE, IT, NL, PL.
Couleurs (29), États (5), Matériaux (55), Catégories, Sous-catégories — tous traduits.

---

## Roadmap

### Phase 1 — En cours
- Landing page + blog + pages légales ✅
- Redesign complet ✅
- Multilingue 7 langues ✅
- Flux /app 5 étapes ✅
- i18n complet ✅
- Mannequin IA ✅
- Import URL Vinted 🔄
- Bookmarklet Vinted 🔄
- Supabase Auth + limites freemium 🔄
- Stripe paiements 🔄
- Déploiement Vercel 🔄

### Phase 2
- Message auto favoris (lien pré-rempli + message IA)
- Republication automatique + rappels
- Onboarding guidé
- Chat support automatique (Claude API)
- Notifications email intelligentes

### Phase 3
- Dashboard ventes + bordereaux
- Programme referral
- Changelog public
- Outil génération posts réseaux sociaux

### Phase 4
- Extension Chrome (pré-remplit Vinted automatiquement)
- Application mobile
- API publique Pro
- Détection tendances marché Vinted

---

## V2
- Régénérer 40 photos mannequins (face + 3/4) avec pantalon ample + imperfections
- Mode retouche background removal (outil pinceau/gomme)
- Amélioration suppression de fond (rembg MIT)
- Graphique probabilité vente / prix / temps

---

## Points légaux
- Pas encore de société créée
- Espagne → Autónomo quand revenus > 500€/mois (Tarifa Plana ~80€/mois)
- RGPD : autorité compétente AEPD (Espagne)
- CGU à harmoniser avec droit espagnol
- Vinted CGU : scraping/automation en zone grise → mentionner dans CGU
- @imgly/background-removal : licence AGPL → contacter IMG.LY avant commercialisation

---

## Règles de travail
- Toujours sauvegarder sur GitHub après chaque session majeure
- Ne jamais développer sans expliquer ce qu'on fait
- Chaque fonctionnalité = version freemium limitée + version payante
- Tester sur mobile avant de valider
- Commenter le code en français
- RÈGLE ABSOLUE : tout développement appliqué dans les 7 langues (FR/EN/ES/DE/IT/NL/PL)
- RÈGLE ABSOLUE : aucun texte en dur — tout passe par i18n
- RÈGLE ABSOLUE : tous les appels API incluent la locale
- Pour chaque nouvelle page : meta title + description SEO obligatoires
- Photos redimensionnées à 1024px avant envoi API
