import { NextRequest, NextResponse } from "next/server"

export function middleware(req: NextRequest) {
    const token = req.cookies.get("auth")?.value
    const { pathname } = req.nextUrl

    const isAuthPage = pathname.startsWith("/auth")
    const isProtectedPage = pathname.startsWith("/dashboard")

    if (!token && isProtectedPage) {
        return NextResponse.redirect(new URL("/auth/signin", req.url))
    }

    if (token && isAuthPage) {
        return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/dashboard/:path*", "/auth/:path*"],
}
