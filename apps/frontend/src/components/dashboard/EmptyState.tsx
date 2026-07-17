import type { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface EmptyStateProps {
    icon: LucideIcon
    title: string
    description?: string
}

export function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
    return (
        <Card className="border-dashed border-border/40 bg-card/20">
            <CardContent className="py-12 text-center">
                <Icon className="mx-auto mb-3 size-9 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">{title}</p>
                {description && (
                    <p className="mt-1 text-xs text-muted-foreground/60">{description}</p>
                )}
            </CardContent>
        </Card>
    )
}
