import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Globe, Users, Mountain, Sun } from 'lucide-react'
import { prefersReducedMotion } from '@/lib/utils'
import { JordanFlag } from './JordanFlag'

gsap.registerPlugin(ScrollTrigger)

const facts = [
  {
    icon: Globe,
    label: 'Capital',
    value: 'Amman',
    detail: 'The "White City" — built on 19 hills',
  },
  {
    icon: Users,
    label: 'Population',
    value: '10.8M',
    detail: 'A welcoming, hospitable people',
  },
  {
    icon: Mountain,
    label: 'Area',
    value: '89,342 km²',
    detail: 'From desert plains to green highlands',
  },
  {
    icon: Sun,
    label: 'Sunshine',
    value: '300+ days',
    detail: 'Ideal year-round travel destination',
  },
]

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const factsRef   = useRef<HTMLDivElement>(null)
  const flagRef    = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      if (contentRef.current) {
        gsap.fromTo(contentRef.current,
          { opacity: 0, x: -60 },
          {
            opacity: 1, x: 0, duration: 1.1, ease: 'power3.out',
            scrollTrigger: { trigger: contentRef.current, start: 'top 80%', once: true },
          }
        )
      }

      if (factsRef.current) {
        const items = factsRef.current.querySelectorAll('.fact-card')
        gsap.fromTo(items,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power2.out',
            scrollTrigger: { trigger: factsRef.current, start: 'top 82%', once: true },
          }
        )
      }

      if (flagRef.current) {
        gsap.fromTo(flagRef.current,
          { opacity: 0, x: 60 },
          {
            opacity: 1, x: 0, duration: 1.2, ease: 'power3.out',
            scrollTrigger: { trigger: flagRef.current, start: 'top 80%', once: true },
          }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-24 md:py-32 bg-desert-800 overflow-hidden"
      aria-label="About the Hashemite Kingdom of Jordan"
    >
      {/* Decorative background pattern */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(217,116,39,0.8) 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text content */}
          <div ref={contentRef} className="opacity-0">
            <p className="font-sans text-sandstone-500 text-xs tracking-[0.45em] uppercase mb-4">
              About The Kingdom
            </p>
            <h2 className="section-title mb-8">
              The Heart of<br />the Middle East
            </h2>

            <div className="space-y-5 font-sans text-stone-300 leading-relaxed">
              <p>
                Jordan is a land of staggering contrasts — where ancient civilisations have left
                their mark on the landscape for thousands of years. From the Roman theatres of
                Jerash to the Crusader castles of Karak, every stone tells a story.
              </p>
              <p>
                The Hashemite Kingdom of Jordan has long been a beacon of stability and
                hospitality in the region. Its people, known across the Arab world for their
                warmth and generosity, have welcomed travellers since ancient caravans first
                crossed the desert along the King's Highway.
              </p>
              <p>
                Jordan is home to <strong className="text-sandstone-300">three UNESCO World Heritage
                Sites</strong> — Petra, Wadi Rum, and As-Salt — along with more than 100,000
                archaeological, religious, and touristic sites.
              </p>
            </div>

            {/* Jordan facts grid */}
            <div ref={factsRef} className="grid grid-cols-2 gap-4 mt-10">
              {facts.map(({ icon: Icon, label, value, detail }) => (
                <div
                  key={label}
                  className="fact-card opacity-0 p-5 rounded-xl border border-white/6 bg-desert-900/60 hover:border-sandstone-700/40 transition-colors"
                >
                  <Icon size={20} className="text-sandstone-500 mb-3" />
                  <p className="font-sans text-xs text-stone-500 tracking-widest uppercase mb-1">{label}</p>
                  <p className="font-cinematic text-xl text-sandstone-300">{value}</p>
                  <p className="font-sans text-xs text-stone-500 mt-1">{detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Flag + visual */}
          <div ref={flagRef} className="opacity-0 flex flex-col items-center gap-8">
            {/* Flag */}
            <div className="relative">
              <div
                className="absolute -inset-4 rounded-xl opacity-20 blur-2xl"
                aria-hidden="true"
                style={{ background: 'radial-gradient(ellipse, #d97427 0%, transparent 70%)' }}
              />
              <JordanFlag
                variant="full"
                height={220}
                className="relative shadow-2xl rounded-sm"
              />
            </div>

            {/* Caption */}
            <div className="text-center max-w-xs">
              <h3 className="font-cinematic text-2xl text-sandstone-300 mb-3">
                The Hashemite Kingdom
              </h3>
              <p className="font-sans text-stone-400 text-sm leading-relaxed">
                The red triangle and seven-pointed white star represent the seven verses of
                Al-Fatiha and unity across the Hashemite lineage. The three horizontal
                bands — black, white, and green — honour the Arab Revolt.
              </p>
            </div>

            {/* UNESCO badges */}
            <div className="flex flex-wrap gap-3 justify-center">
              {['Petra — UNESCO WHS', 'Wadi Rum — UNESCO WHS', 'As-Salt — UNESCO WHS'].map(site => (
                <span
                  key={site}
                  className="text-[10px] font-sans tracking-widest uppercase px-3 py-1.5 rounded-sm border border-sandstone-800/60 text-sandstone-600"
                >
                  {site}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
