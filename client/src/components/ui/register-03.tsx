import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { BriefcaseBusiness, Eye, EyeOff, GraduationCap } from "lucide-react";

const roles = [
  { value: "candidate", label: "Candidate", Icon: GraduationCap },
  { value: "hr", label: "HR team", Icon: BriefcaseBusiness },
];

export default function Register03() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [role, setRole] = useState("candidate");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await register(name.trim(), email.trim(), password, role, phone.replace(/[\s-]/g, ""));
      navigate("/profile");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message
        || (requestError.request
          ? "Cannot reach the server. Check that the API is running and connected to MongoDB."
          : "Could not create your account. Please try again.")
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="grid min-h-svh w-full grid-cols-1 text-[#2E2C2A] lg:grid-cols-2 lg:p-2">
      <section className="flex items-center justify-center px-6 py-12 sm:px-8">
        <div className="w-full max-w-sm">
          <header className="mb-7">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-[#E35013]">SkillCortex</p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Create your account</h1>
            <p className="mt-2 text-sm text-[#817B77]">Start building your next opportunity.</p>
          </header>

          <div className="mb-5 grid grid-cols-2 gap-2" aria-label="Account type">
            {roles.map(({ value, label, Icon }) => (
              <button
                key={value}
                type="button"
                aria-pressed={role === value}
                onClick={() => setRole(value)}
                className={`flex min-h-11 items-center justify-center gap-2 rounded-lg border px-3 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E35013] ${role === value ? "border-[#2E2C2A] bg-[#2E2C2A] text-white" : "border-[#E6E2E0] bg-white text-[#817B77] hover:border-[#BDB7B3] hover:text-[#2E2C2A]"}`}
              >
                <Icon className="size-4" aria-hidden="true" />
                {label}
              </button>
            ))}
          </div>

          {error && (
            <div role="alert" className="mb-4 rounded-lg border border-[#FECACA] bg-[#FEE2E2] p-3 text-sm text-[#B91C1C]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold text-[#4F4945]">Full name</span>
              <input
                type="text"
                name="name"
                autoComplete="name"
                required
                maxLength={100}
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
                className="h-11 w-full rounded-md border border-[#E6E2E0] bg-white px-3 text-sm outline-none transition focus:border-[#E35013] focus:ring-2 focus:ring-[#E35013]/15"
              />
            </label>

            <label className="block space-y-1.5">
              <span className="text-xs font-semibold text-[#4F4945]">Email</span>
              <input
                type="email"
                name="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="h-11 w-full rounded-md border border-[#E6E2E0] bg-white px-3 text-sm outline-none transition focus:border-[#E35013] focus:ring-2 focus:ring-[#E35013]/15"
              />
            </label>

            <label className="block space-y-1.5">
              <span className="text-xs font-semibold text-[#4F4945]">Phone number</span>
              <input
                type="tel"
                name="phone"
                autoComplete="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="+1 555 123 4567 (optional)"
                className="h-11 w-full rounded-md border border-[#E6E2E0] bg-white px-3 text-sm outline-none transition focus:border-[#E35013] focus:ring-2 focus:ring-[#E35013]/15"
              />
            </label>

            <label className="block space-y-1.5">
              <span className="text-xs font-semibold text-[#4F4945]">Password</span>
              <span className="relative block">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="At least 6 characters"
                  className="h-11 w-full rounded-md border border-[#E6E2E0] bg-white px-3 pr-11 text-sm outline-none transition focus:border-[#E35013] focus:ring-2 focus:ring-[#E35013]/15"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((visible) => !visible)}
                  className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-[#817B77] hover:text-[#2E2C2A]"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </span>
            </label>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 w-full rounded-md bg-[#E35013] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#C94410] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E35013] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-5 text-center text-xs text-[#817B77]">
            By continuing, you agree to our <a href="#terms" className="font-medium text-[#4F4945] underline underline-offset-2">Terms</a> and <a href="#privacy" className="font-medium text-[#4F4945] underline underline-offset-2">Privacy Policy</a>.
          </p>
          <p className="mt-5 text-center text-sm text-[#817B77]">
            Already have an account? <Link to="/login" className="font-semibold text-[#2E2C2A] hover:text-[#E35013]">Sign in</Link>
          </p>
        </div>
      </section>

      <aside className="relative hidden min-h-[calc(100svh-1rem)] overflow-hidden rounded-[1.75rem] bg-[#2E2C2A] lg:flex lg:items-end lg:p-12">
        <img
          src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1800&q=85"
          alt="A team collaborating around a table"
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#171615]/90 via-[#171615]/25 to-transparent" />
        <div className="relative max-w-lg text-white">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-white/70">Make your next move</p>
          <blockquote className="text-2xl font-medium leading-snug xl:text-3xl">
            “The right opportunity starts with knowing what you bring to the table.”
          </blockquote>
          <p className="mt-4 text-sm text-white/75">A clearer path for candidates and hiring teams.</p>
        </div>
      </aside>
    </main>
  );
}