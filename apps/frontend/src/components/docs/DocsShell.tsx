"use client"

import Header from "@/components/landing/Header"
import DocsBlockRenderer from "@/components/docs/DocsBlockRenderer"
import DocsMobileNav from "@/components/docs/DocsMobileNav"
import DocsPageHeader from "@/components/docs/DocsPageHeader"
import DocsSidebar from "@/components/docs/DocsSidebar"
import DocsTableOfContents from "@/components/docs/DocsTableOfContents"
import DocsTopTabs from "@/components/docs/DocsTopTabs"
import type { DocsPage, DocsSection, SidebarGroup } from "@/types/docs"
import { useEffect, useState } from "react"
import DocsPagination from "./DocsPagination"

const CONTENT_HEIGHT = "h-[calc(100vh-7rem)]"

function getPageText(page: DocsPage) {
    const lines: string[] = []

    // Page title
    lines.push(`# ${page.title}`)
    lines.push("")

    // Page description
    if (page.description) {
        lines.push(page.description)
        lines.push("")
    }

    // Page blocks
    for (const block of page.blocks) {
        switch (block.type) {
            case "heading": {
                lines.push(`${"#".repeat(block.depth)} ${block.text}`)
                lines.push("")
                break
            }

            case "paragraph": {
                lines.push(block.text)
                lines.push("")
                break
            }

            case "faq": {
                for (const item of block.items) {
                    lines.push(`### ${item.question}`)
                    lines.push("")
                    lines.push(item.answer)
                    lines.push("")
                }
                break
            }

            case "list": {
                for (const item of block.items) {
                    lines.push(`- ${item}`)
                }

                lines.push("")
                break
            }

            case "code": {
                lines.push(`\`\`\`${block.language}\n${block.code}\n\`\`\``)
                lines.push("")
                break
            }

            case "callout": {
                lines.push(`> ${block.text}`)
                lines.push("")
                break
            }

            case "table": {
                // Tables are intentionally skipped for now.
                // Add table-to-markdown conversion here if needed later.
                break
            }

            default:
                break
        }
    }

    return lines.join("\n").trim()
}

export default function DocsShell({
    page,
    section,
    sidebarGroups,
}: {
    page: DocsPage
    section: DocsSection
    sidebarGroups: SidebarGroup[]
}) {
    const [activeSection, setActiveSection] = useState(page.toc[0]?.id)

    useEffect(() => {
        const main = document.querySelector("main")

        if (!main) {
            return
        }

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

                if (visible.length > 0) {
                    setActiveSection(visible[0].target.id)
                }
            },
            {
                root: main,
                rootMargin: "-20% 0px -70% 0px",
            },
        )

        page.toc.forEach((item) => {
            const element = document.getElementById(item.id)

            if (element) {
                observer.observe(element)
            }
        })

        return () => observer.disconnect()
    }, [page.toc])

    const pageContent = getPageText(page)

    return (
        <div className="dark min-h-screen text-foreground">
            <Header />

            {/* pt-16 offsets the fixed Header (h-16) */}
            <div className="pt-16">
                <DocsTopTabs activeSection={section} />

                <div
                    className={`mx-auto flex max-w-[1600px] overflow-hidden px-4 sm:px-6 ${CONTENT_HEIGHT}`}
                >
                    <DocsSidebar groups={sidebarGroups} activeSlug={page.slug} />

                    <main
                        className={`min-w-0 flex-1 overflow-y-auto hide-scrollbar px-0 py-8 lg:px-10 ${CONTENT_HEIGHT}`}
                    >
                        <DocsMobileNav groups={sidebarGroups} activeSlug={page.slug} />

                        <DocsPageHeader
                            eyebrow={page.eyebrow}
                            title={page.title}
                            description={page.description}
                            content={pageContent}
                        />

                        <DocsBlockRenderer blocks={page.blocks} />

                        <DocsPagination groups={sidebarGroups} activeSlug={page.slug} />

                        <div className="h-16" />
                    </main>

                    <DocsTableOfContents items={page.toc} activeId={activeSection} />
                </div>
            </div>
        </div>
    )
}
