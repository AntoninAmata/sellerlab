'use client'

import { useLang } from '@/app/providers'
import { translations, type Lang } from '@/lib/i18n'
import { posts } from '@/lib/blog'
import SiteHeader from '@/app/components/SiteHeader'
import SiteFooter from '@/app/components/SiteFooter'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const T: Record<Lang, { h1: string; subtitle: string; read: string; ctaH: string; ctaP: string }> = {
  fr: { h1: 'Blog', subtitle: 'Conseils pour vendre mieux sur Vinted', read: "Lire l'article", ctaH: 'Prêt à vendre plus vite ?', ctaP: "Essayez SellerLab AI gratuitement dès aujourd'hui." },
  en: { h1: 'Blog', subtitle: 'Tips to sell better on Vinted', read: 'Read article', ctaH: 'Ready to sell faster?', ctaP: 'Try SellerLab AI for free today.' },
  es: { h1: 'Blog', subtitle: 'Consejos para vender mejor en Vinted', read: 'Leer el artículo', ctaH: '¿Listo para vender más rápido?', ctaP: 'Prueba SellerLab AI gratis hoy.' },
  it: { h1: 'Blog', subtitle: 'Consigli per vendere meglio su Vinted', read: "Leggi l'articolo", ctaH: 'Pronto a vendere più velocemente?', ctaP: 'Prova SellerLab AI gratis oggi.' },
  de: { h1: 'Blog', subtitle: 'Tipps für bessere Verkäufe auf Vinted', read: 'Artikel lesen', ctaH: 'Bereit, schneller zu verkaufen?', ctaP: 'Probiere SellerLab AI kostenlos aus.' },
  pl: { h1: 'Blog', subtitle: 'Wskazówki, jak lepiej sprzedawać na Vinted', read: 'Czytaj artykuł', ctaH: 'Gotowy sprzedawać szybciej?', ctaP: 'Wypróbuj SellerLab AI za darmo już dziś.' },
  nl: { h1: 'Blog', subtitle: 'Tips om beter te verkopen op Vinted', read: 'Lees artikel', ctaH: 'Klaar om sneller te verkopen?', ctaP: 'Probeer SellerLab AI vandaag gratis.' },
}

const localeMap: Record<Lang, string> = {
  fr: 'fr-FR', en: 'en-US', es: 'es-ES', it: 'it-IT', de: 'de-DE', pl: 'pl-PL', nl: 'nl-NL',
}

export default function BlogContent() {
  const { lang } = useLang()
  const t = translations[lang]
  const page = T[lang as Lang]

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <SiteHeader />

      <main>
        {/* Hero blog */}
        <section className="pt-28 pb-14 px-6 bg-gray-50 border-b border-gray-100">
          <div className="max-w-5xl mx-auto text-center animate-fade-up">
            <p className="text-indigo-600 text-xs font-bold uppercase tracking-[0.15em] mb-3">Blog</p>
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-gray-900 mb-3 leading-tight">
              {page.h1}
            </h1>
            <p className="text-gray-500 text-lg">{page.subtitle}</p>
          </div>
        </section>

        {/* Articles */}
        <section className="py-16 px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-7">
              {posts.map((post) => {
                const p = post[lang]
                const date = new Date(post.date).toLocaleDateString(
                  localeMap[lang],
                  { year: 'numeric', month: 'long', day: 'numeric' }
                )
                return (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group rounded-2xl overflow-hidden border border-gray-100 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-50/60 hover:-translate-y-1 transition-all duration-200 bg-white flex flex-col"
                  >
                    {/* Bannière */}
                    <div className={`h-44 bg-gradient-to-br ${post.color} flex items-center justify-center`}>
                      <span className="font-display font-extrabold text-white/25 text-6xl select-none">
                        {p.readTime.toString().padStart(2, '0')}
                      </span>
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <p className="text-xs text-gray-400 mb-3 font-medium">{date} · {p.readTime} min</p>
                      <h2 className="font-display font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors text-base leading-snug">
                        {p.title}
                      </h2>
                      <p className="text-sm text-gray-500 leading-relaxed flex-1">{p.excerpt}</p>
                      <div className="mt-4 flex items-center gap-1.5 text-indigo-600 text-xs font-semibold group-hover:gap-2 transition-all">
                        {page.read} <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>

            {/* CTA bas de page */}
            <div className="mt-14 relative rounded-3xl p-10 text-center overflow-hidden bg-[#080810]" style={{backgroundImage:'radial-gradient(ellipse 70% 60% at 5% 90%, rgba(99,102,241,0.14) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 95% 10%, rgba(99,102,241,0.10) 0%, transparent 50%)'}}>
              <div className="relative z-10">
                <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white mb-3">
                  {page.ctaH}
                </h2>
                <p className="text-gray-400 text-sm mb-7">{page.ctaP}</p>
                <a
                  href="/#inscription"
                  className="btn-shimmer inline-block bg-white text-indigo-700 font-bold px-7 py-3.5 rounded-full hover:bg-indigo-50 active:scale-95 transition-all text-sm shadow-lg"
                >
                  {t.nav.cta}
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
