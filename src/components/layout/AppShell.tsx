"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useConvexAuth } from "convex/react";
import Sidebar from "./Sidebar";
import { ToastProvider } from "@/components/ui/Toast";
import SearchModal from "@/components/ui/SearchModal";
import ImportModal from "@/components/import/ImportModal";

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [hasWaited, setHasWaited] = useState(false);

  // Listen for search toggle events from Sidebar button and SearchModal's Cmd+K
  const handleToggleSearch = useCallback(() => {
    setSearchOpen((prev) => !prev);
  }, []);

  const handleToggleImport = useCallback(() => {
    setImportOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    window.addEventListener("noteseq:toggle-search", handleToggleSearch);
    window.addEventListener("noteseq:toggle-import", handleToggleImport);
    return () => {
      window.removeEventListener("noteseq:toggle-search", handleToggleSearch);
      window.removeEventListener("noteseq:toggle-import", handleToggleImport);
    };
  }, [handleToggleSearch, handleToggleImport]);

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
        <Sidebar />
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
      </div>
    </ToastProvider>
  );
}
