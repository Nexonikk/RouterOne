import Header from "@/components/landing/Header"
import Footer from "@/components/landing/Footer"
import PageBackground from "@/components/PageBackground"
import ModelsExplorer from "@/components/models/ModelsExplorer"

export default function ModelsPage() {
    return (
        <div className="dark min-h-screen text-foreground">
            <PageBackground />
            <Header />
            <ModelsExplorer />
            <Footer />
        </div>
    )
}
