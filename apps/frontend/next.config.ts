import type { NextConfig } from "next"

const nextConfig: NextConfig = {
    reactStrictMode: true,

    // Allows importing types (and only types) from the backend workspace package.
    transpilePackages: [],

    async rewrites() {
        return [
            {
                source: "/api/:path*",
                destination: "https://routeronebackend.vercel.app/:path*",
            },
        ]
    },
}

export default nextConfig
