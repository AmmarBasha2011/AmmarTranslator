import express from 'express';
import { createServer as createViteServer } from 'vite';
import { translateText, Language } from './src/services/translation';
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

  if (!from || typeof from !== 'string' || !to || typeof to !== 'string') {
    return res.status(400).json({ error: 'Missing from/to language parameters' });
  }

  const supportedLanguages = ['en', 'ar', 'am', 'fr', 'tr', 'de', 'es'];
  const source = (from as string).toLowerCase();
  const target = (to as string).toLowerCase();

  if (!supportedLanguages.includes(source) || !supportedLanguages.includes(target)) {
    return res.status(400).json({ 
      error: `Unsupported language pair. Supported: ${supportedLanguages.join(', ')}` 
    });
  }

  try {
    const result = await translateText(text, source as Language, target as Language);

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
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    
    // API routes are already defined above, so they will be hit first.
    // Fallback for SPA
    app.get('*', (req, res) => {
      // Check if it's an API request that didn't match
      if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'API endpoint not found' });
      }
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
