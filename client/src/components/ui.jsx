import React from 'react';

export const Card = ({ className = '', children, ...rest }) => (
  <div
    className={`bg-white border border-[#E6E2E0] rounded-[20px] ${className}`}
    style={{ boxShadow: '0 1px 2px rgba(46,44,42,0.05), 0 8px 24px -12px rgba(46,44,42,0.12)' }}
    {...rest}
  >
    {children}
  </div>
);

export const SectionHead = ({ eyebrow, title, sub, action }) => (
  <div className="flex items-start justify-between gap-4 mb-5">
    <div>
      {eyebrow && <div className="text-[11px] font-bold tracking-[0.16em] uppercase text-[#2E2C2A] mb-1.5">{eyebrow}</div>}
      <h2 className="text-[22px] leading-tight font-extrabold tracking-tight text-[#2E2C2A]" style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>{title}</h2>
      {sub && <p className="text-[14px] text-[#9E9894] mt-1 max-w-xl leading-relaxed">{sub}</p>}
    </div>
    {action}
  </div>
);

export const Pill = ({ tone = 'gray', children }) => {
  const map = {
    gray: 'bg-[#F4F2F1] text-[#9E9894] border-[#E6E2E0]',
    green: 'bg-[#F4F2F1] text-[#3B32B0] border-[#BDE9D2]',
    blue: 'bg-[#F4F2F1] text-[#2E2C2A] border-[#C7DBFC]',
    dark: 'bg-[#2E2C2A] text-white border-[#2E2C2A]',
    amber: 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]',
    red: 'bg-[#FEE2E2] text-[#DC2626] border-[#FECACA]',
  };
  return <span className={`inline-flex items-center gap-1.5 text-[12px] font-semibold px-2.5 py-1 rounded-full border ${map[tone]}`}>{children}</span>;
};

export function ScoreRing({ value = 82, size = 120, stroke = 10, color = '#2E2C2A', track = '#EAF0EE', label = 'Score' }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c - (value / 100) * c;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={r} stroke={track} strokeWidth={stroke} fill="none" />
        <circle cx={size/2} cy={size/2} r={r} stroke={color} strokeWidth={stroke} fill="none" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={off} style={{ transition: 'stroke-dashoffset 1s ease' }} />
      </svg>
      <div className="absolute text-center">
        <div className="text-[26px] font-extrabold tabular text-[#2E2C2A] leading-none">{value}</div>
        <div className="text-[11px] font-semibold text-[#9E9894] mt-1">{label}</div>
      </div>
    </div>
  );
}

export function Waveform({ bars = 28, active = true, color = '#2E2C2A', height = 36 }) {
  return (
    <div className="flex items-center gap-[3px]" style={{ height }}>
      {Array.from({ length: bars }).map((_, i) => (
        <span
          key={i}
          className={active ? 'wave-bar' : ''}
          style={{
            width: 3, borderRadius: 99, background: i % 5 === 0 ? '#9E9894' : color,
            height: `${30 + Math.abs(Math.sin(i * 1.3)) * 70}%`,
            animationDelay: `${(i % 12) * 0.08}s`,
            opacity: active ? 1 : 0.35,
          }}
        />
      ))}
    </div>
  );
}

export const Meter = ({ value, color = '#2E2C2A' }) => (
  <div className="h-[8px] rounded-full bg-[#F4F2F1] overflow-hidden">
    <div className="h-full rounded-full" style={{ width: `${value}%`, background: color, transition: 'width .8s ease' }} />
  </div>
);

export const BtnPrimary = ({ children, className = '', loading = false, disabled, ...p }) => (
  <button {...p} disabled={disabled || loading} className={`inline-flex items-center justify-center gap-2 bg-[#E35013] hover:bg-[#E35013]/90 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-[14px] px-5 py-3 rounded-[14px] transition-all active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E35013] ${className}`}>
    {loading && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
    {children}
  </button>
);

export const BtnSecondary = ({ children, className = '', loading = false, disabled, ...p }) => (
  <button {...p} disabled={disabled || loading} className={`inline-flex items-center justify-center gap-2 bg-white border border-[#E6E2E0] hover:border-[#2E2C2A] disabled:opacity-60 disabled:cursor-not-allowed text-[#2E2C2A] font-semibold text-[14px] px-5 py-3 rounded-[14px] transition-all active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2E2C2A] ${className}`}>
    {loading && <span className="w-4 h-4 border-2 border-[#2E2C2A]/40 border-t-[#2E2C2A] rounded-full animate-spin" />}
    {children}
  </button>
);

export const BtnGhost = ({ children, className = '', loading = false, disabled, ...p }) => (
  <button {...p} disabled={disabled || loading} className={`inline-flex items-center justify-center gap-2 bg-transparent border border-[#E6E2E0] hover:bg-[#F4F2F1] disabled:opacity-60 disabled:cursor-not-allowed text-[#2E2C2A] font-semibold text-[14px] px-5 py-3 rounded-[14px] transition-all active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2E2C2A] ${className}`}>
    {loading && <span className="w-4 h-4 border-2 border-[#2E2C2A]/40 border-t-[#2E2C2A] rounded-full animate-spin" />}
    {children}
  </button>
);

export const BtnGreen = BtnPrimary;

export const BtnDanger = ({ children, className = '', loading = false, disabled, ...p }) => (
  <button {...p} disabled={disabled || loading} className={`inline-flex items-center justify-center gap-2 bg-[#EF4444] hover:bg-[#DC2626] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-[14px] px-5 py-3 rounded-[14px] transition-all active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EF4444] ${className}`}>
    {loading && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
    {children}
  </button>
);


