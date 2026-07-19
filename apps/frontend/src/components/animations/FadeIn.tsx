"use client"

import { ReactNode } from "react"
import { motion } from "framer-motion"

const EASE = [0.16, 1, 0.3, 1] as const

type FadeInProps = {
    children: ReactNode
    /** Stagger delay in seconds, handy when animating a list of siblings */
    delay?: number
    /** Distance in px the element travels while fading in */
    y?: number
    className?: string
    /** Replay the animation every time it scrolls into view, instead of once */
    repeat?: boolean
}

export default function FadeIn({
    children,
    delay = 0,
    y = 24,
    className,
    repeat = false,
}: FadeInProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: !repeat, margin: "-80px" }}
            transition={{ duration: 0.6, delay, ease: EASE }}
            className={className}
        >
            {children}
        </motion.div>
    )
}
