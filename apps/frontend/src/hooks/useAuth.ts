"use client";

import { useQuery } from "@tanstack/react-query";
import { useElysiaClient } from "@/providers/Eden";

/**
 * Fetches the current user's profile from the backend. Relies on the
 * httpOnly session cookie set by the Elysia backend during sign-in
 * (Eden is configured with `credentials: "include"`).
 */
export function useAuth() {
  const elysiaClient = useElysiaClient() as any;

  const query = useQuery({
    queryKey: ["auth", "profile"],
    queryFn: async () => {
      const response = await elysiaClient.auth.profile.get();
      if (response.error) throw new Error("Not authenticated");
      return response.data;
    },
    retry: false,
    staleTime: 60_000,
  });

  return {
    user: query.data,
    isLoading: query.isLoading,
    isAuthenticated: !query.isError && !!query.data,
    error: query.error,
    refetch: query.refetch,
  };
}
