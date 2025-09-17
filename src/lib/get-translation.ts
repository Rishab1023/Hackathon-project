import 'server-only'
import { cookies } from 'next/headers'
import en from "@/lib/locales/en.json";
import hi from "@/lib/locales/hi.json";

const translations = { en, hi };

type Language = keyof typeof translations;

export async function getTranslations() {
  const langCookie = cookies().get('language');
  const lang = (langCookie?.value ?? 'en') as Language;
  const translation = translations[lang] || en;

  return function t(key: string, replacements?: { [key: string]: string }) {
     const keys = key.split('.');
    let result: any = translation;

    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = result[k];
      } else {
        return key; // Return the key if not found
      }
    }

    if (typeof result === 'string') {
        if (replacements) {
            return Object.entries(replacements).reduce((acc, [key, value]) => {
                return acc.replace(`{{${key}}}`, value);
            }, result);
        }
        return result;
    }

    return key;
  }
}
