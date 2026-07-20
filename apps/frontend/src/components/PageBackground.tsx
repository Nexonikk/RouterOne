"use client"

import { motion } from "framer-motion"

/**
 * The static base layer of the site background: color, dot grid, vignette, and
 * two very slow ambient glows that drift continuously. This is everything
 * Hero.tsx sits on top of, MINUS the animated Gradient beam — mount this once
 * at the root layout so every section shares the same living background, and
 * keep <Gradient /> living only inside Hero.tsx.
 */
export default function PageBackground() {
    return (
        <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#08070B]"
        >
            <div
                className="absolute inset-0 opacity-30"
                style={{
                    backgroundImage:
                        "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)",
                    backgroundSize: "32px 32px",
                }}
            />

            <motion.div
                className="absolute h-[36rem] w-[36rem] rounded-full bg-indigo-500/[0.06] blur-[140px]"
                animate={{ x: ["-10%", "15%", "-10%"], y: ["5%", "25%", "5%"] }}
                transition={{ duration: 36, repeat: Infinity, ease: "easeInOut" }}
                style={{ top: "10%", left: "0%" }}
            />
            <motion.div
                className="absolute h-[30rem] w-[30rem] rounded-full bg-fuchsia-500/[0.05] blur-[140px]"
                animate={{ x: ["5%", "-15%", "5%"], y: ["0%", "-15%", "0%"] }}
                transition={{ duration: 42, repeat: Infinity, ease: "easeInOut" }}
                style={{ bottom: "10%", right: "5%" }}
            />

            <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_0%,rgba(8,7,11,0.1)_0%,rgba(8,7,11,0.8)_60%,rgba(8,7,11,0.98)_100%)]" />
        </div>
    )
}
