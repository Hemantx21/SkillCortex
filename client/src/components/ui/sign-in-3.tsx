"use client";

import { useId, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Star, User, Github, Mail } from "lucide-react";

export function SignIn() {
  const id = useId();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="grid min-h-svh w-full grid-cols-1 text-[#2E2C2A] lg:grid-cols-2 lg:p-2">
      <section className="flex flex-col items-center justify-center px-6 py-12">
        <div className="flex max-w-sm flex-col items-center gap-4">
          <div className="relative flex size-14 items-center justify-center">
            <div className="absolute inset-0 scale-125 rounded-full bg-[#E35013]/10" />
            <div className="relative z-10 flex size-14 items-center justify-center rounded-full bg-white ring ring-[#E35013]/10 ring-inset">
              <User aria-hidden="true" className="size-6 text-[#E35013]" />
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Sign in to your account</h1>
            <p className="text-base text-[#9E9894]">Enter your details to sign in.</p>
          </div>
        </div>

        <div className="flex w-full max-w-sm flex-col gap-6 mt-6">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label htmlFor={`${id}-email`} className="text-sm font-medium">Email</label>
              <input
                id={`${id}-email`}
                type="email"
                placeholder="contact@skillcortex.com"
                className="h-10 rounded-md border border-[#E6E2E0] bg-transparent px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E35013]"
              />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <label htmlFor={`${id}-password`} className="text-sm font-medium">Password</label>
                <button type="button" className="text-xs text-[#E35013] hover:underline">Forgot?</button>
              </div>
              <div className="relative">
                <input
                  id={`${id}-password`}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••"
                  className="h-10 w-full rounded-md border border-[#E6E2E0] bg-transparent px-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#E35013]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#9E9894]"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <input type="checkbox" id={`${id}-remember`} className="accent-[#E35013]" />
              <label htmlFor={`${id}-remember`} className="text-sm">Keep me logged in</label>
            </div>

            <button type="button" className="w-full rounded-md bg-[#E35013] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#E35013]/90">
              Sign in
            </button>
          </div>

          <div className="relative text-center text-xs text-[#9E9894] uppercase before:absolute before:inset-x-0 before:top-1/2 before:h-px before:bg-[#E6E2E0] before:content-['']">
            <span className="relative bg-[#F4F2F1] px-2">or continue with</span>
          </div>

          <div className="flex flex-col gap-3">
            {[{ icon: Mail, label: "Email" }, { icon: Github, label: "GitHub" }].map(({ icon: Icon, label }) => (
              <button key={label} type="button" className="flex w-full items-center justify-center gap-2 rounded-md border border-[#E6E2E0] bg-white px-4 py-2.5 text-sm font-medium hover:bg-[#F4F2F1]">
                <Icon className="size-5" />
                Continue with {label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-1 gap-y-0.5 text-sm text-[#9E9894]">
            <span>Not a member yet?</span>
            <Link to="/register" className="font-medium text-[#E35013] hover:underline">Join now</Link>
          </div>
        </div>
      </section>

      <div className="relative flex flex-col justify-end overflow-hidden rounded-4xl bg-[#F4F2F1] p-12 max-lg:hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#E35013]/25 via-[#E35013]/10 to-transparent" />
        <div className="relative flex flex-col gap-6">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((rating) => (
              <Star key={rating} aria-hidden="true" className="size-4 fill-[#E35013] text-[#E35013]" />
            ))}
          </div>
          <p className="text-lg leading-relaxed">
            &ldquo;Switching to this platform was the best decision we made this year. Onboarding took minutes, not days.&rdquo;
          </p>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-[#E35013]/20 text-[#E35013]">L</div>
            <div>
              <p className="text-sm font-semibold">Lee Robinson</p>
              <p className="text-xs text-[#9E9894]">VP of Product</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
