import { translateToArabicToAmmar, translateAmmarToArabic } from './translator';

export type SupportedLanguage = 'en' | 'ar' | 'am' | 'fr' | 'tr' | 'de' | 'es';

const MY_MEMORY_LANGS: Record<string, string> = {
  en: 'en',
  ar: 'ar',
  fr: 'fr',
  tr: 'tr',
  de: 'de',
  es: 'es',
};

async function myMemoryTranslate(text: string, from: string, to: string): Promise<string> {
  const langpair = `${from}|${to}`;
  // Ensure parameters are encoded to prevent injection
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${encodeURIComponent(langpair)}`;

  try {
    const response = await fetch(url, {
        headers: {
            'User-Agent': 'AmmarTranslator/1.0'
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data.responseStatus === 200) {
      return data.responseData.translatedText;
    }
    // Don't leak full error details to client in production
    throw new Error('MyMemory translation failed');
  } catch (error) {
    console.error('MyMemory API error:', error);
    return '';
  }
}

export async function translate(text: string, from: SupportedLanguage, to: SupportedLanguage): Promise<string> {
  if (from === to) return text;

  // Validation of languages
  const validLangs = ['en', 'ar', 'am', 'fr', 'tr', 'de', 'es'];
  if (!validLangs.includes(from) || !validLangs.includes(to)) {
    throw new Error('Unsupported language');
  }

  // Case 1: Arabic <-> Ammar
  if (from === 'ar' && to === 'am') {
    return translateToArabicToAmmar(text);
  }
  if (from === 'am' && to === 'ar') {
    return translateAmmarToArabic(text);
  }

  // Case 2: Ammar <-> Others (Go through Arabic)
  if (from === 'am') {
    const arabic = translateAmmarToArabic(text);
    if (to === 'ar') return arabic;
    return myMemoryTranslate(arabic, 'ar', MY_MEMORY_LANGS[to]);
  }
  if (to === 'am') {
    const arabic = from === 'ar' ? text : await myMemoryTranslate(text, MY_MEMORY_LANGS[from], 'ar');
    return translateToArabicToAmmar(arabic);
  }

  // Case 3: Standard language pair (Use MyMemory)
  return myMemoryTranslate(text, MY_MEMORY_LANGS[from], MY_MEMORY_LANGS[to]);
}
