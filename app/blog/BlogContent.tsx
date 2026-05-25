'use client'

import { useLang } from '@/app/providers'
import { translations, type Lang } from '@/lib/i18n'
import { posts } from '@/lib/blog'
import SiteHeader from '@/app/components/SiteHeader'
import SiteFooter from '@/app/components/SiteFooter'
import Link from 'next/link'

const T: Record<Lang, { h1: string; subtitle: string; read: string; ctaH: string; ctaP: string }> = {
  fr: { h1: 'Blog', subtitle: 'Conseils pour vendre mieux sur Vinted', read: "Lire l'article →", ctaH: 'Prêt à vendre plus vite ?', ctaP: "Essayez SellerLab AI gratuitement dès aujourd'hui." },
  en: { h1: 'Blog', subtitle: 'Tips to sell better on Vinted', read: 'Read article →', ctaH: 'Ready to sell faster?', ctaP: 'Try SellerLab AI for free today.' },
  es: { h1: 'Blog', subtitle: 'Consejos para vender mejor en Vinted', read: 'Leer el artículo →', ctaH: '¿Listo para vender más rápido?', ctaP: 'Prueba SellerLab AI gratis hoy.' },
  it: { h1: 'Blog', subtitle: 'Consigli per vendere meglio su Vinted', read: "Leggi l'articolo →", ctaH: 'Pronto a vendere più velocemente?', ctaP: 'Prova SellerLab AI gratis oggi.' },
  de: { h1: 'Blog', subtitle: 'Tipps für bessere Verkäufe auf Vinted', read: 'Artikel lesen →', ctaH: 'Bereit, schneller zu verkaufen?', ctaP: 'Probiere SellerLab AI kostenlos aus.' },
  pl: { h1: 'Blog', subtitle: 'Wskazówki, jak lepiej sprzedawać na Vinted', read: 'Czytaj artykuł →', ctaH: 'Gotowy sprzedawać szybciej?', ctaP: 'Wypróbuj SellerLab AI za darmo już dziś.' },
  nl: { h1: 'Blog', subtitle: 'Tips om beter te verkopen op Vinted', read: 'Lees artikel →', ctaH: 'Klaar om sneller te verkopen?', ctaP: 'Probeer SellerLab AI vandaag gratis.' },
}

const localeMap: Record<Lang, string> = {
  fr: 'fr-FR', en: 'en-US', es: 'es-ES', it: 'it-IT', de: 'de-DE', pl: 'pl-PL', nl: 'nl-NL',
}

function formatDate(date: string, lang: Lang) {
  return new Date(date).toLocaleDateString(localeMap[lang], { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function BlogContent() {
  const { lang } = useLang()
  const t = translations[lang]
  const page = T[lang as Lang]

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
                      {page.read}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          <div className="mt-16 text-center bg-indigo-50 rounded-2xl p-10 border border-indigo-100">
            <p className="text-indigo-800 font-semibold text-lg mb-2">
              {page.ctaH}
            </p>
            <p className="text-indigo-600 text-sm mb-6">
              {page.ctaP}
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
