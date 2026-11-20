import React from 'react';

export function LogoMark({ size = 36, dark = false }) {
  return (
    <span
      className="inline-flex items-center justify-center shrink-0"
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.32,
        background: dark ? '#FFFFFF' : '#2E2C2A',
        boxShadow: dark ? '0 6px 18px -6px rgba(0,0,0,0.25)' : '0 8px 20px -8px rgba(11,61,54,0.55)',
      }}
    >
      <svg width={size * 0.66} height={size * 0.66} viewBox="0 0 64 64" fill="none">
        <path d="M32 8c-3.6 3.8-8.9 5-13.6 4C12.7 10.6 9 14.3 9 19.8c0 2.8 1.2 5.2 3 7-1.9 1.9-3 4.1-3 6.2s1.1 4.3 3 6.1c-1.8 1.9-3 4.2-3 7 0 5.5 3.7 9.2 9.4 7.9C23.1 53 28.4 54 32 58c3.6-4 8.9-5 13.6-4 5.7 1.3 9.4-2.4 9.4-7.9 0-2.8-1.2-5.1-3-7 1.9-1.8 3-4 3-6.1s-1.1-4.3-3-6.2c1.8-1.8 3-4.2 3-7C55 14.3 51.3 10.6 45.6 12c-4.7 1-10 0-13.6-4Z" stroke="#2E2C2A" strokeWidth="3.6" strokeLinejoin="round" />
        <circle cx="24" cy="26" r="2.6" fill="#2E2C2A" />
        <circle cx="40" cy="26" r="2.6" fill="#9E9894" />
        <circle cx="32" cy="33.5" r="3" fill={dark ? '#2E2C2A' : '#FFFFFF'} />
        <circle cx="24" cy="42" r="2.6" fill="#9E9894" />
        <circle cx="40" cy="42" r="2.6" fill="#2E2C2A" />
        <path d="M24 26l8 7.5L40 26M24 42l8-8.5L40 42" stroke="#E35013" strokeWidth="1.7" strokeLinecap="round" opacity="0.95" />
      </svg>
    </span>
  );
}

export function Logo({ dark = false, compact = false }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark dark={dark} size={compact ? 32 : 38} />
      <span className="leading-none">
        <span className={`block font-extrabold tracking-tight text-[19px] ${dark ? 'text-white' : 'text-[#2E2C2A]'}`} style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>
          SkillCortex
        </span>
        {!compact && (
          <span className={`block text-[10px] font-semibold tracking-[0.18em] uppercase mt-1 ${dark ? 'text-white/55' : 'text-[#9E9894]'}`}>
            Adaptive Interviews
          </span>
        )}
      </span>
    </span>
  );
}


