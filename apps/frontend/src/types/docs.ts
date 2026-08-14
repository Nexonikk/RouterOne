// ============================================================================
// Shared types for the documentation system.
// Kept in one place so nav data, content data, and components all agree
// on the same shapes.
// ============================================================================

export type DocsSection = "docs" | "api-reference" | "client-sdks"

export interface TopTab {
    label: string
    href: string
    section: DocsSection
    icon: "docs" | "api" | "sdk" | "agent" | "cookbook"
}

export interface SidebarLink {
    slug: string
    label: string
    icon: DocsIconName
    badge?: string
}

export interface SidebarGroup {
    title: string
    icon?: DocsIconName
    links: SidebarLink[]
}

export type DocsIconName =
    | "compass"
    | "rocket"
    | "layers"
    | "book"
    | "cube"
    | "plug"
    | "shield"
    | "help"
    | "gauge"
    | "route"
    | "server"

export interface TocItem {
    id: string
    label: string
    depth: 1 | 2
}

export interface TableRow {
    approach: string
    href?: string
    bestFor: string
}

export type ContentBlock =
    | { type: "paragraph"; text: string }
    | { type: "heading"; depth: 2 | 3; id: string; text: string }
    | { type: "table"; rows: TableRow[] }
    | { type: "callout"; tone: "info" | "warning"; text: string; href?: string }
    | { type: "code"; language: string; filename?: string; code: string }
    | { type: "list"; items: string[] }
    | { type: "faq"; items: { question: string; answer: string }[] }

export interface DocsPage {
    slug: string
    eyebrow: string
    title: string
    description: string
    toc: TocItem[]
    blocks: ContentBlock[]
}
