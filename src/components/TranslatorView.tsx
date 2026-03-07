import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Copy, ArrowRightLeft, Volume2, Mic, MicOff, Globe, Terminal, Cpu, Zap, Loader2, Check, X, AlertCircle } from 'lucide-react';
import { translateToArabicToAmmar, translateAmmarToArabic } from '../services/translator';
import { validateInput, ValidationError } from '../services/validator';
import { isArabicText } from '../constants';
import { cn } from '../lib/utils';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { translateText, LANGUAGES, Language } from '../services/translation';

export default function TranslatorView() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [sourceLang, setSourceLang] = useState<Language>('ar');
  const [targetLang, setTargetLang] = useState<Language>('am');
  const [copied, setCopied] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [isTranslating, setIsTranslating] = useState(false);

  const { speak, stop: stopSpeaking, isSpeaking } = useTextToSpeech();
  
  const handleSpeechResult = React.useCallback((text: string) => {
    setInputText(prev => prev ? `${prev} ${text}` : text);
  }, []);

  const { isListening, isSupported: isSpeechSupported, startListening, stopListening } = useSpeechRecognition({
    onResult: handleSpeechResult,
    lang: sourceLang === 'ar' ? 'ar-SA' : sourceLang === 'en' ? 'en-US' : 'fr-FR'
  });

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!inputText.trim()) {
        setOutputText('');
        setValidationErrors([]);
        return;
      }

      if (sourceLang === 'am') {
        const errors = validateInput(inputText);
        setValidationErrors(errors);
      } else {
        setValidationErrors([]);
      }

      setIsTranslating(true);
      try {
        const result = await translateText(inputText, sourceLang, targetLang);
        setOutputText(result);
      } catch (e) {
        console.error("Translation failed", e);
        setOutputText("Error: Translation failed.");
      } finally {
        setIsTranslating(false);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [inputText, sourceLang, targetLang]);

  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const swapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setInputText(outputText);
    setOutputText(inputText);
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
      speak(inputText, sourceLang === 'am' ? 'ar' : sourceLang);
    }
  };

  const handleOutputTTS = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speak(outputText, targetLang === 'am' ? 'ar' : targetLang);
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
    <div className="flex flex-col gap-6">
      {/* Language Selector Card */}
      <div className="bg-zinc-900/50 border border-zinc-800 p-2 rounded-2xl flex items-center justify-between gap-2 shadow-xl shadow-black/20">
        <select 
          value={sourceLang}
          onChange={(e) => setSourceLang(e.target.value as Language)}
          className="flex-1 bg-transparent text-zinc-100 px-4 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider focus:outline-none focus:bg-zinc-800 transition-colors appearance-none cursor-pointer"
        >
          {LANGUAGES.map(lang => (
            <option key={lang.code} value={lang.code} className="bg-zinc-900 text-zinc-100">{lang.name}</option>
          ))}
        </select>

        <button 
          onClick={swapLanguages}
          className="p-2.5 text-zinc-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all rounded-xl border border-zinc-800 hover:border-indigo-500/30"
        >
          <ArrowRightLeft size={18} />
        </button>

        <select 
          value={targetLang}
          onChange={(e) => setTargetLang(e.target.value as Language)}
          className="flex-1 bg-transparent text-zinc-100 px-4 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider focus:outline-none focus:bg-zinc-800 transition-colors appearance-none cursor-pointer text-right"
        >
          {LANGUAGES.map(lang => (
            <option key={lang.code} value={lang.code} className="bg-zinc-900 text-zinc-100">{lang.name}</option>
          ))}
        </select>
      </div>

      {/* Translation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Input Card */}
        <div className="group relative bg-zinc-900/30 border border-zinc-800 rounded-3xl overflow-hidden focus-within:border-indigo-500/50 transition-all shadow-lg shadow-black/10">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em]">Source_Input</span>
              <div className="flex items-center gap-1">
                <div className={cn("w-1.5 h-1.5 rounded-full", inputText ? "bg-indigo-500" : "bg-zinc-700")} />
              </div>
            </div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type to translate..."
              className="w-full h-48 bg-transparent text-xl text-zinc-100 placeholder:text-zinc-700 resize-none focus:outline-none font-sans leading-relaxed"
              dir="auto"
            />
          </div>
          
          <div className="px-4 py-3 bg-zinc-900/50 border-t border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-1">
              {isSpeechSupported && (
                <button
                  onClick={handleMicClick}
                  className={cn(
                    "p-2 rounded-lg transition-all",
                    isListening 
                      ? "bg-red-500/20 text-red-400" 
                      : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800"
                  )}
                >
                  {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                </button>
              )}
              {inputText && (
                <button
                  onClick={handleInputTTS}
                  className={cn(
                    "p-2 rounded-lg transition-all",
                    isSpeaking ? "text-indigo-400 bg-indigo-500/10" : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800"
                  )}
                >
                  <Volume2 size={16} />
                </button>
              )}
            </div>
            {inputText && (
              <button 
                onClick={() => { setInputText(''); setOutputText(''); setValidationErrors([]); }}
                className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Output Card */}
        <div className="group relative bg-zinc-900/30 border border-zinc-800 rounded-3xl overflow-hidden shadow-lg shadow-black/10">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em]">Target_Output</span>
              {isTranslating && <Loader2 size={12} className="text-indigo-500 animate-spin" />}
            </div>
            <div className="h-48 overflow-y-auto scrollbar-hide">
              {outputText ? (
                <p className="text-xl text-zinc-100 font-sans leading-relaxed break-words" dir="auto">
                  {outputText}
                </p>
              ) : (
                <p className="text-xl text-zinc-800 font-sans italic">Translation will appear here...</p>
              )}
            </div>
          </div>

          <div className="px-4 py-3 bg-zinc-900/50 border-t border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-1">
              {outputText && (
                <button
                  onClick={handleOutputTTS}
                  className={cn(
                    "p-2 rounded-lg transition-all",
                    isSpeaking ? "text-indigo-400 bg-indigo-500/10" : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800"
                  )}
                >
                  <Volume2 size={16} />
                </button>
              )}
            </div>
            <button
              onClick={handleCopy}
              disabled={!outputText}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-indigo-500/20"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Validation Feedback */}
      <AnimatePresence>
        {validationErrors.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="bg-red-500/5 border border-red-500/20 rounded-2xl p-4 flex gap-4 items-start"
          >
            <div className="p-2 bg-red-500/10 rounded-lg text-red-400">
              <AlertCircle size={20} />
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-red-400 uppercase tracking-widest">Validation_Alert</h4>
                <span className="text-[10px] font-mono text-red-500/50 uppercase">{validationErrors.length} Issues Found</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {validationErrors.map((error, idx) => (
                  <div key={idx} className="bg-black/20 p-3 rounded-xl border border-red-500/10">
                    <p className="text-sm text-zinc-300 mb-2">
                      <span className="text-red-400 font-bold">"{error.word}"</span>: {error.message}
                    </p>
                    {error.suggestion && (
                      <button 
                        onClick={() => applySuggestion(error)}
                        className="w-full flex items-center justify-center gap-2 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-[10px] font-bold uppercase text-zinc-300 rounded-lg transition-all"
                      >
                        Apply Fix: "{error.suggestion}"
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
