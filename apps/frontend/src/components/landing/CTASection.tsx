"use client"

import { useRef } from "react"
import { motion, useMotionTemplate, useMotionValue } from "framer-motion"
import { ArrowRight, Check, Terminal } from "lucide-react"
import FadeIn from "../animations/FadeIn"

const HEADLINE = "Ready to start building?"

const TRUST_POINTS = ["No credit card required", "Pay-as-you-go pricing", "Cancel anytime"]

const wordContainer = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
}

const wordItem = {
    hidden: { opacity: 0, y: "0.4em" },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
}

function AnimatedHeadline() {
    return (
        <motion.h2
            variants={wordContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl"
        >
            {HEADLINE.split(" ").map((word, i) => (
                <span key={i} className="inline-block overflow-hidden pb-1 pr-[0.25em]">
                    <motion.span variants={wordItem} className="inline-block">
                        {word}
                    </motion.span>
                </span>
            ))}
        </motion.h2>
    )
}

export default function CTASection() {
    const cardRef = useRef<HTMLDivElement>(null)
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = cardRef.current?.getBoundingClientRect()
        if (!rect) return
        mouseX.set(e.clientX - rect.left)
        mouseY.set(e.clientY - rect.top)
    }

    const spotlight = useMotionTemplate`radial-gradient(500px circle at ${mouseX}px ${mouseY}px, rgba(129,140,248,0.12), transparent 70%)`

    return (
        <section className="border-t border-white/5 py-24">
            <div className="mx-auto max-w-6xl px-6">
                <FadeIn>
                    <div className="relative overflow-hidden rounded-3xl p-px">
                        {/* Continuously rotating gradient ring, the "neon" border accent */}
                        <motion.div
                            aria-hidden="true"
                            className="absolute inset-[-60%]"
                            style={{
                                background:
                                    "conic-gradient(from 0deg, transparent 0%, #818CF8 8%, transparent 18%, transparent 50%, #E879F9 58%, transparent 68%, transparent 100%)",
                            }}
                            animate={{ rotate: 360 }}
                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        />

                        <div
                            ref={cardRef}
                            onMouseMove={handleMouseMove}
                            className="relative overflow-hidden rounded-3xl bg-[#0b0a10]"
                        >
                            {/* Cursor-tracked spotlight */}
                            <motion.div
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-0"
                                style={{ background: spotlight }}
                            />
                            {/* Static dot grid to match the rest of the page's texture */}
                            <div
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-0 opacity-20"
                                style={{
                                    backgroundImage:
                                        "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)",
                                    backgroundSize: "28px 28px",
                                }}
                            />

                            <div className="relative grid grid-cols-1 gap-10 p-10 sm:p-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                                <div>
                                    <AnimatedHeadline />
                                    <p className="mt-4 max-w-lg text-lg leading-relaxed text-white/50">
                                        Create a free account and start making API calls in minutes
                                        — one key, every model, no infrastructure to manage.
                                    </p>

                                    <div className="mt-8 flex flex-wrap items-center gap-4">
                                        <motion.a
                                            href="/auth/signup"
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 400,
                                                damping: 22,
                                            }}
                                            className="group inline-flex h-12 items-center gap-2 rounded-full bg-indigo-500 px-8 text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(255,255,255,0.08)] transition-colors hover:bg-indigo-400"
                                        >
                                            Create free account
                                            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                                        </motion.a>
                                        <motion.a
                                            href="/docs"
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 400,
                                                damping: 22,
                                            }}
                                            className="inline-flex h-12 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-8 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/[0.08]"
                                        >
                                            Read the docs
                                        </motion.a>
                                    </div>

                                    <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
                                        {TRUST_POINTS.map((point) => (
                                            <span
                                                key={point}
                                                className="inline-flex items-center gap-2 text-sm text-white/45"
                                            >
                                                <Check className="h-3.5 w-3.5 text-emerald-400" />
                                                {point}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Decorative code panel, hidden below lg to keep the mobile layout tight */}
                                <div className="hidden lg:block">
                                    <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] shadow-2xl backdrop-blur-sm">
                                        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
                                            <Terminal className="h-3.5 w-3.5 text-white/30" />
                                            <span className="font-mono text-xs text-white/40">
                                                quickstart.sh
                                            </span>
                                        </div>
                                        <pre className="overflow-x-auto p-5 font-mono text-sm leading-relaxed">
                                            <code>
                                                <span className="text-white/40">
                                                    {"# One key. Every model.\n"}
                                                </span>
                                                <span className="text-blue-400">{"curl "}</span>
                                                <span className="text-emerald-400">
                                                    {"https://routerone.ai/api/v1/chat"}
                                                </span>
                                                <span className="text-white">{" \\\n  -H "}</span>
                                                <span className="text-emerald-400">
                                                    {'"Authorization: Bearer $KEY"'}
                                                </span>
                                                <span className="text-white">{" \\\n  -d "}</span>
                                                <span className="text-emerald-400">
                                                    {'\'{"model":"anthropic/claude-fable-5"}\''}
                                                </span>
                                            </code>
                                        </pre>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </FadeIn>
            </div>
        </section>
    )
}
