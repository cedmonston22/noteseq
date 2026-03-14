"use client";

import React, { useEffect, useRef } from "react";
import AppShell from "@/components/layout/AppShell";
import EditorPage from "@/components/editor/EditorPage";
import JournalNav from "@/components/editor/JournalNav";
import { formatDate, getDateString } from "@/lib/utils";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function JournalPage() {
  const today = new Date();
  const title = formatDate(today);
  const dateStr = getDateString(today);
  const hasCreated = useRef(false);
  const { isAuthenticated } = useConvexAuth();

  const journalPage = useQuery(
    api.pages.getJournalPage,
    isAuthenticated ? { date: dateStr } : "skip"
  );
  const createJournal = useMutation(api.pages.createJournalIfNotExists);

  useEffect(() => {
    if (hasCreated.current) return;
    if (journalPage === null) {
      hasCreated.current = true;
      createJournal({ date: dateStr, title }).catch(() => {});
    }
  }, [journalPage, createJournal, dateStr, title]);

  return (
    <AppShell>
      <EditorPage
        pageId={journalPage?._id}
        title={title}
        isJournal
        journalNav={
          <JournalNav title={title} currentDate={today} isToday />
        }
      />
    </AppShell>
  );
}
