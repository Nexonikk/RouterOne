import { notFound } from "next/navigation"
import DocsShell from "@/components/docs/DocsShell"
import { docsPages } from "@/data/docs-content"
import { docsSidebar } from "@/data/docs-nav"

export function generateStaticParams() {
    return Object.keys(docsPages).map((slug) => ({ slug }))
}

export default function DocsSlugPage({ params }: { params: { slug: string } }) {
    const page = docsPages[params.slug]
    if (!page) notFound()

    return <DocsShell page={page} section="docs" sidebarGroups={docsSidebar} />
}
