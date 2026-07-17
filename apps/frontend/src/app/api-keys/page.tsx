"use client"
import { useRef, useState } from "react"
import type { FormEvent } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useElysiaClient } from "@/providers/Eden"
import { DashboardLayout } from "@/components/DashboardLayout"
import { PageHeader } from "@/components/dashboard/PageHeader"
import { EmptyState } from "@/components/dashboard/EmptyState"
import { StatusBadge } from "@/components/dashboard/StatusBadge"
import { TableShell, Th, Td } from "@/components/dashboard/Table"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useApiKeys, apiKeysQueryKey, type ApiKey } from "@/hooks/useApiKeys"
import { formatCredits, getCreditsUsed, maskApiKey } from "@/lib/format"
import {
    Plus,
    Loader2,
    CheckCircle2,
    AlertCircle,
    Copy,
    Trash2,
    ToggleLeft,
    ToggleRight,
    Key,
    Eye,
    EyeOff,
} from "lucide-react"

export default function ApiKeys() {
    const elysiaClient = useElysiaClient()
    const queryClient = useQueryClient()
    const nameRef = useRef<HTMLInputElement>(null)
    const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null)
    const [copiedId, setCopiedId] = useState<string | null>(null)
    const [revealedKeys, setRevealedKeys] = useState<Set<string>>(new Set())

    const apiKeysQuery = useApiKeys()

    const createMutation = useMutation({
        mutationFn: async (name: string) => {
            const response = await elysiaClient["api-keys"].post({ name })
            if (response.error) {
                const errValue = response.error.value as { message?: string } | undefined
                throw new Error(errValue?.message || "Failed to create API key")
            }
            return response.data
        },
        onSuccess: (data) => {
            setNewlyCreatedKey(data?.apiKey ?? null)
            if (nameRef.current) nameRef.current.value = ""
            queryClient.invalidateQueries({ queryKey: apiKeysQueryKey })
        },
    })

    const toggleMutation = useMutation({
        mutationFn: async ({ id, disabled }: { id: string; disabled: boolean }) => {
            const response = await elysiaClient["api-keys"].put({ id, disabled })
            if (response.error) {
                const errValue = response.error.value as { message?: string } | undefined
                throw new Error(errValue?.message || "Failed to update API key")
            }
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: apiKeysQueryKey })
        },
    })

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const response = await elysiaClient["api-keys"]({ id }).delete()
            if (response.error) {
                const errValue = response.error.value as { message?: string } | undefined
                throw new Error(errValue?.message || "Failed to delete API key")
            }
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: apiKeysQueryKey })
        },
    })

    const copyToClipboard = async (text: string, id: string) => {
        await navigator.clipboard.writeText(text)
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 2000)
    }

    const toggleReveal = (id: string) => {
        setRevealedKeys((prev) => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }

    const handleCreate = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const name = nameRef.current?.value?.trim()
        if (name) createMutation.mutate(name)
    }

    const apiKeys = apiKeysQuery.data?.apiKeys ?? []
    const mutationError = toggleMutation.error?.message || deleteMutation.error?.message

    return (
        <DashboardLayout>
            <div className="space-y-10">
                <PageHeader
                    title="API Keys"
                    description="Create and manage your API keys for accessing models."
                />

                <Card className="border-border/50 bg-card/30">
                    <CardHeader>
                        <CardTitle className="text-lg">Create new key</CardTitle>
                        <CardDescription>
                            Give your key a descriptive name to identify it later.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form className="flex flex-col gap-3 sm:flex-row" onSubmit={handleCreate}>
                            <div className="flex-1">
                                <Label htmlFor="key-name" className="sr-only">
                                    Key name
                                </Label>
                                <Input
                                    id="key-name"
                                    ref={nameRef}
                                    placeholder="e.g. Production, Development, My App"
                                    className="h-10"
                                    required
                                />
                            </div>
                            <Button
                                type="submit"
                                className="h-10"
                                disabled={createMutation.isPending}
                            >
                                {createMutation.isPending ? (
                                    <>
                                        <Loader2 className="size-4 animate-spin" />
                                        Creating…
                                    </>
                                ) : (
                                    <>
                                        <Plus className="size-4" />
                                        Create key
                                    </>
                                )}
                            </Button>
                        </form>

                        {newlyCreatedKey && (
                            <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-3 text-sm text-emerald-400">
                                <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
                                <div className="min-w-0 flex-1">
                                    <p>
                                        Key created. Copy it now — you won&apos;t be able to see the
                                        full key again.
                                    </p>
                                    <div className="mt-2 flex items-center gap-2">
                                        <code className="block truncate rounded bg-emerald-500/10 px-2 py-1 font-mono text-xs">
                                            {newlyCreatedKey}
                                        </code>
                                        <Button
                                            variant="ghost"
                                            size="icon-sm"
                                            onClick={() => copyToClipboard(newlyCreatedKey, "new")}
                                        >
                                            {copiedId === "new" ? (
                                                <CheckCircle2 className="size-3.5" />
                                            ) : (
                                                <Copy className="size-3.5" />
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {createMutation.isError && (
                            <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-destructive/20 bg-destructive/10 px-3.5 py-3 text-sm text-destructive">
                                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                                <span>
                                    {createMutation.error?.message || "Failed to create key."}
                                </span>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <section>
                    <h2 className="mb-4 text-sm font-semibold text-foreground">
                        Your keys
                        {!apiKeysQuery.isLoading && (
                            <span className="ml-2 font-normal text-muted-foreground">
                                ({apiKeys.length})
                            </span>
                        )}
                    </h2>

                    {apiKeysQuery.isLoading ? (
                        <div className="flex items-center gap-2 py-8 text-sm text-muted-foreground">
                            <Loader2 className="size-4 animate-spin" />
                            Loading keys…
                        </div>
                    ) : apiKeys.length === 0 ? (
                        <EmptyState
                            icon={Key}
                            title="No API keys yet"
                            description="Create your first key above to get started."
                        />
                    ) : (
                        <TableShell>
                            <thead>
                                <tr className="border-b border-border/50">
                                    <Th>Name</Th>
                                    <Th>Key</Th>
                                    <Th>Status</Th>
                                    <Th align="right">Credits used</Th>
                                    <Th align="right">Actions</Th>
                                </tr>
                            </thead>
                            <tbody>
                                {apiKeys.map((key) => (
                                    <ApiKeyRow
                                        key={key.id}
                                        apiKey={key}
                                        revealed={revealedKeys.has(key.id)}
                                        copied={copiedId === key.id}
                                        onToggleReveal={() => toggleReveal(key.id)}
                                        onCopy={() => copyToClipboard(key.apiKey, key.id)}
                                        onToggleEnabled={() =>
                                            toggleMutation.mutate({
                                                id: key.id,
                                                disabled: !key.disabled,
                                            })
                                        }
                                        onDelete={() => deleteMutation.mutate(key.id)}
                                        isMutating={
                                            toggleMutation.isPending || deleteMutation.isPending
                                        }
                                    />
                                ))}
                            </tbody>
                        </TableShell>
                    )}

                    {mutationError && (
                        <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-destructive/20 bg-destructive/10 px-3.5 py-3 text-sm text-destructive">
                            <AlertCircle className="mt-0.5 size-4 shrink-0" />
                            <span>{mutationError}</span>
                        </div>
                    )}
                </section>
            </div>
        </DashboardLayout>
    )
}

function ApiKeyRow({
    apiKey,
    revealed,
    copied,
    onToggleReveal,
    onCopy,
    onToggleEnabled,
    onDelete,
    isMutating,
}: {
    apiKey: ApiKey
    revealed: boolean
    copied: boolean
    onToggleReveal: () => void
    onCopy: () => void
    onToggleEnabled: () => void
    onDelete: () => void
    isMutating: boolean
}) {
    return (
        <tr className="group border-b border-border/30 last:border-0">
            <Td className="font-medium text-foreground">{apiKey.name}</Td>
            <Td>
                <div className="flex items-center gap-1.5">
                    <code className="font-mono text-xs text-muted-foreground">
                        {maskApiKey(apiKey.apiKey, revealed)}
                    </code>
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        className="opacity-80 transition-opacity group-hover:opacity-100"
                        onClick={onToggleReveal}
                    >
                        {revealed ? <EyeOff className="size-3" /> : <Eye className="size-3" />}
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        className="opacity-0 transition-opacity group-hover:opacity-100"
                        onClick={onCopy}
                    >
                        {copied ? (
                            <CheckCircle2 className="size-3 text-emerald-400" />
                        ) : (
                            <Copy className="size-3" />
                        )}
                    </Button>
                </div>
            </Td>
            <Td>
                <StatusBadge active={!apiKey.disabled} />
            </Td>
            <Td align="right" className="text-foreground">
                {formatCredits(getCreditsUsed(apiKey))}
            </Td>
            <Td align="right">
                <div className="flex items-center justify-end gap-1">
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={onToggleEnabled}
                        disabled={isMutating}
                        title={apiKey.disabled ? "Enable key" : "Disable key"}
                    >
                        {apiKey.disabled ? (
                            <ToggleLeft className="size-4 text-muted-foreground" />
                        ) : (
                            <ToggleRight className="size-4 text-emerald-400" />
                        )}
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={onDelete}
                        disabled={isMutating}
                        title="Delete key"
                    >
                        <Trash2 className="size-3.5 text-muted-foreground hover:text-destructive" />
                    </Button>
                </div>
            </Td>
        </tr>
    )
}
