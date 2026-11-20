import { useState, useEffect } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { MapPin, Search, Upload, Filter, Bookmark, BookmarkCheck, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { Card, Pill, BtnGreen } from '../components/ui';
import { formatSalary } from '../lib/formatSalary';

export default function Jobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [jobsError, setJobsError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedJob, setSelectedJob] = useState(null);
    const [isApplying, setIsApplying] = useState(false);
    const [resumeText, setResumeText] = useState('');
    const [isParsing, setIsParsing] = useState(false);
    const [isSubmittingApplication, setIsSubmittingApplication] = useState(false);
    const [applicationError, setApplicationError] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const [locationFilter, setLocationFilter] = useState('All');
    const [companyFilter, setCompanyFilter] = useState('All');
    const [sortBy, setSortBy] = useState('relevance');
    const [showFilters, setShowFilters] = useState(false);
    const [typeFilter, setTypeFilter] = useState('All');
    const [savedJobs, setSavedJobs] = useState(() => {
        try { return JSON.parse(localStorage.getItem('savedJobs') || '[]'); } catch { return []; }
    });

    const { user } = useAuth();
    const navigate = useNavigate();
    const [applicationMessage, setApplicationMessage] = useState('');

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await axios.get('/api/jobs');
                setJobs(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                console.error("Failed to fetch live jobs", err);
                setJobsError('Could not load live job postings. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    const toggleSave = (id) => {
        setSavedJobs((prev) => {
            const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
            try { localStorage.setItem('savedJobs', JSON.stringify(next)); } catch {}
            return next;
        });
    };

    const companies = ['All', ...Array.from(new Set(jobs.map((j) => j.company).filter(Boolean)))];
    const locations = ['All', ...Array.from(new Set(jobs.map((j) => (j.location || 'Remote').split(',')[0].trim()).filter(Boolean)))];

    const jobType = (job) => {
        if (job.type) return job.type;
        const loc = (job.location || '').toLowerCase();
        if (loc.includes('remote')) return 'Remote';
        if (loc.includes('part')) return 'Part-time';
        if (loc.includes('intensive')) return 'Intensive';
        return 'Full-time';
    };

    const types = ['All', 'Remote', 'Full-time', 'Part-time', 'Intensive'];

    const filteredJobs = jobs
        .filter((job) => {
            const q = searchTerm.toLowerCase();
            const matchesSearch = !q || (job.title || '').toLowerCase().includes(q) || (job.company || '').toLowerCase().includes(q) || (job.requirements || []).some((r) => r.toLowerCase().includes(q));
            const matchesLocation = locationFilter === 'All' || (job.location || 'Remote').toLowerCase().includes(locationFilter.toLowerCase());
            const matchesCompany = companyFilter === 'All' || job.company === companyFilter;
            const matchesType = typeFilter === 'All' || jobType(job) === typeFilter;
            return matchesSearch && matchesLocation && matchesCompany && matchesType;
        })
        .sort((a, b) => {
            if (sortBy === 'salary') {
                const sa = parseInt((a.salary || '').replace(/[^0-9]/g, '')) || 0;
                const sb = parseInt((b.salary || '').replace(/[^0-9]/g, '')) || 0;
                return sb - sa;
            }
            if (sortBy === 'company') return (a.company || '').localeCompare(b.company || '');
            return 0;
        });

    const handleApply = async (job) => {
      if (!user) {
        navigate('/login', { state: { from: '/jobs' } });
        return;
      }
      if (user.role !== 'candidate') {
        setApplicationError('Only candidate accounts can apply to jobs.');
        return;
      }
      setApplicationError('');
      setApplicationMessage('');
      setIsSubmittingApplication(true);
      try {
        await axios.post(`/api/jobs/${job._id}/applications`, { resumeText });
        setSelectedJob(null);
        setIsApplying(false);
        setApplicationMessage('Application submitted. The admin will review it and approve candidates for an interview.');
      } catch (error) {
        setApplicationError(error.response?.data?.message || 'Could not submit your application. Please try again.');
      } finally {
        setIsSubmittingApplication(false);
      }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleFileUpload = async (file) => {
        if (!file) return;
        setIsParsing(true);

        setResumeText('Parsing document, please wait...');
        const formData = new FormData();
        formData.append('resume', file);

        try {
            const res = await axios.post('/api/upload/resume', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const extracted = res.data?.text;
            if (!extracted || extracted.trim() === '') {
                setResumeText("Error: Selected document appears empty or could not be read. If it's an image-based PDF, please try copy-pasting your text instead.");
            } else {
                setResumeText(extracted);
            }
        } catch (err) {
            console.error("Failed to parse resume:", err);
            const serverMsg = err.response?.data?.message;
            if (serverMsg) {
                setResumeText(serverMsg);
            } else if (err.response?.status) {
                setResumeText(`Server error ${err.response.status}: ${err.response?.data?.error || err.message || 'Upload failed'}`);
            } else {
                setResumeText("Network error — the API server isn't responding. Check that the backend (port 3001) is running, then try again.");
            }
        } finally {
            setIsParsing(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFileUpload(e.dataTransfer.files[0]);
    };

    if (user?.role === 'hr') return <Navigate to="/profile" replace />;
    if (user?.role === 'admin') return <Navigate to="/admin" replace />;

    return (
        <div className="bg-[#F4F2F1] min-h-screen pb-20">
          <div className="max-w-[1280px] mx-auto px-5 lg:px-8 py-8">
            <div className="text-[11px] font-bold uppercase tracking-widest text-[#2E2C2A]">Opportunities</div>
            <h1 className="text-[30px] md:text-[34px] font-extrabold tracking-tight">Roles matched to your Skill DNA</h1>
            {applicationMessage && <p role="status" className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">{applicationMessage} Track your application from your <Link to="/profile" className="font-semibold underline">profile</Link>.</p>}
            <div className="relative max-w-xl mt-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9B98A8]" />
              <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search roles, companies, skills…" className="w-full pl-12 pr-4 py-3.5 bg-white border border-[#E6E2E0] rounded-2xl text-[14.5px] focus:outline-none focus:ring-2 focus:ring-[#2E2C2A]" />
            </div>
            {/* Filter bar */}
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} className="px-3 py-2 rounded-xl border border-[#E6E2E0] bg-white text-[13px] font-semibold text-[#2E2C2A] focus:outline-none">
                {locations.map((l) => <option key={l} value={l}>{l === 'All' ? 'All locations' : l}</option>)}
              </select>
              <select value={companyFilter} onChange={(e) => setCompanyFilter(e.target.value)} className="px-3 py-2 rounded-xl border border-[#E6E2E0] bg-white text-[13px] font-semibold text-[#2E2C2A] focus:outline-none">
                {companies.map((c) => <option key={c} value={c}>{c === 'All' ? 'All companies' : c}</option>)}
              </select>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-3 py-2 rounded-xl border border-[#E6E2E0] bg-white text-[13px] font-semibold text-[#2E2C2A] focus:outline-none">
                <option value="relevance">Sort: Relevance</option>
                <option value="salary">Sort: Salary (high to low)</option>
                <option value="company">Sort: Company (A-Z)</option>
              </select>
              <span className="ml-auto text-[12.5px] font-semibold text-[#9E9894]"><b className="text-[#2E2C2A] tabular">{filteredJobs.length}</b> open roles</span>
            </div>
            {/* Job type chips */}
            <div className="mt-4 flex flex-wrap gap-2">
              {types.map((t) => (
                <button key={t} onClick={() => setTypeFilter(t)} className={`px-4 py-1.5 rounded-full text-[12.5px] font-bold transition-colors ${typeFilter === t ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md' : 'bg-white border border-[#E6E2E0] text-[#4F4945] hover:border-indigo-300'}`}>
                  {t}
                </button>
              ))}
            </div>


            {(locationFilter !== 'All' || companyFilter !== 'All' || searchTerm) && (
              <div className="mt-3 flex flex-wrap gap-2">
                {searchTerm && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[12px] font-semibold">
                    "{searchTerm}" <button onClick={() => setSearchTerm('')}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {locationFilter !== 'All' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[12px] font-semibold">
                    {locationFilter} <button onClick={() => setLocationFilter('All')}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {companyFilter !== 'All' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[12px] font-semibold">
                    {companyFilter} <button onClick={() => setCompanyFilter('All')}><X className="w-3 h-3" /></button>
                  </span>
                )}
                <button onClick={() => { setSearchTerm(''); setLocationFilter('All'); setCompanyFilter('All'); setSortBy('relevance'); }} className="text-[12px] font-semibold text-[#9E9894] hover:text-[#2E2C2A] underline">Clear all</button>
              </div>
            )}

            {loading ? <div className="py-20 text-center text-[#9E9894]">Loading roles…</div> : (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3 items-stretch">
                  {filteredJobs.map((job) => (
                    <Card key={job._id} className="p-4 flex flex-col h-full hover:shadow-md transition-all cursor-pointer border border-[#D9D9D9] rounded-lg bg-white" onClick={() => setSelectedJob(job)}>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-[15px] text-[#2557a7] leading-snug hover:underline">{job.title}</h3>
                        <span className="shrink-0 text-[10px] font-bold text-[#1e8449] bg-[#e8f5e9] px-2 py-0.5 rounded">{String(job.status || 'Open').toUpperCase()}</span>
                      </div>
                      <p className="text-[13px] text-[#4a4a4a] font-medium mt-1">{job.company}</p>
                      <div className="flex items-center gap-1 text-[12px] text-[#767676] mt-1"><MapPin className="w-3.5 h-3.5" /> {job.location || 'Remote'}</div>
                      <div className="text-[12.5px] font-semibold text-[#1e8449] mt-1">{formatSalary(job.salary) || 'Competitive'}</div>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {(job.requirements || []).slice(0, 3).map((r, i) => (
                          <span key={i} className="text-[11px] bg-[#f3f2f1] text-[#4a4a4a] px-2 py-0.5 rounded">{r}</span>
                        ))}
                      </div>
                      <div className="mt-auto pt-3 flex items-center justify-between">
                        <span className={`text-[10.5px] font-bold px-2 py-0.5 rounded-full ${jobType(job) === 'Remote' ? 'bg-emerald-100 text-emerald-700' : jobType(job) === 'Part-time' ? 'bg-amber-100 text-amber-700' : jobType(job) === 'Intensive' ? 'bg-rose-100 text-rose-700' : 'bg-[#f3f2f1] text-[#4a4a4a]'}`}>{jobType(job)}</span>
                        <button onClick={(e) => { e.stopPropagation(); toggleSave(job._id); }} className="w-7 h-7 rounded-full flex items-center justify-center border border-[#D9D9D9] bg-white text-[#767676] hover:text-[#2557a7] hover:border-[#2557a7] transition-colors">
                          {savedJobs.includes(job._id) ? <BookmarkCheck className="w-3.5 h-3.5 text-[#2557a7]" /> : <Bookmark className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <button className="mt-3 w-full bg-[#2557a7] text-white font-bold text-[13px] py-2 rounded hover:bg-[#1e4b8a] transition-colors">View & apply</button>
                    </Card>
                  ))}
                </div>
                {filteredJobs.length === 0 && (
                  <div className="py-20 text-center text-[#9E9894]">
                    {jobsError || (jobs.length === 0 ? 'No live job postings are available right now.' : `No roles match ${searchTerm}. Try a different keyword.`)}
                  </div>
                )}
              </>
            )}
          </div>
          {selectedJob && (
            <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-[#2E2C2A]/60 p-4" onClick={() => { setSelectedJob(null); setIsApplying(false); }}>
              <div className="bg-white rounded-[24px] max-w-[640px] w-full p-6 md:p-8 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-[22px] font-extrabold">{selectedJob.title}</h2>
                <div className="text-[14px] text-[#4F4945] font-semibold">{selectedJob.company}</div>
                <p className="text-[13.5px] text-[#9E9894] mt-3 whitespace-pre-line">{selectedJob.description}</p>
                <div className="flex flex-wrap gap-1.5 mt-3">{(selectedJob.requirements || []).map((r, i) => <span key={i} className="text-[12px] bg-[#F4F2F1] px-2.5 py-1 rounded-full font-semibold">{r}</span>)}</div>
                {!isApplying ? (
                  <button onClick={() => setIsApplying(true)} className="mt-5 w-full bg-[#2E2C2A] text-white font-bold py-3.5 rounded-2xl text-[14px]">Apply for this job</button>
                ) : (
                  <div className="mt-5">
                    <label className="block border-2 border-dashed border-[#D8D5E0] rounded-2xl p-5 text-center cursor-pointer text-[13.5px] font-semibold">
                      <input type="file" className="hidden" accept=".pdf,.docx,.txt" onChange={(e) => handleFileUpload(e.target.files[0])} />
                      <span className="inline-flex items-center gap-2"><Upload className="w-4 h-4" /> {isParsing ? 'Parsing…' : 'Upload resume (PDF/DOCX/TXT)'}</span>
                    </label>
                    <textarea value={resumeText} onChange={(e) => setResumeText(e.target.value)} placeholder="Or paste resume text (min 50 chars)…" className="w-full mt-3 min-h-[120px] border border-[#E6E2E0] rounded-2xl p-4 text-[13.5px] focus:outline-none focus:ring-2 focus:ring-[#2E2C2A]" />
                    {applicationError && <p role="alert" className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{applicationError}</p>}
                    <p className="mt-3 text-xs leading-relaxed text-[#817B77]">The admin reviews applications and selects candidates to continue to an interview.</p>
                    <button disabled={resumeText.trim().length < 50 || isSubmittingApplication || isParsing} onClick={() => handleApply(selectedJob)} className="mt-3 w-full bg-[#2E2C2A] text-white font-bold py-3.5 rounded-xl text-sm disabled:opacity-50">{isSubmittingApplication ? 'Submitting application...' : 'Submit application'}</button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
    );
}
