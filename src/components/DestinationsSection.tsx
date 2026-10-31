import { useEffect, useRef, useState } from 'react'
import { MapPin, ChevronRight, Star } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { cn, prefersReducedMotion } from '@/lib/utils'
import { destinations, type Destination } from '@/data/destinations'

gsap.registerPlugin(ScrollTrigger)

type CategoryFilter = 'all' | Destination['category']

const categoryLabels: Record<CategoryFilter, string> = {
  all:      'All',
  ancient:  'Ancient Sites',
  nature:   'Nature',
  city:     'Cities',
  coastal:  'Coastal',
  heritage: 'Heritage',
}

export function DestinationsSection() {
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('all')
  const sectionRef  = useRef<HTMLElement>(null)
  const titleRef    = useRef<HTMLDivElement>(null)
  const gridRef     = useRef<HTMLDivElement>(null)

  const filtered = activeFilter === 'all'
    ? destinations
    : destinations.filter(d => d.category === activeFilter)

  /* ─── Scroll entrance animations ─── */
  useEffect(() => {
    if (prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      // Title fade-in
      if (titleRef.current) {
        gsap.fromTo(titleRef.current,
          { opacity: 0, y: 50 },
          {
            opacity: 1, y: 0, duration: 1, ease: 'power3.out',
            scrollTrigger: { trigger: titleRef.current, start: 'top 85%', once: true },
          }
        )
      }

      // Cards stagger on scroll
      if (gridRef.current) {
        const cards = gridRef.current.querySelectorAll('.destination-card')
        gsap.fromTo(cards,
          { opacity: 0, y: 60, scale: 0.96 },
          {
            opacity: 1, y: 0, scale: 1,
            duration: 0.85,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: { trigger: gridRef.current, start: 'top 80%', once: true },
          }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [activeFilter]) // re-run when filter changes

  return (
    <section
      id="destinations"
      ref={sectionRef}
      className="relative py-24 md:py-32 bg-desert-900"
      aria-label="Explore Jordan's destinations"
    >
      {/* Subtle top border */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(217,116,39,0.3), transparent)' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={titleRef} className="text-center mb-16 opacity-0">
          <p className="font-sans text-sandstone-500 text-xs tracking-[0.45em] uppercase mb-4">
            The Kingdom Awaits
          </p>
          <h2 className="section-title mb-6">Explore Jordan</h2>
          <p className="font-sans text-stone-400 text-lg max-w-2xl mx-auto leading-relaxed">
            From the rose-red city of Petra to the lunar landscape of Wadi Rum, Jordan's diverse
            landscapes and rich history offer experiences unlike anywhere on Earth.
          </p>

          {/* Decorative divider */}
          <div
            aria-hidden="true"
            className="flex items-center justify-center gap-3 mt-8"
          >
            <div className="h-px w-16 bg-sandstone-700" />
            <Star size={14} className="text-sandstone-500" fill="currentColor" />
            <div className="h-px w-16 bg-sandstone-700" />
          </div>
        </div>

        {/* Category filters */}
        <div
          className="flex flex-wrap justify-center gap-2 mb-12"
          role="group"
          aria-label="Filter destinations by category"
        >
          {(Object.keys(categoryLabels) as CategoryFilter[]).map(cat => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={cn(
                'px-5 py-2 text-xs tracking-widest uppercase font-sans rounded-sm transition-all duration-200 border',
                activeFilter === cat
                  ? 'bg-sandstone-600 text-white border-sandstone-600 shadow-lg shadow-sandstone-900/40'
                  : 'bg-transparent text-stone-400 border-white/10 hover:border-sandstone-700/50 hover:text-stone-200'
              )}
              aria-pressed={activeFilter === cat}
            >
              {categoryLabels[cat]}
            </button>
          ))}
        </div>

        {/* Destination Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
        >
          {filtered.map(destination => (
            <DestinationCard key={destination.id} destination={destination} />
          ))}
        </div>

        {/* Map callout */}
        <div className="mt-20 text-center">
          <div className="inline-flex flex-col items-center gap-4 p-8 rounded-xl border border-white/8 bg-desert-800/50">
            <MapPin size={28} className="text-sandstone-500" />
            <h3 className="font-cinematic text-2xl text-sandstone-200">Interactive Map</h3>
            <p className="font-sans text-stone-400 text-sm max-w-sm leading-relaxed">
              An interactive map with geographically accurate city markers and detailed destination
              panels is planned for a future release.
            </p>
            <div className="text-xs font-sans tracking-widest text-sandstone-600/70 uppercase border border-sandstone-800 px-4 py-1.5 rounded-sm">
              Coming Soon
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Individual destination card ── */
function DestinationCard({ destination: d }: { destination: Destination }) {
  const [imgError, setImgError] = useState(false)

  return (
    <article
      className="destination-card group"
      aria-label={`${d.name} — ${d.region}`}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {imgError ? (
          <div
            className="absolute inset-0 bg-desert-700 flex items-center justify-center"
            aria-label={`Image unavailable for ${d.name}`}
          >
            <MapPin size={32} className="text-sandstone-600" />
          </div>
        ) : (
          <img
            src={d.imageUrl}
            alt={d.imageAlt}
            loading="lazy"
            decoding="async"
            onError={() => setImgError(true)}
            className="card-img absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="card-overlay" aria-hidden="true" />

        {/* Category badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className="text-[10px] font-sans tracking-widest uppercase px-2.5 py-1 rounded-sm bg-black/60 text-sandstone-300 backdrop-blur-sm">
            {categoryLabels[d.category]}
          </span>
        </div>

        {/* Featured indicator */}
        {d.featured && (
          <div className="absolute top-3 right-3 z-10">
            <Star size={14} className="text-sandstone-400" fill="currentColor" aria-label="Featured destination" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h3 className="font-cinematic text-xl text-sandstone-200 leading-tight group-hover:text-white transition-colors">
              {d.name}
            </h3>
            <p className="font-sans text-sandstone-600 text-xs mt-0.5 tracking-wider">
              {d.arabicName}
            </p>
          </div>
          <MapPin size={14} className="text-sandstone-600 mt-1 shrink-0" />
        </div>

        <p className="font-sans text-stone-400 text-sm leading-relaxed line-clamp-3 mb-4">
          {d.description}
        </p>

        {/* Highlights preview */}
        <ul className="space-y-1 mb-5">
          {d.highlights.slice(0, 2).map(h => (
            <li key={h} className="flex items-center gap-2 text-xs text-stone-500 font-sans">
              <ChevronRight size={10} className="text-sandstone-700 shrink-0" />
              {h}
            </li>
          ))}
        </ul>

        {/* Region tag */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] tracking-wider uppercase text-stone-600 font-sans">
            {d.region}
          </span>
          <button
            className="text-sandstone-500 hover:text-sandstone-300 transition-colors text-xs font-sans tracking-widest uppercase flex items-center gap-1 border-none bg-transparent cursor-pointer"
            aria-label={`Learn more about ${d.name}`}
            onClick={() => {
              // Future: navigate to detail page
              window.alert(`Detailed page for ${d.name} is coming soon!`)
            }}
          >
            Explore
            <ChevronRight size={11} />
          </button>
        </div>
      </div>
    </article>
  )
}
