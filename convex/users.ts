import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthenticatedUser, getOptionalUser, validateStringLength } from "./auth.helpers";

export const getUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const authed = await getOptionalUser(ctx);
    if (!authed) return null;
    const user = await ctx.db.get(args.userId);
    if (!user) return null;
    return {
      _id: user._id,
      name: user.name,
      avatarUrl: user.avatarUrl,
    };
  },
});

export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const authed = await getOptionalUser(ctx);
    if (!authed) return null;
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.email))
      .first();
    if (!user) return null;
    return {
      _id: user._id,
      name: user.name,
      avatarUrl: user.avatarUrl,
    };
  },
});

export const getMe = query({
  args: {},
  handler: async (ctx) => {
    const user = await getOptionalUser(ctx);
    return user ?? null;
  },
});

export const createOrUpdateUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    avatarUrl: v.optional(v.string()),
    googleId: v.string(),
  },
  handler: async (ctx, args) => {
    // This is called during auth flow — verify identity matches
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    if (identity.subject !== args.googleId) throw new Error("Identity mismatch");

    validateStringLength(args.name, 100, "Name");
    validateStringLength(args.email, 320, "Email");

    const existing = await ctx.db
      .query("users")
      .withIndex("by_googleId", (q) => q.eq("googleId", args.googleId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        name: args.name,
        avatarUrl: args.avatarUrl,
      });
      return existing._id;
    }

    return await ctx.db.insert("users", {
      name: args.name,
      email: args.email,
      avatarUrl: args.avatarUrl,
      googleId: args.googleId,
      createdAt: Date.now(),
    });
  },
});

export const updateProfile = mutation({
  args: {
    name: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    if (args.name !== undefined) {
      validateStringLength(args.name, 100, "Name");
    }

    const updates: Record<string, string | undefined> = {};
    if (args.name !== undefined) updates.name = args.name;
    if (args.avatarUrl !== undefined) updates.avatarUrl = args.avatarUrl;

    await ctx.db.patch(user._id, updates);
  },
});
