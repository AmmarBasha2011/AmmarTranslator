
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Keyboard, Check, FileText, Code, Copy, Globe } from 'lucide-react';
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

  const families = [
    {
      name: "Basic Family",
      description: "Characters with no modifiers. Pure and simple.",
      chars: ['ب', 'ت', 'ج', 'د', 'ر', 'ز', 'س', 'ف', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي', 'ا'],
      color: "text-muted-grey"
    },
    {
      name: "Max Family",
      description: "Characters with one modifier (Yoghashak, Multi, etc).",
      chars: Array.from(MAX_CHARS).filter(c => !MIX_CHARS.has(c)),
      color: "text-neon-cyan"
    },
    {
      name: "Mix Family",
      description: "Complex characters with multiple modifiers.",
      chars: Array.from(MIX_CHARS),
      color: "text-electric-purple"
    }
  ];

  const operations = [
    { name: "Yoghashak", symbol: "\u030A", desc: "Small circle above" },
    { name: "Multi", symbol: "\u0331", desc: "Line below" },
    { name: "Double", symbol: "\u0336", desc: "Strikethrough" },
    { name: "Tikrar", symbol: "\u1d43", desc: "Small 'a' exponent" },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 p-2 pb-24">
      
      {/* Tab Switcher */}
      <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/10 neo-blur w-fit mx-auto overflow-x-auto max-w-full">
        <button
          onClick={() => setActiveTab('guide')}
          className={cn(
            "flex items-center gap-2.5 px-6 py-3 rounded-xl text-xs font-black tracking-widest transition-all uppercase whitespace-nowrap",
            activeTab === 'guide' ? 'bg-neon-cyan text-deep-space shadow-xl' : 'text-muted-grey hover:text-bright-white hover:bg-white/5'
          )}
        >
          <BookOpen size={16} />
          Protocol Guide
        </button>
        <button
          onClick={() => setActiveTab('keyboard')}
          className={cn(
            "flex items-center gap-2.5 px-6 py-3 rounded-xl text-xs font-black tracking-widest transition-all uppercase whitespace-nowrap",
            activeTab === 'keyboard' ? 'bg-electric-purple text-white shadow-xl' : 'text-muted-grey hover:text-bright-white hover:bg-white/5'
          )}
        >
          <Keyboard size={16} />
          Interface Matrix
        </button>
        <button
          onClick={() => setActiveTab('docs')}
          className={cn(
            "flex items-center gap-2.5 px-6 py-3 rounded-xl text-xs font-black tracking-widest transition-all uppercase whitespace-nowrap",
            activeTab === 'docs' ? 'bg-neon-cyan text-deep-space shadow-xl' : 'text-muted-grey hover:text-bright-white hover:bg-white/5'
          )}
        >
          <FileText size={16} />
          Terminal API
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'guide' && (
          <motion.div
            key="guide"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            {/* Introduction */}
            <section className="glass p-8 rounded-3xl border border-white/10 space-y-4">
              <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-neon-cyan to-electric-purple">The Ammar Protocol</h2>
              <p className="text-muted-grey leading-relaxed font-medium">
                The Ammar Language is a neural construct based on geometric modification of Latin phonemes.
                It utilizes specific operations to transform base logic into complex Arabic semantic structures.
              </p>
            </section>

            {/* Operations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <section className="glass p-8 rounded-3xl border border-white/10">
                <h3 className="text-xl font-black text-neon-cyan mb-6 uppercase tracking-widest italic">1. Modifiers</h3>
                <div className="grid grid-cols-1 gap-4">
                  {operations.map((op) => (
                    <div key={op.name} className="flex items-center gap-5 bg-black/40 p-4 rounded-2xl border border-white/5 hover:border-neon-cyan/30 transition-all group">
                      <div className="w-14 h-14 flex items-center justify-center bg-neon-cyan/5 rounded-xl text-3xl font-mono text-neon-cyan group-hover:bg-neon-cyan/20 transition-all border border-neon-cyan/20">
                        ◌{op.symbol}
                      </div>
                      <div>
                        <div className="font-black text-bright-white text-xs uppercase tracking-widest">{op.name}</div>
                        <div className="text-xs text-muted-grey font-medium mt-1">{op.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="glass p-8 rounded-3xl border border-white/10">
                <h3 className="text-xl font-black text-electric-purple mb-6 uppercase tracking-widest italic">2. Neural Vowels</h3>
                <div className="grid grid-cols-4 gap-3">
                  {Array.from(VOWEL_CHARS).map((char) => (
                    <div key={char} className="flex flex-col items-center justify-center aspect-square bg-black/40 rounded-2xl border border-electric-purple/20 hover:border-electric-purple/50 transition-all group">
                      <span className="text-2xl font-black text-white">{char}</span>
                      <span className="text-[10px] font-black text-electric-purple mt-1 opacity-50">{ARABIC_TO_AMMAR[char]}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-electric-purple/10 rounded-2xl border border-electric-purple/20 text-center">
                   <span className="text-[10px] font-black tracking-widest text-electric-purple uppercase">Vowel Prefix Requirement:</span>
                   <div className="text-2xl font-black text-white mt-1">"MU"</div>
                </div>
              </section>
            </div>

            {/* Families */}
            <section className="space-y-6">
              <h3 className="text-xl font-black text-white uppercase tracking-widest italic px-4">3. Char Modules</h3>
              <div className="grid grid-cols-1 gap-6">
                {families.map((family) => (
                  <div key={family.name} className="glass rounded-3xl border border-white/10 overflow-hidden">
                    <div className="p-6 border-b border-white/5 bg-black/20 flex items-center justify-between">
                      <div>
                        <h4 className={`text-sm font-black tracking-widest uppercase ${family.color}`}>{family.name}</h4>
                        <p className="text-[10px] text-muted-grey font-medium uppercase tracking-tighter mt-1">{family.description}</p>
                      </div>
                      <Globe size={20} className={cn("opacity-20", family.color)} />
                    </div>
                    <div className="p-6 flex flex-wrap gap-3">
                      {family.chars.map((char) => (
                        <div key={char} className="flex flex-col items-center justify-center w-14 h-14 bg-black/40 rounded-xl border border-white/5 hover:border-white/20 transition-all">
                          <span className="text-xl text-white">{char}</span>
                          <span className="text-[8px] font-black text-muted-grey uppercase mt-1 opacity-50">{ARABIC_TO_AMMAR[char]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Matrix Table */}
            <section className="glass rounded-3xl border border-white/10 overflow-hidden">
              <div className="p-8 border-b border-white/5 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black text-white italic uppercase italic">4. Logic Mapping</h3>
                  <p className="text-xs text-muted-grey mt-1 font-medium uppercase tracking-widest">Complete Translation Matrix</p>
                </div>
                <Code size={24} className="text-neon-cyan opacity-50" />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead className="bg-black/40 text-muted-grey font-black uppercase tracking-widest text-[10px]">
                    <tr>
                      <th className="px-8 py-5 border-b border-white/5">Signal</th>
                      <th className="px-8 py-5 border-b border-white/5">Process</th>
                      <th className="px-8 py-5 border-b border-white/5">Sector</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {Object.entries(ARABIC_TO_AMMAR).map(([ar, am]) => {
                      let family = "Basic";
                      if (MIX_CHARS.has(ar)) family = "Mix";
                      else if (MAX_CHARS.has(ar)) family = "Max";
                      
                      return (
                        <tr key={ar} className="hover:bg-white/5 transition-colors group">
                          <td className="px-8 py-4 font-black text-white text-xl">{ar}</td>
                          <td className="px-8 py-4 font-black text-neon-cyan text-xl tracking-tighter">{am}</td>
                          <td className="px-8 py-4">
                            <span className={cn(
                              "text-[10px] font-black tracking-widest uppercase px-3 py-1.5 rounded-lg border",
                              family === 'Basic' ? 'bg-white/5 text-muted-grey border-white/10' :
                              family === 'Max' ? 'bg-neon-cyan/5 text-neon-cyan border-neon-cyan/20' :
                              'bg-electric-purple/5 text-electric-purple border-electric-purple/20'
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

            {/* Suffix Rules */}
            <section className="glass p-10 rounded-[2.5rem] border border-white/10">
              <h3 className="text-2xl font-black text-white uppercase italic tracking-widest mb-10 text-center">5. Logic Gates & Suffix Protocol</h3>
              
              <div className="space-y-12 max-w-2xl mx-auto">
                <div className="relative pl-12 border-l-2 border-neon-cyan/30 py-2">
                  <div className="absolute -left-[11px] top-4 w-5 h-5 rounded-full bg-deep-space border-2 border-neon-cyan shadow-[0_0_10px_rgba(0,242,255,0.5)]"></div>
                  <h4 className="font-black text-white text-sm uppercase tracking-widest mb-3 italic">Protocol Alpha: Scalar Length</h4>
                  <p className="text-muted-grey text-sm font-medium mb-5">Analyzes word vector magnitude for final character mapping.</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-black/60 p-5 rounded-2xl border border-white/5 text-center group hover:border-neon-cyan/30 transition-all">
                      <div className="text-[10px] font-black text-muted-grey uppercase tracking-widest mb-2">Even Matrix</div>
                      <div className="text-2xl font-black text-neon-cyan italic">+LO</div>
                    </div>
                    <div className="bg-black/60 p-5 rounded-2xl border border-white/5 text-center group hover:border-neon-cyan/30 transition-all">
                      <div className="text-[10px] font-black text-muted-grey uppercase tracking-widest mb-2">Odd Matrix</div>
                      <div className="text-2xl font-black text-neon-cyan italic">+RI</div>
                    </div>
                  </div>
                </div>

                <div className="relative pl-12 border-l-2 border-electric-purple/30 py-2">
                  <div className="absolute -left-[11px] top-4 w-5 h-5 rounded-full bg-deep-space border-2 border-electric-purple shadow-[0_0_10px_rgba(112,0,255,0.5)]"></div>
                  <h4 className="font-black text-white text-sm uppercase tracking-widest mb-3 italic">Protocol Beta: Mix Factor</h4>
                  <p className="text-muted-grey text-sm font-medium mb-5">Triggered if signal contains complex character interference.</p>
                  <div className="bg-black/60 p-5 rounded-2xl border border-white/5 text-center inline-block min-w-[140px]">
                    <div className="text-2xl font-black text-electric-purple italic">+AX</div>
                  </div>
                </div>

                <div className="relative pl-12 border-l-2 border-neon-cyan/30 py-2">
                  <div className="absolute -left-[11px] top-4 w-5 h-5 rounded-full bg-deep-space border-2 border-neon-cyan shadow-[0_0_10px_rgba(0,242,255,0.5)]"></div>
                  <h4 className="font-black text-white text-sm uppercase tracking-widest mb-3 italic">Protocol Gamma: Max Load</h4>
                  <p className="text-muted-grey text-sm font-medium mb-5">Activated when word complexity exceeds threshold.</p>
                  <div className="bg-black/60 p-5 rounded-2xl border border-white/5 text-center inline-block min-w-[140px]">
                    <div className="text-2xl font-black text-neon-cyan italic">+UM</div>
                  </div>
                </div>
              </div>

              {/* Examples */}
              <div className="mt-16 space-y-6">
                 <div className="glass p-6 rounded-2xl bg-black/40 border border-white/5">
                    <h5 className="text-[10px] font-black text-muted-grey uppercase tracking-[0.2em] mb-4">Sample Trace: [صقر]</h5>
                    <div className="flex flex-wrap items-center gap-3 font-black text-sm tracking-tight">
                       <span className="text-muted-grey italic">s̶̊f̱r</span>
                       <span className="w-4 h-px bg-white/10" />
                       <span className="text-neon-cyan">+RI</span>
                       <span className="text-[10px] text-muted-grey/50">ODD 3</span>
                       <span className="text-white/10">+</span>
                       <span className="text-electric-purple">+AX</span>
                       <span className="text-[10px] text-muted-grey/50">MIX</span>
                       <span className="text-white/10">+</span>
                       <span className="text-neon-cyan">+UM</span>
                       <span className="text-white/10">=</span>
                       <span className="bg-neon-cyan/10 text-neon-cyan px-4 py-2 rounded-xl border border-neon-cyan/20">s̶̊f̱rriaxum</span>
                    </div>
                 </div>

                 <div className="glass p-6 rounded-2xl bg-black/40 border border-white/5">
                    <h5 className="text-[10px] font-black text-muted-grey uppercase tracking-[0.2em] mb-4">Sample Trace: [عمار]</h5>
                    <div className="flex flex-wrap items-center gap-3 font-black text-sm tracking-tight">
                       <span className="text-electric-purple">MU-</span>
                       <span className="text-muted-grey italic">aᵃm...</span>
                       <span className="w-4 h-px bg-white/10" />
                       <span className="text-neon-cyan">+LO</span>
                       <span className="text-white/10">+</span>
                       <span className="text-electric-purple">+AX</span>
                       <span className="text-white/10">+</span>
                       <span className="text-neon-cyan">+UM</span>
                       <span className="text-white/10">=</span>
                       <span className="bg-electric-purple/10 text-electric-purple px-4 py-2 rounded-xl border border-electric-purple/20">muaᵃmmarloaxum</span>
                    </div>
                 </div>
              </div>
            </section>
          </motion.div>
        )}

        {activeTab === 'keyboard' && (
          <motion.div
            key="keyboard"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-6"
          >
            <section className="glass p-10 rounded-[2.5rem] border border-white/10">
              <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-6 flex items-center gap-3">
                <div className="w-2 h-8 bg-electric-purple rounded-full" />
                Input Matrix
              </h3>
              <p className="text-muted-grey font-medium mb-10 leading-relaxed">
                Inject the custom Ammar Neural Keyboard into your Android hardware via the <span className="text-neon-cyan font-black italic">Multiling O Overlay</span>.
              </p>
              
              <div className="bg-black/60 rounded-3xl border border-white/5 p-8 mb-10 font-mono text-xs text-neon-cyan/70 overflow-x-auto whitespace-pre leading-loose neo-blur">
                {KEYBOARD_LAYOUT}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleCopyKeyboard}
                  className="flex-1 flex items-center justify-center gap-3 px-8 py-5 bg-neon-cyan text-deep-space rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-[1.02] transition-all shadow-2xl shadow-neon-cyan/20 active:scale-95"
                >
                  {copiedKeyboard ? <Check size={20} /> : <Copy size={20} />}
                  {copiedKeyboard ? "MATRIX SYNCED" : "INITIALIZE SYNC"}
                </button>
                <div className="flex-1 flex items-center p-6 bg-black/30 rounded-2xl border border-white/5">
                   <p className="text-[10px] font-black text-muted-grey uppercase leading-relaxed tracking-wider">
                     <span className="text-neon-cyan font-black mr-2">PROTOCOL:</span> COPY ENCRYPTED SOURCE AND PASTE INTO DIY TERMINAL WITHIN MULTILING O SETTINGS.
                   </p>
                </div>
              </div>
            </section>
          </motion.div>
        )}

        {activeTab === 'docs' && (
          <motion.div
            key="docs"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-6"
          >
            <section className="glass p-10 rounded-[2.5rem] border border-white/10">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-neon-cyan/20 flex items-center justify-center">
                     <Code size={20} className="text-neon-cyan" />
                   </div>
                   Translation API v2
                </h3>
                <div className="px-3 py-1 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 text-[10px] font-black text-neon-cyan tracking-widest uppercase">
                  ACTIVE
                </div>
              </div>

              <div className="space-y-10">
                <div className="bg-black/40 rounded-3xl border border-white/5 p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="px-4 py-1.5 rounded-xl bg-neon-cyan text-deep-space text-[10px] font-black uppercase tracking-[0.2em]">GET</span>
                    <code className="text-sm text-neon-cyan font-mono font-bold">/api/translate</code>
                  </div>
                  <p className="text-sm text-muted-grey font-medium mb-8 leading-relaxed">Multi-point neural bridge connecting English, Arabic, Ammar, French, Turkish, German, and Spanish.</p>
                  
                  <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-4">Query Vectors</h4>
                  <div className="grid gap-3">
                    <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5 group hover:border-neon-cyan/30 transition-all">
                       <span className="text-xs font-black text-neon-cyan uppercase tracking-tighter">TEXT</span>
                       <span className="text-[10px] font-black text-muted-grey italic uppercase tracking-widest">REQUIRED | DATA STRING</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5 group hover:border-neon-cyan/30 transition-all">
                       <span className="text-xs font-black text-neon-cyan uppercase tracking-tighter">FROM</span>
                       <span className="text-[10px] font-black text-muted-grey italic uppercase tracking-widest">REQUIRED | [EN, AR, AM, FR, TR, DE, ES]</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5 group hover:border-neon-cyan/30 transition-all">
                       <span className="text-xs font-black text-neon-cyan uppercase tracking-tighter">TO</span>
                       <span className="text-[10px] font-black text-muted-grey italic uppercase tracking-widest">REQUIRED | [EN, AR, AM, FR, TR, DE, ES]</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-black/40 rounded-3xl border border-white/5 p-8">
                    <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-6">Execution Signal</h4>
                    <div className="bg-deep-space p-6 rounded-2xl font-mono text-xs text-muted-grey border border-white/5 overflow-x-auto whitespace-pre italic">
                      {`curl "https://ammartranslator.netlify.app/api/translate?text=Hello&from=en&to=am"`}
                    </div>
                  </div>

                  <div className="bg-black/40 rounded-3xl border border-white/5 p-8">
                    <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-6">Neural Feedback</h4>
                    <div className="bg-deep-space p-6 rounded-2xl font-mono text-xs text-neon-cyan/80 border border-white/5 overflow-x-auto whitespace-pre italic">
{`{
  "text": "Hello",
  "translated": "muMrH̅barium",
  "from": "en",
  "to": "am"
}`}
                    </div>
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
