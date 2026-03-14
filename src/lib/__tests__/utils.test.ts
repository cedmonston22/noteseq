import { describe, it, expect, vi, afterEach } from "vitest";
import {
  cn,
  formatDate,
  formatDateShort,
  getDateString,
  getRelativeTime,
  generateCollabColor,
  truncate,
} from "@/lib/utils";
import { COLLAB_COLORS } from "@/lib/constants";

describe("cn", () => {
  it("merges multiple class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("filters out falsy values", () => {
    expect(cn("foo", undefined, null, false, "bar")).toBe("foo bar");
  });

  it("returns empty string when all values are falsy", () => {
    expect(cn(undefined, null, false)).toBe("");
  });

  it("returns single class when only one provided", () => {
    expect(cn("only")).toBe("only");
  });
});

describe("formatDate", () => {
  it('formats a date as "Month DD, YYYY"', () => {
    const date = new Date(2026, 2, 13); // March 13, 2026
    expect(formatDate(date)).toBe("March 13, 2026");
  });

  it("formats January correctly", () => {
    const date = new Date(2024, 0, 1);
    expect(formatDate(date)).toBe("January 1, 2024");
  });
});

describe("formatDateShort", () => {
  it('formats a date as "Mon DD"', () => {
    const date = new Date(2026, 2, 13);
    expect(formatDateShort(date)).toBe("Mar 13");
  });

  it("formats December correctly", () => {
    const date = new Date(2024, 11, 25);
    expect(formatDateShort(date)).toBe("Dec 25");
  });
});

describe("getDateString", () => {
  it('returns date in "YYYY-MM-DD" format', () => {
    const date = new Date(2026, 2, 13);
    expect(getDateString(date)).toBe("2026-03-13");
  });

  it("zero-pads single-digit month and day", () => {
    const date = new Date(2024, 0, 5); // Jan 5
    expect(getDateString(date)).toBe("2024-01-05");
  });

  it("handles double-digit month and day", () => {
    const date = new Date(2024, 11, 25); // Dec 25
    expect(getDateString(date)).toBe("2024-12-25");
  });
});

describe("getRelativeTime", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  function dateSecondsAgo(sec: number): Date {
    return new Date(Date.now() - sec * 1000);
  }

  it('returns "just now" for less than 10 seconds ago', () => {
    expect(getRelativeTime(dateSecondsAgo(5))).toBe("just now");
  });

  it("returns seconds ago for < 60 seconds", () => {
    expect(getRelativeTime(dateSecondsAgo(30))).toBe("30 seconds ago");
  });

  it('returns "1 minute ago"', () => {
    expect(getRelativeTime(dateSecondsAgo(60))).toBe("1 minute ago");
  });

  it("returns minutes ago", () => {
    expect(getRelativeTime(dateSecondsAgo(60 * 15))).toBe("15 minutes ago");
  });

  it('returns "1 hour ago"', () => {
    expect(getRelativeTime(dateSecondsAgo(3600))).toBe("1 hour ago");
  });

  it("returns hours ago", () => {
    expect(getRelativeTime(dateSecondsAgo(3600 * 5))).toBe("5 hours ago");
  });

  it('returns "yesterday"', () => {
    expect(getRelativeTime(dateSecondsAgo(3600 * 24))).toBe("yesterday");
  });

  it("returns days ago", () => {
    expect(getRelativeTime(dateSecondsAgo(3600 * 24 * 3))).toBe("3 days ago");
  });

  it('returns "1 week ago"', () => {
    expect(getRelativeTime(dateSecondsAgo(3600 * 24 * 7))).toBe("1 week ago");
  });

  it("returns weeks ago", () => {
    expect(getRelativeTime(dateSecondsAgo(3600 * 24 * 21))).toBe("3 weeks ago");
  });

  it('returns "1 month ago"', () => {
    // 35 days ensures diffWeek >= 5, triggering the month branch
    expect(getRelativeTime(dateSecondsAgo(3600 * 24 * 35))).toBe("1 month ago");
  });

  it("returns months ago", () => {
    expect(getRelativeTime(dateSecondsAgo(3600 * 24 * 90))).toBe("3 months ago");
  });

  it('returns "1 year ago"', () => {
    expect(getRelativeTime(dateSecondsAgo(3600 * 24 * 365))).toBe("1 year ago");
  });

  it("returns years ago", () => {
    expect(getRelativeTime(dateSecondsAgo(3600 * 24 * 365 * 3))).toBe("3 years ago");
  });
});

describe("generateCollabColor", () => {
  it("returns a color from the pool by index", () => {
    expect(generateCollabColor(0)).toBe(COLLAB_COLORS[0]);
    expect(generateCollabColor(3)).toBe(COLLAB_COLORS[3]);
  });

  it("wraps around when index exceeds pool length", () => {
    const poolLen = COLLAB_COLORS.length;
    expect(generateCollabColor(poolLen)).toBe(COLLAB_COLORS[0]);
    expect(generateCollabColor(poolLen + 2)).toBe(COLLAB_COLORS[2]);
  });
});

describe("truncate", () => {
  it("returns the string unchanged when shorter than length", () => {
    expect(truncate("hello", 10)).toBe("hello");
  });

  it("returns the string unchanged when exactly at length", () => {
    expect(truncate("hello", 5)).toBe("hello");
  });

  it("truncates and appends ellipsis when longer than length", () => {
    const result = truncate("hello world", 5);
    expect(result).toBe("hello\u2026");
  });

  it("trims trailing whitespace before appending ellipsis", () => {
    const result = truncate("hi there world", 9);
    // "hi there " -> trimEnd -> "hi there" + ellipsis
    expect(result).toBe("hi there\u2026");
  });
});
