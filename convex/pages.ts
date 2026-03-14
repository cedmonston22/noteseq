import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import {
  getAuthenticatedUser,
  getOptionalUser,
  validateEmail,
  validateStringLength,
} from "./auth.helpers";

const MAX_TITLE_LENGTH = 100;

export const getPage = query({
  args: { pageId: v.id("pages") },
  handler: async (ctx, args) => {
    const user = await getOptionalUser(ctx);
    if (!user) return null;
    const page = await ctx.db.get(args.pageId);
    if (!page) return null;

    if (page.ownerId === user._id) return page;

    const collab = await ctx.db
      .query("pageCollaborators")
      .withIndex("by_page", (q) => q.eq("pageId", args.pageId))
      .filter((q) => q.eq(q.field("userId"), user._id))
      .first();

    if (collab) return page;
    return null;
  },
});

export const getUserPages = query({
  args: {},
  handler: async (ctx) => {
    const user = await getOptionalUser(ctx);
    if (!user) return [];
    return await ctx.db
      .query("pages")
      .withIndex("by_owner", (q) => q.eq("ownerId", user._id))
      .filter((q) =>
        q.and(
          q.eq(q.field("isJournal"), false),
          q.neq(q.field("isDeleted"), true)
        )
      )
      .collect();
  },
});

export const getSharedPages = query({
  args: {},
  handler: async (ctx) => {
    const user = await getOptionalUser(ctx);
    if (!user) return [];
    const collabs = await ctx.db
      .query("pageCollaborators")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.neq(q.field("status"), "pending"))
      .collect();

    const pages = await Promise.all(
      collabs.map((c) => ctx.db.get(c.pageId))
    );
    return pages.filter(Boolean);
  },
});

export const getJournalPage = query({
  args: { date: v.string() },
  handler: async (ctx, args) => {
    const user = await getOptionalUser(ctx);
    if (!user) return null;
    return await ctx.db
      .query("pages")
      .withIndex("by_journal", (q) =>
        q.eq("ownerId", user._id).eq("isJournal", true).eq("journalDate", args.date)
      )
      .first();
  },
});

export const getJournalPages = query({
  args: {},
  handler: async (ctx) => {
    const user = await getOptionalUser(ctx);
    if (!user) return [];
    return await ctx.db
      .query("pages")
      .withIndex("by_owner", (q) => q.eq("ownerId", user._id))
      .filter((q) => q.eq(q.field("isJournal"), true))
      .collect();
  },
});

