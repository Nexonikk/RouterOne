"use client"

import { useRouter } from "next/navigation"
import type { SidebarGroup } from "@/types/docs"

// Shown below lg — the real sidebar is hidden there, so this dropdown
// keeps every page reachable on mobile without a full drawer component.
export default function DocsMobileNav({
  groups,
  activeSlug,
}: {
  groups: SidebarGroup[]
  activeSlug: string
}) {
  const router = useRouter()

  return (
    <div className="mb-6 lg:hidden">
      <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-zinc-600">
        On this section
      </label>
      <div className="relative">
        <select
          value={activeSlug}
          onChange={(e) => router.push(`/docs/${e.target.value}`)}
          className="w-full appearance-none rounded-lg border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-[13.5px] font-medium text-zinc-200 focus:border-indigo-500/50 focus:outline-none"
        >
          {groups.map((group) =>
            group.links.map((link) => (
              <option key={`${link.slug}-${link.label}`} value={link.slug} className="bg-[#0a0a0c]">
                {link.label}
              </option>
            )),
          )}
        </select>
        <ChevronIcon className="pointer-events-none absolute right-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
      </div>
    </div>
  )
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}
