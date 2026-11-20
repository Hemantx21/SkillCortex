"use client";

import * as React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ChevronLeft, GraduationCap, Briefcase, ShieldCheck } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

function cn(...classes) { return classes.filter(Boolean).join(" "); }

const ENTER = "animate-in fade-in slide-in-from-bottom-4 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-both motion-reduce:animate-none";
const stagger = (index) => ({ animationDelay: `${index * 60}ms` });

const GithubIcon = (props) => (
  <svg viewBox="0 0 24 24" aria-hidden {...props}><path fill="currentColor" d="M12 2C6.48 2 2 6.58 2 12.22c0 4.5 2.87 8.32 6.84 9.67.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.7-2.78.61-3.37-1.36-3.37-1.36-.45-1.18-1.11-1.49-1.11-1.49-.91-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.9 1.56 2.35 1.11 2.92.85.09-.66.35-1.11.63-1.37-2.22-.26-4.55-1.13-4.55-5.04 0-1.11.39-2.02 1.03-2.74-.1-.26-.45-1.3.1-2.7 0 0 .84-.27 2.75 1.04A9.4 9.4 0 0 1 12 7.04c.85 0 1.7.12 2.5.34 1.9-1.31 2.74-1.04 2.74-1.04.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.74 0 3.92-2.34 4.78-4.57 5.03.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.04 10.04 0 0 0 22 12.22C22 6.58 17.52 2 12 2Z" />
    </svg>
);

const GoogleIcon = (props) => (
  <svg viewBox="0 0 24 24" aria-hidden {...props}>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const Login03 = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [role, setRole] = React.useState("candidate");
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const res = await login(email, password);
      const userRole = res?.user?.role || role;
      if (userRole === "admin") navigate("/admin");
      else navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="grid min-h-svh w-full grid-cols-1 text-[#2E2C2A] md:grid-cols-2 md:p-2">
      <section className="flex flex-col items-center justify-center px-6 py-12">
        <div className="flex max-w-sm flex-col items-center gap-4">
          <div className="text-center">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-[42px]">Sign in or join.</h1>
            <p className="mt-1 text-[17px] leading-relaxed text-[#817B77]">One click with Google or GitHub. Or use your email.</p>
          </div>
        </div>

        <div className="flex w-full max-w-sm flex-col gap-6 mt-6">
          {error && (
            <div className="p-3 bg-[#FEE2E2] border border-[#FECACA] rounded-xl text-[#DC2626] text-sm">{error}</div>
          )}

          <div className="grid grid-cols-3 gap-2">
            {[{r:"candidate",label:"Candidate",icon:GraduationCap},{r:"hr",label:"HR",icon:Briefcase},{r:"admin",label:"Admin",icon:ShieldCheck}].map(({r,label,icon:Icon}) => (
              <button key={r} type="button" onClick={() => setRole(r)} className={`min-h-11 px-2 rounded-xl border flex items-center justify-center gap-1.5 text-sm font-bold transition-all ${role===r ? "bg-[#2E2C2A] border-[#2E2C2A] text-white" : "bg-white border-[#E6E2E0] text-[#9E9894]"}`}>
                <Icon className="w-4 h-4" /> {label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <input type="email" required placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} className="h-12 w-full rounded-md border border-[#E6E2E0] bg-transparent px-3.5 text-base focus:outline-none focus:ring-2 focus:ring-[#E35013]" />
            <input type="password" required minLength={6} placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} className="h-12 w-full rounded-md border border-[#E6E2E0] bg-transparent px-3.5 text-base focus:outline-none focus:ring-2 focus:ring-[#E35013]" />
            <button type="submit" disabled={isLoading} className="w-full rounded-md bg-[#E35013] px-4 py-3 text-base font-semibold text-white hover:bg-[#E35013]/90 disabled:opacity-70">
              {isLoading ? "Signing in..." : `Sign In as ${role === "admin" ? "Admin" : role === "hr" ? "HR" : "Candidate"}`}
            </button>
          </form>

          <div className="flex gap-2">
            <button type="button" onClick={() => { const cid = import.meta.env.VITE_GOOGLE_CLIENT_ID; if (!cid) { alert("Set VITE_GOOGLE_CLIENT_ID"); return; } window.open(`https://accounts.google.com/o/oauth2/v2/auth?client_id=${cid}&redirect_uri=${encodeURIComponent(window.location.origin + "/auth/google/callback")}&response_type=code&scope=openid%20email%20profile&state=google`, "_blank"); }} className="flex-1 flex items-center justify-center gap-2 rounded-md border border-[#E6E2E0] bg-white px-4 py-3 text-base font-medium text-black hover:bg-[#F4F2F1]">
              <GoogleIcon className="size-4" /> Google
            </button>
            <button type="button" onClick={() => { const cid = import.meta.env.VITE_GITHUB_CLIENT_ID; if (!cid) { alert("Set VITE_GITHUB_CLIENT_ID"); return; } window.open(`https://github.com/login/oauth/authorize?client_id=${cid}&redirect_uri=${encodeURIComponent(window.location.origin + "/auth/callback")}&scope=user:email`, "_blank"); }} className="flex-1 flex items-center justify-center gap-2 rounded-md border border-[#E6E2E0] bg-white px-4 py-3 text-base font-medium text-black hover:bg-[#F4F2F1]">
              <GithubIcon className="size-4" /> GitHub
            </button>
          </div>

          <p className="text-sm text-[#817B77] text-center">
            Don't have an account? <Link to="/register" className="font-medium text-black hover:underline">Join now</Link>
          </p>
        </div>
      </section>

      <div className="relative hidden min-h-[320px] flex-col justify-end overflow-hidden rounded-4xl bg-[#2E2C2A] p-8 md:flex md:min-h-[calc(100svh-1rem)] md:p-12">
        <img
          src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1800&q=85"
          alt="A team collaborating around a table"
          className="absolute inset-0 size-full object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#171615]/90 via-[#171615]/25 to-transparent" />
        <div className="relative flex flex-col gap-3 text-white">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-white/75">SkillCortex</p>
          <p className="max-w-lg text-xl font-medium leading-snug xl:text-2xl">&ldquo;Switching to this platform was the best decision we made this year.&rdquo;</p>
          <p className="text-sm text-white/75">Practice with purpose. Find your next opportunity.</p>
        </div>
      </div>
    </main>
  );
};

export default Login03;

