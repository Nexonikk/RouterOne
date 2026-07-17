import { NextRequest, NextResponse } from "next/server"

export function middleware(req: NextRequest) {
    const token = req.cookies.get("auth")?.value

    const { pathname } = req.nextUrl

    const isAuthPage = pathname === "/signin" || pathname === "/signup"

    const isProtectedPage = pathname.startsWith("/dashboard")

    // Not logged in -> block dashboard
    if (!token && isProtectedPage) {
        return NextResponse.redirect(new URL("/signin", req.url))
    }

    // Logged in -> block auth pages
    if (token && isAuthPage) {
        return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/dashboard/:path*", "/signin", "/signup"],
}
