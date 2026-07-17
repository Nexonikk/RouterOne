import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export function TableShell({ children }: { children: ReactNode }) {
    return (
        <div className="overflow-hidden rounded-xl border border-border/50 bg-card/30">
            <div className="overflow-x-auto">
                <table className="w-full text-sm whitespace-nowrap md:whitespace-normal">{children}</table>
            </div>
        </div>
    )
}

export function Th({
    children,
    align = "left",
}: {
    children: ReactNode
    align?: "left" | "right"
}) {
    return (
        <th
            className={cn(
                "px-4 py-3 text-xs font-medium text-muted-foreground",
                align === "right" ? "text-right" : "text-left",
            )}
        >
            {children}
        </th>
    )
}

export function Td({
    children,
    align = "left",
    className,
}: {
    children: ReactNode
    align?: "left" | "right"
    className?: string
}) {
    return (
        <td className={cn("px-4 py-3", align === "right" && "text-right tabular-nums", className)}>
            {children}
        </td>
    )
}
