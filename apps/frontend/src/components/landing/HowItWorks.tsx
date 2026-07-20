"use client"

import { useRef, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Copy, Check, Sparkles } from "lucide-react"
import SectionHeading from "../animations/SectionHeading"
import FadeIn from "../animations/FadeIn"
import TiltCard from "../animations/TiltCard"

const CREDIT_HISTORY = [
    { date: "Mar 30", amount: 10 },
    { date: "Apr 1", amount: 99 },
]

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
                        transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
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
            // Clipboard access can be blocked (e.g. insecure context); the UI still
            // acknowledges the click so the interaction never feels broken.
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
        visual: null,
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

export default function HowItWorks() {
    const containerRef = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start 65%", "end 45%"],
    })
    const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])

    return (
        <section className="border-t border-white/5 py-24">
            <div className="mx-auto max-w-6xl px-6">
                <SectionHeading
                    eyebrow="Get started"
                    title="Three steps to your first request"
                    description="From account to API call in a few minutes, no subscription required."
                />

                <div ref={containerRef} className="relative mt-16 flex flex-col gap-16">
                    {/* Scroll-linked progress line, only shown at md+ where the number column has room */}
                    <div className="absolute left-[7px] top-2 bottom-2 hidden w-px bg-white/10 md:block">
                        <motion.div
                            style={{ height: lineHeight }}
                            className="w-px bg-gradient-to-b from-indigo-400 to-fuchsia-400 shadow-[0_0_8px_rgba(129,140,248,0.6)]"
                        />
                    </div>

                    {STEPS.map((step, i) => (
                        <FadeIn key={step.number} delay={i * 0.05}>
                            <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:pl-8">
                                <div className={i % 2 === 1 ? "md:order-2" : ""}>
                                    <span className="font-mono text-sm font-semibold text-indigo-300/70">
                                        {step.number}
                                    </span>
                                    <h3 className="mt-3 text-2xl font-semibold text-white">
                                        {step.title}
                                    </h3>
                                    <p className="mt-2 max-w-md text-base leading-relaxed text-white/50">
                                        {step.description}
                                    </p>
                                </div>
                                <div className={`h-40 ${i % 2 === 1 ? "md:order-1" : ""}`}>
                                    {step.visual ? (
                                        <TiltCard maxTilt={4} className="h-full">
                                            {step.visual}
                                        </TiltCard>
                                    ) : (
                                        <div className="flex h-full items-center justify-center gap-2 rounded-2xl border border-dashed border-white/10 text-sm text-white/30">
                                            <Sparkles className="h-3.5 w-3.5" />
                                            No setup required
                                        </div>
                                    )}
                                </div>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    )
}
