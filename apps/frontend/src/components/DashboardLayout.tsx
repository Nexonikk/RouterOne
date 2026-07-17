"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { LucideIcon } from "lucide-react"
import { LayoutDashboard, Key, Coins, Zap, LogOut, Wallet, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./ui/button"
import { useSignOut } from "@/hooks/useSignOut"
import { useUserProfile } from "@/hooks/useUserProfile"
import { formatCredits } from "@/lib/format"
import { ReactNode, useState, useEffect } from "react"

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
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false)
    }, [pathname])

    return (
        <div className="dark flex min-h-screen bg-background text-foreground">
            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-b border-border/50 bg-background/80 px-4 backdrop-blur-md">
                <div className="flex items-center gap-2.5">
                    <img src="/Routerone.png" alt="Routerone" className="size-8" />
                    <span className="text-lg font-semibold tracking-tight">
                        <Link href="/">RouterOne</Link>
                    </span>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
                </Button>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-0 top-16 z-40 bg-background">
                    <nav className="flex h-full flex-col space-y-6 overflow-y-auto px-4 py-6">
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
                                                    "flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-colors",
                                                    isActive
                                                        ? "bg-white/10 text-white"
                                                        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                                                )}
                                            >
                                                <item.icon className="size-5" />
                                                {item.label}
                                            </Link>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}
                        <div className="mt-auto pt-6 border-t border-border/50">
                            <Button
                                variant="ghost"
                                onClick={() => signOut.mutate()}
                                disabled={signOut.isPending}
                                className="w-full justify-start gap-3 px-3 py-3 text-base font-medium text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                            >
                                <LogOut className="size-5" />
                                {signOut.isPending ? "Signing out…" : "Sign out"}
                            </Button>
                        </div>
                    </nav>
                </div>
            )}

            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-64 flex-col border-r border-border/50 bg-card/30">
                <div className="flex h-16 shrink-0 items-center gap-2.5 border-b border-border/50 px-5">
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

            <main className="flex-1 overflow-auto pt-16 md:pt-0">
                <div className="mx-auto max-w-5xl px-4 py-6 md:px-8 md:py-8">{children}</div>
            </main>
        </div>
    )
}
