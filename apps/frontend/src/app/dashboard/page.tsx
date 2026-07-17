"use client"
import Link from "next/link"
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
import { Key, Coins, Plus, ArrowRight, Layers } from "lucide-react"

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

                {apiKeys.length > 0 && (
                    <section>
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-sm font-semibold text-foreground">Your API keys</h2>
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/api-keys" className="text-xs">
                                    View all
                                    <ArrowRight className="size-3" />
                                </Link>
                            </Button>
                        </div>
                        <TableShell>
                            <thead>
                                <tr className="border-b border-border/50">
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
                                        className="border-b border-border/30 last:border-0"
                                    >
                                        <Td className="font-medium text-foreground">{key.name}</Td>
                                        <Td className="font-mono text-xs text-muted-foreground">
                                            {maskApiKey(key.apiKey, false)}
                                        </Td>
                                        <Td>
                                            <StatusBadge active={!key.disabled} />
                                        </Td>
                                        <Td align="right">{formatCredits(getCreditsUsed(key))}</Td>
                                    </tr>
                                ))}
                            </tbody>
                        </TableShell>
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
        <Card className="border-border/40 bg-card/30 transition-colors hover:border-border/70">
            <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <div className="mb-3 flex size-10 items-center justify-center rounded-lg border border-border/50 bg-foreground/5">
                            <Icon className="size-5 text-muted-foreground" />
                        </div>
                        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
                        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
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
