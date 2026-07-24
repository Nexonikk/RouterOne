"use client"
import { useRef, useState, MouseEvent } from "react"
import { motion, useMotionValue, useSpring, useMotionTemplate } from "framer-motion"
import { Github, Linkedin, Twitter, Youtube, Route } from "lucide-react"
import { Logo } from "../Logo"

const BRAND = "RouterOne"

const TAGLINE = "One API for every AI model."
const DESCRIPTION =
    "Route to the best models from OpenAI, Anthropic, Google, Meta, and more. One integration, infinite possibilities."

const LINK_COLUMNS: { heading: string; links: string[] }[] = [
    { heading: "Product", links: ["Models", "Pricing", "API", "Dashboard"] },
    { heading: "Resources", links: ["Documentation", "Blog", "Status"] },
    { heading: "Company", links: ["About", "Careers", "Privacy", "Terms"] },
]

const SOCIALS = [
    { icon: Twitter, href: "#", label: "X" },
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Youtube, href: "#", label: "YouTube" },
]

// ---------------------------------------------------------------------------
// Magnetic Icon Component
// ---------------------------------------------------------------------------
function MagneticIcon({
    children,
    href,
    label,
}: {
    children: React.ReactNode
    href: string
    label: string
}) {
    const ref = useRef<HTMLAnchorElement>(null)

    const x = useMotionValue(0)
    const y = useMotionValue(0)

    // Springs to give the magnetic pull a natural, bouncy physics feel
    const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 })
    const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 })

    const handleMouse = (e: MouseEvent<HTMLAnchorElement>) => {
        if (!ref.current) return
        const { clientX, clientY } = e
        const { height, width, left, top } = ref.current.getBoundingClientRect()

        // Calculate the distance from the center of the element
        const middleX = clientX - (left + width / 2)
        const middleY = clientY - (top + height / 2)

        // The multiplier (0.3) controls how strong the "magnet" is
        x.set(middleX * 0.3)
        y.set(middleY * 0.3)
    }

    const reset = () => {
        x.set(0)
        y.set(0)
    }

    return (
        <motion.a
            ref={ref}
            href={href}
            aria-label={label}
            onMouseMove={handleMouse}
            onMouseLeave={reset}
            animate={{ x: 0, y: 0 }}
            style={{ x: springX, y: springY }}
            whileHover={{ scale: 1.1 }}
            className="group relative flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-neutral-400 transition-colors hover:border-white/30 hover:bg-white/10 hover:text-white"
        >
            {/* Subtle glow ring behind the icon on hover */}
            <span className="absolute inset-0 rounded-full bg-white/0 transition-colors group-hover:bg-white/5 blur-sm" />
            <div className="relative z-10">{children}</div>
        </motion.a>
    )
}

