
import { useCallback, useState, useEffect } from 'react';

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

    // For Ammar, we strip modifiers to make it readable by standard TTS
    let textToSpeak = text;
    let voiceLang = 'ar-SA';

    if (lang === 'am') {
      // Strip unicode modifiers for better pronunciation
      textToSpeak = text.normalize("NFD").replace(/[\u0300-\u036f\u1d43]/g, "");
      voiceLang = 'en-US'; // Use English voice for Latin chars
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
