import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from './providers'
import CookieBanner from './components/CookieBanner'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

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
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} h-full scroll-smooth antialiased`}
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
