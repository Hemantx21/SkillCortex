import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import CandidateReview from '../models/CandidateReview.js';
import Application from '../models/Application.js';
import Job from '../models/Job.js';
import User from '../models/User.js';
import { GoogleGenAI } from '@google/genai';
dotenv.config();

const router = express.Router();
const GEMINI_MODEL = 'gemini-3-flash-preview';
const INTERVIEW_END_REASONS = {
    tab_switch_limit: 'Candidate switched away from the interview three times.',
    candidate_ended: 'Candidate left the interview before completion.',
    left_interview: 'Candidate left the interview before completion.',
};

function parseGeminiJson(text) {
    const raw = String(text || '').trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
    const start = raw.indexOf('{');
    const end = raw.lastIndexOf('}');
    if (start < 0 || end < start) throw new Error('Gemini returned an invalid response.');
    return JSON.parse(raw.slice(start, end + 1));
}

async function generateStructured(systemInstruction, prompt) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw Object.assign(new Error('Gemini API key is not configured.'), { status: 503 });
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: { systemInstruction, responseMimeType: 'application/json', maxOutputTokens: 1400, temperature: 0.4 },
    });
    return parseGeminiJson(response.text);
}

function normalizeRequirements(requirements) {
    if (Array.isArray(requirements)) return requirements.map(String).slice(0, 30);
    if (typeof requirements === 'string') return requirements.split(/[\n,;]+/).map((value) => value.trim()).filter(Boolean).slice(0, 30);
    return [];
}

function safeGeminiError(error, fallback) {
    const status = Number(error?.status || error?.code || error?.error?.code);
    if (status === 429 || /RESOURCE_EXHAUSTED|quota exceeded|rate limit/i.test(String(error?.message || ''))) {
        return { status: 429, message: 'Gemini interview quota is exhausted. Try again after the quota resets or check the project billing and rate limits.' };
    }
    if (status === 503) return { status: 503, message: 'Gemini is temporarily unavailable. Please try again shortly.' };
    return { status: error?.status || 502, message: fallback };
}

