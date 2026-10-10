import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Gemini Client
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

// API: Search Grounding for SF HIV Services & Verification
app.post('/api/search-grounding', async (req: Request, res: Response) => {
  try {
    const { query, language = 'en', category } = req.body;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Search query is required' });
    }

    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API is not configured. Please check the Secrets panel.',
      });
    }

    const langInstructions: Record<string, string> = {
      es: 'Responde de manera estructurada, clara y empática en español.',
      zh: '請以繁體中文提供清晰、結構化且富同理心的回覆（符合舊金山公共衛生局指引）。',
      tl: 'Mangyaring sumagot nang malinaw, may empatiya at maayos sa wikang Tagalog / Filipino.',
      vi: 'Vui lòng trả lời bằng tiếng Việt rõ ràng, có cấu trúc và thấu hiểu.',
      ru: 'Ответьте четко, структурированно и с сочувствием на русском языке.',
      en: 'Provide a clear, structured, compassionate response in English.',
    };

    const targetLangPrompt = langInstructions[language] || langInstructions.en;

    const systemInstruction = `You are the Official Verification and Search Navigator for Next Step SF (San Francisco HIV Service Navigator, affiliated with ZSFGH Ward 86 network).
Your role is to help people living with HIV (PLWH), community health workers, and navigators in San Francisco find accurate, trauma-informed, up-to-date, stigma-free information regarding clinical care (Ward 86, Magnet @ Strut, Castro-Mission, Tom Waddell), Ryan White Part A, ADAP, OA-HIPP, HOPWA/PLUS Housing, Project Open Hand medically tailored meals, harm reduction, and legal rights (ALRP).
Use Google Search grounding to retrieve real-time, verified details from official sources like sf.gov, sfdph.org, sfaf.org, ucsf.edu, prcsf.org, openhand.org, alrp.org.
${targetLangPrompt}
Structure your response:
1. Direct, compassionate answer
2. Specific SF locations, addresses, and phone numbers
3. Immediate actionable next steps (walk-in hours, document requirements)
4. Languages and insurance/uninsured eligibility notes.`;

    const searchQuery = `San Francisco HIV resources: ${query} ${category ? `category: ${category}` : ''}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: searchQuery,
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }],
      },
    });

    const responseText = response.text || '';
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    const groundingChunks = groundingMetadata?.groundingChunks || [];
    const webSearchQueries = groundingMetadata?.webSearchQueries || [];

    // Extract citations / web sources
    const sources: Array<{ title: string; url: string }> = [];
    groundingChunks.forEach((chunk: any) => {
      if (chunk.web?.uri) {
        sources.push({
          title: chunk.web.title || 'San Francisco Health Resource',
          url: chunk.web.uri,
        });
      }
    });

    return res.json({
      answer: responseText,
      sources,
      webSearchQueries,
    });
  } catch (err: any) {
    console.error('Error in /api/search-grounding:', err);
    return res.status(500).json({
      error: 'Failed to complete search query. Please try again.',
      details: err.message,
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Next Step SF Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
