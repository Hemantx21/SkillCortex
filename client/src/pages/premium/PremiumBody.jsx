import { Crown, Zap, BookOpen, Trophy } from 'lucide-react';
import { Card } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';

export default function PremiumBody() {
  const { user } = useAuth();
  const pts = user?.points || 2450;
  return (
    <div className="bg-[#F4F2F1] min-h-screen pb-20">
      <div className="max-w-[1080px] mx-auto px-5 py-10">
        <div className="rounded-[24px] bg-[#2E2C2A] p-8 md:p-10 flex flex-wrap justify-between gap-6 items-center relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full bg-[#2E2C2A]/20 blur-3xl" />
          <div className="relative">
            <span className="inline-flex items-center gap-1.5 bg-[#2E2C2A]/15 border border-[#2E2C2A]/30 text-[#DDD8FF] text-[12px] font-bold px-3 py-1.5 rounded-full"><Crown className="w-4 h-4" /> SkillCortex Premium</span>
            <h1 className="text-white text-[30px] md:text-[38px] font-extrabold mt-3">Level Up Your Career.</h1>
            <p className="text-white/60 text-[14.5px] max-w-md">Redeem skill points earned in mocks for courses and challenges.</p>
          </div>
          <div className="relative bg-white rounded-2xl px-8 py-5 text-center">
            <div className="text-[12px] font-bold text-[#9E9894] uppercase">Balance</div>
            <div className="text-[40px] font-black tabular flex items-center gap-2 justify-center"><Zap className="w-7 h-7 text-[#2E2C2A]" />{pts}</div>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <Card className="p-6"><h2 className="font-bold flex gap-2 items-center"><BookOpen className="w-5 h-5 text-[#4F4945]" /> Exclusive courses</h2>
            {[['Advanced React Patterns', 1500], ['Backend System Design', 2000]].map(([t, c]) => (
              <div key={t} className="flex justify-between items-center border border-[#E6E2E0] rounded-xl px-4 py-3 mt-3"><span className="font-semibold text-[14px]">{t}</span><span className="text-[13px] font-bold text-[#3B32B0]">{c} pts</span></div>))}
          </Card>
          <Card className="p-6"><h2 className="font-bold flex gap-2 items-center"><Trophy className="w-5 h-5 text-[#4F4945]" /> Daily challenges</h2>
            {[['Binary Tree Inversion Â· Hard', '+150'], ['Pointer Arithmetic Lab Â· Medium', '+100']].map(([t, c]) => (
              <div key={t} className="flex justify-between items-center bg-[#F4F2F1] rounded-xl px-4 py-3 mt-3 text-[13.5px] font-semibold"><span>{t}</span><span className="text-[#3B32B0]">{c}</span></div>))}
          </Card>
        </div>
      </div>
    </div>
  );
}


