import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { LogOut, Briefcase, BrainCircuit, FileText, BarChart3, Menu, X, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Logo } from './brand/Logo';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const loc = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);


  if (loc.pathname === '/interview') return null;

  const links = user?.role === 'hr'
    ? [{ to: '/', label: 'Home' }, { to: '/profile', label: 'Recruiter dashboard', icon: Briefcase }]
    : user?.role === 'admin'
      ? [{ to: '/', label: 'Home' }, { to: '/admin', label: 'Admin console', icon: LayoutDashboard }]
      : [
        { to: '/', label: 'Home' },
        { to: '/jobs', label: 'Jobs', icon: Briefcase },
        { to: '/quiz', label: 'Assessments', icon: BrainCircuit },
        { to: '/resume', label: 'Resume', icon: FileText },
        { to: '/analytics', label: 'Analytics', icon: BarChart3 },
      ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#F4F2F1]/90 backdrop-blur-xl border-b border-[#E6E2E0] shadow-sm' : 'bg-transparent border-b border-transparent'}`}>
      <div className="max-w-[1280px] mx-auto px-5 lg:px-8">
        <div className="flex items-center justify-between h-[68px]">
          <Link to="/" aria-label="SkillCortex home"><Logo /></Link>
          <nav className="hidden lg:flex items-center gap-1 bg-white/70 border border-[#E6E2E0] rounded-full p-1.5 backdrop-blur">
            {links.map((l) => {
              const active = loc.pathname === l.to;
              return (
                <Link key={l.to} to={l.to}
                  className={`relative px-4 py-2 rounded-full text-[15px] font-semibold transition-all ${active ? 'text-white' : 'text-[#9E9894] hover:text-[#2E2C2A] hover:bg-[#F4F2F1]'}`}>
                  {active && (
                    <Motion.span layoutId="nav-pill" className="absolute inset-0 bg-[#2E2C2A] rounded-full -z-10" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />
                  )}
                  {l.label}
                </Link>
              );
            })}
          </nav>
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <>
                <Link to="/profile" className="flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 bg-white border border-[#E6E2E0] rounded-full hover:border-[#2E2C2A] transition-all">
                  <span className="w-8 h-8 rounded-full bg-[#2E2C2A] text-white flex items-center justify-center text-[14px] font-bold">{String(user.name || 'A').charAt(0)}</span>
                  <span className="text-[13.5px] font-semibold text-[#2E2C2A] max-w-[120px] truncate">{user.name}</span>
                </Link>
                <button onClick={() => { logout(); navigate('/'); }} className="p-2.5 text-[#9E9894] hover:text-[#2E2C2A] hover:bg-white border border-transparent hover:border-[#E6E2E0] rounded-full transition-all" title="Sign out" aria-label="Sign out">
                  <LogOut className="w-[18px] h-[18px]" />
                </button>
                <Link to={user.role === 'hr' ? '/profile?postJob=1' : user.role === 'admin' ? '/admin' : '/interview-setup'} className="inline-flex items-center gap-2 bg-[#E35013] hover:bg-[#E35013]/90 text-white text-[15px] font-bold px-5 py-2.5 rounded-full transition-all shadow-[0_8px_20px_-8px_rgba(227,80,19,0.4)]">
                  {user.role === 'hr' ? 'Post a job' : user.role === 'admin' ? 'Admin console' : 'Start Interview'}
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="text-[15px] font-semibold text-[#9E9894] hover:text-[#2E2C2A] px-3 py-2">Sign In</Link>
                <Link to="/register" className="inline-flex items-center gap-2 bg-[#E35013] hover:bg-[#E35013]/90 text-white text-[15px] font-bold px-5 py-2.5 rounded-full transition-all">Get Started</Link>
              </>
            )}
          </div>
          <button className="lg:hidden p-2 rounded-lg hover:bg-[#F4F2F1]" onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open}>
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <Motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden overflow-hidden border-t border-[#E6E2E0] bg-white"
          >
            <div className="px-5 py-4 space-y-1">
              {links.map((l) => (
                <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[15px] font-semibold text-[#4F4945] hover:bg-[#F4F2F1]">
                  {l.icon ? <l.icon className="w-[18px] h-[18px] text-[#2E2C2A]" /> : <LayoutDashboard className="w-[18px] h-[18px]" />}{l.label}
                </Link>
              ))}
              {!user ? (
                <div className="flex gap-2 pt-2">
                  <Link to="/login" onClick={() => setOpen(false)} className="flex-1 text-center py-3 rounded-xl border border-[#E6E2E0] font-semibold text-[15px]">Sign In</Link>
                  <Link to="/register" onClick={() => setOpen(false)} className="flex-1 text-center py-3 rounded-xl bg-[#2E2C2A] text-white font-bold text-[15px]">Get Started</Link>
                </div>
              ) : (
                <div className="flex gap-2 pt-2">
                  <Link to="/profile" onClick={() => setOpen(false)} className="flex-1 text-center py-3 rounded-xl border border-[#E6E2E0] font-semibold text-[14px]">Dashboard</Link>
                  <Link to={user.role === 'hr' ? '/profile?postJob=1' : user.role === 'admin' ? '/admin' : '/interview-setup'} onClick={() => setOpen(false)} className="flex-1 text-center py-3 rounded-xl bg-[#2E2C2A] text-white font-bold text-[14px]">{user.role === 'hr' ? 'Post a job' : user.role === 'admin' ? 'Admin console' : 'Start Interview'}</Link>
                </div>
              )}
            </div>
          </Motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
