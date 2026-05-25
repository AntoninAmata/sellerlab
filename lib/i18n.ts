export type Lang = 'fr' | 'es' | 'en' | 'it' | 'de' | 'pl' | 'nl'

export interface Plan {
  name: string
  price: string
  period: string
  badge: string | null
  features: string[]
  cta: string
  highlight: boolean
}

export interface Translations {
  nav: { features: string; pricing: string; faq: string; cta: string; blog: string; about: string; contact: string }
  hero: { badge: string; h1a: string; h1b: string; subtitle: string; cta1: string; cta2: string }
  ui: { before: string; after: string; illustrationCaption: string }
  socialProof: string
  problem: { h2: string; subtitle: string; cards: { title: string; desc: string }[] }
  features: { h2: string; items: { title: string; desc: string }[] }
  howItWorks: { h2: string; steps: { num: string; title: string; desc: string }[] }
  pricing: { h2: string; plans: Plan[] }
  faq: { h2: string; items: { q: string; a: string }[] }
  latestPosts: { h2: string; cta: string }
  finalCta: { h2: string; subtitle: string; cta: string }
  footer: { copyright: string; links: { label: string; href: string }[] }
}

// ─── Français ────────────────────────────────────────────────────────────────

const fr: Translations = {
  nav: {
    features: 'Fonctionnalités',
    pricing: 'Tarifs',
    faq: 'FAQ',
    cta: 'Commencer gratuitement',
    blog: 'Blog',
    about: 'À propos',
    contact: 'Contact',
  },
  hero: {
    badge: "Propulsé par l'IA",
    h1a: 'Vendez plus.',
    h1b: 'Travaillez moins.',
    subtitle:
      "SellerLab AI optimise vos photos, calcule vos prix et rédige vos annonces Vinted en quelques secondes.",
    cta1: 'Essayer gratuitement',
    cta2: 'Voir comment ça marche',
  },
  ui: {
    before: 'Avant',
    after: 'Après ✓',
    illustrationCaption: 'Fond supprimé automatiquement par SellerLab AI',
  },
  socialProof: "Rejoins les premiers vendeurs Vinted qui vendent plus vite grâce à l'IA",
  problem: {
    h2: "Vinted, c'est chronophage",
    subtitle: "Vous passez des heures sur vos annonces et les résultats ne sont pas là ?",
    cards: [
      {
        title: 'Mauvaises photos = pas de ventes',
        desc: "Un fond encombré ou une photo sombre fait fuir les acheteurs avant même qu'ils lisent votre annonce.",
      },
      {
        title: "Prix trop bas = perte d'argent",
        desc: "Sans référence de marché, on sous-estime souvent la valeur de ses articles et on laisse de l'argent sur la table.",
      },
      {
        title: 'Annonces vides = pas de clics',
        desc: "Une description bâclée n'attire personne. Les acheteurs scrollent sans s'arrêter sur vos articles.",
      },
    ],
  },
  features: {
    h2: "Tout ce qu'il faut pour vendre mieux",
    items: [
      {
        title: 'Photo IA',
        desc: "Supprimez le fond de vos photos en un clic et choisissez parmi des fonds professionnels pour mettre en valeur vos articles sur Vinted.",
      },
      {
        title: 'Calcul de prix intelligent',
        desc: "Notre calculateur de prix Vinted analyse le marché en temps réel et vous suggère le prix optimal pour maximiser vos ventes.",
      },
      {
        title: 'Annonce en 1 clic',
        desc: "L'IA génère automatiquement un titre accrocheur et une description complète pour chaque article. Annonce Vinted automatique en quelques secondes.",
      },
    ],
  },
  howItWorks: {
    h2: 'Comment ça marche',
    steps: [
      {
        num: '01',
        title: 'Upload ta photo',
        desc: "Prends une photo de ton article et importe-la sur SellerLab AI en quelques secondes.",
      },
      {
        num: '02',
        title: "L'IA analyse et optimise",
        desc: "Notre IA supprime le fond, calcule le prix idéal et rédige l'annonce automatiquement.",
      },
      {
        num: '03',
        title: 'Tu copies-colles sur Vinted',
        desc: "Copie le titre, la description et le prix, puis publie directement sur Vinted. C'est tout.",
      },
    ],
  },
  pricing: {
    h2: 'Des tarifs simples et transparents',
    plans: [
      {
        name: 'Freemium',
        price: '0€',
        period: 'gratuit pour toujours',
        badge: null,
        features: [
          '5 optimisations / mois',
          'Suppression de fond (5/mois)',
          'Calcul de prix basique',
          'Support communautaire',
        ],
        cta: 'Commencer gratuitement',
        highlight: false,
      },
      {
        name: 'Vendeur actif',
        price: '9€',
        period: '/mois',
        badge: 'Le plus populaire',
        features: [
          'Optimisations illimitées',
          'Suppression de fond illimitée',
          'Prix intelligent en temps réel',
          "Génération d'annonces IA",
          'Support par email',
        ],
        cta: 'Essayer 7 jours gratuits',
        highlight: true,
      },
      {
        name: 'Pro',
        price: '29€',
        period: '/mois',
        badge: null,
        features: [
          'Tout du plan Vendeur actif',
          'Gestion multi-comptes',
          'Analytics de vente avancées',
          'Export CSV',
          'Support prioritaire',
        ],
        cta: 'Contacter les ventes',
        highlight: false,
      },
    ],
  },
  faq: {
    h2: 'Questions fréquentes',
    items: [
      {
        q: 'Est-ce que SellerLab AI fonctionne avec Vinted ?',
        a: "Oui, SellerLab AI est conçu spécifiquement pour les vendeurs Vinted. Il analyse les tendances du marché Vinted et génère des annonces optimisées pour cette plateforme.",
      },
      {
        q: 'Comment SellerLab AI calcule-t-il le prix de mes articles sur Vinted ?',
        a: "Notre calculateur de prix Vinted analyse des milliers d'annonces similaires en temps réel. Il prend en compte la marque, l'état, la catégorie et la demande actuelle pour vous suggérer le prix optimal.",
      },
      {
        q: 'Mes données Vinted sont-elles sécurisées ?',
        a: "Absolument. SellerLab AI ne se connecte jamais à votre compte Vinted. Vous importez simplement vos photos et l'IA fait le reste. Vos données ne sont jamais partagées avec des tiers.",
      },
      {
        q: 'Combien de temps faut-il pour générer une annonce Vinted automatique ?',
        a: "Notre outil de génération d'annonces Vinted automatique produit un titre, une description et un calcul de prix en moins de 10 secondes. Il vous suffit de copier-coller le contenu directement dans Vinted.",
      },
      {
        q: 'SellerLab AI peut-il supprimer le fond de mes photos automatiquement ?',
        a: "Oui, c'est l'une de nos fonctionnalités phares. Notre IA supprime le fond de vos photos en un clic et vous propose des fonds professionnels pour rendre vos articles plus attractifs sur Vinted.",
      },
      {
        q: 'Quelle est la différence entre le plan Freemium et le plan Vendeur actif ?',
        a: "Le plan Freemium est gratuit pour toujours avec 5 optimisations par mois. Le plan Vendeur actif (9€/mois) offre des optimisations illimitées, le calculateur de prix Vinted en temps réel et la génération d'annonces IA sans restriction.",
      },
    ],
  },
  latestPosts: {
    h2: 'Derniers articles',
    cta: 'Voir tous les articles',
  },
  finalCta: {
    h2: 'Prêt à vendre plus ?',
    subtitle: "Rejoignez les premiers vendeurs Vinted à vendre grâce à l'IA.",
    cta: 'Commencer gratuitement',
  },
  footer: {
    copyright: '© 2026 SellerLab AI — Tous droits réservés',
    links: [
      { label: 'Blog', href: '/blog' },
      { label: 'À propos', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'CGU', href: '/cgu' },
      { label: 'Confidentialité', href: '/confidentialite' },
    ],
  },
}

