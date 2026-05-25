'use client'

import { useLang } from '@/app/providers'
import SiteHeader from '@/app/components/SiteHeader'
import SiteFooter from '@/app/components/SiteFooter'
import { Heart, Zap, ShieldCheck, Users } from 'lucide-react'

/* Traductions de la page À propos */
const T = {
  fr: {
    hero: {
      label: 'Notre histoire',
      h1: 'Nés de la frustration de vendre sur Vinted',
      lead: "Comme des millions de Français, j'ai commencé à vendre mes vêtements sur Vinted. Et comme beaucoup, je me suis vite retrouvé à passer des heures à préparer chaque annonce : photographier l'article, chercher le bon prix, rédiger une description qui accroche. Tout ça pour vendre une chemise à 8€.",
    },
    story: {
      title: "De la frustration à l'outil",
      p1: "J'ai réalisé que le problème n'était pas le temps disponible, mais les outils. Il n'existait rien de simple et abordable pour aider les vendeurs occasionnels comme moi. Les gros vendeurs avaient leurs méthodes, mais pour les petits, c'était le débrouillage.",
      p2: "SellerLab AI est né de cette idée simple : et si l'IA pouvait faire en 10 secondes ce qui prend normalement 20 minutes ? Supprimer le fond d'une photo, calculer le bon prix, rédiger une annonce percutante. On a bossé là-dessus pendant des mois, et on est fiers de ce qu'on a construit.",
    },
    mission: {
      title: 'Notre mission',
      text: "Donner aux vendeurs Vinted — qu'ils vendent 5 articles ou 500 — les mêmes outils que les pros. Simples, rapides, accessibles. Parce que vendre mieux ne devrait pas nécessiter des heures de travail ou une expertise en marketing.",
    },
    values: {
      title: 'Nos valeurs',
      items: [
        { icon: 'heart', title: 'Simplicité avant tout', desc: "Un outil qui se comprend en 30 secondes. Pas de tutoriel de 45 minutes, pas d'interface cryptique." },
        { icon: 'shield', title: 'Transparence totale', desc: "On ne se connecte jamais à votre compte Vinted. Vos données restent les vôtres. Toujours." },
        { icon: 'zap', title: 'Résultats concrets', desc: "Chaque fonctionnalité existe parce qu'elle améliore vraiment vos ventes. Pas de gadget, que de l'utile." },
        { icon: 'users', title: 'Accessible à tous', desc: "Un plan gratuit pour démarrer, des prix honnêtes pour grandir. Vendre mieux ne devrait pas coûter cher." },
      ],
    },
    cta: { text: 'Prêt à tester ?', btn: 'Essayer gratuitement' },
  },
  en: {
    hero: {
      label: 'Our story',
      h1: 'Born from the frustration of selling on Vinted',
      lead: "Like millions of people, I started selling my clothes on Vinted. And like many, I quickly found myself spending hours preparing each listing: photographing the item, researching the right price, writing a description that would catch buyers' attention. All that to sell a shirt for €8.",
    },
    story: {
      title: 'From frustration to a tool',
      p1: "I realized the problem wasn't time — it was the tools. There was nothing simple and affordable to help casual sellers like me. The big sellers had their methods, but for the small ones, it was figure-it-out-yourself territory.",
      p2: "SellerLab AI was born from this simple idea: what if AI could do in 10 seconds what normally takes 20 minutes? Remove the background from a photo, calculate the right price, write a compelling listing. We worked on it for months, and we're proud of what we've built.",
    },
    mission: {
      title: 'Our mission',
      text: "Give Vinted sellers — whether they sell 5 items or 500 — the same tools as the pros. Simple, fast, accessible. Because selling better shouldn't require hours of work or marketing expertise.",
    },
    values: {
      title: 'Our values',
      items: [
        { icon: 'heart', title: 'Simplicity first', desc: 'A tool you understand in 30 seconds. No 45-minute tutorial, no cryptic interface.' },
        { icon: 'shield', title: 'Full transparency', desc: 'We never connect to your Vinted account. Your data stays yours. Always.' },
        { icon: 'zap', title: 'Concrete results', desc: "Every feature exists because it genuinely improves your sales. No gimmicks, only useful." },
        { icon: 'users', title: 'Accessible to all', desc: "A free plan to start, honest prices to grow. Selling better shouldn't cost a fortune." },
      ],
    },
    cta: { text: 'Ready to try it?', btn: 'Try for free' },
  },
  es: {
    hero: {
      label: 'Nuestra historia',
      h1: 'Nacidos de la frustración de vender en Vinted',
      lead: "Como millones de personas, empecé a vender mi ropa en Vinted. Y como muchos, pronto me encontré pasando horas preparando cada anuncio: fotografiar el artículo, buscar el precio correcto, redactar una descripción atractiva. Todo eso para vender una camisa por 8€.",
    },
    story: {
      title: 'De la frustración a la herramienta',
      p1: "Me di cuenta de que el problema no era el tiempo disponible, sino las herramientas. No existía nada simple y asequible para ayudar a los vendedores ocasionales como yo.",
      p2: "SellerLab AI nació de esta idea sencilla: ¿y si la IA pudiera hacer en 10 segundos lo que normalmente lleva 20 minutos? Eliminar el fondo de una foto, calcular el precio adecuado, redactar un anuncio impactante.",
    },
    mission: {
      title: 'Nuestra misión',
      text: "Dar a los vendedores de Vinted — tanto si venden 5 artículos como 500 — las mismas herramientas que los profesionales. Simples, rápidas, accesibles.",
    },
    values: {
      title: 'Nuestros valores',
      items: [
        { icon: 'heart', title: 'Simplicidad ante todo', desc: 'Una herramienta que se entiende en 30 segundos. Sin tutoriales interminables ni interfaces crípticas.' },
        { icon: 'shield', title: 'Transparencia total', desc: 'Nunca nos conectamos a tu cuenta de Vinted. Tus datos son siempre tuyos.' },
        { icon: 'zap', title: 'Resultados concretos', desc: 'Cada funcionalidad existe porque realmente mejora tus ventas. Sin adornos, solo lo útil.' },
        { icon: 'users', title: 'Accesible para todos', desc: 'Un plan gratuito para empezar, precios honestos para crecer.' },
      ],
    },
    cta: { text: '¿Listo para probarlo?', btn: 'Probar gratis' },
  },
  it: {
    hero: {
      label: 'La nostra storia',
      h1: 'Nati dalla frustrazione di vendere su Vinted',
      lead: "Come milioni di persone, ho iniziato a vendere i miei vestiti su Vinted. E come molti, mi sono ritrovato a passare ore a preparare ogni annuncio.",
    },
    story: {
      title: 'Dalla frustrazione allo strumento',
      p1: "Mi sono reso conto che il problema non era il tempo, ma gli strumenti. Non esisteva nulla di semplice e accessibile per aiutare i venditori occasionali come me.",
      p2: "SellerLab AI è nato da questa semplice idea: e se l'IA potesse fare in 10 secondi quello che normalmente richiede 20 minuti?",
    },
    mission: {
      title: 'La nostra missione',
      text: "Dare ai venditori Vinted gli stessi strumenti dei professionisti. Semplici, veloci, accessibili.",
    },
    values: {
      title: 'I nostri valori',
      items: [
        { icon: 'heart', title: 'Semplicità prima di tutto', desc: 'Uno strumento che si capisce in 30 secondi.' },
        { icon: 'shield', title: 'Trasparenza totale', desc: 'Non ci connettiamo mai al tuo account Vinted. I tuoi dati restano tuoi.' },
        { icon: 'zap', title: 'Risultati concreti', desc: 'Ogni funzionalità esiste perché migliora davvero le tue vendite.' },
        { icon: 'users', title: 'Accessibile a tutti', desc: 'Un piano gratuito per iniziare, prezzi onesti per crescere.' },
      ],
    },
    cta: { text: 'Pronto a provarlo?', btn: 'Prova gratis' },
  },
  de: {
    hero: {
      label: 'Unsere Geschichte',
      h1: 'Entstanden aus der Frustration über den Verkauf auf Vinted',
      lead: "Wie Millionen von Menschen habe ich angefangen, meine Kleidung auf Vinted zu verkaufen. Stunden für ein Hemd für 8€.",
    },
    story: {
      title: 'Von der Frustration zum Werkzeug',
      p1: "Ich erkannte, dass das Problem nicht die Zeit war, sondern die Werkzeuge. Es gab nichts Einfaches für Gelegenheitsverkäufer wie mich.",
      p2: "SellerLab AI entstand: Was wäre, wenn KI in 10 Sekunden das schafft, was normalerweise 20 Minuten dauert?",
    },
    mission: {
      title: 'Unsere Mission',
      text: "Vinted-Verkäufern dieselben Werkzeuge wie den Profis zu geben. Einfach, schnell, zugänglich.",
    },
    values: {
      title: 'Unsere Werte',
      items: [
        { icon: 'heart', title: 'Einfachheit zuerst', desc: 'Ein Tool, das du in 30 Sekunden verstehst.' },
        { icon: 'shield', title: 'Vollständige Transparenz', desc: 'Wir verbinden uns nie mit deinem Vinted-Konto.' },
        { icon: 'zap', title: 'Konkrete Ergebnisse', desc: 'Jede Funktion existiert, weil sie deine Verkäufe wirklich verbessert.' },
        { icon: 'users', title: 'Für alle zugänglich', desc: 'Ein kostenloser Plan zum Starten, faire Preise zum Wachsen.' },
      ],
    },
    cta: { text: 'Bereit, es auszuprobieren?', btn: 'Kostenlos testen' },
  },
  pl: {
    hero: {
      label: 'Nasza historia',
      h1: 'Zrodzeni z frustracji sprzedawania na Vinted',
      lead: 'Jak miliony ludzi, zacząłem sprzedawać ubrania na Vinted. Godziny pracy, żeby sprzedać koszulę za 8€.',
    },
    story: {
      title: 'Od frustracji do narzędzia',
      p1: 'Problem nie leżał w czasie, lecz w narzędziach. Nie istniało nic prostego dla okazjonalnych sprzedawców.',
      p2: 'SellerLab AI narodził się z pomysłu: a co jeśli AI mogłoby w 10 sekund zrobić to, co normalnie zajmuje 20 minut?',
    },
    mission: {
      title: 'Nasza misja',
      text: 'Dać sprzedawcom Vinted te same narzędzia co profesjonaliści. Proste, szybkie, dostępne.',
    },
    values: {
      title: 'Nasze wartości',
      items: [
        { icon: 'heart', title: 'Prostota przede wszystkim', desc: 'Narzędzie, które rozumiesz w 30 sekund.' },
        { icon: 'shield', title: 'Pełna przejrzystość', desc: 'Nigdy nie łączymy się z Twoim kontem Vinted.' },
        { icon: 'zap', title: 'Konkretne wyniki', desc: 'Każda funkcja naprawdę poprawia Twoje sprzedaże.' },
        { icon: 'users', title: 'Dostępne dla wszystkich', desc: 'Bezpłatny plan na start, uczciwe ceny do wzrostu.' },
      ],
    },
    cta: { text: 'Gotowy, by spróbować?', btn: 'Spróbuj za darmo' },
  },
  nl: {
    hero: {
      label: 'Ons verhaal',
      h1: 'Geboren uit de frustratie van verkopen op Vinted',
      lead: 'Zoals miljoenen mensen begon ik mijn kleding te verkopen op Vinted. Uren werk voor een shirt van 8€.',
    },
    story: {
      title: 'Van frustratie naar een tool',
      p1: 'Het probleem was niet de tijd, maar de tools. Er was niets eenvoudigs voor occasionele verkopers zoals ik.',
      p2: "SellerLab AI is geboren: wat als AI in 10 seconden kan doen wat normaal 20 minuten kost?",
    },
    mission: {
      title: 'Onze missie',
      text: 'Vinted-verkopers dezelfde tools geven als de professionals. Eenvoudig, snel, toegankelijk.',
    },
    values: {
      title: 'Onze waarden',
      items: [
        { icon: 'heart', title: 'Eenvoud eerst', desc: 'Een tool die je in 30 seconden begrijpt.' },
        { icon: 'shield', title: 'Volledige transparantie', desc: 'We verbinden nooit met je Vinted-account.' },
        { icon: 'zap', title: 'Concrete resultaten', desc: 'Elke functie verbetert je verkopen echt.' },
        { icon: 'users', title: 'Toegankelijk voor iedereen', desc: 'Een gratis plan om te starten, eerlijke prijzen om te groeien.' },
      ],
    },
    cta: { text: 'Klaar om het te proberen?', btn: 'Gratis proberen' },
  },
}

