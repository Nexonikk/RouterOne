import { prisma } from "db"
import { generateOTP } from "../../utils/generateOTP"
import { sendEmailOTP } from "../../utils/sendEmailOTP"

export abstract class AuthService {
    static async signup(email: string, password: string): Promise<void> {
        const existingUser = await prisma.user.findFirst({
            where: {
                email: email.toLowerCase(),
            },
        })

        if (existingUser) {
            throw new Error("User with this email already exists")
        }

        const otp = await generateOTP()

        const hashedPassword = await Bun.password.hash(password)
        const otpHash = await Bun.password.hash(otp)

        await prisma.pendingUser.upsert({
            where: {
                email: email.toLowerCase(),
            },
            update: {
                password_hash: hashedPassword,
                otp_hash: otpHash,
                expires_at: new Date(Date.now() + 1000 * 60 * 10),
            },
            create: {
                email: email.toLowerCase(),
                password_hash: hashedPassword,
                otp_hash: otpHash,
                expires_at: new Date(Date.now() + 1000 * 60 * 10),
            },
        })

        await sendEmailOTP(email, otp)
    }

    static async signin(
        email: string,
        password: string,
    ): Promise<{ correctCredentials: boolean; userId?: string }> {
        const user = await prisma.user.findFirst({
            where: {
                email,
            },
        })

        if (!user) {
            return { correctCredentials: false }
        }

        if (!(await Bun.password.verify(password, user.password))) {
            return { correctCredentials: false }
        }

        return { correctCredentials: true, userId: user.id.toString() }
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
            return { valid: false, message: "User not found" }
        }

        if (!(await Bun.password.verify(otp, user.otp_hash))) {
            return { valid: false, message: "Invalid OTP" }
        }

        if (user.expires_at < new Date()) {
            return { valid: false, message: "OTP expired" }
        }

        await prisma.user.create({
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

        return { valid: true, userId: user.id.toString(), message: "OTP verified successfully" }
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
