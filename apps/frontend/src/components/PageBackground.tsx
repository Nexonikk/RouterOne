/**
 * The static base layer of the site background: color, dot grid, and vignette.
 * This is everything Hero.tsx sits on top of, MINUS the animated Gradient beam —
 * mount this once at the root layout so every section shares the same canvas,
 * and keep <Gradient /> living only inside Hero.tsx.
 */
export default function PageBackground() {
    return (
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 bg-[#08070B]">
            <div
                className="absolute inset-0 opacity-30"
                style={{
                    backgroundImage:
                        "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)",
                    backgroundSize: "32px 32px",
                }}
            />
            <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_0%,rgba(8,7,11,0.1)_0%,rgba(8,7,11,0.8)_60%,rgba(8,7,11,0.98)_100%)]" />
        </div>
    )
}
