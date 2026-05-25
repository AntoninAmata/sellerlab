'use client'

import { useState } from 'react'
import {
  Camera, TrendingDown, FileX,
  Wand2, Tag, FileText,
  Shirt, ArrowRight, Sparkles,
  Star,
} from 'lucide-react'
import { translations, type Lang, type Translations, type Plan } from '@/lib/i18n'
import { useLang } from '@/app/providers'
import { posts } from '@/lib/blog'
import SiteHeader from './components/SiteHeader'
import SiteFooter from './components/SiteFooter'

// ─── Hero illustration ────────────────────────────────────────────────────────

function BeforeAfterIllustration({ t }: { t: Translations }) {
  return (
    <div>
      <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 flex h-52">
        {/* Before */}
        <div className="relative flex-1 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-100 via-rose-50 to-blue-100">
            <div className="absolute top-3 left-2 w-9 h-5 bg-amber-300/50 rounded rotate-12" />
            <div className="absolute bottom-5 left-4 w-11 h-3 bg-rose-300/50 rounded -rotate-6" />
            <div className="absolute top-7 right-3 w-5 h-8 bg-blue-300/50 rounded rotate-6" />
            <div className="absolute bottom-3 right-5 w-8 h-3 bg-purple-300/50 rounded -rotate-12" />
            <div className="absolute top-2 right-7 w-4 h-4 bg-green-300/40 rounded-full" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-indigo-500 rounded-xl p-3 shadow-lg">
              <Shirt className="w-10 h-10 text-white" />
            </div>
          </div>
          <div className="absolute bottom-2.5 inset-x-0 flex justify-center">
            <span className="bg-white/90 text-red-500 text-xs font-bold px-2.5 py-0.5 rounded-full">
              {t.ui.before}
            </span>
          </div>
        </div>

        {/* Arrow divider */}
        <div className="w-10 bg-white flex items-center justify-center border-x border-gray-100 shrink-0">
          <div className="w-7 h-7 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center">
            <ArrowRight className="w-3.5 h-3.5 text-indigo-500" />
          </div>
        </div>

        {/* After */}
        <div className="relative flex-1 overflow-hidden bg-gray-50">
          <Sparkles className="absolute top-3 right-3 w-4 h-4 text-indigo-400" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-indigo-500 rounded-xl p-3 shadow-lg">
              <Shirt className="w-10 h-10 text-white" />
            </div>
          </div>
          <div className="absolute bottom-2.5 inset-x-0 flex justify-center">
            <span className="bg-indigo-50 text-indigo-600 text-xs font-bold px-2.5 py-0.5 rounded-full border border-indigo-100">
              {t.ui.after}
            </span>
          </div>
        </div>
      </div>
      <p className="text-center text-xs text-gray-400 mt-2.5">{t.ui.illustrationCaption}</p>
    </div>
  )
}

// ─── Hero ────────────────────────────────────────────────────────────────────

function Hero({ t }: { t: Translations }) {
  return (
    <section className="relative overflow-hidden pt-24 pb-10 px-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -5%, rgba(99,102,241,0.09) 0%, transparent 70%)' }}
      />
      <div className="relative max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
              {t.hero.badge}
            </div>
            <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-gray-900 leading-none mb-5">
              {t.hero.h1a}
              <br />
              <span className="text-indigo-600">{t.hero.h1b}</span>
            </h1>
            <p className="text-lg text-gray-500 max-w-xl mb-8 leading-relaxed mx-auto lg:mx-0">
              {t.hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <a
                href="#inscription"
                className="w-full sm:w-auto bg-indigo-600 text-white font-semibold px-8 py-3.5 rounded-full hover:bg-indigo-700 transition-colors text-base shadow-lg shadow-indigo-200"
              >
                {t.hero.cta1}
              </a>
              <a
                href="#comment-ca-marche"
                className="w-full sm:w-auto border border-gray-200 text-gray-700 font-semibold px-8 py-3.5 rounded-full hover:bg-gray-50 hover:border-gray-300 transition-colors text-base"
              >
                {t.hero.cta2} →
              </a>
            </div>
          </div>

          <div className="hidden lg:block">
            <BeforeAfterIllustration t={t} />
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Social proof ─────────────────────────────────────────────────────────────

function SocialProof({ t }: { t: Translations }) {
  return (
    <div className="bg-gray-50 border-y border-gray-100 py-3 px-6">
      <div className="max-w-6xl mx-auto flex items-center justify-center gap-2 flex-wrap">
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          ))}
        </div>
        <span className="text-sm font-semibold text-gray-700">4.8/5</span>
        <span className="text-gray-300 text-sm">·</span>
        <span className="text-sm text-gray-500">{t.socialProof}</span>
      </div>
    </div>
  )
}

