export default function ArchitectureDiagram() {
  const nodes = [
    { label: 'React + Vite', sub: 'Tailwind CSS', color: 'from-sky-500 to-blue-600' },
    { label: 'Node.js / Express', sub: 'REST APIs', color: 'from-emerald-500 to-teal-600' },
    { label: 'MongoDB Atlas', sub: 'Database', color: 'from-green-500 to-emerald-600' },
    { label: 'Gemini / OpenAI', sub: 'LLM APIs', color: 'from-violet-500 to-purple-600' },
    { label: 'GitHub Actions', sub: 'CI/CD', color: 'from-gray-700 to-gray-900' },
  ];

  return (
    <section className="relative max-w-[1100px] mx-auto px-5 lg:px-8 py-16">
      <div className="text-center mb-10">
        <div className="text-[11px] font-bold tracking-[0.16em] uppercase text-indigo-600 mb-2">Architecture</div>
        <h2 className="text-[26px] md:text-[32px] font-extrabold tracking-tight text-[#2E2C2A]">How SkillCortex is built</h2>
        <p className="text-[#9E9894] text-[14.5px] mt-2 max-w-xl mx-auto">A modern MERN stack with AI services and automated delivery.</p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-4">
        {nodes.map((n, i) => (
          <div key={n.label} className="flex items-center gap-4">
            <div className={`rounded-2xl bg-gradient-to-br ${n.color} text-white px-5 py-4 text-center shadow-lg min-w-[150px]`}>
              <div className="font-bold text-[14px]">{n.label}</div>
              <div className="text-[11px] opacity-80 mt-0.5">{n.sub}</div>
            </div>
            {i < nodes.length - 1 && (
              <svg className="w-6 h-6 text-[#9E9894] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
              </svg>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}