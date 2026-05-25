'use client'

import Link from 'next/link'
import { useLang } from '@/app/providers'
import { translations, type Lang } from '@/lib/i18n'
import { useState, useEffect } from 'react'
import { Globe, Menu, X } from 'lucide-react'

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
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Ferme le menu mobile quand on clique sur un lien */
  const closeMobile = () => setMobileOpen(false)

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-6 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0 group" aria-label="SellerLab AI — accueil">
          <span
            className="font-display font-extrabold text-xl tracking-tight text-gray-900 group-hover:text-indigo-600 transition-colors"
          >
            SellerLab
          </span>
          <span className="text-[10px] font-bold bg-indigo-600 text-white px-2 py-0.5 rounded-md tracking-widest uppercase">
            AI
          </span>
        </Link>

        {/* Navigation desktop */}
        <nav className="hidden md:flex items-center gap-0.5" role="navigation">
          {[
            { href: '/#fonctionnalites', label: t.nav.features },
            { href: '/#tarifs',          label: t.nav.pricing },
            { href: '/#faq',             label: t.nav.faq },
            { href: '/blog',             label: t.nav.blog },
            { href: '/about',            label: t.nav.about },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-gray-50"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Actions droite */}
        <div className="flex items-center gap-2 shrink-0">

          {/* Sélecteur de langue */}
          <div className="hidden sm:flex items-center gap-1.5 border border-gray-200 rounded-full px-3 py-1.5 hover:border-gray-300 transition-colors cursor-pointer">
            <Globe className="w-3 h-3 text-gray-400 shrink-0" aria-hidden />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as Lang)}
              aria-label="Choisir la langue"
              className="text-xs font-semibold bg-transparent text-gray-600 focus:outline-none cursor-pointer"
            >
              {LANGS.map((l) => (
                <option key={l.code} value={l.code}>{l.label}</option>
              ))}
            </select>
          </div>

          {/* CTA inscription */}
          <a
            href="/#inscription"
            className="btn-shimmer bg-indigo-600 text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-indigo-700 active:scale-95 transition-all shadow-sm shadow-indigo-200"
          >
            {t.nav.cta}
          </a>

          {/* Bouton menu mobile */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen
              ? <X className="w-5 h-5 text-gray-700" />
              : <Menu className="w-5 h-5 text-gray-700" />
            }
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-5 py-4 space-y-0.5 shadow-lg">
          {[
            { href: '/#fonctionnalites', label: t.nav.features },
            { href: '/#tarifs',          label: t.nav.pricing },
            { href: '/#faq',             label: t.nav.faq },
            { href: '/blog',             label: t.nav.blog },
            { href: '/about',            label: t.nav.about },
            { href: '/contact',          label: t.nav.contact },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={closeMobile}
              className="flex items-center text-sm font-medium text-gray-700 py-3 px-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              {item.label}
            </a>
          ))}

          {/* Sélecteur langue mobile */}
          <div className="pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-400 font-medium mb-2 px-3">Langue</p>
            <div className="flex flex-wrap gap-1.5 px-3">
              {LANGS.map((l) => (
                <button
                  key={l.code}
                  onClick={() => { setLang(l.code); closeMobile() }}
                  className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${
                    lang === l.code
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
