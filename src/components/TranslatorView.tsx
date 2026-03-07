import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Copy, ArrowRightLeft, Sparkles, X, AlertTriangle, CheckCircle2, Volume2, Mic, MicOff } from 'lucide-react';
import { translateToArabicToAmmar, translateAmmarToArabic } from '../services/translator';
import { validateInput, ValidationError } from '../services/validator';
import { isArabicText } from '../constants';
import { cn } from '../lib/utils';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

export default function TranslatorView() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [direction, setDirection] = useState<'auto' | 'ar-to-am' | 'am-to-ar'>('auto');
  const [detectedDirection, setDetectedDirection] = useState<'ar-to-am' | 'am-to-ar'>('ar-to-am');
  const [copied, setCopied] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  const { speak, stop: stopSpeaking, isSpeaking } = useTextToSpeech();
  
  const handleSpeechResult = React.useCallback((text: string) => {
    setInputText(prev => prev ? `${prev} ${text}` : text);
  }, []);

  const { isListening, isSupported: isSpeechSupported, startListening, stopListening } = useSpeechRecognition({
    onResult: handleSpeechResult,
    lang: 'ar-SA'
  });

  // Debounce translation and validation
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!inputText.trim()) {
        setOutputText('');
        setValidationErrors([]);
        return;
      }

      // Validation
      const errors = validateInput(inputText);
      setValidationErrors(errors);

      let currentDirection = direction;
      
      if (direction === 'auto') {
        const isAr = isArabicText(inputText);
        currentDirection = isAr ? 'ar-to-am' : 'am-to-ar';
        setDetectedDirection(currentDirection);
      } else {
        setDetectedDirection(direction);
      }

      if (currentDirection === 'ar-to-am') {
        setOutputText(translateToArabicToAmmar(inputText));
      } else {
        setOutputText(translateAmmarToArabic(inputText));
      }
    }, 200); // 200ms debounce

    return () => clearTimeout(timer);
  }, [inputText, direction]);

  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleDirection = () => {
    if (direction === 'auto') {
      setDirection('ar-to-am');
    } else if (direction === 'ar-to-am') {
      setDirection('am-to-ar');
    } else {
      setDirection('auto');
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
      const lang = detectedDirection === 'ar-to-am' ? 'ar' : 'am';
      speak(inputText, lang);
    }
  };

  const handleOutputTTS = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      const lang = detectedDirection === 'ar-to-am' ? 'am' : 'ar';
      speak(outputText, lang);
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
    <div className="flex flex-col gap-4 pb-24">
      {/* Controls */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-300 bg-deep-blue-900/50 p-1 rounded-lg border border-white/5">
          <button 
            onClick={() => setDirection('auto')}
            className={cn(
              "px-3 py-1.5 rounded-md transition-all",
              direction === 'auto' ? "bg-neon-blue/20 text-neon-blue shadow-sm" : "hover:text-white hover:bg-white/5"
            )}
          >
            Auto
          </button>
          <div className="w-px h-4 bg-white/10" />
          <span className={cn("px-2 transition-colors", detectedDirection === 'ar-to-am' ? "text-neon-cyan" : "text-slate-500")}>
            Arabic
          </span>
          <button 
            onClick={toggleDirection}
            className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
          >
            <ArrowRightLeft size={14} className="text-slate-400" />
          </button>
          <span className={cn("px-2 transition-colors", detectedDirection === 'am-to-ar' ? "text-neon-cyan" : "text-slate-500")}>
            Ammar
          </span>
        </div>
      </div>

      {/* Input Area */}
      <div className="relative group">
        <div className={cn(
          "absolute -inset-0.5 rounded-2xl blur opacity-75 transition duration-500",
          validationErrors.length > 0 ? "bg-red-500/50" : "bg-gradient-to-r from-neon-blue/20 to-neon-cyan/20 group-hover:opacity-100"
        )}></div>
        <div className={cn(
          "relative bg-deep-blue-900 rounded-2xl border shadow-xl overflow-hidden transition-colors",
          validationErrors.length > 0 ? "border-red-500/50" : "border-white/10"
        )}>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type here to translate..."
            className="w-full h-40 sm:h-48 bg-transparent p-5 text-lg sm:text-xl resize-none focus:outline-none placeholder:text-slate-600 font-medium leading-relaxed"
            dir="auto"
          />
          
          {/* Input Actions */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            {/* TTS Button */}
            {inputText && (
              <button
                onClick={handleInputTTS}
                className="p-2 rounded-full bg-deep-blue-800 text-slate-400 hover:text-white hover:bg-deep-blue-700 transition-colors"
                title="Listen"
              >
                <Volume2 size={16} className={isSpeaking ? "text-neon-cyan animate-pulse" : ""} />
              </button>
            )}

            {/* STT Button (Only for Arabic input) */}
            {isSpeechSupported && detectedDirection === 'ar-to-am' && (
              <button
                onClick={handleMicClick}
                className={cn(
                  "p-2 rounded-full transition-colors",
                  isListening 
                    ? "bg-red-500/20 text-red-400 animate-pulse" 
                    : "bg-deep-blue-800 text-slate-400 hover:text-white hover:bg-deep-blue-700"
                )}
                title="Speak (Arabic)"
              >
                {isListening ? <MicOff size={16} /> : <Mic size={16} />}
              </button>
            )}

            {/* Clear Button */}
            {inputText && (
              <button 
                onClick={() => { setInputText(''); setOutputText(''); setValidationErrors([]); }}
                className="p-2 rounded-full bg-deep-blue-800 text-slate-400 hover:text-white hover:bg-deep-blue-700 transition-colors"
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
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-red-400 font-medium">
                <AlertTriangle size={18} />
                <span>Input Issues Detected</span>
              </div>
              <div className="space-y-2">
                {validationErrors.map((error, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-red-500/5 p-2 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm text-red-300">
                        <span className="font-bold text-red-200">"{error.word}"</span>: {error.message}
                      </p>
                      {error.suggestion && (
                        <button 
                          onClick={() => applySuggestion(error)}
                          className="mt-1 flex items-center gap-1 text-xs text-green-400 hover:text-green-300 transition-colors"
                        >
                          <CheckCircle2 size={12} />
                          Fix to "{error.suggestion}"
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
        <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-cyan/20 to-neon-blue/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-500"></div>
        <div className="relative bg-deep-blue-800/50 backdrop-blur-sm rounded-2xl border border-white/10 shadow-xl overflow-hidden min-h-[160px] flex flex-col">
          <div className="flex-1 p-5">
            {outputText ? (
              <p className="text-lg sm:text-xl font-medium leading-relaxed break-words text-neon-cyan/90" dir="auto">
                {outputText}
              </p>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-2 opacity-50">
                <Sparkles size={24} />
                <span className="text-sm">Translation will appear here</span>
              </div>
            )}
          </div>
          
          {/* Actions Bar */}
          <div className="border-t border-white/5 bg-deep-blue-900/30 p-3 flex justify-between items-center gap-2">
            
            {/* Output TTS */}
            <div>
              {outputText && (
                <button
                  onClick={handleOutputTTS}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-slate-300 hover:text-white"
                  title="Listen"
                >
                   <Volume2 size={18} className={isSpeaking ? "text-neon-cyan animate-pulse" : ""} />
                </button>
              )}
            </div>

            <button
              onClick={handleCopy}
              disabled={!outputText}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium text-slate-300 hover:text-white active:scale-95"
            >
              {copied ? (
                <>
                  <span className="text-green-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={16} />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
