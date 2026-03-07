
import { 
  ARABIC_TO_AMMAR, 
  MAX_CHARS, 
  MIX_CHARS, 
  VOWEL_CHARS,
  isArabicText
} from '../constants';

export interface ValidationError {
  word: string;
  message: string;
  suggestion?: string;
  severity: 'error' | 'warning';
  index: number;
}

export function validateInput(text: string): ValidationError[] {
  if (!text.trim()) return [];
  
  if (isArabicText(text)) {
    return validateArabicInput(text);
  } else {
    return validateAmmarInput(text);
  }
}

// --- Arabic Validation ---

export function validateArabicInput(text: string): ValidationError[] {
  const errors: ValidationError[] = [];
  const words = text.split(/\s+/);

  words.forEach((word, index) => {
    if (!word) return;
    
    // Skip if not Arabic
    if (!/[\u0600-\u06FF]/.test(word)) return;

    // Check 1: Forbidden starts
    const forbiddenStarts = ['ة', 'ئ', 'ؤ', 'ء'];
    if (forbiddenStarts.includes(word[0])) {
      let suggestion = word;
      if (word[0] === 'ة') suggestion = 'ت' + word.slice(1);
      else if (word[0] === 'ئ' || word[0] === 'ؤ' || word[0] === 'ء') suggestion = 'أ' + word.slice(1);

      errors.push({
        word,
        message: `Words cannot start with '${word[0]}'`,
        suggestion,
        severity: 'error',
        index
      });
    }

    // Check 2: Forbidden combinations
    if (word.includes('ةا')) {
      errors.push({
        word,
        message: "Forbidden combination 'ةا'",
        suggestion: word.replace('ةا', 'تا'),
        severity: 'error',
        index
      });
    }
    if (word.includes('ةو')) {
      errors.push({
        word,
        message: "Forbidden combination 'ةو'",
        suggestion: word.replace('ةو', 'تو'),
        severity: 'error',
        index
      });
    }

    // Check 3: Grammar (Nominative Case)
    if (word.endsWith('ين')) {
      const base = word.slice(0, -2);
      errors.push({
        word,
        message: "Ammar Language uses Nominative case (Al-Raf') only. Use 'ون' for plural or 'ان' for dual.",
        suggestion: base + 'ون', // Default to plural as it's more common, but message explains both
        severity: 'warning',
        index
      });
    }
  });

  return errors;
}

// --- Ammar Validation ---

