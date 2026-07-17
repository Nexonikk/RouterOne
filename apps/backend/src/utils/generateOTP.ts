import crypto from "crypto"

export async function generateOTP(): Promise<string> {
    return crypto.randomInt(1000, 10000).toString()
}
