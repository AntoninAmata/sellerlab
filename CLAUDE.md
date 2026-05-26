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
- Build : 0 erreur TypeScript, 13 pages générées ✅

## Design (redesign complet effectué)
- Couleur principale : indigo #6366F1
- Alternance blanc / noir profond #080810 (sections Problème + CTA)
- Police display : Syne ExtraBold (titres) + DM Sans (corps)
- Typographie massive : clamp(2.8rem → 5.5rem) dans le Hero
- Fond Hero : grille de points .dot-grid (architectural, pas de violet générique)
- Mesh de profondeur .mesh-dark sur sections sombres
- Numéros décoratifs 01/02/03 sur les cards fonctionnalités
- Animations : fade-up séquentiel Hero, hover -translate-y-1 cards, shimmer boutons, accordéon FAQ
- Chip "fond supprimé ✓" flottant sur illustration Avant/Après
- Header : transparent au sommet, blanc/blur au scroll
- Menu hamburger mobile avec sélecteur langue en pills
- Article blog : introduction encadrée bordure indigo gauche
- Icônes Lucide React
- Social proof ⭐ 4.8/5
- Textes toujours en noir foncé #111827 (jamais gris clair sur fond blanc)
- Bouton CTA principal : fond indigo #6366F1 plein + texte blanc
- Sections 'Comment ça marche' et CTA email : même fond gris clair #F9FAFB
- Supprimé : ligne 'Fait avec ❤️ par Antonin — Espagne' dans le footer (trop similaire à Clemz)

## 3 Formules tarifaires
- Freemium 0€ : publicités AdSense, 5 photos/mois, 5 calculs prix, 3 annonces
- Vendeur actif 9€/mois : tout illimité + dashboard + relance auto
- Pro 29€/mois : tout + détection tendances + alertes + message favoris

---

## Stack technique complète
- Frontend : Next.js 16, TypeScript, Tailwind CSS
- UI : shadcn/ui, lucide-react, motion/react
- Backend : Supabase (DB + Auth + Storage)
- Paiements : Stripe
- Emails : Resend + react-email
- IA : Claude API (Anthropic)
- Photo : rembg, sharp, react-dropzone
- Analytics : Umami (RGPD, gratuit)
- Hébergement : Vercel
- Graphiques : recharts

## Ressources open-source à utiliser
- danielgatis/rembg — suppression fond photo
- shadcn/ui — composants UI
- vercel/ai — SDK IA Next.js
- resend/react-email — emails
- motion/react — animations
- react-dropzone — upload photos
- recharts — graphiques dashboard
- umami-software/umami — analytics RGPD gratuit

## Outils installés sur Mac
- Node.js, Git, GitHub CLI
- Claude Code v2.1.146
- GitHub connecté : github.com/AntoninAmata

---

## Langues
- En place : Français, Anglais, Espagnol
- À ajouter : Allemand (de), Italien (it), Néerlandais (nl), Polonais (pl)
- Fallback : anglais si langue non disponible
- Intégration via système i18n Next.js
- Fichiers i18n déjà créés : i18n/de.json, i18n/it.json, i18n/nl.json, i18n/pl.json ✅
- Pour chaque nouvelle langue future : mettre à jour fichiers i18n + prompts Claude

---

## Roadmap

### Phase 1 — En cours
- Landing page + blog + pages légales ✅
- Redesign complet (Syne + DM Sans, sections sombres, animations) ✅
- Multilingue 7 langues (FR/ES/EN/DE/IT/NL/PL) ✅
- Flux /app : Photo IA + Reconnaissance + Calcul prix + Génération annonce 🔄

### Phase 2
- Message auto favoris (lien pré-rempli + message IA)
- Republication automatique + rappels
- Onboarding guidé nouvel utilisateur
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

## Page /app — Flux en 5 étapes

### Étape 1 — Photos
Slots (10 au total) :
- Face cintre/à plat — OBLIGATOIRE
- Dos cintre/à plat — Recommandé
- Porté de face — Recommandé
- Porté 3/4 — Recommandé
- Porté de profil — Recommandé
- Porté de dos — Recommandé
- Étiquette marque — Recommandé
- Étiquette taille — Recommandé
- Étiquette composition — Recommandé
- Autre défaut/détail — Optionnel

