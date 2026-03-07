
import { translateToArabicToAmmar } from './src/services/translator.ts';

const input = 'أبي';
const result = translateToArabicToAmmar(input);
console.log(`Input: ${input}`);
console.log(`Result: ${result}`);
if (result.includes('mu') && result.includes('iba') && result.includes('ri')) {
  console.log('SUCCESS: Reflection and rules applied correctly.');
} else {
  console.log('FAILURE: Result does not match expectations.');
}
