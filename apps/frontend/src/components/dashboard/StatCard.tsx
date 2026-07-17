import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"
import { Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatCardProps {
    label: string
    value: ReactNode
    caption?: string
    icon: LucideIcon
    isLoading?: boolean
    className?: string
}

export function StatCard({
    label,
    value,
    caption,
    icon: Icon,
    isLoading,
    className,
}: StatCardProps) {
    return (
        <Card
            className={cn(
                "border-border/50 bg-card/50 transition-colors hover:border-border/80",
                className,
            )}
        >
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{label}</span>
                    <div className="flex size-7 items-center justify-center rounded-md bg-foreground/5">
                        <Icon className="size-3.5 text-muted-foreground" />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <Loader2 className="size-5 animate-spin text-muted-foreground" />
                ) : (
                    <p className="text-3xl font-semibold tracking-tight tabular-nums">{value}</p>
                )}
                {caption && <p className="mt-1 text-xs text-muted-foreground">{caption}</p>}
            </CardContent>
        </Card>
    )
}
