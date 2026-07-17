"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Key, Coins, LogOut } from "lucide-react"
import { Button } from "./ui/button"
import { useSignOut } from "@/hooks/useSignOut"
import { Logo } from "./Logo"

const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "API Keys", href: "/api-keys", icon: Key },
    { label: "Credits", href: "/credits", icon: Coins },
]

export function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const signOut = useSignOut()

    return (
        <div className="dark min-h-screen bg-background flex">
            {/* Sidebar */}
            <aside className="w-64 border-r border-border/50 flex flex-col bg-card/30">
                {/* Brand */}
                <div className="px-5 h-16 flex items-center gap-2.5 border-b border-border/50">
                    <Logo className="size-8" />
                    <span className="text-sm font-semibold tracking-tight text-foreground">
                        <Link href="/">RouterOne</Link>
                    </span>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-white/10 text-white"
                                        : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
                                )}
                            >
                                <item.icon className="size-4" />
                                {item.label}
                            </Link>
                        )
                    })}
                </nav>

                {/* Footer */}
                <div className="px-3 py-4 border-t border-border/50">
                    <Button
                        variant="ghost"
                        onClick={() => signOut.mutate()}
                        disabled={signOut.isPending}
                        className="w-full justify-start gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
                    >
                        <LogOut className="size-4" />
                        {signOut.isPending ? "Signing out..." : "Sign out"}
                    </Button>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 overflow-auto">
                <div className="max-w-5xl mx-auto px-8 py-8">{children}</div>
            </main>
        </div>
    )
}
