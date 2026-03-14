"use client";

import React, { useState, useRef, useCallback } from "react";
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Modal from "@/components/ui/Modal";
import { parseMarkdown, extractTitle } from "@/lib/parsers/markdown";
import { parseLogseq } from "@/lib/parsers/logseq";
import { parseHTML } from "@/lib/parsers/html";
import { parsePlainText } from "@/lib/parsers/plaintext";
import { parseNotionZip } from "@/lib/parsers/notion";

type ImportFormat = "auto" | "markdown" | "logseq" | "notion" | "html" | "plaintext";

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FORMAT_OPTIONS: { value: ImportFormat; label: string; extensions: string }[] = [
  { value: "auto", label: "Auto-detect", extensions: "by extension" },
  { value: "markdown", label: "Markdown", extensions: ".md" },
  { value: "logseq", label: "Logseq", extensions: ".md" },
  { value: "notion", label: "Notion Export", extensions: ".zip" },
  { value: "html", label: "HTML", extensions: ".html, .htm" },
  { value: "plaintext", label: "Plain Text", extensions: ".txt" },
];

function detectFormat(filename: string): ImportFormat {
  const ext = filename.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "md":
      return "markdown";
    case "html":
    case "htm":
      return "html";
    case "txt":
      return "plaintext";
    case "zip":
      return "notion";
    default:
      return "plaintext";
  }
}

export default function ImportModal({ isOpen, onClose }: ImportModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<ImportFormat>("auto");
  const [status, setStatus] = useState<"idle" | "importing" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const createPage = useMutation(api.pages.createPage);
  const updateContent = useMutation(api.pages.updateContent);

  const resetState = useCallback(() => {
    setFile(null);
    setFormat("auto");
    setStatus("idle");
    setErrorMessage("");
    setIsDragOver(false);
  }, []);

  const handleClose = useCallback(() => {
    resetState();
    onClose();
  }, [resetState, onClose]);

  const handleFileSelect = useCallback((selectedFile: File) => {
    setFile(selectedFile);
    setStatus("idle");
    setErrorMessage("");
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) handleFileSelect(droppedFile);
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleImport = useCallback(async () => {
    if (!file) return;

    const activeFormat = format === "auto" ? detectFormat(file.name) : format;

    setStatus("importing");
    setErrorMessage("");

    try {
      // Notion .zip import — creates multiple pages
      if (activeFormat === "notion") {
        const pages = await parseNotionZip(file);
        if (pages.length === 0) {
          setStatus("error");
          setErrorMessage("No markdown files found in the zip. Make sure you exported from Notion as Markdown.");
          return;
        }

        let lastPageId: string | null = null;
        for (const page of pages) {
          const pageId = await createPage({
            title: page.title.slice(0, 100),
            isJournal: false,
          });
          await updateContent({
            pageId,
            content: JSON.stringify(page.content),
          });
          lastPageId = pageId;
        }

        setStatus("success");
        setErrorMessage(`Imported ${pages.length} page${pages.length > 1 ? "s" : ""}`);

        setTimeout(() => {
          handleClose();
          if (lastPageId) router.push(`/p/${lastPageId}`);
        }, 800);
        return;
      }

      // Single file import
      const text = await file.text();
      let title: string;
      let content: Record<string, unknown>;

      switch (activeFormat) {
        case "markdown": {
          title = extractTitle(text);
          content = parseMarkdown(text);
          break;
        }
        case "logseq": {
          const result = parseLogseq(text);
          title = result.title;
          content = result.content;
          break;
        }
        case "html": {
          const result = parseHTML(text);
          title = result.title;
          content = result.content;
          break;
        }
        case "plaintext":
        default: {
          const result = parsePlainText(text);
          title = result.title;
          content = result.content;
          break;
        }
      }

      const pageId = await createPage({
        title: title.slice(0, 100),
        isJournal: false,
      });

      await updateContent({
        pageId,
        content: JSON.stringify(content),
      });

      setStatus("success");

      setTimeout(() => {
        handleClose();
        router.push(`/p/${pageId}`);
      }, 800);
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Import failed. Please try again.");
    }
  }, [file, format, createPage, updateContent, router, handleClose]);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Import">
      <div className="space-y-5">
        {/* Drop zone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed px-6 py-10 transition-colors"
          style={{
            borderColor: isDragOver
              ? "#D4A843"
              : file
                ? "rgba(212, 168, 67, 0.4)"
                : "var(--border-subtle)",
            background: isDragOver
              ? "rgba(212, 168, 67, 0.06)"
              : file
                ? "rgba(212, 168, 67, 0.03)"
                : "transparent",
          }}
        >
          {file ? (
            <>
              <FileText size={32} style={{ color: "#D4A843" }} />
              <div className="text-center">
                <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                  {file.name}
                </p>
                <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </>
          ) : (
            <>
              <Upload size={32} style={{ color: "var(--text-muted)" }} />
              <div className="text-center">
                <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                  Drop a file here or click to browse
                </p>
                <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
                  Supports .md, .html, .txt, and Notion .zip exports
                </p>
              </div>
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept=".md,.html,.htm,.txt,.zip"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFileSelect(f);
            }}
            className="hidden"
          />
        </div>

        {/* Format selector */}
        <div>
          <label
            className="mb-1.5 block text-xs font-medium"
            style={{ color: "var(--text-secondary)" }}
          >
            Format
          </label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as ImportFormat)}
            className="w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors"
            style={{
              background: "var(--bg-primary)",
              borderColor: "var(--border-subtle)",
              color: "var(--text-primary)",
            }}
          >
            {FORMAT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label} ({opt.extensions})
              </option>
            ))}
          </select>
        </div>

        {/* Status messages */}
        {status === "success" && (
          <div className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ background: "rgba(16, 185, 129, 0.1)" }}>
            <CheckCircle size={16} style={{ color: "#10B981" }} />
            <span className="text-sm" style={{ color: "#10B981" }}>
              {errorMessage || "Imported successfully!"} Redirecting...
            </span>
          </div>
        )}

        {status === "error" && (
          <div className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ background: "rgba(239, 68, 68, 0.1)" }}>
            <AlertCircle size={16} style={{ color: "#EF4444" }} />
            <span className="text-sm" style={{ color: "#EF4444" }}>
              {errorMessage}
            </span>
          </div>
        )}

        {/* Import button */}
        <button
          onClick={handleImport}
          disabled={!file || status === "importing" || status === "success"}
          className="flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50"
          style={{
            background: file && status !== "importing" && status !== "success" ? "#D4A843" : "rgba(212, 168, 67, 0.3)",
            color: "#fff",
          }}
        >
          {status === "importing" ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Importing...
            </>
          ) : status === "success" ? (
            <>
              <CheckCircle size={16} />
              Done
            </>
          ) : (
            <>
              <Upload size={16} />
              Import
            </>
          )}
        </button>
      </div>
    </Modal>
  );
}
