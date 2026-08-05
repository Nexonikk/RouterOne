import { emailTemplate } from "../lib/emailTemplate.js"
import Mailjet from "node-mailjet"

const client = new Mailjet.Client({
    apiKey: process.env.MJ_APIKEY_PUBLIC!,
    apiSecret: process.env.MJ_APIKEY_PRIVATE!,
})

export async function sendEmailOTP(email: string, otp: string): Promise<void> {
    const payload = {
        Messages: [
            {
                From: {
                    Email: "yusufhameed.test@gmail.com",
                    Name: "RouterOne",
                },
                To: [
                    {
                        Email: email,
                        Name: "user",
                    },
                ],
                Subject: "RouterOne OTP Verification",
                TextPart: `Your RouterOne verification code is ${otp}. This code expires in 10 minutes.`,
                HTMLPart: emailTemplate(otp),
            },
        ],
    }

    try {
        console.log("[MAILJET] Sending email...")

        const result = await client.post("send", { version: "v3.1" }).request(payload)

        console.log("[MAILJET] Email sent successfully")
        console.log("[MAILJET] Response:", result.body)
    } catch (error: unknown) {
        console.error("[MAILJET] EMAIL FAILED")

        if (error instanceof Error) {
            console.error("[MAILJET] Message:", error.message)
            console.error("[MAILJET] Stack:", error.stack)
        } else {
            console.error("[MAILJET] Unknown error:", error)
        }

        throw error
    }
}

// 89b8600bdff1385fea28f7b6310b7421
