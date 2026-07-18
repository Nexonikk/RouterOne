import type { Metadata } from "next"
import "./globals.css"
import { Providers } from "@/providers/Providers"
import NextTopLoader from "nextjs-toploader"

export const metadata: Metadata = {
    title: "RouterOne — One API for every AI model",
    description:
        "Route to the best models from OpenAI, Anthropic, Google, Meta, and more through a single unified API.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <NextTopLoader
                    color="#fff"
                    height={2}
                    showSpinner={false}
                    easing="ease"
                    speed={300}
                    shadow="0 0 10px #c1ff00, 0 0 5px #c1ff00"
                />
                <Providers>{children}</Providers>
            </body>
        </html>
    )
}
