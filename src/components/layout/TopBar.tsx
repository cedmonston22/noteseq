"use client";

import React, { useState } from "react";
import { Share2, MoreHorizontal } from "lucide-react";
import PresenceAvatars from "@/components/sharing/PresenceAvatars";
import ShareModal from "@/components/sharing/ShareModal";

interface TopBarProps {
  title?: string;
  onTitleChange?: (title: string) => void;
  showPresence?: boolean;
}

export default function TopBar({
  title = "Untitled",
  onTitleChange,
  showPresence = true,
}: TopBarProps) {
  const [shareOpen, setShareOpen] = useState(false);

  return (
    <>
      <div className="flex h-12 shrink-0 items-center gap-4 border-b border-[rgba(255,255,255,0.06)] bg-[#111116]/80 px-6 backdrop-blur-xl">
        {/* Page title */}
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange?.(e.target.value)}
          aria-label="Page title"
          className="min-w-0 flex-1 border-none bg-transparent text-sm font-medium text-[#E8E8ED] outline-none placeholder:text-[#66667A]"
          placeholder="Untitled"
        />

        {/* Spacer */}
        <div className="flex-1" />

        {/* Presence */}
        {showPresence && (
          <div className="shrink-0">
            <PresenceAvatars />
          </div>
        )}

        {/* Actions */}
        <button
          onClick={() => setShareOpen(true)}
          className="flex h-8 items-center gap-2 rounded-lg border border-[rgba(255,255,255,0.06)] px-3 text-xs font-medium text-[#A0A0B0] transition-all hover:border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.04)] hover:text-[#E8E8ED]"
        >
          <Share2 size={13} />
          Share
        </button>

        <button aria-label="More options" className="flex h-8 w-8 items-center justify-center rounded-lg text-[#66667A] transition-colors hover:bg-[rgba(255,255,255,0.04)] hover:text-[#A0A0B0]">
          <MoreHorizontal size={16} />
        </button>
      </div>

      <ShareModal isOpen={shareOpen} onClose={() => setShareOpen(false)} />
    </>
  );
}
