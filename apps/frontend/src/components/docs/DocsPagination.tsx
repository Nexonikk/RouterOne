"use client"

import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"
import type { SidebarGroup } from "@/types/docs"

interface DocsPaginationProps {
    groups: SidebarGroup[]
    activeSlug: string
}

export default function DocsPagination({ groups, activeSlug }: DocsPaginationProps) {
    const pages = groups.flatMap((group) => group.links)

    const currentIndex = pages.findIndex((page) => page.slug === activeSlug)

    if (currentIndex === -1) {
        return null
    }

    const previousPage = currentIndex > 0 ? pages[currentIndex - 1] : null

    const nextPage = currentIndex < pages.length - 1 ? pages[currentIndex + 1] : null

    if (!previousPage && !nextPage) {
        return null
    }

    return (
        <nav
            aria-label="Documentation pagination"
            className="mt-14 flex items-center justify-between border-t border-white/[0.06] pt-6"
        >
            {/* Previous */}
            {previousPage ? (
                <Link
                    href={`/docs/${previousPage.slug}`}
                    className="group flex min-w-0 items-center gap-2.5"
                >
                    <ArrowLeft className="size-4 shrink-0 text-zinc-600 transition-all duration-200 group-hover:-translate-x-0.5 group-hover:text-indigo-400" />

                    <span className="min-w-0">
                        <span className="block text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-600">
                            Previous
                        </span>

                        <span className="mt-0.5 block truncate text-sm font-medium text-zinc-400 transition-colors group-hover:text-white">
                            {previousPage.label}
                        </span>
                    </span>
                </Link>
            ) : (
                <div />
            )}

            {/* Next */}
            {nextPage ? (
                <Link
                    href={`/docs/${nextPage.slug}`}
                    className="group flex min-w-0 items-center gap-2.5 text-right"
                >
                    <span className="min-w-0">
                        <span className="block text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-600">
                            Next
                        </span>

                        <span className="mt-0.5 block truncate text-sm font-medium text-zinc-400 transition-colors group-hover:text-white">
                            {nextPage.label}
                        </span>
                    </span>

                    <ArrowRight className="size-4 shrink-0 text-zinc-600 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-indigo-400" />
                </Link>
            ) : (
                <div />
            )}
        </nav>
    )
}
