import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Copy, ArrowRightLeft, Sparkles, X, AlertTriangle, CheckCircle2, Volume2, Mic, MicOff } from 'lucide-react';
import { validateInput, ValidationError } from '../services/validator';
import { isArabicText } from '../constants';
import { cn } from '../lib/utils';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { translate, SupportedLanguage } from '../services/translationService';

const LANGUAGES: { code: SupportedLanguage; name: string }[] = [
  { code: 'ar', name: 'ARABIC' },
  { code: 'am', name: 'AMMAR' },
  { code: 'en', name: 'ENGLISH' },
  { code: 'fr', name: 'FRENCH' },
  { code: 'tr', name: 'TURKISH' },
  { code: 'de', name: 'GERMAN' },
  { code: 'es', name: 'SPANISH' },
];

export default function TranslatorView() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [fromLang, setFromLang] = useState<SupportedLanguage | 'auto'>('auto');
  const [toLang, setToLang] = useState<SupportedLanguage>('am');
  const [detectedLang, setDetectedLang] = useState<SupportedLanguage>('ar');
  const [copied, setCopied] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [isTranslating, setIsTranslating] = useState(false);

  const { speak, stop: stopSpeaking, isSpeaking } = useTextToSpeech();
  
  const handleSpeechResult = React.useCallback((text: string) => {
    setInputText(prev => prev ? `${prev} ${text}` : text);
  }, []);

  const { isListening, isSupported: isSpeechSupported, startListening, stopListening } = useSpeechRecognition({
    onResult: handleSpeechResult,
    lang: fromLang === 'auto' ? (detectedLang === 'ar' ? 'ar-SA' : 'en-US') : (fromLang === 'ar' ? 'ar-SA' : 'en-US')
  });

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!inputText.trim()) {
        setOutputText('');
        setValidationErrors([]);
        return;
      }

      const errors = validateInput(inputText, fromLang);
      setValidationErrors(errors);

      let currentFrom = fromLang;
      if (fromLang === 'auto') {
        const isAr = isArabicText(inputText);
        currentFrom = isAr ? 'ar' : 'en';
        setDetectedLang(currentFrom as SupportedLanguage);
      } else {
        setDetectedLang(fromLang as SupportedLanguage);
      }

      setIsTranslating(true);
      try {
        const result = await translate(inputText, currentFrom as SupportedLanguage, toLang);
        setOutputText(result);
      } catch (e) {
        console.error("Translation failed", e);
      } finally {
        setIsTranslating(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [inputText, fromLang, toLang]);

  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const swapLanguages = () => {
    if (fromLang === 'auto') {
      setFromLang(toLang);
      setToLang(detectedLang);
    } else {
      const temp = fromLang;
      setFromLang(toLang);
      setToLang(temp);
    }
  };

  const applySuggestion = (error: ValidationError) => {
    if (error.suggestion) {
      setInputText(prev => prev.replace(error.word, error.suggestion!));
    }
  };

  const handleInputTTS = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speak(inputText, fromLang === 'auto' ? detectedLang : fromLang);
    }
  };

  const handleOutputTTS = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speak(outputText, toLang);
    }
  };

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-24 max-w-2xl mx-auto">

      {/* Language Bar */}
      <div className="flex items-center justify-between gap-4 glass p-3 rounded-2xl border border-white/5 neo-blur group">
        <div className="relative flex-1">
          <select
            value={fromLang}
            onChange={(e) => setFromLang(e.target.value as any)}
            className="w-full bg-black/30 text-xs font-black tracking-widest text-neon-cyan focus:outline-none cursor-pointer p-3 rounded-xl appearance-none border border-white/5 hover:border-neon-cyan/30 transition-all uppercase"
          >
            <option value="auto">Auto-Detect ({detectedLang.toUpperCase()})</option>
            {LANGUAGES.map(lang => (
              <option key={lang.code} value={lang.code}>{lang.name}</option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
            <div className="w-1.5 h-1.5 border-r border-b border-neon-cyan rotate-45" />
          </div>
        </div>

        <button
          onClick={swapLanguages}
          className="p-3 rounded-full bg-neon-cyan/10 hover:bg-neon-cyan text-neon-cyan hover:text-deep-space transition-all active:scale-90 border border-neon-cyan/20 group-hover:neo-blur"
        >
          <ArrowRightLeft size={18} />
        </button>

        <div className="relative flex-1">
          <select
            value={toLang}
            onChange={(e) => setToLang(e.target.value as any)}
            className="w-full bg-black/30 text-xs font-black tracking-widest text-electric-purple focus:outline-none cursor-pointer p-3 rounded-xl appearance-none border border-white/5 hover:border-electric-purple/30 transition-all uppercase text-right"
          >
            {LANGUAGES.map(lang => (
              <option key={lang.code} value={lang.code}>{lang.name}</option>
            ))}
          </select>
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
            <div className="w-1.5 h-1.5 border-l border-b border-electric-purple rotate-45" />
          </div>
        </div>
      </div>

      {/* Input Box */}
      <div className="relative">
        <div className={cn(
          "absolute -inset-1 rounded-3xl blur-md opacity-20 transition duration-500",
          validationErrors.length > 0 ? "bg-red-500" : "bg-neon-cyan"
        )}></div>

        <div className={cn(
          "relative glass rounded-3xl overflow-hidden transition-all duration-300",
          validationErrors.length > 0 ? "border-red-500/30" : "border-white/10"
        )}>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="ENTER SOURCE TEXT..."
            className="w-full h-48 sm:h-56 bg-transparent p-6 text-xl sm:text-2xl resize-none focus:outline-none placeholder:text-muted-grey font-black tracking-tight leading-snug"
            dir="auto"
          />
          
          <div className="absolute top-6 right-6 flex items-center gap-3">
            {inputText && (
              <button
                onClick={handleInputTTS}
                className="p-3 rounded-xl bg-white/5 text-muted-grey hover:text-neon-cyan hover:bg-neon-cyan/10 transition-all active:scale-95 border border-white/10"
              >
                <Volume2 size={18} className={isSpeaking ? "text-neon-cyan animate-pulse" : ""} />
              </button>
            )}

            {isSpeechSupported && (fromLang === 'ar' || (fromLang === 'auto' && detectedLang === 'ar')) && (
              <button
                onClick={handleMicClick}
                className={cn(
                  "p-3 rounded-xl transition-all active:scale-95 border",
                  isListening 
                    ? "bg-red-500/20 text-red-400 border-red-500/30 animate-pulse"
                    : "bg-white/5 text-muted-grey hover:text-bright-white hover:bg-white/10 border-white/10"
                )}
              >
                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
              </button>
            )}

            {inputText && (
              <button 
                onClick={() => { setInputText(''); setOutputText(''); setValidationErrors([]); }}
                className="p-3 rounded-xl bg-white/5 text-muted-grey hover:text-white hover:bg-red-500/20 transition-all border border-white/10"
              >
                <X size={18} />
              </button>
            )}
          </div>

          <div className="absolute bottom-6 left-6">
             <AnimatePresence>
               {isTranslating && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 text-[10px] font-black tracking-widest text-neon-cyan"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-ping" />
                    NEURAL PROCESSING...
                  </motion.div>
               )}
             </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Validation */}
      <AnimatePresence>
        {validationErrors.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass border-red-500/30 rounded-2xl p-4 bg-red-500/5"
          >
            <div className="flex items-center gap-2 text-red-400 font-black text-xs uppercase tracking-widest mb-3">
              <AlertTriangle size={14} />
              <span>SYNTAX ANOMALIES DETECTED</span>
            </div>
            <div className="space-y-2">
              {validationErrors.map((error, idx) => (
                <div key={idx} className="flex items-start justify-between gap-4 bg-black/20 p-3 rounded-xl border border-red-500/10">
                  <p className="text-sm text-red-300/80 leading-tight">
                    <span className="font-black text-red-400 uppercase tracking-tighter italic">[{error.word}]</span> {error.message}
                  </p>
                  {error.suggestion && (
                    <button
                      onClick={() => applySuggestion(error)}
                      className="whitespace-nowrap flex items-center gap-1.5 text-[10px] font-black text-neon-cyan hover:text-bright-white transition-colors bg-neon-cyan/10 px-2 py-1 rounded-lg"
                    >
                      <CheckCircle2 size={12} />
                      REPAIR
                    </button>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Output Box */}
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-neon-cyan/20 to-electric-purple/20 rounded-3xl blur-md opacity-30"></div>
        <div className="relative glass rounded-3xl border border-white/10 overflow-hidden min-h-[160px] flex flex-col group/output transition-all duration-300 hover:border-neon-cyan/30 shadow-2xl">
          <div className="flex-1 p-6">
            {outputText ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xl sm:text-2xl font-black tracking-tight leading-snug text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-electric-purple"
                dir="auto"
              >
                {outputText}
              </motion.p>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-muted-grey/30 gap-4 mt-4">
                <Sparkles size={32} />
                <span className="text-xs font-black tracking-widest uppercase">Awaiting Sequence Input</span>
              </div>
            )}
          </div>
          
          <div className="bg-black/40 p-4 px-6 flex justify-between items-center border-t border-white/5">
            <div className="flex gap-2">
              {outputText && (
                <button
                  onClick={handleOutputTTS}
                  className="p-3 rounded-xl bg-white/5 hover:bg-neon-cyan/10 text-muted-grey hover:text-neon-cyan transition-all border border-white/5"
                >
                   <Volume2 size={18} className={isSpeaking ? "text-neon-cyan animate-pulse" : ""} />
                </button>
              )}
            </div>

            <button
              onClick={handleCopy}
              disabled={!outputText}
              className="flex items-center gap-2.5 px-6 py-3 rounded-xl bg-neon-cyan/10 hover:bg-neon-cyan disabled:opacity-30 disabled:cursor-not-allowed transition-all text-xs font-black tracking-widest text-neon-cyan hover:text-deep-space border border-neon-cyan/20 uppercase"
            >
              {copied ? (
                <span className="text-bright-white">INITIALIZED</span>
              ) : (
                <>
                  <Copy size={14} />
                  <span>TRANSMIT</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
