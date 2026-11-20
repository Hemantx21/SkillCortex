import { createElement } from 'react';
import { motion as Motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Activity, ArrowRight, Award, BookOpenCheck, ChartNoAxesCombined, CircleHelp, FileUser, Target } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const REQUIRED_PROFILE_FIELDS = ['name', 'email', 'phone', 'bio', 'skills'];

export default function Analytics() {
  const { user } = useAuth();
  const skills = Array.isArray(user?.skills) ? user.skills.filter(Boolean) : [];
  const filledProfileFields = REQUIRED_PROFILE_FIELDS.filter((field) => {
    const value = user?.[field];
    return Array.isArray(value) ? value.length > 0 : Boolean(String(value || '').trim());
  }).length;
  const profileStrength = Math.round((filledProfileFields / REQUIRED_PROFILE_FIELDS.length) * 100);
  const points = Number(user?.points) || 0;
  const metrics = [
    { label: 'Skill points', value: points.toLocaleString(), detail: 'Earned on your account', Icon: Award },
    { label: 'Profile skills', value: String(skills.length), detail: 'Saved to your profile', Icon: BookOpenCheck },
    { label: 'Profile readiness', value: `${profileStrength}%`, detail: `${filledProfileFields} of ${REQUIRED_PROFILE_FIELDS.length} details`, Icon: Target },
  ];

  return (
    <main className="min-h-screen bg-[#F4F2F1] pb-24">
      <div className="mx-auto max-w-[1180px] px-5 py-8 sm:py-12">
        <Motion.header initial={{ y: 10 }} animate={{ y: 0 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }} className="mb-8 flex flex-col gap-5 border-b border-[#DEDAD7] pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#E6E2E0] bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-[0.1em] text-[#6B6561]"><ChartNoAxesCombined className="size-3.5 text-[#E35013]" />Progress overview</div>
            <h1 className="text-3xl font-semibold leading-tight tracking-tight text-[#2E2C2A] sm:text-4xl">Your progress, clearly measured.</h1>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-[#6B6561]">A snapshot of the profile and skills currently saved to your account.</p>
          </div>
          <Link to="/interview-setup" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#E35013] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#C94410] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E35013]">Start an interview <ArrowRight className="size-4" /></Link>
        </Motion.header>

        <section aria-label="Account progress metrics" className="grid gap-3 sm:grid-cols-3">
          {metrics.map(({ label, value, detail, Icon }, index) => (
            <Motion.article key={label} initial={{ y: 8 }} animate={{ y: 0 }} transition={{ delay: index * 0.05, duration: 0.3 }} className="rounded-xl border border-[#E6E2E0] bg-white p-5">
              <div className="flex items-center justify-between gap-3"><span className="text-sm font-medium text-[#6B6561]">{label}</span><span className="flex size-9 items-center justify-center rounded-lg bg-[#FBE9E1] text-[#C94410]">{createElement(Icon, { className: 'size-4' })}</span></div>
              <p className="mt-5 text-3xl font-semibold tabular-nums text-[#2E2C2A]">{value}</p>
              <p className="mt-1 text-sm text-[#817B77]">{detail}</p>
            </Motion.article>
          ))}
        </section>

        <div className="mt-5 grid items-start gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.85fr)]">
          <section aria-labelledby="skills-heading" className="rounded-xl border border-[#E6E2E0] bg-white p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3 border-b border-[#E6E2E0] pb-4">
              <div><p className="text-xs font-bold uppercase tracking-[0.1em] text-[#E35013]">Account data</p><h2 id="skills-heading" className="mt-1 text-xl font-semibold text-[#2E2C2A]">Your saved skills</h2></div>
              <span className="rounded-md bg-[#FAF9F8] px-2.5 py-1.5 text-xs font-semibold text-[#6B6561]">{skills.length} {skills.length === 1 ? 'skill' : 'skills'}</span>
            </div>
            {skills.length ? <div className="mt-5 flex flex-wrap gap-2">{skills.map((skill, index) => <Motion.span key={`${skill}-${index}`} initial={{ y: 5 }} animate={{ y: 0 }} transition={{ delay: Math.min(index * 0.025, 0.25) }} className="rounded-md border border-[#E6E2E0] bg-[#FAF9F8] px-3 py-2 text-sm font-medium text-[#4F4945]">{skill}</Motion.span>)}</div> : <div className="mt-5 rounded-lg border border-dashed border-[#D8D2CE] bg-[#FAF9F8] px-5 py-9 text-center"><span className="mx-auto flex size-10 items-center justify-center rounded-lg bg-white text-[#817B77]"><BookOpenCheck className="size-5" /></span><p className="mt-3 font-semibold text-[#4F4945]">No skills saved yet</p><p className="mt-1 text-sm text-[#817B77]">Complete your profile or take an assessment to build your skill list.</p></div>}
          </section>

          <section aria-labelledby="interviews-heading" className="rounded-xl border border-[#E6E2E0] bg-white p-5 sm:p-6">
            <div className="flex items-start gap-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#F4F2F1] text-[#4F4945]"><Activity className="size-5" /></span><div><p className="text-xs font-bold uppercase tracking-[0.1em] text-[#E35013]">Interview history</p><h2 id="interviews-heading" className="mt-1 text-lg font-semibold text-[#2E2C2A]">Results will appear here</h2></div></div>
            <p className="mt-4 text-sm leading-relaxed text-[#6B6561]">Completed interview scores are not currently stored in your candidate analytics, so no score trends are shown here.</p>
            <Link to="/interview-setup" className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-lg border border-[#E6E2E0] px-3.5 text-sm font-semibold text-[#4F4945] transition-colors hover:border-[#D2B9AA] hover:bg-[#FAF9F8]">Prepare for an interview <ArrowRight className="size-4" /></Link>
          </section>
        </div>

        <section className="mt-5 flex flex-col gap-4 rounded-xl border border-[#E6E2E0] bg-[#2E2C2A] p-5 text-white sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-start gap-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/10 text-[#F3A17D]"><FileUser className="size-5" /></span><div><h2 className="font-semibold">Make your profile more useful</h2><p className="mt-1 text-sm leading-relaxed text-white/65">Add a resume and professional details so interview preparation can use your real experience.</p></div></div>
          <div className="flex shrink-0 flex-wrap gap-2"><Link to="/profile" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-white/20 px-3.5 text-sm font-semibold text-white hover:bg-white/10">View profile <ArrowRight className="size-4" /></Link><Link to="/resume" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#E35013] px-3.5 text-sm font-semibold text-white hover:bg-[#C94410]">Add resume</Link></div>
        </section>

        {!user && <p className="mt-4 flex items-center gap-2 text-sm text-[#817B77]"><CircleHelp className="size-4" />Sign in to see progress saved to your account.</p>}
      </div>
    </main>
  );
}
