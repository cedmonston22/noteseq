"use client";

import React from "react";
import { motion } from "framer-motion";
import { User, Palette, Info, ArrowLeft } from "lucide-react";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import { useTheme } from "@/lib/useTheme";
import { useAuth } from "@/lib/useAuth";

function SettingsCard({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[rgba(212,168,67,0.12)]">
          <Icon size={18} className="text-[#D4A843]" />
        </div>
        <h2 className="text-base font-semibold text-[var(--text-primary)]">{title}</h2>
      </div>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();

  return (
    <AppShell>
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl px-8 py-12">
          <div className="mb-8 flex items-center gap-4">
            <Link
              href="/journal"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border-subtle)] text-[var(--text-secondary)] transition-all hover:border-[var(--border-hover)] hover:text-[var(--text-primary)]"
            >
              <ArrowLeft size={16} />
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
              Settings
            </h1>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <SettingsCard icon={User} title="Profile">
              <div className="flex items-center gap-4">
                {user?.image || user?.avatarUrl ? (
                  <img
                    src={user.image || user.avatarUrl}
                    alt={user.name || "User"}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#D4A843] text-xl font-bold text-white">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">{user?.name || "User"}</p>
                  <p className="text-sm text-[var(--text-muted)]">{user?.email || ""}</p>
                </div>
              </div>
            </SettingsCard>

            <SettingsCard icon={Palette} title="Appearance">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">Theme</p>
                  <p className="text-xs text-[var(--text-muted)]">
                    Choose your preferred theme
                  </p>
                </div>
                <div className="flex items-center gap-1 rounded-lg border border-[var(--border-subtle)] p-1">
                  {(["light", "dark", "system"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTheme(t)}
                      className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                        theme === t
                          ? "bg-[#D4A843] text-white"
                          : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                      }`}
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </SettingsCard>

            <SettingsCard icon={Info} title="About">
              <div className="space-y-2 text-sm text-[var(--text-secondary)]">
                <p>
                  <span className="text-[var(--text-muted)]">Version:</span> 0.1.0
                </p>
                <p>
                  <span className="text-[var(--text-muted)]">Built with:</span> Next.js,
                  Convex, TipTap, Yjs
                </p>
              </div>
            </SettingsCard>
          </motion.div>
        </div>
      </div>
    </AppShell>
  );
}
