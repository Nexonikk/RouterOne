import Link from "next/link"
import DocsIcon from "@/components/docs/DocsIcon"
import type { SidebarGroup } from "@/types/docs"

export default function DocsSidebarSection({
  group,
  activeSlug,
}: {
  group: SidebarGroup
  activeSlug: string
}) {
  return (
    <div>
      <p className="mb-2.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-600">
        {group.title}
      </p>
      <ul className="flex flex-col gap-[2px]">
        {group.links.map((link) => {
          const isActive = link.slug === activeSlug
          return (
            <li key={`${link.slug}-${link.label}`} className="relative">
              {isActive && (
                <span className="absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-full bg-indigo-400" />
              )}
              <Link
                href={`/docs/${link.slug}`}
                aria-current={isActive ? "page" : undefined}
                className={[
                  "flex items-center gap-2.5 rounded-lg px-3 py-[7px] text-[13.5px] leading-none transition-colors duration-150",
                  isActive
                    ? "bg-indigo-500/10 font-medium text-indigo-300"
                    : "text-zinc-400 hover:bg-white/[0.05] hover:text-zinc-100",
                ].join(" ")}
              >
                <DocsIcon
                  name={link.icon}
                  className={["h-[15px] w-[15px] shrink-0", isActive ? "text-indigo-400" : "text-zinc-500"].join(" ")}
                />
                <span className="flex-1 truncate">{link.label}</span>
                {link.badge && (
                  <span className="rounded border border-white/10 bg-white/5 px-1.5 py-[1px] text-[10px] font-medium text-zinc-400">
                    {link.badge}
                  </span>
                )}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
