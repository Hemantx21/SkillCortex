export function UsVsThem({ className = '' }) {
  const rows = [
    { feature: 'AI mock interviews', us: 'Yes', them: 'Limited' },
    { feature: 'Resume parsing', us: 'Yes', them: 'Paid add-on' },
    { feature: 'Technical quizzes', us: 'Yes', them: 'Yes' },
    { feature: 'Skill Points & gamification', us: 'Yes', them: 'No' },
    { feature: 'Recruiter pipeline', us: 'Yes', them: 'Enterprise only' },
    { feature: 'Assessment integrity review', us: 'Transparent', them: 'Black box' },
    { feature: 'Candidate transcripts', us: 'Included', them: 'Extra cost' },
  ];

  return (
    <section className={`relative border-y border-[#E6E2E0] bg-[#F4F2F1] py-16 ${className}`}>
      <div className="max-w-[1000px] mx-auto px-5 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-[26px] font-extrabold text-[#2E2C2A] tracking-tight">Built differently</h2>
          <p className="mt-2 text-[#9E9894]">How SkillCortex compares to typical recruiting platforms.</p>
        </div>
        <div className="rounded-[20px] border border-[#E6E2E0] bg-white overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F4F2F1]">
                <th className="px-6 py-4 text-[12px] font-bold text-[#9E9894] uppercase tracking-wider">Feature</th>
                <th className="px-6 py-4 text-[12px] font-bold text-[#2E2C2A] uppercase tracking-wider">SkillCortex</th>
                <th className="px-6 py-4 text-[12px] font-bold text-[#9E9894] uppercase tracking-wider">Typical platforms</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.feature} className={`${i % 2 === 1 ? 'bg-[#F4F2F1]' : ''} border-b border-[#E6E2E0] hover:bg-[#F4F2F1] transition-colors`}>
                  <td className="px-6 py-4 text-[13px] font-medium text-[#2E2C2A]">{row.feature}</td>
                  <td className="px-6 py-4 text-[13px] text-[#22C55E] font-medium">{row.us}</td>
                  <td className="px-6 py-4 text-[13px] text-[#9E9894]">{row.them}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

