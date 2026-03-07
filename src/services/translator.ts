
import { 
  ARABIC_TO_AMMAR, 
  AMMAR_TO_ARABIC_MAP, 
  MAX_CHARS, 
  MIX_CHARS, 
  COMMON_WORDS,
  VOWEL_CHARS,
  isArabicChar
} from '../constants';

// Pronunciation Mapping
const AMMAR_TO_PRONUNCIATION: Record<string, string> = {
  'a': 'ا',
  'i': 'ي',
  '\u030A': '', // Yoghashak is phonetically silent in this context
  '\u0305': '', // Overline
  '\u0331': '', // Line below
  '\u0336': '', // Strikethrough
  '\u1d43': '', // Tikrar
  'b': 'ب',
  'T': 'ت',
  'g': 'ج',
  'd': 'د',
  'r': 'ر',
  'z': 'ز',
  's': 'س',
  'ş': 'ش',
  'f': 'ف',
  'k': 'ك',
  'L': 'ل',
  'M': 'م',
  'N': 'ن',
  'H': 'ه',
  'o': 'ة',
  'w': 'و',
  'u': 'و',
  'Y': 'ى',
};

export function getAmmarPronunciation(ammarText: string): string {
  const tokens = ammarText.split(/(\s+|[،.!?؟]+)/);

  return tokens.map(token => {
    if (!token.trim() || /^[،.!?؟]+$/.test(token)) return token;

    let result = '';
    let i = 0;
    while (i < token.length) {
      let char = token[i];
      // Check for 'mu' prefix
      if (i === 0 && token.startsWith('mu')) {
        result += 'مُو';
        i += 2;
        continue;
      }

      // Check for suffixes
      if (i >= token.length - 2) {
        const remaining = token.slice(i);
        if (remaining === 'lo') { result += 'لُو'; break; }
        if (remaining === 'ri') { result += 'رِي'; break; }
        if (remaining === 'ax') { result += 'اكس'; break; }
        if (remaining === 'um') { result += 'وم'; break; }
      }

      // Base characters
      if (AMMAR_TO_PRONUNCIATION[char] !== undefined) {
        result += AMMAR_TO_PRONUNCIATION[char];
      } else {
        result += char;
      }
      i++;
    }
    return result;
  }).join('');
}

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
  // Replace 'ين' (Accusative/Genitive) with 'ون' (Plural Plural) or 'ان' (Dual).

  // Heuristic for Dual: If there are exactly two objects/parts (simplified for now).
  // Common dual words: كتابين, معلمين (if specific context, but we use a general check)
  // Let's implement a heuristic: if the character before 'ين' is 'ا', it might be plural or something else.
  // Actually, 'ين' to 'ون' is for sound masculine plural.
  // 'ين' to 'ان' is for dual.

  // Let's use a simple vowel-based heuristic for Dual vs Plural:
  // Usually, if the letter before 'ين' is a 'ب', 'ت', 'ج' etc.
  // To keep it simple as requested: "ين" -> "ون" AND "ين" -> "ان"
  // We'll prioritize Plural for now unless we find a clear dual marker.
  if (word.endsWith('ين')) {
    // Check if it's a common dual structure (e.g., word ends with a letter that usually takes 'ان')
    // For now, let's treat words like 'كتابين' as dual (ان) and 'معلمين' as plural (ون).
    // A simple list of common dual stems could work, or we can just apply both and let scoring decide?
    // In this context, let's just use the user's specific request.
    const dualStems = ['كتاب', 'ولد', 'بنت', 'بيت', 'قلم'];
    const stem = word.slice(0, -2);
    if (dualStems.includes(stem)) {
      return stem + 'ان';
    }
    return stem + 'ون';
  }
  return word;
}

function stripTashkeel(text: string): string {
  return text.replace(/[\u064B-\u065F\u0670]/g, '');
}

function translateWordToAmmar(word: string): string {
  // 0. Strip Tashkeel (Diacritics)
  const cleanWord = stripTashkeel(word);

  // 1. Normalize Grammar (Always Nominative)
  const normalizedWord = normalizeArabicGrammar(cleanWord);

  let ammarChars: string[] = [];
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
      ammarChars.push(ARABIC_TO_AMMAR[char]);
      originalLength++;
      
      if (MAX_CHARS.has(char)) hasMax = true;
      if (MIX_CHARS.has(char)) hasMix = true;
    } else {
      // Keep non-mapped characters
      ammarChars.push(char);
    }
  }

  // --- PROTOCOL DELTA: REFLECTION ---
  // Reflect the base sequence before appending protocols
  ammarChars.reverse();
  let ammarWord = ammarChars.join('');

  // Apply Suffix Rules
  // 1. Length Rule
  if (originalLength > 0) {
    if (originalLength % 2 === 0) {
      ammarWord += 'lo';
    } else {
      ammarWord += 'ri';
    }
  }

  // 2. Mix Rule
  if (hasMix) {
    ammarWord += 'ax';
  }

  // 3. Max Rule
  if (hasMax) {
    ammarWord += 'um';
  }

  // Apply Prefix Rule
  // 4. Vowel Rule (mu prefix)
  if (hasVowel) {
    ammarWord = 'mu' + ammarWord;
  }

  return ammarWord;
}

