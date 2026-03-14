"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight, ArrowUpRight, FileText } from "lucide-react";
import TopBar from "@/components/layout/TopBar";
import NoteEditor from "./Editor";

interface BacklinkItem {
  id: string;
  title: string;
  icon: string;
}

const DEMO_BACKLINKS: BacklinkItem[] = [
  { id: "1", title: "Project Ideas", icon: "💡" },
  { id: "2", title: "Architecture Notes", icon: "🏗️" },
  { id: "3", title: "Daily Standup - Mar 12", icon: "📝" },
];

interface EditorPageProps {
  pageId?: string;
  title?: string;
  isJournal?: boolean;
}

export default function EditorPage({
  title: initialTitle = "Untitled",
  isJournal = false,
}: EditorPageProps) {
  const [title, setTitle] = useState(initialTitle);
  const [backlinksOpen, setBacklinksOpen] = useState(false);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <TopBar
        title={isJournal ? initialTitle : title}
        onTitleChange={isJournal ? undefined : setTitle}
      />

      {/* Editor area */}
      <div className="flex-1 overflow-y-auto">
        {/* Page title (large, in editor area) */}
        <div className="mx-auto max-w-3xl px-8 pt-12 pb-2">
          {isJournal ? (
            <h1 className="text-3xl font-bold tracking-tight text-[#E8E8ED]">
              {initialTitle}
            </h1>
          ) : (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border-none bg-transparent text-3xl font-bold tracking-tight text-[#E8E8ED] outline-none placeholder:text-[#66667A]"
              placeholder="Untitled"
            />
          )}
        </div>

        {/* Editor */}
        <NoteEditor />

        {/* Backlinks panel */}
        <div className="mx-auto max-w-3xl px-8 pb-20">
          <div className="border-t border-[rgba(255,255,255,0.06)] pt-6">
            <button
              onClick={() => setBacklinksOpen(!backlinksOpen)}
              className="flex items-center gap-2 text-sm font-medium text-[#66667A] transition-colors hover:text-[#A0A0B0]"
            >
              {backlinksOpen ? (
                <ChevronDown size={14} />
              ) : (
                <ChevronRight size={14} />
              )}
              <FileText size={14} />
              {DEMO_BACKLINKS.length} Backlinks
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
                    {DEMO_BACKLINKS.map((link) => (
                      <a
                        key={link.id}
                        href={`/p/${link.id}`}
                        className="group flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-[rgba(255,255,255,0.04)]"
                      >
                        <span className="text-sm">{link.icon}</span>
                        <span className="text-sm text-[#A0A0B0] group-hover:text-[#E8E8ED]">
                          {link.title}
                        </span>
                        <ArrowUpRight
                          size={12}
                          className="ml-auto text-[#66667A] opacity-0 transition-opacity group-hover:opacity-100"
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
