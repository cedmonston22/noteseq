"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { ArrowLeft, Shield, Zap, Users, Sun, Moon } from "lucide-react";
import Link from "next/link";
import PyramidBackground from "@/components/ui/PyramidBackground";
import { Tagline } from "@/components/ui/Tagline";
import { useTheme } from "@/lib/useTheme";

export default function LoginPage() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signIn } = useAuthActions();
  const router = useRouter();
  const { theme, setTheme, resolved } = useTheme();
  const isDark = resolved === "dark";

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/journal");
    }
  }, [isAuthenticated, router]);

  if (isLoading || isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: isDark ? "#0A0A0F" : "#F0F0F2" }}>
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#D4A843] border-t-transparent" />
      </div>
    );
  }

  return (
    <div
      className="relative flex min-h-screen overflow-hidden"
      style={{ background: isDark ? "#0A0A0F" : "#F0F0F2" }}
    >
      <PyramidBackground mode={resolved} />

      {/* Back to home */}
      <Link
        href="/"
        className="absolute left-6 top-6 z-20 flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors"
        style={{ color: isDark ? "#A0A0B0" : "#5a5a6e" }}
      >
        <ArrowLeft size={16} />
        Home
      </Link>

      {/* Theme toggle */}
      <button
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className="absolute right-6 top-6 z-20 flex h-9 w-9 items-center justify-center rounded-lg transition-all"
        style={{
          background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
          color: isDark ? "#A0A0B0" : "#5a5a6e",
        }}
      >
        {isDark ? <Sun size={16} /> : <Moon size={16} />}
      </button>

      {/* Left side — branding */}
      <div className="relative z-10 hidden w-1/2 flex-col items-center justify-center px-16 lg:flex xl:px-24">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center"
        >
          {/* Logo — centered over tagline */}
          <div className="relative mb-2">
            <span
              className="absolute inset-0 flex items-center justify-center text-[52px] font-black uppercase tracking-[4px]"
              style={{
                WebkitTextStroke: isDark
                  ? "1.5px rgba(212,168,67,0.2)"
                  : "1.5px rgba(184,137,46,0.12)",
                WebkitTextFillColor: "transparent",
                filter: isDark ? "blur(6px)" : "blur(8px)",
              }}
              aria-hidden="true"
            >
              NOTESEQ
            </span>
            <h1
              className="text-[52px] font-black uppercase tracking-[4px]"
              style={{
                backgroundImage: isDark
                  ? "linear-gradient(90deg, #8B6D2E, #D4A843, #F2D479, #FFF5D4, #F2D479, #D4A843, #8B6D2E, #D4A843)"
                  : "linear-gradient(90deg, #8B6D2E, #B8892E, #D4A843, #B8892E, #8B6D2E, #B8892E)",
                backgroundSize: "200% 100%",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                animation: "gold-sheen 5s ease-in-out infinite",
              }}
            >
              NOTESEQ
            </h1>
          </div>
          <Tagline className="mb-10">THINK TOGETHER</Tagline>

          <p
            className="mb-12 max-w-md text-center text-lg leading-relaxed"
            style={{ color: isDark ? "#A0A0B0" : "#5a5a6e" }}
          >
            Your workspace for ideas, notes, and collaboration.
            Built for developers who think in connected systems.
          </p>

          {/* Feature highlights */}
          <div className="w-full max-w-md space-y-5">
            {[
              { icon: Zap, title: "Lightning fast", desc: "Real-time sync powered by Convex. Every keystroke, instantly." },
              { icon: Users, title: "Collaborate live", desc: "Share pages, see who's editing, work together seamlessly." },
              { icon: Shield, title: "Your data, secured", desc: "Google OAuth. Enterprise-grade infrastructure. Always encrypted." },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                className="flex items-start gap-4"
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                  style={{ background: isDark ? "rgba(212,168,67,0.1)" : "rgba(212,168,67,0.12)" }}
                >
                  <feature.icon size={18} className="text-[#D4A843]" />
                </div>
                <div>
                  <h3
                    className="text-sm font-semibold"
                    style={{ color: isDark ? "#E8E8ED" : "#1a1a22" }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className="text-sm"
                    style={{ color: isDark ? "#66667A" : "#9090a0" }}
                  >
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right side — sign in */}
      <div className="relative z-10 flex w-full flex-col items-center justify-center px-6 lg:w-1/2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-sm"
        >
          {/* Mobile logo — centered */}
          <div className="mb-10 flex flex-col items-center lg:hidden">
            <div className="relative mb-2">
              <span
                className="absolute inset-0 flex items-center justify-center text-[36px] font-black uppercase tracking-[4px]"
                style={{
                  WebkitTextStroke: isDark
                    ? "1.5px rgba(212,168,67,0.2)"
                    : "1.5px rgba(184,137,46,0.12)",
                  WebkitTextFillColor: "transparent",
                  filter: isDark ? "blur(6px)" : "blur(8px)",
                }}
                aria-hidden="true"
              >
                NOTESEQ
              </span>
              <h1
                className="text-[36px] font-black uppercase tracking-[4px]"
                style={{
                  backgroundImage: isDark
                    ? "linear-gradient(90deg, #8B6D2E, #D4A843, #F2D479, #FFF5D4, #F2D479, #D4A843, #8B6D2E, #D4A843)"
                    : "linear-gradient(90deg, #8B6D2E, #B8892E, #D4A843, #B8892E, #8B6D2E, #B8892E)",
                  backgroundSize: "200% 100%",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  animation: "gold-sheen 5s ease-in-out infinite",
                }}
              >
                NOTESEQ
              </h1>
            </div>
            <Tagline>THINK TOGETHER</Tagline>
          </div>

          {/* Sign in card */}
          <div
            className="rounded-2xl border p-8 shadow-2xl backdrop-blur-xl"
            style={{
              background: isDark ? "rgba(26,26,34,0.8)" : "rgba(255,255,255,0.85)",
              borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)",
            }}
          >
            <div className="mb-6 text-center">
              <h2
                className="text-xl font-bold"
                style={{ color: isDark ? "#E8E8ED" : "#1a1a22" }}
              >
                Welcome back
              </h2>
              <p
                className="mt-1 text-sm"
                style={{ color: isDark ? "#66667A" : "#9090a0" }}
              >
                Sign in to continue to noteseq
              </p>
            </div>

            <button
              onClick={async () => {
                const result = await signIn("google", { redirectTo: "/journal" });
                if (result?.redirect) {
                  window.open(result.redirect, "_self");
                }
              }}
              className="group flex w-full items-center justify-center gap-3 rounded-xl px-6 py-3.5 text-sm font-semibold shadow-lg transition-all hover:shadow-xl active:scale-[0.97]"
              style={{
                background: isDark ? "#FFFFFF" : "#FFFFFF",
                color: "#1a1a22",
              }}
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continue with Google
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div
                  className="w-full border-t"
                  style={{ borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)" }}
                />
              </div>
              <div className="relative flex justify-center text-xs">
                <span
                  className="px-3"
                  style={{
                    background: isDark ? "rgba(26,26,34,0.8)" : "rgba(255,255,255,0.85)",
                    color: isDark ? "#66667A" : "#9090a0",
                  }}
                >
                  or
                </span>
              </div>
            </div>

            <button
              disabled
              className="flex w-full items-center justify-center gap-3 rounded-xl border px-6 py-3.5 text-sm font-medium transition-all"
              style={{
                borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)",
                color: isDark ? "#66667A" : "#9090a0",
              }}
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub — Coming soon
            </button>

            <p
              className="mt-6 text-center text-[11px]"
              style={{ color: isDark ? "#66667A" : "#9090a0" }}
            >
              Open sign-up — anyone with a Google account can join
            </p>
          </div>

          <p
            className="mt-6 text-center text-[11px]"
            style={{ color: isDark ? "#66667A" : "#9090a0" }}
          >
            By continuing, you agree to our Terms of Service
          </p>
        </motion.div>
      </div>
    </div>
  );
}
