"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { useConvexAuth } from "convex/react";
import { api } from "../../../convex/_generated/api";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { isAuthenticated } = useConvexAuth();

  // Only query when authenticated and search term is not empty
  const rawResults = useQuery(
    api.pages.searchPages,
    isAuthenticated && searchTerm.trim().length > 0
      ? { query: searchTerm.trim() }
      : "skip"
  );

  // Filter out any null entries from the query results
  const results = rawResults
    ? rawResults.filter(
        (p): p is NonNullable<(typeof rawResults)[number]> => p != null
      )
    : rawResults;

  // Global Cmd+K / Ctrl+K listener
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // We need the parent to open us — trigger via a custom approach
          // Since this component controls the shortcut, we rely on the parent
          // passing isOpen. But we also need to open it. We'll dispatch a custom event.
          window.dispatchEvent(new CustomEvent("noteseq:toggle-search"));
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setSearchTerm("");
      setSelectedIndex(0);
      // Auto-focus input after animation
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, [isOpen]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  const navigateToPage = useCallback(
    (pageId: string) => {
      router.push(`/p/${pageId}`);
      onClose();
    },
    [router, onClose]
  );

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const items = results ?? [];

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < items.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : items.length - 1
          );
          break;
        case "Enter":
          e.preventDefault();
          if (items.length > 0 && items[selectedIndex]) {
            navigateToPage(items[selectedIndex]._id);
          }
          break;
        case "Escape":
          e.preventDefault();
          onClose();
          break;
      }
    },
    [results, selectedIndex, navigateToPage, onClose]
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]"
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
            aria-label="Search pages"
            className="relative z-10 w-full max-w-[480px] overflow-hidden rounded-xl shadow-2xl"
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
            onKeyDown={handleKeyDown}
          >
            {/* Search input */}
            <div
              className="flex items-center gap-3 px-4 py-3"
              style={{ borderBottom: "1px solid var(--border-subtle)" }}
            >
              <Search size={20} className="shrink-0 text-[var(--text-muted)]" />
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search pages..."
                autoFocus
                className="flex-1 bg-transparent text-lg text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none"
              />
              <kbd className="hidden shrink-0 rounded-md border border-[var(--border-subtle)] bg-[rgba(128,128,128,0.08)] px-1.5 py-0.5 text-[11px] font-medium text-[var(--text-muted)] sm:inline-block">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-[320px] overflow-y-auto py-2">
              {searchTerm.trim().length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-[var(--text-muted)]">
                  Type to search your pages...
                </p>
              ) : results === undefined ? (
                <div className="flex items-center justify-center px-4 py-8">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#D4A843] border-t-transparent" />
                </div>
              ) : results.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-[var(--text-muted)]">
                  No pages found
                </p>
              ) : (
                results.map((page, index) => (
                  <button
                    key={page._id}
                    onClick={() => navigateToPage(page._id)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors"
                    style={{
                      background:
                        index === selectedIndex
                          ? "rgba(212,168,67,0.10)"
                          : "transparent",
                    }}
                  >
                    <span className="shrink-0 text-base">
                      {page.icon || (
                        <FileText size={18} className="text-[var(--text-muted)]" />
                      )}
                    </span>
                    <span
                      className="min-w-0 flex-1 truncate text-sm font-medium"
                      style={{
                        color:
                          index === selectedIndex ? "#F2D479" : "#C8C8D0",
                      }}
                    >
                      {page.title}
                    </span>
                    {page.isJournal && (
                      <span className="shrink-0 rounded-full bg-[rgba(212,168,67,0.12)] px-2 py-0.5 text-[10px] font-semibold text-[#D4A843]">
                        Journal
                      </span>
                    )}
                    {page.isShared && (
                      <span className="shrink-0 rounded-full bg-[rgba(99,179,237,0.12)] px-2 py-0.5 text-[10px] font-semibold text-[#63B3ED]">
                        Shared
                      </span>
                    )}
                  </button>
                ))
              )}
            </div>

            {/* Footer hint */}
            {results && results.length > 0 && (
              <div
                className="flex items-center gap-4 px-4 py-2.5 text-[11px] text-[var(--text-muted)]"
                style={{ borderTop: "1px solid var(--border-subtle)" }}
              >
                <span className="flex items-center gap-1">
                  <kbd className="rounded border border-[var(--border-subtle)] bg-[rgba(128,128,128,0.08)] px-1 py-0.5 text-[10px]">
                    &uarr;
                  </kbd>
                  <kbd className="rounded border border-[var(--border-subtle)] bg-[rgba(128,128,128,0.08)] px-1 py-0.5 text-[10px]">
                    &darr;
                  </kbd>
                  navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="rounded border border-[var(--border-subtle)] bg-[rgba(128,128,128,0.08)] px-1 py-0.5 text-[10px]">
                    &crarr;
                  </kbd>
                  open
                </span>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
