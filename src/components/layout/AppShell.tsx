"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useConvexAuth, useMutation } from "convex/react";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";
import { ToastProvider } from "@/components/ui/Toast";
import SearchModal from "@/components/ui/SearchModal";
import ImportModal from "@/components/import/ImportModal";
import ShareModal from "@/components/sharing/ShareModal";
import TemplatePickerModal from "@/components/ui/TemplatePickerModal";
import { api } from "../../../convex/_generated/api";
import type { PageTemplate } from "@/lib/templates";

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [sharePageId, setSharePageId] = useState<string | null>(null);
  const [hasWaited, setHasWaited] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [templatePickerOpen, setTemplatePickerOpen] = useState(false);
  const createPageMutation = useMutation(api.pages.createPage);

  // Listen for search toggle events from Sidebar button and SearchModal's Cmd+K
  const handleToggleSearch = useCallback(() => {
    setSearchOpen((prev) => !prev);
  }, []);

  const handleToggleImport = useCallback(() => {
    setImportOpen((prev) => !prev);
  }, []);

  const handleOpenShare = useCallback((e: Event) => {
    const detail = (e as CustomEvent).detail;
    if (detail?.pageId) setSharePageId(detail.pageId);
  }, []);

  const handleOpenTemplatePicker = useCallback(() => {
    setTemplatePickerOpen(true);
  }, []);

  const handleTemplateSelect = useCallback(async (template: PageTemplate | null) => {
    try {
      const title = template ? template.name : "Untitled";
      const icon = template?.icon;
      const content = template ? JSON.stringify(template.content) : undefined;
      const pageId = await createPageMutation({
        title,
        icon,
        isJournal: false,
        content,
      });
      router.push(`/p/${pageId}`);
    } catch {
      // ignore
    }
  }, [createPageMutation, router]);

  useEffect(() => {
    window.addEventListener("noteseq:toggle-search", handleToggleSearch);
    window.addEventListener("noteseq:toggle-import", handleToggleImport);
    window.addEventListener("noteseq:open-share", handleOpenShare);
    window.addEventListener("noteseq:open-template-picker", handleOpenTemplatePicker);
    return () => {
      window.removeEventListener("noteseq:toggle-search", handleToggleSearch);
      window.removeEventListener("noteseq:toggle-import", handleToggleImport);
      window.removeEventListener("noteseq:open-share", handleOpenShare);
      window.removeEventListener("noteseq:open-template-picker", handleOpenTemplatePicker);
    };
  }, [handleToggleSearch, handleToggleImport, handleOpenShare, handleOpenTemplatePicker]);

  // Wait a moment after loading completes before redirecting
  // This prevents a race where the auth token hasn't been processed yet
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const timer = setTimeout(() => setHasWaited(true), 500);
      return () => clearTimeout(timer);
    }
    setHasWaited(false);
  }, [isLoading, isAuthenticated]);

  useEffect(() => {
    if (hasWaited && !isAuthenticated) {
      router.replace("/login");
    }
  }, [hasWaited, isAuthenticated, router]);

  if (isLoading || (!isAuthenticated && !hasWaited)) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--bg-surface)]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#D4A843] border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <ToastProvider>
      <div className="flex h-screen overflow-hidden bg-[var(--bg-surface)]">
        {/* Mobile hamburger button */}
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="fixed left-3 top-3 z-40 flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--bg-elevated)] text-[var(--text-secondary)] shadow-md transition-colors hover:bg-[rgba(128,128,128,0.12)] md:hidden"
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </button>

        {/* Mobile backdrop */}
        {mobileSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}

        <Sidebar
          mobileOpen={mobileSidebarOpen}
          onMobileClose={() => setMobileSidebarOpen(false)}
        />
        <main className="flex flex-1 flex-col overflow-hidden">
          {children}
        </main>
        <SearchModal
          isOpen={searchOpen}
          onClose={() => setSearchOpen(false)}
        />
        <ImportModal
          isOpen={importOpen}
          onClose={() => setImportOpen(false)}
        />
        <ShareModal
          isOpen={sharePageId !== null}
          onClose={() => setSharePageId(null)}
          pageId={sharePageId ?? undefined}
        />
        <TemplatePickerModal
          isOpen={templatePickerOpen}
          onClose={() => setTemplatePickerOpen(false)}
          onSelect={handleTemplateSelect}
        />
      </div>
    </ToastProvider>
  );
}
