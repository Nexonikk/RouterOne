import { prisma } from "db"
import { generateOTP } from "../../utils/generateOTP.js"
import { sendEmailOTP } from "../../utils/sendEmailOTP.js"

export abstract class AuthService {
    static async signup(email: string, password: string): Promise<void> {
        console.log("[SIGNUP] 1. Checking existing user")

        const existingUser = await prisma.user.findFirst({
            where: {
                email: email.toLowerCase(),
            },
        })

        console.log("[SIGNUP] 2. Existing user check completed")

        if (existingUser) {
            throw new Error("User with this email already exists")
        }

        console.log("[SIGNUP] 3. Generating OTP")

        const otp = await generateOTP()

        console.log("[SIGNUP] 4. Hashing password")

        const hashedPassword = await Bun.password.hash(password)

        console.log("[SIGNUP] 5. Hashing OTP")

        const otpHash = await Bun.password.hash(otp)

        console.log("[SIGNUP] 6. Saving pending user")

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

        console.log("[SIGNUP] 7. Pending user saved")

        console.log("[SIGNUP] 8. Sending OTP email")

        await sendEmailOTP(email, otp)

        console.log("[SIGNUP] 9. OTP email sent successfully")
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
