import {
  Navbar,
  Hero,
  StatsSection,
  FeaturesSection,
  CTASection,
} from "@/components/LandingSections"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground">
      <Navbar />

      <main className="flex-1 overflow-y-auto">
        <Hero />

        <div className="mx-auto w-full max-w-7xl space-y-16 p-8 lg:space-y-28">
          <StatsSection />
          <FeaturesSection />
          <CTASection />
        </div>
      </main>
    </div>
  )
}