// ─── English ─────────────────────────────────────────────────────────────────

const en: Translations = {
  nav: {
    features: 'Features',
    pricing: 'Pricing',
    faq: 'FAQ',
    cta: 'Get started free',
    blog: 'Blog',
    about: 'About',
    contact: 'Contact',
  },
  hero: {
    badge: 'Powered by AI',
    h1a: 'Sell more.',
    h1b: 'Work less.',
    subtitle:
      'SellerLab AI optimizes your photos, calculates your prices and writes your Vinted listings in seconds.',
    cta1: 'Try for free',
    cta2: 'See how it works',
  },
  ui: {
    before: 'Before',
    after: 'After ✓',
    illustrationCaption: 'Background automatically removed by SellerLab AI',
  },
  socialProof: 'Join the first Vinted sellers who sell faster with AI',
  problem: {
    h2: 'Vinted is time-consuming',
    subtitle: 'Spending hours on your listings with disappointing results?',
    cards: [
      {
        title: 'Bad photos = no sales',
        desc: 'A cluttered background or a dark photo drives buyers away before they even read your listing.',
      },
      {
        title: 'Prices too low = lost money',
        desc: 'Without market data, sellers often underestimate their items and leave money on the table.',
      },
      {
        title: 'Empty listings = no clicks',
        desc: 'A poor description attracts no one. Buyers scroll right past your items without stopping.',
      },
    ],
  },
  features: {
    h2: 'Everything you need to sell better',
    items: [
      {
        title: 'AI Photo',
        desc: 'Remove the background from your photos in one click and choose from professional backgrounds to showcase your Vinted items.',
      },
      {
        title: 'Smart price calculator',
        desc: 'Our Vinted price calculator analyzes the market in real time and suggests the optimal price to maximize your sales.',
      },
      {
        title: '1-click listing',
        desc: 'AI automatically generates a catchy title and a complete description for each item. Automatic Vinted listing in seconds.',
      },
    ],
  },
  howItWorks: {
    h2: 'How it works',
    steps: [
      {
        num: '01',
        title: 'Upload your photo',
        desc: 'Take a photo of your item and import it to SellerLab AI in seconds.',
      },
      {
        num: '02',
        title: 'AI analyzes and optimizes',
        desc: 'Our AI removes the background, calculates the ideal price and writes the listing automatically.',
      },
      {
        num: '03',
        title: 'Copy-paste to Vinted',
        desc: "Copy the title, description and price, then publish directly on Vinted. That's it.",
      },
    ],
  },
  pricing: {
    h2: 'Simple and transparent pricing',
    plans: [
      {
        name: 'Freemium',
        price: '€0',
        period: 'free forever',
        badge: null,
        features: [
          '5 optimizations / month',
          'Background removal (5/month)',
          'Basic price calculator',
          'Community support',
        ],
        cta: 'Get started free',
        highlight: false,
      },
      {
        name: 'Active Seller',
        price: '€9',
        period: '/month',
        badge: 'Most popular',
        features: [
          'Unlimited optimizations',
          'Unlimited background removal',
          'Real-time smart pricing',
          'AI listing generation',
          'Email support',
        ],
        cta: 'Try free for 7 days',
        highlight: true,
      },
      {
        name: 'Pro',
        price: '€29',
        period: '/month',
        badge: null,
        features: [
          'Everything in Active Seller',
          'Multi-account management',
          'Advanced sales analytics',
          'CSV export',
          'Priority support',
        ],
        cta: 'Contact sales',
        highlight: false,
      },
    ],
  },
  faq: {
    h2: 'Frequently asked questions',
    items: [
      {
        q: 'Does SellerLab AI work with Vinted?',
        a: 'Yes, SellerLab AI is built specifically for Vinted sellers. It analyzes Vinted market trends and generates listings optimized for the platform.',
      },
      {
        q: 'How does SellerLab AI calculate the price of my Vinted items?',
        a: 'Our Vinted price calculator analyzes thousands of similar listings in real time. It takes into account the brand, condition, category and current demand to suggest the optimal price.',
      },
      {
        q: 'Is my Vinted data secure?',
        a: 'Absolutely. SellerLab AI never connects to your Vinted account. You simply upload your photos and the AI does the rest. Your data is never shared with third parties.',
      },
      {
        q: 'How long does it take to generate an automatic Vinted listing?',
        a: 'Our automatic Vinted listing generator produces a title, description and price in under 10 seconds. Just copy and paste the content directly into Vinted.',
      },
      {
        q: 'Can SellerLab AI automatically remove the background from my photos?',
        a: "Yes, that's one of our flagship features. Our AI removes the background from your photos in one click and offers professional backgrounds to make your items more attractive on Vinted.",
      },
      {
        q: 'What is the difference between the Freemium and Active Seller plans?',
        a: 'The Freemium plan is free forever with 5 optimizations per month. The Active Seller plan (€9/month) offers unlimited optimizations, real-time Vinted price calculation and unrestricted AI listing generation.',
      },
    ],
  },
  latestPosts: {
    h2: 'Latest articles',
    cta: 'View all articles',
  },
  finalCta: {
    h2: 'Ready to sell more?',
    subtitle: 'Join the first Vinted sellers to sell faster with AI.',
    cta: 'Get started free',
  },
  footer: {
    copyright: '© 2026 SellerLab AI — All rights reserved',
    links: [
      { label: 'Blog', href: '/blog' },
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Terms', href: '/cgu' },
      { label: 'Privacy', href: '/confidentialite' },
    ],
  },
}

