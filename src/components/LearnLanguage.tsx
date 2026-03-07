
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Layers, HelpCircle, Sparkles, Loader2, WifiOff, AlertTriangle, Keyboard, Copy, Check, FileText, Code, Terminal, Cpu } from 'lucide-react';
import { ARABIC_TO_AMMAR, MAX_CHARS, MIX_CHARS, VOWEL_CHARS } from '../constants';

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
      color: "text-slate-300"
    },
    {
      name: "Max Family",
      description: "Characters with one modifier (Yoghashak, Multi, etc).",
      chars: Array.from(MAX_CHARS).filter(c => !MIX_CHARS.has(c)),
      color: "text-neon-blue"
    },
    {
      name: "Mix Family",
      description: "Complex characters with multiple modifiers.",
      chars: Array.from(MIX_CHARS),
      color: "text-neon-cyan"
    }
  ];

  const operations = [
    { name: "Yoghashak", symbol: "\u030A", desc: "Small circle above (or overline for H)" },
    { name: "Multi", symbol: "\u0331", desc: "Line below" },
    { name: "Double", symbol: "\u0336", desc: "Strikethrough" },
    { name: "Tikrar", symbol: "\u1d43", desc: "Small 'a' exponent" },
  ];

  const vowels = Array.from(VOWEL_CHARS);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 p-2 pb-20 font-mono">
      
      {/* Sub-Navigation */}
      <div className="flex flex-col xl:flex-row justify-between items-center gap-4 mb-8">
        <div className="flex bg-black p-1 border border-neon-green/30 overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('guide')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all whitespace-nowrap uppercase tracking-wider ${
              activeTab === 'guide' ? 'bg-neon-green/20 text-neon-green border border-neon-green/50' : 'text-neon-green/50 hover:text-neon-green hover:bg-neon-green/10'
            }`}
          >
            <BookOpen size={16} />
            Guide
          </button>
          <button
            onClick={() => setActiveTab('keyboard')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all whitespace-nowrap uppercase tracking-wider ${
              activeTab === 'keyboard' ? 'bg-neon-green/20 text-neon-green border border-neon-green/50' : 'text-neon-green/50 hover:text-neon-green hover:bg-neon-green/10'
            }`}
          >
            <Keyboard size={16} />
            Keyboard
          </button>
          <button
            onClick={() => setActiveTab('docs')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all whitespace-nowrap uppercase tracking-wider ${
              activeTab === 'docs' ? 'bg-neon-green/20 text-neon-green border border-neon-green/50' : 'text-neon-green/50 hover:text-neon-green hover:bg-neon-green/10'
            }`}
          >
            <FileText size={16} />
            Docs
          </button>
        </div>
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
            <section className="space-y-4 border-l-2 border-neon-green pl-4">
              <h2 className="text-2xl font-bold text-neon-green uppercase tracking-widest">The Ammar Language System</h2>
              <p className="text-neon-green/80 leading-relaxed font-mono">
                Ammar Language is a constructed language based on geometric modification of Latin characters. 
                It uses a system of "Operations" to transform basic sounds into specific Arabic phonemes.
              </p>
            </section>

            {/* Operations */}
            <section className="bg-black border border-neon-green/30 p-6 relative">
              <div className="absolute top-0 right-0 p-2 text-neon-green/20"><Cpu size={24} /></div>
              <h3 className="text-xl font-bold text-neon-blue mb-4 uppercase tracking-wider">1. The Operations (Modifiers)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {operations.map((op) => (
                  <div key={op.name} className="flex items-center gap-4 bg-neon-blue/5 p-3 border border-neon-blue/30 hover:bg-neon-blue/10 transition-colors">
                    <div className="w-12 h-12 flex items-center justify-center bg-black border border-neon-blue/50 text-2xl font-mono text-neon-blue">
                      ◌{op.symbol}
                    </div>
                    <div>
                      <div className="font-bold text-neon-blue uppercase">{op.name}</div>
                      <div className="text-xs text-neon-blue/60">{op.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Vowel Chart */}
            <section className="bg-black border border-neon-green/30 p-6">
              <h3 className="text-xl font-bold text-purple-400 mb-4 uppercase tracking-wider">2. Vowel Chart</h3>
              <p className="text-sm text-neon-green/60 mb-4 font-mono">
                These characters are considered vowels in Ammar Language. If a word contains any of these, 
                it must start with the prefix <span className="font-mono text-purple-400 bg-purple-500/10 px-1 border border-purple-500/30">mu</span>.
              </p>
              <div className="flex flex-wrap gap-3">
                {vowels.map((char) => (
                  <div key={char} className="flex flex-col items-center justify-center w-16 h-16 bg-black border border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.1)] hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-shadow">
                    <span className="text-2xl font-bold text-purple-400">{char}</span>
                    <span className="text-xs font-mono text-purple-400/60 mt-1">{ARABIC_TO_AMMAR[char]}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Character Families */}
            <section className="space-y-6">
              <h3 className="text-xl font-bold text-neon-green uppercase tracking-wider">3. Character Families</h3>
              <div className="grid gap-6">
                {families.map((family) => (
                  <div key={family.name} className="bg-black border border-neon-green/30 p-6 relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 w-16 h-16 bg-neon-green/5 rounded-full blur-xl"></div>
                    <div className="mb-4 relative z-10">
                      <h4 className={`text-lg font-bold uppercase tracking-wide ${family.color}`}>{family.name}</h4>
                      <p className="text-sm text-neon-green/50 font-mono">{family.description}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 relative z-10">
                      {family.chars.map((char) => (
                        <div key={char} className="flex flex-col items-center bg-neon-green/5 p-2 min-w-[3rem] border border-neon-green/10 hover:border-neon-green/30 transition-colors">
                          <span className="text-lg text-neon-green mb-1">{char}</span>
                          <span className="text-xs font-mono text-neon-green/60">{ARABIC_TO_AMMAR[char]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* The Matrix Dictionary */}
            <section className="bg-black border border-neon-green/30 overflow-hidden">
              <div className="p-6 border-b border-neon-green/30 bg-neon-green/5">
                <h3 className="text-xl font-bold text-neon-green uppercase tracking-wider flex items-center gap-2">
                  <Terminal size={20} />
                  4. The Matrix Dictionary
                </h3>
                <p className="text-sm text-neon-green/60 mt-1 font-mono">Complete mapping of Arabic to Ammar characters</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm font-mono">
                  <thead className="bg-neon-green/10 text-neon-green font-medium uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-3 border-b border-neon-green/30">Arabic</th>
                      <th className="px-6 py-3 border-b border-neon-green/30">Ammar</th>
                      <th className="px-6 py-3 border-b border-neon-green/30">Family</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neon-green/10">
                    {Object.entries(ARABIC_TO_AMMAR).map(([ar, am]) => {
                      let family = "Basic";
                      if (MIX_CHARS.has(ar)) family = "Mix";
                      else if (MAX_CHARS.has(ar)) family = "Max";
                      
                      return (
                        <tr key={ar} className="hover:bg-neon-green/5 transition-colors">
                          <td className="px-6 py-3 font-medium text-neon-green text-lg">{ar}</td>
                          <td className="px-6 py-3 font-mono text-neon-cyan text-lg">{am}</td>
                          <td className="px-6 py-3">
                            <span className={`inline-flex items-center px-2 py-1 text-xs font-bold uppercase tracking-wider border ${
                              family === 'Basic' ? 'bg-slate-900 text-slate-400 border-slate-700' :
                              family === 'Max' ? 'bg-neon-blue/10 text-neon-blue border-neon-blue/30' :
                              'bg-neon-cyan/10 text-neon-cyan border-neon-cyan/30'
                            }`}>
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
            <section className="bg-black border border-neon-green/30 p-6">
              <h3 className="text-xl font-bold text-neon-green mb-6 uppercase tracking-wider">5. Mathematical Rules & Grammar</h3>
              
              <div className="space-y-6">
                <div className="relative pl-6 border-l-2 border-neon-blue">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 bg-black border-2 border-neon-blue"></div>
                  <h4 className="font-bold text-neon-blue mb-2 uppercase tracking-wide">Rule 1: Length (The Base)</h4>
                  <p className="text-neon-blue/70 text-sm mb-3 font-mono">Calculated based on the number of letters in the original word.</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-neon-blue/5 p-3 border border-neon-blue/30 text-center">
                      <div className="text-xs text-neon-blue/60 uppercase tracking-wider mb-1">Even Length</div>
                      <div className="text-xl font-mono text-neon-blue">+lo</div>
                    </div>
                    <div className="bg-neon-blue/5 p-3 border border-neon-blue/30 text-center">
                      <div className="text-xs text-neon-blue/60 uppercase tracking-wider mb-1">Odd Length</div>
                      <div className="text-xl font-mono text-neon-blue">+ri</div>
                    </div>
                  </div>
                </div>

                <div className="relative pl-6 border-l-2 border-neon-cyan">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 bg-black border-2 border-neon-cyan"></div>
                  <h4 className="font-bold text-neon-cyan mb-2 uppercase tracking-wide">Rule 2: Mix Modifier</h4>
                  <p className="text-neon-cyan/70 text-sm mb-3 font-mono">If the word contains any <span className="text-neon-cyan font-bold">Mix Family</span> character.</p>
                  <div className="bg-neon-cyan/5 p-3 border border-neon-cyan/30 text-center inline-block min-w-[120px]">
                    <div className="text-xl font-mono text-neon-cyan">+ax</div>
                  </div>
                </div>

                <div className="relative pl-6 border-l-2 border-neon-blue">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 bg-black border-2 border-neon-blue"></div>
                  <h4 className="font-bold text-neon-blue mb-2 uppercase tracking-wide">Rule 3: Max Modifier</h4>
                  <p className="text-neon-blue/70 text-sm mb-3 font-mono">If the word contains any <span className="text-neon-blue font-bold">Max Family</span> character (includes Mix).</p>
                  <div className="bg-neon-blue/5 p-3 border border-neon-blue/30 text-center inline-block min-w-[120px]">
                    <div className="text-xl font-mono text-neon-blue">+um</div>
                  </div>
                </div>

                <div className="relative pl-6 border-l-2 border-purple-500">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 bg-black border-2 border-purple-500"></div>
                  <h4 className="font-bold text-purple-400 mb-2 uppercase tracking-wide">Rule 4: Vowels (Prefix)</h4>
                  <p className="text-purple-400/70 text-sm mb-3 font-mono">If the word contains any vowel (أ، ا، ة، ع، غ), add <span className="text-purple-400 font-bold">mu</span> at the start.</p>
                  <div className="bg-purple-500/5 p-3 border border-purple-500/30 text-center inline-block min-w-[120px]">
                    <div className="text-xl font-mono text-purple-400">mu+</div>
                  </div>
                </div>

                <div className="relative pl-6 border-l-2 border-yellow-500">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 bg-black border-2 border-yellow-500"></div>
                  <h4 className="font-bold text-yellow-500 mb-2 uppercase tracking-wide">Grammar: Always Nominative</h4>
                  <p className="text-yellow-500/70 text-sm mb-3 font-mono">
                    Ammar Language strictly follows the Nominative case (Al-Raf').
                    <br/>
                    <span className="text-yellow-400">"طالبين"</span> (Accusative) becomes <span className="text-neon-cyan">"طالبون"</span> (Nominative).
                    <br/>
                    <span className="text-yellow-400">"لاعبين"</span> (Dual Accusative) becomes <span className="text-neon-cyan">"لاعبان"</span> (Dual Nominative).
                  </p>
                </div>

                <div className="relative pl-6 border-l-2 border-neon-red">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 bg-black border-2 border-neon-red"></div>
                  <h4 className="font-bold text-neon-red mb-2 uppercase tracking-wide">Rule 6: No Diacritics (Tashkeel)</h4>
                  <p className="text-neon-red/70 text-sm mb-3 font-mono">
                    <span className="text-neon-red font-bold block mb-1">Error: The Ammar language does not accept diacritics or Tanween.</span>
                    <span className="italic">"اللغة العمارية لا تقبل بالتشكيل ولا بالتنوين"</span>
                  </p>
                  <div className="bg-neon-red/10 p-3 border border-neon-red/30 text-center">
                     <div className="text-sm text-neon-red">
                       <span className="line-through opacity-50">مُحَمَّدٌ</span>
                       <span className="mx-2">→</span>
                       <span className="text-white font-bold">محمد</span>
                     </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 bg-black p-4 border border-neon-green/30 relative">
                <div className="absolute top-0 left-0 px-2 py-1 bg-neon-green/20 text-neon-green text-xs font-bold uppercase">Example 1</div>
                <h5 className="text-sm font-bold text-neon-green mb-2 mt-6">"صقر" (Falcon)</h5>
                <div className="flex flex-wrap items-center gap-2 text-sm font-mono">
                  <span className="text-slate-500">s̶̊f̱r</span>
                  <span className="text-slate-600">→</span>
                  <span className="text-neon-cyan">ri</span>
                  <span className="text-slate-500">(Odd 3)</span>
                  <span className="text-slate-600">+</span>
                  <span className="text-neon-cyan">ax</span>
                  <span className="text-slate-500">(Has Mix 'ص')</span>
                  <span className="text-slate-600">+</span>
                  <span className="text-neon-cyan">um</span>
                  <span className="text-slate-500">(Has Max)</span>
                  <span className="text-slate-600">=</span>
                  <span className="text-black font-bold bg-neon-blue px-2 py-1">s̶̊f̱rriaxum</span>
                </div>
              </div>
              
              <div className="mt-4 bg-black p-4 border border-neon-green/30 relative">
                <div className="absolute top-0 left-0 px-2 py-1 bg-neon-green/20 text-neon-green text-xs font-bold uppercase">Example 2</div>
                <h5 className="text-sm font-bold text-neon-green mb-2 mt-6">"عمار" (Ammar)</h5>
                <div className="flex flex-wrap items-center gap-2 text-sm font-mono">
                  <span className="text-purple-400">mu</span>
                  <span className="text-slate-500">(Has Vowel 'ع')</span>
                  <span className="text-slate-600">+</span>
                  <span className="text-slate-500">aᵃ̊m...</span>
                  <span className="text-slate-600">=</span>
                  <span className="text-black font-bold bg-purple-400 px-2 py-1">muaᵃ̊mmarloaxum</span>
                </div>
              </div>
            </section>
          </motion.div>
        )}

        {activeTab === 'keyboard' && (
          <motion.div
            key="keyboard"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <section className="bg-black border border-neon-green/30 p-6 relative overflow-hidden">
               <div className="absolute -right-10 -top-10 w-32 h-32 bg-neon-green/5 rounded-full blur-2xl"></div>
              <h3 className="text-xl font-bold text-neon-green mb-4 uppercase tracking-wider">Get The Keyboard</h3>
              <p className="text-neon-green/70 mb-6 font-mono">
                Use the custom Ammar keyboard layout with the <span className="text-white font-bold">Multiling O Keyboard</span> app on Android.
              </p>
              
              <div className="bg-black border border-neon-green/20 p-4 mb-6 font-mono text-xs sm:text-sm text-neon-green/60 overflow-x-auto whitespace-pre shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
                {KEYBOARD_LAYOUT}
              </div>

              <button
                onClick={handleCopyKeyboard}
                className="flex items-center gap-2 px-6 py-3 bg-neon-green text-black font-bold uppercase tracking-wider hover:bg-neon-green/90 transition-all shadow-[0_0_15px_rgba(34,197,94,0.4)] w-full sm:w-auto justify-center"
              >
                {copiedKeyboard ? <Check size={20} /> : <Copy size={20} />}
                {copiedKeyboard ? "Copied Layout Code!" : "Copy Layout Code"}
              </button>
              
              <p className="text-sm text-neon-green/50 mt-4 font-mono">
                <span className="text-white font-bold">INSTRUCTIONS:</span> Copy this code and paste it into the DIY settings inside the Multiling O Keyboard app to get the original Ammar layout.
              </p>
            </section>
          </motion.div>
        )}

        {activeTab === 'docs' && (
          <motion.div
            key="docs"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <section className="bg-black border border-neon-green/30 p-6">
              <h3 className="text-xl font-bold text-neon-green mb-4 flex items-center gap-2 uppercase tracking-wider">
                <Code className="text-neon-green" />
                Translation API
              </h3>
              <p className="text-neon-green/70 mb-6 font-mono">
                The Ammar Translator provides a public API that you can use to integrate translations into your own applications.
              </p>

              <div className="space-y-6">
                <div className="bg-black border border-neon-green/20 p-4 relative">
                  <div className="absolute top-0 left-0 w-2 h-2 bg-neon-green"></div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-neon-green/20 text-neon-green text-xs font-bold font-mono border border-neon-green/50">GET</span>
                    <code className="text-sm text-white font-mono">/api/translate</code>
                  </div>
                  <p className="text-sm text-neon-green/60 mb-4 font-mono">Translate text between English, Arabic, Ammar, French, Turkish, German, and Spanish.</p>
                  
                  <h4 className="text-sm font-bold text-neon-green mb-2 uppercase tracking-wide">Query Parameters</h4>
                  <ul className="space-y-2 text-sm text-neon-green/70 font-mono">
                    <li><span className="text-white">text</span> (required): The text to translate.</li>
                    <li><span className="text-white">from</span> (required): Source language code (<span className="text-neon-blue">en</span>, <span className="text-neon-blue">ar</span>, <span className="text-neon-blue">am</span>, <span className="text-neon-blue">fr</span>, <span className="text-neon-blue">tr</span>, <span className="text-neon-blue">de</span>, <span className="text-neon-blue">es</span>).</li>
                    <li><span className="text-white">to</span> (required): Target language code (<span className="text-neon-blue">en</span>, <span className="text-neon-blue">ar</span>, <span className="text-neon-blue">am</span>, <span className="text-neon-blue">fr</span>, <span className="text-neon-blue">tr</span>, <span className="text-neon-blue">de</span>, <span className="text-neon-blue">es</span>).</li>
                  </ul>
                </div>

                <div className="bg-black border border-neon-green/20 p-4">
                  <h4 className="text-sm font-bold text-neon-green mb-2 uppercase tracking-wide">Example Request</h4>
                  <div className="bg-slate-900 p-3 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
                    curl "https://{window.location.host}/api/translate?text=Hello&from=en&to=am"
                  </div>
                </div>

                <div className="bg-black border border-neon-green/20 p-4">
                  <h4 className="text-sm font-bold text-neon-green mb-2 uppercase tracking-wide">Example Response</h4>
                  <div className="bg-slate-900 p-3 border border-slate-800 font-mono text-xs text-neon-green overflow-x-auto">
{`{
  "text": "Hello",
  "translated": "muMrH̅barium",
  "from": "en",
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
