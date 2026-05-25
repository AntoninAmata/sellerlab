'use client'

import Link from 'next/link'
import { useLang } from '@/app/providers'
import { translations } from '@/lib/i18n'
import { getPost } from '@/lib/blog'
import SiteHeader from '@/app/components/SiteHeader'
import SiteFooter from '@/app/components/SiteFooter'
import type { Lang } from '@/lib/i18n'
import { ArrowLeft } from 'lucide-react'

const localeMap: Record<Lang, string> = {
  fr: 'fr-FR', en: 'en-US', es: 'es-ES', it: 'it-IT', de: 'de-DE', pl: 'pl-PL', nl: 'nl-NL',
}

const backLabel: Record<Lang, string> = {
  fr: 'Retour au blog',
  en: 'Back to blog',
  es: 'Volver al blog',
  it: 'Torna al blog',
  de: 'Zurück zum Blog',
  pl: 'Wróć do bloga',
  nl: 'Terug naar blog',
}

export default function ArticleContent({ slug }: { slug: string }) {
  const { lang } = useLang()
  const t = translations[lang]
  const post = getPost(slug)

  if (!post) {
    return (
      <div className="min-h-screen bg-white text-gray-900">
        <SiteHeader />
        <main className="pt-32 px-6 text-center">
          <h1 className="font-display font-bold text-2xl text-gray-900 mb-4">Article introuvable</h1>
          <Link href="/blog" className="text-indigo-600 hover:text-indigo-800 transition-colors">
            ← {backLabel[lang]}
          </Link>
        </main>
        <SiteFooter />
      </div>
    )
  }

  const p = post[lang]
  const date = new Date(post.date).toLocaleDateString(localeMap[lang], {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <SiteHeader />

      <main className="pt-16">
        {/* Bannière de l'article */}
        <div className={`bg-gradient-to-br ${post.color} pt-16 pb-14 px-6`}>
          <div className="max-w-3xl mx-auto">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white mb-8 transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              {backLabel[lang]}
            </Link>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white mb-5 leading-tight">
              {p.title}
            </h1>
            <p className="text-white/70 text-sm font-medium">
              {date} · {p.readTime} min
            </p>
          </div>
        </div>

        {/* Corps de l'article */}
        <div className="max-w-3xl mx-auto px-6 py-14">

          {/* Introduction */}
          <p className="text-xl text-gray-600 mb-12 leading-relaxed border-l-4 border-indigo-200 pl-5">
            {p.intro}
          </p>

          {/* Sections */}
          {p.sections.map((section, i) => (
            <div key={i} className="mb-12">
              <h2 className="font-display font-bold text-xl sm:text-2xl text-gray-900 mb-4 leading-snug">
                {section.title}
              </h2>
              <p className="text-gray-600 leading-relaxed text-base">{section.body}</p>
            </div>
          ))}

          {/* CTA article */}
          <div className="relative rounded-3xl overflow-hidden mt-14">
            <div className={`absolute inset-0 bg-gradient-to-br ${post.color} opacity-90`} />
            <div className="relative z-10 p-10 text-white">
              <h3 className="font-display font-extrabold text-2xl mb-4 leading-snug">{p.ctaTitle}</h3>
              <p className="text-white/80 mb-7 leading-relaxed">{p.ctaBody}</p>
              <a
                href="/#inscription"
                className="btn-shimmer inline-block bg-white text-gray-900 font-bold px-7 py-3.5 rounded-full hover:bg-gray-50 active:scale-95 transition-all text-sm shadow-lg"
              >
                {t.nav.cta}
              </a>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