// ─── Español ─────────────────────────────────────────────────────────────────

const es: Translations = {
  nav: {
    features: 'Funcionalidades',
    pricing: 'Precios',
    faq: 'FAQ',
    cta: 'Empezar gratis',
    blog: 'Blog',
    about: 'Acerca de',
    contact: 'Contacto',
  },
  hero: {
    badge: 'Impulsado por IA',
    h1a: 'Vende más.',
    h1b: 'Trabaja menos.',
    subtitle:
      'SellerLab AI optimiza tus fotos, calcula tus precios y redacta tus anuncios de Vinted en segundos.',
    cta1: 'Probar gratis',
    cta2: 'Ver cómo funciona',
  },
  ui: {
    before: 'Antes',
    after: 'Después ✓',
    illustrationCaption: 'Fondo eliminado automáticamente por SellerLab AI',
  },
  socialProof: 'Únete a los primeros vendedores de Vinted que venden más rápido con IA',
  problem: {
    h2: 'Vinted consume mucho tiempo',
    subtitle: '¿Pasas horas en tus anuncios y los resultados no llegan?',
    cards: [
      {
        title: 'Malas fotos = sin ventas',
        desc: 'Un fondo desordenado o una foto oscura ahuyenta a los compradores antes de que lean tu anuncio.',
      },
      {
        title: 'Precio bajo = pérdida de dinero',
        desc: 'Sin referencias de mercado, solemos subestimar el valor de nuestros artículos y dejamos dinero sobre la mesa.',
      },
      {
        title: 'Anuncios vacíos = sin clics',
        desc: 'Una descripción pobre no atrae a nadie. Los compradores pasan de largo sin detenerse en tus artículos.',
      },
    ],
  },
  features: {
    h2: 'Todo lo que necesitas para vender mejor',
    items: [
      {
        title: 'Foto IA',
        desc: 'Elimina el fondo de tus fotos con un clic y elige entre fondos profesionales para destacar tus artículos en Vinted.',
      },
      {
        title: 'Calculadora de precio inteligente',
        desc: 'Nuestra calculadora de precios para Vinted analiza el mercado en tiempo real y te sugiere el precio óptimo para maximizar tus ventas.',
      },
      {
        title: 'Anuncio en 1 clic',
        desc: 'La IA genera automáticamente un título atractivo y una descripción completa para cada artículo. Anuncio de Vinted automático en segundos.',
      },
    ],
  },
  howItWorks: {
    h2: 'Cómo funciona',
    steps: [
      {
        num: '01',
        title: 'Sube tu foto',
        desc: 'Toma una foto de tu artículo e impórtala a SellerLab AI en segundos.',
      },
      {
        num: '02',
        title: 'La IA analiza y optimiza',
        desc: 'Nuestra IA elimina el fondo, calcula el precio ideal y redacta el anuncio automáticamente.',
      },
      {
        num: '03',
        title: 'Copias y pegas en Vinted',
        desc: 'Copia el título, la descripción y el precio, y publica directamente en Vinted. Eso es todo.',
      },
    ],
  },
  pricing: {
    h2: 'Precios simples y transparentes',
    plans: [
      {
        name: 'Freemium',
        price: '0€',
        period: 'gratis para siempre',
        badge: null,
        features: [
          '5 optimizaciones / mes',
          'Eliminación de fondo (5/mes)',
          'Calculadora de precio básica',
          'Soporte de la comunidad',
        ],
        cta: 'Empezar gratis',
        highlight: false,
      },
      {
        name: 'Vendedor activo',
        price: '9€',
        period: '/mes',
        badge: 'El más popular',
        features: [
          'Optimizaciones ilimitadas',
          'Eliminación de fondo ilimitada',
          'Precios inteligentes en tiempo real',
          'Generación de anuncios IA',
          'Soporte por email',
        ],
        cta: 'Probar 7 días gratis',
        highlight: true,
      },
      {
        name: 'Pro',
        price: '29€',
        period: '/mes',
        badge: null,
        features: [
          'Todo del plan Vendedor activo',
          'Gestión multi-cuenta',
          'Analíticas de ventas avanzadas',
          'Exportación CSV',
          'Soporte prioritario',
        ],
        cta: 'Contactar con ventas',
        highlight: false,
      },
    ],
  },
  faq: {
    h2: 'Preguntas frecuentes',
    items: [
      {
        q: '¿SellerLab AI funciona con Vinted?',
        a: 'Sí, SellerLab AI está diseñado específicamente para vendedores de Vinted. Analiza las tendencias del mercado de Vinted y genera anuncios optimizados para esta plataforma.',
      },
      {
        q: '¿Cómo calcula SellerLab AI el precio de mis artículos en Vinted?',
        a: 'Nuestra calculadora de precios para Vinted analiza miles de anuncios similares en tiempo real. Tiene en cuenta la marca, el estado, la categoría y la demanda actual para sugerirte el precio óptimo.',
      },
      {
        q: '¿Están seguros mis datos de Vinted?',
        a: 'Por supuesto. SellerLab AI nunca se conecta a tu cuenta de Vinted. Solo subes tus fotos y la IA hace el resto. Tus datos nunca se comparten con terceros.',
      },
      {
        q: '¿Cuánto tiempo se tarda en generar un anuncio automático de Vinted?',
        a: 'Nuestra herramienta de generación de anuncios automáticos para Vinted produce un título, una descripción y un cálculo de precio en menos de 10 segundos. Solo tienes que copiar y pegar el contenido directamente en Vinted.',
      },
      {
        q: '¿SellerLab AI puede eliminar el fondo de mis fotos automáticamente?',
        a: 'Sí, es una de nuestras funcionalidades estrella. Nuestra IA elimina el fondo de tus fotos con un clic y te ofrece fondos profesionales para hacer tus artículos más atractivos en Vinted.',
      },
      {
        q: '¿Cuál es la diferencia entre el plan Freemium y el plan Vendedor activo?',
        a: 'El plan Freemium es gratis para siempre con 5 optimizaciones al mes. El plan Vendedor activo (9€/mes) ofrece optimizaciones ilimitadas, la calculadora de precios de Vinted en tiempo real y la generación de anuncios IA sin restricciones.',
      },
    ],
  },
  latestPosts: {
    h2: 'Últimos artículos',
    cta: 'Ver todos los artículos',
  },
  finalCta: {
    h2: '¿Listo para vender más?',
    subtitle: 'Únete a los primeros vendedores de Vinted en vender gracias a la IA.',
    cta: 'Empezar gratis',
  },
  footer: {
    copyright: '© 2026 SellerLab AI — Todos los derechos reservados',
    links: [
      { label: 'Blog', href: '/blog' },
      { label: 'Acerca de', href: '/about' },
      { label: 'Contacto', href: '/contact' },
      { label: 'TyC', href: '/cgu' },
      { label: 'Privacidad', href: '/confidentialite' },
    ],
  },
}

