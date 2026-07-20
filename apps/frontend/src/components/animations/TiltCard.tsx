"use client"

import { ReactNode, useRef } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"

type TiltCardProps = {
    children: ReactNode
    className?: string
    /** Max tilt angle in degrees */
    maxTilt?: number
    glowColor?: string
}

export default function TiltCard({
    children,
    className = "",
    maxTilt = 7,
    glowColor = "129,140,248",
}: TiltCardProps) {
    const ref = useRef<HTMLDivElement>(null)
    const rawX = useMotionValue(0.5)
    const rawY = useMotionValue(0.5)
    const springX = useSpring(rawX, { stiffness: 200, damping: 20 })
    const springY = useSpring(rawY, { stiffness: 200, damping: 20 })
    const rotateX = useTransform(springY, [0, 1], [maxTilt, -maxTilt])
    const rotateY = useTransform(springX, [0, 1], [-maxTilt, maxTilt])
    const glowX = useTransform(springX, [0, 1], ["0%", "100%"])
    const glowY = useTransform(springY, [0, 1], ["0%", "100%"])
    const glowBackground = useTransform(
        [glowX, glowY],
        ([gx, gy]) =>
            `radial-gradient(280px circle at ${gx} ${gy}, rgba(${glowColor},0.14), transparent 70%)`,
    )

    const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = ref.current?.getBoundingClientRect()
        if (!rect) return
        rawX.set((e.clientX - rect.left) / rect.width)
        rawY.set((e.clientY - rect.top) / rect.height)
    }

    const handleLeave = () => {
        rawX.set(0.5)
        rawY.set(0.5)
    }

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
            style={{ rotateX, rotateY, transformPerspective: 800 }}
            className={`relative ${className}`}
        >
            <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-10 rounded-2xl"
                style={{ background: glowBackground }}
            />
            {children}
        </motion.div>
    )
}
