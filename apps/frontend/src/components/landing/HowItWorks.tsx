"use client"

import { ReactNode, useRef, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Copy, Check, User, UserPlus, Zap, Lock, Sparkles } from "lucide-react"

const EASE = [0.16, 1, 0.3, 1] as const

const CREDIT_HISTORY = [
    { date: "Mar 30", amount: 10 },
    { date: "Apr 1", amount: 99 },
]

function SignupVisual() {
    return (
        <div className="relative flex h-full flex-col justify-center gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <span className="text-xs font-medium uppercase tracking-widest text-white/40">
                Your organization
            </span>

            <div className="flex items-center">
                <motion.div
                    className="relative z-30 flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#08070B] bg-indigo-500 text-white shadow-[0_0_0_1px_rgba(129,140,248,0.4)]"
                    animate={{ scale: [1, 1.06, 1] }}
                    transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                >
                    <User className="h-4 w-4" />
                </motion.div>

                {[0, 1].map((i) => (
                    <motion.div
                        key={i}
                        style={{ zIndex: 20 - i }}
                        className="relative -ml-3 flex h-10 w-10 items-center justify-center rounded-full border-2 border-dashed border-[#08070B] bg-white/5 text-white/25"
                        animate={{ opacity: [0.3, 0.75, 0.3] }}
                        transition={{
                            duration: 2.6,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 0.3 + i * 0.35,
                        }}
                    >
                        <UserPlus className="h-4 w-4" />
                    </motion.div>
                ))}

                <motion.div
                    whileHover={{ scale: 1.08 }}
                    className="relative z-10 -ml-3 flex h-10 w-10 items-center justify-center rounded-full border-2 border-dashed border-[#08070B] bg-white/[0.03] text-[10px] font-semibold text-white/30"
                >
                    +2
                </motion.div>
            </div>

            <p className="text-xs leading-relaxed text-white/35">
                Invite your team anytime — no seat limits at sign up.
            </p>
        </div>
    )
}

function CreditsVisual() {
    const max = Math.max(...CREDIT_HISTORY.map((c) => c.amount))
    return (
        <div className="flex h-full items-end gap-6 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            {CREDIT_HISTORY.map((entry, i) => (
                <div key={entry.date} className="flex flex-1 flex-col items-center gap-3">
                    <span className="text-sm font-semibold text-white">${entry.amount}</span>
                    <motion.div
                        initial={{ height: 0 }}
                        whileInView={{ height: `${(entry.amount / max) * 96}px` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: i * 0.1, ease: EASE }}
                        className="relative w-full max-w-14 overflow-hidden rounded-t-md bg-gradient-to-t from-indigo-500/40 to-indigo-400"
                    >
                        <motion.div
                            className="absolute inset-x-0 top-0 h-4 bg-white/30 blur-sm"
                            animate={{ y: ["-100%", "400%"] }}
                            transition={{
                                duration: 2.4,
                                repeat: Infinity,
                                ease: "linear",
                                delay: i * 0.4,
                            }}
                        />
                    </motion.div>
                    <span className="text-xs text-white/40">{entry.date}</span>
                </div>
            ))}
        </div>
    )
}

function ApiKeyVisual() {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText("ROUTERONE_API_KEY")
        } catch {
            // Clipboard access can be blocked (e.g. insecure context)
        }
        setCopied(true)
        setTimeout(() => setCopied(false), 1800)
    }

    return (
        <div className="relative flex h-full flex-col justify-center gap-3 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-widest text-white/40">
                    ROUTERONE_API_KEY
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide text-emerald-400/80">
                    <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    </span>
                    live
                </span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-white/10 bg-black/40 px-4 py-3">
                <span className="font-mono text-sm tracking-widest text-white/70">
                    ••••••••••••••••
                </span>
                <motion.button
                    type="button"
                    onClick={handleCopy}
                    whileTap={{ scale: 0.9 }}
                    className="text-white/40 transition-colors hover:text-white"
                    aria-label="Copy API key"
                >
                    <motion.span
                        key={copied ? "copied" : "idle"}
                        initial={{ scale: 0.6, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 18 }}
                        className="block"
                    >
                        {copied ? (
                            <Check className="h-4 w-4 text-emerald-400" />
                        ) : (
                            <Copy className="h-4 w-4" />
                        )}
                    </motion.span>
                </motion.button>
            </div>
        </div>
    )
}

