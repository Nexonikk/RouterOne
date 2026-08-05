import type { TocItem } from "@/types/docs"

export default function DocsTableOfContents({
    items,
    activeId,
}: {
    items: TocItem[]
    activeId?: string
}) {
    if (items.length === 0) return null

    return (
        <aside className="hidden h-full w-[220px] shrink-0 overflow-y-auto border-l border-white/[0.08] xl:block">
            <div className="px-5 py-7">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-600">
                    On this page
                </p>
                <ul className="flex flex-col gap-[2px] border-l border-white/[0.08]">
                    {items.map((item) => (
                        <li key={item.id}>
                            <a
                                href={`#${item.id}`}
                                className={[
                                    "block border-l-[1.5px] py-1 text-[13px] leading-snug transition-colors duration-150",
                                    item.depth === 2 ? "pl-6" : "pl-3.5",

                                    activeId === item.id
                                        ? "border-indigo-400 text-indigo-300"
                                        : "border-transparent text-zinc-500 hover:border-indigo-400/60 hover:text-indigo-300",
                                ].join(" ")}
                                style={{ marginLeft: "-1.5px" }}
                            >
                                {item.label}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    )
}
