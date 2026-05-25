'use client'

import { useState } from 'react'
import { useLang } from '@/app/providers'
import SiteHeader from '@/app/components/SiteHeader'
import SiteFooter from '@/app/components/SiteFooter'
import { Mail, Clock, CheckCircle } from 'lucide-react'

/* Traductions de la page Contact */
const T = {
  fr: {
    title: 'Contactez-nous',
    subtitle: "Une question, une idée ou un problème ? Notre équipe vous répond sous 24 à 48 heures.",
    email: 'Email',
    response: 'Délai de réponse',
    responseTime: '24 à 48 heures',
    form: {
      name: 'Votre prénom',
      emailField: 'Votre adresse e-mail',
      subject: 'Sujet',
      subjects: ['Question générale', 'Problème technique', 'Facturation', 'Partenariat', 'Autre'],
      message: 'Votre message',
      messagePlaceholder: 'Décrivez votre demande en détail...',
      send: 'Envoyer le message',
    },
    success: { title: 'Message envoyé !', body: "Merci pour votre message. Nous vous répondrons dans les 24 à 48 heures." },
  },
  en: {
    title: 'Contact us',
    subtitle: "A question, an idea or a problem? Our team will get back to you within 24 to 48 hours.",
    email: 'Email',
    response: 'Response time',
    responseTime: '24 to 48 hours',
    form: {
      name: 'Your first name',
      emailField: 'Your email address',
      subject: 'Subject',
      subjects: ['General question', 'Technical issue', 'Billing', 'Partnership', 'Other'],
      message: 'Your message',
      messagePlaceholder: 'Describe your request in detail...',
      send: 'Send message',
    },
    success: { title: 'Message sent!', body: 'Thank you for your message. We will get back to you within 24 to 48 hours.' },
  },
  es: {
    title: 'Contáctanos',
    subtitle: "¿Una pregunta, una idea o un problema? Nuestro equipo te responderá en 24 a 48 horas.",
    email: 'Email',
    response: 'Tiempo de respuesta',
    responseTime: '24 a 48 horas',
    form: {
      name: 'Tu nombre',
      emailField: 'Tu dirección de correo electrónico',
      subject: 'Asunto',
      subjects: ['Pregunta general', 'Problema técnico', 'Facturación', 'Colaboración', 'Otro'],
      message: 'Tu mensaje',
      messagePlaceholder: 'Describe tu solicitud en detalle...',
      send: 'Enviar mensaje',
    },
    success: { title: '¡Mensaje enviado!', body: 'Gracias por tu mensaje. Te responderemos en 24 a 48 horas.' },
  },
  it: {
    title: 'Contattaci',
    subtitle: "Una domanda, un'idea o un problema? Il nostro team ti risponderà entro 24-48 ore.",
    email: 'Email',
    response: 'Tempo di risposta',
    responseTime: '24-48 ore',
    form: {
      name: 'Il tuo nome',
      emailField: 'Il tuo indirizzo email',
      subject: 'Oggetto',
      subjects: ['Domanda generale', 'Problema tecnico', 'Fatturazione', 'Partnership', 'Altro'],
      message: 'Il tuo messaggio',
      messagePlaceholder: 'Descrivi la tua richiesta in dettaglio...',
      send: 'Invia messaggio',
    },
    success: { title: 'Messaggio inviato!', body: 'Grazie per il tuo messaggio. Ti risponderemo entro 24-48 ore.' },
  },
  de: {
    title: 'Kontakt',
    subtitle: 'Eine Frage, eine Idee oder ein Problem? Unser Team antwortet innerhalb von 24 bis 48 Stunden.',
    email: 'E-Mail',
    response: 'Antwortzeit',
    responseTime: '24 bis 48 Stunden',
    form: {
      name: 'Dein Vorname',
      emailField: 'Deine E-Mail-Adresse',
      subject: 'Betreff',
      subjects: ['Allgemeine Frage', 'Technisches Problem', 'Abrechnung', 'Partnerschaft', 'Sonstiges'],
      message: 'Deine Nachricht',
      messagePlaceholder: 'Beschreibe dein Anliegen ausführlich...',
      send: 'Nachricht senden',
    },
    success: { title: 'Nachricht gesendet!', body: 'Danke für deine Nachricht. Wir antworten dir innerhalb von 24 bis 48 Stunden.' },
  },
  pl: {
    title: 'Kontakt',
    subtitle: 'Pytanie, pomysł lub problem? Nasz zespół odpowie w ciągu 24-48 godzin.',
    email: 'Email',
    response: 'Czas odpowiedzi',
    responseTime: '24-48 godzin',
    form: {
      name: 'Twoje imię',
      emailField: 'Twój adres email',
      subject: 'Temat',
      subjects: ['Ogólne pytanie', 'Problem techniczny', 'Płatności', 'Współpraca', 'Inne'],
      message: 'Twoja wiadomość',
      messagePlaceholder: 'Opisz swoje zapytanie szczegółowo...',
      send: 'Wyślij wiadomość',
    },
    success: { title: 'Wiadomość wysłana!', body: 'Dziękujemy za wiadomość. Odpowiemy w ciągu 24-48 godzin.' },
  },
  nl: {
    title: 'Contact',
    subtitle: 'Een vraag, een idee of een probleem? Ons team reageert binnen 24 tot 48 uur.',
    email: 'E-mail',
    response: 'Reactietijd',
    responseTime: '24 tot 48 uur',
    form: {
      name: 'Je voornaam',
      emailField: 'Je e-mailadres',
      subject: 'Onderwerp',
      subjects: ['Algemene vraag', 'Technisch probleem', 'Facturering', 'Samenwerking', 'Anders'],
      message: 'Je bericht',
      messagePlaceholder: 'Beschrijf je vraag in detail...',
      send: 'Bericht versturen',
    },
    success: { title: 'Bericht verzonden!', body: 'Bedankt voor je bericht. We reageren binnen 24 tot 48 uur.' },
  },
}

