"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { LucideIcon } from "lucide-react"
import { LayoutDashboard, Key, Coins, Zap, LogOut, Wallet } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./ui/button"
import { useSignOut } from "@/hooks/useSignOut"
import { useUserProfile } from "@/hooks/useUserProfile"
import { formatCredits } from "@/lib/format"
import { ReactNode } from "react"

interface NavItem {
    label: string
    href: string
    icon: LucideIcon
}

interface NavGroup {
    label?: string
    items: NavItem[]
}

// Grouped so new sections (e.g. "Organization", "Models") can be added later
// without restructuring the sidebar markup.
const navGroups: NavGroup[] = [
    {
        items: [
            { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
            { label: "API Keys", href: "/api-keys", icon: LayoutDashboard },
            { label: "Credits", href: "/credits", icon: LayoutDashboard },
        ],
    },
    // {
    //     label: "Developer",
    //     items: [
    //         { label: "API Keys", href: "/api-keys", icon: Key },
    //         { label: "Credits", href: "/credits", icon: Coins },
    //     ],
    // },
]

export function DashboardLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname()
    const signOut = useSignOut()
    const userProfileQuery = useUserProfile()

    return (
        <div className="dark flex min-h-screen bg-background text-foreground">
            <aside className="flex w-64 flex-col border-r border-border/50 bg-card/30">
                <div className="flex h-16 items-center gap-2.5 border-b border-border/50 px-5">
                    <div className="flex size-8 items-center justify-center rounded-lg border border-primary/20 bg-primary/10">
                        <img src="/Routerone.png" alt="Routerone" className="size-8" />
                    </div>
                    <span className="text-sm font-semibold tracking-tight">
                        <Link href="/">RouterOne</Link>
                    </span>
                </div>

                <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
                    {navGroups.map((group, index) => (
                        <div key={group.label ?? `group-${index}`}>
                            {group.label && (
                                <p className="px-3 pb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/50">
                                    {group.label}
                                </p>
                            )}
                            <div className="space-y-1">
                                {group.items.map((item) => {
                                    const isActive = pathname === item.href
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={cn(
                                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                                isActive
                                                    ? "bg-white/10 text-white"
                                                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                                            )}
                                        >
                                            <item.icon className="size-4" />
                                            {item.label}
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                <div className="space-y-3 border-t border-border/50 px-3 py-4">
                    <Button
                        variant="ghost"
                        onClick={() => signOut.mutate()}
                        disabled={signOut.isPending}
                        className="w-full justify-start gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                    >
                        <LogOut className="size-4" />
                        {signOut.isPending ? "Signing out…" : "Sign out"}
                    </Button>
                </div>
            </aside>

            <main className="flex-1 overflow-auto">
                <div className="mx-auto max-w-5xl px-8 py-8">{children}</div>
            </main>
        </div>
    )
}
