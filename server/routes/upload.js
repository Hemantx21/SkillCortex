import express from 'express';
import { ajParseResume } from '../services/ajService.js';
import multer from 'multer';
import { Readable } from 'stream';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { PDFParse } = require('pdf-parse');
const mammoth = require('mammoth');
const csv = require('csv-parser');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const SUPPORTED = ['PDF', 'DOCX', 'TXT', 'CSV'];

router.post('/resume', upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const buffer = req.file.buffer;
        const mimetype = req.file.mimetype;
        const originalname = (req.file.originalname || '').toLowerCase();
        let extractedText = '';

        if (mimetype === 'application/pdf' || originalname.endsWith('.pdf')) {
            console.log("Parsing PDF buffer of size:", buffer.length);
            const parser = new PDFParse({ data: buffer });
            try {
                const result = await parser.getText();
                extractedText = result?.text || '';
                console.log("PDF parsed successfully, text length:", extractedText.length);
            } finally {
                await parser.destroy().catch(() => {});
            }
        } else if (
            mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
            originalname.endsWith('.docx')
        ) {
            const result = await mammoth.extractRawText({ buffer });
            extractedText = result.value || '';
        } else if (
            mimetype === 'text/plain' ||
            originalname.endsWith('.txt')
        ) {
            extractedText = buffer.toString('utf-8');
        } else if (
            mimetype === 'text/csv' ||
            originalname.endsWith('.csv')
        ) {
            // Parse CSV dynamically
            const results = [];
            const stream = Readable.from(buffer.toString('utf-8'));
            await new Promise((resolve, reject) => {
                stream
                    .pipe(csv())
                    .on('data', (data) => results.push(JSON.stringify(data)))
                    .on('end', resolve)
                    .on('error', reject);
            });
            extractedText = results.join('\n');
        } else {
            return res.status(400).json({ message: `Unsupported file format. Please upload ${SUPPORTED.join(', ')}.` });
        }

        const trimmed = extractedText.trim();
        if (!trimmed) {
            return res.status(422).json({
                message: "No readable text found in the document. If it's an image-based PDF or a scanned document, please paste your resume text manually instead.",
                text: '',
            });
        }

        res.json({ text: trimmed });
    } catch (error) {
        console.error('Resume Parse Error stack:', error.stack);
        res.status(500).json({ message: 'Error parsing resume', error: error.message });
    }
});

const COMMON_SKILLS = ['React', 'Node.js', 'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Git', 'GraphQL', 'REST', 'HTML', 'CSS', 'Tailwind', 'Vue.js', 'Angular', 'Next.js', 'Express.js', 'Django', 'Flask', 'Spring Boot', 'TensorFlow', 'PyTorch'];

function buildFallbackProfile(text) {
  const lower = text.toLowerCase();
  const skills = COMMON_SKILLS.filter((s) => lower.includes(s.toLowerCase()));
  const yearsMatch = text.match(/(\d+)\s*\+?\s*years?/i);
  const experience = yearsMatch ? `${yearsMatch[1]} years` : '';
  const eduMatch = text.match(/(B\.?Tech|Bachelor|Master|M\.?Tech|Ph\.?D|MBA|B\.?Sc|M\.?Sc)[^\n]*/i);
  const education = eduMatch ? eduMatch[0].trim() : '';
  const projectLines = text.split(/\n/).map((l) => l.trim()).filter((l) => /project/i.test(l)).slice(0, 5);
  return { name: '', email: '', phone: '', skills, projects: projectLines, experience, education, strengths: [] };
}

router.post('/parse', async (req, res) => {
    const text = (req.body && req.body.text) || '';
    try {
        if (!text.trim()) {
            return res.status(400).json({ message: 'Resume text is required' });
        }
        const data = await ajParseResume(text.slice(0, 6000));
        res.json({ profile: data });
    } catch (error) {
        console.error('Resume parse error:', error);
        const profile = buildFallbackProfile(text);
        res.json({ profile, fallback: true });
    }
});

export default router;
