﻿import { createElement, useRef, useState } from 'react';
import axios from 'axios';
import { motion as Motion } from 'framer-motion';
import { Upload, FileText, CheckCircle2, Sparkles, ArrowRight, Loader2, ShieldCheck, BriefcaseBusiness, GraduationCap, Code2, FileCheck2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, Pill, BtnGreen } from '../components/ui';

function asList(v) {
  if (Array.isArray(v)) return v.map((x) => (typeof x === 'string' ? x : JSON.stringify(x))).filter(Boolean);
  if (typeof v === 'string') return v.split(/[,;\n]/).map((s) => s.trim()).filter(Boolean);
  return [];
}
function asText(v) {
  if (Array.isArray(v)) return v.join(', ');
  if (typeof v === 'string') return v;
  if (v == null) return '';
  return String(v);
}

export default function Resume() {
  const fileInput = useRef(null);
  const [text, setText] = useState('');
  const [profile, setProfile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [parseError, setParseError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const nav = useNavigate();

  const analyze = async (sourceText) => {
    const t = (sourceText ?? text).trim();
    if (t.length < 20) return;
    setParsing(true);
    setParseError('');
    try {
      const r = await axios.post('/api/upload/parse', { text: t });
      const p = r.data?.profile;
      if (p && typeof p === 'object') setProfile(p);
      else setParseError('Could not extract a structured profile. Try again.');
    } catch (err) {
      console.error('Resume analyze failed:', err);
      setParseError(err.response?.data?.message || 'Analysis failed. Please try again.');
    } finally {
      setParsing(false);
    }
  };

  const onFile = async (f) => {
    if (!f) return;
    const supported = /\.(pdf|docx|txt|csv)$/i.test(f.name);
    if (!supported) {
      setParseError('Choose a PDF, DOCX, TXT, or CSV file.');
      return;
    }
    setBusy(true);
    setProfile(null);
    setParseError('');
    const fd = new FormData();
    fd.append('resume', f);
    try {
      const r = await axios.post('/api/upload/resume', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      const extracted = r.data?.text;
      if (extracted && extracted.trim()) {
        setText(extracted);
        await analyze(extracted);
      } else {
        setText(r.data?.message || 'No readable text found - paste your resume text below.');
      }
    } catch (err) {
      console.error('Resume parse failed:', err);
      const serverMsg = err.response?.data?.message;
      setText(serverMsg || (err.response?.status
        ? `Server error ${err.response.status}: ${err.response?.data?.error || err.message}`
        : "Network error - the API server isn't responding. Check that the backend (port 3001) is running, then try again."));
    } finally {
      setBusy(false);
    }
  };

  const skills = asList(profile?.skills);
  const projects = asList(profile?.projects);
  const strengths = asList(profile?.strengths);
  const experience = asText(profile?.experience);
  const education = asText(profile?.education);
  const done = !!profile;
  const analysisSteps = [
    { label: 'Technical skills', Icon: Code2 },
    { label: 'Experience & education', Icon: BriefcaseBusiness },
    { label: 'Projects & strengths', Icon: GraduationCap },
  ];

  return (
    <div className="min-h-screen bg-[#F4F2F1] pb-24">
      <div className="mx-auto max-w-[1180px] px-5 py-8 sm:py-12">
        <Motion.header initial={{ y: 12 }} animate={{ y: 0 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} className="mb-8 flex flex-col gap-6 border-b border-[#DEDAD7] pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#E6E2E0] bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-[0.1em] text-[#6B6561]"><Sparkles className="size-3.5 text-[#E35013]" /> Resume intelligence</div>
            <h1 className="text-3xl font-semibold leading-tight tracking-tight text-[#2E2C2A] sm:text-4xl">Turn your experience into an interview advantage.</h1>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-[#6B6561]">Build a concise profile from your resume so your AI interviewer can focus on the work you’ve actually done.</p>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-[#E6E2E0] bg-white px-4 py-3 text-sm text-[#6B6561]">
            <ShieldCheck className="size-5 shrink-0 text-[#4F4945]" />
            <span><strong className="block text-[#2E2C2A]">Interview context</strong>Used to prepare your session</span>
          </div>
        </Motion.header>

        <div className="grid items-start gap-5 lg:grid-cols-[0.92fr_1.08fr]">
          <Motion.section initial={{ y: 16 }} animate={{ y: 0 }} transition={{ duration: 0.42, delay: 0.06, ease: [0.22, 1, 0.36, 1] }} aria-labelledby="resume-input-title" className="rounded-xl border border-[#E6E2E0] bg-white p-5 shadow-[0_8px_24px_-18px_rgba(46,44,42,0.28)] sm:p-6">
            <div className="mb-5">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#E35013]">01 / Add your resume</p>
              <h2 id="resume-input-title" className="mt-1 text-xl font-semibold text-[#2E2C2A]">Start with your experience</h2>
            </div>

            <Motion.label
              whileHover={{ y: -2 }}
              onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }}
              onDragLeave={(event) => { event.preventDefault(); setIsDragging(false); }}
              onDrop={(event) => { event.preventDefault(); setIsDragging(false); onFile(event.dataTransfer.files?.[0]); }}
              className={`group flex min-h-[210px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-5 py-7 text-center transition-colors ${isDragging ? 'border-[#E35013] bg-[#FFF4EE]' : 'border-[#D8D2CE] bg-[#FAF9F8] hover:border-[#E35013] hover:bg-[#FFFCFA]'} ${busy ? 'pointer-events-none opacity-70' : ''}`}
            >
              <input ref={fileInput} type="file" className="sr-only" accept=".pdf,.docx,.txt,.csv" onChange={(event) => { onFile(event.target.files?.[0]); event.target.value = ''; }} />
              <span className={`mb-4 flex size-14 items-center justify-center rounded-xl transition-colors ${isDragging ? 'bg-[#E35013] text-white' : 'bg-[#FBE9E1] text-[#C94410] group-hover:bg-[#E35013] group-hover:text-white'}`}>
                {busy ? <Loader2 className="size-6 animate-spin" /> : <Upload className="size-6" />}
              </span>
              <span className="text-base font-semibold text-[#2E2C2A]">{busy ? 'Reading your document...' : isDragging ? 'Drop to add your resume' : 'Drop your resume here'}</span>
              <span className="mt-1 text-sm text-[#817B77]">or <span className="font-semibold text-[#C94410] underline underline-offset-2">browse files</span></span>
              <span className="mt-4 text-xs font-medium text-[#817B77]">PDF, DOCX, TXT, or CSV</span>
            </Motion.label>

            {(busy || parsing) && (
              <div role="status" className="mt-4 overflow-hidden rounded-lg border border-[#E6E2E0] bg-[#FAF9F8] p-3.5">
                <div className="mb-2 flex items-center justify-between gap-3 text-sm"><span className="flex items-center gap-2 font-semibold text-[#4F4945]"><Loader2 className="size-4 animate-spin text-[#E35013]" />{busy ? 'Extracting document text' : 'Building your interview profile'}</span><span className="text-xs text-[#817B77]">Working</span></div>
                <div className="h-1.5 overflow-hidden rounded-full bg-[#E6E2E0]"><Motion.div className="h-full w-1/3 rounded-full bg-[#E35013]" animate={{ x: ['0%', '190%', '0%'] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }} /></div>
              </div>
            )}

            <div className="my-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.1em] text-[#9E9894]"><span className="h-px flex-1 bg-[#E6E2E0]" />or paste text<span className="h-px flex-1 bg-[#E6E2E0]" /></div>
            <label htmlFor="resume-text" className="mb-2 block text-sm font-semibold text-[#4F4945]">Resume text</label>
            <textarea id="resume-text" value={text} onChange={(event) => setText(event.target.value)} placeholder="Paste your resume text here..." className="min-h-[150px] w-full resize-y rounded-lg border border-[#D8D2CE] bg-white p-3.5 text-sm leading-relaxed text-[#2E2C2A] outline-none transition focus:border-[#E35013] focus:ring-2 focus:ring-[#E35013]/15" />
            <div className="mt-2 flex justify-between text-xs text-[#817B77]"><span>At least 20 characters</span><span>{text.length.toLocaleString()} characters</span></div>
            <BtnGreen className="mt-4 w-full rounded-lg py-3 text-base" disabled={parsing || busy || text.trim().length < 20} onClick={() => analyze()}>
              {parsing ? <><Loader2 className="size-4 animate-spin" /> Analyzing resume...</> : <>Analyze resume <ArrowRight className="size-4" /></>}
            </BtnGreen>
            {parseError && <div role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3.5 text-sm font-medium text-red-700">{parseError}</div>}
          </Motion.section>

          <Motion.section initial={{ y: 16 }} animate={{ y: 0 }} transition={{ duration: 0.42, delay: 0.12, ease: [0.22, 1, 0.36, 1] }} aria-labelledby="resume-results-title" className="overflow-hidden rounded-xl border border-[#E6E2E0] bg-white shadow-[0_8px_24px_-18px_rgba(46,44,42,0.28)]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E6E2E0] px-5 py-5 sm:px-6">
              <div><p className="text-xs font-bold uppercase tracking-[0.12em] text-[#E35013]">02 / Your profile</p><h2 id="resume-results-title" className="mt-1 text-xl font-semibold text-[#2E2C2A]">Interview briefing</h2></div>
              {done ? <Pill tone="green"><CheckCircle2 className="size-3.5" /> Ready</Pill> : <Pill>{parsing ? 'Analyzing' : 'Not started'}</Pill>}
            </div>

            {!done && !parsing && (
              <div className="p-5 sm:p-6">
                <div className="mb-6 rounded-xl bg-[#2E2C2A] p-5 text-white sm:p-6">
                  <div className="mb-4 flex size-11 items-center justify-center rounded-lg bg-white/10"><FileCheck2 className="size-5 text-[#F3A17D]" /></div>
                  <h3 className="text-lg font-semibold">A sharper conversation starts here.</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/70">Your resume will be organized into a focused briefing, ready to guide relevant interview questions.</p>
                </div>
                <div className="space-y-1">
                  {analysisSteps.map(({ label, Icon }, index) => (
                    <div key={label} className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-[#6B6561]">
                      <span className="flex size-8 items-center justify-center rounded-lg bg-[#F4F2F1]">{createElement(Icon, { className: 'size-4' })}</span>
                      <span className="flex-1 font-medium">{label}</span>
                      <span className="text-xs text-[#A7A19D]">0{index + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {parsing && <div role="status" className="flex min-h-[280px] flex-col items-center justify-center px-6 text-center"><span className="mb-4 flex size-12 items-center justify-center rounded-xl bg-[#FBE9E1] text-[#C94410]"><Loader2 className="size-5 animate-spin" /></span><p className="font-semibold text-[#2E2C2A]">Reading your experience</p><p className="mt-1 text-sm text-[#817B77]">Organizing skills, projects, and background...</p></div>}

            {done && (
              <Motion.div initial={{ y: 8 }} animate={{ y: 0 }} className="space-y-5 p-5 text-sm sm:p-6">
                {skills.length > 0 && <div><div className="mb-2 text-xs font-bold uppercase tracking-[0.1em] text-[#817B77]">Technical skills</div><div className="flex flex-wrap gap-2">{skills.map((skill, index) => <span key={`${skill}-${index}`} className="rounded-md border border-[#E6E2E0] bg-[#FAF9F8] px-2.5 py-1.5 font-medium text-[#4F4945]">{skill}</span>)}</div></div>}
                {projects.length > 0 && <div><div className="mb-2 text-xs font-bold uppercase tracking-[0.1em] text-[#817B77]">Projects</div><div className="space-y-2">{projects.map((project, index) => <div key={`${project}-${index}`} className="rounded-lg border border-[#E6E2E0] p-3.5 leading-relaxed text-[#4F4945]">{project}</div>)}</div></div>}
                {(experience || education) && <div className="grid gap-3 sm:grid-cols-2">{experience && <div className="rounded-lg bg-[#FAF9F8] p-3.5"><div className="text-xs font-bold uppercase tracking-wider text-[#817B77]">Experience</div><div className="mt-1 font-semibold text-[#2E2C2A]">{experience}</div></div>}{education && <div className="rounded-lg bg-[#FAF9F8] p-3.5"><div className="text-xs font-bold uppercase tracking-wider text-[#817B77]">Education</div><div className="mt-1 font-semibold text-[#2E2C2A]">{education}</div></div>}</div>}
                {strengths.length > 0 && <div><div className="mb-2 text-xs font-bold uppercase tracking-[0.1em] text-[#817B77]">Strengths</div><div className="flex flex-wrap gap-2">{strengths.map((strength, index) => <span key={`${strength}-${index}`} className="rounded-md bg-[#FBE9E1] px-2.5 py-1.5 font-medium text-[#9F3C16]">{strength}</span>)}</div></div>}
                <div className="flex items-start gap-3 rounded-lg bg-[#2E2C2A] p-4 text-white"><Sparkles className="mt-0.5 size-5 shrink-0 text-[#F3A17D]" /><p className="text-sm leading-relaxed"><strong>Interview briefing ready.</strong> Your interviewer can now tailor questions to your background.</p></div>
                <button onClick={() => nav('/interview-setup', { state: { resume: text } })} className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#E35013] px-4 py-3 text-base font-semibold text-white transition-colors hover:bg-[#C94410] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E35013]">Continue to interview setup <ArrowRight className="size-4" /></button>
              </Motion.div>
            )}
          </Motion.section>
        </div>
      </div>
    </div>
  );
}
