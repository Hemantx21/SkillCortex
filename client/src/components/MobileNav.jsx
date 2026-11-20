import { Link, useLocation } from 'react-router-dom';
import { Home, Briefcase, BrainCircuit, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function MobileNav() {
  const loc = useLocation();
  const { user } = useAuth();
  if (loc.pathname === '/interview' || loc.pathname.startsWith('/room')) return null;
  const items = user?.role === 'hr'
    ? [{ to: '/', label: 'Home', Icon: Home }, { to: '/profile', label: 'Jobs', Icon: Briefcase }]
    : user?.role === 'admin'
      ? [{ to: '/', label: 'Home', Icon: Home }, { to: '/admin', label: 'Admin', Icon: User }]
      : [
        { to: '/', label: 'Home', Icon: Home },
        { to: '/jobs', label: 'Jobs', Icon: Briefcase },
        { to: '/quiz', label: 'Skills', Icon: BrainCircuit },
        { to: '/profile', label: 'Profile', Icon: User },
      ];
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-[#E6E2E0] pb-[env(safe-area-inset-bottom)]">
      <div className={items.length === 2 ? 'grid grid-cols-2 px-2' : 'grid grid-cols-4 px-2'}>
        {items.map((item) => {
          const a = loc.pathname === item.to;
          return (
            <Link key={item.to} to={item.to} className={`flex flex-col items-center gap-1 py-2.5 text-[13px] font-bold ${a ? 'text-[#4F4945]' : 'text-[#9B98A8]'}`}>
              <item.Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
