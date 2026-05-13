import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { translate } from './src/services/translationService';
import { SupportedLanguage } from './src/services/translationService';
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 7860;

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      "img-src": ["'self'", "data:", "https:"],
      "connect-src": ["'self'", "https://api.mymemory.translated.net"]
    },
  },
}));

app.use(cors());

app.use(express.json({ limit: '10kb' }));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// API Routes
app.get('/api/translate', async (req, res) => {
  const { text, from, to } = req.query;

  if (!text || typeof text !== 'string' || !from || !to) {
    return res.status(400).json({ error: 'Missing parameters. text, from, and to are required.' });
  }

  if (text.length > 5000) {
    return res.status(400).json({ error: 'Text too long. Max 5000 characters.' });
  }

  try {
    const source = (from as string).toLowerCase() as SupportedLanguage;
    const target = (to as string).toLowerCase() as SupportedLanguage;
    const sanitizedText = text.replace(/[<>]/g, '');

    const translated = await translate(sanitizedText, source, target);

    res.json({
      text: sanitizedText,
      translated,
      from: source,
      to: target
    });
  } catch (error) {
    console.error('Translation API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Server Middleware
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    // Dynamic import to avoid production dependency on vite
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    // Since this file is in dist/server.js, __dirname IS dist.
    app.use(express.static(__dirname, {
        setHeaders: (res, path) => {
            if (path.endsWith('.html')) {
                res.setHeader('Cache-Control', 'no-cache');
            }
        }
    }));
    // Fallback for SPA
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
