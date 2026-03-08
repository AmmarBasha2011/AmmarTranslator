import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Languages, BookOpen, LayoutGrid, Sun, Moon, Globe } from 'lucide-react';
import { cn } from './lib/utils';
import TranslatorView from './components/TranslatorView';
import LearnLanguage from './components/LearnLanguage';
import Hub from './components/Hub';
import { Language, getTranslation } from './lib/i18n';

type Tab = 'translator' | 'learn' | 'hub';
type Theme = 'light' | 'dark';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('translator');
  const [theme, setTheme] = useState<Theme>(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );
  const [uiLang, setUiLang] = useState<Language>('en');
  const [prefilledAmmar, setPrefilledAmmar] = useState<string>('');

  const t = (key: string) => getTranslation(key, uiLang);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  return (
    <div className="min-h-screen bg-app-bg text-text-main flex flex-col font-sans pb-24 sm:pb-0 transition-colors duration-300" dir={uiLang === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* Subtle Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-primary/5 to-transparent dark:from-primary/10" />
      </div>

      {/* Header */}
      <header className="relative z-10 w-full p-4 flex items-center justify-between bg-card-bg/80 backdrop-blur-md border-b border-border sticky top-0 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="text-xl font-bold text-white">A</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold tracking-tight text-text-main">{t('header.title')}</h1>
            <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">{t('header.subtitle')}</p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden sm:flex items-center bg-app-bg p-1 rounded-xl border border-border">
          <button
            onClick={() => setActiveTab('translator')}
            className={cn(
              "flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all",
              activeTab === 'translator'
                ? "bg-card-bg text-primary shadow-sm"
                : "text-text-muted hover:text-text-main"
            )}
          >
            <Languages size={18} />
            <span>{t('nav.translator').toUpperCase()}</span>
          </button>
          <button
            onClick={() => setActiveTab('hub')}
            className={cn(
              "flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all",
              activeTab === 'hub'
                ? "bg-card-bg text-primary shadow-sm"
                : "text-text-muted hover:text-text-main"
            )}
          >
            <LayoutGrid size={18} />
            <span>{t('nav.hub').toUpperCase()}</span>
          </button>
          <button
            onClick={() => setActiveTab('learn')}
            className={cn(
              "flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all",
              activeTab === 'learn'
                ? "bg-card-bg text-secondary shadow-sm"
                : "text-text-muted hover:text-text-main"
            )}
          >
            <BookOpen size={18} />
            <span>{t('nav.learn').toUpperCase()}</span>
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-app-bg border border-border text-text-muted hover:text-primary transition-all"
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          <div className="relative group">
            <button className="flex items-center gap-1.5 p-2.5 rounded-xl bg-app-bg border border-border text-text-muted hover:text-primary transition-all">
              <Globe size={18} />
              <span className="text-xs font-bold uppercase">{uiLang}</span>
            </button>
            <div className="absolute right-0 mt-2 w-32 bg-card-bg border border-border rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
              {(['en', 'ar', 'am'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setUiLang(lang)}
                  className={cn(
                    "w-full px-4 py-2.5 text-left text-xs font-bold uppercase hover:bg-app-bg transition-colors",
                    uiLang === lang ? "text-primary" : "text-text-muted"
                  )}
                >
                  {lang === 'en' ? 'English' : lang === 'ar' ? 'العربية' : 'Ammar'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 w-full max-w-4xl mx-auto p-4 sm:p-8">
        <AnimatePresence mode="wait">
          {activeTab === 'translator' && (
            <motion.div 
              key="translator"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full"
            >
              <TranslatorView uiLang={uiLang} prefill={prefilledAmmar} onClearPrefill={() => setPrefilledAmmar('')} />
            </motion.div>
          )}
          {activeTab === 'learn' && (
            <motion.div
              key="learn"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full"
            >
              <LearnLanguage uiLang={uiLang} />
            </motion.div>
          )}
          {activeTab === 'hub' && (
            <motion.div
              key="hub"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full"
            >
              <Hub
                uiLang={uiLang}
                onTranslate={(text) => {
                  setPrefilledAmmar(text);
                  setActiveTab('translator');
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card-bg/80 backdrop-blur-lg border-t border-border p-2 sm:hidden z-50 mobile-nav transition-colors">
        <div className="flex justify-around items-center max-w-md mx-auto">
          <button
            onClick={() => setActiveTab('translator')}
            className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-xl transition-all w-full",
              activeTab === 'translator'
                ? "text-primary bg-primary/5"
                : "text-text-muted"
            )}
          >
            <Languages size={24} />
            <span className="text-[10px] font-bold uppercase tracking-tight">{t('nav.translator')}</span>
          </button>
          
          <button
            onClick={() => setActiveTab('hub')}
            className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-xl transition-all w-full",
              activeTab === 'hub'
                ? "text-primary bg-primary/5"
                : "text-text-muted"
            )}
          >
            <LayoutGrid size={24} />
            <span className="text-[10px] font-bold uppercase tracking-tight">{t('nav.hub')}</span>
          </button>

          <button
            onClick={() => setActiveTab('learn')}
            className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-xl transition-all w-full",
              activeTab === 'learn'
                ? "text-secondary bg-secondary/5"
                : "text-text-muted"
            )}
          >
            <BookOpen size={24} />
            <span className="text-[10px] font-bold uppercase tracking-tight">{t('nav.learn')}</span>
          </button>
        </div>
      </nav>

    </div>
  );
}
