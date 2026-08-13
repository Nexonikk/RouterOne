"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { LucideIcon } from "lucide-react"
import { Coins, Key, LayoutDashboard, LogOut, Menu, X } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { ReactNode, useEffect, useState } from "react"

import { cn } from "@/lib/utils"
import { Button } from "./ui/button"
import { useSignOut } from "@/hooks/useSignOut"
import { useUserProfile } from "@/hooks/useUserProfile"
import PageBackground from "./PageBackground"

interface NavItem {
    label: string
    href: string
    icon: LucideIcon
}

interface NavGroup {
    label?: string
    items: NavItem[]
}

const navGroups: NavGroup[] = [
    {
        items: [
            {
                label: "Dashboard",
                href: "/dashboard",
                icon: LayoutDashboard,
            },
            {
                label: "API Keys",
                href: "/api-keys",
                icon: Key,
            },
            {
                label: "Credits",
                href: "/credits",
                icon: Coins,
            },
        ],
    },
]

export function DashboardLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname()
    const signOut = useSignOut()
    const userProfileQuery = useUserProfile()

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    useEffect(() => {
        setIsMobileMenuOpen(false)
    }, [pathname])

    return (
        <div className="dark min-h-screen bg-[#08070b] text-foreground">
            <PageBackground />

            {/* ========================================================= */}
            {/* Mobile Header */}
            {/* ========================================================= */}

            <header className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between border-b border-white/[0.07] bg-[#08070b]/80 px-4 backdrop-blur-xl md:hidden">
                <Link href="/" className="flex items-center gap-2.5">
                    <div className="flex size-8 items-center justify-center rounded-lg border border-indigo-400/15 bg-indigo-500/[0.08]">
                        <img src="/Routerone.png" alt="RouterOne" className="size-7" />
                    </div>

                    <span className="text-sm font-semibold tracking-tight text-white">
                        RouterOne
                    </span>
                </Link>

                <button
                    type="button"
                    aria-label={isMobileMenuOpen ? "Close navigation" : "Open navigation"}
                    aria-expanded={isMobileMenuOpen}
                    onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                    className="flex size-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.025] text-zinc-400 transition-colors hover:bg-white/[0.06] hover:text-white"
                >
                    <AnimatePresence mode="wait" initial={false}>
                        {isMobileMenuOpen ? (
                            <motion.div
                                key="close"
                                initial={{
                                    opacity: 0,
                                    rotate: -45,
                                    scale: 0.8,
                                }}
                                animate={{
                                    opacity: 1,
                                    rotate: 0,
                                    scale: 1,
                                }}
                                exit={{
                                    opacity: 0,
                                    rotate: 45,
                                    scale: 0.8,
                                }}
                                transition={{ duration: 0.15 }}
                            >
                                <X className="size-[18px]" />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="menu"
                                initial={{
                                    opacity: 0,
                                    rotate: 45,
                                    scale: 0.8,
                                }}
                                animate={{
                                    opacity: 1,
                                    rotate: 0,
                                    scale: 1,
                                }}
                                exit={{
                                    opacity: 0,
                                    rotate: -45,
                                    scale: 0.8,
                                }}
                                transition={{ duration: 0.15 }}
                            >
                                <Menu className="size-[18px]" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </button>
            </header>

            {/* ========================================================= */}
            {/* Mobile Navigation */}
            {/* ========================================================= */}

            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.button
                            type="button"
                            aria-label="Close navigation"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 top-16 z-40 cursor-default bg-black/40 backdrop-blur-[2px] md:hidden"
                        />

                        {/* Sheet */}
                        <motion.div
                            initial={{
                                opacity: 0,
                                y: -12,
                                scale: 0.98,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                scale: 1,
                            }}
                            exit={{
                                opacity: 0,
                                y: -8,
                                scale: 0.98,
                            }}
                            transition={{
                                duration: 0.2,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                            className="fixed inset-x-3 top-[4.5rem] z-50 overflow-hidden rounded-2xl border border-white/[0.09] bg-[#0b0a0f]/95 shadow-[0_24px_70px_rgba(0,0,0,0.5)] backdrop-blur-2xl md:hidden"
                        >
                            {/* Indigo glow */}
                            <div className="pointer-events-none absolute -top-24 left-1/2 size-48 -translate-x-1/2 rounded-full bg-indigo-500/[0.08] blur-3xl" />

                            <nav className="relative p-2.5">
                                {navGroups.map((group, index) => (
                                    <div key={group.label ?? `group-${index}`}>
                                        {group.label && (
                                            <p className="px-3 pb-2 pt-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-600">
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
                                                            "group relative flex min-h-[48px] items-center gap-3 rounded-xl px-3.5 text-sm font-medium transition-all duration-150",
                                                            isActive
                                                                ? "bg-indigo-500/[0.11] text-white"
                                                                : "text-zinc-400 hover:bg-white/[0.05] hover:text-zinc-100",
                                                        )}
                                                    >
                                                        {isActive && (
                                                            <span className="absolute left-0 h-6 w-[2px] rounded-full bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.5)]" />
                                                        )}

                                                        <item.icon
                                                            className={cn(
                                                                "size-[18px]",
                                                                isActive
                                                                    ? "text-indigo-400"
                                                                    : "text-zinc-500 group-hover:text-zinc-300",
                                                            )}
                                                        />

                                                        {item.label}
                                                    </Link>
                                                )
                                            })}
                                        </div>
                                    </div>
                                ))}

                                {/* Sign out */}
                                <div className="mt-2 border-t border-white/[0.07] pt-2">
                                    <Button
                                        variant="ghost"
                                        onClick={() => signOut.mutate()}
                                        disabled={signOut.isPending}
                                        className="h-12 w-full justify-start gap-3 rounded-xl px-3.5 text-sm font-medium text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-200"
                                    >
                                        <LogOut className="size-[18px]" />
                                        {signOut.isPending ? "Signing out…" : "Sign out"}
                                    </Button>
                                </div>
                            </nav>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* ========================================================= */}
            {/* Desktop Sidebar */}
            {/* ========================================================= */}

            <aside className="fixed inset-y-0 left-0 z-40 hidden w-[260px] flex-col border-r border-white/[0.07] bg-[#08070b]/75 backdrop-blur-xl md:flex">
                {/* Logo */}
                <div className="flex h-16 shrink-0 items-center border-b border-white/[0.07] px-5">
                    <Link href="/" className="flex items-center gap-2.5">
                        <div className="flex size-8 items-center justify-center rounded-lg border border-indigo-400/15 bg-indigo-500/[0.08]">
                            <img src="/Routerone.png" alt="RouterOne" className="size-7" />
                        </div>

                        <span className="text-sm font-semibold tracking-tight text-white">
                            RouterOne
                        </span>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto px-3 py-6">
                    {navGroups.map((group, index) => (
                        <div key={group.label ?? `group-${index}`}>
                            {group.label && (
                                <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-600">
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
                                                "group relative flex min-h-[46px] items-center gap-3 rounded-xl px-3.5 text-sm font-medium transition-all duration-150",
                                                isActive
                                                    ? "bg-indigo-500/[0.11] text-white"
                                                    : "text-zinc-500 hover:bg-white/[0.045] hover:text-zinc-100",
                                            )}
                                        >
                                            {isActive && (
                                                <span className="absolute left-0 h-6 w-[2px] rounded-full bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.5)]" />
                                            )}

                                            <item.icon
                                                className={cn(
                                                    "size-[18px] transition-colors",
                                                    isActive
                                                        ? "text-indigo-400"
                                                        : "text-zinc-600 group-hover:text-zinc-300",
                                                )}
                                            />

                                            <span>{item.label}</span>
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* Sign out */}
                <div className="border-t border-white/[0.07] p-3">
                    <Button
                        variant="ghost"
                        onClick={() => signOut.mutate()}
                        disabled={signOut.isPending}
                        className="h-11 w-full justify-start gap-3 rounded-xl px-3.5 text-sm font-medium text-zinc-500 hover:bg-white/[0.045] hover:text-zinc-100"
                    >
                        <LogOut className="size-[18px]" />

                        {signOut.isPending ? "Signing out…" : "Sign out"}
                    </Button>
                </div>
            </aside>

            {/* ========================================================= */}
            {/* Main */}
            {/* ========================================================= */}

            <main className="min-h-screen md:pl-[260px]">
                <div className="mx-auto max-w-6xl px-4 pb-12 pt-24 md:px-8 md:pb-16 md:pt-10">
                    {children}
                </div>
            </main>
        </div>
    )
}
