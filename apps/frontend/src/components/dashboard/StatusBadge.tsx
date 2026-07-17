import { cn } from "@/lib/utils"

export function StatusBadge({ active }: { active: boolean }) {
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 text-xs font-medium",
                active ? "text-emerald-400" : "text-muted-foreground",
            )}
        >
            <span
                className={cn(
                    "size-1.5 rounded-full",
                    active ? "bg-emerald-400" : "bg-muted-foreground/60",
                )}
            />
            {active ? "Active" : "Disabled"}
        </span>
    )
}
