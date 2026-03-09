import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Languages, BookOpen, LayoutGrid, Globe } from 'lucide-react';
import { cn } from './lib/utils';
import TranslatorView from './components/TranslatorView';
import LearnLanguage from './components/LearnLanguage';
import Hub from './components/Hub';
import { Language, getTranslation } from './lib/i18n';

type Tab = 'translator' | 'learn' | 'hub';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('translator');
  const [uiLang, setUiLang] = useState<Language>('en');
  const [prefilledAmmar, setPrefilledAmmar] = useState<string>('');

  const t = (key: string) => getTranslation(key, uiLang);

  return (
    <div className="min-h-screen bg-app-bg text-text-main flex flex-col font-sans pb-24 sm:pb-0 transition-colors duration-300 overflow-hidden" dir={uiLang === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* Deep Dark Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-secondary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-1/4 w-full h-64 bg-gradient-to-t from-primary/5 to-transparent" />
      </div>

      {/* Header */}
      <header className="relative z-30 w-full p-4 flex items-center justify-between bg-app-bg/40 backdrop-blur-xl border-b border-white/5 sticky top-0 transition-colors">
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.3)] group-hover:scale-110 transition-transform duration-500">
            <span className="text-2xl font-black text-white italic">A</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-black tracking-tighter text-white uppercase italic">{t('header.title')}</h1>
            <p className="text-[9px] text-white/30 font-black uppercase tracking-[0.4em]">{t('header.subtitle')}</p>
          </div>
        </div>

        {/* Navigation Wrapper */}
        <div className="flex items-center gap-6">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center bg-white/5 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md">
            {[
              { id: 'translator', icon: Languages, label: t('nav.translator'), color: 'text-primary' },
              { id: 'hub', icon: LayoutGrid, label: t('nav.hub'), color: 'text-primary' },
              { id: 'learn', icon: BookOpen, label: t('nav.learn'), color: 'text-secondary' },
            ].map((nav) => (
              <button
                key={nav.id}
                onClick={() => setActiveTab(nav.id as Tab)}
                className={cn(
                  "flex items-center gap-3 px-6 py-3 rounded-xl text-[10px] font-black transition-all duration-500 tracking-[0.2em] relative group/nav",
                  activeTab === nav.id
                    ? "text-white"
                    : "text-white/30 hover:text-white/60"
                )}
              >
                <nav.icon size={14} className={cn("transition-transform duration-500 group-hover/nav:scale-125", activeTab === nav.id ? nav.color : "")} />
                <span>{nav.label.toUpperCase()}</span>
                {activeTab === nav.id && (
                  <motion.div
                    layoutId="active-pill-desktop"
                    className="absolute inset-0 bg-white/10 border border-white/10 rounded-xl -z-10 shadow-[0_0_20px_rgba(59,130,246,0.1)]"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <div className="relative group">
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white transition-all backdrop-blur-md">
                <Globe size={16} />
                <span className="text-xs font-black uppercase tracking-widest">{uiLang}</span>
              </button>
              <div className="absolute right-0 mt-2 w-40 bg-slate-900/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden translate-y-2 group-hover:translate-y-0">
                {(['en', 'ar', 'am'] as Language[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setUiLang(lang)}
                    className={cn(
                      "w-full px-5 py-3.5 text-left text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-colors flex items-center justify-between",
                      uiLang === lang ? "text-primary" : "text-white/40"
                    )}
                  >
                    <span>{lang === 'en' ? 'English' : lang === 'ar' ? 'العربية' : 'Ammar'}</span>
                    {uiLang === lang && <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_#3b82f6]" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 w-full max-w-6xl mx-auto p-4 md:p-12 overflow-y-auto no-scrollbar">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10, filter: 'blur(4px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: -10, filter: 'blur(4px)' }}
            transition={{ type: 'spring', damping: 30, stiffness: 150 }}
            className="w-full h-full"
          >
            {activeTab === 'translator' && (
              <TranslatorView uiLang={uiLang} prefill={prefilledAmmar} onClearPrefill={() => setPrefilledAmmar('')} />
            )}
            {activeTab === 'learn' && (
              <LearnLanguage uiLang={uiLang} />
            )}
            {activeTab === 'hub' && (
              <Hub
                uiLang={uiLang}
                onTranslate={(text) => {
                  setPrefilledAmmar(text);
                  setActiveTab('translator');
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="fixed bottom-4 left-4 right-4 bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-3 md:hidden z-50 transition-all shadow-2xl">
        <div className="flex justify-around items-center max-w-md mx-auto gap-2">
          {[
            { id: 'translator', icon: Languages, label: t('nav.translator'), color: 'text-primary' },
            { id: 'hub', icon: LayoutGrid, label: t('nav.hub'), color: 'text-primary' },
            { id: 'learn', icon: BookOpen, label: t('nav.learn'), color: 'text-secondary' },
          ].map((nav) => (
            <button
              key={nav.id}
              onClick={() => setActiveTab(nav.id as Tab)}
              className={cn(
                "flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all w-full relative",
                activeTab === nav.id
                  ? "bg-white/10"
                  : "text-white/40"
              )}
            >
              <nav.icon size={22} className={activeTab === nav.id ? nav.color : ""} />
              <span className="text-[9px] font-black uppercase tracking-widest">{nav.label}</span>
              {activeTab === nav.id && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 border border-white/20 rounded-2xl shadow-[inset_0_0_10px_rgba(255,255,255,0.05)]"
                />
              )}
            </button>
          ))}
        </div>
      </nav>

    </div>
  );
}
