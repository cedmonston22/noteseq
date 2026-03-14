"use client";

import React from "react";
import Modal from "./Modal";
import { PAGE_TEMPLATES, type PageTemplate } from "@/lib/templates";
import { FileText } from "lucide-react";

interface TemplatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (template: PageTemplate | null) => void;
}

export default function TemplatePickerModal({
  isOpen,
  onClose,
  onSelect,
}: TemplatePickerModalProps) {
  const handleSelect = (template: PageTemplate | null) => {
    onSelect(template);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Choose a Template" maxWidth="max-w-2xl">
      <div className="max-h-[60vh] overflow-y-auto pr-1">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {/* Blank Page option */}
        <button
          onClick={() => handleSelect(null)}
          className="group flex flex-col items-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 text-center transition-all hover:border-[rgba(212,168,67,0.4)] hover:bg-[rgba(212,168,67,0.05)] hover:shadow-md"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[rgba(128,128,128,0.08)] text-[var(--text-muted)] transition-colors group-hover:bg-[rgba(212,168,67,0.12)] group-hover:text-[#D4A843]">
            <FileText size={22} />
          </div>
          <span className="text-sm font-medium text-[var(--text-primary)]">
            Blank Page
          </span>
          <span className="text-[11px] leading-tight text-[var(--text-muted)]">
            Start from scratch
          </span>
        </button>

        {/* Template options */}
        {PAGE_TEMPLATES.map((template) => (
          <button
            key={template.id}
            onClick={() => handleSelect(template)}
            className="group flex flex-col items-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 text-center transition-all hover:border-[rgba(212,168,67,0.4)] hover:bg-[rgba(212,168,67,0.05)] hover:shadow-md"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[rgba(128,128,128,0.08)] text-lg transition-colors group-hover:bg-[rgba(212,168,67,0.12)]">
              {template.icon}
            </div>
            <span className="text-sm font-medium text-[var(--text-primary)]">
              {template.name}
            </span>
            <span className="line-clamp-2 text-[11px] leading-tight text-[var(--text-muted)]">
              {template.description}
            </span>
          </button>
        ))}
      </div>
      </div>
    </Modal>
  );
}
