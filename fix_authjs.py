import pathlib
p = pathlib.Path(r'c:/Users/LENOVO/OneDrive/Desktop/project Work/SkillCortex/server/routes/auth.js')
s = p.read_text()
s = s.replace(
    "if (captchaId && !verifyCaptcha(captchaId, captchaAnswer)) {\\n            return res.status(400).json({ message: 'Captcha verification failed' });\\n        }",
    "if (captchaId && !verifyCaptcha(captchaId, captchaAnswer)) {\n            return res.status(400).json({ message: 'Captcha verification failed' });\n        }"
)
p.write_text(s)
print("done")
