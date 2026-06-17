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
- Flux /app — 5 étapes complètes ✅ (Article → Visuels → Annonce → Prix → Publication)
- Build propre — 0 erreur TypeScript ✅
- Taxonomie Vinted traduite dans les 7 langues ✅
- i18n complet sur tout le flux /app ✅
- Mannequin IA FASHN tryon-max intégré (plan Pro) — 15H + 15F, 3 poses ✅
- Photos produit non portées FASHN product-to-model (Pro) ✅
- Style auto-adapté : prompt de tenue généré selon article + traduit en anglais ✅
- Rendu 3:4 (1080×1440) toutes photos traitées, 31 fonds ✅
- Import URL Vinted ✅ (plan Pro)
- Bookmarklet Vinted ✅ (fonctionnel)

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
- IA : Claude API — claude-sonnet-4-6 pour vision et génération, claude-haiku-4-5 pour classification photos et traduction de prompts
- Suppression fond : @imgly/background-removal (WebAssembly côté client, gratuit, privé)
- Mannequin IA : FASHN.ai — tryon-max pour photos portées, product-to-model pour photos produit
- Analytics : Umami (RGPD, gratuit)
- Hébergement : Vercel

## Variables d'environnement (.env.local)
- ANTHROPIC_API_KEY ✅ configurée
- FASHN_API_KEY ✅ configurée (fa-zaUBIGEPff7K-BkFUaRR8lABFmlzx3ZM19BBQ)

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
- Freemium 0€ : 1 annonce/mois, background removal blanc uniquement sur slot 0, pas de mannequin IA, pas d'import URL
- Premium X€ : annonces limitées/mois, background removal 31 fonds sur photos choisies, pas de mannequin IA, pas d'import URL
- Pro XX€ : annonces limitées/mois, background removal complet, mannequin IA (photos portées + produit), import URL Vinted, bookmarklet Vinted

---

## Page /app — Flux en 5 étapes

**Frise :** Article → Visuels → Annonce → Prix → Publication

---

### Étape 1 — Article ✅ Construite
Upload photos + classification IA + reconnaissance automatique

#### Import URL Vinted ✅ (plan Pro uniquement)
- Zone "Importer depuis Vinted" en haut, alternative à l'upload manuel
- Freemium/Premium : zone visible mais verrouillée (cadenas)
- Pro : input URL + bouton "Importer"
- Supporte tous les domaines Vinted : .fr, .es, .de, .it, .nl, .pl, .co.uk
- API : `app/api/import-vinted/route.ts`
- Technique : fetch côté serveur → regex sur HTML pour extraire URLs images1.vinted.net → filtre par timestamp dominant → téléchargement en base64 → injection dans slots
- IMPORTANT : Vinted n'utilise PAS __NEXT_DATA__ — on parse le HTML directement
- NE récupère PAS titre/description/prix/catégorie — uniquement les photos

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

**Section 2 — PHOTOS PORTÉES** — 6 slots
- Slots 9-14 : Vue portée 1 à 6 — Recommandé (1-4) / Optionnel (5-6)

#### Classification IA
- UN SEUL appel Claude Haiku pour toutes les photos simultanément
- Redimensionnement automatique à 1024px avant envoi
- Ordre priorité : worn → flat → detail → autre

#### Reconnaissance automatique (dans la même étape)
Claude Vision (claude-sonnet-4-6) analyse les photos et pré-remplit le formulaire.
Le prompt reçoit `locale` pour répondre dans la langue de l'interface.

Champs détectés : Marque, Segment de marque (interne), Genre, Catégorie + sous-catégorie (vintedPath), Taille, État, Couleur (max 2), Matière, Style, Motif, Défauts visibles

**Informations complémentaires :**
- Bloc 1 — Infos générales : pays de fabrication, doublure, numéro référence, type cuir, entretien, Autre + Prix neuf
- Bloc 2 — Dimensions : poitrine, longueur, épaules, taille, hanches, entrejambe, pointure, largeur, hauteur, profondeur + mesure personnalisée