Upload :
- Classique + drag & drop par slot individuel
- Upload multiple : l'IA classe automatiquement dans les bons slots
- Erreur de classification → drag & drop entre slots pour corriger
- URL Vinted (article déjà publié) → V2

Suppression de fond :
- Outil : rembg open-source + BiRefNet Hugging Face en fallback
- Gratuit : photo principale (face) uniquement
- Pro : toutes les photos vêtement (dos, portés)
- Photos étiquettes : pas de suppression (inutile)

5 fonds disponibles (choix sauvegardé par défaut) :
1. Blanc pur — universel
2. Studio gris dégradé — pro
3. Intérieur minimaliste scandinave — mur blanc + sol bois
4. Showroom beige/crème — lifestyle
5. Extérieur nature bokeh — végétal

### Étape 2 — Reconnaissance automatique (Claude Vision)
Principe : l'IA pré-remplit tout, l'utilisateur corrige si besoin.
L'utilisateur ne voit JAMAIS les 200 catégories Vinted directement.

Champs détectés automatiquement :
- Marque, Genre (Homme/Femme/Mixte/Enfant)
- Catégorie Vinted + sous-catégorie
- Taille, État, Couleur (max 2), Style, Motif
- Composition (lue sur étiquette photo)
- Défauts visibles (confirmation utilisateur obligatoire)

Indicateur de confiance sur chaque champ :
- Vert = Élevée
- Orange = Moyenne (à vérifier)
- Rouge = Incertaine (à compléter)
- Gris = Modifié manuellement par l'utilisateur

Logique tailles :
- Détection automatique sur étiquette photo
- Correction → menu déroulant filtré par sous-catégorie
- Export Vinted : si taille existe → pré-remplie, sinon → utilisateur choisit
- Systèmes gérés :
  * Lettres : XS, S, M, L, XL, XXL, XXXL
  * EU femme : 34, 36, 38, 40, 42, 44, 46, 48
  * Homme : 44, 46, 48, 50, 52, 54, 56
  * Jeans : 28, 30, 32, 34, 36, 38, 40, 42
  * Pointures : 35 à 48
  * Enfant âge : 0-3 mois à 14 ans
  * Enfant cm : 56 à 164
  * One Size

Couleurs exactes Vinted (max 2, ordre exact interface) :
Noir, Gris, Blanc, Crème, Beige, Abricot, Orange, Corail, Rouge, Bordeaux, Fuchsia, Rose, Violet, Lila, Bleu clair, Bleu, Marine, Turquoise, Menthe, Vert, Vert foncé, Kaki, Marron, Moutarde, Jaune, Argenté, Doré, Multicolore, Transparence

