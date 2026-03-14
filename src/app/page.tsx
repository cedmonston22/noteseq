"use client";

import React, { useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useConvexAuth } from "convex/react";
import {
  FileText,
  Users,
  CalendarDays,
  GitBranch,
  FolderOpen,
  ArrowUpDown,
  Layout,
  Sun as SunIcon,
  Moon,
  Bell,
  ChevronRight,
} from "lucide-react";
import PyramidBackground from "@/components/ui/PyramidBackground";
import { Tagline } from "@/components/ui/Tagline";
import { PAGE_TEMPLATES } from "@/lib/templates";
import { useTheme } from "@/lib/useTheme";

/* ─── Scroll-animated section wrapper ─── */
function AnimatedSection({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.section
      ref={ref}
      id={id}
      className={className}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.section>
  );
}

/* ─── Feature data ─── */
const FEATURES = [
  {
    icon: FileText,
    title: "Block Editor",
    desc: "Rich WYSIWYG editing with slash commands, 18+ templates, and inline charts. Bold, italic, code, images, and more.",
  },
  {
    icon: Users,
    title: "Real-time Collaboration",
    desc: "Edit together with live presence indicators. Share pages via invite links. See who\u2019s online.",
  },
  {
    icon: CalendarDays,
    title: "Daily Journal",
    desc: "Auto-created journal pages for every day. Built-in calendar view to navigate your entries.",
  },
  {
    icon: GitBranch,
    title: "Knowledge Graph",
    desc: "Visualize connections between your pages. [[Backlinks]] create a web of linked ideas.",
  },
  {
    icon: FolderOpen,
    title: "Smart Organization",
    desc: "Folders, projects, drag-to-reorder. Personal and collaborative workspaces.",
  },
  {
    icon: ArrowUpDown,
    title: "Import & Export",
    desc: "Import from Notion, Logseq, Markdown. Export to Markdown, HTML, or plain text.",
  },
  {
    icon: Layout,
    title: "Templates",
    desc: "18 ready-made templates: meeting notes, project plans, OKRs, retrospectives, and more.",
  },
  {
    icon: SunIcon,
    title: "Dark & Light Mode",
    desc: "Beautiful dark and light themes. Respects your system preference with manual toggle.",
  },
  {
    icon: Bell,
    title: "Notifications",
    desc: "Stay in the loop with invite notifications. Accept or decline collaboration requests.",
  },
];

