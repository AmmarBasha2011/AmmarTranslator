import { Handler } from '@netlify/functions';
import { translateToArabicToAmmar, translateAmmarToArabic, getAmmarPronunciation } from '../../src/services/translator';

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
    return '';
  } catch (error) {
    console.error('MyMemory API error:', error);
    return '';
  }
}

export const handler: Handler = async (event) => {
  const { text, from, to } = event.queryStringParameters || {};

  if (!text || !from || !to) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing parameters. text, from, and to are required.' }),
    };
  }

  try {
    const source = from.toLowerCase();
    const target = to.toLowerCase();
    let translated = '';

    if (source === target) {
      translated = text;
    } else if (source === 'ar' && target === 'am') {
      translated = translateToArabicToAmmar(text);
    } else if (source === 'am' && target === 'ar') {
      translated = translateAmmarToArabic(text);
    } else if (source === 'am') {
      const arabic = translateAmmarToArabic(text);
      if (target === 'ar') {
        translated = arabic;
      } else if (MY_MEMORY_LANGS[target]) {
        translated = await myMemoryTranslate(arabic, 'ar', MY_MEMORY_LANGS[target]);
      }
    } else if (target === 'am') {
      const arabic = source === 'ar' ? text : await myMemoryTranslate(text, MY_MEMORY_LANGS[source], 'ar');
      translated = translateToArabicToAmmar(arabic);
    } else if (MY_MEMORY_LANGS[source] && MY_MEMORY_LANGS[target]) {
      translated = await myMemoryTranslate(text, MY_MEMORY_LANGS[source], MY_MEMORY_LANGS[target]);
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Unsupported language pair.' }),
      };
    }

    const responseBody: any = {
      text,
      translated,
      from: source,
      to: target,
    };

    if (target === 'am') {
      responseBody.pronunciation = getAmmarPronunciation(translated);
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(responseBody),
    };
  } catch (error) {
    console.error('Translation Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
