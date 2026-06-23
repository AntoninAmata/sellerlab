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
Upload libre (galerie + drag-and-drop) + classification IA + reconnaissance automatique + formulaire corrigeable

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
- Slot 0 : Recto — OBLIGATOIRE
- Slot 1 : Verso / dos
- Slot 2 : Autre vue non portée
- Slots 3-5 : Étiquettes (marque / taille / composition) — affichées en menu unifié « Étiquette » dans l'UI, distinction conservée en coulisses pour la classification IA
- Slot 6 : Autre détail
- Slot 7 : Défaut
- Slot 8 : Emballage
- Slots 9-14 : Photos portées (1-4 recommandées, 5-6 optionnelles)

#### Checklist photos (affichée dans l'UI)
3 états visuels par ligne :
- Gris = en attente d'upload
- Vert = contenu couvert par au moins un slot uploadé
- Rouge = manquant mais recommandé
Chaque ligne affiche le « pourquoi » (ex: "L'IA s'en sert pour lire la composition exacte du tissu")

#### Photo principale
- Rôle distinct du contenu : n'importe quel slot peut devenir photo principale
- Badge « ★ Photo principale » en pill indigo sur la vignette (dans l'image, pas sous)
- Par défaut = slot 0 (recto)

#### Classification IA
- UN SEUL appel Claude Haiku pour toutes les photos simultanément
- Redimensionnement automatique à 1024px avant envoi
- Ordre priorité : worn → flat → detail → autre

#### Reconnaissance automatique (dans la même étape)
Claude Vision (claude-sonnet-4-6) analyse les photos et pré-remplit le formulaire.
Le prompt reçoit `locale` pour répondre dans la langue de l'interface.

Champs détectés : Marque, Segment de marque (interne), Genre, Catégorie + sous-catégorie (vintedPath), Taille, État, Couleur (max 2), Matière, Style, Motif, Défauts visibles

#### Formulaire — comportement strict
- Champs obligatoires bloquants : Genre, Catégorie (≥3 niveaux), Marque, Taille (si applicable), État, Couleur(s)
- Badge « Modifié » sur tout champ édité manuellement (confidence → 'manual')
- Jamais confidence « Élevée » sur un champ vide
- Option « Sans marque » disponible (valeur spéciale, non bloquante)
- Défaut détecté → carte « Confirmer / Écarter » bloquante avant de passer à l'étape suivante
- Pop-up garde-fou (verso/étiquettes manquants) fermable au clic extérieur ou Échap

#### Système de tailles — deriveSizeSystems
- Lettres (XS/S/M/L/XL…) + « Taille unique » : tous les vêtements sauf chaussures
- EU homme/femme : disponibles selon le genre détecté
- Jean : système W (W28, W30…)
- Chaussures : EU + UK + US

#### Infos complémentaires (dans l'étape Article)
- Bloc 1 — Infos générales : pays de fabrication, doublure, numéro référence, type cuir, entretien, Autre + Prix neuf
- Bloc 2 — Dimensions : poitrine, longueur, épaules, taille, hanches, entrejambe, pointure, largeur, hauteur, profondeur + mesure personnalisée
- Aucun traitement de fond à cette étape

---

### Étape 2 — Visuels ✅ Construite
Traitement photos : détourage fond + fonds + Studio photo IA (mannequin + produit)

Deux blocs distincts :
- **Mes photos** : fond personnel (sélecteur intégré, previews à la taille des mannequins)
- **Studio photo IA** (ex-Mannequin IA) : fond IA (sélecteur intégré séparé) + Présentation + mannequins

Les deux fonds sont mémorisés séparément via `lib/user-prefs.ts` (localStorage aujourd'hui, Supabase plus tard). Si le fond IA n'a pas été personnalisé, il hérite du fond personnel. Changement de fond = recomposition gratuite côté client à tout moment.

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

#### Studio photo IA — organisation du panneau
Ordre strict dans le panneau :
1. Sélecteur de fond IA (previews w-20 h-20, même taille que les vignettes mannequin)
2. « Présentation de l'article » : À plat / Cintre / Buste → bouton Générer (violet)
3. Sélection mannequin (genre pills → grille → pose → prompt personnalisé)
4. Bouton Générer (photo portée, violet — même couleur que photo produit)

#### Mémoire préférences — lib/user-prefs.ts
- Interface : `readPrefs()` / `savePrefs(patch)` — localStorage aujourd'hui, Supabase profiles.preferences plus tard
- `bgUser` : index fond choisi pour les photos personnelles
- `bgAi` : index fond choisi pour le Studio IA (hérite de bgUser si non défini)
- `mannequin` : id du mannequin sélectionné

#### Mannequin IA — FASHN.ai tryon-max (plan Pro)
- API : `app/api/generate-mannequin/route.ts`
- Endpoint FASHN : **tryon-max** (2 crédits/photo, qualité maximale)
- Mannequins : **15 hommes + 15 femmes** — man-01 à man-15 / woman-01 à woman-15
- Fichiers : `/public/mannequins/final/` — 3 poses par mannequin : `{id}.png` (face), `{id}-side.png` (3/4), `{id}-back.png` (dos)
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
- 3 photos mannequin portées (tryon-max, 1 appel/pose) : 6 crédits
- 2 photos produit non portées (product-to-model fast) : 2 crédits
- Total estimé : ~8 crédits/annonce

---

### Étape 3 — Annonce ✅ Construite

RÈGLE ABSOLUE : jamais d'information inventée. NE JAMAIS mentionner "Vinted Pro".

Structure (ordre exact dans l'UI) :
1. Infos complémentaires — validation/ajout des champs 📋 (pays, doublure…) et 📐 (dimensions)
2. Mots-clés SEO — hashtags CamelCase bilingues
3. Titre (max 60 caractères) : Marque + Type + Couleur + Taille + État, dans la langue de l'interface
4. Choix de langue : Langue native / Anglais / Les deux (défaut)
5. Description éditable avec blocs emoji structurés :
   - 📋 Informations complémentaires
   - 📐 Dimensions
   - 💰 Prix neuf (partagé avec l'étape Prix)
   - NE PAS inclure marque/genre/catégorie/état/couleur/matière en liste brute

#### Règles de génération (prompt Claude Sonnet)
- Titre : Marque + Type + Couleur + Taille + État, max 60 caractères
- Description : 80-150 mots, accroche humaine + blocs emojis, usages déduits du style (jamais inventés), défaut confirmé intégré naturellement, jamais d'info inventée

#### Injection locale des infos (zéro appel API sur validation)
- `upsertEmojiLine()` : trouve/remplace/insère la ligne du bon bloc emoji (📋/📐/💰) sans toucher au reste
- Injection dans les 7 langues : description native avec labels dans la langue UI, description EN toujours en anglais
- `DIM_PRESETS_FR` comme clés canoniques → traduction à l'affichage via `DIM_PRESETS_DISPLAY[lang]`
- `BLOCK_HEADERS` : 7 langues × {infos, dims, prix} pour les en-têtes de blocs
- Pas de bouton « Tout copier »

---

### Étape 4 — Prix ✅ Construite (refonte complète 2026-06-23)

#### Architecture — séparation extraction / calcul
1. **Claude Sonnet + web_search (multi-sources)** → extrait la liste brute des prix d'annonces comparables (`prixAnnonces[]`, nbAnnonces, delaiVente). Aucune formule dans le prompt.
2. **Filtrage IQR + médiane côté code** (`filterIQR()` + `computeMedian()` dans `app/api/price/route.ts`) → médiane déterministe à partir de la liste brute.
3. **`lib/pricing.ts` → `computePrice()`** → calcul TypeScript 100% déterministe. Mêmes données = toujours même prix.
4. **Claude Haiku (temperature=0)** → raisonnement textuel uniquement (2-3 phrases). Jamais formules/coefficients/noms de segment exposés au user.

Le recalcul rapide (accordion "Plus de précisions") utilise les données marché existantes + `computePrice()` + Haiku — sans web search.

#### Référentiel prix — `lib/referentiel_prix_final.json`
- 8 segments × 94 catégories de prix neufs de référence
- Utilisé quand l'utilisateur n'a pas saisi son prix d'achat
- Catégories non-mode (sport/collection/rangement) → `null` → médiane Vinted seule ou champ libre

#### 8 segments de marque (`BrandSegment` dans `lib/pricing.ts`)
`fast_fashion` | `standard` | `premium_accessible` | `premium_createur` | `luxe_contemporain` | `luxe_etabli` | `luxe_iconique` | `ultra_luxe`

**Distinction critique :**
- `luxe_iconique` = **Hermès + Chanel uniquement** → décote douce (garde valeur)
- `luxe_etabli` = Gucci, Prada, Dior, Givenchy, LV… → décote forte (déprécie vite)

#### Classification marques — pipeline hybride
1. Table déterministe `BRAND_SEGMENTS_TABLE` (lib/pricing.ts) — priorité absolue
2. Fallback : `brand_segment` envoyé par Claude depuis l'étape Article (recognize)
3. Fallback ultime : `'standard'`
4. `brandIsUnknown` flag : marque absente de la table ET segment non fiable → si 0 annonce Vinted → `noData: true`

#### Mapping catégories — `CATEGORY_MAP` (lib/pricing.ts)
- 757 entrées : chemin taxonomie Vinted → libellé référentiel (94 catégories)
- Genre-sensible (Femmes/Hommes) pour certaines catégories
- Catégorie non mappée → prix neuf de référence `null` → médiane Vinted seule

#### Deux grilles de décote (`lib/pricing.ts`)
- **Vêtements** : décote forte sur tous les segments (y.c. luxe_etabli)
- **Accessoires** : décote douce réservée aux sacs luxe_iconique et ultra_luxe — tous les autres segments gardent une décote forte
- `neuf_decote = prix_neuf_ref × décote[segment][état] × multiplicateur_matière`
- L'état est appliqué **une seule fois** ; le multiplicateur matière est ignoré si prix saisi par l'utilisateur

#### Pondération progressive (`computePrice`)
`poids_vinted = min(0.97, 0.75 + (n − 1) × 0.04)` — n = nbAnnonces après IQR

| n annonces | Poids Vinted | Poids décote |
|-----------|-------------|-------------|
| 0 | 0% | 100% |
| 1 | 75% | 25% |
| 5 | ~91% | ~9% |
| 7+ | 97% | 3% |

- 0 annonce + prix neuf connu → 100% décote (neuf_decote seul)
- Pas de prix neuf mais médiane disponible → 100% médiane
- Borne inférieure : `prixSuggere ≥ 0.40 × médiane` (évite les prix trop bas)
- Borne supérieure : `prixSuggere ≤ neuf_decote` (jamais au-dessus de la valeur estimée)

#### noData
`noData: true` quand aucune source disponible : ni `prixAchatNeuf` user, ni référentiel (catégorie non mappée ou marque inconnue), ni médiane Vinted.
→ UI affiche alerte ambre + champ libre prix de vente. Raisonnement Haiku non généré.

#### Médiane Vinted — stabilité
- Recherche multi-sources : **Vinted + Vestiaire Collective + Leboncoin** (pas de `allowed_domains`)
- Règle anti-aberrants dans le prompt : `> 3× le prix le plus fréquent` → exclus par Claude à la sélection
- Filtrage IQR côté code (double sécurité) puis médiane déterministe
- temperature=0 sur tous les appels de recherche

#### Interface prix
- **BLOC 1** : bannière confiance + ligne source + prix suggéré (gros) + raisonnement + grille ANALYSE MARCHÉ (médiane, fourchette, annonces, valeur neuf estimée) + champ "Prix d'achat neuf" avec bouton **Appliquer**
- **BLOC 2** : slider prix / champ libre (si noData) + tableau récap négociation + accordion "Plus de précisions" (plateforme, rareté, bouton Recalculer) + toggle revendeur (marge nette)
- Bouton **Appliquer** : recalcul local (`computePrice`) sans web search, reset slider au nouveau prix suggéré → synchronisation garantie entre gros chiffre et slider
- Jamais exposer formules/coefficients/pondérations/noms de segment techniques au user

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
- `sc(path, cb)` — navigue le dropdown Catégorie jusqu'à 5 niveaux via `input[name="category"]`
  - Reçoit le chemin de navigation FR exact (ex: `"Femmes > Vêtements > Manteaux et vestes > Manteaux"`)
  - DOIT s'exécuter EN PREMIER : Vinted n'affiche Marque/Taille/État/Couleur/Matériau qu'après sélection catégorie
- `fb(brand, cb)` — dropdown Marque via `input[name="brand"]` + `input[name="brand-search-input"]`
  - Null-check obligatoire : `input[name="brand"]` absent pour catégories non-vêtements (Électronique, Maison)
- `fs(v, cb)` — dropdown Taille via `[role="checkbox"][aria-label="VALEUR"]`
- `fd(name, v, cb)` — dropdown générique via `input[name]` + `[class*="Cell__clickable"]`
- Ordre de remplissage : titre → description → prix → catégorie (sc) → marque (fb) → taille (fs) → état → couleur 1 → couleur 2 → matériau

#### Chemins de catégorie et langue
- Le champ `vintedPath` dans `RecognitionResult` contient le chemin de navigation FR exact depuis `lib/vinted-navigation-taxonomy.ts`
- Format : `"N1 > N2 > N3"` ou `"N1 > N2 > N3 > N4"` selon profondeur
- Le prompt de reconnaissance (`app/api/recognize/route.ts`) reçoit `locale` et génère le chemin dans la langue de l'interface
- Le bookmarklet s'exécute sur la version Vinted de la langue choisie par l'utilisateur (vinted.fr, vinted.es, etc.)
- La correspondance langue ↔ chemin UI Vinted est assurée par le fait que le prompt génère des chemins dans la bonne langue

---

## Mannequin IA — Référence complète

Fichier descriptions : `lib/mannequin-descriptions.ts`
Fichiers images : `/public/mannequins/final/` — 3 poses par mannequin : `{id}.png` (face), `{id}-side.png` (3/4), `{id}-back.png` (dos)

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
- Le champ `vintedPath` de `RecognitionResult` = chemin exact copié depuis cette liste (en FR pour vinted.fr, traduit pour les autres versions)

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

## À faire — Prochaines sessions

### Étape Visuels
1. **Fond individuel par photo** — permettre un fond différent pour chaque slot (actuellement un fond commun par bloc). Architecture : `bgPerSlot: Record<number, number>` dans le state, mini-sélecteur au survol de chaque vignette.
2. **2ème photo produit = dos/profil** — modifier `handleGenerateProductPhoto` pour envoyer un prompt différent sur le 2ème appel (dos de l'article, ou profil si chaussure).
3. **Liseré bleu résiduel FASHN** — artifact tryon-max sur certaines photos. Ajouter dans le prompt : "seamless integration, no color fringe, no blue halo, clean edges"
4. **Tester le cycle complet FASHN** — crédits rechargés : tester tryon-max (mannequin) + product-to-model (produit) de bout en bout sur un vrai article.
5. **Email FASHN envoyé** — ajuster les réglages selon leur réponse.

### Étape Prix — Calibration (priorité après mise en ligne bêta)
6. **Calibration avec articles réels** — tester sur des articles dont le prix de vente réel est connu (vendu ou refus d'offre observé). Vérifier le biais haussier par segment : le prix suggéré est-il trop haut sur le standard/fast-fashion ? Trop bas sur le luxe_iconique ? Affiner les décotes et la pondération avec des données terrain.
7. **Cas "0 annonce" sur le luxe** — quand seul le référentiel est utilisé (neuf-décoté seul), vérifier le réalisme des prix obtenus. La décote peut être trop forte ou trop douce selon la catégorie.
8. **Resserrer le filtre Vinted selon état/défaut** — ex : article avec trou visible → ne comparer qu'aux annonces de même état ou état inférieur. Actuellement le filtre ±1 cran peut inclure des articles en meilleur état.
9. **Haiku sur les marques standard/fast-fashion** — surveiller que le raisonnement ne survend pas (ex : "très appréciée", "belle pièce" sur Zara/H&M). Le `segLabel` "marque grand public" peut amener des formulations trop laudatives — tempérer le prompt si observé au test.
10. **Catégories sport non-mode** — actuellement mappées sur `null` (médiane seule ou noData). Si volume significatif observé en bêta, créer des clés référentiel dédiées.

### Contenu
8. **Blog** — article "titre + description Vinted qui vendent" (appliquer les règles de l'étape Annonce).

### Avant mise en ligne (bloquants)

9. **Stockage mannequins** — `public/mannequins/` est gitignore (494 Mo). Migrer avant déploiement :
   - **Option A — Supabase Storage (recommandée)** : uploader les PNG sur un bucket public, modifier `generate-mannequin/route.ts` pour `fetch` l'URL Supabase au lieu de `readFileSync`
   - **Option B — Git LFS** : `git lfs track "app/public/mannequins/**/*.png"` + push
   - Status actuel : en local ✅ / GitHub ❌ (gitignoré) / Vercel ❌

10. **Supabase Auth** — inscription/connexion, gestion des quotas freemium par plan.
11. **Stripe** — checkout Premium + Pro.
12. **Déploiement Vercel** — après les 3 points ci-dessus.
