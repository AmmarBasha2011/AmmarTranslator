
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, XCircle, RefreshCw } from 'lucide-react';

const QUIZ_DATA = [
  {
    question: "What suffix is added for words with ODD length?",
    options: ["es", "wa", "me", "ma"],
    correct: 1
  },
  {
    question: "Which prefix is added if a word contains a vowel?",
    options: ["al", "mt", "ka", "None"],
    correct: 1
  },
  {
    question: "Translate 'ب' to Ammar",
    options: ["b", "B", "p", "v"],
    correct: 0
  },
  {
    question: "What does the 'Mix' rule add?",
    options: ["ma", "wa", "me", "es"],
    correct: 2
  },
  {
    question: "Is Ammar Language case-sensitive?",
    options: ["Yes", "No"],
    correct: 1
  }
];

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleAnswer = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    
    if (index === QUIZ_DATA[currentQuestion].correct) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestion < QUIZ_DATA.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(null);
        setIsAnswered(false);
      } else {
        setShowScore(true);
      }
    }, 1500);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setSelectedOption(null);
    setIsAnswered(false);
  };

  if (showScore) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-deep-blue-900/50 rounded-2xl border border-white/10 text-center">
        <h3 className="text-2xl font-bold text-white mb-4">Quiz Completed!</h3>
        <div className="text-6xl font-bold text-neon-cyan mb-4">{score} / {QUIZ_DATA.length}</div>
        <p className="text-slate-400 mb-8">
          {score === QUIZ_DATA.length ? "Perfect Score! You are an Ammar Master." : "Keep practicing!"}
        </p>
        <button 
          onClick={resetQuiz}
          className="flex items-center gap-2 px-6 py-3 bg-neon-blue text-white rounded-xl hover:bg-neon-blue/90 transition-colors"
        >
          <RefreshCw size={20} />
          Try Again
        </button>
      </div>
    );
  }

  const question = QUIZ_DATA[currentQuestion];

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-6 flex justify-between items-center text-xs text-slate-500 font-mono">
        <span>Question {currentQuestion + 1} of {QUIZ_DATA.length}</span>
        <span>Score: {score}</span>
      </div>

      <div className="bg-deep-blue-900 rounded-2xl border border-white/10 p-6 mb-6 min-h-[120px] flex items-center justify-center text-center">
        <h3 className="text-xl font-medium text-white">{question.question}</h3>
      </div>

      <div className="space-y-3">
        {question.options.map((option, idx) => {
          let stateClass = "bg-white/5 border-white/5 hover:bg-white/10";
          if (isAnswered) {
            if (idx === question.correct) stateClass = "bg-green-500/20 border-green-500/50 text-green-200";
            else if (idx === selectedOption) stateClass = "bg-red-500/20 border-red-500/50 text-red-200";
            else stateClass = "bg-white/5 border-white/5 opacity-50";
          }

          return (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              disabled={isAnswered}
              className={`w-full p-4 rounded-xl border text-left transition-all flex justify-between items-center ${stateClass}`}
            >
              <span>{option}</span>
              {isAnswered && idx === question.correct && <CheckCircle2 size={20} className="text-green-400" />}
              {isAnswered && idx === selectedOption && idx !== question.correct && <XCircle size={20} className="text-red-400" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
