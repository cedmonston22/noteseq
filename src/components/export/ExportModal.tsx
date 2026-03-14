"use client";

import React, { useState, useMemo } from "react";
import { FileText, Code, AlignLeft, Download } from "lucide-react";
import { saveAs } from "file-saver";
import Modal from "@/components/ui/Modal";
import { contentToMarkdown } from "@/lib/export/exportMarkdown";
import { contentToHTML } from "@/lib/export/exportHTML";
import { contentToPlainText } from "@/lib/export/exportPlainText";

type ExportFormat = "markdown" | "html" | "plaintext";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  pageId?: string;
  pageTitle?: string;
  content?: Record<string, unknown>;
}

const FORMAT_OPTIONS: {
  id: ExportFormat;
  label: string;
  icon: React.ReactNode;
  ext: string;
  mime: string;
}[] = [
  { id: "markdown", label: "Markdown", icon: <FileText size={16} />, ext: ".md", mime: "text/markdown;charset=utf-8" },
  { id: "html", label: "HTML", icon: <Code size={16} />, ext: ".html", mime: "text/html;charset=utf-8" },
  { id: "plaintext", label: "Plain Text", icon: <AlignLeft size={16} />, ext: ".txt", mime: "text/plain;charset=utf-8" },
];

export default function ExportModal({
  isOpen,
  onClose,
  pageTitle = "Untitled",
  content,
}: ExportModalProps) {
  const [format, setFormat] = useState<ExportFormat>("markdown");

  const converted = useMemo(() => {
    if (!content) return "";
    switch (format) {
      case "markdown":
        return contentToMarkdown(content);
      case "html":
        return contentToHTML(content, pageTitle);
      case "plaintext":
        return contentToPlainText(content);
    }
  }, [content, format, pageTitle]);

  const previewLines = useMemo(() => {
    const lines = converted.split("\n").slice(0, 8);
    const text = lines.join("\n");
    return text.length > 400 ? text.slice(0, 400) + "..." : text + (converted.split("\n").length > 8 ? "\n..." : "");
  }, [converted]);

  const handleExport = () => {
    const opt = FORMAT_OPTIONS.find(f => f.id === format)!;
    const filename = `${pageTitle.replace(/[^a-zA-Z0-9_\- ]/g, "").trim() || "note"}${opt.ext}`;
    const blob = new Blob([converted], { type: opt.mime });
    saveAs(blob, filename);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Export page">
      <div className="space-y-5">
        {/* Format selector */}
        <div>
          <label
            className="mb-2 block text-xs font-medium uppercase tracking-wider"
            style={{ color: "var(--text-muted)" }}
          >
            Format
          </label>
          <div className="flex gap-2">
            {FORMAT_OPTIONS.map(opt => (
              <button
                key={opt.id}
                onClick={() => setFormat(opt.id)}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-all"
                style={{
                  borderColor: format === opt.id ? "var(--accent-gold)" : "var(--border-subtle)",
                  background: format === opt.id ? "rgba(212, 168, 67, 0.08)" : "transparent",
                  color: format === opt.id ? "var(--accent-gold)" : "var(--text-secondary)",
                }}
              >
                {opt.icon}
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div>
          <label
            className="mb-2 block text-xs font-medium uppercase tracking-wider"
            style={{ color: "var(--text-muted)" }}
          >
            Preview
          </label>
          <div
            className="max-h-48 overflow-auto rounded-lg p-4 font-mono text-xs leading-relaxed"
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border-subtle)",
              color: "var(--text-secondary)",
            }}
          >
            {previewLines ? (
              <pre className="whitespace-pre-wrap">{previewLines}</pre>
            ) : (
              <span style={{ color: "var(--text-muted)" }}>No content to export</span>
            )}
          </div>
        </div>

        {/* Export button */}
        <button
          onClick={handleExport}
          disabled={!converted}
          className="flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-40"
          style={{
            background: "var(--accent-gold)",
            color: "#1a1a22",
          }}
        >
          <Download size={16} />
          Export as {FORMAT_OPTIONS.find(f => f.id === format)!.label}
        </button>
      </div>
    </Modal>
  );
}
