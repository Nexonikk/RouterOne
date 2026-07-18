import { z } from "zod"

export const emailSchema = z.email().trim()

export const passwordSchema = z
    .string()
    .min(8, "At least 8 characters")
    .regex(/[a-z]/, "One lowercase letter")
    .regex(/[A-Z]/, "One uppercase letter")
    .regex(/[0-9]/, "One number")

export function isValidEmail(email: string): boolean {
    return emailSchema.safeParse(email).success
}

export interface PasswordCheck {
    valid: boolean
    errors: string[]
}

export function validatePassword(password: string): PasswordCheck {
    const result = passwordSchema.safeParse(password)

    if (result.success) {
        return {
            valid: true,
            errors: [],
        }
    }

    return {
        valid: false,
        errors: result.error.issues.map((issue) => issue.message),
    }
}
