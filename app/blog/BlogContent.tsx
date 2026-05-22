'use client'

import { useLang } from '@/app/providers'
import { translations, type Lang } from '@/lib/i18n'
import { posts } from '@/lib/blog'
import SiteHeader from '@/app/components/SiteHeader'
import SiteFooter from '@/app/components/SiteFooter'
import Link from 'next/link'

const T = {
  fr: { h1: 'Blog', subtitle: 'Conseils pour vendre mieux sur Vinted' },
  en: { h1: 'Blog', subtitle: 'Tips to sell better on Vinted' },
  es: { h1: 'Blog', subtitle: 'Consejos para vender mejor en Vinted' },
}

function formatDate(date: string, lang: Lang) {
  return new Date(date).toLocaleDateString(
    lang === 'fr' ? 'fr-FR' : lang === 'es' ? 'es-ES' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  )
}

export default function BlogContent() {
  const { lang } = useLang()
  const t = translations[lang]
  const page = T[lang]

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <SiteHeader />
      <main className="pt-24 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12 text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-3">{page.h1}</h1>
            <p className="text-gray-500 text-lg">{page.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {posts.map((post) => {
              const p = post[lang]
              return (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all bg-white flex flex-col"
                >
                  <div className={`h-44 bg-gradient-to-br ${post.color}`} />
                  <div className="p-6 flex flex-col flex-1">
                    <p className="text-xs text-gray-400 mb-3">
                      {formatDate(post.date, lang)} · {p.readTime} min
                    </p>
                    <h2 className="font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors text-lg leading-snug">
                      {p.title}
                    </h2>
                    <p className="text-sm text-gray-500 leading-relaxed flex-1">{p.excerpt}</p>
                    <div className="mt-4 text-sm font-semibold text-indigo-600 group-hover:text-indigo-800 transition-colors">
                      {lang === 'fr' ? 'Lire l\'article →' : lang === 'es' ? 'Leer el artículo →' : 'Read article →'}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          <div className="mt-16 text-center bg-indigo-50 rounded-2xl p-10 border border-indigo-100">
            <p className="text-indigo-800 font-semibold text-lg mb-2">
              {lang === 'fr' ? 'Prêt à vendre plus vite ?' : lang === 'es' ? '¿Listo para vender más rápido?' : 'Ready to sell faster?'}
            </p>
            <p className="text-indigo-600 text-sm mb-6">
              {lang === 'fr' ? "Essayez SellerLab AI gratuitement dès aujourd'hui." : lang === 'es' ? 'Prueba SellerLab AI gratis hoy.' : 'Try SellerLab AI for free today.'}
            </p>
            <a
              href="/#inscription"
              className="inline-block bg-indigo-600 text-white font-semibold px-6 py-3 rounded-full hover:bg-indigo-700 transition-colors text-sm"
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
