import Link from "next/link"
import DocsIcon from "@/components/docs/DocsIcon"
import { topTabs } from "@/data/docs-nav"
import type { DocsSection } from "@/types/docs"

const TAB_ICON = {
  docs: "layers",
  api: "route",
  sdk: "cube",
  agent: "server",
  cookbook: "book",
} as const

// Sticky sub-nav that sits directly under the shared, fixed Header.
// No logo / search / "Ask Assistant" here — those live in Header now.
export default function DocsTopTabs({ activeSection }: { activeSection: DocsSection }) {
  return (
    <div className="sticky top-16 z-30 h-12 border-b border-white/[0.08] bg-[#08070b]/90 backdrop-blur-xl">
      <nav className="mx-auto flex h-full max-w-[1600px] items-center gap-1 px-4 sm:px-6">
        {topTabs.map((tab) => {
          const isActive = tab.section === activeSection
          return (
            <Link
              key={tab.section}
              href={tab.href}
              className={[
                "relative flex h-full items-center gap-2 px-3 text-[13px] font-medium transition-colors",
                isActive ? "text-white" : "text-zinc-500 hover:text-zinc-300",
              ].join(" ")}
            >
              <DocsIcon name={TAB_ICON[tab.icon] as any} className="h-[15px] w-[15px]" />
              <span className="hidden sm:inline">{tab.label}</span>
              {isActive && <span className="absolute inset-x-3 bottom-0 h-[2px] rounded-full bg-indigo-500" />}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