// ─── Italiano ────────────────────────────────────────────────────────────────

const it: Translations = {
  nav: {
    features: 'Funzionalità',
    pricing: 'Prezzi',
    faq: 'FAQ',
    cta: 'Inizia gratis',
    blog: 'Blog',
    about: 'Chi siamo',
    contact: 'Contatti',
  },
  hero: {
    badge: "Alimentato dall'IA",
    h1a: 'Vendi di più.',
    h1b: 'Lavora meno.',
    subtitle: 'SellerLab AI ottimizza le tue foto, calcola i tuoi prezzi e scrive i tuoi annunci Vinted in pochi secondi.',
    cta1: 'Prova gratis',
    cta2: 'Scopri come funziona',
  },
  ui: {
    before: 'Prima',
    after: 'Dopo ✓',
    illustrationCaption: 'Sfondo rimosso automaticamente da SellerLab AI',
  },
  socialProof: "Unisciti ai primi venditori Vinted che vendono più velocemente con l'IA",
  problem: {
    h2: 'Vinted richiede troppo tempo',
    subtitle: 'Passi ore sugli annunci senza ottenere risultati?',
    cards: [
      { title: 'Foto scadenti = niente vendite', desc: "Uno sfondo disordinato o una foto scura spaventa gli acquirenti prima ancora che leggano l'annuncio." },
      { title: 'Prezzi troppo bassi = perdita di denaro', desc: 'Senza riferimenti di mercato, si tende a sottovalutare i propri articoli lasciando soldi sul tavolo.' },
      { title: 'Annunci vuoti = nessun clic', desc: 'Una descrizione scarsa non attira nessuno. Gli acquirenti scorrono senza fermarsi sui tuoi articoli.' },
    ],
  },
  features: {
    h2: 'Tutto ciò che serve per vendere meglio',
    items: [
      { title: 'Foto IA', desc: 'Rimuovi lo sfondo delle tue foto con un clic e scegli tra sfondi professionali per valorizzare i tuoi articoli su Vinted.' },
      { title: 'Calcolo prezzo intelligente', desc: 'Il nostro calcolatore di prezzi Vinted analizza il mercato in tempo reale e suggerisce il prezzo ottimale per massimizzare le vendite.' },
      { title: 'Annuncio in 1 clic', desc: "L'IA genera automaticamente un titolo accattivante e una descrizione completa per ogni articolo. Annuncio Vinted automatico in pochi secondi." },
    ],
  },
  howItWorks: {
    h2: 'Come funziona',
    steps: [
      { num: '01', title: 'Carica la foto', desc: 'Scatta una foto del tuo articolo e caricala su SellerLab AI in pochi secondi.' },
      { num: '02', title: "L'IA analizza e ottimizza", desc: "La nostra IA rimuove lo sfondo, calcola il prezzo ideale e scrive l'annuncio automaticamente." },
      { num: '03', title: 'Copia e incolla su Vinted', desc: 'Copia il titolo, la descrizione e il prezzo, poi pubblica direttamente su Vinted. Tutto qui.' },
    ],
  },
  pricing: {
    h2: 'Prezzi semplici e trasparenti',
    plans: [
      {
        name: 'Freemium', price: '0€', period: 'gratis per sempre', badge: null,
        features: ['5 ottimizzazioni / mese', 'Rimozione sfondo (5/mese)', 'Calcolo prezzo base', 'Supporto community'],
        cta: 'Inizia gratis', highlight: false,
      },
      {
        name: 'Venditore attivo', price: '9€', period: '/mese', badge: 'Il più popolare',
        features: ['Ottimizzazioni illimitate', 'Rimozione sfondo illimitata', 'Prezzi intelligenti in tempo reale', 'Generazione annunci IA', 'Supporto via email'],
        cta: 'Prova 7 giorni gratis', highlight: true,
      },
      {
        name: 'Pro', price: '29€', period: '/mese', badge: null,
        features: ['Tutto del piano Venditore attivo', 'Gestione multi-account', 'Analisi vendite avanzate', 'Esportazione CSV', 'Supporto prioritario'],
        cta: 'Contatta le vendite', highlight: false,
      },
    ],
  },
  faq: {
    h2: 'Domande frequenti',
    items: [
      { q: 'SellerLab AI funziona con Vinted?', a: "Sì, SellerLab AI è progettato specificamente per i venditori Vinted. Analizza le tendenze del mercato Vinted e genera annunci ottimizzati per questa piattaforma." },
      { q: 'Come calcola SellerLab AI il prezzo dei miei articoli su Vinted?', a: "Il nostro calcolatore analizza migliaia di annunci simili in tempo reale, tenendo conto di marca, condizioni, categoria e domanda attuale per suggerire il prezzo ottimale." },
      { q: 'I miei dati Vinted sono al sicuro?', a: "Assolutamente. SellerLab AI non si connette mai al tuo account Vinted. Carichi le tue foto e l'IA fa il resto. I tuoi dati non vengono mai condivisi con terzi." },
      { q: 'Quanto tempo occorre per generare un annuncio Vinted automatico?', a: "Il nostro strumento produce titolo, descrizione e calcolo del prezzo in meno di 10 secondi. Basta copiare e incollare il contenuto direttamente su Vinted." },
      { q: "SellerLab AI può rimuovere automaticamente lo sfondo dalle mie foto?", a: "Sì, è una delle nostre funzionalità principali. La nostra IA rimuove lo sfondo con un clic e propone sfondi professionali per rendere i tuoi articoli più attraenti su Vinted." },
      { q: 'Qual è la differenza tra il piano Freemium e il piano Venditore attivo?', a: "Il Freemium è gratuito per sempre con 5 ottimizzazioni al mese. Il piano Venditore attivo (9€/mese) offre ottimizzazioni illimitate, calcolo prezzi in tempo reale e generazione annunci IA senza limiti." },
    ],
  },
  latestPosts: { h2: 'Ultimi articoli', cta: 'Vedi tutti gli articoli' },
  finalCta: {
    h2: 'Pronto a vendere di più?',
    subtitle: "Unisciti ai primi venditori Vinted che vendono grazie all'IA.",
    cta: 'Inizia gratis',
  },
  footer: {
    copyright: '© 2026 SellerLab AI — Tutti i diritti riservati',
    links: [
      { label: 'Blog', href: '/blog' },
      { label: 'Chi siamo', href: '/about' },
      { label: 'Contatti', href: '/contact' },
      { label: 'CGU', href: '/cgu' },
      { label: 'Privacy', href: '/confidentialite' },
    ],
  },
}

