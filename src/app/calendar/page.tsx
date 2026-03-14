"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import AppShell from "@/components/layout/AppShell";
import { getDateString, formatDate } from "@/lib/utils";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function CalendarPage() {
  const router = useRouter();
  const { isAuthenticated } = useConvexAuth();
  const today = new Date();
  const todayStr = getDateString(today);

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const journalPages = useQuery(
    api.pages.getJournalPages,
    isAuthenticated ? {} : "skip"
  );

  // Set of dates that have journal entries
  const journalDates = useMemo(() => {
    const set = new Set<string>();
    if (journalPages) {
      for (const page of journalPages) {
        if (page.journalDate) set.add(page.journalDate);
      }
    }
    return set;
  }, [journalPages]);

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  // Build calendar grid
  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);
  // Pad to fill last row
  while (calendarDays.length % 7 !== 0) calendarDays.push(null);

  const goToPrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const goToToday = () => {
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
  };

  const handleDayClick = (day: number) => {
    const dateStr = getDateString(new Date(viewYear, viewMonth, day));
    if (dateStr === todayStr) {
      router.push("/journal");
    } else {
      router.push(`/journal/${dateStr}`);
    }
  };

  return (
    <AppShell>
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                  {MONTHS[viewMonth]} {viewYear}
                </h1>
                <p className="mt-1 text-sm text-[var(--text-muted)]">
                  Click a day to open its journal entry
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={goToToday}
                  className="rounded-lg border border-[var(--border-subtle)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] transition-all hover:border-[var(--border-hover)] hover:text-[var(--text-primary)]"
                >
                  Today
                </button>
                <button
                  onClick={goToPrevMonth}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-muted)] transition-colors hover:bg-[rgba(128,128,128,0.1)] hover:text-[var(--text-primary)]"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={goToNextMonth}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-muted)] transition-colors hover:bg-[rgba(128,128,128,0.1)] hover:text-[var(--text-primary)]"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            {/* Day headers */}
            <div className="mb-2 grid grid-cols-7 gap-1">
              {DAYS.map((day) => (
                <div
                  key={day}
                  className="py-2 text-center text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, i) => {
                if (day === null) {
                  return <div key={`empty-${i}`} className="aspect-square" />;
                }

                const dateStr = getDateString(new Date(viewYear, viewMonth, day));
                const isToday = dateStr === todayStr;
                const hasEntry = journalDates.has(dateStr);
                const isFuture = new Date(viewYear, viewMonth, day) > today;

                return (
                  <button
                    key={dateStr}
                    onClick={() => handleDayClick(day)}
                    className={`group relative flex aspect-square flex-col items-center justify-start rounded-xl p-2 transition-all ${
                      isToday
                        ? "bg-[rgba(212,168,67,0.15)] ring-1 ring-[#D4A843]"
                        : "hover:bg-[rgba(128,128,128,0.08)]"
                    } ${isFuture ? "opacity-40" : ""}`}
                  >
                    <span
                      className={`text-sm font-medium ${
                        isToday
                          ? "text-[#D4A843]"
                          : "text-[var(--text-primary)]"
                      }`}
                    >
                      {day}
                    </span>

                    {/* Journal entry indicator */}
                    {hasEntry && (
                      <div className="mt-1 h-1.5 w-1.5 rounded-full bg-[#D4A843]" />
                    )}

                    {/* Hover: show + icon for days without entries */}
                    {!hasEntry && !isFuture && (
                      <Plus
                        size={12}
                        className="mt-1 text-[var(--text-muted)] opacity-0 transition-opacity group-hover:opacity-100"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-6 flex items-center gap-4 text-xs text-[var(--text-muted)]">
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-[#D4A843]" />
                <span>Has journal entry</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full ring-1 ring-[#D4A843]" />
                <span>Today</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AppShell>
  );
}
