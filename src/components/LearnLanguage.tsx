
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Layers, HelpCircle, Sparkles, Loader2, WifiOff, AlertTriangle, Keyboard, Copy, Check } from 'lucide-react';
import { ARABIC_TO_AMMAR, MAX_CHARS, MIX_CHARS, VOWEL_CHARS } from '../constants';
import Flashcards from './Flashcards';
import Quiz from './Quiz';
import { generateQuiz, generateFlashcards, QuizQuestion, Flashcard } from '../services/gemini';

const KEYBOARD_LAYOUT = `OK_Layout_Begin
1234567890
i o å a b T s̊ g H̅ H̱
d z̊ r z s ş s̶̊ s̶ Ṯ Ṯ̶
aᵃ aᵃ̊ f f̱ k L M N H w Y
!@#$%^&*()
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
  const [activeTab, setActiveTab] = useState<'guide' | 'flashcards' | 'quiz' | 'keyboard'>('guide');
  const [level, setLevel] = useState<'beginner' | 'intermediate' | 'advanced' | 'extreme'>('beginner');
  const [count, setCount] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[] | undefined>(undefined);
  const [flashcards, setFlashcards] = useState<Flashcard[] | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [copiedKeyboard, setCopiedKeyboard] = useState(false);

  const handleCopyKeyboard = () => {
    navigator.clipboard.writeText(KEYBOARD_LAYOUT);
    setCopiedKeyboard(true);
    setTimeout(() => setCopiedKeyboard(false), 2000);
  };

  const handleGenerate = async () => {
    if (!navigator.onLine) {
      setError("AI Features required internet connection");
      setTimeout(() => setError(null), 3000);
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setError(null);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev;
        return prev + 10;
      });
    }, 500);

    try {
      if (activeTab === 'quiz') {
        const questions = await generateQuiz(level, count);
        if (questions && questions.length > 0) {
          setQuizQuestions(questions);
        }
      } else if (activeTab === 'flashcards') {
        const cards = await generateFlashcards(level, count);
        if (cards && cards.length > 0) {
          setFlashcards(cards);
        }
      }
      setProgress(100);
    } catch (error) {
      console.error("Failed to generate content", error);
      setError("Failed to generate content. Please try again.");
    } finally {
      clearInterval(progressInterval);
      setTimeout(() => {
        setIsGenerating(false);
        setProgress(0);
      }, 500);
    }
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
    <div className="w-full max-w-4xl mx-auto space-y-8 p-2 pb-20">
      
      {/* Sub-Navigation */}
      <div className="flex flex-col xl:flex-row justify-between items-center gap-4 mb-8">
        <div className="flex bg-deep-blue-900/50 p-1 rounded-xl border border-white/5 overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('guide')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'guide' ? 'bg-white/10 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <BookOpen size={16} />
            Guide
          </button>
          <button
            onClick={() => setActiveTab('flashcards')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'flashcards' ? 'bg-white/10 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers size={16} />
            Flashcards
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'quiz' ? 'bg-white/10 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <HelpCircle size={16} />
            Quiz
          </button>
          <button
            onClick={() => setActiveTab('keyboard')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'keyboard' ? 'bg-white/10 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Keyboard size={16} />
            Keyboard
          </button>
        </div>

        {/* AI Controls (Only for Flashcards & Quiz) */}
        {(activeTab === 'flashcards' || activeTab === 'quiz') && (
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
             <div className="flex items-center gap-2 bg-deep-blue-900/30 p-1 rounded-xl border border-white/5 w-full sm:w-auto">
              <select 
                value={level}
                onChange={(e) => setLevel(e.target.value as any)}
                className="bg-transparent text-sm text-slate-300 px-3 py-2 rounded-lg focus:outline-none focus:bg-white/5 border-r border-white/5"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="extreme">Extreme</option>
              </select>
              
              <select 
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="bg-transparent text-sm text-slate-300 px-3 py-2 rounded-lg focus:outline-none focus:bg-white/5 border-r border-white/5"
              >
                <option value="5">5 Items</option>
                <option value="10">10 Items</option>
                <option value="15">15 Items</option>
                <option value="20">20 Items</option>
              </select>

              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="flex items-center gap-2 px-4 py-2 bg-neon-blue/10 text-neon-blue hover:bg-neon-blue/20 rounded-lg text-sm font-medium transition-all disabled:opacity-50 whitespace-nowrap"
              >
                {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                <span className="hidden sm:inline">Generate</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl flex items-center gap-2 text-sm"
          >
            <WifiOff size={16} />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Bar */}
      <AnimatePresence>
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-deep-blue-900/50 rounded-full h-2 w-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-neon-blue to-neon-cyan"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className="text-xs text-center text-slate-400 mt-2 animate-pulse">
              Generating {count} {activeTab} for {level} level... ({progress}%)
            </p>
          </motion.div>
        )}
      </AnimatePresence>

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
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">The Ammar Language System</h2>
              <p className="text-slate-300 leading-relaxed">
                Ammar Language is a constructed language based on geometric modification of Latin characters. 
                It uses a system of "Operations" to transform basic sounds into specific Arabic phonemes.
              </p>
            </section>

            {/* Operations */}
            <section className="bg-deep-blue-900/50 rounded-2xl border border-white/10 p-6">
              <h3 className="text-xl font-bold text-neon-blue mb-4">1. The Operations (Modifiers)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {operations.map((op) => (
                  <div key={op.name} className="flex items-center gap-4 bg-deep-blue-950/50 p-3 rounded-xl border border-white/5">
                    <div className="w-12 h-12 flex items-center justify-center bg-white/5 rounded-lg text-2xl font-mono text-white">
                      ◌{op.symbol}
                    </div>
                    <div>
                      <div className="font-bold text-white">{op.name}</div>
                      <div className="text-xs text-slate-400">{op.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Vowel Chart */}
            <section className="bg-deep-blue-900/50 rounded-2xl border border-white/10 p-6">
              <h3 className="text-xl font-bold text-purple-400 mb-4">2. Vowel Chart</h3>
              <p className="text-sm text-slate-400 mb-4">
                These characters are considered vowels in Ammar Language. If a word contains any of these, 
                it must start with the prefix <span className="font-mono text-purple-400 bg-purple-500/10 px-1 rounded">mu</span>.
              </p>
              <div className="flex flex-wrap gap-3">
                {vowels.map((char) => (
                  <div key={char} className="flex flex-col items-center justify-center w-16 h-16 bg-deep-blue-950 rounded-xl border border-purple-500/30 shadow-lg shadow-purple-500/10">
                    <span className="text-2xl font-bold text-white">{char}</span>
                    <span className="text-xs font-mono text-purple-400 mt-1">{ARABIC_TO_AMMAR[char]}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Character Families */}
            <section className="space-y-6">
              <h3 className="text-xl font-bold text-neon-blue">3. Character Families</h3>
              <div className="grid gap-6">
                {families.map((family) => (
                  <div key={family.name} className="bg-deep-blue-900/30 rounded-2xl border border-white/10 p-6">
                    <div className="mb-4">
                      <h4 className={`text-lg font-bold ${family.color}`}>{family.name}</h4>
                      <p className="text-sm text-slate-400">{family.description}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {family.chars.map((char) => (
                        <div key={char} className="flex flex-col items-center bg-deep-blue-950 p-2 rounded-lg min-w-[3rem] border border-white/5">
                          <span className="text-lg text-white mb-1">{char}</span>
                          <span className="text-xs font-mono text-neon-cyan/80">{ARABIC_TO_AMMAR[char]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* The Matrix Dictionary */}
            <section className="bg-deep-blue-900/50 rounded-2xl border border-white/10 overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <h3 className="text-xl font-bold text-neon-blue">4. The Matrix Dictionary</h3>
                <p className="text-sm text-slate-400 mt-1">Complete mapping of Arabic to Ammar characters</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-deep-blue-950 text-slate-400 font-medium">
                    <tr>
                      <th className="px-6 py-3">Arabic</th>
                      <th className="px-6 py-3">Ammar</th>
                      <th className="px-6 py-3">Family</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {Object.entries(ARABIC_TO_AMMAR).map(([ar, am]) => {
                      let family = "Basic";
                      if (MIX_CHARS.has(ar)) family = "Mix";
                      else if (MAX_CHARS.has(ar)) family = "Max";
                      
                      return (
                        <tr key={ar} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-3 font-medium text-white text-lg">{ar}</td>
                          <td className="px-6 py-3 font-mono text-neon-cyan text-lg">{am}</td>
                          <td className="px-6 py-3">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ring-1 ring-inset ${
                              family === 'Basic' ? 'bg-slate-400/10 text-slate-400 ring-slate-400/20' :
                              family === 'Max' ? 'bg-neon-blue/10 text-neon-blue ring-neon-blue/20' :
                              'bg-neon-cyan/10 text-neon-cyan ring-neon-cyan/20'
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
            <section className="bg-gradient-to-br from-deep-blue-900 to-deep-blue-950 rounded-2xl border border-white/10 p-6">
              <h3 className="text-xl font-bold text-neon-blue mb-6">5. Mathematical Rules & Grammar</h3>
              
              <div className="space-y-6">
                <div className="relative pl-6 border-l-2 border-neon-blue/30">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-deep-blue-950 border-2 border-neon-blue"></div>
                  <h4 className="font-bold text-white mb-2">Rule 1: Length (The Base)</h4>
                  <p className="text-slate-300 text-sm mb-3">Calculated based on the number of letters in the original word.</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 p-3 rounded-lg text-center">
                      <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Even Length</div>
                      <div className="text-xl font-mono text-neon-cyan">+lo</div>
                    </div>
                    <div className="bg-white/5 p-3 rounded-lg text-center">
                      <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Odd Length</div>
                      <div className="text-xl font-mono text-neon-cyan">+ri</div>
                    </div>
                  </div>
                </div>

                <div className="relative pl-6 border-l-2 border-neon-cyan/30">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-deep-blue-950 border-2 border-neon-cyan"></div>
                  <h4 className="font-bold text-white mb-2">Rule 2: Mix Modifier</h4>
                  <p className="text-slate-300 text-sm mb-3">If the word contains any <span className="text-neon-cyan">Mix Family</span> character.</p>
                  <div className="bg-white/5 p-3 rounded-lg text-center inline-block min-w-[120px]">
                    <div className="text-xl font-mono text-neon-cyan">+ax</div>
                  </div>
                </div>

                <div className="relative pl-6 border-l-2 border-neon-blue/30">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-deep-blue-950 border-2 border-neon-blue"></div>
                  <h4 className="font-bold text-white mb-2">Rule 3: Max Modifier</h4>
                  <p className="text-slate-300 text-sm mb-3">If the word contains any <span className="text-neon-blue">Max Family</span> character (includes Mix).</p>
                  <div className="bg-white/5 p-3 rounded-lg text-center inline-block min-w-[120px]">
                    <div className="text-xl font-mono text-neon-cyan">+um</div>
                  </div>
                </div>

                <div className="relative pl-6 border-l-2 border-purple-500/30">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-deep-blue-950 border-2 border-purple-500"></div>
                  <h4 className="font-bold text-white mb-2">Rule 4: Vowels (Prefix)</h4>
                  <p className="text-slate-300 text-sm mb-3">If the word contains any vowel (أ، ا، ة، ع، غ), add <span className="text-purple-400 font-mono">mu</span> at the start.</p>
                  <div className="bg-white/5 p-3 rounded-lg text-center inline-block min-w-[120px]">
                    <div className="text-xl font-mono text-purple-400">mu+</div>
                  </div>
                </div>

                <div className="relative pl-6 border-l-2 border-yellow-500/30">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-deep-blue-950 border-2 border-yellow-500"></div>
                  <h4 className="font-bold text-white mb-2">Grammar: Always Nominative</h4>
                  <p className="text-slate-300 text-sm mb-3">
                    Ammar Language strictly follows the Nominative case (Al-Raf').
                    <br/>
                    <span className="text-yellow-400">"طالبين"</span> (Accusative) becomes <span className="text-neon-cyan">"طالبون"</span> (Nominative).
                    <br/>
                    <span className="text-yellow-400">"لاعبين"</span> (Dual Accusative) becomes <span className="text-neon-cyan">"لاعبان"</span> (Dual Nominative).
                  </p>
                </div>

                <div className="relative pl-6 border-l-2 border-red-500/30">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-deep-blue-950 border-2 border-red-500"></div>
                  <h4 className="font-bold text-white mb-2">Rule 6: No Diacritics (Tashkeel)</h4>
                  <p className="text-slate-300 text-sm mb-3">
                    <span className="text-red-400 font-bold block mb-1">Error: The Ammar language does not accept diacritics or Tanween.</span>
                    <span className="text-slate-400 italic">"اللغة العمارية لا تقبل بالتشكيل ولا بالتنوين"</span>
                  </p>
                  <div className="bg-red-500/10 p-3 rounded-lg text-center border border-red-500/20">
                     <div className="text-sm text-red-300">
                       <span className="line-through opacity-50">مُحَمَّدٌ</span>
                       <span className="mx-2">→</span>
                       <span className="text-white font-bold">محمد</span>
                     </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 bg-black/20 p-4 rounded-xl border border-white/5">
                <h5 className="text-sm font-bold text-slate-300 mb-2">Example: "صقر" (Falcon)</h5>
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
                  <span className="text-white font-bold bg-neon-blue/20 px-2 py-1 rounded">s̶̊f̱rriaxum</span>
                </div>
              </div>
              
              <div className="mt-4 bg-black/20 p-4 rounded-xl border border-white/5">
                <h5 className="text-sm font-bold text-slate-300 mb-2">Example: "عمار" (Ammar)</h5>
                <div className="flex flex-wrap items-center gap-2 text-sm font-mono">
                  <span className="text-purple-400">mu</span>
                  <span className="text-slate-500">(Has Vowel 'ع')</span>
                  <span className="text-slate-600">+</span>
                  <span className="text-slate-500">aᵃ̊m...</span>
                  <span className="text-slate-600">=</span>
                  <span className="text-white font-bold bg-purple-500/20 px-2 py-1 rounded">muaᵃ̊mmarloaxum</span>
                </div>
              </div>
            </section>
          </motion.div>
        )}

        {activeTab === 'flashcards' && (
          <motion.div
            key="flashcards"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Flashcards cards={flashcards} />
          </motion.div>
        )}

        {activeTab === 'quiz' && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Quiz questions={quizQuestions} />
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
            <section className="bg-deep-blue-900/50 rounded-2xl border border-white/10 p-6">
              <h3 className="text-xl font-bold text-white mb-4">Get The Keyboard</h3>
              <p className="text-slate-300 mb-6">
                Use the custom Ammar keyboard layout with the <span className="text-neon-cyan font-bold">Multiling O Keyboard</span> app on Android.
              </p>
              
              <div className="bg-black/30 rounded-xl border border-white/5 p-4 mb-6 font-mono text-xs sm:text-sm text-slate-400 overflow-x-auto whitespace-pre">
                {KEYBOARD_LAYOUT}
              </div>

              <button
                onClick={handleCopyKeyboard}
                className="flex items-center gap-2 px-6 py-3 bg-neon-blue text-white rounded-xl font-bold hover:bg-neon-blue/90 transition-all shadow-lg shadow-neon-blue/20 w-full sm:w-auto justify-center"
              >
                {copiedKeyboard ? <Check size={20} /> : <Copy size={20} />}
                {copiedKeyboard ? "Copied Layout Code!" : "Copy Layout Code"}
              </button>
              
              <p className="text-sm text-slate-400 mt-4">
                <span className="text-neon-cyan font-bold">Instructions:</span> Copy this code and paste it into the DIY settings inside the Multiling O Keyboard app to get the original Ammar layout.
              </p>
            </section>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
