"use client"

import { ReactNode, useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { Zap, RefreshCw, HeartPulse, Route } from "lucide-react"
import FadeIn from "../animations/FadeIn"

// The main line spans this x-range and takes LINE_DURATION seconds to draw in.
// Every other element's reveal delay is derived from its x position along that
// same span, so the whole diagram appears to "scan" in behind the line. Once the
// line finishes, the whole sequence pauses for RESTART_DELAY seconds, then loops.
const LINE_START = 150
const LINE_END = 900
const LINE_DURATION = 6
const RESTART_DELAY = 2
const CYCLE_DURATION = LINE_DURATION + RESTART_DELAY
const BRAND = "#818CF8"

function delayFor(x: number) {
    const raw = ((x - LINE_START) / (LINE_END - LINE_START)) * LINE_DURATION
    return Math.min(LINE_DURATION, Math.max(0, raw))
}

// A light, faint grid behind the diagram, matching the reference's dotted/lined backdrop
function GridLines() {
    const lines = Array.from({ length: 24 }, (_, i) => i * 40)
    return (
        <g opacity={0.4}>
            {lines.map((x) => (
                <line
                    key={x}
                    x1={x}
                    y1={0}
                    x2={x}
                    y2={260}
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth={1}
                />
            ))}
        </g>
    )
}

/** Fades a group in once per mount, timed to when the scan-line would reach position x.
 *  The parent remounts this on every cycle (via a changing `key`), which is what makes
 *  the whole sequence replay instead of only ever playing once. */
function Reveal({
    x,
    extraDelay = 0,
    children,
}: {
    x: number
    extraDelay?: number
    children: ReactNode
}) {
    return (
        <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: delayFor(x) + extraDelay, ease: "easeOut" }}
        >
            {children}
        </motion.g>
    )
}

