"use client"

import { motion } from "framer-motion"
import { ArrowRight, Database, TrendingUp, TrendingDown, Minus } from "lucide-react"
import SectionHeading from "../animations/SectionHeading"

type Model = {
    name: string
    provider: string
    tokens: string
    trend: number // percentage; 0 reads as flat
    isNew?: boolean
}

const MODELS: Model[] = [
    { name: "Claude Fable 5", provider: "anthropic", tokens: "453.2B", trend: 10 },
    { name: "GPT-5.6 Sol", provider: "openai", tokens: "471.5B", trend: 0, isNew: true },
    { name: "Muse Spark 1.1", provider: "meta", tokens: "31.2B", trend: 0, isNew: true },
]

// Deterministic gradient per provider so avatars stay stable across renders
const PROVIDER_GRADIENTS: Record<string, string> = {
    anthropic: "from-orange-400 to-rose-500",
    openai: "from-emerald-400 to-teal-500",
    meta: "from-blue-400 to-indigo-500",
}

function TrendBadge({ trend }: { trend: number }) {
    if (trend > 0) {
        return (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
                <TrendingUp className="h-3 w-3" />+{trend}%
            </span>
        )
    }
    if (trend < 0) {
        return (
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2.5 py-1 text-xs font-medium text-rose-400">
                <TrendingDown className="h-3 w-3" />
                {trend}%
            </span>
        )
    }
    return (
        <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2.5 py-1 text-xs font-medium text-white/40">
            <Minus className="h-3 w-3" />
            0%
        </span>
    )
}

const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
}

const cardVariant = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
}

export default function FeaturedModels() {
    return (
        <section className="border-t border-white/5 py-24">
            <div className="mx-auto max-w-6xl px-6">
                <SectionHeading
                    align="left"
                    eyebrow="Featured Models"
                    title="Trending this week"
                    description="400+ active models across 70+ providers, ranked by usage."
                    action={
                        <a
                            href="/models"
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-white/60 transition-colors hover:text-white"
                        >
                            View all
                            <ArrowRight className="h-3.5 w-3.5" />
                        </a>
                    }
                />

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-80px" }}
                    className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
                >
                    {MODELS.map((model) => (
                        <motion.a
                            key={model.name}
                            href="#"
                            variants={cardVariant}
                            whileHover={{ y: -4 }}
                            transition={{ type: "spring", stiffness: 300, damping: 24 }}
                            className="group rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-colors hover:border-white/20 hover:bg-white/[0.04]"
                        >
                            <div className="flex items-start justify-between">
                                <div
                                    className={`flex size-10 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white ${
                                        PROVIDER_GRADIENTS[model.provider] ??
                                        "from-slate-400 to-slate-500"
                                    }`}
                                >
                                    {model.name.charAt(0)}
                                </div>
                                {model.isNew && (
                                    <span className="rounded-full border border-indigo-400/30 bg-indigo-500/10 px-2.5 py-1 text-xs font-medium text-indigo-300">
                                        New
                                    </span>
                                )}
                            </div>

                            <h3 className="mt-4 text-base font-semibold text-white">
                                {model.name}
                            </h3>
                            <p className="text-sm text-white/40">by {model.provider}</p>

                            <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4">
                                <span className="inline-flex items-center gap-1.5 text-xs text-white/50">
                                    <Database className="h-3.5 w-3.5" />
                                    {model.tokens} tokens
                                </span>
                                <TrendBadge trend={model.trend} />
                            </div>
                        </motion.a>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
