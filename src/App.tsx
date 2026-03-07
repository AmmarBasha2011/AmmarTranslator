
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Languages, BookOpen, Keyboard } from 'lucide-react';
import { cn } from './lib/utils';
import TranslatorView from './components/TranslatorView';
import LearnLanguage from './components/LearnLanguage';

export default function App() {
  const [activeTab, setActiveTab] = useState<'translator' | 'learn'>('translator');

  return (
    <div className="min-h-screen bg-deep-blue-950 text-white selection:bg-neon-blue/30 selection:text-white flex flex-col font-sans overflow-x-hidden pb-20 sm:pb-0">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-neon-blue/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-neon-cyan/5 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 w-full p-4 sm:p-6 flex items-center justify-center border-b border-white/5 bg-deep-blue-950/80 backdrop-blur-md sticky top-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-blue to-neon-cyan flex items-center justify-center shadow-lg shadow-neon-blue/20">
            <span className="text-xl font-bold text-white">A</span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Ammar Translator</h1>
            <p className="text-xs text-slate-400 font-mono">V6.0 • AI Powered</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 w-full max-w-3xl mx-auto p-4 sm:p-6">
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
      <nav className="fixed bottom-0 left-0 right-0 bg-deep-blue-950/90 backdrop-blur-lg border-t border-white/10 p-2 sm:hidden z-50">
        <div className="flex justify-around items-center">
          <button
            onClick={() => setActiveTab('translator')}
            className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-xl transition-all w-full",
              activeTab === 'translator' ? "text-neon-blue" : "text-slate-500 hover:text-slate-300"
            )}
          >
            <Languages size={24} />
            <span className="text-xs font-medium">Translate</span>
          </button>
          
          <button
            onClick={() => setActiveTab('learn')}
            className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-xl transition-all w-full",
              activeTab === 'learn' ? "text-neon-cyan" : "text-slate-500 hover:text-slate-300"
            )}
          >
            <BookOpen size={24} />
            <span className="text-xs font-medium">Learn</span>
          </button>
        </div>
      </nav>

      {/* Desktop Navigation (Hidden on Mobile) */}
      <div className="hidden sm:flex fixed top-6 right-6 z-50 bg-deep-blue-900/50 p-1 rounded-full border border-white/5 backdrop-blur-md">
        <button
          onClick={() => setActiveTab('translator')}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
            activeTab === 'translator' 
              ? "bg-neon-blue text-white shadow-lg shadow-neon-blue/20" 
              : "text-slate-400 hover:text-white hover:bg-white/5"
          )}
        >
          <Languages size={16} />
          <span>Translator</span>
        </button>
        <button
          onClick={() => setActiveTab('learn')}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
            activeTab === 'learn' 
              ? "bg-neon-cyan text-deep-blue-950 shadow-lg shadow-neon-cyan/20" 
              : "text-slate-400 hover:text-white hover:bg-white/5"
          )}
        >
          <BookOpen size={16} />
          <span>Learn Language</span>
        </button>
      </div>

    </div>
  );
}
