"use client";

import React, { useState } from "react";
import { Link, Trash2, UserPlus } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { cn } from "@/lib/utils";
import { generateCollabColor } from "@/lib/utils";

interface Collaborator {
  id: string;
  name: string;
  email: string;
}

const PLACEHOLDER_COLLABORATORS: Collaborator[] = [
  { id: "1", name: "Alice Chen", email: "alice@example.com" },
  { id: "2", name: "Bob Rivera", email: "bob@example.com" },
  { id: "3", name: "Charlie Kim", email: "charlie@example.com" },
];

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShareModal({ isOpen, onClose }: ShareModalProps) {
  const [email, setEmail] = useState("");
  const [collaborators, setCollaborators] = useState<Collaborator[]>(
    PLACEHOLDER_COLLABORATORS
  );
  const [copied, setCopied] = useState(false);

  const handleInvite = () => {
    if (!email.trim()) return;
    const newCollab: Collaborator = {
      id: String(Date.now()),
      name: email.split("@")[0],
      email: email.trim(),
    };
    setCollaborators((prev) => [...prev, newCollab]);
    setEmail("");
  };

  const handleRemove = (id: string) => {
    setCollaborators((prev) => prev.filter((c) => c.id !== id));
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API may fail in non-secure contexts
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share this page">
      {/* Invite input */}
      <div className="flex gap-2">
        <input
          type="email"
          placeholder="Enter email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleInvite()}
          className="flex-1 rounded-lg px-4 py-2.5 text-sm outline-none transition-all placeholder:text-[#66667A]"
          style={{
            background: "#12121A",
            color: "#E8E8ED",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "rgba(212,168,67,0.5)";
            e.currentTarget.style.boxShadow =
              "0 0 0 3px rgba(212,168,67,0.15)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
            e.currentTarget.style.boxShadow = "none";
          }}
        />
        <button
          onClick={handleInvite}
          className="flex shrink-0 items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90"
          style={{ background: "#D4A843" }}
        >
          <UserPlus size={16} />
          Invite
        </button>
      </div>

      {/* Collaborator list */}
      <div className="mt-5 space-y-1">
        <p
          className="mb-2 text-xs font-medium uppercase tracking-wider"
          style={{ color: "#66667A" }}
        >
          Collaborators
        </p>
        <div className="max-h-52 space-y-1 overflow-y-auto">
          {collaborators.map((collab, index) => (
            <div
              key={collab.id}
              className="group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-white/[0.03]"
            >
              {/* Avatar */}
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
                style={{ background: generateCollabColor(index) }}
              >
                {collab.name.charAt(0).toUpperCase()}
              </div>
              {/* Info */}
              <div className="min-w-0 flex-1">
                <p
                  className="truncate text-sm font-medium"
                  style={{ color: "#E8E8ED" }}
                >
                  {collab.name}
                </p>
                <p
                  className="truncate text-xs"
                  style={{ color: "#66667A" }}
                >
                  {collab.email}
                </p>
              </div>
              {/* Remove */}
              <button
                onClick={() => handleRemove(collab.id)}
                aria-label={`Remove ${collab.name}`}
                className="shrink-0 rounded-md p-1.5 opacity-0 transition-all hover:bg-white/5 group-hover:opacity-100"
                style={{ color: "#EF4444" }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          {collaborators.length === 0 && (
            <p className="py-4 text-center text-sm" style={{ color: "#66667A" }}>
              No collaborators yet. Invite someone above.
            </p>
          )}
        </div>
      </div>

      {/* Copy link */}
      <div
        className="mt-5 pt-4"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <button
          onClick={handleCopyLink}
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all",
          )}
          style={{
            background: "rgba(255,255,255,0.04)",
            color: copied ? "#10B981" : "#A0A0B0",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <Link size={15} />
          {copied ? "Link copied!" : "Copy page link"}
        </button>
      </div>
    </Modal>
  );
}