export const createPage = mutation({
  args: {
    title: v.string(),
    icon: v.optional(v.string()),
    isJournal: v.boolean(),
    journalDate: v.optional(v.string()),
    folderId: v.optional(v.id("folders")),
    content: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    validateStringLength(args.title, MAX_TITLE_LENGTH, "Title");

    const now = Date.now();
    return await ctx.db.insert("pages", {
      title: args.title,
      icon: args.icon,
      ownerId: user._id,
      folderId: args.folderId,
      isJournal: args.isJournal,
      journalDate: args.journalDate,
      isShared: false,
      content: args.content,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const createJournalIfNotExists = mutation({
  args: { date: v.string(), title: v.string() },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    validateStringLength(args.title, MAX_TITLE_LENGTH, "Title");

    const existing = await ctx.db
      .query("pages")
      .withIndex("by_journal", (q) =>
        q.eq("ownerId", user._id).eq("isJournal", true).eq("journalDate", args.date)
      )
      .first();

    if (existing) return existing._id;

    const now = Date.now();
    return await ctx.db.insert("pages", {
      title: args.title,
      ownerId: user._id,
      isJournal: true,
      journalDate: args.date,
      isShared: false,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updatePage = mutation({
  args: {
    pageId: v.id("pages"),
    title: v.optional(v.string()),
    icon: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    const page = await ctx.db.get(args.pageId);
    if (!page) throw new Error("Page not found");

    // Check ownership or collaborator access
    if (page.ownerId !== user._id) {
      const collab = await ctx.db
        .query("pageCollaborators")
        .withIndex("by_page", (q) => q.eq("pageId", args.pageId))
        .filter((q) => q.eq(q.field("userId"), user._id))
        .first();
      if (!collab) throw new Error("Not authorized");
    }

    if (args.title !== undefined) {
      validateStringLength(args.title, MAX_TITLE_LENGTH, "Title");
    }

    const updates: Record<string, unknown> = { updatedAt: Date.now() };
    if (args.title !== undefined) updates.title = args.title;
    if (args.icon !== undefined) updates.icon = args.icon;
    await ctx.db.patch(args.pageId, updates);
  },
});

export const deletePage = mutation({
  args: { pageId: v.id("pages") },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    const page = await ctx.db.get(args.pageId);
    if (!page) throw new Error("Page not found");
    if (page.ownerId !== user._id) throw new Error("Not authorized — only the owner can delete");

    // Soft delete — move to trash
    await ctx.db.patch(args.pageId, {
      isDeleted: true,
      deletedAt: Date.now(),
    });
  },
});

export const getTrashPages = query({
  args: {},
  handler: async (ctx) => {
    const user = await getOptionalUser(ctx);
    if (!user) return [];
    const pages = await ctx.db
      .query("pages")
      .withIndex("by_owner", (q) => q.eq("ownerId", user._id))
      .filter((q) => q.eq(q.field("isDeleted"), true))
      .collect();
    // Sort by deletedAt descending
    return pages.sort((a, b) => (b.deletedAt ?? 0) - (a.deletedAt ?? 0));
  },
});

export const restorePage = mutation({
  args: { pageId: v.id("pages") },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    const page = await ctx.db.get(args.pageId);
    if (!page) throw new Error("Page not found");
    if (page.ownerId !== user._id) throw new Error("Not authorized");

    await ctx.db.patch(args.pageId, {
      isDeleted: false,
      deletedAt: undefined,
    });
  },
});

export const permanentlyDeletePage = mutation({
  args: { pageId: v.id("pages") },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    const page = await ctx.db.get(args.pageId);
    if (!page) throw new Error("Page not found");
    if (page.ownerId !== user._id) throw new Error("Not authorized — only the owner can delete");

    // Delete collaborators
    const collabs = await ctx.db
      .query("pageCollaborators")
      .withIndex("by_page", (q) => q.eq("pageId", args.pageId))
      .collect();
    for (const c of collabs) await ctx.db.delete(c._id);

    // Delete backlinks
    const sourceLinks = await ctx.db
      .query("backlinks")
      .withIndex("by_source", (q) => q.eq("sourcePageId", args.pageId))
      .collect();
    for (const l of sourceLinks) await ctx.db.delete(l._id);

    const targetLinks = await ctx.db
      .query("backlinks")
      .withIndex("by_target", (q) => q.eq("targetPageId", args.pageId))
      .collect();
    for (const l of targetLinks) await ctx.db.delete(l._id);

    await ctx.db.delete(args.pageId);
  },
});

export const emptyTrash = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await getAuthenticatedUser(ctx);
    const trashedPages = await ctx.db
      .query("pages")
      .withIndex("by_owner", (q) => q.eq("ownerId", user._id))
      .filter((q) => q.eq(q.field("isDeleted"), true))
      .collect();

    for (const page of trashedPages) {
      // Delete collaborators
      const collabs = await ctx.db
        .query("pageCollaborators")
        .withIndex("by_page", (q) => q.eq("pageId", page._id))
        .collect();
      for (const c of collabs) await ctx.db.delete(c._id);

      // Delete backlinks
      const sourceLinks = await ctx.db
        .query("backlinks")
        .withIndex("by_source", (q) => q.eq("sourcePageId", page._id))
        .collect();
      for (const l of sourceLinks) await ctx.db.delete(l._id);

      const targetLinks = await ctx.db
        .query("backlinks")
        .withIndex("by_target", (q) => q.eq("targetPageId", page._id))
        .collect();
      for (const l of targetLinks) await ctx.db.delete(l._id);

      await ctx.db.delete(page._id);
    }
  },
});

export const updateYjsState = mutation({
  args: { pageId: v.id("pages"), yjsState: v.bytes() },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    const page = await ctx.db.get(args.pageId);
    if (!page) throw new Error("Page not found");

    // Check ownership or collaborator access
    if (page.ownerId !== user._id) {
      const collab = await ctx.db
        .query("pageCollaborators")
        .withIndex("by_page", (q) => q.eq("pageId", args.pageId))
        .filter((q) => q.eq(q.field("userId"), user._id))
        .first();
      if (!collab) throw new Error("Not authorized");
    }

    await ctx.db.patch(args.pageId, {
      yjsState: args.yjsState,
      updatedAt: Date.now(),
    });
  },
});

export const updateContent = mutation({
  args: { pageId: v.id("pages"), content: v.string() },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    const page = await ctx.db.get(args.pageId);
    if (!page) throw new Error("Page not found");

    // Check access
    if (page.ownerId !== user._id) {
      const collab = await ctx.db
        .query("pageCollaborators")
        .withIndex("by_page", (q) => q.eq("pageId", args.pageId))
        .filter((q) => q.eq(q.field("userId"), user._id))
        .first();
      if (!collab) throw new Error("Not authorized");
    }

    await ctx.db.patch(args.pageId, { content: args.content, updatedAt: Date.now() });
  },
});

export const sharePage = mutation({
  args: {
    pageId: v.id("pages"),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    if (!validateEmail(args.email)) {
      throw new Error("Invalid email format");
    }

    const page = await ctx.db.get(args.pageId);
    if (!page) throw new Error("Page not found");
    if (page.ownerId !== user._id) throw new Error("Not authorized — only the owner can share");

    const targetUser = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.email))
      .first();
    if (!targetUser) throw new Error("No account found for that email");
    if (targetUser._id === user._id) throw new Error("Cannot share with yourself");

    const existing = await ctx.db
      .query("pageCollaborators")
      .withIndex("by_page", (q) => q.eq("pageId", args.pageId))
      .filter((q) => q.eq(q.field("userId"), targetUser._id))
      .first();
    if (existing) throw new Error("Already shared with this user");

    await ctx.db.insert("pageCollaborators", {
      pageId: args.pageId,
      userId: targetUser._id,
      invitedBy: user._id,
      status: "pending",
      addedAt: Date.now(),
    });

    // Notify the invited user
    await ctx.db.insert("notifications", {
      userId: targetUser._id,
      type: "invite",
      message: `${user.name || "Someone"} invited you to collaborate on "${page.title}"`,
      pageId: args.pageId,
      fromUserId: user._id,
      read: false,
      createdAt: Date.now(),
    });

    if (!page.isShared) {
      await ctx.db.patch(args.pageId, { isShared: true });
    }
  },
});

