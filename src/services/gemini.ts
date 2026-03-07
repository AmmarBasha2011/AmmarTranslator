import { GoogleGenAI, Type } from "@google/genai";
import { translateToArabicToAmmar } from "./translator";

// Initialize with a placeholder or process.env if available.
// We will re-initialize before calls if needed or rely on the environment variable.
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number; // 0-3
  explanation: string;
}

export interface Flashcard {
  arabic: string;
  ammar: string;
  hint: string;
}

const MODEL_NAME = "gemini-3-flash-preview";

export async function generateQuiz(level: 'beginner' | 'intermediate' | 'advanced' | 'extreme', count: number = 5): Promise<QuizQuestion[]> {
  const prompt = `Generate ${count} multiple-choice questions to test knowledge of the "Ammar Language".
  
  Ammar Language Rules:
  1. Base Mapping: Arabic letters map to Latin letters (e.g., ب->b, ت->T).
  2. Modifiers: Special Arabic chars map to Latin chars with modifiers (e.g., ث->s + circle above).
  3. Length Rule: 
     - Even length base word -> add suffix 'lo'.
     - Odd length base word -> add suffix 'ri'.
  4. Mix Rule: If word has Mix chars (ص, ظ, غ), add suffix 'ax'.
  5. Max Rule: If word has Max chars (أ, إ, آ, ء, ؤ, ئ, ث, ح, خ, ذ, ش, ص, ض, ط, ظ, ع, غ, ق), add suffix 'um'.
  6. Vowel Rule: If word has vowels (أ, ا, ة, ع, غ, إ, آ, ء, ؤ, ئ), add prefix 'mu'.
  7. Grammar: Always Nominative case (ends in 'un'/'wn' or 'an'). 'yn' is forbidden.

  Level: ${level}
  ${level === 'extreme' ? 'For Extreme level, use complex sentences, rare vocabulary, and tricky combinations of rules.' : ''}
  
  IMPORTANT: Do NOT use Arabic diacritics (Tashkeel) in any Arabic text. Use plain Arabic letters only.

  Return ONLY a JSON array of objects with this schema:
  {
    question: string,
    options: string[], // 4 options
    correctAnswer: number, // index of correct option (0-3)
    explanation: string
  }
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctAnswer: { type: Type.INTEGER },
              explanation: { type: Type.STRING }
            }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as QuizQuestion[];
    }
    return [];
  } catch (error) {
    console.error("Error generating quiz:", error);
    return [];
  }
}

export async function generateFlashcards(level: 'beginner' | 'intermediate' | 'advanced' | 'extreme', count: number = 5): Promise<Flashcard[]> {
  const prompt = `Generate ${count} flashcards for learning "Ammar Language".
  
  Ammar Language is a constructed language based on Arabic.
  
  Level: ${level}
  ${level === 'extreme' ? 'For Extreme level, use complex words, rare vocabulary, and tricky combinations of rules.' : ''}
  
  IMPORTANT: Do NOT use Arabic diacritics (Tashkeel) in the 'arabic' field. Use plain Arabic letters only.

  Return ONLY a JSON array of objects with this schema:
  {
    arabic: string, // An Arabic word (NO Tashkeel)
    ammar: string, // The correct Ammar translation (apply all rules: mu prefix, suffixes ri/lo, ax, um)
    hint: string // A hint about why it is translated this way (e.g., "Odd length + Max char")
  }
  
  Ensure the Ammar translation is strictly correct according to these rules:
  1. Even length -> 'lo', Odd length -> 'ri'.
  2. Mix char (ص, ظ, غ) -> 'ax'.
  3. Max char (many special chars) -> 'um'.
  4. Vowel (أ, ا, ة, ع, غ, etc) -> 'mu' prefix.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              arabic: { type: Type.STRING },
              ammar: { type: Type.STRING },
              hint: { type: Type.STRING }
            }
          }
        }
      }
    });

    if (response.text) {
      const cards = JSON.parse(response.text) as Flashcard[];
      // Post-process to ensure Ammar translation is 100% correct using our local translator
      return cards.map(card => ({
        ...card,
        ammar: translateToArabicToAmmar(card.arabic)
      }));
    }
    return [];
  } catch (error) {
    console.error("Error generating flashcards:", error);
    return [];
  }
}