import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Clock3, Code2, Search, Sparkles } from 'lucide-react';
import { Card, Pill, BtnGreen } from '../../components/ui';
import Choice from './Choice';
import { useAuth } from '../../context/AuthContext';
import useTabSwitchLimit from '../../hooks/useTabSwitchLimit';

const STACKS = [
  'Angular', 'Ansible', 'Apache Kafka', 'ASP.NET', 'AWS', 'Azure',
  'Bash', 'Blockchain', 'Bootstrap', 'C', 'C#', 'C++', 'Cassandra',
  'Clojure', 'CSS', 'Dart', 'Data Structures & Algorithms', 'Django',
  'Docker', 'Elasticsearch', 'Elixir', 'Express.js', 'FastAPI', 'Firebase',
  'Flask', 'Flutter', 'F#', 'Gatsby', 'Git', 'Go', 'Google Cloud',
  'GraphQL', 'gRPC', 'Haskell', 'HTML', 'Hugging Face', 'Java', 'JavaScript',
  'Jenkins', 'Julia', 'Keras', 'Kotlin', 'Kubernetes', 'Laravel', 'Linux',
  'Lua', 'MATLAB', 'Microservices', 'MongoDB', 'MySQL', 'NestJS', 'Next.js',
  'Node.js', 'NumPy', 'Nuxt.js', 'OpenCV', 'Oracle', 'Pandas', 'Perl',
  'PHP', 'PostgreSQL', 'Prometheus', 'PyTorch', 'Python', 'R', 'RabbitMQ',
  'React Native', 'React.js', 'Redis', 'Remix', 'REST APIs', 'Ruby',
  'Ruby on Rails', 'Rust', 'Scala', 'Scikit-learn', 'Socket.io', 'Solidity',
  'Spring Boot', 'SQL', 'SQLite', 'Svelte', 'Swift', 'System Design',
  'Tailwind CSS', 'TensorFlow', 'Terraform', 'TypeScript', 'Vue.js',
  'Webpack', 'Web3',
];
const FALLBACK = [
  { question: 'What is the purpose of the useEffect hook in React?', options: ['To manage side effects after render', 'To create a new component', 'To handle routing', 'To style components'], answerIndex: 0, diff: 'Medium', cat: 'Hooks' },
  { question: 'Keys in lists help React toâ€¦', options: ['Identify changed items efficiently', 'Encrypt state', 'Style items uniquely', 'Fetch data faster'], answerIndex: 0, diff: 'Easy', cat: 'Rendering' },
  { question: 'What does useMemo optimise?', options: ['Network retries', 'Expensive recalculations across renders', 'CSS size', 'Server latency'], answerIndex: 1, diff: 'Medium', cat: 'Performance' },
  { question: 'Which avoids prop drilling?', options: ['More useState calls', 'Inline styles', 'Context + composition', 'Larger bundle'], answerIndex: 2, diff: 'Easy', cat: 'Architecture' },
  { question: 'Suspense is primarily forâ€¦', options: ['Error logging', 'Declarative async UI fallbacks', 'Form validation', 'Animation timing'], answerIndex: 1, diff: 'Hard', cat: 'Async UI' },
  { question: 'What is the virtual DOM in React?', options: ['A database of components', 'A styling engine', 'A routing mechanism', 'A lightweight copy of the actual DOM'], answerIndex: 3, diff: 'Easy', cat: 'Core' },
  { question: 'Which hook is used for state management?', options: ['useEffect', 'useMemo', 'useState', 'useCallback'], answerIndex: 2, diff: 'Easy', cat: 'Hooks' },
  { question: 'What does JSX stand for?', options: ['Java Syntax Extension', 'JSON XML', 'JavaScript XML', 'Just Style XML'], answerIndex: 2, diff: 'Easy', cat: 'Core' },
  { question: 'Which method updates state in class components?', options: ['updateState', 'changeState', 'modifyState', 'setState'], answerIndex: 3, diff: 'Medium', cat: 'State' },
  { question: 'What is the purpose of keys in React lists?', options: ['To style list items', 'To sort items', 'To filter items', 'To identify which items changed'], answerIndex: 3, diff: 'Easy', cat: 'Rendering' },
];
export default function QuizBody() {
  const nav = useNavigate();
  const { token } = useAuth();
  const [stack, setStack] = useState('React.js');
  const [step, setStep] = useState('pick');
  const [qs, setQs] = useState(FALLBACK);
  const [idx, setIdx] = useState(0);
  const [sel, setSel] = useState(null);
  const [lock, setLock] = useState(false);
  const [score, setScore] = useState(0);
  const [secs, setSecs] = useState(600);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [authRequired, setAuthRequired] = useState(false);
  const { switchCount: tabSwitchCount, reset: resetTabSwitchCount } = useTabSwitchLimit(step === 'quiz', () => setStep('result'));
  useEffect(() => {
    if (step !== 'quiz') return;
    const t = setInterval(() => setSecs((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [step]);
  const start = async (s) => {
    setError(''); setAuthRequired(false);
    resetTabSwitchCount();
    if (!token) {
      setError('Sign in to generate a quiz.');
      setAuthRequired(true);
      return;
    }
    setStack(s); setStep('loading');
    try {
      const r = await axios.post('/api/quiz/generate', { topic: s });
      const raw = r.data?.questions;
      if (!raw || !raw.length) throw new Error('No questions returned');
      // Shuffle options so correct answer is not always at index 0
      const shuffled = raw.map(q => {
        const opts = [...(q.options || q.opts || [])];
        const correctIdx = q.answerIndex ?? q.answer ?? 0;
        const indices = opts.map((_, i) => i);
        for (let i = indices.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [indices[i], indices[j]] = [indices[j], indices[i]];
        }
        const newOpts = indices.map(i => opts[i]);
        const newCorrect = indices.indexOf(correctIdx);
        return { ...q, options: newOpts, answerIndex: newCorrect >= 0 ? newCorrect : 0 };
      });
      if (!shuffled.length) throw new Error('No valid questions returned');
      setQs(shuffled);
    } catch (e) {
      console.error(e);
      const unauthorized = e.response?.status === 401;
      setAuthRequired(unauthorized);
      setError(unauthorized ? 'Your session has expired. Sign in again to continue.' : e.response?.data?.message || `Could not generate a ${s} quiz. Please try again.`);
      setStep('pick');
      return;
    }
    setIdx(0); setSel(null); setLock(false); setScore(0); setSecs(600);
    setStep('quiz');
  };
  const q = qs[idx] || FALLBACK[0];
  const opts = q.options || q.opts || [];
  const correct = q.answerIndex ?? q.answer ?? Math.floor(Math.random() * opts.length);
  const mm = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`;
  const filteredStacks = STACKS.filter((s) => s.toLowerCase().includes(search.trim().toLowerCase()));
  if (step === 'result') {
    return (
      <div className="bg-[#F4F2F1] min-h-screen flex items-center justify-center px-5 pb-20">
        <Card className="p-8 max-w-[460px] w-full text-center">
          <h1 className="text-[26px] font-extrabold">Assessment complete</h1>
          {tabSwitchCount >= 3 && <p role="alert" className="mt-3 text-sm font-medium text-red-700">Assessment ended because you switched away from the quiz 3 times.</p>}
          <div className="text-[52px] font-black tabular">{score}<span className="text-[#D8D5E0]">/{qs.length}</span></div>
          {tabSwitchCount < 3 && <div className="text-[13px] font-bold text-[#3B32B0]">+{score * 50} Skill Points earned</div>}
          <div className="flex gap-2.5 mt-6">
            <button onClick={() => setStep('pick')} className="flex-1 py-3 border border-[#E6E2E0] rounded-xl font-bold text-[14px]">New stack</button>
            <button onClick={() => nav('/profile')} className="flex-1 py-3 bg-[#2E2C2A] text-white rounded-xl font-bold text-[14px]">View DNA</button>
          </div>
        </Card>
      </div>
    );
  }
  return (
    <div className="bg-[#F4F2F1] min-h-screen pb-20">
      <div className="max-w-[1080px] mx-auto px-5 py-10 md:py-14">
        {step !== 'quiz' ? (
          <div>
            <header className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#E6E2E0] bg-white px-3 py-1.5 text-xs font-semibold text-[#6B6561]">
                  <Sparkles className="size-3.5 text-[#E35013]" /> Adaptive technical assessment
                </div>
                <h1 className="text-3xl font-semibold tracking-tight text-[#2E2C2A] sm:text-4xl">Build your skills, one quiz at a time.</h1>
                <p className="mt-2 max-w-2xl text-base leading-relaxed text-[#817B77]">Choose a technology to get a focused 10-question assessment with instant feedback.</p>
              </div>
              <div className="flex shrink-0 items-center gap-3 text-sm text-[#6B6561]">
                <span className="flex size-10 items-center justify-center rounded-xl bg-[#FBE9E1] text-[#C94410]"><Clock3 className="size-5" /></span>
                <span><strong className="block font-semibold text-[#2E2C2A]">10 minutes</strong>per assessment</span>
              </div>
            </header>

            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <label className="relative block w-full sm:max-w-md">
                <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#9E9894]" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search technologies..."
                  aria-label="Search technologies"
                  className="h-12 w-full rounded-xl border border-[#E6E2E0] bg-white pl-11 pr-4 text-sm text-[#2E2C2A] outline-none transition focus:border-[#E35013] focus:ring-2 focus:ring-[#E35013]/15"
                />
              </label>
              <p className="text-sm font-medium text-[#817B77]" aria-live="polite">
                <span className="font-semibold text-[#2E2C2A]">{filteredStacks.length}</span> {filteredStacks.length === 1 ? 'technology' : 'technologies'} available
              </p>
            </div>

            {error && (
              <div role="alert" className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                <span>{error}</span>
                {authRequired && <Link to="/login" className="font-semibold text-[#A9320C] underline underline-offset-2">Sign in</Link>}
              </div>
            )}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredStacks.map((s) => (
                <motion.button
                  key={s}
                  type="button"
                  onClick={() => start(s)}
                  whileHover={{ y: -3, transition: { duration: 0.16 } }}
                  whileTap={{ scale: 0.985 }}
                  className="group flex min-h-[112px] items-center gap-3 rounded-xl border border-[#E6E2E0] bg-white p-4 text-left shadow-[0_1px_2px_rgba(46,44,42,0.04)] transition-[border-color,box-shadow,background-color] duration-200 hover:border-[#E35013]/45 hover:bg-[#FFFCFA] hover:shadow-[0_10px_24px_-14px_rgba(46,44,42,0.28)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E35013]"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#F4F2F1] text-[#4F4945] transition-colors group-hover:bg-[#FBE9E1] group-hover:text-[#C94410]">
                    <Code2 className="size-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[15px] font-semibold text-[#2E2C2A]">{s}</span>
                    <span className="mt-1 flex items-center gap-1.5 text-xs text-[#817B77]"><Clock3 className="size-3.5" /> 10 questions · 10 min</span>
                  </span>
                  <ArrowRight className="size-4 shrink-0 text-[#B5AFAB] transition-all group-hover:translate-x-0.5 group-hover:text-[#E35013]" />
                </motion.button>
              ))}
            </div>
            {filteredStacks.length === 0 && <div className="mt-6 rounded-xl border border-dashed border-[#D8D2CE] bg-white/70 px-5 py-10 text-center text-sm text-[#817B77]">No technologies match your search. Try another keyword.</div>}
            {step === 'loading' && <div role="status" className="fixed inset-x-0 bottom-5 z-40 mx-auto flex w-fit items-center gap-3 rounded-full border border-[#E6E2E0] bg-white px-5 py-3 text-sm font-semibold text-[#4F4945] shadow-lg"><span className="size-4 animate-spin rounded-full border-2 border-[#E35013]/25 border-t-[#E35013]" />Generating your adaptive questions...</div>}
          </div>
        ) : (
          <Card className="p-6 md:p-8">
            <div className="flex flex-wrap justify-between gap-3 items-center">
              <div><div className="text-[12px] font-bold text-[#2E2C2A] uppercase tracking-wider">{stack} Skill Assessment</div>
              <div className="text-[13px] text-[#9E9894]">Question {idx + 1} of {qs.length} Â· {q.diff || 'Medium'} Â· {q.cat || 'Core'}</div></div>
              <Pill tone="blue"><span className="tabular">{mm}</span></Pill>
            </div>
            {tabSwitchCount > 0 && <p role="alert" className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm font-medium text-amber-900">You have switched away from the quiz {tabSwitchCount} of 3 times. The assessment ends after 3 switches.</p>}
            <div className="h-[8px] bg-[#F4F2F1] rounded-full mt-4 overflow-hidden"><div className="h-full bg-[#2E2C2A] rounded-full" style={{ width: `${((idx + (lock ? 1 : 0)) / qs.length) * 100}%` }} /></div>
            <h2 className="text-[20px] font-extrabold leading-snug mt-5">{q.question || q.q}</h2>
            <div className="space-y-2.5 mt-5">
              {opts.map((o, i) => (<Choice key={i} i={i} o={o} sel={sel} lock={lock} correct={correct} setSel={setSel} />))}
            </div>
            <div className="flex gap-3 mt-6">
              {!lock
                ? <BtnGreen className="flex-1" disabled={sel === null} onClick={() => { if (sel !== null) { setLock(true); if (sel === correct) setScore((v) => v + 1); } }}>Submit answer</BtnGreen>
                : <BtnGreen className="flex-1" onClick={() => { if (idx < qs.length - 1) { setIdx(idx + 1); setSel(null); setLock(false); } else setStep('result'); }}>{idx < qs.length - 1 ? 'Next question' : 'View results'}</BtnGreen>}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
