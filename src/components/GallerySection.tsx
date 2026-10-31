import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { prefersReducedMotion } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger)

// All Unsplash images — free to use, hotlinking allowed
const galleryImages = [
  {
    src: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=960&q=85',
    alt: 'The Treasury (Al-Khazneh) at Petra, Jordan — one of the Seven Wonders of the World',
    caption: 'Al-Khazneh, Petra',
    span: 'col-span-2 row-span-2',
  },
  {
    src: 'https://images.unsplash.com/photo-1544085701-4d14e1a827e4?auto=format&fit=crop&w=640&q=80',
    alt: 'The Dead Sea shoreline with white salt crystals and calm reflective water',
    caption: 'The Dead Sea',
    span: '',
  },
  {
    src: 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?auto=format&fit=crop&w=640&q=80',
    alt: 'Wadi Rum desert landscape with towering red sandstone mountains',
    caption: 'Wadi Rum Valley',
    span: '',
  },
  {
    src: 'https://images.unsplash.com/photo-1580834341580-8c17a3a630ca?auto=format&fit=crop&w=960&q=80',
    alt: 'Ancient Roman columns at a well-preserved archaeological site in Jordan',
    caption: 'Jerash — Ancient Gerasa',
    span: 'col-span-2',
  },
  {
    src: 'https://images.unsplash.com/photo-1579273166152-d725a4e2b755?auto=format&fit=crop&w=640&q=80',
    alt: 'Amman cityscape with white limestone buildings across rolling hills at sunset',
    caption: 'Amman — The White City',
    span: '',
  },
  {
    src: 'https://images.unsplash.com/photo-1499678329028-101435549a4e?auto=format&fit=crop&w=640&q=80',
    alt: 'Crystal clear Red Sea water with vibrant coral reefs near Aqaba',
    caption: 'Aqaba — Red Sea',
    span: '',
  },
]

export function GallerySection() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef   = useRef<HTMLDivElement>(null)
  const gridRef    = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      if (titleRef.current) {
        gsap.fromTo(titleRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0, duration: 1, ease: 'power3.out',
            scrollTrigger: { trigger: titleRef.current, start: 'top 85%', once: true },
          }
        )
      }

      if (gridRef.current) {
        const items = gridRef.current.querySelectorAll('.gallery-item')
        gsap.fromTo(items,
          { opacity: 0, scale: 0.94 },
          {
            opacity: 1, scale: 1, duration: 0.9, stagger: 0.1, ease: 'power2.out',
            scrollTrigger: { trigger: gridRef.current, start: 'top 82%', once: true },
          }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className="relative py-24 md:py-32 bg-desert-900"
      aria-label="Jordan photo gallery"
    >
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(217,116,39,0.25), transparent)' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={titleRef} className="text-center mb-16 opacity-0">
          <p className="font-sans text-sandstone-500 text-xs tracking-[0.45em] uppercase mb-4">
            Visual Journey
          </p>
          <h2 className="section-title mb-4">Gallery</h2>
          <p className="font-sans text-stone-400 max-w-xl mx-auto leading-relaxed">
            A visual exploration of Jordan's most iconic landscapes, monuments, and natural wonders.
          </p>
        </div>

        {/* Masonry-style grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[220px] gap-4"
        >
          {galleryImages.map((img, i) => (
            <div
              key={i}
              className={`gallery-item opacity-0 relative overflow-hidden rounded-xl group cursor-pointer ${img.span}`}
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              {/* Hover overlay */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-desert-900/90 via-desert-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4"
                aria-hidden="true"
              >
                <p className="font-cinematic text-sandstone-200 text-base tracking-wide">
                  {img.caption}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Attribution */}
        <p className="text-center mt-8 font-sans text-stone-600 text-xs">
          Images sourced from{' '}
          <a
            href="https://unsplash.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-stone-400 transition-colors"
          >
            Unsplash
          </a>
          {' '}(Free to use under the Unsplash License)
        </p>
      </div>
    </section>
  )
}
