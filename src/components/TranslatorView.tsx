import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Copy, ArrowRightLeft, Sparkles, X, AlertTriangle, CheckCircle2, Volume2, Mic, MicOff, Globe, Terminal, Cpu, Zap } from 'lucide-react';
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
    lang: sourceLang === 'ar' ? 'ar-SA' : sourceLang === 'en' ? 'en-US' : 'fr-FR' // Basic mapping
  });

  // Debounce translation and validation
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!inputText.trim()) {
        setOutputText('');
        setValidationErrors([]);
        return;
      }

      // Validation only for Ammar input
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
    }, 800);

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
      speak(inputText, sourceLang === 'am' ? 'ar' : sourceLang); // Ammar uses Arabic TTS for now
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
    <div className="flex flex-col gap-6 pb-24 font-mono">
      {/* Robotic Header */}
      <div className="flex items-center justify-between border-b border-neon-green/30 pb-4">
        <div className="flex items-center gap-2 text-neon-green">
          <Terminal size={20} />
          <span className="text-sm tracking-widest uppercase">Translation_Module_v2.0</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
          <span className="text-xs text-neon-green/70 uppercase">System_Online</span>
        </div>
      </div>

      {/* Language Selector */}
      <div className="bg-black border border-neon-green/30 p-4 rounded-none relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-neon-green" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-neon-green" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-neon-green" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-neon-green" />
        
        <div className="flex items-center justify-between gap-4">
          <select 
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value as Language)}
            className="bg-transparent text-neon-green border border-neon-green/30 p-2 text-sm focus:outline-none focus:border-neon-green uppercase tracking-wider w-full"
          >
            {LANGUAGES.map(lang => (
              <option key={lang.code} value={lang.code} className="bg-black text-neon-green">{lang.name}</option>
            ))}
          </select>

          <button 
            onClick={swapLanguages}
            className="p-2 text-neon-green hover:bg-neon-green/10 transition-colors border border-neon-green/30 rounded-none"
          >
            <ArrowRightLeft size={18} />
          </button>

          <select 
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value as Language)}
            className="bg-transparent text-neon-green border border-neon-green/30 p-2 text-sm focus:outline-none focus:border-neon-green uppercase tracking-wider w-full"
          >
            {LANGUAGES.map(lang => (
              <option key={lang.code} value={lang.code} className="bg-black text-neon-green">{lang.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Input Area */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-neon-green/20 blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
        <div className={cn(
          "relative bg-black border-2 transition-colors p-1",
          validationErrors.length > 0 ? "border-neon-red" : "border-neon-green/50 group-hover:border-neon-green"
        )}>
          {/* Corner Decors */}
          <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-neon-green" />
          <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-neon-green" />
          <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-neon-green" />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-neon-green" />

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="INITIATE_INPUT_SEQUENCE..."
            className="w-full h-40 bg-transparent p-4 text-lg text-neon-green placeholder:text-neon-green/30 resize-none focus:outline-none font-mono leading-relaxed"
            dir="auto"
          />
          
          {/* Input Actions */}
          <div className="absolute bottom-4 right-4 flex items-center gap-2">
            {inputText && (
              <button
                onClick={handleInputTTS}
                className="p-2 text-neon-green/70 hover:text-neon-green hover:bg-neon-green/10 transition-colors border border-neon-green/30"
                title="Audio_Output"
              >
                <Volume2 size={16} className={isSpeaking ? "animate-pulse" : ""} />
              </button>
            )}

            {isSpeechSupported && (
              <button
                onClick={handleMicClick}
                className={cn(
                  "p-2 transition-colors border border-neon-green/30",
                  isListening 
                    ? "bg-neon-red/20 text-neon-red border-neon-red animate-pulse" 
                    : "text-neon-green/70 hover:text-neon-green hover:bg-neon-green/10"
                )}
                title="Voice_Input"
              >
                {isListening ? <MicOff size={16} /> : <Mic size={16} />}
              </button>
            )}

            {inputText && (
              <button 
                onClick={() => { setInputText(''); setOutputText(''); setValidationErrors([]); }}
                className="p-2 text-neon-green/70 hover:text-neon-red hover:bg-neon-red/10 transition-colors border border-neon-green/30 hover:border-neon-red"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Validation Errors */}
      <AnimatePresence>
        {validationErrors.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-neon-red/5 border border-neon-red/50 p-4 space-y-3 relative">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-neon-red/50" />
              <div className="flex items-center gap-2 text-neon-red font-bold uppercase tracking-wider text-xs">
                <AlertTriangle size={14} />
                <span>Error_Log: Input_Validation_Failed</span>
              </div>
              <div className="space-y-2">
                {validationErrors.map((error, idx) => (
                  <div key={idx} className="flex items-start gap-3 pl-4 border-l border-neon-red/30">
                    <div className="flex-1">
                      <p className="text-sm text-neon-red/80 font-mono">
                        <span className="font-bold text-neon-red">"{error.word}"</span>: {error.message}
                      </p>
                      {error.suggestion && (
                        <button 
                          onClick={() => applySuggestion(error)}
                          className="mt-2 flex items-center gap-2 text-xs text-neon-green hover:text-white transition-colors uppercase tracking-wider border border-neon-green/30 px-2 py-1"
                        >
                          <CheckCircle2 size={12} />
                          Execute_Fix: "{error.suggestion}"
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Output Area */}
      <div className="relative group mt-2">
        <div className="absolute -inset-0.5 bg-neon-cyan/20 blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
        <div className="relative bg-black border-2 border-neon-cyan/50 group-hover:border-neon-cyan p-1 min-h-[160px] flex flex-col">
           {/* Corner Decors */}
           <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-neon-cyan" />
           <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-neon-cyan" />
           <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-neon-cyan" />
           <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-neon-cyan" />

          <div className="flex-1 p-5">
            {isTranslating ? (
              <div className="h-full flex flex-col items-center justify-center text-neon-cyan gap-2">
                <Loader2 size={24} className="animate-spin" />
                <span className="text-xs uppercase tracking-widest animate-pulse">Processing_Data...</span>
              </div>
            ) : outputText ? (
              <p className="text-lg text-neon-cyan font-mono leading-relaxed break-words" dir="auto">
                {outputText}
              </p>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-neon-cyan/30 gap-2">
                <Cpu size={24} />
                <span className="text-xs uppercase tracking-widest">Awaiting_Input...</span>
              </div>
            )}
          </div>
          
          {/* Actions Bar */}
          <div className="border-t border-neon-cyan/20 bg-neon-cyan/5 p-2 flex justify-between items-center gap-2">
            
            {/* Output TTS */}
            <div>
              {outputText && (
                <button
                  onClick={handleOutputTTS}
                  className="p-2 text-neon-cyan/70 hover:text-neon-cyan hover:bg-neon-cyan/10 transition-colors border border-neon-cyan/30"
                  title="Audio_Output"
                >
                   <Volume2 size={16} className={isSpeaking ? "animate-pulse" : ""} />
                </button>
              )}
            </div>

            <button
              onClick={handleCopy}
              disabled={!outputText}
              className="flex items-center gap-2 px-4 py-2 bg-transparent hover:bg-neon-cyan/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-xs font-bold uppercase tracking-wider text-neon-cyan border border-neon-cyan/30 hover:border-neon-cyan"
            >
              {copied ? (
                <>
                  <span className="text-white">Copied</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>Copy_Output</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Loader2({ size, className }: { size: number, className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
}
