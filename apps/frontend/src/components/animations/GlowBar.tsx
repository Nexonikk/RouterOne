"use client"

import { motion } from "framer-motion"

type GlowBarProps = {
    className?: string
    /** Tailwind width class, e.g. 'w-16' */
    width?: string
    color?: string
}

export default function GlowBar({
    className = "",
    width = "w-14",
    color = "#818CF8",
}: GlowBarProps) {
    return (
        <div
            className={`relative h-[3px] overflow-hidden rounded-full bg-white/10 ${width} ${className}`}
        >
            <motion.div
                className="absolute inset-y-0 w-1/2 rounded-full"
                style={{
                    background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
                    filter: `drop-shadow(0 0 6px ${color})`,
                }}
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
            />
        </div>
    )
}
