import { useEffect, useRef, useState } from 'react'
import { scrollToSection, prefersReducedMotion } from '@/lib/utils'
import { Compass, MapPin, Sparkles, ArrowRight } from 'lucide-react'
import './tilted-grid-hero.css'

interface LandmarkItem {
  id: string
  title: string
  arabicTitle: string
  location: string
  tag: string
  imageUrl: string
  accentColor?: string
}

const COLUMN_1: LandmarkItem[] = [
  {
    id: 'petra-treasury',
    title: 'The Treasury (Al-Khazneh)',
    arabicTitle: 'الخزنة — البتراء',
    location: 'Petra, Ma\'an',
    tag: 'Wonder of the World',
    imageUrl: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'ajloun-castle',
    title: 'Ajloun Fortress',
    arabicTitle: 'قلعة عجلون',
    location: 'Ajloun Highlands',
    tag: 'Ayyubid Heritage',
    imageUrl: 'https://images.unsplash.com/photo-1596392927852-2a18c336d5eb?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'dead-sea-shore',
    title: 'The Dead Sea',
    arabicTitle: 'شواطئ البحر الميت',
    location: 'Jordan Valley',
    tag: 'Lowest Point on Earth',
    imageUrl: 'https://images.unsplash.com/photo-1544085701-4d14e1a827e4?auto=format&fit=crop&w=800&q=80',
  },
]

const COLUMN_2: LandmarkItem[] = [
  {
    id: 'wadi-rum-valley',
    title: 'Wadi Rum Desert',
    arabicTitle: 'وادي رم — وادي القمر',
    location: 'Southern Desert',
    tag: 'UNESCO Wilderness',
    imageUrl: 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'jerash-cardo',
    title: 'Jerash Colonnade',
    arabicTitle: 'أعمدة جرش الأثرية',
    location: 'Jerash Governorate',
    tag: 'Greco-Roman Decapolis',
    imageUrl: 'https://images.unsplash.com/photo-1580834341580-8c17a3a630ca?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'madaba-mosaics',
    title: 'Madaba Mosaic City',
    arabicTitle: 'فسيفساء مادبا',
    location: 'Madaba Plateau',
    tag: 'Byzantine Art',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80',
  },
]

const COLUMN_3: LandmarkItem[] = [
  {
    id: 'amman-citadel',
    title: 'Amman Citadel',
    arabicTitle: 'جبل القلعة — عمّان',
    location: 'Capital Highlands',
    tag: 'Ancient & Modern',
    imageUrl: 'https://images.unsplash.com/photo-1579273166152-d725a4e2b755?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'aqaba-redsea',
    title: 'Aqaba Gulf & Coral',
    arabicTitle: 'خليج العقبة والبحر الأحمر',
    location: 'Gulf of Aqaba',
    tag: 'Coastal & Diving',
    imageUrl: 'https://images.unsplash.com/photo-1499678329028-101435549a4e?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'petra-night',
    title: 'Wadi Rum Dunes',
    arabicTitle: 'كثبان رم الذهبية',
    location: 'Aqaba Governorate',
    tag: 'Desert Sunsets',
    imageUrl: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80',
  },
]

