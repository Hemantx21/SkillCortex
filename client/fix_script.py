import re
with open(r'c:\Users\LENOVO\OneDrive\Desktop\project Work\SkillCortex\client\src\pages\InterviewSession.jsx', 'r', encoding='utf8') as f:
    content = f.read()
f.close()
content = content.replace('className={\bg-[#F8F7F4] border border-[#E8E6EF] rounded-lg px-2 py-1 text-[11px] }', 'className="bg-[#F8F7F4] border border-[#E8E6EF] rounded-lg px-2 py-1 text-[11px]"')
with open(r'c:\Users\LENOVO\OneDrive\Desktop\project Work\SkillCortex\client\src\pages\InterviewSession.jsx', 'w', encoding='utf8') as f:
    f.write(content)
f.close()
print('Fixed!')