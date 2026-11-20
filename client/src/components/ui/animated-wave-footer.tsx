"use client";

import * as React from "react";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

export default function AnimatedWaveFooter() {
  return (
    <footer className="relative bg-gradient-to-b from-[#F4F2F1] to-[#E35013]/10 pt-20 overflow-hidden">
      <style>{`
        @keyframes wave {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-wave { animation: wave 15s linear infinite; }
      `}</style>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute bottom-0 h-[500px] w-[1800px] animate-wave">
          <svg
            className="h-full w-full"
            viewBox="0 0 1800 500"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 250C200 150 400 50 600 100C800 150 1000 350 1200 300C1400 250 1600 150 1800 250V500H0V250Z"
              fill="currentColor"
              className="text-[#E35013]/5"
            />
            <path
              d="M0 250C200 200 400 100 600 150C800 200 1000 350 1200 300C1400 250 1600 200 1800 250V500H0V250Z"
              fill="currentColor"
              className="text-[#E35013]/10"
            />
          </svg>
        </div>
      </div>
      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h2 className="mb-4 text-2xl font-bold text-[#2E2C2A]">Stay Connected</h2>
            <form className="space-y-2">
              <div className="space-y-1">
                <label htmlFor="email" className="text-sm font-medium text-[#2E2C2A]">Email</label>
                <input
                  id="email"
                  placeholder="Enter your email"
                  type="email"
                  className="w-full rounded-md border border-[#E6E2E0] bg-white/70 px-3 py-2 text-sm backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#E35013]"
                />
              </div>
              <button type="submit" className="w-full rounded-md bg-[#E35013] px-4 py-2 text-sm font-semibold text-white hover:bg-[#E35013]/90">
                Subscribe
              </button>
            </form>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold text-[#2E2C2A]">Quick Links</h3>
            <nav className="space-y-2 text-sm text-[#4F4945]">
              <a href="#" className="block transition-colors hover:text-[#E35013]">Home</a>
              <a href="#" className="block transition-colors hover:text-[#E35013]">About Us</a>
              <a href="#" className="block transition-colors hover:text-[#E35013]">Services</a>
              <a href="#" className="block transition-colors hover:text-[#E35013]">Products</a>
              <a href="#" className="block transition-colors hover:text-[#E35013]">Contact</a>
            </nav>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold text-[#2E2C2A]">Contact Us</h3>
            <address className="space-y-2 text-sm not-italic text-[#4F4945]">
              <p>123 Innovation Street</p>
              <p>Tech City, TC 12345</p>
              <p>Phone: (123) 456-7890</p>
              <p>Email: hello@example.com</p>
            </address>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold text-[#2E2C2A]">Follow Us</h3>
            <div className="flex space-x-4">
              <button className="rounded-full p-2 text-[#4F4945] hover:text-[#E35013]">
                <Facebook className="h-4 w-4" />
                <span className="sr-only">Facebook</span>
              </button>
              <button className="rounded-full p-2 text-[#4F4945] hover:text-[#E35013]">
                <Twitter className="h-4 w-4" />
                <span className="sr-only">Twitter</span>
              </button>
              <button className="rounded-full p-2 text-[#4F4945] hover:text-[#E35013]">
                <Instagram className="h-4 w-4" />
                <span className="sr-only">Instagram</span>
              </button>
              <button className="rounded-full p-2 text-[#4F4945] hover:text-[#E35013]">
                <Linkedin className="h-4 w-4" />
                <span className="sr-only">LinkedIn</span>
              </button>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-[#E6E2E0] pt-8 text-center">
          <p className="text-sm text-[#9E9894]">
            © 2024 SkillCortex. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