const STEPS = [
    {
        number: "01",
        title: "Sign up",
        description: "Create an account to get started. You can set up an org for your team later.",
        visual: <SignupVisual />,
    },
    {
        number: "02",
        title: "Buy credits",
        description:
            "Credits can be used with any model or provider, with no subscription required.",
        visual: <CreditsVisual />,
    },
    {
        number: "03",
        title: "Get your API key",
        description:
            "Create a key and start making requests — fully OpenAI compatible out of the box.",
        visual: <ApiKeyVisual />,
    },
] as const

/**
 * A single step in the sequence.
 *
 * Motion is split into two layers that never fight each other:
 *  - Decorative layer (giant number, glow blobs): tied to scroll progress,
 *    free to be subtle and continuous since it doesn't need to stay legible.
 *  - Content layer (heading, copy, visual card): reveals once via
 *    whileInView and then simply stays fully visible. It is never driven by
 *    scrollYProgress, so it can't get stuck at a low opacity mid-scroll.
 */
function Step({
    number,
    title,
    description,
    visual,
    index,
}: {
    number: string
    title: string
    description: string
    visual: ReactNode
    index: number
}) {
    const ref = useRef<HTMLDivElement>(null)
    const reversed = index % 2 === 1

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    })

    // Subtle, continuous parallax — decorative only.
    const numberY = useTransform(scrollYProgress, [0, 1], [70, -70])
    const numberOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 0.5, 0.5, 0])
    const glowAY = useTransform(scrollYProgress, [0, 1], [-30, 30])
    const glowBY = useTransform(scrollYProgress, [0, 1], [30, -30])

    return (
        <div
            ref={ref}
            className="relative flex min-h-[90vh] items-center justify-center overflow-hidden px-4 py-24 md:px-0"
        >
            {/* Ambient glow, drifts gently as the step scrolls through */}
            <div className="pointer-events-none absolute inset-0 -z-20 overflow-hidden">
                <motion.div
                    style={{ y: glowAY }}
                    className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-indigo-500/[0.12] blur-3xl"
                />
                <motion.div
                    style={{ y: glowBY }}
                    className="absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-fuchsia-500/[0.08] blur-3xl"
                />
            </div>

            {/* Giant background number */}
            <motion.span
                aria-hidden="true"
                style={{ y: numberY, opacity: numberOpacity }}
                className={`pointer-events-none absolute top-1/2 -translate-y-1/2 select-none text-[12rem] font-black leading-none text-white/[0.05] sm:text-[18rem] md:text-[20rem] ${
                    reversed ? "right-0 -mr-16 md:-mr-32" : "left-0 -ml-16 md:-ml-32"
                }`}
            >
                {number}
            </motion.span>

            <div className="relative z-10 w-full max-w-6xl">
                <div className="grid w-full grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-16">
                    {/* Text content — reveals once, then stays fully visible */}
                    <motion.div
                        initial={{ opacity: 0, y: 32 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-15% 0px -15% 0px" }}
                        transition={{ duration: 0.6, ease: EASE }}
                        className={reversed ? "md:order-2" : ""}
                    >
                        <motion.div
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            transition={{ duration: 0.5, delay: 0.05, ease: EASE }}
                            viewport={{ once: true }}
                            className="mb-4 h-1 w-12 origin-left bg-gradient-to-r from-indigo-400 to-cyan-400"
                        />

                        <span className="block font-mono text-sm font-semibold text-indigo-300/70">
                            Step {number}
                        </span>

                        <motion.h3
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
                            viewport={{ once: true }}
                            className="mt-4 text-4xl font-bold text-white sm:text-5xl md:text-5xl"
                        >
                            {title}
                        </motion.h3>

                        <motion.p
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.15, ease: EASE }}
                            viewport={{ once: true }}
                            className="mt-4 max-w-xl text-lg leading-relaxed text-white/60"
                        >
                            {description}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
                            viewport={{ once: true }}
                            className="mt-8 flex flex-wrap gap-3"
                        >
                            {index === 0 && (
                                <>
                                    <div className="flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-200">
                                        <Sparkles className="h-4 w-4" />
                                        Instant setup
                                    </div>
                                    <div className="flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-200">
                                        <Zap className="h-4 w-4" />
                                        No payment required
                                    </div>
                                </>
                            )}
                            {index === 1 && (
                                <>
                                    <div className="flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2 text-sm text-green-200">
                                        <Zap className="h-4 w-4" />
                                        Flexible pricing
                                    </div>
                                    <div className="flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2 text-sm text-green-200">
                                        <Lock className="h-4 w-4" />
                                        No subscriptions
                                    </div>
                                </>
                            )}
                            {index === 2 && (
                                <>
                                    <div className="flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-sm text-purple-200">
                                        <Lock className="h-4 w-4" />
                                        Secure & live
                                    </div>
                                    <div className="flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-sm text-purple-200">
                                        <Sparkles className="h-4 w-4" />
                                        OpenAI compatible
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </motion.div>

                    {/* Visual card — one clean reveal, no stacked/competing transforms */}
                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 32,
                            scale: 0.94,
                            rotate: reversed ? -3 : 3,
                        }}
                        whileInView={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                        viewport={{ once: true, margin: "-15% 0px -15% 0px" }}
                        transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
                        className={`h-64 md:h-80 ${reversed ? "md:order-1" : ""}`}
                    >
                        {visual}
                    </motion.div>
                </div>
            </div>

            {index === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="pointer-events-none absolute bottom-10 left-1/2 -translate-x-1/2"
                >
                    <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                        className="text-xs uppercase tracking-widest text-white/20"
                    >
                        ↓ scroll ↓
                    </motion.div>
                </motion.div>
            )}
        </div>
    )
}

