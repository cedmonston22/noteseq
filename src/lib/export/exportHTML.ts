export function contentToHTML(content: Record<string, unknown>, title: string): string {
  const bodyHTML = nodesToHTML(content.content as Record<string, unknown>[] || []);
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHTML(title)}</title>
  <style>
    body { font-family: -apple-system, sans-serif; max-width: 720px; margin: 40px auto; padding: 0 20px; color: #1a1a22; line-height: 1.6; }
    h1, h2, h3 { margin-top: 1.5em; }
    code { background: #f0f0f2; padding: 2px 6px; border-radius: 3px; font-size: 0.9em; }
    pre { background: #f0f0f2; padding: 16px; border-radius: 8px; overflow-x: auto; }
    blockquote { border-left: 3px solid #D4A843; padding-left: 16px; color: #5a5a6e; }
    hr { border: none; border-top: 1px solid #e0e0e0; margin: 24px 0; }
    img { max-width: 100%; border-radius: 8px; }
  </style>
</head>
<body>
  <h1>${escapeHTML(title)}</h1>
  ${bodyHTML}
</body>
</html>`;
}

function nodesToHTML(nodes: Record<string, unknown>[]): string {
  return nodes.map(nodeToHTML).join("\n");
}

function nodeToHTML(node: Record<string, unknown>): string {
  const type = node.type as string;
  const content = node.content as Record<string, unknown>[] | undefined;
  const attrs = node.attrs as Record<string, unknown> | undefined;

  switch (type) {
    case "heading": {
      const level = (attrs?.level as number) || 1;
      return `<h${level}>${inlineToHTML(content)}</h${level}>`;
    }
    case "paragraph":
      return `<p>${inlineToHTML(content)}</p>`;
    case "bulletList":
      return `<ul>${(content || []).map(item => `<li>${nodeContentToHTML(item)}</li>`).join("")}</ul>`;
    case "orderedList":
      return `<ol>${(content || []).map(item => `<li>${nodeContentToHTML(item)}</li>`).join("")}</ol>`;
    case "taskList":
      return `<ul style="list-style:none;padding-left:0">${(content || []).map(item => {
        const checked = (item.attrs as any)?.checked;
        return `<li><input type="checkbox" ${checked ? "checked" : ""} disabled> ${nodeContentToHTML(item)}</li>`;
      }).join("")}</ul>`;
    case "blockquote":
      return `<blockquote>${nodesToHTML(content || [])}</blockquote>`;
    case "codeBlock":
      return `<pre><code>${escapeHTML(inlineToHTML(content))}</code></pre>`;
    case "horizontalRule":
      return "<hr>";
    case "image":
      return `<img src="${escapeHTML(String(attrs?.src || ""))}" alt="${escapeHTML(String(attrs?.alt || ""))}" />`;
    default:
      return inlineToHTML(content);
  }
}

function nodeContentToHTML(node: Record<string, unknown>): string {
  const content = node.content as Record<string, unknown>[] | undefined;
  if (!content) return "";
  return content.map(nodeToHTML).join("");
}

function inlineToHTML(nodes: Record<string, unknown>[] | undefined): string {
  if (!nodes) return "";
  return nodes.map(node => {
    if (node.type === "text") {
      let text = escapeHTML(node.text as string);
      const marks = node.marks as { type: string }[] | undefined;
      if (marks) {
        for (const mark of marks) {
          if (mark.type === "bold") text = `<strong>${text}</strong>`;
          if (mark.type === "italic") text = `<em>${text}</em>`;
          if (mark.type === "code") text = `<code>${text}</code>`;
          if (mark.type === "strike") text = `<s>${text}</s>`;
          if (mark.type === "underline") text = `<u>${text}</u>`;
        }
      }
      return text;
    }
    return nodeToHTML(node);
  }).join("");
}

function escapeHTML(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
