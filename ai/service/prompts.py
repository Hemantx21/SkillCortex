SYSTEM_PROMPT = "You are AJ, a helpful, precise technical assistant for SkillCortex. Be concise, accurate, and admit uncertainty."

RESUME_PARSE_PROMPT = """Extract structured JSON from the resume text. Return only valid JSON with keys: name, email, phone, skills (list), experience (list), education (list), projects (list). Do not invent missing fields; use empty lists or null.

Resume:
{text}
"""

QUESTION_PROMPT = """You are an expert technical interviewer. Generate one {difficulty} interview question for a candidate applying for {job_title}. Requirements: {requirements}. Candidate resume: {resume}. Conversation so far: {conversation}. 

If the candidate has already answered a question, first briefly evaluate that answer (say whether it is correct/incorrect and why in 1-2 sentences), then ask the next question. Avoid these previous questions: {previous}. Return only the evaluation (if any) followed by the next question."""

EVAL_ANSWER_PROMPT = """Evaluate the candidate answer to the interview question. Return strict JSON with keys score (0-5) and feedback (string). Rubric: {rubric}

Question: {question}
Answer: {answer}
"""

EVAL_TRANSCRIPT_PROMPT = """Analyze the interview transcript for job {job_title} (requirements: {requirements}). Return strict JSON with keys score (0-5) and feedback (string).

Transcript:
{transcript}
"""
