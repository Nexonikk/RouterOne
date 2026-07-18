"use client"

import { useElysiaClient } from "@/providers/Eden"
import { useMutation } from "@tanstack/react-query"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card"
import { ArrowRight, Loader2, AlertCircle, CheckCircle2, ShieldCheck } from "lucide-react"
import { Logo } from "@/components/Logo"
import { useAuthStore } from "@/store/authStore"

export default function VerifyOtp() {
    const [digits, setDigits] = useState<string[]>(["", "", "", ""])
    const inputsRef = useRef<(HTMLInputElement | null)[]>([])

    const elysiaClient = useElysiaClient() as any
    const router = useRouter()
    const pendingEmail = useAuthStore((s) => s.pendingEmail)
    const clearPendingEmail = useAuthStore((s) => s.clearPendingEmail)

    useEffect(() => {
        if (!pendingEmail) {
            router.replace("/auth/signup")
        }
    }, [pendingEmail, router])

    const mutation = useMutation({
        mutationFn: async ({ email, otp }: { email: string; otp: string }) => {
            const response = await elysiaClient.auth["verify-otp"].post({
                email,
                otp,
            })
            if (response.error) {
                const errValue = response.error.value as { message?: string } | undefined
                throw new Error(errValue?.message || "Invalid or expired code")
            }
            return response.data
        },
        onSuccess: () => {
            clearPendingEmail()
            setTimeout(() => router.push("/dashboard"), 800)
        },
    })

    const submitIfComplete = (code: string[]) => {
        if (code.every((d) => d !== "") && pendingEmail) {
            mutation.mutate({ email: pendingEmail, otp: code.join("") })
        }
    }

    const handleChange = (index: number, value: string) => {
        if (!/^[0-9]?$/.test(value)) return
        const next = [...digits]
        next[index] = value
        setDigits(next)
        if (value && index < 3) inputsRef.current[index + 1]?.focus()
        submitIfComplete(next)
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !digits[index] && index > 0) {
            inputsRef.current[index - 1]?.focus()
        }
        if (e.key === "Enter") {
            e.preventDefault()
            submitIfComplete(digits)
        }
    }

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault()
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4)
        if (pasted.length === 0) return
        const next = ["", "", "", ""]
        pasted.split("").forEach((d, i) => (next[i] = d))
        setDigits(next)
        const focusIndex = Math.min(pasted.length, 3)
        inputsRef.current[focusIndex]?.focus()
        submitIfComplete(next)
    }

    if (!pendingEmail) return null

    return (
        <div className="dark min-h-screen relative flex items-center justify-center bg-background overflow-hidden">
            <div
                className="absolute w-[600px] h-[600px] rounded-full opacity-[0.07] blur-[120px] animate-pulse"
                style={{
                    background: "radial-gradient(circle, oklch(0.75 0.16 155) 0%, transparent 70%)",
                    top: "-10%",
                    right: "-5%",
                    animationDuration: "8s",
                }}
            />
            <div
                className="absolute w-[500px] h-[500px] rounded-full opacity-[0.05] blur-[100px] animate-pulse"
                style={{
                    background: "radial-gradient(circle, oklch(0.6 0.2 264) 0%, transparent 70%)",
                    bottom: "-15%",
                    left: "-10%",
                    animationDuration: "12s",
                    animationDelay: "2s",
                }}
            />
            <div
                className="absolute inset-0 opacity-[0.4]"
                style={{
                    backgroundImage:
                        "radial-gradient(circle at 1px 1px, oklch(1 0 0 / 0.08) 1px, transparent 0)",
                    backgroundSize: "32px 32px",
                }}
            />

            <div className="relative z-10 w-full max-w-[420px] px-6">
                <div className="flex items-center justify-center gap-2.5 mb-10">
                    <Logo className="size-9" />
                    <span className="text-lg font-semibold tracking-tight text-foreground">
                        RouterOne
                    </span>
                </div>

                <Card className="border-border/50 bg-card/80 backdrop-blur-xl shadow-2xl">
                    <CardHeader className="text-center pb-2">
                        <div className="mx-auto mb-2 flex size-10 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20">
                            <ShieldCheck className="size-5 text-white" />
                        </div>
                        <CardTitle className="text-xl tracking-tight">Verify your email</CardTitle>
                        <CardDescription className="text-muted-foreground/80">
                            Enter the 4-digit code sent to{" "}
                            <span className="text-foreground font-medium">{pendingEmail}</span>
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form
                            className="space-y-4"
                            onSubmit={(e) => {
                                e.preventDefault()
                                submitIfComplete(digits)
                            }}
                        >
                            <div className="flex justify-center gap-3">
                                {digits.map((digit, i) => (
                                    <input
                                        key={i}
                                        ref={(el) => {
                                            inputsRef.current[i] = el
                                        }}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleChange(i, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(i, e)}
                                        onPaste={handlePaste}
                                        disabled={mutation.isPending || mutation.isSuccess}
                                        className="size-14 rounded-lg border border-input bg-input/30 text-center text-xl font-semibold text-foreground outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/50 disabled:opacity-50"
                                    />
                                ))}
                            </div>

                            {mutation.isError && (
                                <div className="flex items-start gap-2.5 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3.5 py-3">
                                    <AlertCircle className="size-4 shrink-0 mt-0.5" />
                                    <span>
                                        {mutation.error?.message || "Invalid or expired code"}
                                    </span>
                                </div>
                            )}

                            {mutation.isSuccess && (
                                <div className="flex items-start gap-2.5 text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3.5 py-3">
                                    <CheckCircle2 className="size-4 shrink-0 mt-0.5" />
                                    <span>Verified! Redirecting to dashboard...</span>
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full h-10 mt-2"
                                disabled={
                                    digits.some((d) => d === "") ||
                                    mutation.isPending ||
                                    mutation.isSuccess
                                }
                            >
                                {mutation.isPending ? (
                                    <>
                                        <Loader2 className="size-4 animate-spin" />
                                        Verifying...
                                    </>
                                ) : (
                                    <>
                                        Verify code
                                        <ArrowRight className="size-4" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>

                    <CardFooter className="flex flex-col items-center gap-4">
                        <div className="rounded-lg border bg-muted/40 px-4 py-3 text-center">
                            <p className="text-sm text-muted-foreground">
                                <span className="font-medium text-foreground">Note:</span> If you
                                don't see the verification email within a few minutes, please check
                                your <span className="font-medium">Spam</span>,{" "}
                                <span className="font-medium">Junk</span>, or{" "}
                                <span className="font-medium">Trash</span> folder before requesting
                                a new code.
                            </p>
                        </div>

                        <p className="text-sm text-muted-foreground">
                            Wrong email?{" "}
                            <Link
                                href="/auth/signup"
                                className="font-medium text-foreground underline-offset-4 transition-colors hover:underline"
                            >
                                Start over
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
