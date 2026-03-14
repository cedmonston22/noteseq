import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthenticatedUser } from "./auth.helpers";

export const getBacklinksForPage = query({
  args: { pageId: v.id("pages") },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    // Verify user has access to the page
    const page = await ctx.db.get(args.pageId);
    if (!page) throw new Error("Page not found");

    if (page.ownerId !== user._id) {
      const collab = await ctx.db
        .query("pageCollaborators")
        .withIndex("by_page", (q) => q.eq("pageId", args.pageId))
        .filter((q) => q.eq(q.field("userId"), user._id))
        .first();
      if (!collab) throw new Error("Not authorized");
    }

    const links = await ctx.db
      .query("backlinks")
      .withIndex("by_target", (q) => q.eq("targetPageId", args.pageId))
      .collect();

    const pages = await Promise.all(
      links.map(async (link) => {
        const sourcePage = await ctx.db.get(link.sourcePageId);
        return sourcePage ? { ...link, sourcePage } : null;
      })
    );
    return pages.filter(Boolean);
  },
});

export const syncBacklinks = mutation({
  args: {
    sourcePageId: v.id("pages"),
    targetPageIds: v.array(v.id("pages")),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    // Verify user has access to the source page
    const page = await ctx.db.get(args.sourcePageId);
    if (!page) throw new Error("Page not found");

    if (page.ownerId !== user._id) {
      const collab = await ctx.db
        .query("pageCollaborators")
        .withIndex("by_page", (q) => q.eq("pageId", args.sourcePageId))
        .filter((q) => q.eq(q.field("userId"), user._id))
        .first();
      if (!collab) throw new Error("Not authorized");
    }

    // Delete existing backlinks from this source
    const existing = await ctx.db
      .query("backlinks")
      .withIndex("by_source", (q) => q.eq("sourcePageId", args.sourcePageId))
      .collect();
    for (const link of existing) {
      await ctx.db.delete(link._id);
    }

    // Create new backlinks
    const now = Date.now();
    for (const targetId of args.targetPageIds) {
      if (targetId !== args.sourcePageId) {
        await ctx.db.insert("backlinks", {
          sourcePageId: args.sourcePageId,
          targetPageId: targetId,
          createdAt: now,
        });
      }
    }
  },
});

export const createBacklink = mutation({
  args: {
    sourcePageId: v.id("pages"),
    targetPageId: v.id("pages"),
    sourceBlockId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    if (args.sourcePageId === args.targetPageId) return;

    // Verify user has access to the source page
    const page = await ctx.db.get(args.sourcePageId);
    if (!page) throw new Error("Page not found");

    if (page.ownerId !== user._id) {
      const collab = await ctx.db
        .query("pageCollaborators")
        .withIndex("by_page", (q) => q.eq("pageId", args.sourcePageId))
        .filter((q) => q.eq(q.field("userId"), user._id))
        .first();
      if (!collab) throw new Error("Not authorized");
    }

    const existing = await ctx.db
      .query("backlinks")
      .withIndex("by_source", (q) => q.eq("sourcePageId", args.sourcePageId))
      .filter((q) => q.eq(q.field("targetPageId"), args.targetPageId))
      .first();
    if (existing) return existing._id;

    return await ctx.db.insert("backlinks", {
      sourcePageId: args.sourcePageId,
      targetPageId: args.targetPageId,
      sourceBlockId: args.sourceBlockId,
      createdAt: Date.now(),
    });
  },
});

export const deleteBacklinksForSource = mutation({
  args: { sourcePageId: v.id("pages") },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    // Verify user has access to the source page
    const page = await ctx.db.get(args.sourcePageId);
    if (!page) throw new Error("Page not found");

    if (page.ownerId !== user._id) {
      const collab = await ctx.db
        .query("pageCollaborators")
        .withIndex("by_page", (q) => q.eq("pageId", args.sourcePageId))
        .filter((q) => q.eq(q.field("userId"), user._id))
        .first();
      if (!collab) throw new Error("Not authorized");
    }

    const links = await ctx.db
      .query("backlinks")
      .withIndex("by_source", (q) => q.eq("sourcePageId", args.sourcePageId))
      .collect();
    for (const link of links) {
      await ctx.db.delete(link._id);
    }
  },
});
