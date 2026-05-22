export type Lang = 'fr' | 'es' | 'en'

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

export const translations: Record<Lang, Translations> = { fr, en, es }
