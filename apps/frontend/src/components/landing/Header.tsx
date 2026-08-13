"use client"

import Link from "next/link"
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { ArrowRight, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/Logo"
import { useAuth } from "@/hooks/useAuth"

export default function Header() {
    const [scrolled, setScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const { scrollY } = useScroll()

    const { isAuthenticated, isLoading } = useAuth()

    useMotionValueEvent(scrollY, "change", (latest) => {
        setScrolled(latest > 8)
    })

    return (
        <motion.header
            initial={false}
            animate={{
                backgroundColor: scrolled ? "rgba(8,7,11,0.82)" : "rgba(8,7,11,0)",
                borderColor: scrolled ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0)",
            }}
            transition={{ duration: 0.3 }}
            className="fixed inset-x-0 top-0 z-50 border-b backdrop-blur-xl"
        >
            <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                {/* Logo */}
                <Link
                    href="/"
                    className="flex items-center gap-2.5"
                    onClick={() => setMobileMenuOpen(false)}
                >
                    <Logo className="size-8" />
                    <span className="text-sm font-semibold tracking-tight text-white">
                        RouterOne
                    </span>
                </Link>

                {/* Right Side */}
                <div className="flex items-center gap-3">
                    {/* Desktop Navigation */}
                    <nav className="hidden items-center gap-8 font-medium md:flex">
                        <Link
                            href="/models"
                            className="text-sm tracking-wide text-gray-400 transition-colors hover:text-indigo-400"
                        >
                            Models
                        </Link>

                        <Link
                            href="/docs"
                            className="text-sm tracking-tight text-gray-400 transition-colors hover:text-indigo-400"
                        >
                            Docs
                        </Link>
                    </nav>

                    {/* Dashboard / Sign Up - Always Separate */}
                    {!isLoading &&
                        (isAuthenticated ? (
                            <Button size="sm" asChild>
                                <Link href="/dashboard">
                                    Dashboard
                                    <ArrowRight className="size-3.5" />
                                </Link>
                            </Button>
                        ) : (
                            <Button size="sm" asChild>
                                <Link href="/auth/signup" className="text-[13px]">
                                    Sign Up
                                    <ArrowRight className="size-3.5" />
                                </Link>
                            </Button>
                        ))}

                    {/* Mobile Menu Trigger */}
                    <button
                        type="button"
                        aria-label={
                            mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"
                        }
                        aria-expanded={mobileMenuOpen}
                        onClick={() => setMobileMenuOpen((prev) => !prev)}
                        className="group relative flex size-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-gray-400 transition-all duration-200 hover:border-white/15 hover:bg-white/[0.07] hover:text-white md:hidden"
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            {mobileMenuOpen ? (
                                <motion.div
                                    key="close"
                                    initial={{ opacity: 0, rotate: -45, scale: 0.8 }}
                                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                                    exit={{ opacity: 0, rotate: 45, scale: 0.8 }}
                                    transition={{ duration: 0.15 }}
                                >
                                    <X className="size-[18px]" />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="menu"
                                    initial={{ opacity: 0, rotate: 45, scale: 0.8 }}
                                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                                    exit={{ opacity: 0, rotate: -45, scale: 0.8 }}
                                    transition={{ duration: 0.15 }}
                                >
                                    <Menu className="size-[18px]" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </button>
                </div>

                {/* Mobile Navigation Sheet */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <>
                            {/* Backdrop */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                onClick={() => setMobileMenuOpen(false)}
                                className="fixed inset-x-0 top-16 bottom-0 -z-10 bg-black/30 backdrop-blur-[2px] md:hidden"
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
                                    y: -10,
                                    scale: 0.98,
                                }}
                                transition={{
                                    duration: 0.2,
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                                className="absolute left-4 right-4 top-[4.5rem] overflow-hidden rounded-2xl border border-white/[0.10] bg-[#0b0a0f]/95 p-2 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-2xl md:hidden"
                            >
                                {/* Subtle top glow */}
                                <div className="pointer-events-none absolute -top-20 left-1/2 h-32 w-64 -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl" />

                                <div className="relative">
                                    <div className="px-3 pb-2 pt-2">
                                        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-600">
                                            Explore
                                        </span>
                                    </div>

                                    {/* Models */}
                                    <Link
                                        href="/models"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="group flex items-center justify-between rounded-xl px-3 py-3.5 transition-colors hover:bg-white/[0.06]"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="flex size-9 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.035] text-gray-400 transition-colors group-hover:border-indigo-400/20 group-hover:bg-indigo-500/10 group-hover:text-indigo-400">
                                                <div className="size-1.5 rounded-full bg-current" />
                                            </div>

                                            <div>
                                                <p className="text-sm font-medium text-gray-200 transition-colors group-hover:text-white">
                                                    Models
                                                </p>
                                                <p className="mt-0.5 text-xs text-gray-500">
                                                    Browse available models
                                                </p>
                                            </div>
                                        </div>

                                        <ArrowRight className="mr-1 size-4 text-gray-600 transition-all group-hover:translate-x-0.5 group-hover:text-indigo-400" />
                                    </Link>

                                    {/* Docs */}
                                    <Link
                                        href="/docs"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="group flex items-center justify-between rounded-xl px-3 py-3.5 transition-colors hover:bg-white/[0.06]"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="flex size-9 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.035] text-gray-400 transition-colors group-hover:border-indigo-400/20 group-hover:bg-indigo-500/10 group-hover:text-indigo-400">
                                                <div className="h-4 w-3 rounded-sm border border-current" />
                                            </div>

                                            <div>
                                                <p className="text-sm font-medium text-gray-200 transition-colors group-hover:text-white">
                                                    Docs
                                                </p>
                                                <p className="mt-0.5 text-xs text-gray-500">
                                                    Read the documentation
                                                </p>
                                            </div>
                                        </div>

                                        <ArrowRight className="mr-1 size-4 text-gray-600 transition-all group-hover:translate-x-0.5 group-hover:text-indigo-400" />
                                    </Link>
                                </div>

                                {/* Bottom spacing / accent */}
                                <div className="relative mt-1 border-t border-white/[0.06] px-3 py-2">
                                    <p className="text-center text-[10px] text-gray-600">
                                        RouterOne
                                    </p>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </motion.header>
    )
}
