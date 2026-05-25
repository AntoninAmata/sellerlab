'use client'

import { useState } from 'react'
import {
  Camera, TrendingDown, FileX,
  Wand2, Tag, FileText,
  Shirt, ArrowRight, Sparkles,
  Star, Check, ChevronDown,
} from 'lucide-react'
import { translations, type Lang, type Translations, type Plan } from '@/lib/i18n'
import { useLang } from '@/app/providers'
import { posts } from '@/lib/blog'
import SiteHeader from './components/SiteHeader'
import SiteFooter from './components/SiteFooter'

/* ─── Illustration Avant / Après ─────────────────────────────────────────── */

function BeforeAfterIllustration({ t }: { t: Translations }) {
  return (
    <div className="relative animate-fade-up-d2">

      {/* Halo derrière la carte */}
      <div
        aria-hidden
        className="absolute inset-4 rounded-3xl blur-3xl"
        style={{ background: 'radial-gradient(ellipse, rgba(99,102,241,0.25) 0%, transparent 70%)' }}
      />

      {/* Chip flottant : notification IA */}
      <div className="absolute -top-4 -right-4 z-10 bg-white border border-gray-200 shadow-lg rounded-xl px-3 py-2 flex items-center gap-2">
        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
          <Check className="w-3 h-3 text-green-600" />
        </div>
        <span className="text-xs font-semibold text-gray-800 whitespace-nowrap">Fond supprimé ✓</span>
      </div>

      {/* Carte principale */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-200/60 flex h-64 sm:h-72 w-full max-w-sm">

        {/* Avant */}
        <div className="relative flex-1 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-100 via-rose-50 to-blue-100">
            <div className="absolute top-4 left-3  w-10 h-6  bg-amber-300/60 rounded-lg rotate-12" />
            <div className="absolute bottom-6 left-5 w-12 h-4  bg-rose-300/50  rounded-lg -rotate-6" />
            <div className="absolute top-8  right-4 w-6  h-9  bg-blue-300/50  rounded-lg rotate-6" />
            <div className="absolute bottom-4 right-6 w-9  h-4  bg-purple-300/40 rounded-lg -rotate-12" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-4 border border-white/60 shadow-sm">
              <Shirt className="w-12 h-12 text-gray-500" />
            </div>
          </div>
          <div className="absolute bottom-3 inset-x-0 flex justify-center">
            <span className="bg-white/90 backdrop-blur-sm text-red-500 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
              {t.ui.before}
            </span>
          </div>
        </div>

        {/* Séparateur avec icône IA */}
        <div className="w-12 bg-white/70 backdrop-blur-md flex items-center justify-center border-x border-gray-200/50 shrink-0">
          <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-300/50">
            <Wand2 className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Après */}
        <div className="relative flex-1 overflow-hidden bg-white">
          <Sparkles className="absolute top-3 right-3 w-4 h-4 text-indigo-300 animate-pulse-dot" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-indigo-600 rounded-2xl p-4 shadow-xl shadow-indigo-400/30">
              <Shirt className="w-12 h-12 text-white" />
            </div>
          </div>
          <div className="absolute bottom-3 inset-x-0 flex justify-center">
            <span className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
              {t.ui.after}
            </span>
          </div>
        </div>
      </div>

      {/* Légende */}
      <p className="text-center text-xs text-gray-400 mt-3 font-medium">{t.ui.illustrationCaption}</p>
    </div>
  )
}

/* ─── Hero ───────────────────────────────────────────────────────────────── */

