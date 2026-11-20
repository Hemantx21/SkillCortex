import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, ShieldCheck, GitCompare } from 'lucide-react';
import { Card, Pill, ScoreRing, Meter } from '../components/ui';
import SkillDNA from '../components/SkillDNA';
import { recruiterCandidates, transcripts } from '../data/recruiter';

export default function CandidateDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const c = recruiterCandidates.find((x) => String(x.id) === String(id)) || recruiterCandidates[0];
  return (
    <div className="bg-[#F4F2F1] min-h-screen pb-20">
      <div className="max-w-[1280px] mx-auto px-5 lg:px-8 py-8">
        <button onClick={() => nav(-1)} className="flex items-center gap-1.5 text-[13px] font-semibold text-[#9E9894] mb-4"><ArrowLeft className="w-4 h-4" /> Pipeline</button>
        <Card className="p-6 md:p-7 flex flex-wrap gap-5 items-center">
          <span className="w-16 h-16 rounded-2xl bg-[#4F4945] text-white flex items-center justify-center text-xl font-extrabold">{c.initials}</span>
          <div className="flex-1 min-w-[220px]">
            <div className="flex items-center gap-2.5 flex-wrap"><h1 className="text-[24px] font-extrabold text-[#2E2C2A]">{c.name}</h1><Pill tone={c.rec === 'Recommended' || c.rec === 'Strong Hire' ? 'green' : 'amber'}>{c.rec}</Pill></div>
            <div className="text-[13.5px] text-[#9E9894]">{c.role} Â· {c.status}</div>
            <div className="text-[13px] text-[#4F4945] font-medium mt-1">AI summary: {c.summary}</div>
          </div>
          <ScoreRing value={c.tech} size={110} label="Overall" />
          <div className="flex gap-2">
            <button className="bg-[#2E2C2A] text-white text-[13px] font-bold px-4 py-2.5 rounded-xl inline-flex gap-1.5 items-center"><FileText className="w-4 h-4" /> Transcript</button>
            <button className="border border-[#E6E2E0] text-[13px] font-bold px-4 py-2.5 rounded-xl inline-flex gap-1.5 items-center"><ShieldCheck className="w-4 h-4" /> Integrity</button>
            <button className="border border-[#E6E2E0] text-[13px] font-bold px-4 py-2.5 rounded-xl inline-flex gap-1.5 items-center"><GitCompare className="w-4 h-4" /> Compare</button>
          </div>
        </Card>
        <div className="grid lg:grid-cols-3 gap-5 mt-5">
          <Card className="p-6">
            <h3 className="font-bold text-[15px] mb-3">Score breakdown</h3>
            {[['Technical competence', c.tech, '#4F4945'], ['Communication', c.comm, '#9E9894'], ['Assessment integrity', c.integrity, '#2E2C2A']].map(([k, v, col]) => (
              <div key={k} className="mb-3.5"><div className="flex justify-between text-[13px] mb-1"><span className="font-semibold">{k}</span><span className="font-bold tabular">{v}{k.includes('integrity') ? '%' : ''}</span></div><Meter value={v} color={col} /></div>))}
            <div className="bg-[#F4F2F1] rounded-xl p-3.5 text-[12.5px] text-[#9E9894] mt-2">Timeline: Applied â†’ Screened â†’ AI Interview â†’ <b>Ready for final round</b>.</div>
            <Link to="/analytics" className="text-[13px] font-bold text-[#2E2C2A] mt-3 inline-block">Open full hiring report</Link>
          </Card>
          <Card className="p-6"><h3 className="font-bold text-[15px] mb-1">Skill DNA</h3><SkillDNA size={250} /></Card>
          <Card className="p-6">
            <h3 className="font-bold text-[15px] mb-3">Interview transcript</h3>
            <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
              {transcripts.map((t, i) => (
                <div key={i} className={`rounded-xl p-3 text-[12.5px] leading-relaxed ${t.who === 'AI' ? 'bg-[#F4F2F1] text-[#4F4945]' : 'bg-[#4F4945] text-white ml-6'}`}>
                  <span className="font-bold">{t.who}: </span>{t.text}
                </div>))}
            </div>
            <div className="mt-4 border border-[#E6E2E0] rounded-xl p-3"><div className="text-[12px] font-bold text-[#2E2C2A] mb-1">Recruiter notes</div><textarea placeholder="Add a private noteâ€¦" className="w-full text-[13px] focus:outline-none min-h-[56px]" /></div>
          </Card>
        </div>
      </div>
    </div>
  );
}


