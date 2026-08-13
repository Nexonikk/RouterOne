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
        <aside className="hidden h-full w-[280px] shrink-0 border-r border-white/[0.07] lg:block">
            <div className="h-full overflow-y-auto hide-scrollbar">
                <nav className="flex flex-col gap-9 px-5 py-8">
                    {groups.map((group) => (
                        <DocsSidebarSection
                            key={group.title}
                            group={group}
                            activeSlug={activeSlug}
                        />
                    ))}
                </nav>
            </div>
        </aside>
    )
}
