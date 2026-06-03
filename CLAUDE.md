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
- Analytics : Umami (RGPD, gratuit)
- Hébergement : Vercel

## Variables d'environnement (.env.local)
- ANTHROPIC_API_KEY ✅ configurée
- HUGGINGFACE_API_KEY ✅ configurée

## RÈGLE CRITIQUE — next.config.ts
- NE JAMAIS ajouter `asyncWebAssembly: true` dans next.config.ts — casse Safari
- Le fichier next.config.ts doit rester avec une config minimale

---

## Langues — 7 langues ✅
- FR, EN, ES, DE, IT, NL, PL — toutes en place
- Fichiers i18n créés pour toutes les langues ✅
- Fallback : anglais si langue non disponible
- RÈGLE ABSOLUE : tout développement doit être appliqué dans les 7 langues

---

## 3 Formules tarifaires
- Freemium 0€ : publicités AdSense, 5 photos/mois, 5 calculs prix, 3 annonces
- Vendeur actif 9€/mois : tout illimité + dashboard + relance auto
- Pro 29€/mois : tout + détection tendances + alertes + message favoris

---

## Page /app — Flux en 5 étapes

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

#### Disposition visuelle
- Section NON PORTÉES : grille `grid-cols-3` × 3 lignes (9 cases), `w-full aspect-square object-cover`
- Section PORTÉES : grille `grid-cols-6` × 1 ligne (6 cases), `w-full aspect-square object-cover`
- Toutes les photos s'affichent en `object-cover` pour remplir les cases carrées
- Les 2 sections doivent tenir sur une seule page sans scroller

#### Upload et classification IA

Upload :
- Zone "Importer plusieurs photos" en haut + drag & drop
- Upload individuel par slot (clic sur la case)
- Classification automatique via Claude Haiku Vision (`app/api/classify-photos/route.ts`)
- Drag & drop entre slots pour corriger (DÉSACTIVÉ après remove background)
- Photos FIGÉES après suppression de fond

Règles de classification IA — ordre de priorité STRICT :

1. **L'article est porté par une personne ?** → `worn` → slots 9-14
2. **L'article est sur cintre ou à plat ?** → `flat` → slots 0, 1, 2
3. **Texte/étiquette lisible au premier plan ?** → `detail` avec sous-type :
   - Nom de marque (ex: KENZO, Nike...) → slot 3
   - Taille uniquement → slot 4
   - Composition uniquement → slot 5
   - Taille + composition sur la même étiquette → slot 4
   - Pas de texte lisible (gros plan couture, zip, défaut...) → slot 6, 7 ou 8
4. **Sinon** → slot 6 (autre détail)

Règles de débordement :
- Si slots 0-2 pleins → débordement flat → slots 6, 7, 8
- Si slots 9-14 pleins → débordement worn → slots 6, 7, 8
- Si slots 6, 7, 8 pleins → avertissement orange "X photo(s) ignorée(s) faute de place"
- Si total photos > 15 → avertissement "Seules les 15 premières photos ont été importées"

#### Suppression de fond

- @imgly/background-removal (WebAssembly côté client) — GRATUIT
- Compatible Chrome, Firefox, Edge
- Sur Safari : afficher message orange "Suppression de fond indisponible sur ce navigateur. Utilisez Chrome ou Firefox." dans les 7 langues — NE PAS bloquer le reste du flux
- Gratuit : slot 0 uniquement
- Pro : slots 1-8
- Pas de suppression fond : slots 9-14 (photos portées)

#### Fonds disponibles — 23 au total (choix sauvegardé localStorage, clé `sellerlab_bg_choice`)

1. **Blanc pur** — CSS `#FFFFFF` — toujours en première position — pas d'image
2-23. **bg-01.jpg à bg-22.jpg** — images IA générées dans `/public/backgrounds/`

Interface de sélection : grille scrollable horizontalement avec vignettes ~64px.
PAS de dépendance Unsplash ou autre service externe — tout est local dans /public/backgrounds/.

Composite fond : cutout PNG (fond transparent) + image de fond choisie → canvas → JPEG 92%

