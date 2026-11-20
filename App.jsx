import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Briefcase, BrainCircuit, FileText, BarChart3, Menu, X, LayoutDashboard, Globe } from 'lucide-react';
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

  useEffect(() => { setOpen(false); }, [loc.pathname]);

  if (loc.pathname === '/interview') return null;

  const links = [
    { to: '/', label: 'Home' },
    { to: '/jobs', label: 'Jobs', icon: Briefcase },
    { to: '/quiz', label: 'Assessments', icon: BrainCircuit },
    { to: '/resources', label: 'Resources', icon: Globe },
    { to: '/resume', label: 'Resume', icon: FileText },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#F8F7F4]/90 backdrop-blur-xl border-b border-[#E8E6EF] shadow-sm' : 'bg-transparent border-b border-transparent'}`}>
      <div className="max-w-[1280px] mx-auto px-5 lg:px-8">
        <div className="flex items-center justify-between h-[68px]">
          <Link to="/" aria-label="SkillCortex home"><Logo /></Link>
          <nav className="hidden lg:flex items-center gap-1 bg-white/70 border border-[#E8E6EF] rounded-full p-1.5 backdrop-blur">
            {links.map((l) => {
              const active = loc.pathname === l.to;
              return (
                <Link key={l.to} to={l.to}
                  className={`relative px-4 py-2 rounded-full text-[13.5px] font-semibold transition-all ${active ? 'text-white' : 'text-[#6B687A] hover:text-[#191724] hover:bg-[#F1F0F8]'}`}>
                  {active && (
                    <Motion.span layoutId="nav-pill" className="absolute inset-0 bg-[#5B4FE8] rounded-full -z-10" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />
                  )}
                  {l.label}
                </Link>
              );
            })}
            {user?.role === 'hr' && (
              <Link to="/profile" className="px-4 py-2 rounded-full text-[13.5px] font-semibold text-[#6B687A] hover:bg-[#F1F0F8]">Recruiter</Link>
            )}
            {user?.role === 'admin' && (
              <Link to="/admin" className="px-4 py-2 rounded-full text-[13.5px] font-semibold text-[#6B687A] hover:bg-[#F1F0F8]">Admin</Link>
            )}
          </nav>
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <>
                <Link to="/profile" className="flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 bg-white border border-[#E8E6EF] rounded-full hover:border-[#5B4FE8] transition-all">
                  <span className="w-8 h-8 rounded-full bg-[#5B4FE8] text-white flex items-center justify-center text-[12px] font-bold">{String(user.name || 'A').charAt(0)}</span>
                  <span className="text-[13.5px] font-semibold text-[#191724] max-w-[120px] truncate">{user.name}</span>
                </Link>
                <button onClick={() => { logout(); navigate('/'); }} className="p-2.5 text-[#6B687A] hover:text-[#191724] hover:bg-white border border-transparent hover:border-[#E8E6EF] rounded-full transition-all" title="Sign out" aria-label="Sign out">
                  <LogOut className="w-[18px] h-[18px]" />
                </button>
                <Link to="/interview-setup" className="inline-flex items-center gap-2 bg-[#5B4FE8] hover:bg-[#4A3FD4] text-white text-[13.5px] font-bold px-5 py-2.5 rounded-full transition-all shadow-[0_8px_20px_-8px_rgba(91,79,232,0.5)]">
                  Start Interview
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="text-[13.5px] font-semibold text-[#6B687A] hover:text-[#191724] px-3 py-2">Sign In</Link>
                <Link to="/register" className="inline-flex items-center gap-2 bg-[#191724] hover:bg-[#2A2738] text-white text-[13.5px] font-bold px-5 py-2.5 rounded-full transition-all">Get Started</Link>
              </>
            )}
          </div>
          <button className="lg:hidden p-2 rounded-lg hover:bg-[#F1F0F8]" onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open}>
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
            className="lg:hidden overflow-hidden border-t border-[#E8E6EF] bg-white"
          >
            <div className="px-5 py-4 space-y-1">
              {links.map((l) => (
                <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-semibold text-[#2A2738] hover:bg-[#F1F0F8]">
                  {l.icon ? <l.icon className="w-[18px] h-[18px] text-[#5B4FE8]" /> : <LayoutDashboard className="w-[18px] h-[18px]" />}{l.label}
                </Link>
              ))}
              {!user ? (
                <div className="flex gap-2 pt-2">
                  <Link to="/login" onClick={() => setOpen(false)} className="flex-1 text-center py-3 rounded-xl border border-[#E8E6EF] font-semibold text-[14px]">Sign In</Link>
                  <Link to="/register" onClick={() => setOpen(false)} className="flex-1 text-center py-3 rounded-xl bg-[#191724] text-white font-bold text-[14px]">Get Started</Link>
                </div>
              ) : (
                <div className="flex gap-2 pt-2">
                  <Link to="/profile" onClick={() => setOpen(false)} className="flex-1 text-center py-3 rounded-xl border border-[#E8E6EF] font-semibold text-[14px]">Dashboard</Link>
                  <Link to="/interview-setup" onClick={() => setOpen(false)} className="flex-1 text-center py-3 rounded-xl bg-[#5B4FE8] text-white font-bold text-[14px]">Start Interview</Link>
                </div>
              )}
            </div>
          </Motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}


