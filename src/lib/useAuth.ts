"use client";

import { useConvexAuth, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function useAuth() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  const user = useQuery(
    api.users.getMe,
    isAuthenticated ? {} : "skip",
  );

  return {
    user: user ?? null,
    isAuthenticated,
    isLoading: isLoading || (isAuthenticated && user === undefined),
  };
}
