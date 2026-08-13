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
        <section>
            {/* Section title */}
            <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
                {group.title}
            </p>

            {/* Links */}
            <ul className="flex flex-col gap-1">
                {group.links.map((link) => {
                    const isActive = link.slug === activeSlug

                    return (
                        <li key={`${link.slug}-${link.label}`} className="relative">
                            {/* Active indicator */}
                            {isActive && (
                                <span className="absolute left-0 top-1/2 h-6 w-[2px] -translate-y-1/2 rounded-full bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.45)]" />
                            )}

                            <Link
                                href={`/docs/${link.slug}`}
                                aria-current={isActive ? "page" : undefined}
                                className={[
                                    "group flex min-h-[44px] items-center gap-3 rounded-xl px-3.5 text-[14px] leading-none transition-all duration-150",
                                    isActive
                                        ? "bg-indigo-500/[0.11] font-medium text-white"
                                        : "text-zinc-400 hover:bg-white/[0.055] hover:text-zinc-100",
                                ].join(" ")}
                            >
                                {/* Icon */}
                                <DocsIcon
                                    name={link.icon}
                                    className={[
                                        "size-[17px] shrink-0 transition-colors duration-150",
                                        isActive
                                            ? "text-indigo-400"
                                            : "text-zinc-500 group-hover:text-zinc-300",
                                    ].join(" ")}
                                />

                                {/* Label */}
                                <span className="min-w-0 flex-1 truncate">{link.label}</span>

                                {/* Badge */}
                                {link.badge && (
                                    <span
                                        className={[
                                            "shrink-0 rounded-md border px-1.5 py-1 text-[10px] font-medium leading-none transition-colors",
                                            isActive
                                                ? "border-indigo-400/15 bg-indigo-400/10 text-indigo-300"
                                                : "border-white/[0.08] bg-white/[0.035] text-zinc-500 group-hover:text-zinc-400",
                                        ].join(" ")}
                                    >
                                        {link.badge}
                                    </span>
                                )}
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </section>
    )
}
