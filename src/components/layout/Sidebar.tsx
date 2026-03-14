"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Upload,
  CalendarDays,
  Calendar,
  Share2,
  GitBranch,
  ChevronLeft,
  ChevronRight,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useConvexAuth, useQuery, useMutation } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "../../../convex/_generated/api";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/useAuth";

interface PageItem {
  id: string;
  title: string;
  icon?: string;
  isShared?: boolean;
}

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
          : "text-[var(--text-secondary)] hover:bg-[rgba(128,128,128,0.08)] hover:text-[var(--text-primary)]"
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
  onDelete,
}: {
  page: PageItem;
  collapsed: boolean;
  onDelete?: (id: string) => void;
}) {
  return (
    <Link
      href={`/p/${page.id}`}
      className="group flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-sm transition-all hover:bg-[rgba(128,128,128,0.08)]"
    >
      <span className="shrink-0 text-sm">{page.icon || "📄"}</span>
      {!collapsed && (
        <>
          <span className="truncate text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">
            {page.title}
          </span>
          {page.isShared && (
            <Share2
              size={12}
              className="ml-auto shrink-0 text-[var(--text-muted)]"
            />
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete(page.id);
              }}
              className="ml-auto shrink-0 rounded p-0.5 text-[var(--text-muted)] opacity-0 transition-opacity hover:text-red-400 group-hover:opacity-100"
              aria-label={`Delete ${page.title}`}
            >
              <X size={14} />
            </button>
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
    <p className="mb-1 mt-5 px-3 text-[11px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">
      {label}
    </p>
  );
}

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();
  const { user } = useAuth();

  // Skip queries when not authenticated
  const userPages = useQuery(api.pages.getUserPages, isAuthenticated ? {} : "skip");
  const sharedPages = useQuery(api.pages.getSharedPages, isAuthenticated ? {} : "skip");
  const createPage = useMutation(api.pages.createPage);
  const deletePageMutation = useMutation(api.pages.deletePage);

  // Map Convex pages to PageItem format
  const pages: PageItem[] = userPages
    ? userPages.map((p) => ({
        id: p._id,
        title: p.title,
        icon: p.icon,
        isShared: p.isShared,
      }))
    : [];

  const shared: PageItem[] = sharedPages
    ? sharedPages.map((p) => ({
        id: (p as { _id: string })._id,
        title: (p as { title: string }).title,
        icon: (p as { icon?: string }).icon,
        isShared: true,
      }))
    : [];

  const handleNewPage = async () => {
    try {
      const pageId = await createPage({
        title: "Untitled",
        isJournal: false,
      });
      router.push(`/p/${pageId}`);
    } catch {
      // User not authenticated or other error — ignore gracefully
    }
  };

  const handleDeletePage = async (id: string) => {
    try {
      await deletePageMutation({ pageId: id as never });
    } catch {
      // User not authenticated or other error — ignore gracefully
    }
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 56 : 260 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      role="navigation"
      aria-label="Main navigation"
      className="flex h-screen flex-col border-r border-[var(--border-subtle)] bg-[var(--bg-primary)]"
      style={{ minWidth: collapsed ? 56 : 260 }}
    >
      {/* Logo */}
      <div className="flex h-14 items-center gap-3 border-b border-[var(--border-subtle)] px-4">
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
              className="gold-sheen text-lg font-bold tracking-tight text-[var(--text-primary)]"
            >
              noteseq
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Quick actions */}
      <div className="space-y-0.5 px-2 pt-3">
        <button
          onClick={() => window.dispatchEvent(new CustomEvent("noteseq:toggle-search"))}
          className={cn(
            "group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
            "text-[var(--text-secondary)] hover:bg-[rgba(128,128,128,0.08)] hover:text-[var(--text-primary)]"
          )}
        >
          <Search size={18} className="shrink-0" />
          {!collapsed && (
            <>
              <span className="truncate">Search</span>
              <span className="ml-auto shrink-0 rounded-full bg-[rgba(212,168,67,0.15)] px-2 py-0.5 text-[10px] font-semibold text-[#F2D479]">
                ⌘K
              </span>
            </>
          )}
        </button>
        <button
          onClick={handleNewPage}
          className={cn(
            "group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
            "text-[var(--text-secondary)] hover:bg-[rgba(128,128,128,0.08)] hover:text-[var(--text-primary)]"
          )}
        >
          <Plus size={18} className="shrink-0" />
          {!collapsed && <span className="truncate">New Page</span>}
        </button>
        <button
          onClick={() => window.dispatchEvent(new CustomEvent("noteseq:toggle-import"))}
          className={cn(
            "group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
            "text-[var(--text-secondary)] hover:bg-[rgba(128,128,128,0.08)] hover:text-[var(--text-primary)]"
          )}
        >
          <Upload size={18} className="shrink-0" />
          {!collapsed && <span className="truncate">Import</span>}
        </button>
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
        <SectionLabel label="Personal" collapsed={collapsed} />
        <div className="space-y-0.5">
          {pages.length > 0 ? (
            pages.map((page) => (
              <PageListItem
                key={page.id}
                page={page}
                collapsed={collapsed}
                onDelete={userPages ? handleDeletePage : undefined}
              />
            ))
          ) : (
            !collapsed && (
              <p className="px-3 py-2 text-xs text-[var(--text-muted)]">No pages yet</p>
            )
          )}
        </div>

        <SectionLabel label="Collaborative" collapsed={collapsed} />
        <div className="space-y-0.5">
          {shared.length > 0 ? (
            shared.map((page) => (
              <PageListItem
                key={page.id}
                page={page}
                collapsed={collapsed}
              />
            ))
          ) : (
            !collapsed && (
              <p className="px-3 py-2 text-xs text-[var(--text-muted)]">No shared pages</p>
            )
          )}
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-[var(--border-subtle)] px-2 py-3">
        {!collapsed && (
          <div className="mb-2 flex items-center gap-3 px-3 py-1.5">
            {user?.image || user?.avatarUrl ? (
              <img
                src={user.image || user.avatarUrl}
                alt={user.name || "User"}
                className="h-8 w-8 shrink-0 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#D4A843] text-xs font-semibold text-white">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-[var(--text-primary)]">
                {user?.name || "User"}
              </p>
              {(user?.email || !user) && (
                <p className="truncate text-[11px] text-[var(--text-muted)]">
                  {user?.email || ""}
                </p>
              )}
            </div>
          </div>
        )}
        <div className="flex items-center gap-1">
          {!collapsed && (
            <>
              <NavItem
                href="/settings"
                icon={Settings}
                label="Settings"
                collapsed={collapsed}
              />
              <button
                onClick={async () => {
                  try {
                    await signOut();
                  } catch {
                    // signOut may fail on server but we still want to redirect
                  }
                  router.push("/login");
                }}
                className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[var(--text-secondary)] transition-all hover:bg-[rgba(128,128,128,0.08)] hover:text-[#EF4444]"
              >
                <LogOut size={18} className="shrink-0" />
              </button>
            </>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-muted)] transition-colors hover:bg-[rgba(128,128,128,0.08)] hover:text-[var(--text-secondary)]"
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
