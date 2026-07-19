"use client"

import { motion } from "framer-motion"
import AnimatedCounter from "../animations/AnimatedCounter"

const EASE = [0.16, 1, 0.3, 1] as const

const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
}

const item = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
}

const STATS = [
    { value: 100, suffix: "T", label: "Monthly Tokens" },
    { value: 10, suffix: "M+", label: "Global Users" },
    { value: 70, suffix: "+", label: "Providers" },
    { value: 400, suffix: "+", label: "Models" },
] as const

export default function StatsBar() {
    return (
        <section className="relative border-t border-white/5 py-16">
            <div className="mx-auto max-w-6xl px-6">
                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-80px" }}
                    className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-4"
                >
                    {STATS.map((stat) => (
                        <motion.div
                            key={stat.label}
                            variants={item}
                            className="flex flex-col items-center gap-2 bg-[#08070B] px-6 py-10 text-center"
                        >
                            <span className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                            </span>
                            <span className="text-sm font-medium text-white/45">{stat.label}</span>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
