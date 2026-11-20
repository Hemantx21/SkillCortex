import pathlib
p = pathlib.Path(r'c:/Users/LENOVO/OneDrive/Desktop/project Work/SkillCortex/client/src/components/ui/auth-section-3.tsx')
b = p.read_bytes()
if b.startswith(b'\xc3\xaf\xc2\xbb\xc2\xbf'):
    b = b[3:]
    p.write_bytes(b)
    print('Double-BOM removed')
else:
    print('No double-BOM, first bytes:', b[:10])