const VALUE_ICONS = {
  heart: Heart,
  shield: ShieldCheck,
  zap: Zap,
  users: Users,
}

export default function AboutContent() {
  const { lang } = useLang()
  const page = T[lang]

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <SiteHeader />

      <main>
        {/* Hero */}
        <section className="pt-28 pb-16 px-6 bg-white">
          <div className="max-w-3xl mx-auto animate-fade-up">
            <span className="text-indigo-600 text-xs font-bold uppercase tracking-[0.15em] block mb-4">
              {page.hero.label}
            </span>
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-gray-900 mb-6 leading-tight">
              {page.hero.h1}
            </h1>
            <p className="text-lg text-gray-500 leading-relaxed">{page.hero.lead}</p>
          </div>
        </section>

        {/* Histoire */}
        <section className="bg-gray-50 border-y border-gray-100 px-6 py-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-gray-900 mb-6">
              {page.story.title}
            </h2>
            <p className="text-gray-600 leading-relaxed mb-5 text-base">{page.story.p1}</p>
            <p className="text-gray-600 leading-relaxed text-base">{page.story.p2}</p>
          </div>
        </section>

        {/* Mission */}
        <section className="relative bg-[#080810] px-6 py-16 overflow-hidden" style={{backgroundImage:'radial-gradient(ellipse 70% 60% at 5% 90%, rgba(99,102,241,0.14) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 95% 10%, rgba(99,102,241,0.10) 0%, transparent 50%)'}}>
          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="border border-white/10 rounded-3xl p-10">
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white mb-5">
                {page.mission.title}
              </h2>
              <p className="text-gray-300 leading-relaxed text-lg">{page.mission.text}</p>
            </div>
          </div>
        </section>

        {/* Valeurs */}
        <section className="px-6 py-16 bg-white">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-gray-900 mb-10 text-center">
              {page.values.title}
            </h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {page.values.items.map((value) => {
                const Icon = VALUE_ICONS[value.icon as keyof typeof VALUE_ICONS]
                return (
                  <div
                    key={value.icon}
                    className="flex gap-5 p-7 bg-gray-50 rounded-2xl border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all group"
                  >
                    <div className="w-11 h-11 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1.5">{value.title}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">{value.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 pb-20 bg-white">
          <div className="max-w-md mx-auto text-center">
            <p className="text-lg font-semibold text-gray-900 mb-5">{page.cta.text}</p>
            <a
              href="/#inscription"
              className="btn-shimmer inline-block bg-indigo-600 text-white font-semibold px-10 py-4 rounded-full hover:bg-indigo-700 active:scale-95 transition-all text-base shadow-xl shadow-indigo-200/60"
            >
              {page.cta.btn}
            </a>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
