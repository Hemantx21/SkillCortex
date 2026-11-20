import pathlib
p = pathlib.Path(r'c:/Users/LENOVO/OneDrive/Desktop/project Work/SkillCortex/client/src/components/ui/auth-section-3.tsx')
s = p.read_text()
s = s.replace('label className="text-sm font-medium\ntext-black"', 'label className="text-sm font-medium text-black"')
p.write_text(s)
print("done")
