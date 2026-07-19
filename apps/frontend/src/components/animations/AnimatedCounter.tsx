"use client"

import { useEffect, useRef, useState } from "react"
import { animate, useInView } from "framer-motion"

type AnimatedCounterProps = {
    /** Final numeric value to count up to */
    value: number
    /** Shown after the number, e.g. "+", "T", "M+" */
    suffix?: string
    prefix?: string
    decimals?: number
    duration?: number
    className?: string
}

export default function AnimatedCounter({
    value,
    suffix = "",
    prefix = "",
    decimals = 0,
    duration = 1.8,
    className,
}: AnimatedCounterProps) {
    const ref = useRef<HTMLSpanElement>(null)
    const inView = useInView(ref, { once: true, margin: "-60px" })
    const [display, setDisplay] = useState((0).toFixed(decimals))

    useEffect(() => {
        if (!inView) return
        const controls = animate(0, value, {
            duration,
            ease: [0.16, 1, 0.3, 1],
            onUpdate(latest) {
                setDisplay(latest.toFixed(decimals))
            },
        })
        return () => controls.stop()
    }, [inView, value, duration, decimals])

    return (
        <span ref={ref} className={className}>
            {prefix}
            {display}
            {suffix}
        </span>
    )
}
