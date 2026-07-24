"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Copy, Check } from "lucide-react"
import { Model } from "@/types/Model"

const AVATAR_GRADIENTS = [
    "from-indigo-400 to-fuchsia-500",
    "from-emerald-400 to-teal-500",
    "from-orange-400 to-rose-500",
    "from-sky-400 to-blue-500",
    "from-violet-400 to-purple-500",
    "from-amber-400 to-orange-500",
]

// Deterministic pick so the same company always gets the same fallback color
function gradientFor(name: string) {
    const hash = Array.from(name).reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
    return AVATAR_GRADIENTS[hash % AVATAR_GRADIENTS.length]
}

export default function ModelCard({ model }: { model: Model }) {
    const [imgError, setImgError] = useState(false)
    const [copied, setCopied] = useState(false)

    const handleCopy = async (e: React.MouseEvent) => {
        e.preventDefault()
        try {
            await navigator.clipboard.writeText(model.slug)
        } catch {
            // Clipboard access can be blocked; the button still acknowledges the click below.
        }
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
    }

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -3 }}
            className="group flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition-colors hover:border-white/20 hover:bg-white/[0.04]"
        >
            <div className="flex items-center gap-3">
                {!imgError ? (
                    <img
                        src={model.company.logo}
                        alt=""
                        onError={() => setImgError(true)}
                        className="h-9 w-9 shrink-0 rounded-lg bg-white/5 object-contain p-1.5"
                    />
                ) : (
                    <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-sm font-bold text-white ${gradientFor(
                            model.company.name,
                        )}`}
                    >
                        {model.company.name.charAt(0)}
                    </div>
                )}
                <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">{model.name}</p>
                    <a
                        href={model.company.website}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs text-white/40 transition-colors hover:text-white/70"
                    >
                        {model.company.name}
                    </a>
                </div>
            </div>

            <button
                type="button"
                onClick={handleCopy}
                className="mt-4 flex items-center justify-between gap-2 rounded-lg border border-white/10 bg-black/30 px-3 py-2 font-mono text-xs text-white/50 transition-colors hover:border-white/20 hover:text-white"
            >
                <span className="truncate">{model.slug}</span>
                {copied ? (
                    <Check className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                ) : (
                    <Copy className="h-3.5 w-3.5 shrink-0 opacity-50 transition-opacity group-hover:opacity-100" />
                )}
            </button>
        </motion.div>
    )
}
