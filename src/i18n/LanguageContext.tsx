import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { ko } from './ko';
import { en } from './en';

type Lang = 'ko' | 'en';
type Translations = typeof ko;

interface LanguageContextType {
  lang: Lang;
  t: Translations;
  toggleLang: () => void;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    const saved = localStorage.getItem('podong_language');
    return saved === 'ko' || saved === 'en' ? saved : 'en';
  });

  const t = lang === 'ko' ? ko : en;

  const toggleLang = () => {
    const next: Lang = lang === 'ko' ? 'en' : 'ko';
    setLang(next);
    localStorage.setItem('podong_language', next);
  };

  return (
    <LanguageContext.Provider value={{ lang, t, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
