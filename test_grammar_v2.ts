
import { translateToArabicToAmmar } from './src/services/translator.ts';

const inputs = ['معلمين', 'كتابين'];
inputs.forEach(input => {
  const result = translateToArabicToAmmar(input);
  console.log(`Input: ${input} -> Result: ${result}`);
});

// Verification check
const m = translateToArabicToAmmar('معلمين');
const k = translateToArabicToAmmar('كتابين');

if (m.includes('Nw') && k.includes('Na')) {
  console.log('SUCCESS: Grammar Shield plural/dual rules applied.');
} else {
  console.log('FAILURE: Grammar Shield rules not functioning as expected.');
}
