import { createElement, useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Card, Pill } from '../../components/ui';
import { Plus, X, CheckCircle, AlertCircle, Briefcase, Eye, ToggleLeft, ToggleRight, Trash2, MapPin, Users, CalendarClock, FileText, Phone, Mail, User, MessageSquare, Clock, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { formatSalary } from '../../lib/formatSalary';

const reqColors = ['bg-[#F4F2F1] text-[#3B32B0]', 'bg-[#F4F2F1] text-[#2E2C2A]', 'bg-[#FEF3C7] text-[#92400E]', 'bg-[#F4F2F1] text-[#9E9894]'];

const EMPTY_FORM = { title: '', company: '', location: '', salary: '', requirements: '', description: '' };

const STATUS_CONFIG = {
  submitted: { label: 'Submitted', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: Clock },
  reviewing: { label: 'Reviewing', color: 'bg-yellow-50 text-yellow-700 border-yellow-200', icon: Eye },
  interview: { label: 'Interview', color: 'bg-purple-50 text-purple-700 border-purple-200', icon: Users },
  interviewed: { label: 'Interviewed', color: 'bg-indigo-50 text-indigo-700 border-indigo-200', icon: CheckCircle2 },
  accepted: { label: 'Accepted', color: 'bg-green-50 text-green-700 border-green-200', icon: CheckCircle2 },
  rejected: { label: 'Rejected', color: 'bg-red-50 text-red-700 border-red-200', icon: XCircle },
};

function PostJobModal({ open, formData, onChange, onSubmit, isSubmitting, error, success, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2E2C2A]/60">
      <div className="bg-white rounded-[22px] w-full max-w-[560px] shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-[#E6E2E0]">
          <div className="flex items-center gap-2.5">
            <Briefcase className="w-5 h-5 text-[#4F4945]" />
            <span className="font-bold text-[14px] text-[#2E2C2A]">Post a new job</span>
          </div>
          <button type="button" onClick={onClose} className="text-[#9E9894] p-1"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={onSubmit} className="p-6 space-y-4 bg-[#F4F2F1]">
          <div>
            <label className="block text-[12px] font-bold text-[#9E9894] mb-1.5">Job title</label>
            <input name="title" value={formData.title} onChange={onChange} required className="w-full bg-white border border-[#D9E0DC] rounded-[11px] px-3.5 py-2.5 text-[13.5px] font-semibold" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-bold text-[#9E9894] mb-1.5">Company</label>
              <input name="company" value={formData.company} onChange={onChange} required className="w-full bg-white border border-[#D9E0DC] rounded-[11px] px-3.5 py-2.5 text-[13.5px] font-semibold" />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-[#9E9894] mb-1.5">Location</label>
              <input name="location" value={formData.location} onChange={onChange} placeholder="Remote" className="w-full bg-white border border-[#D9E0DC] rounded-[11px] px-3.5 py-2.5 text-[13.5px] font-semibold" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-bold text-[#9E9894] mb-1.5">Salary range</label>
              <input name="salary" value={formData.salary} onChange={onChange} placeholder="Rs. 12-18 LPA" className="w-full bg-white border border-[#D9E0DC] rounded-[11px] px-3.5 py-2.5 text-[13.5px] font-semibold" />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-[#9E9894] mb-1.5">Requirements</label>
              <input name="requirements" value={formData.requirements} onChange={onChange} placeholder="React, Node.js, SQL" className="w-full bg-white border border-[#D9E0DC] rounded-[11px] px-3.5 py-2.5 text-[13.5px] font-semibold" />
            </div>
          </div>
          <div>
            <label className="block text-[12px] font-bold text-[#9E9894] mb-1.5">Description</label>
            <textarea name="description" rows="4" value={formData.description} onChange={onChange} required className="w-full bg-white border border-[#D9E0DC] rounded-[11px] px-3.5 py-2.5 text-[13.5px] font-semibold resize-none" />
          </div>
          {error && <div className="p-3 rounded-[12px] bg-[#FEF2F2] border border-[#FECACA] text-[12.5px] font-semibold text-[#9A3412] flex gap-2"><AlertCircle className="w-4 h-4" /><span>{error}</span></div>}
          {success && <div className="p-3 rounded-[12px] bg-[#F4F2F1] border border-[#B7E4CB] text-[12.5px] font-semibold text-[#3B32B0] flex gap-2"><CheckCircle className="w-4 h-4" /><span>{success}</span></div>}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="text-[13px] font-bold text-[#9E9894] px-4 py-2">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="bg-[#2E2C2A] text-white text-[13px] font-bold px-5 py-2 rounded-full inline-flex items-center gap-2 disabled:opacity-60">
              {isSubmitting ? 'Posting...' : (<><Plus className="w-4 h-4" /> Post job</>)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ViewDetailsModal({ job, onClose, onToggle }) {
  if (!job) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2E2C2A]/60">
      <div className="bg-[#2E2C2A] rounded-[22px] w-full max-w-[580px] overflow-hidden border border-[#2E2C2A]">
        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-[#1A3A33]">
          <span className="font-bold text-[14px] text-white">View job details</span>
          <button type="button" onClick={onClose} className="text-[#DDD8FF] p-1"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4 bg-[#4F4945]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-[18px] text-white">{job.title}</h3>
              <p className="text-[13px] text-[#A7D4C5]">{job.company}</p>
            </div>
            <Pill tone={job.status === 'open' ? 'green' : 'gray'}>{(job.status || 'open').toUpperCase()}</Pill>
          </div>
          <div className="text-[12.5px] text-[#D5EAE0]"><span className="text-[#DDD8FF] font-bold">Location: </span>{job.location || 'Remote'}{job.salary ? ` Â· ${formatSalary(job.salary)}` : ''}</div>
          {job.requirements?.length > 0 && (
            <ul className="space-y-1.5">
              {job.requirements.map((r) => (<li key={r} className="text-[12.5px] text-white">{r}</li>))}
            </ul>
          )}
          {job.description && <p className="text-[13px] text-[#D5EAE0]">{job.description}</p>}
          <div className="flex items-center gap-3 pt-2 border-t border-[#1A3A33]">
            <button type="button" onClick={() => onToggle(job)} className="text-[12.5px] font-bold px-4 py-2 rounded-full bg-[#F4F2F1] text-[#3B32B0]">
              {job.status === 'open' ? 'Close' : 'Open'}
            </button>
            <button type="button" onClick={onClose} className="ml-auto text-[12.5px] font-bold text-[#DDD8FF]">Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConfirmDeleteModal({ job, onConfirm, onCancel }) {
  if (!job) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2E2C2A]/60">
      <div className="bg-white rounded-[20px] w-full max-w-[420px] p-6 border border-[#E6E2E0]">
        <div className="font-bold text-[14px] text-[#2E2C2A] mb-2">Delete this posting?</div>
        <p className="text-[13px] text-[#9E9894] mb-5">Deleting <strong>{job.title}</strong> cannot be undone.</p>
        <div className="flex justify-end gap-3">
          <button type="button" onClick={onCancel} className="text-[12.5px] font-bold text-[#9E9894] px-4 py-2">Cancel</button>
          <button type="button" onClick={onConfirm} className="bg-[#DC2626] text-white text-[12.5px] font-bold px-5 py-2 rounded-full">Delete posting</button>
        </div>
      </div>
    </div>
  );
}

function ApplicationDetailModal({ application, onClose, onUpdateStatus, saving }) {
  const [status, setStatus] = useState(application.status);
  const [hrNote, setHrNote] = useState(application.hrNote || '');
  const candidate = application.candidateId || {};
  const job = application.jobId || {};

  const handleUpdate = () => {
    onUpdateStatus(application, status);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#211F1D]/55 p-4" onClick={onClose}>
      <section role="dialog" aria-modal="true" aria-labelledby="application-resume-heading" className="max-h-[90vh] w-full max-w-[720px] overflow-hidden rounded-2xl border border-[#E6E2E0] bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-[#E6E2E0] px-6 py-4 bg-[#F4F2F1]">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#E35013]">Application Review</p>
            <h2 id="application-resume-heading" className="mt-1 font-bold text-lg text-[#2E2C2A]">{candidate.name || 'Candidate'}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close application" className="rounded-md p-2 text-[#817B77] hover:bg-white"><X className="size-5" /></button>
        </div>
        <div className="max-h-[calc(90vh-80px)] overflow-y-auto">
          <div className="p-6 space-y-5">
            {/* Candidate Info */}
            <div className="bg-white border border-[#E6E2E0] rounded-xl p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#9E9894] mb-3 flex items-center gap-2"><User className="w-4 h-4" /> Candidate Information</h3>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm"><Mail className="w-4 h-4 text-[#817B77]" /><span className="text-[#4F4945]">{candidate.email || 'Not provided'}</span></div>
                <div className="flex items-center gap-2 text-sm"><Phone className="w-4 h-4 text-[#817B77]" /><span className="text-[#4F4945]">{candidate.phone || 'Not provided'}</span></div>
              </div>
              {candidate.skills && candidate.skills.length > 0 && <div className="mt-3 flex flex-wrap gap-1.5">{candidate.skills.map((skill, i) => <span key={i} className="text-xs px-2 py-1 rounded-full bg-[#F4F2F1] text-[#4F4945] font-medium">{skill}</span>)}</div>}
            </div>

            {/* Job Info */}
            <div className="bg-white border border-[#E6E2E0] rounded-xl p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#9E9894] mb-3 flex items-center gap-2"><Briefcase className="w-4 h-4" /> Position Applied</h3>
              <p className="font-bold text-[#2E2C2A]">{job.title || 'Position removed'}</p>
              <p className="text-sm text-[#817B77]">{job.company || ''}</p>
            </div>

            {/* Resume */}
            <div className="bg-white border border-[#E6E2E0] rounded-xl p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#9E9894] mb-3 flex items-center gap-2"><FileText className="w-4 h-4" /> Resume / Cover Letter</h3>
              <pre className="whitespace-pre-wrap break-words rounded-lg bg-[#FAF9F8] p-4 font-sans text-sm leading-relaxed text-[#4F4945] max-h-[300px] overflow-y-auto">{application.resumeText}</pre>
            </div>

            {/* HR Notes */}
            <div className="bg-white border border-[#E6E2E0] rounded-xl p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#9E9894] mb-3 flex items-center gap-2"><MessageSquare className="w-4 h-4" /> HR Notes</h3>
              <textarea value={hrNote} onChange={(e) => setHrNote(e.target.value)} placeholder="Add notes about this candidate..." className="w-full min-h-[100px] border border-[#E6E2E0] rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E2C2A]" />
            </div>

            {/* Status Update */}
            <div className="bg-[#F4F2F1] border border-[#E6E2E0] rounded-xl p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#9E9894] mb-3 flex items-center gap-2"><Clock className="w-4 h-4" /> Update Status</h3>
              <div className="flex flex-wrap items-center gap-3">
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="flex-1 min-w-[200px] min-h-[44px] rounded-lg border border-[#E6E2E0] bg-white px-4 text-sm font-semibold text-[#2E2C2A]">
                  {Object.entries(STATUS_CONFIG).filter(([key]) => !['interview', 'interviewed'].includes(key) || key === status).map(([key, config]) => <option key={key} value={key} disabled={['interview', 'interviewed'].includes(key)}>{config.label}</option>)}
                </select>
                <button onClick={handleUpdate} disabled={saving} className="bg-[#2E2C2A] text-white font-bold text-sm px-6 py-2.5 rounded-full inline-flex items-center gap-2 disabled:opacity-50">
                  {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Updating...</> : <><CheckCircle className="w-4 h-4" /> Update Status</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function HRTable({ user }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [isPosting, setIsPosting] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [viewJob, setViewJob] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [applications, setApplications] = useState([]);
  const [scorecards, setScorecards] = useState([]);
  const [scorecardsError, setScorecardsError] = useState('');
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [applicationsError, setApplicationsError] = useState('');
  const [savingApplicationId, setSavingApplicationId] = useState('');
  const [selectedApplication, setSelectedApplication] = useState(null);

  useEffect(() => {
    if (searchParams.get('postJob') !== '1') return;
    setSearchParams({}, { replace: true });
  }, [searchParams, setSearchParams]);

  const fetchJobs = useCallback(async () => {
    try { const response = await axios.get('/api/jobs/hr/jobs'); setJobs(response.data || []); }
    catch (requestError) { setError(requestError.response?.data?.message || 'Could not load your job postings.'); }
  }, []);
  const fetchApplications = useCallback(async () => {
    setApplicationsLoading(true);
    setApplicationsError('');
    try { const response = await axios.get('/api/jobs/hr/applications'); setApplications(response.data || []); }
    catch (requestError) { setApplicationsError(requestError.response?.data?.message || 'Could not load applications.'); }
    finally { setApplicationsLoading(false); }
  }, []);
  const fetchScorecards = useCallback(async () => {
    setScorecardsError('');
    try {
      const response = await axios.get('/api/jobs/hr/reviews');
      setScorecards(response.data || []);
    } catch (requestError) {
      setScorecardsError(requestError.response?.data?.message || 'Could not load approved interview scorecards.');
    }
  }, []);
  useEffect(() => { fetchJobs(); fetchApplications(); fetchScorecards(); }, [fetchJobs, fetchApplications, fetchScorecards]);

  const my = jobs.filter((j) => {
    const ref = j.hrRef?._id || j.hrRef;
    return ref && (String(ref) === String(user?.id) || String(ref) === String(user?._id));
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handlePostJob = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!formData.title || !formData.company || !formData.description) { setError('Title, company and description are required.'); return; }
    setIsSubmitting(true);
    try {
      const reqsArray = formData.requirements.split(',').map((r) => r.trim()).filter(Boolean);
      const res = await axios.post('/api/jobs', { ...formData, requirements: reqsArray });
      setJobs((prev) => [res.data, ...prev]);
      setSuccess('Job posted successfully!');
      setFormData(EMPTY_FORM);
      setTimeout(() => { setIsPosting(false); setSuccess(''); }, 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post job. Make sure you are signed in as HR.');
    } finally { setIsSubmitting(false); }
  };

  const handleToggleStatus = async (job) => {
    const newStatus = job.status === 'open' ? 'closed' : 'open';
    try {
      await axios.patch(`/api/jobs/${job._id}/status`, { status: newStatus });
      setJobs((prev) => prev.map((j) => j._id === job._id ? { ...j, status: newStatus } : j));
      if (viewJob?._id === job._id) setViewJob({ ...job, status: newStatus });
    } catch (err) { console.error('Toggle status error:', err); }
  };

  const updateApplication = async (application, status) => {
    setSavingApplicationId(application._id);
    try {
      const response = await axios.patch(`/api/jobs/hr/applications/${application._id}`, { status });
      setApplications((current) => current.map((item) => item._id === application._id ? response.data : item));
    } catch (requestError) {
      setApplicationsError(requestError.response?.data?.message || 'Could not update this application.');
    } finally { setSavingApplicationId(''); }
  };

  const totalApplications = applications.length;
  const newApplications = applications.filter((application) => application.status === 'submitted').length;
  const inReviewApplications = applications.filter((application) => ['reviewing', 'interview', 'interviewed'].includes(application.status)).length;

  const closePost = () => { setIsPosting(false); setError(''); setSuccess(''); };
  const closeView = () => setViewJob(null);
  const closeConfirm = () => setConfirmDelete(null);
  const confirmDeleteAction = () => handleDelete(confirmDelete?._id);

  const handleDelete = async (jobId) => {
    try {
      await axios.delete(`/api/jobs/${jobId}`);
      setJobs((prev) => prev.filter((j) => j._id !== jobId));
      setConfirmDelete(null);
      if (viewJob?._id === jobId) setViewJob(null);
    } catch (err) { console.error('Delete error:', err); }
  };

  return (
    <>
    <div className="bg-[#F4F2F1] min-h-screen pb-20">
      <div className="max-w-[1280px] mx-auto px-5 lg:px-8 py-8">
        <div className="flex flex-wrap justify-between gap-3 items-end">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-widest text-[#2E2C2A]">Recruiter workspace</div>
            <h1 className="text-[30px] font-extrabold tracking-tight text-[#2E2C2A]">Candidate pipeline</h1>
            <p className="text-[13.5px] text-[#9E9894]">Manage your openings and review candidate applications · {my.length} postings</p>
          </div>
          <button onClick={() => { setIsPosting(true); setError(''); setSuccess(''); setFormData(EMPTY_FORM); }}
            className="bg-[#2E2C2A] text-white text-[13.5px] font-bold px-5 py-2.5 rounded-full inline-flex items-center gap-2 hover:bg-[#4F4945] transition-colors">
            <Plus className="w-4 h-4" /> Post new job
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
          {[["Open roles", String(my.filter((job) => job.status === 'open').length), Briefcase], ['Applications', String(totalApplications), Users], ['New applications', String(newApplications), FileText], ['In review', String(inReviewApplications), CalendarClock]].map((stat) => (
            <Card key={stat[0]} className="p-4"><div className="flex items-center justify-between"><div className="text-[24px] font-extrabold tabular text-[#2E2C2A]">{stat[1]}</div>{createElement(stat[2], { className: 'size-4 text-[#817B77]' })}</div><div className="text-[12px] font-semibold text-[#817B77]">{stat[0]}</div></Card>
          ))}
        </div>

        {my.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[20px] font-extrabold text-[#2E2C2A]">Your job postings</h2>
              <span className="text-[12px] font-semibold text-[#9E9894] bg-[#F4F2F1] px-3 py-1 rounded-full">{my.length} postings</span>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {my.map((job) => (
                <div key={job._id} className={`group bg-white border rounded-[20px] p-5 flex flex-col gap-3 hover:-translate-y-1 hover:shadow-[0_12px_28px_-10px_rgba(11,61,54,0.18)] transition-all relative overflow-hidden ${job.status === 'open' ? 'border-[#E6E2E0] hover:border-[#4F4945]' : 'border-[#E6E2E0] opacity-80'}`}>
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${job.status === 'open' ? 'bg-[#2E2C2A]' : 'bg-[#9B98A8]'}`} />
                  <div className="flex items-start justify-between gap-3 pl-3">
                    <div className="flex items-center gap-3">
                      <span className="w-11 h-11 rounded-xl bg-[#4F4945] text-white flex items-center justify-center font-extrabold text-[13px]">{String(job.company || '?').slice(0, 2).toUpperCase()}</span>
                      <div>
                        <h4 className="font-bold text-[15px] text-[#2E2C2A] leading-snug group-hover:text-[#4F4945] transition-colors">{job.title}</h4>
                        <p className="text-[12px] text-[#9E9894] font-medium">{job.company}</p>
                      </div>
                    </div>
                    <Pill tone={job.status === 'open' ? 'green' : 'gray'}>{(job.status || 'open').toUpperCase()}</Pill>
                  </div>
                  <div className="flex items-center gap-3 pl-3 text-[11.5px] text-[#9E9894]">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location || 'Remote'}</span>
                    {job.salary && <span className="text-[#2E2C2A] font-bold ml-auto">{formatSalary(job.salary)}</span>}
                  </div>
                  <div className="pl-3 inline-flex w-fit items-center gap-1.5 rounded-md bg-[#FAF9F8] px-2.5 py-1.5 text-xs font-semibold text-[#6B6561]"><Users className="size-3.5" />{job.applicationCount || 0} applications</div>
                  <div className="pl-3 mt-auto">
                    <ul className="space-y-1.5">
                      {(job.requirements || []).slice(0, 3).map((r, i) => (<li key={r} className={`text-[11.5px] font-semibold px-2.5 py-1 rounded-md ${reqColors[i % reqColors.length]}`}>{r}</li>))}
                    </ul>
                  </div>
                  <div className="flex items-center gap-2 pl-3 mt-2 pt-3 border-t border-[#F4F2F1]">
                    <button onClick={() => setViewJob(job)} className="flex items-center gap-1 text-[11px] font-bold text-[#2E2C2A] hover:text-[#9E9894] transition-colors"><Eye className="w-3 h-3" /> View</button>
                      <button onClick={() => handleToggleStatus(job)} className={`flex items-center gap-1 text-[11px] font-bold transition-colors ${job.status === 'open' ? 'text-[#92400E] hover:text-[#7C5700]' : 'text-[#2E2C2A] hover:text-[#3B32B0]'}`}>
                        {job.status === 'open' ? <><ToggleLeft className="w-3 h-3" /> Close</> : <><ToggleRight className="w-3 h-3" /> Open</>}
                      </button>
                      <button onClick={() => setConfirmDelete(job)} className="ml-auto flex items-center gap-1 text-[11px] font-bold text-[#DC2626]"><Trash2 className="w-3 h-3" /> Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        <section className="mt-8" data-section="applications">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div><p className="text-xs font-bold uppercase tracking-[0.12em] text-[#E35013]">Hiring workflow</p><h2 className="mt-1 text-xl font-semibold text-[#2E2C2A]">Candidate applications</h2></div>
            <button type="button" onClick={fetchApplications} className="text-sm font-semibold text-[#4F4945] hover:text-[#C94410]">Refresh applications</button>
          </div>
          {applicationsError && <p role="alert" className="mb-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{applicationsError}</p>}
          <Card className="overflow-hidden">
            {applicationsLoading ? <div className="p-8 text-center text-sm text-[#817B77]">Loading applications...</div> : applications.length === 0 ? <div className="p-9 text-center"><Users className="mx-auto size-7 text-[#A7A19D]" /><p className="mt-3 font-semibold text-[#4F4945]">No applications yet</p><p className="mt-1 text-sm text-[#817B77]">Applications to your job postings will appear here.</p></div> : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-left text-sm">
                  <thead><tr className="border-b border-[#E6E2E0] text-[11px] uppercase tracking-wider text-[#817B77]"><th className="px-5 py-3.5">Candidate</th><th className="px-4 py-3.5">Position</th><th className="px-4 py-3.5">Applied</th><th className="px-4 py-3.5">Resume</th><th className="px-5 py-3.5">Review status</th><th className="px-4 py-3.5">Actions</th></tr></thead>
                  <tbody>{applications.map((application) => {
                    const candidate = application.candidateId || {};
                    const job = application.jobId || {};
                    const initials = String(candidate.name || 'C').split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
                    const StatusIcon = STATUS_CONFIG[application.status]?.icon || Clock;
                    return <tr key={application._id} className="border-b border-[#F0EDEA] last:border-0 hover:bg-[#FAF9F8]">
                      <td className="px-5 py-4"><div className="flex items-center gap-3"><span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#FBE9E1] text-xs font-bold text-[#A94118]">{initials}</span><div className="min-w-0"><p className="truncate font-semibold text-[#2E2C2A]">{candidate.name || 'Candidate'}</p><p className="truncate text-xs text-[#817B77]">{candidate.email || ''}</p>{candidate.phone && <p className="truncate text-xs text-[#9E9894] flex items-center gap-1 mt-0.5"><Phone className="w-3 h-3" />{candidate.phone}</p>}</div></div></td>
                      <td className="px-4 py-4"><p className="font-medium text-[#2E2C2A]">{job.title || 'Job removed'}</p><p className="text-xs text-[#817B77]">{job.company || ''}</p></td>
                      <td className="px-4 py-4 text-xs text-[#817B77]">{new Date(application.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-4"><button type="button" onClick={() => setSelectedApplication(application)} className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4F4945] underline underline-offset-2 hover:text-[#C94410]"><Eye className="size-3.5" />View resume</button></td>
                      <td className="px-5 py-4"><div className="flex items-center gap-2"><span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${STATUS_CONFIG[application.status]?.color || 'bg-gray-50 text-gray-700 border-gray-200'}`}><StatusIcon className="w-3.5 h-3.5" />{STATUS_CONFIG[application.status]?.label || application.status}</span></div></td>
                      <td className="px-4 py-4"><div className="flex items-center gap-2"><select value={application.status} disabled={savingApplicationId === application._id || application.status === 'interview'} onChange={(event) => updateApplication(application, event.target.value)} aria-label={`Review status for ${candidate.name || 'candidate'}`} className="min-h-9 rounded-md border border-[#E6E2E0] bg-white px-2.5 pr-8 text-xs font-semibold capitalize text-[#4F4945] disabled:opacity-50">{['submitted', 'reviewing', 'accepted', 'rejected'].map((status) => <option key={status} value={status}>{status}</option>)}{application.status === 'interview' && <option value="interview" disabled>Interview (admin decision)</option>}{application.status === 'interviewed' && <option value="interviewed" disabled>Interviewed</option>}</select></div></td>
                    </tr>;
                  })}</tbody>
                </table>
              </div>
            )}
          </Card>
        </section>

        <section className="mt-8" aria-labelledby="scorecards-heading">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div><p className="text-xs font-bold uppercase tracking-[0.12em] text-[#E35013]">Admin-approved results</p><h2 id="scorecards-heading" className="mt-1 text-xl font-semibold text-[#2E2C2A]">Interview scorecards</h2></div>
            <button type="button" onClick={fetchScorecards} className="text-sm font-semibold text-[#4F4945] hover:text-[#C94410]">Refresh scorecards</button>
          </div>
          {scorecardsError && <p role="alert" className="mb-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{scorecardsError}</p>}
          <Card className="divide-y divide-[#F0EDEA]">
            {scorecards.length === 0
              ? <div className="p-8 text-center text-sm text-[#817B77]">Scorecards will appear here after the admin approves them.</div>
              : scorecards.map((review) => <article key={review._id} className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div><h3 className="font-semibold text-[#2E2C2A]">{review.candidateId?.name || review.candidateName} · {review.jobTitle || review.jobId?.title}</h3><p className="mt-1 text-xs text-[#817B77]">{review.candidateId?.email || ''} · Approved {review.approvedAt ? new Date(review.approvedAt).toLocaleDateString() : ''}</p><span className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${review.interviewOutcome === 'candidate_quit' ? 'bg-amber-50 text-amber-800' : 'bg-green-50 text-green-700'}`}>{review.interviewOutcome === 'candidate_quit' ? 'Candidate quit / ended early' : 'Interview completed'}</span>{review.interviewEndReason && <p className="mt-1 text-xs text-[#817B77]">Reason: {review.interviewEndReason === 'tab_switch_limit' ? 'switched tabs 3 times' : 'left before completing the interview'}</p>}</div>
                  <span className={`rounded-full px-3 py-1 text-sm font-bold ${review.aiScore >= 80 ? 'bg-green-50 text-green-700' : review.aiScore >= 60 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'}`}>{review.aiScore}/100</span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[#4F4945]">{review.aiFeedback}</p>
                {review.transcript?.length > 0 && <details className="mt-3">
                  <summary className="cursor-pointer text-sm font-semibold text-[#4F4945]">View interview transcript</summary>
                  <div className="mt-3 max-h-80 space-y-2 overflow-y-auto rounded-lg bg-[#FAF9F8] p-3">
                    {review.transcript.map((entry, index) => <p key={`${index}-${entry.role}`} className="text-sm leading-relaxed text-[#4F4945]"><strong>{entry.role === 'user' ? 'Candidate' : 'Interviewer'}:</strong> {entry.content}</p>)}
                  </div>
                </details>}
              </article>)}
          </Card>
        </section>
      </div>
    </div>

    <PostJobModal open={isPosting || searchParams.get('postJob') === '1'} formData={formData} onChange={handleChange} onSubmit={handlePostJob} isSubmitting={isSubmitting} error={error} success={success} onClose={closePost} />
    <ViewDetailsModal job={viewJob} onClose={closeView} onToggle={handleToggleStatus} />
    <ConfirmDeleteModal job={confirmDelete} onCancel={closeConfirm} onConfirm={confirmDeleteAction} />
    {selectedApplication && <ApplicationDetailModal application={selectedApplication} onClose={() => setSelectedApplication(null)} onUpdateStatus={updateApplication} saving={savingApplicationId === selectedApplication._id} />}
    </>
  );
}
