// Convert TipTap JSON content to Markdown
export function contentToMarkdown(content: Record<string, unknown>): string {
  if (!content || !content.content) return "";
  const nodes = content.content as Record<string, unknown>[];
  return nodes.map(nodeToMarkdown).join("\n\n");
}

function nodeToMarkdown(node: Record<string, unknown>): string {
  const type = node.type as string;
  const content = node.content as Record<string, unknown>[] | undefined;
  const attrs = node.attrs as Record<string, unknown> | undefined;

  switch (type) {
    case "heading": {
      const level = (attrs?.level as number) || 1;
      const prefix = "#".repeat(level);
      return `${prefix} ${inlineToMarkdown(content)}`;
    }
    case "paragraph":
      return inlineToMarkdown(content);
    case "bulletList":
      return (content || []).map(item => `- ${nodeContentToMarkdown(item)}`).join("\n");
    case "orderedList":
      return (content || []).map((item, i) => `${i + 1}. ${nodeContentToMarkdown(item)}`).join("\n");
    case "taskList":
      return (content || []).map(item => {
        const checked = (item.attrs as any)?.checked ? "x" : " ";
        return `- [${checked}] ${nodeContentToMarkdown(item)}`;
      }).join("\n");
    case "blockquote":
      return (content || []).map(c => `> ${nodeToMarkdown(c)}`).join("\n");
    case "codeBlock":
      return "```\n" + inlineToMarkdown(content) + "\n```";
    case "horizontalRule":
      return "---";
    case "image":
      return `![${attrs?.alt || ""}](${attrs?.src || ""})`;
    default:
      return inlineToMarkdown(content);
  }
}

function nodeContentToMarkdown(node: Record<string, unknown>): string {
  const content = node.content as Record<string, unknown>[] | undefined;
  if (!content) return "";
  return content.map(nodeToMarkdown).join("");
}

function inlineToMarkdown(nodes: Record<string, unknown>[] | undefined): string {
  if (!nodes) return "";
  return nodes.map(node => {
    if (node.type === "text") {
      let text = node.text as string;
      const marks = node.marks as { type: string }[] | undefined;
      if (marks) {
        for (const mark of marks) {
          if (mark.type === "bold") text = `**${text}**`;
          if (mark.type === "italic") text = `*${text}*`;
          if (mark.type === "code") text = `\`${text}\``;
          if (mark.type === "strike") text = `~~${text}~~`;
        }
      }
      return text;
    }
    return nodeToMarkdown(node);
  }).join("");
}
