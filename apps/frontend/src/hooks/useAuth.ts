"use client"

import { useQuery } from "@tanstack/react-query"
import { useElysiaClient } from "@/providers/Eden"

export function useAuth() {
    const elysiaClient = useElysiaClient() as any

    const query = useQuery({
        queryKey: ["auth"],
        queryFn: async () => {
            const { data, error } = await elysiaClient.auth.profile.get()

            if (error) {
                return null
            }

            return data
        },
        staleTime: 60_000,
    })

    return {
        user: query.data,
        isLoading: query.isLoading,
        isAuthenticated: !!query.data,
        refetch: query.refetch,
    }
}
