"use client";

import React from "react";
import Sidebar from "./Sidebar";
import { ToastProvider } from "@/components/ui/Toast";

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <ToastProvider>
      <div className="flex h-screen overflow-hidden bg-[#111116]">
        <Sidebar />
        <main className="flex flex-1 flex-col overflow-hidden">
          {children}
        </main>
      </div>
    </ToastProvider>
  );
}