export default function HowItWorks() {
    const containerRef = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start 20%", "end 80%"],
    })

    const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])
    const lineOpacity = useTransform(scrollYProgress, [0, 0.05, 0.95, 1], [0, 1, 1, 0])
    const lineBoxShadow = useTransform(
        scrollYProgress,
        [0, 0.5, 1],
        [
            "0 0 0px rgba(129,140,248,0.8)",
            "0 0 20px rgba(129,140,248,0.8)",
            "0 0 0px rgba(129,140,248,0.8)",
        ],
    )

    const bgOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.1, 0.3, 0.1])

    return (
        <section className="relative overflow-hidden border-t border-white/5 bg-black/20 backdrop-blur-sm">
            <div ref={containerRef} className="relative w-full">
                <motion.div
                    style={{ opacity: bgOpacity }}
                    className="pointer-events-none absolute inset-0 bg-gradient-to-b from-indigo-500/0 via-indigo-500/[0.02] to-transparent"
                />

                {/* Scroll progress indicator */}
                <div className="absolute left-8 top-0 bottom-0 hidden w-px bg-white/5 md:block">
                    <motion.div
                        style={{
                            height: lineHeight,
                            opacity: lineOpacity,
                            boxShadow: lineBoxShadow,
                        }}
                        className="w-px bg-gradient-to-b from-indigo-400 via-indigo-500 to-fuchsia-500"
                    />
                </div>

                <div className="mx-auto max-w-7xl">
                    <div className="px-4 py-24 sm:px-6 md:pl-24">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, ease: EASE }}
                            viewport={{ once: true, margin: "-100px" }}
                            className="mb-32"
                        >
                            <motion.span
                                className="mb-4 inline-block font-mono text-sm font-semibold uppercase tracking-widest text-indigo-300/70"
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.05, ease: EASE }}
                                viewport={{ once: true }}
                            >
                                Get started
                            </motion.span>
                            <motion.h2
                                className="text-4xl font-bold text-white sm:text-5xl md:text-6xl"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
                                viewport={{ once: true }}
                            >
                                Three steps to your first request
                            </motion.h2>
                            <motion.p
                                className="mt-6 max-w-2xl text-lg text-white/60"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
                                viewport={{ once: true }}
                            >
                                From account to API call in a few minutes, no subscription required.
                            </motion.p>
                        </motion.div>

                        <div className="relative">
                            {STEPS.map((step, i) => (
                                <Step
                                    key={step.number}
                                    number={step.number}
                                    title={step.title}
                                    description={step.description}
                                    visual={step.visual}
                                    index={i}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
