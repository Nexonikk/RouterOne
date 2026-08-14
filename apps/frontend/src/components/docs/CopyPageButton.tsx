"use client"

import { useState } from "react"

type CopyPageButtonProps = {
    content: string
}

export default function CopyPageButton({ content }: CopyPageButtonProps) {
    const [copied, setCopied] = useState(false)
    const [open, setOpen] = useState(false)

    async function copyText(text: string) {
        try {
            await navigator.clipboard.writeText(text)

            setCopied(true)
            setOpen(false)

            window.setTimeout(() => {
                setCopied(false)
            }, 2000)
        } catch (error) {
            console.error("Failed to copy page:", error)
        }
    }

    return (
        <div className="relative flex shrink-0 items-stretch">
            <div className="flex overflow-hidden rounded-lg border border-white/10 bg-white/[0.04]">
                <button
                    type="button"
                    onClick={() => copyText(content)}
                    className="flex items-center gap-2 px-3.5 py-2 text-[13px] font-medium text-zinc-300 transition-colors hover:bg-white/[0.06]"
                >
                    {copied ? (
                        <CheckIcon className="h-4 w-4 text-emerald-400" />
                    ) : (
                        <CopyIcon className="h-4 w-4" />
                    )}

                    {copied ? "Copied" : "Copy page"}
                </button>

                <button
                    type="button"
                    aria-label="More export options"
                    aria-expanded={open}
                    onClick={() => setOpen((value) => !value)}
                    className="flex items-center border-l border-white/10 px-2 text-zinc-500 transition-colors hover:bg-white/[0.06] hover:text-zinc-300"
                >
                    <ChevronIcon
                        className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
                    />
                </button>
            </div>

            {open && (
                <div className="absolute right-0 top-full z-50 mt-2 w-40 overflow-hidden rounded-lg border border-white/10 bg-zinc-950 p-1 shadow-xl">
                    <button
                        type="button"
                        onClick={() => copyText(content)}
                        className="flex w-full items-center rounded-md px-3 py-2 text-left text-[13px] text-zinc-300 transition-colors hover:bg-white/[0.06] hover:text-white"
                    >
                        Copy page
                    </button>
                </div>
            )}
        </div>
    )
}

function CopyIcon({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <rect x="9" y="9" width="11" height="11" rx="1.5" />
            <path d="M5 15V6a1.5 1.5 0 0 1 1.5-1.5H15" />
        </svg>
    )
}

function CheckIcon({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="m5 12 4 4L19 6" />
        </svg>
    )
}

function ChevronIcon({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="m6 9 6 6 6-6" />
        </svg>
    )
}