/* ─── Main page ─── */
export default function Home() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const router = useRouter();
  const { setTheme, resolved } = useTheme();
  const isDark = resolved === "dark";

  // Authenticated users go straight to journal
  if (isAuthenticated) {
    router.replace("/journal");
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: isDark ? "#0A0A0F" : "#F0F0F2" }}>
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#D4A843] border-t-transparent" />
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: isDark ? "#0A0A0F" : "#F0F0F2" }}>
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#D4A843] border-t-transparent" />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{
        background: isDark ? "#0A0A0F" : "#F0F0F2",
        color: isDark ? "#E8E8ED" : "#1a1a22",
        fontFamily: "var(--font-outfit), 'Outfit', sans-serif",
        scrollBehavior: "smooth",
      }}
    >
      {/* Theme toggle */}
      <button
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className="fixed right-6 top-6 z-50 flex h-10 w-10 items-center justify-center rounded-xl shadow-lg transition-all"
        style={{
          background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
          color: isDark ? "#A0A0B0" : "#5a5a6e",
          backdropFilter: "blur(12px)",
        }}
      >
        {isDark ? <SunIcon size={18} /> : <Moon size={18} />}
      </button>
      {/* ═══════════════════ HERO ═══════════════════ */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4">
        <PyramidBackground mode={resolved} />

        {/* Radial glow behind title */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 z-[1] -translate-x-1/2 -translate-y-1/2"
          style={{
            width: "700px",
            height: "500px",
            background:
              "radial-gradient(ellipse at center, rgba(212,168,67,0.06) 0%, transparent 70%)",
          }}
        />

        <motion.div
          className="relative z-10 flex flex-col items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* NOTESEQ title with gold sheen */}
          <div className="relative mb-4">
            {/* Blurred echo */}
            <span
              className="absolute inset-0 flex items-center justify-center text-[48px] font-black uppercase tracking-[6px] sm:text-[64px] md:text-[80px]"
              style={{
                WebkitTextStroke: isDark
                  ? "1.5px rgba(212,168,67,0.2)"
                  : "1.5px rgba(184,137,46,0.15)",
                WebkitTextFillColor: "transparent",
                filter: isDark ? "blur(6px)" : "blur(8px)",
              }}
              aria-hidden="true"
            >
              NOTESEQ
            </span>
            <h1
              className="text-[48px] font-black uppercase tracking-[6px] sm:text-[64px] md:text-[80px]"
              style={{
                backgroundImage: isDark
                  ? "linear-gradient(90deg, #8B6D2E, #D4A843, #F2D479, #FFF5D4, #F2D479, #D4A843, #8B6D2E, #D4A843)"
                  : "linear-gradient(90deg, #6B5420, #8B6D2E, #B8892E, #D4A843, #B8892E, #8B6D2E, #6B5420, #8B6D2E)",
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

          <Tagline className="mb-6">THINK TOGETHER</Tagline>

          <motion.p
            className="mb-10 max-w-xl text-center text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Real-time collaborative notes for developers. Block editor,
            knowledge graph, daily journals — all in a polished, premium
            interface.
          </motion.p>

          <motion.div
            className="flex flex-col items-center gap-4 sm:flex-row"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Link
              href="/login"
              className="group flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-semibold text-[#0A0A0F] transition-all hover:brightness-110 active:scale-[0.97]"
              style={{
                background:
                  "linear-gradient(135deg, #D4A843 0%, #F2D479 50%, #D4A843 100%)",
                boxShadow: "0 0 24px rgba(212,168,67,0.25)",
              }}
            >
              Get Started Free
              <ChevronRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
            <button
              onClick={() =>
                document
                  .getElementById("features")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="rounded-xl px-7 py-3.5 text-sm font-semibold text-[var(--text-primary)] transition-all hover:border-[rgba(212,168,67,0.3)] active:scale-[0.97]"
              style={{
                border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)",
              }}
            >
              See Features
            </button>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <motion.div
            className="h-8 w-5 rounded-full border"
            style={{ borderColor: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)", display: "flex", justifyContent: "center", paddingTop: 6 }}
          >
            <motion.div
              className="h-2 w-1 rounded-full bg-[#D4A843]"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ FEATURES ═══════════════════ */}
      <AnimatedSection
        id="features"
        className="mx-auto max-w-6xl px-4 py-24 sm:px-6 md:py-32"
      >
        <h2 className="mb-4 text-center text-3xl font-bold text-[var(--text-primary)] sm:text-4xl">
          Everything you need to think clearly
        </h2>
        <p className="mx-auto mb-16 max-w-lg text-center text-[var(--text-muted)]">
          A complete workspace for notes, docs, and knowledge — built for teams
          and individuals who care about craft.
        </p>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                className="group rounded-2xl border border-[var(--border-subtle)] p-6 transition-all hover:-translate-y-1 hover:border-[rgba(212,168,67,0.2)]"
                style={{
                  background: isDark ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.7)",
                  backdropFilter: "blur(8px)",
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <div
                  className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{
                    background: isDark
                      ? "linear-gradient(135deg, rgba(212,168,67,0.12) 0%, rgba(242,212,121,0.06) 100%)"
                      : "linear-gradient(135deg, rgba(212,168,67,0.15) 0%, rgba(242,212,121,0.08) 100%)",
                    border: isDark
                      ? "1px solid rgba(212,168,67,0.15)"
                      : "1px solid rgba(184,137,46,0.2)",
                  }}
                >
                  <Icon size={18} className="text-[#D4A843]" />
                </div>
                <h3 className="mb-2 text-sm font-semibold text-[var(--text-primary)]">
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed text-[var(--text-muted)]">
                  {f.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </AnimatedSection>

      {/* ═══════════════════ EDITOR PREVIEW ═══════════════════ */}
      <AnimatedSection className="mx-auto max-w-5xl px-4 py-24 sm:px-6 md:py-32">
        <h2 className="mb-4 text-center text-3xl font-bold text-[var(--text-primary)] sm:text-4xl">
          A writing experience that feels incredible
        </h2>
        <p className="mx-auto mb-14 max-w-lg text-center text-[var(--text-muted)]">
          A distraction-free block editor with everything you need — and nothing
          you don&apos;t.
        </p>

        {/* Mock editor */}
        <div
          className="relative mx-auto overflow-hidden rounded-2xl"
          style={{
            background: isDark ? "#12141A" : "#FFFFFF",
            border: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.08)",
            boxShadow: isDark
              ? "0 0 80px rgba(212,168,67,0.06), 0 20px 60px rgba(0,0,0,0.5)"
              : "0 4px 40px rgba(0,0,0,0.08), 0 0 80px rgba(212,168,67,0.06)",
          }}
        >
          <div className="flex">
            {/* Sidebar mock */}
            <div
              className="hidden w-56 shrink-0 border-r p-4 md:block"
              style={{
                background: isDark ? "#0E1015" : "#F5F5F7",
                borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
              }}
            >
              {/* Search */}
              <div
                className="mb-4 rounded-lg px-3 py-2 text-xs"
                style={{
                  background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
                  color: isDark ? "#66667A" : "#9090a0",
                }}
              >
                Search...
              </div>
              {/* Nav items */}
              <div className="mb-6 space-y-1">
                <div className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs" style={{ color: isDark ? "#66667A" : "#6B6B80" }}>
                  <CalendarDays size={13} className="text-[#D4A843]" />
                  <span>Journal</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs" style={{ background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)", color: isDark ? "#E8E8ED" : "#1a1a22" }}>
                  <FileText size={13} className="text-[#D4A843]" />
                  <span>Project Roadmap</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs" style={{ color: isDark ? "#66667A" : "#6B6B80" }}>
                  <GitBranch size={13} style={{ color: isDark ? "#5A5A6A" : "#9090a0" }} />
                  <span>Knowledge Graph</span>
                </div>
              </div>
              {/* Folder */}
              <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider" style={{ color: isDark ? "#66667A" : "#9090a0" }}>
                Projects
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs" style={{ color: isDark ? "#66667A" : "#6B6B80" }}>
                  <FolderOpen size={13} style={{ color: isDark ? "#5A5A6A" : "#9090a0" }} />
                  <span>Engineering</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs" style={{ color: isDark ? "#66667A" : "#6B6B80" }}>
                  <FolderOpen size={13} style={{ color: isDark ? "#5A5A6A" : "#9090a0" }} />
                  <span>Design System</span>
                </div>
              </div>
              {/* Online users */}
              <div className="mt-6 flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-[10px]" style={{ color: isDark ? "#5A5A6A" : "#9090a0" }}>
                  2 online
                </span>
              </div>
            </div>

            {/* Editor content */}
            <div className="flex-1 p-6 sm:p-10">
              {/* Breadcrumb */}
              <div className="mb-6 flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                <span>Engineering</span>
                <span>/</span>
                <span className="text-[var(--text-muted)]">Project Roadmap</span>
              </div>

              {/* Title */}
              <h1 className="mb-6 text-2xl font-bold text-[var(--text-primary)] sm:text-3xl">
                Project Roadmap Q1 2026
              </h1>

              {/* Content blocks */}
              <div className="space-y-4 text-sm leading-relaxed text-[var(--text-secondary)]">
                <p>
                  This quarter we&apos;re focusing on{" "}
                  <span className="font-semibold text-[var(--text-primary)]">
                    real-time collaboration
                  </span>{" "}
                  and improving the{" "}
                  <span
                    className="rounded px-1 py-0.5 text-[#D4A843]"
                    style={{ background: "rgba(212,168,67,0.1)" }}
                  >
                    knowledge graph
                  </span>{" "}
                  experience.
                </p>

                <h3 className="!mt-6 text-base font-semibold text-[var(--text-primary)]">
                  Milestones
                </h3>

                <ul className="ml-4 list-disc space-y-1.5 text-[var(--text-secondary)]">
                  <li>Launch live cursors and presence indicators</li>
                  <li>Add page sharing with granular permissions</li>
                  <li>Ship the new graph visualization engine</li>
                </ul>

                {/* Checklist */}
                <h3 className="!mt-6 text-base font-semibold text-[var(--text-primary)]">
                  Action Items
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2.5">
                    <div className="flex h-4 w-4 items-center justify-center rounded border border-[#D4A843] bg-[rgba(212,168,67,0.15)]">
                      <svg
                        viewBox="0 0 12 12"
                        className="h-2.5 w-2.5 text-[#D4A843]"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M2 6l3 3 5-5" />
                      </svg>
                    </div>
                    <span className="text-[var(--text-muted)] line-through">
                      Set up Yjs collaboration server
                    </span>
                  </label>
                  <label className="flex items-center gap-2.5">
                    <div className="h-4 w-4 rounded border" style={{ borderColor: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)" }} />
                    <span style={{ color: isDark ? "#A0A0B0" : "#5a5a6e" }}>
                      Design invite link flow
                    </span>
                  </label>
                  <label className="flex items-center gap-2.5">
                    <div className="h-4 w-4 rounded border" style={{ borderColor: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)" }} />
                    <span className="text-[var(--text-secondary)]">
                      Build graph force layout
                    </span>
                  </label>
                </div>

                {/* Code block */}
                <div
                  className="!mt-6 overflow-hidden rounded-lg"
                  style={{
                    background: isDark ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.03)",
                    border: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.06)",
                  }}
                >
                  <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-4 py-2">
                    <span className="text-[10px] font-medium text-[#5A5A6A]">
                      typescript
                    </span>
                  </div>
                  <pre className="p-4 text-xs leading-relaxed">
                    <code>
                      <span className="text-[#C792EA]">const</span>{" "}
                      <span className="text-[#82AAFF]">config</span>{" "}
                      <span className="text-[#C792EA]">=</span>{" "}
                      <span className="text-[#89DDFF]">{"{"}</span>
                      {"\n"}
                      {"  "}
                      <span className="text-[var(--text-secondary)]">collaboration</span>
                      <span className="text-[#89DDFF]">:</span>{" "}
                      <span className="text-[#F78C6C]">true</span>
                      <span className="text-[#89DDFF]">,</span>
                      {"\n"}
                      {"  "}
                      <span className="text-[var(--text-secondary)]">provider</span>
                      <span className="text-[#89DDFF]">:</span>{" "}
                      <span className="text-[#C3E88D]">
                        &quot;partykit&quot;
                      </span>
                      <span className="text-[#89DDFF]">,</span>
                      {"\n"}
                      {"  "}
                      <span className="text-[var(--text-secondary)]">theme</span>
                      <span className="text-[#89DDFF]">:</span>{" "}
                      <span className="text-[#C3E88D]">
                        &quot;dark&quot;
                      </span>
                      {"\n"}
                      <span className="text-[#89DDFF]">{"}"}</span>
                      <span className="text-[#89DDFF]">;</span>
                    </code>
                  </pre>
                </div>
              </div>

              {/* Presence indicators */}
              <div className="mt-8 flex items-center gap-2">
                <div
                  className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold text-white"
                  style={{ background: "#6366F1" }}
                >
                  A
                </div>
                <div
                  className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold text-white"
                  style={{ background: "#D946EF" }}
                >
                  M
                </div>
                <span className="ml-1 text-[10px] text-[#5A5A6A]">
                  2 collaborators editing
                </span>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* ═══════════════════ TEMPLATES ═══════════════════ */}
      <AnimatedSection className="py-24 md:py-32">
        <h2 className="mb-4 text-center text-3xl font-bold text-[var(--text-primary)] sm:text-4xl">
          Start fast with {PAGE_TEMPLATES.length} templates
        </h2>
        <p className="mx-auto mb-12 max-w-lg text-center text-[var(--text-muted)]">
          From meeting notes to OKR trackers — jump right in with a template
          that fits your workflow.
        </p>

        {/* Horizontal scroll */}
        <div className="relative">
          {/* Fade edges */}
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-12 sm:w-20" style={{ background: `linear-gradient(to right, ${isDark ? "#0A0A0F" : "#F0F0F2"}, transparent)` }} />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-12 sm:w-20" style={{ background: `linear-gradient(to left, ${isDark ? "#0A0A0F" : "#F0F0F2"}, transparent)` }} />

          <div
            className="scrollbar-hide flex gap-4 overflow-x-auto px-6 py-2 sm:px-12"
          >
            {PAGE_TEMPLATES.map((t) => (
              <motion.div
                key={t.id}
                className="flex shrink-0 flex-col items-center gap-2 rounded-xl border border-[var(--border-subtle)] px-5 py-4 transition-all hover:-translate-y-1 hover:border-[rgba(212,168,67,0.2)]"
                style={{
                  background: isDark ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.7)",
                  minWidth: "120px",
                }}
                whileInView={{ opacity: 1, scale: 1 }}
                initial={{ opacity: 0, scale: 0.95 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
              >
                <span className="text-2xl">{t.icon}</span>
                <span className="whitespace-nowrap text-xs font-medium text-[var(--text-secondary)]">
                  {t.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* ═══════════════════ CTA / FOOTER ═══════════════════ */}
      <section className="px-4 pb-12 pt-24 md:pt-32">
        {/* CTA */}
        <motion.div
          className="mx-auto mb-24 flex max-w-2xl flex-col items-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="mb-4 text-center text-3xl font-bold text-[var(--text-primary)] sm:text-4xl">
            Ready to think together?
          </h2>
          <p className="mb-8 text-center text-[var(--text-muted)]">
            Join noteseq for free and start building your second brain.
          </p>
          <Link
            href="/login"
            className="group flex items-center gap-2 rounded-xl px-8 py-4 text-sm font-semibold text-[#0A0A0F] transition-all hover:brightness-110 active:scale-[0.97]"
            style={{
              background:
                "linear-gradient(135deg, #D4A843 0%, #F2D479 50%, #D4A843 100%)",
              boxShadow: "0 0 32px rgba(212,168,67,0.3)",
            }}
          >
            Get Started Free
            <ChevronRight
              size={16}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </motion.div>

        {/* Footer */}
        <footer className="mx-auto max-w-4xl border-t border-[var(--border-subtle)] pt-8">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <p className="text-xs text-[var(--text-muted)]">
              &copy; 2026 noteseq
            </p>
            <p className="text-xs text-[var(--text-muted)]">
              Built with{" "}
              <span className="text-[var(--text-muted)]">Next.js</span>,{" "}
              <span className="text-[var(--text-muted)]">Convex</span>,{" "}
              <span className="text-[var(--text-muted)]">TipTap</span>
              {" "}&middot;{" "}
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--text-muted)] underline decoration-[var(--border-subtle)] underline-offset-2 transition-colors hover:text-[#D4A843]"
              >
                GitHub
              </a>
            </p>
          </div>
        </footer>
      </section>

    </div>
  );
}
