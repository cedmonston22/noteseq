"use client";

import React, { useEffect, useRef } from "react";
import { useParams, redirect, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import EditorPage from "@/components/editor/EditorPage";
import { formatDate, getDateString } from "@/lib/utils";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export default function JournalDatePage() {
  const params = useParams();
  const router = useRouter();
  const dateStr = params.date as string;

  if (!DATE_REGEX.test(dateStr)) {
    redirect("/journal");
  }

  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);

  if (isNaN(date.getTime())) {
    redirect("/journal");
  }

  const title = formatDate(date);
  const { isAuthenticated } = useConvexAuth();
  const hasCreated = useRef(false);

  const journalPage = useQuery(
    api.pages.getJournalPage,
    isAuthenticated ? { date: dateStr } : "skip"
  );
  const createJournal = useMutation(api.pages.createJournalIfNotExists);

  // Ensure journal entry exists for this date
  useEffect(() => {
    if (hasCreated.current) return;
    if (journalPage === null) {
      hasCreated.current = true;
      createJournal({ date: dateStr, title }).catch(() => {});
    }
  }, [journalPage, createJournal, dateStr, title]);

  // Reset creation flag when date changes
  useEffect(() => {
    hasCreated.current = false;
  }, [dateStr]);

  const today = new Date();
  const todayStr = getDateString(today);
  const isToday = dateStr === todayStr;

  const goToPrevDay = () => {
    const prev = new Date(y, m - 1, d);
    prev.setDate(prev.getDate() - 1);
    router.push(`/journal/${getDateString(prev)}`);
  };

  const goToNextDay = () => {
    if (isToday) return;
    const next = new Date(y, m - 1, d);
    next.setDate(next.getDate() + 1);
    const nextStr = getDateString(next);
    if (nextStr === todayStr) {
      router.push("/journal");
    } else {
      router.push(`/journal/${nextStr}`);
    }
  };

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
              onClick={goToNextDay}
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
