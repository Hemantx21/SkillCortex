import pathlib
p = pathlib.Path(r'c:/Users/LENOVO/OneDrive/Desktop/project Work/SkillCortex/client/src/components/ui/auth-section-3.tsx')
s = p.read_text()
old = 'window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${cid}&redirect_uri=${encodeURIComponent(window.location.origin + "/auth/callback")}&response_type=code&scope=openid%20email%20profile`;'
new = 'window.open(`https://accounts.google.com/o/oauth2/v2/auth?client_id=${cid}&redirect_uri=${encodeURIComponent(window.location.origin + "/auth/callback?provider=google")}&response_type=code&scope=openid%20email%20profile`, "_blank");'
assert old in s, "old not found"
s = s.replace(old, new)
p.write_text(s, encoding='utf-8')
print('done')
