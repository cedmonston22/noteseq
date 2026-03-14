import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  SkeletonLine,
  SkeletonAvatar,
  SkeletonBlock,
  PageSkeleton,
  SidebarSkeleton,
} from "@/components/ui/Skeleton";

describe("SkeletonLine", () => {
  it("renders with default dimensions", () => {
    const { container } = render(<SkeletonLine />);
    const el = container.querySelector(".rounded-md") as HTMLElement;
    expect(el).toBeInTheDocument();
    expect(el.style.width).toBe("100%");
    expect(el.style.height).toBe("14px");
  });

  it("renders with custom width and height", () => {
    const { container } = render(<SkeletonLine width="50%" height={20} />);
    const el = container.querySelector(".rounded-md") as HTMLElement;
    expect(el.style.width).toBe("50%");
    expect(el.style.height).toBe("20px");
  });
});

describe("SkeletonAvatar", () => {
  it("renders as circle with rounded-full class", () => {
    const { container } = render(<SkeletonAvatar />);
    const el = container.querySelector(".rounded-full") as HTMLElement;
    expect(el).toBeInTheDocument();
  });

  it("uses default size of 36", () => {
    const { container } = render(<SkeletonAvatar />);
    const el = container.querySelector(".rounded-full") as HTMLElement;
    expect(el.style.width).toBe("36px");
    expect(el.style.height).toBe("36px");
  });

  it("accepts custom size", () => {
    const { container } = render(<SkeletonAvatar size={48} />);
    const el = container.querySelector(".rounded-full") as HTMLElement;
    expect(el.style.width).toBe("48px");
    expect(el.style.height).toBe("48px");
  });
});

describe("SkeletonBlock", () => {
  it("renders with default height of 80", () => {
    const { container } = render(<SkeletonBlock />);
    const el = container.querySelector(".rounded-lg") as HTMLElement;
    expect(el).toBeInTheDocument();
    expect(el.style.height).toBe("80px");
    expect(el.style.width).toBe("100%");
  });

  it("accepts custom width and height", () => {
    const { container } = render(<SkeletonBlock width="80%" height={120} />);
    const el = container.querySelector(".rounded-lg") as HTMLElement;
    expect(el.style.width).toBe("80%");
    expect(el.style.height).toBe("120px");
  });
});

describe("PageSkeleton", () => {
  it("renders multiple skeleton elements", () => {
    const { container } = render(<PageSkeleton />);
    const roundedMds = container.querySelectorAll(".rounded-md");
    // Title + subtitle + 4 paragraph lines + 3 more + 2 more = 11 SkeletonLine
    expect(roundedMds.length).toBeGreaterThanOrEqual(9);

    // Also has a SkeletonBlock
    const roundedLgs = container.querySelectorAll(".rounded-lg");
    expect(roundedLgs.length).toBeGreaterThanOrEqual(1);
  });
});

describe("SidebarSkeleton", () => {
  it("renders multiple skeleton elements", () => {
    const { container } = render(<SidebarSkeleton />);
    // Section header + separator header = 2 SkeletonLine at top level
    // Plus 5 nav items + 3 more items each with a SkeletonLine = 8 more
    const roundedMds = container.querySelectorAll(".rounded-md");
    expect(roundedMds.length).toBeGreaterThanOrEqual(8);

    // ShimmerBase items for icons (5+3 = 8)
    const shimmerItems = container.querySelectorAll(".shrink-0");
    expect(shimmerItems.length).toBeGreaterThanOrEqual(8);
  });
});
