"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Bell, Check, CheckCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useConvexAuth } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";

function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

function notificationIcon(type: string) {
  switch (type) {
    case "invite":
      return (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[rgba(212,168,67,0.15)]">
          <span className="text-sm">✉️</span>
        </div>
      );
    case "invite_accepted":
      return (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[rgba(16,185,129,0.15)]">
          <Check size={14} className="text-[#10B981]" />
        </div>
      );
    case "invite_declined":
      return (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[rgba(239,68,68,0.15)]">
          <span className="text-sm">✕</span>
        </div>
      );
    default:
      return (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[rgba(128,128,128,0.1)]">
          <Bell size={14} className="text-[var(--text-muted)]" />
        </div>
      );
  }
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const { isAuthenticated } = useConvexAuth();

  const notifications = useQuery(
    api.notifications.getNotifications,
    isAuthenticated ? {} : "skip"
  );
  const unreadCount = useQuery(
    api.notifications.getUnreadCount,
    isAuthenticated ? {} : "skip"
  );
  const markAsRead = useMutation(api.notifications.markAsRead);
  const markAllAsRead = useMutation(api.notifications.markAllAsRead);

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (
      panelRef.current &&
      !panelRef.current.contains(e.target as Node) &&
      buttonRef.current &&
      !buttonRef.current.contains(e.target as Node)
    ) {
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open, handleClickOutside]);

  const handleNotificationClick = async (
    notificationId: Id<"notifications">,
    pageId?: Id<"pages">,
    isRead?: boolean
  ) => {
    if (!isRead) {
      try { await markAsRead({ notificationId }); } catch {}
    }
    if (pageId) router.push(`/p/${pageId}`);
    setOpen(false);
  };

  const count = unreadCount ?? 0;

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setOpen(!open)}
        className="relative flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-muted)] transition-colors hover:bg-[rgba(128,128,128,0.08)] hover:text-[var(--text-primary)]"
        aria-label={`Notifications${count > 0 ? ` (${count} unread)` : ""}`}
      >
        <Bell size={18} />
        {count > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#EF4444] px-1 text-[9px] font-bold text-white">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </button>

      {open && createPortal(
        <AnimatePresence>
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="fixed right-4 top-14 w-96 overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] shadow-2xl"
            style={{ zIndex: 99999 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-4 py-3">
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                Notifications
              </h3>
              {count > 0 && (
                <button
                  onClick={() => markAllAsRead({}).catch(() => {})}
                  className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-medium text-[#D4A843] transition-colors hover:bg-[rgba(212,168,67,0.1)]"
                >
                  <CheckCheck size={13} />
                  Mark all read
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-[400px] overflow-y-auto">
              {!notifications || notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Bell size={32} className="mb-3 text-[var(--text-muted)]" strokeWidth={1.2} />
                  <p className="text-sm text-[var(--text-muted)]">No notifications yet</p>
                  <p className="mt-1 text-xs text-[var(--text-muted)]">
                    You&apos;ll be notified about invites and updates
                  </p>
                </div>
              ) : (
                notifications.map((n) => (
                  <button
                    key={n._id}
                    onClick={() =>
                      handleNotificationClick(
                        n._id,
                        n.pageId as Id<"pages"> | undefined,
                        n.read
                      )
                    }
                    className={`flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors hover:bg-[rgba(128,128,128,0.06)] ${
                      !n.read
                        ? "border-l-[3px] border-l-[#D4A843] bg-[rgba(212,168,67,0.04)]"
                        : "border-l-[3px] border-l-transparent opacity-60"
                    }`}
                  >
                    {notificationIcon(n.type)}
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-sm leading-snug ${
                          !n.read
                            ? "font-medium text-[var(--text-primary)]"
                            : "text-[var(--text-secondary)]"
                        }`}
                      >
                        {n.message}
                      </p>
                      <p className="mt-1 text-[11px] text-[var(--text-muted)]">
                        {timeAgo(n.createdAt)}
                      </p>
                    </div>
                    {!n.read && (
                      <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#D4A843]" />
                    )}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
