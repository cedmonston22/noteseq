"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { getDateString } from "@/lib/utils";

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

interface JournalNavProps {
  title: string;
  currentDate: Date;
  isToday: boolean;
}

export default function JournalNav({ title, currentDate, isToday }: JournalNavProps) {
  const router = useRouter();
  const { isAuthenticated } = useConvexAuth();
  const [showCalendar, setShowCalendar] = useState(false);
  const [viewYear, setViewYear] = useState(currentDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(currentDate.getMonth());

  const today = new Date();
  const todayStr = getDateString(today);

  const journalPages = useQuery(
    api.pages.getJournalPages,
    isAuthenticated ? {} : "skip"
  );

  const journalDates = useMemo(() => {
    const set = new Set<string>();
    if (journalPages) {
      for (const page of journalPages) {
        if (page.journalDate) set.add(page.journalDate);
      }
    }
    return set;
  }, [journalPages]);

  const goToPrevDay = () => {
    const prev = new Date(currentDate);
    prev.setDate(prev.getDate() - 1);
    router.push(`/journal/${getDateString(prev)}`);
  };

  const goToNextDay = () => {
    if (isToday) return;
    const next = new Date(currentDate);
    next.setDate(next.getDate() + 1);
    const nextStr = getDateString(next);
    if (nextStr === todayStr) {
      router.push("/journal");
    } else {
      router.push(`/journal/${nextStr}`);
    }
  };

  const handleDayClick = (day: number) => {
    const clickedDateStr = getDateString(new Date(viewYear, viewMonth, day));
    setShowCalendar(false);
    if (clickedDateStr === todayStr) {
      router.push("/journal");
    } else {
      router.push(`/journal/${clickedDateStr}`);
    }
  };

  const goToPrevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
  };

  const goToNextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
  };

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);
  while (calendarDays.length % 7 !== 0) calendarDays.push(null);

  const currentDateStr = getDateString(currentDate);

  return (
    <div className="mx-auto max-w-3xl px-8 pt-4">
      <div className="flex items-center gap-2">
        <button
          onClick={goToPrevDay}
          className="rounded p-1 text-[var(--text-muted)] transition-colors hover:bg-[rgba(128,128,128,0.1)] hover:text-[var(--text-primary)]"
          title="Previous day"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => setShowCalendar(!showCalendar)}
          className="flex items-center gap-2 rounded-lg px-3 py-1 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[rgba(128,128,128,0.1)] hover:text-[var(--text-primary)]"
        >
          <Calendar size={14} />
          {title}
        </button>
        <button
          onClick={goToNextDay}
          disabled={isToday}
          className="rounded p-1 text-[var(--text-muted)] transition-colors hover:bg-[rgba(128,128,128,0.1)] hover:text-[var(--text-primary)] disabled:cursor-not-allowed disabled:opacity-30"
          title="Next day"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <AnimatePresence>
        {showCalendar && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-4">
              {/* Month nav */}
              <div className="mb-3 flex items-center justify-between">
                <button
                  onClick={goToPrevMonth}
                  className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--text-muted)] transition-colors hover:bg-[rgba(128,128,128,0.1)] hover:text-[var(--text-primary)]"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-sm font-semibold text-[var(--text-primary)]">
                  {MONTHS[viewMonth]} {viewYear}
                </span>
                <button
                  onClick={goToNextMonth}
                  className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--text-muted)] transition-colors hover:bg-[rgba(128,128,128,0.1)] hover:text-[var(--text-primary)]"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Day headers */}
              <div className="mb-1 grid grid-cols-7 gap-0.5">
                {DAYS.map((day) => (
                  <div
                    key={day}
                    className="py-1 text-center text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Days grid */}
              <div className="grid grid-cols-7 gap-0.5">
                {calendarDays.map((day, i) => {
                  if (day === null) {
                    return <div key={`empty-${i}`} className="h-8" />;
                  }

                  const dayDateStr = getDateString(new Date(viewYear, viewMonth, day));
                  const isDayToday = dayDateStr === todayStr;
                  const isSelected = dayDateStr === currentDateStr;
                  const hasEntry = journalDates.has(dayDateStr);
                  const isFuture = new Date(viewYear, viewMonth, day) > today;

                  return (
                    <button
                      key={dayDateStr}
                      onClick={() => handleDayClick(day)}
                      className={`relative flex h-8 items-center justify-center rounded-lg text-xs font-medium transition-all ${
                        isSelected
                          ? "bg-[#D4A843] text-white"
                          : isDayToday
                            ? "ring-1 ring-[#D4A843] text-[#D4A843]"
                            : isFuture
                              ? "text-[var(--text-muted)] opacity-40"
                              : "text-[var(--text-primary)] hover:bg-[rgba(128,128,128,0.1)]"
                      }`}
                    >
                      {day}
                      {hasEntry && !isSelected && (
                        <span className="absolute bottom-0.5 h-1 w-1 rounded-full bg-[#D4A843]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
