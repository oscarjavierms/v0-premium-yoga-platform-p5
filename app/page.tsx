import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { HeroSection } from "@/components/landing/hero-section"
import { ProblemSection } from "@/components/landing/problem-section"
import { PillarsSection } from "@/components/landing/pillars-section"
import { ClassesPreview } from "@/components/landing/classes-preview"
import { InstructorsSection } from "@/components/landing/instructors-section"
import { PricingSection } from "@/components/landing/pricing-section"
import { ManifestoSection } from "@/components/landing/manifesto-section"
import { CTASection } from "@/components/landing/cta-section"

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <ProblemSection />
        <PillarsSection />
        <ClassesPreview />
        <InstructorsSection />
        <PricingSection />
        <ManifestoSection />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
