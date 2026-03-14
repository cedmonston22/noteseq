"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Upload,
  CalendarDays,
  Crown,
  GitBranch,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Settings,
  LogOut,
  X,
  Folder,
  FolderOpen,
  FileText,
  Users,
  Trash2,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useConvexAuth, useQuery, useMutation } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "../../../convex/_generated/api";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/useAuth";
import type { Id } from "../../../convex/_generated/dataModel";

interface FolderItem {
  id: string;
  name: string;
  icon?: string;
}

interface PageItem {
  id: string;
  title: string;
  icon?: string;
  isShared?: boolean;
  isOwner?: boolean;
  folderId?: string;
  sortOrder?: number;
  createdAt?: number;
}

function NavItem({
  href,
  icon: Icon,
  label,
  active,
  collapsed,
  badge,
  onClick,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  active?: boolean;
  collapsed: boolean;
  badge?: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
        active
          ? "bg-[rgba(212,168,67,0.12)] text-[#F2D479]"
          : "text-[var(--text-secondary)] hover:bg-[rgba(128,128,128,0.08)] hover:text-[var(--text-primary)]"
      )}
    >
      <Icon size={18} className="shrink-0" />
      <AnimatePresence>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            className="truncate"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
      {!collapsed && badge && (
        <span className="ml-auto shrink-0 rounded-full bg-[rgba(212,168,67,0.15)] px-2 py-0.5 text-[10px] font-semibold text-[#F2D479]">
          {badge}
        </span>
      )}
    </Link>
  );
}

