import DocsSidebarSection from "@/components/docs/DocsSidebarSection"
import type { SidebarGroup } from "@/types/docs"

export default function DocsSidebar({
  groups,
  activeSlug,
}: {
  groups: SidebarGroup[]
  activeSlug: string
}) {
  return (
    <aside className="hidden h-full w-[248px] shrink-0 overflow-y-auto border-r border-white/[0.08] lg:block">
      <nav className="flex flex-col gap-7 px-3 py-7 pr-5">
        {groups.map((group) => (
          <DocsSidebarSection key={group.title} group={group} activeSlug={activeSlug} />
        ))}
      </nav>
    </aside>
  )
}
