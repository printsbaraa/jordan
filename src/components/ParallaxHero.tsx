import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ChevronDown } from 'lucide-react'
import { prefersReducedMotion, scrollToSection } from '@/lib/utils'
import { JordanFlag } from './JordanFlag'

gsap.registerPlugin(ScrollTrigger)

// ── Unsplash (free to use, hotlinking allowed) ──────────────────
const LAYERS = {
  // Layer 1: Wadi Rum desert mountains – distant sky background
  sky: 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?auto=format&fit=crop&w=1920&q=80',
  // Layer 2: Petra Treasury – primary landmark, mid-ground
  petra: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=1920&q=85',
  // Layer 3: Jordan desert dunes – foreground layer
  dunes: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1920&q=75',
}

interface ParallaxHeroProps {
  onExploreClick?: () => void
}

export function ParallaxHero({ onExploreClick }: ParallaxHeroProps) {
  const containerRef   = useRef<HTMLDivElement>(null)
  const layer1Ref      = useRef<HTMLDivElement>(null)   // sky/mountains (slowest)
  const layer2Ref      = useRef<HTMLDivElement>(null)   // petra (medium)
  const layer3Ref      = useRef<HTMLDivElement>(null)   // dunes/flag (faster)
  const contentRef     = useRef<HTMLDivElement>(null)   // text (subtle)
  const titleRef       = useRef<HTMLHeadingElement>(null)
  const subtitleRef    = useRef<HTMLParagraphElement>(null)
  const ctaRef         = useRef<HTMLDivElement>(null)

  /* ─── GSAP parallax on scroll ─── */
  useEffect(() => {
    const reduced = prefersReducedMotion()
    if (reduced) return

    const ctx = gsap.context(() => {
      const container = containerRef.current
      if (!container) return

      // Layer 1 – sky: moves up slowly  (parallax factor ~0.3)
      if (layer1Ref.current) {
        gsap.to(layer1Ref.current, {
          yPercent: -25,
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.2,
          },
        })
      }

      // Layer 2 – petra: moves at medium speed (factor ~0.5)
      if (layer2Ref.current) {
        gsap.to(layer2Ref.current, {
          yPercent: -45,
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.5,
          },
        })
      }

      // Layer 3 – dunes: moves slightly faster (factor ~0.7)
      if (layer3Ref.current) {
        gsap.to(layer3Ref.current, {
          yPercent: -18,
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.8,
          },
        })
      }

      // Content – very subtle lift (factor ~0.15)
      if (contentRef.current) {
        gsap.to(contentRef.current, {
          yPercent: -12,
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            start: 'top top',
            end: 'bottom top',
            scrub: 2,
          },
        })
      }
    }, containerRef)

    return () => ctx.revert()
  }, [])

  /* ─── Entrance animations ─── */
  useEffect(() => {
    const reduced = prefersReducedMotion()

    const els = [titleRef.current, subtitleRef.current, ctaRef.current].filter(Boolean)

    if (reduced) {
      gsap.set(els, { opacity: 1, y: 0 })
      return
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        els,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.4,
          stagger: 0.22,
          ease: 'power3.out',
          delay: 0.5,
        }
      )
    })

    return () => ctx.revert()
  }, [])

  function handleExplore() {
    if (onExploreClick) {
      onExploreClick()
    } else {
      scrollToSection('destinations')
    }
  }

  return (
    <section
      id="hero"
      ref={containerRef}
      className="parallax-hero"
      aria-label="Welcome to Jordan — cinematic hero section"
      data-parallax-layers="4"
    >
      {/* ── Layer 1: Sky / Wadi Rum mountains (distant) ── */}
      <div
        ref={layer1Ref}
        className="parallax-layer"
        data-parallax-layer="1"
        aria-hidden="true"
        style={{ zIndex: 1 }}
      >
        <img
          src={LAYERS.sky}
          alt=""
          aria-hidden="true"
          loading="eager"
          decoding="sync"
          fetchPriority="high"
          style={{
            filter: 'brightness(0.55) saturate(0.85) sepia(0.25)',
            objectPosition: 'center 30%',
          }}
        />
      </div>

      {/* ── Layer 2: Petra Treasury (primary landmark) ── */}
      <div
        ref={layer2Ref}
        className="parallax-layer"
        data-parallax-layer="2"
        aria-hidden="true"
        style={{ zIndex: 2 }}
      >
        <img
          src={LAYERS.petra}
          alt="Petra's Treasury — the iconic Nabataean monument carved into rose-red sandstone"
          loading="eager"
          decoding="sync"
          style={{
            filter: 'brightness(0.65) saturate(0.9) sepia(0.2)',
            objectPosition: 'center 20%',
            mixBlendMode: 'normal',
          }}
        />
      </div>

      {/* ── Layer 3: Foreground dunes ── */}
      <div
        ref={layer3Ref}
        className="parallax-layer"
        data-parallax-layer="3"
        aria-hidden="true"
        style={{ zIndex: 3 }}
      >
        <img
          src={LAYERS.dunes}
          alt=""
          aria-hidden="true"
          loading="eager"
          style={{
            filter: 'brightness(0.35) saturate(0.7)',
            objectPosition: 'center bottom',
          }}
        />
      </div>

      {/* ── Jordan flag stripe overlay (decorative) ── */}
      <div
        className="flag-stripe"
        style={{ top: '25%', zIndex: 4 }}
        aria-hidden="true"
      >
        <JordanFlag variant="stripe" />
      </div>

      {/* ── Atmospheric gradient overlay ── */}
      <div className="parallax-overlay" aria-hidden="true" style={{ zIndex: 5 }} />

      {/* ── Bottom vignette for text readability ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 6,
          background: 'linear-gradient(to top, rgba(26,18,9,0.97) 0%, rgba(26,18,9,0.6) 22%, transparent 55%)',
          pointerEvents: 'none',
        }}
      />

      {/* ── Layer 4: Content (title / subtitle / CTA) ── */}
      <div
        ref={contentRef}
        className="hero-content"
        data-parallax-layer="4"
        style={{ zIndex: 20 }}
      >
        {/* Decorative rule */}
        <div
          aria-hidden="true"
          className="w-px h-16 bg-gradient-to-b from-transparent to-sandstone-500/60 mb-6"
        />

        {/* Eyebrow */}
        <p className="font-sans text-sandstone-400/80 text-xs tracking-[0.45em] uppercase mb-4 select-none">
          The Hashemite Kingdom of Jordan
        </p>

        {/* Main title */}
        <h1
          ref={titleRef}
          className="font-cinematic text-white font-light leading-none mb-4 select-none opacity-0"
          style={{
            fontSize: 'clamp(2.8rem, 9vw, 8rem)',
            letterSpacing: '0.06em',
            textShadow: '0 4px 40px rgba(0,0,0,0.6)',
          }}
        >
          <span className="block text-sandstone-200/90 text-[0.45em] tracking-[0.55em] font-light mb-3">
            WELCOME TO
          </span>
          <span className="block bg-gradient-to-r from-sandstone-200 via-white to-sandstone-300 bg-clip-text text-transparent">
            JORDAN
          </span>
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="font-sans text-sandstone-300/70 tracking-[0.55em] text-xs md:text-sm uppercase mb-10 select-none opacity-0"
        >
          EXPLORE&nbsp;&nbsp;•&nbsp;&nbsp;DISCOVER&nbsp;&nbsp;•&nbsp;&nbsp;EXPERIENCE
        </p>

        {/* Flag stripe decoration */}
        <div
          aria-hidden="true"
          className="flex items-center gap-0 mb-10 overflow-hidden rounded-sm"
          style={{ height: '3px', width: '120px' }}
        >
          <div style={{ flex: 1, height: '100%', background: '#007A3D' }} />
          <div style={{ flex: 1, height: '100%', background: '#FFFFFF' }} />
          <div style={{ flex: 1, height: '100%', background: '#CE1126' }} />
          <div style={{ flex: 1, height: '100%', background: '#000000' }} />
        </div>

        {/* CTA Button */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row items-center gap-4 opacity-0">
          <button
            onClick={handleExplore}
            className="btn-primary"
            aria-label="Explore Jordan — scroll to destinations"
          >
            <span>EXPLORE JORDAN</span>
            <ChevronDown size={16} strokeWidth={2} />
          </button>
        </div>

        {/* Scroll indicator */}
        <button
          onClick={handleExplore}
          className="scroll-indicator mt-12 flex flex-col items-center gap-2 text-white/40 hover:text-white/70 transition-colors cursor-pointer border-none bg-transparent"
          aria-label="Scroll to explore destinations"
        >
          <span className="text-[10px] tracking-[0.4em] uppercase font-sans">Scroll</span>
          <ChevronDown size={16} strokeWidth={1.5} />
        </button>
      </div>
    </section>
  )
}
