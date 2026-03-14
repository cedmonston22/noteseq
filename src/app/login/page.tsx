"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { Sun, Moon } from "lucide-react";
import PyramidBackground from "@/components/ui/PyramidBackground";
import { Tagline } from "@/components/ui/Tagline";

export default function LoginPage() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signIn } = useAuthActions();
  const router = useRouter();
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/journal");
    }
  }, [isAuthenticated, router]);

  if (isLoading || isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A0A0F]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#F2D479] border-t-transparent" />
      </div>
    );
  }

  const isDark = theme === "dark";

  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
      style={{ background: isDark ? "#0A0A0F" : "#F0F0F2" }}
    >
      <PyramidBackground mode={theme} />

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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-lg px-4 md:px-6"
      >
        {/* Logo & Tagline */}
        <div className="mb-8 flex flex-col items-center md:mb-12">
          {/* Blurred echo layer */}
          <div className="relative">
            <span
              className="absolute inset-0 flex items-center justify-center text-[36px] font-black uppercase tracking-[4px] md:text-[56px]"
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
              className="text-[36px] font-black uppercase tracking-[4px] md:text-[56px]"
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
          {/* Tagline */}
          <Tagline className="mt-5">THINK TOGETHER</Tagline>
        </div>

        {/* Sign-in button — no card, minimal */}
        <div className="flex flex-col items-center gap-5">
          <button
            onClick={async () => {
              const result = await signIn("google", { redirectTo: "/journal" });
              if (result?.redirect) {
                window.open(result.redirect, "_self");
              }
            }}
            className="flex w-full max-w-xs items-center justify-center gap-3 rounded-xl px-6 py-3.5 text-sm font-semibold transition-all active:scale-[0.97]"
            style={{
              background: isDark
                ? "rgba(255,255,255,0.06)"
                : "rgba(0,0,0,0.05)",
              color: isDark ? "#E8E8ED" : "#1a1a22",
              border: isDark
                ? "1px solid rgba(255,255,255,0.08)"
                : "1px solid rgba(0,0,0,0.08)",
              backdropFilter: "blur(12px)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = isDark
                ? "rgba(255,255,255,0.1)"
                : "rgba(0,0,0,0.08)";
              e.currentTarget.style.borderColor = isDark
                ? "rgba(212,168,67,0.3)"
                : "rgba(139,109,46,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = isDark
                ? "rgba(255,255,255,0.06)"
                : "rgba(0,0,0,0.05)";
              e.currentTarget.style.borderColor = isDark
                ? "rgba(255,255,255,0.08)"
                : "rgba(0,0,0,0.08)";
            }}
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>

          <p
            className="text-xs"
            style={{ color: isDark ? "#66667A" : "#9090a0" }}
          >
            Open sign-up — anyone with a Google account can join
          </p>
        </div>

        <p
          className="mt-10 text-center text-[11px]"
          style={{ color: isDark ? "#66667A" : "#9090a0" }}
        >
          By continuing, you agree to our Terms of Service
        </p>
      </motion.div>
    </div>
  );
}
