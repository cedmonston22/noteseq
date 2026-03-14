"use client";

import React, { useState } from "react";
import { Link, Trash2, UserPlus } from "lucide-react";
import { useConvexAuth, useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import Modal from "@/components/ui/Modal";
import { cn } from "@/lib/utils";
import { generateCollabColor } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";

interface Collaborator {
  id: string;
  name: string;
  email: string;
}

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  pageId?: string;
}

export default function ShareModal({ isOpen, onClose, pageId }: ShareModalProps) {
  const [email, setEmail] = useState("");
  const [localCollaborators, setLocalCollaborators] = useState<Collaborator[]>(
    []
  );
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const { isAuthenticated } = useConvexAuth();
  const convexPageId = pageId as Id<"pages"> | undefined;
  const isConnected = isAuthenticated && !!convexPageId;

  const collaborators = useQuery(
    api.pages.getCollaborators,
    isConnected ? { pageId: convexPageId! } : "skip"
  );
  const sharePageMutation = useMutation(api.pages.sharePage);
  const unsharePageMutation = useMutation(api.pages.unsharePage);

  const handleInvite = async () => {
    if (!email.trim()) return;

    if (isConnected) {
      try {
        await sharePageMutation({ pageId: convexPageId!, email: email.trim() });
        toast("Collaborator invited successfully", "success");
        setEmail("");
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to invite";
        toast(message, "error");
      }
    } else {
      const newCollab: Collaborator = {
        id: String(Date.now()),
        name: email.split("@")[0],
        email: email.trim(),
      };
      setLocalCollaborators((prev) => [...prev, newCollab]);
      setEmail("");
    }
  };

  const handleRemove = async (id: string) => {
    if (isConnected) {
      try {
        await unsharePageMutation({ pageId: convexPageId!, userId: id as Id<"users"> });
        toast("Collaborator removed", "success");
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to remove";
        toast(message, "error");
      }
    } else {
      setLocalCollaborators((prev) => prev.filter((c) => c.id !== id));
    }
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

  // Build a unified list for rendering
  const displayCollaborators: { id: string; name: string; email: string }[] = isConnected
    ? (collaborators ?? []).filter(Boolean).map((u) => ({
        id: u!._id,
        name: u!.name ?? u!.email ?? "Unknown",
        email: u!.email ?? "",
      }))
    : localCollaborators;

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
          className="flex-1 rounded-lg px-4 py-2.5 text-sm outline-none transition-all placeholder:text-[var(--text-muted)]"
          style={{
            background: "var(--bg-surface)",
            color: "var(--text-primary)",
            border: "1px solid var(--border-subtle)",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "rgba(212,168,67,0.5)";
            e.currentTarget.style.boxShadow =
              "0 0 0 3px rgba(212,168,67,0.15)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "var(--border-subtle)";
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
          style={{ color: "var(--text-muted)" }}
        >
          Collaborators
        </p>
        <div className="max-h-52 space-y-1 overflow-y-auto">
          {displayCollaborators.map((collab, index) => (
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
                  style={{ color: "var(--text-primary)" }}
                >
                  {collab.name}
                </p>
                <p
                  className="truncate text-xs"
                  style={{ color: "var(--text-muted)" }}
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
          {displayCollaborators.length === 0 && (
            <p className="py-4 text-center text-sm" style={{ color: "var(--text-muted)" }}>
              No collaborators yet. Invite someone above.
            </p>
          )}
        </div>
      </div>

      {/* Copy link */}
      <div
        className="mt-5 pt-4"
        style={{ borderTop: "1px solid var(--border-subtle)" }}
      >
        <button
          onClick={handleCopyLink}
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all",
          )}
          style={{
            background: "rgba(128,128,128,0.08)",
            color: copied ? "#10B981" : "var(--text-secondary)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <Link size={15} />
          {copied ? "Link copied!" : "Copy page link"}
        </button>
      </div>
    </Modal>
  );
}
