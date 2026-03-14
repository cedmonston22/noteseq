import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthenticatedUser, getOptionalUser, validateFileUpload, validateStringLength } from "./auth.helpers";

export const generateUploadUrl = mutation(async (ctx) => {
  // Require authentication for upload URLs
  await getAuthenticatedUser(ctx);
  return await ctx.storage.generateUploadUrl();
});

export const saveFile = mutation({
  args: {
    storageId: v.id("_storage"),
    pageId: v.id("pages"),
    filename: v.string(),
    mimeType: v.string(),
    size: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    // Validate file
    validateStringLength(args.filename, 255, "Filename");
    validateFileUpload(args.mimeType, args.size);

    // Verify user has access to the page
    const page = await ctx.db.get(args.pageId);
    if (!page) throw new Error("Page not found");

    if (page.ownerId !== user._id) {
      const collab = await ctx.db
        .query("pageCollaborators")
        .withIndex("by_page", (q) => q.eq("pageId", args.pageId))
        .filter((q) => q.eq(q.field("userId"), user._id))
        .first();
      if (!collab) throw new Error("Not authorized to upload to this page");
    }

    return await ctx.db.insert("files", {
      storageId: args.storageId,
      uploadedBy: user._id,
      pageId: args.pageId,
      filename: args.filename,
      mimeType: args.mimeType,
      size: args.size,
      createdAt: Date.now(),
    });
  },
});

export const getFilesForPage = query({
  args: { pageId: v.id("pages") },
  handler: async (ctx, args) => {
    const user = await getOptionalUser(ctx);
    if (!user) return [];

    const page = await ctx.db.get(args.pageId);
    if (!page) return [];

    if (page.ownerId !== user._id) {
      const collab = await ctx.db
        .query("pageCollaborators")
        .withIndex("by_page", (q) => q.eq("pageId", args.pageId))
        .filter((q) => q.eq(q.field("userId"), user._id))
        .first();
      if (!collab) throw new Error("Not authorized");
    }

    return await ctx.db
      .query("files")
      .withIndex("by_page", (q) => q.eq("pageId", args.pageId))
      .collect();
  },
});

export const deleteFile = mutation({
  args: { fileId: v.id("files") },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    const file = await ctx.db.get(args.fileId);
    if (!file) throw new Error("File not found");
    if (file.uploadedBy !== user._id) throw new Error("Not authorized — only the uploader can delete");

    await ctx.storage.delete(file.storageId);
    await ctx.db.delete(args.fileId);
  },
});