function DeleteConfirmPopover({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onCancel();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onCancel]);

  return (
    <div
      ref={popoverRef}
      className="absolute right-0 top-full z-50 mt-1 w-44 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-3 shadow-xl"
    >
      <p className="mb-2 text-xs font-medium text-[var(--text-primary)]">
        Delete this page?
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onConfirm();
          }}
          className="rounded-md bg-red-500/90 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-red-500"
        >
          Delete
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onCancel();
          }}
          className="rounded-md border border-[var(--border-subtle)] px-3 py-1 text-xs font-medium text-[var(--text-secondary)] transition-colors hover:bg-[rgba(128,128,128,0.08)]"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function PageListItem({
  page,
  collapsed,
  onDelete,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
  dropIndicator,
  onNavigate,
  folders,
  onMovePage,
}: {
  page: PageItem;
  collapsed: boolean;
  onDelete?: (id: string) => void;
  onDragStart?: (e: React.DragEvent, pageId: string) => void;
  onDragOver?: (e: React.DragEvent, pageId: string) => void;
  onDragLeave?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent, pageId: string) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  dropIndicator?: "above" | "below" | null;
  onNavigate?: () => void;
  folders?: FolderItem[];
  onMovePage?: (pageId: string, folderId: string | undefined) => void;
}) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [showMoveMenu, setShowMoveMenu] = useState(false);

  return (
    <div className="relative">
      {dropIndicator === "above" && (
        <div className="absolute left-2 right-2 top-0 z-10 h-[2px] rounded-full bg-[#D4A843]" />
      )}
      <Link
        href={`/p/${page.id}`}
        draggable
        onClick={onNavigate}
        onDragStart={(e) => onDragStart?.(e, page.id)}
        onDragOver={(e) => onDragOver?.(e, page.id)}
        onDragLeave={(e) => onDragLeave?.(e)}
        onDrop={(e) => onDrop?.(e, page.id)}
        onDragEnd={(e) => onDragEnd?.(e)}
        onContextMenu={(e) => {
          if (folders && folders.length > 0 && onMovePage) {
            e.preventDefault();
            setShowMoveMenu(!showMoveMenu);
          }
        }}
        className="group flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-sm transition-all hover:bg-[rgba(128,128,128,0.08)]"
      >
        <span className="shrink-0 text-sm">{page.icon || "\u{1F4C4}"}</span>
        {!collapsed && (
          <>
            <span className="truncate text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">
              {page.title}
            </span>
            {page.isShared && page.isOwner && (
              <Crown
                size={12}
                className="ml-auto shrink-0 text-[#D4A843]"
              />
            )}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setConfirmingDelete(true);
                }}
                className="ml-auto shrink-0 rounded p-0.5 text-[var(--text-muted)] opacity-0 transition-opacity hover:text-red-400 group-hover:opacity-100"
                aria-label={`Delete ${page.title}`}
              >
                <X size={14} />
              </button>
            )}
            {confirmingDelete && (
              <DeleteConfirmPopover
                onConfirm={() => {
                  setConfirmingDelete(false);
                  onDelete?.(page.id);
                }}
                onCancel={() => setConfirmingDelete(false)}
              />
            )}
          </>
        )}
      </Link>
      {dropIndicator === "below" && (
        <div className="absolute bottom-0 left-2 right-2 z-10 h-[2px] rounded-full bg-[#D4A843]" />
      )}
      {showMoveMenu && !collapsed && folders && onMovePage && (
        <div className="absolute left-4 top-full z-50 mt-1 w-48 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-primary)] py-1 shadow-lg">
          {page.folderId && (
            <button
              onClick={() => {
                onMovePage(page.id, undefined);
                setShowMoveMenu(false);
              }}
              className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-[var(--text-secondary)] hover:bg-[rgba(128,128,128,0.08)]"
            >
              <X size={12} />
              <span>Remove from folder</span>
            </button>
          )}
          {folders
            .filter((f) => f.id !== page.folderId)
            .map((folder) => (
              <button
                key={folder.id}
                onClick={() => {
                  onMovePage(page.id, folder.id);
                  setShowMoveMenu(false);
                }}
                className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-[var(--text-secondary)] hover:bg-[rgba(128,128,128,0.08)]"
              >
                <Folder size={12} />
                <span className="truncate">{folder.name}</span>
              </button>
            ))}
          <button
            onClick={() => setShowMoveMenu(false)}
            className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-[var(--text-muted)] hover:bg-[rgba(128,128,128,0.08)]"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

function SectionLabel({
  label,
  collapsed,
  action,
}: {
  label: string;
  collapsed: boolean;
  action?: React.ReactNode;
}) {
  if (collapsed) return null;
  return (
    <div className="mb-1 mt-5 flex items-center justify-between px-3">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">
        {label}
      </p>
      {action}
    </div>
  );
}

function SectionHeader({
  label,
  collapsed,
  menuItems,
}: {
  label: string;
  collapsed: boolean;
  menuItems: { icon: React.ElementType; label: string; onClick: () => void }[];
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    // Use mouseup so onClick on menu items fires first
    document.addEventListener("mouseup", handler);
    return () => document.removeEventListener("mouseup", handler);
  }, [open]);

  if (collapsed) return null;

  return (
    <div className="relative mb-1 mt-5 flex items-center justify-between px-3" ref={menuRef}>
      <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">
        {label}
      </p>
      <button
        onClick={() => setOpen(!open)}
        className="rounded p-0.5 text-[var(--text-muted)] transition-colors hover:text-[var(--text-secondary)]"
        aria-label={`Add to ${label}`}
      >
        <Plus size={14} />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 w-48 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] py-1 shadow-xl">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                item.onClick();
                setOpen(false);
              }}
              className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-medium text-[var(--text-secondary)] transition-colors hover:bg-[rgba(128,128,128,0.08)] hover:text-[var(--text-primary)]"
            >
              <item.icon size={14} className="shrink-0" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function FolderDeleteConfirmPopover({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onCancel();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onCancel]);

  return (
    <div
      ref={popoverRef}
      className="absolute right-0 top-full z-50 mt-1 w-52 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-3 shadow-xl"
    >
      <p className="mb-2 text-xs font-medium text-[var(--text-primary)]">
        Delete folder? Pages will be moved to root.
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onConfirm();
          }}
          className="rounded-md bg-red-500/90 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-red-500"
        >
          Delete
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onCancel();
          }}
          className="rounded-md border border-[var(--border-subtle)] px-3 py-1 text-xs font-medium text-[var(--text-secondary)] transition-colors hover:bg-[rgba(128,128,128,0.08)]"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function FolderGroup({
  folder,
  pages,
  collapsed,
  onDeletePage,
  onDeleteFolder,
  folders,
  onMovePage,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
  dropTarget,
  onNavigate,
}: {
  folder: FolderItem;
  pages: PageItem[];
  collapsed: boolean;
  onDeletePage?: (id: string) => void;
  onDeleteFolder?: (id: string) => void;
  folders: FolderItem[];
  onMovePage: (pageId: string, folderId: string | undefined) => void;
  onDragStart?: (e: React.DragEvent, pageId: string) => void;
  onDragOver?: (e: React.DragEvent, pageId: string) => void;
  onDragLeave?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent, pageId: string) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  dropTarget?: { pageId: string; position: "above" | "below" } | null;
  onNavigate?: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setExpanded(!expanded)}
        className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-all hover:bg-[rgba(128,128,128,0.08)]"
      >
        {!collapsed && (
          expanded ? (
            <ChevronDown size={14} className="shrink-0 text-[var(--text-muted)]" />
          ) : (
            <ChevronRight size={14} className="shrink-0 text-[var(--text-muted)]" />
          )
        )}
        {expanded ? (
          <FolderOpen size={16} className="shrink-0 text-[var(--text-secondary)]" />
        ) : (
          <Folder size={16} className="shrink-0 text-[var(--text-secondary)]" />
        )}
        {!collapsed && (
          <span className="truncate text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">
            {folder.name}
          </span>
        )}
        {!collapsed && (
          <>
            <span className="ml-auto text-[10px] text-[var(--text-muted)]">
              {pages.length}
            </span>
            {onDeleteFolder && (
              <span
                role="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setConfirmingDelete(true);
                }}
                className="shrink-0 rounded p-0.5 text-[var(--text-muted)] opacity-0 transition-opacity hover:text-red-400 group-hover:opacity-100"
                aria-label={`Delete folder ${folder.name}`}
              >
                <Trash2 size={13} />
              </span>
            )}
          </>
        )}
      </button>
      {confirmingDelete && (
        <FolderDeleteConfirmPopover
          onConfirm={() => {
            setConfirmingDelete(false);
            onDeleteFolder?.(folder.id);
          }}
          onCancel={() => setConfirmingDelete(false)}
        />
      )}
      {expanded && !collapsed && (
        <div className="ml-4 space-y-0.5 border-l border-[var(--border-subtle)] pl-1">
          {pages.length > 0 ? (
            pages.map((page) => (
              <PageListItem
                key={page.id}
                page={page}
                collapsed={collapsed}
                onDelete={onDeletePage}
                folders={folders}
                onMovePage={onMovePage}
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onDragEnd={onDragEnd}
                dropIndicator={
                  dropTarget?.pageId === page.id ? dropTarget.position : null
                }
                onNavigate={onNavigate}
              />
            ))
          ) : (
            <p className="px-3 py-1 text-xs text-[var(--text-muted)]">Empty</p>
          )}
        </div>
      )}
    </div>
  );
}

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();
  const { user } = useAuth();

  // Skip queries when not authenticated
  const userPages = useQuery(api.pages.getUserPages, isAuthenticated ? {} : "skip");
  const sharedPages = useQuery(api.pages.getSharedPages, isAuthenticated ? {} : "skip");
  const userFolders = useQuery(api.folders.getFolders, isAuthenticated ? {} : "skip");
  const createPage = useMutation(api.pages.createPage);
  const deletePageMutation = useMutation(api.pages.deletePage);
  const reorderPageMutation = useMutation(api.pages.reorderPage);
  const createFolderMutation = useMutation(api.folders.createFolder);
  const deleteFolderMutation = useMutation(api.folders.deleteFolder);
  const movePageMutation = useMutation(api.folders.movePage);
  const acceptInviteMutation = useMutation(api.pages.acceptInvite);
  const declineInviteMutation = useMutation(api.pages.declineInvite);
  const pendingInvites = useQuery(api.pages.getPendingInvites, isAuthenticated ? {} : "skip");

  const [draggedPageId, setDraggedPageId] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<{ pageId: string; position: "above" | "below" } | null>(null);
  const [folderNameInput, setFolderNameInput] = useState<string | null>(null);
  const [collabFolderNameInput, setCollabFolderNameInput] = useState<string | null>(null);

  // Map Convex folders to FolderItem format
  const folders: FolderItem[] = userFolders
    ? userFolders.map((f) => ({
        id: f._id,
        name: f.name,
        icon: f.icon,
      }))
    : [];

  // Map Convex pages to PageItem format
  const allOwnedPages: PageItem[] = userPages
    ? userPages.map((p) => ({
        id: p._id,
        title: p.title,
        icon: p.icon,
        isShared: p.isShared,
        isOwner: true,
        folderId: (p as unknown as { folderId?: string }).folderId,
        sortOrder: p.sortOrder,
        createdAt: p.createdAt,
      }))
    : [];

  // Personal = owned pages that are NOT shared
  const pages: PageItem[] = allOwnedPages.filter((p) => !p.isShared);

  // Sort pages by sortOrder with fallback to createdAt
  const sortedPages = [...pages].sort((a, b) => {
    const aOrder = a.sortOrder ?? a.createdAt ?? 0;
    const bOrder = b.sortOrder ?? b.createdAt ?? 0;
    return aOrder - bOrder;
  });

  // Pages in folders vs root
  const rootPages = sortedPages.filter((p) => !p.folderId);
  const pagesByFolder = (folderId: string) =>
    sortedPages.filter((p) => p.folderId === folderId);

  const handleDragStart = useCallback((e: React.DragEvent, pageId: string) => {
    setDraggedPageId(pageId);
    e.dataTransfer.setData("text/plain", pageId);
    e.dataTransfer.effectAllowed = "move";
    (e.currentTarget as HTMLElement).style.opacity = "0.5";
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, pageId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (pageId === draggedPageId) {
      setDropTarget(null);
      return;
    }
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    const position = e.clientY < midY ? "above" : "below";
    setDropTarget({ pageId, position });
  }, [draggedPageId]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    const relatedTarget = e.relatedTarget as HTMLElement | null;
    if (!relatedTarget || !(e.currentTarget as HTMLElement).contains(relatedTarget)) {
      setDropTarget(null);
    }
  }, []);

  const handleDragEnd = useCallback((e: React.DragEvent) => {
    (e.currentTarget as HTMLElement).style.opacity = "1";
    setDraggedPageId(null);
    setDropTarget(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, targetPageId: string) => {
    e.preventDefault();
    const sourcePageId = e.dataTransfer.getData("text/plain");
    if (!sourcePageId || sourcePageId === targetPageId) {
      setDropTarget(null);
      setDraggedPageId(null);
      return;
    }

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    const dropAbove = e.clientY < midY;

    const targetIndex = sortedPages.findIndex((p) => p.id === targetPageId);
    if (targetIndex === -1) return;

    let newSortOrder: number;

    if (dropAbove) {
      if (targetIndex === 0) {
        const targetOrder = sortedPages[0].sortOrder ?? sortedPages[0].createdAt ?? 0;
        newSortOrder = targetOrder - 1;
      } else {
        const aboveOrder = sortedPages[targetIndex - 1].sortOrder ?? sortedPages[targetIndex - 1].createdAt ?? 0;
        const targetOrder = sortedPages[targetIndex].sortOrder ?? sortedPages[targetIndex].createdAt ?? 0;
        newSortOrder = (aboveOrder + targetOrder) / 2;
      }
    } else {
      if (targetIndex === sortedPages.length - 1) {
        const targetOrder = sortedPages[targetIndex].sortOrder ?? sortedPages[targetIndex].createdAt ?? 0;
        newSortOrder = targetOrder + 1;
      } else {
        const targetOrder = sortedPages[targetIndex].sortOrder ?? sortedPages[targetIndex].createdAt ?? 0;
        const belowOrder = sortedPages[targetIndex + 1].sortOrder ?? sortedPages[targetIndex + 1].createdAt ?? 0;
        newSortOrder = (targetOrder + belowOrder) / 2;
      }
    }

    reorderPageMutation({ pageId: sourcePageId as never, sortOrder: newSortOrder });
    setDropTarget(null);
    setDraggedPageId(null);
  }, [sortedPages, reorderPageMutation]);

  // Collaborative = pages shared with you + your own shared pages
  const sharedWithMe: PageItem[] = sharedPages
    ? sharedPages.map((p) => ({
        id: (p as { _id: string })._id,
        title: (p as { title: string }).title,
        icon: (p as { icon?: string }).icon,
        isShared: true,
        isOwner: false,
      }))
    : [];
  const mySharedPages: PageItem[] = allOwnedPages.filter((p) => p.isShared);
  const shared: PageItem[] = [...mySharedPages, ...sharedWithMe];

  const handleNewPage = async () => {
    try {
      const pageId = await createPage({
        title: "Untitled",
        isJournal: false,
      });
      router.push(`/p/${pageId}`);
      onMobileClose?.();
    } catch {
      // User not authenticated or other error — ignore gracefully
    }
  };

  const handleDeletePage = async (id: string) => {
    try {
      await deletePageMutation({ pageId: id as never });
    } catch {
      // User not authenticated or other error — ignore gracefully
    }
  };

  const handleNewFolder = () => {
    setFolderNameInput("");
  };

  const handleCreateFolder = async (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) {
      setFolderNameInput(null);
      return;
    }
    try {
      await createFolderMutation({ name: trimmed });
    } catch {
      // ignore
    }
    setFolderNameInput(null);
  };

  const handleDeleteFolder = async (id: string) => {
    try {
      await deleteFolderMutation({ folderId: id as Id<"folders"> });
    } catch {
      // ignore
    }
  };

  const handleNewSharedPage = () => {
    createPage({
      title: "Untitled",
      isJournal: false,
    }).then((pageId) => {
      const pageIdStr = pageId as string;
      router.push(`/p/${pageIdStr}`);
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("noteseq:open-share", { detail: { pageId: pageIdStr } }));
      }, 300);
      onMobileClose?.();
    }).catch((err) => {
      alert("Failed to create page: " + String(err));
    });
  };

  const handleMovePage = async (pageId: string, folderId: string | undefined) => {
    try {
      await movePageMutation({
        pageId: pageId as Id<"pages">,
        folderId: folderId ? (folderId as Id<"folders">) : undefined,
      });
    } catch {
      // ignore
    }
  };

  const handleMobileNavigate = () => {
    onMobileClose?.();
  };

  return (
    <>
    <motion.aside
      animate={{ width: collapsed ? 56 : 260 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      role="navigation"
      aria-label="Main navigation"
      className={cn(
        "flex h-screen flex-col border-r border-[var(--border-subtle)] bg-[var(--bg-primary)]",
        "fixed inset-y-0 left-0 z-50 transition-transform md:relative md:z-auto md:translate-x-0",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}
      style={{ minWidth: collapsed ? 56 : 260 }}
    >
      {/* Mobile close button */}
      <button
        onClick={onMobileClose}
        className="absolute right-2 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-muted)] transition-colors hover:bg-[rgba(128,128,128,0.08)] hover:text-[var(--text-secondary)] md:hidden"
        aria-label="Close sidebar"
      >
        <X size={18} />
      </button>

      {/* Logo */}
      <div className="flex h-14 items-center gap-3 border-b border-[var(--border-subtle)] px-4">
        <div className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#D4A843]">
          <span className="text-sm font-bold text-white">n</span>
          <div className="absolute inset-0 rounded-lg bg-[#D4A843] opacity-40 blur-md" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="gold-sheen text-lg font-bold tracking-tight text-[var(--text-primary)]"
            >
              noteseq
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Quick actions */}
      <div className="space-y-0.5 px-2 pt-3">
        <button
          onClick={() => {
            window.dispatchEvent(new CustomEvent("noteseq:toggle-search"));
            onMobileClose?.();
          }}
          className={cn(
            "group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
            "text-[var(--text-secondary)] hover:bg-[rgba(128,128,128,0.08)] hover:text-[var(--text-primary)]"
          )}
        >
          <Search size={18} className="shrink-0" />
          {!collapsed && (
            <>
              <span className="truncate">Search</span>
              <span className="ml-auto shrink-0 rounded-full bg-[rgba(212,168,67,0.15)] px-2 py-0.5 text-[10px] font-semibold text-[#F2D479]">
                {"\u2318"}K
              </span>
            </>
          )}
        </button>
        <button
          onClick={() => {
            window.dispatchEvent(new CustomEvent("noteseq:toggle-import"));
            onMobileClose?.();
          }}
          className={cn(
            "group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
            "text-[var(--text-secondary)] hover:bg-[rgba(128,128,128,0.08)] hover:text-[var(--text-primary)]"
          )}
        >
          <Upload size={18} className="shrink-0" />
          {!collapsed && <span className="truncate">Import</span>}
        </button>
      </div>

      {/* Navigation */}
      <div className="space-y-0.5 px-2 pt-1">
        <NavItem
          href="/journal"
          icon={CalendarDays}
          label="Journal"
          active={pathname.startsWith("/journal")}
          collapsed={collapsed}
          onClick={handleMobileNavigate}
        />
        <NavItem
          href="/graph"
          icon={GitBranch}
          label="Graph View"
          active={pathname === "/graph"}
          collapsed={collapsed}
          onClick={handleMobileNavigate}
        />
      </div>

      {/* Pages */}
      <div className="flex-1 overflow-y-auto px-2">
        <SectionHeader
          label="Personal"
          collapsed={collapsed}
          menuItems={[
            { icon: FileText, label: "New Page", onClick: handleNewPage },
            { icon: Folder, label: "New Folder", onClick: handleNewFolder },
          ]}
        />
        {/* Inline folder name input */}
        {folderNameInput !== null && !collapsed && (
          <div className="px-3 py-1">
            <input
              type="text"
              autoFocus
              placeholder="Folder name..."
              value={folderNameInput}
              onChange={(e) => setFolderNameInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateFolder(folderNameInput);
                if (e.key === "Escape") setFolderNameInput(null);
              }}
              onBlur={() => handleCreateFolder(folderNameInput)}
              className="w-full rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2 py-1 text-xs text-[var(--text-primary)] outline-none focus:border-[rgba(212,168,67,0.5)] focus:ring-1 focus:ring-[rgba(212,168,67,0.15)]"
            />
          </div>
        )}
        <div className="space-y-0.5">
          {/* Folders */}
          {folders.map((folder) => (
            <FolderGroup
              key={folder.id}
              folder={folder}
              pages={pagesByFolder(folder.id)}
              collapsed={collapsed}
              onDeletePage={userPages ? handleDeletePage : undefined}
              onDeleteFolder={handleDeleteFolder}
              folders={folders}
              onMovePage={handleMovePage}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onDragEnd={handleDragEnd}
              dropTarget={dropTarget}
              onNavigate={handleMobileNavigate}
            />
          ))}
          {/* Root pages (no folder) */}
          {rootPages.length > 0 ? (
            rootPages.map((page) => (
              <PageListItem
                key={page.id}
                page={page}
                collapsed={collapsed}
                onDelete={userPages ? handleDeletePage : undefined}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onDragEnd={handleDragEnd}
                dropIndicator={
                  dropTarget?.pageId === page.id ? dropTarget.position : null
                }
                onNavigate={handleMobileNavigate}
                folders={folders}
                onMovePage={handleMovePage}
              />
            ))
          ) : (
            folders.length === 0 &&
            !collapsed && (
              <p className="px-3 py-2 text-xs text-[var(--text-muted)]">No pages yet</p>
            )
          )}
        </div>

        <SectionHeader
          label="Collaborative"
          collapsed={collapsed}
          menuItems={[
            { icon: Users, label: "New Shared Page", onClick: handleNewSharedPage },
            { icon: Folder, label: "New Folder", onClick: () => setCollabFolderNameInput("") },
          ]}
        />
        {collabFolderNameInput !== null && !collapsed && (
          <div className="px-3 py-1">
            <input
              type="text"
              placeholder="Folder name..."
              autoFocus
              value={collabFolderNameInput}
              onChange={(e) => setCollabFolderNameInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateFolder(collabFolderNameInput);
                if (e.key === "Escape") setCollabFolderNameInput(null);
              }}
              onBlur={() => {
                if (collabFolderNameInput.trim()) handleCreateFolder(collabFolderNameInput);
                setCollabFolderNameInput(null);
              }}
              className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-2 py-1 text-xs text-[var(--text-primary)] outline-none focus:border-[#D4A843]"
            />
          </div>
        )}
        {/* Pending invites */}
        {pendingInvites && pendingInvites.length > 0 && !collapsed && (
          <div className="space-y-1 pb-2">
            {pendingInvites.map((invite) => invite && (
              <div
                key={invite._id}
                className="mx-1 flex items-center gap-2 rounded-lg border border-[rgba(212,168,67,0.2)] bg-[rgba(212,168,67,0.05)] px-3 py-2"
              >
                <span className="shrink-0 text-sm">{invite.icon || "📄"}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-[var(--text-primary)]">{invite.title}</p>
                  <p className="text-[10px] text-[var(--text-muted)]">from {invite.inviterName}</p>
                </div>
                <button
                  onClick={() => acceptInviteMutation({ pageId: invite._id }).catch(() => {})}
                  className="rounded p-1 text-[#10B981] transition-colors hover:bg-[rgba(16,185,129,0.1)]"
                  title="Accept"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </button>
                <button
                  onClick={() => declineInviteMutation({ pageId: invite._id }).catch(() => {})}
                  className="rounded p-1 text-[#EF4444] transition-colors hover:bg-[rgba(239,68,68,0.1)]"
                  title="Decline"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-0.5">
          {shared.length > 0 ? (
            shared.map((page) => (
              <PageListItem
                key={page.id}
                page={page}
                collapsed={collapsed}
                onNavigate={handleMobileNavigate}
              />
            ))
          ) : (
            !collapsed && (
              <p className="px-3 py-2 text-xs text-[var(--text-muted)]">No shared pages</p>
            )
          )}
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-[var(--border-subtle)] px-2 py-3">
        {!collapsed && (
          <div className="mb-2 flex items-center gap-3 px-3 py-1.5">
            {user?.image || user?.avatarUrl ? (
              <img
                src={user.image || user.avatarUrl}
                alt={user.name || "User"}
                className="h-8 w-8 shrink-0 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#D4A843] text-xs font-semibold text-white">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-[var(--text-primary)]">
                {user?.name || "User"}
              </p>
              {(user?.email || !user) && (
                <p className="truncate text-[11px] text-[var(--text-muted)]">
                  {user?.email || ""}
                </p>
              )}
            </div>
          </div>
        )}
        <div className="flex items-center gap-1">
          {!collapsed && (
            <>
              <NavItem
                href="/settings"
                icon={Settings}
                label="Settings"
                collapsed={collapsed}
                onClick={handleMobileNavigate}
              />
              <button
                onClick={async () => {
                  try {
                    await signOut();
                  } catch {
                    // signOut may fail on server but we still want to redirect
                  }
                  router.push("/login");
                }}
                className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[var(--text-secondary)] transition-all hover:bg-[rgba(128,128,128,0.08)] hover:text-[#EF4444]"
              >
                <LogOut size={18} className="shrink-0" />
              </button>
            </>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto hidden h-8 w-8 items-center justify-center rounded-lg text-[var(--text-muted)] transition-colors hover:bg-[rgba(128,128,128,0.08)] hover:text-[var(--text-secondary)] md:flex"
          >
            {collapsed ? (
              <ChevronRight size={16} />
            ) : (
              <ChevronLeft size={16} />
            )}
          </button>
        </div>
      </div>
    </motion.aside>

    </>
  );
}
