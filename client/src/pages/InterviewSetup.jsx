import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion as Motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, BriefcaseBusiness, Clock3, Layers3, Code2, Server, Workflow, Check, Sparkles, Upload, FileText, Loader2, CheckCircle2 } from 'lucide-react';
import useTabSwitchLimit from '../hooks/useTabSwitchLimit';
import { useAuth } from '../context/AuthContext';

const ROLES = [
  { id: 'frontend', name: 'Frontend Developer', stack: 'React / JavaScript / CSS', topic: 'React.js', mins: 30, qs: 12, Icon: Code2 },
  { id: 'backend', name: 'Backend Developer', stack: 'Node.js / SQL / APIs', topic: 'Node.js', mins: 25, qs: 8, Icon: Server },
  { id: 'fullstack', name: 'Full Stack Developer', stack: 'React + Node / System Design', topic: 'JavaScript', mins: 45, qs: 14, Icon: Workflow },
  { id: 'java', name: 'Java Developer', stack: 'Java / Spring / DSA', topic: 'Java', mins: 30, qs: 10, Icon: BriefcaseBusiness },
];

const panelClass = 'rounded-xl border border-[#E6E2E0] bg-white p-5 sm:p-6';

export default function InterviewSetup() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();
  const [role, setRole] = useState(location.state?.track || 'fullstack');
  const [level, setLevel] = useState(location.state?.level || 'Intermediate');
  const [stage, setStage] = useState('setup');
  const [resume, setResume] = useState(location.state?.resume || '');
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [generatingQuiz, setGeneratingQuiz] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [tabSwitchTerminated, setTabSwitchTerminated] = useState(false);
  const selectedRole = ROLES.find((item) => item.id === role) || ROLES[2];
  const quizTopic = location.state?.job?.title || selectedRole.topic;
  const currentQuestion = questions[questionIndex];
  useEffect(() => {
    if (authLoading || !user || user.role === 'candidate') return;
    navigate(user.role === 'hr' ? '/profile' : '/admin', { replace: true });
  }, [authLoading, user, navigate]);
  const { switchCount: tabSwitchCount, reset: resetTabSwitchCount } = useTabSwitchLimit(stage === 'quiz', () => {
    setTabSwitchTerminated(true);
    setStage('result');
  });

  const handleResumeFile = async (file) => {
    if (!file) return;
    if (!/\.(pdf|docx|txt)$/i.test(file.name)) {
      setError('Upload a PDF, DOCX, or TXT resume.');
      return;
    }

    setError('');
    setUploading(true);
    const formData = new FormData();
    formData.append('resume', file);
    try {
      const response = await axios.post('/api/upload/resume', formData);
      if (!response.data?.text?.trim()) throw new Error('No readable resume text was found. Paste your resume text instead.');
      setResume(response.data.text);
    } catch (uploadError) {
      setError(uploadError.response?.data?.message || uploadError.message || 'Could not read the resume.');
    } finally {
      setUploading(false);
    }
  };

  const generateQuiz = async () => {
    if (resume.trim().length < 20) {
      setError('Add at least 20 characters of resume text before continuing.');
      return;
    }
    setError('');
    resetTabSwitchCount();
    setGeneratingQuiz(true);
    try {
      const response = await axios.post('/api/quiz/generate', { topic: quizTopic });
      if (!Array.isArray(response.data?.questions) || response.data.questions.length !== 10) {
        throw new Error('The quiz service returned an incomplete quiz. Please try again.');
      }
      setQuestions(response.data.questions);
      setAnswers(Array(10).fill(null));
      setQuestionIndex(0);
      setSelectedAnswer(null);
      setTabSwitchTerminated(false);
      setStage('quiz');
    } catch (quizError) {
      setError(quizError.response?.data?.message || quizError.message || 'Could not prepare your quiz. Please try again.');
    } finally {
      setGeneratingQuiz(false);
    }
  };

  const submitQuizAnswer = () => {
    const updatedAnswers = [...answers];
    updatedAnswers[questionIndex] = selectedAnswer;
    setAnswers(updatedAnswers);
    if (questionIndex < questions.length - 1) {
      setQuestionIndex((index) => index + 1);
      return;
    }
    setQuizScore(updatedAnswers.reduce((total, answer, index) => total + (answer === questions[index].answerIndex ? 1 : 0), 0));
    setStage('result');
  };

  const startInterview = () => {
    if (tabSwitchTerminated) return;
    const job = location.state?.job || {
      title: selectedRole.name,
      requirements: selectedRole.stack.split('/').map((item) => item.trim()),
    };
    navigate('/interview', {
      state: { job, resume: resume.trim(), track: role, level, quizScore, applicationId: location.state?.applicationId },
    });
  };

  const goBack = () => {
    setError('');
    if (stage === 'setup') navigate(-1);
    else setStage(({ resume: 'setup', quiz: 'resume', result: 'quiz' })[stage] || 'setup');
  };

  return (
    <div className="min-h-screen bg-[#F4F2F1] pb-24">
      <div className="mx-auto max-w-[1120px] px-5 py-8 sm:py-12">
        <button type="button" onClick={goBack} className="mb-6 inline-flex min-h-10 items-center gap-2 rounded-lg px-2 text-sm font-semibold text-[#6B6561] transition-colors hover:bg-white hover:text-[#2E2C2A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E35013]"><ArrowLeft className="size-4" />Back</button>

        {stage === 'setup' && (
          <>
            <Motion.header initial={{ y: 12 }} animate={{ y: 0 }} className="mb-8 max-w-3xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#E6E2E0] bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-[0.1em] text-[#6B6561]"><Sparkles className="size-3.5 text-[#E35013]" />Interview setup / 01</div>
              <h1 className="text-3xl font-semibold leading-tight tracking-tight text-[#2E2C2A] sm:text-4xl">Set the direction. Own the conversation.</h1>
              <p className="mt-3 text-base leading-relaxed text-[#6B6561]">Choose a role and difficulty. Next, add your resume and complete a short technical quiz before your AI interview.</p>
            </Motion.header>

            <div className="grid items-start gap-5 lg:grid-cols-[1.35fr_0.65fr]">
              <div className="space-y-5">
                <section aria-labelledby="track-heading">
                  <div className="mb-3"><p className="text-xs font-bold uppercase tracking-[0.12em] text-[#E35013]">01 / Select a track</p><h2 id="track-heading" className="mt-1 text-xl font-semibold text-[#2E2C2A]">What role are you preparing for?</h2></div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {ROLES.map((item) => {
                      const selected = role === item.id;
                      return (
                        <button key={item.id} type="button" aria-pressed={selected} onClick={() => setRole(item.id)} className={`min-h-[170px] rounded-xl border p-4 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E35013] ${selected ? 'border-[#2E2C2A] bg-[#2E2C2A] text-white' : 'border-[#E6E2E0] bg-white text-[#2E2C2A] hover:border-[#C8BEB7]'}`}>
                          <span className="flex items-start justify-between"><span className="flex size-11 items-center justify-center rounded-lg bg-white/10"><item.Icon className="size-5" /></span>{selected && <CheckCircle2 className="size-5 text-[#F3A17D]" />}</span>
                          <span className="mt-4 block font-semibold">{item.name}</span>
                          <span className={`mt-1 block text-sm ${selected ? 'text-white/65' : 'text-[#817B77]'}`}>{item.stack}</span>
                          <span className={`mt-3 flex items-center gap-1.5 text-xs ${selected ? 'text-white/75' : 'text-[#817B77]'}`}><Clock3 className="size-3.5" />{item.mins} min interview</span>
                        </button>
                      );
                    })}
                  </div>
                </section>
                <section aria-labelledby="difficulty-heading" className={panelClass}>
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#E35013]">02 / Choose a level</p>
                  <h2 id="difficulty-heading" className="mb-4 mt-1 text-lg font-semibold text-[#2E2C2A]">Set your difficulty</h2>
                  <div role="group" aria-label="Interview difficulty" className="grid grid-cols-3 gap-2">
                    {['Beginner', 'Intermediate', 'Advanced'].map((item) => <button key={item} type="button" aria-pressed={level === item} onClick={() => setLevel(item)} className={`min-h-11 rounded-lg border px-2 text-sm font-semibold ${level === item ? 'border-[#2E2C2A] bg-[#2E2C2A] text-white' : 'border-[#E6E2E0] bg-white text-[#6B6561]'}`}>{item}</button>)}
                  </div>
                </section>
              </div>

              <Motion.aside className="lg:sticky lg:top-24">
                <div className="overflow-hidden rounded-xl border border-[#E6E2E0] bg-white">
                  <div className="border-b border-[#E6E2E0] px-5 py-4"><p className="text-xs font-bold uppercase tracking-[0.12em] text-[#E35013]">Your session</p><h2 className="mt-1 text-lg font-semibold text-[#2E2C2A]">{location.state?.job?.title || selectedRole.name}</h2></div>
                  <div className="p-5">
                    <p className="text-sm text-[#817B77]">{selectedRole.stack}</p>
                    <div className="my-4 grid grid-cols-2 gap-3">
                      <div className="rounded-lg border border-[#E6E2E0] p-3"><div className="text-xs text-[#817B77]">Difficulty</div><div className="mt-1 font-semibold text-[#2E2C2A]">{level}</div></div>
                      <div className="rounded-lg border border-[#E6E2E0] p-3"><div className="text-xs text-[#817B77]">Quiz</div><div className="mt-1 font-semibold text-[#2E2C2A]">10 questions</div></div>
                    </div>
                    <button type="button" onClick={() => { setError(''); setStage('resume'); }} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#E35013] px-4 py-3 text-base font-semibold text-white hover:bg-[#C94410]">Add resume and continue <ArrowRight className="size-4" /></button>
                  </div>
                </div>
              </Motion.aside>
            </div>
          </>
        )}

        {stage === 'resume' && (
          <section className={`${panelClass} mx-auto max-w-2xl`}>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#E35013]">Interview setup / 02</p>
            <h1 className="mt-1 text-2xl font-semibold text-[#2E2C2A]">Add your resume</h1>
            <p className="mt-2 text-sm leading-relaxed text-[#817B77]">The AI interviewer uses your experience to ask relevant questions. Upload a PDF, DOCX, or TXT file, or paste your resume below.</p>
            <label className="mt-5 flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[#D8D2CE] bg-[#FAF9F8] p-4 text-center hover:border-[#E35013]">
              <input type="file" accept=".pdf,.docx,.txt" className="sr-only" onChange={(event) => { handleResumeFile(event.target.files?.[0]); event.target.value = ''; }} />
              {uploading ? <Loader2 className="size-5 animate-spin text-[#E35013]" /> : <Upload className="size-5 text-[#E35013]" />}
              <span className="text-sm font-semibold text-[#4F4945]">{uploading ? 'Reading resume...' : 'Upload your resume'}</span>
              <span className="text-xs text-[#817B77]">PDF, DOCX, or TXT</span>
            </label>
            <label htmlFor="interview-resume" className="mb-2 mt-5 block text-sm font-semibold text-[#4F4945]"><FileText className="mr-1 inline size-4" />Resume text</label>
            <textarea id="interview-resume" value={resume} onChange={(event) => setResume(event.target.value)} rows={9} placeholder="Paste your resume text here (at least 20 characters)..." className="w-full rounded-lg border border-[#D8D2CE] bg-white p-3.5 text-sm leading-relaxed outline-none focus:border-[#E35013] focus:ring-2 focus:ring-[#E35013]/15" />
            {error && <div role="alert" className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
            <button type="button" disabled={uploading || generatingQuiz || resume.trim().length < 20} onClick={generateQuiz} className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#E35013] px-4 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">
              {generatingQuiz ? <><Loader2 className="size-4 animate-spin" />Preparing your quiz...</> : <>Continue to technical quiz <ArrowRight className="size-4" /></>}
            </button>
          </section>
        )}

        {stage === 'quiz' && currentQuestion && (
          <section className={`${panelClass} mx-auto max-w-2xl`}>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#E35013]">Interview setup / 03 · {quizTopic}</p>
            <div className="mt-2 flex items-center justify-between gap-3"><h1 className="text-2xl font-semibold text-[#2E2C2A]">Technical readiness quiz</h1><span className="text-sm font-semibold text-[#817B77]">{questionIndex + 1} / {questions.length}</span></div>
            {tabSwitchCount > 0 && <p role="alert" className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm font-medium text-amber-900">You have switched away from the quiz {tabSwitchCount} of 3 times. The interview ends after 3 switches.</p>}
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#F0EDEA]"><div className="h-full rounded-full bg-[#E35013]" style={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }} /></div>
            <h2 className="mt-6 text-lg font-semibold leading-relaxed text-[#2E2C2A]">{currentQuestion.question}</h2>
            <div className="mt-4 space-y-2">
              {currentQuestion.options.map((option, index) => <button key={`${index}-${option}`} type="button" aria-pressed={selectedAnswer === index} onClick={() => setSelectedAnswer(index)} className={`w-full rounded-lg border p-3 text-left text-sm ${selectedAnswer === index ? 'border-[#2E2C2A] bg-[#2E2C2A] text-white' : 'border-[#E6E2E0] bg-white text-[#4F4945] hover:border-[#BDB5B0]'}`}>{option}</button>)}
            </div>
            {error && <div role="alert" className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
            <button type="button" disabled={selectedAnswer === null} onClick={() => { setError(''); submitQuizAnswer(); setSelectedAnswer(null); }} className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#E35013] px-4 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">{questionIndex === questions.length - 1 ? 'Finish quiz' : 'Submit and continue'} <ArrowRight className="size-4" /></button>
          </section>
        )}

        {stage === 'result' && (
          <section className={`${panelClass} mx-auto max-w-xl text-center`}>
            <span className="mx-auto flex size-12 items-center justify-center rounded-xl bg-[#FBE9E1] text-[#C94410]"><CheckCircle2 className="size-6" /></span>
            <p className="mt-4 text-xs font-bold uppercase tracking-[0.12em] text-[#E35013]">{tabSwitchTerminated ? 'Assessment ended' : 'Quiz complete'}</p>
            <h1 className="mt-1 text-2xl font-semibold text-[#2E2C2A]">{tabSwitchTerminated ? 'Interview ended after 3 tab switches' : `You scored ${quizScore} / ${questions.length}`}</h1>
            {!tabSwitchTerminated && <p className="mt-2 text-sm text-[#817B77]">Your AI interview is ready. The interviewer will use your resume and selected role to tailor its questions.</p>}
            {error && <div role="alert" className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
            {tabSwitchTerminated
              ? <button type="button" onClick={() => navigate('/')} className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#2E2C2A] px-4 py-3 font-semibold text-white">Finish</button>
              : <button type="button" onClick={startInterview} className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#E35013] px-4 py-3 font-semibold text-white hover:bg-[#C94410]">Start AI interview <ArrowRight className="size-4" /></button>}
          </section>
        )}
      </div>
    </div>
  );
}
