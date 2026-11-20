from reportlab.lib.pagesizes import A4
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, HRFlowable
)

styles = getSampleStyleSheet()

title_style = ParagraphStyle(
    'Title', parent=styles['Title'],
    fontName='Helvetica-Bold', fontSize=22, leading=26,
    textColor=colors.HexColor('#1a1a1a'), spaceAfter=6,
)

subtitle_style = ParagraphStyle(
    'Subtitle', parent=styles['Normal'],
    fontName='Helvetica', fontSize=12, leading=16,
    textColor=colors.HexColor('#555555'), spaceAfter=12,
)

h2_style = ParagraphStyle(
    'H2', parent=styles['Heading2'],
    fontName='Helvetica-Bold', fontSize=14, leading=18,
    textColor=colors.HexColor('#2E2C2A'), spaceBefore=14, spaceAfter=6,
)

q_style = ParagraphStyle(
    'Q', parent=styles['Normal'],
    fontName='Helvetica-Bold', fontSize=10.5, leading=14,
    textColor=colors.HexColor('#E35013'), spaceBefore=8, spaceAfter=2,
)

a_style = ParagraphStyle(
    'A', parent=styles['Normal'],
    fontName='Helvetica', fontSize=10, leading=14,
    textColor=colors.HexColor('#2E2C2A'), spaceAfter=6,
    leftIndent=14,
)

bullet_style = ParagraphStyle(
    'Bullet', parent=styles['Normal'],
    fontName='Helvetica', fontSize=9.5, leading=13,
# ---------- Title ----------
story.append(Paragraph("SkillCortex &mdash; Project Q&amp;A Document", title_style))
story.append(Paragraph("Complete overview of backend, frontend, technology, functions, AI model, and credentials", subtitle_style))
story.append(HRFlowable(width='100%', thickness=2, color=colors.HexColor('#2E2C2A'), spaceAfter=12))

# ---------- 1. Project Overview ----------
story += section("1. Project Overview")
story += qa("<b>Q1. What is the project name?</b>", "SkillCortex &mdash; an AI-powered mock interview and technical recruitment platform.")
story += qa("<b>Q2. What does the project do?</b>", "SkillCortex bridges the gap between candidates and recruiters by providing intelligent, automated technical screening. Candidates take adaptive AI interviews, resume parsing, and tech quizzes. HR/recruiters get AI-generated candidate reviews, transcripts, and analytics. It includes gamified skill points, anti-cheat mechanics, real-time video interviews, and a full Admin Console.")
story += qa("<b>Q3. Who are the target users?</b>", "Candidates (job seekers), HR/Recruiters, and Platform Administrators.")

# ---------- 2. Frontend ----------
story += section("2. Frontend (Client)")
story += qa("<b>Q4. What frontend framework is used?</b>", "React.js (v19.2.0) with Vite (v7.3.1) as the build tool.")
story += qa("<b>Q5. What styling library is used?</b>", "Tailwind CSS (v4.2.1) for utility-first styling, plus Framer Motion (v12.34.3) for animations.")
story += qa("<b>Q6. Which icon library is used?</b>", "Lucide React (v0.575.0).")
story += qa("<b>Q7. How is routing handled?</b>", "React Router DOM (v7.13.1).")
story += qa("<b>Q8. What HTTP client is used?</b>", "Axios (v1.13.5) to call the backend API.")
story += qa("<b>Q9. What real-time / media technologies are used?</b>", "Socket.io-client (v4.8.3) and simple-peer (v9.1.1) for WebRTC video interviews; Browser Speech APIs for TTS/STT; Lenis (v1.3.27) for smooth scrolling.")
story += qa("<b>Q10. What port does the frontend run on?</b>", "Port 5173 (Vite dev server). Base URL: http://localhost:5173")

    textColor=colors.HexColor('#2E2C2A'), spaceAfter=2,
    leftIndent=18,
)

small_style = ParagraphStyle(
    'Small', parent=styles['Normal'],
    fontName='Helvetica', fontSize=8, leading=11,
    textColor=colors.HexColor('#9E9894'), spaceBefore=10,
)

