"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useConvexAuth, useMutation } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";

export default function InvitePage() {
  const params = useParams();
  const pageId = params.pageId as string;
  const router = useRouter();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signIn } = useAuthActions();
  const acceptInvite = useMutation(api.pages.acceptInvite);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || accepting) return;

    const doAccept = async () => {
      setAccepting(true);
      try {
        await acceptInvite({ pageId: pageId as Id<"pages"> });
        router.replace(`/p/${pageId}`);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to accept invite";
        if (message === "You own this page") {
          // Owner clicked their own invite link, just redirect
          router.replace(`/p/${pageId}`);
        } else {
          setError(message);
        }
      }
    };

    doAccept();
  }, [isAuthenticated, accepting, acceptInvite, pageId, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A0A0F]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#F2D479] border-t-transparent" />
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0A0A0F]">
        {error ? (
          <div className="flex flex-col items-center gap-4">
            <p className="text-sm text-red-400">{error}</p>
            <button
              onClick={() => router.push("/journal")}
              className="rounded-lg px-4 py-2 text-sm font-medium text-[#F2D479] transition-colors hover:bg-[rgba(212,168,67,0.1)]"
            >
              Go to Journal
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#F2D479] border-t-transparent" />
            <p className="text-sm text-[#A0A0B0]">Joining page...</p>
          </div>
        )}
      </div>
    );
  }

  // Not authenticated — show sign-in prompt
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0A0A0F]">
      <div className="flex flex-col items-center gap-8">
        {/* Branding */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-[#D4A843]">
            <span className="text-xl font-bold text-white">n</span>
            <div className="absolute inset-0 rounded-xl bg-[#D4A843] opacity-40 blur-md" />
          </div>
          <h1
            className="text-2xl font-black uppercase tracking-[3px]"
            style={{
              backgroundImage:
                "linear-gradient(90deg, #8B6D2E, #D4A843, #F2D479, #FFF5D4, #F2D479, #D4A843, #8B6D2E, #D4A843)",
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

        {/* Invitation message */}
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-lg font-medium text-[#E8E8ED]">
            You&apos;ve been invited to collaborate!
          </p>
          <p className="text-sm text-[#A0A0B0]">
            Sign in with Google to get started.
          </p>
        </div>

        {/* Google sign-in */}
        <button
          onClick={async () => {
            const result = await signIn("google", {
              redirectTo: `/invite/${pageId}`,
            });
            if (result?.redirect) {
              window.open(result.redirect, "_self");
            }
          }}
          className="flex items-center justify-center gap-3 rounded-xl px-6 py-3.5 text-sm font-semibold transition-all active:scale-[0.97]"
          style={{
            background: "rgba(255,255,255,0.06)",
            color: "#E8E8ED",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(12px)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.1)";
            e.currentTarget.style.borderColor = "rgba(212,168,67,0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.06)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
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
      </div>
    </div>
  );
}
