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
- Backend : Supabase (DB + Auth + Storage)
- Paiements : Stripe
- Emails : Resend + react-email
- IA : Claude API — claude-sonnet-4-20250514 pour vision et génération
- Suppression fond : @imgly/background-removal (WebAssembly côté client, gratuit, privé)
- Analytics : Umami (RGPD, gratuit)
- Hébergement : Vercel

## Variables d'environnement (.env.local)
- ANTHROPIC_API_KEY ✅ configurée
- HUGGINGFACE_API_KEY ✅ configurée (pour classification photos)

---

## Langues — 7 langues ✅
- FR, EN, ES, DE, IT, NL, PL — toutes en place
- Fichiers i18n créés pour toutes les langues ✅
- Fallback : anglais si langue non disponible
- RÈGLE : tout développement doit être appliqué dans les 7 langues

---

## 3 Formules tarifaires
- Freemium 0€ : publicités AdSense, 5 photos/mois, 5 calculs prix, 3 annonces
- Vendeur actif 9€/mois : tout illimité + dashboard + relance auto
- Pro 29€/mois : tout + détection tendances + alertes + message favoris

---

## Page /app — Flux en 5 étapes

### Étape 1 — Photos ✅ Construite

Slots (10 au total) :
- Slot 0 : 'Photo recto (cintre/à plat)' — OBLIGATOIRE — suppression fond gratuite
- Slot 1 : 'Photo verso (cintre/à plat)' — Recommandé — suppression fond Pro
- Slot 2 : Porté de face — Recommandé — suppression fond Pro
- Slot 3 : Porté 3/4 — Recommandé — suppression fond Pro
- Slot 4 : Porté de profil — Recommandé — suppression fond Pro
- Slot 5 : Porté de dos — Recommandé — suppression fond Pro
- Slot 6 : Étiquette marque — Recommandé — PAS de suppression fond
- Slot 7 : Étiquette taille — Recommandé — PAS de suppression fond
- Slot 8 : Étiquette composition — Recommandé — PAS de suppression fond
- Slot 9 : Autre (défaut, détail) — Optionnel — PAS de suppression fond

Upload :
- Classique + drag & drop par slot individuel
- Upload multiple : l'IA classe automatiquement (Claude Haiku Vision)
- Drag & drop entre slots pour corriger classification
- Slot 0 : classification uniquement photos non portées (cintre/à plat)
- Photos portées → slots 2-5 uniquement

Suppression de fond :
- @imgly/background-removal (WebAssembly côté client)
- Gratuit : slot 0 uniquement
- Pro : slots 1-5
- Pas de suppression fond : slots 6-9

5 fonds disponibles (choix sauvegardé localStorage) :
1. Blanc pur
2. Studio gris dégradé
3. Intérieur minimaliste scandinave (Unsplash, remplacé par image IA en prod)
4. Showroom beige/crème (Unsplash, remplacé par image IA en prod)
5. Extérieur nature bokeh (Unsplash, remplacé par image IA en prod)

Fichiers :
- app/app/page.tsx — stepper 5 étapes
- app/app/types.ts — types PhotoSlot, SlotStatus
- app/app/components/PhotoUploadStep.tsx
- app/api/remove-bg/route.ts
- app/api/classify-photos/route.ts

### Étape 2 — Reconnaissance automatique ✅ Construite

Claude Vision (claude-sonnet-4-20250514) analyse les photos et pré-remplit le formulaire.
L'utilisateur ne voit JAMAIS les 200 catégories Vinted directement.

Champs détectés automatiquement :
- Marque
- Genre (Homme/Femme/Mixte/Enfant)
- Catégorie Vinted + sous-catégorie (depuis vinted-taxonomy.ts)
- Taille (détection auto sur étiquette, menu filtré par sous-catégorie si correction)
- État (5 états officiels Vinted avec descriptions exactes)
- Couleur (max 2, liste exacte 29 couleurs Vinted)
- Matière (liste exacte 55 matériaux Vinted)
- Style, Motif
- Défauts visibles (confirmation utilisateur obligatoire)

Indicateur de confiance :
- Vert = Élevée
- Orange = Moyenne (à vérifier)
- Rouge = Incertaine (à compléter)
- Gris = Modifié manuellement

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

