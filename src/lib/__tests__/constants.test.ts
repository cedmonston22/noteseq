import { describe, it, expect } from "vitest";
import {
  APP_NAME,
  COLLAB_COLORS,
  CALLOUT_TYPES,
  SLASH_COMMANDS,
} from "@/lib/constants";

describe("APP_NAME", () => {
  it('is "noteseq"', () => {
    expect(APP_NAME).toBe("noteseq");
  });
});

describe("COLLAB_COLORS", () => {
  it("has exactly 8 items", () => {
    expect(COLLAB_COLORS).toHaveLength(8);
  });

  it("all items are valid hex color strings", () => {
    const hexRegex = /^#[0-9A-Fa-f]{6}$/;
    for (const color of COLLAB_COLORS) {
      expect(color).toMatch(hexRegex);
    }
  });
});

describe("CALLOUT_TYPES", () => {
  const expectedTypes = ["info", "warning", "success", "error"] as const;

  it("has all 4 types", () => {
    expect(Object.keys(CALLOUT_TYPES)).toHaveLength(4);
    for (const type of expectedTypes) {
      expect(CALLOUT_TYPES).toHaveProperty(type);
    }
  });

  it.each(expectedTypes)("%s has required properties", (type) => {
    const entry = CALLOUT_TYPES[type];
    expect(entry).toHaveProperty("color");
    expect(entry).toHaveProperty("bg");
    expect(entry).toHaveProperty("border");
    expect(entry).toHaveProperty("icon");
    expect(typeof entry.color).toBe("string");
    expect(typeof entry.bg).toBe("string");
    expect(typeof entry.border).toBe("string");
    expect(typeof entry.icon).toBe("string");
  });
});

describe("SLASH_COMMANDS", () => {
  const expectedIds = [
    "heading1",
    "heading2",
    "heading3",
    "paragraph",
    "bullet-list",
    "numbered-list",
    "todo",
    "divider",
    "quote",
    "code",
    "callout",
    "image",
  ];

  it("has all expected commands", () => {
    const ids = SLASH_COMMANDS.map((cmd) => cmd.id);
    for (const id of expectedIds) {
      expect(ids).toContain(id);
    }
  });

  it("each command has required fields", () => {
    for (const cmd of SLASH_COMMANDS) {
      expect(cmd).toHaveProperty("id");
      expect(cmd).toHaveProperty("label");
      expect(cmd).toHaveProperty("description");
      expect(cmd).toHaveProperty("icon");
      expect(cmd).toHaveProperty("category");
      expect(typeof cmd.id).toBe("string");
      expect(typeof cmd.label).toBe("string");
      expect(typeof cmd.description).toBe("string");
      expect(typeof cmd.icon).toBe("string");
      expect(typeof cmd.category).toBe("string");
    }
  });

  it("has 12 commands total", () => {
    expect(SLASH_COMMANDS).toHaveLength(12);
  });
});
