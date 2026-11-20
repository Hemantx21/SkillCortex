import pathlib
p = pathlib.Path(r'c:/Users/LENOVO/OneDrive/Desktop/project Work/SkillCortex/client/src/components/ui/auth-section-3.tsx')
b = p.read_bytes()
idx = b.find(b'"use client"')
if idx >= 0:
    b = b[idx:]
    p.write_bytes(b)
    print('Cleaned, starts with:', b[:15])
else:
    print('"use client" not found, first bytes:', b[:20])
