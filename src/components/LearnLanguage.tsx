import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Book, Info, FileText, ChevronRight, Terminal, Globe, Zap, Shield, Code, ExternalLink, Copy, Check, Keyboard, Cpu } from 'lucide-react';
import { cn } from '../lib/utils';
import { ARABIC_TO_AMMAR, MAX_CHARS, MIX_CHARS, VOWEL_CHARS } from '../constants';

type Tab = 'guide' | 'keyboard' | 'docs';

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
  const [activeTab, setActiveTab] = useState<Tab>('guide');
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const families = [
    {
      name: "Basic Family",
      description: "Characters with no modifiers. Pure and simple.",
      chars: ['ب', 'ت', 'ج', 'د', 'ر', 'ز', 'س', 'ف', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي', 'ا'],
      color: "text-zinc-400"
    },
    {
      name: "Max Family",
      description: "Characters with one modifier (Yoghashak, Multi, etc).",
      chars: Array.from(MAX_CHARS).filter(c => !MIX_CHARS.has(c)),
      color: "text-indigo-400"
    },
    {
      name: "Mix Family",
      description: "Complex characters with multiple modifiers.",
      chars: Array.from(MIX_CHARS),
      color: "text-emerald-400"
    }
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Sub Navigation */}
      <div className="flex items-center gap-1 bg-zinc-900/50 p-1 rounded-2xl border border-zinc-800 self-start shadow-lg shadow-black/20">
        <button
          onClick={() => setActiveTab('guide')}
          className={cn(
            "flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
            activeTab === 'guide' ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"
          )}
        >
          <Info size={14} />
          <span>Guide</span>
        </button>
        <button
          onClick={() => setActiveTab('keyboard')}
          className={cn(
            "flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
            activeTab === 'keyboard' ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"
          )}
        >
          <Keyboard size={14} />
          <span>Keyboard</span>
        </button>
        <button
          onClick={() => setActiveTab('docs')}
          className={cn(
            "flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
            activeTab === 'docs' ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"
          )}
        >
          <FileText size={14} />
          <span>API Docs</span>
        </button>
      </div>

      <div className="space-y-6">
        <AnimatePresence mode="wait">
          {activeTab === 'guide' ? (
            <motion.div 
              key="guide"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 gap-6"
            >
              {/* Intro Section */}
              <section className="bg-zinc-900/30 border border-zinc-800 rounded-3xl p-8 shadow-xl shadow-black/10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                    <Globe size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">What is Ammar Language?</h2>
                    <p className="text-sm text-zinc-500 font-mono">Protocol_Definition_v1.0</p>
                  </div>
                </div>
                <p className="text-zinc-400 leading-relaxed">
                  Ammar is a constructed language (conlang) designed for phonetic efficiency and structural uniqueness. 
                  It maps Arabic phonemes to a specialized Latin-based script with unique modifiers.
                </p>
              </section>

              {/* Rules Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <section className="bg-zinc-900/30 border border-zinc-800 rounded-3xl p-8 shadow-xl shadow-black/10">
                  <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Terminal size={16} />
                    Structural_Rules
                  </h3>
                  <ul className="space-y-4">
                    {[
                      { title: "Vowel Prefix", desc: "Words starting with vowels (أ, ا, ع, etc.) get a 'mu' prefix." },
                      { title: "Phonetic Mapping", desc: "Each Arabic letter maps to a specific Ammar character." },
                      { title: "Length Suffix", desc: "Even-length words get 'lo', odd-length get 'ri'." },
                      { title: "Complexity Suffix", desc: "Words with 'Max' characters get 'um', 'Mix' get 'ax'." }
                    ].map((rule, i) => (
                      <li key={i} className="flex gap-4">
                        <span className="text-indigo-500 font-mono text-xs mt-1">0{i+1}</span>
                        <div>
                          <h4 className="text-sm font-bold text-zinc-200">{rule.title}</h4>
                          <p className="text-xs text-zinc-500 mt-1">{rule.desc}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="bg-zinc-900/30 border border-zinc-800 rounded-3xl p-8 shadow-xl shadow-black/10">
                  <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Zap size={16} />
                    Live_Examples
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-black/40 border border-zinc-800 rounded-2xl p-4">
                      <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Example 1: "مصر" (Egypt)</h4>
                      <div className="flex items-center gap-3 font-mono text-sm">
                        <span className="text-zinc-400">M + s + r</span>
                        <ChevronRight size={14} className="text-zinc-700" />
                        <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded">Msrlaum</span>
                      </div>
                    </div>
                    <div className="bg-black/40 border border-zinc-800 rounded-2xl p-4">
                      <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Example 2: "عمار" (Ammar)</h4>
                      <div className="flex items-center gap-3 font-mono text-sm">
                        <span className="text-zinc-400">mu + aᵃm...</span>
                        <ChevronRight size={14} className="text-zinc-700" />
                        <span className="px-2 py-1 bg-indigo-500/10 text-indigo-400 rounded">muaᵃmmarloaxum</span>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              {/* Character Families */}
              <section className="bg-zinc-900/30 border border-zinc-800 rounded-3xl p-8 shadow-xl shadow-black/10">
                <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-6">Character_Families</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {families.map((family) => (
                    <div key={family.name} className="space-y-4">
                      <div>
                        <h4 className={cn("text-xs font-bold uppercase tracking-widest", family.color)}>{family.name}</h4>
                        <p className="text-[10px] text-zinc-600 mt-1">{family.description}</p>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {family.chars.map(char => (
                          <div key={char} className="w-8 h-8 flex items-center justify-center bg-zinc-900 border border-zinc-800 rounded text-sm text-zinc-400 hover:border-zinc-600 transition-colors cursor-default" title={ARABIC_TO_AMMAR[char]}>
                            {char}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </motion.div>
          ) : activeTab === 'keyboard' ? (
            <motion.div 
              key="keyboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-zinc-900/30 border border-zinc-800 rounded-3xl p-8 shadow-xl shadow-black/10"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <Keyboard size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Custom Keyboard</h2>
                  <p className="text-sm text-zinc-500 font-mono">Input_Method_Protocol</p>
                </div>
              </div>
              <p className="text-zinc-400 mb-6 leading-relaxed">
                Use the custom Ammar keyboard layout with the <span className="text-white font-bold">Multiling O Keyboard</span> app on Android. 
                Copy the code below and paste it into the DIY settings.
              </p>
              <div className="relative group">
                <pre className="bg-black/60 p-6 rounded-2xl border border-zinc-800 font-mono text-xs text-zinc-500 overflow-x-auto leading-relaxed">
                  {KEYBOARD_LAYOUT}
                </pre>
                <button 
                  onClick={() => handleCopy(KEYBOARD_LAYOUT, 'keyboard')}
                  className="absolute top-4 right-4 p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-lg transition-all opacity-0 group-hover:opacity-100"
                >
                  {copied === 'keyboard' ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="docs"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* API Header */}
              <section className="bg-zinc-900/30 border border-zinc-800 rounded-3xl p-8 shadow-xl shadow-black/10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                    <Code size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Developer API</h2>
                    <p className="text-sm text-zinc-500 font-mono">Endpoint_Registry_v6.2</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-black/40 border border-zinc-800 rounded-2xl font-mono text-sm">
                  <span className="px-2 py-0.5 bg-indigo-500 text-white text-[10px] font-bold rounded uppercase">GET</span>
                  <code className="text-zinc-400 truncate flex-1">/api/translate?text=...&from=...&to=...</code>
                  <button 
                    onClick={() => handleCopy(`${window.location.origin}/api/translate`, 'api-url')}
                    className="p-1.5 text-zinc-500 hover:text-white transition-colors"
                  >
                    {copied === 'api-url' ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>
              </section>

              {/* Parameters */}
              <section className="bg-zinc-900/30 border border-zinc-800 rounded-3xl p-8 shadow-xl shadow-black/10">
                <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-6">Query_Parameters</h3>
                <div className="space-y-4">
                  {[
                    { name: "text", type: "string", desc: "The content to be processed.", req: true },
                    { name: "from", type: "enum", desc: "Source language code (en, ar, am, fr, tr, de, es).", req: true },
                    { name: "to", type: "enum", desc: "Target language code (en, ar, am, fr, tr, de, es).", req: true }
                  ].map((param, i) => (
                    <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 p-4 bg-black/20 rounded-2xl border border-zinc-800/50">
                      <div className="min-w-[100px]">
                        <code className="text-indigo-400 font-bold">{param.name}</code>
                        {param.req && <span className="ml-2 text-[10px] text-red-500/70 font-bold uppercase">Required</span>}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-zinc-500 leading-relaxed">{param.desc}</p>
                      </div>
                      <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest bg-zinc-800 px-2 py-1 rounded">
                        {param.type}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Implementation Example */}
              <section className="bg-zinc-900/30 border border-zinc-800 rounded-3xl p-8 shadow-xl shadow-black/10">
                <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-6">Implementation_Example</h3>
                <div className="relative group">
                  <pre className="bg-black/60 p-6 rounded-2xl border border-zinc-800 font-mono text-xs text-zinc-500 overflow-x-auto leading-relaxed">
{`// Example Request
curl "${window.location.origin}/api/translate?text=Hello&from=en&to=am"

// Example Response
{
  "text": "Hello",
  "translated": "muMrH̅barium",
  "from": "en",
  "to": "am"
}`}
                  </pre>
                  <button 
                    onClick={() => handleCopy(`curl "${window.location.origin}/api/translate?text=Hello&from=en&to=am"`, 'curl')}
                    className="absolute top-4 right-4 p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-lg transition-all opacity-0 group-hover:opacity-100"
                  >
                    {copied === 'curl' ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
