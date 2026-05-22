'use client'

import Link from 'next/link'
import { useLang } from '@/app/providers'
import { translations } from '@/lib/i18n'
import { getPost } from '@/lib/blog'
import SiteHeader from '@/app/components/SiteHeader'
import SiteFooter from '@/app/components/SiteFooter'
import type { Lang } from '@/lib/i18n'

function formatDate(date: string, lang: Lang) {
  return new Date(date).toLocaleDateString(
    lang === 'fr' ? 'fr-FR' : lang === 'es' ? 'es-ES' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  )
}

const backLabel: Record<Lang, string> = {
  fr: '← Retour au blog',
  en: '← Back to blog',
  es: '← Volver al blog',
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
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Article introuvable</h1>
          <Link href="/blog" className="text-indigo-600 hover:underline">{backLabel[lang]}</Link>
        </main>
        <SiteFooter />
      </div>
    )
  }

  const p = post[lang]

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <SiteHeader />
      <main className="pt-16">
        {/* Gradient header */}
        <div className={`bg-gradient-to-br ${post.color} py-16 px-6`}>
          <div className="max-w-3xl mx-auto">
            <Link
              href="/blog"
              className="text-sm text-white/80 hover:text-white mb-8 inline-block transition-colors"
            >
              {backLabel[lang]}
            </Link>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 leading-tight">
              {p.title}
            </h1>
            <p className="text-white/70 text-sm">
              {formatDate(post.date, lang)} · {p.readTime} min
            </p>
          </div>
        </div>

        {/* Article body */}
        <div className="max-w-3xl mx-auto px-6 py-12">
          <p className="text-lg text-gray-600 mb-10 leading-relaxed">{p.intro}</p>

          {p.sections.map((section, i) => (
            <div key={i} className="mb-10">
              <h2 className="text-xl font-bold text-gray-900 mb-3">{section.title}</h2>
              <p className="text-gray-600 leading-relaxed">{section.body}</p>
            </div>
          ))}

          {/* Article CTA */}
          <div className={`bg-gradient-to-br ${post.color} rounded-2xl p-8 text-white mt-12`}>
            <h3 className="text-xl font-bold mb-3">{p.ctaTitle}</h3>
            <p className="text-white/80 mb-6">{p.ctaBody}</p>
            <a
              href="/#inscription"
              className="inline-block bg-white text-indigo-600 font-bold px-6 py-3 rounded-full hover:bg-indigo-50 transition-colors text-sm"
            >
              {t.nav.cta}
            </a>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
