import pathlib
for fn in ['login-03.tsx', 'auth-section-3.tsx']:
    p = pathlib.Path(rf'c:/Users/LENOVO/OneDrive/Desktop/project Work/SkillCortex/client/src/components/ui/{fn}')
    b = p.read_bytes()
    idx = b.find(b'"use client"')
    if idx >= 0:
        b = b[idx:]
        p.write_bytes(b)
        print(f'{fn} cleaned')
    else:
        print(f'{fn}: "use client" not found')
