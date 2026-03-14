"use client";

import React from "react";
import AppShell from "@/components/layout/AppShell";
import EditorPage from "@/components/editor/EditorPage";
import { formatDate } from "@/lib/utils";

export default function JournalPage() {
  const today = new Date();
  const title = formatDate(today);

  return (
    <AppShell>
      <EditorPage title={title} isJournal />
    </AppShell>
  );
}
