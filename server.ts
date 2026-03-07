import express from 'express';
import { createServer as createViteServer } from 'vite';
import { translateText } from './src/services/gemini';
import { translateToArabicToAmmar, translateAmmarToArabic } from './src/services/translator';
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;

// Middleware for JSON body parsing
app.use(express.json());

// API Routes
app.get('/api/translate', async (req, res) => {
  const { text, from, to } = req.query;

  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Missing text parameter' });
  }

  try {
    let result = '';
    const source = (from as string).toLowerCase();
    const target = (to as string).toLowerCase();

    if (source === 'ar' && target === 'am') {
      result = translateToArabicToAmmar(text);
    } else if (source === 'am' && target === 'ar') {
      result = translateAmmarToArabic(text);
    } else if (source === 'en' && target === 'am') {
      const arabic = await translateText(text, 'en', 'ar');
      result = translateToArabicToAmmar(arabic);
    } else if (source === 'am' && target === 'en') {
      const arabic = translateAmmarToArabic(text);
      result = await translateText(arabic, 'ar', 'en');
    } else if (source === 'en' && target === 'ar') {
       result = await translateText(text, 'en', 'ar');
    } else if (source === 'ar' && target === 'en') {
       result = await translateText(text, 'ar', 'en');
    } else {
      return res.status(400).json({ error: 'Unsupported language pair. Supported: ar, am, en' });
    }

    res.json({
      text,
      translated: result,
      from: source,
      to: target
    });
  } catch (error) {
    console.error('Translation API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Vite Middleware
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.join(__dirname, 'dist')));
    // Fallback for SPA
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
