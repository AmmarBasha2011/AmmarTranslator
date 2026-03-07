import { translateToArabicToAmmar, translateAmmarToArabic, getAmmarPronunciation } from './translator';

export type SupportedLanguage = 'en' | 'ar' | 'am' | 'fr' | 'tr' | 'de' | 'es';

export interface TranslationResult {
  text: string;
  pronunciation?: string;
}

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
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${encodeURIComponent(langpair)}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.responseStatus === 200) {
      return data.responseData.translatedText;
    }
    throw new Error(data.responseDetails || 'MyMemory translation failed');
  } catch (error) {
    console.error('MyMemory API error:', error);
    return '';
  }
}

export async function translate(text: string, from: SupportedLanguage, to: SupportedLanguage): Promise<TranslationResult> {
  if (from === to) return { text };

  let result = '';

  // Case 1: Arabic <-> Ammar
  if (from === 'ar' && to === 'am') {
    result = translateToArabicToAmmar(text);
  } else if (from === 'am' && to === 'ar') {
    result = translateAmmarToArabic(text);
  }
  // Case 2: Ammar <-> Others (Go through Arabic)
  else if (from === 'am') {
    const arabic = translateAmmarToArabic(text);
    if (to === 'ar') result = arabic;
    else result = await myMemoryTranslate(arabic, 'ar', MY_MEMORY_LANGS[to]);
  } else if (to === 'am') {
    const arabic = from === 'ar' ? text : await myMemoryTranslate(text, MY_MEMORY_LANGS[from], 'ar');
    result = translateToArabicToAmmar(arabic);
  }
  // Case 3: Standard language pair (Use MyMemory)
  else {
    result = await myMemoryTranslate(text, MY_MEMORY_LANGS[from], MY_MEMORY_LANGS[to]);
  }

  const finalResult: TranslationResult = { text: result };
  if (to === 'am') {
    finalResult.pronunciation = getAmmarPronunciation(result);
  }
  return finalResult;
}
