import pathlib

p = pathlib.Path(r'c:/Users/LENOVO/OneDrive/Desktop/project Work/SkillCortex/client/src/components/ui/auth-section-3.tsx')
s = p.read_text()

# 1. imports
s = s.replace(
    'import { useState } from "react";',
    'import { useState, useEffect } from "react";\nimport { useNavigate } from "react-router-dom";\nimport { useAuth } from "../../context/AuthContext";'
)

# 2. component signature + hooks + handleSubmit
old_sig = 'export default function AuthSectionThree() {\n  return ('
new_sig = '''export default function AuthSectionThree() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [error, setError] = useState("");
  const [captcha, setCaptcha] = useState({ id: "", question: "" });

  useEffect(() => {
    const base = import.meta.env.VITE_API_URL || "http://localhost:3001";
    fetch(`${base}/api/auth/captcha`).then((r) => r.json()).then((d) => setCaptcha({ id: d.id || d.captchaId, question: d.question })).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const form = e.currentTarget;
    const data = new FormData(form);
    const firstName = String(data.get("firstName") || "");
    const lastName = String(data.get("lastName") || "");
    const email = String(data.get("email") || "");
    const password = String(data.get("password") || "");
    const phone = String(data.get("phone") || "");
    const captchaAnswer = String(data.get("captchaAnswer") || "");
    const name = (firstName + " " + lastName).trim() || email;
    try {
      await register(name, email, password, "candidate", phone, captcha.id, captchaAnswer);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  return ('''
assert old_sig in s, "sig not found"
s = s.replace(old_sig, new_sig)

# 3. form onSubmit + error
s = s.replace(
    '<form className="space-y-4">',
    '<form className="space-y-4" onSubmit={handleSubmit}>\n              {error && <div className="p-3 bg-[#FEE2E2] border border-[#FECACA] rounded-xl text-[#DC2626] text-sm">{error}</div>}'
)

# 4. InputField name prop in formFields map
s = s.replace(
    'value={field.value}\n                    placeholder={field.placeholder}\n                    type={field.type}\n',
    'value={field.value}\n                    placeholder={field.placeholder}\n                    type={field.type}\n                    name={field.label === "First name" ? "firstName" : "lastName"}\n'
)

# 5. Email/Password blocks -> add phone + captcha + name props
old_email = '''              <InputField
                label="Email"
                value="harshitlog@gmail.com"
                placeholder="email@example.com"
                type="email"
              />

              <InputField
                label="Password"
                value="*************"
                placeholder="Enter password"
                type="password"
              />
'''
new_email = '''              <InputField
                label="Email"
                value=""
                placeholder="email@example.com"
                type="email"
                name="email"
              />

              <InputField
                label="Phone"
                value=""
                placeholder="+1 555 0100"
                type="tel"
                name="phone"
              />

              <InputField
                label="Password"
                value=""
                placeholder="Enter password"
                type="password"
                name="password"
              />

              <div className="space-y-2">
                <label className="text-sm font-medium">{captcha.question || "Loading captcha..."}</label>
                <input name="captchaAnswer" placeholder="Answer" className="w-full rounded-md border border-black/15 bg-white px-3 py-2 text-sm" />
                <input type="hidden" name="captchaId" value={captcha.id} />
              </div>
'''
assert old_email in s, "email block not found"
s = s.replace(old_email, new_email)

# 6. submit button type
s = s.replace(
    '              <button\n                type="button"\n                className="mt-8 flex h-11 w-full items-center justify-center rounded-lg border border-black/40 bg-black text-sm font-medium text-white transition-colors hover:bg-black/85 dark:border-white/40 dark:bg-white dark:text-black dark:hover:bg-white/85"',
    '              <button\n                type="submit"\n                className="mt-8 flex h-11 w-full items-center justify-center rounded-lg border border-black/40 bg-black text-sm font-medium text-white transition-colors hover:bg-black/85 dark:border-white/40 dark:bg-white dark:text-black dark:hover:bg-white/85"'
)

# 7. InputField signature add name
s = s.replace(
    'function InputField({\n  label,\n  placeholder,\n  type = "text",\n  value,\n}: {\n  label: string;\n  placeholder: string;\n  type?: string;\n  value: string;\n}) {',
    'function InputField({ label, placeholder, type = "text", value, name }: { label: string; placeholder: string; type?: string; value: string; name?: string }) {'
)

# 8. input name attr
s = s.replace(
    '          type={type === "password" ? (showPassword ? "text" : "password") : type}\n          value={val}\n',
    '          type={type === "password" ? (showPassword ? "text" : "password") : type}\n          name={name}\n          value={val}\n'
)

p.write_text(s)
print("done")
