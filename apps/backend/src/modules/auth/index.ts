import { Cookie, Elysia, t } from "elysia"
import { AuthModel } from "./models"
import { AuthService } from "./service"
import jwt from "@elysiajs/jwt"

export const app = new Elysia({ prefix: "auth" })
    .use(
        jwt({
            name: "jwt",
            secret: process.env.JWT_SECRET!,
        }),
    )
    .post(
        "/sign-up",
        async ({ body, status }) => {
            try {
                const userId = await AuthService.signup(body.email, body.password)
                return {
                    message: "OTP sent successfully",
                }
            } catch (e) {
                console.log(e)
                return status(400, {
                    message: "Error while signing up",
                }).response
            }
        },
        {
            body: AuthModel.signupSchema,
            response: {
                200: AuthModel.signupResponseSchema,
                400: AuthModel.signupFailedResponseSchema,
            },
        },
    )
    .post(
        "/sign-in",
        async ({ jwt, body, status, cookie: { auth } }) => {
            const { correctCredentials, userId } = await AuthService.signin(
                body.email,
                body.password,
            )
            if (correctCredentials && userId) {
                const token = await jwt.sign({ userId })
                if (!auth) {
                    auth = new Cookie("auth", {})
                }

                auth.set({
                    value: token,
                    httpOnly: true,
                    maxAge: 7 * 86400,
                    sameSite: "lax",
                    secure: process.env.NODE_ENV === "production",
                })

                return {
                    message: "Signed in successfully",
                }
            } else {
                return status(403, {
                    message: "Incorrect credentials",
                })
            }
        },
        {
            body: AuthModel.signinSchema,
            response: {
                200: AuthModel.signinResponseSchema,
                403: AuthModel.signinFailureSchema,
            },
        },
    )

    .post(
        "/verify-otp",
        async ({ jwt, body, status, cookie: { auth } }) => {
            try {
                const result = await AuthService.verifyOTP(body.email, body.otp)

                if (!result.valid || !result.userId || !result.message) {
                    return status(400, {
                        message: result.message ?? "Error while verifying OTP",
                    })
                }

                const token = await jwt.sign({
                    userId: result.userId,
                })

                if (!auth) {
                    auth = new Cookie("auth", {})
                }

                auth.set({
                    value: token,
                    httpOnly: true,
                    maxAge: 7 * 86400,
                    sameSite: "lax",
                    secure: process.env.NODE_ENV === "production",
                })

                return {
                    id: result.userId,
                    message: result.message,
                }
            } catch (e) {
                console.log(e)
                return status(400, {
                    message: "Error while verifying OTP",
                })
            }
        },
        {
            body: AuthModel.verifyOTPSchema,
            response: {
                200: AuthModel.verifyOTPResponseSchema,
                400: AuthModel.verifyOTPResponseErrorSchema,
            },
        },
    )

    .post("/sign-out", async ({ cookie: { auth } }) => {
        if (auth) {
            auth.remove()
        }

        return {
            message: "Signed out successfully",
        }
    })
    .resolve(async ({ cookie: { auth }, status, jwt }) => {
        if (!auth) {
            return status(401)
        }

        const decoded = await jwt.verify(auth.value as string)

        if (!decoded || !decoded.userId) {
            return status(401)
        }

        return {
            userId: decoded.userId as string,
        }
    })
    .get(
        "/profile",
        async ({ userId, status }) => {
            console.log("userId", userId)
            const userData = await AuthService.getUserDetails(Number(userId))
            if (!userData) {
                return status(400, {
                    message: "Error while fetching user details",
                })
            }
            return userData
        },
        {
            response: {
                200: AuthModel.profileResponseSchema,
                400: AuthModel.profileResponseErrorSchema,
            },
        },
    )
