import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  users: defineTable({
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    googleId: v.optional(v.string()),
    createdAt: v.optional(v.number()),
    // Fields required by @convex-dev/auth
    image: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
  })
    .index("email", ["email"])
    .index("by_googleId", ["googleId"])
    .index("phone", ["phone"]),

  pages: defineTable({
    title: v.string(),
    icon: v.optional(v.string()),
    ownerId: v.id("users"),
    isJournal: v.boolean(),
    journalDate: v.optional(v.string()),
    isShared: v.boolean(),
    content: v.optional(v.string()), // JSON-serialized TipTap content
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

  presence: defineTable({
    pageId: v.id("pages"),
    userId: v.id("users"),
    sessionId: v.string(),
    userName: v.string(),
    userColor: v.string(),
    cursor: v.optional(v.object({
      from: v.number(),
      to: v.number(),
    })),
    lastSeen: v.number(),
  })
    .index("by_page_session", ["pageId", "sessionId"]),

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
