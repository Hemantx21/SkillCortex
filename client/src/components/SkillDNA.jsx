import { candidate } from '../data/mock';
import { Meter } from './ui';

export function polarToCartesian(cx, cy, r, deg) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

export default function SkillDNA({ skills = candidate.skills, size = 300 }) {
  const cx = size / 2, cy = size / 2;
  const rings = [0.35, 0.6, 0.85, 1];
  const n = skills.length;
  const maxR = size / 2 - 28;

  const points = skills.map((s, i) => {
    const ang = (360 / n) * i;
    const r = maxR * (s.level / 100);
    return { ...polarToCartesian(cx, cy, r, ang), skill: s, ang };
  });
  const polygon = points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const outer = skills.map((_, i) => {
    const p = polarToCartesian(cx, cy, maxR, (360 / n) * i);
    return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
  }).join(' ');

  return (
    <div className="flex flex-col items-center">
      <div className="dna-float">
        <svg width={size} height={size} className="overflow-visible">
          {rings.map((f) => (
            <circle key={f} cx={cx} cy={cy} r={maxR * f} fill="none" stroke="#E6E2E0" strokeWidth="1" />
          ))}
          {skills.map((_, i) => {
            const p = polarToCartesian(cx, cy, maxR, (360 / n) * i);
            return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#F4F2F1" strokeWidth="1" />;
          })}
          <polygon points={outer} fill="#F4F2F1" opacity="0.55" />
          <polygon points={polygon} fill="rgba(22,199,132,0.16)" stroke="#2E2C2A" strokeWidth="2" strokeLinejoin="round" />
          {points.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="11" fill={p.skill.color} opacity="0.16" />
              <circle cx={p.x} cy={p.y} r="5.5" fill={p.skill.color} stroke="#fff" strokeWidth="2" />
            </g>
          ))}
          <circle cx={cx} cy={cy} r="20" fill="#2E2C2A" />
          <text x={cx} y={cy + 1} textAnchor="middle" fontSize="11" fontWeight="800" fill="#fff">82</text>
          <text x={cx} y={cy + 11} textAnchor="middle" fontSize="7" fontWeight="600" fill="rgba(255,255,255,0.7)">DNA</text>
        </svg>
      </div>
      <div className="w-full mt-2 space-y-2.5 max-h-[240px] overflow-y-auto pr-1">
        {skills.map((s) => (
          <div key={s.name}>
            <div className="flex justify-between text-[12.5px] mb-1">
              <span className="font-semibold text-[#2E2C2A]">{s.name}</span>
              <span className="tabular font-bold text-[#4F4945]">{s.level} <span className="text-[#2E2C2A] font-semibold">+{s.growth}</span></span>
            </div>
            <Meter value={s.level} color={s.color} />
          </div>
        ))}
      </div>
    </div>
  );
}