export function validateAmmarInput(text: string): ValidationError[] {
  const errors: ValidationError[] = [];
  const words = text.split(/\s+/);

  words.forEach((word, index) => {
    if (!word) return;
    
    // Skip if Arabic
    if (/[\u0600-\u06FF]/.test(word)) return;

    // We need to reverse-engineer the word to see if it matches the rules.
    // 1. Identify Suffixes present
    let tempWord = word;
    let hasUm = false;
    let hasAx = false;
    let hasLo = false;
    let hasRi = false;

    if (tempWord.endsWith('um')) {
      hasUm = true;
      tempWord = tempWord.slice(0, -2);
    }
    if (tempWord.endsWith('ax')) {
      hasAx = true;
      tempWord = tempWord.slice(0, -2);
    }
    if (tempWord.endsWith('lo')) {
      hasLo = true;
      tempWord = tempWord.slice(0, -2);
    } else if (tempWord.endsWith('ri')) {
      hasRi = true;
      tempWord = tempWord.slice(0, -2);
    }

    // 2. Identify Prefix
    let hasMu = false;
    if (tempWord.startsWith('mu')) {
      hasMu = true;
      tempWord = tempWord.slice(2);
    }

    // Now 'tempWord' should be the base Ammar word.
    // Let's analyze this base to see what suffixes/prefixes it SHOULD have.
    
    // Analyze Base
    let shouldHaveMax = false;
    let shouldHaveMix = false;
    let baseLength = 0;

    // We need to iterate through the base word char by char (considering unicode modifiers)
    // This is tricky because JS strings split modifiers.
    // We can use the ARABIC_TO_AMMAR values to find matches, but we are going Ammar -> Analysis.
    // Let's iterate through the string and group base+modifiers.
    
    // Regex to match a base char + optional modifiers
    // Base chars are a-z, A-Z, and special chars like 'ş'.
    // We need to be inclusive of all characters that can be base characters in Ammar.
    // Looking at ARABIC_TO_AMMAR, we have a-z, A-Z, and 'ş' (\u015F).
    // Let's use a broader range or explicit list.
    const charRegex = /[a-zA-Z\u015F][\u0300-\u036F\u1d43]*/g;
    const matches = tempWord.match(charRegex);
    
    if (!matches) {
      // If no matches, maybe it's just symbols or empty?
      return;
    }

    baseLength = matches.length;

    for (const char of matches) {
      // Check if this char corresponds to a Max or Mix Arabic char
      // We can check our sets.
      // But our sets are Arabic chars. We need to know if this Ammar char maps to a Max/Mix Arabic char.
      // We can look up the Ammar char in the values of ARABIC_TO_AMMAR
      
      // Find Arabic char for this Ammar char
      const arabicChar = Object.keys(ARABIC_TO_AMMAR).find(key => ARABIC_TO_AMMAR[key] === char);
      
      if (arabicChar) {
        if (MAX_CHARS.has(arabicChar)) shouldHaveMax = true;
        if (MIX_CHARS.has(arabicChar)) shouldHaveMix = true;
      }
    }

    // 3. Compare Expected vs Actual

    // Length Rule
    const isEven = baseLength % 2 === 0;
    if (isEven && !hasLo) {
      errors.push({
        word,
        message: `Even length (${baseLength}) requires 'lo' suffix.`,
        suggestion: reconstructWord(hasMu, tempWord, 'lo', hasAx, hasUm),
        severity: 'error',
        index
      });
    } else if (!isEven && !hasRi) {
      errors.push({
        word,
        message: `Odd length (${baseLength}) requires 'ri' suffix.`,
        suggestion: reconstructWord(hasMu, tempWord, 'ri', hasAx, hasUm),
        severity: 'error',
        index
      });
    } else if (isEven && hasRi) {
       errors.push({
        word,
        message: `Even length (${baseLength}) should use 'lo', not 'ri'.`,
        suggestion: reconstructWord(hasMu, tempWord, 'lo', hasAx, hasUm),
        severity: 'error',
        index
      });
    } else if (!isEven && hasLo) {
       errors.push({
        word,
        message: `Odd length (${baseLength}) should use 'ri', not 'lo'.`,
        suggestion: reconstructWord(hasMu, tempWord, 'ri', hasAx, hasUm),
        severity: 'error',
        index
      });
    }

    // Mix Rule
    if (shouldHaveMix && !hasAx) {
      errors.push({
        word,
        message: "Word contains Mix characters, missing 'ax' suffix.",
        suggestion: reconstructWord(hasMu, tempWord, isEven ? 'lo' : 'ri', true, hasUm),
        severity: 'error',
        index
      });
    } else if (!shouldHaveMix && hasAx) {
       errors.push({
        word,
        message: "Word has no Mix characters, remove 'ax' suffix.",
        suggestion: reconstructWord(hasMu, tempWord, isEven ? 'lo' : 'ri', false, hasUm),
        severity: 'warning',
        index
      });
    }

    // Max Rule
    if (shouldHaveMax && !hasUm) {
      errors.push({
        word,
        message: "Word contains Max characters, missing 'um' suffix.",
        suggestion: reconstructWord(hasMu, tempWord, isEven ? 'lo' : 'ri', shouldHaveMix, true),
        severity: 'error',
        index
      });
    } else if (!shouldHaveMax && hasUm) {
       errors.push({
        word,
        message: "Word has no Max characters, remove 'um' suffix.",
        suggestion: reconstructWord(hasMu, tempWord, isEven ? 'lo' : 'ri', shouldHaveMix, false),
        severity: 'warning',
        index
      });
    }

    // Vowel Rule (Prefix)
    // This is harder because we don't know for sure if the word has vowels without full context decoding.
    // But if 'mu' is missing, we can check if any of the chars MAP to a vowel.
    let hasVowel = false;
    for (const char of matches) {
       const arabicChar = Object.keys(ARABIC_TO_AMMAR).find(key => ARABIC_TO_AMMAR[key] === char);
       if (arabicChar && VOWEL_CHARS.has(arabicChar)) {
         hasVowel = true;
         break;
       }
    }

    if (hasVowel && !hasMu) {
      errors.push({
        word,
        message: "Word contains vowels, missing 'mu' prefix.",
        suggestion: reconstructWord(true, tempWord, isEven ? 'lo' : 'ri', shouldHaveMix, shouldHaveMax),
        severity: 'error',
        index
      });
    } else if (!hasVowel && hasMu) {
       errors.push({
        word,
        message: "Word has no vowels, remove 'mu' prefix.",
        suggestion: reconstructWord(false, tempWord, isEven ? 'lo' : 'ri', shouldHaveMix, shouldHaveMax),
        severity: 'warning',
        index
      });
    }

  });

  return errors;
}

function reconstructWord(mu: boolean, base: string, lenSuffix: string, ax: boolean, um: boolean): string {
  let res = base;
  if (mu) res = 'mu' + res;
  res += lenSuffix;
  if (ax) res += 'ax';
  if (um) res += 'um';
  return res;
}