function Hero({ t }: { t: Translations }) {
  return (
    <section className="relative overflow-hidden pt-28 pb-14 px-6 dot-grid">
      {/* Fond blanc qui "efface" le grid sur les bords */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/0 via-white/0 to-white" />

      <div className="relative max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-[1fr_auto] gap-12 items-center">

          {/* Texte */}
          <div className="text-center lg:text-left">

            {/* Badge */}
            <div className="animate-fade-up inline-flex items-center gap-2 border border-indigo-200 bg-indigo-50/80 text-indigo-700 text-xs font-bold px-4 py-1.5 rounded-full mb-7 tracking-wide">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse-dot" />
              {t.hero.badge}
            </div>

            {/* Titre principal — Police Syne, très grande */}
            <h1 className="font-display font-extrabold text-[clamp(2.8rem,6vw,5.5rem)] leading-[1.0] tracking-tight text-gray-900 mb-6 animate-fade-up-d1">
              {t.hero.h1a}
              <br />
              <span className="text-indigo-600">{t.hero.h1b}</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-500 max-w-xl mb-9 leading-relaxed mx-auto lg:mx-0 animate-fade-up-d2">
              {t.hero.subtitle}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 mb-9 animate-fade-up-d3">
              <a
                href="#inscription"
                className="btn-shimmer w-full sm:w-auto bg-indigo-600 text-white font-semibold px-8 py-3.5 rounded-full hover:bg-indigo-700 active:scale-95 transition-all text-base shadow-lg shadow-indigo-200/70"
              >
                {t.hero.cta1}
              </a>
              <a
                href="#comment-ca-marche"
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 border border-gray-200 text-gray-700 font-semibold px-8 py-3.5 rounded-full hover:bg-gray-50 hover:border-gray-300 transition-all text-base"
              >
                {t.hero.cta2}
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Preuve sociale */}
            <div className="flex items-center justify-center lg:justify-start gap-2 animate-fade-up-d4">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <span className="text-sm font-bold text-gray-800">4.8/5</span>
              <span className="text-gray-300">·</span>
              <span className="text-sm text-gray-500">{t.socialProof}</span>
            </div>
          </div>

          {/* Illustration */}
          <div className="hidden lg:flex justify-center">
            <BeforeAfterIllustration t={t} />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Problème ───────────────────────────────────────────────────────────── */

const PROBLEM_ICONS = [Camera, TrendingDown, FileX] as const

function Problem({ t }: { t: Translations }) {
  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-5xl mx-auto">

        <p className="text-center text-indigo-600 text-xs font-bold uppercase tracking-[0.15em] mb-3">
          Le problème
        </p>
        <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-gray-900 text-center mb-4 leading-tight">
          {t.problem.h2}
        </h2>
        <p className="text-center text-gray-600 text-lg mb-12 max-w-lg mx-auto leading-relaxed">
          {t.problem.subtitle}
        </p>

        <div className="grid md:grid-cols-3 gap-5">
          {t.problem.cards.map((card, i) => {
            const Icon = PROBLEM_ICONS[i]
            return (
              <div
                key={card.title}
                className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-indigo-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group"
              >
                <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                  <Icon className="w-5 h-5 text-red-500" />
                </div>
                <h3 className="font-display font-extrabold text-gray-900 text-lg mb-3 leading-snug">
                  {card.title}
                </h3>
                <p className="text-gray-700 text-base leading-relaxed">{card.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ─── Fonctionnalités ────────────────────────────────────────────────────── */

const FEATURE_ICONS = [Wand2, Tag, FileText] as const
const FEATURE_NUMS = ['01', '02', '03']

function Features({ t }: { t: Translations }) {
  return (
    <section id="fonctionnalites" className="py-20 px-6 bg-white">
      <div className="max-w-5xl mx-auto">

        <p className="text-center text-indigo-600 text-xs font-bold uppercase tracking-[0.15em] mb-3">
          Fonctionnalités
        </p>
        <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-center text-gray-900 mb-14 leading-tight">
          {t.features.h2}
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {t.features.items.map((item, i) => {
            const Icon = FEATURE_ICONS[i]
            return (
              <div
                key={item.title}
                className="group relative bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-50/80 hover:-translate-y-1 transition-all duration-200"
              >
                {/* Numéro décoratif */}
                <span className="absolute top-6 right-7 font-display font-extrabold text-5xl text-gray-100 group-hover:text-indigo-50 transition-colors select-none">
                  {FEATURE_NUMS[i]}
                </span>

                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center mb-6 shadow-md shadow-indigo-200/60 group-hover:scale-105 transition-transform">
                    <Icon className="w-5.5 h-5.5 text-white" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-gray-900 mb-3 leading-snug">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ─── Comment ça marche ──────────────────────────────────────────────────── */

function HowItWorks({ t }: { t: Translations }) {
  return (
    <section id="comment-ca-marche" className="py-20 bg-gray-50 px-6">
      <div className="max-w-5xl mx-auto">

        <p className="text-center text-indigo-600 text-xs font-bold uppercase tracking-[0.15em] mb-3">
          Processus
        </p>
        <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-center text-gray-900 mb-16 leading-tight">
          {t.howItWorks.h2}
        </h2>

        <div className="grid md:grid-cols-3 gap-8 md:gap-6 relative">
          {/* Ligne de connexion (desktop) */}
          <div
            aria-hidden
            className="hidden md:block absolute top-10 left-[calc(16.67%+1.5rem)] right-[calc(16.67%+1.5rem)] h-px bg-gradient-to-r from-indigo-200 via-indigo-400 to-indigo-200"
          />

          {t.howItWorks.steps.map((step, i) => (
            <div key={step.num} className="flex flex-col items-center text-center relative z-10">
              {/* Numéro circulaire */}
              <div className="w-14 h-14 rounded-full bg-indigo-600 text-white font-display font-extrabold text-lg flex items-center justify-center shadow-xl shadow-indigo-200/60 mb-6 border-4 border-white">
                {step.num}
              </div>
              <h3 className="font-display font-bold text-base text-gray-900 mb-2.5 leading-snug">{step.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Pricing ────────────────────────────────────────────────────────────── */

function CheckItem({ white }: { white?: boolean }) {
  return (
    <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
      white ? 'bg-white/20' : 'bg-indigo-100'
    }`}>
      <Check className={`w-2.5 h-2.5 ${white ? 'text-white' : 'text-indigo-600'}`} />
    </div>
  )
}

function PricingCard({ plan }: { plan: Plan }) {
  if (plan.highlight) {
    return (
      <div className="relative rounded-3xl p-8 flex flex-col bg-indigo-600 md:scale-105 md:-mx-1 shadow-2xl shadow-indigo-300/40 z-10">
        {/* Badge populaire */}
        {plan.badge && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2">
            <span className="bg-white text-indigo-600 text-[11px] font-extrabold px-5 py-1.5 rounded-full shadow-md whitespace-nowrap uppercase tracking-wide">
              {plan.badge}
            </span>
          </div>
        )}

        <div className="mb-7">
          <p className="text-sm font-semibold mb-1.5 text-indigo-200">{plan.name}</p>
          <div className="flex items-baseline gap-1">
            <span className="font-display font-extrabold text-5xl text-white">{plan.price}</span>
            <span className="text-sm text-indigo-300">{plan.period}</span>
          </div>
        </div>

        <ul className="space-y-3.5 mb-9 flex-1">
          {plan.features.map((f) => (
            <li key={f} className="flex items-start gap-3 text-sm">
              <CheckItem white />
              <span className="text-indigo-100">{f}</span>
            </li>
          ))}
        </ul>

        <a
          href="#inscription"
          className="btn-shimmer block text-center font-semibold py-3.5 px-6 rounded-full bg-white text-indigo-600 hover:bg-indigo-50 active:scale-95 transition-all text-sm shadow-sm"
        >
          {plan.cta}
        </a>
      </div>
    )
  }

  return (
    <div className="relative rounded-3xl p-8 flex flex-col bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all">
      <div className="mb-7">
        <p className="text-sm font-semibold mb-1.5 text-gray-400">{plan.name}</p>
        <div className="flex items-baseline gap-1">
          <span className="font-display font-extrabold text-5xl text-gray-900">{plan.price}</span>
          <span className="text-sm text-gray-400">{plan.period}</span>
        </div>
      </div>

      <ul className="space-y-3.5 mb-9 flex-1">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-3 text-sm">
            <CheckItem />
            <span className="text-gray-600">{f}</span>
          </li>
        ))}
      </ul>

      <a
        href="#inscription"
        className="block text-center font-semibold py-3.5 px-6 rounded-full bg-gray-900 text-white hover:bg-gray-800 active:scale-95 transition-all text-sm"
      >
        {plan.cta}
      </a>
    </div>
  )
}

function Pricing({ t }: { t: Translations }) {
  return (
    <section id="tarifs" className="py-20 px-6 bg-white">
      <div className="max-w-5xl mx-auto">

        <p className="text-center text-indigo-600 text-xs font-bold uppercase tracking-[0.15em] mb-3">
          Tarifs
        </p>
        <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-center text-gray-900 mb-14 leading-tight">
          {t.pricing.h2}
        </h2>

        <div className="grid md:grid-cols-3 gap-5 items-center">
          {t.pricing.plans.map((plan) => (
            <PricingCard key={plan.name} plan={plan} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── FAQ ────────────────────────────────────────────────────────────────── */

function FAQ({ t }: { t: Translations }) {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="faq" className="py-20 bg-gray-50 px-6">
      <div className="max-w-3xl mx-auto">

        <p className="text-center text-indigo-600 text-xs font-bold uppercase tracking-[0.15em] mb-3">
          FAQ
        </p>
        <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-center text-gray-900 mb-12 leading-tight">
          {t.faq.h2}
        </h2>

        <div className="space-y-2.5">
          {t.faq.items.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-gray-200 transition-colors shadow-sm"
            >
              <button
                className="w-full flex items-center justify-between px-6 py-5 text-left gap-4 group"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base leading-snug group-hover:text-indigo-600 transition-colors">
                  {item.q}
                </h3>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200 ${
                    open === i ? 'rotate-180 text-indigo-500' : ''
                  }`}
                />
              </button>

              {/* Accordéon avec transition CSS grid */}
              <div className={`faq-body ${open === i ? 'open' : ''}`}>
                <div>
                  <p className="px-6 pb-5 text-gray-500 text-sm leading-relaxed">{item.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Blog preview ───────────────────────────────────────────────────────── */

function BlogPreview({ t, lang }: { t: Translations; lang: Lang }) {
  const localeMap: Record<string, string> = {
    fr: 'fr-FR', en: 'en-US', es: 'es-ES', it: 'it-IT',
    de: 'de-DE', pl: 'pl-PL', nl: 'nl-NL',
  }

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-5xl mx-auto">

        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-indigo-600 text-xs font-bold uppercase tracking-[0.15em] mb-2">Blog</p>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-gray-900 leading-tight">
              {t.latestPosts.h2}
            </h2>
          </div>
          <a
            href="/blog"
            className="hidden sm:flex items-center gap-1.5 text-sm text-indigo-600 font-semibold hover:text-indigo-800 transition-colors"
          >
            {t.latestPosts.cta}
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {posts.map((post) => {
            const p = post[lang]
            const date = new Date(post.date).toLocaleDateString(
              localeMap[lang] ?? 'en-US',
              { year: 'numeric', month: 'long', day: 'numeric' }
            )
            return (
              <a
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group rounded-2xl overflow-hidden border border-gray-100 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-50/60 hover:-translate-y-1 transition-all duration-200 bg-white flex flex-col"
              >
                {/* Bannière colorée */}
                <div className={`h-40 bg-gradient-to-br ${post.color} flex items-center justify-center`}>
                  <span className="font-display font-extrabold text-white/30 text-6xl select-none">
                    {(p.readTime).toString().padStart(2, '0')}
                  </span>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <p className="text-xs text-gray-400 mb-3 font-medium">{date} · {p.readTime} min</p>
                  <h3 className="font-display font-bold text-gray-900 mb-2.5 group-hover:text-indigo-600 transition-colors leading-snug text-base">
                    {p.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed flex-1">{p.excerpt}</p>
                  <div className="mt-4 flex items-center gap-1.5 text-indigo-600 text-xs font-semibold">
                    Lire l&apos;article <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </a>
            )
          })}
        </div>

        {/* CTA mobile */}
        <div className="sm:hidden text-center mt-8">
          <a
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-indigo-600 font-semibold hover:text-indigo-800 transition-colors"
          >
            {t.latestPosts.cta} <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  )
}

/* ─── CTA final ──────────────────────────────────────────────────────────── */

function FinalCTA({ t }: { t: Translations }) {
  return (
    <section id="inscription" className="py-20 px-6 bg-gray-50 border-t border-gray-100">
      <div className="max-w-2xl mx-auto text-center">

        <h2 className="font-display font-extrabold text-4xl sm:text-5xl text-gray-900 mb-4 leading-tight">
          {t.finalCta.h2}
        </h2>
        <p className="text-gray-700 text-lg mb-10 leading-relaxed">{t.finalCta.subtitle}</p>

        {/* Formulaire d'inscription */}
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
        >
          <input
            type="email"
            placeholder="Votre adresse e-mail"
            aria-label="Adresse e-mail"
            className="flex-1 bg-white border-2 border-gray-300 text-gray-900 placeholder-gray-400 rounded-full px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all"
          />
          <button
            type="submit"
            className="btn-shimmer bg-indigo-600 text-white font-bold px-6 py-3.5 rounded-full hover:bg-indigo-700 active:scale-95 transition-all text-sm whitespace-nowrap shadow-lg shadow-indigo-200"
          >
            {t.finalCta.cta}
          </button>
        </form>

        {/* Note de sécurité */}
        <p className="text-sm text-gray-500 mt-4">
          Aucune carte bancaire requise · Annulation à tout moment
        </p>
      </div>
    </section>
  )
}

/* ─── Page principale ────────────────────────────────────────────────────── */

export default function Home() {
  const { lang } = useLang()
  const t = translations[lang]

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <SiteHeader />
      <main>
        <Hero t={t} />
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
