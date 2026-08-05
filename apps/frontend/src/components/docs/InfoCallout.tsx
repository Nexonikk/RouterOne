import Link from "next/link"

export default function InfoCallout({
  tone,
  text,
  href,
}: {
  tone: "info" | "warning"
  text: string
  href?: string
}) {
  const toneStyles =
    tone === "info"
      ? "border-indigo-500/30 bg-indigo-500/[0.08] text-indigo-200"
      : "border-amber-500/30 bg-amber-500/[0.08] text-amber-200"

  return (
    <div className={`flex gap-3 rounded-xl border px-4 py-3.5 text-[14px] leading-relaxed ${toneStyles}`}>
      <InfoIcon className="mt-0.5 h-4 w-4 shrink-0" />
      <p>
        {text}{" "}
        {href && (
          <Link href={`/docs/${href}`} className="font-medium underline underline-offset-2 hover:no-underline">
            Read more
          </Link>
        )}
      </p>
    </div>
  )
}

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5.5M12 8h.01" strokeLinecap="round" />
    </svg>
  )
}
