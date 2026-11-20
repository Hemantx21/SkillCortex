import pathlib
p = pathlib.Path(r'c:/Users/LENOVO/OneDrive/Desktop/project Work/SkillCortex/client/src/components/ui/login-03.tsx')
s = p.read_text()
old1 = '''            <button type="button" onClick={() => {}} className="flex-1 flex items-center justify-center gap-2 rounded-md border border-[#E6E2E0] bg-white px-4 py-2.5 text-sm font-medium hover:bg-[#F4F2F1]">
              <GoogleIcon className="size-4" /> Google'''
new1 = '''            <button type="button" onClick={() => { const cid = import.meta.env.VITE_GOOGLE_CLIENT_ID; if (!cid) { alert("Set VITE_GOOGLE_CLIENT_ID"); return; } window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${cid}&redirect_uri=${encodeURIComponent(window.location.origin + "/auth/callback")}&response_type=code&scope=openid%20email%20profile`; }} className="flex-1 flex items-center justify-center gap-2 rounded-md border border-[#E6E2E0] bg-white px-4 py-2.5 text-sm font-medium hover:bg-[#F4F2F1]">
              <GoogleIcon className="size-4" /> Google'''
assert old1 in s, "google block not found"
s = s.replace(old1, new1)

old2 = '''            <button type="button" onClick={() => {}} className="flex-1 flex items-center justify-center gap-2 rounded-md border border-[#E6E2E0] bg-white px-4 py-2.5 text-sm font-medium hover:bg-[#F4F2F1]">
              <GithubIcon className="size-4" /> GitHub'''
new2 = '''            <button type="button" onClick={() => { const cid = import.meta.env.VITE_GITHUB_CLIENT_ID; if (!cid) { alert("Set VITE_GITHUB_CLIENT_ID"); return; } window.location.href = `https://github.com/login/oauth/authorize?client_id=${cid}&redirect_uri=${encodeURIComponent(window.location.origin + "/auth/callback")}&scope=user:email`; }} className="flex-1 flex items-center justify-center gap-2 rounded-md border border-[#E6E2E0] bg-white px-4 py-2.5 text-sm font-medium hover:bg-[#F4F2F1]">
              <GithubIcon className="size-4" /> GitHub'''
assert old2 in s, "github block not found"
s = s.replace(old2, new2)

p.write_text(s)
print("done")
