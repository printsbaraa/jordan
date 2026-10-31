import { Navigation }          from '@/components/Navigation'
import { ParallaxHero }        from '@/components/ParallaxHero'
import { DestinationsSection } from '@/components/DestinationsSection'
import { AboutSection }        from '@/components/AboutSection'
import { TiltedGridHero }       from '@/components/ui/tilted-grid-hero'
import { Footer }              from '@/components/Footer'
import { useSmoothScroll }     from '@/hooks/useSmoothScroll'

export function HomePage() {
  // Initialize Lenis smooth scroll + GSAP ScrollTrigger integration
  useSmoothScroll()

  return (
    <div className="min-h-screen bg-desert-900">
      {/* Skip to main content — accessibility */}
      <a
        href="#destinations"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-[9999] focus:bg-sandstone-600 focus:text-white focus:px-4 focus:py-2 focus:rounded"
      >
        Skip to main content
      </a>

      {/* Fixed navigation bar */}
      <Navigation />

      <main>
        {/* Section 1: Cinematic parallax hero — UNCHANGED */}
        <ParallaxHero />

        {/* Section 2: Destinations grid */}
        <DestinationsSection />

        {/* Section 3: About Jordan */}
        <AboutSection />

        {/* Section 4: Interactive Tilted Grid Gallery (Replaces standard gallery) */}
        <TiltedGridHero />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
