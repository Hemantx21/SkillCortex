import { Link } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function CTABanner({ title, subtitle, primary, primaryTo = '/register', secondary, secondaryTo = '/jobs' }) {
  return (
    <Motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="max-w-[1280px] mx-auto px-5 lg:px-8 py-12"
    >
      <div className="relative overflow-hidden rounded-[28px] bg-[#2E2C2A] text-white p-8 md:p-12">
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#2E2C2A]/30 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-[#E6E2E0]/20 blur-3xl" />
        <div className="relative grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h2 className="text-[26px] md:text-[34px] font-extrabold tracking-tight leading-tight">{title}</h2>
            {subtitle && <p className="text-white/70 mt-3 text-[15px] leading-relaxed max-w-md">{subtitle}</p>}
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            {primary && <Link to={primaryTo} className="inline-flex items-center gap-2 bg-[#2E2C2A] hover:bg-[#2E2C2A] text-white font-bold px-6 py-3.5 rounded-full transition-all">{primary} <ArrowRight className="w-4 h-4" /></Link>}
            {secondary && <Link to={secondaryTo} className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-6 py-3.5 rounded-full transition-all">{secondary}</Link>}
          </div>
        </div>
      </div>
    </Motion.section>
  );
}

