import { motion as Motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowRight, Award, BriefcaseBusiness, Mail, MapPin, Phone, RefreshCw, Sparkles, Target, UserRound } from 'lucide-react';

const profileFields = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'bio', label: 'Professional summary' },
  { key: 'skills', label: 'Skills' },
];

function getInitials(name = '') {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part.charAt(0).toUpperCase()).join('') || 'SC';
}

export default function CandidateProfile({ user }) {
  const [applications, setApplications] = useState([]);
  const [applicationsError, setApplicationsError] = useState('');
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const fetchApplications = useCallback(async () => {
    setApplicationsLoading(true);
    setApplicationsError('');
    try {
      const response = await axios.get('/api/jobs/mine/applications');
      setApplications(response.data || []);
    } catch (error) {
      console.error('Could not load candidate applications:', error);
      setApplicationsError(error.response?.data?.message || 'Could not load your applications.');
    } finally {
      setApplicationsLoading(false);
    }
  }, []);
  useEffect(() => { fetchApplications(); }, [fetchApplications]);

  const name = user?.name?.trim() || 'Candidate';
  const skills = Array.isArray(user?.skills) ? user.skills.filter(Boolean) : [];
  const completedFields = profileFields.filter(({ key }) => {
    const value = user?.[key];
    return Array.isArray(value) ? value.length > 0 : Boolean(String(value || '').trim());
  }).length;
  const profileStrength = Math.round((completedFields / profileFields.length) * 100);
  const points = Number(user?.points) || 0;

  return (
    <main className="min-h-screen bg-[#F4F2F1] pb-24">
      <div className="mx-auto max-w-[1120px] px-5 py-8 sm:py-12">
        <Motion.header initial={{ y: 10 }} animate={{ y: 0 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }} className="mb-7 flex flex-col gap-5 border-b border-[#DEDAD7] pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#E6E2E0] bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-[0.1em] text-[#6B6561]"><UserRound className="size-3.5 text-[#E35013]" />Candidate profile</div>
            <h1 className="text-3xl font-semibold leading-tight tracking-tight text-[#2E2C2A] sm:text-4xl">Your professional profile</h1>
            <p className="mt-2 text-base text-[#6B6561]">A clear snapshot of your experience, strengths, and next steps.</p>
          </div>
          <Link to="/jobs" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#E35013] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#C94410] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E35013]">Browse jobs <ArrowRight className="size-4" /></Link>
        </Motion.header>

        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(280px,0.7fr)]">
          <Motion.section initial={{ y: 14 }} animate={{ y: 0 }} transition={{ duration: 0.4, delay: 0.04, ease: [0.22, 1, 0.36, 1] }} aria-labelledby="identity-heading" className="overflow-hidden rounded-xl border border-[#E6E2E0] bg-white shadow-[0_12px_30px_-24px_rgba(46,44,42,0.32)]">
            <div className="h-2 bg-[#2E2C2A]" />
            <div className="p-5 sm:p-7">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="flex size-[76px] shrink-0 items-center justify-center rounded-xl bg-[#FBE9E1] text-2xl font-semibold text-[#A94118]" aria-label={`${name} initials`}>{getInitials(name)}</div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#817B77]">{user?.role === 'candidate' ? 'Candidate' : user?.role || 'Member'}</p>
                  <h2 id="identity-heading" className="mt-1 break-words text-2xl font-semibold text-[#2E2C2A]">{name}</h2>
                  {user?.bio ? <p className="mt-2 max-w-2xl whitespace-pre-wrap text-sm leading-relaxed text-[#6B6561]">{user.bio}</p> : <p className="mt-2 text-sm text-[#817B77]">Add a professional summary to introduce your background.</p>}
                </div>
              </div>

              <div className="mt-6 grid gap-3 border-t border-[#E6E2E0] pt-5 sm:grid-cols-2">
                <div className="flex min-w-0 items-start gap-3 rounded-lg bg-[#FAF9F8] p-3.5"><Mail className="mt-0.5 size-4 shrink-0 text-[#817B77]" /><div className="min-w-0"><p className="text-xs font-semibold uppercase tracking-wide text-[#817B77]">Email</p><p className="mt-1 break-all text-sm font-medium text-[#2E2C2A]">{user?.email || 'Not provided'}</p></div></div>
                <div className="flex min-w-0 items-start gap-3 rounded-lg bg-[#FAF9F8] p-3.5"><Phone className="mt-0.5 size-4 shrink-0 text-[#817B77]" /><div className="min-w-0"><p className="text-xs font-semibold uppercase tracking-wide text-[#817B77]">Phone</p><p className="mt-1 break-all text-sm font-medium text-[#2E2C2A]">{user?.phone || 'Not provided'}</p></div></div>
                {user?.location && <div className="flex min-w-0 items-start gap-3 rounded-lg bg-[#FAF9F8] p-3.5"><MapPin className="mt-0.5 size-4 shrink-0 text-[#817B77]" /><div className="min-w-0"><p className="text-xs font-semibold uppercase tracking-wide text-[#817B77]">Location</p><p className="mt-1 text-sm font-medium text-[#2E2C2A]">{user.location}</p></div></div>}
                {user?.company && <div className="flex min-w-0 items-start gap-3 rounded-lg bg-[#FAF9F8] p-3.5"><BriefcaseBusiness className="mt-0.5 size-4 shrink-0 text-[#817B77]" /><div className="min-w-0"><p className="text-xs font-semibold uppercase tracking-wide text-[#817B77]">Organization</p><p className="mt-1 text-sm font-medium text-[#2E2C2A]">{user.company}</p></div></div>}
              </div>
            </div>
          </Motion.section>

          <Motion.aside initial={{ y: 14 }} animate={{ y: 0 }} transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }} className="space-y-4">
            <section aria-labelledby="profile-strength-heading" className="rounded-xl border border-[#E6E2E0] bg-white p-5">
              <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.1em] text-[#E35013]">Profile readiness</p><h2 id="profile-strength-heading" className="mt-1 text-lg font-semibold text-[#2E2C2A]">Your profile strength</h2></div><Target className="size-5 text-[#817B77]" /></div>
              <div className="mt-5 flex items-end justify-between"><span className="text-4xl font-semibold tabular-nums text-[#2E2C2A]">{profileStrength}<span className="text-xl text-[#817B77]">%</span></span><span className="mb-1 text-sm text-[#817B77]">{completedFields} of {profileFields.length} details</span></div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#F0EDEA]"><Motion.div initial={{ width: 0 }} animate={{ width: `${profileStrength}%` }} transition={{ duration: 0.8, ease: 'easeOut' }} className="h-full rounded-full bg-[#E35013]" /></div>
              <p className="mt-3 text-sm leading-relaxed text-[#6B6561]">{profileStrength === 100 ? 'Your profile has the essentials interviewers need.' : 'Add your missing details to give interview sessions more useful context.'}</p>
            </section>

            <section aria-labelledby="points-heading" className="rounded-xl border border-[#E6E2E0] bg-[#2E2C2A] p-5 text-white">
              <div className="flex items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.1em] text-white/60">Your progress</p><h2 id="points-heading" className="mt-1 text-lg font-semibold">Skill points</h2></div><Award className="size-5 text-[#F3A17D]" /></div>
              <p className="mt-5 text-4xl font-semibold tabular-nums">{points.toLocaleString()}</p>
              <p className="mt-1 text-sm text-white/65">Earned through completed activities</p>
            </section>
          </Motion.aside>
        </div>

        <section aria-labelledby="skills-heading" className="mt-5 rounded-xl border border-[#E6E2E0] bg-white p-5 sm:p-7">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[#E6E2E0] pb-4">
            <div><p className="text-xs font-bold uppercase tracking-[0.1em] text-[#E35013]">Professional toolkit</p><h2 id="skills-heading" className="mt-1 text-xl font-semibold text-[#2E2C2A]">Skills & technologies</h2></div>
            <span className="text-sm text-[#817B77]">{skills.length} {skills.length === 1 ? 'skill' : 'skills'}</span>
          </div>
          {skills.length ? <div className="mt-5 flex flex-wrap gap-2">{skills.map((skill, index) => <Motion.span key={`${skill}-${index}`} initial={{ y: 6 }} animate={{ y: 0 }} transition={{ delay: Math.min(index * 0.025, 0.25) }} className="inline-flex items-center rounded-md border border-[#E6E2E0] bg-[#FAF9F8] px-3 py-2 text-sm font-medium text-[#4F4945]">{skill}</Motion.span>)}</div> : <div className="mt-5 rounded-lg border border-dashed border-[#D8D2CE] bg-[#FAF9F8] px-5 py-8 text-center"><p className="font-medium text-[#4F4945]">Your skills will appear here</p><p className="mt-1 text-sm text-[#817B77]">Complete an interview or update your profile details to build your skill set.</p></div>}
        </section>

        <section className="mt-5 grid gap-3 sm:grid-cols-3">
          <Link to="/resume" className="group flex items-center justify-between gap-3 rounded-xl border border-[#E6E2E0] bg-white p-4 transition-colors hover:border-[#D2B9AA] hover:bg-[#FFFCFA]"><span><span className="block text-sm font-semibold text-[#2E2C2A]">Resume profile</span><span className="mt-1 block text-xs text-[#817B77]">Prepare your interview context</span></span><ArrowRight className="size-4 text-[#817B77] transition-transform group-hover:translate-x-1" /></Link>
          <Link to="/quiz" className="group flex items-center justify-between gap-3 rounded-xl border border-[#E6E2E0] bg-white p-4 transition-colors hover:border-[#D2B9AA] hover:bg-[#FFFCFA]"><span><span className="block text-sm font-semibold text-[#2E2C2A]">Skill assessment</span><span className="mt-1 block text-xs text-[#817B77]">Practice a technology track</span></span><ArrowRight className="size-4 text-[#817B77] transition-transform group-hover:translate-x-1" /></Link>
          <Link to="/analytics" className="group flex items-center justify-between gap-3 rounded-xl border border-[#E6E2E0] bg-white p-4 transition-colors hover:border-[#D2B9AA] hover:bg-[#FFFCFA]"><span><span className="block text-sm font-semibold text-[#2E2C2A]">Performance analytics</span><span className="mt-1 block text-xs text-[#817B77]">Review your progress</span></span><ArrowRight className="size-4 text-[#817B77] transition-transform group-hover:translate-x-1" /></Link>
        </section>

        <section aria-labelledby="applications-heading" className="mt-5 rounded-xl border border-[#E6E2E0] bg-white p-5 sm:p-7">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[#E6E2E0] pb-4">
            <div><p className="text-xs font-bold uppercase tracking-[0.1em] text-[#E35013]">Hiring pipeline</p><h2 id="applications-heading" className="mt-1 text-xl font-semibold text-[#2E2C2A]">Your applications</h2></div>
            <div className="flex items-center gap-4">
              <button type="button" onClick={fetchApplications} disabled={applicationsLoading} className="inline-flex items-center gap-2 text-sm font-semibold text-[#4F4945] hover:text-[#C94410] disabled:opacity-50"><RefreshCw className={`size-4 ${applicationsLoading ? 'animate-spin' : ''}`} />Refresh</button>
              <Link to="/jobs" className="text-sm font-semibold text-[#4F4945] hover:text-[#C94410]">Find a job</Link>
            </div>
          </div>
          {applicationsError && <p role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{applicationsError}</p>}
          {applicationsLoading && applications.length === 0
            ? <p className="mt-4 text-sm text-[#817B77]">Loading your applications...</p>
            : applications.length === 0
            ? <p className="mt-4 text-sm text-[#817B77]">Your submitted job applications and interview decisions will appear here.</p>
            : <div className="mt-4 space-y-3">{applications.map((application) => {
              const job = application.jobId || {};
              const statusLabel = application.status === 'interviewed'
                ? 'Interview complete · scorecard awaiting admin approval'
                : application.status === 'interview'
                  ? 'Approved for interview'
                  : application.status.charAt(0).toUpperCase() + application.status.slice(1);
              return <article key={application._id} className="flex flex-col gap-3 rounded-lg border border-[#E6E2E0] bg-[#FAF9F8] p-4 sm:flex-row sm:items-center sm:justify-between">
                <div><h3 className="font-semibold text-[#2E2C2A]">{job.title || 'Job removed'}</h3><p className="mt-1 text-sm text-[#817B77]">{job.company || ''} · {statusLabel}</p></div>
                {application.status === 'interview' && <Link to="/interview-setup" state={{ job, resume: application.resumeText, applicationId: application._id }} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#E35013] px-4 text-sm font-semibold text-white hover:bg-[#C94410]">Start approved interview <ArrowRight className="size-4" /></Link>}
              </article>;
            })}</div>}
        </section>
      </div>
    </main>
  );
}