// ─── Problem ─────────────────────────────────────────────────────────────────

const PROBLEM_ICONS = [Camera, TrendingDown, FileX] as const

function Problem({ t }: { t: Translations }) {
  return (
    <section className="py-14 bg-gray-50 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-2">{t.problem.h2}</h2>
        <p className="text-center text-gray-500 mb-10 max-w-xl mx-auto">{t.problem.subtitle}</p>
        <div className="grid md:grid-cols-3 gap-6">
          {t.problem.cards.map((card, i) => {
            const Icon = PROBLEM_ICONS[i]
            return (
              <div key={card.title} className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-red-400" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{card.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{card.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─── Features ────────────────────────────────────────────────────────────────

const FEATURE_ICONS = [Wand2, Tag, FileText] as const

function Features({ t }: { t: Translations }) {
  return (
    <section id="fonctionnalites" className="py-14 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-10">{t.features.h2}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {t.features.items.map((item, i) => {
            const Icon = FEATURE_ICONS[i]
            return (
              <div
                key={item.title}
                className="bg-gray-50 rounded-2xl p-7 border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all"
              >
                <div className="w-11 h-11 rounded-xl bg-indigo-100 flex items-center justify-center mb-5">
                  <Icon className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─── How it works ────────────────────────────────────────────────────────────

function HowItWorks({ t }: { t: Translations }) {
  return (
    <section id="comment-ca-marche" className="py-14 bg-gray-50 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">{t.howItWorks.h2}</h2>
        <div className="grid md:grid-cols-3 gap-10 md:gap-6">
          {t.howItWorks.steps.map((step) => (
            <div key={step.num} className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-indigo-600 text-white font-bold text-lg flex items-center justify-center shadow-lg shadow-indigo-200 mb-5">
                {step.num}
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Pricing ─────────────────────────────────────────────────────────────────

function Check({ white }: { white?: boolean }) {
  return (
    <svg
      className={`w-4 h-4 shrink-0 mt-0.5 ${white ? 'text-indigo-200' : 'text-indigo-500'}`}
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  )
}

function PricingCard({ plan }: { plan: Plan }) {
  if (plan.highlight) {
    return (
      <div className="relative rounded-3xl p-8 flex flex-col bg-indigo-600 shadow-2xl shadow-indigo-200 md:scale-105">
        {plan.badge && (
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
            <span className="bg-white text-indigo-600 text-xs font-bold px-4 py-1 rounded-full shadow-sm whitespace-nowrap">
              {plan.badge}
            </span>
          </div>
        )}
        <div className="mb-6">
          <p className="text-sm font-semibold mb-1 text-indigo-200">{plan.name}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-extrabold text-white">{plan.price}</span>
            <span className="text-sm text-indigo-200">{plan.period}</span>
          </div>
        </div>
        <ul className="space-y-3 mb-8 flex-1">
          {plan.features.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-sm">
              <Check white />
              <span className="text-indigo-100">{f}</span>
            </li>
          ))}
        </ul>
        <a href="#inscription" className="block text-center font-semibold py-3 px-6 rounded-full bg-white text-indigo-600 hover:bg-indigo-50 transition-colors text-sm">
          {plan.cta}
        </a>
      </div>
    )
  }

  return (
    <div className="relative rounded-3xl p-8 flex flex-col bg-gray-50 border border-gray-100">
      <div className="mb-6">
        <p className="text-sm font-semibold mb-1 text-gray-500">{plan.name}</p>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
          <span className="text-sm text-gray-400">{plan.period}</span>
        </div>
      </div>
      <ul className="space-y-3 mb-8 flex-1">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-sm">
            <Check />
            <span className="text-gray-600">{f}</span>
          </li>
        ))}
      </ul>
      <a href="#inscription" className="block text-center font-semibold py-3 px-6 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors text-sm">
        {plan.cta}
      </a>
    </div>
  )
}

function Pricing({ t }: { t: Translations }) {
  return (
    <section id="tarifs" className="py-14 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">{t.pricing.h2}</h2>
        <div className="grid md:grid-cols-3 gap-6 items-center">
          {t.pricing.plans.map((plan) => (
            <PricingCard key={plan.name} plan={plan} />
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────

function PlusIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      className={`text-indigo-500 shrink-0 transition-transform duration-200 ${open ? 'rotate-45' : ''}`}
    >
      <path d="M9 3v12M3 9h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function FAQ({ t }: { t: Translations }) {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <section id="faq" className="py-14 bg-gray-50 px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-10">{t.faq.h2}</h2>
        <div className="space-y-3">
          {t.faq.items.map((item, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              <button
                className="w-full flex items-center justify-between px-6 py-4 text-left gap-4"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{item.q}</h3>
                <PlusIcon open={open === i} />
              </button>
              {open === i && (
                <div className="px-6 pb-4">
                  <p className="text-gray-500 text-sm leading-relaxed">{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Blog preview ─────────────────────────────────────────────────────────────

function BlogPreview({ t, lang }: { t: Translations; lang: Lang }) {
  return (
    <section className="py-14 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">{t.latestPosts.h2}</h2>
          <a
            href="/blog"
            className="text-sm text-indigo-600 font-semibold hover:text-indigo-800 transition-colors"
          >
            {t.latestPosts.cta} →
          </a>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {posts.map((post) => {
            const p = post[lang]
            const localeMap: Record<string, string> = { fr: 'fr-FR', en: 'en-US', es: 'es-ES', it: 'it-IT', de: 'de-DE', pl: 'pl-PL', nl: 'nl-NL' }
            const date = new Date(post.date).toLocaleDateString(
              localeMap[lang] ?? 'en-US',
              { year: 'numeric', month: 'long', day: 'numeric' }
            )
            return (
              <a
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group rounded-2xl overflow-hidden border border-gray-100 hover:shadow-md transition-all bg-white flex flex-col"
              >
                <div className={`h-36 bg-gradient-to-br ${post.color}`} />
                <div className="p-6 flex flex-col flex-1">
                  <p className="text-xs text-gray-400 mb-2">{date} · {p.readTime} min</p>
                  <h3 className="font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors leading-snug">
                    {p.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed flex-1">{p.excerpt}</p>
                </div>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─── Final CTA ───────────────────────────────────────────────────────────────

function FinalCTA({ t }: { t: Translations }) {
  return (
    <section id="inscription" className="py-16 px-6 bg-indigo-600">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">{t.finalCta.h2}</h2>
        <p className="text-indigo-200 mb-8 text-lg">{t.finalCta.subtitle}</p>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
        >
          <input
            type="email"
            placeholder="Votre adresse e-mail"
            className="flex-1 bg-white/10 border border-white/20 text-white placeholder-indigo-300 rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
          />
          <button
            type="submit"
            className="bg-white text-indigo-600 font-bold px-6 py-3 rounded-full hover:bg-indigo-50 transition-colors text-sm whitespace-nowrap"
          >
            {t.finalCta.cta}
          </button>
        </form>
      </div>
    </section>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function Home() {
  const { lang } = useLang()
  const t = translations[lang]

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <SiteHeader />
      <main>
        <Hero t={t} />
        <SocialProof t={t} />
        <Problem t={t} />
        <Features t={t} />
        <HowItWorks t={t} />
        <Pricing t={t} />
        <FAQ t={t} />
        <BlogPreview t={t} lang={lang} />
        <FinalCTA t={t} />
      </main>
      <SiteFooter />
    </div>
  )
}
