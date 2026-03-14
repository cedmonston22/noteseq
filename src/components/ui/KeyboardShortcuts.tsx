"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Keyboard } from "lucide-react";

interface ShortcutEntry {
  keys: string;
  action: string;
}

interface ShortcutGroup {
  category: string;
  shortcuts: ShortcutEntry[];
}

const SHORTCUT_GROUPS: ShortcutGroup[] = [
  {
    category: "Formatting",
    shortcuts: [
      { keys: "Cmd+B", action: "Bold" },
      { keys: "Cmd+I", action: "Italic" },
      { keys: "Cmd+U", action: "Underline" },
      { keys: "Cmd+Shift+X", action: "Strikethrough" },
      { keys: "Cmd+E", action: "Inline code" },
      { keys: "Cmd+Shift+H", action: "Highlight" },
    ],
  },
  {
    category: "Blocks",
    shortcuts: [
      { keys: "/", action: "Slash commands" },
      { keys: "[[", action: "Link to page" },
      { keys: "---", action: "Horizontal rule" },
      { keys: "Cmd+Shift+1", action: "Heading 1" },
      { keys: "Cmd+Shift+2", action: "Heading 2" },
      { keys: "Cmd+Shift+3", action: "Heading 3" },
    ],
  },
  {
    category: "Lists",
    shortcuts: [
      { keys: "- or *", action: "Bullet list" },
      { keys: "1.", action: "Numbered list" },
      { keys: "[] ", action: "Task list" },
      { keys: ">", action: "Blockquote" },
      { keys: "Tab", action: "Indent list item" },
      { keys: "Shift+Tab", action: "Outdent list item" },
    ],
  },
  {
    category: "Navigation",
    shortcuts: [
      { keys: "Cmd+K", action: "Search pages" },
      { keys: "?", action: "Keyboard shortcuts" },
    ],
  },
];

function isMac(): boolean {
  if (typeof navigator === "undefined") return false;
  return navigator.platform?.toLowerCase().includes("mac") ||
    navigator.userAgent?.toLowerCase().includes("mac");
}

function formatKeys(keys: string): string {
  if (isMac()) return keys;
  return keys.replace(/Cmd/g, "Ctrl");
}

interface KeyboardShortcutsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function KeyboardShortcuts({ isOpen, onClose }: KeyboardShortcutsProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: "rgba(0, 0, 0, 0.6)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Keyboard shortcuts"
            className="relative z-10 w-full max-w-[520px] overflow-hidden rounded-xl shadow-2xl"
            style={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-subtle)",
              boxShadow:
                "0 0 0 1px rgba(212,168,67,0.08), 0 25px 50px -12px rgba(0,0,0,0.6)",
            }}
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: "1px solid var(--border-subtle)" }}
            >
              <div className="flex items-center gap-2.5">
                <Keyboard size={18} style={{ color: "var(--text-muted)" }} />
                <h2
                  className="text-base font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  Keyboard Shortcuts
                </h2>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 transition-colors hover:bg-[rgba(128,128,128,0.1)]"
                style={{ color: "var(--text-muted)" }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="max-h-[60vh] overflow-y-auto px-5 py-4">
              {SHORTCUT_GROUPS.map((group, groupIndex) => (
                <div key={group.category} className={groupIndex > 0 ? "mt-5" : ""}>
                  <p
                    className="mb-2.5 text-[11px] font-semibold uppercase tracking-widest"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {group.category}
                  </p>
                  <div className="space-y-1">
                    {group.shortcuts.map((shortcut) => (
                      <div
                        key={shortcut.action}
                        className="flex items-center justify-between rounded-lg px-3 py-2 transition-colors hover:bg-[rgba(128,128,128,0.06)]"
                      >
                        <span
                          className="text-sm"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {shortcut.action}
                        </span>
                        <div className="flex items-center gap-1">
                          {formatKeys(shortcut.keys).split("+").map((key, i) => (
                            <kbd
                              key={i}
                              className="inline-flex min-w-[24px] items-center justify-center rounded-md border px-1.5 py-0.5 text-[11px] font-medium"
                              style={{
                                borderColor: "var(--border-subtle)",
                                background: "rgba(128,128,128,0.08)",
                                color: "var(--text-muted)",
                              }}
                            >
                              {key.trim()}
                            </kbd>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div
              className="px-5 py-3 text-center text-[11px]"
              style={{
                borderTop: "1px solid var(--border-subtle)",
                color: "var(--text-muted)",
              }}
            >
              Press <kbd
                className="mx-0.5 inline-flex items-center justify-center rounded border px-1 py-0.5 text-[10px] font-medium"
                style={{
                  borderColor: "var(--border-subtle)",
                  background: "rgba(128,128,128,0.08)",
                }}
              >?</kbd> to toggle this panel
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
