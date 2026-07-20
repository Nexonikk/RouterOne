"use client"

import { motion } from "framer-motion"
import { ArrowRight, Database, TrendingUp, TrendingDown, Minus, Zap } from "lucide-react"
import SectionHeading from "../animations/SectionHeading"
import TiltCard from "../animations/TiltCard"

type Model = {
    name: string
    provider: string
    tokens: string
    trend: number // percentage; 0 reads as flat
    latency: string
    price: string
    isNew?: boolean
    spark: number[] // relative heights 0-1 for the mini usage sparkline
}

const MODELS: Model[] = [
    {
        name: "Claude Fable 5",
        provider: "anthropic",
        tokens: "453.2B",
        trend: 10,
        latency: "38 tok/s",
        price: "$3.00/M",
        spark: [0.3, 0.4, 0.35, 0.55, 0.5, 0.7, 0.85],
    },
    {
        name: "GPT-5.6 Sol",
        provider: "openai",
        tokens: "471.5B",
        trend: 0,
        latency: "44 tok/s",
        price: "$2.50/M",
        isNew: true,
        spark: [0.5, 0.5, 0.48, 0.52, 0.5, 0.5, 0.5],
    },
    {
        name: "Muse Spark 1.1",
        provider: "meta",
        tokens: "31.2B",
        trend: 0,
        latency: "61 tok/s",
        price: "$0.80/M",
        isNew: true,
        spark: [0.2, 0.25, 0.3, 0.28, 0.35, 0.4, 0.45],
    },
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

function Sparkline({ values }: { values: number[] }) {
    return (
        <div className="flex h-8 items-end gap-[3px]">
            {values.map((v, i) => (
                <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    whileInView={{ height: `${v * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                    className="w-1.5 rounded-full bg-gradient-to-t from-indigo-500/40 to-indigo-300/80"
                />
            ))}
        </div>
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
                    description="400+ active models across 70+ providers, ranked by live usage."
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
                        <motion.div key={model.name} variants={cardVariant}>
                            <TiltCard maxTilt={5}>
                                <motion.a
                                    href="#"
                                    whileHover={{ y: -4 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 24 }}
                                    className="relative block overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-colors hover:border-white/20 hover:bg-white/[0.04]"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`flex size-10 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white ${
                                                    PROVIDER_GRADIENTS[model.provider] ??
                                                    "from-slate-400 to-slate-500"
                                                }`}
                                            >
                                                {model.name.charAt(0)}
                                            </div>
                                            <span className="relative flex h-2 w-2">
                                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                                                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                                            </span>
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

                                    <div className="mt-4 flex items-center justify-between">
                                        <Sparkline values={model.spark} />
                                        <TrendBadge trend={model.trend} />
                                    </div>

                                    <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4 text-xs text-white/50">
                                        <span className="inline-flex items-center gap-1.5">
                                            <Database className="h-3.5 w-3.5" />
                                            {model.tokens}
                                        </span>
                                        <span className="inline-flex items-center gap-1.5">
                                            <Zap className="h-3.5 w-3.5" />
                                            {model.latency}
                                        </span>
                                        <span className="font-mono">{model.price}</span>
                                    </div>
                                </motion.a>
                            </TiltCard>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