export const unsharePage = mutation({
  args: {
    pageId: v.id("pages"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    const page = await ctx.db.get(args.pageId);
    if (!page) throw new Error("Page not found");
    if (page.ownerId !== user._id) throw new Error("Not authorized — only the owner can manage sharing");

    const collab = await ctx.db
      .query("pageCollaborators")
      .withIndex("by_page", (q) => q.eq("pageId", args.pageId))
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();
    if (collab) await ctx.db.delete(collab._id);

    const remaining = await ctx.db
      .query("pageCollaborators")
      .withIndex("by_page", (q) => q.eq("pageId", args.pageId))
      .collect();
    if (remaining.length === 0) {
      await ctx.db.patch(args.pageId, { isShared: false });
    }
  },
});

export const getCollaborators = query({
  args: { pageId: v.id("pages") },
  handler: async (ctx, args) => {
    const user = await getOptionalUser(ctx);
    if (!user) return [];
    const page = await ctx.db.get(args.pageId);
    if (!page) return [];

    // Only owner or collaborator can see collaborator list
    if (page.ownerId !== user._id) {
      const collab = await ctx.db
        .query("pageCollaborators")
        .withIndex("by_page", (q) => q.eq("pageId", args.pageId))
        .filter((q) => q.eq(q.field("userId"), user._id))
        .first();
      if (!collab) throw new Error("Not authorized");
    }

    const collabs = await ctx.db
      .query("pageCollaborators")
      .withIndex("by_page", (q) => q.eq("pageId", args.pageId))
      .collect();

    const users = await Promise.all(
      collabs.map((c) => ctx.db.get(c.userId))
    );
    return users.filter(Boolean);
  },
});

export const searchPages = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    const user = await getOptionalUser(ctx);
    if (!user) return [];
    validateStringLength(args.query, 200, "Search query");
    const searchLower = args.query.toLowerCase();

    const ownedPages = await ctx.db
      .query("pages")
      .withIndex("by_owner", (q) => q.eq("ownerId", user._id))
      .collect();

    const collabs = await ctx.db
      .query("pageCollaborators")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
    const sharedPages = await Promise.all(
      collabs.map((c) => ctx.db.get(c.pageId))
    );

    const allPages = [...ownedPages, ...sharedPages.filter(Boolean)];
    return allPages.filter((p) =>
      p!.title.toLowerCase().includes(searchLower)
    );
  },
});

