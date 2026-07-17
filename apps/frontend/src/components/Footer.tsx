import Link from "next/link"

export default function Footer() {
    return (
        <footer className="border-t border-border/30 py-10">
            <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
                <p>&copy; {new Date().getFullYear()} RouterOne. All rights reserved.</p>
                <div className="flex items-center gap-6">
                    <Link href="/auth/signin" className="hover:text-foreground transition-colors">
                        Sign in
                    </Link>
                    <Link href="/auth/signup" className="hover:text-foreground transition-colors">
                        Sign up
                    </Link>
                </div>
            </div>
        </footer>
    )
}
