"use client";

import React, { createContext, useState, useEffect, useCallback, type ReactNode } from "react";
import en from "@/lib/locales/en.json";
import hi from "@/lib/locales/hi.json";

type Language = "en" | "hi";

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, replacements?: { [key: string]: string }) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = { en, hi };

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const storedLanguage = localStorage.getItem("language") as Language;
    if (storedLanguage && (storedLanguage === "en" || storedLanguage === "hi")) {
      setLanguageState(storedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
    if (lang === 'hi') {
      document.body.style.fontFamily = '"Hind", sans-serif';
    } else {
      document.body.style.fontFamily = '"PT Sans", sans-serif';
    }
  };

  const t = useCallback((key: string, replacements?: { [key: string]: string }) => {
    const keys = key.split('.');
    let translation = translations[language];

    for (const k of keys) {
      if (translation && typeof translation === 'object' && k in translation) {
        translation = (translation as any)[k];
      } else {
        return key; // Return the key if not found
      }
    }

    if (typeof translation === 'string') {
        if (replacements) {
            return Object.entries(replacements).reduce((acc, [key, value]) => {
                return acc.replace(`{{${key}}}`, value);
            }, translation);
        }
        return translation;
    }

    return key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
