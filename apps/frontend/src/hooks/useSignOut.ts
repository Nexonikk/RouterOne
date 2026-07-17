"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useElysiaClient } from "@/providers/Eden"

export function useSignOut() {
    const elysiaClient = useElysiaClient() as any
    const queryClient = useQueryClient()
    const router = useRouter()

    return useMutation({
        mutationFn: async () => {
            const response = await elysiaClient.auth["sign-out"].post()
            if (response.error) {
                const errValue = response.error.value as { message?: string } | undefined
                throw new Error(errValue?.message || "Failed to sign out")
            }
            return response.data
        },
        onSuccess: () => {
            queryClient.clear()
            router.push("/auth/signin")
        },
    })
}
