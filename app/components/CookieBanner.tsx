'use client'

import { useState, useEffect } from 'react'
import { useLang } from '@/app/providers'

const T = {
  fr: { text: 'Nous utilisons des cookies pour améliorer votre expérience et analyser le trafic.', accept: 'Accepter', reject: 'Refuser', privacy: 'Politique de confidentialité' },
  en: { text: 'We use cookies to improve your experience and analyze traffic.', accept: 'Accept', reject: 'Decline', privacy: 'Privacy Policy' },
  es: { text: 'Usamos cookies para mejorar tu experiencia y analizar el tráfico.', accept: 'Aceptar', reject: 'Rechazar', privacy: 'Política de privacidad' },
  it: { text: 'Utilizziamo i cookie per migliorare la tua esperienza e analizzare il traffico.', accept: 'Accetta', reject: 'Rifiuta', privacy: 'Informativa sulla Privacy' },
  de: { text: 'Wir verwenden Cookies, um deine Erfahrung zu verbessern und den Traffic zu analysieren.', accept: 'Akzeptieren', reject: 'Ablehnen', privacy: 'Datenschutzrichtlinie' },
  pl: { text: 'Używamy plików cookie, aby poprawić Twoje doświadczenie i analizować ruch.', accept: 'Akceptuj', reject: 'Odrzuć', privacy: 'Polityka Prywatności' },
  nl: { text: 'We gebruiken cookies om je ervaring te verbeteren en het verkeer te analyseren.', accept: 'Accepteren', reject: 'Weigeren', privacy: 'Privacybeleid' },
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
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-lg px-6 py-4">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-600 flex-1">
          {t.text}{' '}
          <a href="/confidentialite" className="underline text-indigo-600 hover:text-indigo-800">
            {t.privacy}
          </a>
        </p>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => handleChoice(false)}
            className="text-sm text-gray-500 border border-gray-200 px-4 py-2 rounded-full hover:bg-gray-50 transition-colors"
          >
            {t.reject}
          </button>
          <button
            onClick={() => handleChoice(true)}
            className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition-colors font-semibold"
          >
            {t.accept}
          </button>
        </div>
      </div>
    </div>
  )
}