function TriggerNode({ icon: Icon }: { icon: typeof Zap }) {
    return (
        <>
            <motion.circle
                r={13}
                fill="none"
                stroke="rgba(255,255,255,0.5)"
                strokeWidth={1}
                animate={{ r: [13, 19, 13], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeOut" }}
            />
            <circle r={13} fill="#08070B" stroke="rgba(255,255,255,0.25)" strokeWidth={1.5} />
            <foreignObject x={-8} y={-8} width={16} height={16}>
                <div className="flex h-full w-full items-center justify-center text-white/80">
                    <Icon className="h-3 w-3" />
                </div>
            </foreignObject>
        </>
    )
}

function StatusDot({
    x,
    y,
    delay = 0,
    pulse = false,
}: {
    x: number
    y: number
    delay?: number
    pulse?: boolean
}) {
    return (
        <g>
            {pulse && (
                <motion.circle
                    cx={x}
                    cy={y}
                    r={4}
                    fill="#818CF8"
                    animate={{ r: [4, 10, 4], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut", delay }}
                />
            )}
            <motion.circle
                cx={x}
                cy={y}
                r={4}
                fill="#818CF8"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay, ease: "backOut" }}
            />
        </g>
    )
}

function Pill({ width, label, muted = false }: { width: number; label: string; muted?: boolean }) {
    return (
        <foreignObject x={0} y={0} width={width} height={32}>
            <div
                className={`flex h-full items-center gap-1.5 whitespace-nowrap rounded-full px-3 text-[11px] font-medium ${
                    muted ? "bg-white/10 text-white/60" : "bg-white text-black"
                }`}
            >
                <Route className="h-3 w-3 shrink-0" />
                {label}
            </div>
        </foreignObject>
    )
}

function Label({ children }: { children: ReactNode }) {
    return <div className="whitespace-nowrap font-mono text-[9px] text-white/35">{children}</div>
}

/** Everything that scans in. Remounted on a fresh `key` every cycle so it always
 *  replays from a clean initial state instead of drifting out of sync over time. */
function DiagramContent() {
    const mainY = 180

    return (
        <>
            {/* Main traffic line — draws itself left to right, everything else cascades in behind it */}
            <motion.line
                x1={LINE_START}
                y1={mainY}
                x2={LINE_END}
                y2={mainY}
                stroke={BRAND}
                strokeWidth={2.5}
                strokeLinecap="round"
                opacity={0.85}
                style={{ filter: `drop-shadow(0 0 6px ${BRAND})` }}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: LINE_DURATION, ease: "easeInOut" }}
            />

            {/* "Live traffic" origin pill */}
            <Reveal x={6}>
                <g transform="translate(6, 164)">
                    <Pill width={135} label="live traffic" />
                </g>
            </Reveal>

            {/* ---------------- Branch 1: Primary provider (completed) ---------------- */}
            <Reveal x={250}>
                <g transform="translate(250, 180)">
                    <TriggerNode icon={Zap} />
                </g>
                <path
                    d="M250,180 C250,150 290,120 330,120"
                    fill="none"
                    stroke="rgba(255,255,255,0.18)"
                    strokeWidth={1.5}
                    strokeDasharray="3 4"
                />
            </Reveal>
            <Reveal x={330}>
                <g transform="translate(330, 104)">
                    <Pill width={172} label="primary · claude-sonnet-4.5" />
                </g>
            </Reveal>
            <Reveal x={502}>
                <line
                    x1={502}
                    y1={120}
                    x2={636}
                    y2={120}
                    stroke="rgba(255,255,255,0.18)"
                    strokeWidth={1.5}
                />
            </Reveal>
            <StatusDot x={550} y={120} delay={delayFor(550)} />
            <StatusDot x={604} y={120} delay={delayFor(604)} />
            <Reveal x={575}>
                <foreignObject x={520} y={92} width={110} height={16}>
                    <div className="text-center">
                        <Label>dispatched</Label>
                    </div>
                </foreignObject>
            </Reveal>
            <Reveal x={627}>
                <foreignObject x={572} y={92} width={110} height={16}>
                    <div className="text-center">
                        <Label>streamed</Label>
                    </div>
                </foreignObject>
            </Reveal>
            <Reveal x={719}>
                <foreignObject x={644} y={112} width={150} height={16}>
                    <Label>connection closed</Label>
                </foreignObject>
            </Reveal>

            {/* ---------------- Branch 2: Secondary model, still streaming past the edge ---------------- */}
            <Reveal x={680}>
                <g transform="translate(680, 180)">
                    <TriggerNode icon={RefreshCw} />
                </g>
                <path
                    d="M680,180 C680,150 720,120 760,120"
                    fill="none"
                    stroke="rgba(129,140,248,0.4)"
                    strokeWidth={1.5}
                    strokeDasharray="3 4"
                />
            </Reveal>
            <Reveal x={760}>
                <g transform="translate(760, 104)">
                    <Pill width={162} label="retry · gpt-oss-20b" />
                </g>
            </Reveal>
            <Reveal x={922}>
                <motion.line
                    x1={922}
                    y1={120}
                    x2={1040}
                    y2={120}
                    stroke="#818CF8"
                    strokeWidth={1.5}
                    strokeDasharray="3 4"
                    animate={{ strokeDashoffset: [0, -14] }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
            </Reveal>
            <StatusDot x={950} y={120} delay={delayFor(950)} pulse />
            <Reveal x={922}>
                <foreignObject x={922} y={92} width={130} height={16}>
                    <div className="font-mono text-[9px] text-indigo-300/70">streaming…</div>
                </foreignObject>
            </Reveal>

            {/* ---------------- Branch 3: Fallback provider, on standby ---------------- */}
            <Reveal x={460}>
                <g transform="translate(460, 180)">
                    <TriggerNode icon={HeartPulse} />
                </g>
                <path
                    d="M460,180 C460,210 500,240 540,240"
                    fill="none"
                    stroke="rgba(255,255,255,0.12)"
                    strokeWidth={1.5}
                    strokeDasharray="3 4"
                />
            </Reveal>
            <Reveal x={540}>
                <g transform="translate(540, 224)">
                    <Pill width={172} label="fallback · mistral-large" muted />
                </g>
            </Reveal>
            <Reveal x={712}>
                <line
                    x1={712}
                    y1={240}
                    x2={828}
                    y2={240}
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth={1.5}
                />
            </Reveal>
            <StatusDot x={748} y={240} delay={delayFor(748)} />
            <StatusDot x={792} y={240} delay={delayFor(792)} />
            <Reveal x={772}>
                <foreignObject x={722} y={212} width={100} height={16}>
                    <div className="text-center">
                        <Label>health check</Label>
                    </div>
                </foreignObject>
            </Reveal>
            <Reveal x={820}>
                <foreignObject x={775} y={212} width={90} height={16}>
                    <div className="text-center">
                        <Label>passed</Label>
                    </div>
                </foreignObject>
            </Reveal>
            <Reveal x={884}>
                <foreignObject x={834} y={232} width={100} height={16}>
                    <div className="font-mono text-[10px] text-white/25">standing by</div>
                </foreignObject>
            </Reveal>

            {/* Timestamp ticks under the main line */}
            {[
                { x: 250, label: "t+0ms" },
                { x: 460, label: "t+40ms" },
                { x: 680, label: "t+180ms" },
            ].map((tick) => (
                <Reveal key={tick.x} x={tick.x}>
                    <line
                        x1={tick.x}
                        y1={mainY + 14}
                        x2={tick.x}
                        y2={mainY + 22}
                        stroke="rgba(255,255,255,0.15)"
                        strokeWidth={1}
                    />
                    <foreignObject x={tick.x - 40} y={mainY + 26} width={80} height={16}>
                        <div className="text-center font-mono text-[9px] text-white/30">
                            {tick.label}
                        </div>
                    </foreignObject>
                </Reveal>
            ))}
        </>
    )
}

function RoutingDiagram() {
    const containerRef = useRef<HTMLDivElement>(null)
    const inView = useInView(containerRef, { once: true, margin: "-100px" })
    const [cycle, setCycle] = useState(0)

    useEffect(() => {
        if (!inView) return
        const interval = setInterval(() => {
            setCycle((c) => c + 1)
        }, CYCLE_DURATION * 1000)
        return () => clearInterval(interval)
    }, [inView])

    return (
        <div
            ref={containerRef}
            className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/2 p-4 sm:p-8"
        >
            <svg
                viewBox="0 0 940 260"
                className="w-full"
                role="img"
                aria-label="Request routing and failover diagram"
            >
                <GridLines />
                {inView && <g key={cycle}>{<DiagramContent />}</g>}
            </svg>
        </div>
    )
}

const RESILIENCE_POINTS = [
    {
        icon: Zap,
        title: "Automatic Failover",
        description:
            "The moment a provider errors, times out, or gets rate-limited, your request reroutes to the next best option — no retry logic to write.",
    },
    {
        icon: RefreshCw,
        title: "Smart Load Balancing",
        description:
            "Traffic spreads across providers based on live latency and price, so you always land on the fastest option within your budget.",
    },
    {
        icon: HeartPulse,
        title: "Zero-Config Retries",
        description:
            "Transient failures are retried against a different provider automatically, invisible to your application code.",
    },
]

export default function LiveRouting() {
    return (
        <section className="border-t border-white/5 py-24">
            <div className="mx-auto max-w-6xl px-6">
                <FadeIn className="max-w-3xl">
                    <div className="mb-3 flex items-center gap-3">
                        <span className="text-xs font-semibold uppercase tracking-widest text-indigo-300/70">
                            Built for resilience
                        </span>
                    </div>
                    <h2 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                        <span className="text-white">Instant failover. </span>
                        <span className="text-white/45">
                            Automatically reroute traffic to backup providers within milliseconds,
                            so downtime never reaches your users.
                        </span>
                    </h2>
                </FadeIn>

                <FadeIn delay={0.1} className="mt-10">
                    <RoutingDiagram />
                </FadeIn>

                <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
                    {RESILIENCE_POINTS.map((point, i) => (
                        <FadeIn key={point.title} delay={0.15 + i * 0.05}>
                            <div>
                                <div className="flex items-center gap-2">
                                    <point.icon className="h-3.5 w-3.5 text-white/60" />
                                    <h3 className="text-sm font-semibold text-white">
                                        {point.title}
                                    </h3>
                                </div>
                                <p className="mt-2 text-sm leading-relaxed text-white/45">
                                    {point.description}
                                </p>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    )
}
