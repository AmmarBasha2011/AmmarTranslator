
import { useCallback, useState, useEffect } from 'react';

// Phonetic Mapping for Ammar -> Arabic TTS
const AMMAR_PHONETIC_MAP: Record<string, string> = {
  // Prefixes & Suffixes (Prioritize these)
  'mu': 'مُو',
  'lo': 'لُو',
  'ri': 'رِي',
  'ax': 'أَكْسْ',
  'um': 'أُومْ',

  // Special Characters
  'å': 'أ',
  's̶̊': 'ص',
  'Ṯ̶': 'ظ',
  'aᵃ̊': 'غ',
  'aᵃ': 'ع',
  'H̅': 'ح',
  'H̱': 'خ',
  's̊': 'ث',
  'z̊': 'ذ',
  'ş': 'ش',
  'Ṯ': 'ط',
  's̶': 'ض',
  'f̱': 'ق',

  // Basic Characters
  'a': 'ا',
  'b': 'ب',
  'c': 'ك', // Assuming c=k
  'd': 'د',
  'e': 'ي', // Approximation
  'f': 'ف',
  'g': 'ج',
  'h': 'ه',
  'i': 'ي',
  'j': 'ج',
  'k': 'ك',
  'l': 'ل',
  'm': 'م',
  'n': 'ن',
  'o': 'و', // Approximation
  'p': 'ب', // Arabic doesn't have P
  'q': 'ك',
  'r': 'ر',
  's': 'س',
  't': 'ت',
  'u': 'و',
  'v': 'ف', // Arabic doesn't have V
  'w': 'و',
  'x': 'كس',
  'y': 'ي',
  'z': 'ز',
  
  // Uppercase (if any remain, though usually mapped to special chars)
  'A': 'ا',
  'B': 'ب',
  'C': 'ك',
  'D': 'د',
  'E': 'ي',
  'F': 'ف',
  'G': 'ج',
  'H': 'ه',
  'I': 'ي',
  'J': 'ج',
  'K': 'ك',
  'L': 'ل',
  'M': 'م',
  'N': 'ن',
  'O': 'و',
  'P': 'ب',
  'Q': 'ك',
  'R': 'ر',
  'S': 'س',
  'T': 'ت',
  'U': 'و',
  'V': 'ف',
  'W': 'و',
  'X': 'كس',
  'Y': 'ي',
  'Z': 'ز',
};

function convertAmmarToArabicPhonetic(text: string): string {
  let processed = text;
  
  // 1. Sort keys by length descending to ensure greedy matching (e.g. 'mu' before 'm')
  const keys = Object.keys(AMMAR_PHONETIC_MAP).sort((a, b) => b.length - a.length);
  
  // We can't just use simple replaceAll because of overlapping matches and the need to process sequentially.
  // However, since we are mapping to Arabic, and the input is Latin/Ammar, we can iterate through the string.
  
  let result = "";
  let i = 0;
  
  while (i < processed.length) {
    let matchFound = false;
    
    for (const key of keys) {
      if (processed.startsWith(key, i)) {
        result += AMMAR_PHONETIC_MAP[key];
        i += key.length;
        matchFound = true;
        break;
      }
    }
    
    if (!matchFound) {
      // If no match, keep the character (or ignore it if it's a modifier not in map)
      // But for TTS, maybe better to skip unknown chars or keep them?
      // Let's keep them, maybe the Arabic voice can read English letters too.
      result += processed[i];
      i++;
    }
  }
  
  return result;
}

export function useTextToSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = useCallback((text: string, lang: 'ar' | 'am' = 'ar') => {
    if (!('speechSynthesis' in window)) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    let textToSpeak = text;
    let voiceLang = 'ar-SA';

    if (lang === 'am') {
      // Convert Ammar to Arabic Phonetic
      textToSpeak = convertAmmarToArabicPhonetic(text);
      // Force Arabic voice since we converted it to Arabic script
      voiceLang = 'ar-SA'; 
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = voiceLang;
    utterance.rate = 0.9; // Slightly slower for clarity

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  return { speak, stop, isSpeaking };
}
