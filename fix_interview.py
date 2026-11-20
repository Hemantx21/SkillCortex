p = r"c:\Users\LENOVO\OneDrive\Desktop\project Work\SkillCortex\client\src\pages\InterviewSetup.jsx"
s = open(p, encoding='utf-8').read()
s = s.replace("role === r.id ? 'bg-[#2E2C2A]' : 'bg-[#F4F2F1]'", "role === r.id ? 'bg-white/15' : 'bg-[#F4F2F1]'")
s = s.replace("Briefcase className={`w-5 h-5 ${role === r.id ? 'text-[#2E2C2A]' : 'text-[#4F4945]'}`", "Briefcase className={`w-5 h-5 ${role === r.id ? 'text-white' : 'text-[#4F4945]'}`")
s = s.replace("level === l ? 'bg-[#2E2C2A] border-[#2E2C2A] text-[#2E2C2A]'", "level === l ? 'bg-[#E35013] border-[#E35013] text-white'")
s = s.replace("\u00c2\u00b7", "\u00b7")
open(p, 'w', encoding='utf-8').write(s)
print("done")
