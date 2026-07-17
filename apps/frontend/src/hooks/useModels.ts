import { useQuery } from "@tanstack/react-query"
import { useElysiaClient } from "@/providers/Eden"

export const modelsQueryKey = ["models"] as const

export function useModels() {
    const elysiaClient = useElysiaClient()

    return useQuery({
        queryKey: modelsQueryKey,
        queryFn: async () => {
            const response = await elysiaClient.models.get()
            if (response.error) throw new Error("Failed to fetch models")
            return response.data
        },
    })
}
