// Simple HTML to TipTap JSON converter
export function parseHTML(html: string): { title: string; content: Record<string, unknown> } {
  // Use DOMParser to parse HTML
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const title = doc.querySelector("title")?.textContent || doc.querySelector("h1")?.textContent || "Imported Page";

  const blocks: Record<string, unknown>[] = [];
  const body = doc.body;

  for (const node of Array.from(body.children)) {
    const tag = node.tagName.toLowerCase();
    const text = node.textContent || "";

    if (tag === "h1") blocks.push({ type: "heading", attrs: { level: 1 }, content: [{ type: "text", text }] });
    else if (tag === "h2") blocks.push({ type: "heading", attrs: { level: 2 }, content: [{ type: "text", text }] });
    else if (tag === "h3") blocks.push({ type: "heading", attrs: { level: 3 }, content: [{ type: "text", text }] });
    else if (tag === "hr") blocks.push({ type: "horizontalRule" });
    else if (tag === "blockquote") blocks.push({ type: "blockquote", content: [{ type: "paragraph", content: [{ type: "text", text }] }] });
    else if (tag === "pre") blocks.push({ type: "codeBlock", content: [{ type: "text", text }] });
    else blocks.push({ type: "paragraph", content: [{ type: "text", text }] });
  }

  return { title, content: { type: "doc", content: blocks.length > 0 ? blocks : [{ type: "paragraph" }] } };
}
