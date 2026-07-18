"use client"

import { useElysiaClient } from "@/providers/Eden"
import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card"
import { ArrowRight, Mail, Lock, Loader2, AlertCircle, CheckCircle2, Check, X } from "lucide-react"
import { Logo } from "@/components/Logo"
import { useAuthStore } from "@/store/authStore"
import { isValidEmail, validatePassword } from "@/zod/auth"

export default function Signup() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [emailTouched, setEmailTouched] = useState(false)
    const [passwordTouched, setPasswordTouched] = useState(false)

    const elysiaClient = useElysiaClient() as any
    const router = useRouter()
    const setPendingEmail = useAuthStore((s) => s.setPendingEmail)

    const emailError =
        emailTouched && email.length > 0 && !isValidEmail(email)
            ? "Enter a valid email address"
            : null

    const passwordCheck = validatePassword(password)

    const mutation = useMutation({
        mutationFn: async ({ email, password }: { email: string; password: string }) => {
            const response = await elysiaClient.auth["sign-up"].post({
                email,
                password,
            })
            if (response.error) {
                const errValue = response.error.value as { message?: string } | undefined
                throw new Error(errValue?.message || "Failed to create account")
            }
            return response.data
        },
        onSuccess: (_, variables) => {
            setPendingEmail(variables.email)
            setTimeout(() => router.push("/auth/verify-otp"), 800)
        },
    })

    const canSubmit =
        isValidEmail(email) && passwordCheck.valid && !mutation.isPending && !mutation.isSuccess

    return (
        <div className="dark min-h-screen relative flex items-center justify-center bg-background overflow-hidden">
            <div
                className="absolute w-[600px] h-[600px] rounded-full opacity-[0.07] blur-[120px] animate-pulse"
                style={{
                    background: "radial-gradient(circle, oklch(0.7 0.15 55) 0%, transparent 70%)",
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
                        <CardTitle className="text-xl tracking-tight">
                            Create your account
                        </CardTitle>
                        <CardDescription className="text-muted-foreground/80">
                            Access 200+ AI models through a single API
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form
                            className="space-y-4"
                            onSubmit={(e) => {
                                e.preventDefault()
                                setEmailTouched(true)
                                setPasswordTouched(true)
                                if (!isValidEmail(email) || !passwordCheck.valid) return
                                mutation.mutate({ email, password })
                            }}
                        >
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        className="pl-10 h-10"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        onBlur={() => setEmailTouched(true)}
                                        required
                                    />
                                </div>
                                {emailError && (
                                    <p className="text-xs text-destructive flex items-center gap-1">
                                        <AlertCircle className="size-3" /> {emailError}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Min. 8 characters"
                                        className="pl-10 h-10"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onBlur={() => setPasswordTouched(true)}
                                        required
                                    />
                                </div>
                                {passwordTouched && password.length > 0 && (
                                    <ul className="space-y-1 pt-1">
                                        {[
                                            "At least 8 characters",
                                            "One lowercase letter",
                                            "One uppercase letter",
                                            "One number",
                                        ].map((rule) => {
                                            const met = !passwordCheck.errors.includes(rule)
                                            return (
                                                <li
                                                    key={rule}
                                                    className={`text-xs flex items-center gap-1.5 ${
                                                        met
                                                            ? "text-emerald-400"
                                                            : "text-muted-foreground/70"
                                                    }`}
                                                >
                                                    {met ? (
                                                        <Check className="size-3" />
                                                    ) : (
                                                        <X className="size-3" />
                                                    )}
                                                    {rule}
                                                </li>
                                            )
                                        })}
                                    </ul>
                                )}
                            </div>

                            {mutation.isError && (
                                <div className="flex items-start gap-2.5 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3.5 py-3">
                                    <AlertCircle className="size-4 shrink-0 mt-0.5" />
                                    <span>
                                        {mutation.error?.message ||
                                            "Something went wrong. Please try again."}
                                    </span>
                                </div>
                            )}

                            {mutation.isSuccess && (
                                <div className="flex items-start gap-2.5 text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3.5 py-3">
                                    <CheckCircle2 className="size-4 shrink-0 mt-0.5" />
                                    <span>
                                        Account created! Redirecting to verify your email...
                                    </span>
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full h-10 mt-2"
                                disabled={!canSubmit}
                            >
                                {mutation.isPending ? (
                                    <>
                                        <Loader2 className="size-4 animate-spin" />
                                        Creating account...
                                    </>
                                ) : (
                                    <>
                                        Create account
                                        <ArrowRight className="size-4" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>

                    <CardFooter className="justify-center">
                        <p className="text-sm text-muted-foreground">
                            Already have an account?{" "}
                            <Link
                                href="/auth/signin"
                                className="text-foreground hover:underline underline-offset-4 font-medium transition-colors"
                            >
                                Sign in
                            </Link>
                        </p>
                    </CardFooter>
                </Card>

                <p className="text-center text-xs text-muted-foreground/60 mt-8 leading-relaxed">
                    By creating an account, you agree to our{" "}
                    <a
                        href="#"
                        className="underline underline-offset-2 hover:text-muted-foreground transition-colors"
                    >
                        Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                        href="#"
                        className="underline underline-offset-2 hover:text-muted-foreground transition-colors"
                    >
                        Privacy Policy
                    </a>
                </p>
            </div>
        </div>
    )
}
