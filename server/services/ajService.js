const AJ_URL = process.env.AJ_MODEL_SERVICE_URL || 'http://127.0.0.1:8001';

async function post(path, body, timeoutMs = 300000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const res = await fetch(`${AJ_URL}${path}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
            signal: controller.signal,
        });
        if (!res.ok) {
            const text = await res.text();
            throw new Error(`AJ service ${res.status}: ${text}`);
        }
        return res.json();
    } finally {
        clearTimeout(timer);
    }
}

export async function ajChat(messages, opts = {}) {
    const data = await post('/v1/chat', { messages, ...opts });
    return data.content;
}

export async function ajGenerateQuestion(payload) {
    const data = await post('/v1/interviews/generate-question', payload);
    return data.question;
}

export async function ajEvaluateTranscript(payload) {
    return post('/v1/interviews/evaluate-transcript', payload);
}

export async function ajGenerateQuiz(topic) {
    const content = await ajChat([
        { role: 'system', content: 'You are an expert technical quiz generator. You always respond in English with valid JSON only. You never include markdown or explanations.' },
        { role: 'user', content: `Generate a 10-question multiple-choice quiz about ${topic}.

Rules:
- Every question and every option must be specifically about ${topic}. Do not ask about other technologies.
- Write all text in English.
- Return ONLY a strict JSON array (no markdown, no explanation).
- Each array item must be an object with exactly these keys: "question" (string), "options" (array of exactly 4 strings), "answerIndex" (integer 0-3).
- The correct answer must be at "answerIndex".
- Randomize the position of the correct answer across questions.` }
    ], { max_new_tokens: 1024, temperature: 0.6 });
    return content;
}

export async function ajParseResume(text) {
    const data = await post('/v1/resume/parse', { text });
    return data.data;
}
