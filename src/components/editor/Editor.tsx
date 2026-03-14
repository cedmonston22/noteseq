"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Plus } from "lucide-react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import SlashCommandMenu from "./SlashCommandMenu";

const lowlight = createLowlight(common);

interface EditorProps {
  content?: Record<string, unknown>;
  onUpdate?: (content: Record<string, unknown>) => void;
  editable?: boolean;
}

export default function NoteEditor({
  content,
  onUpdate,
  editable = true,
}: EditorProps) {
  const [slashMenuOpen, setSlashMenuOpen] = useState(false);
  const [slashMenuPos, setSlashMenuPos] = useState({ top: 0, left: 0 });
  const [slashFilter, setSlashFilter] = useState("");
  const slashRangeRef = useRef<{ from: number; to: number } | null>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLoadingContent = useRef(false);

  // Debounced onUpdate: saves 300ms after the user stops typing
  const debouncedOnUpdate = useMemo(() => {
    if (!onUpdate) return undefined;
    return (content: Record<string, unknown>) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => {
        onUpdate(content);
      }, 300);
    };
  }, [onUpdate]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        codeBlock: false,
      }),
      Placeholder.configure({
        placeholder: "Type '/' for commands...",
      }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Image.configure({ inline: false }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { class: "editor-link" },
      }),
      Underline,
      Highlight.configure({ multicolor: true }),
      HorizontalRule,
      CodeBlockLowlight.configure({ lowlight }),
    ],
    content: content || {
      type: "doc",
      content: [{ type: "paragraph" }],
    },
    editable,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "ProseMirror focus:outline-none",
      },
    },
    onUpdate: ({ editor: ed }) => {
      if (isLoadingContent.current) return;
      const json = ed.getJSON() as Record<string, unknown>;
      lastSavedContent.current = JSON.stringify(json);
      debouncedOnUpdate?.(json);
    },
  });

  // Track the last content we saved to avoid echo updates
  const lastSavedContent = useRef<string>("");

  // Update editor when content arrives from server (initial load or from another tab)
  useEffect(() => {
    if (!editor || !content) return;

    const incomingJson = JSON.stringify(content);

    // Skip if this is the same content we just saved
    if (incomingJson === lastSavedContent.current) return;

    // Skip if editor already has this content
    const currentJson = JSON.stringify(editor.getJSON());
    if (incomingJson === currentJson) return;

    isLoadingContent.current = true;
    editor.commands.setContent(content);
    lastSavedContent.current = incomingJson;
    setTimeout(() => {
      isLoadingContent.current = false;
    }, 50);
  }, [editor, content]);

  // Slash command handling
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!editor) return;

      if (e.key === "/" && !slashMenuOpen) {
        // Check if we're at the start of a line or after a space
        const { from } = editor.state.selection;
        const textBefore = editor.state.doc.textBetween(
          Math.max(0, from - 1),
          from
        );
        if (from === 1 || textBefore === "" || textBefore === " " || textBefore === "\n") {
          setTimeout(() => {
            const coords = editor.view.coordsAtPos(from);
            const containerRect = editorContainerRef.current?.getBoundingClientRect();
            if (containerRect) {
              setSlashMenuPos({
                top: coords.bottom - containerRect.top + 4,
                left: coords.left - containerRect.left,
              });
            }
            slashRangeRef.current = { from, to: from + 1 };
            setSlashFilter("");
            setSlashMenuOpen(true);
          }, 10);
        }
      }
    },
    [editor, slashMenuOpen]
  );

  useEffect(() => {
    if (!editor) return;
    const dom = editor.view.dom;
    dom.addEventListener("keydown", handleKeyDown);
    return () => dom.removeEventListener("keydown", handleKeyDown);
  }, [editor, handleKeyDown]);

  // Track typing after slash for filtering
  useEffect(() => {
    if (!editor || !slashMenuOpen) return;

    const handler = () => {
      const range = slashRangeRef.current;
      if (!range) return;
      const { from } = editor.state.selection;
      if (from <= range.from) {
        setSlashMenuOpen(false);
        return;
      }
      const text = editor.state.doc.textBetween(range.from, from);
      if (!text.startsWith("/")) {
        setSlashMenuOpen(false);
        return;
      }
      setSlashFilter(text.slice(1));
    };

    editor.on("update", handler);
    return () => {
      editor.off("update", handler);
    };
  }, [editor, slashMenuOpen]);

  const handleSlashSelect = useCallback(
    (commandId: string) => {
      if (!editor || !slashRangeRef.current) return;

      const { from } = slashRangeRef.current;
      const currentPos = editor.state.selection.from;

      // Delete the slash text
      editor
        .chain()
        .focus()
        .deleteRange({ from: from, to: currentPos })
        .run();

      // Insert appropriate block
      switch (commandId) {
        case "heading1":
          editor.chain().focus().toggleHeading({ level: 1 }).run();
          break;
        case "heading2":
          editor.chain().focus().toggleHeading({ level: 2 }).run();
          break;
        case "heading3":
          editor.chain().focus().toggleHeading({ level: 3 }).run();
          break;
        case "todo":
          editor.chain().focus().toggleTaskList().run();
          break;
        case "bullet-list":
          editor.chain().focus().toggleBulletList().run();
          break;
        case "numbered-list":
          editor.chain().focus().toggleOrderedList().run();
          break;
        case "quote":
          editor.chain().focus().toggleBlockquote().run();
          break;
        case "code":
          editor.chain().focus().toggleCodeBlock().run();
          break;
        case "divider":
          editor.chain().focus().setHorizontalRule().run();
          break;
        case "image":
          // Open file picker to select an image
          fileInputRef.current?.click();
          break;
        case "callout":
          // Insert as a blockquote styled as callout
          editor.chain().focus().toggleBlockquote().run();
          break;
        default:
          break;
      }

      setSlashMenuOpen(false);
    },
    [editor]
  );

  // Handle image file selection
  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!editor) return;
      const file = e.target.files?.[0];
      if (!file) return;

      // Create a local object URL as preview
      const objectUrl = URL.createObjectURL(file);
      editor.chain().focus().setImage({ src: objectUrl, alt: file.name }).run();

      // Reset the input so the same file can be selected again
      e.target.value = "";
    },
    [editor]
  );

  // Floating "+" button on empty lines (like Notion)
  const [addButtonPos, setAddButtonPos] = useState<{ top: number } | null>(null);

  useEffect(() => {
    if (!editor || !editorContainerRef.current) return;

    const updateAddButton = () => {
      if (!editor || !editorContainerRef.current) return;

      const { $from } = editor.state.selection;
      const node = $from.parent;
      const isEmptyParagraph = node.type.name === "paragraph" && node.content.size === 0;

      if (isEmptyParagraph && editor.isFocused) {
        try {
          const pos = $from.before();
          const coords = editor.view.coordsAtPos(pos);
          const containerRect = editorContainerRef.current.getBoundingClientRect();
          setAddButtonPos({ top: coords.top - containerRect.top });
        } catch {
          setAddButtonPos(null);
        }
      } else {
        setAddButtonPos(null);
      }
    };

    editor.on("selectionUpdate", updateAddButton);
    editor.on("update", updateAddButton);
    editor.on("focus", updateAddButton);
    editor.on("blur", () => setAddButtonPos(null));

    return () => {
      editor.off("selectionUpdate", updateAddButton);
      editor.off("update", updateAddButton);
      editor.off("focus", updateAddButton);
      editor.off("blur", () => setAddButtonPos(null));
    };
  }, [editor]);

  const handleAddBlockClick = useCallback(() => {
    if (!editor || !editorContainerRef.current) return;
    const { from } = editor.state.selection;
    const coords = editor.view.coordsAtPos(from);
    const containerRect = editorContainerRef.current.getBoundingClientRect();
    setSlashMenuPos({
      top: coords.bottom - containerRect.top + 4,
      left: coords.left - containerRect.left,
    });
    slashRangeRef.current = { from, to: from };
    setSlashFilter("");
    setSlashMenuOpen(true);
  }, [editor]);

  if (!editor) return null;

  return (
    <div ref={editorContainerRef} className="relative">
      {/* Hidden file input for image uploads */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        aria-hidden="true"
      />
      {/* Floating + button on empty lines */}
      {addButtonPos && !slashMenuOpen && (
        <button
          onMouseDown={(e) => {
            e.preventDefault(); // Prevent editor blur
            handleAddBlockClick();
          }}
          className="absolute z-10 flex h-6 w-6 items-center justify-center rounded-md transition-all hover:bg-[rgba(128,128,128,0.15)]"
          style={{
            top: addButtonPos.top,
            left: 12,
            color: "var(--text-muted)",
          }}
          title="Add a block"
        >
          <Plus size={16} />
        </button>
      )}

      <EditorContent
        editor={editor}
        className="mx-auto max-w-3xl px-8 py-8"
      />

      {slashMenuOpen && (
        <SlashCommandMenu
          position={slashMenuPos}
          filter={slashFilter}
          onSelect={handleSlashSelect}
          onClose={() => setSlashMenuOpen(false)}
        />
      )}
    </div>
  );
}
