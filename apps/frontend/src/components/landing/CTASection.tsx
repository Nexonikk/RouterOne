"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import FadeIn from "../animations/FadeIn"

export default function CTASection() {
    return (
        <section className="relative overflow-hidden border-t border-white/5 py-24">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-[120px]"
            />

            <div className="relative mx-auto max-w-6xl px-6 text-center">
                <FadeIn>
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                        Ready to start building?
                    </h2>
                    <p className="mx-auto mt-4 max-w-xl text-lg text-white/50">
                        Create a free account and start making API calls in minutes.
                    </p>
                    <motion.a
                        href="/auth/signup"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ type: "spring", stiffness: 400, damping: 22 }}
                        className="group mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-indigo-500 px-8 text-base font-semibold text-white shadow-[0_0_0_1px_rgba(255,255,255,0.08)] transition-colors hover:bg-indigo-400"
                    >
                        Create free account
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </motion.a>
                </FadeIn>
            </div>
        </section>
    )
}
