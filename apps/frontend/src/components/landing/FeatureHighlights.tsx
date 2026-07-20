"use client"

import { ReactNode } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Layers, ShieldCheck, Gauge, Lock } from "lucide-react"
import SectionHeading from "../animations/SectionHeading"
import FadeIn from "../animations/FadeIn"
import TiltCard from "../animations/TiltCard"

const MODEL_CHIPS = ["Claude", "GPT", "Gemini", "Llama", "Mistral", "DeepSeek", "Grok", "Qwen"]

function ModelMarquee() {
    // Duplicate the chip list once so the loop from -50% back to 0% reads as seamless
    const chips = [...MODEL_CHIPS, ...MODEL_CHIPS]

    return (
        <div className="group/marquee relative mt-8 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_15%,black_85%,transparent)]">
            <motion.div
                className="flex w-max gap-3"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ duration: 18, ease: "linear", repeat: Infinity }}
                style={{ animationPlayState: "running" }}
                whileHover={{ transition: { duration: 40 } }}
            >
                {chips.map((name, i) => (
                    <span
                        key={`${name}-${i}`}
                        className="shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white/70 transition-colors hover:border-indigo-400/40 hover:text-white"
                    >
                        {name}
                    </span>
                ))}
            </motion.div>
        </div>
    )
}

function SupportingCard({
    icon,
    title,
    description,
    cta,
    delay,
}: {
    icon: ReactNode
    title: string
    description: string
    cta: string
    delay: number
}) {
    return (
        <FadeIn delay={delay} className="h-full">
            <TiltCard className="group h-full">
                <motion.a
                    href="#"
                    whileHover={{ y: -4 }}
                    transition={{ type: "spring", stiffness: 300, damping: 24 }}
                    className="relative flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-colors hover:border-white/20 hover:bg-white/[0.04]"
                >
                    <motion.div
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay }}
                        className="flex size-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-indigo-300 transition-colors group-hover:border-indigo-400/30 group-hover:bg-indigo-500/10"
                    >
                        {icon}
                    </motion.div>
                    <h3 className="mt-5 text-lg font-semibold text-white">{title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-white/50">
                        {description}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-white/70 transition-colors group-hover:text-white">
                        {cta}
                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </span>
                </motion.a>
            </TiltCard>
        </FadeIn>
    )
}

export default function FeatureHighlights() {
    return (
        <section className="border-t border-white/5 py-24">
            <div className="mx-auto max-w-6xl px-6">
                <SectionHeading
                    align="left"
                    eyebrow="Why RouterOne"
                    title="One API for Any Model"
                    description="Access every major model through a single, unified interface. Any OpenAI-compatible SDK works out of the box — just change the base URL and the model string."
                    action={
                        <a
                            href="/models"
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-white/60 transition-colors hover:text-white"
                        >
                            Browse all
                            <ArrowRight className="h-3.5 w-3.5" />
                        </a>
                    }
                />

                <div className="mt-10 flex flex-col gap-5">
                    <FadeIn>
                        <TiltCard className="group">
                            <div className="relative flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-500/10 via-white/[0.02] to-transparent p-8">
                                <div>
                                    <motion.div
                                        animate={{ y: [0, -5, 0] }}
                                        transition={{
                                            duration: 3.5,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                        }}
                                        className="flex size-11 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-indigo-300"
                                    >
                                        <Layers className="h-5 w-5" />
                                    </motion.div>
                                    <h3 className="mt-5 text-xl font-semibold text-white">
                                        Every provider, one integration
                                    </h3>
                                    <p className="mt-2 max-w-md text-sm leading-relaxed text-white/50">
                                        Switch between OpenAI, Anthropic, Google, Meta, and dozens
                                        more without touching your code. No per-provider SDKs, no
                                        separate billing, no rewriting prompts — swap the model
                                        string and you're routed.
                                    </p>
                                </div>
                                <ModelMarquee />
                            </div>
                        </TiltCard>
                    </FadeIn>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                        <SupportingCard
                            delay={0.1}
                            icon={<ShieldCheck className="h-5 w-5" />}
                            title="Higher Availability"
                            description="Reliable inference via distributed infrastructure. Automatic fallback to a backup provider the moment one degrades or times out — no code changes required."
                            cta="Learn more"
                        />

                        <SupportingCard
                            delay={0.15}
                            icon={<Gauge className="h-5 w-5" />}
                            title="Price and Performance"
                            description="Keep costs in check without sacrificing speed. Requests route at the edge across 30+ regions, adding single-digit milliseconds of overhead."
                            cta="Learn more"
                        />

                        <SupportingCard
                            delay={0.2}
                            icon={<Lock className="h-5 w-5" />}
                            title="Custom Data Policies"
                            description="Protect your organization with fine-grained data policies. Prompts only ever reach the models and providers you've explicitly allowed."
                            cta="View docs"
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}
