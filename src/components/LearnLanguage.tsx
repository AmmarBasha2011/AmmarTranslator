import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Keyboard, Check, FileText, Code, Copy, Globe, Info, Zap, Layers, Cpu } from 'lucide-react';
import { ARABIC_TO_AMMAR, MAX_CHARS, MIX_CHARS, VOWEL_CHARS } from '../constants';
import { cn } from '../lib/utils';
import { Language, getTranslation } from '../lib/i18n';

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

interface LearnLanguageProps {
  uiLang?: Language;
}

export default function LearnLanguage({ uiLang = 'en' }: LearnLanguageProps) {
  const t = (key: string) => getTranslation(key, uiLang);
  const [activeTab, setActiveTab] = useState<'guide' | 'keyboard' | 'docs'>('guide');
  const [copiedKeyboard, setCopiedKeyboard] = useState(false);

  const handleCopyKeyboard = () => {
    navigator.clipboard.writeText(KEYBOARD_LAYOUT);
    setCopiedKeyboard(true);
    setTimeout(() => setCopiedKeyboard(false), 2000);
  };

  const families = [
    {
      name: "Basic Family",
      description: "Characters with no modifiers. Pure and simple.",
      chars: ['ب', 'ت', 'ج', 'د', 'ر', 'ز', 'س', 'ف', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي', 'ا'],
      color: "text-slate-500"
    },
    {
      name: "Max Family",
      description: "Characters with one modifier (Yoghashak, Multi, etc).",
      chars: Array.from(MAX_CHARS).filter(c => !MIX_CHARS.has(c)),
      color: "text-primary"
    },
    {
      name: "Mix Family",
      description: "Complex characters with multiple modifiers.",
      chars: Array.from(MIX_CHARS),
      color: "text-secondary"
    }
  ];

  const operations = [
    { name: "Yoghashak", symbol: "\u030A", desc: "Small circle above" },
    { name: "Multi", symbol: "\u0331", desc: "Line below" },
    { name: "Double", symbol: "\u0336", desc: "Strikethrough" },
    { name: "Tikrar", symbol: "\u1d43", desc: "Small 'a' exponent" },
  ];

  return (
    <div className="w-full space-y-6 pb-20">
      
      {/* Tab Switcher */}
      <div className="flex bg-card-bg p-1 rounded-xl border border-border shadow-sm sticky top-20 z-20 overflow-x-auto no-scrollbar" dir="ltr">
        <button
          onClick={() => setActiveTab('guide')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold tracking-tight transition-all uppercase whitespace-nowrap",
            activeTab === 'guide' ? 'bg-primary text-white shadow-md' : 'text-text-muted hover:bg-app-bg'
          )}
        >
          <BookOpen size={16} />
          {t('learn.guide')}
        </button>
        <button
          onClick={() => setActiveTab('keyboard')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold tracking-tight transition-all uppercase whitespace-nowrap",
            activeTab === 'keyboard' ? 'bg-secondary text-white shadow-md' : 'text-text-muted hover:bg-app-bg'
          )}
        >
          <Keyboard size={16} />
          {t('learn.matrix')}
        </button>
        <button
          onClick={() => setActiveTab('docs')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold tracking-tight transition-all uppercase whitespace-nowrap",
            activeTab === 'docs' ? 'bg-primary text-white shadow-md' : 'text-text-muted hover:bg-app-bg'
          )}
        >
          <Code size={16} />
          {t('learn.api')}
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
            <section className="bg-card-bg p-6 rounded-3xl border border-border shadow-sm space-y-3">
              <h2 className="text-2xl font-bold text-text-main tracking-tight">The Ammar Protocol</h2>
              <p className="text-sm text-text-muted leading-relaxed">
                The Ammar Language is a neural construct based on geometric modification of Latin phonemes. It utilizes specific operations to transform base logic into complex Arabic semantic structures.
              </p>
            </section>

            {/* Protocol Stack */}
            <section className="bg-card-bg rounded-3xl border border-border shadow-sm overflow-hidden">
              <div className="p-5 border-b border-border bg-app-bg/50 flex items-center gap-3">
                <Cpu size={18} className="text-primary" />
                <h3 className="font-bold text-sm uppercase tracking-wider">Neural Logic Stack</h3>
              </div>
              <div className="p-5 space-y-6">
                {[
                  { id: 'I', name: 'Grammar Shield', desc: 'Auto-normalization to Nominative (Al-Raf\'). Converts "ين" to "ون" (Plural) or "ان" (Dual).', color: 'bg-blue-50 text-blue-600' },
                  { id: 'II', name: 'Reflection Protocol', desc: 'The most critical stage. Reverses the entire base character sequence before processing.', color: 'bg-indigo-50 text-indigo-600' },
                  { id: 'III', name: 'Scalar Mapping', desc: 'Length-based suffix injection. Even words get +LO, Odd words get +RI.', color: 'bg-purple-50 text-purple-600' },
                  { id: 'IV', name: 'Mix/Max Detection', desc: 'Injects +AX for complex characters and +UM for maximum load characters.', color: 'bg-pink-50 text-pink-600' },
                  { id: 'V', name: 'Neural Vowels', desc: 'Vowel-detected prefix trigger. Words containing vowels are prefixed with +MU.', color: 'bg-orange-50 text-orange-600' },
                ].map((step, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0", step.color)}>
                      {step.id}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-800">{step.name}</h4>
                      <p className="text-xs text-text-muted mt-0.5 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Practical Example */}
            <section className="bg-card-bg p-6 rounded-3xl border border-border shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <Zap size={18} className="text-primary" />
                <h3 className="font-bold text-sm uppercase tracking-wider">Sample Traces</h3>
              </div>

              <div className="space-y-8">
                {/* Example 1 */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-3 py-1 bg-app-bg rounded-lg">
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-tight">Vector A: [أبي]</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-app-bg/50 rounded-2xl border border-border">
                      <span className="text-xs text-text-muted">I. Input</span>
                      <span className="text-sm font-bold">أبي</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-indigo-50/50 rounded-2xl border border-indigo-500/10">
                      <span className="text-xs text-indigo-700 dark:text-indigo-400">II. Reflect</span>
                      <span className="text-sm font-bold text-indigo-900 dark:text-indigo-100">iba</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-primary/5 rounded-2xl border border-primary/10">
                      <span className="text-xs text-primary">III. Scalar</span>
                      <span className="text-sm font-bold">ibari (Odd 3)</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-primary to-secondary rounded-2xl text-white shadow-lg">
                      <span className="text-xs font-bold uppercase">Result</span>
                      <span className="text-lg font-bold">muibari</span>
                    </div>
                  </div>
                </div>

                {/* Example 2 */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-3 py-1 bg-app-bg rounded-lg">
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-tight">Vector B: [عمار]</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-app-bg/50 rounded-2xl border border-border">
                      <span className="text-xs text-text-muted">I. Input</span>
                      <span className="text-sm font-bold">عمار</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-indigo-50/50 rounded-2xl border border-indigo-500/10">
                      <span className="text-xs text-indigo-700 dark:text-indigo-400">II. Reflect</span>
                      <span className="text-sm font-bold text-indigo-900 dark:text-indigo-100">raMaᵃ</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-primary/5 rounded-2xl border border-primary/10">
                      <span className="text-xs text-primary">III. Scalar+Max</span>
                      <span className="text-sm font-bold">raMaᵃloum (Even 4)</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-primary to-secondary rounded-2xl text-white shadow-lg">
                      <span className="text-xs font-bold uppercase">Result</span>
                      <span className="text-lg font-bold">muraMaᵃloum</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Modifiers */}
            <section className="bg-card-bg p-6 rounded-3xl border border-border shadow-sm">
              <h3 className="font-bold text-sm uppercase tracking-wider mb-6">Geometric Modifiers</h3>
              <div className="grid grid-cols-1 gap-4">
                {operations.map((op) => (
                  <div key={op.name} className="flex items-center gap-4 p-4 bg-app-bg rounded-2xl border border-border hover:border-primary/20 transition-all">
                    <div className="w-12 h-12 flex items-center justify-center bg-card-bg rounded-xl text-2xl font-mono text-primary border border-border shadow-sm">
                      ◌{op.symbol}
                    </div>
                    <div>
                      <div className="font-bold text-text-main text-xs uppercase tracking-widest">{op.name}</div>
                      <div className="text-[10px] text-text-muted font-medium mt-0.5">{op.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Neural Vowels */}
            <section className="bg-card-bg p-6 rounded-3xl border border-border shadow-sm">
              <h3 className="font-bold text-sm uppercase tracking-wider mb-6">Neural Vowels</h3>
              <div className="grid grid-cols-4 gap-2">
                {Array.from(VOWEL_CHARS).map((char) => (
                  <div key={char} className="flex flex-col items-center justify-center aspect-square bg-app-bg rounded-xl border border-border hover:border-secondary/30 transition-all">
                    <span className="text-xl font-bold text-text-main">{char}</span>
                    <span className="text-[10px] font-bold text-secondary mt-1 opacity-50">{ARABIC_TO_AMMAR[char]}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-secondary/5 rounded-2xl border border-secondary/10 text-center">
                 <span className="text-[10px] font-bold tracking-widest text-secondary uppercase">Vowel Prefix Requirement:</span>
                 <div className="text-2xl font-bold text-text-main mt-1">"MU"</div>
              </div>
            </section>

            {/* Families */}
            <section className="space-y-4">
              <h3 className="font-bold text-sm uppercase tracking-wider px-2">Char Modules</h3>
              <div className="grid grid-cols-1 gap-4">
                {families.map((family) => (
                  <div key={family.name} className="bg-card-bg rounded-3xl border border-border shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-border bg-app-bg/50 flex items-center justify-between">
                      <div>
                        <h4 className={`text-xs font-bold tracking-widest uppercase ${family.color}`}>{family.name}</h4>
                        <p className="text-[9px] text-text-muted font-bold uppercase tracking-tighter mt-0.5">{family.description}</p>
                      </div>
                      <Globe size={16} className={cn("opacity-20", family.color)} />
                    </div>
                    <div className="p-4 flex flex-wrap gap-2">
                      {family.chars.map((char) => (
                        <div key={char} className="flex flex-col items-center justify-center w-12 h-12 bg-app-bg rounded-xl border border-border hover:border-primary/30 transition-all">
                          <span className="text-lg text-text-main">{char}</span>
                          <span className="text-[9px] font-bold text-text-muted uppercase mt-0.5 opacity-50">{ARABIC_TO_AMMAR[char]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Complete Matrix Table */}
            <section className="bg-card-bg rounded-3xl border border-border shadow-sm overflow-hidden">
              <div className="p-5 border-b border-border flex items-center justify-between bg-app-bg/50">
                <h3 className="font-bold text-sm uppercase tracking-wider">Logic Mapping Matrix</h3>
                <Layers size={18} className="text-primary opacity-50" />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead className="bg-app-bg text-text-muted font-bold uppercase tracking-widest text-[9px]">
                    <tr>
                      <th className="px-5 py-3 border-b border-border">Signal</th>
                      <th className="px-5 py-3 border-b border-border">Process</th>
                      <th className="px-5 py-3 border-b border-border">Sector</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {Object.entries(ARABIC_TO_AMMAR).map(([ar, am]) => {
                      let family = "Basic";
                      if (MIX_CHARS.has(ar)) family = "Mix";
                      else if (MAX_CHARS.has(ar)) family = "Max";

                      return (
                        <tr key={ar} className="hover:bg-app-bg transition-colors">
                          <td className="px-5 py-3 font-bold text-text-main text-lg">{ar}</td>
                          <td className="px-5 py-3 font-bold text-primary text-lg tracking-tight">{am}</td>
                          <td className="px-5 py-3">
                            <span className={cn(
                              "text-[9px] font-bold tracking-widest uppercase px-2 py-1 rounded-md border",
                              family === 'Basic' ? 'bg-app-bg text-text-muted border-border' :
                              family === 'Max' ? 'bg-primary/5 text-primary border-primary/10' :
                              'bg-secondary/5 text-secondary border-secondary/10'
                            )}>
                              {family}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
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
            <section className="bg-card-bg p-6 rounded-3xl border border-border shadow-sm">
              <h3 className="text-lg font-bold text-text-main mb-2">Input Matrix</h3>
              <p className="text-sm text-text-muted mb-6">
                Inject the Ammar Neural Keyboard into <span className="text-primary font-bold italic">Multiling O Overlay</span>.
              </p>
              
              <div className="bg-app-bg rounded-2xl p-4 mb-6 font-mono text-[10px] text-primary/70 overflow-x-auto whitespace-pre leading-relaxed border border-border">
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
            <section className="bg-card-bg p-6 rounded-3xl border border-border shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-text-main">API Documentation</h3>
                <span className="px-2 py-0.5 rounded-full bg-green-50 text-[10px] font-bold text-green-600 border border-green-100 uppercase">Active</span>
              </div>

              <div className="space-y-6">
                <div className="bg-app-bg rounded-2xl p-4 border border-border">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-2 py-1 rounded-lg bg-primary text-white text-[10px] font-bold">GET</span>
                    <code className="text-xs text-primary font-bold">/api/translate</code>
                  </div>
                  
                  <div className="grid gap-2">
                    {['text', 'from', 'to'].map(param => (
                      <div key={param} className="flex items-center justify-between p-2 bg-card-bg rounded-lg border border-border">
                         <span className="text-[10px] font-bold text-text-main uppercase">{param}</span>
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

                {/* Hub GET */}
                <div className="bg-app-bg rounded-2xl p-4 border border-border">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-2 py-1 rounded-lg bg-primary text-white text-[10px] font-bold">GET</span>
                    <code className="text-xs text-primary font-bold">/hub-get</code>
                  </div>
                  <p className="text-[10px] text-text-muted mb-4 uppercase font-bold tracking-tight">Retrieve all posts from the Hub (Powered by Supabase).</p>
                  <div className="bg-slate-900 text-green-400 p-4 rounded-2xl font-mono text-[10px] overflow-x-auto italic">
{`[
  {
    "id": "1",
    "text_ar": "Example",
    "text_am": "muiaia\u1d43Nsriaxum",
    "created_at": "2026-03-08"
  }
]`}
                  </div>
                </div>

                {/* Hub ADD */}
                <div className="bg-app-bg rounded-2xl p-4 border border-border">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-2 py-1 rounded-lg bg-indigo-500 text-white text-[10px] font-bold">POST</span>
                    <code className="text-xs text-indigo-500 font-bold">/hub-add</code>
                  </div>
                  <p className="text-[10px] text-text-muted mb-4 uppercase font-bold tracking-tight">Add a new post with syntax validation.</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between p-2 bg-card-bg rounded-lg border border-border">
                       <span className="text-[10px] font-bold text-text-main uppercase">text_am</span>
                       <span className="text-[9px] text-text-muted italic">Required</span>
                    </div>
                  </div>

                  <div className="bg-slate-900 text-indigo-300 p-4 rounded-2xl font-mono text-[10px] overflow-x-auto italic">
{`{
  "success": true,
  "id": 123,
  "validated": true,
  "errors": []
}`}
                  </div>
                </div>

                {/* Database Setup */}
                <div className="bg-amber-500/10 rounded-2xl p-4 border border-amber-500/20">
                   <div className="flex items-center gap-3 mb-4">
                    <span className="px-2 py-1 rounded-lg bg-amber-500 text-white text-[10px] font-bold">SQL</span>
                    <code className="text-xs text-amber-600 font-bold uppercase tracking-tight">Database Schema</code>
                  </div>
                  <p className="text-[10px] text-amber-700 mb-4 uppercase font-bold tracking-tight">Run this command in Supabase SQL Editor to create the tables.</p>
                  <div className="bg-slate-900 text-amber-200 p-4 rounded-2xl font-mono text-[10px] overflow-x-auto">
{`CREATE TABLE posts (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  text_ar TEXT,
  text_am TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE posts;`}
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
