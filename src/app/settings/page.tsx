"use client";

import React from "react";
import { motion } from "framer-motion";
import { User, Palette, Info, ArrowLeft } from "lucide-react";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";

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
    <div className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#1A1A22] p-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[rgba(212,168,67,0.12)]">
          <Icon size={18} className="text-[#D4A843]" />
        </div>
        <h2 className="text-base font-semibold text-[#E8E8ED]">{title}</h2>
      </div>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  return (
    <AppShell>
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl px-8 py-12">
          <div className="mb-8 flex items-center gap-4">
            <Link
              href="/journal"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[rgba(255,255,255,0.06)] text-[#A0A0B0] transition-all hover:border-[rgba(255,255,255,0.1)] hover:text-[#E8E8ED]"
            >
              <ArrowLeft size={16} />
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-[#E8E8ED]">
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
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#D4A843] text-xl font-bold text-white">
                  U
                </div>
                <div>
                  <p className="text-sm font-medium text-[#E8E8ED]">User</p>
                  <p className="text-sm text-[#66667A]">user@example.com</p>
                </div>
              </div>
            </SettingsCard>

            <SettingsCard icon={Palette} title="Appearance">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#E8E8ED]">Theme</p>
                  <p className="text-xs text-[#66667A]">
                    Choose your preferred theme
                  </p>
                </div>
                <div className="flex items-center gap-1 rounded-lg border border-[rgba(255,255,255,0.06)] p-1">
                  <button className="rounded-md bg-[#D4A843] px-3 py-1.5 text-xs font-medium text-white">
                    Dark
                  </button>
                  <button className="rounded-md px-3 py-1.5 text-xs font-medium text-[#66667A]">
                    Light
                  </button>
                </div>
              </div>
            </SettingsCard>

            <SettingsCard icon={Info} title="About">
              <div className="space-y-2 text-sm text-[#A0A0B0]">
                <p>
                  <span className="text-[#66667A]">Version:</span> 0.1.0
                </p>
                <p>
                  <span className="text-[#66667A]">Built with:</span> Next.js,
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
