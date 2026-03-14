import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getOptionalUser } from "./auth.helpers";

export const updatePresence = mutation({
  args: {
    pageId: v.id("pages"),
    sessionId: v.string(),
    cursor: v.optional(v.object({
      from: v.number(),
      to: v.number(),
    })),
  },
  handler: async (ctx, args) => {
    const user = await getOptionalUser(ctx);
    if (!user) return;

    const existing = await ctx.db
      .query("presence")
      .withIndex("by_page_session", (q) =>
        q.eq("pageId", args.pageId).eq("sessionId", args.sessionId)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        cursor: args.cursor,
        lastSeen: Date.now(),
      });
    } else {
      await ctx.db.insert("presence", {
        pageId: args.pageId,
        userId: user._id,
        sessionId: args.sessionId,
        userName: user.name || user.email || "Anonymous",
        userColor: "#D4A843",
        cursor: args.cursor,
        lastSeen: Date.now(),
      });
    }
  },
});

export const getPresence = query({
  args: { pageId: v.id("pages"), sessionId: v.string() },
  handler: async (ctx, args) => {
    const user = await getOptionalUser(ctx);
    if (!user) return [];

    const now = Date.now();
    const records = await ctx.db
      .query("presence")
      .withIndex("by_page_session", (q) => q.eq("pageId", args.pageId))
      .collect();

    // Return active sessions (last 10s), excluding THIS tab's session
    return records
      .filter((r) => r.sessionId !== args.sessionId && now - r.lastSeen < 10000)
      .map((r) => ({
        userId: r.userId,
        sessionId: r.sessionId,
        userName: r.userName,
        userColor: r.userColor,
        cursor: r.cursor,
      }));
  },
});

export const removePresence = mutation({
  args: { pageId: v.id("pages"), sessionId: v.string() },
  handler: async (ctx, args) => {
    const user = await getOptionalUser(ctx);
    if (!user) return;

    const existing = await ctx.db
      .query("presence")
      .withIndex("by_page_session", (q) =>
        q.eq("pageId", args.pageId).eq("sessionId", args.sessionId)
      )
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});