export const reorderPage = mutation({
  args: {
    pageId: v.id("pages"),
    sortOrder: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    const page = await ctx.db.get(args.pageId);
    if (!page) throw new Error("Page not found");
    if (page.ownerId !== user._id) throw new Error("Not authorized");
    await ctx.db.patch(args.pageId, { sortOrder: args.sortOrder });
  },
});

export const acceptInvite = mutation({
  args: { pageId: v.id("pages") },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    const page = await ctx.db.get(args.pageId);
    if (!page) throw new Error("Page not found");
    if (page.ownerId === user._id) throw new Error("You own this page");

    const existing = await ctx.db
      .query("pageCollaborators")
      .withIndex("by_page", (q) => q.eq("pageId", args.pageId))
      .filter((q) => q.eq(q.field("userId"), user._id))
      .first();

    if (existing) {
      // Update status to accepted
      await ctx.db.patch(existing._id, { status: "accepted" });
    } else {
      // Via invite link — create as accepted
      await ctx.db.insert("pageCollaborators", {
        pageId: args.pageId,
        userId: user._id,
        invitedBy: page.ownerId,
        status: "accepted",
        addedAt: Date.now(),
      });
    }

    // Notify the page owner
    await ctx.db.insert("notifications", {
      userId: page.ownerId,
      type: "invite_accepted",
      message: `${user.name || "Someone"} accepted your invite to "${page.title}"`,
      pageId: args.pageId,
      fromUserId: user._id,
      read: false,
      createdAt: Date.now(),
    });

    if (!page.isShared) {
      await ctx.db.patch(args.pageId, { isShared: true });
    }
  },
});

export const declineInvite = mutation({
  args: { pageId: v.id("pages") },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    const page = await ctx.db.get(args.pageId);

    const existing = await ctx.db
      .query("pageCollaborators")
      .withIndex("by_page", (q) => q.eq("pageId", args.pageId))
      .filter((q) => q.eq(q.field("userId"), user._id))
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);

      // Notify the page owner
      if (page) {
        await ctx.db.insert("notifications", {
          userId: page.ownerId,
          type: "invite_declined",
          message: `${user.name || "Someone"} declined your invite to "${page.title}"`,
          pageId: args.pageId,
          fromUserId: user._id,
          read: false,
          createdAt: Date.now(),
        });
      }

      // Check if any collaborators remain
      const remaining = await ctx.db
        .query("pageCollaborators")
        .withIndex("by_page", (q) => q.eq("pageId", args.pageId))
        .collect();
      if (remaining.length === 0) {
        await ctx.db.patch(args.pageId, { isShared: false });
      }
    }
  },
});

export const getPendingInvites = query({
  args: {},
  handler: async (ctx) => {
    const user = await getOptionalUser(ctx);
    if (!user) return [];

    const collabs = await ctx.db
      .query("pageCollaborators")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("status"), "pending"))
      .collect();

    const pages = await Promise.all(
      collabs.map(async (c) => {
        const page = await ctx.db.get(c.pageId);
        const inviter = await ctx.db.get(c.invitedBy);
        return page ? {
          _id: page._id,
          title: page.title,
          icon: page.icon,
          inviterName: inviter?.name || inviter?.email || "Someone",
        } : null;
      })
    );
    return pages.filter(Boolean);
  },
});

export const getAllPagesForGraph = query({
  args: {},
  handler: async (ctx) => {
    const user = await getOptionalUser(ctx);
    if (!user) return { pages: [], links: [] };
    const owned = await ctx.db
      .query("pages")
      .withIndex("by_owner", (q) => q.eq("ownerId", user._id))
      .collect();
    const collabs = await ctx.db
      .query("pageCollaborators")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
    const shared = await Promise.all(collabs.map((c) => ctx.db.get(c.pageId)));
    const allPages = [...owned, ...shared.filter(Boolean)];

    // Get all backlinks between these pages
    const pageIds = new Set(allPages.map((p) => p!._id));
    const allBacklinks: { source: string; target: string }[] = [];
    for (const page of allPages) {
      const links = await ctx.db
        .query("backlinks")
        .withIndex("by_source", (q) => q.eq("sourcePageId", page!._id))
        .collect();
      for (const link of links) {
        if (pageIds.has(link.targetPageId)) {
          allBacklinks.push({
            source: link.sourcePageId,
            target: link.targetPageId,
          });
        }
      }
    }

    return { pages: allPages, links: allBacklinks };
  },
});
