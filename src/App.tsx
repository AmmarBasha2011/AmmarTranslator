import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Languages, BookOpen } from 'lucide-react';
import { cn } from './lib/utils';
import TranslatorView from './components/TranslatorView';
import LearnLanguage from './components/LearnLanguage';

export default function App() {
  const [activeTab, setActiveTab] = useState<'translator' | 'learn'>('translator');

  return (
    <div className="min-h-screen bg-app-bg text-text-main flex flex-col font-sans pb-24 sm:pb-0">
      
      {/* Subtle Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-primary/5 to-transparent" />
      </div>

      {/* Header */}
      <header className="relative z-10 w-full p-4 flex items-center justify-between bg-card-bg/80 backdrop-blur-md border-b border-border sticky top-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="text-xl font-bold text-white">A</span>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-text-main">Ammar Translator</h1>
            <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Mobile Neural Engine</p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden sm:flex items-center bg-app-bg p-1 rounded-xl border border-border">
          <button
            onClick={() => setActiveTab('translator')}
            className={cn(
              "flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all",
              activeTab === 'translator'
                ? "bg-white text-primary shadow-sm"
                : "text-text-muted hover:text-text-main"
            )}
          >
            <Languages size={18} />
            <span>TRANSLATOR</span>
          </button>
          <button
            onClick={() => setActiveTab('learn')}
            className={cn(
              "flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all",
              activeTab === 'learn'
                ? "bg-white text-secondary shadow-sm"
                : "text-text-muted hover:text-text-main"
            )}
          >
            <BookOpen size={18} />
            <span>LEARN HUB</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 w-full max-w-2xl mx-auto p-4 sm:p-8">
        <AnimatePresence mode="wait">
          {activeTab === 'translator' ? (
            <motion.div 
              key="translator"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full"
            >
              <TranslatorView />
            </motion.div>
          ) : (
            <motion.div
              key="learn"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full"
            >
              <LearnLanguage />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-border p-2 sm:hidden z-50 mobile-nav">
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
            <span className="text-[10px] font-bold uppercase tracking-tight">Translate</span>
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
            <span className="text-[10px] font-bold uppercase tracking-tight">Learn</span>
          </button>
        </div>
      </nav>

    </div>
  );
}
