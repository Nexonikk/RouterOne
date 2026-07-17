"use client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useElysiaClient } from "@/providers/Eden"
import { DashboardLayout } from "@/components/DashboardLayout"
import { PageHeader } from "@/components/dashboard/PageHeader"
import { StatCard } from "@/components/dashboard/StatCard"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useApiKeys, apiKeysQueryKey } from "@/hooks/useApiKeys"
import { useUserProfile, userProfileQueryKey } from "@/hooks/useUserProfile"
import { formatCredits, getCreditsUsed } from "@/lib/format"
import { Coins, Plus, Loader2, CheckCircle2, AlertCircle, TrendingUp } from "lucide-react"

const TOP_UP_AMOUNT = 1000
const KEY_BREAKDOWN_LIMIT = 4

export default function Credits() {
    const elysiaClient = useElysiaClient()
    const queryClient = useQueryClient()

    const apiKeysQuery = useApiKeys()
    const userProfileQuery = useUserProfile()

    const onrampMutation = useMutation({
        mutationFn: async () => {
            const response = await elysiaClient.payments.onramp.post()
            if (response.error) {
                const errValue = response.error.value as { message?: string } | undefined
                throw new Error(errValue?.message || "Failed to add credits")
            }
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: apiKeysQueryKey })
            queryClient.invalidateQueries({ queryKey: userProfileQueryKey })
        },
    })

    const apiKeys = apiKeysQuery.data?.apiKeys ?? []

    return (
        <DashboardLayout>
            <div className="space-y-10">
                <PageHeader
                    title="Credits"
                    description="Manage your account balance and add credits."
                />

                {onrampMutation.isSuccess && onrampMutation.data && (
                    <Card className="border-emerald-500/20 bg-card/50">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="flex size-10 items-center justify-center rounded-full bg-emerald-500/10">
                                    <Coins className="size-5 text-emerald-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-emerald-400">
                                        Current balance
                                    </p>
                                    <p className="text-3xl font-semibold tracking-tight tabular-nums">
                                        {formatCredits(onrampMutation.data.credits)} credits
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <StatCard
                        label="Credits available"
                        value={formatCredits(userProfileQuery.data?.credits)}
                        caption={`Across ${apiKeys.length} API key${apiKeys.length !== 1 ? "s" : ""}`}
                        icon={TrendingUp}
                        isLoading={userProfileQuery.isLoading}
                    />

                    <Card className="border-border/50 bg-card/50">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                    Per-key breakdown
                                </span>
                                <Coins className="size-4 text-muted-foreground/60" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            {apiKeysQuery.isLoading ? (
                                <Loader2 className="size-5 animate-spin text-muted-foreground" />
                            ) : apiKeys.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No API keys yet</p>
                            ) : (
                                <div className="space-y-2">
                                    {apiKeys.slice(0, KEY_BREAKDOWN_LIMIT).map((key) => (
                                        <div
                                            key={key.id}
                                            className="flex items-center justify-between text-sm"
                                        >
                                            <span className="mr-4 truncate text-muted-foreground">
                                                {key.name}
                                            </span>
                                            <span className="tabular-nums font-medium">
                                                {formatCredits(getCreditsUsed(key))}
                                            </span>
                                        </div>
                                    ))}
                                    {apiKeys.length > KEY_BREAKDOWN_LIMIT && (
                                        <p className="text-xs text-muted-foreground">
                                            +{apiKeys.length - KEY_BREAKDOWN_LIMIT} more
                                        </p>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <Card className="border-border/50 bg-card/30">
                    <CardHeader>
                        <CardTitle className="text-lg">Add credits</CardTitle>
                        <CardDescription>
                            Top up your account with {TOP_UP_AMOUNT.toLocaleString()} credits per
                            transaction.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                            <div className="flex flex-1 items-center gap-3 rounded-lg border border-border/50 bg-card/50 px-4 py-3">
                                <Coins className="size-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">
                                        {TOP_UP_AMOUNT.toLocaleString()} credits
                                    </p>
                                    <p className="text-xs text-muted-foreground">Standard top-up</p>
                                </div>
                            </div>

                            <Button
                                size="lg"
                                className="h-12 px-6"
                                onClick={() => onrampMutation.mutate()}
                                disabled={onrampMutation.isPending}
                            >
                                {onrampMutation.isPending ? (
                                    <>
                                        <Loader2 className="size-4 animate-spin" />
                                        Processing…
                                    </>
                                ) : (
                                    <>
                                        <Plus className="size-4" />
                                        Add credits
                                    </>
                                )}
                            </Button>
                        </div>

                        {onrampMutation.isSuccess && (
                            <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-3 text-sm text-emerald-400">
                                <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
                                <span>
                                    {TOP_UP_AMOUNT.toLocaleString()} credits added. New balance:{" "}
                                    {formatCredits(onrampMutation.data?.credits)} credits.
                                </span>
                            </div>
                        )}

                        {onrampMutation.isError && (
                            <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-destructive/20 bg-destructive/10 px-3.5 py-3 text-sm text-destructive">
                                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                                <span>
                                    {onrampMutation.error?.message ||
                                        "Failed to add credits. Please try again."}
                                </span>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}
