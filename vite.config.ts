import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // تحميل المتغيرات البيئية من ملف .env
  const env = loadEnv(mode, '.', '');

  return {
    plugins: [react(), tailwindcss()],
    define: {
      // تمرير مفتاح Gemini للـ Frontend
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        // إعداد الـ Alias ليكون المجلد الرئيسي هو @
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      // إعدادات السيرفر للعمل داخل Docker و Hugging Face
      host: '0.0.0.0', // ضروري جداً ليسمع لجميع الشبكات داخل الحاوية
      port: Number(process.env.PORT) || 7860,
      
      // الحل النهائي لمشكلة الـ Blocked Request
      allowedHosts: 'all', // سيقبل أي Host بما في ذلك نطاقات hf.space
      
      // إعدادات الـ HMR (Hot Module Replacement)
      hmr: {
        overlay: false, // لتقليل التداخل في بيئات الـ Cloud
        clientPort: 443, // Hugging Face يستخدم HTTPS
      },
    },
    build: {
      // تأكد من أن مسار المخرجات هو dist
      outDir: 'dist',
      emptyOutDir: true,
    }
  };
});
