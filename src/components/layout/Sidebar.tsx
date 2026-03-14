"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  CalendarDays,
  FileText,
  Share2,
  GitBranch,
  ChevronLeft,
  ChevronRight,
  Settings,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface PageItem {
  id: string;
  title: string;
  icon?: string;
  isShared?: boolean;
}

const DEMO_PAGES: PageItem[] = [
  { id: "1", title: "Project Ideas", icon: "💡" },
  { id: "2", title: "Architecture Notes", icon: "🏗️" },
  { id: "3", title: "API Design", icon: "🔌" },
  { id: "4", title: "Meeting Notes", icon: "📝", isShared: true },
  { id: "5", title: "Reading List", icon: "📚" },
];

const DEMO_SHARED: PageItem[] = [
  { id: "6", title: "Team Standup", icon: "🤝", isShared: true },
  { id: "7", title: "Sprint Planning", icon: "🎯", isShared: true },
];

function NavItem({
  href,
  icon: Icon,
  label,
  active,
  collapsed,
  badge,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  active?: boolean;
  collapsed: boolean;
  badge?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
        active
          ? "bg-[rgba(212,168,67,0.12)] text-[#F2D479]"
          : "text-[#A0A0B0] hover:bg-[rgba(255,255,255,0.04)] hover:text-[#E8E8ED]"
      )}
    >
      <Icon size={18} className="shrink-0" />
      <AnimatePresence>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            className="truncate"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
      {!collapsed && badge && (
        <span className="ml-auto shrink-0 rounded-full bg-[rgba(212,168,67,0.15)] px-2 py-0.5 text-[10px] font-semibold text-[#F2D479]">
          {badge}
        </span>
      )}
    </Link>
  );
}

function PageListItem({
  page,
  collapsed,
}: {
  page: PageItem;
  collapsed: boolean;
}) {
  return (
    <Link
      href={`/p/${page.id}`}
      className="group flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-sm transition-all hover:bg-[rgba(255,255,255,0.04)]"
    >
      <span className="shrink-0 text-sm">{page.icon || "📄"}</span>
      {!collapsed && (
        <>
          <span className="truncate text-[#A0A0B0] group-hover:text-[#E8E8ED]">
            {page.title}
          </span>
          {page.isShared && (
            <Share2
              size={12}
              className="ml-auto shrink-0 text-[#66667A]"
            />
          )}
        </>
      )}
    </Link>
  );
}

function SectionLabel({
  label,
  collapsed,
}: {
  label: string;
  collapsed: boolean;
}) {
  if (collapsed) return null;
  return (
    <p className="mb-1 mt-5 px-3 text-[11px] font-semibold uppercase tracking-widest text-[#66667A]">
      {label}
    </p>
  );
}

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <motion.aside
      animate={{ width: collapsed ? 56 : 260 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      role="navigation"
      aria-label="Main navigation"
      className="flex h-screen flex-col border-r border-[rgba(255,255,255,0.06)] bg-[#0A0A0F]"
      style={{ minWidth: collapsed ? 56 : 260 }}
    >
      {/* Logo */}
      <div className="flex h-14 items-center gap-3 border-b border-[rgba(255,255,255,0.06)] px-4">
        <div className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#D4A843]">
          <span className="text-sm font-bold text-white">n</span>
          <div className="absolute inset-0 rounded-lg bg-[#D4A843] opacity-40 blur-md" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="gold-sheen text-lg font-bold tracking-tight text-[#E8E8ED]"
            >
              noteseq
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Quick actions */}
      <div className="space-y-0.5 px-2 pt-3">
        <NavItem
          href="#"
          icon={Search}
          label="Search"
          collapsed={collapsed}
          badge="⌘K"
        />
        <NavItem
          href="#"
          icon={Plus}
          label="New Page"
          collapsed={collapsed}
        />
      </div>

      {/* Navigation */}
      <div className="space-y-0.5 px-2 pt-1">
        <NavItem
          href="/journal"
          icon={CalendarDays}
          label="Journal"
          active={pathname.startsWith("/journal")}
          collapsed={collapsed}
        />
        <NavItem
          href="/graph"
          icon={GitBranch}
          label="Graph View"
          active={pathname === "/graph"}
          collapsed={collapsed}
        />
      </div>

      {/* Pages */}
      <div className="flex-1 overflow-y-auto px-2">
        <SectionLabel label="Pages" collapsed={collapsed} />
        <div className="space-y-0.5">
          {DEMO_PAGES.map((page) => (
            <PageListItem
              key={page.id}
              page={page}
              collapsed={collapsed}
            />
          ))}
        </div>

        <SectionLabel label="Shared with me" collapsed={collapsed} />
        <div className="space-y-0.5">
          {DEMO_SHARED.map((page) => (
            <PageListItem
              key={page.id}
              page={page}
              collapsed={collapsed}
            />
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-[rgba(255,255,255,0.06)] px-2 py-3">
        {!collapsed && (
          <div className="mb-2 flex items-center gap-3 px-3 py-1.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#D4A843] text-xs font-semibold text-white">
              U
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-[#E8E8ED]">
                User
              </p>
              <p className="truncate text-[11px] text-[#66667A]">
                user@example.com
              </p>
            </div>
          </div>
        )}
        <div className="flex items-center gap-1">
          {!collapsed && (
            <NavItem
              href="/settings"
              icon={Settings}
              label="Settings"
              collapsed={collapsed}
            />
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg text-[#66667A] transition-colors hover:bg-[rgba(255,255,255,0.04)] hover:text-[#A0A0B0]"
          >
            {collapsed ? (
              <ChevronRight size={16} />
            ) : (
              <ChevronLeft size={16} />
            )}
          </button>
        </div>
      </div>
    </motion.aside>
  );
}
