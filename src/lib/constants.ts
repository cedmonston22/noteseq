export const APP_NAME = "noteseq";

export const MAX_TITLE_LENGTH = 100;

export const DEBOUNCE_MS = 1500;

export const COLLAB_COLORS = [
  "#6366F1",
  "#EC4899",
  "#10B981",
  "#F59E0B",
  "#3B82F6",
  "#8B5CF6",
  "#EF4444",
  "#14B8A6",
] as const;

export const CALLOUT_TYPES = {
  info: {
    color: "#3B82F6",
    bg: "rgba(59, 130, 246, 0.1)",
    border: "rgba(59, 130, 246, 0.3)",
    icon: "Info",
  },
  warning: {
    color: "#F59E0B",
    bg: "rgba(245, 158, 11, 0.1)",
    border: "rgba(245, 158, 11, 0.3)",
    icon: "AlertTriangle",
  },
  success: {
    color: "#10B981",
    bg: "rgba(16, 185, 129, 0.1)",
    border: "rgba(16, 185, 129, 0.3)",
    icon: "CheckCircle",
  },
  error: {
    color: "#EF4444",
    bg: "rgba(239, 68, 68, 0.1)",
    border: "rgba(239, 68, 68, 0.3)",
    icon: "XCircle",
  },
} as const;

export type CalloutType = keyof typeof CALLOUT_TYPES;

export interface SlashCommand {
  id: string;
  label: string;
  description: string;
  icon: string;
  category: string;
}

export const SLASH_COMMANDS: SlashCommand[] = [
  {
    id: "heading1",
    label: "Heading 1",
    description: "Large section heading",
    icon: "Heading1",
    category: "Basic Blocks",
  },
  {
    id: "heading2",
    label: "Heading 2",
    description: "Medium section heading",
    icon: "Heading2",
    category: "Basic Blocks",
  },
  {
    id: "heading3",
    label: "Heading 3",
    description: "Small section heading",
    icon: "Heading3",
    category: "Basic Blocks",
  },
  {
    id: "paragraph",
    label: "Text",
    description: "Plain text block",
    icon: "Type",
    category: "Basic Blocks",
  },
  {
    id: "bullet-list",
    label: "Bullet List",
    description: "Unordered list",
    icon: "List",
    category: "Basic Blocks",
  },
  {
    id: "numbered-list",
    label: "Numbered List",
    description: "Ordered list",
    icon: "ListOrdered",
    category: "Basic Blocks",
  },
  {
    id: "todo",
    label: "To-do",
    description: "Task checkbox",
    icon: "CheckSquare",
    category: "Basic Blocks",
  },
  {
    id: "divider",
    label: "Divider",
    description: "Horizontal rule",
    icon: "Minus",
    category: "Basic Blocks",
  },
  {
    id: "quote",
    label: "Quote",
    description: "Blockquote",
    icon: "Quote",
    category: "Basic Blocks",
  },
  {
    id: "code",
    label: "Code Block",
    description: "Syntax-highlighted code",
    icon: "Code",
    category: "Advanced",
  },
  {
    id: "callout",
    label: "Callout",
    description: "Highlighted info box",
    icon: "AlertCircle",
    category: "Advanced",
  },
  {
    id: "image",
    label: "Image",
    description: "Upload or embed image",
    icon: "Image",
    category: "Media",
  },
  {
    id: "import",
    label: "Import",
    description: "Import from file",
    icon: "Upload",
    category: "Advanced",
  },
];
