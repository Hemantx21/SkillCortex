import pathlib
p = pathlib.Path(r'c:/Users/LENOVO/OneDrive/Desktop/project Work/SkillCortex/client/src/components/ui/login-03.tsx')
s = p.read_text()

old_google = '''onClick={() => { const cid = import.meta.env.VITE_GOOGLE_CLIENT_ID; if (!cid) { alert("Set VITE_GOOGLE_CLIENT_ID"); return; } window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${cid}&redirect_uri=${encodeURIComponent(window.location.origin + "/auth/callback")}&response_type=code&scope=openid%20email%20profile`; }}'''
new_google = '''onClick={() => { const cid = import.meta.env.VITE_GOOGLE_CLIENT_ID; if (!cid) { alert("Set VITE_GOOGLE_CLIENT_ID"); return; } window.open(`https://accounts.google.com/o/oauth2/v2/auth?client_id=${cid}&redirect_uri=${encodeURIComponent(window.location.origin + "/auth/callback?provider=google")}&response_type=code&scope=openid%20email%20profile`, "_blank"); }}'''
assert old_google in s, "google not found"
s = s.replace(old_google, new_google)

old_github = '''onClick={() => { const cid = import.meta.env.VITE_GITHUB_CLIENT_ID; if (!cid) { alert("Set VITE_GITHUB_CLIENT_ID"); return; } window.location.href = `https://github.com/login/oauth/authorize?client_id=${cid}&redirect_uri=${encodeURIComponent(window.location.origin + "/auth/callback")}&scope=user:email`; }}'''
new_github = '''onClick={() => { const cid = import.meta.env.VITE_GITHUB_CLIENT_ID; if (!cid) { alert("Set VITE_GITHUB_CLIENT_ID"); return; } window.open(`https://github.com/login/oauth/authorize?client_id=${cid}&redirect_uri=${encodeURIComponent(window.location.origin + "/auth/callback?provider=github")}&scope=user:email`, "_blank"); }}'''
assert old_github in s, "github not found"
s = s.replace(old_github, new_github)

p.write_text(s, encoding='utf-8')
print('done')
