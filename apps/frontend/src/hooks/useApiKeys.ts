import { useQuery } from "@tanstack/react-query"
import { useElysiaClient } from "@/providers/Eden"

export const apiKeysQueryKey = ["api-keys"] as const

export function useApiKeys() {
    const elysiaClient = useElysiaClient()

    return useQuery({
        queryKey: apiKeysQueryKey,
        queryFn: async () => {
            const response = await elysiaClient["api-keys"].get()
            if (response.error) throw new Error("Failed to fetch API keys")
            return response.data
        },
    })
}

// Inferred from the query itself, so it always matches whatever Eden actually
// returns instead of drifting from a hand-written interface.
export type ApiKey = NonNullable<ReturnType<typeof useApiKeys>["data"]>["apiKeys"][number]
