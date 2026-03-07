import express from 'express';
import { createServer as createViteServer } from 'vite';
import { translate } from './src/services/translationService';
import { SupportedLanguage } from './src/services/translationService';
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

  if (!text || typeof text !== 'string' || !from || !to) {
    return res.status(400).json({ error: 'Missing parameters. text, from, and to are required.' });
  }

  try {
    const source = (from as string).toLowerCase() as SupportedLanguage;
    const target = (to as string).toLowerCase() as SupportedLanguage;

    const result = await translate(text, source, target);

    res.json({
      text,
      translated: result.text,
      pronunciation: result.pronunciation,
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