// ─── Deutsch ─────────────────────────────────────────────────────────────────

const de: Translations = {
  nav: {
    features: 'Funktionen',
    pricing: 'Preise',
    faq: 'FAQ',
    cta: 'Kostenlos starten',
    blog: 'Blog',
    about: 'Über uns',
    contact: 'Kontakt',
  },
  hero: {
    badge: 'KI-gestützt',
    h1a: 'Mehr verkaufen.',
    h1b: 'Weniger arbeiten.',
    subtitle: 'SellerLab AI optimiert deine Fotos, berechnet deine Preise und schreibt deine Vinted-Anzeigen in Sekunden.',
    cta1: 'Kostenlos testen',
    cta2: "So funktioniert's",
  },
  ui: {
    before: 'Vorher',
    after: 'Nachher ✓',
    illustrationCaption: 'Hintergrund automatisch entfernt von SellerLab AI',
  },
  socialProof: 'Werde Teil der ersten Vinted-Verkäufer, die dank KI schneller verkaufen',
  problem: {
    h2: 'Vinted kostet zu viel Zeit',
    subtitle: 'Verbringst du Stunden mit deinen Anzeigen ohne Ergebnisse?',
    cards: [
      { title: 'Schlechte Fotos = keine Verkäufe', desc: 'Ein unordentlicher Hintergrund oder ein dunkles Foto schreckt Käufer ab, bevor sie deine Anzeige lesen.' },
      { title: 'Preise zu niedrig = Geldverlust', desc: 'Ohne Marktdaten unterschätzt man oft den Wert seiner Artikel und lässt Geld auf dem Tisch liegen.' },
      { title: 'Leere Anzeigen = keine Klicks', desc: 'Eine schlechte Beschreibung zieht niemanden an. Käufer scrollen an deinen Artikeln vorbei.' },
    ],
  },
  features: {
    h2: 'Alles, was du brauchst, um besser zu verkaufen',
    items: [
      { title: 'KI-Foto', desc: 'Entferne den Hintergrund deiner Fotos mit einem Klick und wähle aus professionellen Hintergründen für deine Vinted-Artikel.' },
      { title: 'Intelligente Preisberechnung', desc: 'Unser Vinted-Preisrechner analysiert den Markt in Echtzeit und schlägt den optimalen Preis vor, um deine Verkäufe zu maximieren.' },
      { title: '1-Klick-Anzeige', desc: 'Die KI generiert automatisch einen ansprechenden Titel und eine vollständige Beschreibung. Vinted-Anzeige automatisch in Sekunden.' },
    ],
  },
  howItWorks: {
    h2: "So funktioniert's",
    steps: [
      { num: '01', title: 'Foto hochladen', desc: 'Mache ein Foto von deinem Artikel und lade es in Sekunden bei SellerLab AI hoch.' },
      { num: '02', title: 'KI analysiert und optimiert', desc: 'Unsere KI entfernt den Hintergrund, berechnet den Idealpreis und schreibt die Anzeige automatisch.' },
      { num: '03', title: 'Kopieren und in Vinted einfügen', desc: "Kopiere Titel, Beschreibung und Preis, dann veröffentliche direkt auf Vinted. Das war's." },
    ],
  },
  pricing: {
    h2: 'Einfache und transparente Preise',
    plans: [
      {
        name: 'Freemium', price: '0€', period: 'kostenlos für immer', badge: null,
        features: ['5 Optimierungen / Monat', 'Hintergrundentfernung (5/Monat)', 'Einfache Preisberechnung', 'Community-Support'],
        cta: 'Kostenlos starten', highlight: false,
      },
      {
        name: 'Aktiver Verkäufer', price: '9€', period: '/Monat', badge: 'Am beliebtesten',
        features: ['Unbegrenzte Optimierungen', 'Unbegrenzte Hintergrundentfernung', 'Echtzeit-Intelligentpreise', 'KI-Anzeigengenerierung', 'E-Mail-Support'],
        cta: '7 Tage kostenlos testen', highlight: true,
      },
      {
        name: 'Pro', price: '29€', period: '/Monat', badge: null,
        features: ['Alles im Plan Aktiver Verkäufer', 'Multi-Konto-Verwaltung', 'Erweiterte Verkaufsanalysen', 'CSV-Export', 'Prioritätssupport'],
        cta: 'Vertrieb kontaktieren', highlight: false,
      },
    ],
  },
  faq: {
    h2: 'Häufig gestellte Fragen',
    items: [
      { q: 'Funktioniert SellerLab AI mit Vinted?', a: 'Ja, SellerLab AI wurde speziell für Vinted-Verkäufer entwickelt. Es analysiert Vinted-Markttrends und generiert optimierte Anzeigen für diese Plattform.' },
      { q: 'Wie berechnet SellerLab AI den Preis meiner Vinted-Artikel?', a: 'Unser Preisrechner analysiert tausende ähnlicher Anzeigen in Echtzeit. Er berücksichtigt Marke, Zustand, Kategorie und aktuelle Nachfrage, um den optimalen Preis vorzuschlagen.' },
      { q: 'Sind meine Vinted-Daten sicher?', a: 'Absolut. SellerLab AI verbindet sich niemals mit deinem Vinted-Konto. Du lädst deine Fotos hoch und die KI erledigt den Rest. Deine Daten werden niemals an Dritte weitergegeben.' },
      { q: 'Wie lange dauert es, eine automatische Vinted-Anzeige zu erstellen?', a: 'Unser automatischer Generator erstellt Titel, Beschreibung und Preiskalkulation in unter 10 Sekunden. Einfach den Inhalt kopieren und direkt in Vinted einfügen.' },
      { q: 'Kann SellerLab AI den Hintergrund meiner Fotos automatisch entfernen?', a: 'Ja, das ist eine unserer Hauptfunktionen. Unsere KI entfernt den Hintergrund mit einem Klick und bietet professionelle Hintergründe an, um deine Artikel attraktiver zu machen.' },
      { q: 'Was ist der Unterschied zwischen Freemium und Aktiver Verkäufer?', a: 'Der Freemium-Plan ist für immer kostenlos mit 5 Optimierungen pro Monat. Der Aktiver-Verkäufer-Plan (9€/Monat) bietet unbegrenzte Optimierungen, Echtzeit-Preisberechnung und KI-Anzeigengenerierung ohne Einschränkungen.' },
    ],
  },
  latestPosts: { h2: 'Neueste Artikel', cta: 'Alle Artikel anzeigen' },
  finalCta: {
    h2: 'Bereit, mehr zu verkaufen?',
    subtitle: 'Werde Teil der ersten Vinted-Verkäufer, die dank KI verkaufen.',
    cta: 'Kostenlos starten',
  },
  footer: {
    copyright: '© 2026 SellerLab AI — Alle Rechte vorbehalten',
    links: [
      { label: 'Blog', href: '/blog' },
      { label: 'Über uns', href: '/about' },
      { label: 'Kontakt', href: '/contact' },
      { label: 'AGB', href: '/cgu' },
      { label: 'Datenschutz', href: '/confidentialite' },
    ],
  },
}

