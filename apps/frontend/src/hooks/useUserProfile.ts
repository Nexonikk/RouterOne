import { useQuery } from "@tanstack/react-query"
import { useElysiaClient } from "@/providers/Eden"

export const userProfileQueryKey = ["user-profile"] as const

export function useUserProfile() {
    const elysiaClient = useElysiaClient()

    return useQuery({
        queryKey: userProfileQueryKey,
        queryFn: async () => {
            const response = await elysiaClient.auth.profile.get()
            if (response.error) throw new Error("Failed to fetch user profile")
            return response.data
        },
    })
}
