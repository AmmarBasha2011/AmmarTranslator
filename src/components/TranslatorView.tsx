import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Copy, ArrowRightLeft, Sparkles, X, AlertTriangle, CheckCircle2, Volume2, Mic, MicOff, Upload, Download, FileText } from 'lucide-react';
import { validateInput, ValidationError } from '../services/validator';
import { cn } from '../lib/utils';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { translate, SupportedLanguage } from '../services/translationService';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const LANGUAGES: { code: SupportedLanguage; name: string }[] = [
  { code: 'ar', name: 'Arabic' },
  { code: 'am', name: 'Ammar' },
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'French' },
  { code: 'tr', name: 'Turkish' },
  { code: 'de', name: 'German' },
  { code: 'es', name: 'Spanish' },
];

export default function TranslatorView() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [pronunciation, setPronunciation] = useState('');
  const [fromLang, setFromLang] = useState<SupportedLanguage>('ar');
  const [toLang, setToLang] = useState<SupportedLanguage>('am');
  const [copied, setCopied] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { speak, stop: stopSpeaking, isSpeaking, convertToPhonetic } = useTextToSpeech();
  
  const handleSpeechResult = React.useCallback((text: string) => {
    setInputText(prev => prev ? `${prev} ${text}` : text);
  }, []);

  const { isListening, isSupported: isSpeechSupported, startListening, stopListening } = useSpeechRecognition({
    onResult: handleSpeechResult,
    lang: fromLang === 'ar' ? 'ar-SA' : 'en-US'
  });

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!inputText.trim()) {
        setOutputText('');
        setPronunciation('');
        setValidationErrors([]);
        return;
      }

      const errors = validateInput(inputText, fromLang);
      setValidationErrors(errors);

      setIsTranslating(true);
      try {
        const result = await translate(inputText, fromLang, toLang);
        setOutputText(result.text);
        setPronunciation(result.pronunciation || '');
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
    const temp = fromLang;
    setFromLang(toLang);
    setToLang(temp);
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
      speak(inputText, fromLang === 'am' ? 'am' : 'ar');
    }
  };

  const handleOutputTTS = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speak(outputText, toLang === 'am' ? 'am' : 'ar');
    }
  };

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("File too large. Max size is 10MB.");
      return;
    }

    setIsUploading(true);
    try {
      let text = "";
      if (file.name.endsWith('.pdf')) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          fullText += content.items.map((item: any) => item.str).join(" ") + "\n";
        }
        text = fullText;
      } else {
        text = await file.text();
      }
      setInputText(text);
    } catch (error) {
      console.error("File read error:", error);
      alert("Failed to read file.");
    } finally {
      setIsUploading(false);
    }
  };

  const downloadTranslation = () => {
    if (!outputText) return;
    const blob = new Blob([outputText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `translated_${toLang}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-4">

      {/* Language Selection Grid */}
      <div className="grid grid-cols-[1fr,auto,1fr] items-center gap-2 bg-white p-2 rounded-2xl border border-border shadow-sm">
        <select
          value={fromLang}
          onChange={(e) => setFromLang(e.target.value as any)}
          className="w-full bg-slate-50 text-sm font-bold text-primary p-3 rounded-xl appearance-none focus:outline-none transition-all"
        >
          {LANGUAGES.map(lang => (
            <option key={lang.code} value={lang.code}>{lang.name}</option>
          ))}
        </select>

        <button
          onClick={swapLanguages}
          className="p-2.5 rounded-xl bg-primary/5 hover:bg-primary/10 text-primary transition-all active:scale-90"
        >
          <ArrowRightLeft size={18} />
        </button>

        <select
          value={toLang}
          onChange={(e) => setToLang(e.target.value as any)}
          className="w-full bg-slate-50 text-sm font-bold text-secondary p-3 rounded-xl appearance-none focus:outline-none transition-all text-right"
        >
          {LANGUAGES.map(lang => (
            <option key={lang.code} value={lang.code}>{lang.name}</option>
          ))}
        </select>
      </div>

      {/* Input Card */}
      <div className="relative bg-white rounded-3xl border border-border shadow-sm overflow-hidden flex flex-col group transition-all focus-within:ring-2 focus-within:ring-primary/20">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Tap to enter text..."
          className="w-full h-40 sm:h-56 p-5 text-lg resize-none focus:outline-none placeholder:text-text-muted font-medium leading-relaxed bg-transparent"
          dir="auto"
        />

        <div className="flex items-center justify-between p-3 bg-slate-50/50 border-t border-border">
          <div className="flex gap-2">
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".pdf,.txt,.md" />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="p-2.5 rounded-xl text-text-muted hover:text-primary hover:bg-white transition-all border border-transparent hover:border-border"
            >
              <Upload size={18} className={isUploading ? "animate-bounce" : ""} />
            </button>
            {isSpeechSupported && (fromLang === 'ar' || fromLang === 'en') && (
              <button
                onClick={handleMicClick}
                className={cn(
                  "p-2.5 rounded-xl transition-all border",
                  isListening 
                    ? "bg-red-50 text-red-500 border-red-100 animate-pulse"
                    : "text-text-muted hover:text-primary hover:bg-white border-transparent hover:border-border"
                )}
              >
                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
              </button>
            )}
          </div>

          <div className="flex gap-2">
            {inputText && (
              <>
                <button
                  onClick={handleInputTTS}
                  className="p-2.5 rounded-xl text-text-muted hover:text-primary hover:bg-white transition-all border border-transparent hover:border-border"
                >
                  <Volume2 size={18} className={isSpeaking ? "text-primary animate-pulse" : ""} />
                </button>
                <button
                  onClick={() => { setInputText(''); setOutputText(''); setPronunciation(''); setValidationErrors([]); }}
                  className="p-2.5 rounded-xl text-text-muted hover:text-red-500 hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
                >
                  <X size={18} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Validation */}
      <AnimatePresence>
        {validationErrors.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="bg-amber-50 border border-amber-200 rounded-2xl p-3"
          >
            <div className="flex items-center gap-2 text-amber-700 font-bold text-[10px] uppercase tracking-wider mb-2">
              <AlertTriangle size={14} />
              <span>Input Warnings</span>
            </div>
            <div className="space-y-1.5">
              {validationErrors.map((error, idx) => (
                <div key={idx} className="flex items-center justify-between gap-3 bg-white/50 p-2 rounded-lg border border-amber-100">
                  <p className="text-xs text-amber-800">
                    <span className="font-bold">[{error.word}]</span> {error.message}
                  </p>
                  {error.suggestion && (
                    <button
                      onClick={() => applySuggestion(error)}
                      className="text-[10px] font-bold text-primary bg-white px-2 py-1 rounded border border-primary/20 hover:bg-primary hover:text-white transition-colors"
                    >
                      FIX
                    </button>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Output Card */}
      <div className="relative bg-white rounded-3xl border border-border shadow-md overflow-hidden flex flex-col min-h-[140px]">
        <div className="flex-1 p-5">
          {isTranslating ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 py-6">
              <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              <span className="text-[10px] font-bold text-primary tracking-widest uppercase">Processing...</span>
            </div>
          ) : outputText ? (
            <div className="space-y-4">
              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-xl font-bold leading-relaxed text-slate-800"
                dir="auto"
              >
                {outputText}
              </motion.p>

              {pronunciation && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="pt-3 border-t border-slate-50"
                >
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest block mb-1">Pronunciation</span>
                  <p className="text-lg font-bold text-primary/70" dir="rtl">
                    {pronunciation}
                  </p>
                </motion.div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-3 py-8">
              <Sparkles size={32} />
              <span className="text-xs font-bold tracking-widest uppercase">Translation will appear here</span>
            </div>
          )}
        </div>

        {outputText && (
          <div className="bg-slate-50/50 p-3 flex justify-between items-center border-t border-border">
            <div className="flex gap-1.5">
              <button
                onClick={handleOutputTTS}
                className="p-2.5 rounded-xl text-text-muted hover:text-primary hover:bg-white transition-all border border-transparent hover:border-border"
                title="Listen"
              >
                 <Volume2 size={18} className={isSpeaking ? "text-primary animate-pulse" : ""} />
              </button>
              <button
                onClick={downloadTranslation}
                className="p-2.5 rounded-xl text-text-muted hover:text-primary hover:bg-white transition-all border border-transparent hover:border-border"
                title="Save Text"
              >
                 <Download size={18} />
              </button>
            </div>

            <button
              onClick={handleCopy}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all text-xs font-bold uppercase tracking-wide border",
                copied
                  ? "bg-green-50 text-green-600 border-green-100"
                  : "bg-primary text-white border-primary shadow-lg shadow-primary/20"
              )}
            >
              {copied ? (
                <>
                  <CheckCircle2 size={14} />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
