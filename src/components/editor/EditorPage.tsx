"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight, ArrowUpRight, FileText } from "lucide-react";
import { useConvexAuth, useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import TopBar from "@/components/layout/TopBar";
import NoteEditor from "./Editor";
import { useAuth } from "@/lib/useAuth";

const PAGE_ICONS = [
  "📝", "💡", "🏗️", "🔌", "📚", "🎯", "🤝", "📋", "🚀", "💻",
  "🎨", "📊", "🔒", "⚡", "🌟", "📌", "🔧", "💬", "📁", "✨",
];

interface BacklinkItem {
  id: string;
  title: string;
  icon: string;
}

interface EditorPageProps {
  pageId?: string;
  title?: string;
  isJournal?: boolean;
  journalNav?: React.ReactNode;
}

export default function EditorPage({
  pageId,
  title: initialTitle = "Untitled",
  isJournal = false,
  journalNav,
}: EditorPageProps) {
  const [title, setTitle] = useState(initialTitle);
  const [backlinksOpen, setBacklinksOpen] = useState(false);
  const [iconPickerOpen, setIconPickerOpen] = useState(false);

  const { isAuthenticated } = useConvexAuth();
  const { user } = useAuth();

  const convexPageId = pageId as Id<"pages"> | undefined;

  // Per-tab session ID so same account in two tabs sees both cursors
  const sessionIdRef = useRef(Math.random().toString(36).slice(2));
  const sessionId = sessionIdRef.current;

  // Presence: cursor sync via Convex
  const updatePresenceMut = useMutation(api.presence.updatePresence);
  const removePresenceMut = useMutation(api.presence.removePresence);
  const remotePresence = useQuery(
    api.presence.getPresence,
    isAuthenticated && convexPageId ? { pageId: convexPageId, sessionId } : "skip"
  );

  const cursorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleCursorChange = useCallback(
    (from: number, to: number) => {
      if (!convexPageId) return;
      if (cursorTimerRef.current) clearTimeout(cursorTimerRef.current);
      cursorTimerRef.current = setTimeout(() => {
        updatePresenceMut({ pageId: convexPageId, sessionId, cursor: { from, to } }).catch(() => {});
      }, 500);
    },
    [convexPageId, sessionId, updatePresenceMut]
  );

  // Send heartbeat and clean up on unmount
  useEffect(() => {
    if (!convexPageId || !isAuthenticated) return;
    const interval = setInterval(() => {
      updatePresenceMut({ pageId: convexPageId, sessionId }).catch(() => {});
    }, 5000);
    return () => {
      clearInterval(interval);
      removePresenceMut({ pageId: convexPageId, sessionId }).catch(() => {});
    };
  }, [convexPageId, sessionId, isAuthenticated, updatePresenceMut, removePresenceMut]);

  const remoteCursors = (remotePresence || [])
    .filter((p) => p.cursor)
    .map((p) => ({
      userName: p.userName,
      userColor: p.userColor,
      from: p.cursor!.from,
      to: p.cursor!.to,
    }));

  // Backlinks query
  const backlinksData = useQuery(
    api.backlinks.getBacklinksForPage,
    isAuthenticated && convexPageId ? { pageId: convexPageId } : "skip"
  );

  const backlinks: BacklinkItem[] =
    isAuthenticated && convexPageId && backlinksData
      ? backlinksData
          .filter(
            (b): b is NonNullable<typeof b> & { sourcePage: { _id: string; title: string; icon?: string } } =>
              b !== null && b.sourcePage !== undefined
          )
          .map((b) => ({
            id: b.sourcePage._id,
            title: b.sourcePage.title || "Untitled",
            icon: b.sourcePage.icon || "📄",
          }))
      : [];

  const pageData = useQuery(
    api.pages.getPage,
    isAuthenticated && convexPageId ? { pageId: convexPageId } : "skip"
  );

  const updateContent = useMutation(api.pages.updateContent);
  const updatePage = useMutation(api.pages.updatePage);

  // Sync title from server when page data loads
  const hasSyncedTitle = useRef(false);
  useEffect(() => {
    if (pageData && !hasSyncedTitle.current) {
      setTitle(pageData.title);
      hasSyncedTitle.current = true;
    }
  }, [pageData]);

  // Reset sync flag when pageId changes
  useEffect(() => {
    hasSyncedTitle.current = false;
  }, [pageId]);

  // Debounced title save
  const titleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleTitleChange = useCallback(
    (newTitle: string) => {
      setTitle(newTitle);
      if (!convexPageId) return;
      if (titleTimerRef.current) clearTimeout(titleTimerRef.current);
      titleTimerRef.current = setTimeout(() => {
        updatePage({ pageId: convexPageId, title: newTitle });
      }, 500);
    },
    [convexPageId, updatePage]
  );

  useEffect(() => {
    return () => {
      if (titleTimerRef.current) clearTimeout(titleTimerRef.current);
    };
  }, []);

  // Icon selection
  const handleIconSelect = useCallback(
    (emoji: string) => {
      if (!convexPageId) return;
      updatePage({ pageId: convexPageId, icon: emoji });
      setIconPickerOpen(false);
    },
    [convexPageId, updatePage]
  );

  // Parse content from Convex
  const parsedContent = pageData?.content
    ? (JSON.parse(pageData.content) as Record<string, unknown>)
    : undefined;

  // Save editor content to Convex
  const handleEditorUpdate = useCallback(
    (content: Record<string, unknown>) => {
      if (!convexPageId) return;
      updateContent({ pageId: convexPageId, content: JSON.stringify(content) });
    },
    [convexPageId, updateContent]
  );

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <TopBar
        title={isJournal ? initialTitle : title}
        onTitleChange={isJournal ? undefined : handleTitleChange}
        pageId={pageId}
        pageTitle={isJournal ? initialTitle : title}
        content={parsedContent}
      />

      {/* Editor area */}
      <div className="flex-1 overflow-y-auto">
        {/* Journal date navigation */}
        {journalNav}

        {/* Page title (large, in editor area) */}
        <div className="mx-auto max-w-3xl px-8 pt-12 pb-2">
          {/* Page icon picker */}
          {!isJournal && convexPageId && (
            <div className="relative mb-2">
              <button
                onClick={() => setIconPickerOpen(!iconPickerOpen)}
                className="rounded px-1 py-0.5 text-2xl transition-colors hover:bg-[rgba(128,128,128,0.1)]"
                title="Change icon"
              >
                {pageData?.icon || (
                  <span className="text-sm text-[var(--text-muted)]">Add icon</span>
                )}
              </button>
              <AnimatePresence>
                {iconPickerOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 z-50 mt-1 grid grid-cols-10 gap-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-2 shadow-xl"
                  >
                    {PAGE_ICONS.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => handleIconSelect(emoji)}
                        className="rounded p-1 text-lg transition-colors hover:bg-[rgba(128,128,128,0.12)]"
                      >
                        {emoji}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {isJournal ? (
            <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">
              {initialTitle}
            </h1>
          ) : (
            <div className="flex items-center gap-3">
              {pageData?.icon && (
                <span className="text-3xl">{pageData.icon}</span>
              )}
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full border-none bg-transparent text-3xl font-bold tracking-tight text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)] caret-[var(--text-primary)]"
                placeholder="Untitled"
              />
            </div>
          )}
        </div>


        {/* Editor */}
        <NoteEditor
          key={`editor-${pageId || "new"}`}
          content={parsedContent}
          onUpdate={handleEditorUpdate}
          onCursorChange={handleCursorChange}
          remoteCursors={remoteCursors}
        />

        {/* Backlinks panel */}
        <div className="mx-auto max-w-3xl px-8 pb-20">
          <div className="border-t border-[var(--border-subtle)] pt-6">
            <button
              onClick={() => setBacklinksOpen(!backlinksOpen)}
              className="flex items-center gap-2 text-sm font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
            >
              {backlinksOpen ? (
                <ChevronDown size={14} />
              ) : (
                <ChevronRight size={14} />
              )}
              <FileText size={14} />
              {backlinks.length} Backlinks
            </button>

            <AnimatePresence>
              {backlinksOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 space-y-1">
                    {backlinks.map((link) => (
                      <a
                        key={link.id}
                        href={`/p/${link.id}`}
                        className="group flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-[rgba(128,128,128,0.08)]"
                      >
                        <span className="text-sm">{link.icon}</span>
                        <span className="text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">
                          {link.title}
                        </span>
                        <ArrowUpRight
                          size={12}
                          className="ml-auto text-[var(--text-muted)] opacity-0 transition-opacity group-hover:opacity-100"
                        />
                      </a>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
