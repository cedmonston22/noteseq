export function contentToPlainText(content: Record<string, unknown>): string {
  if (!content || !content.content) return "";
  const nodes = content.content as Record<string, unknown>[];
  return nodes.map(nodeToText).join("\n");
}

function nodeToText(node: Record<string, unknown>): string {
  const type = node.type as string;
  const content = node.content as Record<string, unknown>[] | undefined;

  if (type === "horizontalRule") return "---";
  if (type === "heading" || type === "paragraph") return extractText(content);
  if (type === "bulletList" || type === "orderedList" || type === "taskList") {
    return (content || []).map(item => "  " + extractText((item.content as any))).join("\n");
  }
  if (type === "blockquote") return (content || []).map(c => "> " + nodeToText(c)).join("\n");
  if (type === "codeBlock") return extractText(content);
  return extractText(content);
}

function extractText(nodes: Record<string, unknown>[] | undefined): string {
  if (!nodes) return "";
  return nodes.map(n => {
    if (n.type === "text") return n.text as string;
    return nodeToText(n);
  }).join("");
}
