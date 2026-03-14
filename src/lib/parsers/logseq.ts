// Parse Logseq-style markdown (outliner with "- " bullets)
export function parseLogseq(content: string): { title: string; content: Record<string, unknown> } {
  const lines = content.split("\n");
  let title = "Imported Page";
  const blocks: Record<string, unknown>[] = [];

  for (const line of lines) {
    // Title line (first line or lines starting without -)
    if (!line.startsWith("- ") && !line.startsWith("\t") && !line.startsWith("  ") && line.trim()) {
      if (title === "Imported Page") title = line.trim();
      continue;
    }

    const trimmed = line.replace(/^[\t ]*- /, "");
    if (!trimmed) continue;

    // Convert [[page refs]] to plain text (we could link these later)
    const cleaned = trimmed.replace(/\[\[([^\]]+)\]\]/g, "$1");

    // Task items
    const task = cleaned.match(/^(TODO|DONE) (.+)/);
    if (task) {
      blocks.push({
        type: "taskList",
        content: [{
          type: "taskItem",
          attrs: { checked: task[1] === "DONE" },
          content: [{ type: "paragraph", content: [{ type: "text", text: task[2] }] }]
        }]
      });
      continue;
    }

    blocks.push({
      type: "paragraph",
      content: [{ type: "text", text: cleaned }]
    });
  }

  return {
    title,
    content: { type: "doc", content: blocks.length > 0 ? blocks : [{ type: "paragraph" }] }
  };
}
