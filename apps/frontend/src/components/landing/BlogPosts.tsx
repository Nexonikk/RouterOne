"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import SectionHeading from "../animations/SectionHeading"

type Post = {
    title: string
    excerpt: string
    date: string
    isNew?: boolean
    gradient: string
}

const POSTS: Post[] = [
    {
        title: "Every Modality, One API",
        excerpt:
            "Chat, images, embeddings, and transcription usually mean juggling separate SDKs and bills. On RouterOne they all run through the same base URL and the same routing controls.",
        date: "July 16, 2026",
        isNew: true,
        gradient: "from-indigo-500/30 via-fuchsia-500/20 to-transparent",
    },
    {
        title: "Introducing Our New Brand",
        excerpt:
            "A refreshed visual identity, rebuilt from the ground up, marking the start of the next chapter for RouterOne.",
        date: "July 13, 2026",
        isNew: true,
        gradient: "from-orange-500/30 via-amber-400/20 to-transparent",
    },
    {
        title: "Smarter Routing for DeepSeek Models",
        excerpt:
            "One model, over a dozen providers, and a wide spread in price and throughput. Here is what routing through a single slug actually buys you.",
        date: "July 13, 2026",
        gradient: "from-emerald-500/30 via-teal-400/20 to-transparent",
    },
]

const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
}

const cardVariant = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
}

export default function BlogPosts() {
    return (
        <section className="border-t border-white/5 py-24">
            <div className="mx-auto max-w-6xl px-6">
                <SectionHeading
                    align="left"
                    eyebrow="From the blog"
                    title="Recent posts"
                    action={
                        <a
                            href="/blog"
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
                    className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3"
                >
                    {POSTS.map((post) => (
                        <motion.a
                            key={post.title}
                            href="#"
                            variants={cardVariant}
                            whileHover={{ y: -4 }}
                            transition={{ type: "spring", stiffness: 300, damping: 24 }}
                            className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] transition-colors hover:border-white/20 hover:bg-white/[0.04]"
                        >
                            <div className={`h-32 bg-gradient-to-br ${post.gradient}`} />
                            <div className="flex flex-1 flex-col p-6">
                                <div className="flex items-center gap-3 text-xs text-white/40">
                                    <span>{post.date}</span>
                                    {post.isNew && (
                                        <span className="rounded-full border border-indigo-400/30 bg-indigo-500/10 px-2 py-0.5 font-medium text-indigo-300">
                                            New
                                        </span>
                                    )}
                                </div>
                                <h3 className="mt-3 text-lg font-semibold text-white">
                                    {post.title}
                                </h3>
                                <p className="mt-2 flex-1 text-sm leading-relaxed text-white/50">
                                    {post.excerpt}
                                </p>
                                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-white/70 transition-colors group-hover:text-white">
                                    Read more
                                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                                </span>
                            </div>
                        </motion.a>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
