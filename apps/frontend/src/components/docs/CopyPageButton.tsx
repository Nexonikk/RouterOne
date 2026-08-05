export default function CopyPageButton() {
  return (
    <div className="flex shrink-0 items-stretch overflow-hidden rounded-lg border border-white/10 bg-white/[0.04]">
      <button
        type="button"
        className="flex items-center gap-2 px-3.5 py-2 text-[13px] font-medium text-zinc-300 transition-colors hover:bg-white/[0.06]"
      >
        <CopyIcon className="h-4 w-4" />
        Copy page
      </button>
      <button
        type="button"
        aria-label="More export options"
        className="flex items-center border-l border-white/10 px-2 text-zinc-500 transition-colors hover:bg-white/[0.06] hover:text-zinc-300"
      >
        <ChevronIcon className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="9" y="9" width="11" height="11" rx="1.5" />
      <path d="M5 15V6a1.5 1.5 0 0 1 1.5-1.5H15" />
    </svg>
  )
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}
