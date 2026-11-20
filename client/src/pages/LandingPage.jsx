import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Moon, Sun } from 'lucide-react';
import { Play, ArrowRight, Mic, Video, BrainCircuit, MapPin, ChevronRight, Briefcase, Sparkles, Zap, Shield, Globe, Users, Award } from 'lucide-react';
import { Card, SectionHead, Pill, BtnPrimary, BtnSecondary, ScoreRing, Waveform } from '../components/ui';
import CTABanner from '../components/CTABanner';
import { HeroReveal } from '../components/features/HeroReveal';
import { WordRotator } from '../components/features/WordRotator';
import { ReviewShuffle } from '../components/features/ReviewShuffle';
import { CountUpStats } from '../components/features/CountUpStats';
import { BentoBuild } from '../components/features/BentoBuild';
import ChatWidget from '../components/ChatWidget';
import InterviewRoomPreview from '../components/InterviewRoomPreview';
import ArchitectureDiagram from '../components/ArchitectureDiagram';
import { CursorTour } from '../components/features/CursorTour';
import { ProcessDraw } from '../components/features/ProcessDraw';
import { BeforeAfter } from '../components/features/BeforeAfter';
import { PriceRoll } from '../components/features/PriceRoll';
import { UsVsThem } from '../components/features/UsVsThem';
import { ClickSuccess } from '../components/features/ClickSuccess';
import AIAvatar from '../components/AIAvatar';
import VoiceCloning from '../components/VoiceCloning';
import { FileText, Award as AwardIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { formatSalary } from '../lib/formatSalary';

function RoleCard({ job }) {
  return (
    <motion.div
      whileInView={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4 }}
      className="w-[300px] shrink-0 bg-white border border-[#D9D9D9] rounded-lg p-4 flex flex-col gap-2 hover:shadow-md transition-all group"
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-bold text-[15px] text-[#2557a7] leading-snug group-hover:underline">{job.title}</h4>
        <span className="shrink-0 text-[10px] font-bold text-[#1e8449] bg-[#e8f5e9] px-2 py-0.5 rounded">{String(job.status || 'Open').toUpperCase()}</span>
      </div>
      <p className="text-[13px] text-[#4a4a4a] font-medium">{job.company}</p>
      <div className="flex items-center gap-1 text-[12px] text-[#767676]"><MapPin className="w-3.5 h-3.5" /> {job.location || 'Remote'}</div>
      <div className="text-[12.5px] font-semibold text-[#1e8449]">{formatSalary(job.salary) || 'Competitive'}</div>
      <div className="flex flex-wrap gap-1.5 mt-1">
        {(job.requirements || []).slice(0, 3).map((r, i) => (
          <span key={i} className="text-[11px] bg-[#f3f2f1] text-[#4a4a4a] px-2 py-0.5 rounded">{r}</span>
        ))}
      </div>
      <Link to="/jobs" className="mt-2 text-[12.5px] font-bold text-[#2557a7] flex items-center gap-1 hover:underline">View & apply <ChevronRight className="w-3.5 h-3.5" /></Link>
    </motion.div>
  );
}
function SlidingRoles() {
  const { user } = useAuth();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  useEffect(() => {
    axios.get('/api/jobs')
      .then(({ data }) => {
        if (!Array.isArray(data)) throw new Error('Jobs response was not a list.');
        setRoles(data);
      })
      .catch((error) => {
        console.error('Failed to load posted jobs:', error);
        setLoadError('Could not load posted jobs. Please try again later.');
      })
      .finally(() => setLoading(false));
  }, []);
  if (user?.role === 'hr' || user?.role === 'admin') return null;
  if (loading || (!loadError && roles.length === 0)) return null;
  const looped = [...roles, ...roles, ...roles];
  return (
    <section className="bg-[#F4F2F1] py-14 overflow-hidden">
      <motion.div
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.4 }}
        className="max-w-[1280px] mx-auto px-5 lg:px-8 mb-8 flex flex-wrap items-end justify-between gap-4"
      >
        <div>
          <div className="text-[11px] font-bold tracking-[0.16em] uppercase text-[#2E2C2A] mb-1.5 flex items-center gap-2"><Briefcase className="w-3.5 h-3.5" /> Featured roles</div>
          <h2 className="text-[24px] leading-[30px] font-semibold tracking-tight text-[#2E2C2A]" style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>Jobs posted by hiring teams.</h2>
          <p className="text-[#9E9894] text-[14.5px] mt-1 max-w-lg">Explore current openings and apply with your resume.</p>
        </div>
        <Link to="/jobs" className="inline-flex items-center gap-2 bg-[#2E2C2A] text-white font-bold text-[13.5px] px-5 py-2.5 rounded-full transition-all hover:bg-[#4F4945]">Browse all roles <ArrowRight className="w-4 h-4" /></Link>
      </motion.div>

      {loadError
        ? <p role="alert" className="mx-auto max-w-[1280px] px-5 text-sm text-red-700 lg:px-8">{loadError}</p>
        : <motion.div
          animate={{ x: -280 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="flex w-max gap-6"
          style={{ width: looped.length * 294 }}
        >
          {looped.map((job, index) => (
            <RoleCard key={`${job._id}-${index}`} job={job} />
          ))}
        </motion.div>}
    </section>
  );
}

function AnimatedHero() {
  const { user } = useAuth();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    setMousePos({ x: clientX, y: clientY });
    setOffset({
      x: (clientX / window.innerWidth - 0.5) * 40,
      y: (clientY / window.innerHeight - 0.5) * 40,
    });
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        setOffset(prev => ({ ...prev, x: Math.max(-50, prev.x - 10) }));
      } else if (e.key === 'ArrowRight') {
        setOffset(prev => ({ ...prev, x: Math.min(50, prev.x + 10) }));
      } else if (e.key === 'ArrowUp') {
        setOffset(prev => ({ ...prev, y: Math.max(-50, prev.y - 10) }));
      } else if (e.key === 'ArrowDown') {
        setOffset(prev => ({ ...prev, y: Math.min(50, prev.y + 10) }));
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden py-20 lg:py-32 min-h-[90vh] flex items-center bg-[#F4F2F1]">
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2 }}
        style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
      >
        <img src="/full-width-banner.png" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
      </motion.div>
      <div className="relative z-10 max-w-[1280px] mx-auto px-5 lg:px-8 grid lg:grid-cols-2 gap-10 items-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 bg-white/80 border border-white/40 rounded-full px-4 py-2 mb-6 text-[12.5px] font-semibold text-[#2E2C2A]">
            <Sparkles className="w-4 h-4 text-[#2E2C2A]" /> Adaptive AI interviews
          </div>
          <h1 className="font-semibold tracking-tight text-white text-[40px] leading-[50px]" style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>Your Skills.<br />Your AI.<br />Better Opportunities.</h1>
          <p className="text-[16px] text-white/80 leading-relaxed mt-5 max-w-[480px]">Practice realistic technical interviews, improve your skills with AI-powered feedback, and become interview-ready.</p>
          <div className="flex flex-wrap gap-3 mt-7">
            <button onClick={() => navigate(user?.role === 'hr' ? '/profile?postJob=1' : user?.role === 'admin' ? '/admin' : '/interview-setup')} className="inline-flex items-center gap-2 bg-[#2E2C2A] hover:bg-[#2E2C2A] text-white font-bold text-[15px] px-7 py-3.5 rounded-full">{user?.role === 'hr' ? 'Post a job' : user?.role === 'admin' ? 'Open admin console' : 'Start Your Interview'} <ArrowRight className="w-4 h-4" /></button>
            <button onClick={() => document.getElementById('room')?.scrollIntoView({ behavior: 'smooth' })} className="inline-flex items-center gap-2 bg-white border border-[#E6E2E0] font-semibold px-6 py-3.5 rounded-full text-[15px]"><Play className="w-4 h-4" /> Watch Demo</button>
          </div>
        </motion.div>
        <motion.div id="room" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="ml-4 lg:ml-8">
          <InterviewRoomPreview />
        </motion.div>
      </div>
    </section>
  );
}

