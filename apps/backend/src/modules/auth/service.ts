import { prisma } from "db"
import { generateOTP } from "../../utils/generateOTP.js"
import { sendEmailOTP } from "../../utils/sendEmailOTP.js"
import bcrypt from "bcryptjs"

export abstract class AuthService {
    static async signup(email: string, password: string): Promise<void> {
        const normalizedEmail = email.toLowerCase()

        const existingUser = await prisma.user.findFirst({
            where: {
                email: normalizedEmail,
            },
        })

        if (existingUser) {
            throw new Error("User with this email already exists")
        }

        const otp = await generateOTP()

        const hashedPassword = await bcrypt.hash(password, 12)
        const otpHash = await bcrypt.hash(otp, 12)

        await prisma.pendingUser.upsert({
            where: {
                email: normalizedEmail,
            },
            update: {
                password_hash: hashedPassword,
                otp_hash: otpHash,
                expires_at: new Date(Date.now() + 1000 * 60 * 10),
            },
            create: {
                email: normalizedEmail,
                password_hash: hashedPassword,
                otp_hash: otpHash,
                expires_at: new Date(Date.now() + 1000 * 60 * 10),
            },
        })

        await sendEmailOTP(normalizedEmail, otp)
    }

    static async signin(
        email: string,
        password: string,
    ): Promise<{ correctCredentials: boolean; userId?: string }> {
        const user = await prisma.user.findFirst({
            where: {
                email: email.toLowerCase(),
            },
        })

        if (!user) {
            return { correctCredentials: false }
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return { correctCredentials: false }
        }

        return {
            correctCredentials: true,
            userId: user.id.toString(),
        }
    }

    static async verifyOTP(
        email: string,
        otp: string,
    ): Promise<{ valid: boolean; message?: string; userId?: string }> {
        const user = await prisma.pendingUser.findFirst({
            where: {
                email: email.toLowerCase(),
            },
        })

        if (!user) {
            return {
                valid: false,
                message: "User not found",
            }
        }

        // Check expiration before doing the relatively expensive bcrypt compare
        if (user.expires_at < new Date()) {
            return {
                valid: false,
                message: "OTP expired",
            }
        }

        const isOTPValid = await bcrypt.compare(otp, user.otp_hash)

        if (!isOTPValid) {
            return {
                valid: false,
                message: "Invalid OTP",
            }
        }

        const createdUser = await prisma.user.create({
            data: {
                email: user.email,
                password: user.password_hash,
            },
        })

        await prisma.pendingUser.delete({
            where: {
                id: user.id,
            },
        })

        return {
            valid: true,
            userId: createdUser.id.toString(),
            message: "OTP verified successfully",
        }
    }

    static async getUserDetails(id: number) {
        return prisma.user.findFirst({
            where: {
                id,
            },
            select: {
                credits: true,
            },
        })
    }
}
