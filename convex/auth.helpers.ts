import { QueryCtx, MutationCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

/**
 * Get the authenticated user from the Convex auth context.
 * Uses @convex-dev/auth's getAuthUserId which returns the user _id directly.
 * Throws if not authenticated or user record not found.
 */
export async function getAuthenticatedUser(ctx: QueryCtx | MutationCtx) {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new Error("Not authenticated");
  }

  const user = await ctx.db.get(userId);
  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

/**
 * Try to get the authenticated user, return null if not authenticated.
 */
export async function getOptionalUser(ctx: QueryCtx | MutationCtx) {
  const userId = await getAuthUserId(ctx);
  if (!userId) return null;

  return await ctx.db.get(userId);
}

/**
 * Check if a user has access to a page (owner or collaborator).
 */
export async function assertPageAccess(
  ctx: QueryCtx | MutationCtx,
  pageId: string,
  userId: string
) {
  const page = await ctx.db.get(pageId as never);
  if (!page) throw new Error("Page not found");

  // Owner always has access
  if ((page as { ownerId: string }).ownerId === userId) return page;

  // Check collaborator
  const collab = await ctx.db
    .query("pageCollaborators")
    .withIndex("by_page", (q) => q.eq("pageId", pageId as never))
    .filter((q) => q.eq(q.field("userId"), userId))
    .first();

  if (!collab) throw new Error("Not authorized to access this page");
  return page;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email: string): boolean {
  return EMAIL_REGEX.test(email) && email.length <= 320;
}

export function validateStringLength(
  value: string,
  maxLength: number,
  fieldName: string
): void {
  if (value.length > maxLength) {
    throw new Error(`${fieldName} exceeds maximum length of ${maxLength}`);
  }
}

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "application/pdf",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function validateFileUpload(mimeType: string, size: number): void {
  if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
    throw new Error(`File type "${mimeType}" is not allowed`);
  }
  if (size > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds maximum of ${MAX_FILE_SIZE / 1024 / 1024}MB`);
  }
}
