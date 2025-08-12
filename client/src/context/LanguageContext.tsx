import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Language, TranslationKeys } from '../i18n/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationKeys;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Tarayıcı dilini algıla
const detectBrowserLanguage = (): Language => {
  const browserLang = navigator.language.toLowerCase();
  
  if (browserLang.startsWith('tr')) return 'tr';
  if (browserLang.startsWith('zh')) return 'zh';
  return 'en'; // varsayılan
};

// LocalStorage'dan dil tercihi al
const getSavedLanguage = (): Language => {
  const saved = localStorage.getItem('erotify-language');
  if (saved && ['tr', 'en', 'zh'].includes(saved)) {
    return saved as Language;
  }
  return detectBrowserLanguage();
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(getSavedLanguage);

  useEffect(() => {
    localStorage.setItem('erotify-language', language);
  }, [language]);

  const contextValue: LanguageContextType = {
    language,
    setLanguage,
    t: translations[language]
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
