"use client"

import Link from "next/link"
import { motion, useScroll, useMotionValueEvent } from "framer-motion"
import { useState } from "react"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/Logo"
import { useAuth } from "@/hooks/useAuth"

export default function Header() {
    const [scrolled, setScrolled] = useState(false)
    const { scrollY } = useScroll()

    const { isAuthenticated, isLoading } = useAuth()

    useMotionValueEvent(scrollY, "change", (latest) => {
        setScrolled(latest > 8)
    })

    return (
        <motion.header
            initial={false}
            animate={{
                backgroundColor: scrolled ? "rgba(8,7,11,0.8)" : "rgba(8,7,11,0)",
                borderColor: scrolled ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0)",
            }}
            transition={{ duration: 0.3 }}
            className="fixed inset-x-0 top-0 z-50 border-b backdrop-blur-xl"
        >
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                <Link href="/" className="flex items-center gap-2.5">
                    <Logo className="size-8" />
                    <span className="text-sm font-semibold tracking-tight text-white">
                        RouterOne
                    </span>
                </Link>

                <div className="flex items-center gap-5">
                    <div className="flex items-center gap-8 font-medium">
                        <div>
                            <Link
                                href="/models"
                                className="text-sm tracking-wide text-gray-400 transition-colors hover:text-indigo-400"
                            >
                                Models
                            </Link>
                        </div>
                        <div>
                            <Link
                                href="/docs"
                                className="text-sm tracking-tight text-gray-400 transition-colors hover:text-indigo-400"
                            >
                                Docs
                            </Link>
                        </div>
                    </div>

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
                </div>
            </div>
        </motion.header>
    )
}