/* Classes partagées pour les champs du formulaire */
const inputClass =
  'w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 bg-white transition-all hover:border-gray-300'

export default function ContactContent() {
  const { lang } = useLang()
  const page = T[lang]
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <SiteHeader />

      <main className="pt-28 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">

            {/* Informations de contact */}
            <div className="animate-fade-up">
              <p className="text-indigo-600 text-xs font-bold uppercase tracking-[0.15em] mb-3">Contact</p>
              <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-gray-900 mb-5 leading-tight">
                {page.title}
              </h1>
              <p className="text-gray-500 mb-10 leading-relaxed text-base">{page.subtitle}</p>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors">
                  <div className="w-11 h-11 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-semibold mb-0.5 uppercase tracking-wider">{page.email}</p>
                    <a
                      href="mailto:contact@sellerlab.ai"
                      className="text-sm font-semibold text-gray-900 hover:text-indigo-600 transition-colors"
                    >
                      contact@sellerlab.ai
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors">
                  <div className="w-11 h-11 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-semibold mb-0.5 uppercase tracking-wider">{page.response}</p>
                    <p className="text-sm font-semibold text-gray-900">{page.responseTime}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Formulaire */}
            <div className="bg-gray-50 rounded-3xl border border-gray-100 p-8 shadow-sm animate-fade-up-d1">
              {sent ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <h2 className="font-display font-bold text-2xl text-gray-900 mb-3">{page.success.title}</h2>
                  <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">{page.success.body}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">
                      {page.form.name}
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">
                      {page.form.emailField}
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">
                      {page.form.subject}
                    </label>
                    <select
                      required
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className={inputClass}
                    >
                      <option value="">—</option>
                      {page.form.subjects.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">
                      {page.form.message}
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder={page.form.messagePlaceholder}
                      className={`${inputClass} resize-none`}
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn-shimmer w-full bg-indigo-600 text-white font-semibold py-3.5 rounded-full hover:bg-indigo-700 active:scale-95 transition-all text-sm shadow-md shadow-indigo-200/60"
                  >
                    {page.form.send}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
