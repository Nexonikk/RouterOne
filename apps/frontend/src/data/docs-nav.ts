import type { SidebarGroup, TopTab } from "@/types/docs"

// ----------------------------------------------------------------------------
// Top-level tabs, shown under the global header.
// "section" is used to compute the active tab across /docs, /docs/api-reference
// and /docs/client-sdks.
// ----------------------------------------------------------------------------
export const topTabs: TopTab[] = [
  { label: "Docs", href: "/docs/overview", section: "docs", icon: "docs" },
  { label: "API Reference", href: "/docs/api-reference", section: "api-reference", icon: "api" },
  { label: "Client SDKs", href: "/docs/client-sdks", section: "client-sdks", icon: "sdk" },
]

// ----------------------------------------------------------------------------
// Left sidebar for the /docs/[slug] section only.
// Grouped so future pages (Batch, MCP, Multimodal, etc.) have a home without
// restructuring the component.
// ----------------------------------------------------------------------------
export const docsSidebar: SidebarGroup[] = [
  {
    title: "Get started",
    links: [
      { slug: "overview", label: "Overview", icon: "compass" },
      { slug: "quickstart", label: "Quickstart", icon: "rocket" },
      { slug: "principles", label: "Principles", icon: "book" },
      { slug: "models", label: "Models", icon: "cube" },
      { slug: "faqs", label: "FAQs", icon: "help" },
    ],
  },
]

export const clientSdksSidebar: SidebarGroup[] = [
  {
    title: "Client SDKs",
    links: [
      { slug: "client-sdks", label: "Overview", icon: "compass" },
      { slug: "client-sdks", label: "TypeScript", icon: "cube" },
      { slug: "client-sdks", label: "Python", icon: "cube" },
    ],
  },
]

export const apiReferenceSidebar: SidebarGroup[] = [
  {
    title: "API Reference",
    links: [
      { slug: "api-reference", label: "Overview", icon: "compass" },
      { slug: "api-reference", label: "Authentication", icon: "shield" },
      { slug: "api-reference", label: "Rate limits", icon: "gauge" },
    ],
  },
]
