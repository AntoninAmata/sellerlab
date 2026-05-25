'use client'

import Link from 'next/link'
import { useLang } from '@/app/providers'
import { translations } from '@/lib/i18n'

export default function SiteFooter() {
  const { lang } = useLang()
  const t = translations[lang]

  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-6">

        {/* Corps du footer */}
        <div className="py-12 grid md:grid-cols-[2fr_1fr_1fr] gap-10">

          {/* Marque + description */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="font-display font-extrabold text-lg tracking-tight text-gray-900">
                SellerLab
              </span>
              <span className="text-[10px] font-bold bg-indigo-600 text-white px-2 py-0.5 rounded-md tracking-widest uppercase">
                AI
              </span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs mb-5">
              Optimisez vos photos, calculez vos prix et rédigez vos annonces Vinted en 10 secondes grâce à l&apos;IA.
            </p>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse-dot" />
              <span className="text-xs text-gray-400 font-medium">Disponible · Phase bêta</span>
            </div>
          </div>

          {/* Liens produit */}
          <div>
            <p className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">Produit</p>
            <nav className="space-y-3">
              {[
                { href: '/#fonctionnalites', label: t.nav.features },
                { href: '/#tarifs',          label: t.nav.pricing },
                { href: '/#faq',             label: t.nav.faq },
              ].map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="block text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                  {l.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Liens légaux & info */}
          <div>
            <p className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">Infos</p>
            <nav className="space-y-3">
              {t.footer.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Barre du bas */}
        <div className="border-t border-gray-100 py-5 flex items-center justify-center">
          <p className="text-xs text-gray-400">{t.footer.copyright}</p>
        </div>
      </div>
    </footer>
  )
}