// ─── Polski ───────────────────────────────────────────────────────────────────

const pl: Translations = {
  nav: {
    features: 'Funkcje',
    pricing: 'Cennik',
    faq: 'FAQ',
    cta: 'Zacznij za darmo',
    blog: 'Blog',
    about: 'O nas',
    contact: 'Kontakt',
  },
  hero: {
    badge: 'Napędzany przez AI',
    h1a: 'Sprzedaj więcej.',
    h1b: 'Pracuj mniej.',
    subtitle: 'SellerLab AI optymalizuje Twoje zdjęcia, oblicza ceny i pisze ogłoszenia Vinted w kilka sekund.',
    cta1: 'Wypróbuj za darmo',
    cta2: 'Jak to działa',
  },
  ui: {
    before: 'Przed',
    after: 'Po ✓',
    illustrationCaption: 'Tło automatycznie usunięte przez SellerLab AI',
  },
  socialProof: 'Dołącz do pierwszych sprzedawców Vinted, którzy sprzedają szybciej dzięki AI',
  problem: {
    h2: 'Vinted pochłania za dużo czasu',
    subtitle: 'Spędzasz godziny na ogłoszeniach bez rezultatów?',
    cards: [
      { title: 'Złe zdjęcia = brak sprzedaży', desc: 'Zagracone tło lub ciemne zdjęcie odstraszy kupujących zanim przeczytają Twoje ogłoszenie.' },
      { title: 'Zbyt niska cena = strata pieniędzy', desc: 'Bez odniesienia rynkowego często niedoszacowujemy wartości swoich przedmiotów i tracimy pieniądze.' },
      { title: 'Puste ogłoszenia = brak kliknięć', desc: 'Słaby opis nikogo nie przyciągnie. Kupujący przewijają bez zatrzymania się na Twoich przedmiotach.' },
    ],
  },
  features: {
    h2: 'Wszystko, czego potrzebujesz, aby sprzedawać lepiej',
    items: [
      { title: 'Zdjęcie AI', desc: 'Usuń tło ze zdjęć jednym kliknięciem i wybierz spośród profesjonalnych teł, aby zaprezentować swoje przedmioty na Vinted.' },
      { title: 'Inteligentny kalkulator cen', desc: 'Nasz kalkulator cen Vinted analizuje rynek w czasie rzeczywistym i sugeruje optymalną cenę, aby zmaksymalizować Twoje sprzedaże.' },
      { title: 'Ogłoszenie jednym kliknięciem', desc: 'AI automatycznie generuje chwytliwy tytuł i pełny opis dla każdego przedmiotu. Automatyczne ogłoszenie Vinted w kilka sekund.' },
    ],
  },
  howItWorks: {
    h2: 'Jak to działa',
    steps: [
      { num: '01', title: 'Prześlij zdjęcie', desc: 'Zrób zdjęcie swojego przedmiotu i prześlij je do SellerLab AI w kilka sekund.' },
      { num: '02', title: 'AI analizuje i optymalizuje', desc: 'Nasza AI usuwa tło, oblicza idealną cenę i automatycznie pisze ogłoszenie.' },
      { num: '03', title: 'Skopiuj i wklej do Vinted', desc: 'Skopiuj tytuł, opis i cenę, a następnie opublikuj bezpośrednio na Vinted. To wszystko.' },
    ],
  },
  pricing: {
    h2: 'Proste i przejrzyste ceny',
    plans: [
      {
        name: 'Freemium', price: '0€', period: 'za darmo na zawsze', badge: null,
        features: ['5 optymalizacji / miesiąc', 'Usuwanie tła (5/miesiąc)', 'Podstawowy kalkulator cen', 'Wsparcie społeczności'],
        cta: 'Zacznij za darmo', highlight: false,
      },
      {
        name: 'Aktywny sprzedawca', price: '9€', period: '/miesiąc', badge: 'Najpopularniejszy',
        features: ['Nieograniczone optymalizacje', 'Nieograniczone usuwanie tła', 'Inteligentne ceny w czasie rzeczywistym', 'Generowanie ogłoszeń AI', 'Wsparcie e-mail'],
        cta: 'Wypróbuj 7 dni za darmo', highlight: true,
      },
      {
        name: 'Pro', price: '29€', period: '/miesiąc', badge: null,
        features: ['Wszystko z planu Aktywny sprzedawca', 'Zarządzanie wieloma kontami', 'Zaawansowana analityka sprzedaży', 'Eksport CSV', 'Wsparcie priorytetowe'],
        cta: 'Skontaktuj się ze sprzedażą', highlight: false,
      },
    ],
  },
  faq: {
    h2: 'Często zadawane pytania',
    items: [
      { q: 'Czy SellerLab AI działa z Vinted?', a: 'Tak, SellerLab AI jest zaprojektowany specjalnie dla sprzedawców Vinted. Analizuje trendy rynkowe Vinted i generuje ogłoszenia zoptymalizowane dla tej platformy.' },
      { q: 'Jak SellerLab AI oblicza cenę moich przedmiotów na Vinted?', a: 'Nasz kalkulator analizuje tysiące podobnych ogłoszeń w czasie rzeczywistym. Bierze pod uwagę markę, stan, kategorię i bieżący popyt, aby zaproponować optymalną cenę.' },
      { q: 'Czy moje dane Vinted są bezpieczne?', a: 'Absolutnie. SellerLab AI nigdy nie łączy się z Twoim kontem Vinted. Po prostu przesyłasz zdjęcia, a AI robi resztę. Twoje dane nigdy nie są udostępniane osobom trzecim.' },
      { q: 'Jak długo trwa wygenerowanie automatycznego ogłoszenia Vinted?', a: 'Nasz generator tworzy tytuł, opis i obliczenie ceny w mniej niż 10 sekund. Wystarczy skopiować treść i wkleić bezpośrednio do Vinted.' },
      { q: 'Czy SellerLab AI może automatycznie usunąć tło z moich zdjęć?', a: 'Tak, to jedna z naszych flagowych funkcji. Nasza AI usuwa tło jednym kliknięciem i proponuje profesjonalne tła, aby Twoje przedmioty były bardziej atrakcyjne na Vinted.' },
      { q: 'Jaka jest różnica między planem Freemium a Aktywny sprzedawca?', a: 'Plan Freemium jest bezpłatny na zawsze z 5 optymalizacjami miesięcznie. Plan Aktywny sprzedawca (9€/miesiąc) oferuje nieograniczone optymalizacje, kalkulator cen w czasie rzeczywistym i generowanie ogłoszeń AI bez ograniczeń.' },
    ],
  },
  latestPosts: { h2: 'Najnowsze artykuły', cta: 'Zobacz wszystkie artykuły' },
  finalCta: {
    h2: 'Gotowy sprzedawać więcej?',
    subtitle: 'Dołącz do pierwszych sprzedawców Vinted, którzy sprzedają dzięki AI.',
    cta: 'Zacznij za darmo',
  },
  footer: {
    copyright: '© 2026 SellerLab AI — Wszelkie prawa zastrzeżone',
    links: [
      { label: 'Blog', href: '/blog' },
      { label: 'O nas', href: '/about' },
      { label: 'Kontakt', href: '/contact' },
      { label: 'Regulamin', href: '/cgu' },
      { label: 'Prywatność', href: '/confidentialite' },
    ],
  },
}

