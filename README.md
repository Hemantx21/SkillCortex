# 🧠 SkillCortex

**SkillCortex** is an advanced, AI-powered mock interview and technical recruitment platform. It bridges the gap between candidates and recruiters by providing intelligent, automated technical screening and a gamified skill-building experience. 

Designed for the modern tech landscape, SkillCortex leverages the **Google Gemini API**, **WebRTC**, and real-time speech processing to conduct hyper-realistic video interviews, evaluate candidate performance, and provide actionable analytics to HR teams.

---

## 🌟 Key Features

### For Candidates
*   🤖 **AJ Assistant (AI Interviewer):** A highly conversational AI that conducts dynamic video/audio technical interviews.
*   📄 **Intelligent Resume Parsing:** Upload your PDF, DOCX, or TXT resume. The AI extracts your technical context and tailors the interview precisely to your stated tech stack.
*   🧭 **Application-led interviews:** Apply to an open role and track its status. The interview starts only after an admin approves the application.
*   ⏱️ **Timed Mock Sessions:** Realistic 10-minute automated technical screenings simulating high-pressure environments.
*   🏆 **Tech Stack Quizzes:** Instantly generate specialized, 10-question multiple-choice quizzes across 90+ tech stacks (React, Node, Java, Python, Rust, Go, and more).
*   🎮 **Gamified Learning:** Earn Skill Points through mock interviews and quizzes. Redeem points for premium algorithmic challenges and exclusive video masterclasses.
*   👁️ **Anti-Cheat Mechanics:** Built-in tab-switching detection ensures the integrity of the assessment.

### For HR / Recruiters
*   📊 **Dedicated HR Dashboard:** Post job descriptions, manage openings, and review applications for your roles.
*   ✅ **Admin-controlled interviews:** Admins select applicants for interviews; HR cannot start candidate interviews from the recruiter workspace.
*   📈 **Approved AI scorecards:** Interview scorecards are held for admin review and only shared with the hiring HR team after approval. Scores are reported out of 100.
*   📝 **Transcript Review:** HR can review the interview transcript and AI feedback after the scorecard is approved.

### For Admins
*   🛡️ **Hiring workflow control:** Monitor job applications, select candidates for interviews, and approve or reject interview scorecards before HR can access them.

---

## 🛠️ Technology Stack

**Frontend:**
*   **React.js (Vite):** Fast, modern UI development.
*   **Tailwind CSS & Framer Motion:** Fluid, responsive, and beautiful animations.
*   **WebRTC & Browser Speech APIs:** Real-time webcam integration, Text-to-Speech (TTS), and Speech-to-Text (STT) capabilities.

**Backend:**
*   **Node.js & Express.js:** Robust routing and API management.
*   **MongoDB & Mongoose:** Scalable NoSQL database for users, jobs, and candidate reviews.
*   **Google Gemini 2.5 Flash API:** LLM powerhouse for dynamic question generation and complex transcript evaluation.
*   **Socket.io:** Signaling server for continuous real-time communication.
*   **JWT & bcrypt:** Secure authentication and authorization patterns.

---

## 🚀 Getting Started

### Prerequisites
*   [Node.js](https://nodejs.org/) (v16+)
*   [MongoDB](https://www.mongodb.com/) (Local or Atlas URI)
*   [Google Gemini API Key](https://aistudio.google.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Hemantx21/SkillCortex.git
   cd SkillCortex
   ```

2. **Setup Environment Variables**
   Create a `.env` file in the `/server` directory:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   GEMINI_API_KEY=your_gemini_api_key
   CLIENT_URL=http://localhost:5173
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=use_a_strong_unique_password
   HR_EMAIL=hr@example.com
   HR_PASSWORD=use_a_strong_unique_password
   ```

### Account access
Candidates and HR users can self-register and sign in immediately. Admin accounts cannot be created through public signup. Set the admin and HR environment variables above, then provision both accounts with `npm run seed:admin` from the `server` directory. The seed script updates these account passwords each time it runs.

3. **Install Dependencies**
   *   **Backend:**
       ```bash
       cd server
       npm install
       ```
   *   **Frontend:**
       ```bash
       cd client
       npm install
       ```

4. **Start the Application**
   *   Start the backend server:
       ```bash
       cd server
       npm run dev
       ```
   *   Start the frontend React app:
       ```bash
       cd client
       npm run dev
       ```

5. **Open in Browser**
   *   Navigate to `http://localhost:5173` to experience SkillCortex.

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! 

## 📝 License
This project is [MIT](LICENSE) licensed.
