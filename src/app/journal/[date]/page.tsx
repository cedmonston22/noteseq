"use client";

import React, { useEffect, useRef } from "react";
import { useParams, redirect } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import EditorPage from "@/components/editor/EditorPage";
import JournalNav from "@/components/editor/JournalNav";
import { formatDate, getDateString } from "@/lib/utils";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export default function JournalDatePage() {
  const params = useParams();
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

  useEffect(() => {
    if (hasCreated.current) return;
    if (journalPage === null) {
      hasCreated.current = true;
      createJournal({ date: dateStr, title }).catch(() => {});
    }
  }, [journalPage, createJournal, dateStr, title]);

  useEffect(() => {
    hasCreated.current = false;
  }, [dateStr]);

  const today = new Date();
  const todayStr = getDateString(today);
  const isToday = dateStr === todayStr;

  return (
    <AppShell>
      <EditorPage
        pageId={journalPage?._id}
        title={title}
        isJournal
        journalNav={
          <JournalNav title={title} currentDate={date} isToday={isToday} />
        }
      />
    </AppShell>
  );
}
