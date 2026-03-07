
// Unicode Modifiers
const MOD_YOGHASHAK = '\u030A'; // Circle above
const MOD_YOGHASHAK_H = '\u0305'; // Overline (for H)
const MOD_MULTI = '\u0331'; // Line below
const MOD_DOUBLE = '\u0336'; // Strikethrough
const MOD_TIKRAR = '\u1d43'; // Small 'a' above

// Character Sets
export const MAX_CHARS = new Set([
  'أ', 'إ', 'آ', 'ء', 'ؤ', 'ئ', // a + yoghashak
  'ث', // s + yoghashak
  'ح', // H + yoghashak_h
  'خ', // H + multi
  'ذ', // z + yoghashak
  'ش', // ş
  'ص', // s + double + yoghashak (Mix)
  'ض', // s + double
  'ط', // T + multi
  'ظ', // T + double + multi (Mix)
  'ع', // a + tikrar
  'غ', // a + tikrar + yoghashak (Mix)
  'ق', // f + multi
]);

export const MIX_CHARS = new Set([
  'ص', // s + double + yoghashak
  'ظ', // T + double + multi
  'غ', // a + tikrar + yoghashak
]);

// Mapping: Arabic -> Ammar
export const ARABIC_TO_AMMAR: Record<string, string> = {
  'ا': 'a',
  'ى': 'a',
  'أ': 'a' + MOD_YOGHASHAK,
  'إ': 'a' + MOD_YOGHASHAK,
  'آ': 'a' + MOD_YOGHASHAK,
  'ء': 'a' + MOD_YOGHASHAK,
  'ؤ': 'a' + MOD_YOGHASHAK,
  'ئ': 'a' + MOD_YOGHASHAK,
  'ب': 'b',
  'ت': 'T',
  'ث': 's' + MOD_YOGHASHAK,
  'ج': 'g',
  'ح': 'H' + MOD_YOGHASHAK_H,
  'خ': 'H' + MOD_MULTI,
  'د': 'd',
  'ذ': 'z' + MOD_YOGHASHAK,
  'ر': 'r',
  'ز': 'z',
  'س': 's',
  'ش': 'ş',
  'ص': 's' + MOD_DOUBLE + MOD_YOGHASHAK,
  'ض': 's' + MOD_DOUBLE,
  'ط': 'T' + MOD_MULTI,
  'ظ': 'T' + MOD_DOUBLE + MOD_MULTI,
  'ع': 'a' + MOD_TIKRAR,
  'غ': 'a' + MOD_TIKRAR + MOD_YOGHASHAK,
  'ف': 'f',
  'ق': 'f' + MOD_MULTI,
  'ك': 'k',
  'ل': 'L',
  'م': 'm',
  'ن': 'n',
  'ه': 'H',
  'ة': 'o',
  'و': 'W',
  'ي': 'Y',
  // Common symbols to ignore or pass through could be handled in logic
};

// Mapping: Ammar -> Arabic (Reverse)
// We need to be careful with greedy matching.
// We will sort keys by length descending in the translation logic.
export const AMMAR_TO_ARABIC_MAP: Record<string, string[]> = {
  'a': ['ا', 'ى'],
  ['a' + MOD_YOGHASHAK]: ['أ', 'إ', 'آ', 'ء', 'ؤ', 'ئ'],
  'b': ['ب'],
  'T': ['ت'],
  ['s' + MOD_YOGHASHAK]: ['ث'],
  'g': ['ج'],
  ['H' + MOD_YOGHASHAK_H]: ['ح'],
  ['H' + MOD_MULTI]: ['خ'],
  'd': ['د'],
  ['z' + MOD_YOGHASHAK]: ['ذ'],
  'r': ['ر'],
  'z': ['ز'],
  's': ['س'],
  'ş': ['ش'],
  ['s' + MOD_DOUBLE + MOD_YOGHASHAK]: ['ص'],
  ['s' + MOD_DOUBLE]: ['ض'],
  ['T' + MOD_MULTI]: ['ط'],
  ['T' + MOD_DOUBLE + MOD_MULTI]: ['ظ'],
  ['a' + MOD_TIKRAR]: ['ع'],
  ['a' + MOD_TIKRAR + MOD_YOGHASHAK]: ['غ'],
  'f': ['ف'],
  ['f' + MOD_MULTI]: ['ق'],
  'k': ['ك'],
  'L': ['ل'],
  'm': ['م'],
  'n': ['ن'],
  'H': ['ه'],
  'h': ['ه'], // Support lowercase h input
  'o': ['ة'],
  'W': ['و'],
  'Y': ['ي'],
  // Case insensitivity handling:
  't': ['ت'],
  'G': ['ج'],
  'D': ['د'],
  'R': ['ر'],
  'Z': ['ز'],
  'S': ['س'],
  'F': ['ف'],
  'K': ['ك'],
  'l': ['ل'],
  'M': ['م'],
  'N': ['ن'],
  'O': ['ة'],
  'w': ['و'],
  'y': ['ي'],
};

// Common Words Memory (The "Mini Memory")
export const COMMON_WORDS = new Set([
  'أنا', 'أنت', 'عمار', 'مصر', 'إحنا', 'عشان', 'يلا', 'عبيط',
  'نعم', 'لا', 'مرحبا', 'شكرا', 'كيف', 'لماذا', 'متى', 'أين',
  'هو', 'هي', 'هم', 'نحن', 'أنتم', 'هذا', 'هذه', 'ذلك',
  'الله', 'الرحمن', 'الرحيم', 'السلام', 'عليكم'
]);

// Vowel Characters (Rule: Add 'mt' prefix if present)
export const VOWEL_CHARS = new Set(['أ', 'ا', 'ة', 'ع', 'غ']);

// Helper to check if a character is Arabic
export function isArabicChar(char: string): boolean {
  return /[\u0600-\u06FF]/.test(char);
}

// Helper to check if text is predominantly Arabic
export function isArabicText(text: string): boolean {
  const arabicCount = (text.match(/[\u0600-\u06FF]/g) || []).length;
  const latinCount = (text.match(/[a-zA-Z]/g) || []).length;
  return arabicCount > latinCount;
}
