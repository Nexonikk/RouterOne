import { t } from "elysia"

export namespace AuthModel {
    export const signinSchema = t.Object({
        email: t.String(),
        password: t.String(),
    })

    export type signInSchema = typeof signinSchema.static

    export const signinResponseSchema = t.Object({
        message: t.Literal("Signed in successfully"),
    })

    export type signinResponseSchema = typeof signinResponseSchema.static

    export const signinFailureSchema = t.Object({
        message: t.Literal("Incorrect credentials"),
    })

    export type signinFailureSchema = typeof signinFailureSchema.static

    export const signupSchema = t.Object({
        email: t.String(),
        password: t.String(),
    })

    export const verifyOTPSchema = t.Object({
        email: t.String(),
        otp: t.String(),
    })

    export type verifyOTPSchema = typeof verifyOTPSchema.static

    export const verifyOTPResponseSchema = t.Object({
        id: t.String(),
        message: t.String(),
    })

    export type verifyOTPResponseSchema = typeof verifyOTPResponseSchema.static

    export const verifyOTPResponseErrorSchema = t.Object({
        message: t.String(),
    })

    export type verifyOTPResponseErrorSchema = typeof verifyOTPResponseErrorSchema.static

    export type signupSchema = typeof signinSchema.static

    export const signupResponseSchema = t.Object({
        message: t.String(),
    })

    export const signupFailedResponseSchema = t.Object({
        message: t.Literal("Error while signing up"),
    })

    export type signupResponseSchema = typeof signinResponseSchema.static
    export type signupFailedResponseSchema = typeof signupFailedResponseSchema

    export const profileResponseSchema = t.Object({
        credits: t.Number(),
    })

    export const profileResponseErrorSchema = t.Object({
        message: t.Literal("Error while fetching user details"),
    })
}
