import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function AuthCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const code = params.get("code");
  const error = params.get("error");
  // detect provider from URL pathname: /auth/callback or /auth/github/callback
  const path = window.location.pathname;
  const provider = path.includes("/github") ? "github" : "google";

  useEffect(() => {
    if (error) return;
    if (!code) return;
    (async () => {
      try {
        const base = import.meta.env.VITE_API_URL || "http://localhost:5000";
        const res = await axios.post(`${base}/api/auth/${provider}`, { code });
        const { token, user } = res.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/profile", { replace: true });
      } catch (err) {
        console.error("OAuth callback error:", err);
        navigate("/login", { replace: true });
      }
    })();
  }, [code, provider, navigate]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white border border-[#E6E2E0] rounded-2xl p-8 text-center">
        <h2 className="text-xl font-bold text-[#2E2C2A] mb-3">Signing in...</h2>
        {error && <p className="text-[#DC2626] text-sm">Error: {error}</p>}
        {code && !error && <p className="text-sm text-[#4F4945]">Completing {provider} sign in...</p>}
      </div>
    </div>
  );
}
