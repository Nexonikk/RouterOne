import { Zap } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Placeholder brand mark. The original app used `RouterOne.png` — drop your
 * real logo file into `/public/RouterOne.png` and swap this for
 * `<img src="/RouterOne.png" className={className} />` if you'd rather use it.
 */
export function Logo({ className }: { className?: string }) {
    return <img src="/Routerone.png" alt="Logo" className={className} />
}
