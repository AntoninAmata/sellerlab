'use client'

import Link from 'next/link'
import { useLang } from '@/app/providers'
import { translations } from '@/lib/i18n'

export default function SiteFooter() {
  const { lang } = useLang()
  const t = translations[lang]

  return (
    <footer className="border-t border-gray-100 py-6 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-gray-400">{t.footer.copyright}</p>
        <nav className="flex items-center gap-5 flex-wrap justify-center">
          {t.footer.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs text-gray-400 hover:text-gray-700 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}
