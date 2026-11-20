import sys
f1 = r'c:\Users\LENOVO\OneDrive\Desktop\project Work\SkillCortex\client\src\pages\InterviewSession.jsx'
with open(f1, 'r', encoding='utf8') as f:
    c = f.read()
c = c.replace('className={\\bg-[#F8F7F4] border border-[#E8E6EF] rounded-lg px-2 py-1 text-[11px] }', 'className="bg-[#F8F7F4] border border-[#E8E6EF] rounded-lg px-2 py-1 text-[11px]"')
with open(f1, 'w', encoding='utf8') as f:
    f.write(c)
print('Fixed!')