function FeatureGrid() {
  return (
    <section className="max-w-[1280px] mx-auto px-5 lg:px-8 py-14">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white border border-[#E6E2E0] rounded-2xl p-6">
          <Zap className="w-6 h-6 text-[#2E2C2A] mb-3" />
          <h3 className="font-bold text-[#2E2C2A]">Adaptive questions</h3>
          <p className="text-[13px] text-[#9E9894] mt-1">Follow-ups tailored to your answers.</p>
        </div>
        <div className="bg-white border border-[#E6E2E0] rounded-2xl p-6">
          <Shield className="w-6 h-6 text-[#2E2C2A] mb-3" />
          <h3 className="font-bold text-[#2E2C2A]">Instant feedback</h3>
          <p className="text-[13px] text-[#9E9894] mt-1">Scores and insights after every session.</p>
        </div>
        <div className="bg-white border border-[#E6E2E0] rounded-2xl p-6">
          <Globe className="w-6 h-6 text-[#2E2C2A] mb-3" />
          <h3 className="font-bold text-[#2E2C2A]">Real-world roles</h3>
          <p className="text-[13px] text-[#9E9894] mt-1">Practice for jobs that matter.</p>
        </div>
      </div>
    </section>
  );
}

function TrustBar() {
  const trustLogos = [
    { name: 'Gemini AI', color: 'bg-[#4285F4]/10 text-[#4285F4]' },
    { name: 'WebRTC', color: 'bg-[#2E2C2A]/10 text-[#2E2C2A]' },
    { name: 'OmniVoice', color: 'bg-[#F4F2F1]/10 text-[#2E2C2A]' },
    { name: 'HeyGem.ai', color: 'bg-[#E6E2E0]/20 text-[#65A30D]' },
    { name: 'MongoDB', color: 'bg-[#4EA94B]/10 text-[#4EA94B]' },
    { name: 'Socket.io', color: 'bg-[#010101]/10 text-[#010101]' },
  ];

  return (
    <section className="bg-[#F4F2F1] py-12 border-y border-[#E6E2E0]">
      <div className="max-w-[1280px] mx-auto px-5 lg:px-8">
        <p className="text-[11px] font-bold tracking-[0.16em] uppercase text-[#9E9894] text-center mb-6">Trusted by modern tech stacks</p>
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          {trustLogos.map((t) => (
            <div key={t.name} className={`text-[11px] font-bold uppercase tracking-wider ${t.color} px-4 py-2 rounded-full border border-current`}>{t.name}</div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FullWidthBanner() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8 }}
      className="relative w-full overflow-hidden"
    >
      <motion.img
        src="/full-width-banner.png"
        alt="SkillCortex full width banner"
        className="w-full h-auto block"
        initial={{ scale: 1.15, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.div
        className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/40 via-transparent to-transparent"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 0.3 }}
      />
    </motion.section>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const primaryTo = user?.role === 'hr' ? '/profile?postJob=1' : user?.role === 'admin' ? '/admin' : '/interview-setup';
  const primaryLabel = user?.role === 'hr' ? 'Post a job' : user?.role === 'admin' ? 'Admin console' : 'Start Your Interview';

  return (
    <div className="min-h-screen transition-colors duration-300 bg-[#F4F2F1] text-[#2E2C2A]">
      <AnimatedHero />
      <FeatureGrid />
      {user?.role !== 'hr' && user?.role !== 'admin' && <SlidingRoles />}
      <CTABanner
        title={user?.role === 'hr' ? 'Ready to find your next candidate?' : user?.role === 'admin' ? 'Manage the hiring pipeline' : 'Ready to practice with AJ?'}
        subtitle={user?.role === 'hr' ? 'Post a role, review applications, and track approved interview scorecards.' : user?.role === 'admin' ? 'Review applications, approve interview candidates, and release scorecards to HR.' : 'Start a mock interview, track your progress, and grow your skills.'}
        primary={primaryLabel}
        primaryTo={primaryTo}
        secondary={user?.role === 'candidate' || !user ? 'Try a technical quiz' : null}
        secondaryTo="/quiz"
      />
      <CountUpStats
        stats={[
          { value: 5000, label: 'Mock interviews', suffix: '+' },
          { value: 92, label: 'Avg. score', suffix: '%' },
          { value: 120, label: 'Skills covered', suffix: '+' },
          { value: 4.8, label: 'Candidate rating', suffix: '/5' },
        ]}
      />
      <BentoBuild
        items={[
          { id: 'resume', title: 'Resume intelligence', cols: 1, rows: 1, desc: 'Parse any resume into a tailored interview profile — extracting skills, projects, experience, and strengths.', icon: <FileText className="w-5 h-5" /> },
          { id: 'mock', title: 'AI mock interviews', cols: 1, rows: 1, desc: 'Practice with AJ Assistant, an adaptive real-time AI interviewer powered by LLMs.', icon: <Mic className="w-5 h-5" />, badge: 'AI-Powered' },
          { id: 'quiz', title: 'Technical quizzes', cols: 1, rows: 1, desc: 'Run timed, anti-cheat quizzes across React, Node, Python, Java, SQL and more.', icon: <BrainCircuit className="w-5 h-5" /> },
          { id: 'points', title: 'Skill Points', cols: 2, rows: 1, desc: 'Earn Skill Points for every interview and quiz, and redeem them for premium challenges and masterclasses.', icon: <AwardIcon className="w-5 h-5" /> },
        ]}
      />
      <hr className="max-w-[1280px] mx-auto border-t-2 border-[#E6E2E0] my-4" />
      <ProcessDraw
        steps={[
          { title: 'Upload resume', desc: 'Parse your background into a profile.' },
          { title: 'Pick a role', desc: 'Choose the role you are preparing for.' },
          { title: 'Mock interview', desc: 'Run a live session with AJ Assistant.' },
          { title: 'Get feedback', desc: 'Review transcripts, scores, and next steps.' },
        ]}
      />
      <ArchitectureDiagram />
      <ReviewShuffle />
      <PriceRoll />
      <UsVsThem />
      <div className="text-center py-16">
        <ClickSuccess onClick={() => navigate(primaryTo)} className="bg-[#2E2C2A] text-white px-8 py-3 rounded-full text-[15px] font-bold">
          {primaryLabel}
        </ClickSuccess>
      </div>
      <ChatWidget />
    </div>
  );
}