#### Bannière de validation (avant remove background)
- Affichée quand slot 0 contient une photo et n'est pas encore figé
- Titre : "Vérifiez l'ordre de vos photos"
- Grille scrollable horizontale pour choisir le fond
- Aperçu : afficher UNIQUEMENT le fond choisi (sans l'article par-dessus)
- Bouton "Traiter les photos — Supprimer le fond"

Fichiers :
- app/app/page.tsx — stepper 5 étapes (makeSlots() crée 15 slots)
- app/app/types.ts — types PhotoSlot, SlotStatus
- app/app/components/PhotoUploadStep.tsx
- app/api/remove-bg/route.ts
- app/api/classify-photos/route.ts

---

### Étape 2 — Reconnaissance automatique ✅ Construite

Claude Vision (claude-sonnet-4-6) analyse les photos et pré-remplit le formulaire.
L'utilisateur ne voit JAMAIS les 200 catégories Vinted directement.

Champs détectés automatiquement :
- Marque
- Genre (Homme/Femme/Mixte/Enfant)
- Catégorie Vinted + sous-catégorie (depuis vinted-taxonomy.ts)
- Taille (détection auto sur étiquette — voir règles ci-dessous)
- État (5 états officiels Vinted avec descriptions exactes)
- Couleur (max 2, liste exacte 29 couleurs Vinted)
- Matière (liste exacte 55 matériaux Vinted)
- Style, Motif
- Défauts visibles (confirmation utilisateur obligatoire)

#### Règles de détection de taille — PRIORITÉ ABSOLUE

1. Scanner TOUS les slots 0-8 (non portées) pour trouver une taille lisible sur une étiquette
2. Slots prioritaires : slot 4 (Étiquette taille) en premier, puis les autres slots 0-8
3. Si une taille est lisible sur n'importe quel slot 0-8 → confiance ÉLEVÉE, jamais Incertaine
4. La taille reconnue doit être automatiquement pré-sélectionnée dans le menu déroulant
5. S'applique à TOUS les systèmes : numérique (48, 46...), lettres (XS, S, M...), jeans (28, 29, 30...), pointures (EU, UK, US), tailles femme (34, 36...), tailles italiennes, françaises, etc.
6. Un seul menu déroulant pour la taille — pas de tabs/pills par système de taille
7. "Incertaine" uniquement si aucune étiquette visible et taille impossible à déterminer visuellement

Indicateur de confiance :
- Vert = Élevée
- Orange = Moyenne (à vérifier)
- Rouge = Incertaine (à compléter) — JAMAIS "Élevée" sur un champ vide
- Gris = Modifié manuellement

Systèmes de tailles disponibles (référence vinted-taxonomy.ts) :
- Lettres : XS, S, M, L, XL, XXL, XXXL
- EU femme : 34, 36, 38, 40, 42, 44, 46, 48
- EU homme : 44, 46, 48, 50, 52, 54, 56
- Jeans : 28, 29, 30, 31, 32, 33, 34, 36, 38, 40, 42 (les impaires existent)
- Pointures : EU 35-46 avec demi-pointures, UK, US homme/femme
- Enfant âge : 0-3 mois à 14 ans
- Enfant cm : 56 à 164
- One Size

États officiels Vinted (descriptions exactes) :
- Neuf avec étiquette : article neuf, jamais porté/utilisé avec étiquettes ou dans son emballage d'origine
- Neuf sans étiquette : article neuf, jamais porté/utilisé, sans étiquettes ni emballage d'origine
- Très bon état : article très peu porté/utilisé qui peut présenter de légères imperfections
- Bon état : article porté/utilisé quelques fois, présentant des imperfections et des signes d'usure
- Satisfaisant : article porté/utilisé plusieurs fois, présentant des imperfections et des signes d'usure

Couleurs exactes Vinted (max 2, ordre exact interface) :
Noir, Gris, Blanc, Crème, Beige, Abricot, Orange, Corail, Rouge, Bordeaux, Fuchsia, Rose, Violet, Lila, Bleu clair, Bleu, Marine, Turquoise, Menthe, Vert, Vert foncé, Kaki, Marron, Moutarde, Jaune, Argenté, Doré, Multicolore, Transparence

Matériaux Vinted (55, ordre alphabétique exact) :
Acier, Acrylique, Alpaga, Argent, Bambou, Bois, Cachemire, Caoutchouc, Carton, Coton, Cuir, Cuir synthétique, Cuir verni, Céramique, Daim, Denim, Dentelle, Duvet, Fausse fourrure, Feutre, Flanelle, Jute, Laine, Latex, Lin, Maille, Mohair, Mousse, Mousseline, Mérinos, Métal, Nylon, Néoprène, Or, Paille, Papier, Peluche, Pierre, Plastique, Polaire, Polyester, Porcelaine, Rotin, Satin, Sequin, Silicone, Soie, Toile, Tulle, Tweed, Velours, Velours côtelé, Verre, Viscose, Élasthanne

Fichiers :
- lib/vinted-taxonomy.ts ✅ (taxonomie complète avec Maison, Électronique, Beauté, Sport)
- app/api/recognize/route.ts ✅ (slots étiquettes : marque=3, taille=4, composition=5)
- app/app/components/RecognitionStep.tsx ✅

---

### Étape 3 — Génération de l'annonce ✅ Construite
(Annonce avant Prix — décision finale)

RÈGLE ABSOLUE : jamais d'information dont on n'est pas sûr à 100%
- Seules les infos détectées sur photos OU renseignées par l'utilisateur
- Si doute → champ dans "Infos à valider" pour confirmation utilisateur
- Si validé → intégration automatique dans la description
- NE JAMAIS mentionner "Vinted Pro" — remplacer par "Envoi soigné et rapide"

Structure de la page (ordre exact) :

1. MOTS-CLÉS SEO (en haut)
   - Tags verts = déjà dans la description
   - Tags bleus = à ajouter (clic → passe vert)
   - Champ ajout personnalisé
   - Bouton "Intégrer les mots-clés sélectionnés" → intègre dans titre ET description de façon fluide et naturelle (pas de hashtags)

2. SECTION "INFORMATIONS À COMPLÉTER" (orange, une seule section fusionnée)
   - Informations manquantes détectées par l'IA : clic sur un tag → champ texte inline → bouton "Ajouter à la description"
   - Dimensions optionnelles (nom + valeur en cm)
   - Prix neuf (optionnel)
   - Bouton "Intégrer ces infos dans l'annonce"

3. TITRE (max 60 caractères, éditable, compteur)

4. DESCRIPTION (éditable directement, sans scroll)
   - Format aéré avec emojis et bullet points
   - ✅ État / 👕 Article / 🧵 Composition / 📏 Équivalences tailles / 💰 Prix neuf si renseigné / 📦 Expédition
   - Équivalences tailles automatiques depuis le tableau officiel (voir section Équivalences tailles)
   - Prix d'achat neuf → intégré si renseigné
   - PAS d'info inventée
   - Utilisateur peut modifier/supprimer n'importe quelle ligne
   - Description en français EN PREMIER, puis version anglaise EN DESSOUS séparée par "English version" — PAS d'onglets

Fichiers :
- app/api/generate/route.ts ✅
- app/app/components/AnnonceStep.tsx ✅

---

### Étape 4 — Calcul du prix ✅ Construite
(Prix après Annonce — décision finale)

- Pas de frais vendeur Vinted (frais à charge de l'acheteur)
- Calcul marge OPTIONNEL — uniquement pour revendeurs

Structure en 2 blocs compacts :

BLOC 1 — PRIX RECOMMANDÉ + MARCHÉ (tout en un)
- Bannière confiance : verte (fiable) / orange (partielle) / rouge (inconnue)
- Prix suggéré en grand
- Raisonnement court (2-3 lignes)
- Analyse marché en ligne horizontale : Prix neuf | Médiane Vinted | Fourchette | Annonces | Délai
- Données via web search Claude — si indisponible → "N/D", jamais inventé

BLOC 2 — AJUSTER MON PRIX (tout en un)
- Slider prix + frise colorée verte→orange→rouge
- Délai estimé dynamique (~2-3 jours à +1 mois) à droite
- Conseil contextuel sous le slider
- Prix minimum à accepter (négociation)
- Section optionnelle repliée "Prix d'achat & marge" :
  * Prix d'achat neuf → calcul % selon état :
    - Neuf avec étiquette : 65%
    - Neuf sans étiquette : 55%
    - Très bon état : 40%
    - Bon état : 30%
    - Satisfaisant : 20%
  * Toggle "Je suis revendeur" → marge nette

Fichiers :
- app/api/price/route.ts ✅
- app/app/components/PricingStep.tsx ✅

---

### Étape 5 — Export vers Vinted ✅ Construite

- Aperçu carte style Vinted (photo, titre, tags, prix)
- Toggle optionnel "Inclure le prix neuf dans la description" :
  * Prix neuf fourni par utilisateur → affiché avec certitude
  * Prix neuf trouvé par IA avec haute confiance → proposé comme estimation
  * Prix neuf inconnu → option non affichée
- Barre de progression : se remplit au fur et à mesure
- Bouton "Ouvrir Vinted" → vinted.fr/items/new dans nouvel onglet
- 10 champs dans l'ordre EXACT du formulaire Vinted :
  1. Photos (bouton "Fait ✓" manuel)
  2. Titre (Copier → coche auto)
  3. Description (Copier → coche auto)
  4. Catégorie (bouton "Fait ✓" manuel)
  5. Marque (Copier → coche auto)
  6. Taille (Copier → coche auto)
  7. État (bouton "Fait ✓" manuel)
  8. Couleur (bouton "Fait ✓" manuel)
  9. Matériau (bouton "Fait ✓" manuel)
  10. Prix (Copier → coche auto)
- Message "Annonce complète !" quand tous les champs cochés
- V1.5 : extension Chrome pré-remplit Vinted automatiquement

Fichiers :
- app/app/components/ExportStep.tsx ✅ (15 slots — slots 0-8 non portées, slots 9-14 portées)

---

## Équivalences de tailles — Référence officielle

Ces tableaux font autorité sur TOUTES les étapes du flux (reconnaissance, annonce, export).
Toujours afficher l'équivalence en lettres (XS/S/M/L...) à partir de la taille détectée.

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
| 74 | 29 | XS |
| 76 | 30 | S |
| 79 | 31 | S |
| 81 | 32 | M |
| 84 | 33 | M |
| 86 | 34 | L |
| 91 | 36 | L |
| 97 | 38 | XL |
| 102 | 40 | XXL |
| 107 | 42 | XXXL |

### Pointures (avec demi-pointures EU)
| EU | UK | US Homme | US Femme |
|----|-----|----------|----------|
| 35 | 2.5 | 4 | 5 |
| 35.5 | 3 | 4.5 | 5.5 |
| 36 | 3.5 | 5 | 6 |
| 36.5 | 4 | 5.5 | 6.5 |
| 37 | 4.5 | 6 | 7 |
| 37.5 | 5 | 6.5 | 7.5 |
| 38 | 5.5 | 6.5 | 8 |
| 38.5 | 6 | 7 | 8.5 |
| 39 | 6.5 | 7.5 | 9 |
| 39.5 | 7 | 8 | 9.5 |
| 40 | 7 | 8.5 | 10 |
| 40.5 | 7.5 | 9 | 10.5 |
| 41 | 7.5 | 9.5 | 11 |
| 41.5 | 8 | 10 | 11.5 |
| 42 | 8.5 | 10.5 | 12 |
| 42.5 | 9 | 11 | 12.5 |
| 43 | 9.5 | 11.5 | 13 |
| 43.5 | 10 | 12 | 13.5 |
| 44 | 10 | 12.5 | 14 |
| 44.5 | 10.5 | 13 | 14.5 |
| 45 | 11 | 13.5 | 15 |
| 45.5 | 11.5 | 14 | 15.5 |
| 46 | 11.5 | 14.5 | 16 |

### Tailles enfant
Conserver le système de taille Vinted existant (déjà dans vinted-taxonomy.ts).

---

## Taxonomie Vinted

Couleurs (29 dans l'ordre) : Noir, Gris, Blanc, Crème, Beige, Abricot, Orange, Corail, Rouge, Bordeaux, Fuchsia, Rose, Violet, Lila, Bleu clair, Bleu, Marine, Turquoise, Menthe, Vert, Vert foncé, Kaki, Marron, Moutarde, Jaune, Argenté, Doré, Multicolore, Transparence

États officiels (5) :
- Neuf avec étiquette
- Neuf sans étiquette
- Très bon état
- Bon état
- Satisfaisant

Matériaux (55) : Acier, Acrylique, Alpaga, Argent, Bambou, Bois, Cachemire, Caoutchouc, Carton, Coton, Cuir, Cuir synthétique, Cuir verni, Céramique, Daim, Denim, Dentelle, Duvet, Fausse fourrure, Feutre, Flanelle, Jute, Laine, Latex, Lin, Maille, Mohair, Mousse, Mousseline, Mérinos, Métal, Nylon, Néoprène, Or, Paille, Papier, Peluche, Pierre, Plastique, Polaire, Polyester, Porcelaine, Rotin, Satin, Sequin, Silicone, Soie, Toile, Tulle, Tweed, Velours, Velours côtelé, Verre, Viscose, Élasthanne

---

## Roadmap

### Phase 1 — En cours
- Landing page + blog + pages légales ✅
- Redesign complet ✅
- Multilingue 7 langues ✅
- Flux /app 5 étapes construites ✅ — corrections en cours 🔄

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
- Extension Chrome
- Application mobile
- API publique Pro
- Détection tendances marché Vinted

---

## V2
- Mannequin IA — faire porter l'article par un mannequin IA (IDM-VTON / CatVTON via fal.ai)
- Amélioration suppression de fond (rembg ou InSPyReNet pour meilleure qualité)
- Graphique probabilité vente / prix / temps
- Import URL Vinted

---

## Points légaux
- Pas encore de société créée
- Espagne → Autónomo quand revenus > 500€/mois (Tarifa Plana ~80€/mois)
- RGPD : autorité compétente AEPD (Espagne)
- CGU à harmoniser avec droit espagnol
- Vinted CGU : scraping/automation en zone grise → mentionner dans CGU

---

## 🧑‍💻 Rôle 1 — Développeur Senior
- Stack : Next.js 16, TypeScript, Tailwind CSS, Supabase, Stripe
- Toujours écrire du code propre, commenté en français
- Expliquer chaque fonctionnalité simplement avant de coder
- Privilégier la simplicité sur la perfection
- Suggérer les meilleures pratiques de sécurité
- Anticiper : version freemium limitée + version payante complète

---

## 🎨 Rôle 2 — Designer UI/UX Senior (CRITIQUE)
INTERDIT :
- Polices génériques : Inter, Roboto, Arial, System fonts, Space Grotesk
- Dégradés violets/indigo sur fond blanc (cliché IA)
- Layouts prévisibles et composants cookie-cutter

OBLIGATOIRE :
- Plus Jakarta Sans sur tout le site (voir specs polices)
- Animations CSS et micro-interactions sur les moments clés
- Mobile-first : vérifier systématiquement le rendu mobile
- Accessibilité : contraste suffisant, labels clairs
- Palette : indigo #6366F1 accent, blanc base, noir textes

---

## ⚖️ Rôle 3 — Conseiller Légal (Espagne/UE)
- RGPD : signaler si une fonctionnalité collecte des données personnelles
- CGU Vinted : alerter si une fonctionnalité risque de violer leurs conditions
- Autorité compétente : AEPD (Espagne), pas CNIL (France)
- Signaler tout risque légal AVANT de développer

---

## 📣 Rôle 4 — Marketing & Growth
- Proposer textes pour chaque nouvelle fonctionnalité
- SEO : optimiser balises meta de chaque nouvelle page
- Ton : accessible, humain, sans jargon technique
- Programme referral : "Invite un ami = 1 mois gratuit"
- Toujours : comment cette fonctionnalité se différencie de Clemz ?

---

## 🤖 Rôle 5 — Responsable Produit IA
- Chat support automatique : Claude API, widget flottant bas droite
- Notifications intelligentes email automatiques
- Système de feedback : bouton "Suggérer une fonctionnalité"
- A/B testing via Vercel

---

## 📊 Rôle 6 — Consultant Stratégie
- Rappeler la priorité : valider avant de construire
- Comparer avec Clemz si pertinent
- Freemium : chaque fonctionnalité doit avoir une version limitée gratuite
- Parcours : Acquisition → Activation → Rétention → Revenus → Referral

---

## Règles de travail
- Toujours sauvegarder sur GitHub après chaque session majeure
- Ne jamais développer sans expliquer ce qu'on fait
- Chaque fonctionnalité = version freemium limitée + version payante
- Tester sur mobile avant de valider
- Commenter le code en français
- RÈGLE ABSOLUE : tout développement appliqué dans les 7 langues (FR/EN/ES/DE/IT/NL/PL)
- Pour chaque nouvelle page : meta title + description SEO obligatoires
