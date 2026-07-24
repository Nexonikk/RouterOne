"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { ArrowRight } from "lucide-react"
import Gradient from "../animations/Gradient"
import { Model } from "@/types/Model"

const EASE = [0.16, 1, 0.3, 1] as const

const container = {
    hidden: {},
    show: {
        transition: { staggerChildren: 0.09, delayChildren: 0.15 },
    },
}

const item = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
}

export default function Hero({ models }: { models: Model[] }) {
    const sectionRef = useRef<HTMLElement>(null)
    const [isHovering, setIsHovering] = useState(false)
    const [currentModel, setCurrentModel] = useState(0)

    // Raw pointer position, converted to a -1..1 range around the section center
    const rawX = useMotionValue(0)
    const rawY = useMotionValue(0)
    const springX = useSpring(rawX, { stiffness: 60, damping: 20, mass: 0.6 })
    const springY = useSpring(rawY, { stiffness: 60, damping: 20, mass: 0.6 })

    // Copy drifts a few pixels opposite the cursor for a subtle parallax feel
    const copyX = useTransform(springX, [-1, 1], [6, -6])
    const copyY = useTransform(springY, [-1, 1], [4, -4])
    const glowX = useTransform(springX, [-1, 1], ["42%", "58%"])
    const glowY = useTransform(springY, [-1, 1], ["42%", "58%"])
    const glowBackground = useTransform(
        [glowX, glowY],
        ([gx, gy]) =>
            `radial-gradient(600px circle at ${gx} ${gy}, rgba(124,58,237,0.18), transparent 60%)`,
    )

    const uniqueModels = models.filter(
        (model, index, self) => index === self.findIndex((m) => m.company.id === model.company.id),
    )

    useEffect(() => {
        if (!uniqueModels.length) return

        const timer = setInterval(() => {
            setCurrentModel((prev) => (prev + 1) % uniqueModels.length)
        }, 1500)

        return () => clearInterval(timer)
    }, [uniqueModels])

    const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
        const rect = sectionRef.current?.getBoundingClientRect()
        if (!rect) return
        const px = (e.clientX - rect.left) / rect.width // 0..1
        const py = (e.clientY - rect.top) / rect.height // 0..1
        rawX.set(px * 2 - 1)
        rawY.set(py * 2 - 1)
    }

    const handlePointerLeave = () => {
        rawX.set(0)
        rawY.set(0)
        setIsHovering(false)
    }

    return (
        <section
            ref={sectionRef}
            onPointerMove={handlePointerMove}
            onPointerEnter={() => setIsHovering(true)}
            onPointerLeave={handlePointerLeave}
            className="relative isolate flex min-h-screen w-full items-center overflow-hidden bg-[#08070B] pb-24 pt-32"
        >
            {/* Animated gradient beam, continuously drifting and distorting toward the cursor */}
            <div className="pointer-events-none absolute inset-0">
                <Gradient
                    colors={[
                        "#040611",
                        "#0D1B4F",
                        "#2E5CFF",
                        "#74B7FF",
                        "#FFFFFF",
                        "#F7FBFF",
                        "#D9E7FF",
                        "#8FA8FF",
                    ]}
                    angle={-32}
                    thickness={0.24}
                    glowSize={0.66}
                    offset={-0.1}
                    speed={1}
                    mouseInteractive
                />
            </div>

            <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 transition-opacity duration-500"
                style={{ opacity: isHovering ? 0.9 : 0.55, background: glowBackground }}
            />

            <div className="relative z-10 mx-auto w-full max-w-6xl px-6 text-center">
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    style={{ x: copyX, y: copyY }}
                    className="mx-auto flex flex-col items-center"
                >
                    {/* <motion.div
                        variants={item}
                        className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-white/70 backdrop-blur-sm"
                    >
                        <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        {modelCount}+ models available
                    </motion.div> */}

                    <motion.h1
                        variants={item}
                        className="
        max-w-4xl
        text-5xl
        font-bold
        leading-[1.1]
        tracking-tight
        bg-gradient-to-r
        from-white
        via-white/70
        to-white/40
        bg-clip-text
        text-transparent
        sm:text-6xl
        lg:text-7xl
    "
                    >
                        One API for Every AI Model
                    </motion.h1>

                    <motion.p
                        variants={item}
                        className="mt-6 max-w-2xl text-lg leading-relaxed text-white/60 sm:text-xl"
                    >
                        Route to the best models from OpenAI, Anthropic, Google, Meta, and more. One
                        integration, infinite possibilities.
                    </motion.p>

                    <motion.div
                        variants={item}
                        className="mt-10 flex flex-wrap items-center justify-center gap-4"
                    >
                        <motion.a
                            href="/auth/signup"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            transition={{ type: "spring", stiffness: 400, damping: 22 }}
                            className="group inline-flex h-12 items-center gap-2 rounded-md bg-indigo-500 px-8 text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(255,255,255,0.08)] transition-colors hover:bg-indigo-400"
                        >
                            Start building
                            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                        </motion.a>

                        <motion.a
                            href="/models"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            transition={{ type: "spring", stiffness: 400, damping: 22 }}
                            className="inline-flex h-12 items-center gap-3 rounded-md border border-white/10 bg-white/[0.04] px-5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/[0.08]"
                        >
                            <span>Explore Models</span>

                            <div className="relative h-6 w-6 overflow-hidden">
                                {uniqueModels[currentModel] && (
                                    <motion.img
                                        key={uniqueModels[currentModel].company.id}
                                        src={uniqueModels[currentModel].company.logo}
                                        alt={uniqueModels[currentModel].company.name}
                                        initial={{ y: 24 }}
                                        animate={{ y: 0 }}
                                        exit={{ y: -24 }}
                                        transition={{
                                            duration: 0.25,
                                            ease: "easeInOut",
                                        }}
                                        className="absolute inset-0 h-6 w-6 object-contain"
                                    />
                                )}
                            </div>
                        </motion.a>
                    </motion.div>

                    {/* Code snippet */}

                    <motion.div variants={item} className="mt-20 w-full max-w-2xl">
                        <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] text-left shadow-2xl backdrop-blur-sm">
                            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
                                <span className="size-3 rounded-full bg-red-500/60" />
                                <span className="size-3 rounded-full bg-yellow-500/60" />
                                <span className="size-3 rounded-full bg-green-500/60" />
                                <span className="ml-2 font-mono text-xs text-white/40">
                                    request.ts
                                </span>
                            </div>
                            <pre className="overflow-x-auto p-5 font-mono text-sm leading-relaxed">
                                <code>
                                    <span className="text-white/40">
                                        {"// Just change the base URL — that's it\n"}
                                    </span>
                                    <span className="text-blue-400">{"const "}</span>
                                    <span className="text-white">{"response "}</span>
                                    <span className="text-white/40">{"= "}</span>
                                    <span className="text-blue-400">{"await "}</span>
                                    <span className="text-yellow-300">{"fetch"}</span>
                                    <span className="text-white">{"(\n"}</span>
                                    <span className="text-emerald-400">
                                        {'  "https://routerone.ai/api/v1/chat"'}
                                    </span>
                                    <span className="text-white">{",\n  { "}</span>
                                    <span className="text-white">{"method: "}</span>
                                    <span className="text-emerald-400">{'"POST"'}</span>
                                    <span className="text-white">{",\n    body: JSON."}</span>
                                    <span className="text-yellow-300">{"stringify"}</span>
                                    <span className="text-white">{"({\n"}</span>
                                    <span className="text-white">{"      model: "}</span>
                                    <span className="text-emerald-400">
                                        {'"anthropic/claude-sonnet-4-5"'}
                                    </span>
                                    <span className="text-white">
                                        {",\n      messages: [{ role: "}
                                    </span>
                                    <span className="text-emerald-400">{'"user"'}</span>
                                    <span className="text-white">{", content: "}</span>
                                    <span className="text-emerald-400">{'"Hello!"'}</span>
                                    <span className="text-white">{" }]\n    })\n  }\n)"}</span>
                                </code>
                            </pre>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}
