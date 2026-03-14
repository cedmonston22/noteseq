import JSZip from "jszip";
import { parseMarkdown, extractTitle } from "./markdown";

interface ImportedPage {
  title: string;
  content: Record<string, unknown>;
}

/**
 * Parse a Notion export .zip file.
 * Notion exports contain markdown files, sometimes in folders.
 * Each .md file becomes a page.
 */
export async function parseNotionZip(file: File): Promise<ImportedPage[]> {
  const zip = await JSZip.loadAsync(file);
  const pages: ImportedPage[] = [];

  const entries = Object.entries(zip.files);

  for (const [path, zipEntry] of entries) {
    // Skip directories and non-markdown files
    if (zipEntry.dir) continue;
    if (!path.endsWith(".md") && !path.endsWith(".csv")) continue;
    if (path.endsWith(".csv")) continue; // Skip CSV files from Notion databases

    try {
      const text = await zipEntry.async("text");

      // Notion filenames often have a hash suffix like "Page Name abc123def.md"
      // Extract a clean title from the filename
      const filename = path.split("/").pop() || path;
      const cleanFilename = filename
        .replace(/\.md$/, "")
        .replace(/\s+[a-f0-9]{32}$/, "") // Remove Notion's 32-char hash
        .replace(/\s+[a-f0-9]{8,}$/, "") // Remove shorter hashes
        .trim();

      // Try to get title from content first, fall back to filename
      const contentTitle = extractTitle(text);
      const title = contentTitle !== "Imported Page" ? contentTitle : cleanFilename || "Imported Page";

      const content = parseMarkdown(text);
      pages.push({ title, content });
    } catch {
      // Skip files that can't be parsed
    }
  }

  return pages;
}
