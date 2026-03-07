
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, RotateCcw, Star } from 'lucide-react';
import { Flashcard } from '../services/gemini';

const DEFAULT_FLASHCARDS: Flashcard[] = [
  { arabic: 'أنا', ammar: 'mtaᵃ̊nawama', hint: "Vowel 'أ' -> mt. Length 3 (Odd) -> wa. Max 'أ' -> ma." },
  { arabic: 'بحر', ammar: 'bH̱rwa', hint: "Odd length (3) -> wa" },
  { arabic: 'شمس', ammar: 'şmswa', hint: "Odd length (3) -> wa" },
  { arabic: 'قمر', ammar: 'f̱mrwama', hint: "Odd length (3) -> wa. Contains 'ق' (Max) -> ma" },
  { arabic: 'صقر', ammar: 's̶̊f̱rwamema', hint: "Mix 'ص' -> me. Max 'ص,ق' -> ma. Odd length -> wa" },
  { arabic: 'عمار', ammar: 'mtaᵃ̊mmaresma', hint: "Vowel 'ع' -> mt. Even length (4) -> es. Max 'ع' -> ma." },
];

interface FlashcardsProps {
  cards?: Flashcard[];
}

export default function Flashcards({ cards }: FlashcardsProps) {
  const [flashcardsData, setFlashcardsData] = useState<Flashcard[]>(cards || DEFAULT_FLASHCARDS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [learnedCards, setLearnedCards] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (cards) {
      setFlashcardsData(cards);
      setCurrentIndex(0);
      setIsFlipped(false);
      setLearnedCards(new Set());
    }
  }, [cards]);

  const nextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % flashcardsData.length);
    }, 200);
  };

  const prevCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + flashcardsData.length) % flashcardsData.length);
    }, 200);
  };

  const toggleLearned = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newLearned = new Set(learnedCards);
    if (newLearned.has(currentIndex)) {
      newLearned.delete(currentIndex);
    } else {
      newLearned.add(currentIndex);
    }
    setLearnedCards(newLearned);
  };

  const currentCard = flashcardsData[currentIndex];
  const isLearned = learnedCards.has(currentIndex);

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto">
      {/* Progress Header */}
      <div className="w-full flex justify-between items-center text-sm text-slate-400 px-2">
        <span>Card {currentIndex + 1} of {flashcardsData.length}</span>
        <div className="flex items-center gap-1 text-yellow-400">
          <Star size={14} fill="currentColor" />
          <span>{learnedCards.size} Learned</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
        <div 
          className="h-full bg-yellow-400 transition-all duration-300"
          style={{ width: `${(learnedCards.size / flashcardsData.length) * 100}%` }}
        />
      </div>

      <div className="relative w-full aspect-[3/2] perspective-1000">
        <motion.div
          className="w-full h-full relative preserve-3d cursor-pointer"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
          onClick={() => setIsFlipped(!isFlipped)}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Front */}
          <div className="absolute inset-0 backface-hidden bg-deep-blue-800 rounded-2xl border border-white/10 shadow-xl flex flex-col items-center justify-center p-8 relative overflow-hidden">
            <button 
              onClick={toggleLearned}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/20 transition-colors z-10"
            >
              <Star 
                size={24} 
                className={isLearned ? "text-yellow-400 fill-yellow-400" : "text-slate-600"} 
              />
            </button>
            <span className="text-sm text-slate-400 uppercase tracking-widest mb-4">Arabic</span>
            <h3 className="text-4xl font-bold text-white">{currentCard.arabic}</h3>
            <p className="absolute bottom-6 text-xs text-slate-500">Tap to flip</p>
          </div>

          {/* Back */}
          <div 
            className="absolute inset-0 backface-hidden bg-deep-blue-900 rounded-2xl border border-neon-blue/30 shadow-xl flex flex-col items-center justify-center p-8 relative overflow-hidden"
            style={{ transform: 'rotateY(180deg)' }}
          >
            <button 
              onClick={toggleLearned}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/20 transition-colors z-10"
            >
              <Star 
                size={24} 
                className={isLearned ? "text-yellow-400 fill-yellow-400" : "text-slate-600"} 
              />
            </button>
            <span className="text-sm text-neon-blue uppercase tracking-widest mb-4">Ammar</span>
            <h3 className="text-3xl font-mono text-neon-cyan mb-4">{currentCard.ammar}</h3>
            <p className="text-xs text-slate-400 text-center bg-black/20 p-2 rounded">{currentCard.hint}</p>
          </div>
        </motion.div>
      </div>

      <div className="flex items-center gap-4">
        <button onClick={prevCard} className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={() => {
            setLearnedCards(new Set());
            setCurrentIndex(0);
            setIsFlipped(false);
          }}
          className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-slate-400"
          title="Reset Progress"
        >
          <RotateCcw size={20} />
        </button>
        <button onClick={nextCard} className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}