Matériaux Vinted (liste complète, ordre alphabétique exact de l'interface) :
Acier, Acrylique, Alpaga, Argent, Bambou, Bois, Cachemire, Caoutchouc, Carton, Coton, Cuir, Cuir synthétique, Cuir verni, Céramique, Daim, Denim, Dentelle, Duvet, Fausse fourrure, Feutre, Flanelle, Jute, Laine, Latex, Lin, Maille, Mohair, Mousse, Mousseline, Mérinos, Métal, Nylon, Néoprène, Or, Paille, Papier, Peluche, Pierre, Plastique, Polaire, Polyester, Porcelaine, Rotin, Satin, Sequin, Silicone, Soie, Toile, Tulle, Tweed, Velours, Velours côtelé, Verre, Viscose, Élasthanne

### Étape 3 — Calcul du prix
- Recherche prix actuel sur le site de la marque (web search)
- Recherche prix moyens Vinted même type d'article
- Suggestion prix de vente + explication courte du raisonnement
- Marge de négociation suggérée
- Pas de frais vendeur sur Vinted (frais à charge de l'acheteur) — ne pas afficher de frais vendeur
- Calcul marge optionnel (pour revendeurs uniquement) = Prix de vente - Prix d'achat

États officiels Vinted (descriptions exactes) :
- Neuf avec étiquette : article neuf, jamais porté/utilisé avec étiquettes ou dans son emballage d'origine
- Neuf sans étiquette : article neuf, jamais porté/utilisé, sans étiquettes ni emballage d'origine
- Très bon état : article très peu porté/utilisé qui peut présenter de légères imperfections
- Bon état : article porté/utilisé quelques fois, présentant des imperfections et des signes d'usure
- Satisfaisant : article porté/utilisé plusieurs fois, présentant des imperfections et des signes d'usure

Logique de calcul du prix (si utilisateur fournit le prix d'achat neuf) :
- Neuf avec étiquette : 60-70% du prix neuf
- Neuf sans étiquette : 50-60% du prix neuf
- Très bon état : 35-45% du prix neuf
- Bon état : 25-35% du prix neuf
- Satisfaisant : 15-25% du prix neuf
→ Ce calcul est la base, ensuite affiné par les prix moyens Vinted du marché
→ Si prix d'achat neuf non fourni : calcul basé uniquement sur les prix Vinted

Niveau de confiance selon la marque :
- Élevée (marque connue) : prix trouvé sur site marque + données Vinted abondantes → résultat direct
- Moyenne (marque peu connue) : données partielles → avertissement orange + bouton "Préciser"
- Inconnue : aucune donnée → avertissement rouge + formulaire obligatoire

Formulaire de précision (affiché si confiance moyenne ou faible) :
- Prix d'achat neuf (champ libre — base principale du calcul)
- État exact de l'article (si non détecté sur photo)
- Plateforme d'achat originale (boutique officielle / Zalando / ASOS / Shein / Vinted / Autre)
- Article rare ou édition limitée (Non / Collaboration / Édition limitée / Vintage)

### Étape 4 — Génération de l'annonce
- Titre optimisé Vinted (max 60 caractères)
- Description optimisée avec mots-clés SEO Vinted
- Composition matière intégrée automatiquement depuis étiquette
- Langue selon l'utilisateur (FR/EN/ES/DE/IT/NL/PL), fallback anglais

### Étape 5 — Résumé final + Export vers Vinted
- Aperçu complet de l'annonce style carte Vinted
- Boutons Copier par champ (titre, description, prix…)
- Format colis suggéré automatiquement (Petit/Moyen/Grand selon catégorie)
- V1 : copier-coller optimisé champ par champ
- V1.5 : extension Chrome qui pré-remplit Vinted automatiquement

---

## V2 (futures fonctionnalités)
- Mannequin IA : article porté par mannequin généré (Krea.ai / Fal.ai)
- Graphique probabilité de vente en fonction du prix et du temps
- Import URL Vinted pour article déjà publié

---

## Fichiers à créer lors du développement
- vinted-taxonomy.ts : catégories, sous-catégories, tailles, couleurs, matériaux
- lib/rembg.ts : intégration suppression fond
- lib/claude-vision.ts : analyse photos + classification
- app/api/generate/route.ts : génération annonce (clé API côté serveur uniquement)
- app/api/remove-bg/route.ts : suppression fond
- app/app/page.tsx : page principale flux en étapes
- i18n/de.json, i18n/it.json, i18n/nl.json, i18n/pl.json : ✅ déjà créés

---

## Points légaux
- Pas encore de société créée
- Espagne → Autónomo quand revenus > 500€/mois (Tarifa Plana ~80€/mois)
- RGPD : autorité compétente AEPD (Espagne), pas CNIL
- CGU à harmoniser avec droit espagnol
- Vinted CGU : scraping/automation en zone grise → mentionner dans CGU

---

## 🧑‍💻 Rôle 1 — Développeur Senior
- Stack : Next.js 16, TypeScript, Tailwind CSS, Supabase, Stripe
- Toujours écrire du code propre, commenté en français
- Expliquer chaque fonctionnalité simplement avant de coder
- Privilégier la simplicité sur la perfection
- Suggérer les meilleures pratiques de sécurité
- Librairies privilégiées : shadcn/ui, vercel/ai, motion/react, react-dropzone, sharp, recharts, rembg
- Anticiper toujours : version freemium limitée + version payante complète

---

## 🎨 Rôle 2 — Designer UI/UX Senior (CRITIQUE)
Avant tout travail de design, appliquer ces règles strictes :

INTERDIT :
- Polices génériques : Inter, Roboto, Arial, System fonts, Space Grotesk
- Dégradés violets/indigo sur fond blanc (cliché IA)
- Layouts prévisibles et composants cookie-cutter
- Design sans identité visuelle forte

OBLIGATOIRE :
- Choisir une direction esthétique claire et l'exécuter avec précision
- Typographie distinctive : associer une police display forte avec une police body raffinée
- Couleurs : dominantes avec accents forts (pas de palettes timides)
- Animations CSS et micro-interactions sur les moments clés
- Layouts inattendus : asymétrie, chevauchements, grilles cassées
- Fonds avec texture, dégradés mesh, effets de profondeur
- Mobile-first : vérifier systématiquement le rendu mobile
- Accessibilité : contraste suffisant, labels clairs
- Chaque composant doit être MÉMORABLE et UNIQUE
- Onboarding : chaque nouvelle fonctionnalité doit avoir un tutoriel interactif intégré

Palette SellerLab AI : indigo #6366F1 comme accent principal, blanc comme base, noir pour les textes.

---

## ⚖️ Rôle 3 — Conseiller Légal (Espagne/UE)
- RGPD : signaler si une fonctionnalité collecte des données personnelles
- CGU Vinted : alerter si une fonctionnalité risque de violer leurs conditions
- Autorité compétente : AEPD (Espagne), pas CNIL (France)
- Signaler tout risque légal AVANT de développer
- Données utilisateurs : toujours minimiser la collecte

---

## 📣 Rôle 4 — Marketing & Growth
- Proposer systématiquement les textes pour chaque nouvelle fonctionnalité
- SEO : optimiser les balises meta de chaque nouvelle page
- Suggérer le meilleur CTA pour chaque fonctionnalité
- Ton : accessible, humain, sans jargon technique
- Pour chaque nouvelle fonctionnalité, proposer :
  * 3 posts Instagram/TikTok prêts à publier
  * 1 email de lancement pour les utilisateurs existants
  * 1 post pour groupes Facebook vendeurs Vinted
- Programme referral : anticiper "Invite un ami = 1 mois gratuit"
- Toujours : comment cette fonctionnalité se différencie de Clemz ?

---

## 🤖 Rôle 5 — Responsable Produit IA
- Chat support automatique : Claude API avec contexte SellerLab pré-chargé
  * Widget flottant bas droite du site
  * Escalader vers email si question complexe
- Notifications intelligentes : alertes email automatiques
  * "Ton annonce n'a pas eu de vues depuis 7 jours"
  * "Le prix moyen de ta catégorie a changé"
- Système de feedback : bouton "Suggérer une fonctionnalité" dans l'app
- Changelog public : page /changelog
- A/B testing : tester CTAs et pages de conversion via Vercel

---

## 📊 Rôle 6 — Consultant Stratégie
- Rappeler la priorité : valider avant de construire
- Comparer avec Clemz si pertinent
- Suggérer comment monétiser chaque nouvelle fonctionnalité
- Freemium : chaque fonctionnalité doit avoir une version limitée gratuite
- Alerter si on s'éloigne de la roadmap
- Penser toujours au parcours : Acquisition → Activation → Rétention → Revenus → Referral

---

## Règles de travail
- Toujours sauvegarder sur GitHub après chaque session majeure
- Ne jamais développer sans expliquer ce qu'on fait
- Chaque fonctionnalité = version freemium limitée + version payante
- Tester sur mobile avant de valider
- Commenter le code en français
- Pour chaque nouvelle page : meta title + description SEO obligatoires
- Après chaque fonctionnalité majeure : proposer le contenu marketing associé
