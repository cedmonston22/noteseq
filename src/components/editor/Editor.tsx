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
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import { Extension, InputRule } from "@tiptap/core";
import { common, createLowlight } from "lowlight";
import * as Y from "yjs";
import type YPartyKitProvider from "y-partykit/provider";
import SlashCommandMenu from "./SlashCommandMenu";
import BacklinkSuggestion from "./BacklinkSuggestion";
import { CalendarNode } from "./CalendarExtension";
import { ChartNode } from "./ChartExtension";

const lowlight = createLowlight(common);

/**
 * Input rule: typing `[] ` at the start of a line converts to an unchecked task item.
 * Typing `[x] ` converts to a checked task item.
 */
const TaskListInputRuleExtension = Extension.create({
  name: "taskListInputRule",
  addInputRules() {
    return [
      new InputRule({
        find: /^\[( |x)?\]\s$/,
        handler: ({ state, range, match }) => {
          const checked = match[1] === "x";
          const { tr } = state;

          // Delete the typed text
          tr.delete(range.from, range.to);

          // Check if we can convert the current node to a task list
          const $from = tr.selection.$from;
          const node = $from.parent;

          if (node.type.name === "paragraph" && node.content.size === 0) {
            const taskItemType = state.schema.nodes.taskItem;
            const taskListType = state.schema.nodes.taskList;

            if (taskItemType && taskListType) {
              const taskItem = taskItemType.create(
                { checked },
                state.schema.nodes.paragraph.create()
              );
              const taskList = taskListType.create(null, taskItem);

              // Replace the parent paragraph (or list item) with a task list
              const pos = $from.before($from.depth);
              const end = $from.after($from.depth);
              tr.replaceWith(pos, end, taskList);
            }
          }
        },
      }),
    ];
  },
});

interface EditorProps {
  content?: Record<string, unknown>;
  onUpdate?: (content: Record<string, unknown>) => void;
  editable?: boolean;
  pageId?: string;
  yjsDoc?: Y.Doc | null;
  yjsProvider?: YPartyKitProvider | null;
  yjsSynced?: boolean;
  userName?: string;
  userColor?: string;
}

