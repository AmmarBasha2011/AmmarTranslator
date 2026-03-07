import { translateToArabicToAmmar, translateAmmarToArabic } from './translator';

export type Language = 'en' | 'ar' | 'am' | 'fr' | 'tr' | 'de' | 'es';

export const LANGUAGES: { code: Language; name: string }[] = [
  { code: 'en', name: 'English' },
  { code: 'ar', name: 'Arabic' },
  { code: 'am', name: 'Ammar' },
  { code: 'fr', name: 'French' },
  { code: 'tr', name: 'Turkish' },
  { code: 'de', name: 'German' },
  { code: 'es', name: 'Spanish' },
];

function generateRandomEmail(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let user = '';
  for (let i = 0; i < 10; i++) {
    user += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${user}@gmail.com`;
}

async function translateWithMyMemory(text: string, source: string, target: string): Promise<string> {
  try {
    const email = generateRandomEmail();
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${source}|${target}&de=${email}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.responseStatus === 200) {
      return data.responseData.translatedText;
    } else {
      console.error('MyMemory API Error:', data);
      throw new Error(data.responseDetails || 'Translation failed');
    }
  } catch (error) {
    console.error('Translation error:', error);
    throw error;
  }
}

export async function translateText(text: string, from: Language, to: Language): Promise<string> {
  if (!text.trim()) return '';
  if (from === to) return text;

  // Ammar Logic
  if (from === 'am') {
    const arabicText = translateAmmarToArabic(text);
    if (to === 'ar') return arabicText;
    // Ammar -> Arabic -> Target
    return translateWithMyMemory(arabicText, 'ar', to);
  }

  if (to === 'am') {
    if (from === 'ar') {
      return translateToArabicToAmmar(text);
    }
    // Source -> Arabic -> Ammar
    const arabicText = await translateWithMyMemory(text, from, 'ar');
    return translateToArabicToAmmar(arabicText);
  }

  // Standard Translation
  return translateWithMyMemory(text, from, to);
}
