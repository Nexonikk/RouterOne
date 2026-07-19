"use client"

import { ReactNode } from "react"
import FadeIn from "./FadeIn"

type SectionHeadingProps = {
    eyebrow?: string
    title: string
    description?: string
    align?: "center" | "left"
    /** e.g. a "View all" link rendered flush-right next to the title, only used in 'left' mode */
    action?: ReactNode
    className?: string
}

export default function SectionHeading({
    eyebrow,
    title,
    description,
    align = "center",
    action,
    className = "",
}: SectionHeadingProps) {
    if (align === "left") {
        return (
            <FadeIn
                className={`flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between ${className}`}
            >
                <div>
                    {eyebrow && (
                        <span className="mb-3 block text-xs font-semibold uppercase tracking-widest text-indigo-300/70">
                            {eyebrow}
                        </span>
                    )}
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                        {title}
                    </h2>
                    {description && (
                        <p className="mt-3 max-w-xl text-base leading-relaxed text-white/50">
                            {description}
                        </p>
                    )}
                </div>
                {action && <div className="shrink-0">{action}</div>}
            </FadeIn>
        )
    }

    return (
        <FadeIn className={`mx-auto max-w-2xl text-center ${className}`}>
            {eyebrow && (
                <span className="mb-3 block text-xs font-semibold uppercase tracking-widest text-indigo-300/70">
                    {eyebrow}
                </span>
            )}
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{title}</h2>
            {description && (
                <p className="mt-4 text-lg leading-relaxed text-white/50">{description}</p>
            )}
        </FadeIn>
    )
}
