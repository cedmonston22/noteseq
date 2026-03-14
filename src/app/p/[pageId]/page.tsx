"use client";

import React from "react";
import { useParams } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import EditorPage from "@/components/editor/EditorPage";

export default function PageView() {
  const params = useParams();
  const pageId = params.pageId as string;

  return (
    <AppShell>
      <EditorPage pageId={pageId} title="Untitled" />
    </AppShell>
  );
}