export default function NoteEditor({
  content,
  onUpdate,
  editable = true,
  pageId,
  yjsDoc,
  yjsProvider,
  yjsSynced,
  userName,
  userColor,
}: EditorProps) {
  const [slashMenuOpen, setSlashMenuOpen] = useState(false);
  const [slashMenuPos, setSlashMenuPos] = useState({ top: 0, left: 0 });
  const [slashFilter, setSlashFilter] = useState("");
  const slashRangeRef = useRef<{ from: number; to: number } | null>(null);

  // Backlink suggestion state
  const [backlinkMenuOpen, setBacklinkMenuOpen] = useState(false);
  const [backlinkMenuPos, setBacklinkMenuPos] = useState({ top: 0, left: 0 });
  const [backlinkFilter, setBacklinkFilter] = useState("");
  const backlinkRangeRef = useRef<{ from: number } | null>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLoadingContent = useRef(false);
  const hasReceivedServerContent = useRef(!!content);
  const hasInitializedYjs = useRef(false);

  const isCollaborative = !!yjsDoc && !!yjsProvider;

  // Debounced onUpdate: saves after the user stops typing
  const debouncedOnUpdate = useMemo(() => {
    if (!onUpdate) return undefined;
    // When using Yjs, debounce more aggressively since Yjs handles real-time sync
    const delay = isCollaborative ? 2000 : 300;
    return (content: Record<string, unknown>) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => {
        onUpdate(content);
      }, delay);
    };
  }, [onUpdate, isCollaborative]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Build extensions list
  const extensions = useMemo(() => {
    const exts = [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        codeBlock: false,
        horizontalRule: false,
      }),
      Placeholder.configure({
        placeholder: "Type '/' for commands...",
      }),
      TaskList.configure({
        HTMLAttributes: { class: "task-list" },
      }),
      TaskItem.configure({
        nested: false,
        HTMLAttributes: { class: "task-item" },
      }),
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
      TaskListInputRuleExtension,
      CalendarNode,
      ChartNode,
    ];

    if (isCollaborative) {
      exts.push(
        Collaboration.configure({
          document: yjsDoc!,
        }) as typeof exts[number]
      );
      exts.push(
        CollaborationCursor.configure({
          provider: yjsProvider!,
          user: {
            name: userName || "Anonymous",
            color: userColor || "#D4A843",
          },
        }) as typeof exts[number]
      );
    }

    return exts;
  }, [isCollaborative, yjsDoc, yjsProvider, userName, userColor]);

  const editor = useEditor({
    extensions,
    // When using Yjs, don't pass content — Yjs is the source of truth.
    // Content will be initialized from Convex after sync if the Yjs doc is empty.
    content: isCollaborative
      ? undefined
      : content || { type: "doc", content: [{ type: "paragraph" }] },
    editable,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "ProseMirror focus:outline-none",
      },
    },
    onUpdate: ({ editor: ed }) => {
      if (isLoadingContent.current) return;
      if (!isCollaborative && !hasReceivedServerContent.current) return;
      const json = ed.getJSON() as Record<string, unknown>;
      lastSavedContent.current = JSON.stringify(json);
      debouncedOnUpdate?.(json);
    },
  });

  // Track the last content we saved to avoid echo updates
  const lastSavedContent = useRef<string>("");

  // Initialize Yjs doc from Convex content after sync (only if Yjs doc is empty)
  useEffect(() => {
    if (!isCollaborative || !yjsSynced || !editor || hasInitializedYjs.current)
      return;

    // Check if the Yjs fragment has content
    const fragment = yjsDoc!.getXmlFragment("default");
    const isEmpty = fragment.length === 0;

    if (!isEmpty) {
      // Yjs doc already has content from server — no initialization needed
      hasInitializedYjs.current = true;
      return;
    }

    if (content) {
      // Yjs doc is empty — initialize from Convex content
      hasInitializedYjs.current = true;
      isLoadingContent.current = true;
      editor.commands.setContent(content);
      lastSavedContent.current = JSON.stringify(content);
      setTimeout(() => {
        isLoadingContent.current = false;
      }, 100);
    }
    // If Yjs is empty AND content hasn't loaded yet, don't mark initialized.
    // The effect will re-run when content arrives from Convex.
  }, [isCollaborative, yjsSynced, editor, content, yjsDoc]);

  // For NON-collaborative mode: update editor when content arrives from server
  useEffect(() => {
    if (isCollaborative) return;
    if (!editor || !content) return;

    const incomingJson = JSON.stringify(content);

    // Skip if this is the same content we just saved
    if (incomingJson === lastSavedContent.current) return;

    // Skip if editor already has this content
    const currentJson = JSON.stringify(editor.getJSON());
    if (incomingJson === currentJson) return;

    isLoadingContent.current = true;
    hasReceivedServerContent.current = true;
    editor.commands.setContent(content);
    lastSavedContent.current = incomingJson;
    setTimeout(() => {
      isLoadingContent.current = false;
    }, 50);
  }, [editor, content, isCollaborative]);

  // Slash command and backlink handling
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!editor) return;

      // Detect `[` to potentially start a backlink `[[`
      if (e.key === "[" && !backlinkMenuOpen && !slashMenuOpen) {
        const { from } = editor.state.selection;
        const textBefore = editor.state.doc.textBetween(
          Math.max(0, from - 1),
          from
        );
        if (textBefore === "[") {
          // User just typed the second `[` — open backlink menu
          setTimeout(() => {
            const coords = editor.view.coordsAtPos(from);
            const containerRect = editorContainerRef.current?.getBoundingClientRect();
            if (containerRect) {
              setBacklinkMenuPos({
                top: coords.bottom - containerRect.top + 4,
                left: coords.left - containerRect.left,
              });
            }
            // from - 1 is the position of the first `[`, from + 1 will be after the second `[`
            backlinkRangeRef.current = { from: from - 1 };
            setBacklinkFilter("");
            setBacklinkMenuOpen(true);
          }, 10);
          return;
        }
      }

      if (e.key === "/" && !slashMenuOpen && !backlinkMenuOpen) {
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
    [editor, slashMenuOpen, backlinkMenuOpen]
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

  // Track typing after `[[` for backlink filtering
  useEffect(() => {
    if (!editor || !backlinkMenuOpen) return;

    const handler = () => {
      const range = backlinkRangeRef.current;
      if (!range) return;
      const { from } = editor.state.selection;
      // Cursor moved before the `[[` start
      if (from <= range.from + 2) {
        setBacklinkMenuOpen(false);
        return;
      }
      const text = editor.state.doc.textBetween(range.from, from);
      if (!text.startsWith("[[")) {
        setBacklinkMenuOpen(false);
        return;
      }
      const query = text.slice(2);
      // If user typed `]]`, close the menu
      if (query.endsWith("]]")) {
        setBacklinkMenuOpen(false);
        return;
      }
      setBacklinkFilter(query);
    };

    editor.on("update", handler);
    return () => {
      editor.off("update", handler);
    };
  }, [editor, backlinkMenuOpen]);

  // Handle backlink page selection
  const handleBacklinkSelect = useCallback(
    (pageId: string, pageTitle: string) => {
      if (!editor || !backlinkRangeRef.current) return;

      const bracketStart = backlinkRangeRef.current.from;
      const currentPos = editor.state.selection.from;

      editor
        .chain()
        .focus()
        .deleteRange({ from: bracketStart, to: currentPos })
        .insertContent({
          type: "text",
          text: pageTitle,
          marks: [
            {
              type: "link",
              attrs: { href: `/p/${pageId}`, class: "backlink-ref" },
            },
          ],
        })
        .run();

      setBacklinkMenuOpen(false);
    },
    [editor]
  );

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
        case "highlight":
          editor.chain().focus().toggleHighlight().run();
          break;
        case "table-of-contents": {
          // Collect headings from the document and insert as a linked list
          const headings: string[] = [];
          editor.state.doc.descendants((node) => {
            if (node.type.name === "heading" && node.textContent) {
              const level = node.attrs.level as number;
              const indent = level > 1 ? "\u00A0\u00A0".repeat(level - 1) : "";
              headings.push(`${indent}${node.textContent}`);
            }
          });
          const tocText = headings.length > 0 ? headings.join("\n") : "No headings found yet";
          editor
            .chain()
            .focus()
            .insertContent([
              { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Table of Contents" }] },
              { type: "paragraph", content: [{ type: "text", text: tocText }] },
              { type: "horizontalRule" },
            ])
            .run();
          break;
        }
        case "date": {
          const today = new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
          editor.chain().focus().insertContent(today).run();
          break;
        }
        case "time": {
          const now = new Date().toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          });
          editor.chain().focus().insertContent(now).run();
          break;
        }
        case "emoji":
          editor.chain().focus().insertContent("\u{1F60A}").run();
          break;
        case "calendar-block":
          editor.chain().focus().insertContent({ type: "calendarBlock" }).run();
          break;
        case "chart-block":
          editor.chain().focus().insertContent({ type: "chartBlock" }).run();
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

  // Close slash menu when clicking outside
  useEffect(() => {
    if (!slashMenuOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".slash-menu")) {
        setSlashMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [slashMenuOpen]);

  // Close backlink menu when clicking outside
  useEffect(() => {
    if (!backlinkMenuOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".slash-menu")) {
        setBacklinkMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [backlinkMenuOpen]);

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

      {backlinkMenuOpen && (
        <BacklinkSuggestion
          position={backlinkMenuPos}
          query={backlinkFilter}
          onSelect={handleBacklinkSelect}
          onClose={() => setBacklinkMenuOpen(false)}
        />
      )}
    </div>
  );
}
