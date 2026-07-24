"use client"

import { useQuery } from "@tanstack/react-query"
import { useElysiaClient } from "@/providers/Eden"
import Hero from "@/components/landing/Hero"
import FeatureHighlights from "@/components/landing/FeatureHighlights"
import FeaturedModels from "@/components/landing/FeaturedModels"
import LiveRouting from "@/components/landing/LiveRouting"
import HowItWorks from "@/components/landing/HowItWorks"
import CTASection from "@/components/landing/CTASection"
import Footer from "@/components/landing/Footer"
import Header from "@/components/landing/Header"
import PageBackground from "@/components/PageBackground"

export default function Landing() {
    const elysiaClient = useElysiaClient() as any

    const modelsQuery = useQuery({
        queryKey: ["models"],
        queryFn: async () => {
            const response = await elysiaClient.models.get()
            if (response.error) return null
            return response.data
        },
    })

    const models = modelsQuery.data?.models ?? []

    return (
        <div className="dark min-h-screen text-foreground">
            <PageBackground />
            <Header />
            <Hero models={models} />
            <FeatureHighlights />
            <FeaturedModels models={models} />
            <LiveRouting />
            <HowItWorks />
            <CTASection />
            <Footer />
        </div>
    )
}
