import PageBackground from "@/components/PageBackground"

export default function DocsRouteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PageBackground />
      {children}
    </>
  )
}
