"use client";

import React, { useState, useRef, useEffect } from "react";
import { Share2, MoreHorizontal, Download, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import PresenceAvatars from "@/components/sharing/PresenceAvatars";
import ShareModal from "@/components/sharing/ShareModal";
import ExportModal from "@/components/export/ExportModal";
import NotificationBell from "@/components/ui/NotificationBell";

interface TopBarProps {
  title?: string;
  onTitleChange?: (title: string) => void;
  showPresence?: boolean;
  pageId?: string;
  pageTitle?: string;
  content?: Record<string, unknown>;
  onDelete?: () => void;
}

export default function TopBar({
  title = "Untitled",
  onTitleChange,
  showPresence = true,
  pageId,
  pageTitle,
  content,
  onDelete,
}: TopBarProps) {
  const [shareOpen, setShareOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  return (
    <>
      <div className="flex h-12 shrink-0 items-center gap-2 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]/80 px-3 backdrop-blur-xl md:gap-4 md:px-6">
        {/* Spacer for mobile hamburger button */}
        <div className="w-9 shrink-0 md:hidden" />

        {/* Page title */}
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange?.(e.target.value)}
          aria-label="Page title"
          className="min-w-0 flex-1 border-none bg-transparent text-sm font-medium text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
          placeholder="Untitled"
        />

        {/* Spacer */}
        <div className="hidden flex-1 md:block" />

        {/* Presence — hidden on mobile */}
        {showPresence && (
          <div className="hidden shrink-0 md:block">
            <PresenceAvatars />
          </div>
        )}

        {/* Actions */}
        <button
          onClick={() => setShareOpen(true)}
          className="flex h-8 items-center gap-2 rounded-lg border border-[var(--border-subtle)] px-2 text-xs font-medium text-[var(--text-secondary)] transition-all hover:border-[var(--border-hover)] hover:bg-[rgba(128,128,128,0.08)] hover:text-[var(--text-primary)] md:px-3"
        >
          <Share2 size={13} />
          <span className="hidden md:inline">Share</span>
        </button>

        <NotificationBell />

        {/* More options dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            aria-label="More options"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-muted)] transition-colors hover:bg-[rgba(128,128,128,0.08)] hover:text-[var(--text-secondary)]"
          >
            <MoreHorizontal size={16} />
          </button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -4, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.95 }}
                transition={{ duration: 0.12 }}
                className="absolute right-0 top-full z-50 mt-1 w-48 overflow-hidden rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] py-1 shadow-xl"
              >
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    setExportOpen(true);
                  }}
                  className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm text-[var(--text-secondary)] transition-colors hover:bg-[rgba(128,128,128,0.08)] hover:text-[var(--text-primary)]"
                >
                  <Download size={14} />
                  Export page
                </button>
                {onDelete && (
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onDelete();
                    }}
                    className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm text-red-400 transition-colors hover:bg-[rgba(239,68,68,0.08)] hover:text-red-300"
                  >
                    <Trash2 size={14} />
                    Delete page
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <ShareModal isOpen={shareOpen} onClose={() => setShareOpen(false)} pageId={pageId} />
      <ExportModal
        isOpen={exportOpen}
        onClose={() => setExportOpen(false)}
        pageId={pageId}
        pageTitle={pageTitle || title}
        content={content}
      />
    </>
  );
}
