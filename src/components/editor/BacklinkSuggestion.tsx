"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

interface BacklinkSuggestionProps {
  position: { top: number; left: number };
  query: string;
  onSelect: (pageId: string, pageTitle: string) => void;
  onClose: () => void;
}

export default function BacklinkSuggestion({
  position,
  query: searchQuery,
  onSelect,
  onClose,
}: BacklinkSuggestionProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated } = useConvexAuth();

  // When query is empty, show all pages; when query is non-empty, search
  const allPages = useQuery(
    api.pages.getUserPages,
    isAuthenticated && searchQuery === "" ? {} : "skip"
  );

  const searchResults = useQuery(
    api.pages.searchPages,
    isAuthenticated && searchQuery !== "" ? { query: searchQuery } : "skip"
  );

  const pages = searchQuery === "" ? allPages : searchResults;
  const items = (pages ?? []).filter(Boolean) as NonNullable<NonNullable<typeof pages>[number]>[];

  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (items.length > 0) {
          setSelectedIndex((i) => (i + 1) % items.length);
        }
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (items.length > 0) {
          setSelectedIndex((i) => (i - 1 + items.length) % items.length);
        }
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        if (items[selectedIndex]) {
          const page = items[selectedIndex];
          onSelect(page._id, page.title || "Untitled");
        }
        return;
      }
    };

    window.addEventListener("keydown", handler, true);
    return () => window.removeEventListener("keydown", handler, true);
  }, [items, selectedIndex, onSelect, onClose]);

  // Scroll selected item into view
  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;
    const selected = menu.querySelector("[data-selected='true']") as HTMLElement;
    if (selected) {
      selected.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  if (items.length === 0) {
    return (
      <motion.div
        className="slash-menu absolute z-50"
        style={{ top: position.top, left: position.left }}
        initial={{ opacity: 0, y: -4, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -4, scale: 0.98 }}
        transition={{ duration: 0.12 }}
      >
        <p className="px-4 py-3 text-sm text-[var(--text-muted)]">
          {pages === undefined ? "Loading..." : "No pages found"}
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={menuRef}
      className="slash-menu absolute z-50"
      style={{ top: position.top, left: position.left }}
      initial={{ opacity: 0, y: -4, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -4, scale: 0.98 }}
      transition={{ duration: 0.12 }}
    >
      <p className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">
        Link to page
      </p>
      {items.map((page, index) => {
        const isSelected = index === selectedIndex;
        return (
          <button
            key={page._id}
            data-selected={isSelected}
            className={`slash-menu-item w-full text-left ${isSelected ? "is-selected" : ""}`}
            onClick={() => onSelect(page._id, page.title || "Untitled")}
            onMouseEnter={() => setSelectedIndex(index)}
          >
            <div className="slash-menu-icon text-sm">
              {page.icon || "📄"}
            </div>
            <div className="slash-menu-text">
              <span className="slash-menu-label">{page.title || "Untitled"}</span>
            </div>
          </button>
        );
      })}
    </motion.div>
  );
}
