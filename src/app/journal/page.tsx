"use client";

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import EditorPage from "@/components/editor/EditorPage";
import { formatDate, getDateString } from "@/lib/utils";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function JournalPage() {
  const router = useRouter();
  const today = new Date();
  const title = formatDate(today);
  const dateStr = getDateString(today);
  const hasCreated = useRef(false);
  const { isAuthenticated } = useConvexAuth();

  // Skip query when not authenticated
  const journalPage = useQuery(
    api.pages.getJournalPage,
    isAuthenticated ? { date: dateStr } : "skip"
  );
  const createJournal = useMutation(api.pages.createJournalIfNotExists);

  // Ensure today's journal entry exists when user is authenticated
  useEffect(() => {
    if (hasCreated.current) return;
    if (journalPage === null) {
      hasCreated.current = true;
      createJournal({ date: dateStr, title }).catch(() => {
        // User not authenticated or other error — ignore gracefully
      });
    }
  }, [journalPage, createJournal, dateStr, title]);

  const goToPrevDay = () => {
    const prev = new Date(today);
    prev.setDate(prev.getDate() - 1);
    router.push(`/journal/${getDateString(prev)}`);
  };

  // Today's page — no next day
  const isToday = true;

  return (
    <AppShell>
      <EditorPage
        pageId={journalPage?._id}
        title={title}
        isJournal
        journalNav={
          <div className="mx-auto flex max-w-3xl items-center gap-2 px-8 pt-4">
            <button
              onClick={goToPrevDay}
              className="rounded p-1 text-[#66667A] transition-colors hover:bg-[rgba(255,255,255,0.06)] hover:text-[#A0A0B0]"
              title="Previous day"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-sm font-medium text-[#A0A0B0]">{title}</span>
            <button
              disabled={isToday}
              className="rounded p-1 text-[#66667A] transition-colors hover:bg-[rgba(255,255,255,0.06)] hover:text-[#A0A0B0] disabled:cursor-not-allowed disabled:opacity-30"
              title="Next day"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        }
      />
    </AppShell>
  );
}
