import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
dotenv.config();

const router = express.Router();
const quizCache = new Map();
const pendingQuizzes = new Map();
const MAX_CACHED_QUIZZES = 100;

function isQuotaError(error) {
    const status = Number(error?.status || error?.code || error?.error?.code);
    const message = [error?.message, error?.status, error?.error?.status].filter(Boolean).join(' ');
    return status === 429 || /RESOURCE_EXHAUSTED|quota exceeded|rate limit/i.test(message);
}

function quotaMessage() {
    return 'Gemini quiz quota has been reached. Try again after the quota resets or check the project billing and rate limits.';
}

const auth = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

function buildPrompt(topic) {
    return `Create exactly 10 high-quality multiple-choice assessment questions about ${topic}.

Rules:
- Every question must assess a distinct, relevant concept in ${topic}; do not switch to a different technology.
- Include a balanced mix of foundational and intermediate knowledge.
- Every question must have exactly four plausible, distinct answer options and exactly one correct answer.
- Write all text in English.
- Return only a JSON array, with no markdown or surrounding text.
- Each array item must be an object with exactly these keys: "question" (string), "options" (array of exactly 4 strings), "answerIndex" (integer 0-3).
- The answer at "answerIndex" must be the single correct option.
- Vary the correct answer position across the quiz.
- Avoid ambiguous wording, trick questions, duplicate questions, and duplicate options.`;
}

function normalizeQuestions(raw) {
    if (!Array.isArray(raw)) return null;
    const out = [];
    for (const q of raw) {
        if (!q || typeof q !== 'object') continue;
        const question = (q.question || q.q || '').toString().trim();
        const optsRaw = Array.isArray(q.options) ? q.options : (Array.isArray(q.opts) ? q.opts : null);
        if (!question || !optsRaw || optsRaw.length !== 4) continue;
        const options = optsRaw.map((o) => String(o).trim()).filter(Boolean);
        if (options.length !== 4 || new Set(options.map((option) => option.toLowerCase())).size !== 4) continue;
        const answerIndex = Number.isInteger(q.answerIndex) ? q.answerIndex : q.answer;
        if (!Number.isInteger(answerIndex) || answerIndex < 0 || answerIndex >= options.length) continue;
        out.push({ question, options, answerIndex, diff: q.diff || 'Medium', cat: q.cat || topicCategory(q) });
    }
    return out.length ? out : null;
}

function topicCategory() { return 'Core'; }

router.post('/generate', auth, async (req, res) => {
    const topic = typeof req.body?.topic === 'string' ? req.body.topic.trim() : '';
    if (!topic || topic.length > 80 || !/^[\p{L}\p{N} .+#&()/-]+$/u.test(topic)) {
        return res.status(400).json({ message: 'Please select a valid technology topic.' });
    }
    const cacheKey = topic.toLocaleLowerCase();
    const cachedQuestions = quizCache.get(cacheKey);
    if (cachedQuestions) return res.json({ questions: cachedQuestions, cached: true });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return res.status(503).json({ message: 'Quiz generation is not configured. Add GEMINI_API_KEY to the server environment.' });
    }

    let generation = pendingQuizzes.get(cacheKey);
    const joinedInFlightRequest = Boolean(generation);
    if (!generation) {
        generation = (async () => {
            const ai = new GoogleGenAI({ apiKey });
            const systemInstruction = 'You are an expert technical assessment author. Follow the requested topic and output format exactly. Ensure every answer key is correct.';
            let lastError = null;
            for (let attempt = 0; attempt < 2; attempt++) {
                try {
                    const response = await ai.models.generateContent({
                        model: 'gemini-3-flash-preview',
                        contents: [{ role: 'user', parts: [{ text: buildPrompt(topic) }] }],
                        config: {
                            systemInstruction,
                            responseMimeType: 'application/json',
                            maxOutputTokens: 4096,
                            temperature: attempt === 0 ? 0.4 : 0.2,
                        },
                    });
                    const content = response.text?.trim() || '';
                    const start = content.indexOf('[');
                    const end = content.lastIndexOf(']');
                    if (start === -1 || end === -1) throw new Error('No JSON array found');
                    const parsed = JSON.parse(content.slice(start, end + 1));
                    const questions = normalizeQuestions(parsed);
                    if (questions && questions.length === 10) return questions;
                    lastError = new Error('Gemini returned an incomplete or invalid quiz');
                } catch (error) {
                    lastError = error;
                    if (isQuotaError(error)) throw error;
                }
            }
            throw lastError || new Error('Gemini could not generate a valid quiz');
        })();
        pendingQuizzes.set(cacheKey, generation);
    }

    try {
        const questions = await generation;
        quizCache.set(cacheKey, questions);
        if (quizCache.size > MAX_CACHED_QUIZZES) {
            quizCache.delete(quizCache.keys().next().value);
        }
        return res.json({ questions, cached: joinedInFlightRequest });
    } catch (error) {
        if (isQuotaError(error)) {
            console.warn(`Gemini quiz quota reached for topic: ${topic}`);
            return res.status(429).json({ message: quotaMessage() });
        }
        console.error('Quiz generation failed:', error?.message || 'Unknown Gemini error');
        return res.status(502).json({ message: 'Gemini could not generate a valid quiz. Please try again.' });
    } finally {
        if (pendingQuizzes.get(cacheKey) === generation) pendingQuizzes.delete(cacheKey);
    }
});

export default router;