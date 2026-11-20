import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Card, Pill, Meter, ScoreRing } from '../../components/ui';
import { formatSalary } from '../../lib/formatSalary';
import {
  LayoutDashboard, Users, Briefcase, FileText, BarChart3, Settings, Search, RefreshCw,
  Trash2, ShieldCheck, UserCog, Mail, Calendar, Star, TrendingUp, Activity, Database,
  ChevronLeft, ChevronRight, X, Eye, ToggleLeft, ToggleRight, AlertCircle, CheckCircle2,
  ClipboardList, Phone, User, MessageSquare, Clock, CheckCircle, XCircle, Loader2,
} from 'lucide-react';

const API = '/api/admin';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((msg, tone = 'green') => {
    setToast({ msg, tone });
    setTimeout(() => setToast(null), 2600);
  }, []);

  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const res = await axios.get(`${API}/stats`);
      setStats(res.data);
    } catch (e) {
      showToast(e.response?.data?.message || 'Failed to load stats', 'red');
    } finally {
      setStatsLoading(false);
    }
  }, [showToast]);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  const [users, setUsers] = useState({ items: [], total: 0, page: 1, pages: 1 });
  const [userFilters, setUserFilters] = useState({ search: '', role: 'all', sort: 'newest', page: 1 });
  const [usersLoading, setUsersLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    setUsersLoading(true);
    try {
      const res = await axios.get(`${API}/users`, { params: userFilters });
      setUsers({ items: res.data.users, total: res.data.total, page: res.data.page, pages: res.data.pages });
    } catch (e) {
      showToast(e.response?.data?.message || 'Failed to load users', 'red');
    } finally {
      setUsersLoading(false);
    }
  }, [userFilters, showToast]);

  useEffect(() => {
    if (tab === 'users') fetchUsers();
  }, [tab, fetchUsers]);

  const updateUserRole = async (id, role) => {
    try {
      await axios.patch(`${API}/users/${id}/role`, { role });
      showToast('Role updated');
      fetchUsers();
      fetchStats();
    } catch (e) {
      showToast(e.response?.data?.message || 'Failed to update role', 'red');
    }
  };

  const updateUserApproval = async (id, approved) => {
    try {
      await axios.patch(`${API}/users/${id}/approve`, { approved });
      showToast(approved ? 'User approved' : 'User rejected');
      fetchUsers();
      fetchStats();
    } catch (e) {
      showToast(e.response?.data?.message || 'Failed to update approval', 'red');
    }
  };

  const updateUserPoints = async (id, points) => {
    try {
      await axios.patch(`${API}/users/${id}/points`, { points });
      showToast('Points updated');
      fetchUsers();
    } catch (e) {
      showToast(e.response?.data?.message || 'Failed to update points', 'red');
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user and all related data?')) return;
    try {
      await axios.delete(`${API}/users/${id}`);
      showToast('User deleted');
      fetchUsers();
      fetchStats();
    } catch (e) {
      showToast(e.response?.data?.message || 'Failed to delete user', 'red');
    }
  };

  const [jobs, setJobs] = useState({ items: [], total: 0, page: 1, pages: 1 });
  const [jobFilters, setJobFilters] = useState({ search: '', status: 'all', page: 1 });
  const [jobsLoading, setJobsLoading] = useState(false);

  const fetchJobs = useCallback(async () => {
    setJobsLoading(true);
    try {
      const res = await axios.get(`${API}/jobs`, { params: jobFilters });
      setJobs({ items: res.data.jobs, total: res.data.total, page: res.data.page, pages: res.data.pages });
    } catch (e) {
      showToast(e.response?.data?.message || 'Failed to load jobs', 'red');
    } finally {
      setJobsLoading(false);
    }
  }, [jobFilters, showToast]);

  useEffect(() => {
    if (tab === 'jobs') fetchJobs();
  }, [tab, fetchJobs]);

  const [applications, setApplications] = useState({ items: [], total: 0 });
  const [applicationFilters, setApplicationFilters] = useState({ search: '', status: 'all' });
  const [applicationsLoading, setApplicationsLoading] = useState(false);

  const fetchApplications = useCallback(async () => {
    setApplicationsLoading(true);
    try {
      const response = await axios.get(`${API}/applications`, { params: applicationFilters });
      setApplications({ items: response.data.applications || [], total: response.data.total || 0 });
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to load applications', 'red');
    } finally { setApplicationsLoading(false); }
  }, [applicationFilters, showToast]);

  useEffect(() => { if (tab === 'applications') fetchApplications(); }, [tab, fetchApplications]);

  const updateApplicationStatus = async (applicationId, status) => {
    try {
      await axios.patch(`${API}/applications/${applicationId}`, { status });
      showToast('Application status updated');
      fetchApplications();
      fetchStats();
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to update application', 'red');
    }
  };

  const toggleJobStatus = async (job) => {
    const next = job.status === 'open' ? 'closed' : 'open';
    try {
      await axios.patch(`${API}/jobs/${job._id}/status`, { status: next });
      showToast(`Job ${next}`);
      fetchJobs();
      fetchStats();
    } catch (e) {
      showToast(e.response?.data?.message || 'Failed to update job', 'red');
    }
  };

  const deleteJob = async (id) => {
    if (!window.confirm('Delete this job and its reviews?')) return;
    try {
      await axios.delete(`${API}/jobs/${id}`);
      showToast('Job deleted');
      fetchJobs();
      fetchStats();
    } catch (e) {
      showToast(e.response?.data?.message || 'Failed to delete job', 'red');
    }
  };

  const [reviews, setReviews] = useState({ items: [], total: 0, page: 1, pages: 1 });
  const [reviewSearch, setReviewSearch] = useState('');
  const [reviewPage, setReviewPage] = useState(1);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [activeReview, setActiveReview] = useState(null);

  const fetchReviews = useCallback(async () => {
    setReviewsLoading(true);
    try {
      const res = await axios.get(`${API}/reviews`, { params: { search: reviewSearch, page: reviewPage } });
      setReviews({ items: res.data.reviews, total: res.data.total, page: res.data.page, pages: res.data.pages });
    } catch (e) {
      showToast(e.response?.data?.message || 'Failed to load reviews', 'red');
    } finally {
      setReviewsLoading(false);
    }
  }, [reviewSearch, reviewPage, showToast]);

  useEffect(() => {
    if (tab === 'reviews') fetchReviews();
  }, [tab, fetchReviews]);

  const deleteReview = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await axios.delete(`${API}/reviews/${id}`);
      showToast('Review deleted');
      fetchReviews();
      fetchStats();
    } catch (e) {
      showToast(e.response?.data?.message || 'Failed to delete review', 'red');
    }
  };

  const viewReview = async (id) => {
    try {
      const res = await axios.get(`${API}/reviews/${id}`);
      setActiveReview(res.data);
    } catch (e) {
      showToast(e.response?.data?.message || 'Failed to load review', 'red');
    }
  };

  const updateReviewApproval = async (id, status) => {
    try {
      const response = await axios.patch(`${API}/reviews/${id}/approval`, { status });
      setActiveReview(response.data);
      showToast(status === 'approved' ? 'Scorecard approved and shared with HR' : 'Scorecard rejected');
      fetchReviews();
    } catch (error) {
      showToast(error.response?.data?.message || 'Could not update scorecard approval', 'red');
    }
  };

  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  const fetchAnalytics = useCallback(async () => {
    setAnalyticsLoading(true);
    try {
      const res = await axios.get(`${API}/analytics`);
      setAnalytics(res.data);
    } catch (e) {
      showToast(e.response?.data?.message || 'Failed to load analytics', 'red');
    } finally {
      setAnalyticsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (tab === 'analytics') fetchAnalytics();
  }, [tab, fetchAnalytics]);

  // Admin-only console
  if (user && user.role !== 'admin') {
    return (
      <div className="bg-[#F4F2F1] min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <ShieldCheck className="w-12 h-12 text-[#DC2626] mb-3" />
          <h2 className="text-[20px] font-extrabold text-[#2E2C2A] mb-1">Access denied</h2>
          <p className="text-[#9E9894] text-[13.5px]">Admin Console is restricted to platform administrators.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'jobs', label: 'Jobs', icon: Briefcase },
    { id: 'applications', label: 'Applications', icon: ClipboardList },
    { id: 'reviews', label: 'Reviews', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="bg-[#F4F2F1] min-h-screen pb-20">
      <div className="max-w-[1400px] mx-auto px-5 lg:px-8 py-8">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6 border-b border-[#E6E2E0] pb-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-[#9E9894] hover:bg-[#F4F2F1] rounded-lg transition-colors" aria-label="Toggle sidebar">
              <span className="w-5 h-0.5 bg-[#2E2C2A] mb-1.5 block"></span>
              <span className="w-5 h-0.5 bg-[#2E2C2A] mb-1.5 block"></span>
              <span className="w-5 h-0.5 bg-[#2E2C2A] block"></span>
            </button>
            <div>
              <div className="text-[11px] font-bold tracking-[0.16em] uppercase text-[#2E2C2A]">Admin Console</div>
              <h1 className="text-[30px] md:text-[34px] font-extrabold tracking-tight text-[#2E2C2A]">Platform control center</h1>
              <p className="text-[#9E9894] text-[14px] mt-1">Manage users, jobs, interviews and platform health.</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="hidden md:flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#D1FAE5] text-[#065f46] text-[10px] font-bold border border-[#BBF7D0]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#065f46]" /> API: online
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#D1FAE5] text-[#065f46] text-[10px] font-bold border border-[#BBF7D0]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#065f46]" /> DB: connected
              </span>
            </div>
            <span className="inline-flex items-center gap-2 bg-white border border-[#E6E2E0] rounded-full px-4 py-2 text-[13px] font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#2E2C2A]" /> {user?.name || 'Admin'}
            </span>
            <button onClick={() => { fetchStats(); if (tab === 'users') fetchUsers(); if (tab === 'jobs') fetchJobs(); if (tab === 'applications') fetchApplications(); if (tab === 'reviews') fetchReviews(); if (tab === 'analytics') fetchAnalytics(); }}
              className="inline-flex items-center gap-2 bg-[#2E2C2A] text-white font-bold text-[13px] px-4 py-2 rounded-full">
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
          </div>
        </div>

        <div className="flex gap-6">
          <aside className={`relative z-10 flex-shrink-0 ${sidebarOpen ? 'w-[250px]' : 'w-[64px]'} transition-all duration-300 ease-in-out bg-white border-r border-[#E6E2E0] rounded-[24px] p-3 h-fit sticky top-24 shadow-sm`}>
            <div className="flex items-center gap-2.5 px-2 mb-6">
              <div className="w-8 h-8 rounded-xl bg-[#2E2C2A] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div className={`font-bold text-[15px] tracking-tight text-[#2E2C2A] transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`}>Admin</div>
            </div>
            <nav className="space-y-0.5">
              {tabs.map(t => {
                const Icon = t.icon;
                const active = tab === t.id;
                return (
                  <button key={t.id} onClick={() => { setTab(t.id); if (!sidebarOpen) setSidebarOpen(false); }}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13.5px] font-semibold transition-all ${active ? 'bg-[#2E2C2A] text-white' : 'text-[#9E9894] hover:bg-[#F4F2F1] hover:text-[#2E2C2A]'}`}>
                    <div className={`w-7 h-7 flex items-center justify-center rounded-lg ${active ? 'bg-[#F4F2F1]' : ''}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`font-medium transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`}>{t.label}</span>
                  </button>
                );
              })}
            </nav>
            <div className={`mt-5 pt-4 border-t border-[#E6E2E0] text-[11px] text-[#9E9894] transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
              <div className="font-bold text-[#2E2C2A] mb-2 tracking-[0.1em] uppercase">System</div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a]" />
                <span>API: online</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a]" />
                <span>DB: connected</span>
              </div>
            </div>
          </aside>

          <main className="min-w-0 flex-1">
            {tab === 'overview' && <OverviewTab stats={stats} loading={statsLoading} onNavigate={setTab} />}
            {tab === 'users' && (
              <UsersTab users={users} filters={userFilters} setFilters={setUserFilters}
                loading={usersLoading} onRoleChange={updateUserRole}
                onPointsChange={updateUserPoints} onApprove={updateUserApproval}
                onDelete={deleteUser} />
            )}
            {tab === 'jobs' && (
              <JobsTab jobs={jobs} filters={jobFilters} setFilters={setJobFilters}
                loading={jobsLoading} onToggle={toggleJobStatus} onDelete={deleteJob} />
            )}
            {tab === 'applications' && <ApplicationsTab applications={applications} filters={applicationFilters} setFilters={setApplicationFilters} loading={applicationsLoading} onStatusChange={updateApplicationStatus} />}
            {tab === 'reviews' && (
              <ReviewsTab reviews={reviews} search={reviewSearch} setSearch={setReviewSearch}
                setPage={setReviewPage} loading={reviewsLoading}
                onView={viewReview} onDelete={deleteReview} />
            )}
            {tab === 'analytics' && <AnalyticsTab analytics={analytics} loading={analyticsLoading} />}
            {tab === 'settings' && <SettingsTab user={user} />}
          </main>
        </div>
      </div>

      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-[13.5px] font-semibold flex items-center gap-2 ${toast.tone === 'red' ? 'bg-[#DC2626] text-white' : 'bg-[#2E2C2A] text-white'}`}>
          {toast.tone === 'red' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4 text-[#2E2C2A]" />}
          {toast.msg}
        </div>
      )}

      {activeReview && <ReviewModal review={activeReview} onClose={() => setActiveReview(null)} onApprovalChange={updateReviewApproval} />}
    </div>
  );
}

function OverviewTab({ stats, loading, onNavigate }) {
  if (loading || !stats) {
    return <div className="text-[#9E9894]">Loading overviewâ€¦</div>;
  }
  const kpis = [
    { label: 'Total Users', value: stats.users.total, tone: 'ink', icon: Users },
    { label: 'Candidates', value: stats.users.byRole?.candidate || 0, tone: 'mint', icon: Users },
    { label: 'Recruiters', value: stats.users.byRole?.hr || 0, tone: 'blue', icon: Briefcase },
    { label: 'Admins', value: stats.users.byRole?.admin || 0, tone: 'amber', icon: ShieldCheck },
    { label: 'Total Jobs', value: stats.jobs.total, tone: 'ink', icon: Briefcase },
    { label: 'Open Jobs', value: stats.jobs.byStatus?.open || 0, tone: 'mint', icon: ToggleRight },
    { label: 'Applications', value: stats.applications?.total || 0, tone: 'blue', icon: ClipboardList },
    { label: 'Reviews', value: stats.reviews.total, tone: 'blue', icon: FileText },
    { label: 'Avg AI Score', value: `${stats.reviews.avgScore}%`, tone: 'amber', icon: Star },
  ];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {kpis.map(k => {
          const Icon = k.icon;
          return (
            <Card key={k.label} className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-[11.5px] font-semibold text-[#9E9894]">{k.label}</div>
                <Icon className="w-4 h-4 text-[#4F4945]" />
              </div>
              <div className="text-[26px] font-extrabold tabular text-[#2E2C2A] mt-1">{k.value}</div>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-extrabold text-[17px]">Recent users</h2>
            <button onClick={() => onNavigate('users')} className="text-[12.5px] font-bold text-[#2E2C2A]">Manage â†’</button>
          </div>
          <div className="space-y-2">
            {stats.users.recent.map(u => (
              <div key={u.id} className="flex items-center justify-between py-2 border-b border-[#F4F2F1] last:border-0">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-full bg-[#4F4945] text-white flex items-center justify-center text-[12px] font-bold">{String(u.name || 'U').charAt(0)}</span>
                  <div>
                    <div className="font-bold text-[13.5px]">{u.name}</div>
                    <div className="text-[12px] text-[#9E9894]">{u.email}</div>
                  </div>
                </div>
                <Pill tone={u.role === 'admin' ? 'dark' : u.role === 'hr' ? 'blue' : 'green'}>{u.role}</Pill>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-extrabold text-[17px] mb-4">Quick actions</h2>
          <div className="space-y-2">
            {[
              { label: 'Manage users', tab: 'users' },
              { label: 'Review jobs', tab: 'jobs' },
              { label: 'Inspect interviews', tab: 'reviews' },
              { label: 'View analytics', tab: 'analytics' },
            ].map(a => (
              <button key={a.tab} onClick={() => onNavigate(a.tab)}
                className="w-full text-left px-4 py-3 rounded-xl bg-[#F4F2F1] hover:bg-[#F4F2F1] font-semibold text-[13.5px] transition-all">
                {a.label}
              </button>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-[#E6E2E0] text-[12.5px] text-[#9E9894]">
            Total skill points issued: <b className="text-[#2E2C2A]">{stats.totalPoints}</b>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-extrabold text-[17px]">Recent jobs</h2>
            <button onClick={() => onNavigate('jobs')} className="text-[12.5px] font-bold text-[#2E2C2A]">Manage â†’</button>
          </div>
          <div className="space-y-2">
            {stats.jobs.recent.map(j => (
              <div key={j.id} className="flex items-center justify-between py-2 border-b border-[#F4F2F1] last:border-0">
                <div>
                  <div className="font-bold text-[13.5px]">{j.title}</div>
                  <div className="text-[12px] text-[#9E9894]">{j.company}</div>
                </div>
                <Pill tone={j.status === 'open' ? 'green' : 'gray'}>{j.status}</Pill>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-extrabold text-[17px]">Recent reviews</h2>
            <button onClick={() => onNavigate('reviews')} className="text-[12.5px] font-bold text-[#2E2C2A]">Inspect â†’</button>
          </div>
          <div className="space-y-2">
            {stats.reviews.recent.map(r => (
              <div key={r.id} className="flex items-center justify-between py-2 border-b border-[#F4F2F1] last:border-0">
                <div>
                  <div className="font-bold text-[13.5px]">{r.candidateName}</div>
                  <div className="text-[12px] text-[#9E9894]">{r.jobTitle}</div>
                </div>
                <Pill tone={r.aiScore >= 80 ? 'green' : r.aiScore >= 60 ? 'amber' : 'red'}>{r.aiScore}/100</Pill>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function GraduationCapIcon(props) {
  return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>;
}

function UsersTab({ users, filters, setFilters, loading, onRoleChange, onPointsChange, onApprove, onDelete }) {
  const [editingPoints, setEditingPoints] = useState(null);
  const [pointsDraft, setPointsDraft] = useState('');

  const updateFilter = (patch) => setFilters(f => ({ ...f, ...patch, page: patch.page ?? 1 }));

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex-1 min-w-[220px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9B98A8]" />
            <input value={filters.search} onChange={e => updateFilter({ search: e.target.value })}
              placeholder="Search by name or emailâ€¦" className="w-full pl-9 pr-3 py-2.5 bg-[#F4F2F1] border border-[#E6E2E0] rounded-xl text-[13.5px]" />
          </div>
          <select value={filters.role} onChange={e => updateFilter({ role: e.target.value })}
            className="px-3 py-2.5 bg-[#F4F2F1] border border-[#E6E2E0] rounded-xl text-[13.5px] font-semibold">
            <option value="all">All roles</option>
            <option value="candidate">Candidate</option>
            <option value="hr">HR / Recruiter</option>
            <option value="admin">Admin</option>
          </select>
          <select value={filters.sort} onChange={e => updateFilter({ sort: e.target.value })}
            className="px-3 py-2.5 bg-[#F4F2F1] border border-[#E6E2E0] rounded-xl text-[13.5px] font-semibold">
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="name">Name A-Z</option>
            <option value="points">Points</option>
          </select>
          <div className="text-[12.5px] text-[#9E9894] font-semibold">{users.total} users</div>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13.5px] min-w-[800px]">
            <thead><tr className="border-b border-[#E6E2E0] text-[11.5px] uppercase tracking-wider text-[#9E9894]">
              <th className="px-5 py-3.5">User</th>
              <th className="px-4 py-3.5">Role</th>
              <th className="px-4 py-3.5">Approval</th>
              <th className="px-4 py-3.5">Points</th>
              <th className="px-4 py-3.5">Joined</th>
              <th className="px-5 py-3.5">Actions</th>
            </tr></thead>
            <tbody>
              {loading && <tr><td colSpan={5} className="px-5 py-8 text-center text-[#9E9894]">Loadingâ€¦</td></tr>}
              {!loading && users.items.length === 0 && <tr><td colSpan={5} className="px-5 py-8 text-center text-[#9E9894]">No users found.</td></tr>}

              {users.items.map(u => (
                <tr key={u._id} className="border-b border-[#F4F2F1] hover:bg-[#F4F2F1]">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <span className="w-9 h-9 rounded-full bg-[#4F4945] text-white flex items-center justify-center text-[12px] font-bold">{String(u.name || 'U').charAt(0)}</span>
                      <div>
                        <div className="font-bold text-[#2E2C2A]">{u.name}</div>
                        <div className="text-[12px] text-[#9E9894]">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <select value={u.role} onChange={e => onRoleChange(u._id, e.target.value)}
                      className="px-2.5 py-1.5 bg-white border border-[#D9E0DC] rounded-lg text-[12.5px] font-semibold">
                      <option value="candidate">Candidate</option>
                      <option value="hr">HR</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-4 py-3.5">
                    {u.isApproved === false ? (
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#92400E] text-[10px] font-bold">Pending</span>
                        <div className="flex items-center gap-1">
                          <button onClick={() => onApprove(u._id, true)} className="text-[10px] font-bold text-[#2E2C2A] hover:text-[#15803d]">Approve</button>
                          <button onClick={() => onApprove(u._id, false)} className="text-[10px] font-bold text-[#DC2626] hover:text-[#991b1b]">Reject</button>
                        </div>
                      </div>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-[#D1FAE5] text-[#065f46] text-[10px] font-bold">Approved</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    {editingPoints === u._id ? (
                      <div className="flex items-center gap-1">
                        <input type="number" value={pointsDraft} onChange={e => setPointsDraft(e.target.value)}
                          className="w-20 px-2 py-1 border border-[#D9E0DC] rounded-lg text-[12.5px]" />
                        <button onClick={() => { onPointsChange(u._id, Number(pointsDraft)); setEditingPoints(null); }}
                          className="text-[11px] font-bold text-[#2E2C2A]">Save</button>
                        <button onClick={() => setEditingPoints(null)} className="text-[11px] font-bold text-[#9E9894]">✕</button>
                      </div>
                    ) : (
                      <button onClick={() => { setEditingPoints(u._id); setPointsDraft(u.points || 0); }}
                        className="font-bold tabular text-[#2E2C2A] hover:text-[#2E2C2A]">{u.points || 0}</button>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-[12.5px] text-[#9E9894]">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'â€”'}</td>
                  <td className="px-5 py-3.5">
                    <button onClick={() => onDelete(u._id)} className="inline-flex items-center gap-1 text-[11.5px] font-bold text-[#DC2626] hover:text-[#9A3412]">
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.pages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-[#E6E2E0]">
            <button disabled={users.page <= 1} onClick={() => updateFilter({ page: users.page - 1 })}
              className="inline-flex items-center gap-1 text-[12.5px] font-bold text-[#9E9894] disabled:opacity-40">
              <ChevronLeft className="w-4 h-4" /> Prev
            </button>
            <span className="text-[12.5px] text-[#9E9894]">Page {users.page} of {users.pages}</span>
            <button disabled={users.page >= users.pages} onClick={() => updateFilter({ page: users.page + 1 })}
              className="inline-flex items-center gap-1 text-[12.5px] font-bold text-[#9E9894] disabled:opacity-40">
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </Card>
    </div>
  );
}

function JobsTab({ jobs, filters, setFilters, loading, onToggle, onDelete }) {
  const updateFilter = (patch) => setFilters(f => ({ ...f, ...patch, page: patch.page ?? 1 }));
  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex-1 min-w-[220px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9B98A8]" />
            <input value={filters.search} onChange={e => updateFilter({ search: e.target.value })}
              placeholder="Search by title or companyâ€¦" className="w-full pl-9 pr-3 py-2.5 bg-[#F4F2F1] border border-[#E6E2E0] rounded-xl text-[13.5px]" />
          </div>
          <select value={filters.status} onChange={e => updateFilter({ status: e.target.value })}
            className="px-3 py-2.5 bg-[#F4F2F1] border border-[#E6E2E0] rounded-xl text-[13.5px] font-semibold">
            <option value="all">All statuses</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
          <div className="text-[12.5px] text-[#9E9894] font-semibold">{jobs.total} jobs</div>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13.5px] min-w-[900px]">
            <thead><tr className="border-b border-[#E6E2E0] text-[11.5px] uppercase tracking-wider text-[#9E9894]">
              <th className="px-5 py-3.5">Job</th>
              <th className="px-4 py-3.5">Posted by</th>
              <th className="px-4 py-3.5">Status</th>
              <th className="px-4 py-3.5">Created</th>
              <th className="px-5 py-3.5">Actions</th>
            </tr></thead>
            <tbody>
              {loading && <tr><td colSpan={5} className="px-5 py-8 text-center text-[#9E9894]">Loadingâ€¦</td></tr>}
              {!loading && jobs.items.length === 0 && <tr><td colSpan={5} className="px-5 py-8 text-center text-[#9E9894]">No jobs found.</td></tr>}
              {jobs.items.map(j => (
                <tr key={j._id} className="border-b border-[#F4F2F1] hover:bg-[#F4F2F1]">
                  <td className="px-5 py-3.5">
                    <div className="font-bold text-[#2E2C2A]">{j.title}</div>
                    <div className="text-[12px] text-[#9E9894]">{j.company} Â· {j.location || 'Remote'} Â· {formatSalary(j.salary) || 'â€”'}</div>
                  </td>
                  <td className="px-4 py-3.5 text-[12.5px]">
                    <div className="font-semibold">{j.hrRef?.name || 'â€”'}</div>
                    <div className="text-[#9E9894]">{j.hrRef?.email || ''}</div>
                  </td>
                  <td className="px-4 py-3.5">
                    <Pill tone={j.status === 'open' ? 'green' : 'gray'}>{j.status}</Pill>
                  </td>
                  <td className="px-4 py-3.5 text-[12.5px] text-[#9E9894]">{j.createdAt ? new Date(j.createdAt).toLocaleDateString() : 'â€”'}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <button onClick={() => onToggle(j)} className="inline-flex items-center gap-1 text-[11.5px] font-bold text-[#4F4945] hover:text-[#2E2C2A]">
                        {j.status === 'open' ? <><ToggleLeft className="w-3.5 h-3.5" /> Close</> : <><ToggleRight className="w-3.5 h-3.5" /> Open</>}
                      </button>
                      <button onClick={() => onDelete(j._id)} className="inline-flex items-center gap-1 text-[11.5px] font-bold text-[#DC2626]">
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {jobs.pages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-[#E6E2E0]">
            <button disabled={jobs.page <= 1} onClick={() => updateFilter({ page: jobs.page - 1 })}
              className="inline-flex items-center gap-1 text-[12.5px] font-bold text-[#9E9894] disabled:opacity-40">
              <ChevronLeft className="w-4 h-4" /> Prev
            </button>
            <span className="text-[12.5px] text-[#9E9894]">Page {jobs.page} of {jobs.pages}</span>
            <button disabled={jobs.page >= jobs.pages} onClick={() => updateFilter({ page: jobs.page + 1 })}
              className="inline-flex items-center gap-1 text-[12.5px] font-bold text-[#9E9894] disabled:opacity-40">
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </Card>
    </div>
  );
}

function ApplicationsTab({ applications, filters, setFilters, loading, onStatusChange }) {
  const [selected, setSelected] = useState(null);
  const [hrNote, setHrNote] = useState('');
  const updateFilter = (patch) => setFilters((current) => ({ ...current, ...patch }));

  const STATUS_CONFIG = {
    submitted: { label: 'Submitted', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    reviewing: { label: 'Reviewing', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
    interview: { label: 'Interview', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    interviewed: { label: 'Interviewed', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    accepted: { label: 'Accepted', color: 'bg-green-50 text-green-700 border-green-200' },
    rejected: { label: 'Rejected', color: 'bg-red-50 text-red-700 border-red-200' },
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[220px] flex-1"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#817B77]" /><input value={filters.search} onChange={(event) => updateFilter({ search: event.target.value })} placeholder="Search candidate, job, or HR owner" className="w-full rounded-lg border border-[#E6E2E0] bg-[#FAF9F8] py-2.5 pl-9 pr-3 text-sm" /></div>
          <select value={filters.status} onChange={(event) => updateFilter({ status: event.target.value })} className="min-h-10 rounded-lg border border-[#E6E2E0] bg-white px-3 text-sm font-medium text-[#4F4945]"><option value="all">All statuses</option>{['submitted', 'reviewing', 'interview', 'interviewed', 'accepted', 'rejected'].map((status) => <option key={status} value={status}>{status}</option>)}</select>
          <span className="text-xs font-semibold text-[#817B77]">{applications.total} applications</span>
        </div>
        <p className="mt-3 text-xs text-[#817B77]">Set an application to Interview to authorize the candidate’s quiz and AI interview. Completed scorecards remain private until approved.</p>
      </Card>
      <Card className="overflow-hidden">
        {loading ? <div className="p-8 text-center text-sm text-[#817B77]">Loading applications...</div> : applications.items.length === 0 ? <div className="p-8 text-center text-sm text-[#817B77]">No applications match these filters.</div> : <div className="overflow-x-auto"><table className="w-full min-w-[1000px] text-left text-sm">
          <thead><tr className="border-b border-[#E6E2E0] text-[11px] uppercase tracking-wider text-[#817B77]"><th className="px-5 py-3.5">Candidate</th><th className="px-4 py-3.5">Job</th><th className="px-4 py-3.5">Hiring owner</th><th className="px-4 py-3.5">Applied</th><th className="px-4 py-3.5">Resume</th><th className="px-5 py-3.5">Status</th><th className="px-4 py-3.5">Actions</th></tr></thead>
          <tbody>{applications.items.map((application) => {
            const candidate = application.candidateId || {};
            const job = application.jobId || {};
            const statusConfig = STATUS_CONFIG[application.status] || STATUS_CONFIG.submitted;
            return <tr key={application._id} className="border-b border-[#F0EDEA] last:border-0 hover:bg-[#FAF9F8]">
              <td className="px-5 py-4"><div className="font-semibold text-[#2E2C2A]">{candidate.name || 'Candidate'}</div><div className="text-xs text-[#817B77]">{candidate.email}</div>{candidate.phone && <div className="text-xs text-[#9E9894] mt-0.5 flex items-center gap-1"><Phone className="w-3 h-3" />{candidate.phone}</div>}</td>
              <td className="px-4 py-4"><div className="font-medium text-[#2E2C2A]">{job.title || 'Job removed'}</div><div className="text-xs text-[#817B77]">{job.company || ''}</div></td>
              <td className="px-4 py-4 text-xs text-[#6B6561]">{job.hrRef?.name || 'HR account'}<div className="text-[#817B77]">{job.hrRef?.email || ''}</div></td>
              <td className="px-4 py-4 text-xs text-[#817B77]">{application.createdAt ? new Date(application.createdAt).toLocaleDateString() : ''}</td>
              <td className="px-4 py-4"><button type="button" onClick={() => { setSelected(application); setHrNote(application.hrNote || ''); }} className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4F4945] underline underline-offset-2"><Eye className="size-3.5" />View</button></td>
              <td className="px-5 py-4"><span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${statusConfig.color}`}>{statusConfig.label}</span></td>
              <td className="px-4 py-4"><select value={application.status} onChange={(event) => onStatusChange(application._id, event.target.value)} aria-label={`Application status for ${candidate.name || 'candidate'}`} className="min-h-9 rounded-md border border-[#E6E2E0] bg-white px-2.5 text-xs font-semibold capitalize text-[#4F4945]">{['submitted', 'reviewing', 'interview', 'interviewed', 'accepted', 'rejected'].map((status) => <option key={status} value={status}>{status}</option>)}</select></td>
            </tr>;
          })}</tbody>
        </table></div>}
      </Card>
      {selected && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#211F1D]/55 p-4" onClick={() => setSelected(null)}>
          <section role="dialog" aria-modal="true" aria-labelledby="admin-application-heading" className="max-h-[90vh] w-full max-w-[720px] overflow-hidden rounded-2xl border border-[#E6E2E0] bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[#E6E2E0] px-6 py-4 bg-[#F4F2F1]">
              <div><p className="text-xs font-bold uppercase tracking-wider text-[#E35013]">Application Review</p><h2 id="admin-application-heading" className="mt-1 font-bold text-lg text-[#2E2C2A]">{selected.candidateId?.name || 'Candidate'} · {selected.jobId?.title || 'Job'}</h2></div>
              <button type="button" onClick={() => setSelected(null)} aria-label="Close resume" className="rounded-md p-2 text-[#817B77] hover:bg-white"><X className="size-5" /></button>
            </div>
            <div className="max-h-[calc(90vh-80px)] overflow-y-auto p-6 space-y-5">
              <div className="bg-white border border-[#E6E2E0] rounded-xl p-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#9E9894] mb-3 flex items-center gap-2"><User className="w-4 h-4" /> Candidate Information</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-sm"><Mail className="w-4 h-4 text-[#817B77]" /><span className="text-[#4F4945]">{selected.candidateId?.email || 'Not provided'}</span></div>
                  <div className="flex items-center gap-2 text-sm"><Phone className="w-4 h-4 text-[#817B77]" /><span className="text-[#4F4945]">{selected.candidateId?.phone || 'Not provided'}</span></div>
                </div>
                {selected.candidateId?.skills && selected.candidateId.skills.length > 0 && <div className="mt-3 flex flex-wrap gap-1.5">{selected.candidateId.skills.map((skill, i) => <span key={i} className="text-xs px-2 py-1 rounded-full bg-[#F4F2F1] text-[#4F4945] font-medium">{skill}</span>)}</div>}
              </div>
              <div className="bg-white border border-[#E6E2E0] rounded-xl p-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#9E9894] mb-3 flex items-center gap-2"><Briefcase className="w-4 h-4" /> Position Applied</h3>
                <p className="font-bold text-[#2E2C2A]">{selected.jobId?.title || 'Position removed'}</p>
                <p className="text-sm text-[#817B77]">{selected.jobId?.company || ''}</p>
                <p className="text-xs text-[#9E9894] mt-1">Posted by: {selected.jobId?.hrRef?.name || 'HR'} ({selected.jobId?.hrRef?.email || ''})</p>
              </div>
              <div className="bg-white border border-[#E6E2E0] rounded-xl p-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#9E9894] mb-3 flex items-center gap-2"><FileText className="w-4 h-4" /> Resume / Cover Letter</h3>
                <pre className="whitespace-pre-wrap break-words rounded-lg bg-[#FAF9F8] p-4 font-sans text-sm leading-relaxed text-[#4F4945] max-h-[300px] overflow-y-auto">{selected.resumeText}</pre>
              </div>
              <div className="bg-white border border-[#E6E2E0] rounded-xl p-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#9E9894] mb-3 flex items-center gap-2"><MessageSquare className="w-4 h-4" /> HR Notes</h3>
                <div className="text-sm text-[#4F4945]">{hrNote || 'No notes added yet.'}</div>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

function ReviewsTab({ reviews, search, setSearch, setPage, loading, onView, onDelete }) {
  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex-1 min-w-[220px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9B98A8]" />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by candidate or jobâ€¦" className="w-full pl-9 pr-3 py-2.5 bg-[#F4F2F1] border border-[#E6E2E0] rounded-xl text-[13.5px]" />
          </div>
          <div className="text-[12.5px] text-[#9E9894] font-semibold">{reviews.total} reviews</div>
        </div>
        <p className="mt-3 text-xs text-[#817B77]">Review each scorecard and approve it to share the score and transcript with its HR owner.</p>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13.5px] min-w-[900px]">
            <thead><tr className="border-b border-[#E6E2E0] text-[11.5px] uppercase tracking-wider text-[#9E9894]">
              <th className="px-5 py-3.5">Candidate</th>
              <th className="px-4 py-3.5">Job</th>
              <th className="px-4 py-3.5">Score</th>
              <th className="px-4 py-3.5">Interview</th>
              <th className="px-4 py-3.5">Approval</th>
              <th className="px-4 py-3.5">Feedback</th>
              <th className="px-4 py-3.5">Date</th>
              <th className="px-5 py-3.5">Actions</th>
            </tr></thead>
            <tbody>
              {loading && <tr><td colSpan={8} className="px-5 py-8 text-center text-[#9E9894]">Loadingâ€¦</td></tr>}
              {!loading && reviews.items.length === 0 && <tr><td colSpan={8} className="px-5 py-8 text-center text-[#9E9894]">No reviews found.</td></tr>}
              {reviews.items.map(r => (
                <tr key={r._id} className="border-b border-[#F4F2F1] hover:bg-[#F4F2F1]">
                  <td className="px-5 py-3.5">
                    <div className="font-bold text-[#2E2C2A]">{r.candidateName || r.candidateId?.name || 'Candidate'}</div>
                    <div className="text-[12px] text-[#9E9894]">{r.candidateId?.email || ''}</div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="font-semibold">{r.jobTitle || r.jobId?.title || 'â€”'}</div>
                    <div className="text-[12px] text-[#9E9894]">{r.jobId?.company || ''}</div>
                  </td>
                  <td className="px-4 py-3.5">
                    <Pill tone={r.aiScore >= 80 ? 'green' : r.aiScore >= 60 ? 'amber' : 'red'}>{r.aiScore}/100</Pill>
                  </td>
                  <td className="px-4 py-3.5"><Pill tone={r.interviewOutcome === 'candidate_quit' ? 'amber' : 'green'}>{r.interviewOutcome === 'candidate_quit' ? 'Candidate quit' : 'Completed'}</Pill>{r.interviewEndReason && <div className="mt-1 max-w-48 text-xs text-[#817B77]">{r.interviewEndReason === 'tab_switch_limit' ? 'Switched tabs 3 times' : 'Left before completion'}</div>}</td>
                  <td className="px-4 py-3.5"><Pill tone={r.status === 'approved' ? 'green' : r.status === 'rejected' ? 'red' : 'amber'}>{r.status || 'pending'}</Pill></td>
                  <td className="px-4 py-3.5 text-[12.5px] text-[#9E9894] max-w-[260px] truncate">{r.aiFeedback}</td>
                  <td className="px-4 py-3.5 text-[12.5px] text-[#9E9894]">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'â€”'}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <button onClick={() => onView(r._id)} className="inline-flex items-center gap-1 text-[11.5px] font-bold text-[#2E2C2A]">
                        <Eye className="w-3.5 h-3.5" /> View
                      </button>
                      <button onClick={() => onDelete(r._id)} className="inline-flex items-center gap-1 text-[11.5px] font-bold text-[#DC2626]">
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {reviews.pages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-[#E6E2E0]">
            <button disabled={reviews.page <= 1} onClick={() => setPage(reviews.page - 1)}
              className="inline-flex items-center gap-1 text-[12.5px] font-bold text-[#9E9894] disabled:opacity-40">
              <ChevronLeft className="w-4 h-4" /> Prev
            </button>
            <span className="text-[12.5px] text-[#9E9894]">Page {reviews.page} of {reviews.pages}</span>
            <button disabled={reviews.page >= reviews.pages} onClick={() => setPage(reviews.page + 1)}
              className="inline-flex items-center gap-1 text-[12.5px] font-bold text-[#9E9894] disabled:opacity-40">
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </Card>
    </div>
  );
}

function ReviewModal({ review, onClose, onApprovalChange }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2E2C2A]/60">
      <div className="bg-white rounded-[22px] w-full max-w-[760px] max-h-[85vh] overflow-hidden shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E6E2E0]">
          <div>
            <div className="font-bold text-[15px] text-[#2E2C2A]">Interview review</div>
            <div className="text-[12.5px] text-[#9E9894]">{review.candidateName || review.candidateId?.name} Â· {review.jobTitle || review.jobId?.title}</div>
          </div>
          <button onClick={onClose} className="text-[#9E9894] p-1"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 overflow-y-auto space-y-4">
          <div><Pill tone={review.interviewOutcome === 'candidate_quit' ? 'amber' : 'green'}>{review.interviewOutcome === 'candidate_quit' ? 'Candidate quit / ended early' : 'Interview completed'}</Pill>{review.interviewEndReason && <p className="mt-1 text-sm text-[#817B77]">{review.interviewEndReason === 'tab_switch_limit' ? 'Reason: candidate switched tabs 3 times.' : 'Reason: candidate left before completing the interview.'}</p>}</div>
          <div className="flex items-center gap-4">
            <ScoreRing value={review.aiScore || 0} size={90} label="Score" />
            <div className="flex-1">
              <div className="text-[11px] font-bold uppercase tracking-widest text-[#2E2C2A]">AI Feedback</div>
              <p className="text-[13.5px] text-[#9E9894] mt-1 leading-relaxed">{review.aiFeedback}</p>
            </div>
          </div>
          {review.transcript && review.transcript.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-widest text-[#2E2C2A] mb-2">Transcript</div>
              <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                {review.transcript.map((t, i) => (
                  <div key={i} className={`rounded-xl p-3 text-[12.5px] leading-relaxed ${t.role === 'user' ? 'bg-[#4F4945] text-white ml-6' : 'bg-[#F4F2F1] text-[#4F4945]'}`}>
                    <span className="font-bold">{t.role === 'user' ? 'Candidate' : 'AI'}: </span>{t.content}
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="grid md:grid-cols-2 gap-3 text-[12.5px]">
            <div className="bg-[#F4F2F1] rounded-xl p-3">
              <div className="font-bold text-[#2E2C2A]">Candidate</div>
              <div>{review.candidateId?.name || review.candidateName}</div>
              <div className="text-[#9E9894]">{review.candidateId?.email}</div>
            </div>
            <div className="bg-[#F4F2F1] rounded-xl p-3">
              <div className="font-bold text-[#2E2C2A]">Recruiter</div>
              <div>{review.hrId?.name || 'â€”'}</div>
              <div className="text-[#9E9894]">{review.hrId?.email}</div>
            </div>
          </div>
          {review.status !== 'approved' && <div className="flex justify-end gap-3 border-t border-[#E6E2E0] p-4">
            <button type="button" onClick={() => onApprovalChange(review._id, 'rejected')} className="min-h-10 rounded-lg border border-red-200 px-4 text-sm font-semibold text-red-700">Reject scorecard</button>
            <button type="button" onClick={() => onApprovalChange(review._id, 'approved')} className="min-h-10 rounded-lg bg-[#2E2C2A] px-4 text-sm font-semibold text-white">Approve and share with HR</button>
          </div>}
        </div>
      </div>
    </div>
  );
}

function AnalyticsTab({ analytics, loading }) {
  if (loading || !analytics) return <div className="text-[#9E9894]">Loading analyticsâ€¦</div>;
  const maxGrowth = Math.max(1, ...analytics.userGrowth.map(d => d.count));
  const maxBucket = Math.max(1, ...analytics.scoreDistribution.map(d => d.count));
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          ['Users', analytics.totals.users],
          ['Jobs', analytics.totals.jobs],
          ['Reviews', analytics.totals.reviews],
          ['Points', analytics.totals.points],
        ].map(([k, v]) => (
          <Card key={k} className="p-4 text-center">
            <div className="text-[24px] font-extrabold tabular text-[#2E2C2A]">{v}</div>
            <div className="text-[11.5px] font-semibold text-[#9E9894]">{k}</div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <Card className="p-6">
          <h2 className="font-extrabold text-[17px] mb-4">User signups (last 14 days)</h2>
          <div className="flex items-end gap-1 h-[140px]">
            {analytics.userGrowth.map(d => (
              <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-[#2E2C2A] rounded-t-md" style={{ height: `${(d.count / maxGrowth) * 100}%`, minHeight: d.count ? 4 : 0 }} />
                <div className="text-[9px] text-[#9B98A8] rotate-[-45deg] origin-top-left whitespace-nowrap">{d.date.slice(5)}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-extrabold text-[17px] mb-4">Role distribution</h2>
          <div className="space-y-2">
            {Object.entries(analytics.roleDistribution).map(([role, count]) => {
              const total = analytics.totals.users || 1;
              return (
                <div key={role}>
                  <div className="flex justify-between text-[12.5px] mb-1">
                    <span className="font-semibold capitalize">{role}</span>
                    <span className="font-bold tabular">{count}</span>
                  </div>
                  <Meter value={(count / total) * 100} color={role === 'admin' ? '#2E2C2A' : role === 'hr' ? '#9E9894' : '#2E2C2A'} />
                </div>
              );
            })}
          </div>
          <div className="mt-4">
            <h3 className="font-bold text-[14px] mb-2">Job status</h3>
            <div className="flex gap-3">
              {Object.entries(analytics.jobStatus).map(([status, count]) => (
                <div key={status} className="flex-1 bg-[#F4F2F1] rounded-xl p-3 text-center">
                  <div className="text-[20px] font-extrabold tabular">{count}</div>
                  <div className="text-[11.5px] text-[#9E9894] capitalize">{status}</div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <Card className="p-6">
          <h2 className="font-extrabold text-[17px] mb-4">Score distribution (AI score)</h2>
          <div className="flex items-end gap-2 h-[140px]">
            {analytics.scoreDistribution.map(d => (
              <div key={d.score} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-[#9E9894] rounded-t-md" style={{ height: `${(d.count / maxBucket) * 100}%`, minHeight: d.count ? 4 : 0 }} />
                <div className="text-[11px] text-[#9E9894] font-bold">{d.score}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-extrabold text-[17px] mb-4">Top jobs by interviews</h2>
          <div className="space-y-2">
            {analytics.jobScores.length === 0 && <div className="text-[#9E9894] text-[13px]">No data yet.</div>}
            {analytics.jobScores.map(j => (
              <div key={j.title} className="flex items-center justify-between py-2 border-b border-[#F4F2F1] last:border-0">
                <div className="min-w-0">
                  <div className="font-bold text-[13.5px] truncate">{j.title}</div>
                  <div className="text-[12px] text-[#9E9894]">{j.count} interviews</div>
                </div>
                <Pill tone="blue">{j.avg}/5 avg</Pill>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function SettingsTab({ user }) {
  return (
    <div className="space-y-4">
      <Card className="p-6">
        <h2 className="font-extrabold text-[17px] mb-4">Admin account</h2>
        <div className="grid md:grid-cols-2 gap-4 text-[13.5px]">
          <div><div className="text-[11.5px] font-bold text-[#9E9894]">Name</div><div className="font-semibold">{user?.name}</div></div>
          <div><div className="text-[11.5px] font-bold text-[#9E9894]">Email</div><div className="font-semibold">{user?.email}</div></div>
          <div><div className="text-[11.5px] font-bold text-[#9E9894]">Role</div><div className="font-semibold">{user?.role}</div></div>
          <div><div className="text-[11.5px] font-bold text-[#9E9894]">ID</div><div className="font-mono text-[12px]">{user?.id || user?._id}</div></div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="font-extrabold text-[17px] mb-2">Platform configuration</h2>
        <p className="text-[13px] text-[#9E9894] mb-4">Read-only summary of the running environment.</p>
        <div className="space-y-2 text-[13px]">
          <div className="flex justify-between py-2 border-b border-[#F4F2F1]"><span className="text-[#9E9894]">Frontend</span><span className="font-semibold">React + Vite + Tailwind</span></div>
          <div className="flex justify-between py-2 border-b border-[#F4F2F1]"><span className="text-[#9E9894]">Backend</span><span className="font-semibold">Node.js + Express + MongoDB</span></div>
          <div className="flex justify-between py-2 border-b border-[#F4F2F1]"><span className="text-[#9E9894]">AI Engine</span><span className="font-semibold">AJ (Self-Hosted)</span></div>
          <div className="flex justify-between py-2"><span className="text-[#9E9894]">Realtime</span><span className="font-semibold">Socket.io / WebRTC</span></div>
        </div>
      </Card>

      <Card className="p-6 border-[#FECACA]">
        <h2 className="font-extrabold text-[17px] text-[#DC2626] mb-2">Danger zone</h2>
        <p className="text-[13px] text-[#9E9894] mb-4">Destructive actions are available in Users and Jobs tabs.</p>
      </Card>
    </div>
  );
}
