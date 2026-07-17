"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isLoading, isAuthenticated } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace("/auth/signin")
        }
    }, [isLoading, isAuthenticated, router])

    if (isLoading) {
        return (
            <div className="dark min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (!isAuthenticated) {
        return null
    }

    return <>{children}</>
}