story = []

def qa(question, answer):
    return [Paragraph(question, q_style), Paragraph(answer, a_style)]

def section(title):
    return [Paragraph(title, h2_style), HRFlowable(width='100%', thickness=1, color=colors.HexColor('#E6E2E0'), spaceBefore=2, spaceAfter=6)]
# ---------- 3. Backend ----------
story += section("3. Backend (Server / API)")
story += qa("<b>Q11. What backend framework is used?</b>", "Node.js with Express.js (v5.2.1).")
story += qa("<b>Q12. What database is used?</b>", "MongoDB (MongoDB Atlas cloud) with Mongoose (v9.2.2) ODM.")
story += qa("<b>Q13. How is authentication handled?</b>", "JWT (jsonwebtoken v9.0.3) for stateless auth and bcryptjs (v3.0.3) for password hashing. Google OAuth and GitHub OAuth are also supported.")
story += qa("<b>Q14. Which LLM powers interviews and evaluation?</b>", "Google Gemini 2.5 Flash API (@google/genai v1.42.0) for dynamic question generation and transcript evaluation.")
story += qa("<b>Q15. What real-time server is used?</b>", "Socket.io (v4.8.3) as a WebRTC signaling server for live video interviews.")
story += qa("<b>Q16. What port does the backend run on?</b>", "Port 3001. Base URL: http://localhost:3001")
story += qa("<b>Q17. Key backend dependencies?</b>", "express, mongoose, bcryptjs, jsonwebtoken, cors, dotenv, socket.io, multer, pdf-parse, mammoth, csv-parser, @google/genai.")

# ---------- 4. AI Model Service ----------
story += section("4. AI Model Service (AJ Service)")
story += qa("<b>Q18. What is the AI model service?</b>", "A standalone FastAPI + Uvicorn Python service (called &ldquo;AJ Service&rdquo;) that runs a local LLM for chat, QA, resume parsing, interview question generation, and answer evaluation.")
story += qa("<b>Q19. What is the model name?</b>", "Qwen/Qwen2.5-0.5B-Instruct (from HuggingFace). Target: Qwen/Qwen3-4B.")
story += qa("<b>Q20. Where is the model stored?</b>", "Locally in ai/models/base/ (about 988 MB model.safetensors). It runs offline after download.")
story += qa("<b>Q21. What Python libraries run the model?</b>", "torch, transformers, pyyaml, huggingface_hub, fastapi, uvicorn.")
story += qa("<b>Q22. What port does the model service run on?</b>", "Port 8001. Base URL: http://127.0.0.1:8001")
story += qa("<b>Q23. Is offline mode supported?</b>", "Yes &mdash; AJ_OFFLINE_MODE=true in server/.env uses the local model without internet.")

# ---------- 5. Database ----------
story += section("5. Database")
story += qa("<b>Q24. Database provider?</b>", "MongoDB Atlas (cloud-hosted). Connection string is in server/.env (MONGODB_URI).")
story += qa("<b>Q25. Main collections?</b>", "users, jobs, applications, candidate reviews (interview results).")

# ---------- 6. Auth & Credentials ----------
story += section("6. Authentication & Admin Credentials")
story += qa("<b>Q27. How are admin credentials configured?</b>", "Set ADMIN_EMAIL and ADMIN_PASSWORD in server/.env, then run server/seed-admin.js.")
story += qa("<b>Q28. How are HR credentials configured?</b>", "Set HR_EMAIL and HR_PASSWORD in server/.env, then run server/seed-admin.js.")
story += qa("<b>Q29. Can users self-register as admin?</b>", "No. Admin accounts cannot be self-registered; they are seeded via server/seed-admin.js. HR accounts require admin approval before login.")

