"use client"

import { useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useQuery } from "@tanstack/react-query"
import { Search, X, SlidersHorizontal, PackageSearch } from "lucide-react"
import { useElysiaClient } from "@/providers/Eden"
import FadeIn from "../animations/FadeIn"
import ModelCard from "./ModelCard"
import { Model } from "@/types/Model"

function SkeletonGrid() {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }, (_, i) => (
                <div
                    key={i}
                    className="animate-pulse rounded-2xl border border-white/10 bg-white/[0.02] p-5"
                >
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 shrink-0 rounded-lg bg-white/5" />
                        <div className="flex-1 space-y-2">
                            <div className="h-3 w-3/4 rounded bg-white/5" />
                            <div className="h-2.5 w-1/3 rounded bg-white/5" />
                        </div>
                    </div>
                    <div className="mt-4 h-8 rounded-lg bg-white/[0.03]" />
                </div>
            ))}
        </div>
    )
}

function EmptyState({ onClear }: { onClear: () => void }) {
    return (
        <FadeIn className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-white/10 py-20 text-center">
            <PackageSearch className="h-8 w-8 text-white/20" />
            <p className="text-sm font-medium text-white/60">No models match your filters</p>
            <p className="text-sm text-white/35">
                Try a different search term or clear the provider filters.
            </p>
            <button
                type="button"
                onClick={onClear}
                className="mt-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-medium text-white/70 transition-colors hover:border-white/20 hover:text-white"
            >
                Clear filters
            </button>
        </FadeIn>
    )
}

export default function ModelsExplorer() {
    const elysiaClient = useElysiaClient() as any

    const modelsQuery = useQuery({
        queryKey: ["models"],
        queryFn: async () => {
            const response = await elysiaClient.models.get()
            if (response.error) return null
            return response.data
        },
    })

    const models: Model[] = modelsQuery.data?.models ?? []

    const [search, setSearch] = useState("")
    const [selectedProviders, setSelectedProviders] = useState<Set<string>>(new Set())

    const providers = useMemo(() => {
        const counts = new Map<string, number>()
        models.forEach((m) => counts.set(m.company.name, (counts.get(m.company.name) ?? 0) + 1))
        return Array.from(counts.entries()).sort((a, b) => a[0].localeCompare(b[0]))
    }, [models])

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase()
        return models
            .filter((m) => selectedProviders.size === 0 || selectedProviders.has(m.company.name))
            .filter(
                (m) => !q || m.name.toLowerCase().includes(q) || m.slug.toLowerCase().includes(q),
            )
            .sort((a, b) => a.name.localeCompare(b.name))
    }, [models, search, selectedProviders])

    const toggleProvider = (name: string) => {
        setSelectedProviders((prev) => {
            const next = new Set(prev)
            if (next.has(name)) {
                next.delete(name)
            } else {
                next.add(name)
            }
            return next
        })
    }

    const clearFilters = () => {
        setSearch("")
        setSelectedProviders(new Set())
    }

    const hasActiveFilters = search.length > 0 || selectedProviders.size > 0

    return (
        <section className="relative pt-36 pb-24">
            <div className="mx-auto max-w-6xl px-6">
                <FadeIn className="max-w-2xl">
                    <span className="text-xs font-semibold uppercase tracking-widest text-indigo-300/70">
                        Model catalog
                    </span>
                    <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                        All models
                    </h1>
                    <p className="mt-4 text-lg leading-relaxed text-white/50">
                        Browse every model available through RouterOne. Search by name, filter by
                        provider, and copy the slug straight into your code.
                    </p>
                </FadeIn>

                <FadeIn delay={0.1} className="mt-10 flex flex-col gap-4">
                    <div className="relative">
                        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search models or slugs…"
                            className="h-12 w-full rounded-full border border-white/10 bg-white/[0.03] pl-11 pr-11 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-indigo-400/40 focus:bg-white/[0.05]"
                        />
                        {search && (
                            <button
                                type="button"
                                onClick={() => setSearch("")}
                                aria-label="Clear search"
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 transition-colors hover:text-white"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-white/40">
                            <SlidersHorizontal className="h-3.5 w-3.5" />
                            Provider
                        </span>
                        <button
                            type="button"
                            onClick={() => setSelectedProviders(new Set())}
                            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                                selectedProviders.size === 0
                                    ? "border-indigo-400/40 bg-indigo-500/10 text-indigo-200"
                                    : "border-white/10 bg-white/[0.02] text-white/50 hover:border-white/20 hover:text-white"
                            }`}
                        >
                            All <span className="text-white/30">· {models.length}</span>
                        </button>
                        {providers.map(([name, count]) => {
                            const active = selectedProviders.has(name)
                            return (
                                <button
                                    key={name}
                                    type="button"
                                    onClick={() => toggleProvider(name)}
                                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                                        active
                                            ? "border-indigo-400/40 bg-indigo-500/10 text-indigo-200"
                                            : "border-white/10 bg-white/[0.02] text-white/50 hover:border-white/20 hover:text-white"
                                    }`}
                                >
                                    {name} <span className="text-white/30">· {count}</span>
                                </button>
                            )
                        })}
                        {hasActiveFilters && (
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="text-xs font-medium text-white/40 underline-offset-2 transition-colors hover:text-white hover:underline"
                            >
                                Clear all
                            </button>
                        )}
                    </div>
                </FadeIn>

                <div className="mt-8 text-xs text-white/35">
                    {modelsQuery.isLoading
                        ? "Loading models…"
                        : `${filtered.length} of ${models.length} models`}
                </div>

                <div className="mt-4">
                    {modelsQuery.isLoading ? (
                        <SkeletonGrid />
                    ) : filtered.length === 0 ? (
                        <EmptyState onClear={clearFilters} />
                    ) : (
                        <motion.div
                            layout
                            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
                        >
                            <AnimatePresence mode="popLayout">
                                {filtered.map((m) => (
                                    <ModelCard key={m.id} model={m} />
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </div>
            </div>
        </section>
    )
}
