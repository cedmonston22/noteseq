export function parsePlainText(text: string): { title: string; content: Record<string, unknown> } {
  const lines = text.split("\n");
  const title = lines[0]?.trim() || "Imported Page";

  const content = lines.map(line => ({
    type: "paragraph" as const,
    content: line.trim() ? [{ type: "text", text: line }] : []
  }));

  return { title, content: { type: "doc", content } };
}
