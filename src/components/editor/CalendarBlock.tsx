"use client";

import React, { useState } from "react";
import { NodeViewWrapper } from "@tiptap/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
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

export default function CalendarBlock() {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());

  const todayStr = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);
  while (calendarDays.length % 7 !== 0) calendarDays.push(null);

  const goToPrevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
  };

  const goToNextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
  };

  const toggleDate = (day: number) => {
    const key = `${viewYear}-${viewMonth}-${day}`;
    setSelectedDates((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <NodeViewWrapper className="my-4">
      <div
        className="mx-auto max-w-xs select-none rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-4"
        contentEditable={false}
      >
        {/* Header */}
        <div className="mb-3 flex items-center justify-between">
          <button
            onClick={goToPrevMonth}
            className="flex h-6 w-6 items-center justify-center rounded-md text-[var(--text-muted)] transition-colors hover:bg-[rgba(128,128,128,0.1)] hover:text-[var(--text-primary)]"
          >
            <ChevronLeft size={14} />
          </button>
          <span className="text-xs font-semibold text-[var(--text-primary)]">
            {MONTHS[viewMonth]} {viewYear}
          </span>
          <button
            onClick={goToNextMonth}
            className="flex h-6 w-6 items-center justify-center rounded-md text-[var(--text-muted)] transition-colors hover:bg-[rgba(128,128,128,0.1)] hover:text-[var(--text-primary)]"
          >
            <ChevronRight size={14} />
          </button>
        </div>

        {/* Day headers */}
        <div className="mb-1 grid grid-cols-7 gap-0.5">
          {DAYS.map((day) => (
            <div
              key={day}
              className="py-0.5 text-center text-[9px] font-semibold uppercase tracking-wider text-[var(--text-muted)]"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-0.5">
          {calendarDays.map((day, i) => {
            if (day === null) return <div key={`e-${i}`} className="h-7" />;

            const key = `${viewYear}-${viewMonth}-${day}`;
            const isToday = key === todayStr;
            const isSelected = selectedDates.has(key);

            return (
              <button
                key={key}
                onClick={() => toggleDate(day)}
                className={`flex h-7 items-center justify-center rounded-md text-[10px] font-medium transition-all ${
                  isSelected
                    ? "bg-[#D4A843] text-white"
                    : isToday
                      ? "ring-1 ring-[#D4A843] text-[#D4A843]"
                      : "text-[var(--text-primary)] hover:bg-[rgba(128,128,128,0.08)]"
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>

        {/* Selected dates */}
        {selectedDates.size > 0 && (
          <div className="mt-3 border-t border-[var(--border-subtle)] pt-2">
            <p className="text-[10px] font-semibold text-[var(--text-muted)]">
              {selectedDates.size} date{selectedDates.size > 1 ? "s" : ""} selected
            </p>
          </div>
        )}
      </div>
    </NodeViewWrapper>
  );
}
