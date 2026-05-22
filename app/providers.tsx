'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import type { Lang } from '@/lib/i18n'

interface LangContextValue {
  lang: Lang
  setLang: (l: Lang) => void
}

const LangContext = createContext<LangContextValue>({ lang: 'fr', setLang: () => {} })

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('fr')

  useEffect(() => {
    const stored = localStorage.getItem('sl-lang') as Lang
    if (stored && ['fr', 'es', 'en'].includes(stored)) setLangState(stored)
  }, [])

  const setLang = (l: Lang) => {
    setLangState(l)
    localStorage.setItem('sl-lang', l)
  }

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>
}

export function useLang() {
  return useContext(LangContext)
}
