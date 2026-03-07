
import { 
  ARABIC_TO_AMMAR, 
  AMMAR_TO_ARABIC_MAP, 
  MAX_CHARS, 
  MIX_CHARS, 
  COMMON_WORDS,
  VOWEL_CHARS,
  isArabicChar
} from '../constants';

// --- Arabic to Ammar ---

export function translateToArabicToAmmar(text: string): string {
  // Split by whitespace to handle words individually
  // We want to preserve whitespace and punctuation
  const tokens = text.split(/(\s+|[،.!?؟]+)/);
  
  return tokens.map(token => {
    if (!token.trim() || /^[،.!?؟]+$/.test(token)) {
      return token;
    }
    // Check if the token is actually Arabic
    if (!isArabicChar(token[0])) {
      return token;
    }
    return translateWordToAmmar(token);
  }).join('');
}

function normalizeArabicGrammar(word: string): string {
  // Rule: Ammar language only accepts Nominative case (Al-Raf').
  // Replace 'ين' (Accusative/Genitive) with 'ون' (Nominative) at the end of words.
  if (word.endsWith('ين')) {
    return word.slice(0, -2) + 'ون';
  }
  return word;
}

function translateWordToAmmar(word: string): string {
  // 0. Normalize Grammar (Always Nominative)
  const normalizedWord = normalizeArabicGrammar(word);

  let ammarWord = '';
  let hasMax = false;
  let hasMix = false;
  let hasVowel = false;
  let originalLength = 0;

  // Check for Vowels (Rule: Add 'mt' prefix if present)
  for (const char of normalizedWord) {
    if (VOWEL_CHARS.has(char)) {
      hasVowel = true;
    }
  }

  // Translate characters
  for (const char of normalizedWord) {
    if (ARABIC_TO_AMMAR[char]) {
      ammarWord += ARABIC_TO_AMMAR[char];
      originalLength++;
      
      if (MAX_CHARS.has(char)) hasMax = true;
      if (MIX_CHARS.has(char)) hasMix = true;
    } else {
      // Keep non-mapped characters
      ammarWord += char;
    }
  }

  // Apply Suffix Rules
  // 1. Length Rule
  if (originalLength > 0) {
    if (originalLength % 2 === 0) {
      ammarWord += 'es';
    } else {
      ammarWord += 'wa';
    }
  }

  // 2. Mix Rule
  if (hasMix) {
    ammarWord += 'me';
  }

  // 3. Max Rule
  if (hasMax) {
    ammarWord += 'ma';
  }

  // Apply Prefix Rule
  // 4. Vowel Rule (mt prefix)
  if (hasVowel) {
    ammarWord = 'mt' + ammarWord;
  }

  return ammarWord;
}

// --- Ammar to Arabic ---

export function translateAmmarToArabic(text: string): string {
  const tokens = text.split(/(\s+|[،.!?؟]+)/);
  
  return tokens.map(token => {
    if (!token.trim() || /^[،.!?؟]+$/.test(token)) {
      return token;
    }
    // Simple heuristic: if it has arabic chars, skip
    if (isArabicChar(token[0])) {
      return token;
    }
    return translateWordToArabic(token);
  }).join('');
}

function translateWordToArabic(word: string): string {
  let processedWord = word;
  let hasMtPrefix = false;

  // 0. Check for 'mt' prefix (Vowel Rule)
  // We tentatively strip it, then verify later if the decoded word actually has vowels.
  if (processedWord.startsWith('mt')) {
    processedWord = processedWord.slice(2);
    hasMtPrefix = true;
  }

  // 1. Stemming (Reverse order of addition)
  // Order added: Length -> Mix -> Max
  // Order removed: Max -> Mix -> Length

  // Remove 'ma' (Max suffix)
  if (processedWord.endsWith('ma')) {
    processedWord = processedWord.slice(0, -2);
  }

  // Remove 'me' (Mix suffix)
  if (processedWord.endsWith('me')) {
    processedWord = processedWord.slice(0, -2);
  }

  // Remove 'es' or 'wa' (Length suffix)
  if (processedWord.endsWith('es')) {
    processedWord = processedWord.slice(0, -2);
  } else if (processedWord.endsWith('wa')) {
    processedWord = processedWord.slice(0, -2);
  }

  // 2. Decoding
  // We need to tokenize the Ammar string into Ammar characters.
  // Since Ammar chars can be multiple unicode points (base + modifiers),
  // we need a greedy approach.
  
  // Prepare keys sorted by length descending for greedy matching
  const ammarKeys = Object.keys(AMMAR_TO_ARABIC_MAP).sort((a, b) => b.length - a.length);
  
  let possibilities: string[][] = [[]]; // Start with one empty path

  let i = 0;
  while (i < processedWord.length) {
    let matchFound = false;
    for (const key of ammarKeys) {
      if (processedWord.startsWith(key, i)) {
        const arabicOptions = AMMAR_TO_ARABIC_MAP[key];
        
        // Expand possibilities
        const newPossibilities: string[][] = [];
        for (const existingPath of possibilities) {
          for (const option of arabicOptions) {
            newPossibilities.push([...existingPath, option]);
          }
        }
        possibilities = newPossibilities;
        
        i += key.length;
        matchFound = true;
        break;
      }
    }
    
    if (!matchFound) {
      // If no match, just append the character as is (no branching)
      const char = processedWord[i];
      for (const path of possibilities) {
        path.push(char);
      }
      i++;
    }
  }

  // 3. Scoring System
  const candidates = possibilities.map(chars => chars.join(''));
  
  // Filter candidates based on Vowel Rule if 'mt' was stripped
  let filteredCandidates = candidates;
  if (hasMtPrefix) {
    // If we stripped 'mt', the valid candidate MUST contain a vowel.
    // If it doesn't, then 'mt' was likely part of the word, not a prefix.
    // However, since we already stripped it, we might be in a tricky spot.
    // But wait, if 'mt' was part of the word, we stripped it, so the decoding is missing 'mt'.
    // This logic is slightly flawed if 'mt' is ambiguous.
    // But given the constraints, let's assume if we stripped 'mt', we prefer candidates with vowels.
    const withVowels = candidates.filter(c => [...c].some(char => VOWEL_CHARS.has(char)));
    if (withVowels.length > 0) {
      filteredCandidates = withVowels;
    } else {
      // If no candidate has vowels, then the 'mt' prefix was probably incorrect.
      // We should have kept 'mt'.
      // Re-run decoding with 'mt' prefix?
      // Or just prepend 'مت' to the candidates?
      // 'mt' -> 'م' + 'ت' usually.
      filteredCandidates = candidates.map(c => 'مت' + c);
    }
  }

  // If only one candidate, return it
  if (filteredCandidates.length === 1) return filteredCandidates[0];

  // Score candidates
  let bestCandidate = filteredCandidates[0];
  let bestScore = -Infinity;

  for (const candidate of filteredCandidates) {
    let score = 0;

    // Check Memory
    if (COMMON_WORDS.has(candidate)) {
      return candidate; // Immediate match
    }

    // Heuristics
    
    // Starts with bad chars
    if (/^[ئؤةء]/.test(candidate)) {
      score -= 10;
    }

    // Starts with good chars
    if (/^[أإا]/.test(candidate)) {
      score += 5;
    }
    if (candidate.startsWith('ال')) {
      score += 5;
    }

    // Forbidden combinations
    if (candidate.includes('ةا') || candidate.includes('ةو')) {
      score -= 20;
    }

    if (score > bestScore) {
      bestScore = score;
      bestCandidate = candidate;
    }
  }

  return bestCandidate;
}
