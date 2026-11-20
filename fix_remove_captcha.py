import pathlib
p = pathlib.Path(r'c:/Users/LENOVO/OneDrive/Desktop/project Work/SkillCortex/client/src/components/ui/auth-section-3.tsx')
s = p.read_text()

# Remove captcha state
s = s.replace('  const [captcha, setCaptcha] = useState({ id: "", question: "" });\n\n', '')

# Remove useEffect fetch (keep useEffect import harmless)
s = s.replace('''  useEffect(() => {
    const base = import.meta.env.VITE_API_URL || "http://localhost:3001";
    fetch(`${base}/api/auth/captcha`).then((r) => r.json()).then((d) => setCaptcha({ id: d.id || d.captchaId, question: d.question })).catch(() => {});
  }, []);

''', '')

# Remove captchaAnswer line in handleSubmit
s = s.replace('    const captchaAnswer = String(data.get("captchaAnswer") || "");\n', '')

# Update register call to pass empty captcha
s = s.replace('      await register(name, email, password, "candidate", phone, captcha.id, captchaAnswer);',
              '      await register(name, email, password, "candidate", phone, "", "");')

# Remove captcha UI block
old_block = '''              <div className="space-y-2">
                <label className="text-sm font-medium text-black">{captcha.question || "Loading captcha..."}</label>
                <input name="captchaAnswer" placeholder="Answer" className="w-full rounded-md border border-black/15 bg-white px-3 py-2 text-sm text-black" />
                <input type="hidden" name="captchaId" value={captcha.id} />
              </div>

'''
s = s.replace(old_block, '')

p.write_text(s)
print("done")
