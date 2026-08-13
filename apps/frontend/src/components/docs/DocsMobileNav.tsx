"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { SidebarGroup } from "@/types/docs"

export default function DocsMobileNav({
    groups,
    activeSlug,
}: {
    groups: SidebarGroup[]
    activeSlug: string
}) {
    const router = useRouter()
    const [open, setOpen] = useState(false)

    const allLinks = groups.flatMap((group) => group.links)
    const activeLink = allLinks.find((link) => link.slug === activeSlug)

    const handleNavigate = (slug: string) => {
        setOpen(false)
        router.push(`/docs/${slug}`)
    }

    return (
        <div className="mb-7 lg:hidden">
            <div className="relative">
                {/* Current page */}
                <button
                    type="button"
                    onClick={() => setOpen((prev) => !prev)}
                    aria-expanded={open}
                    className="group flex w-full items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.035] px-3.5 py-3 text-left shadow-sm transition-all duration-200 hover:border-white/[0.13] hover:bg-white/[0.055]"
                >
                    <div className="min-w-0">
                        <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-600">
                            Documentation
                        </div>

                        <div className="truncate text-[13.5px] font-medium text-zinc-200">
                            {activeLink?.label ?? "Browse documentation"}
                        </div>
                    </div>

                    <div
                        className={`ml-4 flex size-7 shrink-0 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.035] text-zinc-500 transition-all duration-200 ${
                            open
                                ? "rotate-180 border-indigo-400/20 bg-indigo-500/10 text-indigo-400"
                                : "group-hover:text-zinc-300"
                        }`}
                    >
                        <ChevronIcon className="size-3.5" />
                    </div>
                </button>

                {open && (
                    <>
                        {/* Backdrop */}
                        <button
                            type="button"
                            aria-label="Close documentation navigation"
                            onClick={() => setOpen(false)}
                            className="fixed inset-0 z-40 cursor-default bg-black/20 backdrop-blur-[1px]"
                        />

                        {/* Navigation sheet */}
                        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-2xl border border-white/[0.09] bg-[#0b0a0f] shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
                            {/* Subtle glow */}
                            <div className="pointer-events-none absolute -top-20 left-1/2 h-32 w-64 -translate-x-1/2 rounded-full bg-indigo-500/[0.08] blur-3xl" />

                            <div className="relative max-h-[60vh] overflow-y-auto p-2">
                                {groups.map((group) => (
                                    <div key={group.title} className="mb-2 last:mb-0">
                                        {/* Group title */}
                                        <div className="px-3 pb-1.5 pt-2.5">
                                            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-600">
                                                {group.title}
                                            </span>
                                        </div>

                                        {/* Group links */}
                                        <div className="space-y-0.5">
                                            {group.links.map((link) => {
                                                const isActive = link.slug === activeSlug

                                                return (
                                                    <button
                                                        key={`${link.slug}-${link.label}`}
                                                        type="button"
                                                        onClick={() => handleNavigate(link.slug)}
                                                        className={`group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition-all duration-150 ${
                                                            isActive
                                                                ? "bg-indigo-500/[0.10] text-indigo-300"
                                                                : "text-zinc-400 hover:bg-white/[0.05] hover:text-zinc-200"
                                                        }`}
                                                    >
                                                        <span className="flex min-w-0 items-center gap-2.5">
                                                            <span
                                                                className={`size-1.5 shrink-0 rounded-full transition-colors ${
                                                                    isActive
                                                                        ? "bg-indigo-400"
                                                                        : "bg-zinc-700 group-hover:bg-zinc-500"
                                                                }`}
                                                            />

                                                            <span className="truncate text-[13px] font-medium">
                                                                {link.label}
                                                            </span>
                                                        </span>

                                                        {isActive && (
                                                            <span className="ml-3 shrink-0 text-[10px] font-medium text-indigo-400/70">
                                                                Current
                                                            </span>
                                                        )}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
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
