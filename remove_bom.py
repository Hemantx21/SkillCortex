import pathlib
p = pathlib.Path(r'c:/Users/LENOVO/OneDrive/Desktop/project Work/SkillCortex/client/src/components/ui/auth-section-3.tsx')
b = p.read_bytes()
if b.startswith(b'\xef\xbb\xbf'):
    b = b[3:]
    p.write_bytes(b)
    print('BOM removed')
else:
    print('No BOM')