---

### Étape 2 — Visuels ✅ Construite
Traitement photos : détourage fond + fonds + mannequin IA + photos produit

#### Suppression de fond
- @imgly/background-removal (WebAssembly côté client) — GRATUIT, privé
- Safari : message orange d'avertissement — NE PAS bloquer le flux
- Résultat : détourage PNG → composition sur fond choisi → JPEG 3:4 1080×1440

#### Fonds disponibles — 31 au total
- Blanc pur : `/public/backgrounds/bg-white.jpg`
- Extérieurs/studios : `bg-01.jpg` à `bg-22.jpg`
- Intérieurs scandinaves : `bg-23.jpg` à `bg-30.jpg`
- Changement de fond = recomposition côté client (pas de re-détourage, pas d'appel FASHN)

#### 3 plans tarifaires — comportement photos

**Freemium (0€) :**
- Fond blanc uniquement (autres verrouillés avec cadenas)
- Background removal : slot 0 uniquement
- Mannequin IA : visible mais verrouillé (teaser scrollable)

**Premium :**
- 31 fonds disponibles avec checkboxes par slot
- Mannequin IA : visible mais génération verrouillée (badge "Pro")

**Pro :**
- 31 fonds + checkboxes
- Mannequin IA et photos produit entièrement fonctionnels

#### Rendu final — format universel
- Toutes les photos traitées : JPEG 3:4 portrait, 1080×1440 px
- Fond : cover (Math.max) pour remplir le cadre
- Cutout : contain 85% (Math.min) centré sur le fond
- Les photos traitées ne vont JAMAIS dans les slots originaux
- State séparé : `aiCutoutEntries`, `productCutoutEntries`, `aiPhotos`

#### Mannequin IA — FASHN.ai tryon-max (plan Pro)
- API : `app/api/generate-mannequin/route.ts`
- Endpoint FASHN : **tryon-max** (2 crédits/photo, qualité maximale)
- Mannequins : **15 hommes + 15 femmes** — man-01 à man-15 / woman-01 à woman-15
- Fichiers : `/public/mannequins/final/{id}.png` — 3 poses disponibles : face, side, back
- Descriptions : `lib/mannequin-descriptions.ts`
- Bouton sélection : "Choisir ce mannequin" (confirmation avant génération)
- Paramètres FASHN : `model_image` (base64 PNG pose choisie), `garment_image` (slot 0 base64), `outfit_prompt` (tenue traduite EN), `resolution: "1k"`, NO background_reference
- Résultat : URL FASHN → removeBackground (@imgly) → composition sur fond choisi

#### Style auto-adapté — generateOutfitPrompt
- Fichier : `RecognitionStep.tsx` (fonction pure avant le composant)
- Extraction type depuis `vintedPath` (N2/N3 regex) : HAUT / BAS / PIECE_ENTIERE / VESTE / CHAUSSURE / ACCESSOIRE
- Normalisation style depuis `result.style.value` : casual / chic / sportif / vintage / streetwear / rock / business / boheme / minimaliste / default
- Table `OUTFIT_PROMPTS` : 7 langues × 6 types × 10 styles (coupes 2026 — straight-leg, wide-leg, NO slim/skinny)
- `promptIsAutoRef` : flag pour ne pas écraser une édition manuelle de l'utilisateur
- `handleCustomPromptChange` : passe le flag à false, empêche la régénération auto
- Avant chaque appel FASHN : traduction du prompt via `/api/translate-prompt`

#### Traduction du prompt — /api/translate-prompt
- Modèle : claude-haiku-4-5 (rapide, économique)
- Si `source_lang === 'en'` : renvoie le texte sans appel API
- Sinon : traduction en anglais avec vocabulaire mode précis
- Fallback : si échec, envoie le prompt original (ne bloque pas la génération)

#### Photos produit non portées — FASHN.ai product-to-model (plan Pro)
- API : `app/api/generate-product-photo/route.ts`
- Endpoint FASHN : **product-to-model** (mode fast, 1 crédit/photo)
- 3 modes : buste / cintre / plat
- Même pipeline de composition : removeBackground → compositeWithBackground → JPEG 3:4
- `productCutoutEntries` recomposités sur le fond choisi sans re-appel FASHN

#### Coût FASHN par annonce (plan Pro)
- 2 photos mannequin (tryon-max) : 4 crédits
- 2 photos produit (product-to-model fast) : 2 crédits
- Total estimé : ~6-8 crédits/annonce

---

### Étape 3 — Annonce ✅ Construite

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

### Étape 4 — Prix ✅ Construite

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

### Étape 5 — Publication ✅ Construite

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
- Fichiers : `app/api/bookmarklet-data/route.ts`, `app/bookmarklet/page.tsx`, `app/public/bookmarklet.js`

#### Architecture bookmarklet — fonctions JS dans `app/public/bookmarklet.js`
- `sv(el, v)` — setValue React-safe (contourne React #418 via Object.getOwnPropertyDescriptor)
- `sc(path, cb)` — navigue le dropdown Catégorie jusqu'à 4 niveaux via `input[name="category"]`
  - Reçoit le chemin de navigation FR exact (ex: `"Femmes > Vêtements > Jeans > Jeans skinny"`)
  - DOIT s'exécuter EN PREMIER : Vinted n'affiche Marque/Taille/État/Couleur/Matériau qu'après sélection catégorie
- `fb(brand, cb)` — dropdown Marque via `input[name="brand"]` + `input[name="brand-search-input"]`
  - Null-check obligatoire : `input[name="brand"]` absent pour catégories non-vêtements (Électronique, Maison)
- `fs(v, cb)` — dropdown Taille via `[role="checkbox"][aria-label="VALEUR"]`
- `fd(name, v, cb)` — dropdown générique via `input[name]` + `[class*="Cell__clickable"]`
- Ordre de remplissage : titre → description → prix → catégorie (sc) → marque (fb) → taille (fs) → état → couleur 1 → couleur 2 → matériau

#### Chemins de catégorie et langue
- Le champ `categorie` dans `RecognitionResult` contient le chemin de navigation FR exact depuis `lib/vinted-navigation-taxonomy.ts`
- Format : `"N1 > N2 > N3"` ou `"N1 > N2 > N3 > N4"` selon profondeur
- Le prompt de reconnaissance (`app/api/recognize/route.ts`) reçoit `locale` et génère le chemin dans la langue de l'interface
- Le bookmarklet s'exécute sur la version Vinted de la langue choisie par l'utilisateur (vinted.fr, vinted.es, etc.)
- La correspondance langue ↔ chemin UI Vinted est assurée par le fait que le prompt génère des chemins dans la bonne langue

---

## Mannequin IA — Référence complète

Fichier descriptions : `lib/mannequin-descriptions.ts`
Fichiers images : `/public/mannequins/final/{id}.png` — 3 poses par mannequin (face, side, back)

**15 hommes + 15 femmes :**
- Hommes : man-01 à man-15
- Femmes : woman-01 à woman-15

Endpoint FASHN : **tryon-max** (qualité maximale, 2 crédits/photo)
Paramètres : `model_image` (base64 PNG pose), `garment_image` (slot 0 base64), `outfit_prompt` (EN), `resolution: "1k"`

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

### `lib/vinted-taxonomy.ts` — valeurs de dropdowns traduits FR/EN/ES/DE/IT/NL/PL
Couleurs (29), États (5), Matériaux (55), Catégories, Sous-catégories — tous traduits dans les 7 langues.
Utilisé pour : contraintes du prompt de reconnaissance + dropdowns de l'interface /app.

### `lib/vinted-navigation-taxonomy.ts` — chemins de navigation FR uniquement
Chemins exacts de l'interface Vinted FR, format `"N1 > N2 > N3 [> N4 [> N5]]"`.
**Taxonomie Femmes/Hommes complète aux niveaux 4 et 5 connus** (Vêtements, Chaussures, Accessoires).
- N4 ajouté : Maternité, Vêtements de sport, Bottes, Chaussures de sport, Chapeaux, Bijoux, Sous-vêtements, Pyjamas, Sacs (Hommes), Vêtements de sport et accessoires (Hommes)
- N5 ajouté : Manteaux/Vestes (Femmes+Hommes), Sweats (Femmes), Accessoires de sports (Femmes+Hommes), Sous-vêtements maternité (Femmes)
- `getNavRef()` → chaîne newline-séparée pour injection dans le prompt de reconnaissance
- `getNavRefFiltered(prefix)` → filtre par préfixe (usage futur)
- **Pas de traductions** : le prompt de reconnaissance reçoit `locale` et génère directement le chemin dans la langue Vinted correspondante
- Le champ `categorie` de `RecognitionResult` = chemin exact copié depuis cette liste (en FR pour vinted.fr, traduit pour les autres versions)
- Le champ `sousCategorie` = dernier segment du chemin (rétrocompatibilité avec les dropdowns de l'étape 2)

---

## Roadmap

### Phase 1 — En cours
- Landing page + blog + pages légales ✅
- Redesign complet ✅
- Multilingue 7 langues ✅
- Flux /app 5 étapes ✅
- i18n complet ✅
- Mannequin IA ✅
- Import URL Vinted ✅
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

---

## Résumé session 2026-06-12 — Bookmarklet & taxonomie

### Bookmarklet Vinted ✅ (fonctionnel, plan Pro)
Fichiers : `app/public/bookmarklet.js` (source lisible), `app/bookmarklet/page.tsx` (version minifiée servie).

**Champs remplis automatiquement (dans l'ordre) :**
titre → description → prix → catégorie (sc) → marque (fb) → taille (fs) → état → couleur 1 → couleur 2 → matériau

**Fonctions JS :**
- `sv(el, v)` — setValue React-safe (contourne React #418)
- `sc(path, cb)` — navigue le dropdown Catégorie jusqu'à **5 niveaux** via `input[name="category"]`
  - `af(cb)` (autoFirst) — si Vinted affiche encore des options après le dernier niveau du path, sélectionne automatiquement la 1re option visible (ferme le dropdown, débloque les champs suivants)
  - Délai 1200ms entre chaque niveau ET avant `af` (uniformisé depuis 800ms pour fiabilité)
- `fb(brand, cb)` — dropdown Marque via `input[name="brand"]` + champ de recherche `brand-search-input`
- `fs(v, cb)` — taille via `[role="checkbox"][aria-label]` + fallback "Taille unique" dans les 7 langues Vinted + null-check si champ absent
- `fd(name, v, cb)` — dropdown générique (état, couleur, matériau) via `input[name]`

**Architecture :** token UUID stocké en Map mémoire serveur (15 min), API `GET /api/bookmarklet-data?token=`, bookmarklet injecté via `javascript:` URL avec `encodeURIComponent`.

### Taxonomie de navigation Vinted — `lib/vinted-navigation-taxonomy.ts`
Format flat `NAV_PATHS`: `"N1 > N2 > N3 [> N4 [> N5]]"` — source unique pour dropdowns cascades ET prompt de reconnaissance.

**Couverture complète Femmes/Hommes (N4 et N5 ajoutés cette session) :**
- N4 ajouté : Maternité (13 entrées dont 3 N5), Vêtements de sport F+H, Bottes F+H, Chaussures de sport F+H, Chapeaux F+H, Bijoux F+H, Sous-vêtements et chaussettes H, Pyjamas H, Sacs et sacoches H
- N5 ajouté : Manteaux (7F/6H), Vestes (11F/12H), Sweats (6F), Accessoires de sports (5F/5H), Sous-vêtements maternité (3F)
- Total : ~256 chemins N3, ~72 chemins N4, ~48 chemins N5

**Exports :**
- `NAV_PATHS` — liste complète (pour `getNavRef()` injecté dans le prompt)
- `VINTED_TAXONOMY_LEVEL5_FR` — constante Record des N5 connus (pour référence rapide)
- `parseVintedPath(path)` → `{ n1, n2, n3, n4, n5 }`
- `getN1List()`, `getN2List(n1)`, `getN3List(n1,n2)`, `getN4List(n1,n2,n3)`, `getN5List(n1,n2,n3,n4)`

### Nettoyage `lib/vinted-taxonomy.ts`
Supprimé : interfaces `SubCategory`/`Category`, const `CATEGORIES` (~500 lignes), `CATEGORY_LABELS`, `SUBCATEGORY_LABELS`.
Conservé : `SIZES`, `COLORS`, `MATERIALS`, `CONDITIONS`, `STYLES`, `PATTERNS`, `tx()`, tous les `*_LABELS`.

### Étape 2 — Reconnaissance (RecognitionStep.tsx)
- Champ `vintedPath` remplace `categorie` + `sousCategorie`
- Dropdowns en cascade N1→N2→N3→N4→N5 (N5 affiché si `n5Options.length > 0`)
- Badge de confiance correctement transmis (plus de faux "Modifié")
- Avertissement ambre si N3 terminal sans N4/N5 dans la taxonomie ("Vérifiez la sous-catégorie sur Vinted après remplissage"), traduit dans les 7 langues

---

## Résumé session 2026-06-17 — Visuels, mannequin IA & style auto-adapté

### Réorganisation du flux /app
- Étape 1 : **Article** = upload + classification IA + reconnaissance (anciens étapes 1+2 fusionnés)
- Étape 2 : **Visuels** = tout le traitement photo (détourage + fonds + mannequin IA + photos produit)
- Frise finale : Article → Visuels → Annonce → Prix → Publication (dans les 7 langues)

### FASHN — passage à tryon-max
- Photos portées : **tryon-max** (2 crédits/photo, qualité maximale)
- Photos produit non portées : **product-to-model fast** (1 crédit/photo)
- 3 modes produit : buste / cintre / plat
- Résolution : `1k` partout
- `background_reference` retiré — composition côté client uniquement

### Mannequins IA
- **15 hommes + 15 femmes** : man-01 à man-15 / woman-01 à woman-15
- **3 poses** par mannequin : face, side, back — fichiers `/public/mannequins/final/{id}.png`
- Bouton de confirmation "Choisir ce mannequin" avant génération

### Rendu 3:4 universel (compositeWithBackground)
- Format fixe : JPEG portrait 1080×1440 px
- Fond : cover (Math.max), cutout : contain 85% centré (Math.min)
- Changement de fond = recomposition locale gratuite (aucun appel FASHN)
- Même pipeline pour : slots réels, photos mannequin, photos produit

### 31 fonds
- `bg-white.jpg` + `bg-01.jpg` à `bg-22.jpg` + **`bg-23.jpg` à `bg-30.jpg`** (8 intérieurs scandinaves)

### Style auto-adapté (generateOutfitPrompt)
- `classifyGarment(vintedPath)` → type (HAUT/BAS/PIECE_ENTIERE/VESTE/CHAUSSURE/ACCESSOIRE) via regex N2/N3
- `normalizeStyle(style.value)` → clé style (casual/chic/sportif/vintage/streetwear/rock/business/boheme/minimaliste/default)
- `OUTFIT_PROMPTS` : 7 langues × 6 types × 10 styles — coupes 2026 (straight-leg/wide-leg, zéro slim/skinny)
- `promptIsAutoRef` + `handleCustomPromptChange` : la génération auto s'arrête dès que l'utilisateur modifie le champ
- Traduction via `/api/translate-prompt` (claude-haiku-4-5) avant envoi FASHN — fallback = texte original

### Routes API ajoutées
- `/api/translate-prompt` — claude-haiku-4-5, texte → anglais, court-circuit si source_lang='en'

---

## Prochaine session — À faire

### Chantier traitement photos (priorité)

1. **Tester le cycle complet** — une fois les crédits FASHN rechargés, tester la génération mannequin (tryon-max) et photos produit (product-to-model) de bout en bout sur un vrai article

2. **2ème photo produit = dos/profil** — actuellement les 2 photos produit non portées sont générées avec le même prompt (face). La 2ème devrait être le dos de l'article (ou profil si chaussure). Modifier `handleGenerateProductPhoto` pour envoyer un prompt différent sur le 2ème appel.

3. **Gestion des photos/infos manquantes** — demander les photos obligatoires (face, dos, étiquettes) si absentes au moment du passage à l'étape 2, et demander les clarifications manquantes (taille non reconnue, couleur incertaine, etc.) avant génération

4. **Simplifier l'UX du panneau Visuels** — mieux distinguer "suppression de fond" (gratuit/@imgly) et "génération IA FASHN" (Pro), permettre le choix de fond par photo individuelle, indiquer clairement "3 photos portées + 2 non portées" dans les libellés

5. **Améliorer la classification** — photo de dos mal classée en "étiquette marque". Affiner le prompt de classification Claude Haiku pour mieux distinguer dos d'article vs étiquette

6. **Liseré bleu résiduel** — artifact FASHN tryon-max sur certaines photos (halo bleu autour du vêtement). Rendre le prompt plus explicite : "seamless integration, no color fringe, no blue halo, clean edges"

7. **Nettoyer le code mort dans RecognitionStep** — supprimer les fonctions/imports inutilisés : `ConfidenceBadge` dupliqué, `Field`, hook `useRecognition`, imports taxonomy non utilisés. Réduire la taille du fichier.

8. **Décider : infos complémentaires → étape Annonce** — les champs dimensions/infos (pays, doublure, etc.) sont actuellement en étape Visuels. Les déplacer vers l'étape Annonce serait plus logique (regrouper tout ce qui sert à la description). À décider avant de coder.

### Autres priorités

9. **Stabilisation calcul de prix** — tester sur des vrais articles, affiner les pondérations marché/décote
10. **Supabase Auth** — inscription/connexion, gestion des quotas freemium
11. **Stripe paiements** — checkout Premium + Pro
12. **Déploiement Vercel** — voir section ⚠️ ci-dessous (mannequins à migrer d'abord)

---

## ⚠️ À faire avant déploiement Vercel — Mannequins IA

`public/mannequins/` est dans le `.gitignore` (494 Mo de PNG impossibles à pousser sur GitHub tel quel).
Les fichiers existent en local et tout fonctionne, mais ils **ne seront pas sur Vercel automatiquement**.

**Deux options au moment du déploiement :**

**Option A — Supabase Storage (recommandée)**
- Uploader les 45 PNG (× 3 poses) sur un bucket Supabase Storage public
- Modifier `app/api/generate-mannequin/route.ts` : remplacer `readFileSync` par un `fetch` vers l'URL Supabase
- Avantage : pas de limite de taille, images CDN-servis

**Option B — Git LFS**
- `git lfs install` + `git lfs track "app/public/mannequins/**/*.png"`
- Commit + push avec LFS activé
- Avantage : transparent dans le code, pas de changement de routes
- Inconvénient : coût GitHub LFS Storage au-delà de 1 Go gratuit

**Status actuel :** en local ✅ / GitHub ❌ (gitignoré) / Vercel ❌ (absent du repo)
