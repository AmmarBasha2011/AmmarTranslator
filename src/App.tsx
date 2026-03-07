import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Languages, BookOpen } from 'lucide-react';
import { cn } from './lib/utils';
import TranslatorView from './components/TranslatorView';
import LearnLanguage from './components/LearnLanguage';

export default function App() {
  const [activeTab, setActiveTab] = useState<'translator' | 'learn'>('translator');

  return (
    <div className="min-h-screen bg-deep-space text-bright-white selection:bg-neon-cyan/30 selection:text-white flex flex-col font-sans overflow-x-hidden pb-20 sm:pb-0">
      
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-15%] left-[-15%] w-[60%] h-[60%] bg-electric-purple/10 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-[-15%] right-[-15%] w-[60%] h-[60%] bg-neon-cyan/10 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header */}
      <header className="relative z-10 w-full p-6 flex items-center justify-between glass border-b border-white/5 sticky top-0">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-electric-purple via-neon-cyan to-electric-purple bg-[length:200%_200%] animate-gradient flex items-center justify-center shadow-2xl shadow-neon-cyan/20 overflow-hidden relative group">
            <span className="text-2xl font-black text-white relative z-10">A</span>
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter uppercase italic">Ammar Translator</h1>
            <p className="text-[10px] text-muted-grey font-mono uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse" />
              Next-Gen Neural Engine
            </p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden sm:flex items-center bg-black/40 p-1.5 rounded-2xl border border-white/10 neo-blur">
          <button
            onClick={() => setActiveTab('translator')}
            className={cn(
              "flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300",
              activeTab === 'translator'
                ? "bg-neon-cyan text-deep-space shadow-xl shadow-neon-cyan/20 scale-105"
                : "text-muted-grey hover:text-bright-white hover:bg-white/5"
            )}
          >
            <Languages size={18} />
            <span>TRANSLATOR</span>
          </button>
          <button
            onClick={() => setActiveTab('learn')}
            className={cn(
              "flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300",
              activeTab === 'learn'
                ? "bg-electric-purple text-white shadow-xl shadow-electric-purple/20 scale-105"
                : "text-muted-grey hover:text-bright-white hover:bg-white/5"
            )}
          >
            <BookOpen size={18} />
            <span>LEARN HUB</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 w-full max-w-4xl mx-auto p-4 sm:p-8 mt-4">
        <AnimatePresence mode="wait">
          {activeTab === 'translator' ? (
            <motion.div 
              key="translator"
              initial={{ opacity: 0, scale: 0.98, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -20 }}
              transition={{ duration: 0.4, ease: "circOut" }}
              className="w-full"
            >
              <TranslatorView />
            </motion.div>
          ) : (
            <motion.div
              key="learn"
              initial={{ opacity: 0, scale: 0.98, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -20 }}
              transition={{ duration: 0.4, ease: "circOut" }}
              className="w-full"
            >
              <LearnLanguage />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 glass border-t border-white/10 p-3 sm:hidden z-50 rounded-t-3xl">
        <div className="flex justify-around items-center gap-4">
          <button
            onClick={() => setActiveTab('translator')}
            className={cn(
              "flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all w-full",
              activeTab === 'translator'
                ? "bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20"
                : "text-muted-grey hover:text-bright-white"
            )}
          >
            <Languages size={22} />
            <span className="text-[10px] font-black uppercase tracking-widest">Translate</span>
          </button>
          
          <button
            onClick={() => setActiveTab('learn')}
            className={cn(
              "flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all w-full",
              activeTab === 'learn'
                ? "bg-electric-purple/10 text-electric-purple border border-electric-purple/20"
                : "text-muted-grey hover:text-bright-white"
            )}
          >
            <BookOpen size={22} />
            <span className="text-[10px] font-black uppercase tracking-widest">Learn</span>
          </button>
        </div>
      </nav>

      {/* Global CSS for custom animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          animation: gradient 6s ease infinite;
        }
      `}} />

    </div>
  );
}
