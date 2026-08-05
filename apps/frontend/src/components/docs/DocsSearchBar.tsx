export default function DocsSearchBar() {
  return (
    <button
      type="button"
      className="flex w-full max-w-[420px] items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3.5 py-2 text-left text-[13px] text-zinc-500 transition-colors hover:border-white/20 hover:bg-white/[0.06]"
    >
      <SearchIcon className="h-4 w-4 shrink-0" />
      <span className="flex-1">Search...</span>
      <kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[11px] font-medium text-zinc-500">
        Ctrl K
      </kbd>
    </button>
  )
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className={className}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  )
}
