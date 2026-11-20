import express from 'express';
import { GoogleGenAI } from '@google/genai';

const router = express.Router();

const GEMINI_KEY = process.env.GEMINI_API_KEY || '';
const QUOTA_MESSAGE = 'The assistant has reached its current request limit. Please try again later.';

function isQuotaError(error) {
  const status = Number(error?.status || error?.code || error?.error?.code);
  const message = [error?.message, error?.status, error?.error?.status].filter(Boolean).join(' ');
  return status === 429 || /RESOURCE_EXHAUSTED|quota exceeded|rate limit/i.test(message);
}

router.post('/', async (req, res) => {
  try {
    const { messages = [] } = req.body || {};
    if (!GEMINI_KEY) {
      return res.status(503).json({ message: 'Gemini API key is not configured on the server.' });
    }

    const ai = new GoogleGenAI({ apiKey: GEMINI_KEY });

    // Build conversation history for Gemini
    const systemInstruction = 'You are AJ, the SkillCortex AI assistant. You help candidates with interview preparation, technical quizzes, resume parsing, Skill Points, and platform features. Reply professionally, concisely, and helpfully. Use markdown sparingly.';

    const contents = messages.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.text || m.content || '' }]
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: { systemInstruction }
    });

    const reply = response?.text || 'I am sorry, I could not generate a response. Please try again.';
    return res.json({ reply });
  } catch (err) {
    if (isQuotaError(err)) {
      console.warn('Chat request rejected: Gemini quota exhausted (429).');
      return res.status(429).json({ message: QUOTA_MESSAGE });
    }
    const status = Number(err?.status);
    console.error(`Chat service failed${status ? ` (${status})` : ''}.`);
    return res.status(502).json({ message: 'The assistant is temporarily unavailable. Please try again shortly.' });
  }
});

export default router;
