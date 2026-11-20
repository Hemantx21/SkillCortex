import pathlib
p = pathlib.Path(r'c:/Users/LENOVO/OneDrive/Desktop/project Work/SkillCortex/client/src/components/ui/login-03.tsx')
s = p.read_text()
# change button font-medium text-black
s = s.replace('text-sm font-medium hover:bg-[#F4F2F1]', 'text-sm font-medium text-black hover:bg-[#F4F2F1]')
# change the 'Don\'t have an account? Join now' link text color
s = s.replace('font-medium text-[#E35013] hover:underline', 'font-medium text-black hover:underline')
p.write_text(s, encoding='utf-8')
print('done')