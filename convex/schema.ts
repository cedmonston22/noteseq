import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    avatarUrl: v.optional(v.string()),
    googleId: v.string(),
    createdAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_googleId", ["googleId"]),

  pages: defineTable({
    title: v.string(),
    icon: v.optional(v.string()),
    ownerId: v.id("users"),
    isJournal: v.boolean(),
    journalDate: v.optional(v.string()),
    isShared: v.boolean(),
    yjsState: v.optional(v.bytes()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_owner", ["ownerId"])
    .index("by_journal", ["ownerId", "isJournal", "journalDate"])
    .index("by_updated", ["updatedAt"]),

  pageCollaborators: defineTable({
    pageId: v.id("pages"),
    userId: v.id("users"),
    invitedBy: v.id("users"),
    addedAt: v.number(),
  })
    .index("by_page", ["pageId"])
    .index("by_user", ["userId"]),

  backlinks: defineTable({
    sourcePageId: v.id("pages"),
    targetPageId: v.id("pages"),
    sourceBlockId: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_target", ["targetPageId"])
    .index("by_source", ["sourcePageId"]),

  files: defineTable({
    storageId: v.id("_storage"),
    uploadedBy: v.id("users"),
    pageId: v.id("pages"),
    filename: v.string(),
    mimeType: v.string(),
    size: v.number(),
    createdAt: v.number(),
  }).index("by_page", ["pageId"]),
});