// ─── Nederlands ──────────────────────────────────────────────────────────────

const nl: Translations = {
  nav: {
    features: 'Functies',
    pricing: 'Prijzen',
    faq: 'FAQ',
    cta: 'Gratis starten',
    blog: 'Blog',
    about: 'Over ons',
    contact: 'Contact',
  },
  hero: {
    badge: 'Aangedreven door AI',
    h1a: 'Meer verkopen.',
    h1b: 'Minder werken.',
    subtitle: "SellerLab AI optimaliseert je foto's, berekent je prijzen en schrijft je Vinted-advertenties in seconden.",
    cta1: 'Gratis proberen',
    cta2: 'Zie hoe het werkt',
  },
  ui: {
    before: 'Voor',
    after: 'Na ✓',
    illustrationCaption: 'Achtergrond automatisch verwijderd door SellerLab AI',
  },
  socialProof: 'Sluit je aan bij de eerste Vinted-verkopers die sneller verkopen dankzij AI',
  problem: {
    h2: 'Vinted kost te veel tijd',
    subtitle: 'Besteed je uren aan advertenties zonder resultaat?',
    cards: [
      { title: "Slechte foto's = geen verkoop", desc: 'Een rommelige achtergrond of een donkere foto schrikt kopers af voordat ze je advertentie lezen.' },
      { title: 'Prijs te laag = geldverlies', desc: 'Zonder marktgegevens onderschatten verkopers vaak de waarde van hun artikelen en laten geld liggen.' },
      { title: 'Lege advertenties = geen klikken', desc: 'Een slechte beschrijving trekt niemand aan. Kopers scrollen langs je artikelen zonder te stoppen.' },
    ],
  },
  features: {
    h2: 'Alles wat je nodig hebt om beter te verkopen',
    items: [
      { title: 'AI Foto', desc: "Verwijder de achtergrond van je foto's met één klik en kies uit professionele achtergronden om je Vinted-artikelen te presenteren." },
      { title: 'Slimme prijscalculator', desc: 'Onze Vinted-prijscalculator analyseert de markt in realtime en stelt de optimale prijs voor om je verkoop te maximaliseren.' },
      { title: '1-klik advertentie', desc: 'AI genereert automatisch een pakkende titel en volledige beschrijving voor elk artikel. Automatische Vinted-advertentie in seconden.' },
    ],
  },
  howItWorks: {
    h2: 'Hoe het werkt',
    steps: [
      { num: '01', title: 'Foto uploaden', desc: 'Maak een foto van je artikel en upload het in seconden naar SellerLab AI.' },
      { num: '02', title: 'AI analyseert en optimaliseert', desc: 'Onze AI verwijdert de achtergrond, berekent de ideale prijs en schrijft de advertentie automatisch.' },
      { num: '03', title: 'Kopiëren en plakken in Vinted', desc: 'Kopieer de titel, beschrijving en prijs, en publiceer direct op Vinted. Dat is het.' },
    ],
  },
  pricing: {
    h2: 'Eenvoudige en transparante prijzen',
    plans: [
      {
        name: 'Freemium', price: '0€', period: 'voor altijd gratis', badge: null,
        features: ['5 optimalisaties / maand', 'Achtergrondverwijdering (5/maand)', 'Eenvoudige prijscalculator', 'Community-ondersteuning'],
        cta: 'Gratis starten', highlight: false,
      },
      {
        name: 'Actieve verkoper', price: '9€', period: '/maand', badge: 'Meest populair',
        features: ['Onbeperkte optimalisaties', 'Onbeperkte achtergrondverwijdering', 'Realtime slimme prijzen', 'AI-advertentiegeneratie', 'E-mailondersteuning'],
        cta: '7 dagen gratis proberen', highlight: true,
      },
      {
        name: 'Pro', price: '29€', period: '/maand', badge: null,
        features: ['Alles in Actieve verkoper', 'Multi-accountbeheer', 'Geavanceerde verkoopanalyse', 'CSV-export', 'Prioriteitsondersteuning'],
        cta: 'Contact verkoop', highlight: false,
      },
    ],
  },
  faq: {
    h2: 'Veelgestelde vragen',
    items: [
      { q: 'Werkt SellerLab AI met Vinted?', a: 'Ja, SellerLab AI is speciaal gebouwd voor Vinted-verkopers. Het analyseert Vinted-markttrends en genereert geoptimaliseerde advertenties voor dit platform.' },
      { q: 'Hoe berekent SellerLab AI de prijs van mijn Vinted-artikelen?', a: 'Onze calculator analyseert duizenden vergelijkbare advertenties in realtime. Hij houdt rekening met merk, staat, categorie en huidige vraag om de optimale prijs voor te stellen.' },
      { q: "Zijn mijn Vinted-gegevens veilig?", a: "Absoluut. SellerLab AI verbindt nooit met je Vinted-account. Je uploadt je foto's en de AI doet de rest. Je gegevens worden nooit gedeeld met derden." },
      { q: 'Hoe lang duurt het om een automatische Vinted-advertentie te genereren?', a: 'Onze generator produceert een titel, beschrijving en prijsberekening in minder dan 10 seconden. Kopieer de inhoud gewoon direct in Vinted.' },
      { q: "Kan SellerLab AI de achtergrond van mijn foto's automatisch verwijderen?", a: 'Ja, dat is een van onze kernfuncties. Onze AI verwijdert de achtergrond met één klik en biedt professionele achtergronden aan om je artikelen aantrekkelijker te maken op Vinted.' },
      { q: 'Wat is het verschil tussen Freemium en Actieve verkoper?', a: 'Het Freemium-plan is voor altijd gratis met 5 optimalisaties per maand. Het Actieve-verkoper-plan (9€/maand) biedt onbeperkte optimalisaties, realtime Vinted-prijsberekening en AI-advertentiegeneratie zonder beperkingen.' },
    ],
  },
  latestPosts: { h2: 'Laatste artikelen', cta: 'Bekijk alle artikelen' },
  finalCta: {
    h2: 'Klaar om meer te verkopen?',
    subtitle: 'Sluit je aan bij de eerste Vinted-verkopers die verkopen dankzij AI.',
    cta: 'Gratis starten',
  },
  footer: {
    copyright: '© 2026 SellerLab AI — Alle rechten voorbehouden',
    links: [
      { label: 'Blog', href: '/blog' },
      { label: 'Over ons', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Voorwaarden', href: '/cgu' },
      { label: 'Privacy', href: '/confidentialite' },
    ],
  },
}

export const translations: Record<Lang, Translations> = { fr, en, es, it, de, pl, nl }
