'use client'

import { useState, useEffect } from 'react'
import { useLang } from '@/app/providers'
import { Cookie } from 'lucide-react'

/* Textes de la bannière cookies — RGPD / AEPD (Espagne) */
const T = {
  fr: {
    text: 'Nous utilisons des cookies pour améliorer votre expérience et analyser le trafic de façon anonyme.',
    accept: 'Accepter',
    reject: 'Refuser',
    privacy: 'Politique de confidentialité',
  },
  en: {
    text: 'We use cookies to improve your experience and analyse traffic anonymously.',
    accept: 'Accept',
    reject: 'Decline',
    privacy: 'Privacy Policy',
  },
  es: {
    text: 'Usamos cookies para mejorar tu experiencia y analizar el tráfico de forma anónima.',
    accept: 'Aceptar',
    reject: 'Rechazar',
    privacy: 'Política de privacidad',
  },
  it: {
    text: 'Utilizziamo i cookie per migliorare la tua esperienza e analizzare il traffico in modo anonimo.',
    accept: 'Accetta',
    reject: 'Rifiuta',
    privacy: 'Privacy',
  },
  de: {
    text: 'Wir verwenden Cookies, um deine Erfahrung zu verbessern und den Traffic anonym zu analysieren.',
    accept: 'Akzeptieren',
    reject: 'Ablehnen',
    privacy: 'Datenschutz',
  },
  pl: {
    text: 'Używamy plików cookie, aby poprawić Twoje doświadczenie i anonimowo analizować ruch.',
    accept: 'Akceptuj',
    reject: 'Odrzuć',
    privacy: 'Prywatność',
  },
  nl: {
    text: 'We gebruiken cookies om je ervaring te verbeteren en het verkeer anoniem te analyseren.',
    accept: 'Accepteren',
    reject: 'Weigeren',
    privacy: 'Privacybeleid',
  },
}

export default function CookieBanner() {
  const { lang } = useLang()
  const t = T[lang]
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem('sl-cookies')) setVisible(true)
  }, [])

  const handleChoice = (accepted: boolean) => {
    localStorage.setItem('sl-cookies', accepted ? 'accepted' : 'rejected')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-[420px] z-50 animate-fade-up">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl shadow-black/8 p-5">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
            <Cookie className="w-4.5 h-4.5 text-indigo-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-1">Cookies</p>
            <p className="text-xs text-gray-500 leading-relaxed">
              {t.text}{' '}
              <a
                href="/confidentialite"
                className="text-indigo-600 hover:text-indigo-800 underline underline-offset-2"
              >
                {t.privacy}
              </a>
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleChoice(false)}
            className="flex-1 text-sm font-semibold text-gray-600 border border-gray-200 px-4 py-2.5 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all"
          >
            {t.reject}
          </button>
          <button
            onClick={() => handleChoice(true)}
            className="flex-1 text-sm font-semibold bg-indigo-600 text-white px-4 py-2.5 rounded-xl hover:bg-indigo-700 active:scale-95 transition-all"
          >
            {t.accept}
          </button>
        </div>
      </div>
    </div>
  )
}
