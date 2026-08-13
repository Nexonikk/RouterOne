"use client"

import Link from "next/link"
import { ArrowRight, Coins, Key, Layers, Plus } from "lucide-react"

import { DashboardLayout } from "@/components/DashboardLayout"
import { PageHeader } from "@/components/dashboard/PageHeader"
import { StatCard } from "@/components/dashboard/StatCard"
import { StatusBadge } from "@/components/dashboard/StatusBadge"
import { TableShell, Th, Td } from "@/components/dashboard/Table"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useApiKeys } from "@/hooks/useApiKeys"
import { useModels } from "@/hooks/useModels"
import { formatCredits, getCreditsUsed, maskApiKey } from "@/lib/format"

const RECENT_KEYS_LIMIT = 5

export default function Dashboard() {
    const apiKeysQuery = useApiKeys()
    const modelsQuery = useModels()

    const apiKeys = apiKeysQuery.data?.apiKeys ?? []
    const activeKeys = apiKeys.filter((key) => !key.disabled)
    const totalCreditsUsed = apiKeys.reduce((sum, key) => sum + getCreditsUsed(key), 0)
    const modelCount = modelsQuery.data?.models?.length ?? 0

    return (
        <DashboardLayout>
            <div className="space-y-10">
                <PageHeader title="Dashboard" description="Overview of your RouterOne account." />

                {/* Stats */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <StatCard
                        label="Active API keys"
                        value={activeKeys.length}
                        caption={`${apiKeys.length} total`}
                        icon={Key}
                        isLoading={apiKeysQuery.isLoading}
                    />

                    <StatCard
                        label="Credits used"
                        value={formatCredits(totalCreditsUsed)}
                        caption="Across all keys"
                        icon={Coins}
                        isLoading={apiKeysQuery.isLoading}
                    />

                    <StatCard
                        label="Available models"
                        value={modelCount}
                        caption="From all providers"
                        icon={Layers}
                        isLoading={modelsQuery.isLoading}
                    />
                </div>

                {/* Quick actions */}
                <div>
                    <div className="mb-4">
                        <h2 className="text-sm font-semibold text-white">Quick actions</h2>
                        <p className="mt-1 text-xs text-zinc-500">Manage your RouterOne account.</p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <QuickAction
                            icon={Plus}
                            title="Create API key"
                            description="Generate a new key to start making requests."
                            href="/api-keys"
                        />

                        <QuickAction
                            icon={Coins}
                            title="Add credits"
                            description="Top up your balance to keep making requests."
                            href="/credits"
                        />
                    </div>
                </div>

                {/* API keys */}
                {apiKeys.length > 0 && (
                    <section>
                        <div className="mb-4 flex items-end justify-between">
                            <div>
                                <h2 className="text-sm font-semibold text-white">Your API keys</h2>
                                <p className="mt-1 text-xs text-zinc-500">
                                    Recently used API keys and their status.
                                </p>
                            </div>

                            <Button
                                variant="ghost"
                                size="sm"
                                asChild
                                className="text-zinc-400 hover:bg-white/[0.05] hover:text-white"
                            >
                                <Link href="/api-keys" className="text-xs">
                                    View all
                                    <ArrowRight className="size-3" />
                                </Link>
                            </Button>
                        </div>

                        <div className="overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.018] shadow-[0_10px_40px_rgba(0,0,0,0.15)]">
                            <TableShell>
                                <thead>
                                    <tr className="border-b border-white/[0.07] bg-white/[0.02]">
                                        <Th>Name</Th>
                                        <Th>Key</Th>
                                        <Th>Status</Th>
                                        <Th align="right">Credits used</Th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {apiKeys.slice(0, RECENT_KEYS_LIMIT).map((key) => (
                                        <tr
                                            key={key.id}
                                            className="border-b border-white/[0.045] transition-colors last:border-0 hover:bg-white/[0.025]"
                                        >
                                            <Td className="font-medium text-zinc-200">
                                                {key.name}
                                            </Td>

                                            <Td className="font-mono text-xs text-zinc-500">
                                                {maskApiKey(key.apiKey, false)}
                                            </Td>

                                            <Td>
                                                <StatusBadge active={!key.disabled} />
                                            </Td>

                                            <Td align="right">
                                                {formatCredits(getCreditsUsed(key))}
                                            </Td>
                                        </tr>
                                    ))}
                                </tbody>
                            </TableShell>
                        </div>
                    </section>
                )}
            </div>
        </DashboardLayout>
    )
}

function QuickAction({
    icon: Icon,
    title,
    description,
    href,
}: {
    icon: typeof Plus
    title: string
    description: string
    href: string
}) {
    return (
        <Card className="group relative overflow-hidden border-white/[0.07] bg-white/[0.018] transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-400/20 hover:bg-white/[0.03] hover:shadow-[0_12px_40px_rgba(0,0,0,0.2)]">
            {/* Subtle hover glow */}
            <div className="pointer-events-none absolute -right-16 -top-16 size-32 rounded-full bg-indigo-500/[0.07] opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-100" />

            <CardContent className="relative p-5">
                <div className="flex items-start justify-between gap-5">
                    <div className="min-w-0">
                        <div className="mb-4 flex size-10 items-center justify-center rounded-xl border border-indigo-400/10 bg-indigo-500/[0.08]">
                            <Icon className="size-[18px] text-indigo-400" />
                        </div>

                        <h3 className="text-sm font-semibold text-zinc-100">{title}</h3>

                        <p className="mt-1.5 max-w-sm text-xs leading-5 text-zinc-500">
                            {description}
                        </p>
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="shrink-0 border-white/[0.08] bg-white/[0.02] text-zinc-400 hover:border-indigo-400/20 hover:bg-indigo-500/[0.08] hover:text-indigo-300"
                    >
                        <Link href={href}>
                            Go
                            <ArrowRight className="size-3.5" />
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
