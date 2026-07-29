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
        const result = await client.post("send", { version: "v3.1" }).request(payload)

        console.log("Email sent:", result.body)
    } catch (error: any) {
        console.error("Mailjet error:", error?.statusCode, error?.response?.body ?? error)

        throw error
    }
}

// 89b8600bdff1385fea28f7b6310b7421