// --- Ammar to Arabic ---

function normalizeAmmarInput(text: string): string {
  // Fix modifier orderings to match our internal constants
  // User reported issue with 's' + ring + strikethrough (s̶̊)
  // Our constant for 'ص' is 's' + strikethrough + ring
  
  let normalized = text;

  // s + ring (030A) + strikethrough (0336) -> s + strikethrough (0336) + ring (030A)
  normalized = normalized.replace(/s\u030A\u0336/g, 's\u0336\u030A');

  // T + line below (0331) + strikethrough (0336) -> T + strikethrough (0336) + line below (0331)
  // Our constant for 'ظ' is T + double + multi
  normalized = normalized.replace(/T\u0331\u0336/g, 'T\u0336\u0331');

  // a + ring (030A) + tikrar (1d43) -> a + tikrar (1d43) + ring (030A)
  // Our constant for 'غ' is a + tikrar + yoghashak
  normalized = normalized.replace(/a\u030A\u1d43/g, 'a\u1d43\u030A');

  return normalized;
}

export function translateAmmarToArabic(text: string): string {
  // Strip Tashkeel from Ammar input just in case
  const cleanText = text.replace(/[\u064B-\u065F\u0670]/g, '');
  const normalizedText = normalizeAmmarInput(cleanText);
  const tokens = normalizedText.split(/(\s+|[،.!?؟]+)/);
  
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
  let hasMuPrefix = false;

  // 0. Check for 'mu' prefix (Vowel Rule)
  // We tentatively strip it, then verify later if the decoded word actually has vowels.
  if (processedWord.startsWith('mu')) {
    processedWord = processedWord.slice(2);
    hasMuPrefix = true;
  }

  // 1. Stemming (Reverse order of addition)
  // Order added: Length -> Mix -> Max
  // Order removed: Max -> Mix -> Length

  // Remove 'um' (Max suffix)
  if (processedWord.endsWith('um')) {
    processedWord = processedWord.slice(0, -2);
  }

  // Remove 'ax' (Mix suffix)
  if (processedWord.endsWith('ax')) {
    processedWord = processedWord.slice(0, -2);
  }

  // Remove 'lo' or 'ri' (Length suffix)
  if (processedWord.endsWith('lo')) {
    processedWord = processedWord.slice(0, -2);
  } else if (processedWord.endsWith('ri')) {
    processedWord = processedWord.slice(0, -2);
  }

  // --- REVERSE REFLECTION ---
  const charRegex = /[a-zA-Z\u015F][\u0300-\u036F\u1d43]*/g;
  const matches = processedWord.match(charRegex);
  if (matches) {
    processedWord = matches.reverse().join('');
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
        
        if (!arabicOptions) {
          // Should not happen if keys come from the map, but safe guard
          i += key.length;
          matchFound = true;
          break;
        }

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
  
  // Filter candidates based on Vowel Rule if 'mu' was stripped
  let filteredCandidates = candidates;
  if (hasMuPrefix) {
    // If we stripped 'mu', the valid candidate MUST contain a vowel.
    // If it doesn't, then 'mu' was likely part of the word, not a prefix.
    // However, since we already stripped it, we might be in a tricky spot.
    // But wait, if 'mu' was part of the word, we stripped it, so the decoding is missing 'mu'.
    // This logic is slightly flawed if 'mu' is ambiguous.
    // But given the constraints, let's assume if we stripped 'mu', we prefer candidates with vowels.
    const withVowels = candidates.filter(c => [...c].some(char => VOWEL_CHARS.has(char)));
    if (withVowels.length > 0) {
      filteredCandidates = withVowels;
    } else {
      // If no candidate has vowels, then the 'mu' prefix was probably incorrect.
      // We should have kept 'mu'.
      // Re-run decoding with 'mu' prefix?
      // Or just prepend 'مو' to the candidates?
      // 'mu' -> 'م' + 'و' usually.
      filteredCandidates = candidates.map(c => 'مو' + c);
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
