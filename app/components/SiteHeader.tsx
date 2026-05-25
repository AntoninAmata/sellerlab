'use client'

import Link from 'next/link'
import { useLang } from '@/app/providers'
import { translations, type Lang } from '@/lib/i18n'

const LANGS: { code: Lang; label: string }[] = [
  { code: 'fr', label: 'FR' },
  { code: 'en', label: 'EN' },
  { code: 'es', label: 'ES' },
  { code: 'it', label: 'IT' },
  { code: 'de', label: 'DE' },
  { code: 'pl', label: 'PL' },
  { code: 'nl', label: 'NL' },
]

export default function SiteHeader() {
  const { lang, setLang } = useLang()
  const t = translations[lang]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="font-bold text-lg text-gray-900">SellerLab</span>
          <span className="text-xs font-semibold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">AI</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <a href="/#fonctionnalites" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors font-medium">{t.nav.features}</a>
          <a href="/#tarifs" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors font-medium">{t.nav.pricing}</a>
          <a href="/#faq" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors font-medium">{t.nav.faq}</a>
          <Link href="/blog" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors font-medium">{t.nav.blog}</Link>
          <Link href="/about" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors font-medium">{t.nav.about}</Link>
          <Link href="/contact" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors font-medium">{t.nav.contact}</Link>
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value as Lang)}
            aria-label="Choisir la langue"
            className="hidden sm:block text-xs font-semibold bg-transparent border border-gray-200 rounded-full px-3 py-1.5 text-gray-600 hover:border-indigo-300 focus:outline-none focus:ring-1 focus:ring-indigo-300 cursor-pointer"
          >
            {LANGS.map((l) => (
              <option key={l.code} value={l.code}>{l.label}</option>
            ))}
          </select>
          <a
            href="/#inscription"
            className="bg-indigo-600 text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-indigo-700 active:bg-indigo-800 transition-colors"
          >
            {t.nav.cta}
          </a>
        </div>
      </div>
    </header>
  )
}
