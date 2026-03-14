"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Heading1,
  Heading2,
  Heading3,
  CheckSquare,
  ImageIcon,
  AlertCircle,
  Minus,
  Code,
  Quote,
  List,
  ListOrdered,
  Type,
} from "lucide-react";
import { SLASH_COMMANDS } from "@/lib/constants";

const ICON_MAP: Record<string, React.ElementType> = {
  Heading1,
  Heading2,
  Heading3,
  CheckSquare,
  Image: ImageIcon,
  AlertCircle,
  Minus,
  Code,
  Quote,
  List,
  ListOrdered,
  Type,
  Table: Code,
};

interface SlashCommandMenuProps {
  position: { top: number; left: number };
  filter: string;
  onSelect: (commandId: string) => void;
  onClose: () => void;
}

export default function SlashCommandMenu({
  position,
  filter,
  onSelect,
  onClose,
}: SlashCommandMenuProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  const filtered = SLASH_COMMANDS.filter(
    (cmd) =>
      cmd.label.toLowerCase().includes(filter.toLowerCase()) ||
      cmd.id.toLowerCase().includes(filter.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [filter]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (filtered.length > 0) {
          setSelectedIndex((i) => (i + 1) % filtered.length);
        }
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (filtered.length > 0) {
          setSelectedIndex((i) => (i - 1 + filtered.length) % filtered.length);
        }
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          onSelect(filtered[selectedIndex].id);
        }
        return;
      }
    };

    window.addEventListener("keydown", handler, true);
    return () => window.removeEventListener("keydown", handler, true);
  }, [filtered, selectedIndex, onSelect, onClose]);

  // Scroll selected item into view
  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;
    const selected = menu.children[selectedIndex] as HTMLElement;
    if (selected) {
      selected.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  if (filtered.length === 0) {
    return (
      <motion.div
        className="slash-menu absolute z-50"
        style={{ top: position.top, left: position.left }}
        initial={{ opacity: 0, y: -4, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -4, scale: 0.98 }}
        transition={{ duration: 0.12 }}
      >
        <p className="px-4 py-3 text-sm text-[#66667A]">No results</p>
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
      {filtered.map((cmd, index) => {
        const Icon = ICON_MAP[cmd.icon] || Type;
        return (
          <button
            key={cmd.id}
            className={`slash-menu-item w-full text-left ${
              index === selectedIndex ? "is-selected" : ""
            }`}
            onClick={() => onSelect(cmd.id)}
            onMouseEnter={() => setSelectedIndex(index)}
          >
            <div className="slash-menu-icon">
              <Icon size={16} />
            </div>
            <div className="slash-menu-text">
              <span className="slash-menu-label">{cmd.label}</span>
              <span className="slash-menu-desc">{cmd.description}</span>
            </div>
          </button>
        );
      })}
    </motion.div>
  );
}
