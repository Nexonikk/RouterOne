import type { NextConfig } from "next"

const nextConfig: NextConfig = {
    reactStrictMode: true,
    transpilePackages: [],

    async rewrites() {
        return [
            {
                // Intercept any request to /api-proxy/... on the frontend
                source: "/api-proxy/:path*",
                // Forward it transparently to the Elysia backend
                destination: "https://routeronebackend.vercel.app/:path*",
            },
        ]
    },
}

export default nextConfig
