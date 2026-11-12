import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

  app.use(express.json());

  // Initialize Gemini client server-side
  const apiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hasApiKey: !!process.env.GEMINI_API_KEY,
      appName: 'WordRing',
    });
  });

  // AI-powered Deck Generator
  app.post('/api/generate-deck', async (req, res) => {
    try {
      const { topic, count = 6, level = 'beginner' } = req.body;
      if (!topic) {
        return res.status(400).json({ error: 'Topic is required' });
      }

      if (!ai) {
        return res.status(503).json({
          error: 'Gemini API key is not configured in Settings > Secrets. You can still use preset decks or add words manually!',
        });
      }

      const prompt = `Create a curated vocabulary deck for language learners studying Thai and English.
Topic: "${topic}"
Level: "${level}"
Number of cards: ${count}
Please generate practical, everyday vocabulary with authentic tone and accurate romanization/phonetics.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction:
            'You are a friendly bilingual Thai-English stationery flashcard teacher for WordRing. Return strictly valid JSON containing an array of vocabulary cards.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              deckTitle: { type: Type.STRING, description: 'Short catchy title for the deck' },
              deckDescription: { type: Type.STRING, description: '1 sentence description in English and Thai' },
              cards: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    thai: { type: Type.STRING, description: 'Thai script word or phrase' },
                    phonetic: { type: Type.STRING, description: 'Romanization / phonetics with tone hints' },
                    english: { type: Type.STRING, description: 'English translation' },
                    partOfSpeech: { type: Type.STRING, description: 'e.g. noun, verb, adjective, phrase' },
                    exampleThai: { type: Type.STRING, description: 'Short natural example sentence in Thai' },
                    exampleEnglish: { type: Type.STRING, description: 'English translation of the example sentence' },
                    mnemonic: { type: Type.STRING, description: 'A cute, memorable mnemonic or learning tip' },
                    tone: { type: Type.STRING, description: 'Tone category: Mid, Low, Falling, High, Rising, or Mixed' },
                  },
                  required: ['thai', 'phonetic', 'english', 'partOfSpeech', 'exampleThai', 'exampleEnglish'],
                },
              },
            },
            required: ['deckTitle', 'deckDescription', 'cards'],
          },
        },
      });

      const text = response.text;
      if (!text) {
        throw new Error('No content received from Gemini');
      }

      const parsed = JSON.parse(text);
      res.json(parsed);
    } catch (err: any) {
      console.error('Error generating deck:', err);
      res.status(500).json({ error: err.message || 'Failed to generate flashcard deck' });
    }
  });

  // Single word expander
  app.post('/api/lookup-word', async (req, res) => {
    try {
      const { query } = req.body;
      if (!query) {
        return res.status(400).json({ error: 'Query word is required' });
      }

      if (!ai) {
        return res.status(503).json({
          error: 'Gemini API key is not configured in Settings > Secrets.',
        });
      }

      const prompt = `Lookup and create a complete flashcard for the word or phrase: "${query}". It can be in English or Thai.`;
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction:
            'You are a bilingual Thai-English linguist. Create a complete flashcard data object.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              thai: { type: Type.STRING },
              phonetic: { type: Type.STRING },
              english: { type: Type.STRING },
              partOfSpeech: { type: Type.STRING },
              exampleThai: { type: Type.STRING },
              exampleEnglish: { type: Type.STRING },
              mnemonic: { type: Type.STRING },
              tone: { type: Type.STRING },
            },
            required: ['thai', 'phonetic', 'english', 'partOfSpeech', 'exampleThai', 'exampleEnglish'],
          },
        },
      });

      const text = response.text;
      if (!text) throw new Error('No content returned');
      res.json(JSON.parse(text));
    } catch (err: any) {
      console.error('Error looking up word:', err);
      res.status(500).json({ error: err.message || 'Failed to lookup word' });
    }
  });

  // Dev server or Production static serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`WordRing server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
