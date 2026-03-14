import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import PresenceAvatars from "@/components/sharing/PresenceAvatars";

vi.mock("framer-motion", () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

vi.mock("@/components/ui/Tooltip", () => ({
  default: ({ children, content }: { children: React.ReactNode; content: string }) => (
    <div data-tooltip={content}>{children}</div>
  ),
}));

describe("PresenceAvatars", () => {
  it("renders empty when no users provided", () => {
    render(<PresenceAvatars />);
    // No default users — should render empty container
    expect(screen.queryByText("A")).not.toBeInTheDocument();
  });

  it("shows correct initials for each user", () => {
    const users = [
      { id: "1", name: "Diana" },
      { id: "2", name: "Edward" },
    ];
    render(<PresenceAvatars users={users} />);
    expect(screen.getByText("D")).toBeInTheDocument();
    expect(screen.getByText("E")).toBeInTheDocument();
  });

  it("shows overflow indicator when more than 4 users", () => {
    const users = [
      { id: "1", name: "Alice" },
      { id: "2", name: "Bob" },
      { id: "3", name: "Charlie" },
      { id: "4", name: "Diana" },
      { id: "5", name: "Edward" },
      { id: "6", name: "Fiona" },
    ];
    render(<PresenceAvatars users={users} />);
    // Only first 4 visible
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
    expect(screen.getByText("C")).toBeInTheDocument();
    expect(screen.getByText("D")).toBeInTheDocument();
    // 5th and 6th not shown as avatars
    expect(screen.queryByText("E")).not.toBeInTheDocument();
    // Overflow indicator: +2
    expect(screen.getByText("+2")).toBeInTheDocument();
  });

  it("does not show overflow when 4 or fewer users", () => {
    const users = [
      { id: "1", name: "Alice" },
      { id: "2", name: "Bob" },
    ];
    render(<PresenceAvatars users={users} />);
    expect(screen.queryByText(/^\+/)).not.toBeInTheDocument();
  });

  it("accepts custom users prop", () => {
    const customUsers = [{ id: "99", name: "Zara" }];
    render(<PresenceAvatars users={customUsers} />);
    expect(screen.getByText("Z")).toBeInTheDocument();
    // Default users should not appear
    expect(screen.queryByText("A")).not.toBeInTheDocument();
  });
});
