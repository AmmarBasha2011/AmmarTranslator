import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Keyboard, Check, FileText, Code, Copy, Globe, Info } from 'lucide-react';
import { ARABIC_TO_AMMAR, MAX_CHARS, MIX_CHARS, VOWEL_CHARS } from '../constants';
import { cn } from '../lib/utils';

const KEYBOARD_LAYOUT = `OK_Layout_Begin
Name:AmmarLang
1234567890
f̱WaᵃrTYåaH
bsdfgH̅H̱kL
zz̊s̊şmno
!@#$%^&*()
Fwaᵃ̊rṮYåAoH
bs̶̊s̶fgH̅H̱KL
Ṯ̶Z̊S̊ŞMNO
£¥€$₹^&*()№√÷
~\`{}%_-=|+§∷‡
@[]#/\'"«»—‐–
…<>!;:?‹›±.,
ˉˋˇ´¨˙˚¸﹐˛˘˜ˆ
―∑éə®†Ωœøπ•·¡
æß∂ðƒ©ªº∆≠℥∞¿
ʒΩ≈çþ∫ŋµ≤≥°
OK_Layout_End`;

export default function LearnLanguage() {
  const [activeTab, setActiveTab] = useState<'guide' | 'keyboard' | 'docs'>('guide');
  const [copiedKeyboard, setCopiedKeyboard] = useState(false);

  const handleCopyKeyboard = () => {
    navigator.clipboard.writeText(KEYBOARD_LAYOUT);
    setCopiedKeyboard(true);
    setTimeout(() => setCopiedKeyboard(false), 2000);
  };

  return (
    <div className="w-full space-y-6 pb-20">
      
      {/* Tab Switcher */}
      <div className="flex bg-white p-1 rounded-xl border border-border shadow-sm sticky top-20 z-20 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('guide')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold tracking-tight transition-all uppercase whitespace-nowrap",
            activeTab === 'guide' ? 'bg-primary text-white shadow-md' : 'text-text-muted hover:bg-slate-50'
          )}
        >
          <BookOpen size={16} />
          Guide
        </button>
        <button
          onClick={() => setActiveTab('keyboard')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold tracking-tight transition-all uppercase whitespace-nowrap",
            activeTab === 'keyboard' ? 'bg-secondary text-white shadow-md' : 'text-text-muted hover:bg-slate-50'
          )}
        >
          <Keyboard size={16} />
          Matrix
        </button>
        <button
          onClick={() => setActiveTab('docs')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold tracking-tight transition-all uppercase whitespace-nowrap",
            activeTab === 'docs' ? 'bg-primary text-white shadow-md' : 'text-text-muted hover:bg-slate-50'
          )}
        >
          <Code size={16} />
          API
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'guide' && (
          <motion.div
            key="guide"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Introduction */}
            <section className="bg-white p-6 rounded-3xl border border-border shadow-sm space-y-3">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">The Ammar Protocol</h2>
              <p className="text-sm text-text-muted leading-relaxed">
                A modern neural construct for Arabic semantic transformation. Built on geometric phoneme modification.
              </p>
            </section>

            {/* Protocol Stack */}
            <section className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden">
              <div className="p-5 border-b border-border bg-slate-50/50 flex items-center gap-3">
                <Info size={18} className="text-primary" />
                <h3 className="font-bold text-sm uppercase tracking-wider">Logic Stack</h3>
              </div>
              <div className="p-5 space-y-6">
                {[
                  { id: 'I', name: 'Grammar Shield', desc: 'Auto-normalization to Nominative case (Al-Raf\').', color: 'bg-blue-50 text-blue-600' },
                  { id: 'II', name: 'Reflection Protocol', desc: 'Complete sequence reversal of the base word vector.', color: 'bg-indigo-50 text-indigo-600' },
                  { id: 'III', name: 'Scalar Mapping', desc: 'Length-based suffix injection (+LO/+RI).', color: 'bg-purple-50 text-purple-600' },
                  { id: 'IV', name: 'Neural Vowels', desc: 'Vowel-detected prefix trigger (+MU).', color: 'bg-pink-50 text-pink-600' },
                ].map((step, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0", step.color)}>
                      {step.id}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-800">{step.name}</h4>
                      <p className="text-xs text-text-muted mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Practical Example */}
            <section className="bg-white p-6 rounded-3xl border border-border shadow-sm">
              <h3 className="font-bold text-sm uppercase tracking-wider mb-4">Sample Trace</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-xs font-bold text-text-muted uppercase">Input</span>
                  <span className="text-lg font-bold text-slate-800">أبي</span>
                </div>
                <div className="flex flex-col gap-2 p-3 bg-primary/5 rounded-2xl border border-primary/10">
                   <div className="flex items-center justify-between">
                     <span className="text-[10px] font-bold text-primary uppercase">I. Grammar</span>
                     <span className="text-xs font-medium italic">No change</span>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="text-[10px] font-bold text-primary uppercase">II. Reflection</span>
                     <span className="text-xs font-bold">iba</span>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="text-[10px] font-bold text-primary uppercase">III. Suffixes</span>
                     <span className="text-xs font-bold">iba + ri</span>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="text-[10px] font-bold text-primary uppercase">IV. Prefix</span>
                     <span className="text-xs font-bold">mu + ibari</span>
                   </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-primary to-secondary rounded-2xl text-white shadow-lg shadow-primary/20">
                  <span className="text-xs font-bold uppercase">Result</span>
                  <span className="text-lg font-bold">muibari</span>
                </div>
              </div>
            </section>
          </motion.div>
        )}

        {activeTab === 'keyboard' && (
          <motion.div
            key="keyboard"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-4"
          >
            <section className="bg-white p-6 rounded-3xl border border-border shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Input Matrix</h3>
              <p className="text-sm text-text-muted mb-6">
                Inject the Ammar Neural Keyboard into <span className="text-primary font-bold italic">Multiling O Overlay</span>.
              </p>
              
              <div className="bg-slate-50 rounded-2xl p-4 mb-6 font-mono text-[10px] text-primary/70 overflow-x-auto whitespace-pre leading-relaxed border border-border">
                {KEYBOARD_LAYOUT}
              </div>

              <button
                onClick={handleCopyKeyboard}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary text-white rounded-2xl font-bold text-sm uppercase tracking-wide hover:shadow-lg transition-all active:scale-95"
              >
                {copiedKeyboard ? <Check size={18} /> : <Copy size={18} />}
                {copiedKeyboard ? "Matrix Synced" : "Copy Matrix"}
              </button>
            </section>
          </motion.div>
        )}

        {activeTab === 'docs' && (
          <motion.div
            key="docs"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-4"
          >
            <section className="bg-white p-6 rounded-3xl border border-border shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-900">API Documentation</h3>
                <span className="px-2 py-0.5 rounded-full bg-green-50 text-[10px] font-bold text-green-600 border border-green-100 uppercase">Active</span>
              </div>

              <div className="space-y-6">
                <div className="bg-slate-50 rounded-2xl p-4 border border-border">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-2 py-1 rounded-lg bg-primary text-white text-[10px] font-bold">GET</span>
                    <code className="text-xs text-primary font-bold">/api/translate</code>
                  </div>
                  
                  <div className="grid gap-2">
                    {['text', 'from', 'to'].map(param => (
                      <div key={param} className="flex items-center justify-between p-2 bg-white rounded-lg border border-border">
                         <span className="text-[10px] font-bold text-slate-700 uppercase">{param}</span>
                         <span className="text-[9px] text-text-muted italic">Required</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Example Request</h4>
                  <div className="bg-slate-900 text-white p-4 rounded-2xl font-mono text-[10px] overflow-x-auto italic">
                    {`curl "https://ammartranslator.netlify.app/api/translate?text=أبي&from=ar&to=am"`}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Response Body</h4>
                  <div className="bg-slate-900 text-indigo-300 p-4 rounded-2xl font-mono text-[10px] overflow-x-auto italic">
{`{
  "text": "أبي",
  "translated": "muibari",
  "pronunciation": "مُويِيبري",
  "from": "ar",
  "to": "am"
}`}
                  </div>
                </div>
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
