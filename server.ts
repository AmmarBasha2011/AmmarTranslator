import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer as createViteServer } from 'vite';
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
      "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // Needed for Vite/React
      "img-src": ["'self'", "data:", "https:"],
      "connect-src": ["'self'", "https://api.mymemory.translated.net"]
    },
  },
}));

app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? false : true // Restrict CORS in production or set to specific domain
}));

app.use(express.json({ limit: '10kb' })); // Limit body size to prevent DoS

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// API Routes
app.get('/api/translate', async (req, res) => {
  const { text, from, to } = req.query;

  // Input Validation & Sanitization (Vulnerability Fix 4 & 5)
  if (!text || typeof text !== 'string' || !from || !to) {
    return res.status(400).json({ error: 'Missing parameters. text, from, and to are required.' });
  }

  if (text.length > 5000) {
    return res.status(400).json({ error: 'Text too long. Max 5000 characters.' });
  }

  try {
    const source = (from as string).toLowerCase() as SupportedLanguage;
    const target = (to as string).toLowerCase() as SupportedLanguage;

    // Basic sanitization
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
    app.use(express.static(path.join(__dirname, 'dist'), {
        setHeaders: (res, path) => {
            if (path.endsWith('.html')) {
                res.setHeader('Cache-Control', 'no-cache');
            }
        }
    }));
    // Fallback for SPA
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  // Bind to 0.0.0.0 for Hugging Face Spaces compatibility
  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