// ---------------------------------------------------------------------------
// Main Footer Component
// ---------------------------------------------------------------------------
export default function Footer() {
    const wordmarkRef = useRef<HTMLDivElement>(null)
    const [isHovering, setIsHovering] = useState(false)

    // Raw cursor position for the spotlight
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    // Snappier springs for a responsive spotlight mask
    const springX = useSpring(mouseX, { stiffness: 250, damping: 25, mass: 0.1 })
    const springY = useSpring(mouseY, { stiffness: 250, damping: 25, mass: 0.1 })

    // Spotlight mask: Softer center opacity (0.6 instead of 1.0) and smoother falloff
    const maskImage = useMotionTemplate`radial-gradient(250px circle at ${springX}px ${springY}px, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 40%, transparent 70%)`

    // Ambient glow sits behind the text and tracks the cursor (Reduced opacity to 0.03 for subtlety)
    const glowBackground = useMotionTemplate`radial-gradient(200px circle at ${springX}px ${springY}px, rgba(255,255,255,0.03), transparent 80%)`

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        const rect = wordmarkRef.current?.getBoundingClientRect()
        if (!rect) return
        mouseX.set(e.clientX - rect.left)
        mouseY.set(e.clientY - rect.top)
    }

    return (
        <footer className="relative w-full overflow-hidden text-neutral-400">
            {/* Ambient background glow — kept very subtle */}
            <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-white/[0.02] blur-[120px]" />

            <div className="relative mx-auto max-w-6xl px-6 pt-24 pb-16 sm:px-10">
                <div className="flex flex-col justify-between gap-16 lg:flex-row">
                    {/* Tagline / Brand */}
                    <div className="max-w-sm">
                        <div className="flex items-center gap-2">
                            <span className="flex h-8 w-8 items-center justify-center">
                                <Logo />
                            </span>
                            <span className="text-sm font-bold tracking-tight text-white">
                                {BRAND}
                            </span>
                        </div>

                        <h3 className="mt-8 bg-gradient-to-b from-white to-white/60 bg-clip-text text-3xl font-bold leading-tight tracking-tight text-transparent">
                            {TAGLINE}
                        </h3>
                        <p className="mt-4 text-sm font-medium leading-relaxed text-neutral-500">
                            {DESCRIPTION}
                        </p>

                        <div className="mt-8 flex items-center gap-3">
                            {SOCIALS.map(({ icon: Icon, href, label }) => (
                                <MagneticIcon key={label} href={href} label={label}>
                                    <Icon size={16} strokeWidth={1.75} />
                                </MagneticIcon>
                            ))}
                        </div>
                    </div>

                    {/* Link columns */}
                    <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 sm:gap-16">
                        {LINK_COLUMNS.map((col) => (
                            <div key={col.heading}>
                                <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-600">
                                    {col.heading}
                                </h4>
                                <ul className="mt-5 space-y-3">
                                    {col.links.map((link) => (
                                        <li key={link}>
                                            <a
                                                href="#"
                                                className="text-sm font-medium text-neutral-400 transition-colors hover:text-white"
                                            >
                                                {link}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Divider + legal row */}
                <div className="mt-20 flex flex-col items-start justify-between gap-4 border-t border-white/5 pt-8 sm:flex-row sm:items-center">
                    <span className="text-xs font-medium tracking-wide text-neutral-600">
                        © {new Date().getFullYear()} · {BRAND.toUpperCase()}, INC. · ALL RIGHTS
                        RESERVED
                    </span>
                    <div className="flex gap-4 text-xs font-medium text-neutral-600">
                        <a href="#" className="hover:text-white transition-colors">
                            Privacy Policy
                        </a>
                        <a href="#" className="hover:text-white transition-colors">
                            Terms of Service
                        </a>
                    </div>
                </div>
            </div>

            {/* ---------------------------------------------------------------- */}
            {/* Interactive Wordmark Section                                     */}
            {/* ---------------------------------------------------------------- */}
            <div
                ref={wordmarkRef}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                className="relative h-[15vw] max-h-64 min-h-32 w-full select-none overflow-hidden cursor-crosshair"
            >
                {/* Ambient glow trailing the pointer */}
                <motion.div
                    aria-hidden
                    className="pointer-events-none absolute inset-0"
                    style={{ background: glowBackground }}
                    animate={{ opacity: isHovering ? 1 : 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                />

                {/* Base layer: Outline effect (wireframe look) */}
                <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 -top-[3vw] flex justify-center whitespace-nowrap px-[2vw] text-[18vw] font-bold leading-none tracking-tighter text-transparent [-webkit-text-stroke:2px_rgba(255,255,255,0.06)]"
                >
                    {BRAND}
                </span>

                {/* Reveal layer: Dimmed white text (text-neutral-200) without the heavy drop shadow */}
                <motion.span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 -top-[3vw] flex justify-center whitespace-nowrap px-[2vw] text-[18vw] font-bold leading-none tracking-tighter text-neutral-200"
                    style={{ WebkitMaskImage: maskImage, maskImage }}
                    animate={{ opacity: isHovering ? 1 : 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                >
                    {BRAND}
                </motion.span>

                <span className="sr-only">{BRAND}</span>
            </div>
        </footer>
    )
}
