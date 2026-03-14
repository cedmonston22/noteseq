"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight, ArrowUpRight, FileText, Plus } from "lucide-react";
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

  // Send presence heartbeat and clean up on unmount
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
  const syncBacklinks = useMutation(api.backlinks.syncBacklinks);

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

  // Extract backlink target page IDs from editor content JSON
  const extractBacklinkTargets = useCallback(
    (node: Record<string, unknown>): string[] => {
      const targets: string[] = [];
      // Check marks on text nodes for links to /p/{pageId}
      if (Array.isArray(node.marks)) {
        for (const mark of node.marks) {
          if (
            mark &&
            typeof mark === "object" &&
            (mark as Record<string, unknown>).type === "link"
          ) {
            const attrs = (mark as Record<string, unknown>).attrs as
              | Record<string, unknown>
              | undefined;
            if (attrs && typeof attrs.href === "string") {
              const match = attrs.href.match(/^\/p\/(.+)$/);
              if (match) {
                targets.push(match[1]);
              }
            }
          }
        }
      }
      // Recurse into content array
      if (Array.isArray(node.content)) {
        for (const child of node.content) {
          if (child && typeof child === "object") {
            targets.push(
              ...extractBacklinkTargets(child as Record<string, unknown>)
            );
          }
        }
      }
      return targets;
    },
    []
  );

  // Save editor content to Convex
  const handleEditorUpdate = useCallback(
    (content: Record<string, unknown>) => {
      if (!convexPageId) return;
      updateContent({ pageId: convexPageId, content: JSON.stringify(content) });

      // Sync backlinks from content
      const targetIds = [...new Set(extractBacklinkTargets(content))];
      syncBacklinks({
        sourcePageId: convexPageId,
        targetPageIds: targetIds as Id<"pages">[],
      }).catch(() => {
        // Silently ignore backlink sync errors (e.g. invalid page IDs)
      });
    },
    [convexPageId, updateContent, syncBacklinks, extractBacklinkTargets]
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

      {/* Active collaborators bar */}
      {remotePresence && remotePresence.length > 0 && (
        <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] px-6 py-1.5">
          <span className="text-[11px] text-[var(--text-muted)]">Editing now:</span>
          {remotePresence.map((p) => (
            <span
              key={p.sessionId}
              className="flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium"
              style={{
                background: "rgba(212,168,67,0.12)",
                color: "#D4A843",
              }}
            >
              <span
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{ background: "#10B981" }}
              />
              {p.userName}
            </span>
          ))}
        </div>
      )}

      {/* Editor area */}
      <div className="flex-1 overflow-y-auto">
        {/* Journal date navigation */}
        {journalNav}

        {/* Page title (large, in editor area) */}
        <div className="mx-auto max-w-3xl px-4 pt-8 pb-2 md:px-8 md:pt-12">
          {isJournal ? (
            <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">
              {initialTitle}
            </h1>
          ) : (
            <div className="relative flex items-center gap-2">
              {/* Icon button — shows icon or + */}
              {convexPageId && (
                <button
                  onClick={() => setIconPickerOpen(!iconPickerOpen)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-[rgba(128,128,128,0.1)]"
                  title={pageData?.icon ? "Change icon" : "Add icon"}
                >
                  {pageData?.icon ? (
                    <span className="text-2xl">{pageData.icon}</span>
                  ) : (
                    <Plus size={18} className="text-[var(--text-muted)]" />
                  )}
                </button>
              )}

              {/* Icon picker dropdown */}
              <AnimatePresence>
                {iconPickerOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-full z-50 mt-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-2 shadow-xl"
                  >
                    <div className="grid grid-cols-10 gap-1">
                      {PAGE_ICONS.map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => handleIconSelect(emoji)}
                          className="rounded p-1 text-lg transition-colors hover:bg-[rgba(128,128,128,0.12)]"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                    {pageData?.icon && (
                      <button
                        onClick={() => {
                          updatePage({ pageId: convexPageId!, icon: "" });
                          setIconPickerOpen(false);
                        }}
                        className="mt-1 w-full rounded-md px-2 py-1 text-xs text-[var(--text-muted)] transition-colors hover:bg-[rgba(128,128,128,0.08)] hover:text-[var(--text-primary)]"
                      >
                        Remove icon
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

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
          pageId={pageId}
        />

        {/* Backlinks panel */}
        <div className="mx-auto max-w-3xl px-4 pb-20 md:px-8">
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
