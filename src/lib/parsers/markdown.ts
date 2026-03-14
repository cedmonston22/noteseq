// Parse markdown into TipTap-compatible JSON
export function parseMarkdown(markdown: string): Record<string, unknown> {
  const lines = markdown.split("\n");
  const content: Record<string, unknown>[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      content.push({ type: "paragraph" });
      continue;
    }

    // Headings
    const h1 = trimmed.match(/^# (.+)/);
    if (h1) { content.push({ type: "heading", attrs: { level: 1 }, content: [{ type: "text", text: h1[1] }] }); continue; }
    const h2 = trimmed.match(/^## (.+)/);
    if (h2) { content.push({ type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: h2[1] }] }); continue; }
    const h3 = trimmed.match(/^### (.+)/);
    if (h3) { content.push({ type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: h3[1] }] }); continue; }

    // Horizontal rule
    if (trimmed === "---" || trimmed === "***" || trimmed === "___") {
      content.push({ type: "horizontalRule" }); continue;
    }

    // Task list items
    const task = trimmed.match(/^- \[([ x])\] (.+)/);
    if (task) {
      content.push({
        type: "taskList",
        content: [{
          type: "taskItem",
          attrs: { checked: task[1] === "x" },
          content: [{ type: "paragraph", content: [{ type: "text", text: task[2] }] }]
        }]
      });
      continue;
    }

    // Bullet list items
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      content.push({
        type: "bulletList",
        content: [{
          type: "listItem",
          content: [{ type: "paragraph", content: [{ type: "text", text: trimmed.slice(2) }] }]
        }]
      });
      continue;
    }

    // Numbered list items
    const numbered = trimmed.match(/^\d+\. (.+)/);
    if (numbered) {
      content.push({
        type: "orderedList",
        content: [{
          type: "listItem",
          content: [{ type: "paragraph", content: [{ type: "text", text: numbered[1] }] }]
        }]
      });
      continue;
    }

    // Blockquote
    if (trimmed.startsWith("> ")) {
      content.push({
        type: "blockquote",
        content: [{ type: "paragraph", content: [{ type: "text", text: trimmed.slice(2) }] }]
      });
      continue;
    }

    // Code blocks (simplified — doesn't handle multiline fenced blocks perfectly)
    if (trimmed.startsWith("```")) {
      content.push({ type: "codeBlock", content: [{ type: "text", text: "" }] });
      continue;
    }

    // Inline formatting: parse **bold**, *italic*, `code`, ~~strikethrough~~
    const inlineContent = parseInlineFormatting(trimmed);
    content.push({ type: "paragraph", content: inlineContent });
  }

  return { type: "doc", content: content.length > 0 ? content : [{ type: "paragraph" }] };
}

function parseInlineFormatting(text: string): Record<string, unknown>[] {
  // Simple: just return as plain text for now
  // A full parser would handle **bold**, *italic*, `code`, etc.
  const result: Record<string, unknown>[] = [];

  // Handle bold
  const parts = text.split(/(\*\*[^*]+\*\*)/);
  for (const part of parts) {
    if (part.startsWith("**") && part.endsWith("**")) {
      result.push({ type: "text", text: part.slice(2, -2), marks: [{ type: "bold" }] });
    } else if (part) {
      result.push({ type: "text", text: part });
    }
  }

  return result.length > 0 ? result : [{ type: "text", text }];
}

export function extractTitle(markdown: string): string {
  const firstLine = markdown.split("\n")[0].trim();
  if (firstLine.startsWith("# ")) return firstLine.slice(2);
  return firstLine || "Imported Page";
}
