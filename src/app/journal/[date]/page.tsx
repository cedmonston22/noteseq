"use client";

import React from "react";
import { useParams, redirect } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import EditorPage from "@/components/editor/EditorPage";
import { formatDate } from "@/lib/utils";

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

  return (
    <AppShell>
      <EditorPage title={title} isJournal />
    </AppShell>
  );
}