export function TiltedGridHero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  /* ── Interactive 3D tilt tracking (strictly scoped to this section) ── */
  useEffect(() => {
    if (prefersReducedMotion()) return

    const container = containerRef.current
    if (!container) return

    let animationFrameId: number | null = null

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      // Normalize -1 to 1 based on mouse position relative to container
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const y = ((e.clientY - rect.top) / rect.height) * 2 - 1

      if (animationFrameId) cancelAnimationFrame(animationFrameId)
      animationFrameId = requestAnimationFrame(() => {
        setMousePos({
          x: Math.max(-1, Math.min(1, x)),
          y: Math.max(-1, Math.min(1, y)),
        })
      })
    }

    const handleMouseLeave = () => {
      setMousePos({ x: 0, y: 0 })
    }

    container.addEventListener('mousemove', handleMouseMove, { passive: true })
    container.addEventListener('mouseleave', handleMouseLeave, { passive: true })

    return () => {
      container.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('mouseleave', handleMouseLeave)
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
    }
  }, [])

  // Calculate subtle dynamic rotation delta
  const rotX = 16 - mousePos.y * 6
  const rotY = 6 + mousePos.x * 6
  const rotZ = -9 + mousePos.x * 2

  return (
    <section
      id="gallery"
      ref={containerRef}
      className="tilted-grid-hero-container py-24 lg:py-32 text-stone-100"
      aria-label="Jordan photo gallery and destinations showcase"
    >
      <div className="tgh-ambient-glow" aria-hidden="true" />
      <div className="tgh-vignette" aria-hidden="true" />

      {/* ── Section Header (Editorial & Premium Gallery Header) ── */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sandstone-900/60 border border-sandstone-500/30 text-sandstone-300 text-xs font-sans tracking-widest uppercase mb-5 backdrop-blur-sm shadow-md">
          <Sparkles size={13} className="text-sandstone-400" />
          <span>Visual Journey • معرض الصور والروائع الأردنية</span>
        </div>

        <h2 className="section-title mb-4">
          Jordan Gallery
        </h2>

        <p className="font-sans text-stone-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          A cinematic visual exploration of Jordan's most iconic landscapes, monuments, and timeless sanctuaries.
          Move your cursor to interact with the 3D gallery showcase.
        </p>

        {/* Action Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-7">
          <button
            onClick={() => scrollToSection('destinations')}
            className="btn-primary py-2.5 px-6 rounded-full text-xs font-sans tracking-widest flex items-center gap-2"
          >
            <span>Explore All Destinations</span>
            <Compass size={14} />
          </button>
          <button
            onClick={() => scrollToSection('about')}
            className="btn-secondary py-2 px-5 rounded-full text-xs font-sans tracking-widest flex items-center gap-2"
          >
            <span>About The Kingdom</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>

      {/* ── 3D Tilted Grid Stage ── */}
      <div className="tgh-grid-viewport">
        <div
          ref={stageRef}
          className="tgh-grid-stage"
          style={{
            transform: `rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg) translateY(-2%)`,
          }}
        >
          {/* Column 1 */}
          <div className="tgh-column tgh-col-drift-up">
            {COLUMN_1.map((item) => (
              <LandmarkCard key={item.id} item={item} />
            ))}
          </div>

          {/* Column 2 */}
          <div className="tgh-column tgh-col-drift-down">
            {COLUMN_2.map((item) => (
              <LandmarkCard key={item.id} item={item} />
            ))}
          </div>

          {/* Column 3 */}
          <div className="tgh-column tgh-col-drift-up-alt">
            {COLUMN_3.map((item) => (
              <LandmarkCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function LandmarkCard({ item }: { item: LandmarkItem }) {
  return (
    <article
      onClick={() => scrollToSection('destinations')}
      className="tgh-card group"
      aria-label={`${item.title} - ${item.location}`}
    >
      <img
        src={item.imageUrl}
        alt={item.title}
        loading="lazy"
        decoding="async"
        className="tgh-card-img"
      />
      <div className="tgh-card-overlay" />
      <span className="tgh-card-badge">{item.tag}</span>

      <div className="tgh-card-content">
        <span className="font-sans text-[11px] text-sandstone-400 font-medium tracking-wider uppercase block mb-1">
          {item.arabicTitle}
        </span>
        <h3 className="font-cinematic text-lg sm:text-xl text-white font-normal leading-snug group-hover:text-sandstone-300 transition-colors">
          {item.title}
        </h3>
        <p className="font-sans text-[11px] text-stone-400 flex items-center gap-1 mt-1">
          <MapPin size={11} className="text-sandstone-500 shrink-0" />
          <span>{item.location}</span>
        </p>
      </div>
    </article>
  )
}
