import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import {
  getAuthenticatedUser,
  getOptionalUser,
  validateStringLength,
} from "./auth.helpers";

const MAX_FOLDER_NAME_LENGTH = 100;

export const getFolders = query({
  args: {},
  handler: async (ctx) => {
    const user = await getOptionalUser(ctx);
    if (!user) return [];
    return await ctx.db
      .query("folders")
      .withIndex("by_owner", (q) => q.eq("ownerId", user._id))
      .collect();
  },
});

export const createFolder = mutation({
  args: {
    name: v.string(),
    icon: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    validateStringLength(args.name, MAX_FOLDER_NAME_LENGTH, "Folder name");

    return await ctx.db.insert("folders", {
      name: args.name,
      icon: args.icon,
      ownerId: user._id,
      createdAt: Date.now(),
    });
  },
});

export const renameFolder = mutation({
  args: {
    folderId: v.id("folders"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    validateStringLength(args.name, MAX_FOLDER_NAME_LENGTH, "Folder name");

    const folder = await ctx.db.get(args.folderId);
    if (!folder) throw new Error("Folder not found");
    if (folder.ownerId !== user._id) throw new Error("Not authorized");

    await ctx.db.patch(args.folderId, { name: args.name });
  },
});

export const deleteFolder = mutation({
  args: {
    folderId: v.id("folders"),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    const folder = await ctx.db.get(args.folderId);
    if (!folder) throw new Error("Folder not found");
    if (folder.ownerId !== user._id) throw new Error("Not authorized");

    // Move contained pages back to root (clear folderId)
    const pages = await ctx.db
      .query("pages")
      .withIndex("by_owner", (q) => q.eq("ownerId", user._id))
      .collect();

    for (const page of pages) {
      if (page.folderId === args.folderId) {
        await ctx.db.patch(page._id, { folderId: undefined });
      }
    }

    await ctx.db.delete(args.folderId);
  },
});

export const movePage = mutation({
  args: {
    pageId: v.id("pages"),
    folderId: v.optional(v.id("folders")),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    const page = await ctx.db.get(args.pageId);
    if (!page) throw new Error("Page not found");
    if (page.ownerId !== user._id) throw new Error("Not authorized");

    // Validate folder exists and belongs to user if provided
    if (args.folderId) {
      const folder = await ctx.db.get(args.folderId);
      if (!folder) throw new Error("Folder not found");
      if (folder.ownerId !== user._id) throw new Error("Not authorized");
    }

    await ctx.db.patch(args.pageId, { folderId: args.folderId });
  },
});