function safeConversation(messages) {
    if (!Array.isArray(messages)) return [];
    return messages
        .filter((message) => ['user', 'assistant'].includes(message?.role) && typeof message.content === 'string')
        .slice(-16)
        .map(({ role, content }) => ({ role, content: content.slice(0, 3000) }));
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

router.post('/generate', auth, async (req, res) => {
    try {
        const { resume = '', jobRole = 'Software Developer', jobRequirements = [], difficulty = 'Intermediate', previousMessages = [] } = req.body || {};
        const role = String(jobRole).slice(0, 160);
        const conversation = safeConversation(previousMessages);
        const requirements = normalizeRequirements(jobRequirements);
        const firstQuestion = conversation.length === 0;
        const prompt = firstQuestion
            ? `Start a live ${String(difficulty).slice(0, 30)}-level job interview for the role "${role}". Job description / requirements: ${requirements.join('; ') || 'Use the role title as the job description.'}\nCandidate resume: ${String(resume).slice(0, 6000)}\nAsk one simple, welcoming self-introduction question. Invite the candidate to summarize their background and mention one relevant project from their resume. Keep it natural and concise. Return JSON: {"question":"..."}.`
            : `Continue a live ${String(difficulty).slice(0, 30)}-level job interview for "${role}". Job description / requirements: ${requirements.join('; ') || 'Use role expectations for this position.'}\nCandidate resume: ${String(resume).slice(0, 6000)}\nConversation so far: ${JSON.stringify(conversation)}\nAsk one clear next question. Refer to the candidate's actual previous answer and, when possible, connect it to a project, skill, or experience present in the resume and relevant to the job description. Do not repeat earlier questions. Give the candidate room to answer. Return JSON: {"question":"..."}.`;
        const result = await generateStructured('You are a professional, supportive interviewer. Ask one question at a time, ground questions in the supplied resume and job description, and never invent candidate experience.', prompt);
        const question = typeof result.question === 'string' ? result.question.trim() : '';
        if (!question) return res.status(502).json({ message: 'Gemini did not return an interview question. Please retry.' });
        return res.json({ text: question });
    } catch (error) {
        console.error('Interview question generation failed:', error.message);
        const safeError = safeGeminiError(error, 'The interviewer could not generate a question. Please retry.');
        return res.status(safeError.status).json({ message: safeError.message });
    }
});

router.post('/respond', auth, async (req, res) => {
    try {
        const { question, answer, resume = '', jobRole = 'Software Developer', jobRequirements = [], difficulty = 'Intermediate', previousMessages = [], answerId } = req.body || {};
        if (typeof question !== 'string' || !question.trim() || typeof answer !== 'string' || answer.trim().length < 2) {
            return res.status(400).json({ message: 'A question and spoken answer are required.' });
        }
        if (typeof answerId !== 'string' || answerId.length < 8 || answerId.length > 100) {
            return res.status(400).json({ message: 'A valid answer identifier is required.' });
        }
        const requirements = normalizeRequirements(jobRequirements);
        const conversation = safeConversation(previousMessages);
        const result = await generateStructured(
            'You are a fair adaptive technical interviewer. Score only the answer to the asked question, distinguish correct facts from unsupported claims, give concise constructive feedback, and ask exactly one relevant next question that adapts to the candidate response. Never repeat a previous question.',
            `Evaluate this candidate response for a ${String(difficulty).slice(0, 30)}-level interview for the role "${String(jobRole).slice(0, 160)}".\nJob description / requirements: ${requirements.join('; ') || 'Role-specific requirements.'}\nResume context: ${String(resume).slice(0, 6000)}\nConversation so far: ${JSON.stringify(conversation)}\nCurrent question: ${question.slice(0, 2000)}\nCandidate answer: ${answer.slice(0, 5000)}\nAdapt the next question to the candidate's actual answer: probe a vague or incorrect answer, or advance to a related skill when the response is strong. Use resume/job context when relevant. Return JSON with exactly: score (integer 0 to 5), feedback (one or two sentences), nextQuestion (one clear, relevant question). Score factual correctness and relevance; do not reward length alone.`,
        );
        const score = Math.max(0, Math.min(5, Math.round(Number(result.score) || 0)));
        const feedback = typeof result.feedback === 'string' ? result.feedback.trim().slice(0, 700) : 'Answer recorded.';
        let nextQuestion = typeof result.nextQuestion === 'string' ? result.nextQuestion.trim().slice(0, 1200) : '';
        if (!nextQuestion) {
            const followUp = await generateStructured(
                'You are a supportive adaptive interviewer. Ask exactly one clear next question based on the conversation and candidate response. Do not repeat previous questions.',
                `Continue the ${String(difficulty).slice(0, 30)}-level interview for "${String(jobRole).slice(0, 160)}".\nRequirements: ${requirements.join('; ') || 'Role-specific requirements.'}\nResume: ${String(resume).slice(0, 6000)}\nConversation: ${JSON.stringify(conversation)}\nQuestion just answered: ${question.slice(0, 2000)}\nCandidate answer: ${answer.slice(0, 5000)}\nAsk one adaptive follow-up, and return JSON: {"question":"..."}.`,
            );
            nextQuestion = typeof followUp.question === 'string' ? followUp.question.trim().slice(0, 1200) : '';
        }
        if (!nextQuestion) {
            return res.status(502).json({ message: 'Your answer was recorded, but the interviewer could not prepare the next question. Please retry.' });
        }
        const points = score >= 3 ? 10 : 0;
        const award = await User.updateOne(
            { _id: req.user.userId, interviewAwardIds: { $ne: answerId } },
            { $addToSet: { interviewAwardIds: answerId }, $inc: { points } },
        );
        const awarded = award.modifiedCount === 1;
        return res.json({ score, feedback, nextQuestion, pointsAwarded: awarded ? points : 0 });
    } catch (error) {
        console.error('Interview answer evaluation failed:', error.message);
        const safeError = safeGeminiError(error, 'The answer could not be evaluated. Please retry.');
        return res.status(safeError.status).json({ message: safeError.message });
    }
});

router.post('/evaluate', auth, async (req, res) => {
    try {
        const { jobId, applicationId, transcript, jobTitle, jobRequirements } = req.body;
        const interviewOutcome = req.body?.interviewOutcome || 'completed';
        if (!['completed', 'candidate_quit'].includes(interviewOutcome)) {
            return res.status(400).json({ message: 'Select a valid interview outcome.' });
        }
        const interviewEndReason = interviewOutcome === 'candidate_quit'
            ? req.body?.interviewEndReason || 'candidate_ended'
            : '';
        if (interviewOutcome === 'candidate_quit' && !Object.prototype.hasOwnProperty.call(INTERVIEW_END_REASONS, interviewEndReason)) {
            return res.status(400).json({ message: 'Select a valid reason for ending the interview.' });
        }
        if (!Array.isArray(transcript) || (transcript.length === 0 && interviewOutcome !== 'candidate_quit')) {
            return res.status(400).json({ message: 'Missing interview transcript' });
        }
        let application = null;
        if (applicationId) {
            if (typeof applicationId !== 'string' || !/^[a-f\d]{24}$/i.test(applicationId)) {
                return res.status(400).json({ message: 'A valid application is required for this interview.' });
            }
            application = await Application.findOne({
                _id: applicationId,
                candidateId: req.user.userId,
                status: 'interview',
            });
            if (!application || (jobId && String(application.jobId) !== String(jobId))) {
                return res.status(403).json({ message: 'This application is not approved for an interview.' });
            }
            if (await CandidateReview.exists({ applicationId: application._id })) {
                return res.status(409).json({ message: 'A scorecard has already been submitted for this interview.' });
            }
        }
        let job = null;
        const resolvedJobId = application?.jobId || jobId;
        if (typeof resolvedJobId === 'string' && /^[a-f\d]{24}$/i.test(resolvedJobId)) {
            job = await Job.findById(resolvedJobId);
        }
        const title = job?.title || jobTitle || 'Interview';
        const requirements = job?.requirements || jobRequirements || [];

        const user = await User.findById(req.user.userId).select('name');
        const safeTranscript = safeConversation(transcript);
        const evalResult = interviewOutcome === 'completed'
            ? await generateStructured(
                'You are an expert interview assessor. Give a balanced evidence-based overall score from 0 to 100 and concise actionable feedback.',
                `Assess this interview for "${title}". Job requirements: ${normalizeRequirements(requirements).join('; ')}. Transcript: ${JSON.stringify(safeTranscript)}. Return JSON with score (integer 0-100) and feedback (concise paragraph).`,
            )
            : null;
        const score = evalResult ? Math.max(0, Math.min(100, Math.round(Number(evalResult.score) || 0))) : 0;
        const feedback = evalResult
            ? typeof evalResult.feedback === 'string' ? evalResult.feedback.trim().slice(0, 3000) : 'Interview evaluation complete.'
            : `Interview ended early. ${INTERVIEW_END_REASONS[interviewEndReason]} Score: 0/100 because the interview was not completed.`;

        if (job && job.hrRef && application) {
            const newReview = new CandidateReview({
                jobId: job._id,
                jobTitle: title,
                hrId: job.hrRef,
                applicationId: application._id,
                candidateId: req.user.userId,
                candidateName: user?.name || 'Candidate',
                aiScore: score,
                aiFeedback: feedback,
                interviewOutcome,
                interviewEndReason,
                transcript: safeTranscript,
            });
            await newReview.save();
            const update = await Application.updateOne({ _id: application._id, status: 'interview' }, { status: 'interviewed' });
            if (update.modifiedCount !== 1) {
                await CandidateReview.deleteOne({ _id: newReview._id });
                return res.status(409).json({ message: 'The application status changed before the scorecard could be submitted.' });
            }
            return res.json({
                message: interviewOutcome === 'candidate_quit'
                    ? `Interview ended early. ${INTERVIEW_END_REASONS[interviewEndReason]} Your scorecard (0/100) is awaiting admin approval before it is shared with HR.`
                    : 'Interview complete. Your scorecard is awaiting admin approval before it is shared with HR.',
                reviewId: newReview._id,
            });
        }

        return res.json({ message: 'Evaluation complete', score, feedback, reviewId: null });
    } catch (error) {
        console.error('Evaluation error:', error.message);
        const safeError = safeGeminiError(error, 'Failed to evaluate interview. Your transcript is still available in this session.');
        return res.status(safeError.status).json({ message: safeError.message });
    }
});

export default router;