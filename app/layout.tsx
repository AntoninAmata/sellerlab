import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from './providers'
import CookieBanner from './components/CookieBanner'

/* ─── Polices ────────────────────────────────────────────────────────────── */

/* Police unique : Plus Jakarta Sans — 400 corps / 600 semi-bold / 800 titres */
const plusJakartaSans = Plus_Jakarta_Sans({
  variable: '--font-jakarta',
  subsets: ['latin'],
  weight: ['400', '600', '800'],
  display: 'swap',
})

/* ─── SEO metadata ───────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: 'SellerLab AI — Outil Vinted IA pour vendre plus vite',
  description:
    "SellerLab AI est l'outil Vinted IA qui optimise vos photos, calcule le prix idéal et génère vos annonces Vinted automatiquement en quelques secondes. Calculateur prix Vinted et annonce Vinted automatique. Essayez gratuitement.",
  keywords: [
    'outil Vinted IA',
    'calculateur prix Vinted',
    'annonce Vinted automatique',
    'optimiser annonce Vinted',
    'suppression fond photo Vinted',
    'IA pour Vinted',
    'SellerLab AI',
  ],
  openGraph: {
    title: 'SellerLab AI — Outil Vinted IA pour vendre plus vite',
    description:
      "Optimisez vos photos, calculez vos prix et générez vos annonces Vinted automatiquement grâce à l'IA.",
    type: 'website',
    locale: 'fr_FR',
    siteName: 'SellerLab AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SellerLab AI — Outil Vinted IA',
    description: "Suppression fond photo, calcul prix et annonce Vinted automatique en 10 secondes.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

/* ─── Layout racine ──────────────────────────────────────────────────────── */

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fr"
      className={`${plusJakartaSans.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-gray-900">
        <LanguageProvider>
          {children}
          <CookieBanner />
        </LanguageProvider>
      </body>
    </html>
  )
}