Systèmes de tailles :
- Lettres : XS, S, M, L, XL, XXL, XXXL
- EU femme : 34, 36, 38, 40, 42, 44, 46, 48
- Homme : 44, 46, 48, 50, 52, 54, 56
- Jeans : 28, 30, 32, 34, 36, 38, 40, 42
- Pointures : 35 à 48
- Enfant âge : 0-3 mois à 14 ans
- Enfant cm : 56 à 164
- One Size

Fichiers :
- lib/vinted-taxonomy.ts ✅
- app/api/recognize/route.ts ✅
- app/app/components/RecognitionStep.tsx ✅

### Étape 3 — Génération de l'annonce ✅ Construite
(Annonce avant Prix — décision finale)

- Titre optimisé Vinted max 60 caractères — éditable directement
- Description courte par défaut (4-5 lignes) + bouton "Version détaillée"
- Bilingue : langue native de l'utilisateur + anglais automatique
- JAMAIS d'information incertaine dans la description
- Bloc "Informations manquantes" conditionnel — affiché UNIQUEMENT si l'IA a un doute
- Mots-clés SEO : intégrés dans description + tags séparés + ajout libre utilisateur
- Dimensions optionnelles : système libre (suggestions + mesure personnalisée)
- Bouton "Régénérer" pour une nouvelle version
- Langue : FR/EN/ES/DE/IT/NL/PL + fallback anglais

Fichiers :
- app/api/generate/route.ts ✅
- app/app/components/AnnonceStep.tsx ✅

### Étape 4 — Calcul du prix ✅ Construite
(Prix après Annonce — décision finale)

- Pas de frais vendeur Vinted (frais à charge de l'acheteur)
- Calcul marge OPTIONNEL — uniquement pour revendeurs

Niveau de confiance selon la marque :
- Élevée : résultat direct, pas de question
- Moyenne : avertissement orange + bouton "Préciser"
- Inconnue : avertissement rouge + formulaire obligatoire

Logique calcul (si prix d'achat neuf fourni — champ principal) :
- Neuf avec étiquette : 65% du prix neuf
- Neuf sans étiquette : 55% du prix neuf
- Très bon état : 40% du prix neuf
- Bon état : 30% du prix neuf
- Satisfaisant : 20% du prix neuf
→ Affiné ensuite par prix moyens Vinted

Formulaire de précision (confiance moyenne/faible) :
- Prix d'achat neuf (CHAMP PRINCIPAL)
- État exact (5 états officiels Vinted)
- Plateforme d'achat originale
- Article rare ou édition limitée

Slider prix final :
- Frise colorée verte→orange→rouge
- Délai estimé dynamique (~2-3 jours à +4 mois)
- Conseil contextuel selon position slider
- Marge de négociation : slider prix minimum à accepter

Fichiers :
- app/api/price/route.ts ✅
- app/app/components/PricingStep.tsx ✅

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
  3. Description (switch FR/EN + Copier → coche auto)
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
- app/app/components/ExportStep.tsx ✅

---

## Roadmap

### Phase 1 — En cours
- Landing page + blog + pages légales ✅
- Redesign complet ✅
- Multilingue 7 langues ✅
- Flux /app 5 étapes construites ✅ — corrections à faire 🔄

## Corrections à faire sur /app (prochaine session)

### Étape 2 — Reconnaissance (corrections)
- Indicateur de confiance : ne pas afficher "confiance élevée" si le champ est vide — afficher "non détecté" à la place
- Revoir les champs vides qui affichent quand même un badge de confiance

### Étape 3 — Annonce (corrections)
- Description bilingue : générer EN PLUS de la langue native, une version anglaise — onglets FR / EN comme prototypé
- Aérer le bloc description — moins compact, plus lisible
- Ajouter les mots-clés SEO en tags séparés sous la description (cliquables + ajout libre)
- Bouton "Version détaillée" pour déployer une description plus longue

### Étape 4 — Prix (corrections)
- Ajouter en bas le slider de prix final avec frise colorée verte→orange→rouge
- Délai de vente estimé dynamique (~2-3 jours à +4 mois) qui change avec le slider
- Conseil contextuel selon position du slider
- Afficher le nombre d'annonces Vinted trouvées pour ce type d'article
- Afficher la fourchette de prix observée sur Vinted (min — max)
- Afficher le délai de vente estimé dans les sources

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
- Mannequin IA (Krea.ai / Fal.ai)
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