# ---------- 7. Key Features ----------
story += section("7. Key Features & Modules")
features = [
    "AI Interviewer (AJ Assistant) &mdash; adaptive AI technical interviews",
    "Resume Parsing &mdash; upload PDF/DOCX/TXT, AI extracts tech stack",
    "Timed Mock Sessions &mdash; 10-minute automated technical screenings",
    "Tech Stack Quizzes &mdash; 10-question MCQs across 90+ tech stacks",
    "Gamified Learning &mdash; earn Skill Points, redeem for premium content",
    "Anti-Cheat Mechanics &mdash; tab-switching detection",
    "HR Dashboard &mdash; manage jobs, track candidate progress",
    "AI Candidate Reviews &mdash; score out of 5 with detailed feedback",
    "Transcript Review &mdash; full interview dialogue access",
    "Admin Console / Platform Control Center &mdash; manage users, jobs, interviews, platform health",
    "Real-time Video Interviews &mdash; WebRTC + Socket.io",
    "Analytics &mdash; user growth, role distribution, score distribution",
    "Payments &mdash; Youpi payment gateway integration",
]
for f in features:
    story.append(Paragraph("\u2022 " + f, bullet_style))

# ---------- 8. API Routes ----------
story += section("8. Main API Routes")
routes = [
    ("/api/auth", "login, register, google-oauth, github-oauth, /me"),
    ("/api/jobs", "create, list, update, delete jobs"),
    ("/api/interview", "interview sessions, questions, evaluation"),
    ("/api/upload", "resume/file upload"),
    ("/api/quiz", "tech stack quizzes"),
    ("/api/admin", "stats, users, jobs, applications, reviews, analytics"),
    ("/api/chat", "chat with AI"),
    ("/api/payment", "payment processing"),
]
route_data = [[Paragraph("<b>Route</b>", bullet_style), Paragraph("<b>Purpose</b>", bullet_style)]]
for r, p in routes:
    route_data.append([Paragraph(r, bullet_style), Paragraph(p, bullet_style)])
route_table = Table(route_data, colWidths=[1.6*inch, 4.9*inch])
route_table.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#2E2C2A')),
    ('TEXTCOLOR', (0,0), (-1,0), colors.white),
    ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#F4F2F1')]),
    ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E6E2E0')),
    ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ('LEFTPADDING', (0,0), (-1,-1), 6),
    ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ('TOPPADDING', (0,0), (-1,-1), 4),
    ('BOTTOMPADDING', (0,0), (-1,-1), 4),
]))
story.append(route_table)

# ---------- 9. Admin Console ----------
story += section("9. Admin Console (Platform Control Center)")
story += qa("<b>Q30. What is the Admin Console?</b>", "A protected admin dashboard at /admin for platform administrators. It manages users, jobs, interviews/applications, reviews, and platform health.")
story += qa("<b>Q31. What tabs does it have?</b>", "Overview, Users, Jobs, Applications, Reviews, Analytics, Settings.")
story += qa("<b>Q32. What system status is shown?</b>", "API: online and DB: connected (shown in the sidebar and top bar).")
story += qa("<b>Q33. Can non-admins access it?</b>", "No. A client-side admin guard plus server-side isAdmin middleware restrict access to role=admin only.")

# ---------- 10. How to Run ----------
story += section("10. How to Run the Project")
steps = [
    ("1. Install frontend deps:", "cd client && npm install"),
    ("2. Install backend deps:", "cd server && npm install"),
    ("3. Install AI service deps:", "pip install fastapi uvicorn torch transformers pyyaml huggingface_hub"),
    ("4. Start model service:", "python -m uvicorn ai.service.main:app --host 127.0.0.1 --port 8001"),
    ("5. Start backend:", "cd server && npm run dev   (port 3001)"),
    ("6. Start frontend:", "cd client && npm run dev   (port 5173)"),
    ("7. Health checks:", "http://127.0.0.1:3001/api/health   and   http://127.0.0.1:8001/health"),
]
for label, cmd in steps:
    story.append(Paragraph("<b>%s</b> %s" % (label, cmd), bullet_style))

# ---------- Footer ----------
story.append(Spacer(1, 16))
story.append(HRFlowable(width='100%', thickness=1, color=colors.HexColor('#E6E2E0')))
story.append(Paragraph("Generated for SkillCortex &bull; Backend: Node/Express/MongoDB &bull; Frontend: React/Vite/Tailwind &bull; AI Model: Qwen2.5-0.5B-Instruct (FastAPI)", small_style))
