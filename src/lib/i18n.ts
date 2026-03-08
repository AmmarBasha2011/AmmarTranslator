
import { translateToArabicToAmmar } from '../services/translator';

export type Language = 'en' | 'ar' | 'am';

export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    'nav.translator': 'Translator',
    'nav.hub': 'Hub',
    'nav.learn': 'Learn',
    'header.title': 'Ammar V2',
    'header.subtitle': 'Neural Suite',
    'common.processing': 'Processing...',
    'common.copy': 'Copy',
    'common.copied': 'Copied',
    'common.save': 'Save',
    'common.listen': 'Listen',
    'common.clear': 'Clear',
    'common.translate': 'Translate',
    'translator.placeholder': 'Tap to enter text...',
    'translator.pronunciation': 'Pronunciation',
    'translator.empty': 'Translation will appear here',
    'hub.title': 'Ammar Hub',
    'hub.subtitle': 'Stories, Wisdoms, and Articles',
    'hub.empty': 'No posts found.',
    'hub.add_post': 'Create Post',
    'hub.post_placeholder': 'Write your story in Ammar Language...',
    'hub.post_button': 'Post',
    'hub.validation_title': 'Ammar Syntax Check',
    'hub.confirm_post': 'Your post has some potential errors. Do you want to post anyway?',
    'hub.post_success': 'Post published successfully!',
    'hub.post_error': 'Failed to publish post.',
    'learn.guide': 'Guide',
    'learn.matrix': 'Matrix',
    'learn.api': 'API',
  },
  ar: {
    'nav.translator': 'المترجم',
    'nav.hub': 'المنصة',
    'nav.learn': 'تعلم',
    'header.title': 'عمار V2',
    'header.subtitle': 'المحرك العصبي',
    'common.processing': 'جاري المعالجة...',
    'common.copy': 'نسخ',
    'common.copied': 'تم النسخ',
    'common.save': 'حفظ',
    'common.listen': 'استماع',
    'common.clear': 'مسح',
    'common.translate': 'ترجم',
    'translator.placeholder': 'اضغط لإدخال النص...',
    'translator.pronunciation': 'النطق',
    'translator.empty': 'الترجمة ستظهر هنا',
    'hub.title': 'منصة عمار',
    'hub.subtitle': 'قصص، حكم، ومقالات',
    'hub.empty': 'لا توجد منشورات.',
    'hub.add_post': 'أنشئ منشور',
    'hub.post_placeholder': 'اكتب قصتك بلغة عمار...',
    'hub.post_button': 'نشر',
    'hub.validation_title': 'فحص قواعد لغة عمار',
    'hub.confirm_post': 'منشورك يحتوي على أخطاء محتملة. هل تريد النشر على أي حال؟',
    'hub.post_success': 'تم نشر المنشور بنجاح!',
    'hub.post_error': 'فشل نشر المنشور.',
    'learn.guide': 'الدليل',
    'learn.matrix': 'المصفوفة',
    'learn.api': 'API',
  },
  am: {
    // These will be dynamically populated or fall back to translated Arabic
  }
};

export function getTranslation(key: string, lang: Language): string {
  if (lang === 'am') {
    const arabicText = TRANSLATIONS['ar'][key] || TRANSLATIONS['en'][key] || key;
    return translateToArabicToAmmar(arabicText);
  }
  return TRANSLATIONS[lang][key] || TRANSLATIONS['en'][key] || key;
}
