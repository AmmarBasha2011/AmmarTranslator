
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Languages, BookOpen, Terminal, Activity, Menu, X } from 'lucide-react';
import { cn } from './lib/utils';
import TranslatorView from './components/TranslatorView';
import LearnLanguage from './components/LearnLanguage';

export default function App() {
  const [activeTab, setActiveTab] = useState<'translator' | 'learn'>('translator');

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 selection:bg-indigo-500/30 selection:text-white flex flex-col font-sans overflow-x-hidden pb-20 sm:pb-0">
      
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
      </div>

      {/* Header */}
      <header className="relative z-50 w-full border-b border-zinc-800/50 bg-[#09090b]/80 backdrop-blur-xl sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Terminal size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight uppercase">Ammar Language</h1>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">System_Active_v6.2</p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center gap-1 bg-zinc-900/50 p-1 rounded-xl border border-zinc-800">
            <button
              onClick={() => setActiveTab('translator')}
              className={cn(
                "flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all",
                activeTab === 'translator' 
                  ? "bg-zinc-800 text-white shadow-sm" 
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50"
              )}
            >
              <Languages size={14} />
              <span>Translator</span>
            </button>
            <button
              onClick={() => setActiveTab('learn')}
              className={cn(
                "flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all",
                activeTab === 'learn' 
                  ? "bg-zinc-800 text-white shadow-sm" 
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50"
              )}
            >
              <BookOpen size={14} />
              <span>Learn</span>
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full">
              <Activity size={12} className="text-emerald-500" />
              <span className="text-[10px] font-mono text-zinc-400 uppercase">Latency: 24ms</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 w-full max-w-4xl mx-auto p-4 sm:p-8">
        <AnimatePresence mode="wait">
          {activeTab === 'translator' ? (
            <motion.div 
              key="translator"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              <TranslatorView />
            </motion.div>
          ) : (
            <motion.div
              key="learn"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              <LearnLanguage />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#09090b]/90 backdrop-blur-xl border-t border-zinc-800 p-2 sm:hidden z-50">
        <div className="flex justify-around items-center">
          <button
            onClick={() => setActiveTab('translator')}
            className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-xl transition-all w-full",
              activeTab === 'translator' ? "text-indigo-400" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            <Languages size={20} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Translate</span>
          </button>
          
          <button
            onClick={() => setActiveTab('learn')}
            className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-xl transition-all w-full",
              activeTab === 'learn' ? "text-emerald-400" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            <BookOpen size={20} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Learn</span>
          </button>
        </div>
      </nav>

    </div>
  );
}
