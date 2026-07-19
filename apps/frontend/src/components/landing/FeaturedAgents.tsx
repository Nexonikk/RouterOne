"use client"

import { motion } from "framer-motion"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import SectionHeading from "../animations/SectionHeading"

type Agent = {
    name: string
    description: string
    href: string
}

const AGENTS: Agent[] = [
    { name: "Replit", description: "The easiest way to go from idea to app.", href: "#" },
    { name: "Hermes Agent", description: "An autonomous agent that grows with you.", href: "#" },
    { name: "Kilo Code", description: "Everything you need for agentic development.", href: "#" },
]

const AVATAR_GRADIENTS = [
    "from-violet-400 to-fuchsia-500",
    "from-amber-400 to-orange-500",
    "from-sky-400 to-blue-500",
]

const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
}

const cardVariant = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
}

export default function FeaturedAgents() {
    return (
        <section className="border-t border-white/5 py-24">
            <div className="mx-auto max-w-6xl px-6">
                <SectionHeading
                    align="left"
                    eyebrow="Featured Agents"
                    title="Built on RouterOne"
                    description="250k+ apps route through RouterOne, reaching 4.2M+ users globally."
                    action={
                        <a
                            href="/apps"
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
                    className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3"
                >
                    {AGENTS.map((agent, i) => (
                        <motion.a
                            key={agent.name}
                            href={agent.href}
                            variants={cardVariant}
                            whileHover={{ y: -4 }}
                            transition={{ type: "spring", stiffness: 300, damping: 24 }}
                            className="group flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-colors hover:border-white/20 hover:bg-white/[0.04]"
                        >
                            <div className="flex items-start justify-between">
                                <div
                                    className={`flex size-11 items-center justify-center rounded-xl bg-gradient-to-br text-base font-bold text-white ${AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length]}`}
                                >
                                    {agent.name.charAt(0)}
                                </div>
                                <ArrowUpRight className="h-4 w-4 text-white/30 transition-colors group-hover:text-white/70" />
                            </div>
                            <h3 className="mt-5 text-base font-semibold text-white">
                                {agent.name}
                            </h3>
                            <p className="mt-1.5 text-sm leading-relaxed text-white/50">
                                {agent.description}
                            </p>
                        </motion.a>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
